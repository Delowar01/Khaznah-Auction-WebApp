# Khazna — Customer Website Redesign Concepts (design preview)

An isolated, interactive preview of **four design directions** for the Khazna
customer website, built for client review:

| Option | Direction | Default appearance |
|---|---|---|
| A | Premium Marketplace — a modern auction house: editorial, calm, catalogue-like | Light |
| B | Modern Commerce — a fast, dense, search-first marketplace | Light |
| C | Saudi Contemporary — Arabic-first, architectural, built from the brand's own geometry | Light |
| D | Digital / Auction Marketplace — real-time data, charts and a live "auction floor" | Dark |

Every option implements the same six customer screens — **Home, Browse, Buy Now
product detail, Auction detail, Live auction, Seller storefront** — plus a
**Components & states** board, in **English (LTR) and Arabic (RTL)**, **light and
dark**, and for **desktop, laptop, tablet and mobile**. All four read the same
sample catalogue, so the client compares design, not content.

> **Isolation.** This folder is a self-contained Next.js app with its own
> `package.json`. It imports nothing from the production Khazna frontend or
> backend, makes no network requests, needs no API, database, credentials or
> sign-in, and uses sample data only. It can be deployed on its own and removed
> without affecting anything else.

---

## Run locally

Requirements: **Node.js 20.9+** (22 LTS recommended) and npm.

```bash
cd design-preview
npm ci
npm run dev          # http://localhost:3100  →  redirects to /en
```

Open `http://localhost:3100/en` (or `/ar`) for the concept selector.

## Build and run in production mode

```bash
npm run build        # pre-renders every route (fully static)
npm start            # http://localhost:3100
```

## Deploy independently

**Vercel (recommended for a temporary client preview)**

1. Import the repository in Vercel.
2. Set **Root Directory** to `design-preview`. Framework preset: *Next.js*.
   Build command `npm run build`, install command `npm ci` (the defaults).
3. No environment variables are needed.
4. Optional: turn on *Deployment Protection* (password or Vercel
   authentication) so only the client can open the link. Pages already send
   `noindex`.

CLI alternative: `cd design-preview && npx vercel` (preview) or `npx vercel --prod`.

**Any static host (S3 + CloudFront, Netlify, Nginx, GitHub Pages …)**

```bash
npm run export       # writes a static site to ./out
```

Upload the contents of `out/`. (The `export` script sets `STATIC_EXPORT=1`; on
Windows run it from Git Bash/WSL, or set the variable manually.)

**Docker / Node host** — `npm ci && npm run build && npm start` behind any reverse proxy.

---

## Using the preview (for presenters)

- **Concept selector** — `/en` or `/ar`: the four options side by side, with a
  preview, philosophy, key characteristics and quick links to every screen.
- **Presentation bar** (top of every concept): back to concepts, switch concept,
  jump between screens, **EN / العربية**, **light / dark**, and **desktop /
  tablet / mobile** device frames. Press **`.`** to hide or show the bar.
- Useful URL options:
  - `?theme=dark` or `?theme=light` — force the appearance (remembered per concept).
  - `/{lang}/preview?device=mobile&src=/en/concept-b/browse` — device frame for any screen.
  - `?embed=1` — hides the presentation bar (used inside device frames).
- Everything is interactive with simulated behaviour: search, filters and
  sorting, cart and watchlist, bidding with confirmation, maximum (proxy) bids,
  anti-sniping extensions, rival bidders, Buy Now on auction lots, and a live
  auction room that hammers lots down and moves to the next one.

Screen routes (same for `concept-a` … `concept-d`, prefixed with `/en` or `/ar`):

| Screen | Route | Useful states |
|---|---|---|
| Home | `/concept-a` | — |
| Browse | `/concept-a/browse` | `?tab=auction`, `?tab=buy_now`, `?category=electronics`, `?search=zzz` (empty state) |
| Buy Now detail | `/concept-a/product` | `/product/tyre-inflator` (sold out), `/product/kitchen-pallet` (full-lot only), `/product/monitor-stands-5` (per case), `/product/capsule-coffee` (low stock) |
| Auction detail | `/concept-a/auction` | `/auction/fridge-690` (auction + Buy Now), `/auction/electronics-pallet` (pallet manifest), `/auction/seat-covers` (closing in minutes), `/auction/leather-sofa` (upcoming), `/auction/robot-vacuum` (sold) |
| Live auction | `/concept-a/live-auction` | lots rotate automatically |
| Seller storefront | `/concept-a/seller` | `/seller/REDSEA` (live now), `/seller/KHAZNA`, `/seller/MAJD`, `/seller/SAHEL` |
| Components & states | `/concept-a/system` | buttons, inputs, badges, cards, skeletons, empty state, toasts, modal, dropdown, drawer, pagination, mobile menu |

---

## Architecture

```
design-preview/
├── app/
│   ├── (root)/                 "/" → redirects to the visitor's last language
│   ├── global-not-found.js     bilingual 404 for unknown URLs
│   └── [lang]/                 en | ar (pre-rendered), sets <html lang dir>
│       ├── page.js             concept selector
│       ├── preview/            device frames (tablet / mobile)
│       └── concept-{a,b,c,d}/  thin route files → the concept's page components
├── components/
│   ├── shared/
│   │   ├── providers/          language, concept links, cart/watchlist/toast store, motion
│   │   ├── ui/                 accessible primitives with no visual opinion:
│   │   │                       Money, Img, Modal, Drawer, Listbox, PriceRange,
│   │   │                       Skeleton, Reveal, Toaster, DirIcon, hooks
│   │   ├── brand/              the 2026 Khazna logo as vector (colour via CSS variables)
│   │   └── presentation/       selector, presentation bar, device preview
│   └── concept-{a,b,c,d}/      each concept's visual layer only
│       ├── Chrome.jsx          header, navigation, footer, mobile menu
│       ├── pages/              HomePage, BrowsePage, ProductPage, AuctionPage, LivePage, SellerPage, SystemPage
│       └── layout/ cards/ browse/ detail/ product/ auction/ live/ seller/ system/ ui/ home/ …
├── data/                       the single sample catalogue shared by all concepts
├── lib/                        behaviour shared by all concepts (see below)
├── styles/concept-{a..d}.css   each concept's design tokens (light + dark) and utilities
├── public/                     product photography, brand photography, logo, Riyal font
└── scripts/                    image pipeline, QA script, preview capture
```

**One behaviour layer, four visual layers.** Everything a future production
implementation would keep lives once in `lib/` and `components/shared/`; the
concept folders only decide how things look.

- `lib/useBrowse.js` — the browse model: tab, search (debounced), categories,
  grades, item type, price range, ending-within, availability, discount, sort,
  numbered pagination and progressive loading, all kept in the URL
  (`?tab=auction&category=electronics&condition=A,B&min_price=…&sort=…`) the way
  production's browse page keeps its filters shareable.
- `lib/useAuction.js` — timed-auction behaviour modelled on the backend rules:
  minimum next bid, increments, maximum (proxy) bids, anti-sniping (a bid in the
  last 5 minutes extends by 5 minutes), deposit coverage, bidder state
  (highest / outbid / won / lost) and Buy Now availability on "both" lots.
- `lib/useLiveEvent.js` — the live event item lifecycle (live → going once →
  going twice → sold / not sold → next lot). For a continuous demo it advances
  to the next lot automatically; in production the presenter starts each lot.

Where the preview's simplified models differ from production (URL parameter
names, first-bid minimum, bidder-state names, urgency thresholds, live
sequencing, seller profile fields …), the differences are listed in
[`../CUSTOMER_REDESIGN_FILE_MAP.md`](../CUSTOMER_REDESIGN_FILE_MAP.md), section G.
- `lib/clock.js` — one shared, hydration-safe countdown clock for the whole page.
- `lib/format.js`, `lib/i18n.js` — money with the Saudi Riyal sign (U+20C1),
  durations, dates (Gregorian and Hijri), Arabic plural rules, bidi isolation.
- `data/*.js` — field names follow production's card adapters and serializers
  (`saleType`, `status`, `itemType`, `grade`, `currentBid`, `increment`,
  `buyNowPrice`, `marketPrice`, `fullStockRequired` …), so the chosen design can
  later be connected to real API responses without reshaping.

**Design tokens.** Components use semantic Tailwind utilities (`bg-surface`,
`text-fg`, `border-line`, `bg-primary`, `text-live`, `rounded-card` …) defined
in `app/globals.css`. Each `styles/concept-*.css` supplies the raw values for
light and dark, scoped to `html[data-concept]`, so modals and drawers rendered
in portals inherit the right theme.

**Languages.** Every string comes from `data/ui.js`, the sample data or a
concept's `copy.js`, as `{ en, ar }`. Layouts use logical properties (`ms-`,
`pe-`, `start-`, `text-start`), directional icons mirror in RTL, and numbers and
prices are isolated so they stay left-to-right inside Arabic text.

**Editing content.** Change a product, price, seller or string in `data/` and
all four concepts update together.

---

## Quality checks

```bash
npm run lint
npm run build && npm start &
node scripts/verify.mjs --base http://localhost:3100 --interactions
```

`scripts/verify.mjs` opens every concept screen in English and Arabic at 1440,
1024, 768 and 390 px and reports console errors, failed requests, broken
images, horizontal overflow, serious/critical accessibility violations (axe)
and whether the mobile menu opens. Options: `--concepts a,b`, `--pages
home,browse,…`, `--langs en,ar`, `--widths 1440,390`, `--shots` (full-page
screenshots in `.verify/shots/`), `--no-axe`.

To refresh the selector's preview images after design changes (run against a
production server so no development overlay is captured):

```bash
node scripts/capture-concepts.mjs --base http://localhost:3100
```

---

## Credits

- Product photography: **Amazon Berkeley Objects (ABO) dataset**, © Amazon.com,
  licensed under **CC BY 4.0**
  (<https://amazon-berkeley-objects.s3.amazonaws.com/index.html>). Images were
  resized, cropped, re-encoded and background-processed
  (`scripts/process-images.py`).
- Warehouse photography, logo and the Riyal webfont: Khazna's own brand assets.
- Typefaces via Google Fonts (SIL Open Font License): Archivo, Alexandria,
  Instrument Serif, Instrument Sans, Markazi Text, IBM Plex Sans Arabic,
  Figtree, Almarai, Geist, Geist Mono, Readex Pro.
- Icons: Lucide (ISC licence).
