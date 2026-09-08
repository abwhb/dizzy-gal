# Dizzy Gals

Marketing site for Dizzy Gals — *cake worth losing your head over*. Built with Next.js 16 (App
Router), React 19 and Tailwind CSS v4.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## What's on the page

One scrolling page, composed in `src/app/page.tsx`:

| Section | Component |
| --- | --- |
| Full-viewport orange hero, pill nav, scrolling strip | `src/components/hero.tsx`, `marquee.tsx` |
| Sticky site nav with cart count | `src/components/site-header.tsx` |
| Three-promise strip | `src/components/promise-strip.tsx` |
| Flavour carousel (one `ProductFeature` per flavour) | `src/components/flavour-carousel.tsx`, `product-feature.tsx` |
| Brand story + sticker sheet | `src/components/story.tsx` |
| Reviews | `src/components/reviews.tsx` |
| Social-feel rail | `src/components/feed.tsx` |
| Footer, with the puddle | `src/components/site-footer.tsx` |
| Newsletter modal (shares `newsletter-form.tsx`) | `src/components/newsletter-modal.tsx` |
| The falling mascot | `src/components/mascot.tsx` |

**Placeholder content.** The reviews are stand-ins so the section can be seen — they render exactly
like real content and are marked `placeholder: true` in `content.ts`. Replace them before launch.

## Pages and checkout

Every page other than the home page uses `src/components/page-shell.tsx` (header, orange title
band, footer, its own `<Motion/>`).

| Route | What it is |
| --- | --- |
| `/cart` | Line items with quantity steppers, delivery rule, total |
| `/checkout` | Name / phone / address / city / notes, cash on delivery, place order |
| `/order/[id]` | Confirmation: what happens next, summary, delivery address |
| `/orders` | Orders placed from this browser |
| `/shipping`, `/terms`, `/privacy` | Content from `content.ts` via `legal-page.tsx` |
| anything else | Brand 404 |

**How the cart works.** The cart is a tiny external store (`src/lib/cart-store.ts`) persisted in
`localStorage`, read with `useSyncExternalStore` so the server and first paint agree (empty,
`hydrated: false`) and the saved cart appears right after. `site-provider.tsx` exposes it.

**How orders work.** Payment is cash on delivery only. Placing an order builds an `Order`
(`src/lib/orders.ts`), POSTs it to `/api/orders`, saves it to the browser's `localStorage`, clears
the cart and routes to the confirmation. **`/api/orders` is a stub** — it validates the shape,
logs the id and returns `ok`. Wire the real intake there (email to the kitchen, a sheet row, a
WhatsApp message, a Shopify draft order). Until then the kitchen does not hear about orders.

**Delivery rules.** DHA Lahore only (`store.areas`, one entry per phase) and only on set days
(`store.deliveryDays`, currently Friday and Sunday). Checkout offers the next open delivery days
(`src/lib/delivery.ts`); a day closes at `store.cutoffHour` the day before. Every order carries
its `deliveryDate` and `customer.area`. Open a new day or phase by adding it to the array.

**Placeholder settings.** `store` in `content.ts` also holds the currency (`Rs`), per-jar prices,
the delivery fee and the free-delivery threshold. Those are guesses so the checkout works — set
the real ones.

**One rule for client-only views.** Content that mounts after hydration (anything read from
`localStorage`) must not carry `data-reveal` / `data-split` / `data-draw`: `<Motion/>` scans once
on mount, and anything hidden by the CSS pre-hide that arrives later stays hidden.

## Motion

Entrances and scroll reveals are GSAP (`src/components/motion.tsx`, using ScrollTrigger and
SplitText); continuous loops and hovers are CSS. Sections opt in with data attributes rather than
importing anything:

| Attribute | Effect |
| --- | --- |
| `data-hero="pill\|title\|tagline\|cta\|zzz\|doodle\|badge"` | Intro timeline — the lockup flies in letter by letter and wobbles under the pointer, the `!` keeps bobbing, doodles and the sticker pop in after |
| `data-hero-content` | Parallaxes up and fades as the hero scrolls away |
| `data-parallax="0.5"` | Follows the pointer, scaled by depth (hero doodles) |
| `data-header` | Sticky nav slips away on scroll-down, returns on scroll-up (and whenever something is added to the cart) |
| `data-marquee` | The strip runs on GSAP so its speed follows scroll velocity — faster on a fast scroll, backwards on the way up |
| `data-reveal` / `"pop"` / `"slide"` | Scroll-in; siblings that enter together stagger automatically |
| `data-split="chars"` (+ `data-wobble`) | Letters rise out of a mask as it scrolls in; optionally wobble under the pointer |
| `data-split="words-scrub"` | Words brighten one by one, tied to scroll position |
| `data-draw` | Every path inside draws itself in (DrawSVG) |
| `data-deal` | Children are dealt onto the grid from scattered positions, tied to scroll |
| `data-scallop` | Icing edges drip down as they arrive |
| `data-parallax-bg` | A background pattern drifts slower than the page |
| `data-rise` | Slides up into place as the page bottom nears |
| `data-pin-rail` | ≥1024px only: the section pins and vertical scroll becomes the rail's horizontal travel; touch keeps the native swipe |
| `data-mascot` / `data-puddle` | The mascot tumbles down the right edge over the whole page and lands in the puddle, which splashes; the landing height is measured from the puddle's position at max scroll |
| `data-float` | Idle bob (the jar, the doodles) |
| `data-cart-badge` | Target for the fly-to-cart dot |

Two ScrollTrigger rules learned the hard way: never put a CSS `transition` on `transform` for anything GSAP animates (it reads its own start state as the end), and when a `from()` tween moves the element you're triggering on, trigger on an untransformed parent instead — otherwise the start point is measured mid-shift and can fall past the bottom of the page.

The cursor is a lemon slice on pointer devices, and a slice of cake over anything clickable (`globals.css`, bottom). Text fields keep the I-beam.

## Brand furniture

`src/components/decor.tsx` holds the pieces that make the page read as one hand, all built from
the same line marks as the illustrations:

- **`PatternBand`** — the brand board's doodle pattern as a tiled SVG data URL; a full-width
  drifting band between sections, or an `overlay` texture on a panel.
- **`Scallop`** — a row of half-discs in the colour of the section above, hanging over the edge
  like icing. Drop it as the first child of any `relative` section.
- **`SpinBadge`** — the round "made to make you dizzy" sticker with text on a slowly spinning
  ring.
- **`Squiggle`** (in `illustrations.tsx`) — the wavy underline the board draws under flavour names.

The brand-story gallery is a sticker sheet of the drawn marks until photos exist; setting
`gallery[].image` swaps a photo into the same tile.

Elements with `data-hero` / `data-reveal` are pre-hidden by CSS only once JS has flagged `<html
class="js">` (see `layout.tsx`), so nothing flashes before GSAP runs and nothing is lost without
JS. `prefers-reduced-motion` disables all of it.

One rule when adding hovers to anything GSAP animates: transition the `scale` property, never
`transform` — a CSS transition on `transform` makes GSAP read its own start state as the end.

## Editing content

Copy, products, gallery labels, marquee lines and footer links are all in `src/lib/content.ts`.
Adding a second flavour is a matter of appending to `products`; the shop section renders whatever
is in that array.

## Brand

| Token | Value |
| --- | --- |
| `dizzy-orange` | `#FF6A00` |
| `cream` | `#F2EFE6` |
| `strawberry` | `#FF8BA7` |
| `lemon` | `#FFD34D` |
| `burgundy` | `#57151F` |

Defined in `src/app/globals.css`. The brand board specifies **Astrofat Extra Bold** for headings,
which isn't available as a web font — **Baloo 2 ExtraBold** stands in as the closest chunky-rounded
match, with **Poppins** for body text.

The line marks in `src/components/illustrations.tsx` — strawberry, lemon, whipped cream, cake,
heart, the sleepy `zZz`, star, spoon, dizzy smiley and the jar — are inline SVG drawings in the
brand board's style, kept as path data so the pattern can reuse them. They take `currentColor`,
so each usage sets its own colour.

## Photography

There are no product photos in the handoff bundle, so every photo position renders as a labelled
slot at the right aspect ratio. To drop a real image in, put the file in `public/` and set the
matching field in `src/lib/content.ts`:

- `products[].jarImage` — the jar shot in the product panel
- `gallery[].image` — the six brand-story tiles
- `feed[].image` — the photo cards in the social rail

Each one swaps a `next/image` into the same box at the same crop; nothing else needs to change.

## Design source

This site implements a Claude Design handoff. The original prototype, brand board and the
conversation that produced them are preserved in `project/` and `chats/`:

- `project/Dizzy Gals.dc.html` — the design this site is built from
- `project/uploads/pasted-*.png` — the Dizzy Gals brand board
- `chats/chat1.md` — the design conversation
- `project/HANDOFF.md` — the original handoff instructions

Those files are reference material and are excluded from linting; they are not part of the build.
