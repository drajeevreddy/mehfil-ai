/**
 * ENGINE 1 — QAWWALI INTELLIGENCE (service)
 *
 * Retrieves relevant composition context for an emotional intent.
 * Retrieval is emotion-overlap + concept-overlap scoring over verified
 * metadata and labeled interpretations. Never invents compositions.
 */

import { getComposition, loadCorpus, type CorpusEntry } from "./corpus";
import type { EmotionIntent, QawwaliContext } from "@/lib/types";

const EMOTION_KEYSET = new Set<string>([
  "ishq", "dard", "junoon", "gussa", "bewafai", "hijr", "wafa", "tanhai",
  "shikwa", "sabr", "surrender", "devotion", "regret", "nostalgia", "hope",
  "loneliness", "heartbreak", "longing", "madness", "pride", "jealousy",
  "spiritualLonging",
]);

function normalizeEmotionLabels(labels: string[]): string[] {
  return labels.map((s) => (EMOTION_KEYSET.has(s) ? s : s.toLowerCase().replace(/[^a-z]/g, "")));
}

export function composeContext(entry: CorpusEntry | null): QawwaliContext {
  if (!entry) {
    return {
      composition: null,
      interpretation: null,
      concepts: [],
      metaphors: [],
      source: [],
      researchStatus: "none",
      confidence: "n/a",
      coverageNote:
        "No composition selected — themes stand on the emotion intent alone.",
    };
  }
  const interp = entry.interpretation;
  return {
    composition: {
      slug: entry.slug,
      verifiedTitle: entry.verifiedTitle,
      alternateTitles: entry.alternateTitles,
      language: entry.language,
      poeticTradition: entry.poeticTradition,
      attributedPoet: entry.attributedPoet,
    },
    interpretation: {
      dominantEmotions: normalizeEmotionLabels(interp.dominantEmotions).filter((x): x is import("@/lib/types").EmotionKey => EMOTION_KEYSET.has(x)),
      emotionalProgression: normalizeEmotionLabels(interp.emotionalProgression).filter((x): x is import("@/lib/types").EmotionKey => EMOTION_KEYSET.has(x)),
      sufiConcepts: interp.sufiConcepts,
      symbolicImagery: interp.symbolicImagery,
      summary: interp.emotionalSummary.replace(/^SAMPLE ANNOTATION —?\s*/i, ""),
      literaryCharacteristics: interp.literaryCharacteristics,
      attributionNote: interp.attributionNote,
    },
    concepts: interp.sufiConcepts,
    metaphors: interp.symbolicImagery,
    source: [],
    researchStatus: entry.researchStatus,
    confidence: entry.confidence,
    coverageNote: entry.coverageNote,
  };
}

export function retrieveForIntent(intent: EmotionIntent, slug?: string): QawwaliContext {
  if (slug) return composeContext(getComposition(slug));
  const corpus = loadCorpus();
  let best: { e: CorpusEntry; score: number } | null = null;
  for (const e of corpus) {
    let score = 0;
    const p = normalizeEmotionLabels(e.interpretation.emotionalProgression);
    const d = normalizeEmotionLabels(e.interpretation.dominantEmotions);
    if (p.includes(intent.primary)) score += 4;
    if (d.includes(intent.primary)) score += 2;
    for (const s of intent.secondary) {
      if (p.includes(s)) score += 2;
      if (d.includes(s)) score += 1;
    }
    for (const c of intent.concepts) if (e.interpretation.sufiConcepts.includes(c)) score += 2;
    for (const f of intent.fields) if (e.interpretation.symbolicImagery.includes(f)) score += 2;
    if (e.interpretation.sufiConcepts.includes("ishq-e-haqiqi") && intent.mode === "sufi") score += 3;
    if (!best || score > best.score) best = { e, score };
  }
  return composeContext(best && best.score > 0 ? best.e : null);
}

export function listCorpus(): CorpusEntry[] {
  return loadCorpus().sort((a, b) => a.verifiedTitle.localeCompare(b.verifiedTitle));
}

export { getComposition, loadCorpus } from "./corpus";
