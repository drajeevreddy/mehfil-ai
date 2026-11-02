/**
 * Client-side API helpers — thin fetch wrappers with timeout + typed errors.
 * No credentials here: all AI calls are server-side.
 */

import type { GeneratedShayari, GenerateRequest, RefineRequest } from "@/lib/types";

async function withTimeout<T>(p: (signal: AbortSignal) => Promise<T>, ms: number): Promise<T> {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    return await p(c.signal);
  } finally {
    clearTimeout(t);
  }
}

export interface GenResponse {
  shayari: GeneratedShayari;
  demo: boolean;
  provider?: { provider: string; demo: boolean; reason?: string };
  roll?: unknown;
}

const NETWORK_HINT =
  "The mehfil could not be reached. Check your connection and try again — your selections are safe.";

let recentRequests: GenerateRequest[] = [];

export function getRecentRequests(): GenerateRequest[] {
  return recentRequests;
}

export async function postGenerate(req: GenerateRequest & { language?: string }): Promise<GenResponse> {
  recentRequests = [{ ...req }, ...recentRequests].slice(0, 20);
  return withTimeout(async (signal) => {
    let res: Response;
    try {
      res = await fetch("/api/shayari/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(req),
        signal,
      });
    } catch {
      throw new Error(NETWORK_HINT);
    }
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
      if (res.status === 429) throw new Error(data.detail ?? "Too many requests — wait a minute.");
      throw new Error(data.detail ?? data.error ?? "Generation failed — try again.");
    }
    return (await res.json()) as GenResponse;
  }, 60_000);
}

export async function postRandom(body: { filter?: string; seed?: number }): Promise<GenResponse> {
  return withTimeout(async (signal) => {
    let res: Response;
    try {
      res = await fetch("/api/shayari/random", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal,
      });
    } catch {
      throw new Error(NETWORK_HINT);
    }
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
      throw new Error(data.detail ?? "The roll failed — try again.");
    }
    return (await res.json()) as GenResponse;
  }, 60_000);
}

export async function postRefine(req: RefineRequest & { seed?: number }): Promise<GenResponse> {
  return withTimeout(async (signal) => {
    let res: Response;
    try {
      res = await fetch("/api/shayari/refine", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...req, seed: Math.floor(Math.random() * 2 ** 31) }),
        signal,
      });
    } catch {
      throw new Error(NETWORK_HINT);
    }
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
      throw new Error(data.detail ?? "Refinement failed — try again.");
    }
    return (await res.json()) as GenResponse;
  }, 60_000);
}

export async function postGenerateForQawwali(
  id: string,
  req: Partial<GenerateRequest> & { language?: string }
): Promise<GenResponse> {
  return withTimeout(async (signal) => {
    let res: Response;
    try {
      res = await fetch(`/api/qawwali/${id}/generate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(req),
        signal,
      });
    } catch {
      throw new Error(NETWORK_HINT);
    }
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
      throw new Error(data.detail ?? "The mehfil went quiet — try again.");
    }
    return (await res.json()) as GenResponse;
  }, 60_000);
}

export async function fetchQawwaliList(): Promise<{
  count: number;
  verifiedCount: number;
  coverageNote: string;
  entries: {
    slug: string;
    verifiedTitle: string;
    alternateTitles: string[];
    language: string;
    poeticTradition: string;
    attributedPoet: string | null;
    interpretation: {
      emotionalSummary: string;
      dominantEmotions: string[];
      emotionalProgression: string[];
      sufiConcepts: string[];
      symbolicImagery: string[];
      literaryCharacteristics: string[];
    };
    researchStatus: string;
    confidence: string;
    coverageNote: string;
    yearsRecorded?: string;
  }[];
}> {
  return withTimeout(async (signal) => {
    let res: Response;
    try {
      res = await fetch("/api/qawwali", { signal, next: { revalidate: 60 } as never });
    } catch {
      throw new Error(NETWORK_HINT);
    }
    if (!res.ok) throw new Error("The research catalog could not be opened.");
    return (await res.json()) as never;
  }, 30_000);
}
