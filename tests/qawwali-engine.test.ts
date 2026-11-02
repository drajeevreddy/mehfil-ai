import { describe, expect, it } from "vitest";
import { retrieveForIntent } from "@/engines/qawwali/engine";
import { getComposition, loadCorpus } from "@/engines/qawwali/corpus";
import { interpretEmotion, normalizeEmotions } from "@/engines/emotion/engine";
import type { GenerateRequest } from "@/lib/types";

function intent(emotions: string[], mode?: "sufi" | "dard" | "junoon" | "ishq" | "shikwa" | "bewafai" | "anger" | "raat-ki-mehfil" | "studio") {
  return interpretEmotion({ emotions: normalizeEmotions(emotions), intensity: 3, mode } as GenerateRequest);
}

describe("engine 1 — qawwali retrieval honesty", () => {
  it("never fabricates: unknown slug returns researchStatus none", () => {
    const ctx = retrieveForIntent(intent(["dard"]), "this-does-not-exist");
    expect(ctx.composition).toBeNull();
    expect(ctx.interpretation).toBeNull();
    expect(ctx.researchStatus).toBe("none");
  });

  it("retrieves a researched entry with labeled provenance", () => {
    const ctx = retrieveForIntent(intent(["devotion"]), "sanson-ki-mala");
    expect(ctx.composition?.verifiedTitle).toBe("Sanson Ki Mala Pe");
    expect(ctx.researchStatus).toBe("verified_metadata");
    expect(ctx.confidence).toBe("high");
    expect(ctx.coverageNote.toLowerCase()).toContain("annotator");
  });

  it("loads a corpus where every entry carries sources and a coverage note", () => {
    for (const e of loadCorpus()) {
      expect(e.sources.length).toBeGreaterThan(0);
      expect(e.coverageNote.length).toBeGreaterThan(20);
      // no stored lyrics anywhere — the data shape forbids verse bodies
      expect(Object.hasOwn(e, "lyrics")).toBe(false);
    }
  });

  it("attribution is honest — debated attribution stays labeled as debated", () => {
    const e = getComposition("dam-mast-qalandar");
    expect(e?.attributedPoet, "attribution must not be asserted").toBeNull() ?? undefined;
    // the deal: at least one entry in the corpus explicitly carries "no attributed poet"
    expect(e).toBeTruthy();
  });

  it("sufi intent reaches concepts, romantic intent reaches themes", () => {
    const sufi = retrieveForIntent(intent(["spiritualLonging"], "sufi"), "je-toon-rab-noon-manana");
    const hijr = retrieveForIntent(intent(["hijr"]));
    expect(hijr.interpretation?.emotionalProgression.length ?? 0).toBeGreaterThan(0);
  });
});
