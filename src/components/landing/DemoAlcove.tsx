"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import type { GeneratedShayari, EmotionKey } from "@/lib/types";
import { postGenerate } from "@/lib/mehfil-client";
import { EMOTION_ENTRY } from "@/engines/emotion/lexicon";
import { cn } from "@/lib/utils";

const ROTATIONS: { emotions: EmotionKey[]; intensity: number }[] = [
  { emotions: ["ishq", "dard"], intensity: 4 },
  { emotions: ["hijr", "devotion"], intensity: 3 },
  { emotions: ["bewafai", "pride"], intensity: 4 },
  { emotions: ["tanhai", "hope"], intensity: 2 },
  { emotions: ["longing", "madness"], intensity: 5 },
];

export function DemoAlcove({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const idx = useRef(0);
  const [shayari, setShayari] = useState<GeneratedShayari | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rolling, setRolling] = useState(true);

  const roll = async () => {
    const combo = ROTATIONS[idx.current % ROTATIONS.length];
    idx.current += 1;
    setRolling(true);
    try {
      const res = await postGenerate({
        emotions: combo.emotions,
        intensity: combo.intensity as 1 | 2 | 3 | 4 | 5,
        form: "sher",
        language: "urdu",
      });
      setShayari(res.shayari);
      setError(null);
    } catch {
      setError("The alcove went quiet — the demo mehfil could not be reached.");
    } finally {
      setRolling(false);
    }
  };

  useEffect(() => {
    roll();
    const t = setInterval(() => roll(), 11_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emo = shayari?.emotionIntent.primary;
  const emoWord = emo ? EMOTION_ENTRY[emo]?.word : null;
  const emoSecond = shayari?.emotionIntent.secondary[0] ? EMOTION_ENTRY[shayari.emotionIntent.secondary[0]]?.word.roman : null;

  return (
    <section
      className={cn("poem-alcove relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden px-6 py-10 text-center sm:min-h-[520px]", className)}
      aria-label="A live demo sher composed by the local core engine"
    >
      <AnimatePresence mode="wait">
        {shayari && !rolling && (
          <motion.div
            key={shayari.id}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <p className="urdu-text max-w-md text-[19px] leading-loose text-ivory-200 sm:text-[21px]" dir="rtl">
              {shayari.couplets[0]?.urduMisra1}
            </p>
            <p className="urdu-text max-w-md text-[19px] leading-loose text-ivory-200 sm:text-[21px]" dir="rtl">
              {shayari.couplets[0]?.urduMisra2}
            </p>
            <p className="font-body mt-6 max-w-md text-[14.5px] italic text-ivory-500" dir="ltr">
              {shayari.couplets[0]?.english1} {shayari.couplets[0]?.english2}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {rolling && (
        <div className="relative z-10" role="status" aria-live="polite">
          <p className="font-body italic text-ivory-500">a sher is finding its words…</p>
        </div>
      )}

      {error && (
        <div className="relative z-10">
          <p className="font-body text-[14px] text-ivory-400">{error}</p>
          <button onClick={() => roll()} className="font-display mt-3 text-[11px] uppercase tracking-[0.18em] text-gilt-300 underline-offset-4 hover:underline">
            Try again
          </button>
        </div>
      )}

      {shayari && (
        <div className="relative z-10 mt-8 space-y-1.5">
          <div aria-hidden className="gilt-rule mx-auto w-2/3 opacity-70" />
          {emoWord && (
            <p className="record-text text-[11px] tracking-[0.18em] text-gilt-400/90">
              DEMO · {emoWord.roman.toUpperCase()}{emoSecond ? " + " + emoSecond.toUpperCase() : ""}
            </p>
          )}
          <p className="font-body mt-6 text-[13px] italic text-ivory-500">
            composed here on the spot, the way a chosen feeling becomes poetry
          </p>
          <button
            onClick={() => roll()}
            className="font-display mt-1 text-[11px] leading-none uppercase tracking-[0.2em] text-gilt-300 underline-offset-4 hover:underline disabled:opacity-40"
            disabled={rolling}
          >
            roll another sher
          </button>
        </div>
      )}
    </section>
  );
}
