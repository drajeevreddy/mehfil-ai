/**
 * POST /api/shayari/translate — returns all script variants of a generated
 * shayari plus a consistency-checked English rendering (English translations
 * ride with the couplets from composition; this endpoint re-verifies they
 * exist and returns the requested view).
 */

import { translateShayari } from "@/engines/orchestrator";
import { clientIp, rateLimit } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(ip, 30)) {
    return Response.json({ error: "rate-limited" }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-json" }, { status: 400 });
  }
  const b = body as { shayari?: unknown; language?: unknown };
  if (!b.shayari || typeof b.shayari !== "object" || !Array.isArray((b.shayari as { couplets?: unknown }).couplets)) {
    return Response.json({ error: "invalid-input", detail: "shayari with couplets required" }, { status: 400 });
  }
  const shayari = b.shayari as never;
  const translations = translateShayari(shayari);
  const target = typeof b.language === "string" && b.language in translations ? b.language : "english";
  // translation consistency check: every couplet must carry a non-empty English line
  const missingEnglish = (shayari as { couplets: { english1?: string; english2?: string }[] }).couplets.filter(
    (c) => !c.english1 || !c.english2
  ).length;
  return Response.json(
    {
      translations,
      view: translations[target as keyof typeof translations],
      consistency: { missingEnglishLines: missingEnglish, ok: missingEnglish === 0 },
    },
    { status: 200 }
  );
}
