import Link from "next/link";
import { listCorpus } from "@/engines/qawwali/engine";
import { Stamps } from "@/components/usdard/UsDardFlow";
import { EMOTION_ENTRY } from "@/engines/emotion/lexicon";
import type { EmotionKey } from "@/lib/types";

export const metadata = {
  title: "Qawwali Universe — MEHFIL AI",
  description: "The researched, source-aware knowledge base of qawwali compositions.",
};

const FILTERS: { key: string; label: string; concepts: string[] }[] = [
  { key: "all", label: "All chambers", concepts: [] },
  { key: "pain", label: "Pain", concepts: ["dard", "hijr"] },
  { key: "love", label: "Love", concepts: ["ishq", "wafa"] },
  { key: "separation", label: "Separation", concepts: ["hijr"] },
  { key: "spirituality", label: "Spirituality", concepts: ["devotion", "spiritualLonging", "surrender"] },
  { key: "betrayal", label: "Betrayal", concepts: ["bewafai", "heartbreak"] },
  { key: "devotion", label: "Devotion", concepts: ["devotion"] },
  { key: "madness", label: "Madness", concepts: ["junoon", "madness"] },
  { key: "anger", label: "Anger", concepts: ["gussa", "shikwa"] },
];

export default async function QawwaliUniversePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const sp = await searchParams;
  const active = FILTERS.find((f) => f.key === sp.filter) ?? FILTERS[0];
  const corpus = listCorpus().filter((e) => {
    if (active.concepts.length === 0) return true;
    const labels = [...e.interpretation.dominantEmotions, ...e.interpretation.emotionalProgression];
    return labels.some((l) => active.concepts.includes(l));
  });

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 pb-24 pt-12 sm:px-6 lg:px-10">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-[24px] tracking-[0.16em] text-gilt-200 sm:text-[28px]">QAWWALI UNIVERSE</h1>
        <p className="font-body mt-4 text-[16px] leading-relaxed text-ivory-400">
          The public knowledge chamber. Each alcove holds one researched
          composition: verified recording metadata, its dominant themes, the Sufi
          concepts it speaks through, and its labeled interpretation. No lyrics
          are stored anywhere in this universe.
        </p>
      </header>

      {/* filters */}
      <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Theme filters">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/qawwali-universe" : `/qawwali-universe?filter=${f.key}`}
            aria-current={f.key === active.key ? "true" : undefined}
            className={
              "rounded-full px-4 py-2 font-body text-[14px] italic transition-all duration-300 " +
              (f.key === active.key ? "text-chamber-950" : "text-ivory-400 hover:text-gilt-200")
            }
            style={
              f.key === active.key
                ? { background: "linear-gradient(180deg,#e8cd93,#c8a25e)", boxShadow: "0 0 22px -6px rgba(217,154,61,0.5)" }
                : { boxShadow: "inset 0 0 0 1px rgba(200,162,94,0.28)" }
            }
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {/* coverage honesty */}
      <p className="record-text mx-auto mt-6 max-w-2xl text-center text-[11px] leading-relaxed tracking-[0.08em] text-ivory-600">
        SHOWING {corpus.length} ENTRIES · VERIFIED METADATA FROM PUBLIC SOURCES · INTERPRETATIONS ARE LABELED SAMPLE ANNOTATIONS PENDING EDITORIAL REVIEW. THE CORPUS IS PARTIAL BY DESIGN — MEHFIL AI NEVER CLAIMS COMPLETE REPERTOIRE COVERAGE.
      </p>

      {/* the wall of niches */}
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {corpus.map((e) => (
          <article key={e.slug} className="niche group rounded-[3px] p-6">
            <h2 className="font-display text-[15px] tracking-[0.1em] text-ivory-200">{e.verifiedTitle}</h2>
            <p className="record-text mt-1.5 text-[10px] uppercase tracking-[0.16em] text-gilt-500">
              {e.language} · {e.poeticTradition}
            </p>
            <p className="font-body mt-4 text-[14px] leading-relaxed text-ivory-400">
              {e.interpretation.emotionalSummary.replace(/^SAMPLE ANNOTATION —?\s*/i, "").slice(0, 170)}…
            </p>
            <p className="font-record mt-4 text-[10px] uppercase tracking-[0.14em] text-ivory-600">
              {e.interpretation.emotionalProgression.map((x) => EMOTION_ENTRY[x as EmotionKey]?.word.roman ?? x).join(" → ")}
            </p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <Stamps status={e.researchStatus} confidence={e.confidence} />
              <Link
                href={`/qawwali-universe/${e.slug}`}
                className="font-display shrink-0 text-[10.5px] uppercase tracking-[0.18em] text-gilt-400 underline-offset-4 hover:text-gilt-200 hover:underline"
              >
                open
              </Link>
            </div>
          </article>
        ))}
      </div>

      {corpus.length === 0 && (
        <p className="font-body mt-16 text-center text-[15px] italic text-ivory-500">
          No researched entry matches this chamber yet.
        </p>
      )}
    </div>
  );
}
