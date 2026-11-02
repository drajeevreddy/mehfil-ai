import type { Metadata, Viewport } from "next";
import { Cinzel, EB_Garamond, Courier_Prime, Noto_Nastaliq_Urdu, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/chamber/SiteHeader";
import { SiteFooter } from "@/components/chamber/SiteFooter";
import { Petals } from "@/components/chamber/Petals";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});
const ebgaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-ebgaramond",
  display: "swap",
});
const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courierPrime",
  display: "swap",
});
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-nastaliq",
  display: "swap",
});
const devanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MEHFIL AI — Jab Dard Lafzon Mein Dhalta Hai",
  description:
    "The intelligence of ishq, dard, junoon and Sufi poetry. Explore the emotional universe of qawwali and turn a chosen feeling into original Urdu shayari.",
  applicationName: "MEHFIL AI",
};

export const viewport: Viewport = {
  themeColor: "#0b0a0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${ebgaramond.variable} ${courier.variable} ${nastaliq.variable} ${devanagari.variable} chamber-ground grain antialiased`}>
        <Petals />
        <SiteHeader />
        <main id="mehfil-content" className="relative z-10 min-h-[70vh]">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
