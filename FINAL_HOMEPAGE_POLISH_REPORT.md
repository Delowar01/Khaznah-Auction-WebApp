# Final homepage polish — Options 1, 2, 3 and 4

This was a final visual and responsive polish of the four home pages in the
isolated `design-preview/` app. It was **not a redesign**:

- No section was reordered, merged, added or removed.
- No image was generated, regenerated, replaced, edited or mirrored. Priority 1 and 2 are untouched.
- No inner page was redesigned (Browse, Product, Auction, Live, Seller).
- No business logic, shared data, backend, API, deployment or domain setting changed.
- Priority 3 was not started.

Every fix is a class or CSS-token change in a home-page-only component or
stylesheet. Most only take effect between 1200 and 1439 px or below 430 px.

The 1440 px layouts are unchanged except for one intended change: the Option 3
seller-banner shade (§E). The first viewport the selector thumbnails show is
pixel-identical on all four options.

---

## A. Baseline

- **Starting commit:** `a847dde` ("Priority 2 dummy imagery on the Options 2-4 home pages (Option 1 unchanged)") on `claude/magical-faraday-fne4kq`.
- **Checks before editing:**
  - HEAD matched `origin/claude/magical-faraday-fne4kq`;
  - the working tree was clean, apart from gitignored scratch files.
- **Comparison build:** a production build of `a847dde` in a separate worktree. Every before/after measurement and pixel comparison below is made against it.
- **Audit at `a847dde`** (4 options × EN/AR × 1920–320 px: overflow, broken images, failed requests, console, axe, text spills, plus a visual review at every width):

| Option | Problems found |
|---|---|
| 1 | 320 px EN: page 12 px wider than the screen. 320 px AR: the same 8 px overflow, hidden off the left edge (§C). |
| 2 | Live still: play button over the title at 320–390 px EN and 320–430 px AR. Arabic Join label wider than its button at 320–340 px. Subscribe hover contrast 4.38:1. Header modes wrapping to two lines (EN 1200–1279, AR 1200–1439). Bulk lot names squeezed to three lines at 1200 px. Seller names clamped and "Shop now" wrapping at 1200 px and 320 px. Grades and How-it-works squeezed side by side at 1024–1199 px. |
| 3 | Hero headline and handwritten line running out of the copy tile: EN 1200–1366, by up to 122 px; AR 1200–1280, by 17 px. Live lot card overlapped by the video at 1200–1365 px. LIVE pill cut off in Arabic at 1200–1280 px. Third How-it-works step squeezed to 193 px at 1200 px. Newsletter title spilling out of its band at 1200 px. Seller-banner names on light photo areas. "Browse shop" clipped on compact seller cards below 430 px. |
| 4 | Main navigation wrapping to two lines at 1200–1319 px (EN/AR). "Add to cart" clipped on Recommended cards at 1200–1279 px. "View manifest" clipped on Bulk panels at 1200–1366 px. "Visit store" wrapping at 1200–1280 px. Category-rail labels running past their links at 320 px. |

Axe serious/critical, console errors, failed requests and broken images were
all zero at the start.

## B. Summary

- **Option 1:** the 320 px overflow is fixed at its source (two implicit grid tracks). Nothing else was touched, and every other Option 1 screen is pixel-identical.
- **Option 2:** the three requested fixes are done:
  - the live still keeps the play button clear of the title;
  - the Arabic Join label wraps inside its button at the same size;
  - Subscribe hover is 4.56:1.

  Five further polish fixes cover the 1200–1439 px header, Bulk rows, seller cards, the tablet grades block and the "View all" touch areas.
- **Option 3:** seven polish fixes:
  - hero headline sizing at 1200–1439;
  - live-banner lot column;
  - How-it-works and newsletter columns;
  - seller-banner text shade;
  - compact seller cards on phones;
  - "View all" touch areas.

  The mosaic, handwritten phrase, wall, navy banner and photographs are unchanged.
- **Option 4:** six polish fixes:
  - navigation spacing below 1366;
  - Recommended and Bulk cards that grow instead of clipping;
  - seller-row columns;
  - the 320 px category rail;
  - touch areas.

  The hero, search architecture and every previously fixed search behaviour are unchanged and re-verified.
- **QA:**
  - 112 home-page loads (4 options × EN/AR × 14 widths): zero overflow, broken images, failed requests, console errors, axe serious/critical issues and text spills.
  - Separate probes found no control clipped by a card edge and no content spilling out of its section.
  - 36 of 36 switching transitions pass.
  - The selector checks pass.
  - Of 142 regression screenshots (all Option 1 routes and the Options 2–4 inner screens), 140 are pixel-identical to `a847dde`. The 2 that differ are Option 1's home at 320 px, which is the overflow fix.

## C. Option 1 — Modern Commerce

**320 px overflow (fixed).** In English at 320 px the page was 332 px wide.

- **Where:** the upcoming-events column of the live band (`components/concept-b/home/LiveBand.jsx`).
- **Cause:**
  - Both of its grids had no column template, so each used one implicit `auto` track.
  - An `auto` track grows to its items' minimum content width.
  - Each event card has a single-line, truncated seller line inside a flex row, which gave the card a 316 px minimum width.
  - That was wider than the 288 px content box, so the band pushed the page to 332 px.
- **Fix:** `grid-cols-1` (one `minmax(0, 1fr)` track) on the two grids. The track now follows the container, and the seller line truncates as designed.
- **Not used:** no `overflow-x: hidden`, on the page or anywhere else.
- **Not changed:** the event card itself (`live/EventCard.jsx`), which the inner Live page shares.
- **Arabic:** at 320 px the same cards were 296 px wide in a 288 px column. In right-to-left layout that overflow runs off the left edge, where it cannot scroll, so it showed as an 8 px clip rather than a scrollbar. The same fix corrects it.

**Responsive notes.**

- The home page is pixel-identical to `a847dde` at 1440, 1024, 768 and 390 px in both languages. At 320 px only the live band changes:
  - English: the page is now 320 px wide instead of 332 px, and 20 px taller as the cards rewrap.
  - Arabic: the page is 5 px shorter.
- All 60 screenshots of the other Option 1 routes are identical (§H).
- The presentation bar is identical: 84 comparisons.
- The selector's Option 1 card markup is identical.

## D. Option 2 — Premium Modern

| Fix | Before | After |
|---|---|---|
| **320 px live still** (`sections.jsx`) | 16:9 frame only 162 px tall at 320 px, so the play button sat over the two-line title. Gap between them: −18 px EN, −31 px AR. Overlap ran up to 390 px EN and 430 px AR. | The still never drops under 232 px (256 px in Arabic, whose title is taller), so the gap is +24 px EN and +26 px AR. `w-full` keeps its width tied to the column; without it the min-height would have widened the frame through its ratio. From about 445 px (490 px in Arabic) the 16:9 frame is used as before. |
| **Arabic "Join live auction"** (`sections.jsx`) | 149 px label in a 139 px button at 320 px; 155 px in 151 px at 340 px. | Below 380 px, in Arabic only, the label wraps to two centred lines inside the same charcoal button, which grows from 48 to 63 px. The 17 px type is unchanged and the button keeps a 48 px minimum height. English is unchanged because it fits. |
| **Subscribe hover** (`styles/r3-premium-modern.css`) | `--pr-brass-hover: #a17a36` gives 4.38:1 with the `#171b27` label. | `#a47d39` gives 4.56:1. It is the same brass family, one step lighter. The rest state (`#b28a43`, 5.41:1) is unchanged. The token also drives the hero "Shop Buy Now" hover, which gets the same gain. |
| Header modes, 1200–1439 px (`Header.jsx`) | English wrapped to two lines at 1200–1279 px: the labels need 491 px with 28 px gaps, and 455–475 px is available. Arabic wrapped at 1200–1439 px: it needs 563 px. | Gaps are 16 px below 1440 px, so English needs 443 px and fits on one line from 1200 px. Arabic keeps the menu button at 1200–1365 px, the same drawer used on tablets. From 1366 px it shows the inline modes, with 16 px gaps until 1440 px. From 1440 px nothing changed. |
| Bulk & Pallets rows (`sections.jsx`) | Fixed 110/207/224 px columns left the lot name 114 px at 1200 px, clamped to three lines. | Those columns are now `fr` shares equal to their 1440 px widths, so the row is exact at 1440 px. The name gets 256 px at 1200 px (one line). |
| Featured Sellers cards (`sections.jsx`) | Fixed 100 px cover left about 70 px of text at 1200 px and 320 px, so names were clamped and "Shop now" wrapped. | The cover is `clamp(76px, 43%, 100px)`. It stays 100 px wherever there is room (1440, 1024, 480 and 390 px) and narrows to 80 px at 1200 px and 79 px at 320 px. Names fit in at most two lines, and "Shop now" stays on one line at every width. |
| Grades + How Khaznah works (`sections.jsx`) | Side by side from 1024 px, which squeezed the three steps into about 160 px each at 1024–1199 px. | Side by side from 1200 px. Below that they stack, as they already did at 768 px. |
| "View all" links (`ui.jsx`) | 20 px tall touch area. | An invisible `::after` makes the touch area about 44 px tall without moving anything (§I). |

Also reviewed and **left unchanged** because they were already sound:

- category art;
- seller photo crops;
- live-section spacing;
- the grades/how-it-works balance at 1440;
- the footer;
- Arabic type and line heights.

## E. Option 3 — Visual Discovery

| Fix | Before | After |
|---|---|---|
| Hero headline, 1200–1439 px (`styles/r3-visual-discovery.css`, `Hero.jsx`) | 75 px headline in a copy tile only 292 px wide at 1200 px. English stacked five lines and pushed "Explore auctions" and the handwritten line up to 122 px into the category chips (55 px at 1280–1366 px). The Arabic handwritten line was cut by 17 px at 1200–1280 px. | The headline eases from 75 px at 1440 to 60 px at 1200 (Arabic: 52 → 41 px). It uses the same line-height ratio, giving exactly 67 px lines at 75 px. The tile may grow past 520 px if it ever needs to; it does so only in English at 1366 px (522 px) and Arabic at 1280 px (535 px). From 1440 px the hero is pixel-identical. |
| Live banner lot card (`r3-visual-discovery.css`, `sections.jsx`) | The 251 px lot card sat in a 208–240 px column at 1200–1365 px, so the video overlapped its title ("Leather Recline…"). In Arabic at 1200–1280 px the LIVE pill was cut off at the top of the band. | The lot column never drops below 251 px. The band has a 313 px minimum height and 16 px padding instead of a fixed 313 px. It grows to 331 px (EN) or 359 px (AR) at 1200–1280 px only. From 1366 px it is unchanged. |
| How it works (`sections.jsx`) | Fixed 430/477 px columns left the third step 193 px at 1200 px, one word per line. | `fr` shares of the same widths: exact at 1440 px, and 355 px for the third step at 1200 px. |
| Newsletter (`Footer.jsx`) | Fixed 614 px form column left the title 432 px at 1200 px. It needs 516 px, so it wrapped and spilled 6 px out of the 142 px band. | `fr` shares (672/614): exact at 1440 px. The title column is 547 px at 1200 px, so the title stays on one line. |
| Seller banner text (`sections.jsx`, `r3-visual-discovery.css`) | Bottom-only shade. "Rawabi Home Outlet" sat on a bright sofa and window. Against the brightest 10 % of the photo behind it, the name had 2.47:1 at 1440 px EN and 3.4–3.6:1 on phones; the line had 3.1–3.3:1. | A new `vd-banner-shade` class adds a start-side shade behind the name and line to the existing bottom shade. Its direction flips for Arabic; the photo is never mirrored. The shade is slightly stronger below 1200 px, where the text covers more of the photo. Against the same brightest 10 %, the name is now 4.5–8.3:1 and the line 4.4–8.8:1 at every width from 320 to 1440 px. Medians are at least 7.9:1. |
| Compact seller cards, below 430 px (`sections.jsx`) | The 151 px "Browse shop" button did not fit the 101–144 px text column at 320–414 px, so the card edge clipped it. | Below 430 px the photo takes 36 % instead of 46 %, with slightly tighter padding, so the button fits (129 px in a 133–185 px column). From 430 px nothing changed. |
| "View all" links (`ui.jsx`) | 20 px touch area. | About 44 px, invisible (§I). |

Also reviewed and **left unchanged**:

- mosaic balance and overlay spacing;
- Arabic label placement in the mosaic (already correct, and no photo is mirrored);
- the product wall rhythm;
- ending-soon cards;
- Bulk proportions;
- the clarity block;
- the footer.

The dummy images were not "perfected".

## F. Option 4 — Contemporary Saudi

| Fix | Before | After |
|---|---|---|
| Main navigation (`Header.jsx`) | 46 px gaps plus 70 px end padding needed 719 px. The track is 602–682 px at 1200–1280, so labels wrapped to two lines at 1200–1319 px (EN and AR). | Below 1366 px the gaps are 28 px and the end padding is removed. That needs 577 px EN / 598 px AR, so it stays on one line from 1200 px, even with a 17 px classic scrollbar. From 1366 px nothing changed. |
| Recommended cards (`sections.jsx`) | Fixed 208 px height. At 1200–1279 px the price and the 192 px button no longer fit on one line, so the button was cut off at the bottom. | A minimum height instead: at 1200–1279 px the card grows (236 px EN, 242 px AR) and the button sits under the price. From 1280 px nothing changed. |
| Bulk & Pallets panels (`sections.jsx`) | Fixed 249 px height clipped "View manifest" / "Add to cart" at 1200–1366 px (EN; fine again by 1400 px) and 1200–1320 px (AR). | A minimum height with both panels stretched to the same height: 259 px EN, 255–281 px AR at those widths. At 1440 px, still 249 px. |
| Featured Sellers rows (`sections.jsx`) | Thumbnail and "Visit store" columns fixed at 519 px plus the rest. "Visit store" got 63 px at 1200 px and wrapped to two lines. | Those two columns are `fr` shares equal to their 1440 px widths: exact at 1440 px. "Visit store" gets 215 px at 1200 px and stays on one line at every width. Seller names keep their 323 px. |
| Category rail, below 360 px (`sections.jsx`) | "Electronics", "Home Appliances" and "Automotive" ran 3–6 px past their links at 320 px. | Rail padding 12 px instead of 16, and icon gap 8 px instead of 12, below 360 px only. Every label now fits. |
| "View all" and "Visit store" links (`ui.jsx`) | 20 px touch area. | About 44 px, invisible (§I). |

**Search behaviour, re-verified on the final build.** Option 4 was checked in
EN and AR at 1920, 1440, 1366, 1280, 1200, 1024, 768, 480, 390 and 320 px.

- **Suggestions panel:**
  - all 11 entries are hit-testable;
  - the panel paints above the Buy Now cards;
  - phone results stay inside the panel;
  - opening it causes no overflow;
  - axe finds no serious or critical issue with the panel open.
- **See All Results** navigates to `/browse?search=…`.
- **Keyboard:** Tab moves into the panel and Escape closes it.
- **Adaptive placeholder:** it fits the field at all 13 tested widths in both languages.
- **Footer** and How-it-works keep their responsive layouts. There is no desktop overflow.

The hero photography and the search architecture were not touched. The search
was not widened into the hero chair.

Also reviewed and **left unchanged**:

- seller-row crops;
- the live scene (B9 with A2 in front);
- category-rail desktop layout;
- Buy Now cards and thumbnails;
- the oversized 01/02/03 guide;
- the grade strip;
- the green newsletter and footer;
- Arabic type.

## G. Files changed

| File | Option | Change |
|---|---|---|
| `design-preview/components/concept-b/home/LiveBand.jsx` | 1 | `grid-cols-1` on two grids, plus a comment |
| `design-preview/components/concept-a/premium-modern/sections.jsx` | 2 | Live still min-height and `w-full`; Arabic Join wrap below 380 px; Bulk `fr` columns; seller cover clamp; grades/how-it-works split from 1200 px |
| `design-preview/components/concept-a/premium-modern/Header.jsx` | 2 | Header modes: 16 px gaps below 1440 px; Arabic menu button below 1366 px |
| `design-preview/components/concept-a/premium-modern/PremiumModernHome.jsx` | 2 | Comment only (the drawer now also serves Arabic at 1200–1365 px) |
| `design-preview/components/concept-a/premium-modern/ui.jsx` | 2 | "View all" touch area |
| `design-preview/styles/r3-premium-modern.css` | 2 | `--pr-brass-hover` `#a17a36` → `#a47d39` |
| `design-preview/styles/r3-visual-discovery.css` | 3 | Hero headline clamp at 1200–1439 px; live lot column minimum; `vd-banner-shade` class |
| `design-preview/components/concept-c/visual-discovery/Hero.jsx` | 3 | Hero row `min-h` instead of `h` |
| `design-preview/components/concept-c/visual-discovery/sections.jsx` | 3 | Live band min-height; seller banners use `vd-banner-shade`; compact seller cards below 430 px; How-it-works `fr` columns |
| `design-preview/components/concept-c/visual-discovery/Footer.jsx` | 3 | Newsletter `fr` columns |
| `design-preview/components/concept-c/visual-discovery/ui.jsx` | 3 | "View all" touch area |
| `design-preview/components/concept-d/saudi-commerce/Header.jsx` | 4 | Navigation gaps and end padding below 1366 px |
| `design-preview/components/concept-d/saudi-commerce/sections.jsx` | 4 | Recommended and Bulk minimum heights; seller-row `fr` columns; category rail below 360 px |
| `design-preview/components/concept-d/saudi-commerce/ui.jsx` | 4 | `TextLink` touch area |
| `docs/final-polish/*` | — | 16 full-page screenshots, 4 before/after sheets and an index (§K) |
| `FINAL_HOMEPAGE_POLISH_REPORT.md` | — | This report |

**Not changed:**

- `data/`, `lib/` and `app/`;
- `public/`: no image, thumbnail or asset;
- the shared UI, providers and drawer;
- every inner and earlier-prototype screen;
- the presentation bar and selector;
- `package.json`: no dependency added.

## H. QA matrix

All checks ran on a production build (`next build` and `next start`) of the
final tree.

**Home pages.** 4 options × EN/AR × 14 widths, 112 loads:

- Desktop: 1920, 1440, 1366, 1280 and 1200 px.
- Tablet: 1199, 1024 and 768 px.
- Mobile: 480, 430, 390, 375, 360 and 320 px.

Each page was loaded with every image awaited, then checked for:

- horizontal overflow;
- broken or pending images;
- failed requests;
- console errors;
- axe serious/critical issues (WCAG 2.0/2.1 A/AA);
- text spilling out of its button or link.

Separate probes then checked:

- controls clipped by a card edge: 1440, 1200, 1024, 768, 480, 390, 360 and 320 px;
- content spilling out of its section: 1920, 1440, 1366, 1280, 1200, 1024, 768, 480, 390 and 320 px;
- real tap areas, by hit-testing: 480, 430, 390, 375, 360 and 320 px.

| | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| Horizontal overflow | 0 / 28 (was 12 px at 320 EN) | 0 / 28 | 0 / 28 | 0 / 28 |
| Broken or pending images | 0 | 0 | 0 | 0 |
| Failed requests / console errors | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Axe serious or critical | 0 | 0 | 0 | 0 |
| Text spilling out of a button or link | 0 | 0 (was the Arabic Join) | 0 | 0 (was the 320 px rail) |
| Controls clipped by a card edge | 0 | 0 | 0 (was "Browse shop") | 0 (was Recommended and Bulk) |
| Content spilling out of its section (more than 4 px) | 0 | 0 | 0 (was hero, live, newsletter) | 0 |

The only section "spills" left are 2–4 px Arabic font-metric overhangs: the
font's ascent box, not ink, in the Option 2 live heading and the Option 3
clarity block. They were already there and are not visible.

**Interactions and regression gates:**

| Check | Result |
|---|---|
| Concept switching (9 option pairs × EN/AR × desktop/phone) | 36 of 36 pass: full document load, same stylesheets, 0 styled-element or box differences, 0 % pixels. |
| Selector | Names, one-liners and previews load from the current files; 0 failing. Option 1 card markup identical. |
| Selector thumbnails | First viewport (1440 × 900 and 390 × 844, EN/AR, all four options) is pixel-identical to `a847dde`, so thumbnails were not recaptured. |
| Option 1 regression (7 routes × EN/AR × 1440/1024/768/390/320, frozen clock) | 68 of 70 identical. The 2 differences are the home at 320 px, which is the overflow fix (§C). |
| Options 2–4 inner screens (6 routes × EN/AR × 1440/390 per option) | 72 of 72 identical. |
| Presentation bar | 84 of 84 identical. |
| Option 2 and 4 search, footer and newsletter matrix (EN/AR × 10 widths) | 40 of 40 pass (§F). |
| Interaction smoke test (4 options × EN/AR × 1440/390) | Add to cart updates the cart count, the watchlist heart toggles, the newsletter rejects a bad address and accepts a good one, the live CTA opens the live auction, and the category and language links resolve (HTTP 200). 0 console errors. Option 1's own watch and newsletter markup was checked directly; it behaves the same as at `a847dde`. |
| Option 2 Arabic menu at 1200–1365 px | Reachable by Tab, opens the drawer with all five modes, keeps focus inside while open, closes on Escape and returns focus to the button. |
| Lint | `eslint` clean on every changed component folder. |

**1440 px stability** (full pages against `a847dde`):

- **Option 2:** identical.
- **Option 3:** changes only in the seller-banner rows, which is the intended shade.
- **Options 1 and 4:** differences of 0.002 % and 0.025 %. They come from the live "watching" counter and the resampling of one pallet photo, not from layout.

## I. Accessibility

- **Axe:** 0 serious or critical issues on all 112 loads, and on Option 4 with the search panel open.
- **Contrast:**
  - Option 2 Subscribe and "Shop Buy Now" hover: 4.38 → 4.56:1.
  - Option 3 seller-banner text: worst case against the brightest 10 % of the photo went from 2.47:1 to at least 4.4:1 at every width.
  - Nothing else changed colour.
- **Focus:** focus styles are unchanged. The touch-area `::after` does not change the focus outline, which stays on the visible link. The Arabic Option 2 menu button uses the same focus ring as on tablets.
- **Keyboard:** no traps. The Option 2 drawer and the Option 4 search panel both release focus on Escape and return it.
- **Touch targets at phone widths**, measured by hit-testing the real tap area (stretched card links and `::after` areas count):
  - Section "View all" links (Options 2–4) and Option 4 "Visit store" links went from 20 px to about 44 px tall. Controls under 44 px tall per page: Option 2 21 → 17, Option 3 30 → 26, Option 4 35 → 24.
  - What remains under 44 px is mostly footer and inline text links, 17–22 px tall. In Options 2–4 they meet WCAG 2.5.8 (target size minimum) through their spacing: no undersized target has another target within 24 px.
  - The spacing check flags one kind of pair: Option 4 product-title links next to the watchlist heart. Those titles are stretched links whose real target is the whole card, so this is a false positive.
  - Option 1 was left as it is (§L).
- **Motion:** nothing animated was added or changed. `prefers-reduced-motion` behaviour is as before.
- **Arabic:** every change has its Arabic counterpart, checked at every width. Photos are never mirrored. The only new direction-specific style is the Option 3 shade, whose gradient follows the text side.

## J. Performance impact

| | Before (`a847dde`) | After |
|---|---|---|
| Images per page (1440 EN, O1/O2/O3/O4) | 456 / 686 / 329 / 555 KB | the same; no image added, removed or changed |
| CSS (all chunks) | 263.1 KB, 46.7 KB gzip | 268.1 KB, 47.2 KB gzip |
| JS (all chunks) | 3,204.1 KB, 981.1 KB gzip | 3,204.9 KB, 981.3 KB gzip |

- **CSS:** +0.5 KB gzip. It is mostly the new responsive and right-to-left utilities: Tailwind expands `rtl:` into a long `:lang(…)` list, which compresses well. The banner-shade class adds a little more.
- **JS:** +0.75 KB (+0.2 KB gzip), all of it class-name strings. No client-side logic was added; every fix is CSS.
- **Dependencies, requests and fonts:** none added.

## K. Before/after evidence

Everything is in `docs/final-polish/`; `README.md` there indexes it.

- `option-{1,2,3,4}-1440-{en,ar}.jpg`: full pages at 1440 px after the polish.
- `option-{1,2,3,4}-390-{en,ar}.jpg`: full pages at 390 px after the polish.
- `option-1-before-after.jpg`: the 320 px overflow, with the screen edge marked.
- `option-2-before-after.jpg`: eight rows:
  - live still at 320 EN, and live still plus Arabic Join at 320 AR;
  - header at 1200 EN and AR;
  - Bulk row at 1200;
  - seller cards at 1200;
  - grades/how-it-works at 1024;
  - Subscribe hover.
- `option-3-before-after.jpg`: ten rows:
  - hero at 1200 EN and AR;
  - live banner at 1200 EN and AR;
  - How it works and newsletter at 1200;
  - seller-banner shade at 1440 EN and 320 AR;
  - compact seller card at 390 EN and 320 AR.
- `option-4-before-after.jpg`: six rows:
  - navigation at 1200 EN and AR;
  - Recommended card at 1200;
  - Bulk panel at 1280;
  - seller row at 1200;
  - category rail at 320.

## L. Remaining known limitations

**Layout.** No blocking defect is known.

1. **Option 1 was deliberately kept as it was** apart from the overflow fix. Its own phone controls stay as designed: 36 px icon buttons and 15–18 px footer links. One tap-spacing pair in the hero's ending-soon list also remains: a product link next to the "Live" chip, at 320–390 px.
2. **Footer and inline text links in Options 2–4 are 17–22 px tall.** They meet WCAG 2.5.8 through spacing but are below the 44 px aim. Enlarging them would change the footer rhythm, so it was left for a design decision.
3. **Option 2 in Arabic uses the menu button at 1200–1365 px.** The five Arabic mode labels need more room than the header column has there. The inline modes return from 1366 px.
4. **A few blocks grow slightly instead of clipping** between 1200 and 1366 px:
   - Option 4 Recommended cards: +28/34 px;
   - Option 4 Bulk panels: +10–32 px;
   - Option 3 live banner: +18/46 px;
   - Option 3 Arabic hero at 1280 px: +15 px.
5. **The 2–4 px Arabic font-metric overhangs in §H** are a measuring artifact, not a visible defect.

**Dummy-image limitations.** These are separate from layout and expected under the dummy-asset rule.

- The Option 3 seller banners still depend on their photos. With the current dummy interiors the worst case is about 4.4:1, for the Arabic line at 320 px. Final photography should keep the lower start corner calm.
- Several seller "covers" are stand-in scenes, not real storefronts, for example stacked boxes for Khazna Direct and a forklift aisle for Dar Al Majd. The live scenes reuse one warehouse aisle (B9) across options.
- The pallet cut-outs (B1/B2) look alike.
- These limitations are in the images, not in the layout. They need the planned Priority 3 or final photography, which this pass did not start.

## Deployment

- **Push:** this branch is pushed to `origin/claude/magical-faraday-fne4kq`. The connected Vercel project builds a preview of each pushed commit automatically, so pushing publishes a preview even though nothing was deployed by hand.
- **Not changed:**
  - no Vercel setting;
  - no domain;
  - no production environment;
  - no production Khaznah frontend, backend, API, admin, seller dashboard or warehouse site.
- **Hand-off message:** it gives the final commit hash and the deployment status reported for it.
