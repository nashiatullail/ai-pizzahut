import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { recipes, type Recipe } from "@/lib/recipes";

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("❌ API key not found");
      return NextResponse.json(
        { error: "API key not configured. Please add GEMINI_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    // Safe parse the incoming request body
    let message: string;
    try {
      const body = await req.json();
      message = body.message;
    } catch (e) {
      console.error("❌ Failed to parse request body:", e);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // 1. Embed the user query via REST
    const embedResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text: message }] },
        }),
      }
    );

    const embedRawText = await embedResponse.text();
    console.log("🔍 Embed response status:", embedResponse.status);
    console.log("🔍 Embed response body:", embedRawText.slice(0, 500));

    if (!embedResponse.ok) {
      console.error("❌ Gemini Embedding Error:", embedResponse.status, embedRawText);
      return NextResponse.json(
        { error: "Embedding request failed. Check your API key.", detail: embedRawText },
        { status: 500 }
      );
    }

    if (!embedRawText || embedRawText.trim().length === 0) {
      console.error("❌ Embedding response was empty");
      return NextResponse.json({ error: "Embedding response was empty" }, { status: 500 });
    }

    let embedData: any;
    try {
      embedData = JSON.parse(embedRawText);
    } catch (e) {
      console.error("❌ Embed response wasn't valid JSON:", embedRawText);
      return NextResponse.json({ error: "Embedding response invalid" }, { status: 500 });
    }

    const queryVector: number[] = embedData.embedding?.values;
    if (!queryVector) {
      console.error("❌ No embedding values returned:", embedData);
      return NextResponse.json({ error: "Embedding failed — no vector returned" }, { status: 500 });
    }

    // 2. Load precomputed recipe embeddings
    const embeddingsPath = path.join(process.cwd(), "data", "recipe-embeddings.json");

    if (!fs.existsSync(embeddingsPath)) {
      console.error("❌ recipe-embeddings.json not found at:", embeddingsPath);
      return NextResponse.json(
        { error: "Recipe embeddings not found. Run 'npm run embed' first." },
        { status: 500 }
      );
    }

    const rawStored = fs.readFileSync(embeddingsPath, "utf-8");

if (!rawStored || rawStored.trim().length === 0) {
  console.error("❌ recipe-embeddings.json is empty");
  return NextResponse.json(
    { error: "Recipe embeddings file is empty. Run 'npm run embed' again." },
    { status: 500 }
  );
}

let stored: { id: string; vector: number[] }[];
try {
  stored = JSON.parse(rawStored);
} catch (e) {
  console.error("❌ recipe-embeddings.json is corrupted:", rawStored.slice(0, 200));
  return NextResponse.json(
    { error: "Recipe embeddings file is corrupted. Run 'npm run embed' again." },
    { status: 500 }
  );
}

    // 3. Rank by similarity, take top 3
    const ranked = stored
      .map((item) => ({
        id: item.id,
        score: cosineSimilarity(queryVector, item.vector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const contextRecipes = ranked
      .map((r) => recipes.find((rec: Recipe) => rec.id === r.id))
      .filter(Boolean);

    const context = contextRecipes
      .map(
        (r) =>
          `- ${r!.name}: ${r!.description} | Calories: ${r!.calories}, Protein: ${r!.protein}g, Carbs: ${r!.carbs}g, Fat: ${r!.fat}g | Ingredients: ${r!.ingredients.join(", ")}`
      )
      .join("\n");

    const prompt = `You are a friendly hotel nutrition assistant. Only recommend dishes from the CONTEXT below. If nothing fits, say so politely and suggest the closest option. Keep answers short and appetizing.

CONTEXT:
${context}

USER QUESTION: ${message}`;

    // 4. Chat completion via REST
    const chatResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    const chatRawText = await chatResponse.text();
    console.log("🔍 Chat response status:", chatResponse.status);
    console.log("🔍 Chat response body:", chatRawText.slice(0, 500));

    if (!chatResponse.ok) {
      console.error("❌ Gemini Chat Error:", chatResponse.status, chatRawText);
      return NextResponse.json(
        { error: "Chat request failed. Check your API key.", detail: chatRawText },
        { status: 500 }
      );
    }

    if (!chatRawText || chatRawText.trim().length === 0) {
      console.error("❌ Chat response was empty");
      return NextResponse.json({ error: "Chat response was empty" }, { status: 500 });
    }

    let chatData: any;
    try {
      chatData = JSON.parse(chatRawText);
    } catch (e) {
      console.error("❌ Chat response wasn't valid JSON:", chatRawText);
      return NextResponse.json({ error: "Chat response invalid" }, { status: 500 });
    }

    const reply =
      chatData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no reply generated.";

    return NextResponse.json({ reply, sources: contextRecipes.map((r) => r!.name) });
  } catch (error: any) {
    console.error("❌ Analysis error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again.", detail: error.message },
      { status: 500 }
    );
  }
}