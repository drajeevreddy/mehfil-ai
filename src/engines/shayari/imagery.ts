/**
 * POETRY IMAGERY — symbolic vocabulary with parallel forms across scripts.
 * Every metaphor must serve the emotional meaning; fields tag what an image
 * is *about*, never random decoration.
 */

export interface ImageryEntry {
  /** roman word key */
  key: string;
  urdu: string;
  hindi: string;
  /** English gloss for the metaphor explanation. */
  gloss: string;
  /** Semantic fields: which emotional intents this imagery serves. */
  fields: string[];
  /** Optional Sufi concept this image can carry. */
  concept?: string;
}

export const IMAGERY: ImageryEntry[] = [
  { key: "chand", urdu: "چاند", hindi: "चाँद", gloss: "the moon — a witness that keeps its distance", fields: ["raat", "tanhai", "nostalgia", "longing"] },
  { key: "raat", urdu: "رات", hindi: "रात", gloss: "the night — where the unsaid lives", fields: ["tanhai", "dard", "longing", "raat-ki-mehfil"] },
  { key: "aansu", urdu: "آنسو", hindi: "आँसू", gloss: "tears — words the eye says instead", fields: ["dard", "hijr", "heartbreak", "sabr"] },
  { key: "khamoshi", urdu: "خاموشی", hindi: "ख़ामोशी", gloss: "silence — the loudest reply", fields: ["dard", "bewafai", "tanhai", "pride"] },
  { key: "rooh", urdu: "روح", hindi: "रूह", gloss: "the soul — the part that does not leave", fields: ["sufi", "surrender", "spiritualLonging", "ishq"] },
  { key: "dua", urdu: "دعا", hindi: "दुआ", gloss: "a prayer — a raised hand that expects nothing", fields: ["devotion", "sabr", "surrender", "hope"] },
  { key: "sajda", urdu: "سجدہ", hindi: "सजदा", gloss: "prostration — losing one's height on purpose", fields: ["devotion", "surrender", "sufi"], concept: "fana" },
  { key: "maikhana", urdu: "میخانه", hindi: "मैख़ाना", gloss: "the tavern — where the sober go to stop pretending", fields: ["junoon", "ishq", "dard"] },
  { key: "saaqi", urdu: "ساقی", hindi: "साक़ी", gloss: "the cupbearer — the one who pours without asking why", fields: ["junoon", "ishq", "sufi"] },
  { key: "mehfil", urdu: "محفل", hindi: "महफ़िल", gloss: "the gathering — everyone present, the beloved absent", fields: ["nostalgia", "tanhai", "hijr"] },
  { key: "aag", urdu: "آگ", hindi: "आग", gloss: "fire — what both burns and keeps alive", fields: ["junoon", "gussa", "ishq", "dard"] },
  { key: "zanjeer", urdu: "زنجیر", hindi: "ज़ंजीर", gloss: "chains — the bounds the heart calls by name", fields: ["junoon", "ishq", "madness"] },
  { key: "hijr", urdu: "ہجر", hindi: "हिज्र", gloss: "separation — a country between two hearts", fields: ["hijr", "dard"] },
  { key: "manzil", urdu: "منزل", hindi: "मंज़िल", gloss: "the destination — known to the road, not the walker", fields: ["longing", "hope", "hijr"] },
  { key: "raasta", urdu: "راستہ", hindi: "रास्ता", gloss: "the road — longer than the walker's patience", fields: ["longing", "junoon", "hope"] },
  { key: "dil", urdu: "دل", hindi: "دل", gloss: "the heart — crowded, noisy, obedient to no one", fields: ["ishq", "dard", "heartbreak", "junoon"] },
  { key: "dastoor", urdu: "دستور", hindi: "दस्तूर", gloss: "convention — the habit everyone calls a rule", fields: ["gussa", "bewafai", "shikwa", "pride"] },
  { key: "kismat", urdu: "قسمت", hindi: "क़िस्मत", gloss: "destiny — the author who signs every page but stays off it", fields: ["shikwa", "gussa", "sabr", "regret"] },
  { key: "khuda", urdu: "خدا", hindi: "ख़ुदा", gloss: "God — the Name the heart returns to", fields: ["sufi", "surrender", "devotion"], concept: "ishq-e-haqiqi" },
  { key: "shola", urdu: "شعلہ", hindi: "शोला", gloss: "a flame — small, insistent, impossible to hold", fields: ["junoon", "ishq", "dard"] },
  { key: "zakhm", urdu: "زخم", hindi: "ज़ख़्म", gloss: "a wound — evidence of having loved", fields: ["heartbreak", "bewafai", "gussa", "dard"] },
  { key: "noor", urdu: "نور", hindi: "नूर", gloss: "light — what the eyes find long before a word", fields: ["sufi", "hope", "spiritualLonging"], concept: "noor-e-khuda" },
  { key: "virane", urdu: "ویرانے", hindi: "वीराने", gloss: "ruins — the rooms memory still furnishes", fields: ["tanhai", "nostalgia", "hijr"] },
  { key: "samaan", urdu: "سماں", hindi: "समाँ", gloss: "the season's air — what the gathering breathe together", fields: ["tanhai", "sufi", "nostalgia"] },
];

export const IMAGERY_BY_KEY: Record<string, ImageryEntry> = Object.fromEntries(
  IMAGERY.map((i) => [i.key, i])
);

export function imageryForFields(fields: string[], count: number): ImageryEntry[] {
  const scored = IMAGERY.map((img) => {
    let score = 0;
    for (const f of fields) if (img.fields.includes(f)) score += 1;
    return { img, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.img.key.localeCompare(b.img.key));
  return scored.slice(0, count).map((s) => s.img);
}
