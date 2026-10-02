# Khaznah — Browse redesign closeout

Closes the Browse gate approved at `a37ce2a`.

This pass only did two things:
- re-ran lint and both builds on the final tree;
- removed the old Round 2 Browse files that nothing uses any more.

There is no visual or behavioural change. Paths are relative to
`design-preview/`.

## 1. Starting point

- **Branch:** `claude/magical-faraday-fne4kq`.
- **Starting commit:** `a37ce2a` ("Redesign Browse page for all four Khaznah
  concepts").
- **Checks before any change:**
  - HEAD was exactly `a37ce2a`;
  - `origin/claude/magical-faraday-fne4kq` was the same commit;
  - the working tree was clean.

## 2. Lint and builds

| Check | Command (in `design-preview/`) | Result |
|---|---|---|
| Lint, final tree as approved | `npm run lint` | **Pass**: exit 0, no errors, no warnings. |
| Lint, after the cleanup | `npm run lint` | **Pass**: exit 0, no errors, no warnings. |
| Production build | `npm run build` | **Pass**: exit 0, 335 pages generated, no errors or warnings. |
| Static export | `STATIC_EXPORT=1 npm run build` | **Pass**: exit 0, 335 pages exported, no errors or warnings. |

- **Lint** therefore covers the last accessibility and Arabic-badge fixes
  from `a37ce2a`. Nothing needed fixing.
- **Static export check:**
  - all eight Browse pages are exported
    (`out/{en,ar}/concept-{a,b,c,d}/browse/index.html`);
  - served as plain files, each one opened with
    `?tab=auction&category=furniture` applied (H1 "Furniture" / "الأثاث",
    2 lots);
  - switching to Buy Now rewrote the address to
    `?tab=buy_now&category=furniture`;
  - no console errors.

## 3. Files removed

All ten files on the list were confirmed unused and removed.

| Option | Removed |
|---|---|
| 2 (`concept-a`) | `components/concept-a/pages/BrowsePage.jsx`, `components/concept-a/browse/BrowseView.jsx`, `components/concept-a/browse/QuickFilters.jsx` |
| 3 (`concept-c`) | `components/concept-c/pages/BrowsePage.jsx`, `components/concept-c/browse/BrowseView.jsx`, `components/concept-c/browse/QuickFilters.jsx` |
| 4 (`concept-d`) | `components/concept-d/pages/BrowsePage.jsx`, `components/concept-d/browse/BrowseView.jsx`, `components/concept-d/browse/QuickFilters.jsx` |
| 1 (`concept-b`) | `components/concept-b/browse/QuickFilters.jsx` |

### How each file was confirmed unused

**Import scan.** Every import in the app was resolved to a file:
- static imports and re-exports;
- dynamic `import()` and `require`;
- the `@/` alias and relative paths.

That covered 691 JS/JSX files and 4,249 local imports.

**Results:**
- Options 2–4: each old Browse file is imported only from inside its own
  dead chain (`pages/BrowsePage.jsx` → `browse/BrowseView.jsx` →
  `browse/QuickFilters.jsx`). No route or other component imports the
  chain. The Round 2 Browse routes that used it were removed in
  `a37ce2a`.
- Option 1: `browse/QuickFilters.jsx` had no importer at all. The new
  Option 1 Browse has its own quick filters in `browse/BrowseView.jsx`.

**After removal:**
- 681 files, 4,180 local imports, **0 unresolved**.
- Lint and both builds pass.
- A reachability check from every route shows that removing the ten files
  orphaned nothing else.

### Retained, and why

- **None of the ten.**
- **Other Round 2 Browse files stay on purpose:** `ActiveChips`,
  `FacetGroup`, `FacetPanel`, `MobileFilterBar`, `PriceFacet`,
  `ResultsGrid` and `SortControls` in `components/concept-{a,c,d}/browse/`.
  The Round 2 seller pages still use them.
- **Option 1's shared parts stay:** `components/concept-b/browse/*` is
  still used by the live Option 1 Browse and seller pages.
- **No shared code was removed.**

### Text-only mentions, left unchanged

These mention the removed files but are not code:

- **`CLIENT_REVIEW_BROWSE_REPORT.md`**, sections B and O.1, list these
  files as "still on disk, no longer routed". That is the record of
  `a37ce2a`, and this closeout supersedes it.
- **`CUSTOMER_REDESIGN_FILE_MAP.md`**, §E.2, is a dated Round 2 planning
  note. It names `components/concept-a/pages/BrowsePage.jsx` as the place
  where the prototype composed its Browse. Today's equivalent is
  `components/concept-a/premium-modern/browse/`.

### Noticed, not touched (outside this closeout)

The reachability check also lists 38 older component files that no route
uses. None of them are Browse files, and they predate the Browse work:

- the Round 2 homepage parts of Options 2–4:
  - everything in `components/concept-{a,c,d}/home/` except
    `TrustStrip.jsx`, which is still used;
  - `components/concept-{a,c,d}/pages/HomePage.jsx`;
  - `components/concept-{a,c,d}/seller/SellerTile.jsx`;
- `components/shared/ui/BrowseUrlSync.jsx`.

They were not on the approved list, so they stay. They could go in a
later clean-up.

## 4. Smoke test

Script `.scratch/cr/smoke.mjs` (not committed), production build of the
cleaned tree, 1440 px. **Result: 19 of 19 pass.**

| Check | Result |
|---|---|
| All four homepages, EN and AR (8 pages) | HTTP 200, one H1, no console errors. |
| All eight Browse routes, EN and AR | HTTP 200, one H1, 12 lots, no "Earlier prototype" note, no console errors. |
| Concept switching from the presentation bar, starting on Browse | A → B → C → D → A, each landing on the same option's Browse with `?tab=auction` kept, no console errors. |
| Selector page, EN and AR | Loads with all option links and the six "New design" tags (Home and Browse for Options 2–4). The Browse link opens Option 3's Browse. No console errors. |

## 5. No visual changes

**Method:** script `.scratch/nav/regress-chrome.mjs`. It compares
full-page screenshots of the cleaned build against a production build of
`a37ce2a`:

- same frozen clock on both sides;
- photographs masked;
- each page compared in three bands: header, content and footer.

**Coverage:** 4 options × homepage, Browse and `/seller/RAWABI` × EN/AR ×
1440 / 390 px = **48 pairs**. `/seller/RAWABI` is a Round 2 page that still
uses the remaining old Browse parts.

| Option | Pairs | Result |
|---|---|---|
| 1 · Modern Commerce | 12 | All identical (0 px). |
| 2 · Premium Modern | 12 | All identical (0 px). |
| 3 · Visual Discovery | 12 | All identical (0 px). |
| 4 · Contemporary Saudi | 12 | 11 identical. Homepage AR 1440: 81 px along one image edge (see below). |

**The one difference is anti-aliasing, not a change:**

- It is a thin line at the edge of a masked photo in Option 4's Featured
  Sellers section: 81 px in the regression capture, and a single 67-px row
  when the pair was captured again. That section sits on a fractional
  offset (y = 2970.438), so the mask edge falls between pixels.
- The layout boxes of that section and its images are identical in both
  builds, to the thousandth of a pixel.
- The page's HTML is identical apart from asset file names.
- The CSS served for that page is **byte-identical** (same checksum).
- **Repeatable in this run:** the cleaned build vs `a37ce2a` gave 67 px in
  that row each time, while `a37ce2a` against itself gave 0. So this time
  the row differs between the two running builds rather than between
  captures.
- Nothing in the page's markup, styles or geometry differs, so the row
  comes from rendering, not from the cleanup.
- The same section's mask edge already produced 1-row differences in the
  `a37ce2a` QA, including when the older `76a2d95` baseline was compared
  with itself.

**CSS checked for other pages too:** the CSS served for Browse in every
option, and for a Round 2 seller page, is byte-identical between the
cleaned build and `a37ce2a`. Removing the ten files did not change one
generated style.

**Not touched:** Browse layouts, Browse cards, filters, URL behaviour,
homepage layouts, Featured Items, navigation, images, the selector
thumbnails, and the Auction, Live Auction, Product, Seller, Cart, Checkout
and Account pages.

## 6. Commit

The commit that adds this file: "Close Browse redesign QA and remove
obsolete prototypes", on `claude/magical-faraday-fne4kq`.

- It removes the ten files and adds this report.
- Its parent is `a37ce2a`.
- `git log -1 --format=%H -- CLIENT_REVIEW_BROWSE_CLOSEOUT.md` prints the
  hash.
- The hand-off message records the hash and the Vercel deployment status.
