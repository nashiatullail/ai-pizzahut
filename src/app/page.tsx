import CinematicHero from "@/components/CinematicHero";

export default function Home() {
  return (
    <main>
      <CinematicHero />

      {/* Optional: content below the fold, appears as user scrolls */}
      <section className="py-20 px-6 text-center bg-charcoal">
        <h2 className="font-serif text-3xl sm:text-4xl text-gold mb-4">
          A Taste of Something Different
        </h2>
        <p className="text-cream/60 max-w-xl mx-auto text-sm sm:text-base">
          Every dish tells a story. Scroll through our cinematic menu, or let
          our AI assistant guide you to your next favorite meal.
        </p>
      </section>
    </main>
  );
}