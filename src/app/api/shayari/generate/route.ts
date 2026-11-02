import { generateShayari } from "@/engines/orchestrator";
import { providerStatus } from "@/engines/providers";
import { clientIp, rateLimit, validateGenerate } from "@/lib/api-utils";
import { pushHistory } from "@/app/api/shayari/history/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(ip, 12)) {
    return Response.json({ error: "rate-limited", detail: "Too many generations — wait a minute, the mehfil is still lit." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad-json" }, { status: 400 });
  }
  const input = validateGenerate(body);
  if (typeof input === "string") {
    return Response.json({ error: "invalid-input", detail: input }, { status: 400 });
  }
  const result = await generateShayari({ ...input, language: input.language as never, mode: input.mode as never });
  pushHistory({
    id: result.shayari.id,
    createdAt: result.shayari.createdAt,
    preview: result.shayari.couplets[0]?.romanMisra1 ?? "",
    request: input,
  });
  return Response.json(
    {
      shayari: result.shayari,
      demo: result.demo,
      provider: providerStatus(),
    },
    { status: 200 }
  );
}
