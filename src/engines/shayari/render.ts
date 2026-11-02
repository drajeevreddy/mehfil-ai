/**
 * Couple text renderer — roman is the authored source of truth; Urdu script
 * and Devanagari resolve mechanically through the lexicon so the scripts
 * agree with the roman line word-for-word.
 */

import { LEX, type LexWord } from "./lexicon";
import { COUPLETS, type CoupletTemplate } from "./couplets";
import type { EmotionIntent } from "@/lib/types";

export function tokens(line: string): string[] {
  return line
    .toLowerCase()
    .replace(/[،.!?"'’‘,-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function resolveToken(tok: string): LexWord | null {
  return LEX[tok] ?? null;
}

function script(line: string, pick: (w: LexWord) => string): string {
  return tokens(line)
    .map((t) => {
      const w = LEX[t];
      return w ? pick(w) : t; // coverage test guarantees every token resolves
    })
    .join(" ");
}

export function urduOf(line: string): string {
  return script(line, (w) => w.urdu);
}

export function hindiOf(line: string): string {
  return script(line, (w) => w.hindi);
}

/* ------------------------------------------------------------------ */

export interface RenderedCouplet {
  template: CoupletTemplate;
  roman: [string, string];
  urdu: [string, string];
  hindi: [string, string];
  english: [string, string];
}

export function renderCouplet(t: CoupletTemplate): RenderedCouplet {
  return {
    template: t,
    roman: t.roman,
    urdu: [urduOf(t.roman[0]), urduOf(t.roman[1])],
    hindi: [hindiOf(t.roman[0]), hindiOf(t.roman[1])],
    english: t.english,
  };
}

/* ------------------------------------------------------------------ */
/* Couplet selection                                                   */
/* ------------------------------------------------------------------ */

/** Mulberry32 — small deterministic PRNG so a seed always yields one poem. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function scoreCouplet(t: CoupletTemplate, intent: EmotionIntent): number {
  let score = 0;
  if (t.registers.includes(intent.register)) score += 3;
  for (const e of t.emotions) {
    if (e === intent.primary) score += 4;
    else if (intent.secondary.includes(e)) score += 3;
    else if (intent.arc.includes(e)) score += 2;
  }
  for (const f of t.fields) if (intent.fields.includes(f)) score += 2;
  if (intent.concepts.some((c) => t.concept === c)) score += 2;
  return score;
}

export function selectCouplets(
  intent: EmotionIntent,
  count: number,
  rng: () => number
): CoupletTemplate[] {
  const candidates = COUPLETS.map((t) => ({ t, score: scoreCouplet(t, intent) }));
  const pool = candidates.filter((c) => c.score > 0);
  const usable = (pool.length >= count ? pool : candidates).sort((a, b) => b.score - a.score);


  // Fisher-Yates shuffle the whole usable pool with our RNG so every pick
  // is genuinely random within the affinity-ranked order — not locked to a
  // top-4 window that keeps returning the same couplet.
  const shuffled = usable.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const picked: CoupletTemplate[] = [];
  const usedFirstWords = new Set<string>();
  const usedRhymes = new Map<string, number>();

  for (const cand of shuffled) {
    if (picked.length >= count) break;
    const t = cand.t;
    if (picked.some((p) => p.id === t.id)) continue;
    if (usedFirstWords.has(t.roman[0].split(" ")[0])) continue;
    if ((usedRhymes.get(t.rhyme ?? "-") ?? 0) >= 2) continue;
    picked.push(t);
    usedFirstWords.add(t.roman[0].split(" ")[0]);
    usedRhymes.set(t.rhyme ?? "-", (usedRhymes.get(t.rhyme ?? "-") ?? 0) + 1);
  }

  // If constraints starved the pool, fill from remaining shuffled candidates
  // ignoring first-word/rhyme rules rather than repeating.
  if (picked.length < count) {
    for (const cand of shuffled) {
      if (picked.length >= count) break;
      if (picked.some((p) => p.id === cand.t.id)) continue;
      picked.push(cand.t);
    }
  }
  return picked;
}
