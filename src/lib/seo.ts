import type { Metadata } from "next";

import { products, site, store, type Product } from "@/lib/content";

/**
 * The canonical origin. Set NEXT_PUBLIC_SITE_URL once the domain is live;
 * until then Vercel's production URL is used so canonicals, the sitemap and
 * structured data all point at production even from preview deployments.
 */
export const siteUrl = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
})();

export const absoluteUrl = (path = "/") => new URL(path, siteUrl).toString();

/** Metadata for a page that should be indexed. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}

/** Metadata for personal pages (cart, checkout, orders): keep them out of search. */
export function privateMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: true },
    // No canonical: these pages are per-browser and shouldn't point at the home page.
    alternates: { canonical: null },
  };
}

// ─── Structured data ────────────────────────────────────────────────────────

const CURRENCY = "PKR";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: siteUrl,
    logo: absoluteUrl("/icon.svg"),
    image: absoluteUrl("/opengraph-image"),
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: store.city,
      addressCountry: "PK",
    },
    areaServed: store.areas.map((area) => ({
      "@type": "Place",
      name: `${area}, ${store.city}`,
    })),
    servesCuisine: "Desserts",
    currenciesAccepted: CURRENCY,
    paymentAccepted: "Cash",
    ...(site.social.length ? { sameAs: site.social } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: siteUrl,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en",
  };
}

export function productJsonLd(product: Product) {
  return {
    "@type": "Product",
    "@id": absoluteUrl(`/shop#${product.id}`),
    name: `${product.name} cake in a jar`,
    description: product.description,
    ...(product.jarImage ? { image: absoluteUrl(product.jarImage) } : {}),
    brand: { "@type": "Brand", name: site.name },
    category: "Cake",
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/shop#${product.id}`),
      price: product.price,
      priceCurrency: CURRENCY,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": absoluteUrl("/#organization") },
      areaServed: { "@type": "Place", name: `DHA ${store.city}` },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: store.deliveryFee,
          currency: CURRENCY,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PK",
          addressRegion: "Punjab",
        },
      },
    },
  };
}

/** The flavours as an ItemList, for the home page. */
export function productListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Dizzy Gals cakes in a jar",
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productJsonLd(product),
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
