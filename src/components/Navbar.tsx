"use client";
import Link from "next/link";
import { useState } from "react";
import { useAmbientAudio } from "@/lib/AudioContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { soundOn, toggleSound } = useAmbientAudio();

  return (
    <nav className="relative flex justify-between items-center px-4 sm:px-8 py-4 sm:py-5 bg-charcoal/80 backdrop-blur border-b border-gold/20">
      <span className="text-gold font-serif text-xl sm:text-2xl tracking-wide">
        Grand Aurum
      </span>

      <div className="hidden sm:flex items-center gap-6 text-cream/80">
        <Link href="/" className="hover:text-gold transition">Home</Link>
        <Link href="/menu" className="hover:text-gold transition">3D Menu</Link>
        <button
          onClick={toggleSound}
          aria-label="Toggle ambient sound"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/30 hover:border-gold transition"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>
      </div>

      <div className="flex items-center gap-3 sm:hidden">
        <button
          onClick={toggleSound}
          aria-label="Toggle ambient sound"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/30"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>
        <button
          className="text-cream text-2xl"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-charcoal border-b border-gold/20 flex flex-col sm:hidden">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-3 text-cream/80 hover:text-gold border-b border-gold/10"
          >
            Home
          </Link>
          <Link
            href="/menu"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-3 text-cream/80 hover:text-gold"
          >
            3D Menu
          </Link>
        </div>
      )}
    </nav>
  );
}