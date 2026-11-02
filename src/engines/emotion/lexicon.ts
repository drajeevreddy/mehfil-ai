/**
 * ENGINE 2 — EMOTION INTELLIGENCE
 * System prompt (src/engines/prompts.ts) governs the LLM path; this module
 * holds the deterministic emotion lexicon and the mixing algorithm used by
 * the local core provider and as the structured fallback contract.
 */

import type { Direction, EmotionKey, Intensity, Register } from "@/lib/types";

export interface EmotionLexEntry {
  key: EmotionKey;
  word: { roman: string; urdu: string; hindi: string; english: string };
  gloss: string;
  /** Emotional subcategories this emotion covers. */
  subcategories: string[];
  /** Emotions that most naturally contradict pair with this one. */
  pairsWith: EmotionKey[];
  /** Default register when this is primary at mid intensity. */
  baseRegister: Register;
  /** Default philosophical/literary direction. */
  direction: Direction;
  /** Imagery fields this emotion leans on (see imagery lexicon). */
  fields: string[];
  /** Sufi/philosophical concepts reachable from this emotion. */
  concepts: string[];
  /** Roman vocabulary the shayari may draw on, ranked. */
  vocabulary: string[];
}

export const EMOTION_LEXICON: EmotionLexEntry[] = [
  {
    key: "ishq",
    word: { roman: "ishq", urdu: "عشق", hindi: "इश्क़", english: "love" },
    gloss: "Love — the helplessness of a heart that cannot govern itself.",
    subcategories: ["unexpressed love", "love without expectations", "uncontrollable heart"],
    pairsWith: ["dard", "junoon", "hijr", "wafa", "tanhai"],
    baseRegister: "restrained",
    direction: "romantic",
    fields: ["dil", "raat", "rona", "manzil", "kismat"],
    concepts: ["ishq-e-majazi", "ishq-e-haqiqi", "wafa"],
    vocabulary: ["ishq", "dil", "soz", "taskeen", "ulfat", "moonis", "aashiq"],
  },
  {
    key: "dard",
    word: { roman: "dard", urdu: "درد", hindi: "दर्द", english: "pain" },
    gloss: "Pain — suffering that does not ask for an audience.",
    subcategories: ["silent suffering", "emotional exhaustion", "wounded heart"],
    pairsWith: ["ishq", "hijr", "tanhai", "sabr", "nostalgia"],
    baseRegister: "melancholic",
    direction: "romantic",
    fields: ["aansu", "khamoshi", "aag", "raat", "rooh"],
    concepts: ["dard-e-dil", "sabr", "tasawwuf"],
    vocabulary: ["dard", "soz", "gham", "jurm", "zakhm", "nasheman"],
  },
  {
    key: "junoon",
    word: { roman: "junoon", urdu: "جنون", hindi: "जुनून", english: "madness" },
    gloss: "Passion and madness — restlessness that no one talks down.",
    subcategories: ["restlessness", "overwhelming passion", "longing mixed with madness"],
    pairsWith: ["ishq", "longing", "dard", "devotion"],
    baseRegister: "intense",
    direction: "romantic",
    fields: ["aag", "zanjeer", "raasta", "manzil", "dil"],
    concepts: ["junoon-e-ishq", "fana", "ishq-e-haqiqi"],
    vocabulary: ["junoon", "deewana", "shola", "gharq", " fikr", "talaash"],
  },
  {
    key: "gussa",
    word: { roman: "gussa", urdu: "غصہ", hindi: "ग़ुस्सा", english: "anger" },
    gloss: "Anger — a complaint with weight, never cheap aggression.",
    subcategories: ["wounded pride", "frustration with destiny", "frustration"],
    pairsWith: ["bewafai", "shikwa", "heartbreak", "dard"],
    baseRegister: "dramatic",
    direction: "philosophical",
    fields: ["aag", "zakhm", "dastoor", "kismat"],
    concepts: ["shikwa", "qahr", "adl"],
    vocabulary: ["gussa", "qahr", "jurm", "dastoor", "iltija", "shikwa"],
  },
  {
    key: "bewafai",
    word: { roman: "bewafai", urdu: "بےوفائی", hindi: "बेवफ़ाई", english: "betrayal" },
    gloss: "Betrayal — the silence of the one who kept their word.",
    subcategories: ["lost trust", "unfulfilled promises", "wounded dignity"],
    pairsWith: ["gussa", "heartbreak", "pride", "nostalgia"],
    baseRegister: "dramatic",
    direction: "dark",
    fields: ["zakhm", "khamoshi", "dastoor", "aag"],
    concepts: ["bewafai", "wafa", "adaa"],
    vocabulary: ["bewafai", "wafa", "qarz", "adaa", "khata", "ghaddar"],
  },
  {
    key: "hijr",
    word: { roman: "hijr", urdu: "ہجر", hindi: "हिज्र", english: "separation" },
    gloss: "Separation — the geography of absence.",
    subcategories: ["separation from the beloved", "the agony of distance"],
    pairsWith: ["ishq", "dard", "wafa", "longing", "devotion"],
    baseRegister: "melancholic",
    direction: "spiritual",
    fields: ["hijr", "raat", "manzil", "raasta", "aansu"],
    concepts: ["hijr", "visal", "ghurbat"],
    vocabulary: ["hijr", "firq", "virane", "fasla", "safar", "manzil"],
  },
  {
    key: "wafa",
    word: { roman: "wafa", urdu: "وفا", hindi: "वफ़ा", english: "loyalty" },
    gloss: "Loyalty — kept promises even after the betrayal.",
    subcategories: ["love without expectations", "kept promises"],
    pairsWith: ["hijr", "sabr", "devotion", "dard"],
    baseRegister: "restrained",
    direction: "romantic",
    fields: ["dil", "wafa", "manzil", "raat"],
    concepts: ["wafa", "sabr", "ishq-e-majazi"],
    vocabulary: ["wafa", "ehad", "qasam", "bharosa", "saath", "sang"],
  },
  {
    key: "tanhai",
    word: { roman: "tanhai", urdu: "تنہائی", hindi: "तन्हाई", english: "loneliness" },
    gloss: "Loneliness — a room that answers everything.",
    subcategories: ["silent silence", "unanswered prayers", "exhaustion"],
    pairsWith: ["dard", "hijr", "hope", "longing"],
    baseRegister: "melancholic",
    direction: "philosophical",
    fields: ["tanhai", "raat", "khamoshi", "rooh"],
    concepts: ["ghurbat", "uzlat", "sabr"],
    vocabulary: ["tanhai", "virane", "ghurbat", "khamoshi", "uzlat", "sadaa"],
  },
  {
    key: "shikwa",
    word: { roman: "shikwa", urdu: "شکوہ", hindi: "शिकवा", english: "complaint" },
    gloss: "Complaint — the literary form of a hurt heart.",
    subcategories: ["unanswered prayers", "frustration with destiny", "broken promises"],
    pairsWith: ["gussa", "bewafai", "dard", "sabr"],
    baseRegister: "dramatic",
    direction: "philosophical",
    fields: ["kismat", "dastoor", "dua", "aag"],
    concepts: ["shikwa", "jawab-e-shikwa", "taqdir", "adl"],
    vocabulary: ["shikwa", "iltija", "kismat", "dastoor", "sawal", "tay"],
  },
  {
    key: "sabr",
    word: { roman: "sabr", urdu: "صبر", hindi: "सब्र", english: "patience" },
    gloss: "Patience — a wall against time.",
    subcategories: ["emotional endurance", "unanswered prayers"],
    pairsWith: ["dard", "hijr", "surrender", "wafa"],
    baseRegister: "restrained",
    direction: "spiritual",
    fields: ["sabr", "dua", "manzil", "raat"],
    concepts: ["sabr", "radio-e-taqdir", "tasawwuf"],
    vocabulary: ["sabr", "onchal", "idraak", "sukoon", "wall", "daria"],
  },
  {
    key: "surrender",
    word: { roman: "tasleem", urdu: "تسلیم", hindi: "तसलीम", english: "surrender" },
    gloss: "Surrender — the end of resisting what the heart already chose.",
    subcategories: ["spiritual surrender", "acceptance"],
    pairsWith: ["devotion", "sabr", "spiritualLonging", "ishq"],
    baseRegister: "melancholic",
    direction: "spiritual",
    fields: ["sajda", "dua", "rooh", "manzil"],
    concepts: ["tasleem-o-raza", "fana", "ishq-e-haqiqi"],
    vocabulary: ["tasleem", "raza", "sar jhuka", "qubool", "taskeen", "sajda"],
  },
  {
    key: "devotion",
    word: { roman: "bandagi", urdu: "بندگی", hindi: "बंदगी", english: "devotion" },
    gloss: "Devotion — service that asks for nothing back.",
    subcategories: ["spiritual longing", "love without expectations"],
    pairsWith: ["surrender", "spiritualLonging", "ishq", "sabr"],
    baseRegister: "restrained",
    direction: "spiritual",
    fields: ["sajda", "dua", "rooh", "mehfil"],
    concepts: ["bandagi", "ibadat", "tasawwuf", "ishq-e-haqiqi"],
    vocabulary: ["bandagi", "ibadat", "sajda", "tilawat", "dua", "murshid"],
  },
  {
    key: "regret",
    word: { roman: "afsos", urdu: "افسوس", hindi: "अफ़सोस", english: "regret" },
    gloss: "Regret — words said too late.",
    subcategories: ["unspoken words", "unfulfilled promises"],
    pairsWith: ["nostalgia", "dard", "heartbreak"],
    baseRegister: "melancholic",
    direction: "philosophical",
    fields: ["khamoshi", "raat", "kismat"],
    concepts: ["pashemani", "gunah", "naseeb"],
    vocabulary: ["afsos", "guftagu", "khamoshi", "dher", "ausar", "muddat"],
  },
  {
    key: "nostalgia",
    word: { roman: "yadein", urdu: "یادیں", hindi: "यादें", english: "memories" },
    gloss: "Nostalgia — a past that refuses to settle.",
    subcategories: ["remembrance", "quiet grief"],
    pairsWith: ["dard", "regret", "hijr", "hope"],
    baseRegister: "restrained",
    direction: "philosophical",
    fields: ["chand", "raat", "mehfil", "aansu"],
    concepts: ["yad-e-mazi", "gham-e-dauran"],
    vocabulary: ["yad", "guzashta", "sham", "mehfil", "purana", "dauran"],
  },
  {
    key: "hope",
    word: { roman: "umeed", urdu: "امید", hindi: "उम्मीद", english: "hope" },
    gloss: "Hope — the light that did not earn its keep.",
    subcategories: ["unanswered wishes", "quiet persistence"],
    pairsWith: ["dard", "sabr", "tanhai", "devotion"],
    baseRegister: "restrained",
    direction: "romantic",
    fields: ["dua", "manzil", "raasta", "chand"],
    concepts: ["umeed", "sabr", "raja"],
    vocabulary: ["umeed", "sawera", "diya", "manzil", "dua", "raasta"],
  },
  {
    key: "loneliness",
    word: { roman: "gosha", urdu: "گوشہ", hindi: "गोशा", english: "seclusion" },
    gloss: "A corner the world walks past.",
    subcategories: ["silent suffering", "restlessness"],
    pairsWith: ["tanhai", "dard", "hijr", "longing"],
    baseRegister: "melancholic",
    direction: "philosophical",
    fields: ["tanhai", "raat", "khamoshi"],
    concepts: ["uzlat", "ghurbat"],
    vocabulary: ["gosha", "virane", "tanhai", "khamoshi", "uzlat", "sadaa"],
  },
  {
    key: "heartbreak",
    word: { roman: "dil tootna", urdu: "دل ٹوٹنا", hindi: "दिल टूटना", english: "heartbreak" },
    gloss: "Heartbreak — the sound a promise makes when it breaks.",
    subcategories: ["wounded pride", "emotional exhaustion"],
    pairsWith: ["bewafai", "gussa", "dard", "pride"],
    baseRegister: "dramatic",
    direction: "dark",
    fields: ["zakhm", "aansu", "aag", "dastoor"],
    concepts: ["dil-e-mashqik", "bewafai", "shikwa"],
    vocabulary: ["zakhm", "cheer", "dhadak", "bechain", "aansu", "mangal"],
  },
  {
    key: "longing",
    word: { roman: "talaash", urdu: "تلاش", hindi: "तलाश", english: "searching" },
    gloss: "Longing — a road walked every night and never finished.",
    subcategories: ["restlessness", "unfulfilled promises"],
    pairsWith: ["ishq", "junoon", "hijr", "hope"],
    baseRegister: "intense",
    direction: "romantic",
    fields: ["raasta", "manzil", "raat", "chand"],
    concepts: ["talaash", "justuju", "safar"],
    vocabulary: ["talaash", "justuju", "dide", "nazar", "aahat", "pechaan"],
  },
  {
    key: "madness",
    word: { roman: "deewangi", urdu: "دیوانگی", hindi: "दीवानगी", english: "madman's state" },
    gloss: "The state the world calls madness and the lover calls home.",
    subcategories: ["overwhelming passion", "restlessness"],
    pairsWith: ["junoon", "ishq", "longing", "devotion"],
    baseRegister: "volatile",
    direction: "romantic",
    fields: ["aag", "zanjeer", "raasta", "mehfil"],
    concepts: ["deewangi", "junoon-e-ishq", "fana"],
    vocabulary: ["deewangi", "deewana", "naaran", "gharq", "fikr", "shor"],
  },
  {
    key: "pride",
    word: { roman: "ghuroor", urdu: "غرض", hindi: "घुरूर", english: "dignity" },
    gloss: "Dignity — a heart that refuses to beg for its own loyalty.",
    subcategories: ["wounded pride", "dignity of rejection"],
    pairsWith: ["bewafai", "gussa", "heartbreak"],
    baseRegister: "restrained",
    direction: "dark",
    fields: ["dastoor", "khamoshi", "wafa"],
    concepts: ["ghuroor", "izzat", "sabr"],
    vocabulary: ["ghuroor", "izzat", "sar", "khamoshi", "adaa", "ehad"],
  },
  {
    key: "jealousy",
    word: { roman: "hasrat", urdu: "حسرت", hindi: "हसरत", english: "envy" },
    gloss: "Hasrat — a wish that belongs to someone else tonight.",
    subcategories: ["unfulfilled promises", "restlessness"],
    pairsWith: ["ishq", "longing", "dard", "bewafai"],
    baseRegister: "melancholic",
    direction: "romantic",
    fields: ["mehfil", "raat", "aansu", "roshni"],
    concepts: ["hasrat", "araazoo", "qismat"],
    vocabulary: ["hasrat", "araazoo", "mehfil", "roshni", "aankhein", "qismat"],
  },
  {
    key: "spiritualLonging",
    word: { roman: "talab-e-khuda", urdu: "طلبِ خدا", hindi: "तलब-ए-ख़ुदा", english: "longing for the Divine" },
    gloss: "The ache for a Presence the world cannot name.",
    subcategories: ["spiritual longing", "unanswered prayers"],
    pairsWith: ["surrender", "devotion", "ishq", "sabr"],
    baseRegister: "melancholic",
    direction: "spiritual",
    fields: ["sajda", "dua", "rooh", "noor", "chand"],
    concepts: ["ishq-e-haqiqi", "fana", "visal", "tasawwuf"],
    vocabulary: ["talab", "noor", "khuda", "bandagi", "sajda", "dua"],
  },
];

export const EMOTION_ENTRY: Record<EmotionKey, EmotionLexEntry> = EMOTION_LEXICON.reduce(
  (acc, e) => {
    acc[e.key] = e;
    return acc;
  },
  {} as Record<EmotionKey, EmotionLexEntry>
);

/* Known emotional combinations Landing on a narrative. */
export interface ComboRecipe {
  id: string;
  emotions: EmotionKey[];
  narrative: string;
  conflict: string;
}

export const COMBO_RECIPES: ComboRecipe[] = [
  {
    id: "ishq-gussa",
    emotions: ["ishq", "gussa"],
    narrative: "An emotional complaint against someone who has hurt you — the anger argues, but the love stays.",
    conflict: "Love argues with anger and does not win.",
  },
  {
    id: "bewafai-pride",
    emotions: ["bewafai", "pride"],
    narrative: "The dignity of a person who refuses to beg for loyalty.",
    conflict: "The heart still goes to the one who kept its hurt.",
  },
  {
    id: "hijr-devotion",
    emotions: ["hijr", "devotion"],
    narrative: "Continuing to love someone despite distance.",
    conflict: "Separation deepens rather than dissolves the bond.",
  },
  {
    id: "longing-madness",
    emotions: ["longing", "madness"],
    narrative: "The restlessness of someone overwhelmed by love.",
    conflict: "Restlessness that refuses to be still.",
  },
  {
    id: "ishq-dard",
    emotions: ["ishq", "dard"],
    narrative: "The helplessness of loving someone deeply while suffering.",
    conflict: "Love stays despite the wound.",
  },
  {
    id: "spiritual-longing-dard",
    emotions: ["spiritualLonging", "dard"],
    narrative: "Finding meaning in suffering through devotion.",
    conflict: "Pain accepted as a prayer.",
  },
  {
    id: "tanhai-hope",
    emotions: ["tanhai", "hope"],
    narrative: "In an empty room, the light that will not go out.",
    conflict: "Hope is untouched inside loneliness.",
  },
  {
    id: "gussa-heartbreak",
    emotions: ["gussa", "heartbreak"],
    narrative: "A wounded person's powerful expression of disappointment.",
    conflict: "Anger argues with grief and abandons neither.",
  },
  {
    id: "surrender-spiritual-longing",
    emotions: ["surrender", "spiritualLonging"],
    narrative: "The heart asks nothing for itself anymore — only to be near.",
    conflict: "Surrender is not peace; it is a hushed longing.",
  },
  {
    id: "nostalgia-regret",
    emotions: ["nostalgia", "regret"],
    narrative: "Walking back through a past one cannot fix.",
    conflict: "Memories and regrets are from the same door.",
  },
];

const INTENSITY_REGISTER: Register[] = ["restrained", "melancholic", "melancholic", "intense", "volatile"];

/** Deterministic, always-coherent emotion mixing (Engine 2 core). */
export function mixEmotions(
  emotions: EmotionKey[],
  intensity: Intensity,
  modeEmotion?: string
): {
  primary: EmotionKey;
  secondary: EmotionKey[];
  register: Register;
  direction: Direction;
  narrative: string;
  conflict: string | null;
  arc: EmotionKey[];
  fields: string[];
  concepts: string[];
  vocabulary: string[];
} {
  const seen = new Set<EmotionKey>();
  const unique = emotions.filter((e) => {
    if (seen.has(e) || !EMOTION_ENTRY[e]) return false;
    seen.add(e);
    return true;
  });
  if (unique.length === 0) return mixEmotions(["dard"], intensity, modeEmotion);

  const primary = unique[0];
  const secondary = unique.slice(1, 3);

  const entry = EMOTION_ENTRY[primary];
  const recipes = COMBO_RECIPES.filter(
    (r) =>
      r.emotions[0] === primary &&
      (secondary.length === 0 || r.emotions.slice(1).some((e) => secondary.includes(e)))
  );
  let narrative = entry.gloss;
  let conflict: string | null = null;
  if (recipes.length > 0) {
    const recipe =
      recipes.find((r) => r.emotions.length === 1 + secondary.length) ?? recipes[0];
    narrative = recipe.narrative;
    conflict = recipe.conflict;
  }

  const atHigh = intensity >= 4;
  let register: Register = atHigh
    ? INTENSITY_REGISTER[intensity - 1]
    : entry.baseRegister;
  if (secondary.includes("dard") && register === "restrained") register = "melancholic";
  if (secondary.includes("gussa") && register === "restrained") register = "dramatic";
  if (secondary.includes("junoon") || secondary.includes("madness")) register = "intense";
  if (secondary.includes("devotion") || secondary.includes("surrender")) register = "melancholic";

  const direction: Direction = entry.direction;
  const fields = new Set<string>(entry.fields);
  const concepts = new Set<string>(entry.concepts);
  const vocabulary = new Set<string>(entry.vocabulary);
  const matrix = [primary, ...secondary];
  for (const s of secondary) {
    const se = EMOTION_ENTRY[s];
    if (!se) continue;
    se.fields.forEach((f) => fields.add(f));
    se.concepts.forEach((c) => concepts.add(c));
    se.vocabulary.forEach((v) => vocabulary.add(v));
  }
  return {
    primary,
    secondary,
    register,
    direction,
    narrative,
    conflict,
    arc: matrix, // [primary, ...secondary] exactly once
    fields: [...fields],
    concepts: [...concepts],
    vocabulary: [...vocabulary],
  };
}
