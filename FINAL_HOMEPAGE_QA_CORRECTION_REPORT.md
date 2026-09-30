# Final homepage QA correction — Options 2 and 4

This round fixes the responsive issues left open in the review of `d1fcf68`
(approved with conditions), in the isolated `design-preview/` app:

1. the Option 2 footer overflow,
2. the Option 4 footer overflow,
3. the Option 4 search suggestions hidden under the Buy Now cards, and
4. the truncated Option 4 search placeholder.

Nothing was redesigned or regenerated. No photograph, product image, section order, shared data or business behaviour changed. Option 1, Option 3, the earlier-prototype screens and the presentation selector are untouched.

One more overflow of the same kind turned up during QA and is fixed with the same technique: the Option 4 "How Khaznah works" steps at 1200–1219 px (§3.3). It was already present at `d1fcf68`, hidden behind the larger footer overflow.

---

## 1. Starting and final commits

- **Starting commit:** `d1fcf68` on `claude/magical-faraday-fne4kq`. Before editing I confirmed that the branch was checked out, that HEAD matched `origin/claude/magical-faraday-fne4kq`, and that the working tree was clean.
- **Final commit:** the commit that adds this report. Its hash is given in the hand-off message and in `git log`.

## 2. Files changed

| File | Change |
|---|---|
| `design-preview/components/concept-a/premium-modern/Footer.jsx` | Desktop footer grid: fixed px tracks → the same widths as fr shares (one class), plus a comment. |
| `design-preview/components/concept-d/saudi-commerce/Footer.jsx` | Green band grid and link grid: fixed px tracks → the same widths as fr shares (two classes); the newsletter form keeps its 86 px clearance from the first link column (one class); plus a comment. |
| `design-preview/components/concept-d/saudi-commerce/sections.jsx` | "How Khaznah works" grid: fixed px tracks → fr shares (one class), plus a comment. |
| `design-preview/components/concept-d/saudi-commerce/Hero.jsx` | `z-20` on the hero section while the suggestions panel is open (stacking order); `grid-cols-1` on the panel's results grid (phone column kept inside the panel); placeholder that fits the field (`useFittingPlaceholder`) with the full hint kept as the field's description. |
| `design-preview/components/concept-d/saudi-commerce/copy.js` | Two shorter placeholder texts (EN/AR). |
| `docs/final-homepage-qa/*.jpg` | Before/after evidence (§8). |
| `FINAL_HOMEPAGE_QA_CORRECTION_REPORT.md` | This report. |
| `PRIORITY_1_ASSET_INTEGRATION_REPORT.md` | The two follow-ups it logged (footer overflow, search suggestions) are marked as fixed here. |

Not changed: anything in Option 1 (`components/concept-b/`, `styles/concept-b.css`), Option 3 (`components/concept-c/`), `data/`, `lib/`, `app/`, `public/` (no image, thumbnail or asset file), the shared UI and providers, and the earlier-prototype screens.

## 3. Causes and corrections

All five findings were reproduced on a production build of `d1fcf68` and re-measured on the corrected build. The widths quoted come from a scan of every width from 320 to 1920 px (§4).

### 3.1 Option 2 — footer overflow (1200–1250 px)

**Cause.** From 1200 px the footer grid was `338px 254px 261px 282px minmax(0,1fr)`:
- four fixed tracks totalling 1135 px, with the Legal links in the one flexible track;
- the footer container is 1336 px wide at 1440 but only `viewport − 104 px` below that (1096 px at 1200).

This had two effects:
- **Below about 1240 px** the fixed tracks alone were wider than the container. The Legal track collapsed to 0 px, and "Terms & conditions" and "Privacy policy" ran past the page edge: 51 px of sideways scroll at 1200 px in English (47 px in Arabic), until 1250 px (1246 px in Arabic).
- **Up to about 1340 px** the Legal track stayed narrower than its links, which spilled into the side margin.

**Correction.** The grid is now `338fr 254fr 261fr 282fr 201fr`: the same five widths expressed as shares of the 1336 px container.
- **At 1440 px and wider** one share is exactly 1 px, so every column keeps its approved width. The page is pixel-identical (§6).
- **Below 1440 px** all five columns shrink together. At 1200 px they are 277 / 208 / 214 / 231 / 165 px.
- **Nothing can overflow:** `fr` tracks never shrink below their content.

Every link is kept, and nothing is hidden or clipped. `overflow-x: hidden` is not used anywhere.

### 3.2 Option 4 — footer overflow (1200–1382 px)

**Cause.** The green band used two grids of fixed tracks from 1200 px:
- a 596 px newsletter column;
- a link area of 215 + 219 + 203 px columns, plus a flexible Legal column (46 px start padding and a divider).

That is 1233 px of fixed tracks, plus about 100 px for Legal. But the band's container is 1365 px wide only from 1440 px (1125 px at 1200). Below that, the Legal column collapsed and "Terms" and "Privacy" were pushed off the page:
- up to 174 px of sideways scroll in English and 183 px in Arabic at 1200 px;
- until 1373 px in English and 1382 px in Arabic.

**Correction.** The same widths are now shares of the band:
- the band grid is `596fr 769fr` (together 1365 px);
- the link grid is `215fr 219fr 203fr 132fr` (together 769 px).

The result:
- **At 1440 px and wider** both grids are pixel-identical to before.
- **At 1200 px** the newsletter column is 491 px, and the link columns are 177 / 181 / 167 / 109 px.
- The green newsletter-and-links band, all three link groups, the Legal links and the white brand base are unchanged in content and order.
- The newsletter heading, text and form still fit inside the band at every width (§4).
- **Newsletter form.** Its `max-width` is now `min(510px, 100% − 86px)`. At 1440 px it is exactly 510 px, as approved. Below 1440 px it keeps the same 86 px clearance from the first link column; without this, the Subscribe button touched the Marketplace links at 1200–1340 px.

### 3.3 Option 4 — "How Khaznah works" overflow (1200–1219 px, found during QA)

**Cause.** The three steps used `455px 459px minmax(0,1fr)`:
- At 1200 px the third step got 1125 − 914 = 211 px.
- Its number, icon and text need about 267 px, so it ran 20 px past the page edge in English (8 px in Arabic), until 1219 px (1207 px in Arabic).
- This was already the case at `d1fcf68`. It did not show up earlier because the larger footer overflow at the same widths masked it.

**Correction.** The grid is now `455fr 459fr 451fr` (together 1365 px):
- **At 1440 px and wider** it is exact.
- **Below 1440 px** the steps share the width evenly. At 1200 px the section is shorter than before (255 px instead of 378 px), because the third step no longer wraps into a narrow sliver.

### 3.4 Option 4 — search suggestions under the Buy Now cards (1200 px and wider)

**Cause.** A stacking-order problem, not clipping:
- The hero section was `relative isolate` with no z-index. That makes it its own stacking context, painted at level 0 in document order.
- The suggestions panel's `z-50` only orders it inside the hero.
- The sections after the hero come later in paint order. Their positioned product cards, and those cards' `z-10` save and bid buttons, are therefore drawn over anything from the hero that reaches below it.
- From 1200 px a long result list reaches 242–258 px below the hero. Its last 35–40 px, which hold the "See all results" link, sat under the Buy Now cards.
- Below 1200 px the hero is taller and the panel stays inside it; on phones there is no positioned content under it.

The panel was not clipped by the hero or photo containers: `d1fcf68` already clips the photograph in its own frame.

**Correction.** While the panel is open, the hero section gets `z-20`: `has-[[data-suggestions]]:z-20`, where the panel carries a `data-suggestions` attribute. The hero's stacking context then sits above the following sections, including their `z-10` buttons, so the whole panel is drawn on top.
- **Why `z-20`:** a lower value (`z-[1]`) was tried first. It fixed 1440 px, but at 1200–1280 px a card's `z-10` save button still covered the panel's bottom edge.
- **Why only while the panel is open:** a permanent `z-20` gave the hero its own compositing layer. The browser then drew one label ("Explore auctions") with a different kind of text smoothing, which the pixel comparison caught. With the lift applied only while the panel is open, the resting hero is pixel-identical to `d1fcf68` (§6).
- **What stays above the hero:** the header menus (`z-50`), the skip link (`z-[70]`), and the drawers, dialogs and toasts (`z-[190]`–`z-[300]`).
- **Why nothing else moves:** the hero overlaps nothing else, so nothing changes position or appearance when the lift applies (§6).
- **Search behaviour and keyboard access are unchanged:**
  - typing opens the panel;
  - Tab moves into the suggestions;
  - Escape and outside clicks close it;
  - Enter and the Search button submit;
  - "See all results" opens Browse with the query.
- **The panel adds no horizontal overflow.** It is exactly as wide as the search field.

**Also found during QA: suggestion rows on phones (below 768 px).**
- **Cause.** On phones the results grid had no column template, so its single implicit column grew to the full width of the longest product title. The truncated title's text does not wrap. The rows became wider than the panel (411 px of content in a 356 px panel at 390 px), so each lot's price sat outside the panel and could only be reached by scrolling the panel sideways. This was already the case at `d1fcf68`.
- **Correction.** `grid-cols-1` (a single `minmax(0, 1fr)` column) on that grid. The column now fits the panel, long titles end in an ellipsis, and every price is in view in English and Arabic. From 768 px the existing two-column template applies unchanged.

### 3.5 Option 4 — search placeholder

**Cause.** From 1200 px the search is capped at `min(640px, 48.7vw − 24px)`, which keeps it clear of the leather chair in the A6 photograph. That leaves the text field 215 px wide at 1200 px and 279 px at 1330 px. The English placeholder "Search products, categories and sellers" needs 281 px, so it was cut off ("Search products, categories ar") up to 1339 px. It was also cut off on phones, in both languages.

**Correction.** A small hook (`useFittingPlaceholder` in `Hero.jsx`) measures the field and shows the longest of three texts that fits:

| Text | English | Arabic |
|---|---|---|
| Full | "Search products, categories and sellers" | "ابحث عن المنتجات والفئات والبائعين" |
| Short | "Search products and sellers" | "ابحث عن المنتجات والبائعين" |
| Shortest | "Search products" | "ابحث عن المنتجات" |

Where each text appears. The choice is made by measuring the field, so it follows its real width:

| Width | English | Arabic |
|---|---|---|
| 320 px | Shortest | Shortest |
| 390 px | Shortest | Short |
| 480–639 px | Full | Full |
| 640–649 px (where the tablet layout begins) | Short | Full |
| 650–1199 px | Full | Full |
| 1200–1339 px | Short | Full |
| 1340 px and wider, including 1440 | Full | Full |

How it behaves:
- The server renders the full text. The check runs when the field is laid out or resized, and again when the fonts have loaded.
- The field's accessible name is unchanged ("Search Khaznah" / "ابحث في خزنة", from its label).
- Whenever a shorter text is shown, the full hint is attached as the field's description (`aria-describedby` → visually hidden text), so screen readers still hear it in full.

What does not change:
- The search is not widened over the chair.
- The field width, category scope, suggestions, results and submission are unchanged.
- Nothing is added at 1440 px, where the full text fits.

On phones the same rule removes the truncation that was already there before this round.

## 4. Responsive QA matrix

**Build.** `npm run lint` passes (0 problems) and `next build` passes; all routes are prerendered. Every check below ran against a production build (`next start`) of the corrected code, and the "before" values against a production build of `d1fcf68`.

**Width scan.** Every width from 320 to 1920 px (1601 widths per page) was checked for horizontal page overflow on Options 2 and 4 in both languages:

| Page | `d1fcf68` | Corrected |
|---|---|---|
| Option 2, English | overflow at 1200–1250 px (up to 51 px) | none |
| Option 2, Arabic | overflow at 1200–1246 px (up to 47 px) | none |
| Option 4, English | overflow at 1200–1373 px (up to 174 px) | none |
| Option 4, Arabic | overflow at 1200–1382 px (up to 183 px) | none |

**Required widths.** Options 2 and 4 were tested in EN and AR at 1024, 1199, 1200, 1250, 1280, 1366, 1382, 1440, 390 and 320 px. Each page load checked:
1. **Horizontal page overflow.**
2. **Footer items.** Each footer link, heading and text is inside the page, not clipped, and inside its band.
3. **Newsletter.** The field and button can be reached by the pointer, an invalid address is rejected, and a valid one is accepted and the field cleared.
4. **Search panel (Option 4).** With a long result list ("e" / "ا"), each suggestion is scrolled into view within the panel and hit-tested at both ends.
5. **"See all results" (Option 4).** Clicked; it must open `/browse?search=…`.
6. **Keyboard (Option 4).** Tab reaches the suggestions and Escape closes them.
7. **Overflow while the panel is open (Option 4).**
8. **Accessibility.** axe-core with the WCAG 2.1 A/AA rules (serious and critical findings), on the page and on the hero with the panel open.
9. **Console errors and failed requests.**

**Result.** 40 of 40 page loads pass every check on the corrected build.

**Option 2 — Premium Modern Marketplace** (before → after; ✓ = pass)

| Lang | Width | Page overflow | Footer items past the edge | Footer items clipped / outside their band | Newsletter (visible · rejects invalid · accepts valid) | axe serious/critical | Console errors / failed requests |
|---|---|---|---|---|---|---|---|
| EN | 1024 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| EN | 1199 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| EN | 1200 | 51 → **0** | 2 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| EN | 1250 | 1 → **0** | 1 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| EN | 1280 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| EN | 1366 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| EN | 1382 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| EN | 1440 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| EN | 390 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| EN | 320 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| AR | 1024 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| AR | 1199 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| AR | 1200 | 47 → **0** | 2 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| AR | 1250 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| AR | 1280 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| AR | 1366 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| AR | 1382 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| AR | 1440 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| AR | 390 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |
| AR | 320 | 0 → **0** | 0 → **0** | 0 | ✓ ✓ ✓ | 0 | 0 / 0 |

**Option 4 — Contemporary Saudi Commerce** (before → after; ✓ = pass)

| Lang | Width | Page overflow | Footer items past the edge | Newsletter | Suggestions fully visible | See all results clickable | Panel below hero | Overflow with panel open | Tab / Escape | axe (page · panel open) | Console / failed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| EN | 1024 | 0 → **0** | 0 → **0** | ✓ ✓ ✓ | 11/11 → **11/11** | ✓ → **✓** | 0 px | 0 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| EN | 1199 | 0 → **0** | 0 → **0** | ✓ ✓ ✓ | 11/11 → **11/11** | ✓ → **✓** | 0 px | 0 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| EN | 1200 | 174 → **0** | 5 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 242 px | 174 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| EN | 1250 | 124 → **0** | 5 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 242 px | 124 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| EN | 1280 | 94 → **0** | 2 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 242 px | 94 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| EN | 1366 | 8 → **0** | 1 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 242 px | 8 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| EN | 1382 | 0 → **0** | 0 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 242 px | 0 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| EN | 1440 | 0 → **0** | 0 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 242 px | 0 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| EN | 390 | 0 → **0** | 0 → **0** | ✓ ✓ ✓ | 6/11 → **11/11** | ✓ → **✓** | 235 px | 0 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| EN | 320 | 0 → **0** | 0 → **0** | ✓ ✓ ✓ | 6/11 → **11/11** | ✓ → **✓** | 275 px | 0 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| AR | 1024 | 0 → **0** | 0 → **0** | ✓ ✓ ✓ | 11/11 → **11/11** | ✓ → **✓** | 0 px | 0 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| AR | 1199 | 0 → **0** | 0 → **0** | ✓ ✓ ✓ | 11/11 → **11/11** | ✓ → **✓** | 0 px | 0 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| AR | 1200 | 183 → **0** | 5 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 258 px | 183 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| AR | 1250 | 133 → **0** | 5 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 258 px | 133 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| AR | 1280 | 103 → **0** | 2 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 258 px | 103 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| AR | 1366 | 17 → **0** | 1 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 258 px | 17 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| AR | 1382 | 1 → **0** | 1 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 258 px | 1 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| AR | 1440 | 0 → **0** | 0 → **0** | ✓ ✓ ✓ | 10/11 → **11/11** | ✗ → **✓** | 258 px | 0 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| AR | 390 | 0 → **0** | 0 → **0** | ✓ ✓ ✓ | 6/11 → **11/11** | ✓ → **✓** | 214 px | 0 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |
| AR | 320 | 0 → **0** | 0 → **0** | ✓ ✓ ✓ | 6/11 → **11/11** | ✓ → **✓** | 298 px | 0 → **0** | ✓ ✓ | 0 · 0 | 0 / 0 |

The "before" failures were:
- **Suggestions (1200 px and wider): 10/11 visible.** "See all results" sat under the Buy Now cards, so the click was intercepted.
- **Suggestions (phones): 6/11 visible.** Each lot's price was outside the panel, reachable only by scrolling sideways.

Option 2 has no search panel. The same 40 page loads on `d1fcf68` produced no console errors and no failed requests either.

**Other checks on the final build:**

| Check | Result |
|---|---|
| Home-page sweep, all four options × EN/AR × 1440 / 1024 / 768 / 390 / 320 px (axe, console, failed requests, broken images, overflow) | 40 loads: 0 axe serious/critical, 0 console errors, 0 failed requests, 0 broken images. The only issue is Option 1's 12 px overflow at 320 px in English, which is pre-existing; Option 1 is untouched. |
| The same sweep for Options 2–4 at 1920 / 1382 / 1366 / 1280 / 1250 / 1200 / 1199 px | 42 loads, 0 issues. At `d1fcf68` the same sweep had overflow issues at 1200 and 1280 px. |
| Home-page interaction suite for Options 2 and 4, EN/AR × desktop/phone | 132 checks, 0 failing: search suggestions and Enter → Browse, category links, add to cart, save/unsave, auctions, live auction, manifests, sellers, grade guide, delivery city picker, newsletter, footer placeholder toast, menu drawer and language switch. |

## 5. English / Arabic results

- **Option 2.**
  - English and Arabic behave the same.
  - The footer's five columns follow the reading direction: brand at the start, Legal at the end.
  - The shares keep the same proportions in both languages.
  - The Legal links stay inside the page from 320 to 1920 px.
  - The newsletter form rejects an invalid address and accepts a valid one in both languages.
- **Option 4 footer.**
  - The band mirrors as before: the newsletter is at the start and the links and Legal at the end, with the Legal divider on the inner side.
  - The form keeps its 86 px clearance from the first link column in both directions.
- **Option 4 "How Khaznah works".** The steps run right to left in Arabic, as before, with no overflow.
- **Option 4 search.**
  - The suggestions panel is fully visible above the Buy Now cards at every desktop width in both languages. At 1200–1440 px it extends 242 px below the hero in English and 258 px in Arabic, where the Arabic text is taller.
  - "See all results" / "عرض كل النتائج" is clickable.
  - Tab and Escape work as before.
  - On phones every row, including its price, fits the panel.
- **Placeholder.**
  - English needs the shorter text at 1200–1339 px.
  - The Arabic full text is shorter and fits at every desktop and tablet width, so Arabic desktop is unchanged.
  - On phones both languages use the short or shortest text (§3.5).
- **Photographs.** Nothing is mirrored. The hero photographs and their crops are the same files and positions as at `d1fcf68` (§7).

## 6. Regression gates

**Method.**
- Each home page was captured section by section (its `[data-ref]` blocks) from the corrected build and from `d1fcf68`, on a frozen clock, and compared pixel by pixel.
- Product and seller photographs outside the hero are masked, because their late loading varies between runs, even when a build is compared with itself.
- The hero is compared with its photographs.

**Option 3 — unchanged.**
- English and Arabic at 1920, 1440, 1200, 1024 and 390 px: every section is identical.
- One sporadic 65-pixel difference in the Arabic 1920 px hero also appeared when `d1fcf68` was compared with itself. It is rendering noise and did not recur on a re-run.

**The three 1440 px compositions — stable.**
- Options 2, 3 and 4 at 1440 and 1920 px, in English and Arabic: every section is pixel-identical to `d1fcf68`.
- Page heights are unchanged:

| Option | English | Arabic |
|---|---|---|
| Option 2 | 3780 px | 3863 px |
| Option 3 | 3843 px | 3915 px |
| Option 4 | 3835 px | 3910 px |

**Options 2 and 4 at the other widths — only the corrected sections change.**

| Option | Widths (EN and AR) | Sections that differ from `d1fcf68` |
|---|---|---|
| 2 | 1200–1382 px | the footer (15) only |
| 2 | 1199 px and narrower | none |
| 4 | 1200–1382 px | "How Khaznah works" (13) and the green band (15); in English at 1200–1280 px also the search placeholder in the hero (03) |
| 4 | 1199, 1024, 768 px | none |
| 4 | 390, 320 px | the search placeholder in the hero (03) only |

At a few Arabic widths (1024, 768, 390, 320 px) the seller directory (11) showed 1–14 stray pixels at the edges of masked photographs. The same kind of noise appears between two runs of the same build; nothing in that section changed.

Notes on Option 4:
- **The white brand base (16) moves up** because "How Khaznah works" is shorter. With sections 13 and 15 left out of both pages, it is pixel-identical.
- **Arabic at 1200–1280 px** cannot be compared position for position. At `d1fcf68` the page overflowed by 103–183 px there, which offsets the "before" capture. Leaving the two corrected sections (13, 15) out of both pages removes that overflow, and every remaining section is then identical.

**Option 1 — unchanged.**
- **Full-page screenshots.** 70 Option 1 screens (home, Browse, product, auction, Live auction, seller and design system × EN/AR × 1440 / 1024 / 768 / 390 / 320 px) were captured from the corrected build and from `d1fcf68` on a frozen clock and compared pixel by pixel. **0 differ**, with 0 console errors. It ran in two parts because of the session's time limit: the design-system page separately.
- **Presentation bar.** Every Option 1 screen at 6 widths in EN and AR (84 comparisons): markup and pixels are identical.
- **Selector.** The Option 1 card markup is identical in both languages.
- **Code.** No Option 1 file changed: `git diff d1fcf68` is empty for `components/concept-b/` and `styles/concept-b.css`.

**Earlier-prototype screens.** 72 full-page screenshots of the earlier-prototype screens of Options 2–4 (Browse, product, auction, Live auction, seller and design system × EN/AR × 1440 / 390 px) were compared with `d1fcf68` on a frozen clock. **0 differ.**

## 7. Homepage imagery unchanged

- **No image file changed.** `git diff d1fcf68 -- design-preview/public` is empty. That covers the Priority 1 photographs in `public/images/work/`, the catalogue and brand images, and the selector thumbnails. The asset masters in `assets-src/` did not change either.
- **The hero photographs are pixel-identical.** They were compared with their photographs, not masked:
  - Option 2 heroes (A3/A4) and Option 3 mosaic (A5): identical at every tested width.
  - Option 4 hero (A6/A7): identical wherever the placeholder text is the same. At 1200–1339 px in English and on phones the only difference is the placeholder text (§3.5).
- **Photographs are loaded and placed as before.** The asset-loading check (Options 2–4 × EN/AR × 7 widths) passes 168 of 168 checks:
  - every hero shows its expected photograph file and downloads only its own composition;
  - the recliner lot loads the A2 cut-out;
  - no stand-in or shared olive-recliner photograph is requested;
  - there are no failed requests.

## 8. Before/after evidence

Screenshots in `docs/final-homepage-qa/` compare `d1fcf68` (red bar) with the corrected build (green bar) at the affected widths. Each image states what it shows. Items crossing the page edge are outlined in red, and "See all results" is outlined in blue, even where the cards cover it.

| File | What it shows |
|---|---|
| `option-2-footer.jpg` | Option 2 newsletter band and footer at 1200 px EN/AR and 1250 px EN. Before: the Legal column is past the page edge. After: all five columns fit. |
| `option-4-footer.jpg` | Option 4 green band and brand base at 1200 px EN, 1280 px AR, 1366 px EN and 1382 px AR. Before: Terms/Privacy are off the page. After: every column fits, and the form keeps its clearance. |
| `option-4-how-it-works.jpg` | "How Khaznah works" at 1200 px EN/AR. Before: the third step runs past the edge. After: three even steps. |
| `option-4-search-panel.jpg` | Suggestions panel at 1440 px EN/AR, 1200 px EN and 1280 px AR. Before: its last rows and "See all results" are under the Buy Now cards. After: the whole panel is on top. |
| `option-4-search-panel-phones.jpg` | Suggestions panel at 390 px EN and 320 px AR. Before: prices are outside the panel. After: every row fits. |
| `option-4-search-placeholder.jpg` | Search field at 1200, 1280 and 1330 px EN, 390 px EN/AR and 320 px AR. Before: the placeholder is cut off. After: the text fits. |

## 9. Notes

- **Selector thumbnails were not recaptured.** Per the scope protection, the presentation selector and its images are unchanged. The only visible difference between the live pages and the thumbnails is the Option 4 phone placeholder text ("Search products" instead of the cut-off full text).
- **Pre-existing, unchanged, outside scope.** When the pointer rests on Option 2's newsletter Subscribe button, its darker brass hover colour gives the button text a contrast of 4.37:1 (4.5:1 is the target). The resting state passes. The same happens at `d1fcf68`.
- **Pre-existing, unchanged, outside scope.** Option 1 still has its 12 px overflow at 320 px in English. Option 1 is not modified in this round.
- **Nothing else started.** No Priority 2 assets and no inner-page redesign.

## Deployment

The branch is connected to the Vercel preview project `khaznah-auction-web-app`, which builds and publishes pushed commits automatically (`*.vercel.app` addresses). The push of this commit will be published that way. No deployment was made by hand, no Vercel or domain setting was changed, and the real Khaznah production application and domain were not touched.
