"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { EmotionKey, PoetryForm, Language } from "@/lib/types";
import { EmotionTiles } from "@/components/studio/EmotionTiles";
import { MirrorDiscs } from "@/components/studio/MirrorDiscs";
import { PoemCard } from "@/components/studio/PoemCard";
import { Plaque } from "@/components/chamber/Plaque";
import { postGenerateForQawwali, type GenResponse } from "@/lib/mehfil-client";
import { recordHistory } from "@/lib/mehfil-storage";
import { EMOTION_ENTRY } from "@/engines/emotion/lexicon";
import { cn } from "@/lib/utils";

export interface QawwaliEntry {
  slug: string;
  verifiedTitle: string;
  language: string;
  poeticTradition: string;
  attributedPoet: string | null;
  interpretation: {
    emotionalSummary: string;
    dominantEmotions: string[];
    emotionalProgression: string[];
    sufiConcepts: string[];
    symbolicImagery: string[];
    literaryCharacteristics: string[];
  };
  researchStatus: string;
  confidence: string;
  coverageNote: string;
  yearsRecorded?: string;
}

const USARD_EMOTIONS: { key: EmotionKey; label: string }[] = [
  { key: "dard", label: "Pain" },
  { key: "ishq", label: "Love" },
  { key: "gussa", label: "Anger" },
  { key: "hijr", label: "Separation" },
  { key: "bewafai", label: "Betrayal" },
  { key: "longing", label: "Longing" },
  { key: "devotion", label: "Devotion" },
  { key: "madness", label: "Madness" },
  { key: "surrender", label: "Surrender" },
  { key: "tanhai", label: "Loneliness" },
];

const FORMS: { key: PoetryForm; label: string }[] = [
  { key: "sher", label: "Two-line sher" },
  { key: "quatrain", label: "Four-line shayari" },
  { key: "six-line", label: "Six lines" },
  { key: "eight-line", label: "Eight lines" },
];

const LANGS: { key: Language; label: string }[] = [
  { key: "roman", label: "Roman Urdu" },
  { key: "urdu", label: "Urdu script" },
  { key: "hindi", label: "Hindi" },
  { key: "english", label: "English" },
];

/**
 * The Us Dard Ko Likho flow:
 * SELECT → DISCOVER → CHOOSE → GENERATE into the lit alcove.
 */
export function UsDardFlow({
  entries,
  initialSlug,
}: {
  entries: QawwaliEntry[];
  initialSlug?: string;
}) {
  const [query, setQuery] = useState("");
  const [slug, setSlug] = useState<string | null>(initialSlug ?? null);
  const selected = useMemo(() => entries.find((e) => e.slug === slug) ?? null, [entries, slug]);

  const [emotions, setEmotions] = useState<EmotionKey[]>(["dard"]);
  const [intensity, setIntensity] = useState(4);
  const [form, setForm] = useState<PoetryForm>("sher");
  const [language, setLanguage] = useState<Language>("roman");

  const [result, setResult] = useState<GenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pre-select emotions suggested by the composition's dominant themes
  useEffect(() => {
    if (!selected) return;
    const suggestions = selected.interpretation.dominantEmotions
      .map((e) => e as EmotionKey)
      .filter((e) => USARD_EMOTIONS.some((u) => u.key === e));
    if (suggestions.length > 0) setEmotions(suggestions.slice(0, 2));
  }, [selected]);

  async function generate() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await postGenerateForQawwali(selected.slug, {
        emotions,
        intensity: intensity as 1 | 2 | 3 | 4 | 5,
        form,
        language,
      });
      setResult(res);
      recordHistory(res.shayari);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The mehfil went quiet — try again.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = entries.filter(
    (e) =>
      query.trim() === "" ||
      e.verifiedTitle.toLowerCase().includes(query.toLowerCase()) ||
      e.language.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 pb-24 pt-12 sm:px-6 lg:px-10">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-[24px] tracking-[0.16em] text-gilt-200 sm:text-[28px]">US DARD KO LIKHO</h1>
        <p className="urdu-text mt-3 text-[17px] text-ivory-300" dir="rtl">اس درد کو لکھو</p>
        <p className="font-body mt-4 text-[16px] leading-relaxed text-ivory-400">
          Ek qawwali. Ek ehsaas. Ek naya sher. Choose a composition, understand
          the feelings it explores, then write an entirely new sher from its
          themes — never its words.
        </p>
      </header>

      {/* STEP 1 — select */}
      <section className="mt-14" aria-label="Select a qawwali">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-[15px] tracking-[0.18em] text-gilt-300">SELECT A QAWWALI</h2>
          <label className="flex items-center gap-3">
            <span className="record-text text-[10px] uppercase tracking-[0.16em] text-ivory-600">search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="title or language…"
              className="w-56 rounded-[3px] border border-gilt-600/40 bg-chamber-900/80 px-3 py-2 font-body text-[14px] text-ivory-200 placeholder:text-ivory-600/60 focus:outline-none focus-visible:outline focus-visible:outline-gilt-300"
            />
          </label>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => {
            const on = e.slug === slug;
            return (
              <button
                key={e.slug}
                onClick={() => setSlug(e.slug)}
                aria-pressed={on}
                className={cn(
                  "niche rounded-[3px] px-5 py-5 text-left transition-all duration-400",
                  on ? "translate-y-[-2px]" : "hover:-translate-y-px"
                )}
                style={on ? { boxShadow: "inset 0 0 0 1px rgba(232,205,147,0.55), 0 0 40px -12px rgba(217,154,61,0.45), inset 0 2px 8px rgba(0,0,0,0.45)" } : undefined}
              >
                <span className="font-display block text-[14px] tracking-[0.1em] text-ivory-200">{e.verifiedTitle}</span>
                <span className="record-text mt-1.5 block text-[10px] uppercase tracking-[0.16em] text-gilt-500">
                  {e.language} · {e.poeticTradition}
                </span>
                <span className="font-body mt-3 block text-[13.5px] leading-relaxed text-ivory-500">
                  {e.interpretation.emotionalSummary.replace(/^SAMPLE ANNOTATION —?\s*/i, "").slice(0, 150)}…
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="font-body text-[14px] text-ivory-500">Nothing researched matches that search yet — the corpus is partial and honest about it.</p>
          )}
        </div>
      </section>

      {/* STEP 2 — discover */}
      {selected && (
        <section className="mt-14" aria-label="Research profile">
          <h2 className="font-display mb-5 text-[15px] tracking-[0.18em] text-gilt-300">
            WHAT THIS COMPOSITION EXPLORES
          </h2>
          <div className="velvet-panel relative overflow-hidden rounded-[4px] p-7 sm:p-9">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-5">
                <div>
                  <h3 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">emotional progression</h3>
                  <p className="font-body mt-2 text-[15.5px] text-ivory-200">
                    {selected.interpretation.emotionalProgression.map((e) => EMOTION_ENTRY[e as EmotionKey]?.word.roman ?? e).join("  →  ")}
                  </p>
                </div>
                <div>
                  <h3 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">dominant feelings</h3>
                  <p className="font-body mt-2 text-[15.5px] text-ivory-300">
                    {selected.interpretation.dominantEmotions.map((e) => EMOTION_ENTRY[e as EmotionKey]?.word.roman ?? e).join(" · ")}
                  </p>
                </div>
                <div>
                  <h3 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">sufi concepts</h3>
                  <p className="font-body mt-2 text-[15.5px] italic text-ivory-300">
                    {selected.interpretation.sufiConcepts.join(" · ") || "—"}
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <h3 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">the reading (labeled interpretation)</h3>
                  <p className="font-body mt-2 text-[14.5px] leading-relaxed text-ivory-400">
                    {selected.interpretation.emotionalSummary.replace(/^SAMPLE ANNOTATION —?\s*/i, "")}
                  </p>
                </div>
                <div>
                  <h3 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">symbols in view</h3>
                  <p className="font-body mt-2 text-[14.5px] text-ivory-400">
                    {selected.interpretation.symbolicImagery.join(" · ") || "—"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Stamps status={selected.researchStatus} confidence={selected.confidence} />
                  <Link
                    href={`/qawwali-universe/${selected.slug}`}
                    className="font-display text-[10.5px] uppercase tracking-[0.2em] text-gilt-400 underline-offset-4 hover:underline"
                  >
                    full profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STEP 3 — choose */}
      {selected && (
        <section className="mt-14" aria-label="Choose your emotion">
          <h2 className="font-display mb-5 text-[15px] tracking-[0.18em] text-gilt-300">CHOOSE YOUR FEELING</h2>
          <div className="space-y-7">
            <EmotionTiles selected={emotions} onToggle={(k) => setEmotions((cur) => (cur.includes(k) ? (cur.length === 1 ? cur : cur.filter((x) => x !== k)) : [...cur, k].slice(0, 3)))} max={3} />
            <div className="flex flex-wrap items-start gap-10">
              <div>
                <h3 className="font-display mb-3 text-[12px] tracking-[0.2em] text-gilt-300">HEAT</h3>
                <MirrorDiscs value={intensity} onChange={setIntensity} />
              </div>
              <div>
                <h3 className="font-display mb-3 text-[12px] tracking-[0.2em] text-gilt-300">POETRY</h3>
                <div className="flex flex-wrap gap-2">
                  {FORMS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setForm(f.key)}
                      aria-pressed={form === f.key}
                      className={cn("rounded-[3px] px-3.5 py-2 font-body text-[14px] transition-all", form === f.key ? "text-chamber-950" : "text-ivory-400 hover:text-gilt-200")}
                      style={form === f.key ? { background: "linear-gradient(180deg,#e8cd93,#c8a25e)" } : { boxShadow: "inset 0 0 0 1px rgba(200,162,94,0.28)" }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-display mb-3 text-[12px] tracking-[0.2em] text-gilt-300">LANGUAGE</h3>
                <div className="flex flex-wrap gap-2">
                  {LANGS.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => setLanguage(l.key)}
                      aria-pressed={language === l.key}
                      className={cn("rounded-[3px] px-3.5 py-2 font-body text-[14px] transition-all", language === l.key ? "text-chamber-950" : "text-ivory-400 hover:text-gilt-200")}
                      style={language === l.key ? { background: "linear-gradient(180deg,#e8cd93,#c8a25e)" } : { boxShadow: "inset 0 0 0 1px rgba(200,162,94,0.28)" }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Plaque onClick={() => void generate()} disabled={loading} variant="primary" size="lg">
              {loading ? "COMPOSING…" : "WRITE THE PAIN"}
            </Plaque>
            {error && (
              <p role="alert" className="max-w-lg border border-velvet-500/60 bg-velvet-900/40 px-4 py-3 font-body text-[14px] text-ivory-300">{error}</p>
            )}
          </div>
        </section>
      )}

      {/* STEP 4 — result */}
      {result && (
        <section className="mt-14" aria-label="Your new sher">
          <PoemCard
            shayari={result.shayari}
            demo={result.demo}
            loading={loading}
            onResult={(s, d) => {
              setResult({ ...result, shayari: s, demo: d });
              recordHistory(s);
            }}
          />
        </section>
      )}
    </div>
  );
}

export function Stamps({ status, confidence }: { status: string; confidence: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="rotate-[-1.5deg] rounded-[2px] px-2 py-0.5 font-record text-[10px] uppercase tracking-[0.14em]"
        style={{
          color: status === "verified_metadata" ? "#dcc084" : "#b8a88d",
          boxShadow: "inset 0 0 0 1px rgba(200,162,94,0.5)",
          background: "rgba(200,162,94,0.08)",
        }}
      >
        {status === "verified_metadata" ? "verified metadata" : "sample"}
      </span>
      <span className="record-text text-[10px] uppercase tracking-[0.14em] text-ivory-600">conf: {confidence}</span>
    </span>
  );
}
