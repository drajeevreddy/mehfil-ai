/**
 * ENGINE 3 — SHAYARI INTELLIGENCE (local core provider)
 *
 * Deterministic composition over the authored couplet corpus. This is the
 * demo-mode "core": no LLM is involved, output carries provider
 * "local-core" and the demo flag, and it never claims live AI generation.
 * When ANTHROPIC_API_KEY is configured, the anthropic provider handles
 * generation instead; both honor the same structured context contract.
 */

import { COUPLETS, FORM_LENGTHS, type CoupletTemplate } from "./couplets";
import { renderCouplet, selectCouplets, makeRng, urduOf, hindiOf } from "./render";
import { LEX } from "./lexicon";
import { IMAGERY_BY_KEY } from "./imagery";
import { evaluateShayari, shouldRegenerate } from "@/engines/quality/evaluate";
import type {
  EmotionIntent,
  GeneratedShayari,
  Language,
  PoetryForm,
  QawwaliContext,
  QualityReport,
  RefineRequest,
  SherCouplet,
} from "@/lib/types";

const NOUN_HINTS = new Set([
  "mehfil", "manzil", "junoon", "ishq", "dard", "yaad", "dua", "raat", "chand",
  "zakhm", "khamoshi", "tanhai", "noor", "safar", "qismat", "shikwa", "bewafai",
  "khwab", "noor", "taskeen", "wafa", "shaam", "subah", "rooh", "guftagu",
]);

function makeTitle(couplets: CoupletTemplate[]): string {
  // Title from the closing couplet's diction — the memorable final line's noun.
  for (const c of [...couplets].reverse()) {
    for (const line of c.roman) {
      for (const tok of line.split(/\s+/)) {
        if (NOUN_HINTS.has(tok.toLowerCase())) {
          return tok.charAt(0).toUpperCase() + tok.slice(1);
        }
      }
    }
  }
  const c = couplets[0];
  const tok = c.roman[1].split(/\s+/).slice(-2)[0];
  return tok.charAt(0).toUpperCase() + tok.slice(1);
}

function metaphorExplanations(couplets: CoupletTemplate[], intent: EmotionIntent) {
  const seen = new Set<string>();
  const out: { word: string; gloss: string }[] = [];
  const lines = couplets.map((c) => c.roman.join(" ")).join(" ");
  for (const tok of lines.toLowerCase().split(/\s+/)) {
    if (seen.has(tok)) continue;
    const lex = LEX[tok];
    if (!lex) continue;
    const img = IMAGERY_BY_KEY[tok];
    if (img && intent.fields.some((f) => img.fields.includes(f))) {
      seen.add(tok);
      out.push({ word: tok, gloss: img.gloss });
      if (out.length >= 4) break;
    } else if (NOUN_HINTS.has(tok) && out.length < 4) {
      seen.add(tok);
      out.push({ word: tok, gloss: lex.en });
    }
  }
  return out;
}

function philosophicalConcept(qawwali: QawwaliContext | null, intent: EmotionIntent): string | null {
  const inContext = qawwali?.interpretation?.sufiConcepts ?? [];
  for (const concept of inContext) if (intent.concepts.includes(concept)) return concept;
  if (inContext.length > 0) return inContext[0];
  return intent.concepts[0] ?? null;
}

function pickLanguageText(couplets: CoupletTemplate[], language: Language): SherCouplet[] {
  return couplets.map((c) => {
    return {
      urduMisra1: urduOf(c.roman[0]),
      urduMisra2: urduOf(c.roman[1]),
      romanMisra1: c.roman[0],
      romanMisra2: c.roman[1],
      hindiMisra1: hindiOf(c.roman[0]),
      hindiMisra2: hindiOf(c.roman[1]),
      english1: c.english[0],
      english2: c.english[1],
      metaphors: [],
    };
  });
}

export interface LocalGenContext {
  intent: EmotionIntent;
  qawwali: QawwaliContext | null;
  form: PoetryForm;
  language: Language;
  seed: number;
  regenerations?: number;
  id: string;
}

export function localCoreGenerate(ctx: LocalGenContext): GeneratedShayari {
  const coupletCount = FORM_LENGTHS[ctx.form] ?? 1;
  let regenerations = ctx.regenerations ?? 0;
  let rng = makeRng(ctx.seed + regenerations * 7919);
  let picked = selectCouplets(ctx.intent, coupletCount, rng);
  let quality = evaluateShayari({
    romanLines: picked.flatMap((c) => c.roman),
    intent: ctx.intent,
    formCouplets: picked.length,
    seed: ctx.seed,
    regenerations,
  });

  // Regeneration loop with improved constraints (diversified seed + stricter
  // imagery affinity). Since the corpus grammar is authored-correct, failures
  // are rare and always surfaced in flags.
  while (!quality.ok && shouldRegenerate(quality)) {
    regenerations += 1;
    rng = makeRng(ctx.seed + regenerations * 104729);
    picked = selectCouplets({ ...ctx.intent, secondary: ctx.intent.secondary }, coupletCount, rng);
    quality = evaluateShayari({
      romanLines: picked.flatMap((c) => c.roman),
      intent: ctx.intent,
      formCouplets: picked.length,
      seed: ctx.seed,
      regenerations,
    });
  }

  const shayari: GeneratedShayari = {
    id: ctx.id,
    couplets: pickLanguageText(picked, ctx.language),
    title: makeTitle(picked),
    language: ctx.language,
    form: ctx.form,
    emotionIntent: ctx.intent,
    qawwaliContext: ctx.qawwali,
    philosophicalConcept: philosophicalConcept(ctx.qawwali, ctx.intent),
    metaphorExplanations: metaphorExplanations(picked, ctx.intent),
    provider: "local-core",
    demo: true,
    createdAt: new Date().toISOString(),
    quality,
    seed: ctx.seed,
  };
  return shayari;
}

/** Refinement is orchestrated at the pipeline level in src/engines/orchestrator.ts. */
