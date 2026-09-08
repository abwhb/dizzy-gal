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
| Pink Lemonade product feature | `src/components/shop.tsx` |
| Brand story + photo grid | `src/components/story.tsx` |
| Social-feel rail | `src/components/feed.tsx` |
| Footer | `src/components/site-footer.tsx` |
| Newsletter modal | `src/components/newsletter-modal.tsx` |

Cart count and newsletter open/closed state live in `src/components/site-provider.tsx`. Adding to
the cart is client-side only — there is no checkout behind it yet.

## Motion

Entrances and scroll reveals are GSAP (`src/components/motion.tsx`, using ScrollTrigger and
SplitText); continuous loops and hovers are CSS. Sections opt in with data attributes rather than
importing anything:

| Attribute | Effect |
| --- | --- |
| `data-hero="pill\|title\|tagline\|cta"` | Intro timeline — the lockup flies in letter by letter, the `!` keeps bobbing |
| `data-hero-content` | Parallaxes up and fades as the hero scrolls away |
| `data-reveal` / `"pop"` / `"slide"` | Scroll-in; siblings that enter together stagger automatically |
| `data-float` | Idle bob (the jar) |
| `data-cart-badge` | Target for the fly-to-cart dot |

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

The strawberry, lemon, whipped-cream, cake and heart marks in `src/components/illustrations.tsx`
are inline SVG line drawings in the brand board's style. They take `currentColor`, so each usage
sets its own colour.

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
