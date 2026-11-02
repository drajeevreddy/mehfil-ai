"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Copy, Check, Download, Share2, Save, Loader2, Languages, RotateCcw,
} from "lucide-react";
import type { GeneratedShayari, Language } from "@/lib/types";
import { EMOTION_ENTRY } from "@/engines/emotion/lexicon";
import { cn } from "@/lib/utils";
import { paintCard, downloadBlob, type CardFormat } from "@/lib/poetry-card";
import { postRefine } from "@/lib/mehfil-client";
import { fileNameFor } from "@/lib/filename";
import { saveShayari } from "@/lib/mehfil-storage";
import { MirrorMosaic } from "@/components/chamber/MirrorMosaic";

export type RefineAction = "deeper" | "more-pain" | "more-angry" | "more-ishq" | "more-sufi" | "change-ending";

interface PoemCardProps {
  shayari: GeneratedShayari;
  demo: boolean;
  onResult?: (shayari: GeneratedShayari, demo: boolean) => void;
  onLoadStart?: () => void;
  loading?: boolean;
  className?: string;
}

const LANG_VIEW_LABEL: Record<string, string> = {
  urdu: "Urdu",
  roman: "Roman Urdu",
  hindi: "Hindi",
  english: "English",
  "urdu-en": "Urdu + English",
};

export function PoemCard({ shayari, demo, onResult, onLoadStart, loading, className }: PoemCardProps) {
  const reduce = useReducedMotion();
  const [view, setView] = useState<Language>(shayari.language);
  const [copied, setCopied] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [showTranslate, setShowTranslate] = useState(false);
  const [exportFormat, setExportFormat] = useState<CardFormat>("4:5");

  const emotionLabels = useMemo(() => {
    const i = shayari.emotionIntent;
    const list = [i.primary, ...i.secondary];
    return list.map((k) => EMOTION_ENTRY[k]?.word.roman ?? k).join(" + ");
  }, [shayari]);

  const coupletLinesForView = (c: GeneratedShayari["couplets"][number], v: Language): [string, string] => {
    switch (v) {
      case "urdu": return [c.urduMisra1, c.urduMisra2];
      case "hindi": return [c.hindiMisra1, c.hindiMisra2];
      case "english": return [c.english1, c.english2];
      case "urdu-en": return [c.urduMisra1, ""];
      default: return [c.romanMisra1, c.romanMisra2];
    }
  };
  const wantRtl = view === "urdu" || shayari.language === "urdu";

  async function copyText() {
    const texts = shayari.couplets.map((c) => `${c.urduMisra1}\n${c.urduMisra2}\n(${c.romanMisra1} / ${c.romanMisra2})`).join("\n\n");
    try {
      await navigator.clipboard.writeText(texts);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function refine(action: RefineAction) {
    if (!onResult || loading) return;
    setBusyAction(action);
    onLoadStart?.();
    const res = await postRefine({ shayari, action });
    setBusyAction(null);
    if (res.shayari) onResult(res.shayari, res.demo);
  }

  async function downloadImage() {
    setBusyAction("image");
    const lines = shayari.couplets.map((c) =>
      view === "urdu"
        ? `${c.urduMisra1} ﴿${c.urduMisra2}﴾`
        : view === "english"
          ? `${c.english1}\n${c.english2}`
          : `${c.romanMisra1} — ${c.romanMisra2}`
    ).join("\n\n");
    const wantRtlCard = view === "urdu";
    const blob = await paintCard(
      {
        lines: lines.split("\n"),
        wantRtl: wantRtlCard,
        title: shayari.title,
        emotions: emotionLabels,
        concept: shayari.philosophicalConcept ?? "",
        providerLine: demo ? "DEMO — COMPOSED BY THE LOCAL CORE" : "MEHFIL AI — GENERATED",
      },
      exportFormat
    );
    setBusyAction(null);
    if (blob) downloadBlob(blob, fileNameFor(shayari.title, exportFormat));
  }

  async function shareCard() {
    const blob = await paintCard({
      lines: shayari.couplets.map((c) => (view === "urdu" ? c.urduMisra1 : c.romanMisra1)),
      wantRtl: view === "urdu",
      title: shayari.title,
      emotions: emotionLabels,
      concept: shayari.philosophicalConcept ?? "",
      providerLine: "MEHFIL AI",
    }, "4:5");
    if (!blob) return;
    const file = new File([blob], `${shayari.title}.png`, { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "MEHFIL AI", text: "A sher from MEHFIL AI" });
      } catch {
        /* user cancelled share */
      }
    }
  }

  function saveToMehfil() {
    // write the ledger directly — saving must not depend on another page listening
    saveShayari(shayari);
    window.dispatchEvent(new CustomEvent("mehfil:storage-changed", { detail: { key: "mehfil.saved.v1" } }));
  }

  return (
    <article className={cn("alcove relative overflow-hidden px-6 pb-8 pt-16 sm:px-10 sm:pt-20", !reduce && "motion-safe", className)} aria-label="Generated shayari">
      {/* lit mosaic ground — quieter behind text (contrast floor) */}
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <motion.div
          initial={reduce ? undefined : { opacity: 0.25 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full w-full"
        >
          <MirrorMosaic className="h-full w-full" lit={demo ? 0.18 : 0.3} seed={13} />
        </motion.div>
      </div>
      {/* scrim: the poem always reads against near-black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 42%, rgba(11,10,8,0.82), rgba(11,10,8,0.45) 70%, transparent 92%)",
        }}
      />

      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-chamber-950/70" role="status" aria-live="polite">
          <Loader2 className="animate-spin text-gilt-300" size={28} aria-hidden />
          <p className="font-body italic text-ivory-400">The mehfil is listening…</p>
        </div>
      )}

      <div className="relative z-10">
        <header className="flex flex-col items-center justify-center gap-2 text-center">
          <h3 className="font-display text-xl tracking-[0.18em] text-gilt-200 sm:text-2xl">
            {shayari.title}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {emotionLabels.split(" + ").map((e) => (
              <span key={e} className="rounded-full border border-gilt-500/40 px-2.5 py-0.5 font-record text-[11px] tracking-[0.1em] text-ivory-400">
                {e}
              </span>
            ))}
          </div>
        </header>

        <div aria-hidden className="gilt-rule mx-auto mt-4 opacity-80" style={{ width: "72%" }} />

        {/* poem body */}
        <div className={cn("px-2 pb-6 pt-8 text-center", wantRtl ? "urdu-text" : "font-body")} dir={wantRtl ? "rtl" : "ltr"}>
          {shayari.couplets.map((c, ci) => {
            const [l1, l2] = coupletLinesForView(c, view);
            return (
              <motion.blockquote
                key={ci}
                initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: reduce ? 0 : 0.25 + ci * 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "mx-auto max-w-2xl",
                  ci > 0 && "mt-7 border-t border-gilt-600/20 pt-7"
                )}
              >
                <p className={cn(wantRtl ? "" : "italic")}>{l1}</p>
                {l2 && (
                  <p className={cn("mt-1", view === "english" ? "font-body text-ivory-500" : "")}>{l2}</p>
                )}
                {(view === "urdu" || view === "english") && (
                  <>
                    {view === "urdu" && (
                      <p className="font-body mt-3 text-[13.5px] not-italic text-ivory-500" dir="ltr">
                        {c.romanMisra1} — {c.romanMisra2}
                      </p>
                    )}
                    {view === "english" && (
                      <p className="record-text mt-2 text-[11px] tracking-[0.08em] text-ivory-600" dir="ltr">
                        {c.romanMisra1} / {c.romanMisra2}
                      </p>
                    )}
                  </>
                )}
              </motion.blockquote>
            );
          })}
        </div>

        {/* concept + inspiration + demo stamp */}
        <footer className="mx-auto max-w-2xl space-y-2.5">
          {shayari.philosophicalConcept && (
            <p className="text-center font-record text-[12px] tracking-[0.14em] text-gilt-400/90">
              CONCEPT · {shayari.philosophicalConcept.toUpperCase().replace(/-/g, " ")}
            </p>
          )}
          {shayari.qawwaliContext?.composition && (
            <p className="text-center font-body text-[13px] leading-relaxed text-ivory-500">
              Inspired by the researched themes of{" "}
              <em className="text-ivory-300">{shayari.qawwaliContext.composition.verifiedTitle}</em>
              {" "}— no lyrics are used; themes come from labeled research annotations.
            </p>
          )}
          {shayari.metaphorExplanations.length > 0 && (
            <div className="text-center">
              {shayari.metaphorExplanations.map((m) => (
                <p key={m.word} className="font-body text-[13px] text-ivory-500">
                  <span className="urdu-inline text-gilt-300">{m.word}</span> — {m.gloss}
                </p>
              ))}
            </div>
          )}
          <p className="record-text text-center text-[11px] tracking-[0.12em] text-ivory-600">
            {demo ? "DEMO · COMPOSED BY THE LOCAL CORE ENGINE" : "GENERATED · " + shayari.provider.toUpperCase()}
            {shayari.quality.regenerations > 0 && ` · REGENERATED ×${shayari.quality.regenerations}`}
          </p>
        </footer>

        {/* actions */}
        <div className="mt-7 border-t border-gilt-600/20 pt-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ActionButton onClick={copyText} label={copied ? "Copied" : "Copy"} icon={copied ? Check : Copy} />
            <ActionButton onClick={saveToMehfil} label="Save to My Mehfil" icon={Save} />
            <ActionButton onClick={() => setShowTranslate((v) => !v)} label="Translate" icon={Languages} active={showTranslate} />
            <div className="mx-2 hidden h-6 w-px bg-gilt-600/30 sm:block" aria-hidden />
            <ActionButton onClick={downloadImage} label="Image" icon={busyAction === "image" ? Loader2 : Download} busy={busyAction === "image"} />
            <ActionButton onClick={shareCard} label="Share" icon={Share2} />
          </div>

          {showTranslate && (
            <div className="mx-auto mt-4 max-w-xl space-y-3" data-testid="translate-panel">
              {(Object.keys(LANG_VIEW_LABEL) as Language[]).map((lang) => (
                <div key={lang} className="flex gap-3">
                  <span className="record-text mt-1 w-24 shrink-0 text-[10px] uppercase tracking-[0.14em] text-gilt-500">
                    {LANG_VIEW_LABEL[lang]}
                  </span>
                  <p className={cn("font-body text-[14px] text-ivory-400", lang === "urdu" && "urdu-text text-[16px] text-ivory-300", lang === "urdu-en" && "text-ivory-500")} dir={lang === "urdu" ? "rtl" : "ltr"}>
                    {shayari.couplets
                      .map((c) => {
                        if (lang === "urdu") return `${c.urduMisra1} • ${c.urduMisra2}`;
                        if (lang === "hindi") return `${c.hindiMisra1} • ${c.hindiMisra2}`;
                        if (lang === "roman") return `${c.romanMisra1} • ${c.romanMisra2}`;
                        if (lang === "english") return `${c.english1} • ${c.english2}`;
                        return `${c.urduMisra1}: ${c.english1} ${c.english2}`;
                      })
                      .join("\n")}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* refinement actions */}
          {onResult && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2" aria-label="Refine">
              <span className="record-text mr-1 text-[10px] uppercase tracking-[0.18em] text-ivory-600">Refine:</span>
              <RefineButton action="deeper" label="Make It Deeper" busy={busyAction} onClick={refine} />
              <RefineButton action="more-pain" label="More Pain" busy={busyAction} onClick={refine} />
              <RefineButton action="more-angry" label="More Angry" busy={busyAction} onClick={refine} />
              <RefineButton action="more-ishq" label="Increase Ishq" busy={busyAction} onClick={refine} />
              <RefineButton action="more-sufi" label="More Sufi" busy={busyAction} onClick={refine} />
              <RefineButton action="change-ending" label="Change the Ending" busy={busyAction} icon={RotateCcw} onClick={refine} />
            </div>
          )}

          {/* image format selector */}
          <div className="mt-4 flex items-center justify-center gap-3" role="group" aria-label="Image format">
            <span className="record-text text-[10px] uppercase tracking-[0.14em] text-ivory-600">Image:</span>
            {(["4:5", "1:1", "9:16"] as CardFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => setExportFormat(f)}
                aria-pressed={exportFormat === f}
                className={cn(
                  "rounded-sm px-2.5 py-1 font-record text-[11px] transition-colors",
                  exportFormat === f ? "bg-gilt-400/15 text-gilt-200" : "text-ivory-600 hover:text-gilt-300",
                  exportFormat === f ? "" : ""
                )}
                style={exportFormat === f ? { boxShadow: "inset 0 0 0 1px rgba(200,162,94,0.5)" } : undefined}
              >
                {f === "4:5" ? "4:5 post" : f === "1:1" ? "1:1" : "9:16 story"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionButton({
  onClick, label, icon: Icon, busy, active,
}: {
  onClick: () => void | Promise<void>;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  busy?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={() => void onClick()}
      disabled={busy}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-[2px] px-3.5 py-2 font-display text-[11px] tracking-[0.14em] uppercase transition-all duration-300",
        "text-ivory-400 hover:text-gilt-200 disabled:opacity-60",
        active && "text-gilt-200",
        active ? "" : ""
      )}
      style={{ boxShadow: "inset 0 0 0 1px rgba(200,162,94,0.28)" }}
    >
      <Icon size={14} className={busy ? "animate-spin" : undefined} aria-hidden />
      {label}
    </button>
  );
}

function RefineButton({
  action, label, busy, onClick, icon: Icon,
}: {
  action: RefineAction;
  label: string;
  busy: string | null;
  onClick: (a: RefineAction) => Promise<void>;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
}) {
  const isBusy = busy === action;
  return (
    <button
      onClick={() => void onClick(action)}
      disabled={busy !== null}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-[13px] italic transition-all duration-300",
        "text-ivory-500 hover:text-gilt-200 disabled:opacity-50"
      )}
      style={{ boxShadow: "inset 0 0 0 1px rgba(200,162,94,0.2)" }}
    >
      {isBusy ? <Loader2 size={12} className="animate-spin" aria-hidden /> : Icon ? <Icon size={12} aria-hidden /> : null}
      {label}
    </button>
  );
}
