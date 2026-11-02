/**
 * SHAYARI CORE — couplet templates.
 *
 * Each couplet is an original, authored two-misra unit: a complete
 * pakistani-Urdu thought with parallel English meaning. The composer selects
 * couplets by emotional register/affinity and poems assemble without
 * repetition. No copyrighted lyric, transcription or paraphrase is used —
 * all lines are original to this project.
 */

import type { EmotionKey, Register } from "@/lib/types";

export interface CoupletTemplate {
  id: string;
  /** registers this couplet serves */
  registers: Register[];
  /** emotional affinity (when intent matches, higher rank) */
  emotions: EmotionKey[];
  /** imagery fields this couplet's diction touches */
  fields: string[];
  /** qafiya group when the closing sound recurs across couplets */
  rhyme?: string;
  roman: [string, string];
  english: [string, string];
  /** optional philosophical concept it can carry */
  concept?: string;
}

export const COUPLETS: CoupletTemplate[] = [
  {
    id: "mehfil-shaam",
    registers: ["melancholic", "restrained"],
    emotions: ["hijr", "dard", "nostalgia"],
    fields: ["raat", "mehfil", "khamoshi"],
    rhyme: "raha",
    roman: [
      "tumhari mehfil mein phir ayi thi ek shaam",
      "sari raat tumhare jaane ka kuch sada raha",
    ],
    english: [
      "Another evening came to your gathering;",
      "all night only the echo of your leaving stayed.",
    ],
  },
  {
    id: "mehfil-ronak",
    registers: ["melancholic", "restrained"],
    emotions: ["hijr", "tanhai", "nostalgia"],
    fields: ["mehfil", "khamoshi", "tanhai"],
    rhyme: "thi",
    roman: [
      "kisi aur ki mehfil mein ronak thi magar",
      "mere ghar ki sari raat akeli thi",
    ],
    english: [
      "Someone else's gathering carried its noise, but",
      "my home's whole night stayed alone.",
    ],
  },
  {
    id: "junoon-manzil",
    registers: ["intense", "volatile"],
    emotions: ["junoon", "longing", "ishq"],
    fields: ["aag", "manzil", "raasta"],
    rhyme: "hota",
    roman: [
      "mera junoon sirf ek manzil pe mar jata hai",
      "wo bhi agar tumhara na hota",
    ],
    english: [
      "My madness would die at any destination —",
      "as long as it was not yours.",
    ],
  },
  {
    id: "dil-baarish",
    registers: ["melancholic", "restrained"],
    emotions: ["ishq", "dard", "longing"],
    fields: ["dil", "raat", "aansu"],
    rhyme: "hai",
    roman: [
      "mera dil teri yaad ki narm baarish barasta hai",
      "har boond teri taraf jati hai",
    ],
    english: [
      "My heart rains down your memory as soft rain;",
      "every drop goes toward you.",
    ],
  },
  {
    id: "dua-qismat",
    registers: ["dramatic", "melancholic"],
    emotions: ["shikwa", "regret", "sabr"],
    fields: ["kismat", "dua", "aag"],
    rhyme: "diya",
    roman: [
      "maine dua ki thi kisi aur ki zindagi ke liye",
      "dua ne mujhe meri qismat ka jawab diya",
    ],
    english: [
      "I once prayed for someone else's life;",
      "the prayer answered me with my own fate.",
    ],
    concept: "taqdir",
  },
  {
    id: "log-bewafai",
    registers: ["dramatic", "restrained"],
    emotions: ["bewafai", "heartbreak", "pride"],
    fields: ["dastoor", "khamoshi", "zakhm"],
    rhyme: "thay",
    roman: [
      "log bewafai sunaate hain, sunoon bhi",
      "magar tum kuch pehle hi keh gaye thay",
    ],
    english: [
      "People recite betrayals — I listen too, but",
      "you had already said yours earlier.",
    ],
  },
  {
    id: "wafa-jhalak",
    registers: ["restrained"],
    emotions: ["wafa", "ishq", "sabr"],
    fields: ["dil", "raat", "dua"],
    rhyme: "hai",
    roman: [
      "meri wafa ka koi inaam nahi chahiye",
      "bas teri raat ki ek jhalak kaafi hai",
    ],
    english: [
      "I want no prize for my loyalty —",
      "one glimpse of your night is enough.",
    ],
  },
  {
    id: "raasta-dhundna",
    registers: ["intense", "volatile"],
    emotions: ["longing", "junoon", "hijr"],
    fields: ["raasta", "raat", "manzil"],
    rhyme: "nahin",
    roman: [
      "har raat ik nayi nazar se raasta doondta hoon",
      "tum tak pahunchne ki koi rah nahin hai",
    ],
    english: [
      "Every night I look for the road again;",
      "there is still no way to you.",
    ],
  },
  {
    id: "rooh-sajda",
    registers: ["melancholic", "restrained", "dramatic"],
    emotions: ["surrender", "spiritualLonging", "devotion"],
    fields: ["sajda", "rooh", "noor"],
    rhyme: "na",
    roman: [
      "meri rooh ne tujhse sirf ek cheez maangi",
      "sajda aisa jisme tu ho aur main na",
    ],
    english: [
      "My soul asked You for only one thing:",
      "a prostration where You are, and I am not.",
    ],
    concept: "fana",
  },
  {
    id: "guftagu-kaanch",
    registers: ["melancholic", "restrained"],
    emotions: ["nostalgia", "regret", "hijr"],
    fields: ["mehfil", "khamoshi", "yaad"],
    rhyme: "hai",
    roman: [
      "purani mehfil ki sari guftagu simat gayi",
      "ab sirf teri ek adhoori baat bachi hai",
    ],
    english: [
      "All the old gathering's talk has folded away;",
      "only one unfinished sentence of yours remains.",
    ],
  },
  {
    id: "gussa-dard",
    registers: ["dramatic", "intense"],
    emotions: ["gussa", "heartbreak", "bewafai"],
    fields: ["aag", "zakhm", "khamoshi"],
    rhyme: "chuka",
    roman: [
      "gusse mein kuch kehna hota hai",
      "magar dard sab kuch pehle keh chuka hai",
    ],
    english: [
      "Anger has something of its own to say —",
      "but the pain has already said everything.",
    ],
  },
  {
    id: "andhera-subah",
    registers: ["melancholic", "restrained"],
    emotions: ["tanhai", "hope", "sabr"],
    fields: ["tanhai", "raat", "manzil"],
    rhyme: "magar",
    roman: [
      "tanhai ka andhera gehra to hai magar",
      "subah ka waqt usme se guzarta hai",
    ],
    english: [
      "The darkness of loneliness is deep, but",
      "morning's hour still passes through it.",
    ],
  },
  {
    id: "zakhm-hisab",
    registers: ["dramatic"],
    emotions: ["heartbreak", "bewafai", "dard"],
    fields: ["zakhm", "dil", "aag"],
    rhyme: "toda",
    roman: [
      "tumne har zakhm ka hisab nahi rakha",
      "mera dil sab ki tarah ek hi jagah toda",
    ],
    english: [
      "You kept no count of the wounds —",
      "my heart broke the way all hearts break, in one place.",
    ],
  },
  {
    id: "dil-tumhara",
    registers: ["restrained", "melancholic"],
    emotions: ["ishq", "heartbreak", "pride"],
    fields: ["dil", "khamoshi", "dastoor"],
    rhyme: "gaye",
    roman: [
      "is tarah to mera dil tumhara tha",
      "ab tum sab ki tarah ho gaye",
    ],
    english: [
      "Once, even my heart was yours;",
      "now you have become like everyone else.",
    ],
  },
  {
    id: "saqi-pila",
    registers: ["volatile", "intense"],
    emotions: ["madness", "junoon", "ishq"],
    fields: ["maikhana", "saaqi", "mehfil"],
    rhyme: "rahe",
    roman: [
      "saqi mujhe itna na pila",
      "k mehfil mein tumhari baat na chhupti rahe",
    ],
    english: [
      "Cupbearer, do not pour me that deep —",
      "let your secret hide in the gathering still.",
    ],
    concept: "maikhana",
  },
  {
    id: "chand-dhoondh",
    registers: ["melancholic", "intense"],
    emotions: ["hijr", "longing", "ishq"],
    fields: ["chand", "raat", "tanhai"],
    rhyme: "hai",
    roman: [
      "aaj ki raat chand ne bhi mera intezaar nahi kiya",
      "magar tum ho ke har raat ik nayi dhoondh hai",
    ],
    english: [
      "Tonight even the moon did not wait for me;",
      "but you remain an every-night search.",
    ],
  },
  {
    id: "dua-ibadat",
    registers: ["restrained", "melancholic"],
    emotions: ["devotion", "spiritualLonging", "sabr"],
    fields: ["dua", "rooh", "noor"],
    rhyme: "hai",
    roman: [
      "meri duaon mein shikwa nahi",
      "sirf tumhare naam ki ibadat hai",
    ],
    english: [
      "In my prayers there is no complaint;",
      "only worship of your name.",
    ],
    concept: "bandagi",
  },
  {
    id: "aag-jag",
    registers: ["intense", "dramatic"],
    emotions: ["gussa", "heartbreak", "junoon"],
    fields: ["aag", "khamoshi", "zakhm"],
    rhyme: "chalta",
    roman: [
      "aag mujh mein is qadar jag chuki hai",
      "khamoshi se ab mera pata nahi chalta",
    ],
    english: [
      "The fire in me has burned this far —",
      "silence can no longer say where I am.",
    ],
  },
  {
    id: "safar-hissa",
    registers: ["melancholic", "restrained"],
    emotions: ["hijr", "longing", "nostalgia"],
    fields: ["safar", "manzil", "raasta"],
    rhyme: "aaye",
    roman: [
      "har safar ka ek hissa tum ho",
      "jo aaj tak mere saath nahi aaye",
    ],
    english: [
      "Every journey has a part that is you —",
      "a part that has not come with me even today.",
    ],
  },
  {
    id: "shart-intezaar",
    registers: ["restrained", "melancholic", "dramatic"],
    emotions: ["longing", "ishq", "wafa"],
    fields: ["raat", "aansu", "yaad"],
    rhyme: "kare",
    roman: [
      "tumse milne ki ek shart thi",
      "raat apni poori umar ka intezaar kare",
    ],
    english: [
      "There was just one condition to meeting you:",
      "the night had to wait its whole life.",
    ],
  },
  {
    id: "aaina-qismat",
    registers: ["dramatic", "melancholic"],
    emotions: ["shikwa", "regret", "sabr"],
    fields: ["kismat", "khamoshi", "roshni"],
    rhyme: "dekhi",
    roman: [
      "duniya ne mujhe aaina dikhaya",
      "maine us mein apni kismat likhi dekhi",
    ],
    english: [
      "The world showed me a mirror;",
      "I saw my fate written there.",
    ],
    concept: "taqdir",
  },
  {
    id: "pehli-baar",
    registers: ["melancholic", "restrained"],
    emotions: ["regret", "nostalgia", "dard"],
    fields: ["khamoshi", "yaad", "waqt"],
    rhyme: "gayi",
    roman: [
      "kuch baatein pehli baar kehni thi",
      "ab us lamhe ki muddat chali gayi",
    ],
    english: [
      "Some sentences were meant to be said, once —",
      "the moment for them has long gone.",
    ],
  },
  {
    id: "noor-saaya",
    registers: ["melancholic", "restrained"],
    emotions: ["devotion", "spiritualLonging", "surrender"],
    fields: ["noor", "rooh", "sajda"],
    rhyme: "intezaar",
    roman: [
      "meri rooh ka ik hi naam hai",
      "noor ka saaya, tumhara intezaar",
    ],
    english: [
      "My soul has one name and one only:",
      "the shadow of light, the waiting for You.",
    ],
    concept: "noor",
  },
  {
    id: "yaad-ghar",
    registers: ["melancholic", "restrained"],
    emotions: ["nostalgia", "tanhai", "dard"],
    fields: ["yaad", "tanhai", "raat"],
    rhyme: "hoti",
    roman: [
      "yaad mein dekhun to tera ghar yahan tha",
      "magar ghar ke diwaron mein woh awaz nahi hoti",
    ],
    english: [
      "In memory I see: your house stood here —",
      "but the walls of a house have lost that voice.",
    ],
  },
  {
    id: "umeed-diya",
    registers: ["restrained", "melancholic"],
    emotions: ["hope", "sabr", "spiritualLonging"],
    fields: ["dua", "manzil", "noor"],
    rhyme: "diya",
    roman: [
      "sari raat andhera tha aur mein thak gayi",
      "phir bhi juban ne sirf dua ka noor rakha",
    ],
    english: [
      "All night there was dark, and I grew tired —",
      "still, my tongue kept only the light of prayer.",
    ],
    concept: "umeed",
  },
  {
    id: "bewafai-qadam",
    registers: ["dramatic", "intense"],
    emotions: ["bewafai", "gussa", "pride"],
    fields: ["dastoor", "zakhm", "khamoshi"],
    rhyme: "nahi",
    roman: [
      "bewafai ek qadam nahi, poori raa hai",
      "aur raa pehle se tum pe chalti nahi",
    ],
    english: [
      "Betrayal is not a step; it is an entire road —",
      "and that road never first walked on you.",
    ],
  },
  {
    id: "ishq-saza",
    registers: ["dramatic", "melancholic"],
    emotions: ["ishq", "dard", "shikwa"],
    fields: ["dil", "kismat", "zanjeer"],
    rhyme: "nahi",
    roman: [
      "ishq mujhe kiya tha, ya mujhe kiya gaya",
      "ab is sawal ke dono jawab saza hain",
    ],
    english: [
      "Did I choose love, or was love chosen for me?",
      "now both answers to that question are a sentence.",
    ],
  },
  {
    id: "tanhai-saath",
    registers: ["melancholic", "restrained"],
    emotions: ["tanhai", "hijr", "sabr"],
    fields: ["tanhai", "raat", "safar"],
    rhyme: "sahi",
    roman: [
      "tanhai ne bhi mujhe chor diya",
      "ab sirf raat meri saath nahi, saathi hai",
    ],
    english: [
      "Even loneliness has abandoned me now —",
      "the night is not my company any more, it is my companion.",
    ],
  },
  {
    id: "khwab-taaza",
    registers: ["melancholic", "intense"],
    emotions: ["longing", "junoon", "nostalgia"],
    fields: ["khwab", "raat", "chand"],
    rhyme: "hai",
    roman: [
      "har raat ik khwaab taaza hota hai",
      "subah tak us ki sab taqseem ho jati hai",
    ],
    english: [
      "Every night one dream is made new —",
      "by morning it has been shared out among us all.",
    ],
  },
  {
    id: "shikwa-talaash",
    registers: ["dramatic", "melancholic"],
    emotions: ["shikwa", "hijr", "longing"],
    fields: ["dua", "manzil", "kismat"],
    rhyme: "nahi",
    roman: [
      "maine talaash ki thi, magar naseeb mein",
      "talaash apne jawab se roothi hui hai",
    ],
    english: [
      "I searched — but in my fate, even",
      "the search is sulking with its own answer.",
    ],
  },
];

/** Length of each form (in couplets) */
export const FORM_LENGTHS: Record<string, number> = {
  sher: 1,
  quatrain: 2,
  "six-line": 3,
  "eight-line": 4,
  "ghazal-inspired": 5,
};
