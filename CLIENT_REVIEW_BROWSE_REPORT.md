# Khaznah — Browse redesign, all four options

Phase B of the client review pack. Browse (`/browse`) now uses each option's
approved homepage design. The four pages share one data and behaviour layer
(filters, sorting, URL parameters, cart, watchlist). Each option has its own
layout, controls and cards.

- **Review links** (on the Vercel preview of this branch):
  - Option 1: `/en/concept-b/browse`
  - Option 2: `/en/concept-a/browse`
  - Option 3: `/en/concept-c/browse`
  - Option 4: `/en/concept-d/browse`
  - Arabic: replace `/en/` with `/ar/`.
- **Screenshots:** `docs/client-review-browse/` (20 review shots, the
  four-option comparison sheet and before/after sheets; see its README).
- **Phase A:** `CLIENT_REVIEW_DESIGN_SYSTEM_AUDIT.md` records the homepage
  systems each Browse page is built from.
- **Paths** below are relative to `design-preview/` unless they start at the
  repository root.
- **Nothing else was redesigned.** Homepages are pixel-identical to `76a2d95`
  (§M). Every other inner page is unchanged apart from the wording of its
  "Earlier prototype" note, which now says Home and Browse are new.

---

## A. Baseline

- **Branch:** `claude/magical-faraday-fne4kq`.
- **Starting commit:** `76a2d95` ("Move Featured Items higher on homepage
  options 1-3").
- **Checks before editing:**
  - HEAD was exactly `76a2d95`;
  - HEAD matched `origin/claude/magical-faraday-fne4kq`;
  - the working tree was clean.
- **Comparison build:** a production build of `76a2d95` in a separate
  worktree, served next to the new build. Every before/after figure in this
  report compares those two builds.
- **Final commit:** the commit that adds this report, "Redesign Browse page
  for all four Khaznah concepts". A report cannot contain its own hash;
  `git log -1 --format=%H -- CLIENT_REVIEW_BROWSE_REPORT.md` prints it.

**Browse before this change**

- **Option 1** (`concept-b`): Browse ran on the Option 1 Browse components,
  but with the older page composition.
- **Options 2–4** (`concept-a`, `concept-c`, `concept-d`): Browse was a
  Round 2 prototype under the `(round2)` route group, labelled "Earlier
  prototype".
- **One engine:** all four used the same Browse engine and component set.
  Options 2–4 were recoloured copies of Option 1's components. Their
  `browse/*.jsx` files differ from Option 1's only in import paths, plus a
  wider grid gap in Option 2.

## B. Existing Browse — functional inventory

All four options shared the old behaviour, so one table covers them. "Kept"
means the behaviour is still there in all four new pages.

| Area | Old Browse (`76a2d95`) | New Browse |
|---|---|---|
| URL parameters | Read once on load: `tab` (`auction`, `buy_now`, `live`), `search` (and legacy `q`), `category` (comma list), `condition`, `item_type`, `min_price`, `max_price`, `ending` (`1h`, `6h`, `24h`), `in_stock`, `has_discount`, `sort`, `page`. Written back with `history.replaceState`. | **Kept, same names and values.** The URL is now written so the Next.js router sees it: the header's current mode follows in-page changes, and links into an open Browse page reload its state (§G). |
| Search | Header search → `/browse?search=…`; heading "Results for …"; breadcrumb. | **Kept.** Options 1–3 search from their headers. Option 4 brings its homepage's segmented search (category · query · Search) onto Browse. |
| Sale type | All / Auctions / Buy Now with live counts. | **Kept**, same order, with counts. |
| Category | Checkboxes with live counts; empty ones disabled. | **Kept.** Option 3 uses photo pills plus the drawer. Option 4 uses the homepage's sage category rail. |
| Condition grade | New, A, B, C, D, R, F, checkboxes with counts (grades with no lots disabled). | **Kept.** |
| Item type | Single / pallet / bulk. | **Kept.** |
| Price | SAR 0–10,000 range with min/max fields; applies to current bid or price. | **Kept**: min/max fields, applied on Enter or leaving the field. |
| Ending within | 1 h / 6 h / 24 h radio group (auctions only). | **Kept.** Sits first or second in every filter list (§H). |
| Availability | In stock only; Discounted. | **Kept.** |
| Quick filters | Chips: Ending within 1 hour, Discounted, Grade A. | **Kept in Options 1 and 3** (chips/pills). Options 2 and 4 use the same filters inside their rails. |
| Seller filter | None on Browse (seller pages filter by seller code). Production `/browse` has none either. | **Not added**: the data supports it only on seller pages. |
| Delivery / location | Not in the data. | **Not added.** |
| Sort | Ending soonest (default), Newest, Price low → high, Price high → low, Most bids. | **Kept**, same five, same default. |
| Paging | Numbered pages, 8 lots per page. | Numbered pages, **12 per page**, in Options 1, 2 and 4. Option 3 uses **Load more**, 12 at a time, through the engine's existing `loadMore`. |
| Grid / list | Toggle. | **Kept in all four.** |
| Card links | Auction → `/auction/[slug]`; Buy Now → `/product/[slug]`. | **Kept.** |
| Watch / save | Heart on every card and row; toast; shared watchlist. Upcoming lots: "Remind me". | **Kept.** |
| Cart | Add to cart on Buy Now cards and rows; header count updates; sold out disabled. | **Kept.** |
| Phones / tablets | Sticky Filters (n) · Sort bar; filter sheet with "Show N results"; sort sheet. | **Kept, redesigned per option.** |
| Active filters | Removable chips + Clear all. | **Kept.** |
| Empty state | One generic message, Clear filters, popular searches. | **Improved:** separate copy for "no search matches" and "no lots after filters", Clear filters, a **Browse all lots** link back to the full marketplace, and suggested searches. EN and AR. |
| Loading | 420 ms simulated loading with skeletons after every change (no real network). | **Kept** (the behaviour already existed); skeletons redrawn per option. |
| Header navigation while on Browse | Custom event + `popstate` remounted the view. | **Kept and generalised** to all four (`components/shared/browse/BrowseRoute.jsx`). |
| Arabic / RTL | Yes. | **Yes, reviewed per option** (§I). |
| Static export | Static HTML showed the default state; the URL was read in the browser. | Static HTML shows a skeleton; the URL is read in the browser (§O). |

**Decorative / non-functional old controls:** none. Every old Browse control
was wired to the engine.

**Still on disk but no longer routed:** Option 1's `browse/QuickFilters.jsx`.
For Options 2–4: `pages/BrowsePage.jsx`, `browse/BrowseView.jsx` and
`browse/QuickFilters.jsx`. The other Round 2 `browse/*` files are still used
by the Round 2 seller pages (§O).

## C. Option 1 — Modern Commerce (`concept-b`)

**Approach:** the most structured and information-dense of the four, as the
brief asks. It keeps Option 1's three-tier header, indigo action colour, gold
accent, 12 px cards and its own homepage lot cards.

**Desktop (≥ 1024 px)**

1. **Summary band** (white, full width):
   - breadcrumb, H1 (All lots / Auctions / Buy Now / category /
     "Results for …"), result count and a one-line intro;
   - on the right, three auction figures, each a working control:
     - **Auctions open** (9): toggles Auctions mode;
     - **Closing within an hour** (3): toggles the 1-hour filter;
     - **Live now**: a dark-indigo tile linking to the live auction.
2. **Results toolbar card:**
   - underlined All → Auctions → Buy Now tabs with counts;
   - sort menu and grid/list switch;
   - a quick-filter row: Ending within 1 hour, Grade A, Discounted.
3. **Sticky left facet rail** (240 / 256 px), in this order: Ending within,
   Category, Condition grade, Item type, Price range, Availability.
4. **Results:**
   - dense grid of 2 / 3 / 4 columns using the homepage's AuctionCard and
     BuyNowCard (LotRow in list view);
   - grouped auction-first, with icon and count headings, when the order is
     the default;
   - numbered pages and a "Showing 1–12 of 29" line.

**Tablet and phone (< 1024 px)**

- Underlined mode tabs.
- Sticky Filters (n) · Sort · view bar. Filters and sort open bottom sheets;
  the filter sheet ends with "Show N results".
- Quick-filter chips and removable active-filter chips.

**Components**

- `components/concept-b/browse/BrowseView.jsx`: rewritten. Holds the summary
  band, AuctionPulse, Toolbar, QuickChips, phone layout and the skeleton
  shown before the URL is read.
- `components/concept-b/browse/BrowseResults.jsx`: new. Grouping, group
  headings, skeletons and empty state.
- `components/concept-b/browse/FacetPanel.jsx` and `MobileFilterBar.jsx`:
  gain an `endingFirst` option (default off, so the seller page is
  unchanged). The phone sort button also gains a screen-reader "Sort by:"
  prefix (§K).
- `components/concept-b/pages/BrowsePage.jsx`: uses the shared `BrowseRoute`.

## D. Option 2 — Premium Modern Marketplace (`concept-a`)

**Approach:** editorial and calm. Warm ivory page, charcoal type, brass and
bronze accents, hairline dividers and generous spacing. No dashboard boxes.
It uses the homepage's centred-logo header, mobile menu, cart drawer and
footer.

**Desktop (≥ 1200 px)**

1. **Editorial page head:** brass dash with a "Marketplace" eyebrow, large
   page title, intro line, lot count, and "Clear search" when searching.
2. **Live auction on a stone band** ("Live now" tag, title · host,
   "Join live auction"). It sits **above** the mode tabs, so the live
   destination comes before any Buy Now control.
3. **Toolbar on a hairline:**
   - text tabs All → Auctions → Buy Now with counts;
   - a quiet "Sort by" menu and grid/list switch.
4. **Unboxed filter rail** (248 px):
   - hairline-divided groups with small-caps legends, square charcoal
     checkboxes and live counts;
   - order: Category, Ending within, Condition grade, Price range, Item type,
     Availability.
5. **Results:**
   - three spacious columns of white cards with a hairline border;
   - auctions shown as cut-outs on stone plates;
   - a bronze sale-type kicker, current bid, bids and time left;
   - a charcoal **Bid now** button, while Buy Now cards carry an outlined
     **Add to cart**;
   - small-caps group headings and numbered pages.

**Tablet and phone (< 1200 px)**

- The editorial head and live band stay.
- A sticky Filters / Sort bar opens sheets: from the side on tablets, from
  the bottom on phones.
- Two columns on phones, three on tablets.

**Components**

- `components/concept-a/premium-modern/browse/`:
  - `PremiumModernBrowse.jsx`: page shell;
  - `BrowseView.jsx`: page head, live band, toolbar, rail, results, sheets;
  - `Filters.jsx`: rail groups;
  - `Controls.jsx`: tabs, sort, view, tags, pager;
  - `Cards.jsx`: auction / Buy Now cards and rows.
- `components/concept-a/premium-modern/Layers.jsx`: the homepage's mobile
  menu and cart drawer, moved out of `PremiumModernHome.jsx` so Browse can
  use them. The menu also accepts an optional current mode; without it (the
  homepage) its markup is unchanged.
- `Header.jsx` takes an optional `active` mode (§G).
- Route: `app/[lang]/concept-a/browse/page.js`.

## E. Option 3 — Visual Discovery Marketplace (`concept-c`)

**Approach:** the most exploratory of the four. White page, indigo, navy and
gold. Every control is a pill, the results are image-led, and filters live in
a rounded drawer. It uses the homepage's pill search header, mode row and
footer.

**Desktop (≥ 1200 px)**

1. **Display heading**, then a row of **photo category pills** (image, name,
   count) that filter by category.
2. **Navy live banner** for the live auction, placed before the pill bar and
   so before any Buy Now control.
3. **Pinned pill bar:**
   - All → Auctions → Buy Now on a blue-grey track, with counts;
   - **All filters** (navy pill with the active count): opens a rounded side
     drawer;
   - quick toggles: Ending within 1 hour, Grade A, Discounted;
   - sort menu and grid/list switch.
4. **Image-led grid:**
   - four columns of 16 px cards on softly tinted plates;
   - the coral countdown pill sits on the photo;
   - an indigo **Bid now** for auctions, a quieter outlined cart circle for
     Buy Now.
   - In the default order, the lot closing first leads the grid as a 2 × 2
     tile; grouped headings follow.
   - **Load more** with a progress bar ("Showing 12 of 29").

**Tablet and phone**

- Same structure.
- The pill bar scrolls sideways.
- A Sort pill opens a bottom sheet.
- The filter drawer becomes a bottom sheet on phones.
- Grid/list sits above the results.
- Two columns on phones, three on tablets.

**Components**

- `components/concept-c/visual-discovery/browse/`:
  - `VisualDiscoveryBrowse.jsx`;
  - `BrowseView.jsx`: heading, category pills, live banner, pill bar,
    results, load more, drawers;
  - `Filters.jsx`: drawer groups, all pills;
  - `Controls.jsx`;
  - `Cards.jsx`.
- `components/concept-c/visual-discovery/Layers.jsx`: the homepage's menu
  and cart layers, moved out so Browse can use them. They work the same way
  as Option 2's.
- `Header.jsx` and `useModes` take an optional `active` mode.
- Route: `app/[lang]/concept-c/browse/page.js`.

## F. Option 4 — Contemporary Saudi Commerce (`concept-d`)

**Approach:** calm, local, practical retail. Cream and green, structured and
easy to scan. It keeps Option 4's strongest asset, the segmented search, and
uses the homepage's cream utility bar, header and green footer band.

**Desktop (≥ 1200 px)**

1. **Cream search band:**
   - page title and intro;
   - a **live auction card** on the right;
   - below them, the homepage's **segmented search** (category scope ·
     query · green Search);
   - then the **green segmented switch** All → Auctions → Buy Now with
     counts.
2. **Sage filter rail** (253 px):
   - the homepage's category rail (icon, name, count);
   - then compact groups: Ending within, Condition grade, Price range, Item
     type, Availability;
   - "Clear all".
3. **Framed toolbar:** "Showing 1–12 of 29 lots", sort menu, grid/list.
4. **Practical cards:**
   - 9 px corners, a cut-out on a light plate;
   - auctions get a green **Auction** tag, a red clock with time left, the
     current bid and a green **Bid now**;
   - Buy Now cards get a sage tag and an outlined cart button.
   - Numbered pages with a green current page.

**Tablet and phone**

- The search band stacks.
- A sticky Filters / Sort bar opens sheets.
- Cards lie on their side on phones (photo beside the facts) to keep the list
  scannable.
- Grid/list is available at every width.

**Components**

- `components/concept-d/saudi-commerce/browse/`:
  - `SaudiCommerceBrowse.jsx`;
  - `BrowseView.jsx`: search band, rail, toolbar, results, pager, sheets;
  - `Filters.jsx`;
  - `Controls.jsx`;
  - `Cards.jsx`.
- `components/concept-d/saudi-commerce/Layers.jsx`: the homepage's menu and
  cart layers, moved out so Browse can use them. They work the same way as
  Option 2's.
- `Header.jsx` takes an optional `active` mode.
- Route: `app/[lang]/concept-d/browse/page.js`.

### Shared layer (behaviour only, no visual decisions)

| File | What it does |
|---|---|
| `lib/useBrowse.js` | The existing engine. It now also exports `BROWSE_DEFAULTS`, `browseStateFromParams`, `browseSearch` and `browseKey`, so a page can start from, and write, the URL itself. Filtering, counting and sorting are unchanged. |
| `components/shared/browse/BrowseRoute.jsx` | Starts a Browse view from the URL. Writes its state back with `history.replaceState(null, …)`, which Next.js also applies to its router. Remounts the view when a link, header search or back/forward lands on Browse with parameters the view did not write. Reports the current mode to the header. |
| `components/shared/browse/hooks.js` | Lot facts for cards (phase, time left, bid count, price, stock), page heading, filter labels, auction-first grouping, the auction figures, the live-auction destination and the price-field draft. |
| `components/shared/browse/copy.js` | Browse words in EN and AR, the same for all four so the pages compare like for like. |

## G. Functional parity

| Capability | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| H1 + result count + search / category context | ✓ | ✓ | ✓ | ✓ |
| All → Auctions → Buy Now with counts | underline tabs | text tabs | pill track | green segments |
| Live auction as a destination, before Buy Now | summary tile | stone band | navy banner | card in search band |
| Category | rail checkboxes | rail checkboxes | photo pills + drawer | sage category rail |
| Ending within (1 h / 6 h / 24 h) | rail (first) + chip | rail | drawer + pill | rail |
| Condition grade | rail + chip | rail | drawer + pill | rail |
| Item type · Price · In stock · Discounted | rail (+ chip) | rail | drawer (+ pill) | rail |
| Sort (5 options, Ending soonest default) | menu / sheet | menu / sheet | menu / sheet | menu / sheet |
| Grid / list | ✓ | ✓ | ✓ | ✓ |
| Paging | numbered, 12 | numbered, 12 | load more, 12 | numbered, 12 |
| Active filters + Clear all | chips | tags | pills | chips |
| Watch / save | ✓ | ✓ | ✓ | ✓ |
| Add to cart (Buy Now) | ✓ | ✓ | ✓ | ✓ |
| Phone filter sheet with "Show N results" | ✓ | ✓ | ✓ | ✓ |
| Phone sort sheet | ✓ | ✓ | ✓ | ✓ |
| Empty states (search / filters) | ✓ | ✓ | ✓ | ✓ |
| Skeletons while results update | ✓ | ✓ | ✓ | ✓ |
| Header shows the current mode | ✓ | ✓ | ✓ | ✓ |

**Query parameters checked on every option** (production build, EN):

| URL | Result in all four |
|---|---|
| `?tab=auction` | Auctions selected; header marks the auction mode as current. |
| `?tab=buy_now` | Buy Now selected; header marks Buy Now as current, still after the auction mode. |
| `?category=furniture` | H1 "Furniture", category filter on. |
| `?search=chair` / legacy `?q=chair` | H1 "Results for “chair”". |
| `?ending=1h` | Exactly the 3 auctions closing within an hour. |
| `?tab=auction&sort=most_bids` | Auctions, most bids first. |
| `?tab=buy_now&has_discount=true` | Discounted Buy Now lots. |
| `?search=zzzz` | "No lots match “zzzz”" with Clear filters and Browse all lots. |

**Entry points from the homepages and navigation:**

- header modes (auctions, ending soon, Buy Now, bulk);
- category links and mega menu;
- header search;
- Featured Items and "all auctions" links;
- footer links.

All of them pass these same parameters, so they land in the matching state.
A link followed while Browse is already open remounts Browse with the new
parameters.

**Interaction QA** (production build, 1440 px EN plus 390 px phone; script
`.scratch/cr/interact.mjs`, not committed): **92 of 92 checks passed**, 23
per option. The checks:

- open Browse (H1, results, no prototype note);
- switch All → Auctions → Buy Now (URL and header current mode);
- category filter;
- a second filter (Grade A);
- Clear filters;
- sort by Most bids from the menu;
- watch toggle;
- auction card → `/auction/…`;
- Buy Now card → `/product/…`, then Add to cart with the header count
  updating;
- the header Buy Now link while on Browse;
- search into Browse;
- EN → AR keeping `?tab=auction&category=furniture`;
- the seven URLs above;
- the empty state and its Clear filters;
- keyboard operation of the mode switch;
- the phone filter sheet ("Show 4 results") and the phone sort sheet.

No console or page errors occurred.

**Keyboard QA:** see §K.

## H. Auction-first verification

| Rule | How it is met |
|---|---|
| Mode order All → Auctions → Buy Now | The same order in the page switch, sheets and header of all four. |
| Live auction before Buy Now | Each option places its live destination above or before the mode switch: O1 summary tile, O2 stone band, O3 navy banner, O4 search-band card. |
| Checked in the DOM | Script `.scratch/cr/order.mjs` on the final build: **16 of 16 pages** (4 options × EN/AR × 1440 / 390 px) have the mode controls in All → Auctions → Buy Now order and the live destination before the Buy Now control. Wherever the header shows its modes, the auction mode comes before Buy Now. On phones, Options 1, 2 and 4 keep the header modes in the menu. |
| Auctions first in the results | The default sort is **Ending soonest**: open auctions by time left, then Buy Now, then upcoming and closed. Results are grouped under "Auctions closing first", "Buy Now" and "Coming up and closed". |
| Auction filters easy to reach | "Ending within" is first in Option 1's rail and right after Category in Options 2–4. Options 1 and 3 also offer a one-tap "Ending within 1 hour". Option 1's "Closing within an hour" figure applies it too. |
| Auction action outranks Buy Now | In all four, auction cards carry the filled primary **Bid now** and Buy Now cards an outlined cart action (Option 1 reuses its homepage cards, which already do this). Auction + Buy Now lots lead with the bid: Options 2–4 add "or buy now" second; Option 1 shows "Auction + Buy Now" in the status badge. |
| Header | `?tab=auction` marks the auction mode current; `?tab=buy_now` marks Buy Now current. Navigation order is unchanged. |
| No casino styling | No flashing or animated urgency. Red is limited to the existing countdown treatment of each homepage. Countdowns are plain text with an icon or a pill, as on the homepages. |

## I. English and Arabic

- **Copy:** every Browse string has EN and AR (`components/shared/browse/copy.js`
  plus the existing `data/ui.js`). Arabic headings, legends and CTAs were
  read in screenshots at 1440, 1024 and 390 px.
- **Direction:**
  - filter rails sit on the right in Arabic;
  - chevrons and pagination arrows flip;
  - sheets slide from the correct side;
  - prices stay left-to-right with the riyal sign, as on the homepages;
  - countdowns use Western digits, as on the homepages;
  - photographs are never mirrored.
- **Arabic type:** each option uses its homepage's Arabic family and sizes.
  Option 2's Arabic page title is set slightly smaller with taller lines
  (29/44, 33/50 and 38/56 px), because Arabic letterforms run larger and
  taller at the same size.
- **Arabic Add to cart:** the old Round 2 cards overflowed at some widths.
  The new Browse cards are new components, sized so the Arabic label fits at
  every tested width (spill check below). The fix lives only in the Browse
  cards; old pages are untouched.
- **EN ↔ AR:** the language switch keeps the Browse query
  (`?tab=auction&category=furniture` → `/ar/…/browse?tab=auction&category=furniture`)
  in all four options. For Options 2–4 this was added to the shared
  homepage language switch (`components/shared/r3/home.jsx`), only for
  `/browse` paths, so the homepages behave as before.

## J. Responsive QA

**Overflow / spill sweep:** script `.scratch/cr/sweep.mjs`, production build.

- Coverage: 4 options × EN/AR × 12 widths (1920, 1440, 1366, 1280, 1200,
  1024, 768, 480, 430, 390, 360, 320) = **96 pages**.
- On the final build the sweep stalled once while another test run was
  competing for the browser. Options 1 and 4 had finished; Options 2 and 3
  were re-swept on their own, with the same result.
- Results:
  - horizontal overflow: **0**;
  - text spilling out of a control: **0**;
  - broken images: **0**;
  - console errors: **0**;
  - exactly one H1 on every page.

**Small targets the sweep flags, all checked:**

- visually hidden labels (1 × 1 px, not targets);
- the price fields inside their larger framed boxes;
- Option 1's breadcrumb "Home" (shared breadcrumb, as on other pages);
- Option 2's "Join live auction" text link, whose hit area is enlarged to
  about 44 px tall by a pseudo-element.

**Truncation check** (buttons and links cut off with an ellipsis; 4 options
× EN/AR × 6 widths × 2 states), two intentional cases, both in Option 1:

- The **Live now** tile truncates the event title to one line. The full
  title stays in the link's accessible name.
- Option 1's existing phone sort button shows "Ending soo…" at 320–360 px in
  English. This is the shared Option 1 component, unchanged visually; its
  accessible name is now "Sort by: Ending soonest".

**Tablets:** Options 2–4 switch to their phone/tablet layout below 1200 px,
and Option 1 below 1024 px. At 768–1199 px each has a real tablet layout
(three columns, sheet-based filters, the full head and live destination),
not a squeezed desktop. Screenshots at 1024 px are in the docs folder.

**Visual review:** full-page screenshots of every option at 1440 EN, 1440 AR,
1024 EN, 390 EN and 390 AR were inspected against the review questions:

- same product as the homepage;
- distinct from the other options;
- auctions primary;
- hierarchy clear;
- filters usable;
- mobile designed;
- Arabic intentional.

Issues found during that review were fixed before this report:

- Arabic label fit;
- phone mode switches below 380 px;
- a phone grid overflow in Option 4;
- view switches on phones;
- Option 1's phone quick chips;
- the Buy Now discount badge, which sat on the wrong side in Arabic
  (Options 2 and 3; in Option 2 it overlapped the heart button).

## K. Accessibility

- **axe-core (WCAG 2.1 A/AA):** script `.scratch/cr/axe.mjs`, production
  build.
  - Coverage: 48 states = 4 options × EN/AR × (1440 px: default, filtered,
    empty search, Buy Now; 390 px: default, open filter sheet).
  - Result: **0 violations of any impact** (serious, critical, moderate or
    minor).
- **Structure:**
  - one H1 per page;
  - a visually hidden "Results" H2 and group H3s;
  - filters in a labelled `aside` (Options 1, 2 and 4) or a labelled dialog
    (Option 3, and every phone sheet);
  - the live auction as a labelled region (Options 2 and 3) or a link that
    names the event (Options 1 and 4).
- **Forms:**
  - the sale mode is a `fieldset` with a legend (radio group) in Options
    2–4, and an `aria-pressed` button group in Option 1;
  - filter groups are fieldsets with legends;
  - each price field has a label;
  - the sort sheets are radio groups;
  - the search fields have labels.
- **States:**
  - `aria-pressed` on toggles and view switches;
  - `aria-current="page"` on the header's current mode and the current page
    number;
  - result counts in `aria-live="polite"`;
  - `aria-busy` on results while loading;
  - skeletons hidden from assistive technology.
- **Countdowns and auction state:** written out with a label ("Time left
  2h 15m", "Starts in …", "Ended"), never colour alone. Countdowns are not
  in live regions, so screen readers are not interrupted every second. The
  sale type is always written on the card.
- **Contrast:** colours come from the homepages' audited tokens. axe found
  no contrast failures in any state.
- **Keyboard:** script `.scratch/cr/kbd.mjs`, production build, 21 checks.
  Per option:
  - a full Tab walk from the top at 1440 and 390 px;
  - the phone filter and sort sheets;
  - the desktop sort menu;
  - for Option 3, its All filters drawer.

  **21 of 21 pass on the final build:**
  - every Tab walk reaches the footer with no trap (45–78 stops per page,
    and no hidden element takes focus);
  - each sheet and drawer opens with Enter, moves focus inside, keeps Tab
    inside, closes with Escape and returns focus to its button;
  - each sort menu opens with Enter, moves with the arrow keys, chooses with
    Enter, returns focus to its button and closes with Escape.

  The first keyboard run found two faults in shared primitives. Both are
  now fixed:
  1. **Focus after the sort menu.** Choosing an option, or pressing Escape,
     left focus on the page body. `components/shared/ui/Listbox.jsx` now
     returns focus to its button.
  2. **Tab leaving the sort sheet.** Tab could leave a sheet whose last
     control is a radio group, because the focus trap counted every radio
     as a separate stop. `components/shared/ui/useOverlay.js` now treats a
     radio group as one stop, as browsers do.

  Shared effects (behaviour only, nothing visual):
  - The Listbox fix also applies to Option 1's header category picker,
    which appears on every Option 1 page including its homepage, and to the
    Round 2 sort and search pickers. They now return focus to their button.
  - The overlay fix changes only panels that contain native radio groups:
    the Browse sheets, the Round 2 seller-page sheets and the components
    page. The homepage drawers contain none.
- **Screen-reader label for sort buttons:** where the phone or tablet sort
  button shows only the current choice ("Ending soonest"), it now also says
  "Sort by:" to assistive technology (Options 1, 3 and 4; Option 2 already
  showed it). In Option 1 this is the shared phone bar, so Option 1's seller
  page gets the same invisible label. That is the only shared effect, and it
  is not visible.

## L. Performance

- **Nothing heavy added:** no new images, image formats, fonts or libraries.
  No animation library. Drawers and sheets reuse the project's existing
  `Drawer` / `SheetPanel` primitives.
- **Data:** the sample catalogue has **29 lots**: 11 auctions (one also
  offers Buy Now) and 18 Buy Now. 27 are live, 1 upcoming and 1 closed, in
  8 categories. Browse renders **12 cards at a time**, never the whole
  catalogue.
- **Images:** the existing pre-optimised WebP derivatives through the
  shared `Img` component (`srcset` + `sizes`). The first row loads eagerly
  at high priority; the rest load lazily.
- **Measured**, production build, Browse at 1440 / 390 px, scrolled to the
  end of the first page (script `.scratch/cr/perf.mjs`):

| Option, 1440 px | Lots shown | Images (count / weight) | JS | CSS | Fonts | DOM nodes |
|---|---|---|---|---|---|---|
| 1 · new | 12 | 12 / 76 KB | 1,234 KB | 228 KB | 175 KB | 1,273 |
| 1 · old | 8 | 8 / 50 KB | 1,158 KB | 215 KB | 175 KB | 1,028 |
| 2 · new | 12 | 12 / 298 KB | 1,327 KB | 235 KB | 329 KB | 1,042 |
| 2 · old | 8 | 8 / 50 KB | 1,195 KB | 222 KB | 283 KB | 1,052 |
| 3 · new | 12 | 16 / 651 KB | 1,334 KB | 238 KB | 353 KB | 895 |
| 3 · old | 8 | 8 / 50 KB | 1,199 KB | 224 KB | 229 KB | 1,092 |
| 4 · new | 12 | 12 / 360 KB | 1,336 KB | 238 KB | 199 KB | 1,149 |
| 4 · old | 8 | 8 / 50 KB | 1,196 KB | 224 KB | 296 KB | 1,076 |

At 390 px the totals are about the same (Option 3's images: 605 KB), and
fewer images load before scrolling: 5–11, against 9–13 at 1440 px.

**Reading the numbers:**

- **Images.** Options 2–4 now show the same photo derivatives as their
  homepage cards: cut-outs on plates, larger than the old 6 KB thumbnails.
  Option 3 also loads the small photos in its category pills and one larger
  lead image. Below the first row, every image is lazy.
- **JS.** Options 2–4 now ship their homepage shell (header, menu, cart
  drawer, footer) in place of the Round 2 chrome, plus the new Browse
  components. That adds 76–140 KB. No library was added.
- **Fonts.** Each page now uses its homepage typography, so font weight
  follows the homepage. Option 4's is lighter than before.
- **DOM.** It stays between 900 and 1,300 nodes for 12 lots.

## M. Homepage regression

**Method:** script `.scratch/nav/regress-chrome.mjs`, final build vs
`76a2d95`, both production builds.

- Full-page screenshots of all four homepages, EN and AR, at 1440, 1024,
  768, 390 and 320 px: **40 pairs**.
- Same frozen clock on both sides.
- Photographs masked, so image decoding cannot add noise.
- Each page is compared in three bands: header, content, footer.

| Option | Pairs | Header | Content | Footer |
|---|---|---|---|---|
| 1 · Modern Commerce | 10 | 0 px | 0 px | 0 px |
| 2 · Premium Modern | 10 | 0 px | 0 px | 0 px |
| 3 · Visual Discovery | 10 | 0 px | 0 px | 0 px |
| 4 · Contemporary Saudi | 10 | 0 px | 0 px on 9 pairs; 41 px on EN 1024 | 0 px |

**Result:** 39 of 40 pairs are pixel-identical. The one difference is
rendering noise, not a change:

- **Where:** a single 1-px row at the edge of a masked photo in Option 4's
  Featured Sellers section.
- **Not repeatable:** capturing the same pair again gave 0 differing pixels.
- **Same on the baseline:** comparing the `76a2d95` build with itself shows
  the same kind of difference (34 px in one row of the same section).

**No changes to:**
- section order or Featured Items;
- the homepage navigation or footer;
- the selector thumbnails.

**Other inner pages** (script `.scratch/nav/regress-chrome.mjs`, new build
vs `76a2d95`):

- Coverage: 4 options × 8 routes × EN/AR × 1440 / 390 px = **128 pairs**.
  Routes: `/auction`, `/auction/fridge-690`, `/product`,
  `/product/task-lamp`, `/live-auction`, `/seller`, `/seller/RAWABI`,
  `/system`.
- Page content and footer: **0** changed pixels on all 128.
- Option 1 is identical everywhere.
- Options 2–4 differ only in the band above the content: the wording of the
  "Earlier prototype" note, which now names Home and Browse as the new
  pages. The header itself was compared separately on 24 samples and is
  pixel-identical.
- The known `/live-auction` and `/system` 320 px overflows were left alone,
  as instructed.

**Selector page and presentation bar** (preview chrome, not part of any
design):

- The "New design" tag is now on Home **and** Browse for Options 2–4.
- The presentation bar groups Browse with Home under "New design", so its
  divider moves one item along on every page.
- The bar's "Light only" label also shows on the new Browse pages.
- The selector **thumbnails are unchanged**: no file under `public/`
  changed.

## N. Files changed

Paths under `design-preview/` unless they start at the repository root.

**New: Browse pages**

| Option | Files |
|---|---|
| 2 | `app/[lang]/concept-a/browse/page.js`; `components/concept-a/premium-modern/browse/` (`PremiumModernBrowse.jsx`, `BrowseView.jsx`, `Filters.jsx`, `Controls.jsx`, `Cards.jsx`); `components/concept-a/premium-modern/Layers.jsx` |
| 3 | `app/[lang]/concept-c/browse/page.js`; `components/concept-c/visual-discovery/browse/` (`VisualDiscoveryBrowse.jsx`, `BrowseView.jsx`, `Filters.jsx`, `Controls.jsx`, `Cards.jsx`); `components/concept-c/visual-discovery/Layers.jsx` |
| 4 | `app/[lang]/concept-d/browse/page.js`; `components/concept-d/saudi-commerce/browse/` (`SaudiCommerceBrowse.jsx`, `BrowseView.jsx`, `Filters.jsx`, `Controls.jsx`, `Cards.jsx`); `components/concept-d/saudi-commerce/Layers.jsx` |
| 1 | `components/concept-b/browse/BrowseResults.jsx` |
| Shared | `components/shared/browse/BrowseRoute.jsx`, `copy.js`, `hooks.js` |

**Modified: Browse**

| File | Change |
|---|---|
| `components/concept-b/browse/BrowseView.jsx` | Rewritten for the new Option 1 layout. |
| `components/concept-b/pages/BrowsePage.jsx` | Uses `BrowseRoute`. |
| `components/concept-b/browse/FacetPanel.jsx`, `MobileFilterBar.jsx` | `endingFirst` option, off by default. MobileFilterBar also gains the screen-reader "Sort by:" prefix. |
| `components/concept-b/utils/navigation.jsx` | Links into an open Browse page now use the router-visible URL change instead of a custom event. |
| `lib/useBrowse.js` | Exports its URL helpers. Filtering, counts and sorting are unchanged. |

**Modified: shared chrome, homepage behaviour unchanged**

| File | Change | Homepage effect |
|---|---|---|
| `components/concept-{a,c,d}/…/Header.jsx` | Optional `active` mode for Browse. | None: without it, the markup is as before. |
| `PremiumModernHome.jsx`, `VisualDiscoveryHome.jsx`, `SaudiCommerceHome.jsx` | Mobile menu and cart drawer moved into each option's `Layers.jsx`, so Browse can use them. Menu gains the optional `active` mode. | None: without it, the same markup. Proven pixel-identical (§M). |
| `components/shared/r3/home.jsx` | Language switch keeps the query on `/browse` paths only. | None. |
| `components/shared/ui/Listbox.jsx` | Returns focus to its button after a choice or Escape (§K). | Option 1's header category picker returns focus too. Not visible. |
| `components/shared/ui/useOverlay.js` | Focus trap treats a native radio group as one Tab stop (§K). | None: homepage drawers contain no radio inputs. |
| `app/[lang]/layout.js` | The pre-paint script also marks the new Browse paths, so their colours apply before first paint. | None. |
| `styles/r3-premium-modern.css`, `r3-visual-discovery.css`, `r3-saudi-commerce.css` | New page-title, kicker and no-spinner classes. | None: added classes only, no existing rule changed. |

**Modified: preview chrome and documentation**

- `lib/routes.js`: `NEW_DESIGN_PAGES`.
- `components/shared/presentation/PresentationBar.jsx`,
  `ConceptSelector.jsx`, `PrototypeNotice.jsx`, `selector-copy.js`: mark
  Browse as new design; prototype note wording.
- `app/[lang]/concept-{a,c,d}/layout.js`: comments only.
- `README.md` (design-preview) and the root `CLIENT_PREVIEW_GUIDE.md`: Home
  and Browse are the new design.

**Removed:** `app/[lang]/concept-{a,c,d}/(round2)/browse/page.js`, the
old Round 2 Browse routes, replaced by the new routes above.

**Reports and screenshots (repository root)**

- `CLIENT_REVIEW_DESIGN_SYSTEM_AUDIT.md`
- `CLIENT_REVIEW_BROWSE_REPORT.md`
- `docs/client-review-browse/`

**Not changed**

- Homepage sections, cards, data, images and selector thumbnails.
- Anything under `public/` or `data/`.
- Production code, Vercel settings and domains.

## O. Known limitations and deferred work

1. **Round 2 Browse files kept, unrouted.** For Options 2–4,
   `components/concept-{a,c,d}/pages/BrowsePage.jsx`, `browse/BrowseView.jsx`
   and `browse/QuickFilters.jsx` are no longer used, nor is Option 1's
   `browse/QuickFilters.jsx`. Deleting them was not done in this session.
   They are harmless and can be removed in a clean-up. The other Round 2
   `browse/*` files are still used by the Round 2 seller pages.
2. **No seller, delivery or location filters.** The current Browse data has
   no seller filter (production `/browse` has none either) and no delivery
   or location fields. Nothing was faked.
3. **`?tab=live`** is accepted, as in production's parameter contract, but
   the preview has no separate live filter. It shows all lots with no mode
   selected, exactly as before. The live auction is reached through each
   page's live destination.
4. **Option 3's Load more ignores `?page=`.** Load more is progressive, not
   paged. `page` still works in Options 1, 2 and 4.
5. **Option 4's on-page search refines the current mode.** Searching while
   on Buy Now looks only in Buy Now. The mode switch shows the matches in
   each mode, and the empty state offers Clear filters and Browse all lots.
   Options 1–3 search from the header and start a fresh Browse.
6. **Grouped grids can leave a short last row** inside a group (for example
   three auctions in a four-column row). Option 3 offsets this with its lead
   tile.
7. **Static export:** the HTML for `/browse` contains the page chrome and a
   skeleton. The heading and results render once the browser has read the
   URL, which keeps the first paint from showing the wrong results for a
   filtered link. Checked with `STATIC_EXPORT=1 next build`:
   - all eight Browse pages are exported (`out/{en,ar}/concept-{a,b,c,d}/browse/index.html`);
   - served as plain files, each opened with `?tab=auction&category=furniture`
     already applied (H1 "Furniture" / "الأثاث", 2 lots);
   - switching to Buy Now rewrote the address to
     `?tab=buy_now&category=furniture`;
   - no console errors.
8. **Development-only console message:** `next dev` logs "Encountered a
   script tag while rendering React component" after an EN → AR switch. It
   comes from the existing pre-paint script in the root layout. It does not
   occur in the production build (0 console errors in all QA runs).
9. **Lint after the last fixes.** `eslint` passed on the code before the
   last four small fixes:
   - the screen-reader "Sort by:" labels;
   - the Arabic discount-badge position;
   - Listbox focus return;
   - the overlay radio-group Tab stop.

   It could not be re-run afterwards, because this session's permission
   settings blocked the command. `next build` compiled the final code
   without errors or warnings. Running `npm run lint` in `design-preview/`
   is a quick confirmation.
10. **Earlier prototypes stay labelled.** Auction, Product, Live auction,
   Seller and Components & states remain Round 2 prototypes with the note.
   Their redesign, and Cart, Checkout, Account, Priority 3 and any backend
   or production work, was not started.
