import { describe, expect, it } from "vitest";
import { generateShayari, refineShayari } from "@/engines/orchestrator";
import type { GenerateRequest, RefineRequest, GeneratedShayari } from "@/lib/types";
import { localCoreGenerate } from "@/engines/shayari/engine";
import { interpretEmotion, normalizeEmotions } from "@/engines/emotion/engine";
import { retrieveForIntent } from "@/engines/qawwali/engine";

const req = (p: Partial<GenerateRequest>): GenerateRequest => ({
  emotions: normalizeEmotions(p.emotions ?? ["dard"]),
  intensity: p.intensity as 1 | 2 | 3 | 4 | 5,
  language: p.language,
  form: p.form,
  mode: p.mode,
  qawwaliSlug: p.qawwaliSlug,
  seed: p.seed,
});

describe("engine 3 + pipeline", () => {
  it("generates a labeled demo sher in every language, every form", async () => {
    const forms = ["sher", "quatrain", "six-line", "eight-line", "ghazal-inspired"] as const;
    for (const form of forms) {
      const { shayari, demo } = await generateShayari(req({ emotions: ["hijr"], form, seed: 5 }));
      expect(demo).toBe(true);
      expect(shayari.provider).toBe("local-core");
      expect(shayari.demo).toBe(true);
      expect(shayari.couplets.length).toBe(form === "sher" ? 1 : form === "quatrain" ? 2 : form === "six-line" ? 3 : form === "eight-line" ? 4 : 5);
      for (const c of shayari.couplets) {
        // urdu script renders RTL glyphs
        expect(/[\u0600-\u06FF]/.test(c.urduMisra2), c.romanMisra2).toBe(true);
        // devanagari renders
        expect(/[\u0900-\u097F]/.test(c.hindiMisra2), c.romanMisra2).toBe(true);
        // english carries through consistently
        expect(c.english2.length).toBeGreaterThan(0);
        // couplet completeness: both roman misras
        expect(c.romanMisra1.length).toBeGreaterThan(8);
      }
    }
  });

  it("never repeats a couplet inside one poem", async () => {
    const { shayari } = await generateShayari(req({ emotions: ["dard"], form: "ghazal-inspired", seed: 42 }));
    const ids = shayari.couplets.map((c) => c.romanMisra1);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("seeds yield deterministic poems; different seeds wander", async () => {
    const a = await generateShayari(req({ emotions: ["ishq"], form: "quatrain", seed: 777 }));
    const b = await generateShayari(req({ emotions: ["ishq"], form: "quatrain", seed: 777 }));
    expect(a.shayari.couplets[0].romanMisra1).toBe(b.shayari.couplets[0].romanMisra1);
    const c = await generateShayari(req({ emotions: ["ishq"], form: "quatrain", seed: 778 }));
    const diff = c.shayari.couplets.some((x) => !a.shayari.couplets.some((y) => y.romanMisra1 === x.romanMisra1));
    expect(diff).toBe(true);
  });

  it("composition context flows into the generation (Us Dard Ko Likho)", async () => {
    const { shayari } = await generateShayari(req({ emotions: ["devotion", "surrender"], qawwaliSlug: "sanson-ki-mala", form: "sher" }));
    expect(shayari.qawwaliContext?.composition?.slug).toBe("sanson-ki-mala");
    expect(shayari.philosophicalConcept).toBeTruthy();
  });

  const REFINE_ACTIONS = ["deeper", "more-pain", "more-angry", "more-ishq", "more-sufi", "change-ending"] as const;
  for (const action of REFINE_ACTIONS) {
    it(`refine action "${action}" re-biases the intent and regenerates`, async () => {
      const base = await generateShayari(req({ emotions: ["hijr"], form: "quatrain", seed: 9 }));
      const refine: RefineRequest = { shayari: base.shayari, action, seed: 9 };
      const { shayari: refined } = await refineShayari(refine);
      expect(refined.refinementOf).toBe(base.shayari.id);
      expect(refined.couplets.length).toBe(base.shayari.couplets.length);
      switch (action) {
        case "more-sufi":
          expect(refined.emotionIntent.direction).toBe("spiritual");
          break;
        case "more-angry":
          expect(refined.emotionIntent.secondary).toContain("gussa");
          break;
        case "more-pain":
          expect(refined.emotionIntent.secondary).toContain("dard");
          break;
        default:
          break;
      }
    });
  }

  it("refine diversity: change-ending selects a different closing couplet", async () => {
    const a = await generateShayari(req({ emotions: ["ishq"], intensity: 4, form: "six-line", seed: 3 }));
    const b: GeneratedShayari = (await refineShayari({ shayari: a.shayari, action: "change-ending", seed: 3 })).shayari;
    const endingA = a.shayari.couplets.at(-1)?.romanMisra2;
    const endingB = b.couplets.at(-1)?.romanMisra2;
    // the closing couplet of the poem is re-composed, not re-stated
    expect(endingA !== endingB, `same ending: ${endingA}`).toBe(true);
    expect(endingB).toBeTruthy();
  });

  it("quality gate runs and stays honest about its limits", async () => {
    const { shayari } = await generateShayari(req({ emotions: ["gussa"], intensity: 5, form: "quatrain", seed: 31 }));
    expect(shayari.quality.ok).toBe(true);
    expect(shayari.quality.originalityNote).toContain("does not imply copyright clearance");
  });

  it("local core never claims an LLM provider", () => {
    const intent = interpretEmotion({ emotions: normalizeEmotions(["dard"]) } as GenerateRequest);
    const ctx = retrieveForIntent(intent);
    const s = localCoreGenerate({ intent, qawwali: ctx, form: "sher", language: "urdu", seed: 1, id: "t" });
    expect(s.provider).toBe("local-core");
    expect(s.demo).toBe(true);
  });
});
