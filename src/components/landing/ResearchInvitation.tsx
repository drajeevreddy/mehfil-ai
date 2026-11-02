import Link from "next/link";
import { listCorpus } from "@/engines/qawwali/engine";

export function ResearchInvitation() {
  const corpus = listCorpus().slice(0, 3);
  return (
    <section className="relative mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10" aria-label="Research invitation">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-head">THE RESEARCH CHAMBER</h2>
        <p className="font-body text-[16px] text-ivory-400">
          Every composition carries verified metadata and a clearly-labeled
          interpretive reading. Understand what a qawwali explores, then write
          your own sher from its themes.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-3 md:grid-cols-3">
        {corpus.map((entry) => (
          <article key={entry.slug} className="niche p-7">
            <h3 className="font-display text-[15px] tracking-[0.12em] text-ivory-200">
              {entry.verifiedTitle}
            </h3>
            <p className="font-record mt-2 text-[10.5px] uppercase tracking-[0.18em] text-gilt-500">
              {entry.language} · {entry.poeticTradition} · {entry.researchStatus === "verified_metadata" ? "VERIFIED METADATA" : "SAMPLE"}
            </p>
            <p className="font-body mt-4 text-[14px] leading-relaxed text-ivory-400">
              {entry.interpretation.emotionalSummary.replace(/^SAMPLE ANNOTATION —?\s*/i, "")}
            </p>
            <Link
              href={`/qawwali-universe/${entry.slug}`}
              className="font-display mt-5 inline-block text-[11px] uppercase tracking-[0.18em] text-gilt-400 underline-offset-4 hover:underline"
            >
              Open the research profile
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-5">
        <Plaque href="/qawwali-universe" variant="ghost" size="md">
          ENTER THE QAWWALI UNIVERSE
        </Plaque>
        <p className="font-record text-[11px] tracking-[0.12em] text-ivory-600">
          THE CORPUS IS DELIBERATELY PARTIAL — COVERAGE IS ALWAYS STATED
        </p>
      </div>
    </section>
  );
}

import { Plaque } from "@/components/chamber/Plaque";
