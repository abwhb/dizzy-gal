# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The README.md is comprehensive and maintained — read the relevant section before working on
motion (GSAP data attributes), email flows, SEO, or checkout. This file covers commands and the
non-obvious traps.

## Commands

```bash
npm run dev          # http://localhost:3000, admin at /admin
npm run build
npm run lint
npm run typecheck    # tsc --noEmit
npm run db:migrate   # prisma migrate dev (needs .env; see below)
npm run db:seed      # inserts launch flavours from content.ts; safe to re-run
npm run db:studio
```

There is **no test framework** — verification is `lint` + `typecheck` + `build`. On Vercel,
`vercel-build` runs `prisma migrate deploy` + seed + `next build`.

## Environment

Every env var is prefixed `dizzy_gals_`; plain `DATABASE_URL` / `RESEND_API_KEY` are
**deliberately ignored** (`src/lib/env.ts`) so another project's settings can't leak in. The one
exception is `NEXT_PUBLIC_SITE_URL`. Copy `.env.example` to `.env`. Without a Resend key, every
email send is a logged no-op.

## Architecture

Next.js 16 App Router + React 19 + Tailwind CSS v4 storefront, with Prisma 7 on Postgres and a
shadcn/ui admin. Path alias `@/*` → `src/*`.

- **Database is the catalogue.** `products` in `src/lib/content.ts` is only the launch/seed list;
  seeding inserts missing ids and never overwrites, so admin edits win. Storefront reads through
  `listProducts()` (`src/lib/products.ts`), which falls back to the launch list (with a logged
  error) if the DB is unreachable — the site stays up.
- **Prisma client is a lazy function.** Use `db()` from `src/lib/db.ts`, not an exported instance;
  it's created on first use so `next build` never needs a database URL. The generated client at
  `src/generated/prisma/` is git-ignored and rebuilt by `postinstall`.
- **Money is whole rupees** (integers). Order lines snapshot flavour name and price at checkout.
- **Admin auth**: `src/proxy.ts` (Next's proxy, not `middleware.ts`) gates `/admin/*` behind an
  HMAC-signed HttpOnly cookie; every page and server action checks again on its own.
- **Cart** is a tiny external store (`src/lib/cart-store.ts`) persisted in `localStorage`, read
  with `useSyncExternalStore`; server render and first paint are always empty/`hydrated: false`.
- **Orders**: `POST /api/orders` prices the cart from the DB, validates delivery day/area
  (`src/lib/delivery.ts`, rules in `store` in `content.ts`), decrements stock in a guarded
  transaction, and emails after the response. Cancelling restores stock.
- **Copy, store settings, marquee lines, legal pages** all live in `src/lib/content.ts`.
  API errors are `{ "error": { "message", "details"? } }`.

## Motion (GSAP) — two rules learned the hard way

- Never put a CSS `transition` on `transform` for anything GSAP animates — GSAP reads its own
  start state as the end. For hovers, transition the `scale` property instead.
- Content that mounts after hydration (anything read from `localStorage`) must **not** carry
  `data-reveal` / `data-split` / `data-draw`: `<Motion/>` (`src/components/motion.tsx`) scans once
  on mount, and late arrivals stay hidden by the CSS pre-hide. Also: when a `from()` tween moves
  the element you're triggering on, trigger on an untransformed parent.

The full data-attribute vocabulary is in the README's Motion table.

## Conventions

- New analytics events go in `src/lib/analytics.ts`, never inline `track()` calls.
- Reviews and some store settings are placeholders, marked `placeholder: true` in `content.ts`.
- Internal links point at real routes (`/shop`, `/story`, …), never `/#hash`.
