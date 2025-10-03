"use client"

import Image from "next/image"

const LAYOUT_IMAGES = [
  "/layout/layout-1.jpeg",
  "/layout/layout-2.jpeg",
  "/layout/layout-3.jpeg",
  "/layout/layout-4.jpeg",
  "/layout/layout-5.jpeg",
  "/layout/layout-6.jpeg",
]

export function LayoutCarousel() {
  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...LAYOUT_IMAGES, ...LAYOUT_IMAGES, ...LAYOUT_IMAGES]

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className="flex animate-scroll gap-4">
        {duplicatedImages.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="flex-shrink-0"
          >
            <Image
              src={src}
              alt={`Layout ${(index % LAYOUT_IMAGES.length) + 1}`}
              width={300}
              height={400}
              className="h-80 w-60 rounded-2xl object-cover shadow-lg"
            />
          </div>
        ))}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
    </div>
  )
}
