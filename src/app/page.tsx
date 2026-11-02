import Link from "next/link";
import { DemoAlcove } from "@/components/landing/DemoAlcove";
import { EngineNiches } from "@/components/landing/EngineNiches";
import { Plaque } from "@/components/chamber/Plaque";
import { ModeStrip } from "@/components/landing/ModeStrip";
import { ResearchInvitation } from "@/components/landing/ResearchInvitation";

export default function LandingPage() {
  return (
    <div>
      {/* ——— The chamber: first viewport ——— */}
      <section className="relative mx-auto grid min-h-[74dvh] w-full max-w-[1600px] items-center gap-8 px-4 pb-8 pt-6 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:px-10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-devanagari text-3xl font-semibold leading-[1.65] text-gilt-glow text-balance sm:text-[42px] lg:text-[47px]" style={{ fontFeatureSettings: "'kern'" }}>
            कुछ दर्द अल्फ़ाज़ नहीं माँगते,
            <span className="block text-gilt-200">बस एक शायरी बन जाते हैं।</span>
          </h1>
          <p className="font-body mt-4 text-[17px] italic text-ivory-500">
            Some pain does not ask for words; it simply becomes poetry.
          </p>
          <p className="font-body mt-7 max-w-xl text-[17px] leading-relaxed text-ivory-400">
            MEHFIL AI is a poetry studio, not a chatbot. Three separate intelligence
            systems — one for the researched themes of qawwali, one for the exact mix
            of what you feel, one for the craft of the sher — work together to turn a
            chosen feeling into original Urdu shayari. The result is a
            new, honest interpretation: never copied lyrics, never borrowed verse.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5" role="group" aria-label="Enter the mehfil">
            <Plaque href="/studio" variant="primary" size="xl" className="group relative">
              ENTER MEHFIL
            </Plaque>
            <Plaque href="/us-dard-ko-likho" variant="ghost" size="xl">
              US DARD KO LIKHO
            </Plaque>
          </div>
          <p className="font-record mt-8 text-[11px] tracking-[0.14em] text-ivory-600">
            DEMO MODE ON — VERSES ON THIS PAGE ARE COMPOSED BY THE LOCAL CORE ENGINE
          </p>
        </div>

        <DemoAlcove className="min-h-[440px] lg:min-h-[560px]" />
      </section>

      {/* ——— How a sher happens ——— */}
      <EngineNiches />

      {/* ——— Emotional modes ——— */}
      <ModeStrip />

      {/* ——— Research invitation ——— */}
      <ResearchInvitation />

      {/* ——— Quiet close ——— */}
      <section className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="urdu-text text-[20px] text-ivory-300" dir="rtl" lang="ur">
          ہر احساس کی ایک زبان ہوتی ہے۔ ہم اسے شاعری کہتے ہیں۔
        </p>
        <p className="font-body mt-5 text-[16px] italic text-ivory-500">
          Every feeling speaks a language of its own. We call it shayari.
        </p>
        <div className="mt-10 flex justify-center gap-5">
          <Plaque href="/studio" variant="primary" size="md">
            ENTER MEHFIL
          </Plaque>
        </div>
      </section>
    </div>
  );
}
