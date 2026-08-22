import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import { recipes } from "../src/lib/recipes";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY missing in .env.local");
}

async function embedText(text: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: { parts: [{ text }] },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.embedding.values;
}

async function main() {
  const embeddings: { id: string; vector: number[] }[] = [];

  for (const r of recipes) {
    const input = `${r.name}. ${r.description}. Tags: ${r.tags.join(
      ", "
    )}. Ingredients: ${r.ingredients.join(", ")}`;

    const vector = await embedText(input);
    embeddings.push({ id: r.id, vector });
    console.log("✅ Embedded:", r.name);
  }

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(
    "data/recipe-embeddings.json",
    JSON.stringify(embeddings, null, 2)
  );
  console.log("🎉 Done → data/recipe-embeddings.json");
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});