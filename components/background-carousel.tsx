"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const BACKGROUNDS = [
  { id: "bg-1", name: "Mountain", image: "/background/bg-1.png" },
  { id: "bg-2", name: "Beach", image: "/background/bg-2.png" },
  { id: "bg-3", name: "City Night", image: "/background/bg-3.png" },
  { id: "bg-4", name: "Lake", image: "/background/bg-4.png" },
  { id: "bg-5", name: "Futuristic City", image: "/background/bg-5.png" },
  { id: "bg-6", name: "Moon", image: "/background/bg-6.png" },
  { id: "bg-7", name: "Temple", image: "/background/bg-7.png" },
  { id: "bg-8", name: "Coral Reef", image: "/background/bg-8.png" },
  { id: "bg-9", name: "Milky Way", image: "/background/bg-9.png" },
  { id: "bg-10", name: "Ice Cave", image: "/background/bg-10.png" },
  { id: "bg-11", name: "Sakura", image: "/background/bg-11.png" },
  { id: "bg-12", name: "Autumn Forest", image: "/background/bg-12.png" },
];

interface BackgroundCarouselProps {
  selectedBackground: string | null;
  selectBackground: (id: string) => void;
}

export function BackgroundCarousel({
  selectedBackground,
  selectBackground,
}: BackgroundCarouselProps) {
  const duplicatedBackgrounds = [...BACKGROUNDS, ...BACKGROUNDS, ...BACKGROUNDS];

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className="flex animate-scroll gap-4">
        {duplicatedBackgrounds.map((bg, index) => {
          const isSelected = bg.id === selectedBackground;
          return (
            <button
              key={`${bg.id}-${index}`}
              type="button"
              onClick={() => selectBackground(bg.id)}
              className={cn(
                "group flex flex-col gap-3 rounded-2xl border-2 bg-white p-4 transition hover:shadow-lg focus:outline-none focus:ring-4 flex-shrink-0",
                isSelected
                  ? "border-blue-600 focus:ring-blue-100"
                  : "border-gray-200 focus:ring-gray-100"
              )}
            >
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={bg.image}
                  alt={bg.name}
                  width={400}
                  height={300}
                  className="h-32 w-48 object-cover transition group-hover:scale-105"
                />
              </div>
              <span
                className={cn(
                  "text-base font-semibold",
                  isSelected ? "text-blue-600" : "text-gray-700"
                )}
              >
                {bg.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent" />
    </div>
  );
}