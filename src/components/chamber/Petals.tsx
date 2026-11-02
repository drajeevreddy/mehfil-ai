"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

/**
 * Rose-petal drift: a few authored petals crossing the dark. Disabled under
 * prefers-reduced-motion; petals are decorative (aria-hidden) and never
 * intercept pointer events.
 */
export function Petals() {
  const reduce = useReducedMotion();
  const petals = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: (i * 83) % 100,
        delay: (i * 2.7) % 14,
        dur: 22 + ((i * 7) % 13),
        size: 5 + ((i * 3) % 5),
        drift: ((i % 5) - 2) * 30,
      })),
    []
  );

  if (reduce) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-[60%_40%_55%_45%/55%_60%_40%_45%]"
          style={{
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size * 0.62,
            background: "linear-gradient(145deg, rgba(197,127,134,0.55), rgba(74,18,32,0.65))",
            filter: "blur(0.4px)",
          }}
          initial={{ y: -30, opacity: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.drift, p.drift * -0.5],
            opacity: [0, 0.7, 0.7, 0],
            rotate: [0, 160, 340],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 4 + (p.id % 5),
          }}
        />
      ))}
    </div>
  );
}
