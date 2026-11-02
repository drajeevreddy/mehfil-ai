/**
 * ENGINE 1 — QAWWALI INTELLIGENCE: corpus types and adapter.
 *
 * The corpus stores research metadata, interpretations and citations — never
 * lyrics, never transcriptions. Seeded entries are real, publicly documented
 * qawwali titles with clearly-labeled interpretive annotations; the research
 * file is optional and loaded defensively, so the app runs (demo mode) before
 * research ingestion completes.
 */

import fs from "node:fs";
import path from "node:path";

export type ResearchStatus = "verified_metadata" | "sample_annotation";

export interface ResearchSource {
  label: string;
  url?: string;
  kind: "metadata" | "scholarship" | "journalism";
}

export interface CorpusEntry {
  slug: string;
  verifiedTitle: string;
  alternateTitles: string[];
  language: string;
  poeticTradition: string;
  attributedPoet: string | null;
  /** Interpretation — always labeled as interpretation in UI. */
  interpretation: {
    emotionalSummary: string;
    dominantEmotions: string[];
    emotionalProgression: string[];
    sufiConcepts: string[];
    symbolicImagery: string[];
    literaryCharacteristics: string[];
    attributionNote?: string;
  };
  researchStatus: ResearchStatus;
  annotationStatus: "sample_annotation" | "crowdsourced" | "reviewed";
  confidence: "high" | "medium" | "low";
  sources: ResearchSource[];
  coverageNote: string;
  yearsRecorded?: string;
}

/** Minimal fallback corpus — real documented titles, sample annotations. */
export const FALLBACK_CORPUS: CorpusEntry[] = [
  {
    slug: "dam-mast-qalandar",
    verifiedTitle: "Dama Dam Mast Qalandar",
    alternateTitles: ["Dum Mast Qalandar", "Dam Mast Qalandar"],
    language: "Sindhi-Punjabi-Urdu",
    poeticTradition: "hamd-manqabat, traditional qawwali",
    attributedPoet: null,
    interpretation: {
      emotionalSummary:
        "SAMPLE ANNOTATION — An invocation of ecstatic surrender to the Qalandar spirit: transport, abandon, and devotion offered without negotiation.",
      dominantEmotions: ["devotion", "madness"],
      emotionalProgression: ["devotion", "madness", "surrender"],
      sufiConcepts: ["ishq-e-haqiqi", "fana", "qalandariyya"],
      symbolicImagery: ["saaqi", "maikhana", "aag"],
      literaryCharacteristics: ["hymnic repetition", "invocation", "rhythmic acceleration"],
      attributionNote: "Composer attribution is publicly debated; no attribution is asserted here.",
    },
    researchStatus: "verified_metadata",
    annotationStatus: "sample_annotation",
    confidence: "medium",
    sources: [{ label: "publicly documented qawwali repertory", kind: "metadata" }],
    coverageNote:
      "SAMPLE ANNOTATION — metadata verified against public documentation; the interpretive layer awaits editorial review.",
    yearsRecorded: "widely recorded across NFAK's career",
  },
  {
    slug: "tere-bin-nahin-lagda",
    verifiedTitle: "Tere Bin Nahin Lagda",
    alternateTitles: ["Tere Bin Nahi Lagda", "Tere Bin Nahin Lagdah"],
    language: "Punjabi",
    poeticTradition: "ghazal-style barham (kafi tradition)",
    attributedPoet: null,
    interpretation: {
      emotionalSummary:
        "SAMPLE ANNOTATION — The ordinary world loses its weight in the beloved's absence: day-to-day life continues but nothing fits anymore.",
      dominantEmotions: ["hijr", "dard"],
      emotionalProgression: ["hijr", "dard", "sabr"],
      sufiConcepts: ["hijr", "ghurbat"],
      symbolicImagery: ["raat", "tanhai", "aansu"],
      literaryCharacteristics: ["plain diction carrying grief", "repetition", "domestic imagery"],
    },
    researchStatus: "verified_metadata",
    annotationStatus: "sample_annotation",
    confidence: "medium",
    sources: [{ label: "publicly documented qawwali repertory", kind: "metadata" }],
    coverageNote:
      "SAMPLE ANNOTATION — metadata verified; interpretation awaits editorial review.",
    yearsRecorded: "documented in NFAK's recorded catalog",
  },
  {
    slug: "sanson-ki-mala",
    verifiedTitle: "Sanson Ki Mala",
    alternateTitles: ["Saanson Ki Mala", "Sanso Ki Mala Pe Simroon"],
    language: "Urdu",
    poeticTradition: "manqabat / devotional poetry",
    attributedPoet: null,
    interpretation: {
      emotionalSummary:
        "SAMPLE ANNOTATION — Remembering the Divine name like a garland strung on breath: devotion as a practice so intimate it reorders the body.",
      dominantEmotions: ["devotion", "spiritualLonging"],
      emotionalProgression: ["devotion", "spiritualLonging", "surrender"],
      sufiConcepts: ["zikr", "ishq-e-haqiqi", "tasawwuf"],
      symbolicImagery: ["dua", "noor", "rooh"],
      literaryCharacteristics: ["breath-rhythm diction", "japa-like repetition", "the body and the prayer become one"],
    },
    researchStatus: "verified_metadata",
    annotationStatus: "sample_annotation",
    confidence: "medium",
    sources: [{ label: "publicly documented qawwali repertory", kind: "metadata" }],
    coverageNote:
      "SAMPLE ANNOTATION — metadata verified; interpretation awaits editorial review.",
    yearsRecorded: "documented in NFAK's recorded catalog",
  },
];

const RESEARCH_FILE = "research/corpus-seed.json";

function coerceEntry(raw: unknown): CorpusEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.slug !== "string" || typeof r.verifiedTitle !== "string"|| typeof r.language !== "string") return null;
  const interp = (r.interpretation ?? {}) as Record<string, unknown>;
  const strArr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  return {
    slug: r.slug,
    verifiedTitle: r.verifiedTitle,
    alternateTitles: strArr(r.alternateTitles),
    language: r.language,
    poeticTradition: typeof r.poeticTradition === "string" ? r.poeticTradition : "qawwali",
    attributedPoet: typeof r.attributedPoet === "string" ? r.attributedPoet : null,
    interpretation: {
      emotionalSummary: typeof interp.emotionalSummary === "string" ? interp.emotionalSummary : "",
      dominantEmotions: strArr(interp.dominantEmotions),
      emotionalProgression: strArr(interp.emotionalProgression),
      sufiConcepts: strArr(interp.sufiConcepts),
      symbolicImagery: strArr(interp.symbolicImagery),
      literaryCharacteristics: strArr(interp.literaryCharacteristics),
      attributionNote: typeof interp.attributionNote === "string" ? interp.attributionNote : undefined,
    },
    researchStatus: r.researchStatus === "sample_annotation" ? "sample_annotation" : "verified_metadata",
    annotationStatus: "sample_annotation",
    confidence: r.confidence === "high" || r.confidence === "low" ? r.confidence : "medium",
    sources: Array.isArray(r.sources)
      ? (r.sources as unknown[]).flatMap((s): ResearchSource[] => {
          if (s && typeof s === "object" && "label" in (s as Record<string, unknown>)) {
            const so = s as Record<string, unknown>;
            return [{ label: String(so.label), url: typeof so.url === "string" ? so.url : undefined, kind: "metadata" }];
          }
          return [];
        })
      : [],
    coverageNote: typeof r.coverageNote === "string" ? r.coverageNote : "",
    yearsRecorded: typeof r.yearsRecorded === "string" ? r.yearsRecorded : undefined,
  };
}

/** Load the researched corpus if present, merging with the fallback samples. */
export function loadCorpus(): CorpusEntry[] {
  try {
    const p = path.join(process.cwd(), RESEARCH_FILE);
    if (fs.existsSync(p)) {
      const parsed = JSON.parse(fs.readFileSync(p, "utf8"));
      const arr = Array.isArray(parsed) ? parsed : [];
      const entries = arr.flatMap((e: unknown): CorpusEntry[] => {
        const c = coerceEntry(e);
        return c ? [c] : [];
      });
      const seen = new Set(entries.map((e) => e.slug));
      const merged = [
        ...entries,
        ...FALLBACK_CORPUS.filter((f) => !seen.has(f.slug)),
      ];
      return merged;
    }
  } catch {
    // fall through to fallback corpus; never crash the API on research files
  }
  return FALLBACK_CORPUS.map((e) => ({ ...e }));
}

export function getComposition(slug: string): CorpusEntry | null {
  return loadCorpus().find((e) => e.slug === slug) ?? null;
}
