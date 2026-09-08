import { ImageResponse } from "next/og";

import { site, store } from "@/lib/content";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Baloo 2 ExtraBold, fetched from Google Fonts at build time. If that fetch
 * fails the image still renders in the bundled fallback face.
 */
async function displayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Baloo+2:wght@800", {
      // An old UA makes Google serve a plain TTF rather than woff2, which satori can't read.
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0" },
    }).then((r) => r.text());
    const url = css.match(/src: url\(([^)]+)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const font = await displayFont();
  const family = font ? "Baloo" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#FF6A00",
          color: "#F2EFE6",
          fontFamily: family,
          position: "relative",
        }}
      >
        {/* Scallop of cream half-discs along the bottom, like the site's icing edges. */}
        <div style={{ position: "absolute", bottom: -34, left: 0, display: "flex" }}>
          {Array.from({ length: 18 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 68,
                height: 68,
                borderRadius: 999,
                background: "#F2EFE6",
                border: "4px solid #57151F",
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontWeight: 800,
            fontSize: 210,
            lineHeight: 0.82,
            letterSpacing: -10,
          }}
        >
          <span>DIZZY</span>
          <span>GALS!</span>
        </div>
        <div style={{ display: "flex", marginTop: 34, fontSize: 40, fontWeight: 800, lineHeight: 1.1 }}>
          {`${site.tagline.toLowerCase()}.`}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            padding: "14px 34px",
            borderRadius: 999,
            background: "#57151F",
            color: "#F2EFE6",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {`Cake in a jar · DHA ${store.city} · ${store.deliveryDays.map((d) => `${d}s`).join(" & ")}`}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Baloo", data: font, weight: 800, style: "normal" }] : undefined,
    },
  );
}
