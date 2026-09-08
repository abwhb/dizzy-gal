import { Illustration, PATHS } from "@/components/illustrations";
import type { IllustrationName } from "@/lib/content";

/**
 * Brand furniture: the doodle pattern, icing-scallop section edges, and the
 * spinning round sticker. All drawn from the same line marks as the
 * illustrations so the whole site reads as one hand.
 */

// ─── Pattern ────────────────────────────────────────────────────────────────

type Placement = [IllustrationName, number, number, number, number]; // name, x, y, rotate, scale

const TILE_W = 320;
const TILE_H = 160;
const TILE: Placement[] = [
  ["strawberry", 18, 16, -15, 1.15],
  ["zzz", 118, 8, 10, 0.95],
  ["cake", 206, 22, 8, 1.15],
  ["star", 286, 14, 0, 0.6],
  ["spoon", 56, 92, 22, 1.05],
  ["smiley", 158, 88, -8, 1.05],
  ["lemon", 246, 94, 12, 0.95],
  ["star", 100, 122, 15, 0.5],
  ["heart", 288, 122, -10, 0.55],
];

/** An SVG data URL of the tiled doodle pattern in the given stroke colour. */
export function patternUrl(stroke: string): string {
  const groups = TILE.map(
    ([name, x, y, r, s]) =>
      `<g transform="translate(${x} ${y}) rotate(${r} 24 24) scale(${s})">` +
      PATHS[name].map((d) => `<path d="${d}"/>`).join("") +
      `</g>`,
  ).join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="0 0 ${TILE_W} ${TILE_H}" ` +
    `fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${groups}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * A full-width band of drifting doodles — the brand board's "pattern" panel.
 * Pass `overlay` to lay it over a parent instead (inset:0, low opacity).
 */
export function PatternBand({
  bg = "#FF6A00",
  stroke = "#F2EFE6",
  overlay = false,
  className = "",
}: {
  bg?: string;
  stroke?: string;
  overlay?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`${
        overlay ? "pointer-events-none absolute inset-0" : "h-[86px] border-b-[3px] border-burgundy"
      } motion-safe:animate-drift ${className}`}
      style={{
        backgroundColor: overlay ? undefined : bg,
        backgroundImage: patternUrl(stroke),
        backgroundSize: `${TILE_W}px ${TILE_H}px`,
        backgroundRepeat: overlay ? "repeat" : "repeat-x",
        // The band is one row tall: show the tile's top row, cleanly.
        backgroundPosition: overlay ? "0 0" : "0 4px",
      }}
    />
  );
}

// ─── Scallop edge ───────────────────────────────────────────────────────────

/**
 * A row of half-discs hanging off the top of a section in the colour of the
 * section above — icing over the edge. Place inside a `relative` section as
 * its first child.
 */
export function Scallop({ color, size = 40 }: { color: string; size?: number }) {
  const r = size / 2;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-10"
      style={{
        height: r + 1,
        backgroundImage: `radial-gradient(circle at 50% 0, ${color} 0 ${r - 3}px, #57151F ${r - 3}px ${r}px, transparent ${r + 0.5}px)`,
        backgroundSize: `${size}px ${r + 1}px`,
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}

// ─── Spinning sticker ───────────────────────────────────────────────────────

export function SpinBadge({
  text,
  icon = "strawberry",
  className = "",
}: {
  text: string;
  icon?: IllustrationName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden="true" focusable="false" className={className}>
      <circle cx="80" cy="80" r="77" fill="#FF8BA7" stroke="#57151F" strokeWidth="3" />
      <g className="motion-safe:animate-spin-slow" style={{ transformOrigin: "80px 80px" }}>
        <defs>
          <path id="spin-badge-ring" d="M80 80m-56 0a56 56 0 1 1 112 0a56 56 0 1 1-112 0" />
        </defs>
        <text
          fontSize="11.5"
          fontWeight="600"
          letterSpacing=".2em"
          fill="#57151F"
          className="font-body"
        >
          <textPath href="#spin-badge-ring">{text}</textPath>
        </text>
      </g>
      <g transform="translate(56 56)" className="text-burgundy">
        <Illustration name={icon} strokeWidth={2.6} style={{ width: 48, height: 48 }} />
      </g>
    </svg>
  );
}
