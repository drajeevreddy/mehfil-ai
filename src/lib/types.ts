/**
 * MEHFIL AI — shared contracts between the three intelligence engines.
 * Engines exchange structured JSON only. No engine reaches into another's
 * internals; the orchestrator is the only component that coordinates them.
 */

export type Language = "urdu" | "roman" | "hindi" | "english" | "urdu-en";

/** The emotion vocabulary of the product (Engine 2's space). */
export type EmotionKey =
  | "ishq"
  | "dard"
  | "junoon"
  | "gussa"
  | "bewafai"
  | "hijr"
  | "wafa"
  | "tanhai"
  | "shikwa"
  | "sabr"
  | "surrender"
  | "devotion"
  | "regret"
  | "nostalgia"
  | "hope"
  | "loneliness"
  | "heartbreak"
  | "longing"
  | "madness"
  | "pride"
  | "jealousy"
  | "spiritualLonging";

export type Intensity = 1 | 2 | 3 | 4 | 5;

export type Register = "restrained" | "melancholic" | "dramatic" | "intense" | "volatile";

export type Direction = "romantic" | "spiritual" | "philosophical" | "dark";

export type PoetryForm = "sher" | "quatrain" | "six-line" | "eight-line" | "ghazal-inspired";

export const POETRY_FORM_COUPLETS: Record<PoetryForm, number> = {
  sher: 1,
  quatrain: 2,
  "six-line": 3,
  "eight-line": 4,
  "ghazal-inspired": 5,
};

export type PoetryMode =
  | "dard"
  | "junoon"
  | "ishq"
  | "shikwa"
  | "bewafai"
  | "sufi"
  | "anger"
  | "raat-ki-mehfil"
  | "studio";

/* ------------------------------------------------------------------ */
/* Emotion Intelligence output                                         */
/* ------------------------------------------------------------------ */

export interface EmotionIntent {
  primary: EmotionKey;
  secondary: EmotionKey[];
  intensity: Intensity;
  /** Emotional contradiction the couplet must honour, e.g. love+gussa. */
  conflict: string | null;
  register: Register;
  direction: Direction;
  /** One sentence — the emotional story the shayari must tell. */
  narrative: string;
  /** Ordered emotional arc: longing → restlessness → surrender. */
  arc: EmotionKey[];
  /** Semantic fields this intent wants imagery from. */
  fields: string[];
  concepts: string[];
  /** Words the intent leans on (roman Urdu), ranked. */
  vocabulary: string[];
  mode: PoetryMode;
}

/* ------------------------------------------------------------------ */
/* Qawwali Intelligence output                                         */
/* ------------------------------------------------------------------ */

export interface QawwaliContext {
  composition: {
    slug: string;
    verifiedTitle: string;
    alternateTitles: string[];
    language: string;
    poeticTradition: string;
    attributedPoet: string | null;
  } | null;
  /** Only from clearly labelled interpretations — never lyrics. */
  interpretation: {
    dominantEmotions: EmotionKey[];
    emotionalProgression: EmotionKey[];
    sufiConcepts: string[];
    symbolicImagery: string[];
    summary: string;
    literaryCharacteristics: string[];
    attributionNote?: string;
  } | null;
  concepts: string[];
  metaphors: string[];
  source: { slug: string; verifiedTitle: string; url: string }[];
  researchStatus: "verified_metadata" | "sample_annotation" | "none";
  confidence: "high" | "medium" | "low" | "n/a";
  /** Always stated in UI: the corpus is partial by design. */
  coverageNote: string;
  theme?:string
}

/* ------------------------------------------------------------------ */
/* Shayari Intelligence output + quality evaluation                     */
/* ------------------------------------------------------------------ */

export interface SherCouplet {
  urduMisra1: string;
  urduMisra2: string;
  romanMisra1: string;
  romanMisra2: string;
  hindiMisra1: string;
  hindiMisra2: string;
  english1: string;
  english2: string;
  metaphors: { word: string; gloss: string }[];
}

export interface GeneratedShayari {
  id: string;
  couplets: SherCouplet[];
  title: string;
  language: Language;
  form: PoetryForm;
  emotionIntent: EmotionIntent;
  qawwaliContext: QawwaliContext | null;
  philosophicalConcept: string | null;
  metaphorExplanations: { word: string; gloss: string }[];
  provider: "local-core" | "anthropic-claude";
  demo: boolean;
  createdAt: string;
  refinementOf?: string;
  quality: QualityReport;
  seed: number;
}

export interface QualityReport {
  ok: boolean;
  grammar: number;
  coherence: number;
  metaphorDepth: number;
  relevance: number;
  originality: number;
  /** Automated screening against the internal reference corpus. NOT a copyright clearance. */
  originalityNote: string;
  regenerations: number;
  flags: string[];
}

/* ------------------------------------------------------------------ */
/* Request payloads                                                    */
/* ------------------------------------------------------------------ */

export interface GenerateRequest {
  emotions: EmotionKey[];
  intensity?: Intensity;
  language?: Language;
  form?: PoetryForm;
  mode?: PoetryMode;
  qawwaliSlug?: string;
  seed?: number;
}

export interface RefineRequest {
  shayari: GeneratedShayari;
  action:
    | "deeper"
    | "more-pain"
    | "more-angry"
    | "more-ishq"
    | "more-sufi"
    | "change-ending";
  language?: Language;
  seed?: number;
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  preview: string;
  request: GenerateRequest;
}
