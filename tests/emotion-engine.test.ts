import { describe, expect, it } from "vitest";
import { interpretEmotion, normalizeEmotions } from "@/engines/emotion/engine";
import { mixEmotions } from "@/engines/emotion/lexicon";
import type { GenerateRequest } from "@/lib/types";

function intentFor(emotions: string[], intensity = 3): ReturnType<typeof interpretEmotion> {
  return interpretEmotion({ emotions: normalizeEmotions(emotions), intensity } as GenerateRequest);
}

describe("engine 2 — the ten required emotional combinations", () => {
  const cases: [string[], string][] = [
    [["ishq", "gussa"], "complaint"],
    [["bewafai", "pride"], "dignity"],
    [["hijr", "devotion"], "distance-devotion"],
    [["spiritualLonging", "dard"], "meaning-in-suffering"],
    [["longing", "madness"], "restlessness"],
    [["ishq", "dard"], "helplessness"],
    [["tanhai", "hope"], "light-in-empty-room"],
    [["gussa", "heartbreak"], "disappointment"],
    [["surrender", "spiritualLonging"], "surrender"],
    [["nostalgia", "regret"], "the-unfixable-past"],
  ];
  for (const [emotions, hint] of cases) {
    it(`mixes ${emotions.join(" + ")} into a coherent intent (${hint})`, () => {
      const intent = intentFor(emotions, 4);
      expect(intent.primary).toBe(emotions[0]);
      expect(intent.secondary).toContain(emotions[1]);
      expect(intent.conflict).toBeTruthy();
      expect(intent.narrative.length).toBeGreaterThan(10);
      expect(intent.arc).toEqual(emotions);
      // register/field coherence — never incoherent labels
      expect(intent.register).toBeTruthy();
      expect(intent.fields.length).toBeGreaterThan(0);
    });
  }

  it("keeps register sane at extreme intensities", () => {
    const soft = intentFor(["dard"], 1);
    const extreme = intentFor(["junoon"], 5);
    expect(soft.register).not.toBe("volatile");
    expect(extreme.register === "intense" || extreme.register === "volatile").toBe(true);
  });

  it("sufi mode bends direction spiritual", () => {
    const i = intentFor(["ishq"], 3);
    const suffixed = interpretEmotion({
      emotions: normalizeEmotions(["ishq"]),
      intensity: 3,
      mode: "sufi",
    } as GenerateRequest);
    expect(suffixed.direction).toBe("spiritual");
    expect(i.direction).not.toBeUndefined();
  });
});
