# Dizzy Gals

Storefront and admin for Dizzy Gals — *cake worth losing your head over*. Built with Next.js 16
(App Router), React 19, Tailwind CSS v4, Prisma 7 on Postgres, shadcn/ui for the admin and Resend
for email.

## Running it

```bash
cp .env.example .env   # fill in the dizzy_gals_* values
npm install            # also runs `prisma generate`
npm run db:migrate     # apply migrations to the database in .env
npm run db:seed        # insert the launch catalogue (safe to re-run)
npm run dev            # http://localhost:3000, admin at /admin
npm run build
npm run lint
npm run typecheck
```

## Configuration

Every variable is prefixed `dizzy_gals_`; a plain `DATABASE_URL` is deliberately ignored so
another project's settings on the same machine can't leak in. See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `dizzy_gals_PRISMA_DATABASE_URL` / `dizzy_gals_POSTGRES_URL` | Postgres connection string (either name; the Vercel × Prisma Postgres integration sets both) |
| `dizzy_gals_ADMIN_PASSWORD` | Password for `/admin` |
| `dizzy_gals_ADMIN_SESSION_SECRET` | Signs the admin session cookie (`openssl rand -hex 32`) |
| `dizzy_gals_RESEND_API_KEY` | Resend key; email is skipped with a log line when unset |
| `dizzy_gals_EMAIL_FROM` | Sender, on a domain verified in Resend (default `Dizzy Gals <hello@dizzygals.com>`) |
| `dizzy_gals_ORDER_NOTIFY_EMAIL` | Optional inbox that gets a copy of every new order |

## Backend

### Data model

`prisma/schema.prisma` — `Product`, `Cart` / `CartItem`, `Order` / `OrderItem`,
`NewsletterSubscriber`. Prices are integer cents with a currency code. Order lines snapshot the
product name and price at checkout. Migrations live in `prisma/migrations/`; the generated client
in `src/generated/prisma/` is git-ignored and rebuilt on install.

`src/lib/content.ts` holds the launch catalogue. `npm run db:seed` inserts any product whose slug
isn't in the database yet and leaves existing rows alone, so edits made in the admin win.

### API

Carts are anonymous and tied to the `dg_cart` cookie, set on the first add. Errors come back as
`{ "error": { "message", "details"? } }` with a 4xx/5xx status.

| Route | What it does |
| --- | --- |
| `GET /api/health` | Liveness plus a database round-trip |
| `GET /api/products`, `GET /api/products/:slug` | Active products |
| `GET /api/cart`, `DELETE /api/cart` | The visitor's cart; empty it |
| `POST /api/cart/items` `{ productId \| slug, quantity? }` | Add jars (checks stock and a per-line cap of 50) |
| `PATCH /api/cart/items/:id` `{ quantity }`, `DELETE …/:id` | Change or remove a line (`0` removes) |
| `POST /api/orders` | Check out the cart: name, email, address, notes |
| `GET /api/orders/:number?email=` | A customer's own order |
| `POST /api/newsletter` `{ email }` | Subscribe or re-subscribe |

Checkout runs in a transaction: stock is decremented with a `stock >= quantity` guard so two
customers can't buy the last jar, the cart is emptied, and the order is created as `PENDING`.
There is no payment step yet — that is where a Stripe session would slot in, moving the order to
`PAID`. Shipping is free from 6 jars, otherwise a flat rate (both in `src/lib/content.ts`).

Order confirmation, an optional owner notification and the newsletter welcome email are sent via
Resend after the response (`src/lib/email.ts`), so a slow or failing mail API never fails the
request.

### Admin

`/admin` (shadcn/ui, neutral theme) — dashboard, products (create, edit, stock, price, ingredient
badges, activate/deactivate, delete if never ordered), orders (filter by status, change status;
cancelling restocks the jars), subscribers (list, remove, CSV export).

Sign-in is a single password. The session is an HMAC-signed, HttpOnly cookie scoped to `/admin`
that lasts 12 hours; `src/proxy.ts` redirects unauthenticated requests to `/admin/login`, and
every page and server action checks again.

### Deploying

On Vercel the `vercel-build` script runs `prisma migrate deploy`, seeds any missing products, then
builds. Set the `dizzy_gals_*` variables in the project (the Prisma Postgres integration provides
the database ones).

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

`src/components/site-provider.tsx` loads the visitor's cart from `/api/cart` on mount and posts
adds to `/api/cart/items`; the header count reflects the server-side cart. The newsletter modal
posts to `/api/newsletter`.

## Editing content

Copy, gallery labels, marquee lines and footer links are in `src/lib/content.ts`. Products are
read from the database: add or edit flavours in `/admin/products` (or append to `products` in
`content.ts` and run `npm run db:seed` for a fresh database).

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
