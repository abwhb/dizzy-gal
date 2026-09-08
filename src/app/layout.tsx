import type { Metadata, Viewport } from "next";
import { Baloo_2, Poppins } from "next/font/google";
import Script from "next/script";

import { JsonLd } from "@/components/json-ld";
import { NewsletterModal } from "@/components/newsletter-modal";
import { SiteProvider } from "@/components/site-provider";
import { site } from "@/lib/content";
import { organizationJsonLd, siteUrl, websiteJsonLd } from "@/lib/seo";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — Cake in a jar, delivered in DHA Lahore`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  applicationName: site.name,
  category: "food",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF6A00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables live on <html> so that the `--font-display` /
    // `--font-body` theme tokens, which resolve at :root, can reference them.
    // suppressHydrationWarning: the motion flag script below adds a class to
    // <html> before React hydrates.
    <html lang="en" className={`${baloo.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body>
        {/* Flags that JS is running so globals.css may pre-hide the elements
            GSAP animates in. Runs before paint; without JS nothing is hidden. */}
        <Script id="motion-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js")`}
        </Script>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SiteProvider>
          {children}
          <NewsletterModal />
        </SiteProvider>
      </body>
    </html>
  );
}
