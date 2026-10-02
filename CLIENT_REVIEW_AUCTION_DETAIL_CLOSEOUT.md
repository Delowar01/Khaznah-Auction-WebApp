# Khaznah — Timed Auction Detail closeout

Closes the Auction Detail review of `128b596` with the two required phone
fixes. There is no redesign: nothing else changed. Paths are relative to
`design-preview/` unless they start at the repository root.

- **Fix 1:** Option 4's dual-lot card ("Auction + Buy Now") no longer runs
  its sale tag under the heart on phones. It shows on Option 4 Browse and in
  Auction Detail's similar auctions.
- **Fix 2:** on Auction Detail phones, toasts now sit above the fixed bid
  bar in all four options, instead of covering it.
- **Evidence:** `docs/client-review-auction-detail/auction-detail-closeout.jpg`
  (repository root): the card before and after at 320 px, and the foot of
  each option's phone page with a toast above its bid bar.

---

## 1. Starting point

- **Branch:** `claude/magical-faraday-fne4kq`.
- **Starting commit:** `128b596` ("Redesign auction detail for all four
  Khaznah concepts").
- **Checks before any change:**
  - HEAD was exactly `128b596`;
  - `origin/claude/magical-faraday-fne4kq` was the same commit;
  - the working tree was clean.
- **Comparison build:** a production build of `128b596` in a separate
  worktree, served next to the new build. Every before/after figure below
  compares those two builds.

## 2. Fix 1 — Option 4 dual-lot card: tag and heart

**Problem.** On phones (below 640 px) Option 4's card lies on its side:
the photo plate at the start, the details beside it. The sale tag sits at
the top of the details column and may grow to the column's full width. The
heart (save) button is absolute in the card's top-end corner. The title
under the tag already kept clear of the heart (`pe-8`), but the tag did
not. For the dual lot the label "Auction + Buy Now" is long, so the tag ran
under the heart.

| Width | English, before | Arabic, before |
|---|---|---|
| 320 px | tag 32 px under the heart's button | 17 px under |
| 360 px | 20 px under | clear (8 px gap) |
| 390 px | 1 px under | clear (26 px gap) |

**Fix** (`components/concept-d/saudi-commerce/browse/Cards.jsx`, `LotCard`,
one element): the phone tag is now wrapped in a `div` with `pe-8`, the same
32 px end space the title below it already keeps for the heart:

```jsx
{/* Phones: the tag stops short of the heart in the card's top corner, like the title below it. */}
<div className="mb-2 flex pe-8 sm:hidden">
  <SaleTag facts={facts} />
</div>
```

- Before, the tag itself carried `mb-2 self-start sm:hidden`. The wrapper
  keeps the same bottom margin and the same height, so the title and
  everything below do not move. The flex wrapper keeps the tag a flex item,
  so no line box is added.
- The tag keeps its own `max-w-full` and truncating label. It now truncates
  within the narrower space instead of running under the heart.
- The heart, its 40 px touch target and its position are unchanged. The tag
  font, colour, icon and wording are unchanged. Sale-type logic is
  unchanged.
- From 640 px up the wrapper is hidden, as the old phone tag was. The
  upright card and its tag on the photo are untouched.
- The list row (`LotRow`) already kept the same 32 px end space, so it
  needed nothing.

**After (measured).** No overlap at any width, in either language:

| Width | English | Arabic |
|---|---|---|
| 320 px | clear; label truncated to "Auction +…" | clear; label truncated to "مزاد + شراء…" |
| 360 px | clear; "Auction + Bu…" | clear; full label (unchanged) |
| 390 px | clear; "Auction + Buy N…" | clear; full label (unchanged) |
| 480 px and up | full label, unchanged | full label, unchanged |

- **Gap:** the tag now ends exactly where the heart's 40 px touch target
  begins, so the boxes do not overlap. About 9 px of clear space remains
  between the tag and the visible heart.
- **Truncation:** the label is still read in full by screen readers (CSS
  truncation only). The card also says "or buy now SAR 4,600" in its price
  lines.

## 3. Fix 2 — Phone toasts above the bid bar

**Problem.** The shared toast stack (`components/shared/ui/Toaster.jsx`,
mounted once per option by `ConceptShell`) sits 16 px from the bottom of
the screen on phones, above everything (`z-index: 300`). On Auction Detail
the fixed phone bid bar occupies the same place, so every toast covered the
bar and its Bid now button for 4.2 s: Watch, Share, bid placed, outbid,
maximum bid and Buy Now. At `128b596` the toast's bottom was at 744 px on a
760 px screen, over a bar whose top was at 683–687 px, in all four options.

**Strategy: page-scoped and measured, not a global offset.**

1. **The bar reports its own height.** A new hook in the shared auction
   layer, `useToastClearance()` (`components/shared/auction/hooks.js`),
   returns a ref that each option puts on its phone bar's outer (fixed)
   element:
   - Option 1 `MobileBidBar` (`components/concept-b/auction/MobileBid.jsx`);
   - Options 2–4 `PhoneBar` (`components/concept-{a,c,d}/…/auction/Bidding.jsx`).
2. **While the bar is shown**, the hook sets `--kz-toast-bottom` on `<html>`.
   The value is the bar's height above the bottom of the screen, safe area
   included, plus a 12 px gap. It measures the bar
   (`innerHeight − bar.top`) instead of assuming a height, so each option's
   bar counts as it is:

   | Option | Bar | `--kz-toast-bottom` at 390 / 360 / 320 px |
   |---|---|---|
   | 1 | 76 px, full width | 89 px |
   | 2 | 72 px, full width | 85 px |
   | 3 | 64 px floating pill, 12 px above the bottom | 88 px |
   | 4 | 74 px, full width | 87 px |

   (Measured with no safe area; on a phone with a home indicator the
   bars' existing `env(safe-area-inset-bottom)` padding is included in the
   measurement.) A `ResizeObserver` and the window's resize event keep it
   current. When the bar is hidden (768 px and up, where it is
   `display: none`) or the page goes away, the hook removes the variable.
3. **The Toaster reads it on phones only:**
   `max-md:pb-[var(--kz-toast-bottom,1rem)]`. When no page sets the
   variable, the fallback is `1rem`, the same 16 px as before, so every
   other page keeps its placement. From 768 px up the existing
   `md:pb-6` / `md:pe-6` placement (bottom-end corner) is untouched.

**What did not change:** the toast component, its look, its texts and
lengths, its 4.2 s timing, its stacking (up to four, newest at the bottom),
its live region and its close button. Desktop placement is unchanged.

## 4. Routes and components affected

| File | Change | Where it shows |
|---|---|---|
| `components/concept-d/saudi-commerce/browse/Cards.jsx` | Phone sale tag wrapped with `pe-8` (Fix 1). | Option 4 Browse and Option 4 Auction Detail similar auctions, below 640 px, on the dual lot's card only (the only lot with a long enough label). |
| `components/shared/auction/hooks.js` | New `useToastClearance()` (Fix 2). | Auction Detail, all options. |
| `components/concept-b/auction/MobileBid.jsx` | Ref on the bar. | Option 1 Auction Detail, phones. |
| `components/concept-a/premium-modern/auction/Bidding.jsx` | Ref on the bar. | Option 2 Auction Detail, phones. |
| `components/concept-c/visual-discovery/auction/Bidding.jsx` | Ref on the bar. | Option 3 Auction Detail, phones. |
| `components/concept-d/saudi-commerce/auction/Bidding.jsx` | Ref on the bar. | Option 4 Auction Detail, phones. |
| `components/shared/ui/Toaster.jsx` | Reads the variable below 768 px, default 16 px as before. | Only where the variable is set (Auction Detail phones). |

Routes: `/{en,ar}/concept-{a,b,c,d}/auction` and `…/auction/[slug]` (toasts),
`/{en,ar}/concept-d/browse` and Option 4's auction pages (the card).

Documentation (repository root):
- this report;
- `docs/client-review-auction-detail/auction-detail-closeout.jpg` and a short
  "Closeout" note in that folder's README;
- in `CLIENT_REVIEW_AUCTION_DETAIL_REPORT.md` §R, the two limitations these
  fixes close are marked as fixed.

The 20 review screenshots are unchanged and still accurate:
- the `fridge-690` pages they show are pixel-identical to `128b596` (§8);
- they show no toast;
- they do not include the dual-lot card.

## 5. Targeted QA — card

`.scratch/ad/card-check.mjs`, production builds, new against `128b596`.
The checks run on Option 4 Browse and on an Option 4 Auction Detail page
whose similar auctions include the dual lot (`dishwasher`), in English and
Arabic. Widths: 320, 360, 390, 480, 639, 640, 768, 1024 and 1440 px.

Each check covers:
- tag and heart do not overlap;
- the label shows at least 48 px of text;
- the title's position inside the card is identical to the baseline;
- the heart stays inside the card;
- the page has no sideways overflow;
- a pixel comparison of the whole card with the baseline:
  - from 640 px up the card must be identical;
  - on phones it may change only where the old tag reached the heart.

Result: **36 / 36 passed.**

- **Changed** (tag width only, title unmoved): English 320, 360, 390 and
  Arabic 320, on both pages.
- **Pixel-identical to `128b596`:** every other phone case (Arabic 360/390,
  480, 639) and every tablet or desktop card (640, 768, 1024, 1440).
- **Tolerance:** a pixel counts as changed above a 2-level difference per
  channel. Photo resampling alone moves a few pixels by 1 level between two
  loads of the same build; the baseline compared with itself does this too.

## 6. Targeted QA — toasts and the bid bar

`.scratch/ad/toast-check.mjs`, production build. Coverage:
- all four options;
- English and Arabic;
- 390, 360 and 320 px;
- `fridge-690`.

On each page, in order:

1. **Watch** (the page's Watch / Save control): one toast.
2. **Share:** a second toast joins the stack; the stack grows upward from
   its place above the bar.
3. **Dismiss:** the newest toast's close button, focused and pressed with
   Enter, removes it.
4. **Bid placed:** bid sheet → Place bid → Confirm bid.
5. **Maximum bid saved:** bid sheet → Set a maximum bid → 4,000 → Save
   maximum, then the sheet is closed.
6. **Buy Now result:** Buy it now → confirm. The "It's yours" toast shows
   and the lot is sold.

Checked in every state:
- every toast's bottom edge is at least 8 px above the bar's top;
- every toast is fully on screen;
- stacked toasts do not overlap each other;
- the bar's Bid button is not covered (hit test at its centre);
- the page has no sideways overflow;
- the live region is present;
- focus stays on the control that raised the toast.

| | Result |
|---|---|
| 24 phone pages (4 options × 2 languages × 3 widths), all six steps | **24 / 24 passed.** Each toast's bottom edge sits **12 px** above the bar in every option, width and language, single or stacked. |
| Desktop (1440 px), each option | Toast in the bottom-end corner, 24 px from both edges, as before; no variable set. |
| Leaving the page (header logo, client-side) | Variable removed; it does not follow you to Home. |
| Option Browse on a phone (390 px), each option | Toast 16 px from the bottom, as before. |
| **Total** | **28 / 28 passed.** |
| Same check on `128b596` (English, 390 px) | All four options fail: toast bottom at 744 px over a bar whose top is at 683–687 px, and the Bid button covered. This is the problem being fixed. |

## 7. Accessibility

`.scratch/ad/a11y-ac.mjs`. Coverage:
- toasts: 4 options × English and Arabic × 390 and 320 px;
- the card: Option 4 Browse and similar auctions × English and Arabic ×
  320 and 390 px.

| Check | Result |
|---|---|
| The toast stack is still `aria-live="polite"`; each toast is `role="status"` | Pass, all 16 pages. |
| The close button is a native button in the Tab order (`tabIndex` 0), labelled "Close" / "إغلاق", not hidden from assistive technology | Pass. Keyboard dismissal is also exercised in §6 step 3. |
| A toast does not move focus | Pass: focus stays on Share (and on Watch in §6). |
| The bid bar's keyboard behaviour | Pass: Bid now takes focus; Enter opens the sheet; Escape closes it; focus returns to Bid now. |
| axe (WCAG 2.1 A/AA) on the phone page with a toast showing | 0 serious or critical, 0 minor, in all 16. |
| axe on the dual-lot card | 0 serious or critical, in all 8. |
| **Total** | **24 / 24 passed.** |

## 8. Regression against `128b596`

**Pixel comparison** (`.scratch/nav/regress-chrome.mjs`):
- pages: Home, Browse, Auction Detail `fridge-690` and Auction Detail
  `dishwasher`;
- each option, English and Arabic, at 1440, 1024, 390 and 320 px;
- 128 pairs in all;
- full-page captures with a frozen clock, compared in header, content and
  footer bands.

| Page | Result |
|---|---|
| Home, 4 options | Identical, apart from two capture artefacts that also appear when the baseline is compared with itself (below). |
| Browse, Options 1–3 | Identical. (Option 1 English 320 px showed 5 header pixels once; identical on a re-run.) |
| Browse, Option 4 | Identical at 1440 and 1024 px and in Arabic at 390 px. Changed at English 390 (143 px), English 320 (950 px) and Arabic 320 (596 px). Each change is a single 26 px-high band, the dual-lot card's tag row, and nothing else. **Intended.** |
| Auction Detail `fridge-690`, 4 options | Identical, all 32 pairs. The toast fix has no visible effect until a toast shows, and this lot's similar auctions do not include itself. |
| Auction Detail `dishwasher`, Options 1–3 | Identical. |
| Auction Detail `dishwasher`, Option 4 | Identical except the same 26 px tag band of the dual-lot card in similar auctions (English 390 and 320, Arabic 320). **Intended.** |

**The two Home artefacts:**
- **Option 3, Arabic, 1024 px:** 6,878 px in a seller rail that settles at
  a slightly different scroll position between two loads. Comparing
  `128b596` with itself gives exactly the same 6,878 px.
- **Option 4, 1440 px:** 3 px of 1–3-level anti-aliasing on image edges in
  a list. In one of two runs it appeared in Arabic, in the other it did not.
- No Home code changed in this closeout. Option 4's Home does not use the
  changed card.

**Behaviour:** the full Phase C bid-flow suite was re-run on the new build
(`.scratch/ad/interact.mjs`; 4 options × English and Arabic; steps 1–26).
It covers bidding, the confirm step, maximum bid, history, grade guide,
similar link, Buy Now, the phone bar and the bid sheet.

Result: **224 / 224 passed**, with the same measurements as at `128b596`:
- Buy Now's area is 17–23 % of Place bid's;
- the phone bar sits at the same height;
- the footer's last line ends above the bar on phones.

Not changed: Home, Browse Options 1–3, navigation, header, footer, images,
gallery, bid history, maximum bid, Buy Now, the bid sheet and all bidding
logic (`lib/useAuction.js` untouched).

## 9. Lint, build and static export (final tree)

All on the code in the closeout commit (`design-preview/`):

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass**: exit 0, no errors, no warnings. |
| Production build | `npm run build` | **Pass**: exit 0, 335 / 335 pages, no warnings. |
| Static export | `STATIC_EXPORT=1 npm run build` | **Pass**: exit 0, 335 / 335 pages, no warnings. |

**Export check** (`out/`, `.scratch/ad/export-smoke.mjs`):
- All 96 auction files are present.
- The export was served as plain files. In each option and language,
  `/auction/` opens the featured lot, a bid goes through the confirm step
  (current bid 3,200, history row "You") and the pallet lot opens:
  **8 / 8 passed**.
- The normal build was restored afterwards.

## 10. Vercel

The branch was pushed; Vercel deploys it automatically. I cannot read the
Vercel status from this environment, so the commit is given in the
handover for checking there. No Vercel setting, domain, production or
backend was changed.

## 11. Commit

"Close Auction Detail mobile QA issues", on `claude/magical-faraday-fne4kq`.
A report cannot contain its own hash;
`git log -1 --format=%H -- CLIENT_REVIEW_AUCTION_DETAIL_CLOSEOUT.md` prints
it.
