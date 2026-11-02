import { refineShayari } from "@/engines/orchestrator";
import { clientIp, rateLimit } from "@/lib/api-utils";
import type { RefineRequest } from "@/lib/types";

export const runtime = "nodejs";

const VALID_ACTIONS = ["deeper", "more-pain", "more-angry", "more-ishq", "more-sufi", "change-ending"];

function validateRefine(body: unknown): RefineRequest | string {
  if (!body || typeof body !== "object") return "Body must be a JSON object";
  const b = body as Record<string, unknown>;
  const shayari = b.shayari;
  if (!shayari || typeof shayari !== "object") return "shayari object required";
  const s = shayari as Record<string, unknown>;
  if (!Array.isArray(s.couplets) || s.couplets.length === 0) return "shayari.couplets required";
  if (typeof b.action !== "string" || !VALID_ACTIONS.includes(b.action)) return `action must be one of ${VALID_ACTIONS.join(", ")}`;
  return {
    shayari: s as never,
    action: b.action as RefineRequest["action"],
    language: typeof b.language === "string" ? (b.language as never) : undefined,
    seed: typeof b.seed === "number" ? Math.floor(b.seed) : undefined,
  };
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(ip, 16)) {
    return Response.json({ error: "rate-limited" }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-json" }, { status: 400 });
  }
  const input = validateRefine(body);
  if (typeof input === "string") {
    return Response.json({ error: "invalid-input", detail: input }, { status: 400 });
  }
  const result = await refineShayari(input);
  return Response.json({ shayari: result.shayari, demo: result.demo }, { status: 200 });
}
