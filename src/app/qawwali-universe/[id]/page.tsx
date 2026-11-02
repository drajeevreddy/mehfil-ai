import Link from "next/link";
import { notFound } from "next/navigation";
import { getComposition } from "@/engines/qawwali/engine";
import { Stamps } from "@/components/usdard/UsDardFlow";
import { EMOTION_ENTRY } from "@/engines/emotion/lexicon";
import type { EmotionKey } from "@/lib/types";
import { Plaque } from "@/components/chamber/Plaque";

export default async function QawwaliProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getComposition(id);
  if (!entry) notFound();

  const emoLabel = (k: string) => EMOTION_ENTRY[k as EmotionKey]?.word.roman ?? k;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <nav aria-label="Back" className="mb-10">
        <Link href="/qawwali-universe" className="font-display text-[11px] uppercase tracking-[0.2em] text-gilt-400 hover:text-gilt-200 underline-offset-4 hover:underline">
          ← Qawwali Universe
        </Link>
      </nav>

      <header className="max-w-3xl">
        <h1 className="font-display text-[26px] tracking-[0.1em] text-gilt-200 sm:text-[32px]">{entry.verifiedTitle}</h1>
        {entry.alternateTitles.length > 0 && (
          <p className="record-text mt-2 text-[11px] uppercase tracking-[0.12em] text-ivory-600">
            also documented as {entry.alternateTitles.join(" · ")}
          </p>
        )}
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Stamps status={entry.researchStatus} confidence={entry.confidence} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {/* the reading */}
        <section className="velvet-panel relative overflow-hidden rounded-[4px] p-7 sm:p-9">
          <h2 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">the reading — labeled interpretation</h2>
          <p className="font-body mt-4 text-[15px] leading-relaxed text-ivory-300">
            {entry.interpretation.emotionalSummary.replace(/^SAMPLE ANNOTATION —?\s*/i, "")}
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">emotional progression</h3>
              <p className="font-body mt-2 text-[16px] text-ivory-200">
                {entry.interpretation.emotionalProgression.map(emoLabel).join(" → ")}
              </p>
            </div>
            <div>
              <h3 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">dominant & secondary themes</h3>
              <p className="font-body mt-2 text-[15px] text-ivory-300">
                {entry.interpretation.dominantEmotions.map(emoLabel).join(" · ")}
              </p>
            </div>
            <div>
              <h3 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">sufi concepts</h3>
              <p className="font-body mt-2 text-[15px] italic text-ivory-300">
                {entry.interpretation.sufiConcepts.join(" · ") || "—"}
              </p>
            </div>
            <div>
              <h3 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">symbolic vocabulary</h3>
              <p className="font-body mt-2 text-[15px] text-ivory-400">
                {entry.interpretation.symbolicImagery.join(" · ") || "—"}
              </p>
            </div>
            <div>
              <h3 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">literary characteristics</h3>
              <p className="font-body mt-2 text-[14.5px] leading-relaxed text-ivory-400">
                {entry.interpretation.literaryCharacteristics.join(" · ") || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* the record */}
        <section className="space-y-9">
          <div>
            <h2 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">verified record</h2>
            <dl className="record-text mt-4 space-y-2.5 text-[13px] leading-relaxed text-ivory-400">
              <div className="flex gap-4"><dt className="w-28 shrink-0 text-gilt-500/80">language</dt><dd>{entry.language}</dd></div>
              <div className="flex gap-4"><dt className="w-28 shrink-0 text-gilt-500/80">tradition</dt><dd>{entry.poeticTradition}</dd></div>
              <div className="flex gap-4"><dt className="w-28 shrink-0 text-gilt-500/80">poet</dt><dd>{entry.attributedPoet ?? "not publicly attributed"}</dd></div>
              {entry.yearsRecorded && <div className="flex gap-4"><dt className="w-28 shrink-0 text-gilt-500/80">recordings</dt><dd>{entry.yearsRecorded}</dd></div>}
              <div className="flex gap-4"><dt className="w-28 shrink-0 text-gilt-500/80">status</dt><dd>{entry.researchStatus.replace("_", " ")}</dd></div>
            </dl>
          </div>

          <div>
            <h2 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">sources & coverage</h2>
            <ul className="mt-4 space-y-2">
              {entry.sources.map((s) => (
                <li key={s.label} className="font-body text-[14px] text-ivory-400">
                  · {s.label}
                  {s.url && (
                    <a href={s.url} className="ml-2 text-gilt-400 underline-offset-4 hover:underline" rel="noreferrer noopener">
                      link
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <p className="font-record mt-4 text-[11px] leading-relaxed tracking-[0.06em] text-ivory-600">{entry.coverageNote}</p>
          </div>

          <div className="border border-velvet-500/50 bg-velvet-900/30 p-6">
            <h2 className="font-record text-[10.5px] uppercase tracking-[0.22em] text-gilt-500">originality standing</h2>
            <p className="font-body mt-3 text-[14px] leading-relaxed text-ivory-400">
              Poetry generated from this profile works from its themes and
              emotional analysis only. It is never the song&apos;s words, never a
              reconstruction, and never presented as this composition or as this
              singer&apos;s verse.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-14">
        <Plaque href={`/us-dard-ko-likho?q=${entry.slug}`} variant="primary" size="lg">
          GENERATE FROM THIS QAWWALI
        </Plaque>
      </div>
    </div>
  );
}
