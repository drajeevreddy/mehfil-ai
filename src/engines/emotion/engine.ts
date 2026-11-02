/**
 * ENGINE 2 — EMOTION INTELLIGENCE (service)
 *
 * Interprets the emotional intention behind a request into a structured
 * EmotionIntent. Interprets rather than labels: a user choosing
 * [ishq + gussa] wants an emotional complaint, not two stickers.
 */

import {
  EMOTION_ENTRY,
  mixEmotions,
} from "./lexicon";
import type {
  EmotionIntent,
  EmotionKey,
  GenerateRequest,
  Intensity,
  PoetryMode,
} from "@/lib/types";

/** Emotional mode preferences — each mode biases direction & register. */
export const MODE_BIAS: Record<PoetryMode, { direction?: string; fields: string[]; concept?: string }> = {
  dard: { fields: ["aansu", "khamoshi", "raat", "aag"], concept: "dard-e-dil" },
  junoon: { fields: ["aag", "zanjeer", "raasta"], concept: "junoon-e-ishq" },
  ishq: { fields: ["dil", "raat", "chand"], concept: "ishq-e-majazi" },
  shikwa: { fields: ["kismat", "dastoor", "dua"], concept: "shikwa" },
  bewafai: { fields: ["zakhm", "dastoor", "khamoshi"], concept: "bewafai" },
  sufi: { fields: ["sajda", "rooh", "noor", "dua"], concept: "ishq-e-haqiqi" },
  anger: { fields: ["aag", "dastoor", "zakhm"], concept: "qahr" },
  "raat-ki-mehfil": { fields: ["raat", "chand", "khamoshi", "mehfil"], concept: "gham-e-shab" },
  studio: { fields: [], concept: undefined },
};

export function detectIntensity(request: GenerateRequest): Intensity {
  const i = request.intensity ?? 3;
  return Math.min(5, Math.max(1, i)) as Intensity;
}

export function normalizeEmotions(raw: unknown): EmotionKey[] {
  if (!Array.isArray(raw)) return [];
  const valid = new Set(Object.keys(EMOTION_ENTRY));
  return raw.filter((e): e is EmotionKey => typeof e === "string" && valid.has(e as EmotionKey));
}

/**
 * Deterministic interpretation. The Anthropic provider may refine this via
 * LLM, but the local core keeps identical semantics so tests are stable.
 */
export function interpretEmotion(request: GenerateRequest): EmotionIntent {
  const emotions = normalizeEmotions(request.emotions);
  const intensity = detectIntensity(request);
  const mode: PoetryMode = request.mode ?? "studio";
  const mixed = mixEmotions(emotions.length ? emotions : ["dard"], intensity);
  const bias = MODE_BIAS[mode];

  const intent: EmotionIntent = {
    primary: mixed.primary,
    secondary: mixed.secondary,
    intensity,
    conflict: mixed.conflict,
    register: mixed.register,
    direction: mode === "sufi" ? "spiritual" : mixed.direction,
    narrative: mixed.narrative,
    arc: mixed.arc,
    fields: [...new Set([...mixed.fields, ...bias.fields])],
    concepts: bias.concept ? [...new Set([...mixed.concepts, bias.concept])] : mixed.concepts,
    vocabulary: mixed.vocabulary,
    mode,
  };

  // Raat ki Mehfil is an atmosphere: it always bends the register toward quiet.
  if (mode === "raat-ki-mehfil" && intent.register === "volatile") intent.register = "intense";
  if (mode === "sufi" && intent.register === "volatile") intent.register = "dramatic";

  return intent;
}
