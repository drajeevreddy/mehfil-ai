/**
 * GET /api/qawwali — the researched catalog (public knowledge area).
 * Response always carries coverage transparency: corpus size, statuses,
 * and the partial-coverage note.
 */

import { listCorpus } from "@/engines/qawwali/engine";

export const runtime = "nodejs";
export const revalidate = 60;

export function GET(): Response {
  const corpus = listCorpus();
  const verifiedCount = corpus.filter((e: { researchStatus: string }) => e.researchStatus === "verified_metadata").length;
  return Response.json({
    count: corpus.length,
    verifiedCount,
    coverageNote:
      "The researched catalog covers documented compositions verified against public sources. MEHFIL AI never claims researched-repertoire completeness.",
    entries: corpus,
  });
}
