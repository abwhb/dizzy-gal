import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";

import { agency } from "@/lib/content";

import "./globals.css";

/**
 * Editorial serif for headlines, a quiet grotesque for everything else —
 * the magazine-meets-booking feel the landing page is modelled on.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${agency.name} — ${agency.tagline}`,
  description:
    "Agence de voyages spécialisée dans le Hajj et la Omra depuis Laval, Québec. Départs de Montréal, hôtels 4 étoiles, visas inclus et accompagnement francophone. Voyages organisés et billetterie.",
  openGraph: {
    title: `${agency.name} — ${agency.tagline}`,
    description:
      "Hajj, Omra et voyages organisés depuis Montréal. Hôtels 4 étoiles, visas inclus, guides et imams francophones.",
    locale: "fr_CA",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables live on <html> so the `--font-display` / `--font-body`
    // theme tokens, which resolve at :root, can reference them.
    <html lang="fr-CA" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
