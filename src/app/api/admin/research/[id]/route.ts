/**
 * PATCH /api/admin/research/[id] — update an existing research record
 * (review queue entries). Same protection as POST.
 */

import fs from "node:fs";
import path from "node:path";
import { clientIp, rateLimit } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = clientIp(req);
  if (!rateLimit(ip, 10)) return Response.json({ error: "rate-limited" }, { status: 429 });

  const expected = process.env.MEHFIL_ADMIN_KEY;
  const provided = req.headers.get("x-mehfil-admin-key");
  if (!expected) {
    return Response.json(
      { error: "admin-unconfigured", detail: "Admin research requires MEHFIL_ADMIN_KEY." },
      { status: 501 }
    );
  }
  if (provided !== expected) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-json" }, { status: 400 });
  }

  const queuePath = path.join(process.cwd(), "research", "research-queue.json");
  try {
    if (!fs.existsSync(queuePath)) {
      return Response.json({ error: "not-found" }, { status: 404 });
    }
    const queue = JSON.parse(fs.readFileSync(queuePath, "utf8")) as unknown[];
    const idx = (queue as { slug?: string }[]).findIndex((e) => e && e.slug === id);
    if (idx === -1) return Response.json({ error: "not-found" }, { status: 404 });
    queue[idx] = { ...(queue[idx] as object), ...(body as object), slug: id };
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: "write-failed", detail: String(e) }, { status: 500 });
  }
}
