# Approved Work Designs — Options 2, 3 and 4 (homepages only)

Implementation report for the approved ChatGPT work designs from
`KHAZNAH_HOMEPAGE_DEVELOPER_HANDOFF.zip`, built inside the isolated
`design-preview/` app. **Option 1 (Modern Commerce) is unchanged.** Nothing in
the production frontend, backend, APIs, admin, seller dashboard or warehouse
site was touched. Every check below ran on a local production build
(`next build` + `next start`). **Deployment:** this branch is connected to a
Vercel project that deploys every push automatically, so each pushed commit
(including `a2a83f1`) has been published there — see §16. No deployment was
made by hand and no domain setting was changed.

| | |
|---|---|
| Branch | `claude/magical-faraday-fne4kq` |
| Starting commit | `0166ba8` (Round 3B) |
| Scope | Home pages of Options 2, 3, 4 only. Browse, Product, Auction, Live Auction, Seller and Components still show the Round 2 screens. |
| Visual authority | The three original PNGs (then the annotated PNGs, the handoff text, `DESIGN_MEASUREMENTS.json`). |

This is a faithful implementation, **not a pixel-perfect one**. Section
geometry at 1440 px matches the references closely (see §4), but some
photography does not exist in the asset library and was substituted (see §5),
and real catalogue data replaces some raster text.

---

## 0. Visual correction gate (update on top of `a2a83f1`)

The review of `a2a83f1` approved the structure with conditions; final visual
approval is not yet granted. This update makes only the corrections that were
asked for. Nothing was redesigned, no functionality was added, and Option 1 is
unchanged (§14).

| Correction | What changed |
|---|---|
| Missing assets | New `WORK_DESIGN_MISSING_ASSETS.md` (repository root). It holds production briefs for 7 priority-1 assets: the tan recliner photograph and cut-out, the Option 2 hero and its Arabic companion, the Option 3 furniture scene, and the Option 4 limestone hero and its phone companion. It also covers 18 priority-2 assets — two pallets on timber bases, drill and tyre cut-outs, the Option 3 lifestyle and product photographs, the warehouse live stills and the seller photographs — and 3 optional ones. Each brief has the nine requested fields and a prompt ready for ChatGPT Work. No stand-in was replaced and no reference crop was used. |
| Option 4 step numerals | 01 / 02 / 03 now use `--sc-step: #719D84`. This is the design's sage darkened within its own hue (146°, same saturation) from #B6CDC0 (1.68:1 on white) to 3.06:1, which meets the 3:1 rule for large text. Size, weight and placement are unchanged. |
| Option 2 vertical spacing | Changes apply at desktop widths (≥ 1200 px) only. Header rows go from 86 to 85 px and from 58 to 57 px. Section paddings of Recommended, Live auction, Bulk & Pallets, Featured sellers and the grades / How it works split are tightened toward the reference, and the grade list and footer rows follow the reference rhythm. The live preview is 3 px taller to match. No content is hidden, no font size changed and nothing is truncated. Page height at 1440 px is now **3780 px against 3789 px** in the reference (was 3861, +72). |
| Light-only home pages | On the new home pages of Options 2–4, the presentation bar replaces the sun / moon button with a static **Light only** indicator. It shows a sun, the words where the bar has room, and a tooltip and screen-reader text ("this home page design has no dark version"). Nothing suggests a dark theme there any more. Option 1's controls, and the toggle on the earlier-prototype screens, are unchanged. |
| Earlier-prototype screens | Every Browse, Product, Auction, Live auction, Seller and Components screen of Options 2–4 opens under a slim **Earlier prototype** note in English and Arabic. The note stays visible with the bar hidden and inside the device preview. The bar's page list separates Home (new design) from the earlier prototypes: on desktop with a divider, tooltips and screen-reader text, and in the tablet and phone page menu with "New design" and "Earlier prototypes" groups. On the start page, each Option 2–4 card marks Home as **New design** and adds a one-line note. The notice and the facts now say that Options 2–4 have new home pages only, and the how-to steps mention the labels. The client guide and README are updated. |
| Deployment statement | The header and §16 are corrected: pushes of this branch are published automatically by the connected Vercel project. |

Files changed in this update: `components/concept-a/premium-modern/{Header,sections,Footer}.jsx`, `components/concept-d/saudi-commerce/sections.jsx`, `styles/r3-saudi-commerce.css`, `components/shared/presentation/{PresentationBar,ConceptSelector,PrototypeNotice}.jsx` and `selector-copy.js`, `app/[lang]/concept-{a,c,d}/(round2)/layout.js`, the Option 2 desktop thumbnails (`public/images/concepts/a-{en,ar}-desktop-{960,1440}.webp`, recaptured because the header is 2 px shorter), README, `CLIENT_PREVIEW_GUIDE.md`, this report, `WORK_DESIGN_MISSING_ASSETS.md` and `docs/work-design-review/` (recaptured).

---

## 1. Option mapping

| Option | Slot | Name in the selector | Reference image |
|---|---|---|---|
| 1 | `concept-b` | Modern Commerce | unchanged |
| 2 | `concept-a` | Premium Modern Marketplace | `01_Premium_Modern_Khaznah_Charcoal_Brass.png` |
| 3 | `concept-c` | Visual Discovery Marketplace | `02_Visual_Discovery_Khaznah_Theme.png` |
| 4 | `concept-d` | Contemporary Saudi Commerce | `03_Contemporary_Saudi_Commerce.png` |

## 2. What was built

### Option 2 — Premium Modern Marketplace (`components/concept-a/premium-modern/`, `styles/r3-premium-modern.css`)
Warm ivory (#F8F7F3), charcoal (#302F2C) and restrained brass (#B28A43), 4–6 px corners, almost no shadow; Inter + Noto Sans Arabic.
In order: centred-logo masthead (navigation left, wishlist / account / cart right) → separate row with “All categories”, broad search and Riyadh + EN | العربية → panoramic room hero with an ivory inset copy card, brass Shop Buy Now and outline Explore auctions, and a pinned callout on the recliner that shows the **live** lot’s current bid → eight unboxed category cut-outs → four equal Buy Now cards with full-width charcoal Add to cart → Ending soon stone band (intro + three horizontal auction cards with red timers) → two recommended-product panels → split live auction (warehouse video preview left, current lot right) → two aligned Bulk & Pallets rows → five compact seller cards → trust strip → condition grades beside How Khaznah works → charcoal newsletter → light footer with Legal column.

### Option 3 — Visual Discovery Marketplace (`components/concept-c/visual-discovery/`, `styles/r3-visual-discovery.css`)
White with indigo (#183997), navy (#06213F) and gold (#E1A932), rounded 12–20 px imagery, pill navigation; Manrope display + Inter + Noto Sans Arabic.
Logo + pill search masthead with Riyadh, language, account and cart → Discover / shopping-modes row → **mosaic hero**: ivory copy tile with the handwritten “Good things find new homes.” and gold sketch strokes, a furniture scene with the overlapping tote card, stacked Electronics and Home & Kitchen photo tiles → eight outlined category pills (4 × 2) → **mixed-height product wall** (tall tote and mixer anchors, four compact centre cards, circular indigo cart buttons, white heart disks, coral Recommended badges, Buy Now / Recommended tabs) → full-width navy live banner **before** Ending soon → image-first Ending soon cards with coral countdown pills → seller discovery (two photographic promoted shops over three compact shops) → two differently tinted pallet panels (manifest first, then Bid now / Add to cart) → clarity row with grade chips → compact How it works → ivory newsletter with the two-colour heading → white footer with language and social links.

### Option 4 — Contemporary Saudi Commerce (`components/concept-d/saudi-commerce/`, `styles/r3-saudi-commerce.css`)
White with pale sage panels, forest green (#174B38) actions, dark ink headings and prices, blue text links; Inter + IBM Plex Sans Arabic.
Slim cream utility bar (Riyadh, Delivery & pickup, EN | العربية) → separate white navigation row (logo left, five modes centred, My account and Cart right) → **centred bilingual hero** (Arabic eyebrow over the English headline, segmented search: category select · query · green Search, then Shop Buy Now and Explore auctions) on a cream stage framed by products → pale-sage trust strip immediately below → **local category rail beside a 2 × 2 grid of horizontal Buy Now cards** → Recommended for you pair → **Ending soon rows beside one integrated live-auction scene** → five-row seller directory with three of each seller’s own products → two sage pallet panels (green action first, blue manifest link second) → oversized 01 / 02 / 03 How Khaznah works → seven-cell grade strip → one green newsletter + footer-links band → white brand / legal base.

### Shared behaviour (no visual structure) — `components/shared/r3/`
`home.jsx` (search suggestions and Browse hand-off, language switch, city state, add-to-cart, save toggle, newsletter validation, countdown text, card names, links to pages outside the preview), `drawers.jsx` (menu and cart drawers built on the existing `Drawer`), `popover.jsx`. Each option keeps its own markup and styling.

## 3. Reused functionality — and what was not invented

Reused: shared catalogue, sellers, grades and live-event simulation; cart, watchlist, toasts; search (`searchProducts`) and Browse filters (`search`, `category`, `tab`); product / auction / live / seller routes; language routing; presentation toolbar and selector.

Not invented: no discounts, crossed-out prices, ratings, “verified” badges, payment badges, guarantees or protection promises. Current bid and Buy Now prices keep their labels; grades are shown as grades. The Option 2 hero callout and the Option 3 / 4 live panels read the existing live simulation. The newsletter validates the address and shows the existing “You’re subscribed.” toast (a stub, as in production). Footer links to pages that are not part of the preview, and Option 3’s social icons (there are no confirmed social URLs in the data), show “Available soon” instead of a guessed destination — the same behaviour as Option 1’s footer. Option 3’s “Recommended” badges/tab are static picks from the catalogue, not personalisation.

## 4. Desktop comparison at 1440 CSS px (production build)

Full-page screenshots were compared with each reference scaled to 1440 px wide, section by section: the rectangles in `DESIGN_MEASUREMENTS.json` against the matching `data-ref` sections of the page. Δy = implementation top − reference top.

**Option 2** — page 3780 px vs 3789 px (−9; before the correction gate 3861 px, +72).
| Section | Δy | Δh |
|---|---|---|
| 01 masthead / 02 search row / 03 hero / 04 categories | 0 / 0 / +1 / 0 | 0 / 0 / 0 / +1 |
| 05 Buy Now / 06 Ending soon / 07 Recommended | +2 / +2 / +2 | 0 / 0 / −2 |
| 08 Live / 09 Pallets / 10 Sellers | 0 / −1 / −1 | −2 / +1 / −1 |
| 11 Trust / 12 Grades + How / 14 Newsletter / 15 Footer | −2 / −2 / −5 / −6 | 0 / −3 / −1 / −3 |

**Option 3** — page 3843 px vs 3836 px (+7).
| Section | Δy | Δh |
|---|---|---|
| 01 masthead / 02 modes / 03 mosaic hero | 0 / 0 / −6 | 0 / +1 / +3 |
| 04 pills / 05 product wall / 06 live banner | −26 / −31 / −4 | +25 / +26 / 0 |
| 07 Ending soon / 08 Sellers / 09 Pallets / 10 Clarity | −25 / −22 / −26 / −24 | +27 / +22 / +36 / +16 |
| 11 How it works / 12 Newsletter / 13 Footer | +7 / +6 / +3 | −1 / −2 / +3 |
(The implementation boxes include each section’s top padding, the reference rectangles start at the heading; headings themselves sit within a few pixels.)

**Option 4** — page 3835 px vs 3840 px (−5).
| Section | Δy | Δh |
|---|---|---|
| 01 utility / 02 navigation / 03 hero | 0 / 0 / +1 | 0 / +1 / 0 |
| 05 trust / 06 rail / 07 Buy Now floor | +7 / +3 / +3 | −4 / 0 / 0 |
| 09 Ending soon / 10 Live (section boxes) | +2 / +2 | +3 / +3 |
| Headings: Recommended / Sellers / Pallets / How / Grades | +3 / +4 / +5 / 0 / −2 | — |
| 15 green band / 16 white base | −6 / −9 | −3 / +4 |

Side-by-side images (reference | implementation) and the three full-page screenshots are in `docs/work-design-review/` (see §13).

## 5. Asset audit

EXACT = the same item exists · SUITABLE = close existing asset · MISSING = not in the library (stand-in used, reported here, no parity claimed). No screenshot of a reference was used as a background. Production briefs for every MISSING and SUITABLE photograph below are in `WORK_DESIGN_MISSING_ASSETS.md` (correction gate).

| Where | Needed | Used | Status |
|---|---|---|---|
| All | Bilingual 2026 logo | shared vector `Logo`, original colours, never mirrored | EXACT |
| All | Tote, desk, suitcase, mixer, coffee maker, lamp, car seat, split AC, washer | catalogue photos and cut-outs | EXACT |
| All | Tan leather recliner (live lot) | catalogue recliner (olive leather) | SUITABLE — colour differs |
| All | Pallets: cartons on timber pallets | `boxes-stack` photos (cartons, no pallet base) | SUITABLE |
| Opt 2 hero | Panoramic room: desk, lamp, tan recliner | catalogue room shot of the recliner, cropped; the callout points at the real recliner | MISSING — stand-in |
| Opt 2 categories | TV, fridge, pot, armchair, bag, drill, tyre, pallet | TV, fridge, Dutch oven, swivel chair, tote, **tool backpack** (no drill), **tyre inflator** (no tyre), cartons | SUITABLE |
| Opt 2 / 3 live preview | Warehouse video still | brand warehouse photograph (`warehouse-riyadh`) | SUITABLE |
| Opt 2 / 3 / 4 seller covers | Warehouses, rooms, shelving | brand warehouse photographs + catalogue room photos | SUITABLE |
| Opt 3 furniture scene | Tan recliner + walnut desk room | catalogue room photo with walnut desk, tan leather chair and lamp | MISSING — stand-in |
| Opt 3 Electronics tile | TV on a console | catalogue TV cut-out on a pale plate | SUITABLE |
| Opt 3 Home & Kitchen tile | Red coffee maker scene | catalogue coffee-maker lifestyle photo | SUITABLE |
| Opt 3 product wall / auctions | Products in tinted photo scenes | cut-outs on tinted plates | SUITABLE |
| Opt 3 handwritten phrase | Vector phrase + gold strokes | Caveat (EN) / Aref Ruqaa (AR) text + inline SVG strokes | MISSING vector — font treatment |
| Opt 3 social icons | Instagram, X, YouTube | inline SVG marks with accessible names | EXACT marks; no URLs (see §3) |
| Opt 4 hero | Limestone architectural photo with products and plants | CSS cream stage (arches, plinth, rug) + catalogue cut-outs of tote, leather chair, floor lamp, washer, suitcase; **no plants** (no asset) | MISSING — composed stand-in |
| Opt 4 live scene | Recliner in a warehouse aisle | brand warehouse aisle + current-lot cut-out (composite, as specified) | SUITABLE |
| Opt 4 seller thumbnails | Three products per seller | each seller’s **own** catalogue products (the reference shows some items under other sellers) | EXACT items where data allows |
| Icons | Line icons | lucide (existing family) | EXACT family |

Data-bound differences (shared records win over raster text): card names are the catalogue titles up to the variant (“Suede Tote with Chain Strap”; the full title is on the product page and in the link title); the kitchen pallet’s seller is Sahel Lifestyle (reference: Khazna Direct); prices use the Saudi Riyal sign from the shared formatter instead of “SAR”; countdowns and live bids are live values.

## 6. Fonts

All through `next/font/google` (the project’s existing mechanism; self-hosted at build time, no font binaries committed):
- **Inter** — Latin UI for Options 2, 3 (body) and 4 (already loaded).
- **Manrope** — Option 3 display headings (already loaded).
- **Noto Sans Arabic** — Arabic for Options 2 and 3 (added).
- **IBM Plex Sans Arabic** — Arabic for Option 4 (already loaded).
- **Caveat** / **Aref Ruqaa** (both SIL OFL) — only Option 3’s handwritten hero phrase in English / Arabic, as the handoff asks for a licensed handwritten treatment for that phrase only (added).
- Removed: Plus Jakarta Sans (only used by the retired Round 3B Option 4).

## 7. Responsive (1440 / 1024 / 768 / 390 / 320)

Automated matrix on the production build (`scripts/verify.mjs --pages home`, all four options × EN / AR × 1440 / 1024 / 768 / 390 / 320 = 40 page loads, axe included):

| Check | Result |
|---|---|
| Console errors | 0 |
| Failed requests / broken images | 0 / 0 |
| Horizontal overflow | 0 on Options 2, 3 and 4. One on **Option 1** (EN, 320 px, 12 px) — identical at the starting checkpoint `0166ba8`, so it is pre-existing and was left alone because Option 1 must not change. |
| axe serious / critical | **0** after the correction gate. (At `a2a83f1`, `color-contrast` flagged Option 4’s pale step numerals on 7 of its 10 loads; they now use #719D84, 3.06:1 — see §0.) |

Visual passes: every option was screenshotted and reviewed at all five widths in both languages during the build (the phone and tablet layouts follow each option’s handoff recommendations).

Each option keeps its own personality on small screens: Option 2 keeps the centred logo, stacks copy → room photo → docked callout, and turns the Ending soon band into a rail; Option 3 keeps the mosaic order (copy → furniture + tote → category tiles), a two-column product wall with tall anchors (one column below 380 px), a single navy live block (copy → video → lot → join) and rails for auctions and compact shops; Option 4 keeps the utility bar, the hero search as the main search (category select above query + Search), trust before retail, the category rail as a two-column directory above horizontal cards, auction rows as rows, and seller rows with their product strips.

## 8. Arabic / RTL

Covered by the matrix above (Arabic at all five widths: 0 overflow, 0 console errors), by the interaction run (every check repeated in Arabic on desktop and phone) and by visual review at 1440 and 390.

Rules applied: logos and photographs are never mirrored; prices and digits stay LTR (Riyal sign on the left, as in production); forward arrows flip; physical product icons, the cart and play icons do not. Option 2 mirrors the header around the centred logo and moves the copy card and callout to the logical start while the room photo stays put. Option 3 mirrors the mosaic at tile level (copy on the right, category tiles on the left), tilts the Arabic handwritten phrase the other way and sets it in Aref Ruqaa. Option 4 keeps its bilingual character by swapping the two hero lines — English eyebrow over the Arabic headline — moves the category rail to the right, puts Ending soon at the start (right) with the live scene on the left, and keeps the hero stage unflipped.

## 9. Interactions

Scripted on the production build for Options 2, 3 and 4 × EN / AR × desktop (1440) / phone (390): **202 checks, 0 failing.**
- Search: suggestions appear while typing (lots, categories, sellers); Enter opens Browse with the term (Option 4 also carries the chosen category from the segmented search).
- Category destinations open Browse filtered by category.
- Add to cart → header count → cart drawer lists the item → closes with Escape.
- Save / unsave (heart) toggles `aria-pressed` and the shared watchlist.
- Seller links open the storefront; Ending soon “Bid now” opens the auction; “Join live auction” opens the live page; “View manifest” opens the lot.
- Newsletter: invalid address shows the error; a valid one shows “You’re subscribed.” and clears the field.
- Grade guide opens; Option 3’s Buy Now / Recommended tabs switch the wall; footer links outside the preview show “Available soon”.
- Delivery city picker (header, utility bar or menu); phone menu drawer opens and closes with Escape; language switch EN ↔ AR (lang and dir follow).
- No horizontal overflow, no console errors, no failed requests in any run.

## 10. Presentation selector and toolbar

Correction gate: the bar shows a static “Light only” indicator on the new home pages, separates Home (new design) from the earlier-prototype screens, and the selector cards, notice and facts say that Options 2–4 have new home pages only (§0). Before that:

`data/concepts.js`: Options 2–4 renamed to **Premium Modern Marketplace**, **Visual Discovery Marketplace** and **Contemporary Saudi Commerce** (EN / AR), with new one-liners, design ideas, key characteristics and palettes. Option 1’s entry is byte-for-byte unchanged. The toolbar and page titles read the same data. Thumbnails for slots a, c and d (desktop 1440 / 960, mobile 780 / 390, EN / AR) were recaptured from the implemented pages on the production build with `scripts/capture-concepts.mjs`; Option 1’s thumbnails were not touched. Switching options is still a full page load (see §12).

## 11. Light only

The approved designs are light only, so these three home pages keep their light tokens whatever appearance is stored. Since the correction gate the presentation bar no longer offers the sun / moon button on them: it shows a static **Light only** indicator instead (§0). Option 1 and all Round 2 inner screens keep the working toggle. README and the client guide say so.

## 12. QA summary

Re-run in full on the final production build of the correction gate:

| Check | Result |
|---|---|
| `npm run lint` | pass (0 problems) |
| `npm run build` | pass (all routes prerendered) |
| Home matrix: 4 options × EN / AR × 1440 / 1024 / 768 / 390 / 320 (bar visible) | 40 loads: 0 console errors, 0 failed requests, 0 broken images, **0 axe serious / critical**; overflow only on Option 1 EN 320 px (pre-existing, §7) |
| Earlier-prototype screens of Options 2–4 (Browse, Product, Auction, Live auction, Seller, Components) × EN / AR × 1440 / 768 / 390 / 320, with the new note | 144 loads: 0 axe serious / critical, 0 console errors, 0 failed requests, 0 broken images. 9 horizontal overflows at 320 px on Live auction / Components screens are identical at `a2a83f1` (pre-existing Round 2 behaviour, left as is) |
| Extra axe pass: selector EN / AR at 1440 and 390, device preview of a prototype screen (EN / AR), light-only homes with the bar | 9 pages, 0 serious / critical |
| Homepage interactions (Options 2–4) | 202 checks, 0 failing (§9) |
| Option switching (full page load, same stylesheets, same computed styles and pixels as a fresh load; 9 pairs × EN / AR × desktop / phone) | 36 transitions, 0 failing — no style leakage between options |
| Other routes between options, language switch, theme toggle (Option 1 and prototype screens), **Light only indicator and no toggle on the three new home pages**, hide / show controls, device preview | 46 checks, 0 failing |
| Selector (names and one-liners match the data, every preview image loads and is the current file) | 24 checks, 0 failing |
| Option 1 regression gate | see §14 |

## 13. Screenshots

Recaptured on the correction-gate build:

- `docs/work-design-review/option-2-implemented-1440.png`
- `docs/work-design-review/option-3-implemented-1440.png`
- `docs/work-design-review/option-4-implemented-1440.png`
- `docs/work-design-review/option-2-reference-vs-implementation.jpg` (and `-3-`, `-4-`): reference left, implementation right, at half size.

## 14. Option 1 regression gate

**Correction gate — passed, against `a2a83f1`.** `git diff a2a83f1` is empty for `components/concept-b/`, the Option 1 routes and styles, `data/`, `lib/`, the shared UI and providers, `globals.css`, the root layout and Option 1’s thumbnails. The shared presentation components did change, so their Option 1 output was compared with a separate build of `a2a83f1`:
- 70 full-page Option 1 screenshots (7 routes × EN / AR × 1440 / 1024 / 768 / 390 / 320, frozen clock, seeded random numbers, photographs masked): **70 identical, 0 differing pixels**. No console errors.
- The presentation bar on every Option 1 route (7 routes × EN / AR × 1440 / 1280 / 1024 / 768 / 390 / 320, bar visible): **84 of 84 identical** in markup and pixels, including the working sun / moon button.
- The Option 1 card on the selector: identical markup in EN and AR.

**Original implementation — passed, against `0166ba8`.**
- Code: `git diff 0166ba8` is empty for `components/concept-b/`, the shared UI, providers and presentation components, `lib/`, and the product / UI data. Option 1’s selector entry and its thumbnails are byte-for-byte unchanged. Shared changes are additive only: two new breakpoints (`dt` 1200 px, `wd` 1440 px — no `container` class is used anywhere, so no existing utility changes), three new font variables (preload off), and the Options 2–4 entries in `data/concepts.js`.
- Pixels: the starting checkpoint was built separately (git worktree at `0166ba8`) and served next to the final build. 7 Option 1 routes (Home, Browse, Product, Auction, Live auction, Seller, Components) × EN / AR × 1440 / 1024 / 768 / 390 / 320 = 70 full-page screenshots per build, with a frozen clock, seeded random numbers and photographs masked (their boxes are still compared). Result: 60 identical; 10 differ by 5–13 pixels, all at 390 px, in two spots — the top edge of the sticky phone search bar and a 1–2 px line on the live-auction page. Comparing the checkpoint with itself the same way gives the same kind of 5–13 pixel differences in the same two spots (5 of 70), so this is capture noise, not a change. No Option 1 console errors.

## 15. Remaining visual differences (honest list)

**Option 2**
- Hero photograph: catalogue room shot of an olive recliner instead of the panoramic room with a tan recliner, desk and lamp; the crop is tighter and warmer-grey.
- Recliner colour everywhere (olive, not tan); pallets without timber bases; drill → tool backpack and tyre → tyre inflator in the category row; fridge is black, TV screen is the catalogue’s blue wave.
- Vertical rhythm now matches the reference to within a few pixels (page 3780 vs 3789 px; every section within −6 / +2 px). Seller names and grade definitions still wrap slightly differently in Inter, and the grade definitions use the shared production wording.
- Seller covers are substitutes; the kitchen pallet shows its real seller (Sahel Lifestyle).

**Option 3**
- Furniture scene is a walnut-desk room with a tan desk chair, not the recliner scene; Electronics is a TV cut-out on a plate, not a TV on a console; product-wall and auction images sit on tinted plates rather than in photographed scenes.
- Live banner preview shows the brand warehouse (Riyadh skyline) rather than a warehouse of TVs; the lot is the olive recliner.
- Handwritten phrase is a font (Caveat) with SVG strokes, not the original lettering.
- Category pills and the wall run ~25 px taller than the reference; social icons do not link anywhere yet.

**Option 4**
- Hero: a composed cream stage with arches and product cut-outs instead of the photographed limestone interior; no plants; the chair is the catalogue swivel chair (tan leather) and the lamp a tripod floor lamp.
- Live scene: brand warehouse aisle (with the Riyadh skyline through the door and a forklift) and the olive recliner, instead of a tan recliner in a shelving aisle.
- Seller rows show each seller’s own products, so some thumbnails differ from the picture (e.g. Khazna Direct shows the Dutch oven, not the microwave, which belongs to Red Sea Trading).
- Grade strip colours follow the picture (B blue, C amber), which differs from the card pills (B amber, C pink) — the reference itself uses both.
- The 01 / 02 / 03 step numerals are a darker sage (#719D84) than the picture’s pale #B6CDC0, so that they meet the large-text contrast rule (correction gate).

**All three**
- Titles are longer than the raster where the catalogue title is longer; prices use the Riyal sign; timers show live values.
- Only the home pages use the new designs. The other screens are the Round 2 prototypes, now labelled “Earlier prototype” in the preview (§0).

## 16. Production untouched — and what is published

Only files under `design-preview/`, the preview’s docs, this report, `WORK_DESIGN_MISSING_ASSETS.md` and `docs/work-design-review/` changed. No production frontend, backend, API, admin, seller-dashboard or warehouse code was modified.

**Correction to the earlier statement “nothing was deployed”.** The repository has no Vercel configuration file, but this branch is connected to the Vercel project `khaznah-auction-web-app` (team `mohammad-hossains-projects`). That project builds and publishes pushed commits automatically. GitHub holds 13 Vercel deployment records for commits of this branch, from the initial commit `6374466` (25 Sep 2026, the only failed one) to `a2a83f1` (28 Sep 2026, 02:35 UTC, successful). All of them are under that project’s “Production” environment, on `*.vercel.app` addresses. The commit that adds this section will be published the same way when it is pushed. No deployment was made by hand, no Vercel or domain setting was changed, and the real Khaznah production domain was not connected or used.

## 17. Next step

Missing-asset production (`WORK_DESIGN_MISSING_ASSETS.md`) → asset integration on the three home pages → final homepage visual approval → inner-page implementation.
