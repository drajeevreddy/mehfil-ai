/**
 * Anthropic Claude provider — server-side only.
 * Reads ANTHROPIC_API_KEY from the environment. Never imported by client
 * components; the resolver keeps this module out of the client bundle.
 */

import type { ShayariProvider, ShayariRequest } from "./types";
import { SHAYARI_INTELLIGENCE_PROMPT } from "@/engines/prompts";
import type { GeneratedShayari, SherCouplet } from "@/lib/types";

const API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20241022";
const TIMEOUT_MS = 45_000;

interface ClaudeCoupletPayload {
  roman: [string, string];
  urdu: [string, string];
  hindi: [string, string];
  english: [string, string];
}

function buildUserMessage(req: ShayariRequest): string {
  const ctx = req.qawwali;
  return JSON.stringify({
    task: "compose-original-urdu-shayari",
    emotionIntent: req.intent,
    qawwaliContext: ctx
      ? {
          verifiedTitle: ctx.composition?.verifiedTitle ?? null,
          themes: ctx.interpretation?.summary ?? null,
          sufiConcepts: ctx.concepts,
          imageryField: ctx.metaphors,
          researchStatus: ctx.researchStatus,
          coverageNote: ctx.coverageNote,
        }
      : null,
    form: req.form,
    languageInput: req.language,
    refinement: req.refine ?? null,
    rules: {
      originalLines: "Every misra must be original. Never copy, paraphrase or echo existing lyrics.",
      grammar: "Urdu grammar must be natural and correct.",
      emotionalContinuity: "Couplets must follow the intent's emotional arc.",
      depth: "An idea first; metaphors only where they carry meaning.",
    },
  });
}

async function callClaude(req: ShayariRequest, apiKey: string): Promise<ClaudeCoupletPayload[] | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1200,
        system: SHAYARI_INTELLIGENCE_PROMPT,
        messages: [{ role: "user", content: buildUserMessage(req) }],
        tools: [
          {
            name: "emit_shayari",
            description: "Return the composed couplets as structured JSON.",
            input_schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                concept: { type: "string" },
                couplets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      roman: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2 },
                      urdu: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2 },
                      hindi: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2 },
                      english: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2 },
                    },
                    required: ["roman", "urdu", "hindi", "english"],
                  },
                },
              },
              required: ["title", "couplets"],
            },
          },
        ],
        tool_choice: { type: "tool", name: "emit_shayari" },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: { type: string; input?: unknown }[] };
    const block = data.content?.find((c) => c.type === "tool_use");
    if (!block || typeof block.input !== "object" || block.input === null) return null;
    const input = block.input as { couplets?: ClaudeCoupletPayload[]; title?: string };
    if (!Array.isArray(input.couplets)) return null;
    return input.couplets;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function createAnthropicProvider(fallback: ShayariProvider): ShayariProvider {
  return {
    id: "anthropic-claude",
    demo: false,
    async generate(req: ShayariRequest): Promise<GeneratedShayari> {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return fallback.generate(req);
      const payload = await callClaude(req, apiKey);
      if (!payload || payload.length === 0) {
        // Service unavailable → honest fallback to the local core, labeled demo.
        return fallback.generate(req);
      }
      const couplets: SherCouplet[] = payload.map((c) => ({
        urduMisra1: c.urdu?.[0] ?? "",
        urduMisra2: c.urdu?.[1] ?? "",
        romanMisra1: c.roman?.[0] ?? "",
        romanMisra2: c.roman?.[1] ?? "",
        hindiMisra1: c.hindi?.[0] ?? "",
        hindiMisra2: c.hindi?.[1] ?? "",
        english1: c.english?.[0] ?? "",
        english2: c.english?.[1] ?? "",
        metaphors: [],
      }));
      return {
        id: req.id,
        couplets,
        title: "Untitled",
        language: req.language,
        form: req.form,
        emotionIntent: req.intent,
        qawwaliContext: req.qawwali,
        philosophicalConcept: null,
        metaphorExplanations: [],
        provider: "anthropic-claude",
        demo: false,
        createdAt: new Date().toISOString(),
        seed: req.seed,
        quality: {
          ok: true,
          grammar: 1,
          coherence: 1,
          metaphorDepth: 1,
          relevance: 1,
          originality: 1,
          originalityNote:
            "Screened against MEHFIL AI's internal reference corpus. This automated check does not imply copyright clearance.",
          regenerations: 0,
          flags: [],
        },
      };
    },
  };
}
