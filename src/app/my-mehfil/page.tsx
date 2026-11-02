"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2, Save, Loader2 } from "lucide-react";
import type { GeneratedShayari } from "@/lib/types";
import { PoemCard } from "@/components/studio/PoemCard";
import { Plaque } from "@/components/chamber/Plaque";
import {
  listSaved, removeSaved, setCollection, listHistory, clearHistory, saveShayari,
  saveCollectionPreference, loadCollectionPreference,
  type LedgerEntry, type HistoryRecord, type CollectionName,
} from "@/lib/mehfil-storage";
import { cn } from "@/lib/utils";

const COLLECTIONS: CollectionName[] = ["Uncollated", "My Dard", "My Ishq", "My Junoon", "My Shikwa", "My Sufi Collection"];

const CHIP_LABEL: Record<CollectionName, string> = {
  Uncollated: "All+unfiled",
  "My Dard": "My Dard",
  "My Ishq": "My Ishq",
  "My Junoon": "My Junoon",
  "My Shikwa": "My Shikwa",
  "My Sufi Collection": "My Sufi Collection",
};

export default function MyMehfilPage() {
  const [saved, setSaved] = useState<LedgerEntry[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [collection, setCollectionFilter] = useState<CollectionName>("Uncollated");
  const [openEntry, setOpenEntry] = useState<LedgerEntry | null>(null);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setSaved(listSaved());
    setHistory(listHistory());
  }, []);

  // react to saves written by PoemCards anywhere in the app
  useEffect(() => {
    setMounted(true);
    setCollectionFilter(loadCollectionPreference());
    refresh();
    const onChanged = () => refresh();
    window.addEventListener("mehfil:storage-changed", onChanged);
    return () => {
      window.removeEventListener("mehfil:storage-changed", onChanged);
    };
  }, [refresh]);

  useEffect(() => {
    if (mounted) saveCollectionPreference(collection);
  }, [collection, mounted]);

  const visible = saved.filter((e) => collection === "Uncollated" || e.collection === collection || e.collection === "Uncollated");

  return (
    <div className="mx-auto w-full max-w-[1300px] px-4 pb-24 pt-12 sm:px-6 lg:px-10">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-[24px] tracking-[0.16em] text-gilt-200 sm:text-[28px]">MY MEHFIL</h1>
        <p className="font-body mt-4 text-[16px] leading-relaxed text-ivory-400">
          Your own mehfil — a dated ledger of the shers you saved. Everything here
          lives in your browser, only on your device; nothing is uploaded.
        </p>
      </header>

      <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Collections">
        {COLLECTIONS.map((c) => (
          <button
            key={c}
            onClick={() => setCollectionFilter(c)}
            aria-pressed={collection === c}
            className={
              "rounded-full px-4 py-1.5 font-body text-[13.5px] italic transition-all duration-300 " +
              (collection === c ? "text-chamber-950" : "text-ivory-400 hover:text-gilt-200")
            }
            style={
              collection === c
                ? { background: "linear-gradient(180deg,#e8cd93,#c8a25e)" }
                : { boxShadow: "inset 0 0 0 1px rgba(200,162,94,0.28)" }
            }
          >
            {CHIP_LABEL[c]}
            {c !== "Uncollated" && (
              <span className="record-text ml-2 text-[10px]">
                {saved.filter((e) => e.collection === c).length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* the ledger */}
      <section className="mt-12" aria-label="Saved shayari">
        {visible.length === 0 ? (
          <div className="alcove flex min-h-[240px] flex-col items-center justify-center gap-3 px-8">
            <p className="urdu-text text-[18px] text-ivory-300">ابھی یہ محفل خالی ہے</p>
            <p className="font-body max-w-md text-center text-[14.5px] italic text-ivory-500">
              Save a sher from the generator, Us Dard Ko Likho or Random Ishq — it will be bound into this ledger with its date.
            </p>
            <Plaque href="/studio" variant="ghost" size="sm">GO TO THE GENERATOR</Plaque>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {visible.map((entry) => (
              <li key={entry.shayari.id}>
                <div
                  className={cn(
                    "niche flex flex-wrap items-center justify-between gap-4 rounded-[3px] px-5 py-4",
                    openEntry?.shayari.id === entry.shayari.id && ""
                  )}
                  style={openEntry?.shayari.id === entry.shayari.id ? { boxShadow: "inset 0 0 0 1px rgba(232,205,147,0.5)" } : undefined}
                >
                  <button
                    className="min-w-0 flex-1 text-left"
                    onClick={() => setOpenEntry((cur) => (cur?.shayari.id === entry.shayari.id ? null : entry))}
                    aria-expanded={openEntry?.shayari.id === entry.shayari.id}
                  >
                    <span className="font-display block text-[13.5px] tracking-[0.1em] text-ivory-200">
                      {entry.shayari.title}
                    </span>
                    <span className="font-body mt-1 block truncate text-[13.5px] italic text-ivory-500">
                      {entry.shayari.couplets[0]?.romanMisra1}
                    </span>
                    <span className="record-text mt-1 block text-[10px] uppercase tracking-[0.14em] text-ivory-600">
                      {new Date(entry.savedAt).toLocaleString()} · {entry.collection} · {entry.shayari.emotionIntent.primary}
                      {entry.shayari.demo && " · demo"}
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <select
                      aria-label="Move to collection"
                      value={entry.collection}
                      onChange={(e) => {
                        setCollection(entry.shayari.id, e.target.value as CollectionName);
                        refresh();
                      }}
                      className="rounded-[2px] border border-gilt-600/40 bg-chamber-900 px-2 py-1.5 font-record text-[10.5px] text-ivory-300"
                    >
                      {COLLECTIONS.map((c) => (
                        <option key={c} value={c}>{CHIP_LABEL[c]}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        removeSaved(entry.shayari.id);
                        refresh();
                      }}
                      aria-label={`Delete ${entry.shayari.title}`}
                      className="rounded-[2px] p-2 text-ivory-600 transition-colors hover:text-velvet-500"
                    >
                      <Trash2 size={16} aria-hidden />
                    </button>
                  </div>
                </div>
                {openEntry?.shayari.id === entry.shayari.id && (
                  <div className="mt-2.5">
                    <PoemCard shayari={entry.shayari} demo={entry.shayari.demo} onResult={(s) => {
                      saveShayari(s, entry.collection);
                      refresh();
                    }} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* generation history */}
      <section className="mt-16" aria-label="Generation history">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-[14px] tracking-[0.18em] text-gilt-300">BROWSING HISTORY</h2>
          {history.length > 0 && (
            <button
              onClick={() => {
                clearHistory();
                refresh();
              }}
              className="font-display text-[10.5px] uppercase tracking-[0.16em] text-ivory-600 hover:text-velvet-500"
            >
              clear
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="font-body text-[14px] italic text-ivory-500">No generations yet in this device&apos;s history.</p>
        ) : (
          <ul className="divide-y divide-gilt-600/15">
            {history.slice(0, 12).map((h) => (
              <li key={h.viewedAt} className="flex items-baseline justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-body text-[14px] text-ivory-400">{h.preview}…</p>
                  <p className="record-text mt-0.5 text-[10px] uppercase tracking-[0.12em] text-ivory-600">
                    {h.emotions} · {new Date(h.viewedAt).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    saveShayari(h.shayari);
                    refresh();
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 font-display text-[10.5px] uppercase tracking-[0.14em] text-gilt-400 hover:text-gilt-200"
                >
                  <Save size={12} aria-hidden /> save
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
