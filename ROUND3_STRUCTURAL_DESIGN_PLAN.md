# Khazna Customer Website Redesign — Round 3 Structural Design Plan

> **Status: structural plan for approval. Nothing has been implemented.**
> The preview app is unchanged: `concept-a`, `concept-c` and `concept-d` still
> hold their Round 2 versions, and Option 1 (`concept-b`) is read-only.
> Coding starts only after this plan is approved:
> **structural plan approval → implementation → visual QA → client preview.**

Baseline: branch `claude/magical-faraday-fne4kq` at commit `886b32c`.
Scope: the isolated `design-preview/` app only. No production frontend,
backend, API, admin, seller, warehouse or deployment changes.

---

## 1. What this plan proposes

The Round 2 review found that Options 2–4 reused Option 1's page skeleton and
differed mainly in colour, type and card styling. This plan replaces them with
three **structurally different** marketplaces. Each option keeps Option 1's
quality, usability and functional scope, but has its own page architecture.

| Option | Name | Route slot | Organising idea | Structure in one line |
|---|---|---|---|---|
| 1 | Modern Commerce | `concept-b` | Search-led commerce portal | **Reference — unchanged, read-only** |
| 2 | **Visual Marketplace** | `concept-a` | Photography drives discovery | Full-bleed photo hero with in-hero search, photo category mosaic, portrait image-first cards, filmstrip product pages, image-feed mobile |
| 3 | **Marketplace Hub** | `concept-c` | Search and dense discovery | App shell with a navigation rail and live category tree, search deck, dashboard of list modules, list + quick-view browse, listing summary strips |
| 4 | **Auction Commerce** | `concept-d` | Time: live now, closing next, opening soon | Live auction stage, ending-soon timeline, time-bucketed auction finder, lot cards built around the bid, docked bidding console |

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
3. **Shared layers only:** the sample data (`data/`), the behaviour hooks
   (`lib/useBrowse`, `lib/useAuction`, `lib/useLiveEvent`, the clock, formatting,
   i18n and catalogue helpers), the preview store (cart, watchlist, toasts) and
   the low-level UI primitives in `components/shared/` (Money, Img, Modal,
   Drawer, Listbox, PriceRange, Skeleton, Toaster, hooks, brand logo).
4. **Differences must survive grayscale.** Colour, font, radius, shadow, icon
   style, badge style, background tone and spacing alone are not counted as
   differentiation anywhere in this plan.
5. **Same data, same features.** Every option uses the same products, sellers,
   categories, prices, auction information, images and lot information. Every
   option supports Buy Now, timed auctions, live auctions, search, categories,
   filters, sellers, cart, watchlist, customer account, bidding, condition
   grading and delivery/pickup information (see section 10).
6. **English and Arabic are both first-class** in every option. All wireframes
   are drawn left-to-right; in Arabic every layout mirrors (start and end swap).

**Wireframe legend:** `░` photograph or image area · `▒` dark band · `▓` current
or highlighted item · `[ ... ]` button or control · `v` dropdown ·
`<  >` carousel · `*` live indicator · `(Q)` search icon · `(+)` add to bag or
cart · `n` a live count taken from the sample data. Lot titles, prices and
times in the wireframes are placeholders.

---

## 3. Option 1 — the reference skeleton (read-only)

These wireframes show the structure the new options must **not** repeat. They
were drawn from the Option 1 code (`components/concept-b`).

### Option 1 homepage
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ UTILITY STRIP (dark)  Deliver to Riyadh | trust ticker | Sell  Help  AR    │
├────────────────────────────────────────────────────────────────────────────┤
│ LOGO  [Category v| Search lots, brands, categories ][Go]  Acct Watch Cart  │
├────────────────────────────────────────────────────────────────────────────┤
│ [All categories v]  Live now  Auctions  Buy Now  Ending soon  Bulk  Sellers│
├──────────────────────────────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ENDING UNDER AN HOUR    │
│ ░░░░░░░░░ HERO CAROUSEL  (8/12 width) ░░░░░░░░░░ │ ░ lot  SAR 180    9m    │
│ ░░░░░░░░ brand · live · pallets slides ░░░░░░░░░ │ ░ lot  SAR 540   46m    │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░ lot  SAR 1,480 18m    │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ├─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ BUY NOW DEAL            │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░ -40%  SAR 240 [Add]  │
├──────────────────────────────────────────────────┴─────────────────────────┤
│ TRUST STRIP   deposit | condition graded | secure payment | delivery       │
├────────────────────────────────────────────────────────────────────────────┤
│ CATEGORY TILES   [░][░][░][░][░][░][░][░]   all 8 in one row               │
│ AUCTIONS RAIL    [card][card][card][card][card] >   ending | most bid      │
├────────────────────────────────────────────────────────────────────────────┤
│ ▒▒▒▒▒▒▒▒▒▒ LIVE BAND:  live lot photo | now bidding + coming up ▒▒▒▒▒▒▒▒▒▒ │
├────────────────────────────────────────────────────────────────────────────┤
│ BUY NOW DEALS    [card][card][card][card][card]   5 across                 │
│ PALLETS & BULK   [manifest card][manifest card][small lots]                │
│ SELLERS          stats band + [s][s][s][s][s]                              │
│ HOW IT WORKS (4 steps)  |  CONDITION GRADES                                │
│ FOOTER                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

The repeated pattern to avoid: a thin utility bar, logo plus a large central
search, a category bar, a large hero on the left beside two stacked side panels,
a trust strip, then rails and grids of the same vertical card.

### Option 1 browse
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER (3 tiers: utility strip / logo + search + actions / category bar)   │
├────────────────────────────────────────────────────────────────────────────┤
│ Home > Browse > Home Appliances                                            │
│ HOME APPLIANCES   6 results                                                │
│ [Ending < 1h] [Discounted] [Grade A] [In stock]          quick filters     │
├──────────────────────┬─────────────────────────────────────────────────────┤
│ FILTERS (sticky)     │ 1-8 of 29   [chip x]            Sort v  [grid|list] │
│ Category             │                                                     │
│ [x] Appliances   6   │  [card]     [card]     [card]     [card]            │
│ [ ] Kitchen      4   │  ░░░░░░     ░░░░░░     ░░░░░░     ░░░░░░            │
│ Condition grade      │  ░░░░░░     ░░░░░░     ░░░░░░     ░░░░░░            │
│ [ ] New  [x] A       │  title      title      title      title             │
│ Price  o------o      │  price      price      price      price             │
│ Item type            │                                                     │
│ Ending within        │  [card]     [card]     [card]     [card]            │
│ Availability         │                                                     │
│                      │             < 1  2  3  4 >   numbered pages         │
└──────────────────────┴─────────────────────────────────────────────────────┘
```

### Option 1 product and auction detail (one shared layout)
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER (3 tiers)                                                           │
│ Home > Category > Lot title                                                │
├─────────────────────────┬──────────────────────────┬───────────────────────┤
│ GALLERY (sticky)        │ TITLE                    │ BUY / BID BOX (sticky)│
│ ░░░░░░░░░░░░░░░░░░░░░░░ │ grade · seller · watchers│ price / current bid   │
│ ░░░░░░░░░░░░░░░░░░░░░░░ │ highlights               │ countdown             │
│ ░░░░░░░░░░░░░░░░░░░░░░░ │ details                  │ qty / quick bids      │
│ ░░░░░░░░░░░░░░░░░░░░░░░ │ specifications           │ [Add to cart]         │
│ [░][░][░][░]            │ description              │ [Buy now] / [Bid]     │
├─────────────────────────┴──────────────────────────┴───────────────────────┤
│ TABS  details | specs | delivery & returns   (auction: history | terms)    │
│ RELATED RAIL   [card][card][card][card][card] >                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Option 1 live auction
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER (3 tiers)                                                           │
│ LIVE · 1,284 watching   EVENT TITLE   presenter · hosted by seller         │
├──────────────────────────────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░ LIVE STAGE ░░░░░░░░░░░░░░░░░░ │ BID PANEL               │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ current bid             │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ [ Bid SAR 1,265 ]       │
│ CURRENT LOT   title · bid · status               ├─────────────────────────┤
│                                                  │ ACTIVITY FEED           │
│                                                  │ bidder · amount · time  │
├──────────────────────────────────────────────────┴─────────────────────────┤
│ LOTS TABLE (order of sale)                                                 │
│ MORE LIVE EVENTS   [event card]  [event card]                              │
└────────────────────────────────────────────────────────────────────────────┘
```

### Option 1 seller storefront
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER (3 tiers)                                                           │
├────────────────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░ COVER PHOTO (full width) ░░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────────────────────────────────────────────────────────┤
│ [ IDENTITY CARD overlaps the cover: name · tagline | 3 stats | trust ]     │
├──────────────────────┬─────────────────────────────────────────────────────┤
│ FILTERS (sidebar)    │  [card]     [card]     [card]     [card]            │
│ ...                  │  [card]     [card]     [card]     [card]            │
├──────────────────────┴─────────────────────────────────────────────────────┤
│ ABOUT THE SELLER                                                           │
└────────────────────────────────────────────────────────────────────────────┘
```

### Option 1 mobile homepage
```text
┌──────────────────────────────────┐
│ [=] LOGO           Watch  Cart   │
├──────────────────────────────────┤
│ [ Search lots, brands...     ]   │
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
└──────┴──────┴──────┴──────┴──────┘
```

---

## 4. Option 2 — Visual Marketplace (slot `concept-a`)

### A. Design objective

A visual-first marketplace where photography drives discovery. Large product
images, an image-led category mosaic and a calmer, more spacious page rhythm let
customers browse Khazna the way they browse a well-merchandised store. Search,
filters, auctions, live sales, bag and watchlist stay one step away. It should
feel modern, premium and product-led, and remain a usable marketplace rather
than an editorial magazine.

### B. Desktop homepage wireframe
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Shop v  Auctions  Live*  Sellers   LOGO              (Q)  Watch  Acct  Bag │
│   (one transparent bar over the hero; solid after scrolling)               │
├────────────────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░ FULL-BLEED PHOTOGRAPH  ·  100% width x ~560px ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Graded returns, surplus & pallets        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ HEADLINE (two lines)                     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ [ What are you looking for?     (Q) ]    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ (░)Appliances (░)Kitchen (░)Furniture    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Shop Buy Now ->    Browse auctions ->    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░┌─────────────┐░░┌─────────────┐░░┌─────────────┐░░┌─────────────┐░░░░░ │
│ ░░░│ FEATURED NOW│░░│░░░░░░░░░░░░░│░░│░░░░░░░░░░░░░│░░│░░░░░░░░░░░░░│░░░░░ │
├────────────────────────────────────────────────────────────────────────────┤
│    │░░░░░░░░░░░░░│  │░░░░░░░░░░░░░│  │░░░░░░░░░░░░░│  │░░░░░░░░░░░░░│      │
│    │ Lot title   │  │ Lot title   │  │ Lot title   │  │ Lot title   │      │
│    │ SAR 240  (+)│  │ Bid SAR 540 │  │ SAR 95   (+)│  │ Bid SAR 180 │   >  │
│    └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │
│    FEATURED NOW: four large cards straddle the hero's bottom edge          │
├────────────────────────────────────────────────────────────────────────────┤
│ SHOP BY CATEGORY   photo mosaic, all 8                   All categories -> │
├─────────────────────────────────────┬──────────────────┬───────────────────┤
│ ░░░░░░ HOME APPLIANCES  2x2 ░░░░░░░ │ ░░░ KITCHEN ░░░░ │ ░░░ FURNITURE ░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░ tall 1x2 ░░░ │ ░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ ├───────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░ FASHION ░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │
├──────────────────┬──────────────────┼──────────────────┼───────────────────┤
│ ░ TOOLS & DIY ░░ │ ░░ AUTOMOTIVE ░░ │ ░ ELECTRONICS ░░ │  BULK & PALLETS ░ │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │
├──────────────────┴──────────────────┴──────────────────┴───────────────────┤
│ FEATURED MARKETPLACE   alternating wide / tall showcases                   │
├──────────────────────────────────────────────────┬─────────────────────────┤
│ ░░░░ WIDE: pallet lot + manifest thumbnails ░░░░ │ ░░░░░░░░ TALL ░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ Pallet · 42 units · grade mix   [Bid SAR 3,900]  │ Lot title  SAR 240 (+)  │
├─────────────────────────┬────────────────────────┴─────────────────────────┤
│ ░░░░░░░░ TALL ░░░░░░░░░ │ ░░░░░░░░░░░░░░ WIDE: auction lot ░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Lot title  SAR 180 (+)  │ Lot title · current bid SAR 1,240 · 2h 14m [Bid] │
├─────────────────────────┴──────────────────────────────────────────────────┤
│ ON THE BLOCK   auctions, closing soonest first                        <  > │
├────────────────────────────────────────────────┬───────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░  CLOSING 46m 04s    │ ░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░  Lot title          │ ░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░  Current bid SAR 540│ ░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░  9 bids · Grade C   │ ░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░  [ Place bid ]      │ ░░░░░░░░░░░░░░░░░░░░░░░░> │
├────────────────────────────────────────────────┴───────────────────────────┤
│ READY TO BUY   Buy Now, three across                   Shop all Buy Now -> │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ ░░░░░░░░ -40% ░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ Lot title              │ Lot title               │ Lot title               │
│ Grade A · Seller       │ Grade B · Seller        │ New · Seller            │
│ SAR 240  was 400  (+)  │ SAR 95            (+)   │ SAR 1,150         (+)   │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ MEET THE SELLERS   seller cover photos                                <  > │
├──────────────────────────────┬──────────────────────────────┬──────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░ │
│ ░░░░░░░ SELLER COVER ░░░░░░░ │ ░░░░░░░ SELLER COVER ░░░░░░░ │ ░░░░░░░░░░░░ │
│ Seller name        * LIVE    │ Seller name                  │ Seller...    │
│ City · 12 lots               │ City · 6 lots                │ City    >    │
├──────────────────────────────┴──────────────────────────────┴──────────────┤
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░ CURRENT LIVE LOT ░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒ LIVE NOW  ·  1,284 watching  ·  lot 5 of 10 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Lot title  ·  current bid SAR 1,240 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ [ Join the live room ] ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
├────────────────────────────────────────────────────────────────────────────┤
│ HOW KHAZNA WORKS                                                           │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ ░░░░░░░ PHOTO ░░░░░░░░ │ ░░░░░░░░ PHOTO ░░░░░░░░ │ ░░░░░░░░ PHOTO ░░░░░░░░ │
│ 1 Find it              │ 2 Check the grade       │ 3 Delivery or pickup    │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ CONDITION GRADES   [New]  [A]  [B]  [C]   one line each                    │
│ FOOTER                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

### C. Homepage section order

1. One transparent header bar over the hero
2. **Full-bleed visual hero** — photograph across the full width (~560px, capped
   at ~72% of the viewport height). The content block sits bottom-start and
   carries the discovery search.
3. **Featured now** — four large product cards that straddle the hero's bottom
   edge (the overlap is part of the structure)
4. **Shop by category** — an asymmetric photo mosaic of all 8 categories
5. **Featured marketplace** — alternating wide/tall showcase rows (four lots:
   Buy Now and auction, including a pallet with manifest thumbnails)
6. **On the block** — a scroll-snap gallery of wide auction showcases, closing
   soonest first
7. **Ready to buy** — Buy Now as large cards, three across, with price-drop
   stickers
8. **Meet the sellers** — a carousel of large seller cover cards
9. **Live now** — a centred full-bleed banner of the live room
10. **How Khazna works** — three photographic steps plus the condition-grade scale
11. Footer

Hero proportions: 100% width × ~560px; content block ~40% wide, anchored
bottom-start; the featured strip overlaps the lower edge by ~140px.

### D. Header / navigation structure

- **One bar (72px)**, transparent over the home hero and solid white elsewhere
  and after scrolling. Text navigation at the start (Shop ▾, Auctions, Live,
  Sellers), the **logo centred**, and icons at the end (Search, Watchlist,
  Account, Bag).
- **Shop ▾ opens a photo mega panel**: 8 category photo tiles with lot counts,
  plus a "Ways to buy" column (Buy Now · Timed auctions · Live · Bulk & pallets).
- There is no utility strip, category bar or header search field. Trust and
  delivery notes move into the content ("How Khazna works", product pages, the bag).
- **Different from Option 1:** one transparent bar with a centred logo and split
  navigation, instead of three stacked tiers. The text mega menu becomes a photo
  panel, and search leaves the header.

### E. Search structure

- **Home:** a large discovery field sits inside the hero's content block, with
  category photo chips and popular searches beneath it.
- **Everywhere else:** the header search icon opens a **full-screen visual
  search**. Before typing it shows popular searches and a category photo grid.
  While typing it shows matching lot thumbnails (photo, price or current bid,
  time left) plus matching categories and sellers. Enter goes to Browse.
- **Browse:** the query becomes the page title, with an inline refine field in
  the category banner.
- **Different from Option 1:** search is an in-hero element and a full-screen
  destination, not a permanent header bar with a category scope.

### F. Category discovery

- **Home:** an asymmetric photo mosaic. The largest category takes a 2×2 tile,
  the next a tall 1×2 tile, two share a split column, and four sit in a row.
  Each tile is a full-bleed category photo with its name and lot count.
- **Header:** the Shop photo panel.
- **Browse:** a photo banner for the current category, plus round category photo
  chips to switch category.
- **Mobile:** a "stories" rail of category photos and a full-screen visual menu.
- All photos come from the shared data (each category already has one).
- **Different from Option 1:** photo-led mosaic and panels instead of a text
  mega menu and one row of eight equal tiles.

### G. Product-card architecture — "image-first portrait card"

- **Image position:** top, portrait 4:5, full-bleed to the card edges, about 72%
  of the card's height.
- **On the image:** sale-type tag (top-start) and watch heart (top-end).
  Auctions carry a translucent band along the bottom of the photo with time left
  and current bid. Discounted Buy Now lots carry a price-drop sticker.
- **Information order below the image:** title (two lines), then one meta line
  "Grade A · Seller name", then the price row.
- **CTA position:** a round icon button at the end of the price row (bag or
  gavel). On desktop hover it expands to "Add to bag" or "Place bid".
- **Auction information:** time and current bid on the photo band; bid count in
  the price row.
- **Seller information:** seller name in the meta line only; no avatar row.
- **Variant:** a wide showcase card (landscape; photo 60%, details 40%) for the
  auction gallery and the featured rows.
- **Grid composition:** three across on desktop, two on tablet, and one large or
  two small on phones, with generous gutters.

### H. Browse-page wireframe
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Shop v  Auctions  Live*  Sellers   LOGO              (Q)  Watch  Acct  Bag │
├────────────────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░ CATEGORY PHOTO BANNER  ·  ~240px ░░░░░░░░░░░░░░░░░░░░ │
│ HOME APPLIANCES  ·  6 lots             ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ [ refine: search this category ]       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────────────────────────────────────────────────────────┤
│ (░)All (░)Appliances (░)Kitchen (░)Furniture (░)Fashion (░)Tools (░)Auto > │
├────────────────────────────────────────────────────────────────────────────┤
│ [All|Auctions|Buy Now]  Condition v  Price v  Ending v  Type v             │
│ [All filters]   Grade A  x   Under SAR 500  x                  Sort v      │
│   (sticky bar; each v opens a popover; All filters opens a drawer)         │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ Lot title              │ Lot title               │ Lot title               │
│ Grade A · Seller       │ Grade B · Seller        │ Grade A · Seller        │
│ SAR 240          (+)   │ Bid SAR 540      (+)    │ SAR 95           (+)    │
├────────────────────────┼─────────────────────────┼─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ Lot title              │ Lot title               │ Lot title               │
│ Grade A · Seller       │ Grade B · Seller        │ Grade A · Seller        │
│ SAR 240          (+)   │ Bid SAR 540      (+)    │ SAR 95           (+)    │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ ░░░░░░░░░ VISUAL INTERRUPT: pallets showcase or live-now banner ░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ...                    │ ...                     │ ...                     │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│                                                                            │
│            Showing 12 of 29   ─────────o───────   [ Load more ]            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

- A category photo banner and category photo chips replace the text title.
- Filters are a horizontal sticky bar of popovers plus an "All filters" drawer
  from the end side. There is no permanent sidebar.
- Results are large cards, three across, with a full-width visual interrupt
  every two rows.
- Progressive "Load more" with a progress line replaces numbered pages.

### I. Product-detail wireframe
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Shop v  Auctions  Live*  Sellers   LOGO              (Q)  Watch  Acct  Bag │
├────────────────────────────────────────────────────────────────────────────┤
│ Home / Home & Kitchen / Lot title                                          │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░ PHOTO 1 ░░░░░░░ │ ░░░░░░░ PHOTO 2 ░░░░░░░ │ ░░░░░░░ PHOTO 3 ░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ FILMSTRIP GALLERY: scroll for photos 4-6, click for lightbox        1/6  > │
├─────────────────────────────────────────────┬──────────────────────────────┤
│ LOT TITLE (large)                           │ SAR 240  was SAR 400  -40%   │
│ Seller name · Riyadh                        │ Qty  [ -  1  + ]             │
│ [Grade A]  condition grade disclosed        │ [ Add to bag ]  [ Buy now ]  │
│ Single item · 8 in stock                    │ Delivery priced at checkout  │
│ [Watch]  [Share]                            │ Pickup available             │
├─────────────────────────────────────────────┴──────────────────────────────┤
│              HIGHLIGHTS                                                    │
│              CONDITION   [New] [A] [B] [C]                                 │
│                          this lot: A                                       │
│              SPECIFICATIONS                          ┌───────────────────┐ │
│              DELIVERY & PICKUP                       │ ░ SAR 240         │ │
│              SELLER  cover · name                    │ [ Add to bag ]    │ │
│                      [Visit store]                   └───────────────────┘ │
│              (centred column)                          floating card       │
├────────────────────────────────────────────────────────────────────────────┤
│ MORE LIKE THIS                                                             │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ Lot title  SAR 180 (+) │ Lot title  SAR 95 (+)   │ Lot title  SAR 60 (+)   │
└────────────────────────┴─────────────────────────┴─────────────────────────┘
```

- A horizontal **filmstrip gallery**: three large photos visible, scroll for
  more, click for the lightbox.
- A two-part **purchase band** below it.
- Content then continues as a centred single column.
- A **floating purchase card** appears in the bottom-end corner once the band
  has scrolled away.

### J. Auction-detail wireframe
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Shop v  Auctions  Live*  Sellers   LOGO              (Q)  Watch  Acct  Bag │
├────────────────────────────────────────────────────────────────────────────┤
│ Home / Auctions / Lot title                                                │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░ PHOTO 1 ░░░░░░░ │ ░░░░░░░ PHOTO 2 ░░░░░░░ │ ░░░░░░░ PHOTO 3 ░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ FILMSTRIP GALLERY (same frame as product pages)                     1/5  > │
├─────────────────────────────────────────────┬──────────────────────────────┤
│ * AUCTION  ·  ENDS IN 2h 14m                │ CURRENT BID  SAR 1,240       │
│ LOT TITLE (large)                           │ You are winning              │
│ Seller name · [Grade B]                     │ [1,265] [1,290] [1,340]      │
│ 23 bids · 8 bidders · 41 watching           │ [ SAR ____ ] [ Place bid ]   │
│ Pallet · 42 units                           │ Set a maximum bid  >         │
│ [Watch]  [Share]                            │ Deposit covered by wallet    │
│                                             │ Buy now SAR 1,900 (both)     │
├─────────────────────────────────────────────┴──────────────────────────────┤
│              BID HISTORY   last 5  [Show all]                              │
│              PALLET CONTENTS  photo grid                                   │
│              [░][░][░][░][░][░]  qty under each                            │
│              CONDITION  ·  SPECIFICATIONS            ┌───────────────────┐ │
│              AUCTION TERMS                           │ 2h 14m  SAR 1,240 │ │
│                late bids extend 5 min                │ [ Bid SAR 1,265 ] │ │
│                deposit · payment window              └───────────────────┘ │
│              (centred column)                          floating bid card   │
├────────────────────────────────────────────────────────────────────────────┤
│ MORE ON THE BLOCK   wide auction showcases                            <  > │
└────────────────────────────────────────────────────────────────────────────┘
```

- The same visual frame as product detail.
- The end side of the band becomes the bid module: current bid, quick bids,
  custom amount, maximum bid, deposit, and Buy Now on "both" lots.
- Pallet contents show as a photo grid of manifest items.
- The floating corner card becomes a bid card.

### K. Live-auction wireframe — "theatre"
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Shop v  Auctions  Live*  Sellers   LOGO              (Q)  Watch  Acct  Bag │
│   (dark page treatment in the live room)                                   │
├────────────────────────────────────────────────────────────────────────────┤
│ * LIVE   EVENT TITLE   hosted by Seller · presenter         1,284 watching │
├────────────────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Lot 5 of 10 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░ CURRENT LOT PHOTO  ·  16:9 stage, full width ░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ▒▒▒▒▒▒▒▒▒▒▒ Lot title  ·  CURRENT BID SAR 1,240  ·  GOING ONCE ▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ [ Bid SAR 1,265 ] ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
├────────────────────────────────────────────────────────────────────────────┤
│ LOT REEL   all 10 lots in order of sale                               <  > │
│ [░░░]  [░░░]  [░░░]  [░░░]  [▓▓▓]  [░░░]  [░░░]  [░░░]  [░░░]  [░░░]       │
│ 1 sold 2 sold 3 --   4 sold 5 NOW  6 next 7      8      9      10          │
├─────────────────────────────────────────────┬──────────────────────────────┤
│ ACTIVITY                                    │ ABOUT THIS EVENT             │
│ Bidder 7   SAR 1,240   now                  │ Host: Seller · presenter     │
│ You        SAR 1,220   12s                  │ Bids are binding once placed │
│ Bidder 3   SAR 1,200   31s                  │ Deposit covered by wallet    │
│                                             │ UPCOMING  [event] [event]    │
└─────────────────────────────────────────────┴──────────────────────────────┘
```

- A full-width 16:9 stage, with the lot, bid status and bid button overlaid on
  the photo.
- A horizontal **lot reel** of all 10 lots with their status.
- Activity and event details sit underneath.

### L. Seller-storefront wireframe — "brand boutique"
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Shop v  Auctions  Live*  Sellers   LOGO              (Q)  Watch  Acct  Bag │
├────────────────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░ SELLER COVER PHOTO  ·  full bleed, ~420px ░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ SELLER NAME                            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ tagline · City                         ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ * LIVE NOW  [ Enter the live room ]    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────────────────────────────────────────────────────────┤
│ (RS)  Member since 2023 · 14 Buy Now · 6 auctions · Pickup: City  [Share]  │
├────────────────────────────────────────────────────────────────────────────┤
│ SHOP THIS SELLER   (░)Appliances  (░)Electronics  (░)Kitchen  (░)Tools     │
├────────────────────────────────────────────────────────────────────────────┤
│ ▒▒▒▒▒▒▒▒▒▒▒ LIVE FROM THIS SELLER: centred banner (when live) ▒▒▒▒▒▒▒▒▒▒▒▒ │
├────────────────────────────────────────────────────────────────────────────┤
│ [All|Auctions|Buy Now]  Condition v  Price v  Sort v      [All filters]    │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ Lot title              │ Lot title               │ Lot title               │
│ SAR 240          (+)   │ Bid SAR 540      (+)    │ SAR 95           (+)    │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│                      Showing 6 of 20   [ Load more ]                       │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ABOUT                                │
│ ░░░░░░░░░ WAREHOUSE PHOTO ░░░░░░░░░ │ about text                           │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ PICKUP   address · hours             │
└─────────────────────────────────────┴──────────────────────────────────────┘
```

- A campaign-style full-bleed cover, with the seller's name and tagline on the
  photo.
- A slim profile strip, then the seller's categories as photo chips.
- The seller's lots in the large-card grid.
- About and pickup, with the warehouse photo.

### M. Mobile homepage wireframe
```text
┌──────────────────────────────────┐
│ [=]           LOGO      (Q)  Bag │
│  (transparent over the hero)     │
├──────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░ FULL-SCREEN HERO ░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Graded returns, surplus          │
│ HEADLINE (two lines)             │
│ [ What are you looking for?  ]   │
│ Shop Buy Now ->                  │
├──────────────────────────────────┤
│ (░) (░) (░) (░) (░) (░)    >     │
│ Appl Kitc Furn Fash Tool Auto    │
│  category stories                │
├──────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░ LARGE CARD, full width ░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Lot title                        │
│ Grade A · Seller                 │
│ SAR 240                     (+)  │
├────────────────┬─────────────────┤
│ ░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░ │
│ Lot title      │ Lot title       │
│ SAR 95    (+)  │ Bid SAR 180 (+) │
├────────────────┴─────────────────┤
│ ON THE BLOCK   wide cards    >   │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├──────────────────────────────────┤
│ ▒▒▒▒▒▒▒ LIVE NOW banner ▒▒▒▒▒▒▒▒ │
├──────────────────────────────────┤
│ MEET THE SELLERS   covers    >   │
│ HOW KHAZNA WORKS   3 photos      │
│ FOOTER                           │
│  (no bottom tab bar)             │
└──────────────────────────────────┘
```

Mobile strategy: **an image-led feed.**

- A transparent top bar sits over a full-screen hero, followed by a category
  stories rail.
- Below that, a single-column feed of large cards, broken up by two-across
  pairs and full-bleed sections.
- **No bottom tab bar.** The menu button opens a full-screen visual menu
  (category photos, Auctions, Live, Sellers, Watchlist, Account, language).
- Bag and search stay in the top bar.
- Browse adds a floating "Filter & sort" pill; product pages use a floating
  price-and-bag button.

### N. Signature components

1. Full-bleed hero with in-hero discovery search and a product strip that
   straddles the hero edge.
2. Asymmetric category photo mosaic (with the photo mega panel and mobile
   stories rail).
3. Image-first portrait card with the auction band on the photo.
4. Filmstrip gallery plus a floating corner purchase or bid card.
5. Full-screen visual search and visual menu.

Visual personality (secondary, not a differentiator): calm, gallery-like
surfaces, large photography, generous spacing.

---

## 5. Option 3 — Marketplace Hub (slot `concept-c`)

### A. Design objective

A search- and discovery-first marketplace platform. It works like a hub, with
three parts:

- a persistent navigation rail holding the full category tree,
- a search deck that is the first thing you use,
- a dashboard of dense, scannable modules: deals, ending soon, popular, sellers,
  live and recently added.

A frequent buyer can reach any lot, auction, seller or deal in one or two
actions. It should feel fast, practical and commercial.

### B. Desktop homepage wireframe
```text
┌──────────────────────┬─────────────────────────────────────────────────────┐
│ LOGO                 │ Hub                         Watch 2   Cart 1   Acct │
│ (search docks here   ├─────────────────────────────────────────────────────┤
│  on scroll)          │ * LIVE  Electronics clearance · lot 5/10  [Join]    │
│ MARKETPLACE          ├─────────────────────────────────────────────────────┤
│  Hub                 │ FIND ANYTHING ON KHAZNA                             │
│  All lots        29  │ [All] [Auctions] [Buy Now] [Sellers] [Live]         │
│  Auctions        11  │ [ Search lots, brands, sellers...    ] [Search]     │
│  Buy Now         18  │ Trending:  robot vacuum · office chair · pallets    │
│                      ├────────────┬────────────┬─────────────┬─────────────┤
│  * Live now       1  │ LIVE NOW   │ ENDING <1H │ DEALS       │ NEW THIS WK │
│  Ending soon      n  │ 1 event    │ n lots     │ n lots      │ n lots      │
│  New arrivals        │ 1,284 watch│ soonest -> │ up to -40%  │ newest ->   │
│                      ├────────────┴────────────┴─────────────┴─────────────┤
│  Bulk & pallets   4  │ BROWSE CATEGORIES                           All ->  │
│                      ├────────────┬────────────┬─────────────┬─────────────┤
│ CATEGORIES           │ ░ Applian. │ ░ Kitchen  │ ░ Furniture │ ░ Fashion   │
│  v Appliances     6  │ 6 lots     │ 4 lots     │ 4 lots      │ 4 lots      │
│      Auctions     n  │ Auct · Buy │ Auct · Buy │ Auct · Buy  │ Auct · Buy  │
│      Buy Now      n  ├────────────┼────────────┼─────────────┼─────────────┤
│  > Kitchen        4  │ ░ Tools    │ ░ Auto     │ ░ Electron. │ ░ Pallets   │
│  > Furniture      4  │ 3 lots     │ 3 lots     │ 1 lot       │ 4 lots      │
│                      ├────────────┴────┬───────┴─────────┬───┴─────────────┤
│  > Fashion        4  │ DEALS · BUY NOW │ ENDING SOON     │ POPULAR NOW     │
│  > Tools & DIY    3  │ ░ Lot    -30%   │ ░ Lot    9m 11s │ ░ Lot   31 bids │
│  > Automotive     3  │   SAR 240   [+] │   SAR 180  [Bid]│   SAR 1,480 [>] │
│  > Electronics    1  │ ░ Lot    -25%   │ ░ Lot   18m 23s │ ░ Lot   18 bids │
│  > Bulk pallets   4  │   SAR 95    [+] │   SAR 1,480[Bid]│   SAR 1,240 [>] │
│ SELLERS              │ ░ Lot    -20%   │ ░ Lot   46m 04s │ ░ Lot   11 bids │
│  * Red Sea Trading   │   SAR 60    [+] │   SAR 540  [Bid]│   SAR 180   [>] │
│  Khazna Direct       │ View all ->     │ View all ->     │ View all ->     │
│                      ├─────────────────┴────────┬────────┴─────────────────┤
│  Rawabi · Majd ...   │ SELLERS                  │ LIVE & UPCOMING          │
│ MY KHAZNA            │ (RS) Red Sea     * LIVE  │ * LIVE  Electronics      │
│  Watchlist        2  │   Jeddah · 6 auctions    │   lot 5/10 · 1,284 [Join]│
│  Bids & watching     │ (KD) Khazna Direct       │ UPCOMING  Furniture      │
│  Orders · Wallet     │   Riyadh · 9 Buy Now     │   [ Remind me ]          │
│ deposit · graded     │ (RW) Rawabi Home ...     │ UPCOMING  Kitchen        │
│ secure payment · AR  │ All sellers ->           │   [ Remind me ]          │
│                      ├──────────────────────────┴──────────────────────────┤
│                      │ RECENTLY ADDED   compact tiles, 6 across            │
│                      │ [░░░] [░░░] [░░░] [░░░] [░░░] [░░░]                 │
│                      │ title title title title title title                 │
│                      ├─────────────────────────────────────────────────────┤
│                      │ PALLETS & BULK   rows: units · grade mix · price    │
│                      ├─────────────────────────────────────────────────────┤
│                      │ BUYING ON KHAZNA   1 Search  2 Check the grade      │
│                      │   3 Bid or buy  4 Delivery or pickup  · grades      │
├──────────────────────┴─────────────────────────────────────────────────────┤
│ FOOTER (compact)                                                           │
└────────────────────────────────────────────────────────────────────────────┘
```

### C. Homepage section order

1. **App shell** — a left navigation rail (persistent) and a slim top bar (page
   title, watchlist, cart, account)
2. A slim live announcement line (one row)
3. **Search & discovery deck** — a large search field with scope tabs (All ·
   Auctions · Buy Now · Sellers · Live) and trending searches
4. **Hub counters** — Live now · Ending within 1 hour · Buy Now deals · New this
   week (each opens a filtered browse)
5. **Category grid** — 8 compact tiles (4×2) with counts and Auctions / Buy Now
   shortcuts
6. **Module row of three equal lists:** Deals · Buy Now | Ending soon | Popular now
7. **Module row of two equal lists:** Seller directory | Live & upcoming events
8. **Recently added** — compact tiles, six across
9. **Pallets & bulk** — manifest summary rows
10. **Buying on Khazna** — four inline steps and the grade legend
11. Compact footer

There is no image hero. The search deck (full main-column width, ~240px,
content top-start) is the entry point, and it does not dominate the page.

### D. Header / navigation structure

- **App shell with a left navigation rail.** It is 240px wide on wide screens,
  becomes a 72px icon rail at 1024–1279px and on detail and live pages, and
  expands on demand. It is sticky and full height, and holds (top to bottom):
  - the logo, then the search field (see E);
  - **Marketplace:** Hub, All lots, Auctions, Buy Now, Live now, Ending soon,
    New arrivals, Bulk & pallets, each with a count;
  - **Categories:** a tree of all 8 categories with counts, each expanding to
    its Auctions / Buy Now branches;
  - **Sellers:** all 5, with a live indicator;
  - **My Khazna:** Watchlist, Bids & watching, Orders, Wallet (links into the
    account);
  - at the foot: trust notes (bidding deposit, condition graded, secure
    payment) and the language switch.
- **Slim top bar** over the main column: page title or breadcrumb at the start;
  watchlist, cart and account at the end.
- **Different from Option 1:** navigation is a vertical rail, not three
  horizontal tiers. The category tree is always visible instead of hidden in a
  mega menu, and account shortcuts live in the navigation. There is no utility
  strip or category bar.

### E. Search structure

- **Search lives at the top of the navigation rail** on every page, with a scope
  selector and a "/" keyboard shortcut.
- **Home:** the same search appears enlarged as the search deck at the top of
  the main column. When the deck scrolls away, the search docks back into the
  rail, so there is only ever one search field on screen.
- **Suggestions** open as a multi-column panel: Suggestions · Categories ·
  Sellers · Top lots (thumbnail, price or current bid, time left). The panel is
  fully keyboard-navigable, and recent searches are kept locally.
- **Browse** keeps the query editable inside the sticky filter toolbar.
- **Different from Option 1:** search is part of the navigation rail and the
  page's first module, not a centred bar inside a three-tier header.

### F. Category discovery

- A category tree in the rail, with counts, expandable, and the current category
  highlighted. It is available on every page.
- A home category grid of 4×2 compact tiles: small photo, name, counts, and
  Auctions / Buy Now shortcuts.
- On browse, the tree doubles as the category filter.
- **Mobile:** a full-screen category tree from the hub menu, plus a shortcut
  grid on the home page.
- **Different from Option 1:** a persistent hierarchical tree and a compact grid
  instead of a mega menu and a tile row.

### G. Product-card architecture — "row card" and "compact tile"

**Row card** (primary; used in modules, browse and seller pages):

- **Image position:** a small square thumbnail at the start (88px in modules,
  120px in browse).
- **Information order:** title (one line), then chips (grade · item type ·
  seller and city), then for auctions the current bid and bid count, or for
  Buy Now the price, was-price and stock.
- **Data column:** time left, in an urgency colour, for auctions; price for Buy
  Now.
- **CTA position:** at the end, a compact Bid or Add button plus a watch icon.
  Clicking the row opens the quick view (desktop browse) or the lot page.

**Compact tile** (secondary; recently added and the seller overview): 1:1 image,
two-line title, price or bid, and a time chip.

- **Browse:** the list shows sortable column headers (Lot · Condition · Seller ·
  Price/Bid · Time left).
- **Different from Option 1:** horizontal rows and compact tiles instead of
  vertical image-top cards.

### H. Browse-page wireframe
```text
┌──────────────────────┬─────────────────────────────────────────────────────┐
│ LOGO                 │ Browse > Home Appliances      Watch 2  Cart 1  Acct │
│ [ Search...    / ]   ├─────────────────────────────────────────────────────┤
│ MARKETPLACE          │ HOME APPLIANCES · 6 results  [All|Auct|Buy|Live]    │
│  Hub                 │ View [List|Grid]    < 1/1 >    per page 20 v        │
│  All lots        29  ├─────────────────────────────────────────────────────┤
│  Auctions        11  │ Condition v Type v Price v Ending v Stock v Sort v  │
│  Buy Now         18  │ Quick: [Ending<1h] [Deals] [Grade A] [Pallets]      │
│  * Live now       1  │ Active: Grade A x      (toolbar is sticky)          │
│                      ├──────────────────────────────────┬──────────────────┤
│ CATEGORIES           │ LOT              GRADE  BID/PRICE│ QUICK VIEW       │
│  > Appliances  <  6  ├──────────────────────────────────┤ ░░░░░░░░░░░░░░░░ │
│  > Kitchen        4  │ ░ Lot title        C    SAR 540  │ ░ SELECTED LOT ░ │
│  > Furniture      4  │   Seller · City    46m     [Bid] │ ░░░░░░░░░░░░░░░░ │
│  > Fashion        4  │ ░ Lot title        A  SAR 1,480  │ Lot title        │
│  > Tools & DIY    3  │   Seller · City    18m     [Bid] │ Grade A · Seller │
│  > Automotive     3  │ ░ Lot title        B  SAR 2,100  │ SAR 1,480 · 18m  │
│  > Electronics    1  │   Seller · City    1d      [Bid] │ 31 bids 12 watch │
│  > Bulk pallets   4  │ ░ Lot title        A    SAR 240  │ [ Bid SAR 1,500 ]│
│ SELLERS              │   Seller · City   8 left   [+]   │ [Open full page] │
│  * Red Sea Trading   │ ░ Lot title      New    SAR 120  │ [ Watch ]        │
│  Khazna Direct ...   │   Seller · City   5 left   [+]   │                  │
└──────────────────────┴──────────────────────────────────┴──────────────────┘
```

- List-first results with a sticky **quick-view pane** (master–detail).
- Dropdown facets in a sticky toolbar, with quick filter chips.
- Sortable columns and a list ↔ compact-grid switch.
- A compact pager with a page-size setting.

### I. Product-detail wireframe — "listing sheet"
```text
┌──────┬─────────────────────────────────────────────────────────────────────┐
│ K    │ < Back to results   Lot 3 of 29   [< Prev] [Next >]      Cart  Acct │
│      ├─────────────────────────────────────────────────────────────────────┤
│ (Q)  │ ░ LOT TITLE · Grade A · Seller (Riyadh) · 8 in stock        [Watch] │
│      │ SAR 240  was 400    Qty [ - 1 + ]    [ Add to cart ]  [ Buy now ]   │
│ Hub  │   ^ LISTING SUMMARY STRIP: sticky at the top while scrolling        │
│      ├──────────────────────────────────┬──────────────────────────────────┤
│ Auc  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ KEY FACTS                        │
│ Buy  │ ░░░░░░░░░░ MAIN PHOTO ░░░░░░░░░░ │ Condition   Grade A              │
│ Liv  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ Meaning     grade guide line     │
│ Cat  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ Item type   Single item          │
│ Sel  │ [░░] [░░] [░░] [░░]              │ Seller      Seller · City        │
│      │                                  │ Delivery    priced at checkout   │
│ Me   │                                  │ Pickup      seller warehouse     │
│      │                                  │ Returns     seller's window      │
│      ├──────────────────────────────────┴──────────────────────────────────┤
│      │ [Specifications] [Condition report] [Seller & pickup] [Returns]     │
│      │   full-width tab content (tables)                                   │
│      ├─────────────────────────────────────────────────────────────────────┤
│      │ COMPARE SIMILAR LOTS      THIS LOT    LOT B      LOT C      LOT D   │
│      │ Price / bid               SAR 240     SAR 260    SAR 199    SAR 310 │
│      │ Grade                     A           B          A          New     │
│      │ Seller                    Seller      Seller     Seller     Seller  │
│      │ Sale type                 Buy Now     Auction    Buy Now    Buy Now │
│      │                                       [View]     [View]     [View]  │
│      ├─────────────────────────────────────────────────────────────────────┤
│      │ MORE FROM THIS SELLER   [░] [░] [░] [░] [░] [░]                     │
└──────┴─────────────────────────────────────────────────────────────────────┘
```

- Keeps the browse context: back to results, and previous / next lot.
- A sticky **listing summary strip** carries the price, quantity and actions.
- Key facts are shown as a table.
- Documentation sits in full-width tabs.
- A **comparison table** sets this lot against similar lots.

### J. Auction-detail wireframe — "lot sheet with bid ladder"
```text
┌──────┬─────────────────────────────────────────────────────────────────────┐
│ K    │ < Back to results   Lot 7 of 11   [< Prev] [Next >]      Cart  Acct │
│      ├─────────────────────────────────────────────────────────────────────┤
│ (Q)  │ ░ LOT TITLE · * LIVE · Grade B · Seller (Jeddah)          [Watch]   │
│      │ Ends in 02:14:33 (Thu 21:00)      Current bid SAR 1,240             │
│ Hub  │ 23 bids · 8 bidders · 41 watching               [ Place bid v ]     │
│ Auc  │   ^ LOT SUMMARY STRIP: sticky at the top while scrolling            │
│      ├──────────────────────────────────┬──────────────────────────────────┤
│ Buy  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ NEXT VALID BIDS (ladder)         │
│ Liv  │ ░░░░░░░░░░ MAIN PHOTO ░░░░░░░░░░ │ SAR 1,265   minimum    [Bid]     │
│ Cat  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ SAR 1,290   +1 step    [Bid]     │
│ Sel  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ SAR 1,315   +2 steps   [Bid]     │
│      │ [░░] [░░] [░░] [░░]              │ SAR 1,390   +5 steps   [Bid]     │
│ Me   │                                  │ Custom [ SAR _____ ]   [Bid]     │
│      │                                  │ Maximum bid (proxy)    [Set]     │
│      │                                  │ Deposit: covered by wallet       │
│      │                                  │ Late bids extend by 5 min        │
│      │                                  │ Buy now SAR 1,900      [Buy]     │
│      ├──────────────────────────────────┴──────────────────────────────────┤
│      │ [Bid history] [Specifications] [Condition] [Manifest] [Terms]       │
│      │   BIDDER       AMOUNT       TIME      TYPE                          │
│      │   Bidder 7     SAR 1,240    2m ago    normal                        │
│      │   You          SAR 1,220    5m ago    maximum (auto)                │
│      ├─────────────────────────────────────────────────────────────────────┤
│      │ COMPARE SIMILAR AUCTIONS  THIS LOT    LOT B      LOT C              │
│      │ Time left                 02:14:33    00:46:04   1d 03h             │
│      │ Current bid               SAR 1,240   SAR 540    SAR 2,100          │
│      │ Grade · seller            B · Seller  C · Seller A · Seller         │
└──────┴─────────────────────────────────────────────────────────────────────┘
```

- A summary strip with time left and current bid.
- A **bid ladder** of valid next amounts beside the gallery, plus a custom
  amount, maximum bid, deposit and Buy Now.
- Bid history as a data table in the tabs.
- Similar auctions compared side by side.

### K. Live-auction wireframe — "live schedule"
```text
┌──────┬─────────────────────────────────────────────────────────────────────┐
│ K    │ [ * LIVE: Electronics clearance ]  [ Upcoming 1 ]  [ Upcoming 2 ]   │
│ (Q)  ├─────────────────────────────────────────────────────────────────────┤
│      │ Host: Seller · presenter · 1,284 watching · lot 5 of 10 · [Rules]   │
│      ├────────────────┬──────────────────┬────────────────┬────────────────┤
│ Hub  │ CURRENT LOT    │ LOT 5 · Lot title│ BID            │ LAST BIDS      │
│ Auc  │ ░░░░░░░░░░░░░░ │ starting bid     │ Current        │ B7  1,240  now │
│ Buy  │ ░░░ PHOTO ░░░░ │ increment        │ SAR 1,240      │ You 1,220  12s │
│ Liv  │ ░░░░░░░░░░░░░░ │ 19 bids          │ [Bid 1,265]    │ B3  1,200  31s │
│ Cat  │ ░░░░░░░░░░░░░░ │ GOING ONCE       │ custom [___]   │ (full log: tab)│
│      ├────────────────┴──────────────────┴────────────────┴────────────────┤
│ Sel  │   ^ CURRENT LOT PINNED OPEN above the order of sale                 │
│      │ [Order of sale]  [Activity]  [Event info & rules]                   │
│ Me   ├─────────────────────────────────────────────────────────────────────┤
│      │ #   LOT            START      RESULT       BIDS   STATUS            │
│      │ 1   Lot title      SAR 150    SAR 310        14   Sold              │
│      │ 2   Lot title      SAR 60     SAR 120         9   Sold              │
│      │ 3   Lot title      SAR 180    -               0   Not sold          │
│      │ 4   Lot title      SAR 800    SAR 1,350      19   Sold              │
│      │ 5   Lot title      ...        SAR 1,240      19   LIVE (pinned)     │
│      │ 6   Lot title      SAR 400    -               -   Next              │
│      │ 7-10 ...                                          Staged            │
└──────┴─────────────────────────────────────────────────────────────────────┘
```

The live event is treated as a live-updating schedule:

- event tabs and a summary bar at the top,
- the **current lot pinned open** as a four-part band (photo · lot and status ·
  bid controls · last bids),
- the order of sale, activity and event info as full-width tabs.

### L. Seller-storefront wireframe — "seller profile with tabs"
```text
┌──────────────────────┬─────────────────────────────────────────────────────┐
│ LOGO                 │ Sellers > Red Sea Trading         Watch  Cart  Acct │
│ [ Search...    / ]   ├─────────────────────────────────────────────────────┤
│ MARKETPLACE          │ (RS) RED SEA TRADING CO.    Jeddah · since 2023     │
│  Hub                 │ 6 auctions · 14 Buy Now · * live now   [Pickup]     │
│  All lots        29  │   (compact profile header, no cover photo)          │
│  Auctions        11  ├─────────────────────────────────────────────────────┤
│  Buy Now         18  │ [Overview] [Auctions 6] [Buy Now 14] [Live] [About] │
│                      ├──────────────────────────┬──────────────────────────┤
│  * Live now       1  │ ENDING SOON (seller)     │ DEALS (seller)           │
│ CATEGORIES           │ ░ Lot   2h 14m   [Bid]   │ ░ Lot   -30%   [+]       │
│  > Appliances  <  6  │ ░ Lot   5h 02m   [Bid]   │ ░ Lot   -20%   [+]       │
│  > Kitchen        4  │ ░ Lot   1d 3h    [Bid]   │ ░ Lot   -10%   [+]       │
│                      ├──────────────────────────┴──────────────────────────┤
│  > Furniture      4  │ NEW FROM THIS SELLER   [░] [░] [░] [░] [░] [░]      │
│  > Fashion        4  ├─────────────────────────────────────────────────────┤
│  > Tools & DIY    3  │ ABOUT & PICKUP   address · hours · return window    │
│  > Automotive     3  ├─────────────────────────────────────────────────────┤
│  > Electronics    1  │ OTHER SELLERS   (KD) Khazna · (RW) Rawabi · (MJ)    │
│  > Bulk pallets   4  │   Auctions / Buy Now tabs use the list + quick view │
└──────────────────────┴─────────────────────────────────────────────────────┘
```

- A compact profile header, with no cover photo.
- Tabs: Overview (this seller's modules), Auctions, Buy Now, Live, and About &
  pickup.
- The listing tabs reuse the browse list and quick view.

### M. Mobile homepage wireframe
```text
┌──────────────────────────────────┐
│ [=] [ Search Khazna...   v] Cart │
│  (search IS the sticky top bar)  │
├──────────────────────────────────┤
│ [<1h] [Deals] [Auctions] [Buy] > │
│  (sticky quick-filter chips)     │
├────────────────┬─────────────────┤
│ LIVE NOW    1  │ ENDING <1H   n  │
│ DEALS       n  │ NEW          n  │
├───────┬────────┼────────┬────────┤
│ ░App  │ ░Kitch │ ░Furn  │ ░Fash  │
│ ░Tool │ ░Auto  │ ░Elec  │ ░Pall  │
├───────┴────────┴────────┴────────┤
│ DEALS                   View all │
│ ░ Lot title  -30%  SAR 240  [+]  │
│ ░ Lot title  -25%  SAR 95   [+]  │
├──────────────────────────────────┤
│ ENDING SOON             View all │
│ ░ Lot title   9m 11s     [Bid]   │
│ ░ Lot title  18m 23s     [Bid]   │
├──────────────────────────────────┤
│ POPULAR NOW             View all │
│ ░ Lot title  31 bids      [>]    │
├──────────────────────────────────┤
│ SELLERS                          │
│ (RS) Red Sea  * LIVE         >   │
│ (KD) Khazna Direct           >   │
├──────────────────────────────────┤
│ LIVE & UPCOMING                  │
│ * LIVE lot 5/10 · 1,284 [Join]   │
├──────────────────────────────────┤
│ RECENTLY ADDED                   │
├────────────────┬─────────────────┤
│ [░░] title     │ [░░] title      │
├────────────────┴─────────────────┤
│ FOOTER                           │
│  (no bottom tab bar)             │
└──────────────────────────────────┘
```

Mobile strategy: **fast search, filter and category-driven shopping.**

- The search field **is** the sticky top bar, with a hub-menu button and the
  cart.
- A sticky quick-filter chip row sits under it.
- Home shows counters, a category shortcut grid and dense module lists.
- **No bottom tab bar.** The hub menu opens a full-screen category tree, the
  sellers and My Khazna.
- Filters open as a bottom sheet with a live "Show N results" button.
- Lot pages dock their summary strip under the search bar.

### N. Signature components

1. App-shell navigation rail with the live category tree and My Khazna.
2. Search deck with scope tabs and hub counters that docks into the rail.
3. Dashboard module rows (Deals · Ending soon · Popular now; Sellers · Live).
4. List + quick-view browse with sortable listing columns.
5. Listing summary strip, bid ladder and similar-lots comparison table.

Visual personality (secondary): compact, crisp and data-legible, with strong
typographic hierarchy and tabular figures.

---

## 6. Option 4 — Auction Commerce (slot `concept-d`)

### A. Design objective

An auction-first marketplace where Khazna's timed and live auctions are the
organising idea. Pages are arranged around time: what is live now, what closes
next, what opens soon. They use purpose-built auction components:

- a live stage,
- an ending-soon timeline,
- lot cards built around the bid,
- a docked bidding console,
- an auction timeline on every lot.

Buy Now stays close at hand. The option should feel dynamic and time-aware but
calm, professional and trustworthy. It must never look like crypto, trading,
gaming or cyberpunk.

### B. Desktop homepage wireframe
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ LOGO  Live*  Timed v  Upcoming  Buy Now  Sellers  (Q)  MY BIDS 2  Cart  Me │
├────────────────────────────────────────────────────────────────────────────┤
│ * LIVE  lot 5/10 · SAR 1,240 · 1,284 watching [Join]  |  Next close 04:12 >│
├────────────────────────────────────────────────────────────────────────────┤
│ LIVE AUCTION STAGE                           host: Seller · 1,284 watching │
├──────────────────┬──────────────────────────────────────┬──────────────────┤
│ PREVIOUS         │ NOW  ·  LOT 5 OF 10                  │ UP NEXT          │
│                  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │                  │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░ CURRENT LOT PHOTO ░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │
│ #4 Lot title     │ Lot title                            │ #6 Lot title     │
│ SOLD  SAR 1,350  │ CURRENT BID  SAR 1,240               │ start SAR 400    │
│                  │ 19 bids  ·  GOING ONCE               │                  │
│                  │ [ Bid SAR 1,265 ] [ Enter room ]     │                  │
├──────────────────┴──────────────────────────────────────┴──────────────────┤
│ ENDING SOON TIMELINE            [15 min] [1 hour] [3 hours] [Today] [Week] │
│                                                                            │
│  NOW        15m                1h                     3h            today  │
│  |----------|------------------|----------------------|--------------|---> │
│    ^   ^         ^      ^              ^                ^     ^            │
│   [░] [░]       [░]    [░]            [░]              [░]   [░]           │
│   9m  12m       23m    46m            2h               5h    9h            │
│   pins sit on the axis at each lot's closing time; the chips filter        │
├──────────────────┬───────────────────┬──────────────────┬──────────────────┤
│ * ENDING  12 bids│ * ENDING  12 bids │ * ENDING  12 bids│ * ENDING  12 bids│
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │
│ Lot title        │ Lot title         │ Lot title        │ Lot title        │
│ Grade B · Seller │ Grade B · Seller  │ Grade B · Seller │ Grade B · Seller │
│ SAR 180 | 09m 11s│ SAR 95 | 12m 40s  │ SAR 620 | 23m 02s│ SAR 540 | 46m 04s│
│ [ Bid SAR 190 ]  │ [ Bid SAR 100 ]   │ [ Bid SAR 640 ]  │ [ Bid SAR 565 ]  │
├──────────────────┴───────────────────┴──────────────────┴──────────────────┤
│ ACTIVE AUCTIONS   closing soonest first           [Most bids]  View all -> │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ * LIVE  23 bids 8 bdrs │ * LIVE  23 bids 8 bdrs  │ * LIVE  23 bids 8 bdrs  │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ Lot title              │ Lot title               │ Lot title               │
│ Grade B · Seller       │ Grade B · Seller        │ Grade B · Seller        │
│ CURRENT BID | TIME LEFT│ CURRENT BID | TIME LEFT │ CURRENT BID | TIME LEFT │
│ SAR 1,240   | 02:14:33 │ SAR 1,240   | 02:14:33  │ SAR 1,240   | 02:14:33  │
│ NEXT BID    | WATCHING │ NEXT BID    | WATCHING  │ NEXT BID    | WATCHING  │
│ SAR 1,265   | 41       │ SAR 1,265   | 41        │ SAR 1,265   | 41        │
│ [  Bid SAR 1,265  ]    │ [  Bid SAR 1,265  ]     │ [  Bid SAR 1,265  ]     │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ UPCOMING AUCTIONS                                                          │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ OPENS IN 2d 4h  ·  timed auction    │ LIVE EVENT  ·  Furniture evening     │
│ ░ Lot title · start SAR 900         │ ░ 12 lots · host: Seller             │
│ [ Watch ]                           │ [ Remind me ]                        │
├─────────────────────────────────────┴──────────────────────────────────────┤
│ BUY NOW   skip the bidding                                 Shop Buy Now -> │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ ░ Lot title   A   SAR 240    [Add]  │ ░ Lot title   B   SAR 95     [Add]   │
│ ░ Lot title   A   SAR 60     [Add]  │ ░ Lot title   New SAR 1,150  [Add]   │
├─────────────────────────────────────┴──────────────────────────────────────┤
│ CATEGORIES ON THE FLOOR                                                    │
│ [Appliances · 3 auctions · next 46m] [Furniture · 2 auctions · next 2h] >  │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ (RS) Red Sea   * LIVE  │ (KD) Khazna Direct      │ (MJ) Dar Al Majd        │
│ 6 active · next 04:12  │ 3 active · next 2h      │ 2 active · next 5h      │
│ [ Auction house -> ]   │ [ Auction house -> ]    │ [ Auction house -> ]    │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ HOW BIDDING WORKS                                                          │
│ 1 Deposit ready -> 2 Bid or set a maximum -> 3 Late bids add 5 min ->      │
│ 4 Win & pay (timed wins: payment window) -> 5 Delivery or pickup           │
│ FOOTER                                                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

### C. Homepage section order

1. Header: logo, sale-mode navigation, My bids
2. **Live status band** — a site-wide auction pulse
3. **Live auction stage** — a previous · now · next lot triptych, with bid and
   "Enter the room"
4. **Ending soon timeline** — a time axis with lot pins, plus cards for the
   selected window
5. **Active auctions** — lot cards, closing soonest first
6. **Upcoming auctions** — scheduled timed lots and upcoming live events
7. **Buy Now inventory** — a compact shelf ("skip the bidding")
8. **Categories on the floor** — active-auction counts and the next closing time
   per category
9. **Auction hosts** — sellers with their live and active auctions
10. **How bidding works** — a five-step stepper and the condition grades
11. Footer

The hero is the live stage: full container width × ~480px, a centred triptych
(25% · 50% · 25%) with the current lot in the middle and its controls centred
under it.

### D. Header / navigation structure

- **Row 1:** logo, then **sale-mode navigation** (Live · Timed auctions ▾ ·
  Upcoming · Buy Now · Sellers), then at the end search (icon), bidding rules,
  **My bids** (count plus winning/outbid indicators), cart and account.
- **Row 2 — live status band:** "LIVE · lot 5 of 10 · current bid · viewers ·
  Join" and "Next to close: lot · countdown". It stays visible on scroll and is
  hidden inside the live room.
- **Timed auctions ▾** lists categories with active-auction counts and the next
  closing time.
- **My bids** opens a drawer of the lots you are bidding on or watching, with
  Winning/Outbid, current bid, time left and a quick bid. Production already has
  this data: the account watchlist tab (alias `bids`) merges saved lots with lots
  the user has bid on.
- **Different from Option 1:** navigation is by sale mode and time instead of
  categories, and an auction status band replaces the utility strip and category
  bar. My bids is a first-class control, and there is no dominant search field.

### E. Search structure

- Search is **secondary**: an icon that expands inline across the navigation
  row, with a scope (Auctions / Buy Now). Its suggestions show time left and
  current bid.
- **Primary discovery is by time:** the time rail (15 min · 1 hour · 3 hours ·
  Today · This week) on home and browse.
- **Mobile:** the search icon opens a full-screen search whose suggestions lead
  with the lots ending soonest.
- **Different from Option 1:** search is collapsed; time windows and live
  status do the discovery work.

### F. Category discovery

- **Categories on the floor:** a strip of category chips showing active
  auctions, Buy Now count and the next closing time.
- A category filter inside the auction finder, and a category list in the Timed
  auctions menu.
- Deliberately secondary to time and status.
- **Different from Option 1:** categories carry auction state and sit below the
  auction content, not in a mega menu at the top.

### G. Card architecture — "lot card" and "stock row"

**Lot card** (auctions):

- **Top status bar:** a status chip (Live / Ending soon / Upcoming / Sold) and
  activity ("23 bids · 8 bidders").
- **Image position:** 4:3, below the status bar.
- **Information order:** title, then condition grade, then seller (with a host
  tag when the seller is live).
- **Auction information:** a **2×2 data grid** of Current bid | Time left
  (segmented countdown) / Next bid | Watching. The time cell turns amber under an
  hour and red in the last minutes.
- **CTA position:** a full-width button labelled with the amount ("Bid SAR
  1,265"), plus a watch icon.

**Stock row** (Buy Now): a compact horizontal row of thumbnail, title, grade,
price, stock and Add. It is deliberately secondary.

**Different from Option 1:** the status comes first, the bid data sits in a
grid, and the bid button carries the amount. Buy Now has its own compact format.

### H. Browse-page wireframe — "auction finder"
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ LOGO  Live*  Timed v  Upcoming  Buy Now  Sellers  (Q)  MY BIDS 2  Cart  Me │
├────────────────────────────────────────────────────────────────────────────┤
│ * LIVE  lot 5/10 · SAR 1,240 · 1,284 watching [Join]  |  Next close 04:12 >│
├────────────────────────────────────────────────────────────────────────────┤
│ [ TIMED AUCTIONS 11 ]  [ LIVE EVENTS 1 ]  [ UPCOMING 1 ]  [ BUY NOW 18 ]   │
├────────────────────────────────────────────────────────────────────────────┤
│ ENDING IN:  (15 min)  (1 hour)  (3 hours)  (Today)  (This week)  (All)     │
│ [+ More filters]  Category v  Condition v  Type v  Seller v                │
│                                                  Sort: ending soonest v    │
├────────────────────────────────────────────────────────────────────────────┤
│ CLOSING WITHIN 15 MINUTES (1)                  urgent bucket, larger cards │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ * CLOSING  31 bids · 12 bidders     │                                      │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   (when a bucket holds more          │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    lots, they continue here          │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    at the same large size)           │
│ Lot title · Grade A · Seller        │                                      │
│ CURRENT SAR 1,480  | LEFT 00:09:11  │                                      │
│ NEXT    SAR 1,500  | WATCHING 58    │                                      │
│ [       Bid SAR 1,500        ]      │                                      │
├─────────────────────────────────────┴──────────────────────────────────────┤
│ CLOSING WITHIN 1 HOUR (3)                                                  │
├──────────────────┬───────────────────┬──────────────────┬──────────────────┤
│ * ENDING  12 bids│ * ENDING  12 bids │ * ENDING  12 bids│                  │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │                  │
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │                  │
│ Lot title        │ Lot title         │ Lot title        │                  │
│ Grade B · Seller │ Grade B · Seller  │ Grade B · Seller │                  │
│ SAR 1,480 | 18m  │ SAR 620 | 23m 02s │ SAR 540 | 46m 04s│                  │
│ [ Bid SAR 1,500 ]│ [ Bid SAR 640 ]   │ [ Bid SAR 565 ]  │                  │
├──────────────────┴───────────────────┴──────────────────┴──────────────────┤
│ CLOSING TODAY (5)                                                          │
├──────────────────┬───────────────────┬──────────────────┬──────────────────┤
│ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░ │
│ SAR 2,100 | 5h   │ SAR 180 | 6h      │ SAR 900 | 9h     │ SAR 60 | 11h     │
├──────────────────┴───────────────────┴──────────────────┴──────────────────┤
│ CLOSING THIS WEEK (2)                                         [ Show all ] │
│   (Buy Now tab: buckets give way to compact stock rows)                    │
└────────────────────────────────────────────────────────────────────────────┘
```

- Sale-mode tabs across the top.
- A **time rail** as the primary filter, with collapsible secondary filters.
- Results grouped into **time buckets**; the most urgent bucket shows larger
  cards.
- On the Buy Now tab, the buckets give way to compact stock rows.

### I. Product-detail wireframe — Buy Now "stock page"
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ LOGO  Live*  Timed v  Upcoming  Buy Now  Sellers  (Q)  MY BIDS 2  Cart  Me │
├────────────────────────────────────────────────────────────────────────────┤
│ * LIVE  lot 5/10 · SAR 1,240 · 1,284 watching [Join]  |  Next close 04:12 >│
├────────────────────────────────────────────────────┬───────────────────────┤
│ IN STOCK · 8 left    LOT TITLE                     │ [ Watch ]  [ Share ]  │
│ Grade A · Seller · City                            │                       │
├──────────┬─────────────────────────────────────────┴───────────────────────┤
│ [░░░░░░] │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ [░░░░░░] │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ [░░░░░░] │ ░░░░░░░░░░░░ STAGE: main photo on a neutral stage ░░░░░░░░░░░░░ │
│ [░░░░░░] │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ thumbs   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├──────────┴─────────────┬─────────────────────────┬─────────────────────────┤
│ CONDITION              │ SPECIFICATIONS          │ DELIVERY & PICKUP       │
│ Grade A                │ spec · value            │ Delivery priced at      │
│ notes on this lot      │ spec · value            │   checkout              │
│ [ Grade guide ]        │ spec · value            │ Pickup: seller warehouse│
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ ALSO AT AUCTION   similar lots being bid on now                            │
│  |---------o-------------o----------------o----------------------------->  │
│  [░] Lot · SAR 180 · 9m  [░] Lot · SAR 540 · 46m  [░] Lot · SAR 1,240 · 2h │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ SAR 240   was 400      │ Qty  [ -  1  + ]        │ [ Add to cart ]         │
│ -40%  ·  8 left        │ Delivery priced at      │ [ Buy now ]             │
│                        │   checkout · pickup     │                         │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ ^ PURCHASE CONSOLE: docked to the bottom of the screen on every size       │
└────────────────────────────────────────────────────────────────────────────┘
```

- A lot header bar.
- A stage-style gallery with vertical thumbnails.
- Facts in three columns.
- "Also at auction" links the item to similar lots currently being bid on.
- Purchase actions live in a **console docked to the bottom** of the screen.

### J. Auction-detail wireframe — "bidding workspace"
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ LOGO  Live*  Timed v  Upcoming  Buy Now  Sellers  (Q)  MY BIDS 2  Cart  Me │
├────────────────────────────────────────────────────────────────────────────┤
│ * LIVE  lot 5/10 · SAR 1,240 · 1,284 watching [Join]  |  Next close 04:12 >│
├────────────────────────────────────────────────┬───────────────────────────┤
│ * LIVE   LOT 2-0417   LOT TITLE                │ ENDS IN                   │
│ Grade B · Seller (host) · 41 watching          │ [02] : [14] : [33] : [07] │
│ [ Watch ]  [ Share ]                           │   d      h      m      s  │
│                                                │ Thu 21:00 · late bids +5m │
├──────────┬─────────────────────────────────────┴───────────────────────────┤
│ [░░░░░░] │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ [░░░░░░] │ ░░░░░░░░░░░░░░░░░░░░░░ STAGE: main photo ░░░░░░░░░░░░░░░░░░░░░░ │
│ [░░░░░░] │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ thumbs   │ 23 bids · 8 bidders░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├──────────┴─────────────────────────────────────────────────────────────────┤
│ AUCTION TIMELINE                                                           │
│  OPENED          BIDS              NOW         CLOSE    PAYMENT*   COLLECT │
│  o---------------|--|-|---|--|-----*-----------[####]---o----------o       │
│  Mon 10:00       23 bids           SAR 1,240   Thu 21:00                   │
│  [####] = last 5 minutes: a bid here extends the close by 5 minutes        │
│  * payment window applies to timed-auction wins                            │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ BID ACTIVITY (live)                 │ LOT FACTS                            │
│ Bidder 7   SAR 1,240    2m          │ [Condition] [Specs] [Manifest]       │
│ You        SAR 1,220    5m  max     │ [Terms]                              │
│ Bidder 3   SAR 1,200    9m          │ Grade B: grade guide line            │
│ Bidder 7   SAR 1,180   14m          │ pallet contents table ...            │
│ [ Full history ]                    │                                      │
├─────────────────────────────────────┴──────────────────────────────────────┤
│ CLOSING AROUND THE SAME TIME  [lot card] [lot card] [lot card] [lot card] >│
├──────────────────────┬──────────────────────────────┬──────────────────────┤
│ YOU'RE WINNING       │ Quick bid                    │ [ Set maximum bid ]  │
│ Current SAR 1,240    │ [1,265] [1,290] [1,340]      │ [ Buy now SAR 1,900 ]│
│ Next    SAR 1,265    │ [ SAR ______ ]  [ Bid ]      │ Deposit covered (ok) │
├──────────────────────┴──────────────────────────────┴──────────────────────┤
│ ^ BIDDING CONSOLE: docked to the bottom of the screen on every size        │
└────────────────────────────────────────────────────────────────────────────┘
```

- The countdown is part of the page header.
- An **auction timeline** shows the whole life of the lot: opened, bids, now,
  the close with its 5-minute extension window, the payment window for
  timed-auction wins, and collection.
- Bid activity sits beside the lot facts.
- The **bidding console is docked to the bottom** on every screen size: status,
  quick bids, custom amount, maximum bid, Buy Now on "both" lots, and deposit.

### K. Live-auction wireframe — "auction room"
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ LOGO  Live*  Timed v  Upcoming  Buy Now  Sellers  (Q)  MY BIDS 2  Cart  Me │
├────────────────────────────────────────────────────────────────────────────┤
│ * LIVE  EVENT TITLE · host: Seller · presenter    1,284 watching · [Rules] │
├────────────────────┬───────────────────────────────────┬───────────────────┤
│ LOT QUEUE          │ STAGE                             │ ACTIVITY          │
│ 1 Lot  SOLD 310    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ B7   1,240   now  │
│ 2 Lot  SOLD 120    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ You  1,220   12s  │
│ 3 Lot  NOT SOLD    │ ░░░░░░░ CURRENT LOT PHOTO ░░░░░░░ │ B3   1,200   31s  │
│ 4 Lot  SOLD 1,350  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ B7   1,180   44s  │
│ > 5 Lot  NOW       │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ B5   1,150   58s  │
│ 6 Lot  NEXT        │ LOT 5 · Lot title                 │                   │
│ 7 Lot  staged      │ starting bid · increment          │ 1,284 watching    │
│ 8 Lot  staged      │ CURRENT BID  SAR 1,240            │ 19 bids           │
│ 9 Lot  staged      │ [open]>[once]>[twice]>[sold]      │                   │
│ 10 Lot staged      │ lot timer 0:12                    │                   │
├────────────────────┴─┬──────────────────────────────┬──┴───────────────────┤
│ Current SAR 1,240    │ [    BID  SAR 1,265    ]     │ + step chips         │
│ You: not bidding     │ Bids are binding once placed │ Deposit covered (ok) │
├──────────────────────┴──────────────────────────────┴──────────────────────┤
│ ^ BIDDING CONSOLE (same component as the lot page), docked to the bottom   │
└────────────────────────────────────────────────────────────────────────────┘
```

- A vertical **lot queue**.
- A centre stage with the bidding status sequence (open → going once → going
  twice → sold) and the per-lot timer.
- A live activity column.
- The same docked bidding console as the lot page.

### L. Seller-storefront wireframe — "auction house"
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ LOGO  Live*  Timed v  Upcoming  Buy Now  Sellers  (Q)  MY BIDS 2  Cart  Me │
├────────────────────────────────────────────────────────────────────────────┤
│ * LIVE  lot 5/10 · SAR 1,240 · 1,284 watching [Join]  |  Next close 04:12 >│
├────────────────────────────────────────────────┬───────────────────────────┤
│ (RS) RED SEA TRADING CO.                       │ * LIVE NOW                │
│ Jeddah · member since 2023                     │ Electronics clearance     │
│ 6 active · 1 upcoming · 14 Buy Now             │ [ Enter the room ]        │
│ [ Pickup & terms ]                             │ (or: next closes 04:12)   │
├────────────────────────────────────────────────┴───────────────────────────┤
│ THIS SELLER'S AUCTION TIMELINE                                             │
│  NOW        1h              today                 this week                │
│  |----------|---------------|---------------------|----------------------> │
│    [░]  [░]     [░]            [░]    [░]                [░]               │
├────────────────────────────────────────────────────────────────────────────┤
│ ACTIVE AUCTIONS                                                            │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│ * LIVE  23 bids 8 bdrs │ * LIVE  23 bids 8 bdrs  │ * LIVE  23 bids 8 bdrs  │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ░░░░░░░░░░░░░░░░░░░░░░░ │
│ Lot title              │ Lot title               │ Lot title               │
│ Grade B · Seller       │ Grade B · Seller        │ Grade B · Seller        │
│ CURRENT BID | TIME LEFT│ CURRENT BID | TIME LEFT │ CURRENT BID | TIME LEFT │
│ [ Bid SAR 1,265 ]      │ [ Bid SAR 1,265 ]       │ [ Bid SAR 1,265 ]       │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│ UPCOMING   [░ lot · opens in 2d]   [░ live event · date to be set]         │
│ BUY NOW    [░ SAR 240 Add]  [░ SAR 95 Add]  [░ SAR 60 Add]  >              │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ PICKUP                              │ TERMS                                │
│ address · hours                     │ return window · deposit rules        │
└─────────────────────────────────────┴──────────────────────────────────────┘
```

- A host header showing live or next-closing status.
- The seller's own auction timeline.
- Live, active and upcoming groups, then a Buy Now shelf.
- Pickup and terms.

### M. Mobile homepage wireframe
```text
┌──────────────────────────────────┐
│ LOGO         (Q)  BIDS 2*   Me   │
├──────────────────────────────────┤
│ * LIVE lot 5/10 SAR 1,240 [Join] │
│  (sticky live strip)             │
├──────────────────────────────────┤
│ [Live] [ENDING] [Upcoming] [Buy] │
│  (sticky floor switcher)         │
├──────────────────────────────────┤
│ WITHIN 15 MINUTES            < > │
├──────────────────────────────────┤
│ * CLOSING · 12 bids · 5 bidders  │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░ LOT PHOTO ░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Lot title · Grade B · Seller     │
│ CURRENT SAR 540  | LEFT 04:12    │
│ NEXT    SAR 565  | WATCH 22      │
│ [        Bid SAR 565        ]    │
├──────────────────────────────────┤
│ WITHIN 1 HOUR                    │
│ ░ Lot title SAR 180   09:11 [Bid]│
│ ░ Lot title SAR 1,480 18:23 [Bid]│
├──────────────────────────────────┤
│ TODAY                            │
│ ░ Lot title SAR 2,100  5h   [Bid]│
├──────────────────────────────────┤
│ CATEGORIES ON THE FLOOR     >    │
│ AUCTION HOSTS               >    │
│ HOW BIDDING WORKS (5 steps)      │
├──────────────────────────────────┤
│                                  │
│    ( 2 winning · 1 outbid  ^ )   │
│      floating My bids pill       │
└──────────────────────────────────┘
```

Mobile strategy: **auction status first.**

- A sticky live status strip and a sticky floor switcher (Live · Ending ·
  Upcoming · Buy Now) replace tab bars.
- The default "Ending" floor shows countdown clusters: within 15 minutes, within
  1 hour, today.
- A floating **My bids** pill ("2 winning · 1 outbid") opens your bids.
- On lot pages, the bidding console docks at the bottom with quick-bid chips and
  expands for a custom amount or maximum bid.

### N. Signature components

1. Live status band and live auction stage (previous · now · next).
2. Ending-soon timeline and the time-bucketed auction finder.
3. Lot card built around the bid (status bar, data grid, amount button).
4. Docked bidding console, shared by lot pages and the live room.
5. Auction timeline on every lot, plus the My bids drawer and pill.

Visual personality (secondary): confident and time-aware, with restrained colour
and a single urgency accent reserved for time and live state; tabular figures;
minimal motion.

---

## 7. The grayscale test — all four at a glance

If the four options were shown only as grayscale wireframes, would a client
immediately recognise four different website structures? These silhouettes are
drawn from the full wireframes above:

- Option 1 is a portal with a left carousel beside stacked tiles.
- Option 2 is a full-bleed photo page with a mosaic.
- Option 3 is an app with a navigation rail and list modules.
- Option 4 is a live stage above a timeline.

### Desktop homepages
```text
     OPTION 1            OPTION 2            OPTION 3            OPTION 4
┌────────────────┐  ┌────────────────┐  ┌────┬───────────┐  ┌────────────────┐
│ utility strip  │  │ nav  LOGO  icon│  │ LG │ top bar   │  │ LOGO modes BIDS│
├────────────────┤  ├────────────────┤  │srch├───────────┤  ├────────────────┤
│ LOGO [search]  │  │ ░░░░░░░░░░░░░░ │  │ nav│ SEARCH    │  │ * LIVE band    │
├────────────────┤  │ ░░░░ HERO ░░░░ │  │rail│ DECK [___]│  ├───┬────────┬───┤
│ category bar   │  │ [search]░░░░░░ │  │    ├──┬──┬──┬──┤  │ ░ │  NOW ░ │ ░ │
├──────────┬─────┤  │ ░[▓][▓][▓][▓]░ │  │tree│ct│ct│ct│ct│  │ pv│ ░░░░░░ │ nx│
│ ░ HERO ░ │ END │  ├───────┬───┬────┤  │    ├──┴──┴──┴──┤  │   │ [BID]  │   │
│ ░░░░░░░░ ├─────┤  │ ░░░░░ │ ░ │ ░░ │  │    │ categories│  ├───┴────────┴───┤
│ ░░░░░░░░ │ DEAL│  │ ░░░░░ │ ░ ├────┤  │    ├───┬───┬───┤  │ |--o-o--o----> │
├──────────┴─────┤  │ ░░░░░ │ ░ │ ░░ │  │    │lst│lst│lst│  │ [] [] [] []    │
│ trust strip    │  ├───┬───┼───┼────┤  │    │lst│lst│lst│  ├────┬─────┬─────┤
│ [][][][][][][] │  │ ░ │ ░ │ ░ │ ░░ │  │    ├───┴─┬─┴───┤  │ crd│ card│ card│
│ rail [][][] >  │  ├───┴───┴───┴────┤  │    │ dir │ live│  │    │     │     │
│ ▒▒▒▒ live ▒▒▒▒ │  │ wide | tall    │  │    ├─────┴─────┤  ├────┴─────┴─────┤
│ deals [][][][] │  │ tall | wide    │  │    │ recent [] │  │ upcoming       │
│ sellers·steps  │  │ ▒▒▒▒ live ▒▒▒▒ │  ├────┴───────────┤  │ buy now shelf  │
│                │  │                │  │ footer         │  │                │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
```

### Mobile homepages
```text
     OPTION 1            OPTION 2            OPTION 3            OPTION 4
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ [=] LOGO  cart │  │ [=]  LOGO  Q B │  │ [=][search..]C │  │ LOGO Q BIDS me │
├────────────────┤  ├────────────────┤  ├────────────────┤  ├────────────────┤
│ [search....]   │  │ ░░░░░░░░░░░░░░ │  │ [chip][chip] > │  │ * LIVE [Join]  │
├────────────────┤  │ ░░░░ FULL ░░░░ │  ├───────┬────────┤  ├────────────────┤
│ ░░░░ HERO ░░░░ │  │ ░░░ SCREEN ░░░ │  │ ct    │ ct     │  │ [Liv][END][Up] │
├────────────────┤  │ ░░░░ HERO ░░░░ │  │ ct    │ ct     │  ├────────────────┤
│ ending list    │  │ [search.....]  │  ├───┬───┼───┬────┤  │ WITHIN 15 MIN  │
│ deal tile      │  ├────────────────┤  │ ░ │ ░ │ ░ │ ░  │  │ ░░░░░░░░░░░░░░ │
├───────┬────────┤  │ (o)(o)(o)(o) > │  │ ░ │ ░ │ ░ │ ░  │  │ ░░░░ LOT ░░░░░ │
│ trust │ trust  │  ├────────────────┤  ├───┴───┴───┴────┤  │ bid | time     │
├───────┴────────┤  │ ░░░░░░░░░░░░░░ │  │ ░ row    [+]   │  │ [ BID 565 ]    │
│ rail [][] >    │  │ ░░░░ CARD ░░░░ │  │ ░ row    [+]   │  ├────────────────┤
│ rail [][] >    │  │ title    (+)   │  │ ░ row  [Bid]   │  │ WITHIN 1 HOUR  │
│ ▒▒▒▒ live ▒▒▒▒ │  ├───────┬────────┤  │ ░ row  [Bid]   │  │ ░ row  [Bid]   │
│ grid [][]      │  │ ░░░░░ │ ░░░░░░ │  │ sellers list   │  │                │
├──┬──┬──┬──┬────┤  ├───────┴────────┤  │                │  ├────────────────┤
│H │C │L │Ct│Acct│  │ ▒▒▒▒ live ▒▒▒▒ │  │                │  │  (2 win·1 out) │
└──┴──┴──┴──┴────┘  └────────────────┘  └────────────────┘  └────────────────┘
```

**Answer: yes.** The four read as four different structures even without
colour, type or imagery.

---

## 8. Structural comparison matrix

### Required dimensions

| Dimension | Option 1 — Modern Commerce (reference) | Option 2 — Visual Marketplace | Option 3 — Marketplace Hub | Option 4 — Auction Commerce |
|---|---|---|---|---|
| **Header** | Three horizontal tiers: dark utility strip; logo + centred search + actions; category bar | One transparent bar: split text navigation, centred logo, icons | App shell: vertical navigation rail + slim top bar | Sale-mode navigation row + live status band; My bids first-class |
| **Search** | Wide bar in the header centre with a category scope; own row on phones, hides on scroll | In-hero discovery field + full-screen visual search overlay | Top of the navigation rail; enlarged as the home search deck, which docks into the rail; "/" shortcut | Collapsed icon; discovery led by the time rail |
| **Hero** | 8/12 carousel beside two stacked 4/12 tiles (ending soon, top deal) | Full-bleed photo, content bottom-start, product strip crossing its lower edge | No image hero: search deck + hub counters | Live stage triptych: previous · now · next |
| **Category discovery** | Text mega menu + one row of 8 equal tiles | Asymmetric photo mosaic + photo mega panel + stories rail (mobile) | Always-visible category tree in the rail + compact 4×2 grid | Category strip with auction counts and next closing time |
| **Homepage structure** | Hero + tiles → trust → categories → auctions rail → live band → deals → pallets → sellers → how it works | Hero → mosaic → featured showcases → auction gallery → Buy Now grid → sellers → live banner → how it works | Search deck → counters → categories → three list modules → sellers + live → recently added → pallets → steps | Stage → timeline → active → upcoming → Buy Now shelf → categories → hosts → how bidding works |
| **Product cards** | Vertical: square plated image, stacked text, countdown pill + button footer | Portrait full-bleed image with auction band on the photo; icon CTA | Horizontal row (thumbnail · info · data · CTA) + compact tile | Lot card: status bar, image, 2×2 bid data grid, amount button; compact Buy Now rows |
| **Auctions** | Rails of cards (ending soon / most bid); sticky bid box on detail | Wide showcase gallery; time and bid on the photo | Ending-soon list module, time column, bid ladder | Timeline, time buckets, docked console, auction timeline |
| **Live auctions** | Live band on home; stage + 380px side panel; lots table | Centred live banner; theatre stage + horizontal lot reel | Live module; schedule view with the pinned current lot | Stage as the home hero; room: queue · stage · activity + console |
| **Browse** | Sticky facet sidebar + 4-across grid + numbered pages | Photo banner + photo chips + popover filter bar + 3-across large grid + load more | Rail tree + toolbar facets + sortable list + quick-view pane | Sale-mode tabs + time rail + collapsible filters + time-bucketed groups |
| **Product detail** | Three columns: sticky gallery · details · sticky buy box | Filmstrip → purchase band → centred story → floating corner card | Result navigation → sticky summary strip → gallery + facts table → tabs → comparison table | Lot header bar → stage gallery → three-column facts → also at auction → docked purchase console |
| **Auction detail** | Same three columns with a sticky bid box; history + terms below | Filmstrip → band with inline bid module → centred sections (photo manifest) → floating bid card | Summary strip with time and bid → gallery + bid ladder → data tabs → comparison | Header with countdown → stage → auction timeline → activity + facts → docked bidding console |
| **Seller page** | Cover photo + overlapping identity card + sidebar filters + grid | Campaign cover with name on the photo + profile strip + photo chips + large grid | Compact profile header + tabs (Overview modules · Auctions · Buy Now · Live · About) | Auction house: host status header + seller timeline + grouped auctions |
| **Mobile navigation** | Search row + fixed five-tab bottom bar (Home · Categories · Live · Cart · Account) | No bottom bar: transparent top bar, full-screen visual menu, stories rail | No bottom bar: search is the top bar, sticky chip row, full-screen hub menu | Sticky live strip + floor switcher + floating My bids pill |

### Further dimensions from the brief

| Dimension | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| **Hero proportions / content position** | 8/12 × ~360px carousel, content start-aligned in each slide, beside two 4/12 tiles | 100% width × ~560px; content bottom-start (~40% wide); strip overlaps the edge | Main-column width × ~240px deck; content top-start | Full container × ~480px; centred 25/50/25 triptych; controls centred |
| **Product-grid composition** | Uniform 4–5 across grids and rails | Three across, large portrait; alternating wide/tall showcases; 1.5-visible galleries | Single-column list rows; six-across compact tiles | Time-bucketed groups; urgent bucket larger; compact Buy Now rows |
| **Buy Now presentation** | Deals grid + top-deal tile in the hero | "Ready to buy" large-card grid with price-drop stickers | Deals list module with discount, price, stock | Compact "skip the bidding" shelf and Buy Now tab |
| **Ending-soon presentation** | Compact list tile beside the hero + auctions rail | Time on the photo band; gallery sorted by closing time | Ending-soon list module + counter tile | Timeline with lot pins + countdown clusters + time buckets |
| **Live presentation** | Two-part live band after the auctions rail | Centred banner near the end of the page | One module among the dashboard lists | The top of the page (stage) + site-wide status band |
| **Seller/store presentation (home)** | Stats band + seller tiles | Carousel of large seller cover cards | Seller directory list with counts | Auction hosts with live/next-closing status |
| **Trust-information presentation** | Utility-strip ticker + trust strip under the hero + footer | Photographic "How Khazna works" + grade scale; contextual on lot pages | Trust notes at the foot of the rail + "Buying on Khazna" strip + grade tooltips | "How bidding works" stepper + bidding-rules link + notes in the console |
| **Filter UX** | Left sticky facet sidebar, quick chips, sort/view toolbar, mobile sheet | Horizontal popover bar + "All filters" drawer + photo chips | Category tree + sticky dropdown toolbar + sortable columns + pager | Time rail + sale-mode tabs + collapsible "More filters" |
| **Mobile page composition** | Search row, carousel, stacked tiles, rails, tab bar | Full-screen hero, stories, single-column image feed | Search bar, chips, counters, shortcut grid, dense lists | Live strip, floor switcher, countdown clusters, My bids pill |

---

## 9. Similarity audit (self-review before submission)

Each new option was checked against the Option 1 code on the brief's eleven
questions. The rule: if more than two major areas remain substantially the same
as Option 1, the wireframe is redesigned before presenting.

### Option 2 — Visual Marketplace vs Option 1

| Question | Structurally different? | Evidence |
|---|---|---|
| Header | **Yes** | One transparent bar, centred logo, split navigation. No utility strip, search bar or category bar |
| Hero | **Yes** | Full-bleed photo with content bottom-start and a product strip crossing its lower edge; not a carousel beside stacked tiles |
| Search placement | **Yes** | In-hero field + full-screen visual overlay, not a permanent centred header bar |
| Category discovery | **Yes** | Asymmetric photo mosaic, photo panel and stories, not a text mega menu + equal tile row |
| Homepage composition | **Yes** | Different section types and order (mosaic, alternating showcases, wide auction gallery, seller covers) |
| Product cards | **Yes** | Portrait full-bleed photo with the auction band on the image and an icon CTA |
| Browse | **Yes** | No sidebar; photo banner, photo chips, popover bar, three-across grid, load more |
| Product detail | **Yes** | Filmstrip → purchase band → centred column → floating card; no three-column grid |
| Auction detail | **Yes** | Same filmstrip frame with an inline bid module and a photo manifest |
| Live auction | **Yes** | Full-width theatre stage + horizontal lot reel; no side panel or lots table |
| Mobile UX | **Yes** | No bottom tab bar; visual menu, stories, image feed |

**Result: 0 of 11 areas substantially the same.** One shared convention, not
structural: both keep a full-width live section on the home page. Option 1 uses
a two-part band after the auctions rail; Option 2 uses a single centred banner
near the end.

### Option 3 — Marketplace Hub vs Option 1

| Question | Structurally different? | Evidence |
|---|---|---|
| Header | **Yes** | Vertical navigation rail (app shell) + slim top bar |
| Hero | **Yes** | No image hero; search deck + counters |
| Search placement | **Yes** | Top of the navigation rail and the page's first module. Search stays prominent (as the brief asks for this option), but it has left the header centre |
| Category discovery | **Yes** | Always-visible tree with counts and sale-type branches + compact grid |
| Homepage composition | **Yes** | Dashboard of equal list modules; no hero and no rails of vertical cards |
| Product cards | **Yes** | Horizontal row cards and compact tiles |
| Browse | **Yes** (partial overlap noted) | Both have a left column, but Option 3's is the global navigation rail with the category tree. Facets move to a sticky toolbar and results become a sortable list with a quick-view pane |
| Product detail | **Yes** | Result navigation, sticky summary strip, facts table, tabs, comparison table |
| Auction detail | **Yes** | Summary strip with time and bid, bid ladder, data tabs, comparison |
| Live auction | **Yes** | Schedule view: pinned current-lot band + full-width tabbed tables; no stage or side panel |
| Mobile UX | **Yes** | Search is the top bar; chip row; hub menu; no bottom tab bar |

**Result: 0 of 11 areas substantially the same**, with one partial overlap
(a left column on browse, with a different role).

### Option 4 — Auction Commerce vs Option 1

| Question | Structurally different? | Evidence |
|---|---|---|
| Header | **Yes** | Sale-mode navigation + live status band + My bids. There is no utility strip, search bar or category bar, though both are horizontal top headers |
| Hero | **Yes** | Centred live-stage triptych, not a carousel beside stacked tiles |
| Search placement | **Yes** | Collapsed icon; discovery by the time rail |
| Category discovery | **Yes** | Category strip with auction counts and next closing, placed after the auction content |
| Homepage composition | **Yes** | Organised by time: stage, timeline, active, upcoming |
| Product cards | **Yes** | Status bar, 2×2 bid data grid, amount-labelled full-width button; separate compact Buy Now rows |
| Browse | **Yes** | Sale-mode tabs + time rail + time buckets; no sidebar, no flat grid |
| Product detail | **Yes** | Lot header bar, stage gallery, three-column facts, also-at-auction, docked console |
| Auction detail | **Yes** | Countdown in the header, auction timeline, activity beside facts, console docked on all sizes |
| Live auction | **Yes** | Queue · stage · activity + docked console |
| Mobile UX | **Yes** (partial overlap noted) | Live strip + floor switcher + My bids pill. On mobile lot pages both options anchor bidding at the bottom, which is a platform convention. Option 4's console adds status, quick-bid chips, custom amount and maximum bid in place |

**Result: 0 of 11 areas substantially the same**, with one partial overlap
(bottom-anchored bidding on mobile lot pages).

### New options against each other

| Pair | Distinct? | Notes |
|---|---|---|
| Option 2 vs Option 3 | **Yes** | Photo-led, spacious, no navigation rail, versus dense lists in an app shell. No page shares an architecture |
| Option 2 vs Option 4 | **Yes** | Both have a stage-like live page. Option 2's is a full-width theatre with a horizontal reel; Option 4's is a three-zone room with a vertical queue and a docked console. The home tops differ: photo hero versus live stage |
| Option 3 vs Option 4 | **Yes** | Rows are Option 3's primary card format but only Option 4's secondary Buy Now format. Option 3 is built on tables and tabs; Option 4 on timelines and time buckets |

### Independent review

_Pending: independent review in progress._

---

## 10. Functional coverage — nothing removed

| Feature | Option 2 — Visual Marketplace | Option 3 — Marketplace Hub | Option 4 — Auction Commerce |
|---|---|---|---|
| Buy Now | Large cards, "Ready to buy" grid, purchase band + floating card, bag drawer | Deals module, row cards, summary strip with quantity, Add and Buy now | Buy Now shelf and tab, stock rows, docked purchase console |
| Timed auctions | Auction gallery, auction band on cards, inline bid module | Ending-soon module, time column, bid ladder | Timeline, lot cards, finder buckets, docked console |
| Live auctions | Live banner, "Live" navigation, theatre page | Live module, "Live now" in the rail, schedule view | Status band, stage hero, auction room |
| Search | In-hero field + full-screen visual search | Rail search + home deck + multi-column suggestions | Expanding header search + time rail |
| Categories | Photo mosaic, photo mega panel, stories | Category tree, category grid | Category strip, finder filter, Timed auctions menu |
| Filters | Popover bar + "All filters" drawer | Toolbar facets + tree + sortable columns | Time rail + sale-mode tabs + more filters |
| Sellers | Seller covers, boutique storefront | Directory module, tabbed profile | Auction hosts, auction-house page |
| Cart | Bag icon → bag drawer | Cart in the top bar → cart drawer | Cart in the header → drawer |
| Watchlist | Heart on cards, header icon | Watch icons, "Watchlist" in My Khazna | Watch icons, My bids & watching drawer |
| Customer account | Account icon and menu | "My Khazna" in the rail + account in the top bar | Account in the header; My bids links to the account's bids tab |
| Bidding (quick bids, custom amount, maximum/proxy bid, deposit, Buy Now on "both" lots, 5-minute extension) | Bid module in the band + floating bid card; mobile bid sheet | Bid ladder + custom + maximum in the lot sheet | Docked console with every control |
| Condition grading | Grade in the meta line; visual grade scale on lot pages and home | Grade chips in rows, grade legend, condition tab | Grade on lot cards, facts grid, "How bidding works" |
| Delivery / pickup | Purchase band line + story section + seller pickup | Key-facts table + tab | Facts column + console line |

All three use the same behaviour layer as Option 1 (`useBrowse` for search,
filters, sorting and paging; `useAuction` for bids, maximum bids, deposits,
extensions and Buy Now on "both" lots; `useLiveEvent` for the live lifecycle).
They also use the same preview store for cart and watchlist.

---

## 11. Data, feasibility and decisions

**Same data everywhere.** All three options read the shared sample catalogue,
unchanged:

- 29 lots: 18 Buy Now, 10 timed auctions, 1 auction with Buy Now;
- 8 categories, each with a photo; 5 sellers with cover, city, tagline and
  pickup details;
- 1 live event with 10 sequenced lots, and 2 upcoming events;
- 410 catalogue photos and the warehouse brand photography.

No product, seller, price or image is added or changed.

New structural components and where their data comes from. The P/F/B/API/LEGAL
codes and G-row numbers are the classification from `CUSTOMER_REDESIGN_FILE_MAP.md`,
section G:

| Component | Option | Source | Class |
|---|---|---|---|
| Visual search overlay with lot thumbnails | 2 | Existing search parameter; additive UI | B (confirm addition, as G26) |
| Photo mega panel, category mosaic, stories | 2 | Category photos in the shared data | F |
| Seller cover cards and campaign storefront cover | 2 | Seller cover/tagline are not production fields today | API (G2) |
| Photo manifest grid | 2 | Pallet contents include images | F |
| Category counts and sale-type branches in the rail | 3 | Result counts from the list endpoint (a facet endpoint would be cleaner) | F / API |
| Hub counters (live, ending within 1 hour, deals, new) | 3 | Live event + list queries | F |
| Quick-view pane, comparison tables | 3 | Existing lot data; additive UI | B (confirm addition) |
| Previous / next lot from results | 3 | Current browse result set | F |
| Bid ladder | 3 | Minimum next bid + increment rules | F |
| Seller directory module | 3 | Needs a seller-list endpoint | API (G3) |
| Live status band | 4 | Public live-event REST/socket + ending-soon list | F |
| Stage triptych incl. previous lot's result | 4 | Live-event item statuses and final bids | F |
| Ending-soon and seller timelines | 4 | Lot end times | F |
| Auction timeline on the lot page | 4 | Start/end times, bid history, server-side extension; payment window from policy (timed-auction wins only) | F |
| My bids drawer and pill | 4 | Production account watchlist tab (alias `bids`). The preview keeps the visitor's simulated bids inside Option 4's own layer, with no shared-layer change | F |
| Docked bidding console | 4 | Same bid flows as today | F |
| "Remind me" on upcoming live events | 3, 4 | No reminder backend | API (G29), concept idea |
| Upcoming live event dates/times | 3, 4 | New event fields | API (G12), concept idea |

Wording follows the Phase 1B claims audit throughout: condition grade disclosed;
delivery priced for your address at checkout; pickup or delivery; refundable
bidding deposit covered by the wallet; watchlist rather than reminders for timed
lots; bids binding once placed. No option relies on a cross-lot bid-activity
feed; activity is limited to the live room's recent bids, which production
provides.

---

## 12. Implementation approach after approval (not started)

1. **Preserve Round 2.** Tag the current Round 2 versions of `concept-a`,
   `concept-c` and `concept-d` (e.g. `round2-concepts`) before replacing them.
   Round 1 remains preserved at `round1-concepts`.
2. **Build each option as a new component tree** in its slot, from a blank
   structure. Nothing is copied from Option 1.
3. **Guardrails, checked automatically on every commit:**
   - no imports from `concept-b` into `concept-a/c/d`;
   - no files duplicated from `concept-b`;
   - an empty diff for `components/concept-b/` and `styles/concept-b.css`.
4. **Order per option:**
   1. shell and navigation;
   2. cards;
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
   - The existing suite: English/Arabic, light/dark, 1440/1024/768/390, axe,
     overflow, interaction flows, keyboard focus and special states.
   - **Plus a new grayscale structural review:** automated screenshots of every
     screen of all four options, rendered in grayscale and placed side by side
     for desktop and mobile. This is the acceptance check for "four different
     structures".
6. **Client preview:** selector names and descriptions change only after
   implementation and QA pass.

---

## 13. Decisions requested

1. **Approve the three structures**, or mark changes per option.
2. **Option 3:** a persistent left navigation rail (app shell) on every page —
   OK?
3. **Option 4:** the bidding console docked to the bottom of the screen on
   desktop as well as mobile — OK?
4. **Options 2 and 3:** no bottom tab bar on mobile (navigation through a
   full-screen menu instead) — OK?
5. **Client-facing names:** Visual Marketplace, Marketplace Hub and Auction
   Commerce — confirm.
6. **Concept ideas** that need backend or business decisions (section 11) may
   appear in the preview as design ideas, as in earlier rounds — confirm.
