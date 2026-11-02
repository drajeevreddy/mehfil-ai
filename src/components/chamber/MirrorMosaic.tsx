/**
 * Mirror-mosaic tessellation — authored SVG, structural not wallpaper.
 * Diamond shisha facets with seeded variation in tarnish and brightness.
 */
import { useMemo } from "react";
import { cn } from "@/lib/utils";

function rand(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function MirrorMosaic({
  className,
  seed = 7,
  tile = 34,
  lit = 0,
}: {
  className?: string;
  seed?: number;
  /** tile size in px */
  tile?: number;
  /** 0..1 — how much of the mosaic is gilt-lit (state as light level) */
  lit?: number;
}) {
  const facets = useMemo(() => {
    const rng = rand(seed);
    const w = 12;
    const h = 14;
    const out = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const cx = x * tile + (y % 2 === 0 ? tile / 2 : 0) + tile / 2;
        const cy = y * tile * 0.5 + tile / 4;
        const r1 = rng();
        const r2 = rng();
        const isLit = lit > 0 && r2 < lit;
        const base = isLit ? 0.16 + r1 * 0.3 : 0.03 + r1 * 0.09;
        // hue: tarnished silver, occasional bronze (amber tint)
        const amber = r1 > 0.8;
        out.push({
          x: cx,
          y: cy,
          fill: isLit
            ? amber
              ? `rgba(237,184,95,${base + 0.22})`
              : `rgba(232,205,147,${base + 0.2})`
            : amber
              ? `rgba(138,106,69,${base + 0.05})`
              : `rgba(217,203,178,${base})`,
          rot: ((r2 - 0.5) * 24),
        });
      }
    }
    return out;
  }, [seed, tile, lit]);

  return (
    <svg
      className={cn("pointer-events-none", className)}
      aria-hidden
      viewBox={`0 0 ${12 * tile + tile} ${13 * tile * 0.5 + tile}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%" }}
    >
      {facets.map((f, i) => (
        <polygon
          key={i}
          points={`0,${-tile * 0.28} ${tile * 0.3},0 0,${tile * 0.28} ${-tile * 0.3},0`}
          transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`}
          fill={f.fill}
          stroke="rgba(11,10,8,0.55)"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}
