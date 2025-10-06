"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TickerProps {
  items: ReactNode[];
  velocity?: number;
  hoverFactor?: number;
}

export function Ticker({ items, velocity = 50 }: TickerProps) {
  // Calculate animation duration based on velocity
  // velocity is in pixels per second
  // Assume each item is about 280px (256px width + 16px gap + some padding)
  const itemWidth = 280;
  const totalWidth = items.length * itemWidth;
  const duration = totalWidth / velocity;

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-4"
        animate={{
          x: [`0%`, `-50%`],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
        whileHover={{
          animationPlayState: "paused" as const,
        }}
        style={{
          animationPlayState: "running",
        }}
      >
        {/* Render items twice for seamless loop */}
        {[...Array(2)].map((_, setIndex) =>
          items.map((item, index) => (
            <div key={`${setIndex}-${index}`} className="flex-shrink-0">
              {item}
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}
