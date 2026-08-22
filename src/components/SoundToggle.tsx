"use client";
import { useAmbientAudio } from "@/lib/AudioContext";

export default function SoundToggle({ className = "" }: { className?: string }) {
  const { soundOn, toggleSound } = useAmbientAudio();

  return (
    <button
      onClick={toggleSound}
      className={`flex items-center gap-2 px-5 py-3 rounded-full border border-cream/30 text-cream/80 text-sm backdrop-blur-sm hover:border-gold hover:text-gold transition active:scale-95 ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${soundOn ? "bg-gold animate-pulse" : "bg-cream/40"}`} />
      {soundOn ? "Sound On" : "Enable Ambience"}
    </button>
  );
}