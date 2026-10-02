# Khaznah — Timed Auction Detail redesign, all four options

Phase C of the client review pack. The timed auction page (`/auction` and
`/auction/[slug]`) now uses each option's approved Home and Browse design.
The four pages share one behaviour layer on top of the existing simulated
auction engine. Each option has its own layout, gallery, bid panel, lot
sections, bid history, dialogs and phone treatment.

- **Review links** (on the Vercel preview of this branch):
  - Option 1: `/en/concept-b/auction/fridge-690`
  - Option 2: `/en/concept-a/auction/fridge-690`
  - Option 3: `/en/concept-c/auction/fridge-690`
  - Option 4: `/en/concept-d/auction/fridge-690`
  - Arabic: replace `/en/` with `/ar/`. Other lots: replace `fridge-690`
    (see §H).
- **Screenshots:** `docs/client-review-auction-detail/` (20 review shots, the
  four-option comparison and the interaction evidence sheet; see its README).
- **Paths** below are relative to `design-preview/` unless they start at the
  repository root.
- **Amounts:** the pages show the Saudi riyal sign (⃁); this report writes
  "SAR" except where it quotes a label exactly.
- **Nothing else was redesigned.** Home and Browse are unchanged: no code
  change reaches them, and the pixel comparison with `b059d7e` differs only
  on pairs where the baseline also differs from itself (§P). The other inner
  pages are unchanged apart from the wording of their "Earlier prototype"
  note, which now says Home, Browse and Auction are new.

---

## A. Baseline

- **Branch:** `claude/magical-faraday-fne4kq`.
- **Starting commit:** `b059d7e` ("Close Browse redesign QA and remove
  obsolete prototypes").
- **Checks before editing:**
  - HEAD was exactly `b059d7e`;
  - HEAD matched `origin/claude/magical-faraday-fne4kq`;
  - the working tree was clean.
- **Comparison build:** a production build of `b059d7e` in a separate
  worktree, served next to the new build. Every before/after figure in this
  report compares those two builds.
- **Final commit:** the commit that adds this report, "Redesign auction
  detail for all four Khaznah concepts". A report cannot contain its own
  hash; `git log -1 --format=%H -- CLIENT_REVIEW_AUCTION_DETAIL_REPORT.md`
  prints it.

**Auction Detail before this change**

- **Option 1** (`concept-b`): the Option 1 auction page, on Option 1's own
  components.
- **Options 2–4** (`concept-a`, `concept-c`, `concept-d`): Round 2
  prototypes under the `(round2)` route group, labelled "Earlier prototype".
  Their `auction/*.jsx` files were recoloured copies of Option 1's
  structure.
- **One engine:** all four ran on `lib/useAuction.js`. That file is **not
  changed** by this work, and neither is any product record.

## B. Existing functionality audit

The audit was written before any implementation. All four options shared
the old behaviour, so one table covers them. "Kept" means the behaviour is
in all four new pages.

| Area | Auction Detail at `b059d7e` | New Auction Detail |
|---|---|---|
| Routes | `/auction` renders the featured lot (`fridge-690`) directly, with no redirect. `/auction/[slug]` is pre-rendered for every lot that is not Buy-Now-only (`dynamicParams = false`); an unknown or Buy-Now-only slug falls back to the featured lot. | **Kept**, same rules, for all four options (§C). |
| Breadcrumb | Home → Auctions (`/browse?tab=auction`) → Category (`/browse?category=…`) → lot. | **Kept** in all four, styled per option. |
| Identity | Category, lot number, phase badge, "Auction + Buy Now" badge, H1, grade chip, "What this grade means", source or item type, watchers, quantity badge on bulk lots. | **Kept.** Seller name and link now also sit in the identity block. |
| Gallery | Main image, thumbnails, previous/next, counter, arrow keys (mirrored in Arabic), swipe, 2× hover zoom on fine pointers, click → lightbox with thumbnails and arrows. | **Kept.** Options 2–4 use a new shared viewer (`ImageViewer`); Option 1 keeps its lightbox. Photos are never mirrored. |
| Bid panel | Phase + lot number; clock (Ends in / Starts in, digit cells, "Time extended", progress bar; hidden when closed); price label (Current bid / Starting bid / Winning bid / Sold for / Buy Now) flashing when it moves; bids, bidders, watching; typical market price + "x % below market"; bidder banner (highest, outbid, won, lost, sold, bought) with a polite live region. | **Kept**, redrawn per option. The clock also has one spoken phrase for screen readers (it was read cell by cell). |
| Bid form | "Your bid" with "Minimum next bid"; −/+ one increment (− disabled at the minimum); number field; Enter submits; error with `role="alert"`; three quick bids; "Place bid · SAR X"; rival bids raise the minimum and keep the field valid unless the bidder typed more. | **Kept.** The −/+ buttons now say "Lower your bid by ⃁ 50" / "Raise your bid by ⃁ 50" (they said "Decrease / Increase quantity", a label shared with the Product page). |
| Confirm step | "Confirm your bid" dialog: lot line, amount, deposit covered · wallet, binding note, anti-snipe note in the final 5 minutes; Cancel / Confirm bid. Success: toast, new current bid, history row "You", "highest" banner, flash. | **Kept**, one dialog per option. |
| Maximum (proxy) bid | Collapsible panel with an explanation, current maximum + Remove, field + "Save maximum" (Enter saves), error. Saving places an opening bid at the minimum when you are not leading; the proxy answers rival bids one increment at a time; "Auto-bid" rows in the history. | **Kept.** |
| Rival simulation | Rival bids every 20–42 s (9–16 s while you lead); outbid toast and banner; anti-snipe extension in the last 5 minutes. | **Kept** (engine unchanged). After a demo Buy Now the rivals stop. |
| Bid history | Five rows a page, "1–5 of 10", previous/next; You highlighted; Auto-bid and Highest tags; relative times that tick; "No bids yet — be the first." | **Kept.** Phones get a stacked list instead of the three-column table. |
| Buy Now (dual lots) | "Or buy it now" price + Buy it now (disabled when unavailable) + "Buying now closes this auction immediately." in a gold box, visually as strong as bidding. Confirm dialog (closes the auction; choose delivery or pickup at checkout) → lot sold, rivals stop, banner "You bought this lot with Buy Now", toast. | **Kept and demoted:** an outlined secondary action under the bid controls in all four (§J). |
| Lot information | Highlights; description; specifications; condition report ("Condition grade disclosed"); seller card (name → storefront, warehouse, city, member since, active auctions, Buy Now items, Visit store); delivery, pickup (city + hours), returns. | **Kept.** |
| Grade guide | Modal with Electronics / Non-electronics tabs (arrow keys, mirrored in Arabic), the lot's grade highlighted, works / not working, returns note. | **Kept.** Option 1 keeps its modal; Options 2–4 have their own, whose tabs also take Home and End. |
| Terms | Deposit, anti-snipe, payment within 24 h, increment, binding bids, returns. | **Kept**, existing copy only. |
| Manifest | Bulk lots with a pallet manifest (`electronics-pallet`): lines with image, grade, quantity and the unit total. `laptop-bags-24` has a quantity but no manifest. | **Kept.** |
| Similar auctions | Up to 10 auctions (same category first, then open auctions; never this lot or sold lots); View all → `/browse?tab=auction`; anchor `#similar-auctions`. | **Kept.** Options 2–4 show four of them as their Browse cards; Option 1 keeps its rail of up to 10. |
| Upcoming lots | Note + Watch / Watching toggle with a toast; no bid form. | **Kept.** |
| Closed lots | Disabled Place bid + "Similar auctions" link. | **Kept**, plus the winning bidder's name from the history. |
| Watch / Share | Watch toggles the shared watchlist (toast); Share copies the URL (toast "Link copied"). | **Kept.** |
| Phones | Fixed 76 px bar + safe area (price label + amount, countdown, Bid now / Watch / disabled Sold); a bid sheet with the full form, maximum bid and notes; the sheet closes before the confirm dialog opens. | **Kept and redesigned per option** (§K). |
| EN / AR, RTL | Yes. | **Yes, reviewed per option** (§L). |
| Static export | Every slug pre-rendered. | **Kept** (§C). |

**Gaps fixed on the way:** the −/+ labels, the cell-by-cell countdown and
the three-column history table on phones (all three noted above).

## C. Architecture

**Shared behaviour, concept-specific visuals.** Nothing visual is shared
between the options apart from what each option already took from its own
Home and Browse. There is no component that switches on the option.

### Shared layer (`components/shared/auction/`, new)

| File | What it does |
|---|---|
| `hooks.js` | Behaviour only. `resolveAuctionLot` (route → lot, featured fallback) and `similarAuctions`. `useAuctionDetail`: the page's flow around the engine (confirm step, Buy Now, phone sheet, grade guide; after Buy Now the lot reads as sold and rivals stop). `useLotInfo`, `useFulfilment`, `useAuctionTerms`: display-ready facts. `useAuctionClock` + `spokenDuration` (one phrase, Arabic plural forms) and `usePhaseLabel`. `useBidForm` (−/+, quick bids, validation, Enter, ARIA wiring), `useMaxBid`, `useBidderStatus`, `useWinner`. `useHistoryPages`, `useBidRow`. `useShareLink`, `useTabs` (accessible tabs), `useHoverZoom`. |
| `copy.js` | The new strings, English and Arabic (status names, spoken clock, bid sheet, sold / bought texts, history and manifest labels, grade guide labels). Everything else reuses the existing `data/ui.js` and concept copy. |
| `ImageViewer.jsx` | Full-screen gallery viewer for Options 2–4 (counter, previous/next, thumbnails, arrow keys anywhere in the viewer, Escape). Built on the existing `Modal` (`variant="sheet"` on phones), so focus trap, scroll lock and focus return come from the existing overlay code. Each option passes its own skin. |

The engine (`lib/useAuction.js`), the product data and the shared overlay
primitives are **unchanged**.

### Option folders

- **Option 1:** `components/concept-b/auction/` (rewritten in place).
- **Option 2:** `components/concept-a/premium-modern/auction/` (new).
- **Option 3:** `components/concept-c/visual-discovery/auction/` (new).
- **Option 4:** `components/concept-d/saudi-commerce/auction/` (new).

Options 2–4 each have the same six files, each written for that option:
the page shell, `AuctionView`, `Gallery`, `Bidding` (status, bid form,
maximum bid, notes, panel, Buy Now, phone bar, bid sheet), `LotSections`
(facts, about, seller, delivery, history, terms, manifest, similar) and
`Dialogs` (confirm bid, confirm Buy Now, grade guide).

### Routes

- **Option 1:** unchanged routes (`app/[lang]/concept-b/auction/…`).
- **Options 2–4:** the routes move out of the `(round2)` group to
  `app/[lang]/concept-{a,c,d}/auction/page.js` and `…/auction/[slug]/page.js`,
  so they get the option's Home/Browse chrome and no "Earlier prototype"
  note. Same rules as before: `/auction` renders the featured lot;
  `[slug]` pre-renders every lot that is not Buy-Now-only, with
  `dynamicParams = false`; page titles carry the lot title.
- **Theme before paint:** the pre-paint script in `app/[lang]/layout.js`
  now also marks the Options 2–4 auction routes as new-design pages, so
  they load in their light design without a flash.

### Presentation status

- The start page tags **Home, Browse and Auction** as "New design" for
  Options 2–4, and its notes and fact chip say the same (EN and AR).
- The presentation bar lists Home, Browse and Auction first for Options
  2–4, then the earlier prototypes after a divider, and shows **Light only**
  on the new auction pages. Option 1's bar is unchanged.
- The auction pages of Options 2–4 no longer carry the "Earlier prototype"
  note. Product, Live auction, Seller and Components keep it, with the
  wording now naming Home, Browse and Auction as the new pages.
- Checked by `.scratch/ad/smoke.mjs` on the final build: the note on all
  four other pages of Options 2–4 (EN and AR, desktop and phone wording),
  `/auction` opening the featured lot in every option with no note, the
  selector tags and the bar order and Light-only state: **74 / 74 passed**.
  Nothing on these pages implies that Live auction, Product, Seller, Cart,
  Checkout or Account are finished.

### Builds (final tree)

All on the code in the final commit:

- `npm run lint`: no errors, no warnings.
- `npm run build`: compiled; 335 / 335 pages generated; no warnings.
- `STATIC_EXPORT=1 npm run build` (output `out/`): compiled; 335 / 335
  pages; no warnings. All **96** auction files exist (the 11 auction lots
  plus `/auction`, × 4 options × 2 languages). Served as plain files on a
  static server (`.scratch/ad/export-smoke.mjs`), each option in each
  language opens `/auction/` on the featured lot, takes a bid through the
  confirm step (current bid 3,200, history row "You") and opens the pallet
  lot: **8 / 8 passed**.
- The normal build was restored afterwards.

## D. Option 1 — Modern Commerce (`concept-b`)

**Approach:** structured, practical and information-rich, like Option 1's
Browse. Indigo actions, navy accents, gold highlights, 12 px cards and
clear badges. It can carry the most above the fold.

**Desktop (≥ 1280 px)**

1. **White lot band** (like Browse's summary band): breadcrumb; status
   badge, "Auction + Buy Now" badge, quantity badge on bulk lots, lot
   number; the H1; a meta row with grade chip, "What this grade means",
   source, "Sold by" seller link and watchers; **Watch** and **Share** on
   the right.
2. **Three columns:**
   - the gallery (vertical thumbnails, arrows, counter, zoom, lightbox);
   - a dense **lot sheet**: "Lot details" grid (lot, category, item type,
     source, quantity, grade, starting bid, increment, typical market price,
     pickup), the condition report and highlights;
   - a **sticky bid panel** (380 px) that stays below the header:
     - navy clock head: status, lot number, hour · minute · second cells,
       "Time extended" badge, a thin gold progress bar;
     - current bid with bids · bidders · watching;
     - typical market price with an accent "41 % below market" badge;
     - bidder banner, bid form, quick bids, "Place bid · SAR 3,200";
     - maximum bid, deposit and anti-snipe notes;
     - Buy Now after a dashed rule: price and a small outlined button.
3. **Below:** about this lot with specifications, seller summary, delivery
   and returns; then bid history (compact table) beside the auction terms;
   the manifest on bulk lots; the similar-auctions rail (up to 10).

**Tablet (768–1279 px):** gallery and sections in one column beside the
sticky panel (320 px, 360 px from 1024).

**Phone:** lot band, gallery, then a **compact bid summary** (clock,
price, figures, market price, banner, "Place bid", Buy Now) before the lot
sheet. A fixed 76 px bar and a bottom sheet with the full form (§K).

**Components**

- `AuctionView.jsx`: page layout (rewritten).
- `AuctionHeader.jsx` (new): the lot band.
- `LotSheet.jsx` (new): `LotFacts` and `LotAbout`.
- `BidBox.jsx`, `BidBoxParts.jsx`, `AuctionClock.jsx`, `BidForm.jsx`,
  `MaxBidPanel.jsx`, `BidderBanner.jsx`, `BidHistory.jsx`,
  `AuctionTerms.jsx`, `MobileBid.jsx`: rewritten on the shared hooks.
- `AuctionDialogs.jsx`: unchanged (the `/system` page also uses it).
- `pages/AuctionPage.jsx`: uses `resolveAuctionLot`.

## E. Option 2 — Premium Modern Marketplace (`concept-a`)

**Approach:** editorial and warm, like Option 2's Home and Browse. Ivory
page, charcoal type, brass and bronze accents, stone panels, hairlines and
generous space. Restrained, but bidding stays above the fold.

**Desktop (≥ 1200 px)**

1. Slash breadcrumb.
2. **Two columns (7 : 5):**
   - left: a **large gallery on a stone plate** (5 : 4), "01 / 03" counter,
     square previous/next, expand button, underlined thumbnail strip, hover
     zoom, full-screen viewer;
   - right:
     - brass-dash eyebrow "AUCTION + BUY NOW" and lot number;
     - the H1 in the editorial title size;
     - "Sold by" seller link, source, grade pill, "What this grade means";
     - a status line: status dot, a **red "Ends in 5h 40m"** (the only red
       on the page), watchers, square Save and Share;
     - the **charcoal bid panel**: current bid, bids · bidders, market price
       with "41 % below market" in brass, white bid field with −/+, quick
       bids, a **brass "Place bid · SAR 3,200"**, maximum bid, notes;
     - Buy Now as a quiet line below the panel, after a hairline: "Or buy it
       now", price, outlined "Buy it now".
3. **Stone band:** "About this lot" (brass dash), description, highlights
   with brass dashes and the condition report; lot details and
   specifications as hairline fact lists.
4. **Bid history** (hairline table) beside the seller, delivery and returns,
   and numbered terms (01–06).
5. Manifest on bulk lots; **four similar auctions** as Option 2's Browse
   cards.

**Tablet (768–1199 px):** identity across the top, gallery beside the bid
panel, then the same sections.

**Phone:** gallery, identity, a short charcoal summary with Place bid and
the Buy Now line, then the sections. A 72 px ivory bar and a bottom sheet
(§K).

**Components:** `PremiumModernAuction.jsx` (shell: header, menu, cart,
newsletter, footer), `AuctionView.jsx`, `Gallery.jsx`, `Bidding.jsx`,
`LotSections.jsx`, `Dialogs.jsx`; `styles/r3-premium-modern.css` gains the
`.pr-lot-title` size (with Arabic sizes).

## F. Option 3 — Visual Discovery Marketplace (`concept-c`)

**Approach:** image-forward and bright, like Option 3's Browse. White page,
indigo, navy and gold, pills everywhere, the coral countdown on the photo,
discovery at the end.

**Desktop (≥ 1200 px)**

1. Dot breadcrumb.
2. **Two columns (7 : 5):**
   - left: the photograph **large on a softly tinted plate**, the **coral
     time pill on the photo**, a heart (watch) disk, counter and round
     previous/next disks, rounded thumbnail tiles, full-screen viewer;
   - right:
     - status chips: "Open for bids", "Auction + Buy Now", quantity, lot
       number;
     - the H1 as a display title;
     - seller avatar and name, watchers, a Share pill;
     - grade chip, "What this grade means", source;
     - a **rounded bid card**: coral clock pill in its head, current bid,
       bids / bidders / watching chips, below-market chip, pill bid field
       with round −/+, pill quick bids, an **indigo "Place bid · SAR 3,200"**,
       maximum bid, notes;
     - Buy Now as a soft ivory row under the card with an outlined pill.
3. **The lot's story:** fact chips, description, **highlight tiles**; a
   condition card and a specifications panel beside it.
4. **Seller on a navy card** with Delivery, Pickup and Returns tiles.
5. **Bid history as a timeline** (bidder discs, the highest row in gold)
   beside the terms panel.
6. Manifest as photo tiles on bulk lots; **similar auctions led by
   discovery chips** (the lot's category, "Ending within 1 hour", Timed
   auctions) and four Option 3 Browse cards.

**Tablet (768–1199 px):** gallery beside identity and the bid card, then
the sections.

**Phone:** gallery with the coral pill, chips, title, a short bid card,
the Buy Now row, then the sections. A **floating navy pill bar** and a
bottom sheet (§K).

**Components:** `VisualDiscoveryAuction.jsx`, `AuctionView.jsx`,
`Gallery.jsx`, `Bidding.jsx`, `LotSections.jsx`, `Dialogs.jsx`;
`styles/r3-visual-discovery.css` gains `.vd-lot-title`.

## G. Option 4 — Contemporary Saudi Commerce (`concept-d`)

**Approach:** practical, ordered retail, like Option 4's Browse. Cream,
sage and forest green, framed panels, 9 px corners, a restrained red clock.

**Desktop (≥ 1200 px)**

1. **Cream lot band** (like Browse's cream search band): arrow breadcrumb,
   green "Auction + Buy Now" tag and lot number, the H1, "Sold by" link,
   grade, "What this grade means", source, watchers; framed **Watch** and
   **Share** on the right.
2. **Two columns:** the gallery and every lot section on the left; on the
   right a **framed bid panel (400 px) that stays in view**:
   - sage head: green "Open for bids" chip and the red "Ends in 5h 40m" on
     a white chip;
   - current bid, "23 bids · 9 bidders · 118 watching", market price and
     "41 % below market";
   - bid field with −/+, quick bids, a **green "Place bid · SAR 3,200"**;
   - maximum bid and notes;
   - Buy Now under a rule: price and an outlined button.
3. **Three sage blocks:** Condition report, Sold by (with figures and Visit
   store), Delivery & returns.
4. About this lot with highlights; lot details and specifications tables.
5. Bid history table beside the terms (sage panel with check marks).
6. Manifest table on bulk lots; four Option 4 Browse cards.

**Tablet (768–1199 px):** the same two columns with a 330 px panel. The
sage blocks stack until 1024 px.

**Phone:** lot band, gallery, a short panel (status, clock, price, Place
bid, Buy Now), then the sections. A 74 px white bar and a bottom sheet
(§K).

**Components:** `SaudiCommerceAuction.jsx`, `AuctionView.jsx`,
`Gallery.jsx`, `Bidding.jsx`, `LotSections.jsx`, `Dialogs.jsx`;
`styles/r3-saudi-commerce.css` gains `.sc-lot-title`.

### Why the four read differently

| | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| Page head | White lot band with badges and actions | Editorial eyebrow beside the gallery | Chips and a display title beside the gallery | Cream band with tags and framed actions |
| Gallery | Vertical thumbnails, white plate | Large stone plate, square controls | Tinted plate, coral clock on the photo | Light plate, framed |
| Bid panel | Sticky, navy clock with digit cells, indigo button | Charcoal panel, brass button | Rounded white card, coral pill, indigo button | Sticky framed panel, sage head, green button |
| Lot information | Dense facts sheet beside the gallery | Stone band, hairline lists | Chips, tiles, navy seller card | Sage blocks and tables |
| History | Compact table | Hairline table | Timeline | Practical table |
| Similar | Rail of up to 10 | Four editorial cards | Discovery chips + four cards | Four practical cards |
| Phone bar | 76 px, white | 72 px, ivory | Floating navy pill | 74 px, white |

## H. State coverage

One system covers every state; each option was checked in each state.

| Lot | State | What the page shows |
|---|---|---|
| `fridge-690` | Live, Auction + Buy Now | Clock, current bid, full bid form, maximum bid, secondary Buy Now. |
| `seat-covers` | Live, closing now (< 10 min) | "Closing now" status and the clock in each option's urgent colour; no flashing and no oversized timer. |
| `leather-sofa` | Upcoming | "Upcoming", "Starts in …", starting bid, no bid form and no bid figures; Watch / Watching (the reminder) instead of Place bid. |
| `robot-vacuum` | Sold | "Sold", "Sold for", winning bidder, disabled Place bid, "Similar auctions" link to the section; clock hidden; phone bar shows a disabled Sold. |
| `laptop-bags-24` | Bulk carton | "Carton · 24 units" badge and quantity row; carton terms; no manifest (the lot has none). |
| `electronics-pallet` | Bulk pallet | "Full pallet · 64 units", the six-line manifest with the unit total. |
| `dishwasher` | Standard live | Auction only: no Buy Now anywhere. |

**State QA** (`.scratch/ad/states.mjs`, production build): every lot above
× 4 options × English and Arabic × 1440 and 390 px = **112 pages**. Each
page is checked for HTTP 200, one H1 equal to the lot title, no page
overflow, no broken images, no console errors, the new-design marker
(Options 2–4), the status text, the actions the state allows (enabled Place
bid or phone bar while live; Starts in + Watch and no Place bid while
upcoming; Sold for + winner + disabled Place bid + similar link + disabled
phone bar when sold), Buy Now on the dual lot only, quantity and manifest
rows on bulk lots, and similar lots that are auctions only.

Result: **112 / 112 pages passed** on the final build. (On the first run
the Option 1 pallet manifest was reported missing: the check looked for a
section, and Option 1 shows the manifest, as before, as a table with a
caption. The check now accepts either.)

## I. Bid flow

**Interaction QA** (`.scratch/ad/interact.mjs`) on the production build,
per option, in English and Arabic, on `fridge-690`. Steps 1–20 at 1440 px,
21–26 on a 390 px phone. It runs in real time (no fake clock) with a seeded
random generator, so the simulated rival bids arrive at the same moments
on every run.

| # | Step | Checked |
|---|---|---|
| 1 | Load | One H1. |
| 2 | Watch | Pressed state on, toast, label changes, off again. |
| 3 | Share | "Link copied" toast. |
| 4 | + | Raises the bid by one increment (3,200 → 3,250). |
| 5 | − | Lowers by one increment; disabled at the minimum. |
| 6 | Quick bid | Opens the confirm step with that amount. |
| 7 | Too low | Refused; the error is announced (`role="alert"`) and the field is marked invalid. |
| 8 | Valid amount | Typed, error cleared; **Enter** submits. |
| 9 | Place bid | Confirm dialog opens with the amount; focus inside. |
| 10 | Cancel | Closes, focus back on Place bid, nothing placed. |
| 11 | Submit again | Dialog reopens. |
| 12 | Confirm | "Bid placed" toast. |
| 13 | Update | Current bid, history row "You", "Highest", banner announced. |
| 13b | Outbid | A simulated rival outbids you; the change is announced and the history updates. |
| 14 | Maximum bid | Refuses a too-low maximum, saves a valid one, removes it, saves again; a rival bid arrives and the proxy answers. |
| 15 | Grade guide | Opens, two tabs, arrow keys, Escape closes, focus returns. |
| 16 | History pagination | Page 2 shows "6–10 of 12". |
| 17 | Similar auction | The link opens another auction lot. |
| 18 | Buy Now is secondary | Below Place bid and much smaller (§J). |
| 19 | Buy Now cancel | Dialog with the Buy Now price; Cancel; focus back. |
| 20 | Buy Now success | Lot sold, bidding off, rivals stopped. |
| 21 | Phone bar | Fixed at the foot of the screen. |
| 22 | Sheet | Opens with the full form, quick bids and maximum bid. |
| 23 | Focus | Moves into the sheet. |
| 24 | Escape | Closes the sheet. |
| 25 | Focus return | Back on Bid now. |
| 26 | Trap | Tab stays inside; the page behind does not scroll. |
| 26b | Footer | The page's last line ends above the bar. |

Result: **224 / 224 checks passed** (28 checks × 4 options × 2 languages)
on the final build.

The interaction evidence sheet (`docs/client-review-auction-detail/
auction-detail-interaction-evidence.jpg`) shows Option 2's confirm dialog,
maximum bid, Buy Now confirmation, upcoming lot, sold lot and phone bid
sheet.

## J. Buy Now on dual-mode lots

Bidding stays the primary path in every option. Buy Now is kept (it is a
real sale mode of the lot) but set apart:

- **Order:** current bid → Place bid → a rule → "Or buy it now SAR 4,600".
- **Weight:** an outlined or quiet button, never a filled one; a smaller
  price than the current bid.
- **Measured** (step 18): the Buy Now button is below Place bid in all
  four, and its area is 17–23 % of Place bid's.

| Option | Treatment |
|---|---|
| 1 | Dashed rule at the foot of the panel; small outlined "Buy it now". |
| 2 | A hairline line under the charcoal panel, outside it; outlined button. |
| 3 | A soft ivory row under the bid card; outlined pill. |
| 4 | Under a rule inside the framed panel; outlined button. |

**Kept behaviour:** Buy Now is disabled when the engine says it is no
longer available (bidding passed the Buy Now price, or the auction closed).
The confirm dialog keeps both notes ("Buying now closes this auction
immediately." and "Choose delivery or pickup at checkout to complete your
purchase."); Cancel closes it with focus returned; Buy it now marks the lot
sold, stops the rival bids, shows "You bought this lot with Buy Now" and the
toast "It's yours — the auction is closed". The 24-hour payment window for
winning bids is in the auction terms, as before. Lots that are auction only
(`dishwasher`, `seat-covers`, …) show no Buy Now anywhere.

## K. Mobile bidding

| Option | Phone bar | Bid sheet |
|---|---|---|
| 1 | 76 px white bar: price label and amount, countdown pill, indigo "Bid now" (Watch while upcoming, disabled Sold / Ended once closed). | Existing `DialogPanel` sheet: title, lot, price, clock, banner, full form, maximum bid, notes. |
| 2 | 72 px ivory bar: "Current bid", amount, red time, charcoal "Bid now". | Ivory bottom sheet: title, lot, price and time, banner, the form in its light version, maximum bid, notes. |
| 3 | Floating navy pill: coral time pill, amount, gold "Bid now". | Rounded bottom sheet: title, lot, price chips, status, form, maximum bid, notes. |
| 4 | 74 px white bar: "Current bid", amount, red time, green "Bid now". | Bottom sheet with a sage head (title, lot), price, time, status, form, maximum bid, notes. |

- Above the bar, each phone page shows a **short bid summary** under the
  gallery (status, time, current bid, Place bid, Buy Now), so the bid is
  visible without scrolling far.
- **Sheet behaviour** (steps 22–26, all options, EN and AR): focus moves in,
  Tab is trapped, the page behind does not scroll, Escape closes, focus
  returns to "Bid now". Confirming from the sheet closes the sheet before
  the confirm dialog opens.
- **Nothing hidden behind the bar:** each page keeps a spacer the height
  of its bar plus the safe area under the footer (step 26b, and the sweep
  in §M checks the footer's last line against the bar at every phone width).
- **Very narrow phones (< 380 px):** Option 3's pill drops its icons and
  tightens, and Option 1's upcoming bar leaves "Starts in" to screen
  readers, so the amount is never cut (§M).

## L. English and Arabic (RTL)

Reviewed per option at 1440, 1024 and 390 px in both languages
(screenshots in `docs/client-review-auction-detail/`).

- **Mirrored:** page grids (the bid panel moves to the left), breadcrumbs
  and their arrows, identity blocks, chips and badges, gallery controls and
  thumbnail order, panel content, history (bidder on the right), pagination
  arrows, terms, similar cards and rails, phone bars and sheets.
- **Not mirrored:** photographs; amounts, the riyal sign and digits (LTR
  runs inside RTL text); the bid field (LTR: riyal sign, then the number;
  − stays on the start side of the field in each language).
- **Keyboard:** gallery and grade-guide arrow keys follow the reading
  direction.
- **Copy:** every new string has an Arabic version (`copy.js`), including
  the spoken clock with Arabic plural forms ("5 ساعات و40 دقيقة"). No
  English is hard-coded. Terms used: مزايدة, المزايدة الحالية, سعر البداية,
  الحد الأدنى للمزايدة التالية, قيمة الزيادة, شراء فوري, الوقت المتبقي,
  يبدأ خلال, مُباع / انتهى, سجل المزايدات, شروط المزاد, الدرجة, البائع,
  مزادات مشابهة.
- **Typography:** each option's Arabic sizes (the option CSS already sets
  them for Home and Browse); the new title classes add Arabic sizes too.

## M. Responsive QA

All on the production build, four options × English and Arabic.

| Check | Widths | Pages | Result |
|---|---|---|---|
| Sweep (`sweep.mjs`): page overflow, elements past the viewport, broken images, console errors, bid action visible and inside the viewport, phone footer clear of the bar | 1920, 1440, 1366, 1280, 1200, 1024, 768, 480, 430, 390, 360, 320 | 96 | **96 / 96** |
| Clipped text (`clip.mjs`): text drawn past its own box, or a price cut by truncation | the same 12 | 96 | **96 / 96** |
| Clipped text, every other test lot | 1440, 1024, 900, 768, 390, 360, 320 | 336 | **336 / 336** |
| Overlapping text and controls (`overlap.mjs`) | the same 12 | 96 | **96 / 96** |
| Overlapping text and controls, every other test lot | 1440, 1024, 768, 390, 320 | 240 | **228 / 240** (see below) |

**The 12 overlap findings left** are all the same one, and it is not in
the auction page's own design: on a 320 px phone, Option 4's Browse card for
the dual lot (`fridge-690`, "Auction + Buy Now") lets the heart overlap the
end of its truncated tag. The card is Option 4's Browse card, reused as is
for similar auctions, so it appears on the six other lots' pages (EN and
AR). The baseline Browse page at `b059d7e` shows exactly the same overlap.
Browse is frozen in this phase, so the card was not changed (§R).

**Defects these checks found, now fixed:**

1. **Option 4, 768–1023 px:** the three sage blocks were squeezed into
   three columns beside the panel, cutting words ("Conditi… report"). They
   now stack below 1024 px.
2. **Option 3, 320 px:** the floating bar cut the amount ("SAR 3,1…"). The
   pill now drops its icons and tightens below 380 px.
3. **Option 1, 320–379 px, upcoming lot:** the "Starts in" pill pushed the
   "Starting bid" label into the amount. Below 380 px the words "Starts in"
   are kept for screen readers only.
4. **Option 2, Arabic, every width:** the "01 / 03" counter sat under the
   previous/next buttons (its `dir="ltr"` also flipped its position). The
   digits now run LTR inside a badge that follows the page direction.

**Tablet (1024 and 768 px):** no three-column squeeze (Option 1 drops to
two columns below 1280 px; Options 2–4 use two columns); bid panels are
320–400 px wide; thumbnails stay in one row; tables keep their columns and
switch to lists only on phones.

## N. Accessibility

**axe** (WCAG 2.1 A and AA rules, `.scratch/ad/axe.mjs`), per option and
language: the live, upcoming, sold and pallet lots at 1440 px; the confirm
bid, Buy Now, grade guide and image viewer dialogs; the phone page and the
phone bid sheet at 390 px. That is 10 scans × 4 options × 2 languages = 80
scans. Result: **0 serious or critical violations in all 80 scans**, and no
minor ones either.

**Keyboard QA** (`.scratch/ad/kbd.mjs`), per option and language: gallery
arrow keys (mirrored in Arabic); the viewer opens with Enter, arrows move,
Escape closes, focus returns; Tab reaches the bid field with a visible focus
ring at every stop. Result: **8 / 8 passed** (4 options × 2 languages).
Option 1's lightbox (unchanged) takes its arrow keys from the image area;
Options 2–4's viewer takes them from the first focus (§R).

**What the pages provide**

- One H1 (the lot title); sections with headings; a skip link.
- Bid field: a visible label, the minimum as its description, the error
  linked with `aria-describedby` and `aria-invalid`, and announced with
  `role="alert"`.
- Bidder status (highest, outbid, won, …) in a polite live region; not
  repeated by the copy inside the phone sheet.
- Countdown: one spoken phrase ("Ends in: 5 hours 40 minutes"), not digit
  cells.
- Status is always written, never colour alone (Open for bids, Closing now,
  Upcoming, Sold).
- Dialogs: `role="dialog"`, labelled, focus moved in and trapped, Escape,
  focus returned, background scroll locked.
- Grade guide tabs: `tablist` / `tab` / `tabpanel` with arrow keys
  (Options 2–4 also Home / End).
- Watch and Save: `aria-pressed`; in Options 2–4 the label also names the
  lot. Share has a label.
- History: a table with column headers in Options 1, 2 and 4 (a list on
  phones); an ordered list in Option 3's timeline.
- −/+ buttons say what they do ("Raise your bid by ⃁ 50").

**Contrast fixes made during QA:** Option 1's below-market badge, Option 2's
amount on brass and Option 4's red clock on sage (now on a white chip).

## O. Performance

Same lot (`fridge-690`), production builds, scrolled to the end
(`.scratch/ad/perf.mjs`). Transfer sizes as served by `next start`.

At 1440 px; phones load the same scripts, styles and fonts.

| Option | Build | Requests | JS | CSS | Images loaded (before scrolling) | Image bytes | Fonts | DOM nodes |
|---|---|---|---|---|---|---|---|---|
| 1 | `b059d7e` | 64 | 1,180 KB | 228 KB | 11 (11) | 92 KB | 175 KB | 1,208 |
| 1 | new | 65 | 1,196 KB | 240 KB | 11 (11) | 92 KB | 175 KB | 1,407 |
| 2 | `b059d7e` | 62 | 1,273 KB | 235 KB | 9 (9) | 79 KB | 283 KB | 1,230 |
| 2 | new | 61 | 1,312 KB | 248 KB | 7 (3) | 224 KB | 329 KB | 933 |
| 3 | `b059d7e` | 66 | 1,281 KB | 238 KB | 11 (11) | 92 KB | 229 KB | 1,283 |
| 3 | new | 62 | 1,368 KB | 251 KB | 7 (3) | 224 KB | 353 KB | 972 |
| 4 | `b059d7e` | 68 | 1,282 KB | 238 KB | 11 (11) | 92 KB | 296 KB | 1,269 |
| 4 | new | 62 | 1,363 KB | 251 KB | 7 (3) | 224 KB | 199 KB | 1,009 |

- **No new libraries.** The pages use the existing engine, overlays, Motion
  and icons.
- **JavaScript:** +16 KB (Option 1), +39 KB (Option 2), +87 KB (Option 3)
  and +81 KB (Option 4). Options 2–4 now load their Home/Browse shell
  (header, menu and cart layers, footer) instead of the lighter Round 2
  chrome, plus their own auction components. CSS grows by 12–13 KB.
- **Images:** the four similar-auction cards in Options 2–4 use the same
  cut-out images as their Browse cards (one of them, the TV cut-out, is
  125 KB on its own); similar-auction images are lazy-loaded, only the main
  photo is eager. The gallery requests the same files as before.
- **Fonts:** the new pages load their option's Home/Browse fonts instead
  of the Round 2 fonts.
- **DOM:** smaller in Options 2–4 (four similar cards instead of a rail of
  nine); larger in Option 1 (the lot sheet and the phone summary).
- **Renders:** the clock and rival bids re-render only the engine's
  consumers, as before; no new timers were added.

## P. Home and Browse regression

`b059d7e` and the new build, side by side, through
`.scratch/nav/regress-chrome.mjs`: Home and Browse, English and Arabic, at
1440, 1024, 390 and 320 px, per option — 16 pairs per option, 64 in all.
Each pair is a full-page capture of both builds after the same frozen
clock, image loading and font loading, compared pixel by pixel in three
bands (header, content, footer).

Result:

| Run | Identical pairs | Pairs that differed |
|---|---|---|
| Final build, machine busy with other tests | 62 / 64 | Option 4 Home: EN 1024 (7 px), AR 1440 (81 px) |
| Final build, quiet machine | 61 / 64 | Option 3 Home AR 1024 (6,878 px); Option 4 Home EN 1024 (42 px), AR 1024 (7 px) |
| **Control:** `b059d7e` compared with itself | 61 / 64 | Option 3 Home AR 1024 (6,878 px); Option 4 Home EN 1024 (15 px), AR 1440 (3 px) |

The differences are not caused by this work:

- **The control shows them too.** Comparing the untouched baseline build with
  itself gives the same differences on the same pages, including exactly the
  same 6,878 px on Option 3's Arabic Home at 1024 px (a seller rail that
  settles at a slightly different scroll position between two loads).
- **They move between runs**, and they are tiny on Option 4 (one-pixel rows
  of anti-aliasing at the edges of images that finish decoding at different
  moments).
- **No Home or Browse code changed.** The only edits that reach those pages
  are comments (`Layers.jsx`, layouts) and three new CSS classes
  (`.pr-lot-title`, `.vd-lot-title`, `.sc-lot-title`) that only the auction
  views use.

CSS file hashes changed (the option style sheets gained the new title
classes), but no Home or Browse pixel changed.

## Q. Files changed

**New**

- `components/shared/auction/`: `copy.js`, `hooks.js`, `ImageViewer.jsx`.
- `components/concept-b/auction/`: `AuctionHeader.jsx`, `LotSheet.jsx`.
- `components/concept-a/premium-modern/auction/`: `PremiumModernAuction.jsx`,
  `AuctionView.jsx`, `Gallery.jsx`, `Bidding.jsx`, `LotSections.jsx`,
  `Dialogs.jsx`.
- `components/concept-c/visual-discovery/auction/`: the same six, with
  `VisualDiscoveryAuction.jsx` as the shell.
- `components/concept-d/saudi-commerce/auction/`: the same six, with
  `SaudiCommerceAuction.jsx` as the shell.
- `app/[lang]/concept-{a,c,d}/auction/page.js` and
  `…/auction/[slug]/page.js`.
- `docs/client-review-auction-detail/` (repository root): 20 screenshots,
  the comparison, the evidence sheet and a README.
- `CLIENT_REVIEW_AUCTION_DETAIL_REPORT.md` (repository root): this report.

**Changed**

- `components/concept-b/auction/`: `AuctionView.jsx`, `BidBox.jsx`,
  `BidBoxParts.jsx`, `AuctionClock.jsx`, `BidForm.jsx`, `MaxBidPanel.jsx`,
  `BidderBanner.jsx`, `BidHistory.jsx`, `AuctionTerms.jsx`, `MobileBid.jsx`;
  `components/concept-b/pages/AuctionPage.jsx`.
- `styles/r3-premium-modern.css`, `styles/r3-visual-discovery.css`,
  `styles/r3-saudi-commerce.css`: the lot title class.
- `app/[lang]/layout.js`: the pre-paint route pattern.
- `app/[lang]/concept-{a,c,d}/layout.js`, `components/concept-{a,c,d}/…/Layers.jsx`:
  comments only.
- `lib/routes.js`: `NEW_DESIGN_PAGES` adds `auction`.
- `components/shared/presentation/PresentationBar.jsx`: new-design pages
  listed first for Options 2–4 (Home, Browse, Auction, then the earlier
  prototypes after a divider); "Light only" on the auction page.
- `components/shared/presentation/PrototypeNotice.jsx` and
  `selector-copy.js`: wording now names Home, Browse and Auction (EN and AR).
- `design-preview/README.md`, `CLIENT_PREVIEW_GUIDE.md` (repository root):
  Auction listed as a new-design page.

**Removed**

- `app/[lang]/concept-{a,c,d}/(round2)/auction/page.js` and
  `…/auction/[slug]/page.js` (replaced by the new routes).

**Not changed:** `lib/useAuction.js`, `data/*`, the shared overlay and UI
primitives, every Home and Browse component, the Product, Live auction,
Seller and Components pages (apart from their note's wording).

## R. Known limitations

- **Sample data.** Bidders, history, watchers and the winner of a closed lot
  come from the existing sample history; the rival bids are simulated, as
  before. No backend capability was added or implied.
- **Round 2 auction components of Options 2–4 are now unrouted**
  (`components/concept-{a,c,d}/auction/*`, `pages/AuctionPage.jsx`). They are
  kept for a later cleanup because `AuctionDialogs.jsx` in each folder is
  still used by that option's `/system` page.
- **Option 4's Browse card at 320 px:** on the dual lot's card ("Auction +
  Buy Now"), the heart overlaps the end of the truncated tag. It is the same
  on Browse at `b059d7e`; the card is reused unchanged for similar auctions
  because Browse is frozen in this phase. Suggested fix for the next Browse
  pass: keep the tag clear of the heart (end padding on the card's top row).
- **Toasts on phones** briefly cover the bid bar (the shared Toaster is
  unchanged; it was the same before).
- **Option 1's lightbox** (an unchanged product component) takes arrow keys
  when focus is on its image area, not anywhere in the dialog. Options 2–4's
  new viewer takes them anywhere.
- **Screen-reader amounts** include the riyal sign and "Saudi riyals" (the
  existing `moneyText` pattern).
- **Presentation bar order** for Options 2–4 now lists Home, Browse and
  Auction first, then the earlier prototypes; Option 1's order is unchanged.
- **QA method:** interaction tests run in real time with a seeded random
  generator; screenshots use a frozen clock. Timings in a real browser
  differ slightly (rival bids are random there).
- **Live Auction, Product Detail, Seller, Cart, Checkout and Account** are
  untouched and remain earlier prototypes in Options 2–4, as the brief
  requires. The known 320 px overflow on `/live-auction` and `/system` is
  unchanged.
