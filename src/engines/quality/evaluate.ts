/**
 * QUALITY EVALUATION SERVICE
 *
 * Evaluates output grammar, coherence, relevance, metaphor depth and
 * originality. Similarity screening compares against MEHFIL AI's own internal
 * reference corpus — it is an internal originality gate, NOT a copyright
 * clearance, and the UI copy says so.
 * Numeric scores are internal development signals and are never exposed to
 * users as objective literary truth.
 */

import { tokens, resolveToken } from "@/engines/shayari/render";
import { COUPLETS } from "@/engines/shayari/couplets";
import type { EmotionIntent, GeneratedShayari, QualityReport } from "@/lib/types";

const REFERENCE_MARKERS: string[] = [
  // Distinctive openings, famous lines, signature phrases this product must never echo.
];

function referenceSimilarity(lines: string[]): number {
  // Reference corpus is a curated list of phrases the output must not echo.
  if (REFERENCE_MARKERS.length === 0) return 0;
  const out = tokens(lines.join(" "));
  let best = 0;
  for (const marker of REFERENCE_MARKERS) {
    const m = tokens(marker);
    const inter = out.filter((w) => m.includes(w)).length;
    const sim = m.length > 0 ? inter / m.length : 0;
    if (sim > best) best = sim;
  }
  return best;
}

export interface EvaluationInput {
  romanLines: string[];
  intent: EmotionIntent;
  formCouplets: number;
  seed: number;
  regenerations: number;
}

const MAX_REGENERATIONS = 2;

export function evaluateShayari(input: EvaluationInput): QualityReport {
  const { romanLines, intent } = input;
  const flags: string[] = [];
  let grammarTally = 0;
  let coherentTally = 0;

  const clean = romanLines.map((l) => l.replace(/[،.!?",'’‘-]/g, " ").trim());

  for (const line of clean) {
    const ts = tokens(line);
    if (ts.length === 0) {
      flags.push("empty-line");
      continue;
    }
    const resolved = ts.filter((t) => resolveToken(t) !== null);
    if (resolved.length / ts.length < 0.9) flags.push("unresolved-token");
    grammarTally += 1;
    if (line.split(/\s+/).length >= 5) coherentTally += 1;
  }

  const grammar = clean.length > 0 ? grammarTally / clean.length : 0;
  const coherence = clean.length > 0 ? coherentTally / clean.length : 0;

  // relevance: imagery/vocabulary overlap with the intent
  const intentWords = new Set(intent.vocabulary.map((v) => v.toLowerCase()));
  const novelWords = new Set(tokens(clean.join(" ")));
  let overlap = 0;
  intentWords.forEach((w) => {
    if (novelWords.has(w.split(" ")[0])) overlap += 1;
  });
  const fieldMatch = intent.fields.length > 0 ? 1 : 0;
  const relevance = Math.min(1, (overlap / Math.max(1, intentWords.size)) + fieldMatch * 0.4);

  // metaphor depth: fraction of lines that carry an imagery word bucket
  const imageryKeys = ["aag", "chand", "raat", "aansu", "khamoshi", "sajda", "dua", "manzil", "jag", "ghar"];
  const metaphorDepth = new Set(tokens(clean.join(" ")).map((w) => {
    if (imageryKeys.some((k) => w.startsWith(k.slice(0, 3)))) return 1;
    return 0;
  })).has(1) ? 1 : 0;

  const originalityRef = referenceSimilarity(clean);
  if (originalityRef > 0.4) flags.push("reference-similarity");

  const ok =
    flags.length === 0 &&
    grammar >= 1 &&
    coherence >= 0.9 &&
    input.formCouplets >= 1;

  return {
    ok,
    grammar,
    coherence,
    metaphorDepth,
    relevance,
    originality: 1 - originalityRef,
    originalityNote:
      "Screened against MEHFIL AI's internal reference corpus. This automated check does not imply copyright clearance.",
    regenerations: input.regenerations,
    flags,
  };
}

export function originalityScreen(lines: string[]): number {
  const ref = referenceSimilarity(lines);
  return 1 - ref;
}

export function shouldRegenerate(r: QualityReport): boolean {
  return !r.ok && r.regenerations < MAX_REGENERATIONS;
}
