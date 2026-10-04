# Khaznah — Buy Now Product Detail redesign, all four options

Phase E of the client review pack. The Buy Now product page (`/product` and
`/product/[slug]`) now uses each option's approved Home, Browse, Auction
Detail and Live Auction design. The four pages share one behaviour layer
(stock, quantity, Add to cart, Buy it now, discovery lists). Each option has
its own layout, gallery treatment, purchase panel, information sections and
phone purchase bar.

- **Review links** (on the Vercel preview of this branch):
  - Option 1: `/en/concept-b/product/task-lamp`
  - Option 2: `/en/concept-a/product/task-lamp`
  - Option 3: `/en/concept-c/product/task-lamp`
  - Option 4: `/en/concept-d/product/task-lamp`
  - Arabic: replace `/en/` with `/ar/`. The bare `/product` address shows
    the same featured product (`task-lamp`), as before.
  - Other states: `/product/field-watch` (no discount),
    `/product/hairpin-desk` (low stock), `/product/capsule-coffee` (very low
    stock), `/product/tyre-inflator` (sold out), `/product/kitchen-pallet`
    (full lot, quantity locked), `/product/monitor-stands-5` (bulk, priced
    per case).
- **Screenshots:** `docs/client-review-product-detail/` (20 review shots,
  the four-option comparison and the interaction evidence sheet; see its
  README).
- **Paths** below are relative to `design-preview/` unless they start at the
  repository root.
- **Amounts:** the pages show the Saudi riyal sign (⃁); this report writes
  "SAR" except where it quotes a label exactly.
- **Buying works as before.** Add to cart adds the chosen quantity, within
  the stock and what is already in the cart; Buy it now adds the same way
  and opens the cart drawer. No checkout was added and the cart was not
  redesigned (§I, §J).
- **Nothing else was redesigned.** Home, Browse, Auction Detail and Live
  Auction are pixel-identical to `ceefd19` (159 of 160 page pairs; the
  last differs only by known load noise, §T). The
  remaining inner pages (Seller, Components & states) change only the
  wording of their "Earlier prototype" note, which now names Product as new.

---

## A. Baseline

- **Branch:** `claude/magical-faraday-fne4kq`.
- **Starting commit:** `ceefd19` ("Redesign live auction for all four
  Khaznah concepts").
- **Checks before editing:**
  - HEAD was exactly `ceefd19`;
  - HEAD matched `origin/claude/magical-faraday-fne4kq`;
  - the working tree was clean.
- **Comparison build:** a production build of `ceefd19` in a separate
  worktree, served next to the new build. Every before/after figure in this
  report compares those two builds.
- **Final commit:** the commit that adds this report, "Redesign product
  detail for all four Khaznah concepts". A report cannot contain its own
  hash; `git log -1 --format=%H -- CLIENT_REVIEW_PRODUCT_DETAIL_REPORT.md`
  prints it.

**Product Detail before this change**

- **Option 1** (`concept-b`): `pages/ProductPage.jsx` →
  `product/ProductView.jsx` (`DetailLayout`, `LotHead`, `BuyBox`,
  `LotDetails`, `ProductTabs`, `MobileBuyBar`) on Option 1's components.
- **Options 2–4** (`concept-a`, `concept-c`, `concept-d`): Round 2
  prototypes under the `(round2)` route group, labelled "Earlier
  prototype". Their product files were recoloured copies of Option 1's (the
  Option 4 `BuyBox` differed by two lines).

## B. Existing functionality audit

Done on `ceefd19` before any change. All four options behaved the same.

| Area | Behaviour on `ceefd19` | After |
|---|---|---|
| Routes | `/product` renders the featured product (`task-lamp`) directly; `/product/[slug]` is pre-rendered for the 18 Buy Now products; other slugs are not generated (404); the title names the product | Kept, all four options |
| Identity | Breadcrumb Home → category → title; category link; lot number; H1; grade chip with "What this grade means"; source or item type; "N watching" | Kept in every option's own form |
| Gallery | Thumbnails, main image, hover zoom on fine pointers, click → full-size viewer (previous / next, counter, thumbnails), arrow keys on the focused gallery (mirrored in Arabic), swipe; discount or Out of stock on the image | Kept; each option reuses its approved Auction Detail gallery and viewer (§K) |
| Price | "Price" (" · per case" where the lot has a unit), price, discount, "Was … Save …" | Kept |
| Stock | ≤ 0 Out of stock; ≤ 5 "Only N left" with a meter; else "N available" | Kept and made clearer: In stock / Low stock / Very low stock / Out of stock in words, the count beside it (§H) |
| Quantity | Stepper − / input / +, labelled, min 1, max = stock; a full lot shows a lock, "Full lot" and "Sold as a full lot — quantity can't be split."; quantity > 1 shows the total | Kept (§I) |
| Add to cart | Adds the quantity; past the stock (counting what is already in the cart) a warning "Maximum available: n" and nothing added; success toast | Kept (§I) |
| Buy it now | Same add, then the cart drawer opens; there is no checkout (the drawer's Checkout only explains the next step) | Kept (§J) |
| Sold out | Add to cart disabled ("Out of stock"); Buy it now replaced by "See similar items" (Browse, same category) | Kept |
| Watch / Share | Watch (aria-pressed, toast); Share copies the link (toast) | Kept in every option |
| Payment | Secure payment, mada / VISA / Mastercard, wallet balance | Kept |
| Information | Highlights, condition report, seller summary (name, warehouse, city, member since, active auctions, Buy Now items, Visit store), delivery / pickup / returns, description, specifications, pallet manifest | Kept (§L, §M) |
| Lists | "You may also like" (related, same category first) and "More from this seller" | Kept, auctions first where a list mixes both (§N) |
| Phone | Fixed bar: price, was price or stock, Watch, Add to cart | Kept and redesigned per option (§O) |

**Gaps found and closed**

- Phone toasts appeared over the old phone bar. Every new bar now uses the
  Auction Detail's toast lift (§O).
- Options 2–4 were recolours of Option 1, not their approved designs.
- The four pages read the same; the stock wording ("Only 3 left") was the
  only stock signal.

## C. Architecture

### Shared layer (`components/shared/product/`, new)

Behaviour and wording only; nothing in it decides how anything looks.

- `copy.js` — 14 product strings in English and Arabic (About this item,
  Item details, Buy this item, Fixed price, Low stock, Very low stock,
  Stock, Full lot, Maximum available: {n}, Total for {n}, In your cart:
  {n}, Highlights, Delivery & returns, Payment). Marketplace words that
  already existed (Price, Was, Save, Add to cart, Buy it now, Only {n}
  left…) still come from `data/ui.js`.
- `hooks.js`:
  - `resolveProduct(slug)` — the slug's Buy Now product or the featured one
    (as before);
  - `stockLevel` / `useStock` — four levels (healthy, low ≤ 5, very low ≤ 3,
    out), a status word, the count and an optional meter value; a full lot
    is simply in stock or not (§H);
  - `useProductInfo` — display-ready identity, seller, grade, specs and
    payment facts;
  - `usePurchase` — quantity (1 … stock, locked at 1 for a full lot), total,
    Add to cart (within the stock and the cart), Buy it now (add, then open
    the cart), the panel's words;
  - `useGradeGuide` — the guide's open state in the shape each option's
    Auction Detail grade dialog already reads;
  - `useToastsAwayFromPanel` — from 768 px, moves the toast stack to the
    start side while the page is open, away from the purchase panel (the
    Live Auction's existing `--kz-toast-align` setting);
  - `relatedFor` / `moreFromSeller` — the catalogue's lists, auctions first.
- Reused unchanged from earlier phases: `useShareLink`,
  `useToastClearance` and `useFulfilment` (`components/shared/auction/
  hooks.js`), the shared image viewer, the preview store (cart, watchlist,
  toasts), `Money` and `Img`.

### Option folders

Each option has its own product components, built from its approved
components. The approved components are imported, never edited.

- **Option 1** — `components/concept-b/product/`: new `ProductHeader`,
  `PurchasePanel`, `ProductSheet`; rewritten `ProductView`, `MobileBuyBar`;
  deleted `BuyBox`, `LotHead`, `LotDetails`, `DetailLayout`, `ProductTabs`
  (product-only). `Gallery`, `Lightbox`, `GradeGuide`, `ManifestTable`,
  `SpecsTable` and `Fulfilment` are used by Option 1's approved pages and are
  unchanged.
- **Option 2** — `components/concept-a/premium-modern/product/`
  (`PremiumModernProduct`, `ProductView`, `Purchase`, `Sections`), reusing
  its Auction Detail `Gallery`, `GradeGuide`, `Manifest` and `SaveSquare`
  and its Browse `LotCard`.
- **Option 3** — `components/concept-c/visual-discovery/product/`
  (`VisualDiscoveryProduct`, `ProductView`, `Gallery`, `PriceCard`,
  `Story`), reusing its Auction Detail `GradeGuide`, `SellerDelivery` and
  `ManifestTiles`, the shared viewer in its Auction Detail skin, and its
  Browse `LotCard`. Its gallery is a product version of the Auction Detail
  gallery (the same plate, controls and viewer, without the clock).
- **Option 4** — `components/concept-d/saudi-commerce/product/`
  (`SaudiCommerceProduct`, `ProductView`, `Purchase`, `Sections`), reusing
  its Auction Detail `Gallery`, `GradeGuide`, `InfoBlocks` and
  `ManifestTable` and its Browse `LotCard`.

This is not one component with four colour themes: the four `ProductView`s
have different structures, orders and components (§D–§G).

### Routes

- Options 2–4 leave the `(round2)` group: `app/[lang]/concept-{a,c,d}/
  product/page.js` and `product/[slug]/page.js` (same parameters as before:
  the 18 Buy Now slugs, `dynamicParams = false`).
- `app/[lang]/layout.js`: the pre-paint marker that keeps the approved
  designs' tokens from flashing now also covers `/product` and
  `/product/[slug]`.
- The old Round 2 product components of Options 2–4 are no longer routed
  and stay in the tree, like the Round 2 auction and live components before
  them.

### Presentation status

- `lib/routes.js`: `NEW_DESIGN_PAGES` adds `product`.
- `PrototypeNotice`, `selector-copy.js`, the `PresentationBar` comment,
  `CLIENT_PREVIEW_GUIDE.md` and `design-preview/README.md` now say: Home,
  Browse, Auction, Live auction and Product carry the new design; Seller and
  Components & states are earlier prototypes; cart, checkout and account
  have not been redesigned. Smoke test: **114 / 114** (§R).
- The product page is light only in Options 2–4, like the other approved
  pages; the bar shows "Light only" there.

### Nothing else changed

`lib/` (apart from `routes.js`), `data/`, the engines, the shared UI, the
auction and live layers and every approved component are unchanged
(`git diff ceefd19 -- design-preview/lib design-preview/data
design-preview/components/shared/{ui,auction,live,r3}` lists only
`lib/routes.js`). Header and menu files of Options 2–4 changed in comments
only: they already took the current mode, which the product page now passes
("Buy Now" for single items, "Bulk & Pallets" for cartons and pallets).

## D. Option 1 — Modern Commerce (`concept-b`)

*"High-confidence commerce product page."* Built within Option 1's existing
design, as a sibling of its Auction Detail.

- **Product band** (white): breadcrumb; Buy Now badge, the discount (or
  Out of stock), the quantity of a carton or pallet and the lot number; the
  H1; the grade chip with "What this grade means"; source or item type;
  "Sold by" with the store link; watchers; Watch and Share.
- **Desktop (≥ 1280 px):** three columns — the gallery (vertical
  thumbnails), a dense item sheet (item details, condition report,
  highlights) and the sticky purchase panel.
- **Purchase panel:** a navy head ("Buy Now · Fixed price" and the stock
  status with a dot); the price with the discount tag, was price and
  saving; the stock count over a quiet meter; the quantity stepper, the
  full-lot lock and the total; Add to cart (primary) and Buy it now
  (outline), or the sold-out button and "See similar items"; "In your cart";
  secure payment with the card marks, the wallet, delivery and pickup.
- **Below:** the description beside the specifications, the grade card with
  the guide, the seller summary, delivery and returns, the pallet manifest;
  then the "You may also like" and "More from this seller" rails.
- **Tablet (768–1279 px):** gallery, sheet and sections in one column
  beside a 320–360 px sticky panel.
- **Phone:** band, gallery, a compact panel (without the notes), the sheet,
  the sections and rails; a 76 px fixed bar (price and unit, was price and
  discount or the stock, Watch, Add to cart).
- **Add to cart** sits at y = 612–660 px at 1440 px and 607–655 px at
  1024 px: on the first screen.

## E. Option 2 — Premium Modern Marketplace (`concept-a`)

*"Premium resale marketplace product page."* Editorial and warm; the
sibling of its Auction Detail.

- **Desktop (≥ 1200 px):** the gallery large on stone (7/12) beside a
  brass-dash "Buy Now" eyebrow with the lot number, the H1, "Sold by" in
  bronze, the quantity or type, the grade pill and its guide; a hairline
  status row (the stock with a dot, the count, watchers, Save, Share); and
  the charcoal purchase console.
- **Console:** "Price"; the price with a brass discount tag; was price and
  saving in brass; the quantity field (white on charcoal) and the total; Add
  to cart in brass and Buy it now outlined beneath; secure payment, the
  wallet and delivery.
- **Add to cart is not far below the fold:** y = 717–765 px at 1440 px,
  640–688 px at 1024 px, on the first screen.
- **Below:** a stone band "About this item" (the description, brass-dash
  highlights, the condition report with the grade and guide; item details
  and specifications as fact lists), the seller beside delivery, returns and
  payment, the pallet manifest, "You may also like" (4) and "More from this
  seller" (up to 8).
- **Tablet:** the identity across the top, then the gallery beside the
  status row and console.
- **Phone:** gallery, identity, status, the console; a 73 px ivory bar
  (price, was price or stock, charcoal Add to cart).
- The discount and Out of stock sit in the console and the status row, not
  over the photograph: the approved gallery carries no overlays.

## F. Option 3 — Visual Discovery Marketplace (`concept-c`)

*"Discovery-led product story."* Image-forward and bright; the sibling of
its Auction Detail.

- **Desktop:** the photograph large on its own tinted plate, with the Buy
  Now pill, the gold discount (or Out of stock), the heart (Watch), the
  counter and round previous / next, and rounded thumbnails beneath; beside
  it chips (Buy Now, quantity, lot), the display H1, the seller with avatar,
  watchers, the Share pill, the grade pill with its guide, and the rounded
  white price card.
- **Price card:** large display price, gold discount, was price and saving;
  the stock as a coloured pill with an icon and words; the pill quantity
  control and the total; the indigo Add to cart pill, Buy it now outlined;
  "In your cart"; payment chips and the wallet.
- **The story below:** "About this item" with fact chips (category link,
  type, source, lot, stock), the description, highlight tiles on tinted
  plates, the condition card and the specifications card; the seller on
  navy beside delivery tiles; the pallet manifest as photo tiles; two
  discovery lists, led by chips back into Browse (category, Timed auctions,
  Buy Now — auctions before Buy Now), then cards (4 related, up to 8 from
  the seller).
- **Phone:** a floating navy pill bar, 64 px high and 12 px above the edge
  (price, was price or stock, gold Add to cart).
- **Add to cart:** y = 739–795 px at 1440 px, 684–740 px at 1024 px.

## G. Option 4 — Contemporary Saudi Commerce (`concept-d`)

*"Straightforward Saudi retail marketplace."* Practical and ordered; the
sibling of its Auction Detail.

- **Cream band:** breadcrumb; the sage Buy Now tag, the quantity of a
  carton or pallet and the lot number; the H1; "Sold by", the grade pill
  with its guide, the type and watchers; framed Watch and Share.
- **From 768 px:** the calm gallery (the discount or Out of stock as a tag
  on the photograph) and the sections, beside a framed purchase panel that
  stays in view (330 px wide, 400 px from 1200 px).
- **Panel:** a sage head (the Buy Now tag, "Fixed price"); the price with
  its discount tag, was price and saving; the stock in words over a quiet
  meter; a square-stepped quantity field and the total; the green Add to
  cart and Buy it now outlined beneath (or the disabled button and "See
  similar items"); "In your cart"; secure payment, the wallet and pickup.
- **Sections:** three sage blocks — condition, seller, delivery and returns
  (the approved Auction Detail blocks); "About this item" (description and
  a checklist of highlights beside item details and specifications as plain
  tables); the manifest table; "You may also like" and "More from this
  seller" (4 each, with View all).
- **Phone:** the panel under the gallery; a white 75 px bar (price and unit,
  was price and discount or the stock, green Add to cart).
- **Add to cart:** y = 686–738 px at 1440 px, 633–685 px at 1024 px.

### Why the four read differently

| | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| First screen | Band, then gallery · sheet · panel | Gallery beside identity, status, console | Tinted photo plate beside chips and a rounded card | Cream band, then gallery beside a framed panel |
| Purchase surface | Navy-headed panel | Charcoal console | White rounded card | Framed panel, sage head |
| Primary action | Indigo, squared | Brass | Indigo pill (gold in the phone bar) | Green |
| Stock | Dot in the head, count and meter | Dot and words in a hairline row | Coloured pill with icon | Words over a meter |
| Information | Dense sheet beside the gallery | Stone editorial band | Story with chips and tiles | Sage blocks and tables |
| Phone bar | 76 px, with Watch | 73 px ivory | Floating navy pill | 75 px white |

## H. Product-state matrix

Real catalogue products; no product record was changed.

| State | Product | What every option shows |
|---|---|---|
| Healthy + discount | `task-lamp` (SAR 189, was 249, 14 in stock) | In stock · 14 available; −24%, was price and "Save SAR 60" |
| No discount | `field-watch` (SAR 89, 25 in stock) | In stock · 25 available; no discount, no was price |
| Low stock | `hairpin-desk` (4) | Low stock · Only 4 left; quantity stops at 4 |
| Very low stock | `capsule-coffee` (3) | Very low stock · Only 3 left; quantity stops at 3 |
| Sold out | `tyre-inflator` (0) | Out of stock; no quantity; Add to cart disabled ("Out of stock"); no Buy it now; "See similar items" → Browse, Automotive; phone bar button disabled |
| Full lot | `kitchen-pallet` (1 pallet of 40 units) | In stock · 1 available; quantity locked at 1 with "Full lot" and "Full pallet · 40 units. Sold as a full lot — quantity can't be split."; a second add is refused ("Maximum available: 1") |
| Bulk, per case | `monitor-stands-5` (12 cases) | "Price · per case"; In stock · 12 available |

- The stock is always said in words, never by colour alone.
- **One wording change:** a full lot now reads "In stock · 1 available"
  instead of "Only 1 left". A full lot is one indivisible unit, so calling it
  low stock would be false urgency.
- No countdowns, "selling fast" badges or other urgency were added. The
  watcher count is the catalogue's own figure, as before.
- **Checks** (`.scratch/pd/states.mjs`): the seven products × four options ×
  English and Arabic × desktop (1440) and phone (390): stock words and
  count, discount and was price (or none) in the purchase panel, actions,
  similar-items link, the full-lot lock and note and the refused second
  add, the per-case label, the quantity ceiling, the phone bar, no overflow
  and no console errors: **112 / 112 passed**.

## I. Quantity and cart behaviour

- **Quantity:** from 1 to the stock; − is disabled at 1 and + at the stock;
  typing a number is clamped (99 → 14 on `task-lamp`); a full lot is locked
  at 1. The field is labelled "Quantity", − and + are "Decrease quantity" /
  "Increase quantity".
- **Total:** from 2 up, "Total for n" with the amount (3 × SAR 189 = SAR
  567).
- **Add to cart** adds the chosen quantity and confirms with a toast; "In
  your cart: n" appears in the panel. Past the stock, counting what is
  already in the cart, it warns "Maximum available: n" and adds nothing.
- **The phone bar's Add to cart** adds the quantity chosen in the panel.
- **Flow test** (`.scratch/pd/flow.mjs`, real time, production build, 1440
  px, all four options, English and Arabic, steps 1–26 of the brief plus no
  console errors): quantity + → 2, − → 1 (− then disabled), 3 → total SAR
  567, Add to cart → toast and cart count 0 → 3, again → 6 with "In your
  cart: 6", 14 more → refused with "Maximum available: 14" (cart stays 6),
  99 typed → 14: **27 / 27 in each of the 8 runs**.

## J. Buy It Now

- Adds the chosen quantity exactly like Add to cart, then opens the cart
  drawer, as before. If the add is refused (past the stock) the drawer
  still opens, showing what is in the cart — also as before.
- There is still no checkout: the drawer's Checkout button explains the
  next step, unchanged. Nothing routes to an unfinished checkout.
- Buy it now stays in the page (outlined, under Add to cart); the phone bar
  carries Add to cart only.
- **Flow test:** quantity 2 → Buy it now → toast, cart 6 → 8, the drawer
  opens with the item, Escape closes it: passed in all 8 runs.

## K. Gallery and viewer

- **Option 1:** its existing gallery (vertical thumbnails from 1024 px, a
  strip on phones, hover zoom, discount or Out of stock on the image) and
  viewer, unchanged.
- **Option 2:** its approved Auction Detail gallery and viewer, unchanged.
- **Option 3:** the Auction Detail's tinted plate, round controls,
  thumbnails and viewer skin, with Buy Now and the discount as pills.
- **Option 4:** its approved Auction Detail gallery and viewer, unchanged,
  with the discount or Out of stock tagged on the photograph.
- **Everywhere:** only the product's own photographs; previous / next,
  thumbnails, counter, hover zoom on fine pointers, swipe, arrow keys on
  the focused gallery (mirrored in Arabic); photographs are never mirrored.
- **Flow test** (all 8 runs): next → 2, previous → 1, thumbnail → 3, the
  viewer opens, the arrow key moves to 4, Escape closes and focus returns
  to the image.
- **Option 1's viewer** opens with focus on its Close button, outside the
  area that takes the arrow keys: one Tab first, then the arrows work. Its
  Auction Detail viewer behaves the same; it was left unchanged (§V).

## L. Grade and condition

- The grade sits next to the title in every option, with "What this grade
  means" opening the grade guide (Electronics / Non-electronics tabs, this
  item's grade marked, works / not working, the returns note).
- The condition report repeats the grade with its meaning, the item's
  condition note and "Condition grade disclosed".
- Each option uses its own approved grade dialog.
- **Flow test** (all 8 runs): the guide opens, the arrow key moves between
  its tabs, Escape closes it and focus returns to the button.

## M. Seller and fulfilment

- Only catalogue data: the seller's name (linking to the store), "Sold by"
  or "Sold by Khazna", the warehouse city, "Selling since", active auctions
  and Buy Now items, Visit store; delivery (priced at checkout), pickup in
  the seller's city with its hours, returns.
- No reviews, ratings, verification badges or response times were added.
- Payment: secure payment with mada, VISA and Mastercard, and the wallet
  balance, as before.
- **Flow test:** the seller link opens `/seller/RAWABI` in all 8 runs.

## N. Related items and More from this seller

- Both lists are kept, with View all links (the category in Browse; the
  seller's store).
- **Auctions first:** where a list mixes both, auctions come before Buy Now
  items (the order within each kind is kept). For `task-lamp`, "More from
  this seller" leads with the Rawabi auctions (the side-by-side
  refrigerator with Buy Now, the swivel chair, the dishwasher, the
  upcoming sofa).
- "You may also like" keeps the catalogue's relevance order (same category,
  then same sale type); for a Buy Now item in Home & Kitchen this is mostly
  Buy Now items, so no auction is pushed ahead of a closer match.
- **Counts:** Option 1 keeps its rails (10 related, all of the seller's
  open lots); Option 2 and 3 show 4 related and up to 8 from the seller;
  Option 4 shows 4 and 4. Every list has View all.
- Only real catalogue lots; no seller inventory was invented.
- **Flow test:** the first related card and the first "More from this
  seller" card (an auction) open their pages in all 8 runs.

## O. Mobile purchase experience

| | Bar | Contents |
|---|---|---|
| Option 1 | 76 px, full width | Price and unit; was price and discount or the stock; Watch; Add to cart |
| Option 2 | 73 px ivory, full width | Price; was price or the stock; charcoal Add to cart |
| Option 3 | 64 px navy pill, 12 px above the edge | Price; was price or the stock; gold Add to cart |
| Option 4 | 75 px white, full width | Price and unit; was price and discount or the stock; green Add to cart |

- Each bar sits above the safe area; the page keeps the same room free
  under the footer, so nothing is hidden behind the bar at the end of the
  page. (The room now matches each bar exactly, including its 1 px top rule.)
- The struck was price is announced ("Was SAR 249").
- Sold out: the bar's button is disabled and reads "Out of stock".
- **Toasts** use the Auction Detail's lift (`useToastClearance`): on phones
  every toast rises 12 px above the bar; the lift is removed when the bar
  hides (768 px and wider) and when the page is left. From 768 px the
  stack sits on the start side, as on the Live Auction, so "Added to your
  cart" never covers Buy it now in the panel (found while capturing the
  evidence sheet: at the default end corner it briefly covered the panel's
  lower half). Both settings are the existing toast system's; no second
  system was added.
- **Phone test** (`.scratch/pd/mobile.mjs`, all four options, English and
  Arabic, 390, 360 and 320 px): no page overflow; the bar fixed at the foot
  and fully in view; nothing in it spilling or clipped; its Add to cart at
  least 44 px tall; Add to cart from the bar adds one; the Add to cart,
  Watch and Share toasts each 12 px above the bar and on screen; the footer
  ends above the bar; the lift set on the page and removed after leaving;
  no console errors: **264 / 264 checks passed** (24 runs).

## P. English and Arabic (RTL)

- Every layout is built with logical properties, so Arabic mirrors the
  structure (panel, columns, steppers, breadcrumbs, arrows) while numbers,
  prices, percentages and lot numbers stay in left-to-right runs.
- Photographs are never mirrored; the gallery's arrow keys follow the
  reading direction.
- Arabic labels fit at 320 px in every bar and panel (phone test, clip
  check).
- Arabic copy for the new wording was written for this page (e.g. "كمية
  قليلة جداً", "الإجمالي لـ 3", "في سلتك: 6", "يُباع كدفعة كاملة — لا يمكن
  تجزئة الكمية.").
- Every check in this report ran in both languages.

## Q. Responsive QA

- **Sweep** (`.scratch/pd/sweep.mjs`, `task-lamp`, 1920, 1440, 1366, 1280,
  1200, 1024, 768, 480, 430, 390, 360 and 320 px, English and Arabic, all
  four options): no page overflow, nothing past the viewport, no broken
  images, no console errors, one H1, Add to cart visible and inside the
  viewport, on the first screen from 1024 px, the phone bar below 768 px
  only, nothing under the bar at the end of the page: **96 / 96 passed**.
- **Add to cart on the first screen** (900 px high window) at 768 px and up
  in every option: Option 1 y ≤ 697, Option 2 ≤ 794, Option 3 ≤ 822, Option
  4 ≤ 763.
- **Clipped content** (`.scratch/pd/clip.mjs`: text drawn past its box,
  collapsed or squeezed headings, cut-off prices): `task-lamp` at all 12
  widths, English and Arabic: **96 / 96**; the full lot, sold-out, per-case
  and no-discount products at 1440, 1024, 768, 390 and 320 px:
  **160 / 160**.
- **Tablet:** 1024 and 768 px are designed layouts in every option (§D–§G),
  not squeezed desktops.

## R. Accessibility

- **axe** (WCAG 2.1 A/AA, `.scratch/pd/axe.mjs`): all four options, English
  and Arabic — `task-lamp` at 1440 px on load, after adding 3, with the
  grade guide open and with the viewer open; at 390 px on load and after
  adding from the bar; the sold-out and full-lot products at 1440 and 390
  px — 80 runs: **0 serious or critical issues** (and no minor ones).
  - The first run found two contrast issues on Option 3's product page, both
    fixed: the stock count in the stock pill was faded to 90 % (4.16:1); and
    the white initials on one seller's avatar colour (Sahel, #B0643B) were
    4.43:1. The product page now draws seller avatars 10 % deeper (5.29:1
    for Sahel; every seller above 6.8:1 otherwise). The same Sahel avatar on
    Option 3's approved Auction Detail was left as approved (§V).
- **Structure:** one H1 (the product title); breadcrumb `nav`; the purchase
  panel is a region named "Buy this item"; sections are headed; the
  gallery is a labelled group.
- **Controls:** the quantity field has a label; − and + are named and
  disabled at the limits; Add to cart and Buy it now are named buttons;
  Watch has `aria-pressed`; Share is named; sold-out buttons are disabled
  and say "Out of stock"; the stock is never colour alone.
- **Dialogs:** the grade guide and the viewer are modal, trap focus, close
  on Escape and return focus to their trigger (flow test).
- **Focus** is visible on every control (each option's focus ring; the
  quantity fields show it around the whole field).
- **Smoke test** (`.scratch/pd/smoke.mjs`, **114 / 114**): the Seller and
  Components pages of Options 2–4 keep the note with the new wording (1440,
  390, 320 px); `/product`, `/product/task-lamp` and
  `/product/field-watch` answer 200 with one H1, the approved-design marker
  in Options 2–4, the product title in the page title and no prototype
  note; an auction slug under `/product` still 404s; the start page tags
  Home, Browse, Product, Auction and Live auction as new and shows the new
  copy; the presentation bar lists the five new pages first with "Light
  only" on Product in Options 2–4; the phone toast lift is set only while
  the bar shows, the toasts move to the start side, and both are removed
  after leaving.

## S. Performance

Transferred bytes, `task-lamp`, scrolled to the end (`.scratch/pd/perf.mjs`).

| | JS before → after | Images before → after (loaded before scrolling) | DOM nodes before → after |
|---|---|---|---|
| Option 1, 1440 | 382 → 402 KB | 209 → 209 KB (19 → 13) | 1,459 → 1,544 |
| Option 2, 1440 | 460 → 472 KB | 187 → 282 KB (11 → 9) | 1,505 → 1,002 |
| Option 3, 1440 | 460 → 470 KB | 209 → 541 KB (19 → 9) | 1,586 → 1,038 |
| Option 4, 1440 | 465 → 502 KB | 209 → 395 KB (19 → 9) | 1,498 → 963 |
| Option 1, 390 | 382 → 402 KB | 181 → 181 KB (5 → 5) | |
| Option 2, 390 | 460 → 472 KB | 158 → 268 KB (5 → 5) | |
| Option 3, 390 | 460 → 470 KB | 181 → 395 KB (5 → 5) | |
| Option 4, 390 | 465 → 502 KB | 181 → 395 KB (5 → 5) | |

- **No new libraries.** The pages reuse the approved components and the
  shared hooks.
- **JS** grows by 10–37 KB. Option 4's product page loads exactly the same
  script files as its approved Auction Detail (516 KB in both), so the two
  pages share them from the cache.
- **Images:** fewer load before scrolling (9–13 instead of 11–19 at 1440
  px). The bytes grow because Options 2–4 now use the approved design's
  cut-out card images (as on Browse) for the related lists; those load
  lazily, below the fold. Only the main photograph loads eagerly.

## T. Approved-page regression

Against `ceefd19`. The product checks in §H–§S ran on the final build; the
captures below ran on the build just before its last, product-only change,
which serves the approved pages the same code (see the last point of the
first item).

- **Home, Browse, Auction Detail and Live Auction look the same.**
  `.scratch/nav/regress-chrome.mjs` captures each page in full on both
  builds (frozen clock, seeded randomness, loaded images) and compares them
  pixel by pixel in three bands (header, content, footer): Home, Browse,
  Auction Detail on the dual lot (`fridge-690`) and on a timed lot
  (`dishwasher`), and Live Auction, English and Arabic, at 1440, 1024, 390
  and 320 px — 40 pairs per option, **160** in all.
  - **159 / 160 identical.**
  - The one pair that differs, Option 4's English Home at 1024 px, differs
    by 8–42 px in five captures, always at the edges of the
    seller-directory pictures. That is load noise: the baseline compared with
    itself differs at the same pixels (15 px in one of four captures). The
    same page showed the same noise in Phase D.
  - Two long runs closed their test browser part-way (Option 3 Browse after
    two pairs, Option 4 Home after seven); the missing pairs were captured
    again one browser per pair and are all identical.
  - On the final build the approved pages load exactly the same
    content-hashed script and style files as on the compared build (all 40
    route and language combinations checked), so the result holds for it.
    The other checks in this section ran on the final build.
- **Live Auction:** `lib/useLiveEvent.js` (the rival-bidder fix) is
  unchanged; the live page is 0 px wider than the screen at 320 px in all
  options and both languages: **8 / 8**.
- **Auction Detail toast clearance:** `.scratch/ad/toast-check.mjs` (all
  four options, English and Arabic, 390, 360 and 320 px: every toast 12 px
  above the bid bar and on screen; on desktop 24 px from the end corner, as
  before; the lift removed after leaving): **28 / 28 passed**.
- **Option 4 card closeout:** `.scratch/ad/card-check.mjs` (the dual lot's
  card on Browse and in Auction Detail's similar auctions, English and
  Arabic, 320–1440 px): the sale tag never runs under the heart and the
  card's pixels are unchanged from `ceefd19`: **36 / 36 passed**.
- **Auction-first navigation:** the header and footer bands are identical in
  all pairs above; the product page highlights Buy Now (or Bulk & Pallets)
  in the same auction-first navigation.
- **`/system`** keeps its known 320 px overflow, identical before and after
  in all four options and both languages (0–68 px, the same on both builds).

## U. Files changed

**New**

- `components/shared/product/copy.js`, `hooks.js`
- `components/concept-b/product/ProductHeader.jsx`, `PurchasePanel.jsx`,
  `ProductSheet.jsx`
- `components/concept-a/premium-modern/product/PremiumModernProduct.jsx`,
  `ProductView.jsx`, `Purchase.jsx`, `Sections.jsx`
- `components/concept-c/visual-discovery/product/VisualDiscoveryProduct.jsx`,
  `ProductView.jsx`, `Gallery.jsx`, `PriceCard.jsx`, `Story.jsx`
- `components/concept-d/saudi-commerce/product/SaudiCommerceProduct.jsx`,
  `ProductView.jsx`, `Purchase.jsx`, `Sections.jsx`
- `app/[lang]/concept-{a,c,d}/product/page.js` and `product/[slug]/page.js`
- `CLIENT_REVIEW_PRODUCT_DETAIL_REPORT.md` (this report) and
  `docs/client-review-product-detail/` (repository root)

**Changed**

- `components/concept-b/product/ProductView.jsx`, `MobileBuyBar.jsx`,
  `components/concept-b/pages/ProductPage.jsx`
- `app/[lang]/layout.js` (pre-paint marker covers `/product`)
- `lib/routes.js` (`NEW_DESIGN_PAGES`)
- `components/shared/presentation/PresentationBar.jsx` (comment),
  `PrototypeNotice.jsx`, `selector-copy.js`
- `app/[lang]/concept-{a,c,d}/layout.js`,
  `components/concept-{a,c,d}/…/Header.jsx` and `Layers.jsx` (comments only)
- `CLIENT_PREVIEW_GUIDE.md`, `design-preview/README.md`

**Removed**

- `app/[lang]/concept-{a,c,d}/(round2)/product/page.js` and
  `[slug]/page.js` (moved out of the group)
- `components/concept-b/product/BuyBox.jsx`, `LotHead.jsx`,
  `LotDetails.jsx`, `DetailLayout.jsx`, `ProductTabs.jsx`

**Builds** (final tree): `npm run lint` clean; `npm run build` passes and
pre-renders the product routes of all four options in both languages (18
products each, plus `/product`); the static export writes them as files
and passes its smoke test: **152** product pages exported (four options ×
two languages × `/product` and the 18 products); on the exported files
**8 / 8** passed (`task-lamp` in every option and language: the H1 and the
design marker, the viewer, the grade guide, Watch, quantity 2 with its
total, Add to cart, Buy it now with the drawer, the phone bar's Add to
cart, no overflow at 390 px).

## V. Known limitations and deferred items

- **Option 1's viewer** takes the arrow keys only after one Tab from its
  Close button (§K). Its approved Auction Detail viewer is the same
  component, so it was left unchanged; a fix would focus the image area on
  open.
- **Option 3's approved Auction Detail** draws Sahel's avatar initials at
  4.43:1 (just under 4.5:1) in its seller panel. The product page passes a
  deeper colour; the Auction Detail was left as approved.
- **The grade guide** marks the grade with each option's existing wording
  ("This lot"); every Khaznah item carries a lot number, so it was kept.
- **Cart and checkout** are unchanged: the cart drawer is each option's
  existing one, and Checkout only explains the next step.
- **The old Round 2 product components** of Options 2–4 are no longer
  routed and stay in the tree, like the earlier phases' Round 2 files.
- **Logged from Phase D (not reopened):** on laptops about 768 px tall, the
  main Bid button of the Live Auction in Options 1 and 4 can need a short
  scroll.
- **Not started, as instructed:** Seller, Cart, Checkout, Account, System,
  Priority 3, backend integration, production migration.

## Self-review

1. **Same concept as its Home, Browse, Auction and Live pages?** Yes. Each
   page uses its option's chrome, tokens, type, buttons, Browse cards,
   Auction Detail gallery, viewer and grade dialog, and follows its Auction
   Detail's structure.
2. **Is the image strong?** Yes: the photograph is the largest element on
   the first screen in every option (Option 3 most of all), with
   thumbnails, zoom and the full-size viewer.
3. **Is the price clear?** Yes: the largest figure in each purchase surface,
   with the discount, the was price and the saving; "per case" where it
   applies.
4. **Is the stock clear?** Yes: a status in words and the count (with a
   meter in Options 1 and 4), four levels, tested on real products.
5. **Is Add to Cart obvious?** Yes: the filled primary button in each
   option's action colour, on the first screen from 768 px and in the phone
   bar.
6. **Is Buy It Now understandable?** Yes: the secondary button beneath; it
   adds the item and opens the cart, as before.
7. **Is the grade prominent?** Yes: beside the title and again in the
   condition report, with the guide one tap away.
8. **Does the seller build trust?** With real facts only: the store, city,
   years on Khaznah, live auctions and Buy Now items, pickup hours and the
   returns rule.
9. **Is 320 px mobile excellent?** Yes: no overflow, the bar fits in both
   languages, toasts clear it, nothing is hidden behind it.
10. **Is Arabic deliberate?** Yes: mirrored structure, left-to-right
    numbers, unmirrored photographs, direction-aware keys, labels that fit.
11. **Are the four distinct?** Yes (§G table): different first screens,
    purchase surfaces, stock signals, information layouts and phone bars.
12. **Is it recognisably Buy Now without making the brand
    ecommerce-first?** Yes: the page says Buy Now and fixed price and leads
    with Add to cart, while the navigation keeps auctions first and mixed
    lists put auctions first.
