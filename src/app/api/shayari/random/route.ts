/**
 * POST /api/shayari/random — controlled randomness across all generation
 * dimensions: random emotion combination, philosopher concept direction,
 * imagery, structure and language. Not random words — every roll keeps a
 * meaningful poetic direction and passes through the same three engines.
 */

import { generateShayari } from "@/engines/orchestrator";
import { providerStatus } from "@/engines/providers";
import { clientIp, rateLimit } from "@/lib/api-utils";
import { EMOTION_KEYS } from "@/lib/api-utils";
import { EMOTION_ENTRY } from "@/engines/emotion/lexicon";
import { IMAGERY, imageryForFields } from "@/engines/shayari/imagery";
import type { EmotionKey, PoetryForm } from "@/lib/types";

export const runtime = "nodejs";

const RANDOM_FILTERS = ["surprise", "deepest-pain", "most-intense-ishq", "spiritual-reflection", "broken-promises", "silent-love", "unspoken-anger"] as const;
const FORMS: PoetryForm[] = ["sher", "quatrain", "six-line", "eight-line", "ghazal-inspired"];
const LANGS = ["urdu", "roman", "hindi", "urdu-en"];

/** Filter presets bias the roll — they never replace the engines. */
const FILTER_BIAS: Record<string, { emotions: EmotionKey[]; intensity: number; mode?: string }> = {
  surprise: { emotions: [], intensity: 3 },
  "deepest-pain": { emotions: ["dard", "hijr", "tanhai"], intensity: 5, mode: "dard" },
  "most-intense-ishq": { emotions: ["ishq", "junoon", "longing"], intensity: 5, mode: "ishq" },
  "spiritual-reflection": { emotions: ["spiritualLonging", "surrender", "devotion"], intensity: 3, mode: "sufi" },
  "broken-promises": { emotions: ["bewafai", "regret", "heartbreak"], intensity: 4, mode: "bewafai" },
  "silent-love": { emotions: ["ishq", "wafa", "sabr"], intensity: 2, mode: "raat-ki-mehfil" },
  "unspoken-anger": { emotions: ["gussa", "pride", "shikwa"], intensity: 4, mode: "anger" },
};

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(ip, 12)) {
    return Response.json({ error: "rate-limited", detail: "Too many rolls — let the dice settle for a minute." }, { status: 429 });
  }
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }
  const filter = typeof body.filter === "string" && RANDOM_FILTERS.includes(body.filter as never) ? body.filter : "surprise";
  const bias = FILTER_BIAS[filter];

  // Controlled randomness: seed from request salt or server time.
  const seed = typeof body.seed === "number" ? Math.floor(body.seed) : Math.floor(Math.random() * 2 ** 31);
  const s = Math.sin(seed) * 43758.5453;
  let a0 = Math.floor((s - Math.floor(s)) * 2 ** 31) >>> 0;
  const rng = () => {
    a0 |= 0;
    a0 = (a0 + 0x6d2b79f5) | 0;
    let t = Math.imul(a0 ^ (a0 >>> 15), 1 | a0);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // 1. emotion: one primary from the filter set (or any), 0-2 secondaries
  const primaryPool: EmotionKey[] = bias.emotions.length > 0 ? bias.emotions.filter((e) => EMOTION_ENTRY[e]) : [...EMOTION_KEYS];
  const primary = pick(rng, primaryPool.length > 0 ? primaryPool : (["dard"] as EmotionKey[]));
  const allKeys = EMOTION_KEYS.filter((e) => e !== primary);
  const secondaryCount = rng() < 0.45 ? 1 : rng() < 0.75 ? 1 : 0;
  const secondaries: EmotionKey[] = [];
  while (secondaries.length < Math.min(secondaryCount, allKeys.length)) {
    const e = pick(rng, allKeys);
    if (!secondaries.includes(e)) secondaries.push(e);
  }

  // 2. structure, language, imagery — rolled but always coherent
  const form = pick(rng, FORMS);
  const language = pick(rng, LANGS);
  const imageryPool = imageryForFields(EMOTION_ENTRY[primary].fields, 4).map((i) => i.key);

  const result = await generateShayari(
    {
      emotions: [primary, ...secondaries],
      intensity: (bias.intensity ?? 3) as 1 | 2 | 3 | 4 | 5,
      language: language as never,
      form,
      mode: bias.mode as never,
      seed,
    },
    { language: language as never }
  );

  return Response.json({
    shayari: result.shayari,
    demo: result.demo,
    provider: providerStatus(),
    roll: {
      filter,
      primary,
      secondary: secondaries,
      form,
      language,
      imageryPool,
      referenced: IMAGERY.filter((i) => imageryPool.includes(i.key)).map((i) => i.key),
    },
  });
}
