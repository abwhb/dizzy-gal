import type { Metadata } from "next";
import { Baloo_2, Poppins } from "next/font/google";

import { SiteProvider } from "@/components/site-provider";

import "./globals.css";

/**
 * The brand board specifies Astrofat Extra Bold for headings; it isn't
 * available as a web font, so Baloo 2 ExtraBold stands in as the closest
 * chunky-rounded match (the substitution the design was built on).
 */
const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dizzy Gals — Cake worth losing your head over",
  description:
    "Dizzy Gals is for the hopelessly obsessed dessert lovers. Bold flavours, creamy layers, and just the right amount of chaos. Go on. Dig in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables live on <html> so that the `--font-display` /
    // `--font-body` theme tokens, which resolve at :root, can reference them.
    <html lang="en" className={`${baloo.variable} ${poppins.variable}`}>
      <body>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
