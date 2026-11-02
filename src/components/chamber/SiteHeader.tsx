"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/studio", label: "The Mahfil", sub: "generator" },
  { href: "/us-dard-ko-likho", label: "Us Dard Ko Likho", sub: "signature" },
  { href: "/qawwali-universe", label: "Qawwali Universe", sub: "research" },
  { href: "/random-ishq", label: "Random Ishq", sub: "roll the dice" },
  { href: "/my-mehfil", label: "My Mehfil", sub: "your ledger" },
  { href: "/about", label: "About", sub: "philosophy" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="relative z-20 border-b border-gilt-inner bg-chamber/95">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-baseline gap-3" aria-label="MEHFIL AI — home">
          <span className="font-display text-lg tracking-[0.22em] text-gilt-200 sm:text-xl">
            MEHFIL
          </span>
          <span className="font-display text-[11px] tracking-[0.34em] text-gilt-600 sm:text-xs">AI</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "px-3 py-2 font-display text-[11px] tracking-[0.18em] uppercase transition-colors",
                  active ? "text-gilt-200" : "text-ivory-600 hover:text-gilt-300"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="rounded-sm p-2 text-gilt-300 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="chamber-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
      </div>
    </header>
  );
}
