/**
 * ORCHESTRATOR — coordinates the three intelligence engines.
 *
 * Pipeline: request → EMOTION (interpret intent) → QAWWALI (retrieve
 * research context) → SHAYARI (provider composes) → QUALITY (evaluate,
 * regenerate when suspect) → result. Engines exchange structured JSON only;
 * none of them internally performs another engine's responsibility.
 */

import crypto from "crypto";
import { interpretEmotion } from "@/engines/emotion/engine";
import { retrieveForIntent } from "@/engines/qawwali/engine";
import { resolveProvider } from "@/engines/providers";
import { adaptIntentForRefine } from "@/engines/shayari/refine";
import type {
  EmotionIntent,
  GeneratedShayari,
  GenerateRequest,
  Language,
  PoetryForm,
  QawwaliContext,
  RefineRequest,
} from "@/lib/types";

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `msh-${Date.now().toString(36)}-${idCounter.toString(36)}-${Math.floor(
    Math.random() * 1e6
  ).toString(36)}`;
}

function nextSeed(): number {
  try {
    const buf = crypto.randomBytes(4);
    return buf.readUInt32LE(0) >>> 0;
  } catch {
    return Math.floor(Math.random() * 2 ** 31);
  }
}

export async function generateShayari(
  request: GenerateRequest,
  opts: { language?: Language } = {}
): Promise<{ shayari: GeneratedShayari; demo: boolean }> {
  const intent = interpretEmotion(request);
  const qawwali: QawwaliContext = retrieveForIntent(intent, request.qawwaliSlug);
  const provider = resolveProvider();
  const seed = request.seed ?? nextSeed();
  const form: PoetryForm = request.form ?? "sher";
  const language: Language = opts.language ?? request.language ?? "roman";

  const result = await provider.generate({
    intent,
    qawwali,
    form,
    language,
    seed,
    id: nextId(),
  });

  // Quality regenerations happen inside the local-core engine; the
  // anthropic provider applies its own output discipline. Report as-is.
  return { shayari: result, demo: result.demo || provider.demo };
}

export async function refineShayari(
  request: RefineRequest
): Promise<{ shayari: GeneratedShayari; demo: boolean }> {
  const provider = resolveProvider();
  const intent = adaptIntentForRefine(request.shayari.emotionIntent, request.action);
  const qawwali: QawwaliContext | null = request.shayari.qawwaliContext;
  const baseLines = request.shayari.couplets.map(
    (c) => [c.romanMisra1, c.romanMisra2] as [string, string]
  );
  // change-ending shifts corpus selection; others refine the same lineage
  const seedShift = request.action === "change-ending" ? 977 : 1;
  const seed = (request.seed ?? 0) + seedShift;

  const refined = await provider.generate({
    intent,
    qawwali,
    form: request.shayari.form,
    language: request.language ?? request.shayari.language,
    seed,
    id: nextId(),
    refine: { action: request.action, baseLines },
  });

  refined.refinementOf = request.shayari.id;
  return { shayari: refined, demo: refined.demo || provider.demo };
}

export function translateShayari(shayari: GeneratedShayari): Record<Language, string> {
  const lines = shayari.couplets.map((c) => ({
    urdu: [c.urduMisra1, c.urduMisra2],
    roman: [c.romanMisra1, c.romanMisra2],
    hindi: [c.hindiMisra1, c.hindiMisra2],
    english: [c.english1, c.english2],
  }));
  return {
    urdu: lines.map((l) => l.urdu.join("، ")).join("\n"),
    roman: lines.map((l) => l.roman.join(" — ")).join("\n"),
    hindi: lines.map((l) => l.hindi.join(" — ")).join("\n"),
    english: lines.map((l) => l.english.join(" — ")).join("\n"),
    "urdu-en": lines
      .map((l) => `${l.urdu.join(" | ")} (${l.english.join("; ")})`)
      .join("\n"),
  };
}
