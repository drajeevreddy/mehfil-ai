/**
 * POST /api/admin/research — protected research ingestion endpoint.
 * Authorization: `x-mehfil-admin-key` must match MEHFIL_ADMIN_KEY env.
 * Demo mode (no key configured) returns an explicit 501 — it never pretends
 * live admin writes happened. In persistence-enabled deployments no lyrics
 * may be stored: payloads are shape-checked for forbidden lyric fields.
 */

import fs from "node:fs";
import path from "node:path";
import { clientIp, rateLimit, validateResearchPayload } from "@/lib/api-utils";
import { coerceList } from "@/lib/corpus-io";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(ip, 10)) return Response.json({ error: "rate-limited" }, { status: 429 });

  const expected = process.env.MEHFIL_ADMIN_KEY;
  const provided = req.headers.get("x-mehfil-admin-key");
  if (!expected) {
    return Response.json(
      {
        error: "admin-unconfigured",
        detail:
          "Admin research is not configured on this server. Admin writes require MEHFIL_ADMIN_KEY; public users can never access administrative operations.",
      },
      { status: 501 }
    );
  }
  if (provided !== expected) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-json" }, { status: 400 });
  }
  const invalid = validateResearchPayload(body);
  if (invalid) return Response.json({ error: "invalid-input", detail: invalid }, { status: 400 });

  // Demo/local mode: draft entries are written to the review queue file so the
  // researcher can inspect them before promotion into research/corpus-seed.json.
  const queuePath = path.join(process.cwd(), "research", "research-queue.json");
  try {
    fs.mkdirSync(path.dirname(queuePath), { recursive: true });
    const queue = coerceList(fs.existsSync(queuePath) ? JSON.parse(fs.readFileSync(queuePath, "utf8")) : []);
    queue.push(body as Record<string, unknown>);
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
    return Response.json({ ok: true, queued: true, queueSize: queue.length, note: "Queued for review; not yet part of the verified corpus." }, { status: 201 });
  } catch (e) {
    return Response.json({ error: "write-failed", detail: String(e) }, { status: 500 });
  }
}
