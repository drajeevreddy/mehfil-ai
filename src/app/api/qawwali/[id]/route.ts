import { getComposition } from "@/engines/qawwali/engine";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getComposition(id);
  if (!entry) {
    // An unfound slug is never silently presented as verified research.
    return Response.json({ error: "not-found", detail: `No researched entry for "${id}".` }, { status: 404 });
  }
  return Response.json({ entry });
}
