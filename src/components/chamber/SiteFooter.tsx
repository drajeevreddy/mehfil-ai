import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-gilt-inner bg-chamber">
      <div aria-hidden className="gilt-rule-thin opacity-50" />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-sm tracking-[0.2em] text-gilt-300">MEHFIL AI</p>
          <p className="font-display mt-2 text-[11px] tracking-[0.3em] text-gilt-600">
            JAB DARD LAFZON MEIN DHALTA HAI
          </p>
          <p className="font-body mt-5 max-w-md text-[15px] leading-relaxed text-ivory-500">
            <span className="urdu-inline">ہر احساس کی ایک زبان ہوتی ہے۔ ہم اسے شاعری کہتے ہیں۔</span>
            <br />
            Every feeling speaks a language of its own. We call it shayari.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="font-display text-[11px] tracking-[0.24em] text-gilt-500">CHAMBERS</p>
          <ul className="font-body mt-4 space-y-2 text-[15px] text-ivory-500">
            <li><Link className="hover:text-gilt-300" href="/studio">The Generator</Link></li>
            <li><Link className="hover:text-gilt-300" href="/us-dard-ko-likho">Us Dard Ko Likho</Link></li>
            <li><Link className="hover:text-gilt-300" href="/qawwali-universe">Qawwali Universe</Link></li>
            <li><Link className="hover:text-gilt-300" href="/random-ishq">Random Ishq</Link></li>
            <li><Link className="hover:text-gilt-300" href="/my-mehfil">My Mehfil</Link></li>
          </ul>
        </nav>
        <div>
          <p className="font-display text-[11px] tracking-[0.24em] text-gilt-500">STANDING</p>
          <p className="font-body mt-4 text-[13.5px] leading-relaxed text-ivory-600">
            Nothing here reproduces lyrics, recordings or transcriptions. Research
            entries carry sources, status and confidence, and demo-mode verses are
            always labeled as composed by the local core. Similarity screening is
            an internal quality tool, not a copyright clearance.
          </p>
        </div>
      </div>
      <p className="pb-8 text-center font-record text-[11px] tracking-[0.12em] text-ivory-600/70">
        MEHFIL AI — AN INTELLIGENCE OF ISHQ, DARD, JUNOON AND SUFI POETRY
      </p>
    </footer>
  );
}
