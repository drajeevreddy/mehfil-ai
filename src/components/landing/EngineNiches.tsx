/**
 * The three intelligence niches — the engines presented as the architecture
 * they are (separate, coordinated), with the gilt central seam dividing
 * panels (donated discipline from the Brodovitch challenger).
 */
import Link from "next/link";

const ENGINES = [
  {
    name: "Qawwali Intelligence",
    delegation: "the research",
    body: "Reads the researched compositions of the qawwali repertoire — themes, emotional progressions, Sufi concepts, metaphor — from clearly-labeled annotations. Never lyrics.",
  },
  {
    name: "Emotion Intelligence",
    delegation: "the intention",
    body: "Understands what you actually mean: love mixed with anger, betrayal held with dignity, longing that reads as devotion. Intensity, contradiction and direction — not a label.",
  },
  {
    name: "Shayari Intelligence",
    delegation: "the craft",
    body: "Composes the couplet itself — misra, qafiya, tashbih, tazad — in authentic grammar, an idea first, a metaphor only where it carries meaning.",
  },
] as const;

export function EngineNiches() {
  return (
    <section className="relative mx-auto w-full max-w-[1600px] px-4 py-20 sm:px-6 lg:px-10" aria-label="The three intelligence engines">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-[22px] tracking-[0.14em] text-gilt-200 sm:text-2xl">
          HOW A SHER HAPPENS
        </h2>
        <p className="font-body mt-4 text-[16px] text-ivory-400">
          Your request moves through three separate chambers. Each one does only
          its own work, and the words between them are structured, not vibes.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden rounded-[3px] sm:grid-cols-3">
        {ENGINES.map((e, i) => (
          <div
            key={e.name}
            className="niche rounded-none px-7 py-9 text-center sm:text-left"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(200,162,94,0.16), inset 0 2px 8px rgba(0,0,0,0.55)",
              ...(i > 0 ? { borderLeft: "1px solid rgba(200,162,94,0.28)" } : {}),
            }}
          >
            <svg width="44" height="44" viewBox="0 0 52 52" className="mx-auto opacity-90 sm:mx-0" aria-hidden="true">
              <polygon points="26,4 46,14 46,38 26,48 6,38 6,14" fill="none" stroke="rgba(200,162,94,0.65)" strokeWidth="1.1" />
              <circle cx="26" cy="26" r="9" fill="rgba(200,162,94,0.14)" stroke="rgba(232,205,147,0.75)" strokeWidth="1.2" />
              <circle cx="26" cy="26" r="2.4" fill="#e8cd93" />
            </svg>
            <h3 className="font-display mt-5 text-[15px] tracking-[0.16em] text-gilt-200">
              {e.name.toUpperCase()}
            </h3>
            <p className="font-record mt-1.5 text-[10px] uppercase tracking-[0.26em] text-gilt-500">
              {e.delegation}
            </p>
            <p className="font-body mt-5 text-[14.5px] leading-relaxed text-ivory-400">
              {e.body}
            </p>
          </div>
        ))}
      </div>

      <p className="font-body mx-auto mt-10 max-w-2xl text-center text-[15px] italic text-ivory-500">
        One request, one emotion naming, one research retrieval, one drafting, one
        quality gate. No single engine ever carries all three jobs at once.
      </p>
    </section>
  );
}
