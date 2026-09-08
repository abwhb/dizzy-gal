# Voyages Cortoba — landing page

Landing page for [Voyages Cortoba](https://www.voyagescortoba.com), a Laval, Québec travel agency
specialising in Hajj and Omra pilgrimages, ethical tourism and ticketing. The layout takes its cues
from the Vita Travel template: an editorial serif headline, a booking-style search bar under the hero,
program cards, a destinations grid, testimonials and a checkout-like contact form.

Built with Next.js 16 (App Router), React 19 and Tailwind CSS v4. Copy is in Canadian French.

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
| Sticky header with mobile menu | `src/components/header.tsx` |
| Hero, search bar, trust strip | `src/components/hero.tsx` |
| Three service pillars | `src/components/services.tsx` |
| Omra departures with prices | `src/components/departures.tsx` |
| Hajj Québec 2026 feature | `src/components/hajj.tsx` |
| Destinations grid | `src/components/destinations.tsx` |
| Four-step process | `src/components/steps.tsx` |
| About + key figures | `src/components/about.tsx` |
| Testimonials + airline partners | `src/components/testimonials.tsx` |
| FAQ accordion | `src/components/faq.tsx` |
| Contact details + enquiry form | `src/components/contact.tsx` |
| Footer | `src/components/footer.tsx` |

Shared primitives (container, kicker, buttons, photo slot, icons) live in `src/components/ui.tsx`.

## Editing content

All copy and data is in `src/lib/content.ts`: navigation, hero, departures and prices, Hajj
inclusions, destinations, FAQ, contact details and footer links. Adding a departure is a matter of
appending to `departures`; the section renders whatever is in that array. A departure with
`price: null` shows "Tarif à venir" instead of a price.

### Before publishing

- **Testimonials are placeholders.** The three entries in `testimonials` are explicitly marked as
  such and must be replaced with real, authorised client quotes.
- **Prices.** Only the December 2026 Omra price was public at the time of writing. Confirm every
  figure and date with the agency.
- **Contact form.** There is no backend yet; submitting opens the visitor's mail client with the
  request pre-filled and addressed to the agency. Wire it to a form service or API route when ready.

## Brand

| Token | Value |
| --- | --- |
| `ink` | `#14211B` |
| `green` | `#0F3D2E` |
| `forest` | `#1B5A44` |
| `mint` | `#E3EEE7` |
| `sand` | `#F5F0E7` |
| `paper` | `#FFFDF8` |
| `line` | `#DCD3C4` |
| `muted` | `#6B6A62` |
| `gold` | `#C9A24A` |

Defined in `src/app/globals.css`. Headlines use **Playfair Display**, body text **DM Sans**, both
loaded through `next/font/google`.

## Photography

No photography was available, so every photo position renders as a duotone slot with a caption
naming the intended shot. To drop a real image in, put the file in `public/` and set the matching
field in `src/lib/content.ts`:

- `hero.image.src` — the hero portrait
- `services[].image` — the three service cards
- `departures[].image` — each departure card
- `hajj.image` — the Hajj feature
- `destinations[].image` — the destination tiles
- `about.image` — the team photo

Each one swaps a `next/image` into the same box at the same crop; nothing else needs to change.
