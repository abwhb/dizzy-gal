/**
 * Site copy and data, lifted from the Dizzy Gals design and brand board.
 * Everything the page renders that a non-developer might want to change
 * lives here.
 */

export type IllustrationName =
  | "strawberry"
  | "lemon"
  | "cream"
  | "cake"
  | "heart"
  | "zzz"
  | "star"
  | "spoon"
  | "smiley"
  | "jar";

export type Ingredient = {
  label: string;
  illustration: IllustrationName;
};

export type Product = {
  id: string;
  name: string;
  tag: string;
  description: string;
  warning: string;
  ingredients: Ingredient[];
  cta: string;
  /** Drop a photo in `public/` and point this at it to replace the slot. */
  jarImage?: string;
};

export type PromiseItem = {
  label: string;
  illustration: IllustrationName;
};

export type GalleryTile = {
  label: string;
  bg: string;
  /** Drawn sticker shown until a photo exists. */
  illustration: IllustrationName;
  /** A real photo replaces the sticker at the same crop. */
  image?: string;
};

export type FeedCard =
  | {
      kind: "quote";
      big: string;
      small: string;
      bg: string;
      fg: string;
      doodle?: IllustrationName;
    }
  | {
      kind: "photo";
      small: string;
      bg: string;
      fg: string;
      image?: string;
    };

export const hero = {
  tagline: ["cake worth", "losing your head over."],
  cta: "go on. dig in.",
  badge: "MADE TO MAKE YOU DIZZY • GO ON. DIG IN • ",
};

export const products: Product[] = [
  {
    id: "pink-lemonade",
    name: "Pink Lemonade",
    tag: "Bestseller",
    description:
      "Strawberry + lemon cake, layered with whipped cream and a fresh berry top. Bright, fresh, and honestly a bit addictive.",
    warning: "may cause food coma",
    ingredients: [
      { label: "Strawberry", illustration: "strawberry" },
      { label: "Lemon", illustration: "lemon" },
      { label: "Whipped cream", illustration: "cream" },
    ],
    cta: "go on. dig in.",
  },
];

export const promises: PromiseItem[] = [
  { label: "Real ingredients", illustration: "strawberry" },
  { label: "Made fresh in small batches", illustration: "cake" },
  { label: "Zero boring flavours", illustration: "heart" },
];

export const marqueeLines: string[] = [
  "Orders of 6 jars or more ship free",
  "You look dizzy. Probably need cake.",
  "One more bite won’t hurt. Promise.",
  "Currently spiralling. Send cake.",
  "Bad day? Cake. Good day? Also cake.",
  "Made fresh in small batches",
  "Zero boring flavours",
];

/** Glyphs between marquee lines, cycled in order. */
export const marqueeGlyphs: IllustrationName[] = ["star", "zzz", "strawberry", "smiley"];

export const gallery: GalleryTile[] = [
  { label: "real strawberries", bg: "#FFD34D", illustration: "strawberry" },
  { label: "cake, obviously", bg: "#FF8BA7", illustration: "cake" },
  { label: "spoon required", bg: "#F2EFE6", illustration: "spoon" },
  { label: "you look dizzy", bg: "#FF8BA7", illustration: "smiley" },
  { label: "zero boring flavours", bg: "#F2EFE6", illustration: "star" },
  { label: "zzz. food coma.", bg: "#FFD34D", illustration: "zzz" },
];

export const feed: FeedCard[] = [
  {
    kind: "quote",
    bg: "#FF8BA7",
    fg: "#57151F",
    big: "You look dizzy.",
    small: "probably need cake.",
    doodle: "smiley",
  },
  { kind: "photo", bg: "#FFD34D", fg: "#57151F", small: "spoon + jar photo" },
  {
    kind: "quote",
    bg: "#57151F",
    fg: "#F2EFE6",
    big: "Currently spiralling.",
    small: "send cake.",
    doodle: "zzz",
  },
  { kind: "photo", bg: "#FF6A00", fg: "#F2EFE6", small: "strawberry top-down" },
  {
    kind: "quote",
    bg: "#F2EFE6",
    fg: "#57151F",
    big: "Bad day? Cake. Good day? Also cake.",
    small: "a policy, not a slogan.",
    doodle: "star",
  },
  { kind: "photo", bg: "#FF8BA7", fg: "#57151F", small: "packaging flat-lay" },
  {
    kind: "quote",
    bg: "#FFD34D",
    fg: "#57151F",
    big: "One more bite won’t hurt.",
    small: "promise.",
    doodle: "spoon",
  },
];

export const footerColumns: { heading: string; links: { label: string; href?: string }[] }[] = [
  {
    heading: "Our flavours",
    links: [{ label: "Pink Lemonade", href: "#shop" }, { label: "more flavours coming soon" }],
  },
  {
    heading: "Contact",
    links: [
      { label: "hello@dizzygals.com", href: "mailto:hello@dizzygals.com" },
      { label: "wholesale@dizzygals.com", href: "mailto:wholesale@dizzygals.com" },
    ],
  },
  {
    heading: "Social",
    links: [{ label: "@dizzygals", href: "#" }],
  },
  {
    heading: "Info",
    links: [
      { label: "About us", href: "#story" },
      { label: "Shipping", href: "#" },
      { label: "My orders", href: "#" },
    ],
  },
  {
    heading: "Copyright",
    links: [{ label: "© 2026" }, { label: "Dizzy Gals" }, { label: "Terms & privacy", href: "#" }],
  },
];
