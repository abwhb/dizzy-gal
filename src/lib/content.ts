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
  | "chocolate"
  | "coffee";

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
  /** Price per jar, in `store.currency`. */
  price: number;
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
  imageAlt?: string;
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
      imageAlt?: string;
    };

export type Review = {
  quote: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  bg: string;
  placeholder?: boolean;
};

/**
 * What search engines and link previews see. `description` is the home page's
 * meta description; keep it under ~160 characters. Add the real Instagram /
 * TikTok URLs to `social` and they flow into the structured data too.
 */
export const site = {
  name: "Dizzy Gals",
  tagline: "Cake worth losing your head over",
  description:
    "Cake in a jar from Dizzy Gals: Pink Lemonade, Midnight Berry and Not a Tiramisu, baked fresh in small batches and delivered across DHA Lahore on Fridays and Sundays. Cash on delivery.",
  keywords: [
    "cake in a jar",
    "jar cakes Lahore",
    "cake delivery DHA Lahore",
    "dessert delivery Lahore",
    "strawberry lemonade cake",
    "tiramisu jar",
    "chocolate strawberry cake jar",
    "Dizzy Gals",
  ],
  email: "hello@dizzygals.com",
  locale: "en_PK",
  /** Public profile URLs, e.g. "https://www.instagram.com/dizzygals". */
  social: [] as string[],
};

export const hero = {
  tagline: ["cake worth", "losing your head over."],
  cta: "go on. dig in.",
  badge: "MADE TO MAKE YOU DIZZY • GO ON. DIG IN • ",
};

/**
 * Store settings. Delivery is DHA Lahore only, on set days of the week; the
 * customer picks a day at checkout. Currency, prices and the delivery fee
 * are still PLACEHOLDER guesses — set the real ones.
 */
export const store = {
  currency: "Rs",
  deliveryFee: 250,
  /** Orders of this many jars or more ship free (the marquee promises it). */
  freeDeliveryFrom: 6,
  city: "Lahore",
  /** Delivery areas, all inside DHA Lahore. Add phases here as they open. */
  areas: Array.from({ length: 9 }, (_, i) => `DHA Phase ${i + 1}`),
  /** Days of the week we deliver. Add "Wednesday" etc. here to open a day. */
  deliveryDays: ["Friday", "Sunday"],
  /** Orders for a delivery day close at this hour (24h) the day before. */
  cutoffHour: 14,
  placeholder: true,
};

export const siteNav = [
  { label: "Shop", href: "/shop", detail: "Find your flavour" },
  { label: "Story", href: "/story", detail: "A little cake, a little chaos" },
  { label: "Reviews", href: "/reviews", detail: "Dizzy people say" },
  { label: "Feed", href: "/feed", detail: "Cake is better with company" },
];

/**
 * Each home section also lives at its own address, so links and search
 * results land on a real page rather than a hash on the home page. `title`
 * is the browser/search title, `heading` the orange band on the page.
 */
export const sectionPages: Record<
  "shop" | "story" | "reviews" | "feed",
  { title: string; heading: string; kicker: string; doodle: IllustrationName; description: string }
> = {
  shop: {
    title: "Shop cake in a jar",
    heading: "The jars",
    kicker: "Shop",
    doodle: "jar",
    description:
      "Three cakes in a jar from Dizzy Gals: Pink Lemonade, Midnight Berry and Not a Tiramisu. Delivered across DHA Lahore on Fridays and Sundays, cash on delivery.",
  },
  story: {
    title: "Our story",
    heading: "Our story",
    kicker: "Brand story",
    doodle: "heart",
    description:
      "Dizzy Gals is for the hopelessly obsessed dessert lovers: bold flavours, creamy layers, real strawberries and small batches, made in Lahore.",
  },
  reviews: {
    title: "Reviews",
    heading: "Verified dizzy",
    kicker: "Reviews",
    doodle: "smiley",
    description: "What people say after a jar of Dizzy Gals cake. Spoiler: they come back for another.",
  },
  feed: {
    title: "The feed",
    heading: "The feed",
    kicker: "Social feel",
    doodle: "star",
    description: "Cake tastes better together. Moments, jars and one more bite from the Dizzy Gals feed.",
  },
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
    price: 1200,
    panel: "#FF8BA7",
    bg: "#FFD34D",
    jarImage: "/images/shop-01-pink-lemonade.webp",
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
    price: 1350,
    panel: "#57151F",
    bg: "#FF8BA7",
    dark: true,
    jarImage: "/images/shop-02-midnight-berry.webp",
  },
  {
    id: "not-a-tiramisu",
    name: "Not a Tiramisu",
    tag: "New",
    description:
      "Coffee-soaked sponge, creamy layers, and a cocoa finish. A familiar obsession with a little Dizzy Gals twist.",
    warning: "may cause one more spoonful",
    ingredients: [
      { label: "Coffee", illustration: "coffee" },
      { label: "Cream", illustration: "cream" },
      { label: "Cocoa", illustration: "chocolate" },
    ],
    cta: "go on. dig in.",
    price: 1350,
    panel: "#FF6A00",
    bg: "#F2EFE6",
    jarImage: "/images/shop-03-not-a-tiramisu.webp",
  },
];

export const promises: PromiseItem[] = [
  { label: "Real ingredients", illustration: "strawberry" },
  { label: "Made fresh in small batches", illustration: "cake" },
  { label: "Zero boring flavours", illustration: "heart" },
];

export const marqueeLines: string[] = [
  "Orders of 6 jars or more ship free",
  "Delivering DHA Lahore, Fridays and Sundays",
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
  {
    label: "real strawberries", bg: "#FFD34D", illustration: "strawberry",
    image: "/images/story-01-real-strawberries.webp",
    imageAlt: "Fresh whole and halved strawberries on a yellow background",
  },
  {
    label: "cake, obviously", bg: "#FF8BA7", illustration: "cake",
    image: "/images/story-02-cake-obviously.webp",
    imageAlt: "Golden sponge cake layered with strawberries and cream on a pink background",
  },
  {
    label: "spoon required", bg: "#F2EFE6", illustration: "spoon",
    image: "/images/story-03-spoon-required.webp",
    imageAlt: "A spoonful of sponge cake, strawberry compote and whipped cream",
  },
  {
    label: "you look dizzy", bg: "#FF8BA7", illustration: "smiley",
    image: "/images/story-04-you-look-dizzy.webp",
    imageAlt: "A swirl of strawberry sauce and whipped cream on top of a cake jar",
  },
  {
    label: "zero boring flavours", bg: "#F2EFE6", illustration: "star",
    image: "/images/story-05-zero-boring-flavours.webp",
    imageAlt: "Strawberry, chocolate and coffee-cream cake jars together",
  },
  {
    label: "zzz. food coma.", bg: "#FFD34D", illustration: "zzz",
    image: "/images/story-06-food-coma.webp",
    imageAlt: "An almost-finished strawberry cake jar with a spoon and linen napkin",
  },
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
  {
    kind: "photo", bg: "#FFD34D", fg: "#57151F", small: "a little sunshine, by the spoonful.",
    image: "/images/social-01-pink-lemonade-polaroid.webp",
    imageAlt: "Polaroid-style photo of a woman enjoying strawberry cake from a jar at a café",
  },
  {
    kind: "quote",
    bg: "#57151F",
    fg: "#F2EFE6",
    big: "Currently spiralling.",
    small: "send cake.",
    doodle: "zzz",
  },
  {
    kind: "photo", bg: "#FF6A00", fg: "#F2EFE6", small: "good company. better cake.",
    image: "/images/social-02-midnight-berry-polaroid.webp",
    imageAlt: "Polaroid-style photo of two friends eating chocolate and strawberry cake from jars",
  },
  {
    kind: "quote",
    bg: "#F2EFE6",
    fg: "#57151F",
    big: "Bad day? Cake. Good day? Also cake.",
    small: "a policy, not a slogan.",
    doodle: "star",
  },
  {
    kind: "photo", bg: "#FF8BA7", fg: "#57151F", small: "one more bite. obviously.",
    image: "/images/social-03-not-a-tiramisu-polaroid.webp",
    imageAlt: "Polaroid-style photo of a woman eating coffee-and-cream cake from a jar on a pink sofa",
  },
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
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
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
    links: products.map((p) => ({ label: p.name, href: `/shop#${p.id}` })),
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
      { label: "About us", href: "/story" },
      { label: "Reviews", href: "/reviews" },
      { label: "Shipping", href: "/shipping" },
      { label: "Wholesale", href: "/wholesale" },
      { label: "My orders", href: "/orders" },
    ],
  },
];

// ─── Pages ──────────────────────────────────────────────────────────────────

export type PageSection = { heading: string; body: string[] };

export const shippingPage: { title: string; intro: string; sections: PageSection[] } = {
  title: "Shipping",
  intro: "Cake in a jar travels well. Here's how it gets to you.",
  sections: [
    {
      heading: "Where we deliver",
      body: [
        `DHA ${store.city} only, for now — ${store.areas[0]} through ${store.areas[store.areas.length - 1]}. Not in DHA? Join the newsletter and you'll be the first to know when we spread.`,
      ],
    },
    {
      heading: "When it arrives",
      body: [
        `We deliver ${store.deliveryDays.length} days a week: ${store.deliveryDays.join(" and ")}. Pick your day at checkout. Orders for a day close at ${store.cutoffHour > 12 ? store.cutoffHour - 12 : store.cutoffHour}pm the day before, so the jars are baked the morning they travel.`,
        "We call to confirm before anything goes in the oven.",
      ],
    },
    {
      heading: "What it costs",
      body: [
        `Delivery is ${store.currency} ${store.deliveryFee} per order. Orders of ${store.freeDeliveryFrom} jars or more ship free — we did say so on the strip at the top.`,
      ],
    },
    {
      heading: "Paying",
      body: [
        "Cash on delivery only, for now. Pay the rider when the jars arrive. Exact change is love, but we'll manage.",
      ],
    },
    {
      heading: "Once it's yours",
      body: [
        "Keep it in the fridge. Eat within three days — it will not make it that long, but that's the rule. It does not freeze well; don't.",
      ],
    },
  ],
};

export const termsPage: { title: string; intro: string; sections: PageSection[] } = {
  title: "Terms",
  intro: "The short version: we make cake, you pay for cake, everyone's happy. The slightly longer version:",
  sections: [
    {
      heading: "Orders",
      body: [
        `Every order is for a delivery day you choose at checkout (currently ${store.deliveryDays.join(" or ")}), to an address inside DHA ${store.city}. An order is confirmed when we call you and you say yes. We reserve the right to cancel an order we can't reach you to confirm, or that we can't deliver to.`,
        "Prices are in " +
          store.currency +
          " and include everything except delivery, which is shown separately at checkout.",
      ],
    },
    {
      heading: "Payment",
      body: [
        "We take cash on delivery. Payment is due to the rider in full when your order arrives. Refusing a confirmed order at the door is not a great look, and may mean we can't take your next one.",
      ],
    },
    {
      heading: "Cancellations and problems",
      body: [
        "You can cancel free of charge any time before we confirm the order. After that the jars are already in the oven.",
        "If something arrives damaged, wrong, or not up to scratch, message us the same day with a photo and we'll replace it or refund it. We're not monsters.",
      ],
    },
    {
      heading: "Allergens",
      body: [
        "Our cakes contain dairy, eggs and gluten, and are made in a kitchen that also handles nuts. If that's a problem for you, please don't risk it.",
      ],
    },
    {
      heading: "Everything else",
      body: [
        "The words, drawings and general vibe on this site are ours. Please don't lift them. Questions go to hello@dizzygals.com.",
      ],
    },
  ],
};

export const privacyPage: { title: string; intro: string; sections: PageSection[] } = {
  title: "Privacy",
  intro: "We collect the minimum it takes to get cake to your door, and we don't sell any of it.",
  sections: [
    {
      heading: "What we collect",
      body: [
        "When you order: your name, phone number, delivery address and anything you type in the notes. When you join the newsletter: your email address. That's it.",
      ],
    },
    {
      heading: "What we do with it",
      body: [
        "We use it to confirm, bake and deliver your order, and to contact you if something goes wrong with it. Newsletter emails come only if you signed up, and every one has an unsubscribe link.",
      ],
    },
    {
      heading: "Who sees it",
      body: [
        "Us, and the rider who brings your order. We don't sell, rent or trade your details with anyone.",
      ],
    },
    {
      heading: "On your device",
      body: [
        "Your cart and a record of orders placed from this browser are stored in the browser itself, so you can find them again. Clearing your browser data removes them. We don't use tracking cookies.",
      ],
    },
    {
      heading: "Your call",
      body: [
        "Want to know what we hold about you, or want it gone? Email hello@dizzygals.com and it's done.",
      ],
    },
  ],
};

/**
 * The wholesale enquiry page. The perks are the pitch; the terms in them
 * (minimums, pricing) are PLACEHOLDER promises — confirm before launch.
 */
export const wholesalePage = {
  title: "Wholesale",
  heading: "Jars by the dozen",
  kicker: "Cafés, offices, events",
  doodle: "cake" as IllustrationName,
  description:
    "Stock Dizzy Gals cake in a jar at your café, treat the office, or sweeten an event. Trade pricing on 12 jars or more, delivered across DHA Lahore.",
  intro:
    "Cafés, offices, weddings, launches, Friday-afternoon morale. If it needs cake by the dozen, we bake it. Tell us a little about you and we'll call to sort the rest.",
  perks: [
    { label: "Trade pricing from 12 jars", illustration: "jar" as IllustrationName },
    { label: "Mix any of our flavours", illustration: "strawberry" as IllustrationName },
    { label: "Delivered across DHA Lahore", illustration: "spoon" as IllustrationName },
    { label: "Custom stickers for events", illustration: "star" as IllustrationName },
  ],
  businessTypes: ["Café or restaurant", "Office", "Event or wedding", "Corporate gifting", "Something else"],
  volumes: ["12–24 jars", "25–50 jars", "50+ jars", "Not sure yet"],
  frequencies: ["One-off", "Weekly", "Monthly", "Whenever the craving hits"],
  formTitle: "Tell us about you",
  submit: "send it over",
  sentTitle: "Got it.",
  sentBody: "We'll call within a day to talk flavours, numbers and dates. Go put the kettle on.",
  failedBody: "That didn't send. Email us instead and we'll pick it up straight away.",
  placeholder: true,
};

export const checkoutCopy = {
  cartTitle: "Your jar",
  cartEmpty: "Your jar is empty.",
  cartEmptyHint: "Tragic. Easily fixed.",
  checkoutTitle: "Checkout",
  paymentTitle: "Cash on delivery",
  paymentBody: "Pay the rider when your jars arrive. It's the only option right now, and honestly it's the nicest one.",
  dayTitle: "Which day?",
  dayBody: `We deliver on ${store.deliveryDays.join(" and ")}. Pick one.`,
  areaNote: `DHA ${store.city} only, for now.`,
  placeOrder: "place my order",
  confirmedTitle: "You're in.",
  confirmedBody: "We'll call to confirm, then it's straight into the oven.",
  ordersTitle: "My orders",
  ordersEmpty: "No orders on this device yet.",
  ordersNote: "Orders are remembered on this browser only.",
};
