import { describe, expect, it } from "vitest";
import { tokens, urduOf, hindiOf } from "@/engines/shayari/render";
import { COUPLETS } from "@/engines/shayari/couplets";
import { LEX } from "@/engines/shayari/lexicon";
import { IMAGERY } from "@/engines/shayari/imagery";

describe("corpus coverage", () => {
  it("every roman token resolves in the lexicon", () => {
    const missing = new Set<string>();
    for (const c of COUPLETS) {
      for (const line of c.roman) {
        for (const t of tokens(line)) {
          if (!LEX[t]) missing.add(t);
        }
      }
    }
    expect([...missing], `missing lexicon entries: ${[...missing].join(", ")}`).toEqual([]);
  });

  it("renders non-empty urdu and hindi lines", () => {
    for (const c of COUPLETS.slice(0, 5)) {
      const ur = urduOf(c.roman[0]);
      expect(ur.length).toBeGreaterThan(0);
      expect(/[\u0600-\u06FF]/.test(ur)).toBe(true);
      const hi = hindiOf(c.roman[1]);
      expect(/[\u0900-\u097F]/.test(hi)).toBe(true);
    }
  });
});

describe("imagery", () => {
  it("glosses are non-empty and english-only", () => {
    for (const i of IMAGERY) {
      expect(i.gloss.length).toBeGreaterThan(4);
      expect(/[\u0600-\u06FF\u0900-\u097F]/.test(i.gloss)).toBe(false);
    }
  });
});
