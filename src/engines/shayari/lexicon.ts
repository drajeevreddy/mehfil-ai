/**
 * URDU LEXICON — surface-form dictionary.
 * Maps every roman token used by the couplet corpus to its Urdu-script and
 * Devanagari forms plus an English sense. The composer strips punctuation
 * and resolves each token here; the corpus coverage test fails the build
 * when a token is missing, so no line ever rough-transliterates.
 */

export interface LexWord {
  urdu: string;
  hindi: string;
  en: string;
}

import { LEX_PART1 } from "./lexicon.part1";
import { LEX_PART2 } from "./lexicon.part2";
import { LEX_PART3 } from "./lexicon.part3";

export const LEX: Record<string, LexWord> = {
  ...LEX_PART1,
  ...LEX_PART2,
  ...LEX_PART3,
};
