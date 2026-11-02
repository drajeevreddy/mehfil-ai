import Link from "next/link";

export const metadata = {
  title: "About MEHFIL AI",
  description: "The philosophy, the three engines, and the honesty standing of MEHFIL AI.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-[22px] tracking-[0.16em] text-gilt-200">ABOUT MEHFIL AI</h1>

      <div className="mt-10 space-y-14">
        <section>
          <p className="urdu-text text-[19px] leading-loose text-ivory-200" dir="rtl">
            ہر احساس کی ایک زبان ہوتی ہے۔ ہم اسے شاعری کہتے ہیں۔
          </p>
          <p className="font-body mt-4 text-[16px] italic text-ivory-500">
            Every feeling speaks a language of its own. We call it shayari.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-[15px] tracking-[0.18em] text-gilt-300">WHY A POETRY STUDIO</h2>
          <p className="font-body text-[15.5px] leading-relaxed text-ivory-400">
            MEHFIL AI begins from the understanding that a sher earns its power from
            the idea it carries, not the number of difficult Urdu words it strings
            together. The platform is a place to explore the emotional and
            philosophical universe of the qawwali tradition — separation and union,
            earthly love and divine love, complaint and surrender — and to receive
            something genuinely new in return: your own couplet, composed from a
            chosen feeling and a researched reading.
          </p>
          <p className="font-body text-[15.5px] leading-relaxed text-ivory-400">
            The output is new verse. It is never presented as the words of qawwali,
            never a reconstruction of a recorded song, and never claims the
            artistic voice of any poet or performer.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-[15px] tracking-[0.18em] text-gilt-300">THE THREE CHAMBERS</h2>
          <p className="font-body text-[15.5px] leading-relaxed text-ivory-400">
            Three independent intelligence systems, each working on its own
            structured contract, coordinated by an orchestrator:
          </p>
          <ul className="space-y-3.5">
            <li className="niche p-5">
              <p className="font-display text-[13px] tracking-[0.14em] text-gilt-200">QAWWALI INTELLIGENCE</p>
              <p className="font-body mt-2 text-[14.5px] text-ivory-400">
                The researched knowledge base: verified metadata, emotional
                profiles, Sufi concepts, symbolic vocabularies, sources and
                confidence — with interpretation always separated from fact.
              </p>
            </li>
            <li className="niche p-5">
              <p className="font-display text-[13px] tracking-[0.14em] text-gilt-200">EMOTION INTELLIGENCE</p>
              <p className="font-body mt-2 text-[14.5px] text-ivory-400">
                Intention, not labels: it interprets love mixed with anger, betrayal
                held with dignity, loneliness with hope — and sets intensity,
                conflict, register and direction for the couplet.
              </p>
            </li>
            <li className="niche p-5">
              <p className="font-display text-[13px] tracking-[0.14em] text-gilt-200">SHAYARI INTELLIGENCE</p>
              <p className="font-body mt-2 text-[14.5px] text-ivory-400">
                The craft: misra construction, qafiya, tashbih, tazad, emotional
                continuity, and the discipline that every metaphor serve the meaning.
              </p>
            </li>
          </ul>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-[15px] tracking-[0.18em] text-gilt-300">THE HONESTY STANDING</h2>
          <ul className="font-body space-y-3 text-[15px] leading-relaxed text-ivory-400">
            <li>· No lyrics are stored, scraped or reconstructed — only research summaries, annotations, metadata and citations.</li>
            <li>· Research coverage is partial and always stated. Unresearched compositions are never shown as verified.</li>
            <li>· Without AI credentials, the app runs in demo mode: the local core engine composes the poetry and every result is labeled DEMO.</li>
            <li>· Originality screening compares output against the internal reference corpus. It is an internal quality gate — not a copyright clearance.</li>
            <li>· Nothing user-created leaves your device: My Mehfil lives in your browser&apos;s storage.</li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-5">
          <Link href="/studio" className="font-display text-[13px] uppercase tracking-[0.18em] text-gilt-400 hover:text-gilt-200 underline-offset-4 hover:underline">
            Enter the Mehfil →
          </Link>
          <Link href="/us-dard-ko-likho" className="font-display text-[13px] uppercase tracking-[0.18em] text-gilt-400 hover:text-gilt-200 underline-offset-4 hover:underline">
            Us Dard Ko Likho →
          </Link>
        </div>
      </div>
    </div>
  );
}
