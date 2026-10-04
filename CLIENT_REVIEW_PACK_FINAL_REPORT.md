# Khaznah — Client review pack: final cross-page polish

The last pass over the client review pack before the client chooses a
direction. It covers the five approved pages (Home, Browse, Auction Detail,
Live Auction and Product Detail) in all four options. No page was redesigned.
The pass checked that each option reads as one website from page to page.
It made the two required fixes and a few small consistency fixes, and set up
the preview so the client is guided to exactly these five pages.

- **Review links** (on the Vercel preview of this branch), per option:
  `/en/concept-b` (Option 1), `/en/concept-a` (Option 2), `/en/concept-c`
  (Option 3), `/en/concept-d` (Option 4), each followed by nothing (Home),
  `/browse`, `/auction`, `/live-auction` or `/product`. Arabic: replace
  `/en/` with `/ar/`.
- **Screenshots:** `docs/client-review-final/` (one sheet per option, a
  phone journey sheet and two Arabic sheets; see its README).
- **Paths** below are relative to `design-preview/` unless they start at the
  repository root.

## Final client review matrix

| Page | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| Home | Approved | Approved | Approved | Approved |
| Browse | Approved | Approved | Approved | Approved |
| Auction | Approved | Approved | Approved | Approved |
| Live | Approved | Approved | Approved | Approved |
| Product | Approved | Approved | Approved | Approved |

| Option | Direction | Slot |
|---|---|---|
| 1 | Modern Commerce | `concept-b` |
| 2 | Premium Modern Marketplace | `concept-a` |
| 3 | Visual Discovery Marketplace | `concept-c` |
| 4 | Contemporary Saudi Commerce | `concept-d` |

## Summary of the polish work

| # | Area | Change | Options |
|---|---|---|---|
| 1 | Image viewer keyboard (required) | Focus lands on the image when the viewer opens, so the arrow keys work at once | 1 (Auction and Product) |
| 2 | Seller avatar contrast (required) | Auction Detail uses the same slightly deeper avatar colour as Product: lowest contrast 4.44:1 → 5.29:1 | 3 |
| 3 | Live Auction on laptop screens | On windows 860 px tall or less, a few gaps are 4–8 px tighter so the main Bid shows on load | 1, 4 |
| 4 | Current item in the navigation | An auction lot marks Timed Auctions / Auctions; every product marks Buy Now | all |
| 5 | Breadcrumbs | Product reads Home › Buy Now › category › item, like Auction's Home › Auctions › category › lot; Option 4's Live breadcrumb uses the same arrows and link colour as its other pages | all; 4 |
| 6 | Phone mode rail | The rail scrolls to show the current mode (Buy Now and Bulk & Pallets started out of view) | 3 |
| 7 | Header at 1200–1439 px (found in QA) | The search box gives way instead of covering the location and EN / العربية links | 3 |
| 8 | Riyal sign (found in QA) | The one prose amount written "SAR 4,600" / "4,600 ريال" now uses the riyal sign like every other price | all |
| 9 | Presentation flow | Every option lists Home, Browse, Auction, Live auction, Product first, in that order; Seller and Components & states are marked "Earlier prototype · not part of this review" (Option 1 included) | all |
| 10 | Client preview guide | New client-facing "What to review" section | — |

Nothing else changed: no section order, imagery, architecture, colour
palette, business rule or data value changed, and Seller, Cart, Checkout,
Account and System were not touched beyond the presentation note.

---

## A. Baseline

| Check | Result |
|---|---|
| Branch | `claude/magical-faraday-fne4kq` |
| HEAD at start | `4f34b27` (Product Detail redesign), equal to `origin/claude/magical-faraday-fne4kq` |
| Working tree at start | clean |
| Comparison build | `4f34b27` built separately (git worktree) and served next to the working build for every before/after check |
| Container restart during final QA | the brief arrived a second time after the restart; branch, HEAD and origin were checked again (still `4f34b27`) and the only working-tree changes were this phase's own, so the work continued. The servers were restarted on the same final build (no source file newer than it); the suites that had not finished ran again from the start |

## B. Cross-page audit

**Method.** The first screen of each of the 20 pages was captured at 1440,
1024, 768 and 390 px in English and at 1440 and 390 px in Arabic (160
captures). They were laid out as one contact sheet per option and size and
compared page by page (§6 of the brief): Home ↔ Browse, Browse ↔ Auction
Detail, Auction Detail ↔ Live Auction, Browse ↔ Product Detail, then all five
together. Full pages were checked where a sheet raised a question, and the
Live Auction was measured at laptop heights.

**Result: each option reads as one website.** Within an option the five
pages share the header, footer, container width and gutters, type scale,
button shapes, card language, grade pills, money format and seller
treatment. The differences between pages are intentional (for example the
Live Auction's darker event band, or the Product page's calmer purchase
panel next to the Auction Detail's bid panel). The four options stay as far
apart as before; nothing in this pass moves one towards another.

| Option | Character across the five pages | Inconsistencies found (fixed in §C) |
|---|---|---|
| 1 · Modern Commerce | Structured, information-rich, navy / indigo, one three-tier header and the same white cards and indigo primary buttons throughout; the Live control room is the darkest page, as designed | Auction Detail and Product marked no item in the category bar; the image viewer needed one Tab before the arrow keys worked; the Live Bid could start just below the fold on laptop screens |
| 2 · Premium Modern Marketplace | Warm ivory, charcoal and brass at the same refinement level on all five pages (editorial titles with the brass rule, slim "/" breadcrumbs, charcoal panels, brass primary buttons) | Auction Detail marked no item in the masthead |
| 3 · Visual Discovery Marketplace | White, navy and indigo with gold and coral urgency; rounded, image-led pages; the supporting panels stay light rather than dashboard-like | Auction Detail showed **Discover** as the current mode; one seller avatar colour under 4.5:1 on Auction Detail; on phones the current mode (Buy Now, Bulk & Pallets) sat outside the rail's visible part; at 1200–1439 px the header's search box covered part of the utilities |
| 4 · Contemporary Saudi Commerce | Cream, green and sage, practical and calm; the Live and Auction urgency (red LIVE tag, red clock chip) stays inside the same calm system | Auction Detail marked no item in the navigation; the Live breadcrumb used "/" and a grey link where the other pages use arrows and blue links; the Live Bid could start just below the fold on laptop screens |
| All | — | Product breadcrumbs skipped the sale-mode level that Auction Detail has ("Auctions"); one prose amount on the fridge lot was written "SAR 4,600" |

**Page pairs (§6).**

- **Home ↔ Browse:** same container, category names, card families and
  section-heading style in every option; auction states (countdown,
  Ending soon) and Buy Now states (price, was-price, discount) match.
- **Browse ↔ Auction Detail:** the card's badge, countdown, grade pill and
  seller line reappear on the detail page in the same form; the Bid button
  keeps the option's primary style.
- **Auction Detail ↔ Live Auction:** clearly related but not identical in
  each option: the same bid hierarchy (current bid, minimum next bid, quick
  amounts, Bid with the amount) and the same bidder states, with the Live
  page adding the event band, the call and the running order.
- **Browse ↔ Product Detail:** the Buy Now card's price, discount, stock,
  grade, seller and Save reappear on the product page; Add to cart is the
  primary action there in every option.
- **All five:** one header and footer per option, the same focus ring,
  button shapes and gutters; breadcrumbs now share one pattern per option
  (§C5); toasts behave the same way on every page (§D1).

## C. Changes

### C1. Option 1 — image viewer keyboard (required, §11)

| | Before | After |
|---|---|---|
| Focus when the viewer opens | the dialog's Close button (outside the part that listens for the arrow keys), so ← / → did nothing until Tab moved focus into the image | the image itself (`role="group"`, labelled "Images of …", `tabindex="-1"`, the dialog's autofocus target), so ← / → move between images at once |
| Escape, Previous / Next, swipe, thumbnails | unchanged | unchanged |
| Focus after closing | back to the image button that opened it | unchanged |
| Tab | moves through the viewer's own controls (the dialog keeps focus inside, as before) | the image is not an extra Tab stop (`tabindex="-1"`); Tab goes on to Previous, Next and the thumbnails |
| Arabic | ← shows the next image | unchanged |

When the viewer is opened from the keyboard, the image shows the option's
focus ring (navy, 4 px offset); opened with a mouse or finger, no ring is
drawn. The viewer is shared by Auction Detail and Product, so both pages
gain the fix. File: `components/concept-b/product/Lightbox.jsx`.

Options 2–4 use a different viewer whose key handler already covers its
Close button, so the arrow keys work there straight away (checked on
Auction and Product, EN and AR: 12 of 12); no change.

### C2. Option 3 — seller avatar contrast (required, §12)

The Product page already darkened each seller's avatar colour by 10 % so the
white initials keep 4.5:1. The helper moved into the option's `ui.jsx`
(`sellerTone`, `withSellerTone`) and Auction Detail now uses it too, for both
avatars (the header and the navy seller panel). Product looks exactly as
before. No other colour changed.

| Seller | Colour | White initials before | After (Auction Detail = Product) |
|---|---|---|---|
| Sahel Lifestyle (SL) | #B0643B → #9E5A35 | **4.44:1** | 5.29:1 |
| Red Sea Trading Co. (RS) | #1F6F78 → #1C646C | 5.83:1 | 6.80:1 |
| Rawabi Home Outlet (RH) | #8A5A36 → #7C5131 | 5.84:1 | 6.82:1 |
| Dar Al Majd Wholesale (DM) | #6B4E9B → #60468C | 6.59:1 | 7.63:1 |
| Khazna Direct (KD) | #3D4D9B → #37458C | 7.68:1 | 8.78:1 |

Checked on every auction lot (11) and product (18) of Option 3: lowest
5.29:1 (Sahel Lifestyle, wherever it appears). The only other monogram on
the five Option 3 pages, the Live host's, is white on navy (16.19:1).
Files: `components/concept-c/visual-discovery/{ui.jsx,
auction/AuctionView.jsx, product/ProductView.jsx}`.

### C3. Live Auction at laptop height (§13)

**Inspection.** On a 768 px tall window the main Bid of Options 1 and 4
started just below the fold. With the presentation bar showing (the default
for the client) it was out of view; Options 2 and 3 were fine without the
bar. Real laptop windows are often shorter still once the browser's own bars
are counted (for example about 785 px on a 13-inch laptop with a 900 px
screen).

**Decision: a modest adjustment, only on short windows.** A new Tailwind
variant `lg-short` (1024 px wide or more and 860 px tall or less, defined in
`app/globals.css`) tightens a few gaps. On taller windows, including the
approved 1440 × 900 captures, nothing changes. No text size changed and
nothing was hidden. The stage, event identity and current-lot details keep
their size and place.

| Option | Tightened on short windows only |
|---|---|
| 1 | event band padding 20 → 16 px (top and bottom); band → stage gap 20 → 16 px; console head 12 / 16 → 10 / 12 px, its clock and progress line 2–4 px closer; console body top 20 → 16 px and gaps 16 → 12 px; current-lot row 16 → 12 px below |
| 4 | event panel padding 24 → 20 px (top and bottom); title 12 → 8 px below the tags; facts row 16 → 12 px above and inside; panel → columns gap 24 → 20 px; bid panel body top 20 → 16 px and gaps 16 → 12 px |

Where the main Bid sits on load (bottom edge of the button; the window is
768 px tall unless stated). Measured with the presentation bar hidden and
shown, at 1280–1536 px wide:

| Option | Language | Presentation bar | Before | After |
|---|---|---|---|---|
| 1 | EN | hidden | 9 px below the fold (button partly cut) | **fully visible**, 35 px to spare |
| 1 | EN | shown | 53 px below (out of view) | 9 px below (button partly cut) |
| 1 | AR | hidden | 39 px below | **fully visible**, 5 px to spare |
| 1 | AR | shown | 83 px below | 39 px below |
| 4 | EN | hidden | 1 px below | **fully visible**, 39 px to spare |
| 4 | EN | shown | 45 px below (out of view) | 5 px below (button partly cut) |
| 4 | AR | hidden | 24 px below | **fully visible**, 16 px to spare |
| 4 | AR | shown | 68 px below | 28 px below |

On an 800 px tall window with the bar showing (about a 13-inch laptop),
the Bid is now fully visible in Options 1 and 4 in English and in Option 4
in Arabic, and starts 7 px below the fold in Option 1 in Arabic. On a 900
px tall window the Bid sits exactly where it was before (for example
Option 1 English at 729–777 px), confirming taller windows are unchanged.

Option 2 (3 px below with the bar, English) and Option 3 (always visible)
were not changed. At 1200 px wide, Option 1's event band stacks its facts
under the title, so on a 768 px window its Bid still starts 8 px below the
fold in English and 37 px in Arabic (before: 52 and 81 px); Option 4 at
1200 px is fully visible in English and 7 px below in Arabic (before: 1 and
47 px). A short scroll brings it up, as before.

Files: `components/concept-b/live/{LiveView, EventBar, LiveBidPanel}.jsx`,
`components/concept-d/saudi-commerce/live/{LiveView, BidPanel}.jsx`.

### C4. Current item in the navigation (§16)

| Page | Option 1 (category bar) | Option 2 (masthead) | Option 3 (mode pills) | Option 4 (navigation) |
|---|---|---|---|---|
| Home | none (unchanged) | none, first item in semibold (unchanged) | Discover (unchanged) | none (unchanged) |
| Browse → Auctions | Auctions (unchanged) | Timed Auctions (unchanged) | Timed Auctions (unchanged) | Timed Auctions (unchanged) |
| Browse → Buy Now | Buy Now (unchanged) | Buy Now (unchanged) | Buy Now (unchanged) | Buy Now (unchanged) |
| Auction Detail | none → **Auctions** | none → **Timed Auctions** | Discover → **Timed Auctions** | none → **Timed Auctions** |
| Live Auction | Live now (unchanged) | Live Auction (unchanged) | Live Auction (unchanged) | Live Auction (unchanged) |
| Product Detail | none → **Buy Now** | Buy Now (cartons and pallets: Bulk & Pallets → **Buy Now**) | same | same |

The rule is now the same on both detail pages: a detail page marks its sale
mode. Bulk lots keep their category in the breadcrumb. The phone and tablet
menus of Options 2–4 mark the same item. The global order of the modes did
not change. Files: `components/concept-b/layout/CategoryNav.jsx`, the
Auction and Product page shells of Options 2–4
(`*/auction/*Auction.jsx`, `*/product/*Product.jsx`) and the doc comments of
their `Header.jsx` / `Layers.jsx`.

### C5. Breadcrumbs (§17)

| | Before | After |
|---|---|---|
| Product Detail, all options | Home › category › product | Home › **Buy Now** › category › product (Buy Now links to Browse on Buy Now), the same depth as Auction Detail's Home › Auctions › category › lot |
| Option 4 Live Auction | Home / Live auctions, grey link | Home → Live auctions, blue link, ink current page: the same as Option 4's Browse, Auction and Product breadcrumbs |

Each option keeps its own separator: Option 1 chevrons, Option 2 "/",
Option 3 "·", Option 4 arrows (mirrored in Arabic). Ancestors are links; the
current page is plain text with `aria-current="page"`. Files:
`components/shared/product/hooks.js` (the crumbs list), and
`components/concept-d/saudi-commerce/live/LiveView.jsx`.

### C6. Option 3 — phone mode rail

On phones the mode pills scroll sideways. Buy Now and Bulk & Pallets started
out of view, so on Product and on Browse → Buy Now / Bulk the indigo current
pill could not be seen. The rail now scrolls just enough to show the current
pill (no page scroll; a pill already in view stays put, so Home and Browse →
Auctions look as before). Works in both directions (Arabic scrolls the other
way). File: `components/concept-c/visual-discovery/Header.jsx`.

### C7. Option 3 — header at 1200–1439 px (found in the final sweep)

The header row is a grid: logo · search (up to 637 px) · utilities. The
utilities column was allowed to shrink below its content. From 1200 to about
1430 px the location button and EN / العربية slid under the search box
(the "E" of EN was covered at 1280 px; at 1200 px both language links were
covered). The same was true on the approved build, on all five Option 3
pages, in both languages. The utilities column is now `auto`, so the search
box gives way instead. At 1440 px and wider nothing changes; between 1200
and 1439 px the search box is narrower and "My account" fits on one line.
File: `components/concept-c/visual-discovery/Header.jsx`.

### C8. Riyal sign in prose (found in the final sweep, §18)

The fridge lot's third highlight read "Buy Now available until bids reach
SAR 4,600" (Arabic "… 4,600 ريال"). It is the only amount on the five pages
not written with the riyal sign. It now uses the sign in the same left-to-
right run the pages use for every amount (`⃁ 4,600`), in both languages.
The value is unchanged. File: `data/products.js`.

### C9. Presentation flow (§26)

| Element | Before | After |
|---|---|---|
| Page order (bar, page menu, start page) | Home, Browse, Product, Auction, Live auction, Seller, Components & states | **Home, Browse, Auction, Live auction, Product**, then Seller, Components & states |
| Option 1 in the bar | one flat list, no status | the same grouping as Options 2–4: the five review pages, a divider, the two prototypes |
| Status | "New design" / "earlier prototype" (Options 2–4) | "New design · client review" / "Earlier prototypes · not in this review" (tooltips, screen-reader text and the page menu's group names); from 1600 px a small "Prototypes" caption before the second group |
| Seller and Components & states | "Earlier prototype" note in Options 2–4 only | the note in all four options, now saying the screen is **not part of the final concept review** |
| Start page | "New design" tags in Options 2–4; fact chips "Option 1: 6 key screens" and "Options 2–4: new Home, Browse, Auction, Live & Product" | each option lists **"New design · the five pages to review"** and, apart, **"Earlier prototypes · not part of this review"**; one chip "5 review pages each: Home, Browse, Auction, Live & Product"; notice and how-to text updated |

Unfinished routes stay reachable, as before; they are simply marked. The
"Light only" indicator still shows only on the new pages of Options 2–4
(Option 1 keeps its light / dark switch). Files: `lib/routes.js`,
`components/shared/presentation/{PresentationBar, ConceptSelector,
PrototypeNotice}.jsx`, `selector-copy.js`, `components/concept-b/Chrome.jsx`.

### C10. Client preview guide (§27)

`CLIENT_PREVIEW_GUIDE.md` (repository root) has a new client-facing **What
to review** section: the five pages in order for each option, and the six
things to consider (overall direction, auction experience, product
discovery, Buy Now experience, mobile, Arabic), with no internal or testing
language. The older "How to review" list was folded into it. The round note
and the description of the dark bar were updated to the new page order.
`design-preview/README.md` describes the same flow for presenters.

## D. Audits with no change needed

### D1. Toasts and fixed bars (§14)

One shared system serves all three page types: `useToastClearance` (lifts the
stack above a fixed bar on phones and tablets), `useToastsAwayFromConsole`
(Live, desktop) and `useToastsAwayFromPanel` (Product, desktop). Nothing in it
changed. Final check, every option, English and Arabic:

| Page | Phones | Tablet (768) | Desktop (1440) |
|---|---|---|---|
| Auction Detail | stack lifted above the bid bar; a real toast (Share) sits above the bar and clear of Bid | — | no lift and no alignment variable: the toast stays in its end-side corner, as before |
| Live Auction | lifted above the live bar; a reminder toast clear of Bid | lifted above the live bar | stack on the start side (`--kz-toast-align: flex-start`), clear of the console's Bid |
| Product Detail | lifted above the purchase bar; the Add to cart toast clear of the bar's button | — | stack on the start side, clear of Add to cart |
| Leaving for Home (client navigation) | no variable left behind | no variable left behind | no variable left behind |
| Home and Browse on load | no variable | — | no variable |

**88 of 88** checks pass (4 options × EN / AR). The Auction Detail phone
toast check from the earlier closeout (Watch, Share, two stacked toasts, a
placed bid, a saved maximum bid and Buy Now, each above the bid bar with a
12 px gap; desktop corner and Browse placement unchanged; the lift cleared
after leaving) also passes on the final build: **12 of 12** (4 options ×
EN / AR at 390 px, plus the desktop and Browse checks).

### D2. Navigation order (§15)

The audit script from the navigation phase ran on the final build: header,
"All categories" menu, phone drawer, footer and in-page mode controls, 10
routes × 4 options × EN / AR: **80 route-language pairs, 310 mode groups,
0 failing**. Auction always comes before Buy Now; navigation groups run
Timed / Auctions → Live → Buy Now → Sellers → Bulk & Pallets, with Home or
Discover first where designed.

### D3. Money (§18)

Every amount on the five pages is the riyal sign and the number in one
left-to-right run (the shared `Money` component, or the same isolate in
running text), Western digits in both languages, with the same treatment
of current bid, minimum next bid, fixed price, was-price, saving and totals
within each option. The one exception was the prose amount fixed in §C8.
Scan of the final build (20 pages × EN / AR, 934 amounts): 40 of 40 pages
consistent; no "SAR", "SR" or "ر.س" text, no Arabic-Indic digits, and every
sign in a left-to-right run. The price filter fields on Browse show the
sign as a label inside the field, at the field's start; that is their
approved design.

### D4. Grade and condition (§19)

Each option uses one grade pill family on Browse cards, Auction Detail, the
Live current lot and Product Detail, with a compact size on cards: Option 1
a green badge; Option 2 a small round-ended tinted pill; Option 3 a rounded
tinted pill; Option 4 a square-cornered tinted tag. "What this grade means"
opens the same grade guide on Auction Detail and Product. No change.

### D5. Seller presentation (§20)

"Sold by" with the seller's name as a link on Auction Detail and Product,
"Hosted by" on the Live event, seller cards or shelves on Home and Browse.
Typography and link colour match per option. Monogram avatars appear in
Option 1 (Buy Now cards, the Live stage) and Option 3 (Auction Detail,
Product, the Live host); measured on the final build, the lowest white-on-
colour contrast is 5.68:1 in Option 1 and 5.29:1 in Option 3 (§C2).
Options 2 and 4 show the seller as a text link. No trust claims were
added.

### D6. Status colours (§21)

Within each option the meanings do not conflict: live is red in every
option; time pressure (Ending soon, Closing, the lot clock) uses the
option's urgency colour (Option 1 orange, then red when closing; Option 2
red; Option 3 coral; Option 4 red text on a white chip); highest and won
use the success green; outbid uses amber; going once / going twice step up
in strength; sold, passed and out of stock are neutral grey or ink; low
stock is amber. No change.

### D7. Button hierarchy (§22)

Bid (Auction Detail, Live) and Add to cart (Product) carry each option's
primary style (Option 1 indigo, Option 2 brass, Option 3 indigo pill,
Option 4 green); Buy it now, View auction and Join live are secondary
(outline) next to them; Save, Share, Filters, Sort and Clear are quiet
controls. Auction-first placement is unchanged on Home, Browse and in the
navigation. No change.

### D8. Mobile, tablet and Arabic (§23–25)

Reviewed as journeys at 390, 360 and 320 px (Home → Browse → Auction → Live
→ Product), at 1024 and 768 px, and in Arabic on all five pages. Each option
keeps the same header height, gutters, card rhythm and button heights on
phones. The fixed bars (Auction bid bar, Live bar, Product purchase bar)
share the option's style and leave room above the footer. Tablet layouts
switch at the same points as before. Arabic pages are laid out right to
left with numbers kept left to right and photographs not mirrored. The only
issue found was Option 3's mode rail (§C6). The header overlap (§C7) shows
on small laptops, not tablets.

## E. QA on the final build

All checks below ran on the final source tree, after the last source change
(§C8), on a production build (`next build` + `next start`). The comparison
build is `4f34b27`.

| Check | Scope | Result |
|---|---|---|
| Presentation flow | bar order and status in 4 options × EN / AR × 4 pages; page menu groups; prototype note on Seller and Components & states (4 options × EN / AR × 1440 / 390 / 320) and absent on the 20 review pages; start page at 1440 / 390 | **128 of 128** pass |
| Fixes | Option 1 viewer (Auction and Product × EN / AR × mouse / keyboard); Option 3 avatars on all 29 lots; current item on 7 pages × 4 options; product breadcrumbs × 8; Option 4 Live breadcrumb × 2; Option 3 phone rail on 7 pages × EN / AR × 390 / 320 | **75 of 75** pass: viewer 8 / 8 (focus on the image, ← / → at once, Tab to the controls, Escape closes, focus back on the image button); avatars lowest 5.29:1; current item 28 / 28; product breadcrumbs 8 / 8; Option 4 Live breadcrumb 2 / 2; Option 3 rail 28 / 28 (current mode fully in view, page not scrolled, no overflow) |
| Responsive sweep (§30) | 5 pages × 4 options × EN / AR × 1440, 1024, 768, 390, 320 = 200 states: page overflow, elements past the viewport, broken images, console errors, one H1, text drawn past its box (buttons included), fixed controls overlapping, footer text under a fixed bar, axe serious / critical | **197 of 200 pass**; 0 overflow, 0 elements past the viewport, 0 broken images, 0 console errors, 0 missing or extra H1, 0 fixed-control overlaps, 0 footer text under a bar, 0 axe findings of any impact. The 3 flags are Option 4 Home measurements that are the same on the approved build and not visible (§F): the step numerals at 1440 (EN, AR) and three category labels at 320 (EN) |
| Headers at laptop and tablet widths | every link, button and field in the header topmost and not overlapping, 5 pages × 4 options × EN / AR × 13 widths from 1024 to 1920 (520 states) | **520 of 520** clean (before the Option 3 fix: 50 Option 3 states failed at 1200–1366 px, EN and AR, on all five pages; Options 1, 2 and 4 were already clean) |
| Home smoke (§31) | start page → option, a category, the auction shortcut, a Featured Items card; 4 options × EN / AR × 1440 / 390; plus Browse's sale-mode switch in Arabic | **20 of 20** pass (16 home runs: concept navigation, category → filtered Browse, auction shortcut → Browse on Auctions, Featured Items card → its detail page; 4 Arabic sale-mode switches) |
| Browse smoke | Auctions / Buy Now switch, category and grade filters, clear, sort, Save, card links, header search, language switch keeping the query, URL states | **92 of 92** pass (the four options: sale-mode switch with the header's current item, category and grade filters, Clear all, sort, Save, auction and Buy Now card links, Add to cart, header search, EN → AR keeping the query, URL states, empty state, keyboard, phone filter and sort sheets) |
| Auction Detail smoke | Watch, Share, bid steps, confirm, too-low error, max bid, Buy Now, grade guide, gallery and viewer, history; phone bid bar and bid sheet; EN / AR | **224 of 224** pass (the four options × EN / AR, `fridge-690`: 1440 px steps and phone steps at 390 px) |
| Auction Detail toasts on phones | every toast above the bid bar, Bid not covered | **12 of 12** pass (every toast 12 px above the bar, Bid never covered, lift cleared after leaving) |
| Live Auction smoke | bid, rival bids and outbid, tabs, call sequence, hammer and next lot, reminders; EN / AR at 1440; phones at 390 (tabs, quick bid, fixed bar, toasts, footer) | **400 of 400** pass: desktop flow 240 / 240 (bid, rival bids and outbid, tabs, the call sequence, hammer and next lot, reminders; 4 options × EN / AR at 1440) and phones 160 / 160 (tabs, quick bid, the fixed bar's Bid, bid / outbid / won / reminder toasts above the bar, between lots and the next lot, footer clearance, no overflow; 390 px) |
| Product smoke | quantity, total, Add to cart, Buy it now with the cart drawer, Watch, viewer, grade guide, sold out, full lot; phone bar and toasts at 390; EN / AR | **304 of 304** pass: desktop flow 216 / 216 (quantity and total, Add to cart, Buy it now with the cart drawer, Watch, Share, viewer, grade guide, sold out, full lot; 4 options × EN / AR at 1440) and phones 88 / 88 (the bar fits, adds one, toasts above it, footer clear, lift removed after leaving; 390 px) |
| Accessibility (§32) | axe (WCAG 2.1 A / AA) on all 200 sweep states; plus the explicit checks of the viewer keyboard (§C1) and Option 3 contrast (§C2) | **0 axe findings** of any impact on the 200 states (serious and critical: 0); viewer keyboard and Option 3 contrast verified (rows above) |
| Regression | Home and Browse (not changed in this phase), 4 options × EN / AR × 1440 / 1024 / 390, full page, frozen clock, photographs masked, against `4f34b27` | **48 of 48 identical** after the noise check: 46 identical on the first run; Option 4 Home at 1024 px (EN, AR) differed by 42 and 7 pixels at the edges of the masked seller-directory pictures, the known capture noise spot. Repeated, final vs `4f34b27` gave 0 and 0, while `4f34b27` against itself gave 41 / 34 (EN) and 7 / 0 (AR) |
| Detail pages vs `4f34b27` | Auction, Live, Product × 4 options × (1440 EN, 390 AR) | Differences only where intended (changed rows located for every pair): the header's current item (Auction Detail in all options, Option 1 Product), the Buy Now breadcrumb (every Product), the fridge highlight amount (every Auction Detail), Option 3's avatars and phone rail, Option 4's Live breadcrumb. Options 1–3 Live pages are identical at 1440 EN (content and header) and 390 AR (content); every footer identical; 0 console errors |
| Performance (§33) | 5 pages × 4 options at 1440 on load vs `4f34b27`: requests, JS, CSS, images, DOM, running intervals | **0 of 20 pages flagged.** JS +0 to +1 KB, CSS +0 to +1 KB, images unchanged (one 4 KB thumbnail more on Option 1's product page), requests −1 to +1, DOM +1 to +21 nodes (the bar's status text and divider, the extra breadcrumb), running intervals unchanged (1–2 per page). No new libraries (`package.json` and the lock file unchanged) |
| Lint | `npm run lint` | passes, no warnings |
| Build | `npm run build` (Next.js 16.3.4) | passes; 335 static pages |
| Static export | `npm run export` in a copy of the tree, then the exported site served as plain files | passes: 335 static pages, all 56 review and prototype page files present (4 options × EN / AR × 7 pages); on the exported site **45 of 45** checks pass (the 40 review pages load with one H1, the R3 marker where expected, the bar's new order and no console errors; the prototype note on Seller in every option; Option 1's viewer takes ← / → at once; Add to cart and Watch work) |

## F. Known items, not changed

- **`/system` at 320 px** still scrolls sideways. It is outside the client
  pack and now carries the "Earlier prototype · not part of this review"
  note in every option (§35 of the brief).
- **Option 4 Home**, by design: the large 01 / 02 / 03 step numerals draw
  10–17 px past their own boxes at 1440 px, and three category labels draw
  3–6 px past theirs at 320 px. Nothing overlaps or is cut. Same on the
  approved build; left as is.
- **Live Auction, short windows with the presentation bar:** see the table
  in §C3 for the cases where the main Bid still starts below the fold (for
  example Option 1 in Arabic on a 768 px window with the bar showing). Hiding
  the bar (its button or the "." key) gives the page its full height.
- **Round 2 files** (`components/concept-{a,c,d}/` outside the approved
  folders, and the unrouted Round 2 live components) are still in the tree,
  as the brief asks (§34).
- **No images** were generated or replaced (§36).

## G. Files changed

| File | What changed |
|---|---|
| `app/globals.css` | `lg-short` variant (short desktop windows) |
| `components/concept-b/product/Lightbox.jsx` | viewer focuses the image on open |
| `components/concept-b/layout/CategoryNav.jsx` | Auctions current on auction lots, Buy Now on products |
| `components/concept-b/live/{LiveView, EventBar, LiveBidPanel}.jsx` | short-window spacing |
| `components/concept-b/Chrome.jsx` | earlier-prototype note on Seller and Components & states |
| `components/concept-c/visual-discovery/ui.jsx` | `sellerTone`, `withSellerTone` |
| `components/concept-c/visual-discovery/auction/AuctionView.jsx`, `product/ProductView.jsx` | use the shared avatar colour |
| `components/concept-c/visual-discovery/Header.jsx` | rail shows the current mode; utilities column `auto`; doc comment |
| `components/concept-{a/premium-modern, c/visual-discovery, d/saudi-commerce}/auction/*Auction.jsx` | `active="timed"` on header and menu |
| `components/concept-{a/premium-modern, c/visual-discovery, d/saudi-commerce}/product/*Product.jsx` | `active="buy"` on header and menu |
| `components/concept-{a/premium-modern, c/visual-discovery, d/saudi-commerce}/{Header, Layers}.jsx` | doc comments for `active` |
| `components/concept-d/saudi-commerce/live/{LiveView, BidPanel}.jsx` | breadcrumb; short-window spacing |
| `components/shared/product/hooks.js` | Buy Now level in the product breadcrumbs |
| `data/products.js` | the fridge lot's highlight amount with the riyal sign |
| `lib/routes.js` | page order |
| `components/shared/presentation/{PresentationBar, ConceptSelector, PrototypeNotice}.jsx`, `selector-copy.js` | presentation flow |
| `README.md` (in `design-preview/`), `CLIENT_PREVIEW_GUIDE.md` (root) | presenter notes; client review section |
| `CLIENT_REVIEW_PACK_FINAL_REPORT.md` (root), `docs/client-review-final/` | this report and its evidence |

## H. Evidence

`docs/client-review-final/` holds summary sheets only, not another archive:

- `option-1-desktop-1440-en.jpg` … `option-4-desktop-1440-en.jpg`: the five
  pages of each option in review order at 1440 px (first screen);
- `mobile-journey-390-en.jpg`: the five pages of all four options at 390 px;
- `arabic-desktop-1440.jpg` and `arabic-mobile-390.jpg`: the same in Arabic.

## Self-review

- The two required fixes are in and verified: the viewer's arrow keys work
  on open in English and Arabic, by mouse and keyboard, with Escape, focus
  return and Tab order intact; the lowest Option 3 avatar contrast is 5.29:1.
- The laptop-height change only applies at 860 px tall or less and changes
  spacing only; the approved 1440 × 900 views are pixel-identical.
- Navigation, breadcrumbs and the presentation now follow one rule each
  across the pack. No mode order, page structure or business rule changed.
- All QA in §E ran after the last source change; lint, build and export pass
  on the final tree.
