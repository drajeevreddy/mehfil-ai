"use client";

import { EMOTION_ENTRY } from "@/engines/emotion/lexicon";
import type { EmotionKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const STUDIO_EMOTIONS: { key: EmotionKey; label: string }[] = [
  { key: "ishq", label: "Ishq" },
  { key: "dard", label: "Dard" },
  { key: "junoon", label: "Junoon" },
  { key: "gussa", label: "Gussa" },
  { key: "bewafai", label: "Bewafai" },
  { key: "hijr", label: "Hijr" },
  { key: "wafa", label: "Wafa" },
  { key: "tanhai", label: "Tanhai" },
  { key: "shikwa", label: "Shikwa" },
  { key: "sabr", label: "Sabr" },
  { key: "surrender", label: "Surrender" },
  { key: "devotion", label: "Devotion" },
  { key: "regret", label: "Regret" },
  { key: "nostalgia", label: "Nostalgia" },
  { key: "hope", label: "Hope" },
  { key: "longing", label: "Longing" },
];

/**
 * Emotion mirror tiles — frosted at rest, backlit on hover, gilt-flooded when
 * selected. Max 3 emotions; the first picks primary.
 */
export function EmotionTiles({
  selected,
  onToggle,
  max = 3,
  disabledKeys,
}: {
  selected: EmotionKey[];
  onToggle: (key: EmotionKey) => void;
  max?: number;
  disabledKeys?: EmotionKey[];
}) {
  return (
    <div className="flex flex-wrap gap-2.5" role="group" aria-label="Emotions">
      {STUDIO_EMOTIONS.map(({ key, label }) => {
        const on = selected.includes(key);
        const blocked = disabledKeys?.includes(key) || (!on && selected.length >= max);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            disabled={blocked}
            aria-pressed={on}
            title={EMOTION_ENTRY[key]?.gloss}
            className={cn(
              "group rounded-[3px] px-4 py-2 font-display text-[12px] tracking-[0.14em] uppercase transition-all duration-400",
              on
                ? "text-chamber-950"
                : blocked
                  ? "cursor-not-allowed text-ivory-600/50"
                  : "text-ivory-400 hover:text-gilt-200"
            )}
            style={{
              background: on
                ? "linear-gradient(180deg, #e8cd93, #c8a25e 60%, #8a6a45)"
                : "linear-gradient(180deg, rgba(28,24,21,0.85), rgba(16,13,12,0.9))",
              boxShadow: on
                ? "0 0 0 1px rgba(242,224,182,0.75), 0 0 26px -6px rgba(217,154,61,0.55)"
                : "inset 0 0 0 1px rgba(200,162,94,0.2), inset 0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {label}
            {selected[0] === key && selected.length > 1 && (
              <span aria-hidden className="ml-2 font-record text-[10px] no-underline">primary</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function selectedEmotionLabels(selected: EmotionKey[]): string {
  return selected.map((k) => EMOTION_ENTRY[k]?.word.roman ?? k).join(" + ");
}
