/**
 * MY MEHFIL — browser-storage ledger (user decision: browser storage only).
 * Saved shayari, collections and history live on-device; nothing is sent to
 * a server. The visitor-ledger discipline stays: every entry keeps its date.
 */

import type { GeneratedShayari } from "@/lib/types";

const KEY_SAVED = "mehfil.saved.v1";
const KEY_HISTORY = "mehfil.history.v1";
const KEY_COLLECTION_PREF = "mehfil.collection.v1";

export type CollectionName = "My Dard" | "My Ishq" | "My Junoon" | "My Shikwa" | "My Sufi Collection" | "Uncollated";

export interface LedgerEntry {
  savedAt: string;
  collection: CollectionName;
  shayari: GeneratedShayari;
}

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, list: T[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(list.slice(0, 200)));
    window.dispatchEvent(new CustomEvent("mehfil:storage-changed", { detail: { key } }));
  } catch {
    /* storage full or unavailable — memory only */
  }
}

export function listSaved(): LedgerEntry[] {
  return read<LedgerEntry>(KEY_SAVED).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function saveShayari(shayari: GeneratedShayari, collection?: CollectionName): LedgerEntry {
  const auto: CollectionName = autoComplete(shayari);
  const entry: LedgerEntry = {
    savedAt: new Date().toISOString(),
    collection: collection ?? auto,
    shayari,
  };
  const list = read<LedgerEntry>(KEY_SAVED).filter((e) => e.shayari.id !== shayari.id);
  list.push(entry);
  write(KEY_SAVED, list);
  return entry;
}

export function removeSaved(id: string): void {
  write(KEY_SAVED, read<LedgerEntry>(KEY_SAVED).filter((e) => e.shayari.id !== id));
}

export function setCollection(id: string, collection: CollectionName): void {
  write(
    KEY_SAVED,
    read<LedgerEntry>(KEY_SAVED).map((e) => (e.shayari.id === id ? { ...e, collection } : e))
  );
}

export interface HistoryRecord {
  viewedAt: string;
  emotions: string;
  preview: string;
  shayari: GeneratedShayari;
}

export function recordHistory(shayari: GeneratedShayari): void {
  const rec: HistoryRecord = {
    viewedAt: new Date().toISOString(),
    emotions: [shayari.emotionIntent.primary, ...shayari.emotionIntent.secondary].join(" + "),
    preview: shayari.couplets[0]?.romanMisra1 ?? shayari.title,
    shayari,
  };
  write(KEY_HISTORY, [rec, ...read<HistoryRecord>(KEY_HISTORY)].slice(0, 60));
}

export function listHistory(): HistoryRecord[] {
  return read<HistoryRecord>(KEY_HISTORY);
}

export function clearHistory(): void {
  write(KEY_HISTORY, []);
}

export function saveCollectionPreference(c: CollectionName): void {
  try {
    window.localStorage.setItem(KEY_COLLECTION_PREF, c);
  } catch {
    /* memory only */
  }
}

export function loadCollectionPreference(): CollectionName {
  try {
    const c = window.localStorage.getItem(KEY_COLLECTION_PREF);
    return (c as CollectionName) ?? "Uncollated";
  } catch {
    return "Uncollated";
  }
}

function autoComplete(shayari: GeneratedShayari): CollectionName {
  const mode = shayari.emotionIntent.mode;
  const dir = shayari.emotionIntent.direction;
  if (mode === "sufi" || dir === "spiritual") return "My Sufi Collection";
  if (shayari.emotionIntent.primary === "bewafai" || mode === "bewafai") return "My Shikwa";
  if (shayari.emotionIntent.primary === "gussa") return "My Shikwa";
  if (dir === "romantic") return "My Ishq";
  return "My Dard";
}
