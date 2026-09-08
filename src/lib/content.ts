/**
 * Site copy and data, lifted from the Dizzy Gals design and brand board.
 * Everything the page renders that a non-developer might want to change
 * lives here.
 *
 * Anything marked `placeholder: true` is stand-in content that must be
 * replaced with the real thing before it ships — it renders like the real
 * thing, so don't let it slip through.
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
  | "jar"
  | "chocolate";

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
  /** Left panel colour. */
  panel: string;
  /** Section colour while this flavour is showing. */
  bg: string;
  /** Panel is dark: chrome on it switches to cream. */
  dark?: boolean;
  /** Drop a photo in `public/` and point this at it to replace the slot. */
  jarImage?: string;
  placeholder?: boolean;
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

export type Review = {
  quote: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  bg: string;
  placeholder?: boolean;
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
    panel: "#FF8BA7",
    bg: "#FFD34D",
  },
  {
    id: "midnight-berry",
    name: "Midnight Berry",
    tag: "New",
    description:
      "Dark chocolate ganache + strawberry purée on a cocoa sponge. Rich, intense, dangerous.",
    warning: "may cause you to take a short 3 hour nap",
    ingredients: [
      { label: "Dark chocolate", illustration: "chocolate" },
      { label: "Strawberry", illustration: "strawberry" },
      { label: "Ganache", illustration: "cream" },
    ],
    cta: "go on. dig in.",
    panel: "#57151F",
    bg: "#FF8BA7",
    dark: true,
  },
  {
    // PLACEHOLDER — a third flavour to fill the carousel. Rename, re-describe
    // or drop it before launch.
    id: "lemon-cloud",
    name: "Lemon Cloud",
    tag: "Coming soon",
    description:
      "Lemon curd, vanilla sponge, clouds of whipped cream. Light, sharp, gone in minutes.",
    warning: "may cause uncontrollable sunshine",
    ingredients: [
      { label: "Lemon", illustration: "lemon" },
      { label: "Vanilla sponge", illustration: "cake" },
      { label: "Whipped cream", illustration: "cream" },
    ],
    cta: "go on. dig in.",
    panel: "#FFD34D",
    bg: "#F2EFE6",
    placeholder: true,
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

/**
 * PLACEHOLDER reviews — written to show the section, not collected from
 * customers. Replace every entry with a real quote before launch.
 */
export const reviews: Review[] = [
  {
    quote: "Ate the whole jar in the car park. No regrets, some crumbs.",
    name: "Sana K.",
    rating: 5,
    bg: "#FF8BA7",
    placeholder: true,
  },
  {
    quote: "Pink Lemonade tastes like a summer I never actually had.",
    name: "Ayesha R.",
    rating: 5,
    bg: "#F2EFE6",
    placeholder: true,
  },
  {
    quote: "Ordered six for a party. The party was two people.",
    name: "Hamza T.",
    rating: 5,
    bg: "#FFD34D",
    placeholder: true,
  },
  {
    quote: "The warning label is not a joke. Food coma achieved by 3pm.",
    name: "Zoya M.",
    rating: 4,
    bg: "#F2EFE6",
    placeholder: true,
  },
  {
    quote: "My spoon has never felt so useful.",
    name: "Bilal A.",
    rating: 5,
    bg: "#FFD34D",
    placeholder: true,
  },
  {
    quote: "Would lose my head over this again. And again.",
    name: "Mahnoor F.",
    rating: 5,
    bg: "#FF8BA7",
    placeholder: true,
  },
];

export const reviewsSection = {
  heading: "Dizzy people say",
  sticker: "verified dizzy",
};

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

export const footer = {
  headline: ["Bad day? Cake.", "Good day? Also cake."],
  blurb: "Drops, restocks, and 15% off your first jar. Zero spam, some chaos.",
  legal: "© 2026 Dizzy Gals",
  bottomLinks: [
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
  ],
};

export const newsletter = {
  blurb: "Bad day? Cake. Good day? Also cake. Sign up for drops, restocks, and 15% off your first jar.",
  placeholder: "you@somewhere.com",
  send: "Send",
  sent: "Sent",
};

export const footerColumns: { heading: string; links: { label: string; href?: string }[] }[] = [
  {
    heading: "Our flavours",
    links: products.map((p) => ({ label: p.name, href: "#shop" })),
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
      { label: "Reviews", href: "#reviews" },
      { label: "Shipping", href: "#" },
      { label: "My orders", href: "#" },
    ],
  },
];
