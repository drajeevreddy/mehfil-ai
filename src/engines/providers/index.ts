/**
 * Provider resolver — keeps credential logic server-side. When
 * ANTHROPIC_API_KEY is absent the local core provider handles generation and
 * everything it returns is labeled demo. Client code never sees a key.
 */

import { createAnthropicProvider } from "./anthropic";
import type { ShayariProvider } from "./types";
import { localCoreGenerate } from "@/engines/shayari/engine";
import type { ShayariRequest } from "./types";

export const localCoreProvider: ShayariProvider = {
  id: "local-core",
  demo: true,
  async generate(req: ShayariRequest) {
    return localCoreGenerate({
      intent: req.intent,
      qawwali: req.qawwali,
      form: req.form,
      language: req.language,
      seed: req.seed,
      id: req.id,
    });
  },
};

export function resolveProvider(): ShayariProvider {
  return createAnthropicProvider(localCoreProvider);
}

export function providerStatus(): { provider: string; demo: boolean; reason?: string } {
  if (process.env.ANTHROPIC_API_KEY) {
    return { provider: "anthropic-claude", demo: false };
  }
  return {
    provider: "local-core",
    demo: true,
    reason: "ANTHROPIC_API_KEY not configured — demo mode. Poetry is composed by the deterministic local core.",
  };
}
