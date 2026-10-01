# Site-wide auction-first navigation — Options 1, 2, 3 and 4

This pass applies the approved auction-first order to the navigation of every
customer-facing route in the isolated `design-preview/` app. It covers the
desktop header, the "All categories" quick links, the mobile menu and the
footer.

- **Result:** at `c77ea32`, 288 navigation groups on inner pages put a mode
  out of the approved order. Now there are none.
- **Order used everywhere:** Auctions · Ending soon · Live now · Buy Now ·
  Sellers · Bulk & pallets. The quick links read Ending in under an hour ·
  Most bids · Just listed · Buy Now deals · Bulk & pallets. The footer reads
  All auctions · Live auctions · Buy Now · Bulk pallets.
- **Inner pages:** only the header, menus and footer changed. Page content
  between header and footer is pixel-identical to `c77ea32` (§8).
- **Homepages:** pixel-identical to `c77ea32`. They already used this order.

What did not change:

- No layout, section, card, image, product, auction, search, seller, cart or
  watchlist code was touched. No link was added or removed; only the order changed.
- Homepage section order, Featured Items and hero layouts are unchanged.
- The Options 2–4 homepages (premium-modern, visual-discovery, saudi-commerce
  components) were not edited.
- No image was generated, regenerated or edited. Priority 1/2 assets and the
  selector are untouched. Priority 3 was not started.
- Nothing was done in production, on Vercel or on the domain.

---

## 1. Starting commit

- **Commit:** `c77ea32` ("Make Khaznah homepages auction-first and add
  Featured Items") on `claude/magical-faraday-fne4kq`.
- **Checks before editing:**
  - HEAD matched `origin/claude/magical-faraday-fne4kq`;
  - the working tree was clean.
- **Comparison build:** a production build of `c77ea32` in a separate
  worktree, served next to this change. Every before/after figure below
  compares the two builds.

## 2. Final commit

The commit that adds this report: "Apply auction-first navigation across
Khaznah preview". Its parent is `c77ea32`.

- The report cannot contain its own hash.
- `git log -1 --format=%H -- SITE_WIDE_AUCTION_FIRST_NAVIGATION_REPORT.md`
  prints the hash.

## 3. Routes audited

There are 10 routes per option, so 40 routes. Each was audited in English and
Arabic: 80 pages.

| Route | What it is |
|---|---|
| `/{en,ar}/concept-{b,a,c,d}` | Homepage (Option 1 = `b`, 2 = `a`, 3 = `c`, 4 = `d`) |
| `…/browse` | Browse with filters |
| `…/auction` and `…/auction/fridge-690` | Auction lot page: the featured lot and a named lot |
| `…/product` and `…/product/task-lamp` | Buy Now product page: the featured product and a named one |
| `…/live-auction` | Live auction |
| `…/seller` and `…/seller/RAWABI` | Seller storefront: the featured seller and a named one |
| `…/system` | Design-system page |

- **Inner pages:** for Options 2–4, the nine inner routes are the Round 2
  prototype screens.
- **Not audited, because they show no shopping modes:**
  - the language entry page `/`;
  - the selector `/{lang}`;
  - the device-preview frame `/{lang}/preview`, which only frames the routes above.

**How each page was audited** (script `navaudit.mjs`, run on both builds):

- **1440 px:** the header was checked. Then the "All categories" menu was opened
  and its quick links checked. The footer and every in-page group were checked.
  An in-page group is a list, nav, tab, radio group or form holding two or more
  modes.
- **390 px:** the mobile menu was opened, and its contents checked.

Each group is classified by its link targets (`?tab=auction`, `/live-auction`,
`?tab=buy_now`, `?ending=1h`, `sort=most_bids`, `/seller`, `bulk-pallets`) and by
its control text (sale-type switches, bid and buy buttons). Two rules are checked:

- **R1:** no Buy Now item comes before the first auction item. Auction items are
  timed, live, ending soon, most bids and bid.
- **R2:** in navigation groups, the order is Timed → Live → Buy Now → Sellers →
  Bulk. Ending soon and Most bids come before Buy Now items.

## 4. Every ordering change

### 4.1 By component

DOM order is also the reading order in Arabic (§6).

| Component | Used by | Before (`c77ea32`) | After |
|---|---|---|---|
| Desktop header nav (`CategoryNav`) | Option 1: home + 9 inner routes. Options 2–4: 9 inner routes each. | Inner pages: Live now · Auctions · Buy Now · Ending soon · Bulk & pallets · Sellers. Option 1 home: already the new order, through a home-only re-sort. | Auctions · Ending soon · Live now · Buy Now · Sellers · Bulk & pallets |
| Mobile menu (`MobileMenu`) | same | same as the header | same as the header |
| "All categories" quick links (`MegaMenu`) | same | Ending in under an hour · Just listed · Buy Now deals · **Most bids** · Bulk & pallets | Ending in under an hour · **Most bids** · Just listed · Buy Now deals · Bulk & pallets |
| Footer Marketplace links (`FOOTER_COLUMNS`, shared data) | Option 1: home + inner. Options 2–4: inner routes. | Live auctions · All auctions · Buy Now · Bulk pallets | All auctions · Live auctions · Buy Now · Bulk pallets |
| Footer line (`COPY.footerBlurb`) | same footers | "…timed auctions, Buy Now and live sales…" | "…timed auctions, live sales and Buy Now…" (EN/AR). Option 2 says "presenter-led live sales". |
| `NAV` in `data/site.js` | no component imports it | Auctions · Buy Now · Live · Sellers · How it works | Auctions · Live · Buy Now · Sellers · How it works (kept consistent) |

Notes:

- **Ending soon** is a timed-auction shortcut, so it stays beside Auctions,
  before Live now. This is the Option 1 homepage order approved at `c77ea32`.
- **Just listed** lists every sale type, so it is neutral. It stays where it
  was, between the auction shortcuts and Buy Now deals.
- **No link was added, removed or renamed.** Each list has the same items,
  labels, icons and targets.

### 4.2 Audit table

Routes with the same result are grouped. English labels are shown. The Arabic
rows have the same order on every route (§6). Option 4's "Live" is its live
pill, which also shows the viewer count. The full table, with every route
and both languages (348 rows), is in
[`docs/site-wide-navigation/route-audit.csv`](docs/site-wide-navigation/route-audit.csv).

"All 9 inner routes" means `/browse`, `/auction`, `/auction/fridge-690`,
`/product`, `/product/task-lamp`, `/live-auction`, `/seller`, `/seller/RAWABI`
and `/system`.

| Option | Route | Location | Before | After | Result |
|---|---|---|---|---|---|
| Option 1 | Home | Desktop header nav | Auctions › Ending soon › Live now › Buy Now › Sellers › Bulk & pallets | Auctions › Ending soon › Live now › Buy Now › Sellers › Bulk & pallets | Already correct |
| Option 1 | Home | All categories menu (quick links) | Ending in under an hour › Most bids › Just listed › Buy Now deals › Bulk & pallets | Ending in under an hour › Most bids › Just listed › Buy Now deals › Bulk & pallets | Already correct |
| Option 1 | Home | Mobile menu | Auctions › Ending soon › Live now › Buy Now › Sellers › Bulk & pallets | Auctions › Ending soon › Live now › Buy Now › Sellers › Bulk & pallets | Already correct |
| Option 1 | Home | Footer: Marketplace | All auctions › Live auctions › Buy Now › Bulk pallets | All auctions › Live auctions › Buy Now › Bulk pallets | Already correct |
| Option 1 | Home | Hero buttons (slide 1) | Explore auctions › Shop Buy Now | Explore auctions › Shop Buy Now | Already correct |
| Option 1 | All 9 inner routes | Desktop header nav | Live now › Auctions › Buy Now › Ending soon › Bulk & pallets › Sellers | Auctions › Ending soon › Live now › Buy Now › Sellers › Bulk & pallets | Fixed |
| Option 1 | All 9 inner routes | All categories menu (quick links) | Ending in under an hour › Just listed › Buy Now deals › Most bids › Bulk & pallets | Ending in under an hour › Most bids › Just listed › Buy Now deals › Bulk & pallets | Fixed |
| Option 1 | All 9 inner routes | Mobile menu | Live now › Auctions › Buy Now › Ending soon › Bulk & pallets › Sellers | Auctions › Ending soon › Live now › Buy Now › Sellers › Bulk & pallets | Fixed |
| Option 1 | All 9 inner routes | Footer: Marketplace | Live auctions › All auctions › Buy Now › Bulk pallets | All auctions › Live auctions › Buy Now › Bulk pallets | Fixed |
| Option 1 | /browse, /system | Sale type switch | Auctions › Buy Now | Auctions › Buy Now | Already correct |
| Option 1 | /seller, /seller/RAWABI | Storefront tabs | Auctions › Buy Now | Auctions › Buy Now | Already correct |
| Option 2 | Home | Desktop header nav | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Already correct |
| Option 2 | Home | Mobile menu | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Already correct |
| Option 2 | Home | Footer: Marketplace | Timed Auctions › Live Auction › Buy Now › Bulk & Pallets | Timed Auctions › Live Auction › Buy Now › Bulk & Pallets | Already correct |
| Option 2 | All 9 inner routes | Desktop header nav | Live now › Auctions › Buy Now › Ending soon › Bulk & pallets › Sellers | Auctions › Ending soon › Live now › Buy Now › Sellers › Bulk & pallets | Fixed |
| Option 2 | All 9 inner routes | All categories menu (quick links) | Ending in under an hour › Just listed › Buy Now deals › Most bids › Bulk & pallets | Ending in under an hour › Most bids › Just listed › Buy Now deals › Bulk & pallets | Fixed |
| Option 2 | All 9 inner routes | Mobile menu | Live now › Auctions › Buy Now › Ending soon › Bulk & pallets › Sellers | Auctions › Ending soon › Live now › Buy Now › Sellers › Bulk & pallets | Fixed |
| Option 2 | All 9 inner routes | Footer: Marketplace | Live auctions › All auctions › Buy Now › Bulk pallets | All auctions › Live auctions › Buy Now › Bulk pallets | Fixed |
| Option 2 | /browse, /system | Sale type switch | Auctions › Buy Now | Auctions › Buy Now | Already correct |
| Option 2 | /seller, /seller/RAWABI | Storefront tabs | Auctions › Buy Now | Auctions › Buy Now | Already correct |
| Option 3 | Home | Desktop header nav | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Already correct |
| Option 3 | Home | Mobile menu | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Already correct |
| Option 3 | Home | Footer: Marketplace | Timed Auctions › Live Auction › Buy Now › Bulk & Pallets | Timed Auctions › Live Auction › Buy Now › Bulk & Pallets | Already correct |
| Option 3 | All 9 inner routes | Desktop header nav | Live now › Auctions › Buy Now › Ending soon › Bulk & pallets › Sellers | Auctions › Ending soon › Live now › Buy Now › Sellers › Bulk & pallets | Fixed |
| Option 3 | All 9 inner routes | All categories menu (quick links) | Ending in under an hour › Just listed › Buy Now deals › Most bids › Bulk & pallets | Ending in under an hour › Most bids › Just listed › Buy Now deals › Bulk & pallets | Fixed |
| Option 3 | All 9 inner routes | Mobile menu | Live now › Auctions › Buy Now › Ending soon › Bulk & pallets › Sellers | Auctions › Ending soon › Live now › Buy Now › Sellers › Bulk & pallets | Fixed |
| Option 3 | All 9 inner routes | Footer: Marketplace | Live auctions › All auctions › Buy Now › Bulk pallets | All auctions › Live auctions › Buy Now › Bulk pallets | Fixed |
| Option 3 | /browse, /system | Sale type switch | Auctions › Buy Now | Auctions › Buy Now | Already correct |
| Option 3 | /seller, /seller/RAWABI | Storefront tabs | Auctions › Buy Now | Auctions › Buy Now | Already correct |
| Option 4 | Home | Desktop header nav | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Already correct |
| Option 4 | Home | Mobile menu | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Timed Auctions › Live Auction › Buy Now › Sellers › Bulk & Pallets | Already correct |
| Option 4 | Home | Footer: Marketplace | Timed Auctions › Live Auction › Buy Now › Bulk & Pallets | Timed Auctions › Live Auction › Buy Now › Bulk & Pallets | Already correct |
| Option 4 | All 9 inner routes | Desktop header nav | Live › Auctions › Buy Now › Ending soon › Bulk & pallets › Sellers | Auctions › Ending soon › Live › Buy Now › Sellers › Bulk & pallets | Fixed |
| Option 4 | All 9 inner routes | All categories menu (quick links) | Ending in under an hour › Just listed › Buy Now deals › Most bids › Bulk & pallets | Ending in under an hour › Most bids › Just listed › Buy Now deals › Bulk & pallets | Fixed |
| Option 4 | All 9 inner routes | Mobile menu | Live now › Auctions › Buy Now › Ending soon › Bulk & pallets › Sellers | Auctions › Ending soon › Live now › Buy Now › Sellers › Bulk & pallets | Fixed |
| Option 4 | All 9 inner routes | Footer: Marketplace | Live auctions › All auctions › Buy Now › Bulk pallets | All auctions › Live auctions › Buy Now › Bulk pallets | Fixed |
| Option 4 | /browse, /system | Sale type switch | Auctions › Buy Now | Auctions › Buy Now | Already correct |
| Option 4 | /seller, /seller/RAWABI | Storefront tabs | Auctions › Buy Now | Auctions › Buy Now | Already correct |

**Tally:**

| | Groups |
|---|---|
| Audited (EN 174 + AR 174) | 348 |
| Fixed | 288 (72 per option) |
| Already correct | 60 |
| Still wrong | 0 |

### 4.3 Checked and already auction-first (no change)

| Location | Order |
|---|---|
| Options 2–4 homepage header and menu drawer (their own components) | Timed Auctions · Live Auction · Buy Now · Sellers · Bulk & Pallets. Option 3 starts with the neutral Discover. |
| Options 2–4 homepage footer Marketplace | Timed Auctions · Live Auction · Buy Now · Bulk & Pallets |
| Option 1 hero (slide 1) | Explore auctions · Shop Buy Now |
| Options 2–4 hero buttons, sections and Featured Items | Auction first. The `c77ea32` business-rule script still passes on all four homepages in EN and AR. |
| Browse "Sale type" switch, and its specimen on `/system` (all options) | All · Auctions · Buy Now |
| Seller storefront tabs (all options) | All listings · Auctions · Buy Now |
| Seller stats (storefront header, summary, tiles) | Active auctions before Buy Now items |
| Lot page bid box (lots sold both ways, e.g. `fridge-690`) | Place bid comes first; the "Or buy now" panel follows |
| Card badges | "Auction + Buy Now" |
| Mobile tab bar | Home · Categories · Live · Cart · Account (no Buy Now entry) |
| Empty mini cart | One "Shop Buy Now" link (not a choice between modes) |

## 5. Shared component changes

Nineteen files, all in `design-preview/`. The change is the smallest that
fixes the order at its source.

- **`data/site.js`**
  - `FOOTER_COLUMNS`: the Marketplace links are reordered. One edit fixes the
    footer of every page that uses it:
    - Option 1, homepage and inner pages;
    - Options 2–4, inner pages.
  - `NAV`: reordered so the data agrees, although no component imports it.
- **Option 1** (`components/concept-b/`)
  - `layout/CategoryNav.jsx`, `layout/MobileMenu.jsx`, `layout/MegaMenu.jsx`:
    the link arrays are now in the approved order.
    - The home-only re-sort added at `c77ea32` is removed: `useHomeOrder`,
      `HOME_MODE_ORDER` and `HOME_QUICK_ORDER`.
    - The homepage renders exactly as before, because the arrays now hold the
      order the re-sort produced.
  - `layout/Footer.jsx`: the home-only footer column and blurb switch is
    removed. The footer maps `FOOTER_COLUMNS` directly again.
  - `utils/navigation.jsx`: `useIsHome` and `useHomeOrder` are removed. Nothing
    else used them.
  - `copy.js`: `footerBlurb` now holds the auction-first line. `footerBlurbHome`
    held the same text and is removed.
- **Options 2–4, Round 2 inner-page chrome** (`components/concept-{a,c,d}/`)
  - `layout/CategoryNav.jsx`, `layout/MobileMenu.jsx`, `layout/MegaMenu.jsx`:
    the same reordering as Option 1.
  - `copy.js`: `footerBlurb` reordered, in EN and AR.
- **Not edited:**
  - the Options 2–4 homepage components;
  - all page bodies, cards, data records and styles.

**Size:** 74 lines added, 112 removed, mostly the removed home-only helpers.
`eslint` is clean.

## 6. EN/AR result

- **Same order in both languages.** All 174 Arabic groups have the same mode
  sequence as their English counterparts. DOM order and Arabic reading order are:
  - المزادات · ينتهي قريباً · مباشر الآن · الشراء الفوري · البائعون · الجملة والطبليات (header and menu);
  - تنتهي خلال أقل من ساعة · الأكثر مزايدة · أُضيف حديثاً · عروض الشراء الفوري · الجملة والطبليات (quick links);
  - كل المزادات · المزادات المباشرة · الشراء الفوري · طبليات بالجملة (footer).
- **RTL keeps the hierarchy.** On every page and width, the on-screen
  position of each mode link was compared with the reading direction:
  - left to right in English and right to left in Arabic, then top to bottom;
  - checked in the header bar, the quick-link lists, the footer lists and the
    menu drawer.

  No position breaks the business order (0 out-of-order pairs on 320 pages).
  Arabic mirrors the layout, so Auctions sits at the right edge of the header
  and is read first.
- **Labels unchanged.** Arabic labels are the existing strings. The two footer
  lines were reordered in Arabic as well.

## 7. Responsive QA

**Matrix:** 4 options × 10 routes × EN/AR × 1440, 1024, 390 and 320 px = 320
page loads on this build, all with images loaded.

| Check | Result |
|---|---|
| Header navigation on one line and not clipped | 160 pages show the header modes. 0 issues. <br>• Every page at 1440 and 1024 px, except the Options 2 and 4 homepages at 1024 px, which show the menu button. <br>• Also the Option 3 homepage rail on phones, which scrolls sideways by design and opens on Timed Auctions. |
| Screen order follows reading order (header, quick links, footer lists, menu drawer) | 0 breaks, EN and AR (§6) |
| Keyboard: Tab through the header modes | 156 desktop pages. 0 issues. <br>• Focus follows the screen order: Auctions → Ending soon → Live → Buy Now → Sellers → Bulk. On the Options 2–4 homepages it is Timed Auctions → Live Auction → Buy Now → Sellers → Bulk & Pallets. <br>• The focus ring is visible on the first mode and on Buy Now, where it was checked. |
| "All categories" quick links | Checked on 148 desktop pages: Option 1 on every route, Options 2–4 on their inner routes, at 1440 and 1024 px. They open with Enter and close with Escape, and focus returns to the button. No overflow. 0 issues. |
| Mobile menu | Checked on 164 pages: every 390 and 320 px page, plus the Options 2 and 4 homepages at 1024 px, where the header shows the menu button. Enter opens it and focus moves inside; focus stays inside while tabbing; every link fits the drawer; Escape closes it and focus returns to the menu button. 0 issues. |
| Footer links inside the footer; no sideways scroll | 0 issues |
| Text spilling out of links/buttons in the header or footer | 0 |
| Horizontal overflow | 0, except 12 pages at 320 px. All 12 are identical at `c77ea32` and are inside page content (see below). |
| Broken images | 0 |
| Console errors / failed requests | 0 / 0 |
| Broken links | 0 of 622 distinct same-origin links, all HTTP 200. Links were collected from every page, quick-link panel and menu drawer. The 180 `#` links were checked for their target on the destination page. |
| axe serious/critical (WCAG 2.1 A/AA) | 0 on all 320 pages |
| Lint / production build | `eslint .` clean; `next build` succeeds |

**Pre-existing results in page content.** Every page that QA flagged was
measured again on the `c77ea32` build, and the values are identical:

- 12 overflow pages;
- 7 Arabic pages where an "Add to cart" label runs past its button.

They are listed in "Issues found during QA that predate this change".

## 8. Regression result

**Method.** Each route was rendered on both builds with:

- the same frozen clock and seeded random numbers;
- all images loaded;
- animations off.

Each full-page screenshot is compared in three bands:

- the header and anything above it;
- the page content between the header and the footer;
- the footer.

The content band must be pixel-identical. Its top and bottom edges must not
move. Photographs are masked by the same boxes on both builds, so their
position and size are still compared.

| Check | Result |
|---|---|
| Inner pages, all four options: 9 routes × EN/AR × 1440/1024/390/320 (288 pairs) | Content band identical on all 288. Two pairs, Option 2 `/live-auction` at 320 px EN/AR, differ by 5 and 4 px. The same pixels differ when the `c77ea32` build is compared with itself, so this is rendering noise. |
| Header band on inner pages | Changed on 144 pairs: the desktop nav at 1440 and 1024 px. At 390 and 320 px the header shows the menu button, and it is identical. |
| Footer band on inner pages | Changed on all 288: the Marketplace links and the footer line |
| Footer height | One difference. Option 1, Arabic, 1024 px: the footer is 22 px shorter on the 9 inner routes, because the reordered footer line now wraps onto one line fewer. Everything above the footer stays in place. Every other width, language and option has the same height. |
| Homepages, all four options: EN/AR × 1440/1024/390/320 (32 pairs) | Identical. 29 pairs: 0 px. See the note below for the other 3. |
| Homepage business rules (the `c77ea32` rule script) | All pass in EN and AR on all four options. The script checks the nav, menu and footer order, the hero buttons, the section order and the Featured Items order. |
| Featured Items and homepage section order | Unchanged: the homepages are pixel-identical and the rule script passes |
| Option 4 search | The search QA matrix: 10 widths × EN/AR. It covers suggestion layering, the 11 suggestions, See all results, Tab into the panel, Escape, overflow, the footer and the newsletter. All 20 rows are identical to `c77ea32`. The placeholder check is identical on all 26 rows, and the placeholder fits on every row. |
| Concept switching | 36 transitions (9 option pairs × EN/AR × desktop/phone). Each is a full load with the same stylesheets, computed styles, element boxes and pixels as a fresh load. 0 failing. |
| Selector | Names and one-liners match the data. All 16 previews load from the current files. The Option 1 card markup is identical to `c77ea32` in EN and AR. 0 failing. |
| Presentation bar | 84 comparisons on every Option 1 screen, 0 differ from `c77ea32` |
| Priority 1/2 imagery and selector thumbnails | No image file changed. The homepages are pixel-identical, so the thumbnails still match them. |
| Lint / build | `eslint .` clean; `next build` succeeds. |
| The repo's own `scripts/verify.mjs --interactions` (4 options × 7 pages × EN/AR × 1440/390) | 112 checks, 0 issues. Its menu test found and opened the mobile menu on 50 pages. The 6 Options 2–4 homepages at 390 px have no menu test hook, so their menus were tested by the route QA above. |
| Static export (`STATIC_EXPORT=1`, trailing-slash URLs) | The export builds. Audited on the export: 32 pages (home, `/browse`, `/auction/fridge-690` and `/seller/RAWABI` × 4 options × EN/AR). 0 failing groups; the orders match the server build. |

**Note on the 3 Option 4 homepage pairs.** They differed by 12–50 px, each
time in a single row at the edge of an image mask. On a second run two of them
were 0 px and the third 13 px. Comparing the `c77ea32` build with itself gives
the same kind of rows (3–7 px). This is rendering noise, not a change.

## 9. Zero Buy Now-before-Auction locations

**There are zero peer-mode locations where Buy Now comes before Auction.**

- **Browser audit** (§3) of all 80 pages, EN and AR, desktop and phone:

  | | `c77ea32` | This change |
  |---|---|---|
  | Navigation groups out of order | 288 (72 per option: 9 inner routes × 2 languages × header, quick links, mobile menu, footer) | 0 of 348 |
  | Groups with Buy Now before the first auction item (R1) | 0 | 0 |
  | Groups breaking the locked order (R2) | 288 | 0 |

  At `c77ea32` every failure was R2: Live came before Auctions, Ending soon
  and Most bids came after Buy Now items, and Bulk came before Sellers.
- **Source scan:** the app has 20 array literals that list two or more
  marketplace destinations. At `c77ea32`, 14 were out of order:
  - the four options' `CategoryNav`, `MobileMenu` and `MegaMenu`;
  - `NAV` and `FOOTER_COLUMNS`.

  Now 0 are.
- **In-page choices and other places** are auction-first and unchanged (§4.3).

## Issues found during QA that predate this change (not changed)

QA found three content issues on inner pages. All are identical at `c77ea32`:
every flagged page was measured on both builds with the same values. None is in
the header, menus or footer. The brief forbids changes to inner-page layouts and
cards, so they were left as they are. Each is a small CSS fix to make when the
inner pages are revisited.

1. **`/live-auction` scrolls sideways at 320 px.**
   - Where: Options 1, 3 and 4 in English; Option 2 in English and Arabic.
   - By how much: 7–18 px.
   - Cause: the "Upcoming sessions" cards are wider than the screen.
2. **`/system` scrolls sideways at 320 px.**
   - Where: all four options in Arabic (41–68 px); Options 1–3 in English (10–17 px).
   - Cause: the design-system specimen panels (form states, navigation demos) are wider than the screen.
3. **Arabic "Add to cart" buttons on small product cards at 320 px.** The label
   and cart icon run a few pixels past the button edge.
   - Options 1 and 3: `/product` and `/product/task-lamp` ("You may also like").
   - Option 2: `/seller`, `/seller/RAWABI` and `/system`.

## Deployment

- **Push:** this branch is pushed to `origin/claude/magical-faraday-fne4kq`.
  The connected Vercel project builds a preview of each pushed commit
  automatically, so the push publishes a preview without any manual deployment.
- **Not changed:**
  - no Vercel setting;
  - no domain;
  - no production environment;
  - no production Khaznah frontend, backend, API, admin, seller dashboard or warehouse site.
