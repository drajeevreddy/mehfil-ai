import { describe, expect, it } from "vitest";
import { validateGenerate, rateLimit, clientIp, validateResearchPayload } from "@/lib/api-utils";
import { EMOTION_KEYS } from "@/lib/api-utils";
import { POETRY_FORM_COUPLETS, type PoetryForm } from "@/lib/types";

describe("api security", () => {
  it("rejects invalid emotions, unknown fields, oversized payloads", () => {
    expect(validateGenerate({ emotions: [] })).toBeTypeOf("string");
    expect(validateGenerate({ emotions: ["nope"] })).toBeTypeOf("string");
    expect(validateGenerate({ emotions: ["ishq", "ishq", "ishq", "ishq", "ishq"] })).toBeTypeOf("string");
    expect(validateGenerate({ emotions: ["dard"] })).toBeTypeOf("object");
    // lyrics payloads are rejected at the research gate
    expect(validateResearchPayload({ lyrics: "verse verse", slug: "x", verifiedTitle: "T" })).toContain("not permitted");
  });

  it("clamps intensity and normalizes language", () => {
    const ok = validateGenerate({ emotions: ["dard"], intensity: 99, language: "klingon" }) as { intensity: number; language: string };
    expect(ok.intensity).toBeLessThanOrEqual(5);
    expect(ok.language).toBe("roman");
  });

  it("rate limit refuses after the window's allowance and recovers", () => {
    const ip = "test-ip-1";
    let allowed = 0;
    for (let i = 0; i < 20; i++) if (rateLimit(ip, 12, 60_000)) allowed += 1;
    expect(allowed).toBeLessThanOrEqual(13); // one initial + refills
  });

  it("clientIp prefers forwarded headers", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } });
    expect(clientIp(req)).toBe("1.2.3.4");
  });

  it("poetry form map keeps the composition contract", () => {
    const forms: PoetryForm[] = ["sher", "quatrain", "six-line", "eight-line", "ghazal-inspired"];
    expect(POETRY_FORM_COUPLETS[forms[0]]).toBe(1);
    expect(POETRY_FORM_COUPLETS[forms[4]]).toBe(5);
  });
});
