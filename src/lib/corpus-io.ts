/** Shared corpus io helpers. */

export function coerceList(parsed: unknown): Record<string, unknown>[] {
  return Array.isArray(parsed) ? (parsed as Record<string, unknown>[]) : [];
}
