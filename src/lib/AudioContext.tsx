"use client";
import { createContext, useContext, useRef, useState, ReactNode } from "react";

type AudioContextType = {
  soundOn: boolean;
  toggleSound: () => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  function toggleSound() {
    if (!audioRef.current) return;

    if (soundOn) {
      audioRef.current.pause();
      setSoundOn(false);
    } else {
      audioRef.current.volume = 0.35;
      audioRef.current
        .play()
        .then(() => setSoundOn(true))
        .catch(() => setSoundOn(false));
    }
  }

  return (
    <AudioContext.Provider value={{ soundOn, toggleSound }}>
      {/* This audio element lives in the root layout — never unmounts on navigation */}
      <audio ref={audioRef} loop src="/audio/ambient.mp3" />
      {children}
    </AudioContext.Provider>
  );
}

export function useAmbientAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error("useAmbientAudio must be used within AudioProvider");
  }
  return ctx;
}