import Link from "next/link";

const MODES = [
  { mode: "dard", label: "Dard", line: "suffering, distance, the unsaid" },
  { mode: "junoon", label: "Junoon", line: "overwhelming passion and restlessness" },
  { mode: "ishq", label: "Ishq", line: "vulnerability, loyalty, contradiction" },
  { mode: "shikwa", label: "Shikwa", line: "literary complaint against the beloved or fate" },
  { mode: "bewafai", label: "Bewafai", line: "betrayal, lost trust, wounded dignity" },
  { mode: "sufi", label: "Sufi", line: "divine love, surrender, the Soul" },
  { mode: "anger", label: "Anger", line: "sophisticated frustration of the heart" },
  { mode: "raat-ki-mehfil", label: "Raat ki Mehfil", line: "melancholic midnight atmosphere" },
] as const;

export function ModeStrip() {
  return (
    <section className="relative mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10" aria-label="Emotional modes">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-head">CHOOSE THE ROOM YOU ARE IN TONIGHT</h2>
        <p className="font-body text-[16px] text-ivory-400">
          Each mode shifts the whole mehfil — register, imagery, direction
          of thought. All of them run through the three engines.
        </p>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-2.5 sm:grid-cols-4">
        {MODES.map((m) => (
          <Link
            key={m.mode}
            href={`/studio?mode=${m.mode}`}
            className="niche group block rounded-sm px-5 py-6 text-center"
          >
            <span className="font-display block text-[13px] tracking-[0.18em] text-gilt-200 group-hover:text-gilt-100">
              {m.label.toUpperCase()}
            </span>
            <span className="font-body mt-2 block text-[13px] italic text-ivory-500 group-hover:text-ivory-400">
              {m.line}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
