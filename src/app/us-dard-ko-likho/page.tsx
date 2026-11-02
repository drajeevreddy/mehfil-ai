import { listCorpus } from "@/engines/qawwali/engine";
import { UsDardFlow, type QawwaliEntry } from "@/components/usdard/UsDardFlow";

export const metadata = {
  title: "Us Dard Ko Likho — MEHFIL AI",
  description: "Ek qawwali. Ek ehsaas. Ek naya sher.",
};

export default async function UsDardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const entries: QawwaliEntry[] = listCorpus().map((e) => ({
    slug: e.slug,
    verifiedTitle: e.verifiedTitle,
    language: e.language,
    poeticTradition: e.poeticTradition,
    attributedPoet: e.attributedPoet,
    interpretation: e.interpretation,
    researchStatus: e.researchStatus,
    confidence: e.confidence,
    coverageNote: e.coverageNote,
    yearsRecorded: e.yearsRecorded,
  }));
  const initial = sp.q && entries.some((e) => e.slug === sp.q) ? sp.q : undefined;
  return <UsDardFlow entries={entries} initialSlug={initial} />;
}
