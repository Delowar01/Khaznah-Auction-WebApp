# Auction-first homepages and Featured Items — Options 1, 2, 3 and 4

This pass makes all four homepages in the isolated `design-preview/` app
auction-first, and gives each one a Featured Items section.

- **Auctions now come first everywhere a visitor chooses how to shop:**
  - navigation and mobile menus;
  - footer Marketplace links;
  - hero buttons and the hero line;
  - How-it-works copy;
  - section order.

  Buy Now is still present on every page, at the same size and with the same
  features. It now always follows the auctions.
- **Featured Items:** each homepage has its own section, designed in that
  option's style. It lists live auction lots first, then three Buy Now items.

What did not change:

- No image was generated, regenerated, replaced, edited or mirrored. Priority 1 and 2 imagery is untouched.
- No inner page changed: Browse, Product, Auction, Live, Seller and System are pixel-identical on all four options (§J).
- No new dependency, backend field or shared product record. Featured Items are curated lists inside each homepage.
- Nothing was done in production, on Vercel or on the domain. Priority 3 was not started.

---

## A. Baseline

- **Starting commit:** `68992f2` ("Final polish for all four Khaznah homepage concepts") on `claude/magical-faraday-fne4kq`.
- **Checks before editing:**
  - HEAD matched `origin/claude/magical-faraday-fne4kq`;
  - the working tree was clean.
- **Comparison build:** a production build of `68992f2` in a separate worktree. Every before/after measurement below compares that build with this change.
- **Business rules at `68992f2`:** the rule script from §I fails 58 times on the starting commit and passes on this change.

## B. Business hierarchy audit

The audit was made before any edit. "Current" is the order at `68992f2`, in DOM
order, which is also the Arabic reading order.

| Location | Current order (`68992f2`) | Required order | Action |
|---|---|---|---|
| **Option 1** desktop nav (shared header) | Live now · Auctions · Buy Now · Ending soon · Bulk & pallets · Sellers | Auctions · Live · Buy Now · Sellers · Bulk | Reordered **on the homepage only**: Auctions · Ending soon · Live now · Buy Now · Sellers · Bulk & pallets. Ending soon is a timed-auction shortcut, so it stays beside Auctions. Inner pages are unchanged (§L). |
| Option 1 mobile menu (shared) | Live now · Auctions · Buy Now · Ending soon · Bulk & pallets · Sellers | as above | Reordered on the homepage only, using the same order. |
| Option 1 "All categories" quick links (shared) | Under an hour · Just listed · Buy Now deals · Most bids · Bulk | auction shortcuts before Buy Now | Reordered on the homepage only: Under an hour · Most bids · Just listed · Buy Now deals · Bulk. |
| Option 1 footer Marketplace (shared) | Live auctions · All auctions · Buy Now · Bulk pallets | Timed · Live · Buy Now · Bulk | Reordered on the homepage only: All auctions · Live auctions · Buy Now · Bulk pallets. The shared `FOOTER_COLUMNS` data is not edited, because every option's inner-page footer uses it. |
| Option 1 footer line (shared) | "…timed auctions, Buy Now and live sales…" | auctions before Buy Now | On the homepage only: "…timed auctions, live sales and Buy Now…" (EN/AR). |
| Option 1 hero, promo tiles, How it works | Explore auctions (primary) · Shop Buy Now; Ending-soon tile · Buy Now deals tile; "Bid, or buy it now" | auction first | Already auction-first. No change. |
| Option 1 mobile tab bar | Home · Categories · Live · Cart · Account | n/a | No Buy Now entry. No change. |
| Option 1 sections | … Auctions closing soon · Live auctions · Deals on Buy Now … | … auctions · Featured Items · Buy Now … | Featured Items added between Live auctions and the Deals grid. |
| **Option 2** desktop nav and menu drawer | Buy Now (bold) · Timed Auctions · Live Auction · Sellers · Bulk & Pallets | Timed · Live · Buy Now · Sellers · Bulk | Reordered. Timed Auctions is now the bold first mode. |
| Option 2 footer Marketplace | Buy Now · Timed · Live · Bulk | Timed · Live · Buy Now · Bulk | Reordered. |
| Option 2 hero buttons | brass **Shop Buy Now** · outline Explore auctions | auction primary | Swapped: brass **Explore auctions** · outline Shop Buy Now. Same sizes. |
| Option 2 hero line, How it works | "Buy now, bid or discover…"; step "Buy now or bid" | auction first | "Bid, buy now or discover…"; "Bid or buy now". Step text reordered (EN/AR). |
| Option 2 sections | Categories · **Buy Now** · Ending soon · Selected · Live · Bulk … | Categories · Ending soon · Live · Featured · Buy Now … | Reordered, and Featured Items added. |
| **Option 3** mode row and menu | Discover · Buy Now · Timed · Live · Sellers · Bulk | Discover · Timed · Live · Buy Now · Sellers · Bulk | Reordered. Discover stays first and selected. |
| Option 3 footer Marketplace | Buy Now · Timed · Live · Bulk | Timed · Live · Buy Now · Bulk | Reordered. |
| Option 3 hero buttons | gold **Shop Buy Now** · outline Explore auctions | auction primary | Swapped: gold **Explore auctions** · outline Shop Buy Now. |
| Option 3 hero line, How it works | "Buy now, bid or discover…"; "Buy now or bid" | auction first | "Bid, buy now or discover…"; "Bid or buy now" (EN/AR). |
| Option 3 sections | Pills · **Buy Now wall** · Live banner · Ending soon · Sellers … | Pills · Live/Ending · Featured · wall … | Reordered: Live banner · Ending soon · Featured Items · wall. The approved "navy live banner before Ending soon" is kept. |
| Option 3 wall tabs | Buy Now · Recommended | n/a | Both tabs show Buy Now items, so no auction/Buy Now choice. No change. |
| **Option 4** nav and menu | Buy Now · Timed · Live · Sellers · Bulk | Timed · Live · Buy Now · Sellers · Bulk | Reordered. |
| Option 4 footer Marketplace | Buy Now · Timed · Live · Bulk | Timed · Live · Buy Now · Bulk | Reordered. |
| Option 4 hero buttons | green **Shop Buy Now** · outline Explore auctions | auction primary | Swapped: green **Explore auctions** · outline Shop Buy Now. Widths moved with the labels. |
| Option 4 hero line, How it works | "Buy now, bid or discover…"; "A simple way to buy and bid."; "Buy now or bid" | auction first | "Bid, buy now or discover…"; "A simple way to bid and buy."; "Bid or buy now", with the step text reordered (EN/AR). |
| Option 4 sections | Trust · **Category rail + Buy Now** · Recommended · Ending soon + Live … | Trust · Auctions + Live · Featured · Buy Now · Recommended … | Reordered, and Featured Items added. |
| Option 4 Recommended (data) | capsule coffee maker, task lamp (both Buy Now) | after Buy Now | Data checked: Buy Now only, and it now sits after the Buy Now floor. No change. |
| Option 4 search | category scope · query · Search | n/a | Search ranking does not offer an auction/Buy Now choice. Untouched, with every fix preserved (§J). |
| Option 2–4 Bulk & Pallets | auction pallet · Buy Now pallet | auction first | Already auction-first. No change. |
| Selector descriptions (`data/concepts.js`) | listed the old section order | match the pages | Options 2–4 descriptions updated (EN/AR). |

## C. Final order by option

**Option 1 · Modern Commerce**
1. Hero carousel with promo tiles (Ending in under an hour, then Buy Now deals) and the trust strip
2. Shop by category
3. Auctions closing soon (rail)
4. Live auctions
5. **Featured Items**
6. Deals on Buy Now
7. Bulk & pallets
8. Shop by seller
9. How it works and Condition grades

**Option 2 · Premium Modern**
1. Hero (A3/A4 room photograph, unchanged)
2. Category row
3. Ending soon (stone band)
4. Live auction
5. **Featured Items**
6. Buy Now, ready to discover
7. Selected for your everyday
8. Bulk & Pallets
9. Featured Sellers
10. Trust strip
11. Condition grades and How Khaznah works
12. Newsletter and footer

**Option 3 · Visual Discovery**
1. Hero mosaic (unchanged, never mirrored)
2. Category pills
3. Navy live banner
4. Ending soon
5. **Featured Items**
6. Product wall (Buy Now / Recommended)
7. Seller shelves
8. Bulk & Pallets
9. A little clarity
10. How it works
11. Newsletter and footer

Live comes before Ending soon here, as in the approved design. The navy band
then sits between the pills and the white auction cards, which avoids three
white card sections in a row.

**Option 4 · Contemporary Saudi**
1. Hero with search
2. Trust strip
3. Ending soon beside Live Auction
4. **Featured Items**
5. Shop by Category rail beside Buy Now
6. Recommended for you
7. Featured Sellers
8. Bulk & Pallets
9. How Khaznah works
10. Condition grades
11. Green newsletter/footer band

The before/after section-order sheets are in
`docs/auction-first-featured/option-N-section-order.jpg`.

## D. Navigation order

DOM order is the same in English and Arabic. In Arabic the first item sits at the right, as RTL expects; the business order does not change.

| Option | Desktop navigation | Mobile menu | Footer Marketplace |
|---|---|---|---|
| 1 (homepage) | Auctions · Ending soon · Live now · Buy Now · Sellers · Bulk & pallets | same | All auctions · Live auctions · Buy Now · Bulk pallets |
| 1 (inner pages, unchanged) | Live now · Auctions · Buy Now · Ending soon · Bulk & pallets · Sellers | same | Live auctions · All auctions · Buy Now · Bulk pallets |
| 2 | **Timed Auctions** · Live Auction · Buy Now · Sellers · Bulk & Pallets | same (drawer; also Arabic below 1366 px) | Timed Auctions · Live Auction · Buy Now · Bulk & Pallets |
| 3 | Discover · Timed Auctions · Live Auction · Buy Now · Sellers · Bulk & Pallets | same | Timed Auctions · Live Auction · Buy Now · Bulk & Pallets |
| 4 | Timed Auctions · Live Auction · Buy Now · Sellers · Bulk & Pallets | same | Timed Auctions · Live Auction · Buy Now · Bulk & Pallets |

**Option 1 and shared navigation (brief §25).** Option 1's header, menus and
footer are one shared component set. It also renders Option 1's inner pages, and
its footer data is shared with the inner-page footers of all four options.

- **What was done:** the new order applies on the homepage only, through one helper, `useHomeOrder` in `components/concept-b/utils/navigation.jsx`.
- **Inner pages:** unchanged. They still show the old order, and they are pixel-identical to `68992f2` (§J).
- **Approval needed:** whether the inner pages should use the same order is reported here, not decided. Switching them is a small change, but it alters inner pages.

## E. Featured Items implementation

**What every option shares:**
- auctions come first in the DOM and visually;
- auction cards show the current bid, a live countdown with a "Time left" screen-reader prefix, and a Bid now link that is stronger than the Buy Now control;
- save/watch buttons use each option's existing heart or watch component;
- every link goes to `detailPath()`: `/auction/<slug>` for auctions, `/product/<slug>` for Buy Now;
- the section is a labelled `<section>` with an `<h2>`. Items are `<h3>` cards in lists, and the Buy Now group has its own label.

**Curation:** each option's homepage holds a curated list (no backend field, no change to shared product records).

- **Auctions:** the same four live lots on every option:

  | Lot | Time left | Bids | Current bid | Grade |
  |---|---|---|---|---|
  | `fridge-690` | 5 h 40 m | 23 | SAR 3,150 | A (also has a Buy Now price) |
  | `dishwasher` | 7 h 20 m | 14 | SAR 1,120 | B |
  | `swivel-chair` | 1 d 3 h | 12 | SAR 890 | A |
  | `tv-43` | 2 h 14 m | 18 | SAR 1,240 | B |

  - These lots run longest among non-bulk lots. Ending soon already shows the three lots closing within the hour (`seat-covers`, `split-ac`, `washer-front`).
  - Not used: the scheduled `leather-sofa`, the sold `robot-vacuum`, and the bulk lots shown in Bulk & Pallets.
  - Categories: appliances, furniture and electronics.
- **Buy Now:** three items per option, in stock, picked so they do not repeat that page's Buy Now, Recommended or Deals items:
  - categories: kitchen, tools, fashion, furniture, automotive and appliances;
  - none is out of stock (`tyre-inflator` is avoided).

| Option | Where | Design | Order and items |
|---|---|---|---|
| 1 Modern Commerce | `components/concept-b/home/FeaturedItems.jsx` (new), placed in `pages/HomePage.jsx` | Structured commerce cards. A wide lead card spans 2 of 5 columns. It has the "Auction + Buy Now" badge, the watch button, a large current bid with bid count, the countdown pill, a primary Bid now and a quiet "Or buy it now · SAR 4,600" line. The existing Option 1 `AuctionCard` follows three times. Then "Also on Buy Now" shows three existing `MiniCard`s. Phones: the lead card, a swipe rail of auction cards, then stacked mini cards. | A `fridge-690` (lead) · A `dishwasher` · A `swivel-chair` · A `tv-43` · B `dutch-oven-blue` · B `multimeter` · B `field-watch` |
| 2 Premium Modern | `premium-modern/sections.jsx` (`FeaturedItems`), list in `data.js` (`FEATURED`) | Editorial shelf in ivory, charcoal and brass. The lead lot's kitchen scene sits beside an ivory panel: brass-dash "Auction" eyebrow, grade, current bid with bid count, red time left, charcoal Bid now. Three auction cards follow on stone plates, each with a bronze "Auction" eyebrow. Below a hairline sits a slim "Also on Buy Now" row with outline cart buttons. It uses each lot's second catalogue photo, so the category row's cut-outs are not repeated. | A `dishwasher` (scene photo) · A `fridge-690` · A `swivel-chair` · A `tv-43` · B `floor-lamp` · B `field-watch` · B `dutch-oven-blue` |
| 3 Visual Discovery | `visual-discovery/sections.jsx` (`FeaturedItems`), `data.js`, grid in `styles/r3-visual-discovery.css` (`.vd-featured`) | Image-forward mosaic, like the product wall. The lead tile is the dishwasher's kitchen scene, full bleed, with a coral countdown pill and a white bid card with an indigo Bid now. Two tinted-plate auction tiles and one wide auction tile follow. The "Buy Now finds" row has compact photo cards with quieter outline cart circles. | A `dishwasher` (scene photo) · A `fridge-690` · A `swivel-chair` · A `tv-43` · B `car-cooler` (scene photo) · B `floor-lamp` · B `microwave` |
| 4 Contemporary Saudi | `saudi-commerce/sections.jsx` (`FeaturedItems`), `data.js` | Clean green and cream product cards: four auction cards on a light cream panel, each with a green "Auction" tag, grade, current bid with bid count, red countdown and a full-width green Bid now. Below, "Also available to buy now" shows compact horizontal cards with outline cart buttons. Phones swipe the cards inside the panel; from 640 px they form a 2 × 2 grid, and from 1024 px one row. | A `fridge-690` · A `dishwasher` · A `swivel-chair` · A `tv-43` · B `floor-lamp` · B `car-cooler` · B `multimeter` |

**Copy:** one central entry per option, in that option's `copy.js`. The
support line never presents Buy Now as the main business.

| Option | Title EN / AR | Support line EN / AR | Buy Now group |
|---|---|---|---|
| 1 | Featured Items / منتجات مميزة | Top auction lots open for bids, plus selected Buy Now items / أبرز منتجات المزاد المفتوحة للمزايدة، مع منتجات مختارة للشراء الفوري | Also on Buy Now / متاح أيضاً للشراء الفوري |
| 2 | Featured Items / منتجات مميزة | A curated edit of auction lots, with a few Buy Now finds. / مختارات من منتجات المزاد، مع بعض منتجات الشراء الفوري. | Also on Buy Now / متاح أيضاً للشراء الفوري |
| 3 | Featured Items / منتجات مميزة | Standout auction lots to bid on, plus a few Buy Now finds. / منتجات مزاد لافتة للمزايدة عليها، مع بعض منتجات الشراء الفوري. | Buy Now finds / منتجات الشراء الفوري |
| 4 | Featured Items / منتجات مميزة | Selected auction lots open for bidding, with a few Buy Now items. / منتجات مزاد مختارة مفتوحة للمزايدة، مع بعض منتجات الشراء الفوري. | Also available to buy now / متاح أيضاً للشراء الفوري |

The section link goes to the auctions: "All auctions" in Options 1, 2 and 4,
and the existing "View all auctions" in Option 3.

## F. Files changed

All paths are in `design-preview/`.

- **Option 1:**
  - `components/concept-b/home/FeaturedItems.jsx` (new);
  - `pages/HomePage.jsx`;
  - `utils/navigation.jsx` (`useIsHome`, `useHomeOrder`);
  - `layout/CategoryNav.jsx`, `layout/MobileMenu.jsx`, `layout/MegaMenu.jsx` and `layout/Footer.jsx` (homepage order only);
  - `copy.js`.
- **Option 2:** `components/concept-a/premium-modern/` — `Header.jsx`, `Footer.jsx`, `Hero.jsx`, `PremiumModernHome.jsx`, `sections.jsx`, `data.js`, `copy.js`.
- **Option 3:**
  - `components/concept-c/visual-discovery/` — `Header.jsx`, `Footer.jsx`, `Hero.jsx`, `VisualDiscoveryHome.jsx`, `sections.jsx`, `data.js`, `copy.js`;
  - `styles/r3-visual-discovery.css`.
- **Option 4:** `components/concept-d/saudi-commerce/` — `Header.jsx`, `Footer.jsx`, `Hero.jsx`, `SaudiCommerceHome.jsx`, `sections.jsx`, `data.js`, `copy.js`.
- **Selector:**
  - `data/concepts.js` (Options 2–4 descriptions);
  - 28 thumbnails in `public/images/concepts/`, recaptured because their first viewport changed:
    - Option 1 desktop ×4;
    - Options 2, 3 and 4 desktop and mobile, ×8 each.

  Option 1's four mobile thumbnails show an unchanged viewport. They are byte-identical to `68992f2`.
- **Docs:** this report and `docs/auction-first-featured/`.

Not changed:
- `data/products.js`, `data/site.js` and every shared component;
- every inner page;
- every catalogue and work image.

## G. EN/AR results

- **Copy:** every new or reordered string has English and Arabic in that option's `copy.js` (§E). The reordered phrases:
  - "زايد أو اشترِ فوراً أو اكتشف ما لم تتوقعه.";
  - "زايد أو اشترِ فوراً";
  - "طريقة بسيطة للمزايدة والشراء.".
- **RTL:**
  - the DOM order is auction-first in Arabic, and every Arabic business rule passes (§I);
  - grids and rails mirror, so the lead lot sits on the right;
  - countdowns read as "5 س 40 د";
  - photographs are not mirrored.
- **Screenshots:** 1440 and 390 px in both languages for every option, in `docs/auction-first-featured/`.

## H. Responsive QA

**Audit.** Every homepage was checked in EN and AR at 1920, 1440, 1366, 1280,
1200, 1024, 768, 480, 390 and 320 px: 80 page loads, with all images loaded.

| Check | Result |
|---|---|
| Horizontal overflow | 0 at every width |
| Broken or pending images | 0 |
| Text spilling out of buttons and links | 0 |
| axe serious/critical (WCAG 2.1 A/AA) | 0 |
| Console errors / failed requests | 0 / 0 |
| Tap targets under 24 px (≤ 480 px) | Options 2–4: same items and counts as `68992f2`; nothing new. Option 1: same as `68992f2`. |
| Tap targets under 44 px tall (≤ 480 px) | Options 2–4 unchanged. Option 1: +5, which are the four 36 px watch buttons on the Featured auction cards and the 36 px "All auctions" link. These are the existing Option 1 components, at the same size as everywhere else on the page. |

**How Featured Items fits.** It fits at every width in both languages:
- Option 1: lead + 3 cards in one row from 1024 px.
- Option 2: lead + 3 from 1200 px; below that the lead goes full width with a portrait photo crop, so the whole dishwasher stays in view.
- Option 3: the mosaic from 768 px.
- Option 4: four in a row from 1024 px.
- Phones use swipe rails (Options 1, 2 and 4) or a stacked mosaic (Option 3).
- The Buy Now rows stack (one per line) below 1200 px in Option 2 and below 1024 px in Options 3 and 4, so titles keep their room. Option 2's cart button becomes icon-only below 380 px; the full name stays in its label.

**Hero buttons.** They fit at every width. For example, Option 2's
"Explore auctions" with its chevron needs 151 px of a 157 px label area at
1440 px.

**Page height at 1440 px EN.** The new section adds about one screen:

| Option | Before | After | Added |
|---|---|---|---|
| 1 | 5,483 px | 6,253 px | +770 px |
| 2 | 3,780 px | 4,505 px | +725 px |
| 3 | 3,843 px | 4,650 px | +807 px |
| 4 | 3,835 px | 4,632 px | +797 px |

## I. Business-rule QA

`rules.mjs` runs on each option in EN and AR (1440 px desktop, 390 px menu).
It asserts:

1. **Desktop navigation:** auction modes before Buy Now, in the locked order Timed → Live → Buy Now → Sellers → Bulk. In Option 1, Ending soon also comes before Buy Now.
2. **Mobile menu:** the same order inside the opened drawer.
3. **Footer Marketplace:** Timed → Live → Buy Now → Bulk.
4. **Hero:** the auction button comes before the Buy Now button. Its fill was recorded: white on the Option 1 slide, brass, gold, and green.
5. **First transactional section:** the first product section after the hero is an auction section.
6. **Section order:** no Buy Now section comes before auction content (Timed/Ending soon, Live and Featured Items). Mixed modes that the brief places after Buy Now (Bulk, Sellers) are not counted.
7. **Featured Items:**
   - it exists as a labelled section before the first Buy Now section;
   - inside it every auction comes before every Buy Now item: `A A A A B B B` on all options.

| | 1 EN | 1 AR | 2 EN | 2 AR | 3 EN | 3 AR | 4 EN | 4 AR |
|---|---|---|---|---|---|---|---|---|
| `68992f2` | fail | fail | fail | fail | fail | fail | fail | fail |
| This change | **pass** | **pass** | **pass** | **pass** | **pass** | **pass** | **pass** | **pass** |

**Featured interactions.** Checked per option in EN/AR at 1440 and 390 px:
- the save or watch toggle flips `aria-pressed`;
- Buy Now "add to cart" updates the cart count (Options 2–4; Option 1's Buy Now mini cards are link cards, as everywhere in Option 1);
- all 8 links in the section return 200;
- keyboard focus is visible on every control tabbed through.

All 16 runs pass.

## J. Regression against `68992f2`

| Check | Result |
|---|---|
| Option 1 inner pages: Browse, Product, Auction, Live, Seller, System at 1440/1024/390 EN/AR | 36 full-page screenshots, 0 px differ |
| Options 2, 3 and 4 inner pages (Round 2 prototypes): the same routes at 1440/390 EN/AR | 3 × 24 screenshots, 0 px differ |
| Option 1 inner-page navigation, menu and footer order | Identical to `68992f2` on every inner route |
| Option 1 presentation bar (every Option 1 screen, 6 widths) | 84 comparisons, 0 differ |
| Option 4 search matrix: suggestions layering, See all results, keyboard, Escape, phone result widths, footer, newsletter | Every row measured at the same width as the `68992f2` matrix is identical (28 rows) |
| Option 4 search placeholder | Fits at every width in EN/AR, with the same shortening rules as before |
| Polish fixes from `68992f2` | Overflow is still 0 at every width, including 320 px, on every option; the Option 2 and 4 footers have 0 clipped or outside items; tap targets are unchanged on Options 2–4 |
| Priority 1/2 imagery | No image file changed apart from the selector thumbnails. Heroes use the same A3/A4, A5 and A6/A7 files, unmirrored. |
| Selector | Names and one-liners match the data; all 16 previews load from the current files; the Option 1 card markup is identical (EN/AR); 0 failing checks |
| Concept switching | 36 transitions (9 option pairs × EN/AR × desktop/mobile): full load, the same stylesheets, computed styles and pixels as a fresh load. 0 failing. |
| Lint / build | `eslint .` is clean, and `next build` succeeds |
| Static export (`STATIC_EXPORT=1`, trailing-slash URLs) | The export builds. `/en/` and `/ar/concept-b/` get the homepage order, `/en/concept-b/browse/` keeps the inner-page order, and Options 2–4 match the server build. |

## K. Performance

- **No new dependencies and no new image files.** Featured Items reuse the
  existing catalogue derivatives and cut-outs, through the shared `Img`
  component.
  - Images are lazy-loaded; no priority images were added.
  - The new components are small client components with no new effects. The
    countdowns use the existing shared clock.
- **Measured at 1440 px EN:**

| Option | JS | Featured Items images | All images after a full scroll |
|---|---|---|---|
| 1 | +7 KB | 7 images, 65 KB | 742 → 767 KB |
| 2 | +7 KB | 7 images, 226 KB | 856 → 1,082 KB |
| 3 | +8 KB | 7 images, 321 KB | 588 → 909 KB |
| 4 | +5 KB | 7 images, 342 KB | 1,191 → 1,408 KB |

- **First load:** on Options 2–4, first-load image bytes rise by about 150–170 KB. Featured Items now sits within the browser's lazy-load distance of the first screen; this comes from where the section sits, not from eager loading.

## L. Remaining limitations

1. **Option 1 inner pages keep the old mode order.** The shared header, menu and footer are reordered on the homepage only (§D, brief §25).
   - Inner pages still read: Live now · Auctions · Buy Now · Ending soon · Bulk & pallets · Sellers.
   - **Recommendation:** approve the auction-first order for the whole site. The same switch should then apply to the shared `FOOTER_COLUMNS` used by all four options' inner pages.
2. **Featured Items is a curated list per homepage.** Production would need a curation field or a ranking rule. No backend field was added.
3. **Demo timing.** Countdowns run from page load. The featured lots have 2 h 14 m to 1 d 3 h left.
4. **Small overlaps that cannot be avoided in demo data:**
   - Option 1's auction rail already lists every live auction, including the four featured ones.
   - Option 4's Red Sea seller row shows a TV thumbnail.
5. **Option 1 card badge.** The Option 1 swivel-chair card shows the existing "New" listing badge instead of "Auction"; that is existing `AuctionCard` behaviour. The current bid, countdown and Bid now still mark it as an auction.
6. **Option 3 lead tile on phones.** The bid card covers the lower part of the dishwasher photo. This is the overlay style of the option's other photo tiles.
7. **Page length.** Each homepage grows by about 725–807 px at 1440 px. That is the cost of a full Featured Items section (§H).

## Deployment

- **Push:** this branch is pushed to `origin/claude/magical-faraday-fne4kq`. The connected Vercel project builds a preview of each pushed commit automatically, so the push publishes a preview without any manual deployment.
- **Not changed:**
  - no Vercel setting;
  - no domain;
  - no production environment;
  - no production Khaznah frontend, backend, API, admin, seller dashboard or warehouse site.
