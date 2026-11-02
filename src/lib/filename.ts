/** download filename helper */

export function fileNameFor(title: string, format: string): string {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "mehfil-sher";
  const fmt = format.replace(":", "x");
  return `mehfil-${slug}-${fmt.replace("x", "x")}.png`.replace("xx", "4x5").replace("9x16", "9x16");
}
