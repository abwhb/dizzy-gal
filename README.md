# Dizzy Gals

Storefront and admin for Dizzy Gals — *cake worth losing your head over*. Built with Next.js 16
(App Router), React 19 and Tailwind CSS v4, with Prisma 7 on Postgres behind it, shadcn/ui for
the admin and Resend for email.

## Running it

```bash
cp .env.example .env   # fill in the dizzy_gals_* values
npm install            # also runs `prisma generate`
npm run db:migrate     # apply migrations to the database in .env
npm run db:seed        # insert the launch flavours (safe to re-run)
npm run dev            # http://localhost:3000, admin at /admin
npm run build
npm run lint
npm run typecheck
```

## Configuration

Every variable is prefixed `dizzy_gals_`; a plain `DATABASE_URL` or `RESEND_API_KEY` is
deliberately ignored so another project's settings on the same machine can't leak in. See
`.env.example`.

| Variable | Purpose |
| --- | --- |
| `dizzy_gals_PRISMA_DATABASE_URL` / `dizzy_gals_POSTGRES_URL` | Postgres connection string (either name; the Vercel × Prisma Postgres integration sets both) |
| `dizzy_gals_ADMIN_PASSWORD` | Password for `/admin` |
| `dizzy_gals_ADMIN_SESSION_SECRET` | Signs the admin session cookie (`openssl rand -hex 32`) |
| `dizzy_gals_RESEND_API_KEY` (or `dizzy_gals_RESEND`) | Resend key; email is skipped with a log line when unset |
| `dizzy_gals_ORDERS_NOTIFY_EMAIL`, `dizzy_gals_WHOLESALE_NOTIFY_EMAIL` | Where orders and enquiries are emailed (defaults `hello@` / `wholesale@dizzygals.com`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for emails, canonicals and structured data |

## Backend

`prisma/schema.prisma` — `Product`, `Order` / `OrderItem`, `WholesaleEnquiry`,
`NewsletterSubscriber`. Money is whole rupees. Order lines snapshot the flavour name and price at
checkout. Migrations live in `prisma/migrations/`; the generated client in `src/generated/prisma/`
is git-ignored and rebuilt on install.

**Products.** The database is the catalogue. `products` in `src/lib/content.ts` is the launch
list: `npm run db:seed` inserts any flavour whose id isn't in the database yet and leaves existing
rows alone, so edits made in the admin win. Storefront pages read products through
`listProducts()` (`src/lib/products.ts`), once per request; if the database can't be reached the
launch list is served instead, with an error logged, so the site stays up.

**Orders.** `POST /api/orders` takes the browser's cart (flavour id → quantity), the chosen
delivery day and the customer, prices it from the database, checks the day is a real future
delivery day and the area is one we serve, takes the jars off stock in a guarded transaction, and
returns the order (`DG-XXXXXXX`) in the shape the confirmation page keeps in `localStorage`. The
kitchen email and the customer's confirmation go out after the response. Statuses run
Placed → Confirmed (after the call) → Delivered; cancelling puts the jars back.
`GET /api/orders/:code?phone=` returns a customer's own order.

**Newsletter and wholesale.** `POST /api/newsletter` stores the address, then mirrors it to a
Resend contact and sends the welcome note. `POST /api/wholesale` stores the enquiry (flagged if
the team email didn't go out), then emails it.

Errors come back as `{ "error": { "message", "details"? } }` with a 4xx/5xx status;
`GET /api/health` reports whether the database is reachable.

## Admin

`/admin` (shadcn/ui, neutral theme) — dashboard (orders to call, jars per upcoming delivery day,
cash collected, low stock), orders (filter by status, change status), flavours (create, edit price,
stock, copy, ingredient badges and panel colours; activate/deactivate; delete if never ordered),
wholesale enquiries (mark handled), subscribers (list, remove, CSV export).

Sign-in is a single password. The session is an HMAC-signed, HttpOnly cookie scoped to `/admin`
that lasts 12 hours; `src/proxy.ts` redirects unauthenticated requests to `/admin/login`, and every
page and server action checks again.

## Deploying

On Vercel the `vercel-build` script runs `prisma migrate deploy`, seeds any missing flavours, then
builds. Set the `dizzy_gals_*` variables in the project (the Prisma Postgres integration provides
the database ones).

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

**Placeholder content.** The reviews are stand-ins so the section can be seen — they render
exactly like real content and are marked `placeholder: true` in `content.ts`. Replace them
before launch. The three flavours are Pink Lemonade, Midnight Berry, and Not a Tiramisu
(coffee-soaked sponge, cream, and cocoa).

## Pages and checkout

Every page other than the home page uses `src/components/page-shell.tsx` (header, orange title
band, footer, its own `<Motion/>`).

| Route | What it is |
| --- | --- |
| `/shop`, `/story`, `/reviews`, `/feed` | The home sections at their own addresses (`shop-list.tsx` stacks every flavour; the others reuse the section components). The nav, footer and every "back to the jars" link point here, never at `/#hash` |
| `/cart` | Line items with quantity steppers, delivery rule, total |
| `/checkout` | Name / phone / address / city / notes, cash on delivery, place order |
| `/order/[id]` | Confirmation: what happens next, summary, delivery address |
| `/orders` | Orders placed from this browser |
| `/shipping`, `/terms`, `/privacy` | Content from `content.ts` via `legal-page.tsx` |
| `/wholesale` | Pitch plus an enquiry form (`wholesale-form.tsx`); POSTs to `/api/wholesale`, which emails the enquiry to wholesale@ (see **Email**). The perks' terms are placeholders |
| anything else | Brand 404 |

**How the cart works.** The cart is a tiny external store (`src/lib/cart-store.ts`) persisted in
`localStorage`, read with `useSyncExternalStore` so the server and first paint agree (empty,
`hydrated: false`) and the saved cart appears right after. `site-provider.tsx` exposes it.

**How orders work.** Payment is cash on delivery only. Placing an order sends the cart, delivery
day and customer to `/api/orders` (see **Backend**); the server prices it, stores it and returns
the `Order`, which the browser saves to `localStorage`, then clears the cart and routes to the
confirmation. If the server rejects the order (sold out, bad day, unreachable) the form says so
and nothing is saved.

**Delivery rules.** DHA Lahore only (`store.areas`, one entry per phase) and only on set days
(`store.deliveryDays`, currently Friday and Sunday). Checkout offers the next open delivery days
(`src/lib/delivery.ts`); a day closes at `store.cutoffHour` the day before. Every order carries
its `deliveryDate` and `customer.area`. Open a new day or phase by adding it to the array.

**Placeholder settings.** `store` in `content.ts` holds the currency (`Rs`), the delivery fee and
the free-delivery threshold; per-jar prices and stock live in the database and are edited in
`/admin/products`. The store values are guesses so the checkout works — set the real ones.

**One rule for client-only views.** Content that mounts after hydration (anything read from
`localStorage`) must not carry `data-reveal` / `data-split` / `data-draw`: `<Motion/>` scans once
on mount, and anything hidden by the CSS pre-hide that arrives later stays hidden.

The mobile header opens a branded navigation panel with large links and a newsletter shortcut.
The Social feel section has a hand-drawn arrow and previous/next controls alongside its native
swipe rail; on desktop, those controls also move through the pinned scroll sequence.

## SEO

Everything search engines and link previews see comes from `site` in `content.ts` (name, tagline,
meta description, keywords, contact email, social URLs) and `src/lib/seo.ts`:

- **Canonical origin.** `siteUrl` is `NEXT_PUBLIC_SITE_URL` if set, else Vercel's production URL,
  else localhost. Set the env var when the real domain goes live; canonicals, the sitemap, the
  robots file and structured data all follow it.
- **Metadata.** `layout.tsx` sets the title template (`Page · Dizzy Gals`), Open Graph, Twitter
  card and robots defaults. Indexable pages use `pageMetadata()`; cart, checkout and order pages
  use `privateMetadata()` (`noindex`) and are also disallowed in `robots.ts`.
- **Routes.** `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` and `/opengraph-image` (a
  generated 1200×630 card in the brand colours) are all app-router files under `src/app/`.
- **Structured data.** `JsonLd` emits schema.org blocks: a `Bakery` (with DHA Lahore as the
  served area) and `WebSite` on every page, an `ItemList` of `Product`s with offers on the home
  page, and a `BreadcrumbList` on the content pages. There is deliberately **no**
  `aggregateRating` while the reviews are placeholders — add one only from real reviews.
- **Headings.** One `h1` per page (the hero lockup, or the title band); every home section has an
  `h2` (the shop's is visually hidden); flavour names are `h3`s.

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
| `data-pin-rail` | ≥1024px only: the section pins and vertical scroll becomes the rail's horizontal travel, snapping to card edges and leaning into a fast scroll; touch keeps the native swipe |
| `data-card-art="photo\|doodle"`, `data-feed-bar`, `data-feed-count` | Inside the rail, at every width: photos tilt and dip as they leave the centre of the screen, quote doodles drift at their own rate, the bar under the header fills and the counter follows the card nearest the middle |
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

The brand-story gallery shows six food photographs with caption pills. Clearing a tile's
`gallery[].image` restores its drawn illustration; the caption stays visible in either state.

Elements with `data-hero` / `data-reveal` are pre-hidden by CSS only once JS has flagged `<html
class="js">` (see `layout.tsx`), so nothing flashes before GSAP runs and nothing is lost without
JS. `prefers-reduced-motion` disables all of it.

One rule when adding hovers to anything GSAP animates: transition the `scale` property, never
`transform` — a CSS transition on `transform` makes GSAP read its own start state as the end.

## Editing content

Copy, gallery labels, marquee lines and footer links are in `src/lib/content.ts`. Flavours are
read from the database: add or edit them in `/admin/products` (or append to `products` in
`content.ts` and run `npm run db:seed` for a fresh database).

## Email

Transactional email goes through [Resend](https://resend.com) from the verified
`mail.dizzygals.com` subdomain. Everything lives in `src/lib/email.ts` (server-only): the
sender addresses, the one brand-styled template and the three flows.

| Flow | Route | Who gets what |
| --- | --- | --- |
| Order placed | `POST /api/orders` | Kitchen (`dizzy_gals_ORDERS_NOTIFY_EMAIL`) gets the full order, customer details and a reply-to of the customer. Customer gets a confirmation if they left an email |
| Wholesale enquiry | `POST /api/wholesale` | Wholesale inbox (`dizzy_gals_WHOLESALE_NOTIFY_EMAIL`) gets the enquiry; enquirer gets an acknowledgement if they left an email. The enquiry is stored either way and flagged in `/admin/enquiries` if the email didn't go out |
| Newsletter signup | `POST /api/newsletter` | The address is stored, saved as a Resend contact and sent a welcome note. Send broadcasts to those contacts from the Resend dashboard, or export the list as CSV from `/admin/subscribers`. If a `source` string property is defined under Contacts → Properties in Resend, each contact also records `modal` or `footer`; without it the contact is saved plainly |

Senders are `orders@`, `wholesale@` and `hello@` on `mail.dizzygals.com`; replies go to
`hello@dizzygals.com` / `wholesale@dizzygals.com`.

**Configuration.** Set `dizzy_gals_RESEND_API_KEY` in the Vercel project (Production, and
Preview if you want previews to send). Without it every send is a logged no-op, so local dev and
previews never email anyone by accident. `dizzy_gals_ORDERS_NOTIFY_EMAIL` and
`dizzy_gals_WHOLESALE_NOTIFY_EMAIL` override the destination inboxes; `NEXT_PUBLIC_SITE_URL`
sets the links inside the emails. See `.env.example`.

## Analytics

The site uses [Vercel Web Analytics](https://vercel.com/docs/analytics) and
[Speed Insights](https://vercel.com/docs/speed-insights). Both are mounted once in
`src/app/layout.tsx` and need no keys — they pick up the project automatically when deployed on
Vercel, and are inert in local dev and on other hosts. Enable them once per project in the Vercel
dashboard (**Analytics** and **Speed Insights** tabs) for data to appear.

Custom events live in `src/lib/analytics.ts`:

| Event | Fired when |
| --- | --- |
| `add_to_cart` | Anything is added to the cart, via `site-provider.tsx` (with `product`, `name`, `quantity`) |
| `order_placed` | Checkout submits an order (with `jars`, `total`, `delivery`, `area`, `payment`; no customer details) |
| `newsletter_open` | The newsletter modal is opened, from any entry point |
| `newsletter_subscribe` | The newsletter form is submitted with an email (with `source`: `modal` or `footer`) |

Add new events there rather than calling `track` inline, so names stay consistent.

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

The favicon is a cream cake-jar outline on orange. `src/app/icon.svg` is the path-based source;
`src/app/favicon.ico` contains 16, 32 and 48 px browser icons, and `src/app/apple-icon.png` is the
180 px Apple touch icon. Next.js discovers all three automatically. Keep the raster exports
in sync with the SVG when changing the mark.

The line marks in `src/components/illustrations.tsx` — strawberry, lemon, whipped cream, cake,
heart, the sleepy `zZz`, star, spoon, dizzy smiley and the jar — are inline SVG drawings in the
brand board's style, kept as path data so the pattern can reuse them. They take `currentColor`,
so each usage sets its own colour.

## Photography

Twelve generated concept images live in `public/images/` as WebP files (about 2 MB total).
They retain the original dimensions: product and social portraits are 1086 × 1448 (3:4),
and the story tiles are 1254 × 1254 (1:1). To replace an image, add the new file to `public/`
and update its field in `src/lib/content.ts`:

- `products[].jarImage` — the jar shot in the product panel
- `gallery[].image` — the six brand-story tiles
- `feed[].image` — the photo cards in the social rail

The product and story images fill their existing frames through `next/image`. Story captions
remain overlaid on the photographs; `imageAlt` supplies a separate description for assistive
technology. Social images include their own cream Polaroid borders and use `contain` to keep
the entire print visible, with a slight alternating tilt and shadow.

These assets were created with built-in image generation for this project. The jars illustrate
the flavour descriptions and are not verified product or packaging photographs. People in the
social images are fictional models, not customer testimonials. The original PNG collection
and generation prompts are retained in the separate image handoff pack; only the lighter WebP
copies are included in this repository.

## Design source

This site implements a Claude Design handoff. The original prototype, brand board and the
conversation that produced them are preserved in `project/` and `chats/`:

- `project/Dizzy Gals.dc.html` — the design this site is built from
- `project/uploads/pasted-*.png` — the Dizzy Gals brand board
- `chats/chat1.md` — the design conversation
- `project/HANDOFF.md` — the original handoff instructions

Those files are reference material and are excluded from linting; they are not part of the build.
