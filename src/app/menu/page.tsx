"use client";
import { useRef, useState } from "react";
import CinematicMenu from "@/components/CinematicMenu";
import ChatBot from "@/components/ChatBot";
import { recipes, type Recipe } from "@/lib/recipes";

export default function MenuPage() {
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function handleHighlight(r: Recipe) {
    setActiveRecipe(r);
    const el = sectionRefs.current[r.id];
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  }

  return (
    <main className="pb-24 sm:pb-10">
      <div className="text-center pt-10 sm:pt-16 px-4">
        <span className="text-gold/70 text-xs sm:text-sm tracking-[0.3em] uppercase">
          Grand Aurum Dining
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-gold mt-2">
          Our Menu
        </h1>
        <p className="text-cream/60 mt-3 text-sm sm:text-base max-w-md mx-auto">
          Scroll through each course, or ask our AI nutritionist to find
          your perfect dish.
        </p>
      </div>

      <CinematicMenu
        activeId={activeRecipe?.id ?? null}
        onSelectRecipe={handleHighlight}
        sectionRefs={sectionRefs}
      />

      <ChatBot recipes={recipes} onHighlight={handleHighlight} />
    </main>
  );
}