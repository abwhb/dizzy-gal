# Voyages Cortoba — landing page

Landing page for [Voyages Cortoba](https://www.voyagescortoba.com), a Laval, Québec travel agency
specialising in Hajj and Omra pilgrimages, ethical tourism and ticketing. The page follows the
[Vita Travels](https://vita-travel.webflow.io/) design language section for section: a near-black
teal ground, one heavy tight grotesque, a hairline-bordered grid of cells, a giant single-word hero
over a full-bleed photo, white pill and dark block buttons ending in a small square, amber stars and
map points, and almost no corner radius.

Built with Next.js 16 (App Router), React 19 and Tailwind CSS v4. Copy is in Canadian French.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## What's on the page

One scrolling page, composed in `src/app/page.tsx`, in the same order as the Vita home page:

| Vita section | Cortoba section | Component |
| --- | --- | --- |
| Bordered nav with "Explore" cell | Nav with "Explorer" cell | `src/components/header.tsx` |
| "Travel" over a mountain photo | "Pèlerinage" over the Haram | `src/components/hero.tsx` |
| "More than 100 countries. See for yourself" | "Plus de 20 ans… Voyez par vous-même" | `src/components/statement.tsx` |
| Three retreat types with country counts | Omra, Hajj, voyages organisés with counts | `src/components/categories.tsx` |
| Photo, editorial paragraph, big stats, trusted-by logos | Same, with airline wordmarks | `src/components/about.tsx` |
| Two-column retreat cards with icon meta rows | Omra departure cards with prices | `src/components/departures.tsx` |
| Four steps over a foggy photo | Four steps from choice to departure | `src/components/process.tsx` |
| Dark map with amber points | Destinations from Montréal | `src/components/map.tsx` |
| "The 200+ faces behind Vita Travel" | "Les visages derrière Voyages Cortoba" | `src/components/team.tsx` |
| Panoramic photo band | Same | `src/components/panorama.tsx` |
| Logo, oversized "+" links, contact | Same, plus legal line | `src/components/footer.tsx` |

Shared primitives (photo slot, logo mark, buttons, icons, price formatting) live in
`src/components/ui.tsx`.

## Editing content

All copy and data is in `src/lib/content.ts`: navigation, hero, categories, departures and prices,
process steps, map points, team roles and contact details. A departure with `price: null` shows
"tarif à venir" instead of a price. Map points are latitude/longitude pairs; the map projects them
itself.

### Before publishing

- **Team names are placeholders.** The four entries in `team.members` carry real roles but the
  name reads "Nom à compléter" until the agency supplies names and portraits.
- **Prices.** Only the December 2026 Omra price was public at the time of writing. Confirm every
  figure and date with the agency.
- **Partner wordmarks** are plain text; replace with logo files when the agency provides them.

## Design tokens

| Token | Value | Use |
| --- | --- | --- |
| `night` | `#0A1A20` | page ground |
| `night-2` | `#0E2129` | hover ground |
| `teal` | `#16303A` | block buttons |
| `line` | `#1E333B` | hairline grid borders |
| `mist` | `#96A6AB` | muted text |
| `amber` | `#F2A93B` | stars, map points, hover |

Defined in `src/app/globals.css`. All type is **Inter Tight** (500, 600, 700) via
`next/font/google`, set with negative letter-spacing; display sizes go up to
`clamp(76px, 17vw, 232px)` in the hero.

## Photography

Every photo position except the team portraits is filled with a freely licensed photograph from
Wikimedia Commons (CC BY, CC BY-SA or public domain), listed with author and licence in `photos` at
the top of `src/lib/content.ts`. The browser loads them straight from Commons via
`Special:FilePath` at the requested width, and the footer renders the required attribution from
the same list. Any entry can be swapped for the agency's own photo: put the file in `public/` and
set the matching field to its path, then drop the entry from `photos` so the credit disappears too.

The fields, in page order:

- `hero.image` — full-bleed hero
- `categories[].image` — the three category tiles
- `about.image` — the large about photo
- `departures[].image` — each departure card
- `process.image` — the background behind the four steps
- `panorama.image` — the wide band above the footer

Team portraits are wired the same way once names exist. Each swap puts a `next/image` into the same
box at the same crop; nothing else needs to change.
