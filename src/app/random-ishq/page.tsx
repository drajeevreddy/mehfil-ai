"use client";

import { useState } from "react";
import { Dices, Loader2 } from "lucide-react";
import type { GeneratedShayari } from "@/lib/types";
import { PoemCard } from "@/components/studio/PoemCard";
import { Plaque } from "@/components/chamber/Plaque";
import { postRandom, type GenResponse } from "@/lib/mehfil-client";
import { recordHistory } from "@/lib/mehfil-storage";

const FILTERS = [
  { key: "surprise", label: "Surprise Me" },
  { key: "deepest-pain", label: "Deepest Pain" },
  { key: "most-intense-ishq", label: "Most Intense Ishq" },
  { key: "spiritual-reflection", label: "Spiritual Reflection" },
  { key: "broken-promises", label: "Broken Promises" },
  { key: "silent-love", label: "Silent Love" },
  { key: "unspoken-anger", label: "Unspoken Anger" },
] as const;

export default function RandomIshqPage() {
  const [filter, setFilter] = useState<string>("surprise");
  const [result, setResult] = useState<GenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rolls, setRolls] = useState(0);

  async function roll() {
    setLoading(true);
    setError(null);
    try {
      const res = await postRandom({ filter });
      setResult(res);
      setRolls((n) => n + 1);
      recordHistory(res.shayari);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The dice fell silent — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-[24px] tracking-[0.16em] text-gilt-200 sm:text-[28px]">MEHFIL RANDOM</h1>
        <p className="font-body mt-4 text-[16px] leading-relaxed text-ivory-400">
          No choices required. Every roll draws a fresh emotion mix, a
          philosophical direction, an imagery field and a poetic structure —
          controlled randomness with a real poetic direction, not random words.
        </p>
      </header>

      <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Random filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={
              "rounded-sm px-4 py-2 font-body text-[14px] italic transition-all duration-300 " +
              (filter === f.key ? "text-chamber-950" : "text-ivory-400 hover:text-gilt-200")
            }
            style={
              filter === f.key
                ? { background: "linear-gradient(180deg,#e8cd93,#c8a25e)", boxShadow: "0 0 22px -6px rgba(217,154,61,0.5)" }
                : { boxShadow: "inset 0 0 0 1px rgba(200,162,94,0.28)" }
            }
          >
            {f.label}
          </button>
        ))}
      </nav>

      <div className="mt-12 flex flex-col items-center gap-4">
        <Plaque onClick={() => void roll()} disabled={loading} variant="primary" size="xl">
          {loading ? "ROLLING…" : (
            <>
              <Dices size={17} aria-hidden />
              ROLL THE DICE
            </>
          )}
        </Plaque>
        {rolls > 0 && !loading && (
          <button onClick={() => void roll()} className="font-display text-[11px] uppercase tracking-[0.2em] text-gilt-400 underline-offset-4 hover:underline">
            generate another
          </button>
        )}
        {error && (
          <p role="alert" className="max-w-lg border border-velvet-500/60 bg-velvet-900/40 px-4 py-3 font-body text-[14px] text-ivory-300">{error}</p>
        )}
        {rolls > 0 && <p className="record-text text-[10px] tracking-[0.14em] text-ivory-600">ROLLS THIS STAY: {rolls}</p>}
      </div>

      {result && (
        <section className="mt-14" aria-label="Your roll">
          <PoemCard
            shayari={result.shayari}
            demo={result.demo}
            loading={loading}
            onResult={(s: GeneratedShayari, d: boolean) => {
              setResult({ ...result, shayari: s, demo: d });
              recordHistory(s);
            }}
          />
        </section>
      )}

      {!result && (
        <div className="alcove mt-14" aria-hidden>
          <div className="flex min-h-[220px] items-center justify-center">
            {loading ? (
              <Loader2 className="animate-spin text-gilt-300" size={28} aria-hidden />
            ) : (
              <p className="font-body italic text-ivory-500">the dice are still in the cup</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
