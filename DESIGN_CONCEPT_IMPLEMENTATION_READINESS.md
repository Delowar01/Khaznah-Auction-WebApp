# Design concept implementation readiness

**Phase 1 — for client review.** This document describes the four design
directions built in `design-preview/` and what each would mean for the real
Khazna customer website if it were approved. The concepts are listed A to D in
the order they were briefed. **They are not ranked and no concept is
recommended** — the choice is the client's.

> Acceptance baseline for any concept: **visual redesign only. Existing
> functional behaviour is the acceptance baseline unless a functional change is
> separately approved.**

For each concept: **A. Summary · B. Strengths · C. Considerations · D. Existing
production areas affected later · E. Existing logic that should be retained.**
Production paths are relative to the reference package root
(`frontend/src/…`, `backend-reference/…`). The detailed per-route plan is in
[`CUSTOMER_REDESIGN_FILE_MAP.md`](CUSTOMER_REDESIGN_FILE_MAP.md); the
feature baseline is in
[`CURRENT_CUSTOMER_FRONTEND_INVENTORY.md`](CURRENT_CUSTOMER_FRONTEND_INVENTORY.md).

---

## Common ground — true for every concept

### What the four concepts share

- The same six customer screens (Home, Browse, Buy Now detail, Auction detail,
  Live auction, Seller storefront) plus a components-and-states board, in
  English and Arabic, light and dark, desktop to mobile.
- The same sample content (`design-preview/data/`), whose field names follow the
  production card adapters and serializers.
- The same behaviour layer (`design-preview/lib/`), modelled on production:
  browse filters kept in the URL, the timed-auction rules (minimum next bid,
  increments, proxy bids, 5-minute anti-sniping, deposit coverage, bidder
  states, Buy Now on "both" lots) and the live-event item lifecycle. Where these
  simplified models differ from production (parameter names, first-bid minimum,
  bidder-state names, urgency thresholds, live sequencing), the file map lists
  each difference in section G. Only the visual layer
  (`components/concept-x/`, `styles/concept-x.css`) differs between concepts.

### Work any approved concept needs first

1. **Separate behaviour from markup in the large pages** before reskinning
   (auction detail ≈3k lines, homepage ≈3k, browse ≈2.4k, live viewer ≈1k,
   navbar ≈1.1k). Extract hooks and services with no visual change, verify, then
   replace the markup. Details per file are in the file map.
2. **Introduce a semantic token layer.** The customer site has no theme tokens
   today (one inline CSS variable), and no customer-facing dark mode. Every
   concept relies on semantic colour, radius, shadow and font tokens with light
   and dark values, exactly as in `design-preview/app/globals.css` +
   `styles/concept-x.css`.
3. **Adopt the shared primitives** (money with the Riyal sign, modal/sheet,
   drawer, listbox, price range, shared countdown clock, skeletons, toasts,
   gallery hook) so all screens stop re-implementing them.
4. **Load the concept's typefaces** with `next/font` and keep the Riyal webfont
   first in every font stack.
5. **Imagery rules.** The preview uses consistently processed packshots.
   Production shows seller uploads with mixed backgrounds, so every concept needs
   a fallback treatment (cover-crop scenes; plates only for white-background
   packshots). Cut-outs used in heroes and category tiles need either a
   cut-out step in the media pipeline or a plate-based fallback.

### Data the designs rely on — availability in production today

| Shown in the concepts | Production source | Status |
|---|---|---|
| Current bid, minimum next bid, increment, bid count, bidder count, end time, status | sale-lot serializer + `auction_state` WebSocket frames | Available |
| Watchers | `watch_count` (not updated by WebSocket frames) | Available (refresh on load/poll) |
| Market price comparison | `average_market_price` when `show_market_comparison` | Available, only when enabled per lot |
| Bid history (bidder label, amount, time, auto/proxy) | `GET marketplace/sale-lots/<pk>/bids/` (`bid_type` includes `proxy_auto`) | Available while the lot is public |
| Deposit covered by wallet, wallet balance | `requires_deposit`, `deposit_amount`, `paymentsApi.getMyWallet()` | Available (signed-in) |
| Pallet manifest lines (name, qty, grade, image) | `stock_item.pallet_contents[]` (≤200, pallets only) | Available |
| Seller city, member since, active auctions, Buy Now count, live now | seller lookup endpoint | Available — returned today but not displayed |
| "Hot" / trending lots | homepage `hot` section with `recent_bid_count` | Available on the homepage feed only |
| Live event: viewers, current item, deadline, recent bids (≤20), statuses | public event REST + `live_event_state` WebSocket | Available |
| Related / similar lots on detail pages | existing list endpoint filtered by category | Frontend-only addition (not shown today) |
| Sold / ended state of a timed auction | lot returns 404 after `end_time`; no close frame on the socket | Only visible while the page is open at close, in live events, and in the account area — keep as designed transient states unless a backend change is approved |
| Ratings, reviews, follow, reserve price | — | Not in the backend — deliberately not designed |

### Logic that stays untouched in every case

- API client, query keys and adapters (`lib/api.js`, `lib/queryKeys.js`,
  `lib/marketplaceAdapters.js`, `lib/gradeInfo.js`, `lib/currency.js`).
- Authentication and session: in-memory access token, HttpOnly refresh cookie,
  CSRF, cross-tab sync, protected-route behaviour.
- WebSockets: URL building, one-time tickets for signed-in users, reconnect with
  backoff, stale-frame guards (`bid_version`, `state_version`), REST snapshot on
  reconnect, and the existing polling fallbacks.
- Bidding: eligibility and deposit checks, bid submission and error mapping,
  confirmation step, proxy (maximum) bids, Buy Now on "both" lots, anti-sniping
  extensions taken from the server's `end_time`.
- Cart and checkout: server cart with guest merge and optimistic updates,
  full-stock / pallet quantity locks, delivery quotes, pickup, coupons, wallet,
  Moyasar and saved cards.
- Watchlist, notifications and push; country scoping; bilingual `t(en, ar)`
  content and RTL; SEO metadata and redirects (slug canonicalisation).

### Out of scope in this phase

Cart, checkout, payment result, account, login/registration and static content
pages were not redesigned; after approval they need a styling pass with the same
tokens (no behaviour change). Admin, seller/warehouse dashboards, finance,
reports, RBAC, billing and settings are excluded entirely.

---

## Concept A — Premium Marketplace

### A. Summary

A modern auction house. Warm ivory "paper", ink navy, Khazna indigo and an
antique-brass accent; an editorial serif for display (Instrument Serif, with
Markazi Text for Arabic) and a precise grotesque for data (Instrument Sans /
IBM Plex Sans Arabic). Packshots sit on warm stone plates like objects in a
catalogue, each lot is introduced like a catalogue entry ("About this lot",
numbered highlights, a condition report, a two-column specification table), and
motion is slow and precise. The live room is a dark "stage". Dark mode keeps the
plates light, like a gallery at night.

Screens: a centred-logo header with a live-now utility line, full-screen search
overlay, bag and watchlist drawers; an editorial home (featured-lot placard,
numbers band, closing soon, departments, live room band, ready-to-own, grade
explainer, pallets, sellers, how it works); browse with a sidebar of filters,
tabs and department chips, grid/list and progressive loading; detail pages with
a sticky gallery and a single purchase/bid column; a seller masthead with the
warehouse cover.

### B. Strengths

- **Perceived value and trust.** Graded returns and surplus are presented with
  the care of high-value inventory; condition, grade and seller credentials are
  given as much space as price.
- **A calm, legible bidding panel.** One column: current bid, countdown blocks
  with the absolute closing time, bidder state, quick bids, a custom amount with
  increment stepper and inline validation, a proxy-bid disclosure, deposit and
  anti-sniping explained in plain language, and the Buy Now box on "both" lots.
- **Strong Arabic typography.** Markazi Text gives Arabic headlines the same
  editorial voice as the English serif; labels switch from tracked capitals to
  bold Arabic rather than being mirrored.
- **Small component vocabulary.** A few card types, one button family and one
  status label cover every state, which keeps an implementation compact.

### C. Considerations

- **Density.** The lowest of the four (three columns on desktop browse, generous
  spacing). Buyers scanning hundreds of lots may want the list view by default,
  or four columns on very wide screens.
- **Photography dependence.** The plate treatment (multiply blend) assumes
  white-background packshots. Seller photos with busy backgrounds need the cover
  fallback, and the home hero's featured-lot cut-out needs a cut-out step or a
  plate fallback.
- **Typefaces beyond the brand pair.** The display serifs are an addition to the
  brand's Archivo and Alexandria; they need brand sign-off. Instrument Serif has a
  single weight (regular + italic).
- **Progressive loading.** Browse uses "load more" with a progress line; this
  maps directly onto production's paged list endpoint (`page`, `page_size=20`)
  with an infinite query.
- **New surfaces.** The bag drawer is a new mini-cart view over the existing cart
  provider; the search overlay replaces the navbar search box (same search
  parameter).

### D. Existing production areas affected later

- Global chrome: navbar (utility line, centred logo, search overlay, account
  menu, bag/watchlist drawers), mobile menu, footer.
- Homepage sections and their data hooks (hero, featured, ending soon, hot,
  Buy Now, live events).
- Browse page (filter sidebar, tabs, category chips, results, load more, mobile
  filter drawer).
- Auction detail (gallery, bid column, confirm modal, max-bid panel, Buy Now
  box, market comparison, bid history, pallet contents, terms).
- Buy Now / shop detail (gallery with lightbox, purchase column, quantity and
  full-lot lock, services, specifications, related items).
- Live viewer (stage, lot console with one-tap bids, order of sale, activity
  feed, upcoming events) and live cards on the homepage.
- Seller storefront (masthead, facts from the seller endpoint, inventory tabs,
  search, sort).
- Shared cards (auction, Buy Now, list row, category, seller), grade guide modal,
  wallet deposit modal styling, toasts.

### E. Existing logic that should be retained

Everything in *Logic that stays untouched in every case*, and in particular for
this concept: the auction-detail bidding flow feeding the new bid column and
confirm modal; proxy-bid save/remove; Buy Now on "both" lots; the wallet-deposit
prompt when a bid fails for deposit reasons; paged bid history (shown six at a
time with "show all"); the live viewer's WebSocket state and per-item deadline;
cart provider actions behind "Add to bag" and "Buy it now"; the browse URL
parameters behind every filter chip.

---

## Concept B — Modern Commerce

### A. Summary

A fast, bright, content-rich marketplace built for discovery and conversion —
serious commerce rather than a brochure, with Khazna's own identity (and none of
the orange/yellow or multicolour conventions of the big regional marketplaces).
Cool grey canvas, white surfaces, brand indigo for every action, ink for the
utility strip and footer, and brand gold used only as a fill for value badges.
Figtree for Latin and Almarai for Arabic on a compact scale, tabular figures for
prices and timers, 12 px cards and pill chips. The highest density of the four.

Screens: a three-tier desktop header (ink utility strip with "Deliver to" and a
trust line; a main bar with a dominant, category-scoped search and live
autocomplete, account menu, watchlist and mini-cart; a category bar with a mega
menu); a home page with a promo carousel and side promo tiles, trust strip,
category tiles, an ending-soon rail, a live band, a Buy Now deals grid, pallet
feature cards, a seller shelf and a how-it-works + grade table; browse with quick
chips, a sticky facet sidebar and numbered pagination; three-column product and
auction pages with sticky buy/bid boxes; and on phones, a search bar that hides
on scroll and a fixed five-tab bottom bar.

### B. Strengths

- **Findability.** Search is the dominant element on every page, with scoped
  categories and suggestions; visible facets with counts make a large mixed
  inventory easy to narrow down.
- **Conversion-oriented detail pages.** The sticky buy box and bid box keep price,
  stock or countdown and the primary action in view at all times; the
  information column holds grade, highlights, specifications and seller.
- **Density without clutter.** Four to five cards per row on desktop, compact
  but readable cards that show seller, grade, source, bids and urgency.
- **Familiar mobile patterns.** Bottom tab bar, sticky filter/sort bar, bottom
  sheets and sticky action bars match what mobile shoppers expect.
- **Closest to the current information architecture**, so the move from today's
  site is the least disruptive for existing buyers.

### C. Considerations

- **"Deliver to" city picker.** Production scopes by country, not city; the
  picker would either map onto the existing country switcher or show the buyer's
  saved address city — it must not imply city-level filtering that the backend
  does not do.
- **Autocomplete load.** Suggestions can use the existing anonymous list endpoint
  with `search` (10 s server cache, anonymous throttle); requests must be
  debounced and cancelled.
- **Mega menu and category data** come from the existing categories endpoint; the
  quick links inside it should use production's supported filters only.
- **Numbered pagination vs infinite scroll.** Production browse mixes both; the
  concept assumes numbered pages (a functional decision to confirm).
- **The mini-cart drawer** is a new view over the existing cart provider (no new
  behaviour), and the header grows to three tiers — sticky offsets are
  centralised in one CSS variable in the preview and should stay so.
- **Status colours were deepened** from the brief's values to pass WCAG AA as
  small text; brand sign-off on those tints is needed.

### D. Existing production areas affected later

- Global chrome: navbar (utility strip, search with suggestions, account menu,
  watchlist count, mini-cart, category bar with mega menu), mobile header with
  collapsing search, a new mobile bottom tab bar, footer and newsletter band.
- Homepage: carousel and promo tiles in place of today's hero, trust strip,
  category tiles, ending-soon rail, live band, deals grid, bulk section, seller
  shelf, how-it-works with the grade table.
- Browse: quick filters, facet sidebar, active chips, sort and view controls,
  numbered pagination, mobile filter and sort sheets.
- Auction and Buy Now detail pages (shared three-column layout, gallery with
  lightbox, buy box, bid box with dialogs, max-bid panel, bid history paging,
  manifest table, fulfilment rows, tabs), live viewer (stage, current-lot strip,
  bid panel, activity, lots table), seller storefront, shared cards and list
  rows, grade guide.

### E. Existing logic that should be retained

Everything in *Logic that stays untouched in every case*, and in particular: the
browse URL contract behind quick chips, facets and pagination (production's
`page`/`page_size` paging); the search parameter behind the autocomplete; cart
provider actions behind "Add to cart", the mini-cart and the mobile buy bar;
the bidding, confirm, proxy and Buy Now flows behind the bid box; the paged bid
history endpoint; wallet balance and deposit checks; the live event socket.

---

## Concept C — Saudi Contemporary

### A. Summary

A confident, Arabic-first identity with the calm, architectural restraint of
contemporary Riyadh design — local character without stereotypes (no geometric
patterns, arches, lanterns, calligraphy flourishes or gold-everywhere luxury).
It was designed right-to-left first and mirrored into English. The locality comes
from the brand itself: the diamond from the خ mark (bullets, active navigation,
live indicators, timelines), the diagonal of its stroke (chamfered corners on
frames and cards, thin gold diagonal rules) and the square-Kufic grid of the
wordmark (hairline architectural grids). Warm limestone and sand neutrals, night
indigo text, brand indigo for action and saffron gold as a sparing accent. The
brand typefaces carry it: Alexandria for Arabic and Archivo (with its width axis
for expanded display) for Latin. Key headings are bilingual — the primary
language large, the other small beneath.

Screens: a utility line with today's Hijri and Gregorian dates; a centred
navigation with a diamond active indicator and a search field that opens a
full-width search panel; a home
page with an asymmetric hero (warehouse photograph in a chamfered frame with a
floating live card), an "Across the Kingdom" typographic city index of sellers,
a bento category grid, ending-soon cards with saffron time bars, a live band with
a diamond lot timeline, the grade scale, the brand's K-H-A-Z-N-A-H values and
the trust/how-it-works section; browse with a horizontal filter rail; detail
pages with architectural specification tables; a live room with a vertical
diamond timeline; and a storefront with a diamond monogram.

### B. Strengths

- **The strongest brand expression.** It uses the 2026 brand system directly —
  typefaces, colours, the mark's geometry and the values — so the site and the
  brand read as one.
- **Arabic typography of the highest standard.** Alexandria in Arabic sets the
  hierarchy; English is a considered mirror rather than the source.
- **Distinctly Saudi without clichés**: city index, Hijri dates, bilingual
  compositions and architectural rhythm give local relevance that feels current.
- **Calm, trustworthy commerce**: generous but efficient layouts, clear grade
  scale, and strong seller/place signals (city, warehouse) that support trust.

### C. Considerations

- **Bilingual headings need copy in both languages.** Product titles and
  descriptions in production are single-language with optional Arabic fields; the
  bilingual treatment should be limited to fixed interface headings and degrade
  gracefully when a lot has no Arabic title.
- **Hijri date formatting** uses the browser's Umm al-Qura calendar support; it
  should render only on the client (as in the preview) to avoid hydration
  mismatches.
- **"Across the Kingdom" needs seller cities and counts.** The seller endpoint
  returns city and counts per seller, but there is no public seller-list
  endpoint; the city index needs a curated list of seller codes or an approved
  endpoint.
- **Chamfered corners use `clip-path`** computed per direction; focus rings and
  shadows on clipped elements need care (the preview draws them inside the
  shape).
- **Archivo's width axis and Alexandria's heavier weights** add font weight
  budget; subsetting and `font-display: swap` are required.
- **The KHAZNAH values section** is brand storytelling content that needs owner
  approval of the final wording.

### D. Existing production areas affected later

- Global chrome: utility line with dates, navbar with diamond indicators and the
  search panel, mobile drawer menu, night-indigo footer with the stacked logo.
- Homepage: hero, city index (new), bento categories, ending-soon band, live band
  with timeline, Buy Now grid, grade scale, brand values (new), trust and how it
  works.
- Browse: bilingual page head and category band, horizontal filter rail with
  anchored panels, sort, active chips, load more with progress, mobile filter
  drawer.
- Auction and Buy Now detail pages (chamfered gallery, definition-table specs,
  bid panel with labelled countdown blocks, manifest grid, similar items), live
  viewer (stream frame, current lot, bid panel, feed, diamond timeline), seller
  storefront (wide chamfered cover, diamond monogram), shared cards, grade guide.

### E. Existing logic that should be retained

Everything in *Logic that stays untouched in every case*, and in particular: the
existing language preference and RTL handling (this concept depends on them
most), the browse URL contract behind the filter rail, bidding and proxy flows
behind the bid panel, the live event socket behind the timeline and feed, the
seller endpoint for city and counts, and cart/watch actions on cards.

---

## Concept D — Digital / Auction Marketplace

### A. Summary

A real-time auction platform with the calm finish of a premium technology
product. Dark-first (a polished light variant is included): deep navy layered
surfaces with hairline tinted borders, Khazna indigo for action and gold reserved
for "your bid", "winning" and the key call to action. Geist for the interface
with Geist Mono for every number (prices, clocks, lot numbers, counts), and
Readex Pro for Arabic. Every auction surface shows its state as data: countdown
rings, time bars, bid step charts drawn from the bid history, "bids in the last
10 minutes" velocity, heat indicators, delta chips and a live activity feed.
Crypto, gaming and neon aesthetics are deliberately avoided.

Screens: a sticky glass app bar with a command-palette search (⌘K / Ctrl K), a
live pill, wallet chip, cart drawer and avatar menu, a section tab row and a
live bid ticker; a home "live board" (featured-lot terminal, closing-soon board,
live events, trending, categories, instant buy, pallets with manifest bars,
warehouses table, platform metrics); browse with grid and board (table) views;
an auction "bid terminal"; a three-column live floor (lot queue · stage ·
console); a seller profile with stat cards; and a mobile bottom dock with a
raised Live button.

### B. Strengths

- **Built for active bidders.** Price, time and competition are readable at a
  glance, and the board view lets frequent buyers scan closing lots like a
  watch list.
- **The strongest live experience.** The live floor keeps the queue, the stream,
  the current lot, one-tap bids and the feed on one screen, which suits
  presenter-led sales.
- **Clear bidder feedback.** Winning and outbid states, price flashes and the
  step chart make the auction's momentum visible without extra copy.
- **Command-palette search** gives fast, keyboard-first access to lots,
  categories and sellers.

### C. Considerations

- **Data-heavy components.** Step charts, sparklines, velocity and heat need bid
  history for many lots at once. Per-lot history exists
  (`GET marketplace/sale-lots/<pk>/bids/`), but fetching it for every card is
  expensive; cards should use cheap signals (`bid_count`, `recent_bid_count` from
  the homepage feed) and keep full charts for the detail page.
- **The cross-lot live ticker has no aggregate feed.** Production's sockets are
  per lot (`/ws/auctions/<id>/`) and per live event. The ticker can be fed from
  the homepage sections and the sockets of lots already on screen; a site-wide
  bid feed would be a backend change needing approval.
- **Dark-first means a full dark palette** for every customer surface, including
  cart, checkout and account, which are not designed in this phase. Product
  photos stay on light plates in both themes.
- **Sticky terminal on shorter screens.** The bid terminal is taller than many
  laptop viewports; it is sticky only on tall screens and scrolls normally
  elsewhere.
- **Motion budget.** Tickers, rings and flashes must respect reduced-motion
  (already done in the preview: the ticker becomes a static list) and be
  throttled so frequent socket frames do not cause constant re-rendering.
- **Monospaced numerals** are new to the brand typography and need sign-off; the
  Riyal glyph comes from the bundled Riyal font as elsewhere.

### D. Existing production areas affected later

- Global chrome: navbar (app bar, command palette, live pill, wallet chip,
  account menu, cart drawer), a new section tab row and ticker, mobile bottom
  dock, footer.
- Homepage: every section, including a new closing-soon board and warehouses
  table (seller data from the seller endpoint).
- Browse: header, grid and board views, filter panel and mobile filter drawer,
  pagination.
- Auction detail: the bid terminal (clock ring, price block, bidder banner, bid
  ladder, custom amount, confirm modal, max-bid control, Buy Now option, deposit
  and anti-snipe notes, market meter), tabs for history / details / manifest /
  seller, and the mobile bid sheet.
- Buy Now detail, live viewer (queue, stage, console, feed, mobile tabs), seller
  storefront, shared cards and the board row, grade guide and wallet deposit
  modal styling, toasts.

### E. Existing logic that should be retained

Everything in *Logic that stays untouched in every case*, and in particular: the
auction WebSocket state and polling as the single source for the terminal's
price, clock and bidder state (charts derive from the same history the page
already loads); bid, confirm and proxy flows; the live event socket for the
queue, console and feed; the existing search parameter behind the command
palette; the cart provider behind the cart drawer; wallet balance from the
existing wallet endpoint.

---

## Side-by-side reference (not a ranking)

| | A — Premium Marketplace | B — Modern Commerce | C — Saudi Contemporary | D — Digital / Auction Marketplace |
|---|---|---|---|---|
| Default appearance | Light (dark available) | Light (dark available) | Light (dark available) | Dark (light available) |
| Density | Low | High | Medium | Medium–high |
| Typefaces | Instrument Serif + Instrument Sans; Markazi Text + IBM Plex Sans Arabic | Figtree; Almarai | Archivo (brand); Alexandria (brand) | Geist + Geist Mono; Readex Pro |
| Header model | Utility line, centred logo, search overlay | Three tiers: utility strip, dominant search, category bar + mega menu | Utility line with dates, centred navigation, search panel | App bar with command palette, tab row, live ticker |
| Mobile navigation | Menu drawer + sticky detail bars | Bottom tab bar + collapsing search | Menu drawer + sticky detail bars | Bottom dock with raised Live button |
| Browse paging | Load more | Numbered pages | Load more with progress | Load more (grid and board views) |
| Signature auction element | Catalogue placard and countdown blocks | Sticky bid box | Labelled countdown blocks with diamond status | Countdown ring, step chart, bid ladder |
| New surfaces vs today | Search overlay, bag drawer | Autocomplete, mega menu, mini-cart, tab bar | Search panel, city index, brand values section | Command palette, ticker, board view, cart drawer, dock |

The client chooses; any of the four can be implemented on the current
architecture with the preparation described in *Common ground*.
