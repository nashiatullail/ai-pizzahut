"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { recipes, type Recipe } from "@/lib/recipes";
import { playFlipSound } from "@/lib/sound";

const PAGE_SIZE = 2;
const pages: Recipe[][] = [];
for (let i = 0; i < recipes.length; i += PAGE_SIZE) {
  pages.push(recipes.slice(i, i + PAGE_SIZE));
}

export default function MenuBook({
  activeId,
  onSelectRecipe,
}: {
  activeId: string | null;
  onSelectRecipe: (r: Recipe) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll to + flash the active recipe's page when chatbot picks one
  useEffect(() => {
    if (!activeId || !open) return;
    const pageOf = pages.findIndex((p) => p.some((r) => r.id === activeId));
    if (pageOf !== -1 && pageOf !== pageIndex) {
      setDirection(pageOf > pageIndex ? "next" : "prev");
      setPageIndex(pageOf);
      playFlipSound();
    }
    const el = cardRefs.current[activeId];
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 400);
    }
  }, [activeId, open]); // eslint-disable-line react-hooks/exhaustive-deps

  function goNext() {
    if (pageIndex < pages.length - 1) {
      playFlipSound();
      setDirection("next");
      setPageIndex((p) => p + 1);
    }
  }
  function goPrev() {
    if (pageIndex > 0) {
      playFlipSound();
      setDirection("prev");
      setPageIndex((p) => p - 1);
    }
  }

  return (
    <div className="flex flex-col items-center py-16 perspective-1500">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ rotateY: -110, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={() => {
              playFlipSound();
              setOpen(true);
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-72 h-96 bg-gradient-to-br from-gold to-yellow-700 rounded-xl shadow-2xl flex items-center justify-center font-serif text-3xl text-charcoal border-4 border-gold/40"
          >
            📖 Open Menu
          </motion.button>
        ) : (
          <motion.div
            key="book"
            initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full max-w-3xl bg-cream text-charcoal rounded-2xl shadow-2xl p-8 min-h-[420px]"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={pageIndex}
                custom={direction}
                initial={{
                  rotateY: direction === "next" ? 90 : -90,
                  opacity: 0,
                }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{
                  rotateY: direction === "next" ? -90 : 90,
                  opacity: 0,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d", transformOrigin: "left center" }}
                className="grid md:grid-cols-2 gap-6"
              >
                {pages[pageIndex].map((r) => (
                  <div
                    key={r.id}
                    ref={(el) => (cardRefs.current[r.id] = el)}
                    onClick={() => onSelectRecipe(r)}
                    className={`border-b border-charcoal/10 pb-4 cursor-pointer rounded-lg p-2 transition ${
                      activeId === r.id
                        ? "bg-gold/20 ring-2 ring-gold"
                        : "hover:bg-gold/5"
                    }`}
                  >
                    <h3 className="font-serif text-xl text-yellow-800">{r.name}</h3>
                    <p className="text-sm text-charcoal/70 mt-1">{r.description}</p>
                    <div className="text-xs mt-2 text-charcoal/50">
                      {r.calories} kcal · {r.protein}g protein · {r.carbs}g carbs
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={goPrev}
                disabled={pageIndex === 0}
                className="px-4 py-2 text-sm rounded-full bg-charcoal/10 disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="text-xs text-charcoal/50">
                Page {pageIndex + 1} / {pages.length}
              </span>
              <button
                onClick={goNext}
                disabled={pageIndex === pages.length - 1}
                className="px-4 py-2 text-sm rounded-full bg-charcoal/10 disabled:opacity-30"
              >
                Next →
              </button>
            </div>

            <button
              onClick={() => {
                playFlipSound();
                setOpen(false);
              }}
              className="absolute top-4 right-6 text-xs text-charcoal/40 underline"
            >
              Close menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}