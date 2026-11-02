/**
 * POST /api/qawwali/[id]/generate — Us Dard Ko Likho entry. Retrieves the
 * research profile for the composition, then runs the full engine pipeline
 * with the user's chosen emotion combination.
 */

import { generateShayari } from "@/engines/orchestrator";
import { clientIp, rateLimit, validateGenerate } from "@/lib/api-utils";
import { getComposition } from "@/engines/qawwali/engine";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = clientIp(req);
  if (!rateLimit(ip, 12)) {
    return Response.json({ error: "rate-limited" }, { status: 429 });
  }
  const { id } = await params;
  const entry = getComposition(id);
  if (!entry) {
    return Response.json({ error: "not-found", detail: `No researched entry for "${id}".` }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const b = body as Record<string, unknown>;
  const input = validateGenerate({ ...b, qawwaliSlug: id });
  if (typeof input === "string") {
    return Response.json({ error: "invalid-input", detail: input }, { status: 400 });
  }
  const result = await generateShayari({ ...input, language: input.language as never, mode: input.mode as never });
  return Response.json({ shayari: result.shayari, demo: result.demo }, { status: 200 });
}
