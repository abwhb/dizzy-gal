import type { IllustrationName } from "@/lib/content";

/**
 * Line illustrations in the brand-board style: single-weight open strokes,
 * rounded caps, no fills, drawn in `currentColor` so each usage sets its own
 * colour (orange on cream, cream on orange, burgundy on pink).
 *
 * Every mark is a list of path strings on a 48×48 box. They're kept as data
 * so the same drawings can be tiled into the background pattern (decor.tsx)
 * without a second copy.
 */
export const PATHS: Record<IllustrationName, string[]> = {
  strawberry: [
    "M9 21c0-6 6.5-9 15-9s15 3 15 9c0 10-9.5 21-15 21S9 31 9 21Z",
    "M24 12c-2-4-6-6-10-6 .5 4 3.5 6.5 7 7",
    "M24 12c2-4 6-6 10-6-.5 4-3.5 6.5-7 7",
    "M24 11.5V7",
    "M18 22.5v1.5M30 22.5v1.5M24 28.5V30M19.5 31.5V33M28.5 31.5V33",
  ],
  lemon: [
    "M9 24a15 15 0 1 0 30 0a15 15 0 1 0-30 0",
    "M12.5 24a11.5 11.5 0 1 0 23 0a11.5 11.5 0 1 0-23 0",
    "M24 12.5v23M34 18.25 14 29.75M34 29.75 14 18.25",
  ],
  cream: ["M11 25a13 13 0 1 1 26 0 10.5 10.5 0 1 1-21 0 8 8 0 1 1 16 0 5.5 5.5 0 1 1-11 0 3 3 0 1 1 6 0"],
  cake: [
    "M24 10 40 17 24 24 8 17 24 10Z",
    "M8 17v13l16 7 16-7V17",
    "M24 24v13",
    "M8 23.5 24 30.5 40 23.5",
    "M21.5 15.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0",
  ],
  heart: [
    "M24 40C12.5 32.5 6.5 25.5 6.5 18.5 6.5 12.7 11 8.5 16 8.5c3.6 0 6.6 2 8 5 1.4-3 4.4-5 8-5 5 0 9.5 4.2 9.5 10 0 7-6 14-17.5 21.5Z",
  ],
  // The sleepy z's from the logo lockup — three, climbing to the right.
  zzz: ["M6 26h13L6 39h13", "M22 15h10L22 25h10", "M34 6h7l-7 7h7"],
  star: ["M24 6c1.5 9 4.5 12 18 18-13.5 6-16.5 9-18 18-1.5-9-4.5-12-18-18 13.5-6 16.5-9 18-18Z"],
  spoon: ["M9.7 20.3A7.5 10-45 1 1 20.3 9.7A7.5 10-45 1 1 9.7 20.3Z", "M19.5 21.5 39 41a1.5 1.5 0 0 0 2-2L21.5 19.5"],
  // Dizzy face: spiral eyes, tongue out.
  smiley: [
    "M8 24a16 16 0 1 0 32 0a16 16 0 1 0-32 0",
    "M13.5 19.5a3.5 3.5 0 1 1 7 0 2.2 2.2 0 1 1-4.4 0 1 1 0 1 1 2 0",
    "M27.5 19.5a3.5 3.5 0 1 1 7 0 2.2 2.2 0 1 1-4.4 0 1 1 0 1 1 2 0",
    "M16 30c2.5 3.5 5.5 5 8 5s5.5-1.5 8-5",
    "M22 34.5c0 3.5 4 3.5 4 0",
  ],
  // Square jar with lid and three wavy layers — the product, drawn.
  jar: [
    "M11 8h26a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2Z",
    "M9 13h30v26a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4V13Z",
    "M9 21c5-3 10 3 15 0s10-3 15 0",
    "M9 29c5-3 10 3 15 0s10-3 15 0",
    "M9 36c5-3 10 3 15 0s10-3 15 0",
    "M15 25h.01M24 26h.01M33 25h.01M19 33h.01M29 33h.01",
  ],
};

type Props = Omit<React.SVGProps<SVGSVGElement>, "name" | "strokeWidth"> & {
  name: IllustrationName;
  strokeWidth?: number;
};

/** Extra props (data-* hooks for motion, style, className) land on the <svg>. */
export function Illustration({ name, strokeWidth = 2.4, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** Wavy underline — the squiggle the brand board draws under flavour names. */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 112 12"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M2 8c6-7 12-7 18 0s12 7 18 0 12-7 18 0 12 7 18 0 12-7 18 0 12 7 18 0" />
    </svg>
  );
}
