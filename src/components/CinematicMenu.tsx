"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { recipes, type Recipe } from "@/lib/recipes";
import { playFlipSound } from "@/lib/sound";

function DishSection({
  recipe,
  index,
  isActive,
  onSelect,
  registerRef,
}: {
  recipe: Recipe;
  index: number;
  isActive: boolean;
  onSelect: (r: Recipe) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax + Ken Burns zoom on the image as it scrolls through view
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.3, 1.45]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.75, 0.4, 0.4, 0.75]);

  return (
    <div
      ref={(el) => {
        sectionRef.current = el;
        registerRef(recipe.id, el);
      }}
      className={`relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden rounded-3xl mb-6 sm:mb-10 cursor-pointer transition-shadow ${
        isActive ? "ring-4 ring-gold shadow-[0_0_60px_rgba(201,161,90,0.4)]" : ""
      }`}
      onClick={() => {
        playFlipSound();
        onSelect(recipe);
      }}
    >
      {/* Background image with Ken Burns + parallax */}
      <motion.div
        style={{ scale: imageScale, y: imageY }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src={recipe.image}
          alt={recipe.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />
      </motion.div>

      {/* Dark gradient overlay for text readability */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/20"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 px-6 sm:px-10 text-center max-w-2xl"
      >
        <span className="text-gold/80 text-xs sm:text-sm tracking-[0.3em] uppercase">
          Course {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-cream mt-3 mb-4 drop-shadow-lg">
          {recipe.name}
        </h2>
        <p className="text-cream/80 text-sm sm:text-base mb-6 leading-relaxed">
          {recipe.description}
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
          <span className="px-3 py-1 rounded-full bg-cream/10 backdrop-blur text-gold border border-gold/30">
            {recipe.calories} kcal
          </span>
          <span className="px-3 py-1 rounded-full bg-cream/10 backdrop-blur text-gold border border-gold/30">
            {recipe.protein}g protein
          </span>
          <span className="px-3 py-1 rounded-full bg-cream/10 backdrop-blur text-gold border border-gold/30">
            {recipe.carbs}g carbs
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-gold/20 text-gold"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function CinematicMenu({
  activeId,
  onSelectRecipe,
  sectionRefs,
}: {
  activeId: string | null;
  onSelectRecipe: (r: Recipe) => void;
  sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}) {
  function registerRef(id: string, el: HTMLDivElement | null) {
    sectionRefs.current[id] = el;
  }

  return (
    <div className="px-3 sm:px-6 py-6 sm:py-10 max-w-5xl mx-auto">
      {recipes.map((r, i) => (
        <DishSection
          key={r.id}
          recipe={r}
          index={i}
          isActive={activeId === r.id}
          onSelect={onSelectRecipe}
          registerRef={registerRef}
        />
      ))}
    </div>
  );
}