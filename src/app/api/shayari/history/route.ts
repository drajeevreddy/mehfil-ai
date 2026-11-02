/**
 * GET /api/shayari/history — session-scoped recent generations.
 * The user's saved poetry lives in browser storage (My Mehfil); this
 * endpoint returns the server process's recent ring buffer only.
 * Persistence is deliberately browser-side (PRODUCT.md decision).
 */

export const runtime = "nodejs";

const history: unknown[] = [];
export const pushHistory = (entry: unknown): void => {
  history.push(entry);
  if (history.length > 50) history.shift();
};

export function GET() {
  return Response.json({
    note: "Session-scoped server history. Saved poetry lives in your browser (My Mehfil), not on the server.",
    entries: history,
  });
}
