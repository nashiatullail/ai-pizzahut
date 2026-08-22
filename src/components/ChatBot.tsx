"use client";
import { useState } from "react";
import type { Recipe } from "@/lib/recipes";

type Message = { role: "user" | "bot"; text: string; matchedIds?: string[] };

export default function ChatBot({
  recipes,
  onHighlight,
}: {
  recipes: Recipe[];
  onHighlight: (r: Recipe) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! Ask me for a dish — e.g. 'high protein low carb dinner'." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      const matched: Recipe[] = (data.sources ?? [])
        .map((name: string) => recipes.find((r) => r.name === name))
        .filter(Boolean);

      setMessages((m) => [
        ...m,
        { role: "bot", text: data.reply ?? "Sorry, no reply.", matchedIds: matched.map((r) => r.id) },
      ]);

      if (matched[0]) onHighlight(matched[0]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Error reaching kitchen AI 🙈" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-charcoal border border-gold/30 rounded-2xl shadow-xl flex flex-col overflow-hidden z-50">
      <div className="bg-gold text-charcoal px-4 py-2 font-semibold">
        🍽️ Nutrition Assistant
      </div>
      <div className="flex-1 max-h-80 overflow-y-auto p-3 space-y-2 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[85%] ${
              m.role === "user" ? "bg-gold/20 ml-auto text-right" : "bg-cream/10"
            }`}
          >
            {m.text}
            {m.matchedIds && m.matchedIds.length > 0 && (
              <div className="text-[10px] text-gold/70 mt-1">
                📍 Highlighted in menu
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-cream/50 text-xs">Thinking...</div>}
      </div>
      <div className="flex border-t border-gold/20">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about a dish..."
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-cream"
        />
        <button onClick={sendMessage} className="px-4 bg-gold text-charcoal font-semibold">
          Send
        </button>
      </div>
    </div>
  );
}