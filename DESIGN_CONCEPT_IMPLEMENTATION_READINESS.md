# Design concept implementation readiness

**Phase 1, updated in Phase 1B, revised for Round 2 — for client review.** This document describes the four design
directions built in `design-preview/` and what each would mean for the real
Khazna customer website if it were approved. The sections below are organised by
internal route slot (**Concept A–D = slots `concept-a`…`concept-d`**); the
client-facing labels are **Options 1–4**. After the first review the client kept
one direction and asked for three new alternatives in the same commercial
family; see *Round 2* below for what changed and the current slot-to-option
mapping. **They are not ranked and no concept is recommended** — the choice is
the client's.

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

## Phase 1B — client preview release

Phase 1B prepared the four concepts for presentation to the client. It started
from the Phase 1 checkpoint `bd8b19e`. The visual directions were **not**
redesigned; changes were limited to misleading or unsupported copy,
presentation quality, accessibility, responsiveness and consistency.

### What changed in the preview

- **Concept selector:** plain-language descriptions of the four options (no
  ranking, no recommendation), a subtle "About this preview" note stating that
  products, sellers, prices, figures, auction activity and interactions are
  sample data, a four-step "How to review" guide (open an option, move between
  screens, switch language and appearance, check desktop and mobile) and a note
  explaining the presentation bar. The typeface list was removed as too
  technical.
- **Presentation bar:** a "Concept preview" caption next to the concept name, a
  hide button at every screen size (previously hidden on phones), a "Hide
  presentation controls" item in the concept menu, and a small side tab to bring
  the bar back (the "." key still toggles it). The bar is visually separate
  from the designs (dark strip, stronger bottom rule) and never overlaps page
  content: every concept is offset by the bar's height. Arabic labels were added
  for the device and language groups.
- **Device preview:** a "Concepts" link back to the selector and translated
  labels.
- **Claims audit:** see below. Every change is a copy or label change inside
  the existing designs, plus one flow change: Concept B's sign-in dialog now
  uses email and password, as production does.
- **Fixes:** Concept D's components board no longer overflows on 360 px
  phones; `robots.txt` blocks indexing of the temporary preview.

### Claims audit

Every visible sentence, badge, payment label and trust or functional promise in
the four concepts and the shared sample data was checked against the reference
source. Unsupported statements were reworded neutrally, or kept only as concept
ideas (next subsection).

| Topic | In the Phase 1 preview | Production evidence | Phase 1B result |
|---|---|---|---|
| ZATCA, Maroof | Not shown | The production contact, terms and privacy pages show both as badges; the reference source holds no registration data to verify them | Not added to any concept. Production's own badges need LEGAL confirmation |
| Seller verification and trust badges | "Verified warehouse" badges with check marks; "every seller is verified"; "warehouse address and licence verified"; "Verified Saudi warehouses" | No verified flag on warehouses or the public seller payload. Listing approval exists, but warehouses can be set to auto-approve | Neutral "Seller warehouse" label, check marks removed, section titles reworded (file map G row 2) |
| Account verification | "Verified buyer" / "Verified account"; Concept B signed in with a mobile number and a one-time code | Email and password with an email one-time code; the phone is never verified | "Buyer account"; B signs in with email and password (G row 20) |
| Guarantees, inspection, buyer protection | "The grade is the guarantee", "reviewed by Khazna", "every unit tested / inspected", "Inspected & graded by Khazna", "Buyer protection" | Condition grades exist; there is no inspection record or guarantee | "Condition grade disclosed" and neutral grade copy; "Buyer protection" became "Delivery, pickup and returns" |
| Refunds and returns | "Report an issue within 3 days", "raise it within three days" | Return window per warehouse, 3 days by default (`return_window_days_for_warehouse`) | "…request a return within the seller's return window" |
| Payment methods | mada, Visa, Mastercard and wallet; STC Pay in Concepts C and D | Moyasar card payments, default networks mada, Visa and Mastercard; wallet enabled; STC Pay and Apple Pay not in the default configuration | STC Pay removed; mada, Visa, Mastercard and wallet kept (G row 21, LEGAL review) |
| Deposits | "held while you bid and released if you don't win", "never charged unless you win", wallet "Held for bidding / Available" | Bidding is allowed when the wallet balance covers the deposit or a lot deposit was paid; nothing is held. Default SAR 50, configurable, can be switched off | "Your wallet needs to cover a refundable deposit"; wallet panel shows "Bidding deposit · Ready to bid"; sample deposit set to SAR 50 (the code default) |
| Auction reminders | "Remind me — we'll remind you when bidding opens" on upcoming timed lots and live events | No start or closing-soon reminders; watching a lot triggers "Auction activity" notifications on bids | Timed lots: **Watch** (the watchlist). Live events: "Remind me" kept as a concept idea (G row 29) |
| Automated notifications | "Outbid and closing-soon alerts … by SMS", "we'll alert you the moment someone bids higher", "we'll tell you when it's back", closing-soon alerts in a form hint | In-app notifications (plus optional web push) for outbid, highest bidder, watched-lot activity, auction won and payment missed. No SMS sender, no closing-soon or back-in-stock alerts | "You'll get a notification if someone outbids you"; SMS, closing-soon and back-in-stock promises removed; sold-out items link to similar items |
| Auction completion | "Complete payment within 24 hours" after Buy Now; the 24-hour line in the live room; "Reserved for checkout" | The 24-hour window applies to timed-auction wins only; Buy Now is paid at checkout; live wins have no deadline; a cart does not reserve stock | Buy Now: "choose delivery or pickup at checkout"; live room: "Bids are binding once placed"; "Added to your cart" (G rows 21, 28) |
| Live automatic progression | "One lot every 45 seconds", "Next lot in 5 s" | The operator starts each lot | Timing claims removed; "Waiting for the next lot" (production's own wording). The demo still advances by itself (G row 11) |
| Shipping and delivery | "Delivery across the Kingdom", "Kingdom-wide delivery", "same-week delivery", "ships or collects today", "freight delivery", "ready within 24 hours of payment", city-based delivery estimates | Delivery is priced for the address at checkout; pickup where offered | "Delivery is priced for your address at checkout"; "Pickup or delivery" |
| Other legal or marketing wording | "Market open", "The numbers behind every safe deal", "Every storefront is an inspected, verified Saudi warehouse", "most watched on Khazna" | No market hours; figures are hard-coded on the current About page | Reworded; the stats band is labelled as About-page figures (G row 18). The brand tagline and K-H-A-Z-N-A-H values are kept as the client's own brand content, flagged for LEGAL review (G row 31) |
| Khazna Direct sample content | "Processed at our Riyadh fulfilment centre … every unit tested"; a specific logistics-park pickup address | Not in production data | Neutral description; pickup shown as "Riyadh · Sun–Thu 9:00–18:00", matching the hours on the current contact page |

The remaining sample sellers (Rawabi, Red Sea Trading, Dar Al Majd, Sahel) are
fictional and described without service promises.

### Concept ideas shown for demonstration only

These appear in one or more concepts to show a design idea. **None of them
exists in production today**, and approving a concept does not approve them.
Each needs the decision or work named in `CUSTOMER_REDESIGN_FILE_MAP.md`,
section G.

| Concept idea | Where | Needs | G row |
|---|---|---|---|
| Live-event reminders ("Remind me") | A, B, C, D | Backend notifications and a channel decision | 29 (API) |
| Newsletter / closing-soon email round-up | A, B, C, D | Business decision and an email backend | 18 (B) |
| Stats band (current About-page figures) | A, B, C, D | A real data source, or approval of fixed figures | 18 (B) |
| Seller storefront content: tagline, description, cover, pickup address and hours | A, B, C, D | New fields or a curated content map | 2 (API) |
| Seller directory; "Across the Kingdom" city index | A–D; C | A seller-list endpoint or curated list | 3 (API) |
| Live schedule with start times and presenter | A, B, C, D | New event fields | 12 (API) |
| Sold results and sold-out product pages | A, B, C, D | Decision to show outcomes publicly | 5 (B) |
| "Deliver to" city picker | A, B, C, D | Must not imply city-level filtering | 19 (F) |
| Mini-cart, live search suggestions, lightbox, quick bids | A, B, C, D | Client confirmation of each addition | 26 (B) |
| "Live bids" ticker (home) | D | Aggregate bid-activity endpoint | 30 (API) |
| Dark appearance | A, B, C, D | New scope for the customer site | 23 (B) |
| Automatic advance between live lots | A, B, C, D (demo only) | Nothing — production stays operator-driven | 11 (P) |

### Comparability of the four options

- **Same content everywhere.** All four concepts read the same sample files
  (`design-preview/data/`):
  - 29 lots: 18 Buy Now, 10 timed auctions and 1 auction with Buy Now;
  - 8 categories, 5 sellers, 1 live event with 10 lots and 2 upcoming events;
  - the same site-wide copy (hero, trust points, how it works, navigation,
    footer, stats).
- **Same screens.** The Product, Auction, Seller and Live screens open the same
  featured lot, auction, storefront and event in every concept. Browse lists
  the same catalogue with the same filters.
- **Deliberate differences, all design-driven:**
  - **Home page composition.** All four home pages draw on the same shared
    sections (a promo carousel and side promo tiles, a trust strip, category
    tiles, an auctions rail, the live band, a Buy Now deals grid, the two pallet
    feature cards, a seller shelf and how-it-works with the grade scale). Concept
    D reorders them so auctions lead the floor (the auctions rail first) and adds
    a "Live bids" ticker under the hero; Premium Commerce (A) uses more generous
    spacing. Every item comes from the shared catalogue.
  - **Section titles and helper lines.** These are written in each concept's
    own voice (`components/concept-x/copy.js`). Factual statements about
    deposits, delivery, returns, payments and notifications were aligned in
    Phase 1B, so all four say the same thing.
  - **Concept-specific treatments:**
    - **A (Premium Commerce)** sets display headings and prices in a serif
      (Fraunces) and rests packshots on warm plates.
    - **C (Saudi Modern Commerce)** sets fixed interface headings bilingually —
      the current language leads and the other sits beneath in a small muted line
      — and adds an "Across the Kingdom" warehouse-cities treatment on the seller
      shelf.
    - **D (Auction-Forward Commerce)** leads its auction cards with a full-width
      mono countdown that warms with urgency, shows a large segmented countdown
      clock on detail pages, and runs a "Live bids" ticker on the home page.
    - The "Deliver to" delivery-city picker, the dominant search with suggestions
      and the mobile bottom tab bar are shared by all four — they are part of the
      retained Modern Commerce chrome.
    - **All four default to light appearance and offer both light and dark.**
  - **Why they remain:** these differences express each direction's finish,
    hierarchy and emphasis. They do not change the inventory, so the client
    compares design, not products.

---

## Round 2 — retained one direction, replaced three

The first set of four directions was reviewed with the client. One direction —
**Modern Commerce** — was kept; the other three were replaced with new
alternatives in the **same commercial family**, so all four options now read as
serious, realistic Khazna marketplaces built on one shared platform rather than
four different genres.

- **Option 1 — Modern Commerce** (slot `concept-b`): retained from the first
  round, unchanged.
- **Option 2 — Premium Commerce** (slot `concept-a`): new — a refined, elevated
  evolution of Modern Commerce (serif display, more generous space, softer
  premium surfaces).
- **Option 3 — Saudi Modern Commerce** (slot `concept-c`): new — an Arabic-first,
  locally relevant take, modern rather than traditional or decorative.
- **Option 4 — Auction-Forward Commerce** (slot `concept-d`): new — auction-led,
  with countdown and urgency emphasis and richer live / ending-soon / sold /
  upcoming states.

The retired first-round directions (the earlier Premium Marketplace, Saudi
Contemporary and Digital / Auction Marketplace) remain in git history at tag
`round1-concepts`. The **route-slot letters were reused** — slots `concept-a`,
`concept-c` and `concept-d` were redesigned in place — so no routing, links or
preview tooling changed; only the client-facing labels and the visual layer did.
These three slots were **fully redesigned** (new visual language, layout,
typography, palette and components, all on the same shared behaviour layer), not
merely recoloured. Because all four now build on Modern Commerce's information
architecture, they share the same chrome, home-page section set, browse kit and
detail/live/seller kits; the differences are in finish, hierarchy and emphasis
(see *Comparability of the four options* above).

The per-concept sections below keep their internal slot letters (A–D) and now
carry each slot's Round-2 name and Option number. The production-mapping in
*D. Existing production areas affected later* and *E. Existing logic that should
be retained* is unchanged by the redesign — it describes the shared behaviour
layer and production endpoints, which every option maps onto the same way.

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

## Concept A — Premium Commerce (Option 2)

### A. Summary

A refined, boutique department-store evolution of Modern Commerce. It keeps the
same marketplace machinery — a prominent search, visible filters and dense,
organised browsing — but lifts the finish: a warm paper background, cream card
surfaces and warm-sand wells, espresso ink, a deep-indigo primary for actions
and a brass/gold accent. Display headings are set in an elegant serif (Fraunces),
the UI and body run in a humanist sans (Manrope) and Readex Pro carries Arabic;
prices borrow the serif for an editorial feel. Its product cards are the
concept's own signature rather than Modern Commerce's cards restyled: instead of
an edge-to-edge thumbnail over a tight text stack, each packshot sits matted in a
hairline-ruled frame, the price leads as a focal serif figure under a small brass
label, a quiet hairline-ruled footer carries seller and grade, and auction cards
read time as a tracked figure over a thin phase-coloured baseline rule (in place
of a filled pill). Surfaces use larger radii (16 px cards) and soft, diffuse warm
shadows, packshots rest on warm plates (multiply blend), and spacing is more
generous than Modern Commerce. Light by default, with a warm-charcoal dark theme;
the plates stay warm-light in dark so packshots keep reading.

Screens: the shared Modern Commerce chrome (an ink utility strip with the
delivery-city picker and a trust ticker; a sticky header with a dominant,
category-scoped search and live suggestions, an account menu, a mini-cart and a
watchlist drawer; a category bar with a mega menu; a mobile bottom tab bar),
rendered in the premium palette with larger, calmer cards; a home page of a promo
carousel and side promo tiles, a trust strip, category tiles, an auctions rail, a
live band, a Buy Now deals grid, the pallet feature, a seller shelf and
how-it-works with the grade scale; browse with a facet sidebar, quick chips,
grid/list and numbered pagination; product and auction pages with a sticky
buy/bid box in a side column (from tablet up); a seller storefront with a
warehouse cover.

### B. Strengths

- **Perceived value and trust.** The elevated finish — serif display, generous
  space, warm surfaces — makes graded returns and surplus feel like high-value
  inventory; condition, grade and seller credentials are given room next to price.
- **Everyday usability is intact.** It keeps Modern Commerce's findability: the
  dominant, category-scoped search, visible facets and dense browsing remain, so
  a large mixed catalogue is still easy to scan and narrow.
- **A calm, legible buy/bid box.** A sticky side box keeps price, stock or
  countdown and the primary action in view; the bid panel is a single column —
  current bid, countdown, bidder state, quick bids, a custom amount with an
  increment stepper and inline validation, a proxy-bid disclosure, deposit and
  anti-sniping in plain language, and the Buy Now box on "both" lots.
- **Strong Arabic typography.** Readex Pro carries Arabic headings and body;
  Arabic runs one step larger with taller leading and no Latin-style tracking.

### C. Considerations

- **Density.** The most generous of the four (larger cards, more spacing and
  wider gutters). Buyers scanning hundreds of lots can switch to the list view;
  the grade/seller-forward cards trade some density for finish.
- **Photography dependence.** The warm-plate treatment (multiply blend) assumes
  white-background packshots. Seller photos with busy backgrounds need the cover
  fallback, and any cut-out imagery needs a cut-out step or a plate fallback.
- **Typefaces beyond the brand pair.** Fraunces (a variable serif with
  optical-size and SOFT axes) and Manrope are additions to the brand's Archivo
  and Alexandria; they need brand sign-off.
- **Numbered pagination.** Browse uses numbered pages (as Modern Commerce does),
  mapping directly onto production's paged list endpoint (`page`, `page_size=20`).
- **New surfaces.** The mini-cart is a new view over the existing cart provider;
  the search suggestions and mega menu use the existing search and categories
  endpoints (same search parameter).

### D. Existing production areas affected later

- Global chrome: navbar (utility strip with the delivery-city picker, dominant
  search with suggestions, mega menu, account menu, mini-cart and watchlist
  drawers, category bar), mobile menu, mobile bottom tab bar, footer.
- Homepage sections and their data hooks (hero, featured, ending soon, hot,
  Buy Now, live events).
- Browse page (filter sidebar, tabs, category chips, results, numbered
  pagination, mobile filter drawer).
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
prompt when a bid fails for deposit reasons; paged bid history (numbered, five
rows a page); the live viewer's WebSocket state and per-item deadline; cart
provider actions behind "Add to cart" and "Buy Now"; the browse URL parameters
behind every filter chip.

---

## Concept B — Modern Commerce (Option 1)

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

## Concept C — Saudi Modern Commerce (Option 3)

### A. Summary

An Arabic-first, locally relevant evolution of Modern Commerce — modern and
confident rather than traditional or decorative (no geometric patterns, arches,
lanterns or calligraphy flourishes). It is designed in Arabic first and mirrored
into English, and keeps Modern Commerce's search, filtering and browsing while
giving the site a contemporary Saudi character. The signature is a bilingual
heading lockup on fixed interface headings: the current language leads at full
size and the other language sits beneath as a small muted line, marked by a short
gold rule. Cairo carries every heading and kicker in both scripts for a confident,
Arabic-native hierarchy; Inter keeps the Latin body and figures crisp. The palette
is a warm sand/paper canvas, white surfaces, a deep modern-green ink, a green
primary for actions and a restrained saffron-gold accent; crisp warm borders and
medium radii carry the structure over heavy elevation. Light by default, with a
dark-green dark theme.

Screens: the shared Modern Commerce chrome (a utility strip with the delivery-city
picker and a trust ticker; a sticky header with a dominant, category-scoped search
and live suggestions; a category bar with a mega menu; a mobile bottom tab bar),
rendered in the green/sand palette with bilingual section headings; a home page of
a promo carousel and side promo tiles, a trust strip, category tiles, an auctions
rail, a live band, a Buy Now deals grid, the pallet feature, a seller shelf with
an "Across the Kingdom" warehouse-cities treatment, and how-it-works with the
grade scale; browse, product, auction, live and seller screens on the shared kit,
with strong seller/warehouse credibility cues (city, member-since).

### B. Strengths

- **Local relevance without clichés.** Arabic-first layouts, bilingual interface
  headings and a contemporary Saudi palette (sand, deep green, saffron) give the
  site local character while staying modern and non-decorative.
- **Arabic typography of the highest standard.** Cairo sets the hierarchy in
  Arabic and mirrors cleanly to Latin; Arabic runs one step larger with taller
  leading, so Arabic is the source rather than an afterthought.
- **Seller and place credibility.** The "Across the Kingdom" warehouse-cities
  treatment and seller facts (city, member-since, counts) give strong local trust
  signals.
- **Practical marketplace, kept.** It retains Modern Commerce's search, filters
  and dense browsing, so it stays a usable everyday marketplace.

### C. Considerations

- **Bilingual headings need copy in both languages.** Product titles and
  descriptions in production are single-language with optional Arabic fields; the
  bilingual lockup is limited to fixed interface headings and must degrade
  gracefully when a lot has no Arabic title.
- **"Across the Kingdom" needs seller cities and counts.** The seller endpoint
  returns city and counts per seller, but there is no public seller-list
  endpoint; the warehouse-cities treatment needs a curated list of seller codes or
  an approved endpoint.
- **Cairo across both scripts** adds font-weight budget at its heavier heading
  weights; subsetting (Arabic + Latin) and `font-display: swap` are required.
- **Palette sign-off.** The green action/ink and saffron accent were tuned to
  clear WCAG AA as small text on white and on the warm surface; brand sign-off on
  those values is needed.

### D. Existing production areas affected later

- Global chrome: navbar (utility strip with the delivery-city picker, dominant
  search with suggestions, mega menu, category bar) with bilingual section
  headings, mobile menu, mobile bottom tab bar, footer.
- Homepage: hero carousel and promo tiles, trust strip, category tiles, an
  auctions rail, live band, Buy Now deals grid, the pallet feature, a seller shelf
  with the "Across the Kingdom" warehouse-cities treatment, grade scale and how it
  works.
- Browse: bilingual page head, filters (facet panel and quick chips), sort,
  active chips, numbered pagination, mobile filter drawer.
- Auction and Buy Now detail pages (gallery, specification table, bid panel with a
  countdown, manifest, similar items), live viewer (stream, current lot, bid
  panel, feed, lot sequence), seller storefront (cover, monogram, seller facts),
  shared cards, grade guide.

### E. Existing logic that should be retained

Everything in *Logic that stays untouched in every case*, and in particular: the
existing language preference and RTL handling (this concept depends on them
most), the browse URL contract behind the filters, bidding and proxy flows behind
the bid panel, the live event socket behind the live view and feed, the seller
endpoint for city and counts, and cart/watch actions on cards.

---

## Concept D — Auction-Forward Commerce (Option 4)

### A. Summary

An auction-led evolution of Modern Commerce. It keeps the same clarity and
conversion focus but puts auctions front and centre. A clean cool base and white
surfaces keep it commercially trustworthy; a deep indigo carries every action; an
energetic orange-red accent is spent only on time, urgency, live and the auction
identity itself. Space Grotesk gives a confident geometric display, Inter carries
the body, and JetBrains Mono renders every countdown, bid amount and figure
(tabular) — the monospaced numerics are the signature; IBM Plex Sans Arabic leads
Arabic. Corners are crisper than Modern Commerce (10 px cards). Crypto, gaming and
neon aesthetics are deliberately avoided — the fine background grid reads as an
auction board, not a crypto matrix, and the dark theme is clean and elevated
rather than neon-on-black. Light by default, with a dark theme.

The auction card's signature is a full-width mono countdown strip that stays
neutral while live, warms to amber under an hour and turns to a red "closing now"
chip with a pulsing dot in the final minutes; urgent and critical cards carry a
thin accent rail, and busy lots show a "hot" flame. Detail pages and the auction
hero use a large segmented countdown clock (day/hour/minute/second cells with
colon separators; the block breathes a soft ring when critical). The home page
leads with auctions (the closing / most-bid rail first, then the live band) and
runs a muted "Live bids" ticker under the hero, built from the sample catalogue,
that pauses on hover and stops under reduced motion.

Screens: the shared Modern Commerce chrome (a utility strip with the delivery-city
picker and a trust ticker; a sticky header with a dominant search and live
suggestions, an account menu, a mini-cart and a watchlist drawer; a category bar
with a mega menu; a mobile bottom tab bar), rendered in the auction-forward palette
with a home "Live bids" ticker; an auctions-led home page; browse with grid and
list views; product and auction detail with a sticky buy/bid box; a live viewer
(stage, current lot, console, feed, lot sequence); a seller storefront.

### B. Strengths

- **Built for bidders.** Price, time and competition read at a glance: the
  full-width countdown strip and the segmented clock make each lot's urgency
  obvious, and the home "Live bids" ticker keeps auction activity in view.
- **Clear bidder feedback.** Status escalates from calm to "ending soon" to a
  red "closing now" with a pulse in the final minutes; winning and outbid states
  and the sold overlay make momentum visible without extra copy.
- **Still commercially trustworthy.** The urgency accent is disciplined (time,
  live and the auction identity only), so the site reads as a serious marketplace
  rather than a flashy or gimmicky one.
- **Practical marketplace, kept.** It retains Modern Commerce's search-led
  browsing and conversion focus; auctions simply lead the hierarchy.

### C. Considerations

- **The "Live bids" ticker has no aggregate feed.** In the preview it is built
  from the sample catalogue. Production's sockets are per lot
  (`/ws/auctions/<id>/`) and per live event; a real marketplace-wide bid ticker
  would be a backend change needing approval (see file map G, row 30). It can
  otherwise be fed from the homepage sections and the sockets of lots on screen.
- **Monospaced numerals** (JetBrains Mono) are new to the brand typography and
  need sign-off; the Riyal glyph still comes from the bundled Riyal font.
- **Space Grotesk** for display is an addition to the brand's Archivo and
  Alexandria and needs brand sign-off.
- **Motion budget.** The ticker, the countdown pulse and the critical "breathe"
  ring must respect reduced motion (already done in the preview: the ticker goes
  static and the animations stop) and be throttled so frequent socket frames do
  not cause constant re-rendering.
- **Dark theme scope.** A full dark palette covers every customer surface,
  including cart, checkout and account, which are not designed in this phase.
  Product photos stay on light plates in both themes.

### D. Existing production areas affected later

- Global chrome: navbar (utility strip with the delivery-city picker, dominant
  search with suggestions, mega menu, account menu, mini-cart and watchlist
  drawers, category bar), a home "Live bids" ticker, mobile bottom tab bar,
  footer.
- Homepage: every section, reordered so the auctions rail leads, plus the "Live
  bids" ticker under the hero.
- Browse: header, grid and list views, filter panel and mobile filter drawer,
  pagination.
- Auction detail: the bid panel (segmented countdown clock, price block, bidder
  banner, bid form with quick bids, custom amount, confirm modal, max-bid
  control, Buy Now box, deposit and anti-snipe notes, market comparison), bid
  history, pallet manifest, and the mobile bid bar.
- Buy Now detail, live viewer (current lot, stage, console, feed, lot sequence,
  mobile tabs), seller storefront, shared cards and list row, grade guide and
  wallet deposit modal styling, toasts.

### E. Existing logic that should be retained

Everything in *Logic that stays untouched in every case*, and in particular: the
auction WebSocket state and polling as the single source for the bid panel's
price, clock and bidder state; bid, confirm and proxy flows; the live event
socket for the current lot, console and feed; the existing search parameter
behind the header search; the cart provider behind the mini-cart; wallet balance
from the existing wallet endpoint.

---

## Side-by-side reference (not a ranking)

| | A — Premium Commerce (Option 2) | B — Modern Commerce (Option 1) | C — Saudi Modern Commerce (Option 3) | D — Auction-Forward Commerce (Option 4) |
|---|---|---|---|---|
| Default appearance | Light (dark available) | Light (dark available) | Light (dark available) | Light (dark available) |
| Density | Comfortable | High | High | High |
| Typefaces | Fraunces + Manrope; Readex Pro | Figtree; Almarai | Cairo (both scripts); Inter | Space Grotesk + Inter + JetBrains Mono; IBM Plex Sans Arabic |
| Header model | As Modern Commerce, premium finish | Three tiers: utility strip, dominant search, category bar + mega menu | As Modern Commerce, bilingual headings | As Modern Commerce + home "Live bids" ticker |
| Mobile navigation | Bottom tab bar + collapsing search | Bottom tab bar + collapsing search | Bottom tab bar + collapsing search | Bottom tab bar + collapsing search |
| Browse paging | Numbered pages | Numbered pages | Numbered pages | Numbered pages |
| Signature auction element | Matted "catalogue object" cards; focal serif prices; baseline-rule countdown | Sticky bid box | Bilingual headings; countdown pill | Full-width mono countdown strip + segmented clock |
| New surfaces vs today | As B + serif display, warm plates, matted product cards | Autocomplete, mega menu, mini-cart, tab bar | As B + bilingual headings, "Across the Kingdom" cities | As B + "Live bids" ticker, segmented countdown clock |

The client chooses; any of the four can be implemented on the current
architecture with the preparation described in *Common ground*.
