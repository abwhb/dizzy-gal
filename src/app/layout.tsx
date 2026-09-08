import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";

import { agency } from "@/lib/content";

import "./globals.css";

/** One tight grotesque for everything, set heavy, as in the Vita design. */
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
    // The font variable lives on <html> so the `--font-*` theme tokens,
    // which resolve at :root, can reference it.
    <html lang="fr-CA" className={interTight.variable}>
      <body>
        {/* Marks the document as scripted before first paint so reveal targets
            can start hidden; without JavaScript everything stays visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
      </body>
    </html>
  );
}
