# Khazna Customer Website Redesign — Round 3 Structural Design Plan

> **Status: structural plan for approval — revision 2. Nothing has been implemented.**
> The preview app is unchanged: `concept-a`, `concept-c` and `concept-d` still
> hold their Round 2 versions, and Option 1 (`concept-b`) is read-only.
> Coding starts only after this plan is approved:
> **structural plan approval → implementation → visual QA → client preview.**

Baseline: branch `claude/magical-faraday-fne4kq`. The preview app has not changed
since commit `886b32c`; revision 1 of this plan was commit `ef4bfe4`.
Scope: the isolated `design-preview/` app only. No production frontend,
backend, API, admin, seller, warehouse or deployment changes.

**What changed in revision 2.** An independent review checked revision 1
against the Option 1 code, the sample data and the production reference
(summary in section 9). It found three problems:

- the Option 1 reference understated what Option 1 already has;
- the cards in Options 2 and 4 were still too close to Option 1's;
- several wireframes used numbers the sample data does not support.

This revision:

- redraws the Option 1 reference from its code (section 3);
- redesigns the weak areas:
  - Option 2: cards, hero, navigation and live presentation;
  - Option 3: browse table, detail pages, live room and mobile bar;
  - Option 4: header, cards, live room and seller presentation;
- replaces revision 1's "0 of 11" with an honest audit. Each area gets a
  verdict of DIFFERENT, PARTIALLY SIMILAR or SUBSTANTIALLY SAME, for the
  brief's 11 questions and for all 24 structural dimensions it lists;
- draws every wireframe from the shared sample data.

---

## 1. What this plan proposes

The Round 2 review found that Options 2–4 reused Option 1's page skeleton and
differed mainly in colour, type and card styling. This plan replaces them with
three **structurally different** marketplaces. Each option keeps Option 1's
quality, usability and functional scope, but has its own page architecture.

| Option | Name | Route slot | Organising idea | Structure in one line |
|---|---|---|---|---|
| 1 | Modern Commerce | `concept-b` | Search-led commerce portal | **Reference — unchanged, read-only** |
| 2 | **Visual Marketplace** | `concept-a` | Product images drive discovery | One bar with links either side of a centred logo; a centred discovery hero framed by product cut-outs; a photo mosaic of categories and sellers; square image tiles with an in-image band; filmstrip lot pages; an image-feed mobile site |
| 3 | **Marketplace Hub** | `concept-c` | Search and dense discovery | An app shell with a navigation rail and category tree; a search deck and counters; a dashboard of list modules; a sortable data table with quick view; lot sheets with an in-page index; a bottom command bar on phones |
| 4 | **Auction Commerce** | `concept-d` | Time: live now, closing next, opening soon | One bar with a floor switcher; a live stage; an ending-soon timeline; data-first bid tickets; a time-bucketed finder; a past · now · next live room; a docked bidding console |

Route slots stay the same, so no routing or preview tooling changes. The
client-facing selector keeps its current labels until the new designs are built.

---

## 2. Ground rules for Round 3

1. **Option 1 is read-only.** No change to `components/concept-b/**`,
   `styles/concept-b.css` or its behaviour, layout, colours, typography,
   navigation or responsive rules.
2. **Options 2–4 start from a blank structure.** They will not be built by
   editing the current Round 2 code. They will not import from, copy, or use
   Option 1's page architecture as a template (no `Header`, `CategoryNav`,
   `DetailLayout`, `BrowseView`, `LiveView` or similar).
3. **Shared layers only:**
   - the sample data (`data/`);
   - the behaviour hooks (`lib/useBrowse`, `lib/useAuction`,
     `lib/useLiveEvent`) and the clock, formatting, i18n and catalogue
     helpers;
   - the preview store (cart, watchlist, toasts);
   - the low-level UI primitives in `components/shared/` (Money, Img, Modal,
     Drawer, Listbox, PriceRange, Skeleton, Toaster, hooks, brand logo).
4. **Differences must survive grayscale.** None of these counts as
   differentiation anywhere in this plan: colour, font, radius, shadow, icon
   style, badge style, background tone, or spacing alone.
5. **Same data, same features.** Every option uses the same products,
   sellers, categories, prices, auction information, images and lot
   information. Every option supports Buy Now, timed auctions, live auctions,
   search, categories, filters, sellers, cart, watchlist, customer account,
   bidding, condition grading and delivery/pickup information (section 10).
6. **English and Arabic are both first-class** in every option. All
   wireframes are drawn left-to-right. In Arabic every layout mirrors: start
   and end swap, and time axes, reels and triptychs run right-to-left.
7. **Status and bidding wording** follows the Phase 1B claims audit:
   - Timed lots say "Open for bids". LIVE and the live dot `*` mark live
     events only.
   - Every timed-auction amount button opens the confirm step, with the
     sign-in and deposit checks, as Option 1 does
     (`components/concept-b/auction/AuctionDialogs.jsx`). That covers cards,
     table rows, quick views, ladder rungs, console chips and "Place bid".
   - Live-room bids work as in Option 1's live panel: one tap, binding once
     placed, with the deposit checked for the room.
   - The 5-minute extension applies to timed auctions only. Live lots are
     called by the auctioneer: no automatic selling and no automatic extension.
   - Required phrases:
     - "Delivery priced at checkout" and "Pickup where offered";
     - a refundable deposit covered by the wallet;
     - a payment window for timed-auction wins only;
     - lot outcomes "Sold" and "Unsold".
8. **Accessibility in every option:**
   - Text on photographs always sits on a solid band.
   - Timelines and reels have a list alternative for screen readers.
   - Option 3's table uses real table markup with sortable headers.
   - Floating cards and docked consoles never cover focused content.

**Wireframe legend:**

| Symbol | Meaning |
|---|---|
| `░` | Photograph or image area |
| `▒` | Solid dark band (text on a solid backing) |
| `▓` | Current or highlighted item |
| `[ ... ]` | Button or control |
| `v` | Dropdown or column filter |
| `^` | Sorted column, or a note that refers to the line above |
| `<  >` | Carousel |
| `*` | Live event (never used for timed lots) |
| `(Q)` | Search |
| `(W)` | Watch heart |
| `(+)` | Add to bag or cart |
| `[░]`, `[░░]` | Small photo |
| `[=]` | Menu |

Numbers in the wireframes come from the shared sample data (`data/`). Lot
titles are placeholders.

---

## 3. Option 1 — the reference skeleton (read-only)

These wireframes were redrawn from the Option 1 code (`components/concept-b`)
after the review. They show what the new options must not repeat, and what
Option 1 already has.

### Option 1 homepage
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ UTILITY STRIP (dark)  Deliver to Riyadh | trust ticker | Sell  Help  AR    │
├────────────────────────────────────────────────────────────────────────────┤
│ LOGO  [Category v| Search lots, brands, categories ][Go]  Acct Watch Cart  │
├────────────────────────────────────────────────────────────────────────────┤
│ [All categories v]  Live now  Auctions  Buy Now  Ending soon  Bulk  Sellers│
│   (All categories = photo mega menu: 8 photos + counts, quick links, live) │
├──────────────────────────────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ENDING UNDER AN HOUR    │
│ ░░░░░ HERO CAROUSEL  (8/12 width, 436px+) ░░░░░░ │ ░ lot  SAR 180    9m    │
│ ░░░░░░░░ brand · live · pallets slides ░░░░░░░░░ │ ░ lot  SAR 1,480 18m    │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░ lot  SAR 540   46m    │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ├─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ BUY NOW DEAL            │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░ -33%  SAR 175 [Add]  │
├──────────────────────────────────────────────────┴─────────────────────────┤
│ TRUST STRIP   deposit | condition graded | secure payment | delivery       │
├────────────────────────────────────────────────────────────────────────────┤
│ CATEGORY TILES   [░][░][░][░][░][░][░][░]   all 8 in one row               │
│ AUCTIONS RAIL    [card][card][card][card][card] >   ending | most bid      │
├────────────────────────────────────────────────────────────────────────────┤
│ ▒▒▒▒▒▒▒▒▒▒ LIVE BAND:  live lot photo | now bidding + coming up ▒▒▒▒▒▒▒▒▒▒ │
├────────────────────────────────────────────────────────────────────────────┤
│ BUY NOW DEALS    [card][card][card][card][card]   5 across                 │
│ PALLETS & BULK   [wide manifest card][wide manifest card][small lots]      │
│ SELLERS          stats band + seller tiles (cover · monogram · counts)     │
│ HOW IT WORKS (4 steps)  |  CONDITION GRADES                                │
│ FOOTER                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Header: three tiers.**
  - A dark utility strip: Deliver to, a trust ticker, Sell, Help, language.
  - Logo, a scoped search bar (up to 800px), then Account, Watchlist and Cart.
  - A category bar.

  "All categories" opens a **photo mega menu**. It has three parts:
  - all 8 categories in a four-column grid, each with a 56px photo, name,
    short description and lot count;
  - a quick-links column;
  - a live-event card.
- **Hero:** an 8/12 carousel beside two stacked 4/12 tiles.
  - The carousel is at least 436px tall on desktop (it stretches to match the
    tiles), 500px on phones and 420px on small tablets.
  - The first tile, "Ending in under an hour", holds three thumbnail rows.
  - The second tile shows the biggest Buy Now saving.
- **Below the hero, in order:**
  - a trust strip;
  - 8 equal category tiles in one row (a round-tile rail on phones);
  - an auctions rail;
  - a full-bleed dark live band;
  - a five-across deals grid;
  - wide pallet cards with manifest thumbnails;
  - a stats band with seller tiles (80px cover, monogram, city, counts);
  - "How it works" beside the condition grades.
- **Three card formats:**
  - the vertical `AuctionCard` / `BuyNowCard`;
  - the list-view `LotRow` (88–128px thumbnail, seller, title, grade and type,
    price, bids and countdown, then watch and Bid or Add);
  - `CompactLot` thumbnail rows.

  Option 1 also has a segmented countdown and an auction progress bar.

### Option 1 browse
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER (3 tiers: utility strip / logo + search + actions / category bar)   │
├────────────────────────────────────────────────────────────────────────────┤
│ Home > Browse > Home Appliances                                            │
│ HOME APPLIANCES   6 results                                                │
│ [All 6 | Auctions 5 | Buy Now 1]  [Ending < 1h] [Discounted] [Grade A]     │
├──────────────────────┬─────────────────────────────────────────────────────┤
│ FILTERS (sticky)     │ 1-6 of 6   [chip x]            Sort v  [grid|list]  │
│ Category             │                                                     │
│ [x] Appliances   6   │  [card]     [card]     [card]     [card]            │
│ [ ] Kitchen      4   │  ░░░░░░     ░░░░░░     ░░░░░░     ░░░░░░            │
│ Condition grade      │  ░░░░░░     ░░░░░░     ░░░░░░     ░░░░░░            │
│ [ ] New  [x] A       │  title      title      title      title             │
│ Price  o------o      │  price      price      price      price             │
│ Item type            │                                                     │
│ Ending within        │  grid 2 / 3 / 4 across; list view = wide            │
│ Availability         │  row cards (photo · facts · price · action)         │
│                      │             < 1  2  3 >   numbered pages            │
└──────────────────────┴─────────────────────────────────────────────────────┘
```

- A sale-type switch with counts (All | Auctions | Buy Now) and three chips:
  Ending < 1h, Discounted, Grade A.
- A sticky 240px facet sidebar.
- A grid 2, 3 or 4 across (3 at 1024–1279px), or the `LotRow` list view.
- Numbered pages.
- On phones, a filter sheet with "Show N results".

### Option 1 product and auction detail
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER (3 tiers)                                                           │
│ Home > Category > Lot title                                                │
├──────┬────────────────────┬────────────────────────┬───────────────────────┤
│ [░]  │ GALLERY            │ TITLE                  │ BUY / BID BOX (sticky)│
│ [░]  │ ░░░░░░░░░░░░░░░░░░ │ grade · seller · watch │ price / current bid   │
│ [░]  │ ░░░░░░░░░░░░░░░░░░ │ highlights             │ countdown             │
│ [░]  │ ░░░░░░░░░░░░░░░░░░ │ details                │ qty / quick bids      │
│ thumb│ ░░░░░░░░░░░░░░░░░░ │ specifications         │ [Add to cart]         │
│      │                    │ description            │ [Buy now] / [Bid]     │
├──────┴────────────────────┴────────────────────────┴───────────────────────┤
│   three columns from 1280px; 768-1279px: content + a sticky 320-360px box  │
│ PRODUCT: tabs Overview · Manifest · Specifications · Condition · Delivery  │
│ AUCTION: bid history | auction terms side by side · manifest · similar     │
│ RAILS    related items >   more from this seller >                         │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Layout:**
  - From 1280px, three columns: gallery (with a 76px vertical thumbnail
    column), details, and a sticky box.
  - From 768px to 1279px: content plus a sticky 320–360px box.
  - Thumbnails sit under the image only on phones and tablets.
- **Product pages:**
  - Tabs: Overview · Manifest · Specifications · Condition · Delivery &
    returns.
  - Then two rails: Related and More from this seller.
- **Auction pages:**
  - No tabs. Bid history and Auction terms sit side by side, followed by the
    manifest table and a Similar auctions rail.
  - Every timed bid has a confirm step, and delivery information is shown.

### Option 1 live auction
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER (3 tiers)                                                           │
│ LIVE · 1,284 watching   EVENT TITLE   presenter · hosted by seller         │
├──────────────────────────────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░ LIVE STAGE (stream) ░░░░░░░░░░░░░░ │ BID PANEL               │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ current bid             │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ [ Bid SAR 1,265 ]       │
│ CURRENT LOT  title · bid · lot clock             ├─────────────────────────┤
│   · up next                                      │ ACTIVITY FEED           │
├──────────────────────────────────────────────────┤ bidder · amount · time  │
│ LOTS TABLE (order of sale)                       │ (panel spans both rows) │
├──────────────────────────────────────────────────┴─────────────────────────┤
│ MORE LIVE EVENTS   [event card]  [event card]                              │
└────────────────────────────────────────────────────────────────────────────┘
```

- The stage shows the stream. Under it is the current-lot strip, with a lot
  clock and "Up next".
- The lots table sits in the main column.
- A 380px side panel (bid panel and activity) spans both rows.
- Phones use Bid | Activity | Lots tabs and a fixed bid bar.
- Live bids are one tap.

### Option 1 seller storefront
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER (3 tiers)                                                           │
├────────────────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░ COVER PHOTO (176-256px) ░░░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────────────────────────────────────────────────────────┤
│ [ IDENTITY CARD overlaps the cover: name · tagline | 3 stats | trust ]     │
├────────────────────────────────────────────────────────────────────────────┤
│ [All listings | Auctions | Buy Now]   [search store]   Sort v  [grid|list] │
├──────────────────────┬─────────────────────────────────────────────────────┤
│ FILTERS (sidebar)    │  [card]     [card]     [card]     [card]            │
│ ...                  │  [card]     [card]     [card]     [card]            │
├──────────────────────┴──────────────┬──────────────────────────────────────┤
│ ABOUT                               │ PICKUP & HOURS                       │
└─────────────────────────────────────┴──────────────────────────────────────┘
```

- A 176–256px cover with an overlapping identity card.
- Tabs (All listings | Auctions | Buy Now) with counts, plus store search,
  sort and view.
- A sidebar and a grid.
- About and Pickup in two columns.

### Option 1 mobile homepage
```text
┌──────────────────────────────────┐
│ [=] LOGO            Acct  Cart   │
├──────────────────────────────────┤
│ [ Search lots, brands...     ]   │
│   (search row hides on scroll)   │
├──────────────────────────────────┤
│ ░░░░░░░░ HERO CAROUSEL ░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├──────────────────────────────────┤
│ ENDING UNDER AN HOUR (list)      │
│ BUY NOW DEAL (tile)              │
├────────────────┬─────────────────┤
│ trust          │ trust           │
│ trust          │ trust           │
├────────────────┴─────────────────┤
│ categories rail  [░][░][░] >     │
│ auctions rail    [c][c][c] >     │
│ ▒▒▒▒▒▒▒▒▒▒ live band ▒▒▒▒▒▒▒▒▒▒▒ │
│ deals grid, 2 across             │
│ pallets · sellers · steps        │
├──────┬──────┬──────┬──────┬──────┤
│ Home │ Cats │ Live │ Cart │ Acct │
├──────┴──────┴──────┴──────┴──────┤
│ (lot pages swap in their own bar)│
└──────────────────────────────────┘
```

- The header has the menu, logo, Account and Cart. The search row below it
  hides on scroll.
- A five-tab bottom bar: Home · Categories · Live · Cart · Account.
- The tab bar is hidden on product, auction and live pages, which have their
  own fixed action bars.

**The skeleton to avoid**, in the brief's words:
- a thin utility bar;
- logo plus a large search;
- category navigation;
- a large hero on the left;
- an Ending Soon panel on the right, with a Buy Now panel below it;
- a trust strip;
- similar content grids.

---

## 4. Option 2 — Visual Marketplace (slot `concept-a`)

### A. Design objective

A visual-first marketplace where product imagery drives discovery. Large
square product images, an image-led mosaic of categories and sellers, and a
calm page rhythm let customers browse Khazna the way they browse a
well-merchandised store. Search, filters, auctions, live sales, the bag and the
watchlist stay one step away.

It must remain a usable marketplace, not an editorial magazine. The home page
shows **17 lots without using a carousel**:

| Section | Lots |
|---|---|
| Featured now | 4 |
| Featured marketplace | 6 |
| On the block (per view) | 2 |
| Ready to buy | 5 |

The On the block carousel also holds all 9 open auctions.

### B. Desktop homepage wireframe
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Categories  Buy Now  Auctions      LOGO  Live* Sellers Search (W) Me Bag AR│
│   (one bar, transparent over the hero, solid after scrolling)              │
├────────────────────────────────────────────────────────────────────────────┤
│ ░░░░░ CUT-OUT COMPOSITION FRAMES A CENTRED DISCOVERY BLOCK · ~480px ░░░░░░ │
│ ░░░░░░░░░░░░░░      Graded returns, surplus & pallets       ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░             HEADLINE (two lines)             ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░  [ What are you looking for?  (Q) Search ]   ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░  Popular: air conditioner · pallet · fridge  ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░   (░)Appliances (░)Kitchen (░)Furniture  >   ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░  Graded lots · delivery priced at checkout   ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░    Shop Buy Now ->    Browse auctions ->     ░░░░░░░░░░░░░░ │
│ ░░░┌─────────────┐░░┌─────────────┐░░┌─────────────┐░░┌─────────────┐░░░░░ │
│ ░░░│░░░░░░░░░░░░░│░░│░░░░░░░░░░░░░│░░│░░░░░░░░░░░░░│░░│░░░░░░░░░░░░░│░░░░░ │
├────────────────────────────────────────────────────────────────────────────┤
│    │░░░░░░░░░░░░░│  │░░░░░░░░░░░░░│  │░░░░░░░░░░░░░│  │░░░░░░░░░░░░░│      │
│    │▒ Lot title ▒│  │▒ Lot title ▒│  │▒ Lot title ▒│  │▒ Lot title ▒│      │
│    │▒SAR 175 (+)▒│  │▒ 540 · 46m ▒│  │▒SAR 349 (+)▒│  │▒1,480 · 18m▒│   >  │
│    └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │
│    ^ FEATURED NOW: four square tiles overlap the hero's lower edge (~96px) │
├────────────────────────────────────────────────────────────────────────────┤
│ SHOP BY CATEGORY, OR BY SELLER   one photo mosaic        All categories -> │
├─────────────────────────────────────┬──────────────────┬───────────────────┤
│ ░░░░░░ HOME APPLIANCES  2x2 ░░░░░░░ │  HOME & KITCHEN  │ ░░░ FURNITURE ░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░ tall 1x2 ░░░ │ ░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ ├───────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░ FASHION ░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │
├──────────────────┬──────────────────┼──────────────────┼───────────────────┤
│ ░ TOOLS & DIY ░░ │ ░░ AUTOMOTIVE ░░ │ ░ ELECTRONICS ░░ │ ░ BULK PALLETS ░░ │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │
├──────────────────┴──────────────────┼──────────────────┴───────────────────┤
│ ░░░ SELLER: Rawabi Home Outlet ░░░░ │ ░ SELLER: Red Sea Trading  * LIVE ░░ │
│ ▒ 8 lots · Riyadh ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │ ▒ 3 lots · Jeddah · hosting now ▒▒▒▒ │
├─────────────────────────────────────┴──────────────────────────────────────┤
│ FEATURED MARKETPLACE   1/2 + 1/4 + 1/4, then mirrored                      │
├─────────────────────────────────────┬──────────────────┬───────────────────┤
│ ░ FEATURE 1/2: pallet + manifest ░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ▒ Lot title ▒▒▒▒ │ ▒ Lot title ▒▒▒▒▒ │
│ ▒ 64-unit pallet · bid SAR 7,850 ▒▒ │ ▒ SAR 229 (+) ▒▒ │ ▒ 3,150 · 5h40m ▒ │
├──────────────────┬──────────────────┼──────────────────┴───────────────────┤
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░ FEATURE 1/2: lifestyle photo ░░░ │
│ ▒ Lot title ▒▒▒▒ │ ▒ Lot title ▒▒▒▒ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ▒ SAR 189 (+) ▒▒ │ ▒ SAR 119 (+) ▒▒ │ ▒ Lot title · SAR 399 (+) ▒▒▒▒▒▒▒▒▒▒ │
├──────────────────┴──────────────────┴──────────────────────────────────────┤
│ ON THE BLOCK   two wide showcases per view, closing soonest           <  > │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░  OPEN FOR BIDS     │ ░░░░░░░░░░░░░░░░  OPEN FOR BIDS      │
│ ░░░░░░░░░░░░░░░░  Closes in 9 min   │ ░░░░░░░░░░░░░░░░  Closes in 18 min   │
│ ░░░░░░░░░░░░░░░░  SAR 180 · 11 bids │ ░░░░░░░░░░░░░░░░  SAR 1,480 · 31 bids│
│ ░░░░░░░░░░░░░░░░  Grade A · Seller  │ ░░░░░░░░░░░░░░░░  Grade A · Seller   │
│ ░░░░░░░░░░░░░░░░  [ Place bid ]     │ ░░░░░░░░░░░░░░░░  [ Place bid ]      │
├─────────────────────────────────────┴──────────────────────────────────────┤
│ READY TO BUY   Buy Now as square tiles, two rows            Shop all 18 -> │
├──────────────────┬─────────────────────────────────────┬───────────────────┤
│ -33% ░░░░░░░░(W) │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ -27% ░░░░░░░░░(W) │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░ FEATURE TILE 2x2 ░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │
│ ▒ Lot title ▒▒▒▒ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ▒ Lot title ▒▒▒▒▒ │
│ ▒ SAR 175 (+) ▒▒ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ▒ SAR 329 (+) ▒▒▒ │
├──────────────────┤ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ├───────────────────┤
│ -30% ░░░░░░░░(W) │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ -31% ░░░░░░░░░(W) │
│ ░░░░░░░░░░░░░░░░ │ ▒ Lot title · Grade B · Seller ▒▒▒▒ │ ░░░░░░░░░░░░░░░░░ │
│ ▒ SAR 119 (+) ▒▒ │ ▒ SAR 349 was 520 [ Add to bag ] ▒▒ │ ▒ SAR 219 (+) ▒▒▒ │
├──────────────────┴─────────────────────────────────────┴───────────────────┤
│ CONDITION GRADES   [New] [A] [B] [C] [D] [R] [F]     ┌───────────────────┐ │
│   one line of meaning under each grade               │▒ LIVE · lot 5/10 ▒│ │
│ HOW KHAZNA WORKS   1 Find it   2 Check the           │ SAR 1,850  [Join] │ │
│   grade   3 Bid or buy   4 Delivery or pickup        └───────────────────┘ │
│ FOOTER   country · language · help                                         │
└────────────────────────────────────────────────────────────────────────────┘
```

### C. Homepage section order

1. **One header bar**, transparent over the hero and solid after scrolling.
2. **Centred discovery hero**: full width, about 480px tall.
   - Existing product cut-outs frame the page on both sides.
   - The centre holds an eyebrow, the headline, the labelled search, popular
     searches, category photo chips, one trust line ("Graded lots · delivery
     priced at checkout") and two text links.
   - The text sits on a neutral field, never on a photo.
3. **Featured now**: four square tiles that overlap the hero's lower edge by
   about 96px. They show production's moderated Featured placements
   (known-gap row G18 in `CUSTOMER_REDESIGN_FILE_MAP.md`, section G: "Keep
   Featured").
4. **Shop by category, or by seller**: one photo mosaic.
   - Home Appliances takes a 2×2 tile and Home & Kitchen a tall 1×2 tile.
   - Furniture and Fashion are stacked.
   - A row of four categories follows.
   - Then two seller tiles: Rawabi Home Outlet, and Red Sea Trading, which is
     marked LIVE while it hosts.
5. **Featured marketplace**: two rows of mixed Buy Now and auction lots.
   - First row: a 1/2 feature (the 64-unit pallet with manifest thumbnails)
     and two 1/4 tiles.
   - Second row, mirrored: two 1/4 tiles and a 1/2 feature with a lifestyle
     photo.
6. **On the block**: wide auction showcases, two per view, closing soonest
   first.
7. **Ready to buy**: Buy Now as a mosaic of four square tiles around a 2×2
   feature tile, in two rows, with "Shop all 18".
8. **Condition grades**: the seven-grade band (New, A, B, C, D, R, F), with
   one line of meaning under each grade.
9. **How Khazna works**: four short text steps. There are no photographic
   steps, because no photos exist for them.
10. **Footer** with country, language and help.

**Live now is not a page section.** While an event is live, a **floating live
mini-player** sits in the bottom-end corner of every page, showing the lot,
the current bid and Join.

The order follows the brief's suggestion (hero → categories → featured →
auctions → Buy Now → sellers → live → trust), with two changes: the sellers
move into the category mosaic, and live becomes the mini-player.

### D. Header / navigation structure

- **One 72px bar with links either side of a centred logo.**
  - Start side: Categories · Buy Now · Auctions.
  - End side: Live (with the live dot while an event runs) · Sellers ·
    **Search** (labelled) · Watchlist · Account · Bag · language.
  - Transparent over the home hero; solid elsewhere and after scrolling.
- **Categories opens a full-screen visual overlay**, not a dropdown panel. It
  shows large photo tiles for the 8 categories and a row of sellers. It
  belongs to the same overlay family as search and the mobile menu.
- **Other header items production has:**
  - The notification bell is a badge on Account, with the list inside the
    account menu.
  - The country switcher (G19) is in the menu overlay and the footer.
- There is no utility strip, no category bar and no header search field.
- **vs Option 1:** one bar instead of three tiers. Categories open a
  full-screen overlay instead of a dropdown mega menu, and search leaves the
  header. The top-level destinations (categories, Buy Now, Auctions, Live,
  Sellers) are the same as Option 1's; section 9 records this as partially
  similar.

### E. Search structure

- **Home:** the labelled discovery field in the hero. Below it are popular
  searches from the shared list (air conditioner, pallet, fridge…) and
  category photo chips.
- **Elsewhere:** "Search" in the bar opens a full-screen visual search.
  - Before typing, it shows popular searches and category photos.
  - While typing, it shows lot thumbnails with the price or current bid and
    time left, plus matching categories and sellers. Live suggestions are an
    additive feature (G26).
  - Enter goes to Browse.
- **Browse:** the query becomes the banner title, with a refine field.
- **vs Option 1:** search lives in the hero and in a full-screen layer, not in
  a permanent scoped header bar.

### F. Category discovery

- **Home:** the mosaic of categories and sellers, with deliberately unequal
  tile sizes.
- **Header:** the Categories overlay.
- **Browse:** a category banner (a photo composition) and a tray of round
  category photo chips.
- **Mobile:** a stories rail of category photos, and the full-screen menu.
- **Images:** see the image-source table in section 11.
- **vs Option 1:** a mosaic with unequal sizes and seller tiles, not a row of
  8 equal tiles. The overlay and the stories rail still echo Option 1's photo
  mega menu and round-tile phone rail. Section 9 records category discovery as
  partially similar.

### G. Card architecture — "square image tile with an in-image band"

- **Image:** square (1:1, matching the catalogue's square shots) and
  full-bleed to the tile edges. The tile *is* the image.
- **On the image, at the top:** a tag at the start (the discount, "Auction",
  "New" or "Upcoming") and the watch heart at the end.
- **Information order:** everything sits on a solid band inside the bottom of
  the tile.
  - First the title, on one line.
  - Then the price and add button (Buy Now), or the current bid and time left
    (auctions).
  - There is no text area and no footer under the tile.
- **CTA:**
  - Buy Now tiles carry the (+) add button in the band.
  - Auction tiles open the lot. On desktop, hovering shows "Place bid" in the
    band, which opens the confirm step.
- **Seller information:** not on standard tiles; it appears on feature tiles
  and lot pages.
- **Variants:**
  - A **2×2 feature tile** every 6–9 tiles, adding grade and seller and a
    labelled button.
  - A **wide showcase** for auctions: the photo takes about 40% at the start,
    followed by Open for bids, time left, the current bid and bid count, grade
    and seller, and Place bid.
- **States** (drawn in the browse wireframe):
  - Sold out (`tyre-inflator`);
  - Upcoming, "Opens in 30h" (`leather-sofa`);
  - Sold, "Sold SAR 610" (`robot-vacuum`).
- **Grid composition:** mosaics in which feature tiles break the grid, not
  uniform rows.

### H. Browse-page wireframe
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Categories  Buy Now  Auctions      LOGO  Live* Sellers Search (W) Me Bag AR│
├────────────────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░ CATEGORY BANNER: category photo composition, ~240px ░░░░░░░░░░░ │
│ ALL LOTS · 29 lots                     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ [ refine: search these lots ]          ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────────────────────────────────────────────────────────┤
│ (░)All (░)Appliances (░)Kitchen (░)Furniture (░)Fashion (░)Tools (░)Auto > │
│ [All | Buy Now | Auctions]   Grade: [New][A][B][C][D][R][F]   [All filters]│
│ Price: [ <100 ] [ 100-500 ] [ 500-1,000 ] [ 1,000+ ]              Sort v   │
│   (a visual filter tray; All filters opens a drawer from the end side)     │
├──────────────────┬─────────────────────────────────────┬───────────────────┤
│ Auction ░░░░░(W) │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ -25% ░░░░░░░░░(W) │
│ ░░░░░░░░░░░░░░░░ │  FEATURE TILE 2x2 (every 8 tiles) ░ │ ░░░░░░░░░░░░░░░░░ │
│ ▒ Lot title ▒▒▒▒ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ▒ Lot title ▒▒▒▒▒ │
│ ▒ 540 · 46 min ▒ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ▒ SAR 149 (+) ▒▒▒ │
├──────────────────┤ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ├───────────────────┤
│ -24% ░░░░░░░░(W) │ ▒ Lot title · Grade A · Seller ▒▒▒▒ │ New ░░░░░░░░░░(W) │
│ ▒ SAR 189 (+) ▒▒ │ ▒ SAR 175 was 260 [ Add to bag ] ▒▒ │ ▒ SAR 89 (+) ▒▒▒▒ │
├──────────────────┼──────────────────┬──────────────────┼───────────────────┤
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │
│ ▒ Lot title ▒▒▒▒ │ ▒ Lot title ▒▒▒▒ │ ▒ Lot title ▒▒▒▒ │ ▒ Lot title ▒▒▒▒▒ │
│ ▒ SAR 399 (+) ▒▒ │ ▒ SOLD OUT ▒▒▒▒▒ │ ▒ OPENS IN 30H ▒ │ ▒ SOLD SAR 610 ▒▒ │
├──────────────────┴──────────────────┴──────────────────┴───────────────────┤
│                                                                            │
│            Showing 12 of 29   ─────────o───────   [ Load more ]            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Category banner:** a photo composition about 240px tall, with the title
  and a refine field.
- **Visual filter tray:**
  - category photo chips;
  - the sale type (All | Buy Now | Auctions);
  - the 7 grade chips;
  - price bands;
  - sort;
  - "All filters", which opens a drawer from the end side.

  There is no sidebar.
- **Results:** a square-tile mosaic with a 2×2 feature tile every 8 tiles.
- **Paging:** "Load more" with a progress line; no numbered pages.

### I. Product-detail wireframe
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Categories  Buy Now  Auctions      LOGO  Live* Sellers Search (W) Me Bag AR│
├────────────────────────────────────────────────────────────────────────────┤
│ Home / Home & Kitchen / Lot title                                          │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░ PHOTO 1 ░░░░░░░ │ ░░░░░░░ PHOTO 2 ░░░░░░░ │ ░░░░░░░ PHOTO 3 ░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ FILMSTRIP GALLERY: scroll for more, click for the lightbox          1/5  > │
│   2 photos: two large side by side · 1 photo: centred on a neutral field   │
├─────────────────────────────────────────────┬──────────────────────────────┤
│ LOT TITLE (large)                           │ SAR 189  was SAR 249  -24%   │
│ Rawabi Home Outlet · Riyadh                 │ Qty  [ -  1  + ]             │
│ [Grade A]  condition grade disclosed        │ [ Add to bag ]  [ Buy now ]  │
│ Single item · 14 in stock                   │ Delivery priced at checkout  │
│ [Watch]  [Share]                            │ Pickup where offered         │
├─────────────────────────────────────────────┴──────────────────────────────┤
│              HIGHLIGHTS                                                    │
│              CONDITION  [New][A][B][C][D][R][F]                            │
│                         this lot: A                                        │
│              SPECIFICATIONS                          ┌───────────────────┐ │
│              DELIVERY & PICKUP                       │ ░ SAR 189         │ │
│              SELLER  cover · name                    │ [ Add to bag ]    │ │
│                      [Visit store]                   └───────────────────┘ │
│              (centred column)                          floating card       │
├────────────────────────────────────────────────────────────────────────────┤
│ MORE LIKE THIS   square tiles                                              │
├──────────────────┬──────────────────┬──────────────────┬───────────────────┤
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │
│ ▒ SAR 229 (+) ▒▒ │ ▒ SAR 149 (+) ▒▒ │ ▒ SAR 399 (+) ▒▒ │ ▒ SAR 159 (+) ▒▒▒ │
└──────────────────┴──────────────────┴──────────────────┴───────────────────┘
```

- **Filmstrip gallery:** three large photos in view. The default product
  (`task-lamp`) has 5 photos, so the strip scrolls. Clicking opens the
  lightbox.
  - With 2 photos (3 lots today), they sit side by side, large.
  - With 1 photo, it is centred on a neutral field (no lot has only one
    today).
- **Purchase band**, two parts:
  - start side: title, seller and city, grade, stock, watch and share;
  - end side: price, was-price and discount, quantity, Add to bag, Buy now,
    delivery priced at checkout, pickup where offered.
- **Centred column:**
  - highlights;
  - the 7-grade condition scale, with this lot's grade marked;
  - specifications;
  - delivery & pickup;
  - the seller (cover, name, Visit store).
- **Floating purchase card** in the bottom-end corner, once the band scrolls
  away. It never covers focused content.
- **More like this:** square tiles.

### J. Auction-detail wireframe
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Categories  Buy Now  Auctions      LOGO  Live* Sellers Search (W) Me Bag AR│
├────────────────────────────────────────────────────────────────────────────┤
│ Home / Auctions / Lot title                                                │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░ PHOTO 1 ░░░░░░░ │ ░░░░░░░ PHOTO 2 ░░░░░░░ │ ░░░░░░░ PHOTO 3 ░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ FILMSTRIP GALLERY: this lot has 3 photos, so all 3 fit                 1/3 │
├─────────────────────────────────────────────┬──────────────────────────────┤
│ OPEN FOR BIDS  ·  closes in 5h 40m          │ CURRENT BID  SAR 3,150       │
│ LOT TITLE (large)                           │ You: not bidding yet         │
│ Rawabi Home Outlet · [Grade A]              │ [3,200] [3,250] [3,400]      │
│ 23 bids · 9 bidders · 118 watching          │ [ SAR ____ ] [ Place bid ]   │
│ Single item                                 │ Set a maximum bid  >         │
│ [Watch]  [Share]                            │ Deposit covered by wallet    │
│ Delivery priced at checkout                 │ Or buy now: SAR 4,600        │
│ Pickup where offered                        │ Each bid has a confirm step  │
├─────────────────────────────────────────────┴──────────────────────────────┤
│              BID HISTORY   last 5  [Show all]                              │
│              CONTENTS (pallet and bulk lots)                               │
│              CONDITION  ·  SPECIFICATIONS            ┌───────────────────┐ │
│              DELIVERY & PICKUP                       │ 5h 40m  SAR 3,150 │ │
│              AUCTION TERMS                           │ [ Bid SAR 3,200 ] │ │
│                timed: late bid adds 5 min            └───────────────────┘ │
│                deposit · payment window                floating bid card   │
├────────────────────────────────────────────────────────────────────────────┤
│ MORE ON THE BLOCK   wide auction showcases                            <  > │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Gallery:** the same frame as the product page. The default auction
  (`fridge-690`) has 3 photos, so all three fit the strip.
- **The band's end side is the bid module:**
  - current bid and your status;
  - quick bids (SAR 3,200 · 3,250 · 3,400);
  - a custom amount and a maximum bid;
  - deposit covered by the wallet;
  - "Or buy now: SAR 4,600" (this is a "both" lot).

  Every bid has a confirm step.
- **The band's start side** adds "Delivery priced at checkout" and "Pickup
  where offered".
- **Centred column:**
  - bid history (last 5, with Show all);
  - contents, as a photo grid (pallet and bulk lots only);
  - condition and specifications;
  - delivery & pickup;
  - auction terms: for timed auctions, a late bid adds 5 minutes; the deposit;
    the payment window for timed wins.
- A **floating bid card**, then "More on the block".

### K. Live-auction wireframe — "theatre"
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Categories  Buy Now  Auctions      LOGO  Live* Sellers Search (W) Me Bag AR│
│   (dark page treatment in the live room)                                   │
├────────────────────────────────────────────────────────────────────────────┤
│ * LIVE   Tuesday Evening Live - Home & Electronics          1,284 watching │
│   hosted by Red Sea Trading Co. · presented by Khalid Al-Zahrani           │
├────────────────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ┌────────┐░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ │LOT 5 ░░│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ └────────┘░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░ LIVE STREAM fills the stage (capped at ~21:9); lot photo inset ░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ▒ Lot 5 · Mid-Century Leather Recliner · Grade A · CURRENT SAR 1,850 ▒▒▒▒▒ │
│ ▒ You: not bidding   [1,875] [1,900]   [ Bid SAR 1,875 ]   (pinned) ▒▒▒▒▒▒ │
├────────────────────────────────────────────────────────────────────────────┤
│ LOT REEL   all 10 lots in order of sale                               <  > │
│ [░░░]  [░░░]  [░░░]  [░░░]  [▓▓▓]  [░░░]  [░░░]  [░░░]  [░░░]  [░░░]       │
│ #1     #2     #3     #4     #5     #6     #7     #8     #9     #10         │
│ sold   sold   unsold sold   NOW    next                                    │
├─────────────────────────────────────────────┬──────────────────────────────┤
│ ACTIVITY                                    │ ABOUT THIS EVENT             │
│ Bidder 7   SAR 1,850   now                  │ Status set by the auctioneer │
│ Bidder 3   SAR 1,825   22s                  │ Bids are binding once placed │
│ Bidder 5   SAR 1,800   41s                  │ Deposit SAR 200 from wallet  │
│                                             │ UP NEXT ON KHAZNA            │
│                                             │ Pallet Hour - Bulk Returns   │
│                                             │   in 20 h · 12 lots          │
│                                             │ Thursday Furniture Clearance │
│                                             │   in 2 days · 24 lots        │
└─────────────────────────────────────────────┴──────────────────────────────┘
```

- **The live stream fills the stage.** It is full width but capped at about
  21:9, so the controls stay above the fold. The current lot's photo is inset
  at the top start.
- **Bid band:** a solid band under the stream with the lot, grade and current
  bid, then your status, two quick bids and the Bid button. When the stage
  scrolls away, this band **pins to the bottom of the screen**.
- **Lot reel:** all 10 lots, each marked Sold, Unsold, NOW or next.
- **Below the reel:**
  - Activity: the last bids.
  - About: status set by the auctioneer, bids binding once placed, a SAR 200
    deposit.
  - The next events: Pallet Hour in 20 h (12 lots) and Thursday Furniture
    Clearance in 2 days (24 lots).
- Live bids are one tap, as in Option 1.

### L. Seller-storefront wireframe — "brand boutique"
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Categories  Buy Now  Auctions      LOGO  Live* Sellers Search (W) Me Bag AR│
├────────────────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░ SELLER COVER PHOTO  ·  full bleed, name on a solid band ░░░░░░░░░ │
│ RAWABI HOME OUTLET                     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Showroom overstock · Riyadh            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────────────────────────────────────────────────────────┤
│ (RH)  Member since 2024 · 4 auctions · 4 Buy Now    [ About & pickup v ]   │
│   (about, pickup address and hours open here; no separate section below)   │
├────────────────────────────────────────────────────────────────────────────┤
│ (░)Furniture (░)Appliances (░)Kitchen (░)Fashion   [All|Buy Now|Auctions]  │
├──────────────────┬─────────────────────────────────────┬───────────────────┤
│ -24% ░░░░░░░░(W) │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ Auction ░░░░░░(W) │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░ FEATURE TILE 2x2 ░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │
│ ▒ Lot title ▒▒▒▒ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ▒ Lot title ▒▒▒▒▒ │
│ ▒ SAR 189 (+) ▒▒ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ▒ 1,120 · 7h20m ▒ │
├──────────────────┤ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ├───────────────────┤
│ -33% ░░░░░░░░(W) │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ Upcoming ░░░░░(W) │
│ ░░░░░░░░░░░░░░░░ │ ▒ Lot title · Grade A ▒▒▒▒▒▒▒▒▒▒▒▒▒ │ ▒ Lot title ▒▒▒▒▒ │
│ ▒ SAR 175 (+) ▒▒ │ ▒ 3,150 · 5h 40m   [ Place bid ] ▒▒ │ ▒ OPENS IN 30H ▒▒ │
├──────────────────┴─────────────────────────────────────┴───────────────────┤
│                               Showing 8 of 8                               │
│   (when the seller is live, the floating live mini-player appears)         │
└────────────────────────────────────────────────────────────────────────────┘
```

- A full-bleed cover with the seller's name and tagline on a solid band. The
  default storefront is Rawabi Home Outlet.
- A profile strip: monogram, member since 2024, 4 auctions · 4 Buy Now, and an
  "About & pickup" expander. The address and hours open in place; there is no
  About section further down.
- The seller's categories as photo chips, plus the sale type.
- The seller's 8 lots in the tile mosaic, with a feature tile, and "Showing 8
  of 8".
- When the seller is live, the floating mini-player appears.

### M. Mobile homepage wireframe
```text
┌──────────────────────────────────┐
│ [=]*          LOGO  (W)2 (Q) Bag │
│  (transparent over the hero; the │
│   menu badge shows when outbid)  │
├──────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░ PRODUCT COMPOSITION ░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ HEADLINE (two lines)             │
│ [ What are you looking for?  ]   │
│ Delivery priced at checkout      │
│ Shop Buy Now ->                  │
├──────────────────────────────────┤
│ (░) (░) (░) (░) (░) (░)    >     │
│ Appl Kitc Furn Fash Tool Auto    │
│  category stories                │
├──────────────────────────────────┤
│ -24% ░░░░░░░░░░░░░░░░░░░░░░░░(W) │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░ SQUARE TILE, full width ░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ▒ Lot title · Grade A ▒▒▒▒▒▒▒▒▒▒ │
│ ▒ SAR 189 · was 249       (+) ▒▒ │
├────────────────┬─────────────────┤
│ ░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░ │
│ ▒ SAR 229 (+)  │ ▒ 540 · 46m ▒▒▒ │
├────────────────┴─────────────────┤
│ ON THE BLOCK   wide cards    >   │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├──────────────────────────────────┤
│ GRADES  New A B C D R F          │
│ HOW KHAZNA WORKS   4 steps       │
│ FOOTER                           │
│              ┌──────────────────┐│
│              │▒ LIVE lot 5 Join▒││
│              └──────────────────┘│
│  (floating mini-player; no bottom│
│   tab bar)                       │
└──────────────────────────────────┘
```

Mobile strategy: **an image-led feed.**

- **Top bar:** transparent over the hero. It holds the menu (badged when you
  are outbid), the logo, the watchlist heart with a count, search and the bag.
- **Home, in order:**
  - a full-screen hero with the headline and search;
  - category stories;
  - a single-column feed of full-width square tiles, broken up by pairs;
  - wide On the block cards;
  - the grades;
  - How Khazna works.
- **No bottom tab bar.** The menu opens a full-screen visual menu: categories,
  Buy Now, Auctions, Live, Sellers, Account, language and country.
- **Live:** the floating mini-player sits above the content while an event is
  live.
- **Browse:** a floating "Filter & sort" pill opens the tray as a full-screen
  sheet.
- **Lot pages:** a floating price-and-action button opens the purchase or bid
  sheet (quick bids, custom amount, maximum bid, confirm step).

### N. Signature components

1. A centred discovery hero framed by product cut-outs, with four tiles
   straddling its lower edge.
2. A category-and-seller photo mosaic, with the full-screen Categories overlay
   and mobile stories.
3. A square image tile with an in-image band, plus 2×2 feature tiles and wide
   auction showcases.
4. A filmstrip gallery, a purchase band and a floating corner card.
5. A floating live mini-player, and a full-width theatre stage with a pinned
   bid band.

Visual personality (secondary, not a differentiator): calm, gallery-like
surfaces, large product imagery, generous spacing.

---

## 5. Option 3 — Marketplace Hub (slot `concept-c`)

### A. Design objective

A search- and discovery-first marketplace platform. It works like a hub, with
three parts:

- a persistent navigation rail holding the full category tree;
- a search deck that is the first thing you use;
- a dashboard of dense, scannable modules: deals, ending soon, popular,
  sellers, live, and recently added.

A frequent buyer can reach any lot, auction, seller or deal in one or two
actions. It should feel fast, practical and commercial, without looking like
the admin dashboard.

### B. Desktop homepage wireframe
```text
┌──────────────────────┬─────────────────────────────────────────────────────┐
│ KHAZNA               │ Home                         Bell 3   Cart 1   Acct │
│  marketplace         ├─────────────────────────────────────────────────────┤
│ (search docks here   │ * LIVE  Tuesday Evening Live · lot 5/10  [Join]     │
│  on scroll)          ├─────────────────────────────────────────────────────┤
│ Home                 │ FIND ANYTHING ON KHAZNA                             │
│ All lots         29  │ [All] [Auctions] [Buy Now] [Sellers] [Live]         │
│ Auctions         11  │ [ Search lots, brands, sellers...    ] [Search]     │
│ Buy Now          18  │ Popular: air conditioner · pallet · fridge          │
│                      ├────────────┬────────────┬─────────────┬─────────────┤
│ * Live now        1  │ LIVE NOW   │ ENDING <1H │ DEALS       │ NEW TODAY   │
│ Ending soon       3  │ 1 event    │ 3 lots     │ 14 lots     │ 10 lots     │
│ New today        10  │ 1,284 watch│ soonest -> │ up to -33%  │ newest ->   │
│                      ├────────────┴────────────┴─────────────┴─────────────┤
│ Bulk & pallets    4  │ BROWSE CATEGORIES                           All ->  │
│                      ├────────────┬────────────┬─────────────┬─────────────┤
│ CATEGORIES           │ ░ Applian. │ ░ Kitchen  │ ░ Furniture │ ░ Fashion   │
│ v [░] Appliances  6  │ 6 lots     │ 4 lots     │ 4 lots      │ 4 lots      │
│       Auctions    5  ├────────────┼────────────┼─────────────┼─────────────┤
│       Buy Now     1  │ ░ Tools    │ ░ Auto     │ ░ Electron. │ ░ Pallets   │
│ > [░] Kitchen     4  │ 3 lots     │ 3 lots     │ 1 lot       │ 4 lots      │
│                      ├────────────┴────┬───────┴─────────┬───┴─────────────┤
│ > [░] Furniture   4  │ DEALS · BUY NOW │ ENDING SOON     │ POPULAR NOW     │
│ > [░] Fashion     4  │ ░ Lot    -33%   │ ░ Lot     9 min │ ░ Lot   42 bids │
│ > [░] Tools & DIY 3  │   SAR 175   [+] │   SAR 180  [Bid]│   SAR 7,850 [>] │
│ > [░] Automotive  3  │ ░ Lot    -33%   │ ░ Lot    18 min │ ░ Lot   31 bids │
│ > [░] Electronics 1  │   SAR 349   [+] │   SAR 1,480[Bid]│   SAR 1,480 [>] │
│ > [░] Pallets     4  │ ░ Lot    -31%   │ ░ Lot    46 min │ ░ Lot   23 bids │
│ SELLERS              │   SAR 219   [+] │   SAR 540  [Bid]│   SAR 3,150 [>] │
│  * Red Sea Trading   │ View all 14 ->  │ View all 9 ->   │ View all ->     │
│                      ├─────────────────┴────────┬────────┴─────────────────┤
│  Rawabi Home Outlet  │ SELLERS                  │ LIVE & UPCOMING          │
│  + 3 more sellers    │ (RS) Red Sea     * LIVE  │ * LIVE Tuesday Evening   │
│ MY KHAZNA            │   Jeddah · 1 auction     │   lot 5/10 · 1,284 [Join]│
│  Watchlist & bids    │ (RH) Rawabi Home Outlet  │ Pallet Hour · in 20 h    │
│  Orders · Wallet     │   Riyadh · 4 auctions    │   12 lots   [ Remind me ]│
│  Account             │ (DM) Dar Al Majd ...     │ Thursday Furniture · 2 d │
│ Buying on Khazna >   │ All 5 sellers ->         │   24 lots   [ Remind me ]│
│                      ├──────────────────────────┴──────────────────────────┤
│ Country & language   │ RECENTLY ADDED   compact tiles, 6 across            │
│                      │ [░░░] [░░░] [░░░] [░░░] [░░░] [░░░]                 │
│                      │ title title title title title title                 │
│                      ├─────────────────────────────────────────────────────┤
│                      │ PALLETS & BULK   rows: units · grade · price        │
│                      ├─────────────────────────────────────────────────────┤
│                      │ BUYING ON KHAZNA ->  grades · deposit · delivery    │
├──────────────────────┴─────────────────────────────────────────────────────┤
│ FOOTER (compact)                                                           │
└────────────────────────────────────────────────────────────────────────────┘
```

### C. Homepage section order

1. **App shell:** the navigation rail, plus a slim top bar with the page
   title, notifications bell, cart and account.
2. **Live announcement line:** one row, shown only while an event is live.
3. **Search & discovery deck:** the search field, with scope tabs (All ·
   Auctions · Buy Now · Sellers · Live) and popular searches.
4. **Hub counters:** Live now 1 · Ending < 1 hour 3 · Deals 14 (up to −33%) ·
   New today 10.
5. **Category grid:** 4×2 compact tiles with counts.
6. **Three list modules in a row:**
   - Deals · Buy Now, largest discount first;
   - Ending soon: 9 min, 18 min, 46 min;
   - Popular now, by most bids: 42, 31, 23.
7. **Two list modules in a row:**
   - Sellers;
   - Live & upcoming: Tuesday Evening Live now; Pallet Hour in 20 h; Thursday
     Furniture Clearance in 2 days.
8. **Recently added:** compact tiles, six across.
9. **Pallets & bulk:** summary rows (units · grade · price).
10. **"Buying on Khazna":** a link row (grades · deposit · delivery).
11. **Compact footer.**

There is no image hero. The deck fills the main column's width, is about
240px tall, and its content sits top-start.

### D. Header / navigation structure

- **App shell with a left navigation rail**, 240px wide on wide screens. From
  top to bottom:
  - a brand block ("Khazna marketplace");
  - **Marketplace:** Home, All lots 29, Auctions 11, Buy Now 18, Live now 1,
    Ending soon 3, New today 10, Bulk & pallets 4;
  - **Categories:** a tree of the 8 categories with small thumbnails and
    counts. Each expands to its Auctions and Buy Now branches (Home
    Appliances: 5 and 1);
  - **Sellers:** the live seller first, then the rest;
  - **My Khazna:** Watchlist & bids (one link, because production has one tab
    with the alias `bids`), Orders · Wallet, Account;
  - "Buying on Khazna", which is where the trust notes live;
  - "Country & language" (G19).
- **Collapsed state:** at 1024–1279px, and on browse, detail and live pages,
  the rail becomes a 72px column of **category thumbnails with hover and focus
  labels**, plus search and account. It expands on demand.
- **Slim top bar:** the page title or breadcrumb at the start; the
  notifications bell, cart and account at the end.
- When the home search deck scrolls away, the search docks into the top of the
  rail.
- **vs Option 1:** vertical navigation instead of horizontal tiers. The
  category tree is always available, account shortcuts sit in the navigation,
  and there is no utility strip or category bar.

### E. Search structure

- **Desktop:** the home deck. On other pages the search sits at the top of the
  rail, with a scope selector and a "/" keyboard shortcut.
- **Suggestions:** a multi-column panel of Suggestions · Categories · Sellers
  · Top lots (thumbnail, price or current bid, time left). It is fully
  keyboard-navigable, and recent searches are kept locally.
- **Browse:** the query stays editable in the page header.
- **Mobile:** the search field lives in the **bottom command bar**, within
  thumb reach.
- **vs Option 1:** search is part of the rail and the page's first module,
  never a centred header bar; on phones it sits at the bottom, not in a top
  row.

### F. Category discovery

- **Rail:** the category tree with thumbnails and counts, the current category
  highlighted. It collapses to thumbnails on browse.
- **Home:** the 4×2 category grid.
- **Mobile:** the home category grid, and a full-screen filter page led by the
  category tree.
- **vs Option 1:** a persistent tree with sale-type branches. The 4×2 grid is
  the one element that echoes Option 1's category tiles.

### G. Card architecture — "table row", "module item" and "compact tile"

**Table row** (browse and seller tabs):

- A real table with these columns: LOT (40px thumbnail and title) | GR
  (grade) | SELLER · CITY | PRICE / BID | TIME LEFT | action.
- Single-line rows with no card borders or highlights, a sticky sortable
  header, and filters in the column headers (`v`).
- Clicking a row opens the quick view.
- The action is Bid (which opens the confirm step) or Add. Watch lives in the
  quick view.
- The city comes from the seller lookup (G4).

**Module item** (home and the seller overview): a thumbnail, the title, one
data point (discount, time left or bid count), the price or bid, and an
action.

**Compact tile** (Recently added, New from this seller): a 1:1 image, the
title, and the price or bid.

**States:**

- Upcoming: opens in 30h 15m, with a Watch action.
- Sold: SAR 610, no action.
- Sold out: no Add.

**vs Option 1:** the table row is a table, not Option 1's bordered `LotRow`
card. The module item is close to Option 1's `CompactLot` rows; section 9
records this as partially similar.

### H. Browse-page wireframe
```text
┌──────┬─────────────────────────────────────────────────────────────────────┐
│ [░]A │ Browse > Home Appliances                     Bell 3   Cart 1   Acct │
│ [░]K ├─────────────────────────────────────────────────────────────────────┤
│ [░]F │ HOME APPLIANCES · 6 results      [ All 6 | Auctions 5 | Buy Now 1 ] │
│ [░]S │ View [ Table | Tiles ]    < 1/1 >    per page 20 v                  │
│ [░]T │ Filter from the column headers (v); active filters show here        │
│      ├──────────────────────────────────────────────┬──────────────────────┤
│ [░]C │ LOT         GR SELLER·CITY PRICE  TIME^      │ QUICK VIEW           │
│ [░]E │             v  v           v      v          │ ░░░░░░░░░░░░░░░░░░░░ │
│ [░]P ├──────────────────────────────────────────────┤ ░░░ SELECTED LOT ░░░ │
│      │ ░ Split AC  A  Majd·Dmm    1,480  18m   [Bid]│ ░░░░░░░░░░░░░░░░░░░░ │
│ (Q)  │ ░ Washer    C  Sahel·Khb   540    46m   [Bid]│ 1.5-Ton Split AC     │
│ Me   │ ░ Fridge    A  Rawabi·Ryd  3,150  5h40  [Bid]│ Grade A · Dar Al Majd│
│      │ ░ Dishwash. B  Rawabi·Ryd  1,120  7h20  [Bid]│ SAR 1,480 · 18 min   │
│      │ ░ Microwave A  RedSea·Jed  329    -     [Add]│ 31 bids · 142 watch  │
│      │ ░ Robot vac A  RedSea·Jed  610    Sold       │ [ Bid SAR 1,500 ]    │
│      │                                              │ [Open full page]     │
│      │ single-line rows; sticky sortable header     │ [Watch]              │
├──────┴──────────────────────────────────────────────┴──────────────────────┤
│   rail collapses to category thumbnails here (hover shows the name)        │
└────────────────────────────────────────────────────────────────────────────┘
```

- The rail collapses to category thumbnails.
- **Page header:**
  - the title, with the scope switch (All 6 | Auctions 5 | Buy Now 1 for Home
    Appliances);
  - a view switch (Table | Tiles);
  - a compact pager and a page-size setting.
- **The sortable table**, with filters in the column headers.
- **A sticky quick-view pane** beside it (master–detail): photo, title, grade
  and seller, current bid and time left, bids and watchers, "Bid SAR 1,500",
  "Open full page" and Watch.
- There is no quick-filter chip row and no filter sidebar.

### I. Product-detail wireframe — "listing sheet"
```text
┌──────┬─────────────────────────────────────────────────────────────────────┐
│ [░]A │ < Back to results   Lot 2 of 4   [< Prev] [Next >]       Cart  Acct │
│      ├─────────────────────────────────────────────────────────────────────┤
│ [░]K │ ░ LOT TITLE · Grade A · Rawabi Home Outlet (Riyadh)        [Watch]  │
│ [░]F │ SAR 189 was 249    Qty [ - 1 + ]    [ Add to cart ]   [ Buy now ]   │
│ [░]S │ 14 in stock · delivery priced at checkout · pickup where offered    │
│ [░]T │   ^ LISTING SUMMARY STRIP: sticky while scrolling                   │
│      ├─────────────────┬────────────────────────┬──────────────────────────┤
│ [░]C │ ON THIS PAGE    │ ░░░░░░░░░░░░░░░░░░░░░░ │ KEY FACTS                │
│ [░]E │ > Overview      │ ░░░░░ MAIN PHOTO ░░░░░ │ Condition  Grade A       │
│ [░]P │   Condition     │ ░░░░░░░░░░░░░░░░░░░░░░ │ Item       Single item   │
│      │   Specifications│ [░] [░] [░] [░] [░]    │ Seller     Rawabi Home   │
│ (Q)  │   Delivery      │                        │ Stock      14            │
│ Me   │   Seller        │                        │ Delivery   at checkout   │
│      │   Compare       │                        │ Pickup     where offered │
│      │                 ├────────────────────────┴──────────────────────────┤
│      │                 │ CONDITION REPORT   [New][A][B][C][D][R][F]  -> A  │
│      │ (index stays    │ SPECIFICATIONS     full table, not tabs           │
│      │  in view)       │ DELIVERY & PICKUP                                 │
│      │                 │ SELLER             Rawabi · Riyadh  [ Store ]     │
│      │                 ├───────────────────────────────────────────────────┤
│      │                 │ COMPARE SIMILAR  THIS LOT  LOT B    LOT C         │
│      │                 │ Price            SAR 189  SAR 229  SAR 149        │
│      │                 │ Grade            A        New      A              │
│      │                 │ In stock         14       32       3              │
│      │                 │                           [View]   [View]         │
└──────┴─────────────────┴───────────────────────────────────────────────────┘
```

- **Result navigation:** Back to results · Lot 2 of 4 · Previous / Next. When
  the page is opened directly, without a results list, Previous and Next step
  through the lot's category, and Back goes to that category.
- **Sticky listing summary strip:**
  - title, grade, seller and city, watch;
  - price and was-price, quantity, Add to cart, Buy now;
  - stock, delivery priced at checkout, pickup where offered.
- **A three-part band:**
  - a sticky **"On this page" index**;
  - the main photo, with its 5 thumbnails in a row;
  - a key-facts table.
- **One long spec sheet, with no tabs:**
  - the condition report (the 7-grade scale, with this lot marked);
  - specifications, as a full table;
  - delivery & pickup;
  - the seller.
- **Compare similar:** a table (price, grade, stock) in place of rails.

### J. Auction-detail wireframe — "lot sheet with the bid ladder"
```text
┌──────┬─────────────────────────────────────────────────────────────────────┐
│ [░]A │ < Back to results   Lot 3 of 6   [< Prev] [Next >]       Cart  Acct │
│      ├─────────────────────────────────────────────────────────────────────┤
│ [░]K │ ░ LOT TITLE · OPEN FOR BIDS · Grade A · Rawabi (Riyadh)    [Watch]  │
│ [░]F │ Closes in 5h 40m · current SAR 3,150 · 23 bids · 118 watching       │
│ [░]S │ Bid [3,200] [3,250] [3,400] [Custom] [Max bid] · each confirms      │
│ [░]T │ Or buy now SAR 4,600 · delivery priced at checkout · pickup         │
│ [░]C │   ^ LOT SUMMARY STRIP (sticky) with the bid ladder built in         │
│      ├─────────────────┬────────────────────────┬──────────────────────────┤
│ [░]E │ ON THIS PAGE    │ ░░░░░░░░░░░░░░░░░░░░░░ │ KEY FACTS                │
│ [░]P │ > Overview      │ ░░░░░ MAIN PHOTO ░░░░░ │ Deposit    covered       │
│      │   Bid history   │ ░░░░░░░░░░░░░░░░░░░░░░ │ Timed      late bid +5m  │
│ (Q)  │   Condition     │ [░] [░] [░]            │ Buy now    SAR 4,600     │
│ Me   │   Specifications│                        │ Delivery   at checkout   │
│      │   Delivery      │                        │ Pickup     where offered │
│      │   Terms         │                        │ Grade      A             │
│      │   Compare       │                        │                          │
│      │                 ├────────────────────────┴──────────────────────────┤
│      │                 │ BID HISTORY   BIDDER     AMOUNT     TIME   TYPE   │
│      │                 │               Bidder 7   SAR 3,150  2m     normal │
│      │                 │               Bidder 3   SAR 3,100  5m     maximum│
│      │                 │ CONDITION · SPECIFICATIONS · TERMS                │
│      │                 │ DELIVERY & PICKUP                                 │
│      │                 ├───────────────────────────────────────────────────┤
│      │                 │ COMPARE SIMILAR  THIS LOT  LOT B    LOT C         │
│      │                 │ Closes in        5h 40m   18 min   46 min         │
│      │                 │ Current bid      3,150    1,480    540            │
└──────┴─────────────────┴───────────────────────────────────────────────────┘
```

- **Sticky summary strip:**
  - the **bid ladder**: 3,200 · 3,250 · 3,400 · Custom · Max bid. Each rung
    opens the confirm step;
  - a second line: or buy now SAR 4,600 · delivery priced at checkout ·
    pickup.
- **A three-part band:**
  - the index;
  - the photo, with 3 thumbnails;
  - key facts: deposit covered, timed with a late bid adding 5 minutes, Buy
    Now, delivery, pickup, grade.
- **Below the band:**
  - bid history as a data table (bidder, amount, time, type);
  - condition, specifications and terms;
  - delivery & pickup;
  - compare similar (closing time, current bid).

### K. Live-auction wireframe — "live schedule"
```text
┌──────┬─────────────────────────────────────────────────────────────────────┐
│ [░]A │ [* LIVE Tuesday Evening Live] [Pallet Hour 20h] [Thursday Furniture]│
│ [░]K ├─────────────────────────────────────────────────────────────────────┤
│ [░]F │ Red Sea Trading · Khalid Al-Zahrani · 1,284 watching · [Rules]      │
│ [░]S ├─────────────────────────────────────────────────────────────────────┤
│ [░]T │ #   LOT              START      RESULT       BIDS   STATUS          │
│ [░]C ├─────────────────────────────────────────────────────────────────────┤
│ [░]E │ 1   Stick vacuum     SAR 150    SAR 310        14   Sold            │
│ [░]P │ 2   Coffee maker     SAR 60     SAR 120         9   Sold            │
│      │ 3   Keyboard         SAR 180    -               0   Unsold          │
│ (Q)  │ 4   Loveseat         SAR 800    SAR 1,350      19   Sold            │
│      ├──────────────────┬─────────────────┬────────────────┬───────────────┤
│ Me   │ ░░░░░░░░░░░░░░░░ │ 5 · Recliner    │ CURRENT        │ LAST BIDS     │
│      │ ░ LIVE STREAM ░░ │ Grade A         │ SAR 1,850      │ B7 1,850 now  │
│      │ [lot photo]░░░░░ │ 16 bids         │ [Bid 1,875]    │ B3 1,825 22s  │
│      │ ░░░░░░░░░░░░░░░░ │ status set by   │ [1,900]        │ B5 1,800 41s  │
│      │                  │ the auctioneer  │ you: no bids   │               │
│      ├──────────────────┴─────────────────┴────────────────┴───────────────┤
│      │   ^ the live row expands in place inside the order of sale          │
│      │ 6   Dining chairs    SAR 400    -               -   Next            │
│      │ 7-10 ...                                            Staged          │
│      ├─────────────────────────────────────────────────────────────────────┤
│      │ [ Activity log v ]   [ Event info & rules v ]                       │
└──────┴─────────────────────────────────────────────────────────────────────┘
```

- **Event tabs:** Tuesday Evening Live (live) · Pallet Hour (in 20 h) ·
  Thursday Furniture Clearance.
- **Summary line:** host, presenter, number watching, rules.
- **One order-of-sale table** with the columns #, lot, start, result, bids and
  status.
- The live row **expands in place** into a four-cell band:
  - the **stream, with the lot photo inset**;
  - the lot: grade, bids, and a status set by the auctioneer;
  - the current bid, "Bid SAR 1,875" and the next amount;
  - the last bids.
- The activity log and event information are expanders below the table.
- Live bids are one tap, as in Option 1.

### L. Seller-storefront wireframe — "seller profile"
```text
┌──────────────────────┬─────────────────────────────────────────────────────┐
│ KHAZNA               │ Sellers > Rawabi Home Outlet       Bell  Cart  Acct │
│  marketplace         ├─────────────────────────────────────────────────────┤
│ [ Search...     / ]  │ (RH) RAWABI HOME OUTLET    Riyadh · since 2024      │
│ Home                 │ 4 auctions · 4 Buy Now          [ Pickup & hours ]  │
│ All lots         29  │   (compact profile header, no cover photo)          │
│ Auctions         11  ├─────────────────────────────────────────────────────┤
│ Buy Now          18  │ [Overview] [Auctions 4] [Buy Now 4] [About]         │
│                      ├──────────────────────────┬──────────────────────────┤
│ * Live now        1  │ ENDING SOON (seller)     │ DEALS (seller)           │
│ Ending soon       3  │ ░ Lot   5h 40m   [Bid]   │ ░ Lot   -33%   [+]       │
│ New today        10  │ ░ Lot   7h 20m   [Bid]   │ ░ Lot   -33%   [+]       │
│ Bulk & pallets    4  │ ░ Lot   1d 3h    [Bid]   │ ░ Lot   -24%   [+]       │
│                      ├──────────────────────────┴──────────────────────────┤
│ SELLERS              │ NEW FROM THIS SELLER   [░] [░] [░]                  │
│  * Red Sea Trading   ├─────────────────────────────────────────────────────┤
│  > Rawabi Home Outlet│ Auctions / Buy Now tabs = the sortable table        │
│  Khazna Direct       │   + quick view, scoped to this seller               │
│  Dar Al Majd         ├─────────────────────────────────────────────────────┤
│  Sahel Lifestyle     │ OTHER SELLERS   table: seller · city · lots         │
└──────────────────────┴─────────────────────────────────────────────────────┘
```

- The rail stays, with the current seller marked.
- **A compact profile header**, with no cover: monogram, Rawabi Home Outlet,
  Riyadh, member since 2024, 4 auctions · 4 Buy Now, and Pickup & hours.
- **Tabs:** Overview · Auctions 4 · Buy Now 4 · About.
- **Overview** holds this seller's modules:
  - Ending soon: 5h 40m, 7h 20m, 1d 3h;
  - Deals: −33%, −33%, −24%;
  - New from this seller: 3 lots.
- The Auctions and Buy Now tabs use the sortable table and quick view, limited
  to this seller.
- "Other sellers" is a table.

### M. Mobile homepage wireframe
```text
┌──────────────────────────────────┐
│ LOGO  Home          Bell 3  Acct │
├────────────────┬─────────────────┤
│ LIVE NOW     1 │ ENDING <1H    3 │
│ DEALS       14 │ NEW TODAY    10 │
├───────┬────────┼────────┬────────┤
│ ░App  │ ░Kitch │ ░Furn  │ ░Fash  │
│ ░Tool │ ░Auto  │ ░Elec  │ ░Pall  │
├───────┴────────┴────────┴────────┤
│ DEALS                View all 14 │
│ ░ Lot title  -33%  SAR 175  [+]  │
│ ░ Lot title  -33%  SAR 349  [+]  │
├──────────────────────────────────┤
│ ENDING SOON             View all │
│ ░ Lot title   9 min      [Bid]   │
│ ░ Lot title  18 min      [Bid]   │
├──────────────────────────────────┤
│ POPULAR NOW             View all │
│ ░ Lot title  42 bids      [>]    │
├──────────────────────────────────┤
│ SELLERS                          │
│ (RS) Red Sea  * LIVE         >   │
│ (RH) Rawabi Home Outlet      >   │
├──────────────────────────────────┤
│ LIVE & UPCOMING                  │
│ * LIVE lot 5/10 · 1,284 [Join]   │
├──────┬────────────────────┬──────┤
│ [=]  │ [ Search lots... ] │ Cart │
├──────┴────────────────────┴──────┤
│  ^ bottom command bar: search in │
│    thumb reach; on lot pages it  │
│    carries [Add] or [Bid]        │
└──────────────────────────────────┘
```

Mobile strategy: **fast search, filter and category shopping, within thumb
reach.**

- **Top bar:** minimal — the logo, page title, bell and account.
- **Home, in order:**
  - the counters, 2×2;
  - the category grid, 4×2;
  - the module lists;
  - sellers;
  - live.
- **Bottom command bar:** menu · search field · cart.
  - On lot pages it carries the main action, Add or Bid. Bid opens the bid
    ladder sheet, with a custom amount, a maximum bid, Buy now on "both" lots
    and the confirm step.
  - On lot pages the search shrinks to an icon.
- **Filters** open a full-screen filter page led by the category tree, not a
  bottom sheet.
- There is no chip row and no tab bar at the top or bottom.

### N. Signature components

1. The app-shell navigation rail with the category tree, which collapses to
   thumbnails.
2. The search deck with scope tabs and hub counters, which docks into the
   rail.
3. Dashboard rows of list modules.
4. A sortable data table with column filters and a quick-view pane.
5. The listing summary strip with the bid ladder, the in-page index and the
   comparison table. On phones, the bottom command bar.

Visual personality (secondary): compact, crisp and data-legible, with a strong
typographic hierarchy and tabular figures.

---

## 6. Option 4 — Auction Commerce (slot `concept-d`)

### A. Design objective

An auction-first marketplace where Khazna's timed and live auctions are the
organising idea. Pages are arranged around time: what is live now, what closes
next, what opens soon. They use purpose-built auction components:

- a live stage;
- an ending-soon timeline;
- data-first bid tickets;
- a docked bidding console;
- an auction timeline on every lot.

Buy Now is always one click away in the floor switcher. The option should feel
dynamic and time-aware but calm, professional and trustworthy. It must never
look like crypto, trading, gaming or cyberpunk:

- every timeline pin is a photo;
- times are written in plain language ("Closes in 9 min");
- one urgency colour is used, with no green/red flashing;
- nothing scrolls on its own.

### B. Desktop homepage wireframe
```text
┌─────────┬──────────────────────────────────────────┬───────────────────────┐
│ [=] LOGO│ [Live 5/10|Ending 9m|Upcoming|Buy Now 18]│ (Q) ? Bids2 Cart Me AR│
├─────────┴──────────────────────────────────────────┴───────────────────────┤
│   (one 64px bar; no utility strip, no category bar)                        │
├────────────────────────────────────────────────────────────────────────────┤
│ LIVE AUCTION STAGE   the page opens on the live room        1,284 watching │
├──────────────────┬──────────────────────────────────────┬──────────────────┤
│ PREVIOUS         │ NOW · LIVE · LOT 5 OF 10             │ UP NEXT          │
│                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │                  │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░ LIVE STREAM ░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░ │ [lot photo]░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │
│ #4 Loveseat      │ Tuesday Evening Live                 │ #6 Dining chairs │
│ SOLD  SAR 1,350  │ Lot 5 · Leather Recliner             │ starts SAR 400   │
│                  │ CURRENT BID  SAR 1,850 · 16 bids     │                  │
│                  │ Bidding open · set by auctioneer     │                  │
│                  │ [ Bid SAR 1,875 ] [ Enter room ]     │                  │
├──────────────────┴──────────────────────────────────────┴──────────────────┤
│   nothing live: the next timed lot to close takes the stage                │
├────────────────────────────────────────────────────────────────────────────┤
│ ENDING SOON                 [15 min 1] [1 hour 3] [3 hours 4] [24 hours 7] │
│  NOW        15m          1h            3h              12h           24h   │
│  |----------|------------|-------------|---------------|-------------|---> │
│         ^     ^       ^          ^     ^     ^     ^                       │
│        [░]   [░]     [░]        [░]   [░]   [░]   [░]                      │
│        9m    18m     46m        2h14  3h05  5h40  7h20                     │
│   a photo pin at each lot's closing time; the chips choose the window      │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ OPEN FOR BIDS · 11 bids│ OPEN FOR BIDS · 31 bids │ OPEN FOR BIDS · 9 bids  │
│ CLOSES IN 9 MIN        │ CLOSES IN 18 MIN        │ CLOSES IN 46 MIN        │
│ CURRENT  SAR 180       │ CURRENT  SAR 1,480      │ CURRENT  SAR 540        │
├────────────────────────┼─────────────────────────┼─────────────────────────┤
│ [░░] Lot title         │ [░░] Lot title          │ [░░] Lot title          │
│ [░░] Grade A · Seller  │ [░░] Grade A · Seller   │ [░░] Grade C · Seller   │
├────────────────────────┼─────────────────────────┼─────────────────────────┤
│ [ Bid SAR 185 ]   (W)  │ [ Bid SAR 1,500 ] (W)   │ [ Bid SAR 550 ]   (W)   │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ ACTIVE AUCTIONS   bid tickets, soonest first    [Most bids]  View all 9 -> │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ OPEN FOR BIDS · 18 bids│ OPEN FOR BIDS · 42 bids │ OPEN FOR BIDS · 23 bids │
│ CLOSES IN 2H 14M       │ CLOSES IN 3H 05M        │ CLOSES IN 5H 40M        │
│ CURRENT  SAR 1,240     │ CURRENT  SAR 7,850      │ CURRENT  SAR 3,150      │
├────────────────────────┼─────────────────────────┼─────────────────────────┤
│ [░░] Lot title         │ [░░] Pallet · 64 units  │ [░░] Lot title          │
│ [░░] Grade B · Seller  │ [░░] Grade B · Seller   │ [░░] Grade A · Seller   │
├────────────────────────┼─────────────────────────┼─────────────────────────┤
│ [ Bid SAR 1,265 ] (W)  │ [ Bid SAR 7,950 ] (W)   │ [ Bid SAR 3,200 ] (W)   │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ UPCOMING                                                                   │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ OPENS IN 30H 15M · timed auction    │ LIVE EVENTS                          │
│ ░ Lot title · starts SAR 2,400      │ Pallet Hour - Bulk Returns           │
│ [ Watch ]                           │   in 20 h · 12 lots  [ Remind me ]   │
│                                     │ Thursday Furniture Clearance         │
│                                     │   in 2 days · 24 lots  [ Remind me ] │
├─────────────────────────────────────┴──────────────────────────────────────┤
│ BUY NOW · 18 lots   skip the bidding: stock tickets        Shop Buy Now -> │
├──────────────────┬──────────────────┬──────────────────┬───────────────────┤
│ 8 IN STOCK       │ 4 IN STOCK       │ 11 IN STOCK      │ 40 IN STOCK       │
│ SAR 175          │ SAR 349          │ SAR 219          │ SAR 119           │
│ was 260 · -33%   │ was 520 · -33%   │ was 319 · -31%   │ was 169 · -30%    │
├──────────────────┼──────────────────┼──────────────────┼───────────────────┤
│ [░░] Lot title   │ [░░] Lot title   │ [░░] Lot title   │ [░░] Lot title    │
│ [░░] Grade A     │ [░░] Grade B     │ [░░] Grade B     │ [░░] Grade New    │
├──────────────────┼──────────────────┼──────────────────┼───────────────────┤
│ [ Add to cart ]  │ [ Add to cart ]  │ [ Add to cart ]  │ [ Add to cart ]   │
├──────────────────┴──────────────────┴──────────────────┴───────────────────┤
│ CATEGORIES ON THE FLOOR   ordered by the next closing lot                  │
│ [Automotive]      [Home Appliances]  [Electronics]     [Bulk Pallets]   >  │
│  1 open · 2 buy    4 open · 1 buy     1 open · 0 buy    2 open · 2 buy     │
│  next 9 min        next 18 min        next 2h 14m       next 3h 05m        │
├────────────────────────────────────────────────────────────────────────────┤
│ AUCTION HOSTS   every seller's open lots on one shared time axis           │
│                       NOW  15m   1h     3h       12h    24h                │
│ Red Sea · * LIVE NOW  |-------------[░]--------------------  [Enter room]  │
│ Dar Al Majd · 3 open  |-[░][░]-----------------------------> [Seller page] │
│ Sahel · 1 open        |-------[░]--------------------------  [Seller page] │
│ Khazna Direct · 1     |----------------[░]-----------------  [Seller page] │
│ Rawabi Home · 3 open  |-------------------[░][░]-----------> [Seller page] │
│   each pin is a lot photo; > marks lots closing later this week            │
├────────────────────────────────────────────────────────────────────────────┤
│ HOW BIDDING WORKS                                                          │
│ 1 Refundable deposit from your wallet -> 2 Bid, or set a maximum ->        │
│   3 Timed lots: a bid in the last 5 min adds 5 min -> 4 Win and pay        │
│   (timed wins: payment window) -> 5 Delivery or pickup, after payment      │
│ GRADES  [New] [A] [B] [C] [D] [R] [F]   one line of meaning each           │
│ FOOTER   country · language · help                                         │
└────────────────────────────────────────────────────────────────────────────┘
```

### C. Homepage section order

1. **One header bar** with the floor switcher.
2. **Live auction stage:** a previous · now · next triptych.
   - The stream fills the centre, with the lot photo inset.
   - "Bid SAR 1,875" and "Enter room" sit under it.
   - When nothing is live, the next timed lot to close takes the stage (the
     seat covers, 9 min), with the next live event's start time.
3. **Ending soon:**
   - a time axis (NOW · 15m · 1h · 3h · 12h · 24h) with a photo pin at each
     lot's closing time;
   - window chips: 15 min 1 · 1 hour 3 · 3 hours 4 · 24 hours 7;
   - bid tickets for the lots closing within the hour.
4. **Active auctions:** bid tickets for the next closes (2h 14m, 3h 05m,
   5h 40m), with "View all 9".
5. **Upcoming:**
   - the scheduled timed lot: opens in 30h 15m, starts at SAR 2,400, with a
     Watch action;
   - the live events: Pallet Hour in 20 h and Thursday Furniture Clearance in
     2 days. "Remind me" is a concept idea (G29).
6. **Buy Now**, "skip the bidding": stock tickets four across, largest saving
   first, with "Shop Buy Now" (18 lots).
7. **Categories on the floor:** chips ordered by each category's next closing
   lot, showing open auctions, the Buy Now count and the next close.
8. **Auction hosts:** each seller as a row on one shared time axis, with photo
   pins for its open lots and "Enter room" or "Seller page".
9. **How bidding works:** five steps, plus the 7-grade scale.
10. **Footer:** country, language, help.

**Hero proportions:** container width × about 480px; a centred 25/50/25
triptych with the controls centred under the stream.

**Buy Now's position:** the order follows the brief's suggestion. The
review suggested moving Buy Now up, straight after the timeline. This plan
keeps it after Upcoming, because Buy Now is always one click away in the
switcher; decision 5 in section 13 asks you to choose.

### D. Header / navigation structure

- **One 64px bar:**
  - start: the menu (`[=]`) and the logo;
  - centre: the **floor switcher** — Live 5/10 · Ending 9m · Upcoming · Buy
    Now 18. It is also the tab set of the home and browse pages;
  - end: search (icon), bidding rules (?), **My bids** (count, with Winning
    and Outbid), cart, account and language. The notification bell is a badge
    on Account.
- While an event runs, the Live segment carries the live dot and the lot
  number. Inner pages have no status band.
- **The menu** holds categories, sellers, How bidding works, help and the
  country switcher (G19).
- **My bids** opens a drawer of your lots: winning or outbid, current bid,
  time left, and a bid button (each bid goes through the confirm step). The
  production data exists: the account's watchlist tab (alias `bids`).
- **vs Option 1:** one bar instead of three tiers. Sale mode and time are the
  primary navigation and categories live in the menu. My bids is a first-class
  control, and there is no search bar.

### E. Search structure

- **Search is an icon** that expands inline over the switcher, with a scope
  (Auctions / Buy Now). Its suggestions show time left and current bid.
- **Primary discovery is by time:** the window chips on home and browse.
- **Mobile:** a full-screen search whose suggestions lead with the lots ending
  soonest.
- **vs Option 1:** search is collapsed; time windows and live status do the
  discovery work.

### F. Category discovery

- Categories on the floor (home), the category filter in the finder's "More
  filters" drawer, and the category list in the menu.
- Deliberately secondary to time and status.
- **vs Option 1:** categories carry auction state and sit below the auction
  content, not in a mega menu at the top.

### G. Card architecture — "bid ticket" and "stock ticket"

**Bid ticket** (auctions):

- **Top panel, data first:** a status line (Open for bids · 11 bids), a large
  plain-language time ("Closes in 9 min") and the current bid.
- **Middle:** a small square photo (about 64px), with the title, grade and
  seller.
- **Bottom:** the amount button ("Bid SAR 185") and the watch heart. Every
  amount button opens the confirm step.
- Two data cells per ticket (time and current bid), one urgency colour, and no
  green/red changes.

**Stock ticket** (Buy Now), in the same grammar:

- Stock ("8 in stock"), the price, and the was-price with the saving.
- A photo row.
- Add to cart.

**States:**

- Upcoming: opens in 30h 15m · starts at SAR 2,400 · Watch.
- Sold: SAR 610 · 21 bids.
- Sold out.
- Your own lots: "You're winning" or "You're outbid" on the status line.

**vs Option 1:** the photo is a small row in the middle, not the top of the
card; the data leads.

### H. Browse-page wireframe — "auction finder"
```text
┌─────────┬──────────────────────────────────────────┬───────────────────────┐
│ [=] LOGO│ [Live 5/10|Ending 9m|Upcoming|Buy Now 18]│ (Q) ? Bids2 Cart Me AR│
├─────────┴──────────────────────────────────────────┴───────────────────────┤
│   (the floor switcher is the tab set: Ending is active here)               │
│ WITHIN:  [15 min 1]  [1 hour 3]  [3 hours 4]  [24 hours 7]  [All 9]        │
│ [+ More filters]  category · condition · type · price · stock · seller     │
│ Sort: closing time v   (other sorts show one flat grid, no buckets)        │
├────────────────────────────────────────────────────────────────────────────┤
│ CLOSING WITHIN 15 MINUTES (1)               the most urgent bucket, larger │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ OPEN FOR BIDS · 11 bids · 6 bidders │ when this bucket empties:            │
│ CLOSES IN 9 MIN                     │  'Nothing closes in the next         │
│ CURRENT  SAR 180   next SAR 185     │   15 min. Next: 18 min'              │
├─────────────────────────────────────┤                                      │
│ [░░░░] Lot title                    │                                      │
│ [░░░░] Grade A · Seller             │                                      │
├─────────────────────────────────────┤                                      │
│ [   Bid SAR 185   ]          (W)    │                                      │
├─────────────────────────────────────┴──────────────────────────────────────┤
│ CLOSING WITHIN 1 HOUR (2)                                                  │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ OPEN FOR BIDS · 31 bids│ OPEN FOR BIDS · 9 bids  │                         │
│ CLOSES IN 18 MIN       │ CLOSES IN 46 MIN        │                         │
│ CURRENT  SAR 1,480     │ CURRENT  SAR 540        │                         │
├────────────────────────┼─────────────────────────┤                         │
│ [░░] Lot title         │ [░░] Lot title          │                         │
│ [░░] Grade A · Seller  │ [░░] Grade C · Seller   │                         │
├────────────────────────┼─────────────────────────┤                         │
│ [ Bid SAR 1,500 ] (W)  │ [ Bid SAR 550 ]   (W)   │                         │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ CLOSING WITHIN 24 HOURS (4)                                                │
├──────────────────┬───────────────────┬──────────────────┬──────────────────┤
│ CLOSES 2H 14M    │ CLOSES 3H 05M     │ CLOSES 5H 40M    │ CLOSES 7H 20M    │
│ SAR 1,240        │ SAR 7,850         │ SAR 3,150        │ SAR 1,120        │
│ [░░] Lot title   │ [░░] Pallet       │ [░░] Lot title   │ [░░] Lot title   │
├──────────────────┴───────────────────┴──────────────────┴──────────────────┤
│ LATER THIS WEEK (2)                                           [ Show all ] │
│   Buy Now tab: stock tickets, 4 across, with was-price; no buckets         │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Controls:**
  - the switcher is the tab set (Ending is active);
  - window chips: 15 min 1 · 1 hour 3 · 3 hours 4 · 24 hours 7 · All 9;
  - a "More filters" drawer (category, condition, item type, price,
    availability, seller);
  - sort.
- **Time buckets:** when sorted by closing time, results fall into exclusive
  buckets:
  - within 15 minutes (1, shown as a larger ticket);
  - within 1 hour (2);
  - within 24 hours (4, compact);
  - later this week (2).

  Other sorts show one flat grid of tickets.
- **Empty buckets:** "Nothing closes in the next 15 min. Next: 18 min". The
  demo clock starts at page load, so the 15-minute bucket empties about 9
  minutes into a presentation; the empty state is part of the design.
- **Buy Now tab:** stock tickets four across, with the was-price, and no
  buckets.
- **Upcoming tab:** the scheduled lot and the live events.

### I. Product-detail wireframe — Buy Now "stock page"
```text
┌─────────┬──────────────────────────────────────────┬───────────────────────┐
│ [=] LOGO│ [Live 5/10|Ending 9m|Upcoming|Buy Now 18]│ (Q) ? Bids2 Cart Me AR│
├─────────┴──────────────────────────────────┬───────┴───────────────────────┤
│ 14 IN STOCK    LOT TITLE                   │ SAR 189  was 249  -24%        │
│ Grade A · Rawabi Home Outlet               │ [ Add to cart ]  [ Buy now ]  │
│ [ Watch ]  [ Share ]                       │ Delivery priced at checkout   │
├────────────────────────────────────────────┴───────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░ STAGE: main photo on a neutral stage ░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ [░] [░] [░] [░] [░]   thumbnails under the stage                           │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ CONDITION              │ SPECIFICATIONS          │ DELIVERY & PICKUP       │
│ Grade A                │ spec · value            │ Delivery priced at      │
│ notes on this lot      │ spec · value            │   checkout              │
│ [ Grade guide ]        │ spec · value            │ Pickup where offered    │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ ALSO AT AUCTION   lots being bid on now, on a time line                    │
│  |---------o-------------o----------------o----------------------------->  │
│  [░] Lot · SAR 180 · 9m  [░] Lot · SAR 540 · 46m  [░] Lot · SAR 1,240 · 2h │
├──────────────────────┬──────────────────────────────┬──────────────────────┤
│ SAR 189   was 249    │ Qty  [ -  1  + ]             │ [ Add to cart ]      │
│ -24%  ·  14 left     │ Delivery priced at checkout  │ [ Buy now ]          │
│                      │ Pickup where offered         │                      │
├──────────────────────┴──────────────────────────────┴──────────────────────┤
│ ^ PURCHASE CONSOLE: docks at the bottom only after the header bar has      │
│   scrolled away; collapsed height 72px or less                             │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Lot header bar:**
  - start: stock, title, grade and seller;
  - end: price, was-price and saving, Add to cart, Buy now, delivery.
- **Gallery:** a stage, with the 5 thumbnails under it.
- **Three fact columns:** condition, specifications, delivery & pickup.
- **"Also at auction":** auctions closing soon, on a time line.
- **Purchase console:** it **docks at the bottom only after the header bar
  scrolls away**, and its collapsed height is 72px or less.

### J. Auction-detail wireframe — "bidding workspace"
```text
┌─────────┬──────────────────────────────────────────┬───────────────────────┐
│ [=] LOGO│ [Live 5/10|Ending 9m|Upcoming|Buy Now 18]│ (Q) ? Bids2 Cart Me AR│
├─────────┴──────────────────────────────────────┬───┴───────────────────────┤
│ OPEN FOR BIDS   LOT KZ-0388   LOT TITLE        │ CLOSES IN 5H 40M          │
│ Grade A · Rawabi Home Outlet · 118 watching    │ Current SAR 3,150         │
│ 23 bids · 9 bidders · or buy now SAR 4,600     │ [ Bid SAR 3,200 ]         │
│ [ Watch ]  [ Share ]  [ Rules ]                │ You: outbid               │
├────────────────────────────────────────────────┴───────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ STAGE: main photo ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ [░] [░] [░]   thumbnails under the stage                                   │
├────────────────────────────────────────────────────────────────────────────┤
│ AUCTION TIMELINE                                                           │
│  OPENED          BIDS              NOW         CLOSE    PAYMENT*  DELIVERY │
│  o---------------|--|-|---|--|-----*-----------[####]---o----------o       │
│  30 h ago        23 bids           SAR 3,150   in 5h 40m          or pickup│
│  [####] timed auctions: a bid in the last 5 minutes extends the close by 5 │
│  * payment window applies to timed-auction wins; delivery or pickup is     │
│    arranged after payment (no date shown)                                  │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ BID ACTIVITY (live)                 │ LOT FACTS                            │
│ Bidder 7   SAR 3,150    2m          │ [Condition] [Specs] [Terms]          │
│ You        SAR 3,100    5m          │ [Delivery & pickup]                  │
│ Bidder 3   SAR 3,050    9m          │ Grade A: grade guide line            │
│ [ Full history ]                    │ (+ Contents on pallet/bulk lots)     │
├─────────────────────────────────────┴──────────────────────────────────────┤
│ CLOSING AROUND THE SAME TIME  [ticket] [ticket] [ticket] [ticket]  >       │
├──────────────────────┬──────────────────────────────┬──────────────────────┤
│ YOU'RE OUTBID        │ Quick bid                    │ [ Set maximum bid ]  │
│ Current SAR 3,150    │ [3,200] [3,250] [3,400]      │ [ Buy now SAR 4,600 ]│
│ Next    SAR 3,200    │ [ SAR ______ ]  [ Bid ]      │ Deposit covered (ok) │
│ each bid confirms    │ Delivery priced at checkout  │ Pickup where offered │
├──────────────────────┴──────────────────────────────┴──────────────────────┤
│ ^ BIDDING CONSOLE: docks at the bottom once the header bar scrolls away    │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Lot header bar:**
  - start: Open for bids, lot KZ-0388, title, grade, seller, 118 watching,
    23 bids, 9 bidders, or buy now SAR 4,600;
  - end: Closes in 5h 40m, current bid SAR 3,150, "Bid SAR 3,200", and your
    status (outbid).
- **Stage:** 3 photos, with the thumbnails under it.
- **Auction timeline**, the whole life of the lot:
  - opened 30 h ago → bids → now;
  - → close, with the 5-minute extension window (timed auctions only);
  - → payment window (timed wins only);
  - → delivery or pickup, arranged after payment, with no date shown.

  A list alternative serves screen readers.
- **Bid activity** beside the lot facts: Condition · Specs · Terms · Delivery
  & pickup, plus Contents on pallet and bulk lots.
- **"Closing around the same time":** bid tickets.
- **Bidding console:** it docks once the header bar scrolls away. It holds:
  - your status;
  - quick bids (3,200 · 3,250 · 3,400), a custom amount and a maximum bid;
  - Buy now SAR 4,600;
  - the deposit;
  - delivery priced at checkout, and pickup where offered.

  Every bid goes through the confirm step.

### K. Live-auction wireframe — "auction room: past · now · next"
```text
┌─────────┬──────────────────────────────────────────┬───────────────────────┐
│ [=] LOGO│ [LIVE 5/10|Ending 9m|Upcoming|Buy Now 18]│ (Q) ? Bids2 Cart Me AR│
├─────────┴──────────────────────────────────────────┴───────────────────────┤
│ * LIVE  Tuesday Evening Live - Home & Electronics  1,284 watching  [Rules] │
│   hosted by Red Sea Trading Co. · presented by Khalid Al-Zahrani           │
├──────────────────┬──────────────────────────────────────┬──────────────────┤
│ PAST             │ NOW · LOT 5 OF 10                    │ NEXT             │
│ #4 Loveseat      │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ #6 Dining chairs │
│   SOLD 1,350     │ ░░░ LIVE STREAM (the auctioneer) ░░░ │   starts SAR 400 │
│ #3 Keyboard      │ [lot photo]░░░░░░░░░░░░░░░░░░░░░░░░░ │ #7 Speaker       │
│   UNSOLD         │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   starts SAR 90  │
│ #2 Coffee maker  │ ▒ B7 1,850 · B3 1,825 · B5 1,800 ▒▒▒ │ #8 Tool kit      │
│   SOLD 120       │ Lot 5 · Leather Recliner · Grade A   │   starts SAR 60  │
│ #1 Stick vacuum  │ CURRENT BID  SAR 1,850 · 16 bids     │ #9 Casserole     │
│   SOLD 310       │ Open > Countdown > Sold/Unsold       │   starts SAR 110 │
│                  │   each status set by the auctioneer  │ #10 Boots · 70   │
├──────────────────┴───┬──────────────────────────────┬───┴──────────────────┤
│ Current SAR 1,850    │ [    BID  SAR 1,875    ]     │ [1,900]  [1,925]     │
│ You: not bidding     │ Bids are binding once placed │ Deposit SAR 200 (ok) │
├──────────────────────┴──────────────────────────────┴──────────────────────┤
│ ^ BIDDING CONSOLE (same component as lot pages), docked to the bottom      │
│   the room reads through time: results at the start, the queue at the end  │
└────────────────────────────────────────────────────────────────────────────┘
```

The room is a symmetric triptych that reads through time:

- **Past:** the results so far — Sold 1,350, Unsold, Sold 120, Sold 310.
- **Now:**
  - the stream fills the stage, with the lot photo inset;
  - the last three bids in the lower third;
  - the lot, its grade and the current bid;
  - the status sequence Open → Countdown → Sold / Unsold, each step set by
    the auctioneer.
- **Next:** the queue, with starting bids.

There is no side column. The same bidding console as on lot pages is docked at
the bottom: current bid, your status, "Bid SAR 1,875", the next amounts, and
the SAR 200 deposit. Live bids are one tap and binding once placed, as in
Option 1.

### L. Seller-storefront wireframe — "auction house"
```text
┌─────────┬──────────────────────────────────────────┬───────────────────────┐
│ [=] LOGO│ [Live 5/10|Ending 9m|Upcoming|Buy Now 18]│ (Q) ? Bids2 Cart Me AR│
├─────────┴──────────────────────────────────────────┴───────────────────────┤
│ ▒▒▒▒▒▒▒▒ * LIVE NOW  ·  Tuesday Evening Live - Home & Electronics ▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒ lot 5/10  ·  1,284 watching  ·  [ Enter the room ] ▒▒▒▒▒▒▒▒▒▒▒ │
├────────────────────────────────────────────────────────────────────────────┤
│ (RS) RED SEA TRADING CO.  ·  Jeddah  ·  member since 2023                  │
│ 1 open auction  ·  2 Buy Now          [ Pickup & terms ]                   │
│   (status leads; identity sits beneath it)                                 │
├────────────────────────────────────────────────────────────────────────────┤
│ THIS SELLER'S AUCTION TIMELINE                                             │
│  NOW        15m          1h            3h              12h           24h   │
│  |----------|------------|-------------|---------------|-------------|---> │
│                                 [░] closes in 2h 14m                       │
├────────────────────────────────────────────────────────────────────────────┤
│ OPEN FOR BIDS (1)  ·  BUY NOW (2)                                          │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ OPEN FOR BIDS · 18 bids│ 7 IN STOCK              │ 12 IN STOCK             │
│ CLOSES IN 2H 14M       │ SAR 249                 │ SAR 329                 │
│ CURRENT  SAR 1,240     │ was 329 · -24%          │ was 449 · -27%          │
├────────────────────────┼─────────────────────────┼─────────────────────────┤
│ [░░] Lot title         │ [░░] Lot title          │ [░░] Lot title          │
│ [░░] Grade B · Red Sea │ [░░] Grade B            │ [░░] Grade A            │
├────────────────────────┼─────────────────────────┼─────────────────────────┤
│ [ Bid SAR 1,265 ] (W)  │ [ Add to cart ]         │ [ Add to cart ]         │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ RESULTS   [░] Robot vacuum · SOLD SAR 610 · 21 bids                        │
│   drawn for /seller/REDSEA (live now); the default storefront, Rawabi      │
│   Home Outlet, opens with its next-closing status (5h 40m) instead         │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Status leads.** The wireframe is drawn for `/seller/REDSEA`, which is
  hosting now, so a live band comes first. A seller that is not live leads
  with its next closing lot instead: the default storefront, Rawabi Home
  Outlet, opens with "next close 5h 40m".
- **Identity line:** monogram, name, city, member since, 1 open auction · 2
  Buy Now, and Pickup & terms.
- **The seller's own auction timeline.**
- **Tickets:** bid tickets and stock tickets.
- **Results:** sold lots, such as the robot vacuum sold for SAR 610 (G5).

### M. Mobile homepage wireframe
```text
┌──────────────────────────────────┐
│ [=] LOGO          (Q) Bids2 Cart │
├──────────────────────────────────┤
│ [Live 5/10][Ending][Upc][Buy 18] │
│  (sticky floor switcher)         │
├──────────────────────────────────┤
│ * LIVE lot 5/10 SAR 1,850 [Join] │
├──────────────────────────────────┤
│ WITHIN 15 MINUTES            < > │
├──────────────────────────────────┤
│ OPEN FOR BIDS · 11 bids          │
│ CLOSES IN 9 MIN                  │
│ CURRENT  SAR 180                 │
├──────────────────────────────────┤
│ [░░░] Lot title                  │
│ [░░░] Grade A · Seller           │
├──────────────────────────────────┤
│ [      Bid SAR 185      ]  (W)   │
├──────────────────────────────────┤
│ WITHIN 1 HOUR                    │
│ ░ Lot  SAR 1,480  18 min  [Bid]  │
│ ░ Lot  SAR 540    46 min  [Bid]  │
├──────────────────────────────────┤
│ WITHIN 24 HOURS (4)              │
│ ░ Lot  SAR 1,240  2h 14m  [Bid]  │
├──────────────────────────────────┤
│ CATEGORIES ON THE FLOOR     >    │
│ SELLERS                     >    │
│ HOW BIDDING WORKS (5 steps)      │
│                                  │
│    ( 2 winning · 1 outbid  ^ )   │
│  floating My bids pill: hidden   │
│  when signed out, with no bids,  │
│  and where the console docks     │
└──────────────────────────────────┘
```

Mobile strategy: **auction status first.**

- **Top bar:** the menu, logo, search, My bids and cart.
- **Sticky:** the floor switcher, and a live strip (lot 5/10, SAR 1,850,
  Join).
- **Home, in order:**
  - "Within 15 minutes" bid tickets, as a carousel;
  - within 1 hour and within 24 hours, as rows;
  - Categories on the floor, sellers, and How bidding works.
- **My bids pill:** a floating pill ("2 winning · 1 outbid"). It is hidden
  when you are signed out, when you have no bids, and where a console docks.
- **Lot pages:** the bidding console docks at the bottom and expands upwards
  into a sheet.

### N. Signature components

1. The one-bar floor switcher and the live stage triptych.
2. The ending-soon timeline with photo pins, and the time-bucketed finder.
3. The bid ticket and stock ticket (data first).
4. The docked bidding console, shared by lot pages and the live room.
5. An auction timeline on every lot, the past · now · next live room, and
   hosts on a shared time axis.

Visual personality (secondary): confident and time-aware, with restrained
colour, a single urgency accent reserved for time and live state, tabular
figures and minimal motion.

---

## 7. The grayscale test — every screen type

The brief asks: "If all four options were shown only as grayscale wireframes,
would a client immediately recognize four different website structures?" The
silhouettes below are drawn from the full wireframes, one sheet per screen
type.

### Homepages
```text
     OPTION 1            OPTION 2            OPTION 3            OPTION 4
┌────────────────┐  ┌────────────────┐  ┌────┬───────────┐  ┌───┬─────────┬──┐
│ utility strip  │  │ nav LOGO nav ic│  │ LG │ top bar   │  │LG │[L|E|U|B]│ic│
├────────────────┤  ├────────────────┤  │srch├───────────┤  ├───┼────────┬┴──┤
│ LOGO [search]  │  │ ░░ HEADLINE ░░ │  │ nav│ SEARCH    │  │ ░ │  NOW ░ │ ░ │
├────────────────┤  │ ░░[search..]░░ │  │rail│ DECK [___]│  │ pv│ ░░░░░░ │ nx│
│ category bar   │  │ ░░ popular  ░░ │  │    ├──┬──┬──┬──┤  │   │ [BID]  │   │
├──────────┬─────┤  │ ░[▓][▓][▓][▓]░ │  │tree│ct│ct│ct│ct│  ├───┴────────┴───┤
│ ░ HERO ░ │ END │  ├───────┬───┬────┤  │    ├──┴──┴──┴──┤  │ |--o-o--o----> │
│ ░░░░░░░░ ├─────┤  │ ░░░░░ │ ░ │ ░░ │  │    │ categories│  │ [] [] [] []    │
│ ░░░░░░░░ │ DEAL│  │ ░░░░░ │ ░ ├────┤  │    ├───┬───┬───┤  ├────┬─────┬─────┤
├──────────┴─────┤  │ ░░░░░ │ ░ │ ░░ │  │    │lst│lst│lst│  │ 9m │ 18m │ 46m │
│ trust strip    │  ├───┬───┼───┼────┤  │    │lst│lst│lst│  ├────┼─────┼─────┤
│ [][][][][][][] │  │ ░ │ ░ │ ░ │ ░░ │  │    ├───┴─┬─┴───┤  │ [] │ []  │ []  │
│ rail [][][] >  │  ├───┴───┼───┴────┤  │    │ dir │ live│  │ BID│ BID │ BID │
│ ▒▒▒▒ live ▒▒▒▒ │  │  sel  │  sel ▒ │  │    ├─────┴─────┤  ├────┼─────┼─────┤
│ deals [][][][] │  ├───────┼───┬────┤  │    │ recent [] │  │ 2h │ 3h  │ 5h  │
│ sellers·steps  │  │ ░░░░░ │ ░ │ ░░ │  ├────┴───────────┤  │ BID│ BID │ BID │
│                │  ├───┬───┼───┴────┤  │ footer         │  ├────┴──┬──┴─────┤
│                │  │ ░ │ ░ │ ░░░░░░ │  │                │  │ upcom.│ events │
│                │  ├───┴───┼────────┤  │                │  ├───┬───┼───┬────┤
│                │  │ ░░ bid│ ░░ bid │  │                │  │ $ │ $ │ $ │ $  │
│                │  ├───┬───┴───┬────┤  │                │  │ + │ + │ + │ +  │
│                │  │ ░ │  2x2  │ ░░ │  │                │  ├───┴───┴───┴────┤
│                │  ├───┤ ░░░░░ ├────┤  │                │  │ [cat][cat]  >  │
│                │  │ ░ │ ░░░░░ │ ░░ │  │                │  │ hosts|-o-o-->  │
│                │  ├───┴───────┴────┤  │                │  │ how bidding    │
│                │  │ grades   [LIVE]│  │                │  │                │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
```

### Browse
```text
     OPTION 1            OPTION 2            OPTION 3            OPTION 4
┌────────────────┐  ┌────────────────┐  ┌─┬──────────────┐  ┌───┬─────────┬──┐
│ header x3      │  │ nav LOGO nav ic│  │░│ title · scope│  │LG │[L|E|U|B]│ic│
├────────────────┤  ├────────────────┤  │░├──────────────┤  ├───┴─────────┴──┤
│ title · chips  │  │ ░░░ banner ░░░ │  │ ├────────┬─────┤  │ (15m)(1h)(3h)  │
├────┬───────────┤  │ (o)(o)(o)(o)   │  │░│LOT GR $│ QV  │  │ 15 MIN         │
│filt│ [][][][]  │  │ tray [][][][]  │  │░│────────│ ░░░ │  ├───────┬────────┤
│ers │ ░░░░░░░░  │  ├───┬───────┬────┤  │░│░ ── ─ ─│ ░░░ │  │ TIME  │ empty  │
│    │ [][][][]  │  │ ░ │ ░░░░░ │ ░░ │  │░│░ ── ─ ─│ --- │  │ [░] B │ state  │
│    │ ░░░░░░░░  │  ├───┤ ░░░░░ ├────┤  │░│░ ── ─ ─│ [B] │  ├───────┴────────┤
├────┴───────────┤  │ ░ │ ░░░░░ │ ░░ │  │ │        │     │  │ 1 HOUR         │
│ < 1 2 3 >      │  ├───┴───────┴────┤  │ │        │     │  ├────┬─────┬─────┤
│                │  │ [ load more ]  │  │ │        │     │  │ tm │ tm  │     │
│                │  │                │  │ │        │     │  │ BID│ BID │     │
│                │  │                │  │ │        │     │  ├────┴─────┴─────┤
│                │  │                │  │ │        │     │  │ TODAY [][][]   │
└────────────────┘  └────────────────┘  └─┴────────┴─────┘  └────────────────┘
```

### Product detail
```text
     OPTION 1            OPTION 2            OPTION 3            OPTION 4
┌────────────────┐  ┌────────────────┐  ┌─┬──────────────┐  ┌───┬─────────┬──┐
│ header x3      │  │ nav LOGO nav ic│  │░│ < 2/4 >      │  │LG │[L|E|U|B]│ic│
├─┬─────┬────┬───┤  ├────┬────┬──────┤  │░│ STRIP $ [Add]│  ├───┴─────┬───┴──┤
│░│ ░░░ │ txt│ BX│  │ ░░ │ ░░ │ ░░░░ │  │ ├────┬────┬────┤  │ TITLE   │ $ [+]│
│░│ ░░░ │ txt│ BX│  ├────┴────┼──────┤  │░│ idx│ ░░ │ kv │  ├─────────┴──────┤
│░│     │ txt│   │  │ TITLE   │ $ [+]│  │░│ idx│    │ kv │  │ ░░░ STAGE ░░░░ │
├─┴─────┴────┴───┤  ├─────────┴──────┤  │ │    ├────┴────┤  │ [][][]         │
│ tabs           │  │   ───────      │  │░│    │ ─────── │  ├────┬─────┬─────┤
│ rails > >      │  │   ───────      │  │░│    │ compare │  │ con│ spec│ dlvy│
│                │  │   ─────  [$+]  │  │ │    │         │  ├────┴─────┴─────┤
│                │  │                │  │ │    │         │  │ |--o--o--o-->  │
│                │  │                │  │ │    │         │  ├────────────────┤
│                │  │                │  │ │    │         │  │ ▒▒ CONSOLE ▒▒▒ │
└────────────────┘  └────────────────┘  └─┴────┴─────────┘  └────────────────┘
```

### Auction detail
```text
     OPTION 1            OPTION 2            OPTION 3            OPTION 4
┌────────────────┐  ┌────────────────┐  ┌─┬──────────────┐  ┌───┬─────────┬──┐
│ header x3      │  │ nav LOGO nav ic│  │░│ < 3/6 >      │  │LG │[L|E|U|B]│ic│
├─┬─────┬────┬───┤  ├───────┬────────┤  │░│ STRIP [1][2] │  ├───┴─────┬───┴──┤
│░│ ░░░ │ txt│BID│  │ ░░░░░ │ ░░░░░░ │  │ ├────┬────┬────┤  │ TITLE   │ 5h40 │
│░│ ░░░ │ txt│BOX│  ├───────┴─┬──────┤  │░│ idx│ ░░ │ kv │  ├─────────┴──────┤
├─┴─────┼────┴───┤  │ TITLE   │ BID  │  │░│ idx│    │ kv │  │ ░░░ STAGE ░░░░ │
│ hist. │ terms  │  │         │[1][2]│  │ │    ├────┴────┤  │ o--|-|*-[#]-o  │
├───────┴────────┤  ├─────────┴──────┤  │░│    │ history │  ├───────┬────────┤
│ similar >      │  │   ───────      │  │░│    │ compare │  │ activ │ facts  │
│                │  │   ─────  [BID] │  │ │    │         │  ├───────┴────────┤
│                │  │                │  │ │    │         │  │ ▒▒ CONSOLE ▒▒▒ │
└────────────────┘  └────────────────┘  └─┴────┴─────────┘  └────────────────┘
```

### Live auction
```text
     OPTION 1            OPTION 2            OPTION 3            OPTION 4
┌────────────────┐  ┌────────────────┐  ┌─┬──────────────┐  ┌───┬─────────┬──┐
│ header x3      │  │ nav LOGO nav ic│  │░│ [ev][ev][ev] │  │LG │[L|E|U|B]│ic│
│ LIVE title     │  ├────────────────┤  │░│ # lot st res │  ├───┼────────┬┴──┤
├──────────┬─────┤  │ ┌──┐░░░░░░░░░░ │  │░│ 1 ── sold    │  │ #4│  NOW ░ │ #6│
│  STAGE ░ │ BID │  │ ░░░ STREAM ░░░ │  │░│ 4 ── sold    │  │ #3│ ░░░░░░ │ #7│
│ cur. lot ├─────┤  │ ▒ [1][2][BID]  │  │ ├─────┬───┬────┤  │ #2│  feed  │ #8│
├──────────┤ feed│  ├────────────────┤  │░│ ░░░ │ 5 │ BID│  │ #1│ lot·bid│ #9│
│ lots tbl │     │  │ [][][][▓][][]  │  │ ├─────┴───┴────┤  ├───┴────────┴───┤
├──────────┴─────┤  ├─────────┬──────┤  │░│ 6 ── next    │  │ ▒▒ CONSOLE ▒▒▒ │
│ more events    │  │ activity│ about│  │░│ [log v]      │  │                │
└────────────────┘  └─────────┴──────┘  └─┴──────────────┘  └────────────────┘
```

### Seller storefront
```text
     OPTION 1            OPTION 2            OPTION 3            OPTION 4
┌────────────────┐  ┌────────────────┐  ┌────┬───────────┐  ┌───┬─────────┬──┐
│ header x3      │  │ nav LOGO nav ic│  │ LG │ profile   │  │LG │[L|E|U|B]│ic│
├────────────────┤  ├────────────────┤  │ nav├───────────┤  ├───┴─────────┴──┤
│ ░░░ COVER ░░░░ │  │ ░░░░░░░░░░░░░░ │  │rail│ [tabs....]│  │ ▒▒ LIVE NOW ▒▒ │
│ [ID CARD]      │  │ ░ COVER+NAME ░ │  │    ├─────┬─────┤  │ identity       │
│ [tabs] sort    │  │ strip [about v]│  │    │ lst │ lst │  ├────────────────┤
├────┬───────────┤  │ (o)(o)(o) tray │  │    │ lst │ lst │  │ |--o---o---->  │
│filt│ [][][][]  │  ├───┬───────┬────┤  │    ├─────┴─────┤  ├────┬─────┬─────┤
│    │ [][][][]  │  │ ░ │ ░░░░░ │ ░░ │  │    │ new [][][]│  │ tm │ $   │ $   │
├────┴──┬────────┤  ├───┤ ░░░░░ ├────┤  │    │ sellers   │  │ BID│ ADD │ ADD │
│ about │ pickup │  │ ░ │ ░░░░░ │ ░░ │  │    │           │  ├────┴─────┴─────┤
│       │        │  │   │       │    │  │    │           │  │ results        │
└───────┴────────┘  └───┴───────┴────┘  └────┴───────────┘  └────────────────┘
```

### Mobile homepages
```text
     OPTION 1            OPTION 2            OPTION 3            OPTION 4
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ [=] LOGO  cart │  │ [=]* LOGO W Q B│  │ LOGO Home Bell │  │ [=]LOGO Q Bids │
├────────────────┤  ├────────────────┤  ├───────┬────────┤  ├────────────────┤
│ [search....]   │  │ ░░░░░░░░░░░░░░ │  │ ct    │ ct     │  │ [Liv][END][Up] │
├────────────────┤  │ ░░░░ FULL ░░░░ │  │ ct    │ ct     │  ├────────────────┤
│ ░░░░ HERO ░░░░ │  │ ░░░ SCREEN ░░░ │  ├───┬───┼───┬────┤  │ * LIVE [Join]  │
├────────────────┤  │ ░░░░ HERO ░░░░ │  │ ░ │ ░ │ ░ │ ░  │  ├────────────────┤
│ ending list    │  │ [search.....]  │  │ ░ │ ░ │ ░ │ ░  │  │ WITHIN 15 MIN  │
│ deal tile      │  ├────────────────┤  ├───┴───┴───┴────┤  │ CLOSES 9 MIN   │
├───────┬────────┤  │ (o)(o)(o)(o) > │  │ ░ row    [+]   │  │ SAR 180        │
│ trust │ trust  │  ├────────────────┤  │ ░ row    [+]   │  ├────────────────┤
├───────┴────────┤  │ ░░░░░░░░░░░░░░ │  │ ░ row  [Bid]   │  │ [░] title      │
│ rail [][] >    │  │ ░░░░ TILE ░░░░ │  │ ░ row  [Bid]   │  │ [ BID 185 ]    │
│ rail [][] >    │  │ ▒ title (+) ▒▒ │  │ sellers list   │  ├────────────────┤
│ ▒▒▒▒ live ▒▒▒▒ │  ├───────┬────────┤  ├───┬────────┬───┤  │ WITHIN 1 HOUR  │
│ grid [][]      │  │ ░░░░░ │ ░░░░░░ │  │[=]│[search]│Ct │  │ ░ row  [Bid]   │
├──┬──┬──┬──┬────┤  ├───────┴────────┤  │   │        │   │  ├────────────────┤
│H │C │L │Ct│Acct│  │     [LIVE mini]│  │   │        │   │  │  (2 win·1 out) │
└──┴──┴──┴──┴────┘  └────────────────┘  └───┴────────┴───┘  └────────────────┘
```

**Answer: yes on every screen type, with qualifications.**

- The homepage, browse and live silhouettes are unmistakably different.
- The product, auction and seller pages share the conventions every
  marketplace needs: a gallery, a price or bid, facts, and an identity block
  on storefronts.
- Section 9 lists every place where a new option remains partially similar to
  Option 1. None is substantially the same.

---

## 8. Structural comparison matrix

The Option 1 column was redrawn from the code after the review.

### Required dimensions

| Dimension | Option 1 — Modern Commerce (reference) | Option 2 — Visual Marketplace | Option 3 — Marketplace Hub | Option 4 — Auction Commerce |
|---|---|---|---|---|
| **Header** | Three tiers: dark utility strip; logo + scoped search + actions; category bar with a photo mega menu | One bar: links either side of a centred logo; labelled search; no utility strip or category bar | App shell: vertical navigation rail + slim top bar | One bar: menu + logo, centred floor switcher (Live · Ending · Upcoming · Buy Now), icons |
| **Search** | Scoped bar in the header centre; its own row on phones, hiding on scroll | In-hero discovery field + full-screen visual search | Home search deck that docks into the rail; "/" shortcut; bottom command bar on phones | Collapsed icon; discovery by time-window chips |
| **Hero** | 8/12 carousel (≥436px) beside two stacked 4/12 tiles (ending soon, top deal) | Full-width centred discovery block framed by product cut-outs (~480px); four tiles straddle its edge | No image hero: search deck + hub counters | Live stage triptych: previous · now · next, centred controls |
| **Category discovery** | Photo mega menu (8 photos, counts, quick links, live card) + one row of 8 equal tiles + round-tile rail on phones | Mosaic of categories and sellers with unequal tile sizes + full-screen Categories overlay + browse photo-chip tray + mobile stories | Always-visible tree with thumbnails, counts and sale-type branches + 4×2 grid | Chips with open auctions, Buy Now count and next close, below the auction content; category filter in a drawer |
| **Homepage structure** | Hero + tiles → trust → categories → auctions rail → live band → deals → pallets → sellers → how it works + grades | Hero → featured now → category/seller mosaic → featured marketplace → on the block → ready to buy → grades → how it works; live as a floating mini-player | Search deck → counters → categories → three list modules → sellers + live → recently added → pallets → buying on Khazna | Stage → ending-soon timeline → active → upcoming → Buy Now → categories → hosts on a time axis → how bidding works |
| **Product cards** | Vertical card (square plated image, text, button footer) + `LotRow` list rows + `CompactLot` rows | Square image tile; information on a solid band inside the image; 2×2 feature tiles | Table row (single line, columns) + module item + compact tile | Stock ticket: stock, price and saving first; small photo row; Add |
| **Auctions** | Rails of vertical cards; ending tile beside the hero; sticky bid box on detail | Wide showcases two per view; time and bid on the tile band; bid module in the purchase band | Ending-soon module; time column in the table; bid ladder in the summary strip | Bid tickets (status, time, current bid first); timeline; time buckets; docked console |
| **Live auctions** | Full-bleed live band on home; stage + 380px side panel; lots table | Floating mini-player on every page; full-width theatre stage, pinned bid band, lot reel | Live line and module; one order-of-sale table whose live row expands in place | Live stage as the home hero; room as a past · now · next triptych + docked console |
| **Browse** | Quick filters (sale type + 3 chips) + sticky facet sidebar + grid 2/3/4 or list view + numbered pages | Category banner + visual filter tray + drawer + tile mosaic + load more | Collapsed rail + scope switch + sortable table with column filters + quick-view pane | Floor switcher + window chips + drawer + time buckets |
| **Product detail** | Three columns from 1280px (vertical thumbnails · gallery · details · sticky box) + tabs + two rails | Filmstrip → purchase band → centred column → floating card | Result navigation → sticky summary strip → index · photo · facts → spec sheet → compare table | Lot header bar → stage → three fact columns → also at auction → console after scroll |
| **Auction detail** | Same frame with a sticky bid box; bid history + terms side by side; manifest; similar rail | Filmstrip → band with the bid module → centred column → floating bid card | Summary strip with the bid ladder → index · photo · facts → bid history table → compare | Lot header bar with countdown → stage → auction timeline → activity + facts → console after scroll |
| **Seller page** | Cover (176–256px) + overlapping identity card + tabs, search, sort + sidebar + grid + About/Pickup columns | Full-bleed cover with the name on a band + profile strip with an About & pickup expander + photo chips + tile mosaic | Rail + compact profile header + tabs (Overview modules · Auctions · Buy Now · About) + table | Status first (live band or next close) + identity line + seller timeline + tickets + results |
| **Mobile navigation** | Menu, logo, Account, Cart; search row; five-tab bottom bar, swapped for action bars on lot pages | No bottom bar: transparent top bar, full-screen menu, floating live mini-player | Bottom command bar (menu · search · cart; Add or Bid on lot pages) | Top bar + sticky floor switcher + floating My bids pill; console on lot pages |

### Further dimensions from the brief

| Dimension | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| **Navigation architecture** | Categories first (mega menu), then sale-type links | Same destinations; categories in a full-screen overlay | Marketplace views with counts, category tree, sellers, My Khazna in a rail | Sale mode and time first (switcher); categories and sellers in the menu |
| **Hero proportions** | 8/12 width × ≥436px | 100% width × ~480px | Main column × ~240px deck | Container width × ~480px |
| **Hero content position** | Start-aligned inside each slide | Centred between cut-out columns | Top-start in the deck | Centred triptych; controls centred under the stream |
| **Section ordering** | Categories → auctions → live → deals → sellers → how it works | Categories (with sellers) → featured → auctions → Buy Now → how it works | Search → counters → categories → deals · ending · popular → sellers · live | Live → ending → active → upcoming → Buy Now → categories → hosts → how bidding works |
| **Product-grid composition** | Uniform grids and rails, 4–5 across | Mosaics with 2×2 features; mirrored 1/2 + 1/4 + 1/4 rows | Table rows; list modules; compact tiles six across | Rows of tickets (3 and 4 across); time buckets on browse |
| **Buy Now presentation** | Top-deal tile in the hero + five-across deals grid | Ready-to-buy mosaic around a 2×2 feature | Deals list module; Buy Now rows in the table | Stock tickets, four across, after Upcoming |
| **Ending Soon presentation** | Thumbnail-row tile beside the hero + auctions rail | On the block showcases, closing soonest first | Ending-soon list module + counter | Timeline with photo pins + window chips + buckets |
| **Live presentation** | Full-bleed band after the auctions rail | Floating mini-player on every page | One line + one module | The home stage + the switcher's Live segment |
| **Seller/store presentation (home)** | Stats band + seller tiles with covers | Two seller tiles inside the category mosaic | Seller directory list module | Sellers as rows on a shared time axis |
| **Trust-information presentation** | Utility-strip ticker + trust strip under the hero + footer | One line under the hero search + grade band + text steps | "Buying on Khazna" link in the rail and a link row | How bidding works + the rules link + console notes |
| **Filter UX** | Sale-type switch + 3 chips + sticky facet sidebar + mobile sheet | Visual tray (photo chips, grade chips, price bands) + drawer | Column-header filters + scope switch + tree; full-screen filter page on phones | Switcher + window chips + drawer |
| **Mobile page composition** | Search row, carousel, stacked tiles, rails, tab bar | Full-screen hero, stories, single-column tile feed | Counters, category grid, dense lists, command bar | Switcher, live strip, ticket carousel, time rows, My bids pill |

---

## 9. Similarity audit (revised after the independent review)

Each new option is compared with the Option 1 code, area by area. Three
verdicts are used:

- **DIFFERENT:** the area's structure differs.
- **PARTIALLY SIMILAR:** a significant structural element or arrangement is
  shared.
- **SUBSTANTIALLY SAME:** the area's main structure is Option 1's.

Conventions every marketplace needs are noted but do not change a verdict:
a sale-type switch, a gallery, a price, a grade line, and an action anchored
at the bottom of mobile lot pages. None of these counts as differentiation:
colour, font, radius, shadow, button colour, accent colour, icon style,
spacing, background tone or badges.

**The brief's rule:** if more than two major areas remain substantially the
same as Option 1, the wireframe is redesigned before presenting.

### Summary

| Option | 11 questions: same / partial / different | 24 dimensions: same / partial / different | Rule |
|---|---|---|---|
| 2 — Visual Marketplace | **0** / 1 / 10 | **0** / 4 / 20 | Passes |
| 3 — Marketplace Hub | **0** / 1 / 10 | **0** / 3 / 21 | Passes |
| 4 — Auction Commerce | **0** / 1 / 10 | **0** / 4 / 20 | Passes |

For comparison, the review's count against revision 1 was:

| Option | Substantially same | Partially similar |
|---|---|---|
| 2 | 0 | 3 |
| 3 | 1 | 5 |
| 4 | 0 | 4 |

### Option 2 — Visual Marketplace vs Option 1 (the 11 questions)

| Question | Verdict | Evidence |
|---|---|---|
| Header | DIFFERENT | One bar with links either side of a centred logo, versus three tiers (`UtilityStrip`, `Header`, `CategoryNav`) |
| Hero | DIFFERENT | Full-width centred discovery block framed by cut-outs, with tiles overlapping its edge, versus an 8/12 carousel beside two stacked tiles |
| Search placement | DIFFERENT | In the hero and a full-screen layer; no header search bar |
| Category discovery | **PARTIALLY SIMILAR** | The unequal mosaic with seller tiles is new. The full-screen overlay (a grid of category photos) and the mobile stories rail echo `MegaMenu` and `CategoryTiles`' round-tile phone rail |
| Homepage composition | DIFFERENT | Overlapping featured tiles, a mosaic, mirrored feature rows, showcases and a tile mosaic; no trust strip, auctions rail, live band, deals grid or seller shelf. The closing grades/how-it-works section is a convention |
| Product cards | DIFFERENT | Square tile with the information on a band inside the image and no footer, versus image + text + button card. Tag and heart placement is a convention |
| Browse | DIFFERENT | Banner, visual tray and drawer, tile mosaic, load more; no sidebar, no numbered pages. The sale-type switch is a convention |
| Product detail | DIFFERENT | Filmstrip → purchase band → centred column → floating card; no three-column layout, tabs or rails |
| Auction detail | DIFFERENT | The same frame with the bid module in the band; no side bid box |
| Live auction | DIFFERENT | Full-width stream with a pinned bid band and a lot reel; no side panel or lots table |
| Mobile UX | DIFFERENT | No tab bar; full-screen menu; single-column tile feed; mini-player. The stories rail is counted under category discovery |

### Option 3 — Marketplace Hub vs Option 1 (the 11 questions)

| Question | Verdict | Evidence |
|---|---|---|
| Header | DIFFERENT | Navigation rail + slim top bar |
| Hero | DIFFERENT | No image hero; search deck + counters |
| Search placement | DIFFERENT | Deck and rail on desktop; bottom command bar on phones (revision 1 kept a top search bar on phones) |
| Category discovery | DIFFERENT | Persistent tree with thumbnails and sale-type branches. The 4×2 grid echoes `CategoryTiles` |
| Homepage composition | DIFFERENT | Dashboard of list modules. The ending-soon module is related to Option 1's ending tile (see the dimensions below) |
| Product cards | **PARTIALLY SIMILAR** | The browse row is now a real table (not `LotRow`), but the home module items are close to Option 1's `CompactLot` rows |
| Browse | DIFFERENT | Sortable table with column filters and a quick-view pane; no chip row, no sidebar. The scope switch, view switch and pager are conventions |
| Product detail | DIFFERENT | Sticky summary strip, in-page index, spec sheet without tabs, compare table; no side purchase box or rails |
| Auction detail | DIFFERENT | Bid ladder in the sticky strip; bid history table; no side bid box |
| Live auction | DIFFERENT | One order-of-sale table whose live row expands with the stream; no stage + side panel. An order-of-sale table also exists in Option 1, as a secondary panel |
| Mobile UX | DIFFERENT | Bottom command bar, full-screen filter page led by the tree; no chip row, no tab bar, no filter sheet |

### Option 4 — Auction Commerce vs Option 1 (the 11 questions)

| Question | Verdict | Evidence |
|---|---|---|
| Header | DIFFERENT | One bar with a centred floor switcher, versus three tiers. The destinations overlap with Option 1's category-bar links |
| Hero | DIFFERENT | Centred triptych stage with the stream. Its height class (~480px vs ≥436px) is recorded under hero proportions |
| Search placement | DIFFERENT | Collapsed icon; time windows lead discovery |
| Category discovery | DIFFERENT | Chips with auction state, low on the page; menu list |
| Homepage composition | **PARTIALLY SIMILAR** | The top half (stage, timeline) is new and hosts are on a time axis. But the middle is rows of tickets, which still reads as rows of cards, and the Buy Now grid and the closing how-it-works section are shared with Option 1 |
| Product cards | DIFFERENT | Data-first ticket with a small photo row, versus an image-top card |
| Browse | DIFFERENT | Switcher tabs, window chips and time buckets; no sidebar, no flat grid by default |
| Product detail | DIFFERENT | Lot header bar, stage with thumbnails under it, three fact columns, console after scroll |
| Auction detail | DIFFERENT | Countdown in the header bar, auction timeline, activity beside the facts, console |
| Live auction | DIFFERENT | Symmetric past · now · next triptych with no side column (revision 1 kept a right-hand activity column) |
| Mobile UX | DIFFERENT | Switcher, live strip, ticket carousel, My bids pill. The bottom console on lot pages is the convention shared by all four options |

### All 24 dimensions of the brief

| # | Dimension | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| 1 | Header structure | DIFFERENT | DIFFERENT | DIFFERENT |
| 2 | Navigation architecture | **PARTIAL** — same destinations as Option 1, categories first | DIFFERENT | DIFFERENT — time and sale mode first; overlapping destinations |
| 3 | Search placement | DIFFERENT | DIFFERENT | DIFFERENT |
| 4 | Category discovery | **PARTIAL** — overlay and stories echo the mega menu and phone rail | DIFFERENT — the 4×2 grid echoes the tile row | DIFFERENT |
| 5 | Homepage composition | DIFFERENT | DIFFERENT | **PARTIAL** — rows of tickets and a Buy Now grid in the middle |
| 6 | Hero structure | DIFFERENT | DIFFERENT | DIFFERENT |
| 7 | Hero proportions | DIFFERENT — full width, not 8/12 | DIFFERENT | **PARTIAL** — same height class (~480px vs ≥436px) |
| 8 | Hero content position | DIFFERENT — centred, not start-aligned | DIFFERENT | DIFFERENT |
| 9 | Section ordering | **PARTIAL** — categories → auctions → Buy Now → how it works, as the brief suggested | DIFFERENT | DIFFERENT — shares only the closing hosts → how-it-works tail |
| 10 | Product-grid composition | DIFFERENT | DIFFERENT | **PARTIAL** — tickets in uniform 3- and 4-across rows on home |
| 11 | Product-card layout | DIFFERENT | **PARTIAL** — module items ≈ `CompactLot` | DIFFERENT |
| 12 | Auction-card layout | DIFFERENT | **PARTIAL** — same module item with time and Bid | DIFFERENT |
| 13 | Buy Now presentation | DIFFERENT | DIFFERENT | **PARTIAL** — a section grid of discounted Buy Now lots with "Shop all" |
| 14 | Ending Soon presentation | DIFFERENT | **PARTIAL** — three thumbnail rows, like Option 1's ending tile, moved into a module | DIFFERENT |
| 15 | Live Auction presentation | DIFFERENT | DIFFERENT | DIFFERENT |
| 16 | Seller/store presentation | DIFFERENT | DIFFERENT | DIFFERENT |
| 17 | Trust-information presentation | DIFFERENT | DIFFERENT | DIFFERENT |
| 18 | Product-detail structure | DIFFERENT | DIFFERENT | DIFFERENT |
| 19 | Auction-detail structure | DIFFERENT | DIFFERENT | DIFFERENT |
| 20 | Live-auction structure | DIFFERENT | DIFFERENT — shares an order-of-sale table | DIFFERENT |
| 21 | Seller-storefront structure | **PARTIAL** — cover → identity → listings, as in Option 1 | DIFFERENT — Option 1 also has sale-type tabs | DIFFERENT |
| 22 | Filter UX | DIFFERENT | DIFFERENT | DIFFERENT |
| 23 | Mobile navigation | DIFFERENT | DIFFERENT | DIFFERENT |
| 24 | Mobile page composition | DIFFERENT | DIFFERENT | DIFFERENT |
| | **Totals (same / partial / different)** | **0 / 4 / 20** | **0 / 3 / 21** | **0 / 4 / 20** |

The partial similarities above are deliberate trade-offs. Changing them further
would cost usability or break the brief's suggested section order. They are
listed so the client can judge them.

### New options against each other

| Pair | Overlap found in revision 1 | Status in revision 2 |
|---|---|---|
| 2, 3, 4 | All three browse pages had a row of dropdown filters above the results | Resolved: visual tray (2), column-header filters (3), window chips + drawer (4). Options 2 and 4 both keep a chip row above the results (minor) |
| 2 vs 3 | Same mobile navigation model (menu, full-screen menu, cart at the top) | Resolved: Option 3 uses a bottom command bar |
| 3 vs 4 | Both had a sticky chip row under the mobile top bar | Resolved: Option 3 dropped its chip row |
| 2 vs 4 | Both used vertical image-top cards in 3–4-across grids | Resolved: square tiles with an in-image band (2) vs data-first tickets (4). Both still arrange cards in grids |
| 3 vs 4 | Both opened the storefront with a compact profile block and no cover | Partly resolved: Option 4 leads with live or next-close status and its own timeline (minor) |
| 3 vs 4 | Option 4's Buy Now rows were Option 3's row card | Resolved: Option 4 uses stock tickets |
| 2 vs 4 | Both centre content at the top of the home page, and both have a stream-led live stage | Minor: a cut-out field with a search block vs a stage triptych; a full-width theatre vs a past · now · next room |
| 2 vs 4 | Both float an element on phones | Minor: live mini-player (2) vs My bids pill (4) |
| All four | Bottom-anchored action on mobile lot pages | Platform convention, shared with Option 1 |

### Independent review

A separate reviewer with read-only access audited revision 1. It checked the
plan against three sources:

- the Option 1 code (`components/concept-b`);
- the shared sample data (`data/`);
- the production reference.

The reviewer confirmed that no option broke the brief's rule (more than two
areas substantially the same). It also found that revision 1 overstated how
different the options were. Every finding was checked against the code before
this revision was made:

| # | Review finding | Change in revision 2 |
|---|---|---|
| 1 | The Option 1 reference understated Option 1: it has a photo mega menu (not a text menu), a hero at least 436px tall, three card formats, vertical desktop thumbnails, an auction page without tabs, a live page with the lots table in the main column, storefront tabs, seller tiles with covers, and Account + Cart in the mobile header | Section 3 and the matrix's Option 1 column were redrawn from the code |
| 2 | "0 of 11" overclaimed. The review counted: Option 2 0 same, 3 partial; Option 3 1 same, 5 partial; Option 4 0 same, 4 partial | Replaced by the verdict tables above, covering the 11 questions and all 24 dimensions |
| 3 | The cards in Options 2 and 4 were still vertical image-top cards, the kind of change the client rejected in Round 2 | Option 2 uses square tiles with the information on a band inside the image, plus 2×2 feature tiles. Option 4 uses data-first bid and stock tickets |
| 4 | Option 3's row card was Option 1's list-view `LotRow`, and its browse page kept Option 1's quick-filter chips and mobile filter sheet | Option 3 now has a real sortable table with filters in the column headers and a quick view. The chip row was removed, and a full-screen filter page led by the category tree replaces the sheet |
| 5 | Option 2's "Shop ▾" photo panel had the same structure as `MegaMenu`; there was no Buy Now link, no language switch and no label on search | Categories opens a full-screen overlay. A Buy Now link, a labelled Search and the language switch were added |
| 6 | Option 2's photo-led idea was not supported by the images. There are 128 photos, mostly square studio shots, and the only hero-width photo is Option 1's pallet slide | The hero is now a cut-out composition, with lifestyle photos used where they exist. Section 11 has the image-source table and the corrected counts |
| 7 | No auction-detail page showed delivery or pickup | Delivery and pickup were added to all three auction pages |
| 8 | Navigation gaps: Option 4 had no mobile cart or menu, no desktop language switch and no rules link; Option 2 had no language switch; the bell and country switcher (G19) were not placed | All added. Each option's header now places the bell and the country switcher |
| 9 | Live video was not placed, and Option 3 had no stream | Every live page now shows where the stream goes, with the lot photo inset |
| 10 | "LIVE" and `*` appeared on timed lots, and the live stepper implied automatic selling | Timed lots say "Open for bids"; LIVE marks live events only. The live status is described as set by the auctioneer |
| 11 | The confirm step for binding bids was never mentioned | Added as ground rule 7, and to every bid control |
| 12 | Option 4's two-row header and its live room (stage plus a right-hand activity column) stayed close to Option 1 | Option 4 now has one bar with a floor switcher, a past · now · next live room with no side column, and hosts on a time axis instead of seller cards |
| 13 | The wireframes did not match the sample data: Red Sea's counts, the time buckets (1/2/4/2), event names, the 7-grade scale, gallery counts and bidder states | Every wireframe was redrawn from the data. The default product has 5 photos and the default auction has 3; Rawabi Home Outlet has 4 auctions and 4 Buy Now; the live lot stands at SAR 1,850 |
| 14 | Overlaps between the new options (browse filter rows, mobile navigation, chip rows, image-top cards, storefront headers, Buy Now rows) | See "New options against each other" above |
| 15 | Section 11 classified several items as F that should be B or API: G16 for counters, time windows and new sorts; G26/G8 for the bid ladder; G3 for seller lists in all three options; G12 for presenter names; REST polling for live bands | Reclassified in section 11 |

After revision 2, no area of any option is substantially the same as
Option 1:

| Option | Partial similarities (of the 24 dimensions) |
|---|---|
| 2 | 4 |
| 3 | 3 |
| 4 | 4 |

Each partial similarity is listed above with its reason.

---

## 10. Functional coverage — nothing removed

| Feature | Option 2 — Visual Marketplace | Option 3 — Marketplace Hub | Option 4 — Auction Commerce |
|---|---|---|---|
| Buy Now | Square tiles, Ready to buy mosaic, purchase band + floating card, bag drawer | Deals module, table rows, summary strip with quantity, Add and Buy now | Stock tickets, Buy Now floor, lot header bar + docked purchase console |
| Timed auctions | On the block showcases, auction tiles, bid module in the band, floating bid card | Ending-soon module, table time column, bid ladder in the summary strip | Timeline, bid tickets, time buckets, bidding console |
| Live auctions | Floating mini-player on every page, Live link, theatre page with a pinned bid band | Live line, Live & upcoming module, Live now in the rail, schedule table with the live row expanded | Live segment in the switcher, live stage on home, past · now · next room |
| Search | In-hero field + full-screen visual search | Home deck + rail search + suggestion panel; command bar on phones | Expanding search + window chips |
| Categories | Mosaic, Categories overlay, browse tray, mobile stories | Category tree, category grid, mobile filter page | Categories on the floor, More filters, menu |
| Filters | Visual tray + All filters drawer | Column-header filters, scope switch, tree; full-screen filter page on phones | Floor switcher + window chips + More filters drawer |
| Sellers | Seller tiles in the mosaic, boutique storefront | Seller module, rail list, profile with tabs, sellers table | Hosts on a shared time axis, status-led storefront |
| Cart | Bag in the bar → bag drawer | Cart in the top bar (command bar on phones) → cart drawer | Cart in the bar → drawer |
| Watchlist | Heart on tiles; Watchlist in the bar (with a count on phones) | Watch in the quick view and summary strip; Watchlist & bids in My Khazna | Heart on tickets; My bids & watching drawer |
| Customer account | Account in the bar (bell badge) | My Khazna in the rail + account in the top bar | Account in the bar; My bids links to the account's bids tab |
| Timed bidding (quick bids, custom amount, maximum bid, deposit, Buy Now on "both" lots, 5-minute extension) | Bid module in the band, floating bid card, mobile bid sheet | Bid ladder in the strip, Bid in the quick view and table, mobile ladder sheet | Bid tickets, docked console, mobile console sheet |
| Confirm step (timed bids) | On every bid control | On every rung and Bid button | On every amount button |
| Live bidding | One tap, binding once placed; deposit checked; status set by the auctioneer | Same | Same |
| Condition grading | Grade on feature tiles and lot pages; 7-grade band on home; grade chips in the tray | GR column, grade filter, condition report | Grade on tickets, lot facts, grades in How bidding works |
| Delivery / pickup | Purchase band (product and auction), centred section, seller's About & pickup | Summary strip line (product and auction), key facts, spec-sheet section | Header bar and console lines, facts column or tab, auction timeline (arranged after payment) |
| Lot states (upcoming, sold, sold out) | On tiles | In table rows | On tickets |
| Language switch (EN/AR) | In the bar | In the rail ("Country & language") | In the bar |
| Notification bell and country switcher (G19) | Bell badge on Account; country in the menu overlay and footer | Bell in the top bar; country in the rail | Bell badge on Account; country in the menu and footer |

All three use the same behaviour layer as Option 1:

- `useBrowse` for search, filters, sorting and paging;
- `useAuction` for bids, maximum bids, deposits, extensions and Buy Now on
  "both" lots;
- `useLiveEvent` for the live lifecycle.

They also use the same preview store for the cart and watchlist.

---

## 11. Data, feasibility and decisions

**Same data everywhere.** All three options read the shared sample data,
unchanged:

- **Lots:** 29 in total — 18 Buy Now, 10 timed auctions and 1 auction with
  Buy Now. Of the 11 auctions, 9 are open for bids, 1 is scheduled and 1 is
  sold.
- **Categories, sellers and events:** 8 categories, 5 sellers, and 1 live
  event with 10 lots plus 2 upcoming events.
- **Images:**
  - **128 catalogue photos**: 96 studio shots on white and 32 lifestyle
    shots;
  - **39 cut-outs**: 27 of the 29 lots have a cut-out of their main shot;
  - 2 brand photos: the warehouse-floor photo, which is Option 1's pallet
    slide, and the Riyadh warehouse photo, which is the Khazna Direct cover.

  Revision 1 said "410 photos"; that figure counted image files, including
  responsive sizes.

No product, seller, price or image is added or changed.

### Option 2 image sources (existing assets only)

| Surface | Source | Treatment |
|---|---|---|
| Home hero | Cut-outs of 6–8 lots across categories | Arranged in two clusters on a neutral field; the centre stays clear for text. It does not use the warehouse-floor photo, which is Option 1's pallet slide |
| Featured now, feature tiles, showcases | Lot photos | A lifestyle photo when the lot has one (16 of 29 lots); otherwise the cut-out on a neutral plate |
| Category mosaic (8 tiles) | Category images are studio shots on white | Cut-out compositions on neutral tones. Lifestyle photos where the category has them (Electronics and Fashion have none) |
| Seller tiles, storefront cover | Seller covers in the data (e.g. Rawabi: swivel chair; Red Sea: headphones; Khazna Direct: the Riyadh warehouse) | The name sits on a solid band |
| Stories rail, browse chips | Category images | Round crops of the cut-out |
| Browse banner | Category cut-outs | A composition, as in the hero |
| How Khazna works | No photos | Text steps with icons |
| Live mini-player and theatre | The live stream + the lot photo | The stream, with the lot photo inset |

**In production**, lot images are seller uploads with mixed backgrounds. The
cut-out treatment needs either an image pipeline or curated assets, which is a
business or API decision. Until then, the fallback is the photo on a neutral
plate, as Option 1 shows it.

### New components and where their data comes from

The P/F/B/API/LEGAL codes and the row numbers (G2, G3, …) come from
`CUSTOMER_REDESIGN_FILE_MAP.md`, section G:

- **P:** presentation only;
- **F:** a frontend decision made during implementation;
- **B:** a business decision;
- **API:** needs backend work;
- **LEGAL:** needs wording approval.

| Component | Option | Source | Class |
|---|---|---|---|
| Featured now, Featured marketplace | 2 | Production's moderated Featured placements | F (G18: keep Featured) |
| Full-screen visual search with lot thumbnails | 2 | `sale-lots/?search=` | B (G26, additive) |
| Categories overlay, mosaic, stories, tray | 2 | Category images + cut-out treatment | F; cut-outs in production B/API |
| Seller tiles in the mosaic; cover storefront | 2 | Seller cover and tagline are not production fields; there is no seller list | API (G2, G3) |
| Floating live mini-player | 2 | Public live-event REST, polled | F |
| Sold tiles and results (ended lots) | 2, 3, 4 | Ended lots return 404 in production | B (G5) |
| Upcoming lot states | 2, 3, 4 | Scheduled lots are public and watchable | F (G6) |
| Rail counts and sale-type branches | 3 | List endpoint counts per query | F |
| Hub counters (ending < 1 h, deals, new today), Popular now | 3 | Filters and sorts production does not offer | B (G16) |
| Sortable table: new sorts (grade, seller) and column filters | 3 | Production sorts: ending, price | B (G16) for new sorts; F for the table |
| SELLER · CITY column | 3 | City via the seller lookup, or a serializer change | F / API (G4) |
| Quick-view pane, comparison tables | 3 | Existing lot data | B (G26, additive) |
| Previous / next lot | 3 | Current result set; category fallback | F |
| Bid ladder and quick bids | 2, 3, 4 | Minimum next bid + increment | B (G26); first-bid rule F (G8) |
| Seller directory module and table | 3 | No seller-list endpoint | API (G3) |
| Presenter names, event start times | 2, 3, 4 | Not event fields in production | API (G12) |
| "Remind me" on upcoming live events | 3, 4 | No reminder backend | API (G29), concept idea |
| Floor switcher counts | 4 | Live REST + list counts; the "Ending 9m" segment needs the next close | F; window counts B (G16) |
| Window chips and time buckets | 4 | "Ending within" windows are not a production filter | B (G16) |
| Ending-soon, seller and host timelines | 4 | Lot end times; the host rows need the seller list | F; B (G16) for windows; API (G3) for host rows |
| Auction timeline on the lot page | 4 | Start and end times, bid history, the server-side extension (G7), the payment-window policy | F; payment wording LEGAL (G21) |
| My bids drawer and pill | 4 | The account watchlist tab (alias `bids`); the preview keeps simulated bids inside Option 4's own layer | F |
| Docked bidding console | 4 | The same bid flows as today; Buy Now on "both" lots through the cart | F (G28) |
| Live stage on home, Live segment | 4 | Public live-event REST, polled | F |

**Wording** follows the Phase 1B claims audit (ground rule 7). No option
relies on a cross-lot bid-activity feed (G30): activity is limited to the
live room's recent bids and the bid history of the lot on screen.

**Live data transport:** these elements poll the public live-event REST
endpoint:

- the live mini-player (Option 2);
- the live line and module (Option 3);
- the switcher's Live segment and the home stage (Option 4).

Production's live socket needs a fresh ticket for every connection by a
signed-in user, so it is used only inside the live room.

---

## 12. Implementation approach after approval (not started)

1. **Preserve Round 2.** Tag the current Round 2 versions of `concept-a`,
   `concept-c` and `concept-d` (e.g. `round2-concepts`) before replacing them.
   Round 1 remains preserved at `round1-concepts`.
2. **Build each option as a new component tree** in its slot, from a blank
   structure. Nothing is copied from Option 1.
3. **Guardrails, checked automatically on every commit:**
   - no imports from `concept-b` into `concept-a`, `concept-c` or `concept-d`;
   - no files duplicated from `concept-b`;
   - an empty diff for `components/concept-b/` and `styles/concept-b.css`.
4. **Build order for each option:**
   1. shell and navigation;
   2. cards and their states;
   3. home;
   4. browse;
   5. product;
   6. auction;
   7. live;
   8. seller;
   9. Components & states board;
   10. mobile pass;
   11. Arabic/RTL pass;
   12. dark appearance.
5. **QA:**
   - **The existing suite:** English/Arabic, light/dark,
     1440/1024/768/390px, axe, overflow, interaction flows, keyboard focus and
     special states.
   - **Plus a new grayscale structural review:** automated screenshots of
     every screen of all four options, rendered in grayscale and placed side
     by side for desktop and mobile. These are section 7's contact sheets,
     rebuilt from the real screens. They are the acceptance check for "four
     different structures".
6. **Client preview:** the selector's names and descriptions change only
   after implementation and QA pass.

---

## 13. Decisions requested

1. **Approve the three structures**, or mark changes per option.
2. **Option 2:** is the centred discovery hero framed by product cut-outs OK?
   And the floating live mini-player instead of a live section?
3. **Option 3:** is a persistent navigation rail on every page OK? And the
   bottom command bar on phones?
4. **Option 4:** is the docked bidding console OK on desktop as well as
   mobile? It appears only after the lot header bar scrolls away.
5. **Option 4:** should Buy Now stay after Upcoming, as in the brief's order?
   Or move up to straight after the timeline, as the review suggested?
6. **Options 2 and 3:** is no bottom tab bar on phones OK?
7. **Client-facing names:** confirm Visual Marketplace, Marketplace Hub and
   Auction Commerce.
8. **Concept ideas:** some ideas need backend or business decisions (section
   11). May they appear in the preview as design ideas, labelled as in
   earlier rounds?
