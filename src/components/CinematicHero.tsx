"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SoundToggle from "@/components/SoundToggle";

export default function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative w-full h-[100svh] overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {!videoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-[#241c10] to-charcoal" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/30" />
      <div className="absolute inset-0 bg-black/20" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-2xl"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-gold/80 text-xs sm:text-sm tracking-[0.4em] uppercase block mb-4"
        >
          Est. Excellence
        </motion.span>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-cream leading-tight drop-shadow-2xl">
          Grand Aurum
          <span className="block text-gold mt-1">Hotel</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-cream/70 mt-6 text-sm sm:text-base max-w-md mx-auto"
        >
          Experience luxury dining reimagined — explore our menu in 3D and
          chat with our AI nutritionist to find your perfect dish.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/menu"
            className="px-8 py-3 bg-gold text-charcoal font-semibold rounded-full active:scale-95 hover:scale-105 transition-transform"
          >
            Open the Menu
          </Link>

          <SoundToggle />
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/50 text-xs tracking-widest z-10"
      >
        SCROLL ↓
      </motion.div>
    </div>
  );
}