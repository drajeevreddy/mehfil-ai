/**
 * Provider abstraction for the Shayari generation step.
 * - local-core: deterministic composer (always available, labeled demo).
 * - anthropic-claude: live LLM generation, server-side only, activated by
 *   ANTHROPIC_API_KEY. Structured JSON output enforced by tool schema.
 * No credentials ever reach the client.
 */

import type {
  EmotionIntent,
  GeneratedShayari,
  Language,
  PoetryForm,
  QawwaliContext,
  RefineRequest,
} from "@/lib/types";

export interface ShayariRequest {
  intent: EmotionIntent;
  qawwali: QawwaliContext | null;
  form: PoetryForm;
  language: Language;
  seed: number;
  id: string;
  /** For anthropic refinement: the couplet lines to rework. */
  refine?: { action: RefineRequest["action"]; baseLines: [string, string][] };
}

export interface ShayariProvider {
  id: "local-core" | "anthropic-claude";
  /** True when the provider is the demo core (no live LLM involved). */
  demo: boolean;
  generate(req: ShayariRequest): Promise<GeneratedShayari>;
}
