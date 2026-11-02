/**
 * Server-side API helpers: input validation, rate limiting, timeouts.
 * These never trust client input and never expose credentials.
 */

import type { EmotionKey, PoetryForm } from "@/lib/types";

export const EMOTION_KEYS: EmotionKey[] = [
  "ishq", "dard", "junoon", "gussa", "bewafai", "hijr", "wafa", "tanhai",
  "shikwa", "sabr", "surrender", "devotion", "regret", "nostalgia", "hope",
  "loneliness", "heartbreak", "longing", "madness", "pride", "jealousy",
  "spiritualLonging",
];

export const VALID_FORMS: PoetryForm[] = [
  "sher", "quatrain", "six-line", "eight-line", "ghazal-inspired",
];

export const VALID_LANGUAGES = ["urdu", "roman", "hindi", "english", "urdu-en"];

export interface ValidatedGenerateInput {
  emotions: EmotionKey[];
  intensity: 1 | 2 | 3 | 4 | 5;
  language: string;
  form: PoetryForm;
  mode?: string;
  qawwaliSlug?: string;
  seed?: number | undefined;
}

export function validateGenerate(body: unknown): ValidatedGenerateInput | string {
  if (!body || typeof body !== "object") return "Body must be a JSON object";
  const b = body as Record<string, unknown>;
  const emotions = Array.isArray(b.emotions)
    ? b.emotions.filter((e): e is EmotionKey => typeof e === "string" && EMOTION_KEYS.includes(e as EmotionKey))
    : [];
  if (emotions.length === 0) return "emotions: at least one valid emotion required";
  if (emotions.length > 4) return "emotions: at most 4 emotions";
  const intensity = typeof b.intensity === "number" ? Math.max(1, Math.min(5, Math.round(b.intensity))) : 3;
  const language = typeof b.language === "string" && VALID_LANGUAGES.includes(b.language) ? b.language : "roman";
  const form = typeof b.form === "string" && VALID_FORMS.includes(b.form as PoetryForm) ? (b.form as PoetryForm) : "sher";
  const mode = typeof b.mode === "string" ? b.mode : undefined;
  const qawwaliSlug = typeof b.qawwaliSlug === "string" ? b.qawwaliSlug : undefined;
  const seed = typeof b.seed === "number" && Number.isFinite(b.seed) ? Math.floor(b.seed) : undefined;
  return { emotions, intensity: intensity as 1 | 2 | 3 | 4 | 5, language, form, mode, qawwaliSlug, seed };
}

/** Simple in-memory token bucket (per process). */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, limit = 12, windowMs = 60_000): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "local";
}

/** Validate a research admin payload (shape only; no trust). */
export function validateResearchPayload(body: unknown): string {
  if (!body || typeof body !== "object") return "Body must be a JSON object";
  const b = body as Record<string, unknown>;
  // research payloads must not carry lyrics — this check runs before shape checks
  const forbiddenFields = ["lyrics", "verses", "transcription"];
  for (const f of forbiddenFields) {
    if (f in b) return `field "${f}" is not permitted — lyrics and transcriptions are never stored`;
  }
  if (typeof b.slug !== "string" || !/^[a-z0-9-]{2,64}$/.test(b.slug)) return "slug: kebab-case required";
  if (typeof b.verifiedTitle !== "string" || b.verifiedTitle.length < 2) return "verifiedTitle required";
  return "";
}

export async function jsonOr<T>(res: Promise<Response>, fallbackStatus = 500): Promise<Response> {
  try {
    return await res;
  } catch (e) {
    return Response.json({ error: "internal-error", detail: String(e) }, { status: fallbackStatus });
  }
}
