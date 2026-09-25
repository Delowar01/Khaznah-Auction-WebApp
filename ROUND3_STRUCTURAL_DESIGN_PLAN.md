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

A second independent review then checked this revision's first draft. It
found data slips, three wording issues and verdicts that were still too
generous. Its corrections are included, and section 9 summarises both
reviews.

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
| `!` | Notification badge (for example, when you are outbid) |

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
│ ░░ slides: brand (cut-outs) · live · pallets ░░░ │ ░ lot  SAR 1,480 18m    │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░ lot  SAR 540   46m    │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ├─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ BUY NOW DEAL            │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░ -33%  SAR 175 [Add]  │
├──────────────────────────────────────────────────┴─────────────────────────┤
│ TRUST STRIP   condition graded | deposit | secure payment | delivery       │
├────────────────────────────────────────────────────────────────────────────┤
│ CATEGORY TILES   [░][░][░][░][░][░][░][░]   all 8 in one row               │
│ AUCTIONS RAIL    [card][card][card][card][card] >   ending | most bid      │
├────────────────────────────────────────────────────────────────────────────┤
│ ▒▒▒▒▒▒▒▒▒▒ LIVE BAND:  stream | now bidding + coming up | Join ▒▒▒▒▒▒▒▒▒▒▒ │
├────────────────────────────────────────────────────────────────────────────┤
│ BUY NOW DEALS    [card][card][card][card][card]   5 across                 │
│ PALLETS & BULK   [wide manifest card][wide manifest card][small lots]      │
│ SELLERS          stats band + seller tiles (cover · monogram · counts)     │
│ HOW IT WORKS (4 steps)  |  CONDITION GRADES                                │
│ FOOTER (with a newsletter band)                                            │
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
  - It has three slides:
    - a brand slide, with start-aligned copy beside fridge and TV cut-outs;
    - a live slide, with the stream, the current lot and Join;
    - a pallet slide, using the warehouse-floor photo.
  - The first tile, "Ending in under an hour", holds three thumbnail rows.
  - The second tile shows the biggest Buy Now saving.
- **Below the hero, in order:**
  - a trust strip (condition graded, deposit, secure payment, delivery);
  - 8 equal category tiles in one row, which become a swipeable rail of 112px
    square photo cards on phones;
  - an auctions rail (ending soonest or most bids);
  - a full-bleed dark live band (stream, now bidding, coming up, Join — no bid
    button);
  - a five-across deals grid;
  - wide pallet cards with manifest thumbnails;
  - a stats band with seller tiles (80px cover, monogram, city, counts);
  - "How it works" beside the condition grades;
  - a footer with a newsletter band.
- **Four card formats:**
  - the vertical `AuctionCard` / `BuyNowCard`;
  - the list-view `LotRow` (88–128px thumbnail, seller, title, grade and type,
    price, bids and countdown, then watch and Bid or Add);
  - `CompactLot` thumbnail rows;
  - `MiniCard`, a horizontal card with a 104px photo (in the bulk section).

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
│                      │  8 per page; numbered pages beyond one page         │
└──────────────────────┴─────────────────────────────────────────────────────┘
```

- A sale-type switch with counts (All | Auctions | Buy Now) and three chips:
  Ending < 1h, Discounted, Grade A.
- A sticky 240px facet sidebar.
- A grid 2, 3 or 4 across (3 at 1024–1279px), or the `LotRow` list view.
- 8 lots per page, with numbered pages once there is more than one page.
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
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ [ Bid SAR 1,875 ]       │
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
- A five-tab bottom bar: Home · Categories · Live · Cart · Account. The
  Categories tab opens a sheet of the 8 categories as photo cards.
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
shows **19 different lots, none repeated, with no carousel**:

| Section | Lots |
|---|---|
| Featured now | 4 |
| Featured marketplace | 6 |
| On the block | 4 |
| Ready to buy | 5 |

"See all 9 auctions" and "Shop all 18" lead on from the home page.

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
│ ░░░░░░░░░░░░░░Popular: Refrigerator · Pallet · Coffee maker ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░   (░)Appliances (░)Kitchen (░)Furniture  >   ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░  Graded lots · delivery priced at checkout   ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░    Shop Buy Now ->    Browse auctions ->     ░░░░░░░░░░░░░░ │
│ ░░░┌─────────────┐░░┌─────────────┐░░┌─────────────┐░░┌─────────────┐░░░░░ │
│ ░░░│░░░░░░░░░░░░░│░░│░░░░░░░░░░░░░│░░│░░░░░░░░░░░░░│░░│░░░░░░░░░░░░░│░░░░░ │
├────────────────────────────────────────────────────────────────────────────┤
│    │░░░░░░░░░░░░░│  │░░░░░░░░░░░░░│  │░░░░░░░░░░░░░│  │░░░░░░░░░░░░░│      │
│    │▒ Lot title ▒│  │▒ Lot title ▒│  │▒ Lot title ▒│  │▒ Lot title ▒│      │
│    │▒SAR 149 (+)▒│  │▒890 · 1d 3h▒│  │▒SAR 159 (+)▒│  │▒620 · 2d 4h▒│   >  │
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
│ ▒ SAR 189 (+) ▒▒ │ ▒ SAR 249 (+) ▒▒ │ ▒ Lot title · SAR 399 (+) ▒▒▒▒▒▒▒▒▒▒ │
├──────────────────┴──────────────────┴──────────────────────────────────────┤
│ ON THE BLOCK   four wide showcases, soonest first    See all 9 auctions -> │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░  OPEN FOR BIDS     │ ░░░░░░░░░░░░░░░░  OPEN FOR BIDS      │
│ ░░░░░░░░░░░░░░░░  Closes in 9 min   │ ░░░░░░░░░░░░░░░░  Closes in 18 min   │
│ ░░░░░░░░░░░░░░░░  SAR 180 · 11 bids │ ░░░░░░░░░░░░░░░░  SAR 1,480 · 31 bids│
│ ░░░░░░░░░░░░░░░░  Grade A · Seller  │ ░░░░░░░░░░░░░░░░  Grade A · Seller   │
│ ░░░░░░░░░░░░░░░░  [ Place bid ]     │ ░░░░░░░░░░░░░░░░  [ Place bid ]      │
├─────────────────────────────────────┼──────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░  OPEN FOR BIDS     │ ░░░░░░░░░░░░░░░░  OPEN FOR BIDS      │
│ ░░░░░░░░░░░░░░░░  Closes in 46 min  │ ░░░░░░░░░░░░░░░░  Closes in 2h 14m   │
│ ░░░░░░░░░░░░░░░░  SAR 540 · 9 bids  │ ░░░░░░░░░░░░░░░░  SAR 1,240 · 18 bids│
│ ░░░░░░░░░░░░░░░░  Grade C · Seller  │ ░░░░░░░░░░░░░░░░  Grade B · Seller   │
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
   - Option 1's brand slide also uses cut-outs (a fridge and a TV beside
     start-aligned copy). The difference here is structural: one full-width
     block rather than a carousel with side tiles; centred search; cut-outs on
     both sides; tiles overlapping its edge.
3. **Featured now**: four square tiles that overlap the hero's lower edge by
   about 96px (in the preview: the coffee maker, the swivel chair, the floor
   lamp and the laptop-bag carton). In production they would show the
   moderated Featured placements (known-gap row G18 in
   `CUSTOMER_REDESIGN_FILE_MAP.md`, section G).
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
6. **On the block**: a static block of four wide auction showcases in two
   rows, closing soonest first, with "See all 9 auctions". It is not a
   scrolling rail.
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
  - The country switcher (G19) is in the Account menu and the footer on
    desktop, and in the full-screen menu on phones.
- There is no utility strip, no category bar and no header search field.
- **vs Option 1:** one bar instead of three tiers. Categories open a
  full-screen overlay instead of a dropdown mega menu, and search leaves the
  header. The top-level destinations (categories, Buy Now, Auctions, Live,
  Sellers) are the same as Option 1's; section 9 records this as partially
  similar.

### E. Search structure

- **Home:** the labelled discovery field in the hero. Below it are popular
  searches from the shared list (Air conditioner, Pallet, Leather chair,
  Refrigerator, Coffee maker) and category photo chips.
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
  8 equal tiles. But the overlay and the stories rail still echo three Option 1
  pieces: the photo mega menu, the mobile category sheet of 8 photo cards, and
  the phone rail of square photo cards. Section 9 records category discovery
  as partially similar.

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
- **States:**
  - Upcoming, "Opens in 30h" (`leather-sofa`), drawn in the browse wireframe;
  - Sold out (`tyre-inflator`), with no add button;
  - Sold, "Sold SAR 610" (`robot-vacuum`).

  Sold-out and sold tiles sort to the end of every list.
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
│ Price: [ <100 ] [ 100-500 ] [ 500-1,000 ] [ 1,000+ ]      Sort: Newest v   │
│   (a visual filter tray; All filters opens a drawer from the end side)     │
├──────────────────┬─────────────────────────────────────┬───────────────────┤
│ -27% ░░░░░░░░(W) │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ Upcoming ░░░░░(W) │
│ ░░░░░░░░░░░░░░░░ │  FEATURE TILE 2x2 (every 8 tiles) ░ │ ░░░░░░░░░░░░░░░░░ │
│ ▒ Lot title ▒▒▒▒ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ▒ Lot title ▒▒▒▒▒ │
│ ▒ SAR 329 (+) ▒▒ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ▒ OPENS IN 30H ▒▒ │
├──────────────────┤ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ├───────────────────┤
│ Auction ░░░░░(W) │ ▒ Lot title · Grade A · Seller ▒▒▒▒ │ -30% ░░░░░░░░░(W) │
│ ▒ 620 · 2d 4h ▒▒ │ ▒ SAR 139          [ Add to bag ] ▒ │ ▒ SAR 119 (+) ▒▒▒ │
├──────────────────┼──────────────────┬──────────────────┼───────────────────┤
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │
│ ▒ Lot title ▒▒▒▒ │ ▒ Lot title ▒▒▒▒ │ ▒ Lot title ▒▒▒▒ │ ▒ Lot title ▒▒▒▒▒ │
│ ▒ SAR 149 (+) ▒▒ │ ▒ SAR 2,900 (+)  │ ▒ SAR 175 (+) ▒▒ │ ▒ 890 · 1d 3h ▒▒▒ │
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
  The wireframe shows the first page of "All lots" sorted by Newest, in the
  order the shared browse logic returns it.
- **Paging:** "Load more" (12 at a time) with a progress line; no numbered
  pages.

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
│ ▒ SAR 229 (+) ▒▒ │ ▒ SAR 399 (+) ▒▒ │ ▒ SAR 149 (+) ▒▒ │ ▒ SAR 119 (+) ▒▒▒ │
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
│ ▒ You: not bidding   [1,900] [1,950]   [ Bid SAR 1,875 ]   (pinned) ▒▒▒▒▒▒ │
├────────────────────────────────────────────────────────────────────────────┤
│ LOT REEL   all 10 lots in order of sale                               <  > │
│ [░░░]  [░░░]  [░░░]  [░░░]  [▓▓▓]  [░░░]  [░░░]  [░░░]  [░░░]  [░░░]       │
│ #1     #2     #3     #4     #5     #6     #7     #8     #9     #10         │
│ sold   sold   unsold sold   NOW    next                                    │
├─────────────────────────────────────────────┬──────────────────────────────┤
│ ACTIVITY                                    │ ABOUT THIS EVENT             │
│ Bidder K27   SAR 1,850   just now           │ Status set by the auctioneer │
│ Bidder A09   SAR 1,825   11s                │ Bids are binding once placed │
│ Bidder M55   SAR 1,800   18s                │ SAR 200 bidding deposit,     │
│                                             │   covered by your wallet     │
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
  bid, then your status, two more quick bids (SAR 1,900 and 1,950) and the
  "Bid SAR 1,875" button. When the stage scrolls away, this band **pins to the
  bottom of the screen**.
- **Lot reel:** all 10 lots, each marked Sold, Unsold, NOW or next.
- **Below the reel:**
  - Activity: the last bids, from the preview's live feed (K27, A09, M55).
  - About: status set by the auctioneer, bids binding once placed, a SAR 200
    bidding deposit covered by your wallet.
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
│ [=]!          LOGO  (W)2 (Q) Bag │
│  (transparent over the hero; the │
│   menu badge ! shows when outbid)│
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

- **Top bar:** transparent over the hero. It holds the menu (with a `!` badge
  when you are outbid), the logo, the watchlist heart with a count, search and
  the bag.
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
│ KHAZNA               │ Home                             Bell   Cart   Acct │
│  marketplace         ├─────────────────────────────────────────────────────┤
│ (search docks here   │ * LIVE  Tuesday Evening Live · lot 5/10  [Join]     │
│  on scroll)          ├─────────────────────────────────────────────────────┤
│ Home                 │ FIND ANYTHING ON KHAZNA                             │
│ All lots         29  │ [All] [Auctions] [Buy Now] [Sellers] [Live]         │
│ Auctions         11  │ [ Search lots, brands, sellers...    ] [Search]     │
│ Buy Now          18  │ Popular: Air conditioner · Pallet · Leather chair   │
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
│ > [░] Fashion     4  │                 │ [15m | 1h | 24h]│                 │
│ > [░] Tools & DIY 3  │ OFF  LOT     SAR│ LEFT LOT     BID│ BIDS LOT     BID│
│ > [░] Automotive  3  ├─────────────────┼─────────────────┼─────────────────┤
│ > [░] Electronics 1  │ -33% Lot     175│ 9m   Lot     180│ 42   Lot   7,850│
│ > [░] Pallets     4  │ -33% Lot     349│ 18m  Lot   1,480│ 31   Lot   1,480│
│ SELLERS              │ -31% Lot     219│ 46m  Lot     540│ 23   Lot   3,150│
│  * Red Sea Trading   │ -30% Lot     119│ 2h14 Lot   1,240│ 18   Lot   1,240│
│  Rawabi Home Outlet  │ View all 14 ->  │ View all 9 ->   │ View all ->     │
│                      ├─────────────────┴────────┬────────┴─────────────────┤
│  + 3 more sellers    │ SELLERS                  │ LIVE & UPCOMING          │
│ MY KHAZNA            │ (RS) Red Sea     * LIVE  │ * LIVE Tuesday Evening   │
│  Watchlist & bids    │   Jeddah · 1 auction     │   lot 5/10 · 1,284 [Join]│
│  Orders · Wallet     │ (RH) Rawabi Home Outlet  │ Pallet Hour · in 20 h    │
│  Account             │   Riyadh · 4 auctions    │   12 lots   [ Remind me ]│
│ Buying on Khazna >   │ (DM) Dar Al Majd ...     │ Thursday Furniture · 2 d │
│ Country & language   │ All 5 sellers ->         │   24 lots   [ Remind me ]│
│                      ├──────────────────────────┴──────────────────────────┤
│                      │ RECENTLY ADDED   compact tiles, 6 across            │
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
6. **Three mini-tables in a row**, each with a header row and four
   single-line rows. A row opens the quick view, which holds Bid or Add.
   - Deals · Buy Now: discount | lot | price, largest discount first
     (−33%, −33%, −31%, −30%).
   - Ending soon: time left | lot | bid, with a window switch
     (15m | 1h | 24h). Rows close in 9m, 18m, 46m and 2h 14m.
   - Popular now: bids | lot | bid, by most bids (42, 31, 23, 18).
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
- **vs Option 1:** a persistent tree with sale-type branches. The 4×2 grid,
  which the brief's suggested order asks for, echoes Option 1's category
  tiles; section 9 records category discovery as partially similar.

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

**Mini-table row** (home modules and the seller overview): one key figure
(discount, time left or bid count), then the lot and its price or bid, under a
header row. The row opens the quick view.

**Compact tile** (Recently added, New from this seller, and the browse Tiles
view): a 1:1 image, the title, and the price or bid.

**States:**

- Upcoming: opens in 30h 15m, with a Watch action.
- Sold: SAR 610, no action.
- Sold out: no Add.

**vs Option 1:** the table row is a table, not Option 1's bordered `LotRow`
card, and the mini-tables replace revision 1's thumbnail list items. The
compact tile is still a small image-top card, like Option 1's vertical card;
section 9 records this as partially similar.

### H. Browse-page wireframe
```text
┌──────┬─────────────────────────────────────────────────────────────────────┐
│ [░]A │ Browse > Home Appliances                         Bell   Cart   Acct │
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
│ [░]T │ Buy now 4,600 · Delivery priced at checkout · Pickup where offered  │
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
│      │                 │ BID HISTORY   BIDDER  AMOUNT     TIME  TYPE       │
│      │                 │               K27     SAR 3,150  34s   normal     │
│      │                 │               2048    SAR 3,050  12m   maximum    │
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
  - a second line: Buy now SAR 4,600 · Delivery priced at checkout · Pickup
    where offered.
- **A three-part band:**
  - the index;
  - the photo, with 3 thumbnails;
  - key facts: deposit covered, timed with a late bid adding 5 minutes, Buy
    Now, delivery, pickup, grade.
- **Below the band:**
  - bid history as a data table (bidder, amount, time, type), from the
    preview's seeded history: K27 SAR 3,150, then 2048 SAR 3,050 (a maximum
    bid), and so on;
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
│      │ ░ LIVE STREAM ░░ │ Grade A         │ SAR 1,850      │ K27 1,850 now │
│      │ [lot photo]░░░░░ │ 16 bids         │ [Bid 1,875]    │ A09 1,825 11s │
│      │ ░░░░░░░░░░░░░░░░ │ status set by   │ [1,900]        │ M55 1,800 18s │
│      │                  │ the auctioneer  │ you: no bids   │               │
│      ├──────────────────┴─────────────────┴────────────────┴───────────────┤
│      │   ^ the live row expands in place inside the order of sale          │
│      │ 6   Dining chairs    SAR 400    -               -   Next            │
│      │ 7-10 ...                                            Coming up       │
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
  - the last bids (K27, A09, M55 in the preview's feed).
- Lots 7–10 read "Coming up".
- The activity log and event information are expanders below the table.
- Live bids are one tap, as in Option 1.
- **vs Option 1:** the four cells are the same four live modules Option 1 has
  (stream, current lot, bid panel, activity), and Option 1 also lists the
  order of sale. Here they sit inside one table row instead of a stage with a
  side panel. Section 9 records this as partially similar.

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
- **vs Option 1:** Option 1's storefront also runs identity with counts, then
  sale-type tabs with counts, then listings and About. There is no cover here
  and no sidebar, but section 9 records the storefront as partially similar.

### M. Mobile homepage wireframe
```text
┌──────────────────────────────────┐
│ LOGO  Home            Bell  Acct │
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
│                  │ [ Enter the room to bid ]            │                  │
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
│ ACTIVE AUCTIONS   bid tickets, soonest first                 View all 9 -> │
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
│ 1 Refundable bidding deposit, covered by your wallet -> 2 Bid, or set      │
│   a maximum -> 3 Timed lots: a bid in the last 5 min adds 5 min ->         │
│   4 Win and pay (timed wins: payment window) -> 5 Delivery or pickup,      │
│   arranged after payment                                                   │
│ GRADES  [New] [A] [B] [C] [D] [R] [F]   one line of meaning each           │
│ FOOTER   country · language · help                                         │
└────────────────────────────────────────────────────────────────────────────┘
```

### C. Homepage section order

1. **One header bar** with the floor switcher.
2. **Live auction stage:** a previous · now · next triptych.
   - The stream fills the centre, with the lot photo inset.
   - The current bid (SAR 1,850, 16 bids) and "Enter the room to bid" sit
     under it. One-tap live bids happen only inside the room, where the
     deposit is checked; the home stage has no bid button.
   - When nothing is live, the next timed lot to close takes the stage (the
     seat covers, 9 min), with the next live event's start time.
   - Option 1 also shows the live event in its hero, as one slide of the
     carousel. Here the live stage is the whole hero, and it is permanent.
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
│ [+ More filters] opens an inline panel under the chips: category ·         │
│   condition · item type · price · availability · seller                    │
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
  - "More filters", which opens an inline panel under the chips (category,
    condition, item type, price, availability, seller), not a drawer;
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
├─────────┴──────────────────────────────────────────┴───────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░ STAGE: main photo on a neutral stage ░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ▒ 14 IN STOCK · SAR 189 was 249 · -24%   [ Add to cart ]  [ Buy now ] ▒▒▒▒ │
│ LOT TITLE · Grade A · Rawabi Home Outlet (Riyadh)        [Watch] [Share]   │
│ Delivery priced at checkout · Pickup where offered                         │
│ [░] [░] [░] [░] [░]   thumbnails under the stage                           │
│   ^ the stage's lower third (a solid band) carries stock, price, actions   │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ CONDITION              │ SPECIFICATIONS          │ DELIVERY & PICKUP       │
│ Grade A                │ spec · value            │ Delivery priced at      │
│ notes on this lot      │ spec · value            │   checkout              │
│ [ Grade guide ]        │ spec · value            │ Pickup where offered    │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ ALSO AT AUCTION   the lots closing soonest, on a time line                 │
│  |-o------------------------o--------------------------o---------------->  │
│  [░] Lot · SAR 180 · 9m  [░] Lot · SAR 1,480 · 18m  [░] Lot · SAR 540 · 46m│
├──────────────────────┬──────────────────────────────┬──────────────────────┤
│ SAR 189   was 249    │ Qty  [ -  1  + ]             │ [ Add to cart ]      │
│ -24%  ·  14 left     │ Delivery priced at checkout  │ [ Buy now ]          │
│                      │ Pickup where offered         │                      │
├──────────────────────┴──────────────────────────────┴──────────────────────┤
│ ^ PURCHASE CONSOLE: docks at the bottom only after the stage's status      │
│   band has scrolled away; collapsed height 72px or less                    │
└────────────────────────────────────────────────────────────────────────────┘
```

- **The stage comes first:** the main photo, full width, on a neutral stage.
- **Lower third:** a solid status band at the stage's foot, like a broadcast
  caption. It carries stock (14 in stock), price, was-price and saving, Add to
  cart and Buy now.
- Under the stage: the title, grade, seller and city; delivery priced at
  checkout and pickup where offered; the 5 thumbnails.
- **Three fact columns:** condition, specifications, delivery & pickup.
- **"Also at auction":** the auctions closing soonest (9m, 18m, 46m), on a
  time line.
- **Purchase console:** it **docks at the bottom only after the lower third
  scrolls away**, and its collapsed height is 72px or less.

### J. Auction-detail wireframe — "bidding workspace"
```text
┌─────────┬──────────────────────────────────────────┬───────────────────────┐
│ [=] LOGO│ [Live 5/10|Ending 9m|Upcoming|Buy Now 18]│ (Q) ? Bids2 Cart Me AR│
├─────────┴──────────────────────────────────────────┴───────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ STAGE: main photo ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ▒ OPEN FOR BIDS · CLOSES IN 5H 40M · CURRENT 3,150 · [ Bid SAR 3,200 ] ▒▒▒ │
│ LOT KZ-0388 · LOT TITLE · Grade A · Rawabi Home Outlet     [Watch] [Rules] │
│ 23 bids · 9 bidders · 118 watching · buy now SAR 4,600 · not bidding yet   │
│ [░] [░] [░]   thumbnails under the stage                                   │
├────────────────────────────────────────────────────────────────────────────┤
│ AUCTION TIMELINE   the lot's whole life, with its bids on the line         │
│  OPENED          BIDS              NOW         CLOSE    PAYMENT*  DELIVERY │
│  o---------------|--|-|---|--|-----*-----------[####]---o----------o       │
│  30 h ago        23 bids           SAR 3,150   in 5h 40m          or pickup│
│ LAST BIDS  K27 SAR 3,150 · 34s   2048 SAR 3,050 · 12m (maximum bid)        │
│            1190 SAR 2,950 · 14m                     [ Full history ]       │
│  [####] timed auctions: a bid in the last 5 minutes extends the close by 5 │
│  * payment window applies to timed-auction wins; delivery or pickup is     │
│    arranged after payment (no date shown)                                  │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ CONDITION              │ SPECIFICATIONS          │ DELIVERY & PICKUP       │
│ Grade A                │ spec · value            │ Delivery priced at      │
│ notes on this lot      │ spec · value            │   checkout              │
│ [ Grade guide ]        │ spec · value            │ Pickup where offered    │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ TERMS   deposit covered by your wallet · timed: a late bid adds 5 min ·    │
│   payment window for timed wins · [ Full terms ]  (+ contents on bulk lots)│
│ CLOSING AROUND THE SAME TIME   on a time line                              │
│  |-o-----------------------o------------------------o------------------->  │
│  [░] SAR 1,240 · 2h 14m  [░] SAR 7,850 · 3h 05m  [░] SAR 1,120 · 7h 20m    │
├──────────────────────┬──────────────────────────────┬──────────────────────┤
│ NOT BIDDING YET      │ Quick bid                    │ [ Set maximum bid ]  │
│ Current SAR 3,150    │ [3,200] [3,250] [3,400]      │ [ Buy now SAR 4,600 ]│
│ Next    SAR 3,200    │ [ SAR ______ ]  [ Bid ]      │ Deposit covered (ok) │
│ each bid confirms    │ Delivery priced at checkout  │ Pickup where offered │
├──────────────────────┴──────────────────────────────┴──────────────────────┤
│ ^ BIDDING CONSOLE: docks once the stage's status band scrolls away;        │
│   its status line reads not bidding · winning · outbid                     │
└────────────────────────────────────────────────────────────────────────────┘
```

- **The stage comes first**, with 3 photos and the thumbnails under it.
- **Lower third:** the status band at the stage's foot reads "Open for bids ·
  Closes in 5h 40m · Current 3,150 · Bid SAR 3,200".
- Under the stage:
  - lot KZ-0388, the title, grade and seller, with Watch and Rules;
  - 23 bids, 9 bidders, 118 watching, Buy now SAR 4,600, and your status (not
    bidding yet).
- **Auction timeline**, the whole life of the lot, with its bids on the line:
  - opened 30 h ago → bids → now;
  - → close, with the 5-minute extension window (timed auctions only);
  - → payment window (timed wins only);
  - → delivery or pickup, arranged after payment, with no date shown.

  The last bids sit under the line, from the preview's seeded history: K27 SAR
  3,150 (34s ago), 2048 SAR 3,050 (a maximum bid, 12m ago), 1190 SAR 2,950.
  A "Full history" link follows. A list alternative serves screen readers.
- **Three fact columns:** condition, specifications, delivery & pickup. The
  same three columns appear on the Buy Now page.
- **Terms line:** deposit covered by your wallet · a late bid adds 5 minutes
  on timed auctions · payment window for timed wins · Full terms. Contents
  appear on pallet and bulk lots.
- **"Closing around the same time":** the nearest closes (2h 14m, 3h 05m,
  7h 20m) on a time line, not a rail.
- **Bidding console:** it docks once the lower third scrolls away. It holds:
  - your status (not bidding yet, winning or outbid);
  - quick bids (3,200 · 3,250 · 3,400), a custom amount and a maximum bid;
  - Buy now SAR 4,600;
  - the deposit;
  - delivery priced at checkout, and pickup where offered.

  Every bid goes through the confirm step.
- **vs Option 1:** there is no side bid box. There is also no "bid history
  beside terms, then a similar-lots rail" block: history lives on the timeline
  and similar lots on a time line.

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
│ #2 Coffee maker  │ ▒ K27 1,850 · A09 1,825 · M55 1,800  │ #8 Tool kit      │
│   SOLD 120       │ Lot 5 · Leather Recliner · Grade A   │   starts SAR 60  │
│ #1 Stick vacuum  │ CURRENT BID  SAR 1,850 · 16 bids     │ #9 Casserole     │
│   SOLD 310       │ Open > Countdown > Sold/Unsold       │   starts SAR 110 │
│                  │   each status set by the auctioneer  │ #10 Boots · 70   │
├──────────────────┴───┬──────────────────────────────┬───┴──────────────────┤
│ Current SAR 1,850    │ [    BID  SAR 1,875    ]     │ [1,900]  [1,950]     │
│ You: not bidding     │ Bids are binding once placed │ Deposit: covered     │
├──────────────────────┴──────────────────────────────┴──────────────────────┤
│ ^ BIDDING CONSOLE (same component as lot pages), docked to the bottom      │
│   the room reads through time: results at the start, the queue at the end  │
└────────────────────────────────────────────────────────────────────────────┘
```

The room is a symmetric triptych that reads through time:

- **Past:** the results so far — Sold 1,350, Unsold, Sold 120, Sold 310.
- **Now:**
  - the stream fills the stage, with the lot photo inset;
  - the last three bids in the lower third (K27, A09, M55 in the preview's
    feed);
  - the lot, its grade and the current bid;
  - the status sequence Open → Countdown → Sold / Unsold, each step set by
    the auctioneer.
- **Next:** the queue, with starting bids.

There is no side column. The same bidding console as on lot pages is docked at
the bottom. It shows:

- the current bid and your status;
- "Bid SAR 1,875", with the next quick bids, 1,900 and 1,950;
- the SAR 200 deposit, covered by your wallet.

Live bids are one tap and binding once placed, as in Option 1.

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
│    ( 1 winning · 1 outbid  ^ )   │
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
- **My bids pill:** a floating pill ("1 winning · 1 outbid", matching "Bids 2"
  in the header). It is hidden when you are signed out, when you have no bids,
  and where a console docks.
- **Lot pages:** the bidding console docks at the bottom and expands upwards
  into a sheet.

### N. Signature components

1. The one-bar floor switcher and the live stage triptych.
2. The ending-soon timeline with photo pins, and the time-bucketed finder.
3. The bid ticket and stock ticket (data first).
4. The lot stage with a lower-third status band, and the docked bidding
   console shared by lot pages and the live room.
5. An auction timeline on every lot (with its bids on the line), the past ·
   now · next live room, and hosts on a shared time axis.

Visual personality (secondary): confident and time-aware, with restrained
colour, a single urgency accent kept for time and live state, tabular figures
and minimal motion.

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
│ category bar   │  │ ░░ popular  ░░ │  │    ├──┬──┬──┬──┤  │   │ [ROOM] │   │
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
├─┬─────┬────┬───┤  ├────┬────┬──────┤  │░│ STRIP $ [Add]│  ├───┴─────────┴──┤
│░│ ░░░ │ txt│ BX│  │ ░░ │ ░░ │ ░░░░ │  │ ├────┬────┬────┤  │ ░░░ STAGE ░░░░ │
│░│ ░░░ │ txt│ BX│  ├────┴────┼──────┤  │░│ idx│ ░░ │ kv │  │ ░░░░░░░░░░░░░░ │
│░│     │ txt│   │  │ TITLE   │ $ [+]│  │░│ idx│    │ kv │  │ ▒ $ [+] [BUY]  │
├─┴─────┴────┴───┤  ├─────────┴──────┤  │ │    ├────┴────┤  │ title · seller │
│ tabs           │  │   ───────      │  │░│    │ ─────── │  │ [][][]         │
│ rails > >      │  │   ───────      │  │░│    │ compare │  ├────┬─────┬─────┤
│                │  │   ─────  [$+]  │  │ │    │         │  │ con│ spec│ dlvy│
│                │  │                │  │ │    │         │  ├────┴─────┴─────┤
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
├─┬─────┬────┬───┤  ├───────┬────────┤  │░│ STRIP [1][2] │  ├───┴─────────┴──┤
│░│ ░░░ │ txt│BID│  │ ░░░░░ │ ░░░░░░ │  │ ├────┬────┬────┤  │ ░░░ STAGE ░░░░ │
│░│ ░░░ │ txt│BOX│  ├───────┴─┬──────┤  │░│ idx│ ░░ │ kv │  │ ░░░░░░░░░░░░░░ │
├─┴─────┼────┴───┤  │ TITLE   │ BID  │  │░│ idx│    │ kv │  │ ▒ 5h40 [BID] ▒ │
│ hist. │ terms  │  │         │[1][2]│  │ │    ├────┴────┤  │ title · seller │
├───────┴────────┤  ├─────────┴──────┤  │░│    │ history │  ├────────────────┤
│ similar >      │  │   ───────      │  │░│    │ compare │  │ o--|-|*-[#]-o  │
│                │  │   ─────  [BID] │  │ │    │         │  │ last bids      │
│                │  │                │  │ │    │         │  ├────┬─────┬─────┤
│                │  │                │  │ │    │         │  │ con│ spec│ dlvy│
│                │  │                │  │ │    │         │  ├────┴─────┴─────┤
│                │  │                │  │ │    │         │  │ |--o--o--o-->  │
│                │  │                │  │ │    │         │  ├────────────────┤
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
│ [=] LOGO  cart │  │ [=]! LOGO W Q B│  │ LOGO Home Bell │  │ [=]LOGO Q Bids │
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
│H │C │L │Ct│Acct│  │     [LIVE mini]│  │   │        │   │  │  (1 win·1 out) │
└──┴──┴──┴──┴────┘  └────────────────┘  └───┴────────┴───┘  └────────────────┘
```

**Answer: yes on every screen type, with qualifications.**

- The homepage, browse and live silhouettes are unmistakably different.
- The product, auction and seller pages share the conventions every
  marketplace needs: a gallery, a price or bid, facts, and an identity block
  on storefronts.
- Section 9 lists every place where a new option remains partially similar to
  Option 1: 6, 7 and 6 of the 24 dimensions for Options 2, 3 and 4. None is
  substantially the same.

---

## 8. Structural comparison matrix

The Option 1 column was redrawn from the code after the review.

### Required dimensions

| Dimension | Option 1 — Modern Commerce (reference) | Option 2 — Visual Marketplace | Option 3 — Marketplace Hub | Option 4 — Auction Commerce |
|---|---|---|---|---|
| **Header** | Three tiers: dark utility strip; logo + scoped search + actions; category bar with a photo mega menu | One bar: links either side of a centred logo; labelled search; no utility strip or category bar | App shell: vertical navigation rail + slim top bar | One bar: menu + logo, centred floor switcher (Live · Ending · Upcoming · Buy Now), icons |
| **Search** | Scoped bar in the header centre; its own row on phones, hiding on scroll | In-hero discovery field + full-screen visual search | Home search deck that docks into the rail; "/" shortcut; bottom command bar on phones | Collapsed icon; discovery by time-window chips |
| **Hero** | 8/12 carousel (≥436px; brand, live and pallet slides) beside two stacked 4/12 tiles (ending soon, top deal) | Full-width centred discovery block framed by product cut-outs (~480px); four tiles straddle its edge | No image hero: search deck + hub counters | Live stage triptych: previous · now · next, centred controls; "Enter the room to bid" |
| **Category discovery** | Photo mega menu (8 photos, counts, quick links, live card) + one row of 8 equal tiles; on phones a rail of square photo cards and a category sheet | Mosaic of categories and sellers with unequal tile sizes + full-screen Categories overlay + browse photo-chip tray + mobile stories | Always-visible tree with thumbnails, counts and sale-type branches + 4×2 grid | Chips with open auctions, Buy Now count and next close, below the auction content; category filter in a drawer |
| **Homepage structure** | Hero + tiles → trust → categories → auctions rail → live band → deals → pallets → sellers → how it works + grades | Hero → featured now → category/seller mosaic → featured marketplace → on the block (2×2) → ready to buy → grades → how it works; live as a floating mini-player | Search deck → counters → categories → three list modules → sellers + live → recently added → pallets → buying on Khazna | Stage → ending-soon timeline → active → upcoming → Buy Now → categories → hosts on a time axis → how bidding works |
| **Product cards** | Vertical card (square plated image, text, button footer) + `LotRow` list rows + `CompactLot` rows + `MiniCard` | Square image tile; information on a solid band inside the image; 2×2 feature tiles | Table row (single line, columns) + mini-table row + compact tile | Stock ticket: stock, price and saving first; small photo row; Add |
| **Auctions** | Rails of vertical cards; ending tile beside the hero; sticky bid box on detail | A static block of four wide showcases; time and bid on the tile band; bid module in the purchase band | Ending-soon mini-table with a window switch; time column in the table; bid ladder in the summary strip | Bid tickets (status, time, current bid first); timeline; time buckets; docked console |
| **Live auctions** | Live slide in the hero carousel; full-bleed live band on home; stage + 380px side panel; lots table | Floating mini-player on every page; full-width theatre stage, pinned bid band, lot reel | Live line and module; one order-of-sale table whose live row expands in place | Live stage as the home hero; room as a past · now · next triptych + docked console |
| **Browse** | Quick filters (sale type + 3 chips) + sticky facet sidebar + grid 2/3/4 or list view + numbered pages | Category banner + visual filter tray + drawer + tile mosaic + load more | Collapsed rail + scope switch + sortable table with column filters + quick-view pane | Floor switcher + window chips + inline filter panel + time buckets |
| **Product detail** | Three columns from 1280px (vertical thumbnails · gallery · details · sticky box) + tabs + two rails | Filmstrip → purchase band → centred column → floating card | Result navigation → sticky summary strip → index · photo · facts → spec sheet → compare table | Stage with a lower-third status band → three fact columns → also at auction → console after scroll |
| **Auction detail** | Same frame with a sticky bid box; bid history + terms side by side; manifest; similar rail | Filmstrip → band with the bid module → centred column → floating bid card | Summary strip with the bid ladder → index · photo · facts → bid history table → compare | Stage with a lower-third status band → auction timeline with the bids → fact columns + terms → similar lots on a time line → console |
| **Seller page** | Cover (176–256px) + overlapping identity card + tabs, search, sort + sidebar + grid + About/Pickup columns | Full-bleed cover with the name on a band + profile strip with an About & pickup expander + photo chips + tile mosaic | Rail + compact profile header + tabs (Overview modules · Auctions · Buy Now · About) + table | Status first (live band or next close) + identity line + seller timeline + tickets + results |
| **Mobile navigation** | Menu, logo, Account, Cart; search row; five-tab bottom bar, swapped for action bars on lot pages | No bottom bar: transparent top bar, full-screen menu, floating live mini-player | Bottom command bar (menu · search · cart; Add or Bid on lot pages) | Top bar + sticky floor switcher + floating My bids pill; console on lot pages |

### Further dimensions from the brief

| Dimension | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| **Navigation architecture** | Categories first (mega menu), then sale-type links | Same destinations; categories in a full-screen overlay | Marketplace views with counts, category tree, sellers, My Khazna in a rail | Sale mode and time first (switcher: Live, Ending, Upcoming, Buy Now); categories and sellers in the menu |
| **Hero proportions** | 8/12 width × ≥436px | 100% width × ~480px | Main column × ~240px deck | Container width × ~480px |
| **Hero content position** | Start-aligned inside each slide | Centred between cut-out columns | Top-start in the deck | Centred triptych; controls centred under the stream |
| **Section ordering** | Categories → auctions → live → deals → sellers → how it works | Categories (with sellers) → featured → auctions → Buy Now → how it works | Search → counters → categories → deals · ending · popular → sellers · live | Live → ending → active → upcoming → Buy Now → categories → hosts → how bidding works |
| **Product-grid composition** | Uniform grids and rails, 4–5 across | Mosaics with 2×2 features; mirrored 1/2 + 1/4 + 1/4 rows | Table rows; list modules; compact tiles six across | Rows of tickets (3 and 4 across); time buckets on browse |
| **Buy Now presentation** | Top-deal tile in the hero + five-across deals grid | Ready-to-buy mosaic around a 2×2 feature | Deals list module; Buy Now rows in the table | Stock tickets, four across, after Upcoming |
| **Ending Soon presentation** | Thumbnail-row tile beside the hero + auctions rail | On the block: a static 2×2 block of wide showcases, closing soonest first | Ending-soon mini-table with a window switch + counter | Timeline with photo pins + window chips + buckets |
| **Live presentation** | A hero carousel slide + a full-bleed band after the auctions rail | Floating mini-player on every page | One line + one module | The home stage (the whole hero) + the switcher's Live segment |
| **Seller/store presentation (home)** | Stats band + seller tiles with covers | Two seller tiles inside the category mosaic | Seller directory list module | Sellers as rows on a shared time axis |
| **Trust-information presentation** | Utility-strip ticker + trust strip under the hero + footer | One line under the hero search + grade band + text steps | "Buying on Khazna" link in the rail and a link row | How bidding works + the rules link + console notes |
| **Filter UX** | Sale-type switch + 3 chips + sticky facet sidebar + mobile sheet | Visual tray (photo chips, grade chips, price bands) + drawer | Column-header filters + scope switch + tree; full-screen filter page on phones | Switcher + window chips + inline filter panel |
| **Mobile page composition** | Search row, carousel, stacked tiles, rails, tab bar | Full-screen hero, stories, single-column tile feed | Counters, category grid, dense lists, command bar | Switcher, live strip, ticket carousel, time rows, My bids pill |

---

## 9. Similarity audit (revised after two independent reviews)

Each new option is compared with the Option 1 code, area by area. Three
verdicts are used:

- **DIFFERENT:** the area's structure differs.
- **PARTIALLY SIMILAR:** a significant structural element or arrangement is
  shared. An area where one aspect differs but another is shared counts as
  partially similar.
- **SUBSTANTIALLY SAME:** the area's main structure is Option 1's.

Some conventions are noted but do not change a verdict:

- things every marketplace needs: a sale-type switch, a gallery, a price, a
  grade line, a closing "how it works" section, and an action anchored at the
  bottom of mobile lot pages;
- filters built from the same shared data, such as grade, price, category and
  time left.

None of these counts as differentiation: colour, font, radius, shadow, button
colour, accent colour, icon style, spacing, background tone or badges.

**The brief's rule:** if more than two major areas remain substantially the
same as Option 1, the wireframe is redesigned before presenting.

### Summary

| Option | 11 questions: same / partial / different | 24 dimensions: same / partial / different | Rule |
|---|---|---|---|
| 2 — Visual Marketplace | **0** / 3 / 8 | **0** / 6 / 18 | Passes |
| 3 — Marketplace Hub | **0** / 3 / 8 | **0** / 7 / 17 | Passes |
| 4 — Auction Commerce | **0** / 2 / 9 | **0** / 6 / 18 | Passes |

How the counts developed:

- **The first review, of revision 1:**

  | Option | Substantially same | Partially similar |
  |---|---|---|
  | 2 | 0 | 3 |
  | 3 | 1 | 5 |
  | 4 | 0 | 4 |

- **The second review, of this revision's first draft:** it found no area
  substantially the same in any option. It judged that the draft undercounted
  partial similarities, estimating about 6–7 of 24 for Option 2, 7–8 for
  Option 3 (with one arguably substantially the same) and 6–7 for Option 4.

The counts above apply the definition strictly. Where a sensible change
existed, the design was changed instead (see "Independent review" below).

### Option 2 — Visual Marketplace vs Option 1 (the 11 questions)

| Question | Verdict | Evidence |
|---|---|---|
| Header | DIFFERENT | One bar with links either side of a centred logo, versus three tiers (`UtilityStrip`, `Header`, `CategoryNav`) |
| Hero | DIFFERENT | One full-width centred discovery block framed by cut-outs, with tiles overlapping its edge, versus an 8/12 carousel with side tiles. Option 1's brand slide also uses cut-outs: that is shared imagery, not structure |
| Search placement | DIFFERENT | In the hero and a full-screen layer; no header search bar |
| Category discovery | **PARTIALLY SIMILAR** | The unequal mosaic with seller tiles is new. The full-screen overlay and the mobile stories rail echo `MegaMenu`, the mobile category sheet of 8 photo cards, and the phone rail of square photo cards |
| Homepage composition | **PARTIALLY SIMILAR** | The top half is new: the centred hero, overlapping tiles, the category-and-seller mosaic and the mirrored feature rows. The lower half keeps Option 1's section types in re-composed forms: an auctions block (four wide showcases, not a rail), a Buy Now deals block (a mosaic, not a grid), and how it works with the grades |
| Product cards | DIFFERENT | A square tile with the information on a band inside the image and no footer, versus an image + text + button card. Tag and heart placement is a convention |
| Browse | DIFFERENT | Banner, visual tray and drawer, tile mosaic, load more; no sidebar, no numbered pages |
| Product detail | DIFFERENT | Filmstrip → purchase band → centred column → floating card; no three-column layout, tabs or rails |
| Auction detail | DIFFERENT | The same frame, with the bid module in the band; no side bid box, no history-beside-terms block |
| Live auction | **PARTIALLY SIMILAR** | The side panel is gone and the stream is full width with a pinned bid band. But the main column keeps Option 1's order: event header → stage → current lot → order of sale → other events |
| Mobile UX | DIFFERENT | No tab bar; full-screen menu; single-column tile feed; mini-player. The stories rail is counted under category discovery |

### Option 3 — Marketplace Hub vs Option 1 (the 11 questions)

| Question | Verdict | Evidence |
|---|---|---|
| Header | DIFFERENT | Navigation rail + slim top bar |
| Hero | DIFFERENT | No image hero; search deck + counters |
| Search placement | DIFFERENT | Deck and rail on desktop; bottom command bar on phones |
| Category discovery | **PARTIALLY SIMILAR** | The persistent tree with sale-type branches is new. The 4×2 grid, which the brief's suggested order asks for, echoes `CategoryTiles` |
| Homepage composition | DIFFERENT | A dashboard of mini-tables in module rows; no hero, rails or grids of cards. The ending-soon mini-table is counted under dimension 14 |
| Product cards | **PARTIALLY SIMILAR** | Table rows and mini-table rows are new. The compact tile (Recently added, the browse Tiles view) is a small image-top card like Option 1's |
| Browse | DIFFERENT | Sortable table with column filters and a quick-view pane; no chip row, no sidebar. The scope switch, view switch and pager are conventions |
| Product detail | DIFFERENT | Sticky summary strip, in-page index, a spec sheet without tabs, a compare table; no side purchase box or rails |
| Auction detail | DIFFERENT | Bid ladder in the sticky strip; bid history table; no side bid box |
| Live auction | **PARTIALLY SIMILAR** | One order-of-sale table whose live row expands in place. But the row holds Option 1's four live modules (stream, current lot, bid panel, activity), and Option 1 also lists the order of sale |
| Mobile UX | DIFFERENT | Bottom command bar and a full-screen filter page led by the tree; no chip row, no tab bar, no filter sheet |

### Option 4 — Auction Commerce vs Option 1 (the 11 questions)

| Question | Verdict | Evidence |
|---|---|---|
| Header | DIFFERENT | One bar with a centred floor switcher, versus three tiers. Its destinations overlap Option 1's category-bar links (counted under navigation architecture) |
| Hero | **PARTIALLY SIMILAR** | The permanent previous · now · next stage is new. But Option 1 already puts the live event in its hero, as one carousel slide, and the height class is the same (~480px vs ≥436px) |
| Search placement | DIFFERENT | A collapsed icon; time windows lead discovery |
| Category discovery | DIFFERENT | Chips with auction state, low on the page; a list in the menu |
| Homepage composition | **PARTIALLY SIMILAR** | The top half (stage, timeline) is new, and the hosts sit on a time axis. But the middle is rows of tickets, which still reads as rows of cards, plus a Buy Now grid |
| Product cards | DIFFERENT | A data-first ticket with a small photo row, versus an image-top card |
| Browse | DIFFERENT | Switcher tabs, window chips, an inline filter panel and time buckets; no sidebar, and no flat grid by default |
| Product detail | DIFFERENT | A stage with a lower-third status band, three fact columns, a time line, and the console after scroll |
| Auction detail | DIFFERENT | Bids on the auction timeline; fact columns and a terms line; similar lots on a time line; no side bid box, no history-beside-terms block, no similar-lots rail |
| Live auction | DIFFERENT | A symmetric past · now · next triptych with no side column |
| Mobile UX | DIFFERENT | Switcher, live strip, ticket carousel, My bids pill. The bottom console on lot pages is the convention shared by all four options |

### All 24 dimensions of the brief

| # | Dimension | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| 1 | Header structure | DIFFERENT | DIFFERENT | DIFFERENT |
| 2 | Navigation architecture | **PARTIAL** — Option 1's destinations, with categories first | DIFFERENT | **PARTIAL** — the switcher's Live, Ending and Buy Now are Option 1's category-bar links; categories move to the menu |
| 3 | Search placement | DIFFERENT | DIFFERENT | DIFFERENT |
| 4 | Category discovery | **PARTIAL** — overlay and stories echo the mega menu, mobile sheet and phone rail | **PARTIAL** — the 4×2 grid echoes the tile row | DIFFERENT |
| 5 | Homepage composition | **PARTIAL** — the lower half keeps Option 1's section types, re-composed | DIFFERENT | **PARTIAL** — rows of tickets and a Buy Now grid |
| 6 | Hero structure | DIFFERENT | DIFFERENT | DIFFERENT — a permanent stage, not a carousel (Option 1 has a live slide) |
| 7 | Hero proportions | DIFFERENT — full width, not 8/12 | DIFFERENT | **PARTIAL** — same height class |
| 8 | Hero content position | DIFFERENT — centred, not start-aligned | DIFFERENT | DIFFERENT |
| 9 | Section ordering | **PARTIAL** — categories → auctions → Buy Now → how it works, as the brief suggested | **PARTIAL** — categories → deals and ending → sellers and live → pallets → buying guide, close to Option 1's sequence | DIFFERENT — live first, categories late; shares only the hosts → how-it-works tail |
| 10 | Product-grid composition | DIFFERENT | DIFFERENT | **PARTIAL** — tickets in uniform 3- and 4-across rows on home |
| 11 | Product-card layout | DIFFERENT | **PARTIAL** — compact tile ≈ a small vertical card | DIFFERENT |
| 12 | Auction-card layout | DIFFERENT | **PARTIAL** — the compact tile with bid and time | DIFFERENT |
| 13 | Buy Now presentation | DIFFERENT — a mosaic, not a uniform grid | DIFFERENT | **PARTIAL** — a uniform grid of discounted Buy Now lots with "Shop all" |
| 14 | Ending Soon presentation | DIFFERENT — a static 2×2 block of wide showcases | **PARTIAL** — a small panel of the next-closing lots, like Option 1's ending tile (now a mini-table with a window switch) | DIFFERENT |
| 15 | Live Auction presentation | DIFFERENT | DIFFERENT | DIFFERENT |
| 16 | Seller/store presentation | DIFFERENT | DIFFERENT | DIFFERENT |
| 17 | Trust-information presentation | DIFFERENT | DIFFERENT | DIFFERENT |
| 18 | Product-detail structure | DIFFERENT | DIFFERENT | DIFFERENT |
| 19 | Auction-detail structure | DIFFERENT | DIFFERENT | DIFFERENT |
| 20 | Live-auction structure | **PARTIAL** — the main-column order is kept | **PARTIAL** — Option 1's four live modules in one row | DIFFERENT |
| 21 | Seller-storefront structure | **PARTIAL** — cover → identity → listings | **PARTIAL** — identity with counts → sale-type tabs → listings → About | DIFFERENT |
| 22 | Filter UX | DIFFERENT — a visual tray and drawer replace the sidebar | DIFFERENT | **PARTIAL** — the window chips promote Option 1's "Ending within" facet and its "Ending < 1h" chip |
| 23 | Mobile navigation | DIFFERENT | DIFFERENT | DIFFERENT |
| 24 | Mobile page composition | DIFFERENT | DIFFERENT | DIFFERENT |
| | **Totals (same / partial / different)** | **0 / 6 / 18** | **0 / 7 / 17** | **0 / 6 / 18** |

Most of these partial similarities come from three sources:

- the brief's own suggested section orders;
- elements it asks for, such as Option 3's category grid;
- features every live page and storefront needs.

They are listed so the client can judge them. Any of them can be pushed
further before implementation (decision 9 in section 13).

### New options against each other

| Pair | Overlap found in revision 1 or in the second review | Status |
|---|---|---|
| 2, 3, 4 | All three browse pages had a row of dropdown filters above the results | Resolved: visual tray + drawer (2), column-header filters (3), window chips + inline panel (4). Options 2 and 4 both keep a chip row and sort above the results (minor) |
| 2 vs 3 | Same mobile navigation model (menu, full-screen menu, cart at the top) | Resolved: Option 3 uses a bottom command bar |
| 3 vs 4 | Both had a sticky chip row under the mobile top bar | Resolved: Option 3 dropped its chip row |
| 2 vs 4 | Both used vertical image-top cards in 3–4-across grids | Resolved: square tiles with an in-image band (2) vs data-first tickets (4). Both still arrange cards in grids |
| 3 vs 4 | Both opened the storefront with a compact profile block and no cover | Partly resolved: Option 4 leads with live or next-close status and its own timeline (minor) |
| 3 vs 4 | Option 4's Buy Now rows were Option 3's row card | Resolved: Option 4 uses stock tickets |
| 2, 3, 4 | Lot pages replaced the side box with a two-part "title \| price + actions" band, and Options 3 and 4 both opened with it above the photo | Option 4 now leads with the stage and a lower-third band. Options 2 and 3 keep two-part bands: under a filmstrip (2) vs a sticky strip above an index (3) (minor) |
| 2, 3, 4 | Every live room insets the lot photo on the stream; Options 2 and 4 both pin a bid bar | The inset is a rule of this plan. The rooms differ: theatre + reel (2), one table row (3), past · now · next (4) (minor) |
| 3 vs 4 | Both list live and upcoming events with "Remind me" | Minor; driven by the same data |
| 2 vs 4 | Both centre content at the top of the home page | Minor: a cut-out field with a search block vs a stage triptych |
| 2 vs 4 | Both float an element on phones | Minor: live mini-player (2) vs My bids pill (4) |
| All four | Bottom-anchored action on mobile lot pages | Platform convention, shared with Option 1 |

### Independent review

Two separate reviewers with read-only access checked this plan against three
sources:

- the Option 1 code (`components/concept-b`);
- the shared sample data (`data/`, `lib/`);
- the production reference (`CUSTOMER_REDESIGN_FILE_MAP.md`, section G).

Every finding was checked against the code before a change was made.

**First review (of revision 1).** It confirmed that no option broke the
brief's rule, but found that revision 1 overstated how different the options
were:

| # | Review finding | Change in revision 2 |
|---|---|---|
| 1 | The Option 1 reference understated Option 1: it has a photo mega menu (not a text menu), a hero at least 436px tall, several card formats, vertical desktop thumbnails, an auction page without tabs, a live page with the lots table in the main column, storefront tabs, seller tiles with covers, and Account + Cart in the mobile header | Section 3 and the matrix's Option 1 column were redrawn from the code |
| 2 | "0 of 11" overclaimed. The review counted: Option 2 0 same, 3 partial; Option 3 1 same, 5 partial; Option 4 0 same, 4 partial | Replaced by the verdict tables above, covering the 11 questions and all 24 dimensions |
| 3 | The cards in Options 2 and 4 were still vertical image-top cards, the kind of change the client rejected in Round 2 | Option 2 uses square tiles with the information on a band inside the image, plus 2×2 feature tiles. Option 4 uses data-first bid and stock tickets |
| 4 | Option 3's row card was Option 1's list-view `LotRow`, and its browse page kept Option 1's quick-filter chips and mobile filter sheet | Option 3 now has a real sortable table with filters in the column headers and a quick view. The chip row was removed, and a full-screen filter page led by the category tree replaces the sheet |
| 5 | Option 2's "Shop ▾" photo panel had the same structure as `MegaMenu`; there was no Buy Now link, no language switch and no label on search | Categories opens a full-screen overlay. A Buy Now link, a labelled Search and the language switch were added |
| 6 | Option 2's photo-led idea was not supported by the images. There are 128 photos, mostly square studio shots, and the only hero-width photo is Option 1's pallet slide | The hero is now a cut-out composition, with lifestyle photos used where they exist. Section 11 has the image-source table and the corrected counts |
| 7 | No auction-detail page showed delivery or pickup | Added to all three auction pages |
| 8 | Navigation gaps: Option 4 had no mobile cart or menu, no desktop language switch and no rules link; Option 2 had no language switch; the bell and country switcher (G19) were not placed | All added |
| 9 | Live video was not placed, and Option 3 had no stream | Every live page now shows where the stream goes, with the lot photo inset |
| 10 | "LIVE" and `*` appeared on timed lots, and the live stepper implied automatic selling | Timed lots say "Open for bids"; LIVE marks live events only; the live status is set by the auctioneer |
| 11 | The confirm step for binding bids was never mentioned | Added as ground rule 7, and to every timed-bid control |
| 12 | Option 4's two-row header and its live room (stage plus a right-hand activity column) stayed close to Option 1 | Option 4 now has one bar with a floor switcher and a past · now · next live room with no side column. Its hosts sit on a time axis instead of seller cards |
| 13 | The wireframes did not match the sample data: Red Sea's counts, the time buckets (1/2/4/2), event names, the 7-grade scale, gallery counts and bidder states | Every wireframe was redrawn from the data |
| 14 | Overlaps between the new options | See "New options against each other" above |
| 15 | Section 11 classified several items as F that should be B or API: G16, G26/G8, G3, G12, and REST polling for live bands | Reclassified in section 11 |

**Second review (of revision 2's first draft).** It confirmed that no option
has an area substantially the same as Option 1, and that the lot, seller,
live-event and photo figures were right. It found:

| # | Review finding | Change |
|---|---|---|
| 1 | Data slips: Option 1's live bid is SAR 1,875; the shared live quick bids are 1,875 / 1,900 / 1,950; 26 lots (not 27) have a cut-out; Option 2's home repeated four lots; the popular searches were not the shared list; the bidder names and times were not the seeded ones; the related lots were in the wrong order | All corrected. Option 2's home now shows 19 different lots, and the seeded rows are used: K27, 2048 and 1190 on the default auction; K27, A09 and M55 in the live room |
| 2 | Wording: `*` was used for an outbid badge; "deposit from your wallet" should be "covered by your wallet"; Option 4's home stage had a one-tap live bid outside the room | `!` is now the badge; Option 1's deposit wording is used; the home stage says "Enter the room to bid" |
| 3 | The audit undercounted partial similarities: the 4×2 category grid, the live row's four modules, the storefront order and the section order in Option 3; the auctions and Buy Now blocks, live column order and navigation in Option 2; the live hero slide, navigation, auction-detail lower half and window chips in Option 4 | Re-graded with one strict rule (section 9). Where a sensible change existed, the design was changed instead: Option 3's modules became mini-tables; Option 2's On the block became a static 2×2 block; Option 4's lot pages now lead with a stage and a lower-third band, with the bids on the timeline and similar lots on a time line; Option 4's secondary filters became an inline panel |
| 4 | The Option 1 reference missed: its brand slide already uses cut-outs; it has a live hero slide; the phone category rail uses square cards; there is a mobile category sheet; there is a fourth card format (`MiniCard`), a newsletter band, and 8 lots per browse page | Section 3 and the matrix were corrected, and the audit now counts these echoes |
| 5 | Overlaps between the new options: two-part lot bands, chip rows, pinned live bid bars, upcoming-event lists | Option 4's lot pages moved to the stage and lower-third layout; the rest are listed above |
| 6 | Section 11 gaps: G18 is class B; the rail counts depend on G16 and G5; G2 covers pickup details; G15 covers structured specs; G21 covers deposit and payment wording; My bids needs G9 and G14; Option 4's new tabs are G16; the sample live stream is the Riyadh warehouse photo | All added |

**Result:** no area of any option is substantially the same as Option 1, so
all three pass the brief's rule. The remaining partial similarities, out of
the 24 dimensions, are:

| Option | Partial similarities |
|---|---|
| 2 | 6 |
| 3 | 7 |
| 4 | 6 |

Each one is listed above with its reason.

---

## 10. Functional coverage — nothing removed

| Feature | Option 2 — Visual Marketplace | Option 3 — Marketplace Hub | Option 4 — Auction Commerce |
|---|---|---|---|
| Buy Now | Square tiles, Ready to buy mosaic, purchase band + floating card, bag drawer | Deals mini-table, table rows, summary strip with quantity, Add and Buy now | Stock tickets, Buy Now floor, lot stage with a lower-third band + docked purchase console |
| Timed auctions | On the block showcases, auction tiles, bid module in the band, floating bid card | Ending-soon mini-table, table time column, bid ladder in the summary strip | Timeline, bid tickets, time buckets, lower-third band, bidding console |
| Live auctions | Floating mini-player on every page, Live link, theatre page with a pinned bid band | Live line, Live & upcoming module, Live now in the rail, schedule table with the live row expanded | Live segment in the switcher, live stage on home, past · now · next room |
| Search | In-hero field + full-screen visual search | Home deck + rail search + suggestion panel; command bar on phones | Expanding search + window chips |
| Categories | Mosaic, Categories overlay, browse tray, mobile stories | Category tree, category grid, mobile filter page | Categories on the floor, More filters, menu |
| Filters | Visual tray + All filters drawer | Column-header filters, scope switch, tree; full-screen filter page on phones | Floor switcher + window chips + inline More filters panel |
| Sellers | Seller tiles in the mosaic, boutique storefront | Seller module, rail list, profile with tabs, sellers table | Hosts on a shared time axis, status-led storefront |
| Cart | Bag in the bar → bag drawer | Cart in the top bar (command bar on phones) → cart drawer | Cart in the bar → drawer |
| Watchlist | Heart on tiles; Watchlist in the bar (with a count on phones) | Watch in the quick view and summary strip; Watchlist & bids in My Khazna | Heart on tickets; My bids & watching drawer |
| Customer account | Account in the bar (bell badge) | My Khazna in the rail + account in the top bar | Account in the bar; My bids links to the account's bids tab |
| Timed bidding (quick bids, custom amount, maximum bid, deposit, Buy Now on "both" lots, 5-minute extension) | Bid module in the band, floating bid card, mobile bid sheet | Bid ladder in the strip, Bid in the quick view and table, mobile ladder sheet | Bid tickets, docked console, mobile console sheet |
| Confirm step (timed bids) | On every bid control | On every rung and Bid button | On every amount button |
| Live bidding | One tap inside the live room, binding once placed; the deposit (covered by your wallet) is checked; status set by the auctioneer. Outside the room, live elements link into it | Same | Same |
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
  - **39 cut-outs**: 26 of the 29 lots have a cut-out of their main shot.
    The seat covers, the wrench set and the kitchen pallet lead with other
    images;
  - 2 brand photos:
    - the warehouse-floor photo, which is Option 1's pallet slide;
    - the Riyadh warehouse photo. It is the Khazna Direct cover and also the
      sample live stream (`data/live.js`), so it is behind Option 1's live
      slide and live band. Every option's live stage will show it in the
      preview.

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
| Live mini-player and theatre | The live stream + the lot photo | The stream (in the preview, the sample stream photo) with the lot photo inset |

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
| Featured now, Featured marketplace | 2 | Production's moderated Featured placements | B (G18: keep Featured) |
| Full-screen visual search with lot thumbnails | 2 | `sale-lots/?search=` | B (G26, additive) |
| Categories overlay, mosaic, stories, tray | 2 | Category images + cut-out treatment | F; cut-outs in production B/API |
| Seller tiles in the mosaic; cover storefront | 2 | Seller cover and tagline are not production fields; there is no seller list | API (G2, G3) |
| Seller pickup address and hours (About & pickup, Pickup & hours, Pickup & terms) | 2, 3, 4 | Not public seller fields | API (G2) |
| Structured specs, highlights and condition notes (spec sheets, key facts, fact columns) | 2, 3, 4 | Production has a single-language title and description, and no highlight or condition-note fields | API (G15) |
| Floating live mini-player | 2 | Public live-event REST, polled | F |
| Sold tiles and results (ended lots) | 2, 3, 4 | Ended lots return 404 in production | B (G5) |
| Upcoming lot states | 2, 3, 4 | Scheduled lots are public and watchable | F (G6) |
| Rail counts and sale-type branches | 3 | List endpoint counts per query. "Ending soon" and "New today" are new filters; category counts depend on slug filtering; counts that include sold lots depend on G5 | B (G16; G5) |
| Hub counters (ending < 1 h, deals, new today), Popular now | 3 | Filters and sorts production does not offer | B (G16) |
| Sortable table: new sorts (grade, seller) and column filters | 3 | Production sorts: ending, price | B (G16) for new sorts; F for the table |
| City on lots (Option 3's table and strips, Option 2's purchase band) | 2, 3 | City via the seller lookup, or a serializer change | F / API (G4) |
| Quick-view pane, comparison tables | 3 | Existing lot data | B (G26, additive) |
| Previous / next lot | 3 | Current result set; category fallback | F |
| Bid ladder and quick bids | 2, 3, 4 | Minimum next bid + increment | B (G26); first-bid rule F (G8) |
| Seller directory module and table | 3 | No seller-list endpoint | API (G3) |
| Presenter names, event start times | 2, 3, 4 | Not event fields in production | API (G12) |
| "Remind me" on upcoming live events | 3, 4 | No reminder backend | API (G29), concept idea |
| Floor switcher counts | 4 | Live REST + list counts; the "Ending 9m" segment needs the next close | F; window counts B (G16) |
| New switcher tabs (Ending, Upcoming) | 4 | Production's tabs are auction, buy_now and live | B (G16) |
| Window chips and time buckets | 4 | "Ending within" windows are not a production filter | B (G16) |
| Ending-soon, seller and host timelines | 4 | Lot end times; the host rows need the seller list | F; B (G16) for windows; API (G3) for host rows |
| Auction timeline on the lot page | 4 | Start and end times, bid history, the server-side extension (G7), the payment-window policy | F; payment wording LEGAL (G21) |
| Deposit, extension and payment-window wording (How bidding works, auction terms, terms lines) | 2, 3, 4 | Policy wording | LEGAL (G21) |
| My bids drawer and pill | 4 | The account watchlist tab (alias `bids`); the preview keeps simulated bids inside Option 4's own layer | F; bidder-state mapping F (G9); counts across pages API (G14) |
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
signed-in user, so it is used only inside the live room. That is also why
one-tap live bids happen only inside the room: everywhere else, live elements
link into it.

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
   mobile? It appears only after the stage's status band scrolls away.
5. **Option 4:** should Buy Now stay after Upcoming, as in the brief's order?
   Or move up to straight after the timeline, as the review suggested?
6. **Options 2 and 3:** is no bottom tab bar on phones OK?
7. **Client-facing names:** confirm Visual Marketplace, Marketplace Hub and
   Auction Commerce.
8. **Concept ideas:** some ideas need backend or business decisions (section
   11). May they appear in the preview as design ideas, labelled as in
   earlier rounds?
9. **Partial similarities (section 9):** accept them as listed, or name any
   you want pushed further before implementation.
