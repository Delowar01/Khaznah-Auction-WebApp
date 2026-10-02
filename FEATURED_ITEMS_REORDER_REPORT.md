# Featured Items moved up — Options 1, 2 and 3

On the Options 1–3 homepages, Featured Items moves up one section. Each still
follows its first auction section. Option 4 is unchanged.

- The sections themselves are unchanged: same cards, copy, data, images and interactions.
- One spacing value moved with the sections on Option 3 (§5).

---

## 1. Starting commit

- **Commit:** `84998af` ("Apply auction-first navigation across Khaznah
  preview") on `claude/magical-faraday-fne4kq`.
- **Checks before editing:**
  - HEAD matched `origin/claude/magical-faraday-fne4kq`;
  - the working tree was clean.
- **Comparison build:** a production build of `84998af` in a separate
  worktree, served next to this change. Every before/after figure below
  compares the two builds.

## 2. Final commit

The commit that adds this report: "Move Featured Items higher on homepage
options 1-3". Its parent is `84998af`.

- The report cannot contain its own hash.
- `git log -1 --format=%H -- FEATURED_ITEMS_REORDER_REPORT.md` prints the hash.

## 3. Section order, before and after

Arabic has the same DOM and reading order. Moved sections are in bold.

**Option 1 · Modern Commerce**

| # | Before (`84998af`) | After |
|---|---|---|
| 1 | Hero (carousel, promo tiles, trust strip) | Hero (carousel, promo tiles, trust strip) |
| 2 | Shop by category | Shop by category |
| 3 | Auctions closing soon | Auctions closing soon |
| 4 | **Live auctions** | **Featured Items** |
| 5 | **Featured Items** | **Live auctions** |
| 6 | Deals on Buy Now | Deals on Buy Now |
| 7 … | Bulk & pallets · Shop by seller · How it works & Condition grades | unchanged |

**Option 2 · Premium Modern Marketplace**

| # | Before (`84998af`) | After |
|---|---|---|
| 1 | Hero | Hero |
| 2 | Category row | Category row |
| 3 | Ending soon (stone band) | Ending soon (stone band) |
| 4 | **Live auction** | **Featured Items** |
| 5 | **Featured Items** | **Live auction** |
| 6 | Buy Now, ready to discover | Buy Now, ready to discover |
| 7 … | Selected for your everyday · Bulk & Pallets · Featured Sellers · trust strip · Condition grades & How Khaznah works | unchanged |

**Option 3 · Visual Discovery Marketplace**

| # | Before (`84998af`) | After |
|---|---|---|
| 1 | Hero mosaic | Hero mosaic |
| 2 | Category pills | Category pills |
| 3 | Live now (navy banner) | Live now (navy banner) |
| 4 | **Ending soon** | **Featured Items** |
| 5 | **Featured Items** | **Ending soon** |
| 6 | Finds worth a closer look (Buy Now wall) | Finds worth a closer look (Buy Now wall) |
| 7 … | Explore their shelves · Bulk & Pallets · A little clarity · How it works | unchanged |

**Option 4 · Contemporary Saudi Commerce:** unchanged (§4).

## 4. Option 4 unchanged

- **Code:** no Option 4 file was touched.
- **Homepage pixels vs `84998af`:** EN/AR at 1440, 1024, 768, 390 and 320 px
  (10 pairs). The header and footer are identical in all 10 pairs.
  - Content: 0 px on 8 pairs.
  - The other two pairs differ by 34 px (EN 1024) and 1 px (AR 768). These
    are single rows of anti-aliasing noise:
    - on a re-run they were 7 px and 0 px;
    - the `84998af` build compared with itself gives up to 41 px at EN 1024.
- **First screen** (the selector preview viewport) is identical in EN/AR on
  desktop and phone.

## 5. Files changed

| File | Change |
|---|---|
| `design-preview/components/concept-b/pages/HomePage.jsx` | Option 1: Featured Items moves after Auctions closing soon, inside the same container. The live band and every gap keep their values (56 px desktop, 48 px below 1024 px). |
| `design-preview/components/concept-a/premium-modern/PremiumModernHome.jsx` | Option 2: Featured Items moves before the live auction. The docblock lists the new order. |
| `design-preview/components/concept-c/visual-discovery/VisualDiscoveryHome.jsx` | Option 3: Featured Items moves before Ending soon. The docblock lists the new order. |
| `design-preview/components/concept-c/visual-discovery/sections.jsx` | Option 3 spacing fix (below): Featured Items and Ending soon swap their top-padding classes. Nothing else in either section changed. |
| `design-preview/data/concepts.js` | Selector descriptions for Options 2 and 3 (EN/AR) list the sections in the new order. Only words were reordered; no new wording. |
| `docs/featured-items-reorder/` | New 1440/390 EN/AR screenshots and section-order sheets for Options 1–3, with a README |
| `docs/auction-first-featured/README.md` | One note pointing to the new screenshots for Options 1–3 |

**Option 3 spacing fix.** The approved design spaces sections in two ways:

- the section right after the navy live banner starts 21 px below it (24 px below 1200 px);
- white sections are 30 px apart (28 px below 1200 px).

Ending soon carried the after-banner value. After the swap, a plain swap
measured:

- banner → Featured Items: 30 px;
- Featured Items → Ending soon: 21 px.

That squeezed two white sections and opened the banner gap. Swapping the two
sections' top paddings keeps the approved rhythm exactly: banner → Featured
Items 21 px, Featured Items → Ending soon 30 px (24 / 28 px below 1200 px).
The total page height is unchanged.

**Option 2 spacing: left as is.** Its moved sections carry their own paddings,
so after the swap:

| Gap | Desktop, before → after | Below 1200 px, before → after |
|---|---|---|
| Stone band → next section | 19 → 21 px | 24 → 20 px |
| Between the two moved sections | 48 → 46 px | 44 → 48 px |

These 2–4 px differences sit within the page's existing range of 28–48 px
between white sections. That is not a spacing issue, so no Option 2 CSS was
touched.

## 6. EN/AR responsive QA

**Matrix:** Options 1–3 × EN/AR × 1440, 1024, 768, 390 and 320 px = 30 pages,
all images loaded.

| Check | Result |
|---|---|
| Horizontal overflow | 0 on all 30 |
| Broken / pending images | 0 / 0 |
| Console errors / failed requests | 0 / 0 |
| Text spilling out of buttons and links | 0 |
| axe serious/critical (WCAG 2.1 A/AA) | 0 |
| Tap targets on phones | Same counts as `84998af` on all 12 phone pages |
| Featured Items position | On all 30 pages, between the expected neighbours: <br>• Option 1: Auctions closing soon and Live auctions; <br>• Option 2: Ending soon and Live auction; <br>• Option 3: the live banner and Ending soon. |
| Section overlap | None: consecutive sections never intersect |
| Spacing | All 30 pages: every gap not touching the moved pair equals `84998af`. The new gaps match §5. |
| Arabic | Same section order as English in the DOM, so the reading order is the same. The rule script below passes in Arabic. |

## 7. Auction-first rule

The `c77ea32` business-rule script passes in EN and AR on all four options.

- **First transactional section after the hero is an auction section:**
  - Option 1: Auctions closing soon;
  - Option 2: Ending soon;
  - Option 3: Live now;
  - Option 4: Ending soon.

  In each of Options 1–3, Featured Items comes right after that section, never
  above it.
- **No Buy Now section before the last auction section.** Featured Items
  comes before the first Buy Now section and still lists its auction lots
  before its Buy Now items.
- **Unchanged:**
  - the navigation, mobile menu and footer order (Timed → Live → Buy Now → Sellers → Bulk);
  - the hero buttons (Explore auctions before Shop Buy Now).

## 8. Regression result vs `84998af`

| Check | Result |
|---|---|
| Inner pages, all four options: 9 routes × EN/AR × 1440/390 (144 pairs) | Pixel-identical: header, content and footer 0 px on all 144 |
| Option 4 homepage | Unchanged (§4) |
| Options 1–3: what moved | On all 30 pages, the two moved sections have identical text, links and images, and appear in the new order. |
| Options 1 and 3: the rest of the page | Above the moved pair: identical on 19 of 20 pages. The 20th is Option 1 AR 320, at 5 px. Below the moved pair: identical, except Option 3 Arabic at 768 and 1024 px (see notes). |
| Options 1 and 3: the moved sections' pixels | 0–0.26 % of their pixels differ after aligning rows. See notes. |
| Option 2 | Layout and content unchanged outside the swap; text anti-aliasing differs (see notes). |
| Navigation, menus, footer | Unchanged: identical in the pixel comparison, and the rule script passes |
| Featured Items content | Unchanged: same lots, items, copy, images and links |
| Priority 1/2 imagery | No image file changed |
| Selector | The checks pass, with 0 failing: <br>• names and one-liners match the data; <br>• all 16 previews load from the current files; <br>• the Option 1 card markup is identical to `84998af` in EN and AR. <br>The Options 2–3 description text shows the new order (§5). |
| Lint / build | `eslint .` clean; `next build` succeeds |

Notes:

- **Sub-pixel noise in the moved sections.** Section heights are fractional,
  so a section that moves is painted at a different sub-pixel offset. Some text
  edges land one pixel apart, mostly in Arabic. After aligning rows, at most
  0.26 % of a moved section's pixels differ. The section's text, links and
  images are identical.
- **Option 3 Arabic, 768 and 1024 px.** In the frozen-clock capture, the Ending
  soon and seller rails sit 4 px apart.
  - On a normal page load, both builds put the rails at exactly the same
    scroll position: −28 px, snapped to the first card.
  - So this comes from the test's paused clock, not from the page.
- **Option 2 text anti-aliasing.** The live-auction section contains a frosted
  play button (`backdrop-blur`). In headless Chrome on desktop widths, moving
  that section one place down changes how Chrome composites the page. As a
  result, the page's text is drawn with grayscale anti-aliasing instead of
  coloured sub-pixel (LCD) anti-aliasing.
  - Glyphs, positions and colours are unchanged.
  - Phone screens (2x density) are identical. The difference shows on desktop
    widths.
  - **Confirmation:** with that one blur effect turned off in both builds,
    everything above the moved sections is pixel-identical at all 10
    widths/languages. Below them, only one button's text anti-aliasing differs
    (≤ 510 px).
  - Nothing in the design changed. The page renders as Chrome renders it
    without the blur effect present, so no CSS was added to work around it.

## 9. Selector thumbnails

- **Not recaptured.** The thumbnail files are byte-identical; no file under
  `public/` changed.
- **The moved sections are below the preview viewport.** The previews show the
  first 1440 × 900 (desktop) and 390 × 844 (phone) of each homepage. The first
  moved section starts at (English; Arabic is slightly lower):

  | Option | Desktop | Phone |
  |---|---|---|
  | 1 | 1,783 px | 2,230 px |
  | 2 | 1,090 px | 1,477 px |
  | 3 | 1,169 px | 2,358 px |
- **First-screen pixels vs `84998af`:**
  - identical on Options 1, 3 and 4, desktop and phone, EN and AR;
  - identical on the Option 2 phone screens;
  - the Option 2 desktop screens differ only in text anti-aliasing (§8 note),
    not in content.

## 10. Vercel deployment status

- **Push:** this commit is pushed to `origin/claude/magical-faraday-fne4kq`.
  The connected Vercel project builds a preview of each pushed commit
  automatically, so no manual deployment was made.
- **Status:** the hand-off message for this commit records the GitHub commit
  status ("Vercel — Deployment has completed" or otherwise). It is posted after
  the push, so it cannot appear in this file.
- **Not changed:**
  - no Vercel setting;
  - no domain;
  - no production environment;
  - no production Khaznah frontend, backend, API, admin, seller dashboard or warehouse site.
