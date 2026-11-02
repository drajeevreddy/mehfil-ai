"use client";

import { useEffect, useState } from "react";
import { Loader2, KeyRound, ShieldAlert } from "lucide-react";
import { Plaque } from "@/components/chamber/Plaque";
import { cn } from "@/lib/utils";

interface CorpusRow {
  slug: string;
  verifiedTitle: string;
  language: string;
  researchStatus: string;
  confidence: string;
  sourceCount: number;
  completeness: number; // 0..1
  emotions: string[];
}

/**
 * Research dashboard. The gate posts x-mehfil-admin-key to protected
 * endpoints; demo mode (no MEHFIL_ADMIN_KEY server-side) responds with an
 * explicit unconfigured state — the dashboard never pretends writes happened.
 */
export default function AdminPage() {
  const [rows, setRows] = useState<CorpusRow[] | null>(null);
  const [historyCount, setHistoryCount] = useState<number | null>(null);
  const [flagCount, setFlagCount] = useState<number | null>(null);
  const [adminState, setAdminState] = useState<"idle" | "probing" | "unconfigured" | "open" | "denied">("idle");
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/qawwali")
      .then((r) => r.json())
      .then((d: { entries?: never[] }) => {
        const entries = (d.entries ?? []) as {
          slug: string; verifiedTitle: string; language: string; researchStatus: string;
          confidence: string; sources: unknown[]; interpretation: { dominantEmotions: string[]; emotionalProgression: string[] };
        }[];
        const mapped: CorpusRow[] = entries.map((e) => {
          const fields = [e.language, e.verifiedTitle, ...e.interpretation.dominantEmotions, ...e.interpretation.emotionalProgression, ...e.sources.map(() => "src")];
          const filled = fields.filter((f) => f && f !== null && f !== "").length;
          return {
            slug: e.slug,
            verifiedTitle: e.verifiedTitle,
            language: e.language,
            researchStatus: e.researchStatus,
            confidence: e.confidence,
            sourceCount: e.sources.length,
            completeness: Math.min(1, filled / 9),
            emotions: [...e.interpretation.dominantEmotions, ...e.interpretation.emotionalProgression].slice(0, 3),
          };
        });
        setRows(mapped);
      })
      .catch(() => setError("The research catalog could not be loaded."));
    fetch("/api/shayari/history")
      .then((r) => r.json())
      .then((d: { entries?: unknown[] }) => setHistoryCount((d.entries ?? []).length))
      .catch(() => setHistoryCount(null));
  }, []);

  async function attemptOpen() {
    // probe a protected endpoint with the typed key to record the gate status
    const res = await fetch("/api/admin/research", {
      method: "POST",
      headers: { "content-type": "application/json", "x-mehfil-admin-key": key },
      body: JSON.stringify({ _probe: "gate-check" }),
    });
    if (res.status === 501) setAdminState("unconfigured");
    else if (res.status === 401) setAdminState("denied");
    else if (res.ok) {
      setAdminState("open");
      setRows(null);
      setError(null);
    } else {
      setAdminState("denied");
      setError(`Gate responded ${res.status}. Protected operations refused the request.`);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1300px] px-4 pb-24 pt-12 sm:px-6 lg:px-10">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-[24px] tracking-[0.16em] text-gilt-200">RESEARCH DASHBOARD</h1>
        <p className="font-body mt-3 text-[15.5px] leading-relaxed text-ivory-400">
          The administrative chamber: research statuses, completeness and
          generation signals. Protected operations require the admin key;
          public visitors can never reach them.
        </p>
      </header>

      {/* gate */}
      <section className="mx-auto mt-10 max-w-xl" aria-label="Admin gate">
        <div className="velvet-panel rounded-[4px] p-6">
          <div className="flex items-center gap-3">
            <KeyRound size={17} className="text-gilt-300" aria-hidden />
            <h2 className="font-display text-[13px] tracking-[0.18em] text-gilt-200">ADMIN KEY</h2>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="x-mehfil-admin-key"
              aria-label="Admin key"
              className="min-w-56 flex-1 rounded-[3px] border border-gilt-600/40 bg-chamber-900/80 px-3 py-2.5 font-record text-[13px] text-ivory-200 placeholder:text-ivory-600/60"
            />
            <Plaque onClick={() => void attemptOpen()} variant="primary" size="sm">VERIFY</Plaque>
          </div>
          {adminState === "unconfigured" && (
            <p className="font-body mt-4 flex items-start gap-2 text-[13.5px] leading-relaxed text-ivory-400">
              <ShieldAlert size={15} className="mt-0.5 shrink-0 text-gilt-400" aria-hidden />
              Admin operations are not configured on this server. Set MEHFIL_ADMIN_KEY
              on the server to enable protected research writes — in demo mode this
              dashboard is read-only and never pretends otherwise.
            </p>
          )}
          {adminState === "denied" && (
            <p role="alert" className="font-body mt-4 text-[13.5px] text-ivory-300">
              That key was refused. Protected operations stay closed.
            </p>
          )}
          {adminState === "open" && (
            <p className="font-body mt-4 text-[13.5px] text-gilt-300">Gate open — research writes accepted on this server.</p>
          )}
          <p className="record-text mt-4 text-[10px] tracking-[0.1em] text-ivory-600">
            ROLE MODEL: ADMIN OPERATIONS ARE SERVER-SIDE KEY-GATED. DEMO MODE IS READ-ONLY BY DESIGN.
          </p>
        </div>
      </section>

      {error && (
        <p role="alert" className="mx-auto mt-4 max-w-xl border border-velvet-500/60 bg-velvet-900/40 px-4 py-3 font-body text-[14px] text-ivory-300">{error}</p>
      )}

      {/* signals */}
      <section className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-3" aria-label="Signals">
        <SignalCard label="corpus entries" value={rows ? String(rows.length) : null} />
        <SignalCard label="verified metadata" value={rows ? String(rows.filter((r) => r.researchStatus === "verified_metadata").length) : null} />
        <SignalCard label="server-session generations" value={historyCount === null ? null : String(historyCount)} />
      </section>

      {/* corpus table */}
      <section className="mt-14" aria-label="Research completeness">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-[14px] tracking-[0.18em] text-gilt-300">RESEARCH COMPLETENESS</h2>
          <span className="record-text text-[10px] uppercase tracking-[0.14em] text-ivory-600">filters: status · language · emotion</span>
        </div>
        <div className="niche overflow-x-auto rounded-[3px]">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-gilt-600/20">
                {["composition", "language", "status", "confidence", "sources", "completeness"].map((h) => (
                  <th key={h} className="record-text px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-gilt-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="font-record text-[13px] text-ivory-400">
              {(rows ?? []).map((r) => (
                <tr key={r.slug} className="border-b border-gilt-600/10 last:border-b-0">
                  <td className="px-4 py-3 font-body text-[14px] text-ivory-200">{r.verifiedTitle}</td>
                  <td className="px-4 py-3">{r.language}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "rounded-[2px] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]",
                      r.researchStatus === "verified_metadata" ? "bg-gilt-400/15 text-gilt-200" : "bg-ivory-600/10 text-ivory-500"
                    )}>
                      {r.researchStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">{r.confidence}</td>
                  <td className="px-4 py-3">{r.sourceCount}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-24 overflow-hidden rounded-sm bg-chamber-700">
                        <span
                          className="block h-full rounded-sm"
                          style={{
                            width: `${Math.round(r.completeness * 100)}%`,
                            background: "linear-gradient(90deg,#8a6a45,#e8cd93)",
                          }}
                        />
                      </span>
                      {Math.round(r.completeness * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows && (
            <div className="flex min-h-[120px] items-center justify-center gap-3">
              <Loader2 className="animate-spin text-gilt-400" size={20} aria-hidden />
              <span className="font-body italic text-ivory-500">loading the corpus…</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SignalCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="niche px-6 py-6">
      <p className="record-text text-[10px] uppercase tracking-[0.2em] text-gilt-500">{label}</p>
      <p className="font-display mt-2.5 text-[26px] text-gilt-100">{value ?? "—"}</p>
    </div>
  );
}
