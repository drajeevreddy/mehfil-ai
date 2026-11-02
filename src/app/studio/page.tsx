"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Dices, Loader2 } from "lucide-react";
import type { GeneratedShayari, EmotionKey, Language, PoetryForm, PoetryMode } from "@/lib/types";
import { EmotionTiles } from "@/components/studio/EmotionTiles";
import { MirrorDiscs } from "@/components/studio/MirrorDiscs";
import { PoemCard } from "@/components/studio/PoemCard";
import { Plaque } from "@/components/chamber/Plaque";
import { postGenerate, postRandom, getRecentRequests } from "@/lib/mehfil-client";
import { recordHistory } from "@/lib/mehfil-storage";
import { MirrorMosaic } from "@/components/chamber/MirrorMosaic";
import { cn } from "@/lib/utils";
import { EMOTION_ENTRY } from "@/engines/emotion/lexicon";

const FORMS: { key: PoetryForm; label: string; hint: string }[] = [
  { key: "sher", label: "Two-line sher", hint: "the couplet, standalone" },
  { key: "quatrain", label: "Four lines", hint: "two couplets" },
  { key: "six-line", label: "Six lines", hint: "three couplets" },
  { key: "eight-line", label: "Eight lines", hint: "four couplets" },
  { key: "ghazal-inspired", label: "Ghazal-inspired", hint: "five couplets in one breath" },
];

const LANGUAGES: { key: Language; label: string }[] = [
  { key: "urdu", label: "Urdu" },
  { key: "roman", label: "Roman Urdu" },
  { key: "hindi", label: "Hindi" },
  { key: "english", label: "English" },
  { key: "urdu-en", label: "Urdu + English" },
];

const MODES: { key: PoetryMode | "studio"; label: string }[] = [
  { key: "studio", label: "Studio" },
  { key: "dard", label: "Dard" },
  { key: "junoon", label: "Junoon" },
  { key: "ishq", label: "Ishq" },
  { key: "shikwa", label: "Shikwa" },
  { key: "bewafai", label: "Bewafai" },
  { key: "sufi", label: "Sufi" },
  { key: "anger", label: "Anger" },
  { key: "raat-ki-mehfil", label: "Raat ki Mehfil" },
];

function StudioInner() {
  const params = useSearchParams();
  const initialMode = (params.get("mode") ?? "studio") as PoetryMode;
  const validMode = MODES.some((m) => m.key === initialMode) ? initialMode : "studio";

  const [emotions, setEmotions] = useState<EmotionKey[]>(["dard"]);
  const [intensity, setIntensity] = useState(3);
  const [form, setForm] = useState<PoetryForm>("sher");
  const [language, setLanguage] = useState<Language>("urdu");
  const [mode, setMode] = useState<PoetryMode | "studio">(validMode);
  const [shayari, setShayari] = useState<GeneratedShayari | null>(null);
  const [demo, setDemo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // optional emotion hint carried from a mode link, e.g. sufi → spiritual lean
  useEffect(() => {
    if (validMode === "sufi" && emotions[0] === "dard") setEmotions(["spiritualLonging"]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const narrateIntent = useMemo(() => {
    if (emotions.length === 0) return null;
    const e = EMOTION_ENTRY[emotions[0]];
    return e?.gloss ?? null;
  }, [emotions]);

  const toggleEmotion = useCallback((k: EmotionKey) => {
    setEmotions((cur) => {
      if (cur.includes(k)) return cur.length === 1 ? cur : cur.filter((e) => e !== k);
      if (cur.length >= 3) return cur;
      return [...cur, k];
    });
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await postGenerate({ emotions, intensity: intensity as 1 | 2 | 3 | 4 | 5, form, language, mode: mode as never });
      setShayari(res.shayari);
      setDemo(res.demo);
      recordHistory(res.shayari);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The mehfil went quiet — try again.");
    } finally {
      setLoading(false);
    }
  }

  async function randomIshq() {
    setLoading(true);
    setError(null);
    try {
      const res = await postRandom({});
      setShayari(res.shayari);
      setDemo(res.demo);
      // reflect the roll back into the controls (visible randomness, not a mystery)
      const roll = res.roll as { primary: EmotionKey; secondary: EmotionKey[]; form: PoetryForm; language: Language } | undefined;
      if (roll) {
        setEmotions([roll.primary, ...roll.secondary]);
        setForm(roll.form);
        setLanguage(roll.language);
      }
      recordHistory(res.shayari);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The dice fell silent — try again.");
    } finally {
      setLoading(false);
    }
  }

  const recent = getRecentRequests();

  return (
    <div className="mx-auto grid w-full max-w-[1500px] gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[minmax(340px,480px)_1fr] lg:gap-16 lg:px-10">
      {/* ——— controls ——— */}
      <section aria-label="Compose the request" className="space-y-9">
        <header>
          <h1 className="font-display text-[24px] tracking-[0.14em] text-gilt-200">THE MAHFIL</h1>
          <p className="font-body mt-2.5 max-w-md text-[16px] text-ivory-400">
            Choose the feeling, set its heat, pick the room — the engines take it from there.
          </p>
        </header>

        {/* emotions */}
        <div>
          <h2 className="font-display mb-3.5 text-[13px] tracking-[0.2em] text-gilt-300">FEELING</h2>
          <EmotionTiles selected={emotions} onToggle={toggleEmotion} max={3} />
          <p className="font-body mt-3 text-[13.5px] italic text-ivory-500">
            {narrateIntent}
            {emotions.length > 1 && emotions[1] && ` — mixed with ${EMOTION_ENTRY[emotions[1]]?.gloss.toLowerCase() ?? ""}`}
          </p>
        </div>

        {/* intensity */}
        <div>
          <h2 className="font-display mb-3.5 text-[13px] tracking-[0.2em] text-gilt-300">HEAT</h2>
          <MirrorDiscs value={intensity} onChange={(v) => setIntensity(v)} />
        </div>

        {/* modes */}
        <div>
          <h2 className="font-display mb-3.5 text-[13px] tracking-[0.2em] text-gilt-300">ROOM</h2>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Emotional mode">
            {MODES.map((m) => (
              <button
                key={m.key}
                role="radio"
                aria-checked={mode === m.key}
                onClick={() => setMode(m.key)}
                className={cn(
                  "rounded-sm px-3.5 py-1.5 font-body text-[13.5px] italic transition-all duration-300",
                  mode === m.key ? "text-chamber-950" : "text-ivory-400 hover:text-gilt-200"
                )}
                style={
                  mode === m.key
                    ? { background: "linear-gradient(180deg,#e8cd93,#c8a25e)", boxShadow: "0 0 18px -4px rgba(217,154,61,0.5)" }
                    : { boxShadow: "inset 0 0 0 1px rgba(200,162,94,0.28)" }
                }
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* form + language */}
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-display mb-3.5 text-[13px] tracking-[0.2em] text-gilt-300">SHAPE</h2>
            <div className="space-y-1.5">
              {FORMS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setForm(f.key)}
                  aria-pressed={form === f.key}
                  className="group flex w-full items-baseline justify-between gap-3 rounded-[3px] px-3 py-2 text-left transition-colors hover:bg-gilt-400/5"
                >
                  <span className={cn("font-body text-[15px]", form === f.key ? "text-gilt-200" : "text-ivory-300 group-hover:text-gilt-200")}>
                    {form === f.key && <span aria-hidden className="mr-2 text-gilt-400">◆</span>}
                    {f.label}
                  </span>
                  <span className="font-record hidden text-[10px] uppercase tracking-[0.12em] text-ivory-600 sm:block">{f.hint}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display mb-3.5 text-[13px] tracking-[0.2em] text-gilt-300">LANGUAGE</h2>
            <div className="space-y-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLanguage(l.key)}
                  aria-pressed={language === l.key}
                  className={cn(
                    "block w-full rounded-[3px] px-3 py-2 text-left font-body text-[15px] transition-colors",
                    language === l.key ? "bg-gilt-400/10 text-gilt-200" : "text-ivory-300 hover:text-gilt-200"
                  )}
                  style={language === l.key ? { boxShadow: "inset 0 0 0 1px rgba(200,162,94,0.35)" } : undefined}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="space-y-4">
          <Plaque onClick={() => void generate()} disabled={loading} variant="primary" size="lg" className="w-full">
            {loading ? "COMPOSING…" : "GENERATE THE SHER"}
          </Plaque>
          <Plaque onClick={() => void randomIshq()} disabled={loading} variant="ghost" size="lg" className="w-full border border-gilt-600/40">
            <Dices size={15} aria-hidden />
            RANDOM ISHQ
          </Plaque>
        </div>

        {recent.length > 0 && (
          <p className="record-text text-[10.5px] tracking-[0.1em] text-ivory-600">
            LAST REQUEST: {recent[0].emotions.join(", ")} · INTENSITY {recent[0].intensity ?? 3} · {recent[0].form}
          </p>
        )}

        {error && (
          <p role="alert" className="border border-velvet-500/60 bg-velvet-900/40 px-4 py-3 font-body text-[14px] text-ivory-300">
            {error}
          </p>
        )}
      </section>

      {/* ——— result alcove ——— */}
      <section aria-label="Result" className="relative">
        {shayari ? (
          <PoemCard
            shayari={shayari}
            demo={demo}
            loading={loading}
            onResult={(s, d) => {
              setShayari(s);
              setDemo(d);
              recordHistory(s);
            }}
          />
        ) : (
          <div className="alcove flex min-h-[420px] flex-col items-center justify-center gap-4 px-8 py-14 text-center">
            <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
              <SpareGround />
            </div>
            {loading ? (
              <>
                <Loader2 className="animate-spin text-gilt-300" size={30} aria-hidden />
                <p className="font-body italic text-ivory-400">the mehfil is listening…</p>
              </>
            ) : (
              <>
                <p className="urdu-text text-[19px] leading-loose text-ivory-300">درد کو الفاظ دینے کا وقت</p>
                <p className="font-body max-w-sm text-[15px] italic text-ivory-500">
                  Choose what you feel and press Generate — a fresh sher will be
                  composed here, and this alcove will light up to hold it.
                </p>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function SpareGround() {
  return <MirrorMosaic className="h-full w-full" seed={41} lit={0} />;
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center font-body italic text-ivory-500">preparing the mehfil…</div>}>
      <StudioInner />
    </Suspense>
  );
}
