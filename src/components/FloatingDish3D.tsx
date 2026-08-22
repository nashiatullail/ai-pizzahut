"use client";
import { Canvas } from "@react-three/fiber";
import { Float, Torus, Cylinder, Sphere, Environment } from "@react-three/drei";
import { useMemo } from "react";
import type { Recipe } from "@/lib/recipes";

function getGlowColor(recipe: Recipe | null) {
  if (!recipe) return "#c96a3a";
  if (recipe.tags.includes("high-protein") && recipe.tags.includes("low-carb"))
    return "#4ade80"; // green
  if (recipe.tags.includes("high-carb")) return "#f97316"; // orange
  if (recipe.tags.includes("vegetarian")) return "#22c55e";
  return "#c96a3a";
}

function Dish({ recipe }: { recipe: Recipe | null }) {
  const color = useMemo(() => getGlowColor(recipe), [recipe]);

  return (
    <group position={[0, 0, 0]}>
      <Torus args={[1.6, 0.08, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#e5d3a1" metalness={0.6} roughness={0.2} />
      </Torus>
      <Cylinder args={[1.3, 1.3, 0.1, 64]} position={[0, 0.02, 0]}>
        <meshStandardMaterial color="#fffdf7" />
      </Cylinder>
      <Sphere args={[0.35, 32, 32]} position={[0, 0.3, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.4}
        />
      </Sphere>
      <Sphere args={[0.2, 32, 32]} position={[0.5, 0.25, 0.3]}>
        <meshStandardMaterial color="#6fae5a" roughness={0.5} />
      </Sphere>
    </group>
  );
}

export default function FloatingDish3D({
  activeRecipe,
}: {
  activeRecipe: Recipe | null;
}) {
  return (
    <div className="w-full h-[420px]">
      <Canvas camera={{ position: [0, 2.5, 4], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} />
        <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
          <Dish recipe={activeRecipe} />
        </Float>
        <Environment preset="sunset" />
      </Canvas>
      {activeRecipe && (
        <p className="text-center text-sm text-cream/60 mt-2">
          Glowing for: <span className="text-gold">{activeRecipe.name}</span>
        </p>
      )}
    </div>
  );
}