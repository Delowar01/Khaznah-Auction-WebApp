# Priority 2 asset integration — Options 2, 3 and 4 (home pages only)

The 25 Priority 2 images (B1–B18, with B7a–f and B8a–c) from
`KHAZNAH_PRIORITY_2_ASSETS_part_1.zip` and `_part_2.zip` now replace their
stand-ins on the new home pages of Options 2–4 in the isolated
`design-preview/` app.

**These are temporary dummy / preview images, not final photography.** They
were accepted under the dummy-asset rule: an image passes if it is
technically usable and broadly shows the right subject.

This was an asset integration only:

- No section was redesigned and no image was generated, edited or replaced by a substitute.
- **Option 1 (Modern Commerce) is unchanged.**
- The shared catalogue records and photographs, the Priority 1 assets and the earlier-prototype inner screens are unchanged.

---

## 1. Starting commit

`1dc5700` on `claude/magical-faraday-fne4kq`. Before editing I confirmed:

- the branch was checked out;
- HEAD matched `origin/claude/magical-faraday-fne4kq`;
- the working tree was clean.

The branch had not advanced since the last report.

## 2. Final commit

The commit that adds this report. Its hash is given in the hand-off message
and in `git log`.

## 3. ZIP validation results

| Check | Result |
|---|---|
| Archives | Part 1 has 14 images (B1–B8b). Part 2 has 11 images (B8c–B18), `PRIORITY_2_ASSET_MANIFEST.json`, `PRIORITY_2_ASSET_MANIFEST.md` and `PRODUCTION_NOTES_PRIORITY_2.md`. `unzip -t`: no errors in either part. |
| File count | 25 PNG files. The manifest lists 25 (`image_count` 25). None is missing and there are no extra files. |
| B-number mapping | Every file name starts with its B ID, and the manifest's `b_id` for each file agrees. |
| Integrity | Every image decoded in full (sharp, `failOn: error`). No file is truncated or corrupt. |
| SHA-256 | 25 of 25 match the manifest. Byte sizes also match: 25 of 25. |
| Dimensions | 25 of 25 match the manifest's `actual_dimensions`. |
| Colour | All 8-bit sRGB with an embedded ICC profile. B1–B4 are RGBA; the other 21 are RGB, as the manifest states. |
| Cut-out alpha (B1–B4) | See the next table. |
| Edge check | Each cut-out was flattened on a dark (#1d2630) and a light (#edf4f0) ground at 100 %: no halo, fringe or matte colour on either. The tyre's openings between the spokes are real transparency, as the manifest says. |
| Visual subject check | Each image broadly shows the subject its brief asks for. No people, logos, readable text or UI were found. |

Cut-out alpha, B1–B4:

| | Transparent | Corner alpha | Opaque pixels on the outer edge | Margin per side | Partial-alpha (antialiased) pixels |
|---|---|---|---|---|---|
| B1 | 31 % | 0, 0, 0, 0 | 0 | 2.05 % / 2.06 % | 11,275 |
| B2 | 31 % | 0, 0, 0, 0 | 0 | 2.03 % | 10,920 |
| B3 | 58 % | 0, 0, 0, 0 | 0 | 2.04 % / 2.05 % | 9,146 |
| B4 | 26 % | 0, 0, 0, 0 | 0 | 2.04 % / 2.07 % | 10,483 |

Each partial-alpha count equals the figure in the manifest. No alpha cleanup
was needed, so none was done.

The masters are kept byte-for-byte in `design-preview/assets-src/priority-2/`,
together with the two manifests and the production notes.

## 4. Per-asset PASS / KEEP CURRENT STAND-IN

| ID | Filename | Technical status | Intended slot | Action |
|---|---|---|---|---|
| B1 | `B1_kz-shared-pallet-electronics-v1.png` | 1418 × 1017 RGBA, real alpha, SHA-256 OK | Electronics pallet: Bulk & Pallets in Options 2, 3 and 4; Option 2 Bulk & Pallets category; Option 4 Khazna Direct thumbnail | PASS — integrated |
| B2 | `B2_kz-shared-pallet-kitchen-v1.png` | 1430 × 1035 RGBA, real alpha, SHA-256 OK | Kitchen pallet: Bulk & Pallets in Options 2, 3 and 4 | PASS — integrated |
| B3 | `B3_kz-o2-tools-drill-v1.png` | 1174 × 1220 RGBA, real alpha, SHA-256 OK | Option 2 category row, Tools & DIY | PASS — integrated |
| B4 | `B4_kz-o2-automotive-tyre-v1.png` | 1016 × 1225 RGBA, real alpha, SHA-256 OK | Option 2 category row, Automotive | PASS — integrated |
| B5 | `B5_kz-o3-hero-electronics-tv-v1.png` | 1664 × 936 RGB (16:9), SHA-256 OK | Option 3 hero, Electronics tile | PASS — integrated |
| B6 | `B6_kz-o3-hero-kitchen-coffee-v1.png` | 1536 × 1024 RGB (3:2), SHA-256 OK | Option 3 hero, Home & Kitchen tile | PASS — integrated |
| B7a | `B7a_kz-o3-wall-suede-tote-v1.png` | 1086 × 1448 RGB (3:4), SHA-256 OK | Option 3 product wall, Suede Tote (tall card) | PASS — integrated |
| B7b | `B7b_kz-o3-wall-writing-desk-v1.png` | 1615 × 969 RGB (5:3), SHA-256 OK | Option 3 product wall, Hairpin-Leg Writing Desk | PASS — integrated |
| B7c | `B7c_kz-o3-wall-spinner-suitcase-v1.png` | 1615 × 969 RGB (5:3), SHA-256 OK | Option 3 product wall, Hardside Spinner Suitcase | PASS — integrated |
| B7d | `B7d_kz-o3-wall-coffee-maker-v1.png` | 1615 × 969 RGB (5:3), SHA-256 OK | Option 3 product wall, Capsule Coffee Maker | PASS — integrated |
| B7e | `B7e_kz-o3-wall-task-lamp-v1.png` | 1615 × 969 RGB (5:3), SHA-256 OK | Option 3 product wall, Adjustable Task Lamp | PASS — integrated |
| B7f | `B7f_kz-o3-wall-stand-mixer-v1.png` | 1086 × 1448 RGB (3:4), SHA-256 OK | Option 3 product wall, Stand Mixer (tall card) | PASS — integrated |
| B8a | `B8a_kz-o3-ending-car-seat-v1.png` | 1774 × 887 RGB (2:1), SHA-256 OK | Option 3 Ending soon, car seat cover | PASS — integrated |
| B8b | `B8b_kz-o3-ending-split-ac-v1.png` | 1774 × 887 RGB (2:1), SHA-256 OK | Option 3 Ending soon, split AC | PASS — integrated |
| B8c | `B8c_kz-o3-ending-washing-machine-v1.png` | 1774 × 887 RGB (2:1), SHA-256 OK | Option 3 Ending soon, washing machine | PASS — integrated |
| B9 | `B9_kz-shared-live-warehouse-aisle-v1.png` | 1536 × 1024 RGB (3:2), SHA-256 OK | Option 2 live still; Option 4 live scene behind A2 | PASS — integrated |
| B10 | `B10_kz-o3-live-electronics-warehouse-v1.png` | 1536 × 1024 RGB (3:2), SHA-256 OK | Option 3 live banner still | PASS — integrated |
| B11 | `B11_kz-o2-seller-khazna-racking-v1.png` | 1120 × 1400 RGB (4:5), SHA-256 OK | Option 2 seller card, Khazna Direct | PASS — integrated |
| B12 | `B12_kz-o3-seller-khazna-cartons-v1.png` | 1536 × 1024 RGB (3:2), SHA-256 OK | Option 3 seller card, Khazna Direct | PASS — integrated |
| B13 | `B13_kz-o4-seller-khazna-building-v1.png` | 2172 × 724 RGB (3:1), SHA-256 OK | Option 4 seller row, Khazna Direct | PASS — integrated |
| B14 | `B14_kz-shared-seller-rawabi-living-v1.png` | 2172 × 724 RGB (3:1), SHA-256 OK | Rawabi Home Outlet: Option 2 card, Option 3 promoted banner, Option 4 row | PASS — integrated |
| B15 | `B15_kz-shared-seller-redsea-electronics-v1.png` | 2172 × 724 RGB (3:1), SHA-256 OK | Red Sea Trading Co.: Option 2 card, Option 3 promoted banner, Option 4 row | PASS — integrated |
| B16 | `B16_kz-o2-seller-daralmajd-showroom-v1.png` | 1120 × 1400 RGB (4:5), SHA-256 OK | Option 2 seller card, Dar Al Majd Wholesale | PASS — integrated |
| B17 | `B17_kz-shared-seller-daralmajd-forklift-v1.png` | 1980 × 792 RGB (5:2), SHA-256 OK | Dar Al Majd Wholesale: Option 3 card, Option 4 row | PASS — integrated |
| B18 | `B18_kz-shared-seller-sahel-living-dining-v1.png` | 2172 × 724 RGB (3:1), SHA-256 OK | Sahel Lifestyle: Option 2 card, Option 3 card, Option 4 row | PASS — integrated |

25 PASS, 0 KEEP CURRENT STAND-IN.

## 5. Asset-to-slot mapping

The new images have new homepage-only keys: `PRIORITY_2` in
`design-preview/components/shared/r3/work-media-p2.js`. Only the three home
data files read them.

The shared product records keep their own images, so the same products still
show their catalogue pictures everywhere else. That includes:

- Option 1;
- the earlier-prototype screens;
- search suggestions;
- other cards on the same home page.

| Option | Section | Slot | Asset | Replaces (stand-in) |
|---|---|---|---|---|
| 2 | 04 Category row | Tools & DIY | B3 | `tool-backpack` cut-out |
| 2 | 04 Category row | Automotive | B4 | `tyre-inflator` cut-out |
| 2 | 04 Category row | Bulk & Pallets | B1 | `boxes-stack` cut-out |
| 2 | 08 Live auction | Video still | B9 | brand photo `warehouse-riyadh` (170 % zoom) |
| 2 | 09 Bulk & Pallets | Electronics pallet row | B1 | `boxes-stack` cut-out |
| 2 | 09 Bulk & Pallets | Kitchen pallet row | B2 | `boxes-stack` photo 1 (cartons on white) |
| 2 | 10 Featured sellers | Khazna Direct | B11 | `warehouse-riyadh` crop |
| 2 | 10 Featured sellers | Rawabi Home Outlet | B14 | `swivel-chair` photo 2 |
| 2 | 10 Featured sellers | Red Sea Trading Co. | B15 | brand photo `warehouse-floor` |
| 2 | 10 Featured sellers | Dar Al Majd Wholesale | B16 | `washer-front` studio shot on a plate |
| 2 | 10 Featured sellers | Sahel Lifestyle | B18 | `floor-lamp` photo 1 |
| 3 | 03 Hero mosaic | Electronics tile | B5 | `tv-43` cut-out on a pale plate |
| 3 | 03 Hero mosaic | Home & Kitchen tile | B6 | `capsule-coffee` photo 1 |
| 3 | 05 Finds worth a closer look (Buy Now tab) | Suede tote, writing desk, suitcase, coffee maker, task lamp, stand mixer | B7a, B7b, B7c, B7d, B7e, B7f (matched by catalogue slug) | catalogue cut-outs on tinted plates |
| 3 | 06 Live banner | Video still | B10 | `warehouse-riyadh` (178 % zoom) |
| 3 | 07 Ending soon | Car seat cover, split AC, washing machine | B8a, B8b, B8c (matched by slug) | catalogue cut-outs on tinted plates |
| 3 | 08 Sellers | Rawabi promoted banner | B14 | `floor-lamp` photo 1 |
| 3 | 08 Sellers | Red Sea promoted banner | B15 | `warehouse-floor` |
| 3 | 08 Sellers | Khazna Direct card | B12 | `boxes-stack` photo 1 on a plate |
| 3 | 08 Sellers | Dar Al Majd card | B17 | `warehouse-riyadh` (230 % zoom) |
| 3 | 08 Sellers | Sahel Lifestyle card | B18 | `dining-chairs` photo 1 |
| 3 | 09 Bulk & Pallets | Ivory and blue-grey panels | B1, B2 | `boxes-stack` cut-out and photo 1 |
| 4 | 10 Live scene | Background behind the A2 recliner | B9 | `warehouse-riyadh` (182 % zoom) |
| 4 | 11 Seller directory | Khazna Direct row cover | B13 | `warehouse-riyadh` (400 % zoom) |
| 4 | 11 Seller directory | Khazna Direct pallet thumbnail | B1 | `boxes-stack` cut-out |
| 4 | 11 Seller directory | Rawabi row | B14 | `floor-lamp` photo 1 |
| 4 | 11 Seller directory | Red Sea row | B15 | `warehouse-floor` |
| 4 | 11 Seller directory | Dar Al Majd row | B17 | `warehouse-riyadh` (230 % zoom) |
| 4 | 11 Seller directory | Sahel Lifestyle row | B18 | `dining-chairs` photo 1 |
| 4 | 12 Bulk & Pallets | Two sage panels | B1, B2 | `boxes-stack` cut-out and photo 1 |

Notes:

- The Option 3 "Recommended" tab of the product wall is not part of B7 and keeps its catalogue cut-outs.
- Ending soon picks its photograph by product slug. A different lot would fall back to its catalogue cut-out, so a wrong photograph cannot appear.
- Nothing is mirrored for Arabic. The drill's chuck points left in both languages.

## 6. Files changed

New:

- `design-preview/assets-src/priority-2/` (not served):
  - the 25 masters;
  - `PRIORITY_2_ASSET_MANIFEST.json`, `PRIORITY_2_ASSET_MANIFEST.md`, `PRODUCTION_NOTES_PRIORITY_2.md`;
  - the generated `DERIVATIVES.md` (source → derivative table).
- `design-preview/public/images/work/priority-2/`: 86 WebP derivatives.
- `design-preview/scripts/process-priority-2-assets.mjs`: the derivative pipeline.
- `design-preview/components/shared/r3/work-media-p2.js`: the `PRIORITY_2` image keys.
- `PRIORITY_2_ASSET_INTEGRATION_REPORT.md`: this file.

Changed, Option 2 (`design-preview/components/concept-a/premium-modern/`):

- `data.js`:
  - category art for Tools & DIY, Automotive and Bulk & Pallets;
  - `PALLETS` rows now carry their image;
  - seller covers and focus;
  - `LIVE_STREAM` is now `{ image, focus }`.
- `sections.jsx`:
  - the live still uses the full frame (`inset-0`, cover, focus from data) instead of a 170 % zoom;
  - `sizes` matches its real width;
  - the pallet row takes the row's image.

Changed, Option 3 (`design-preview/components/concept-c/visual-discovery/`):

- `data.js`:
  - B5/B6 hero tiles with focus;
  - wall rows and Ending soon rows get `photo` (by slug);
  - `LIVE_STILL`;
  - seller covers and focus;
  - pallet images.
- `sections.jsx`:
  - a wall card or Ending soon card with a `photo` draws it full-bleed (cover) and otherwise keeps the cut-out on its plate;
  - the live still uses the full frame instead of a 150–178 % zoom;
  - the pallet panel takes the row's image.
- `Hero.jsx`: the Electronics tile is drawn as a photograph (cover + focus) instead of a cut-out on a plate.

Changed, Option 4 (`design-preview/components/concept-d/saudi-commerce/`):

- `data.js`:
  - `LIVE_SCENE` is B9 with focus and no zoom;
  - seller covers and focus;
  - a `thumbs` override puts B1 on Khazna Direct's pallet thumbnail;
  - pallet images.
- `sections.jsx`:
  - the live-scene background uses the full frame and a matching `sizes`;
  - the seller thumbnails accept the override;
  - the pallet panel takes the row's image.

Selector thumbnails:

- `design-preview/public/images/concepts/{a,c,d}-{en,ar}-{desktop-960,desktop-1440,mobile-390,mobile-780}.webp` were recaptured with `scripts/capture-concepts.mjs --concepts a,c,d`.
- 12 files changed:
  - the Option 2 and Option 3 desktop thumbnails, whose first screen now shows Priority 2 images (category row, hero tiles);
  - the Option 4 phone thumbnails, which only pick up the shorter phone search placeholder approved in `1dc5700`.
- The other 12 came out byte-identical.
- Option 1's (`b-*`) were not touched.

Docs:

- `docs/work-design-review/option-{2,3,4}-implemented-1440.png` and `-ar.png`: recaptured.
- `option-{2,3,4}-reference-vs-implementation.jpg` and `option-3-responsive-heroes.jpg`: recaptured. The Options 2 and 4 hero sheets are unchanged, because their heroes did not change.
- `docs/priority-2-integration/option-{2,3,4}-priority-2-slots.jpg` (new): every Priority 2 slot at 1440, 1024, 768, 390 and 320 px, in English and Arabic.
- `WORK_DESIGN_MISSING_ASSETS.md`: the status line.
- `ROUND_WORK_DESIGN_IMPLEMENTATION_REPORT.md`: two "since then" notes.

Nothing else changed. In particular, git diff against `1dc5700` is empty for:

- `components/concept-b/` (Option 1);
- the shared UI, providers and presentation components;
- `lib/`, `data/` (catalogue, products, sellers, live event), `styles/` and `app/`;
- the catalogue and brand images;
- `assets-src/priority-1/` and `public/images/work/` (Priority 1).

## 7. Optimization details

`scripts/process-priority-2-assets.mjs` follows the Priority 1 approach:

- It uses sharp and outputs WebP.
- It checks every master's SHA-256 against the manifest and its alpha against the manifest's `transparency`.
- It throws instead of upscaling.
- The widest file of each asset is the master at its own size; nothing is enlarged.
- It writes the derivatives and `DERIVATIVES.md`.

| Settings | Value |
|---|---|
| Photographs | WebP quality 82, effort 6, smart subsampling (as Priority 1) |
| Cut-outs B1–B4 | WebP quality 88 with a lossless alpha plane (`alphaQuality 100`), as A2. Not trimmed: the delivered ~2 % transparent margin is kept. |
| Output | 86 files, 5.5 MB in total, in `public/images/work/priority-2/` |
| Masters | 25 PNG files, 42.6 MB, in `assets-src/priority-2/` (not served) |
| Fidelity | 35.6–45.9 dB PSNR, each full-size WebP against its master. The lowest is B5, whose screen is a busy wave texture. |

Widths are chosen from each slot's largest rendered size at 2×. With
`object-fit: cover`, a wide master is drawn wider than its box, so the seller
and hero sets start at the width their narrowest crop actually paints.

| ID | Widths (px) | Total |
|---|---|---|
| B1 / B2 | 300 · 600 · 900 · master | 282 / 262 KB |
| B3 / B4 | 240 · 480 · master | 162 / 234 KB |
| B5 | 832 · 1248 · 1664 | 463 KB |
| B6 | 768 · 1152 · 1536 | 127 KB |
| B7a / B7f | 400 · 700 · 1086 | 138 / 67 KB |
| B7b–e | 400 · 700 · 1000 · 1615 | 37–83 KB each |
| B8a–c | 480 · 880 · 1320 · 1774 | 40–173 KB each |
| B9 / B10 | 640 · 960 · 1280 · 1536 | 614 / 521 KB |
| B11 / B16 | 240 · 480 · 1120 | 317 / 99 KB |
| B12 | 480 · 960 · 1536 | 100 KB |
| B13 / B14 / B15 / B18 | 800 · 1440 · 2172 | 242–395 KB each |
| B17 | 660 · 1320 · 1980 | 363 KB |

Loading:

- Every slot uses `srcset`, so a page downloads one file per image.
- The Option 2 live still and the Option 4 live scene got a `sizes` value that matches their new full-frame box. The old values were written for the 170 % and 182 % zoom. The Option 3 still's existing `sizes` already fits its frame and was kept.
- Every slot keeps its existing loading attributes (lazy, as for the stand-ins). The slots in the first viewport still load at once: the Option 2 category row and the Option 3 hero tiles.

## 8. Responsive crop decisions

Only `object-fit` and `object-position` are used: one focus value per slot, no
custom crops and no extra variants. Cut-outs use `contain`, unchanged from
their stand-ins. That includes the slots' existing `mix-blend-mode: multiply`
on near-white panels, which leaves the transparent areas showing the panel.
No shadows were added. The Option 2 category row keeps its existing CSS drop
shadow, and the pallet rows keep none.

| Slot | Focus | Why |
|---|---|---|
| Option 2 live still (B9) | 55 % 55 % | Keeps the aisle's vanishing point and the calm centre under the play button. The dark lower third carries the title. |
| Option 4 live scene (B9) | 55 % 55 % | Same aisle. The A2 recliner keeps its approved Priority 1 box and stands on the clear floor at every width; on phones the portrait crop is centred on the aisle. |
| Option 3 Electronics tile (B5) | 60 % 18 % | The notes suggested 60 % 48 %, which cut the top of the TV in the wide tablet tiles (2.6–3 : 1 between 1024 and 1199 px). At 18 % the whole TV shows at 1024 px. Up to 1199 px its top edge stays in view, and only the bottom of the screen and the stand fall below the frame. Desktop (1.65 : 1) crops only sideways. |
| Option 3 Home & Kitchen tile (B6) | 68 % 20 % | The notes suggested 68 % 50 %, which cut the coffee maker's top (brew head and buttons) in the wide tablet tiles. At 20 % the whole machine shows at 1024 px. At 1100–1199 px only its drip-tray base falls below the frame. At 1440 px (1.49 : 1) there is no vertical crop. |
| Option 3 wall — tote (B7a) | 50 % 55 % | In the square tablet card (768–1199 px) the bag spans almost exactly the visible height. 55 % keeps the handle tips and the base. |
| Option 3 wall — other five (B7b–f) | centre | The products sit in the middle of the frame. Feet, wheels and lamp base are whole from 320 to 1440 px. |
| Option 3 Ending soon (B8a–c) | centre | The cards are 2.09 : 1 for 2 : 1 masters, so only about 4 % is trimmed. The top band stays clear for the countdown and the heart. |
| Option 3 live banner (B10) | centre | Calm centre for the play button. The 1.16 : 1 tablet frame keeps the aisle and the TVs on both sides. |
| Option 2 seller covers (0.9 : 1) | B11 50 % 55 % · B14 85 % 55 % (armchair) · B15 23 % 50 % (racking) · B16 centre (washer) · B18 27 % 55 % (sofa) | As in the production notes |
| Option 3 promoted banners (2.8 : 1) | B14 and B15 centre | The text sits at the start side over the existing gradient, and the Arabic text sits at the other side. Both outer thirds stay readable (see §9). |
| Option 3 compact cards (1.55 : 1) | B12 centre · B17 centre (forklift) · B18 76 % 50 % (dining area) | As in the production notes |
| Option 4 seller rows (2.4 : 1) | B13 centre (glass entrance) · B14 50 % 55 % · B15 centre · B17 centre · B18 35 % 50 % (sofa and olive tree) | As in the production notes |

The evidence sheets in `docs/priority-2-integration/` show every slot at 1440,
1024, 768, 390 and 320 px in both languages.

## 9. QA results

All checks ran against a production build (`next build` + `next start`).
The baseline was `1dc5700`, built separately from a git worktree and served
next to it.

The B5 and B6 focus values (§8) were tuned last, after the gates below. That
change is two `object-position` strings in Option 3's `data.js`. After it, the
Option 3 home was checked again:

- rebuild;
- structure gate: 10 pages, 0 problems;
- `verify.mjs`: 10 checks, 0 issues;
- page loads at 1199, 1100, 1024, 768, 390 and 320 px in both languages: all clean;
- `option-3-responsive-heroes.jpg` and the Option 3 slot sheet were recaptured;
- the Option 3 selector thumbnails were recaptured and came out byte-identical.

| Check | Result |
|---|---|
| Lint | `npx eslint` (whole app): clean. |
| Production build | `next build`: compiled, 335 static pages, no errors or warnings. |
| Page loads with every image awaited | Options 2–4 × EN / AR × 1440 / 1024 / 768 / 390 / 320 = 30 loads (lazy images made eager, each section waited until its images had loaded and decoded). Results: 0 broken images, 0 images left loading, 0 placeholder icons, 0 console errors, 0 failed requests, 0 horizontal overflow. Priority 2 images per page: Option 2 11, Option 3 19, Option 4 9. |
| Accessibility / overflow / console / requests (`scripts/verify.mjs`, axe serious + critical) | The three homes × EN / AR × 1440 / 1024 / 768 / 390 / 320: 30 checks, 0 issues. |
| Structure and geometry against `1dc5700` | Frozen clock; every element's box, order and own text compared; the three homes × EN / AR × the five widths = 30 pages, 0 problems. See the bullets below the table. |
| Image requests against `1dc5700` | The three homes × EN / AR × 1440 / 390: 0 failed or broken requests. The only new files are Priority 2 derivatives. See the bullets below the table. |
| Image weight per page (EN) | Each page downloads less than before. Option 2: 1066 → 856 KB at 1440, 782 → 668 KB at 390. Option 3: 788 → 588 KB and 782 → 538 KB. Option 4: 1232 → 1191 KB and 1189 → 1148 KB. |
| Overlay readability | White text over photographs: the background under each text box was measured with the text hidden, and the contrast of white against it calculated (median / 90th percentile of the box). All values are equal to or better than at `1dc5700`. See the bullets below the table. |
| Concept switching (`.scratch/r3b/switch.mjs`) | 9 option pairs × EN / AR × desktop / mobile = 36 transitions, 0 failing. Each is a full document load with the same stylesheets, computed styles, boxes and pixels as a fresh load. |
| Selector | 24 checks, 0 failing: names, one-liners, every preview image loads, and each card shows its current thumbnails. |
| Option 4 search panel | The suggestion panel opens fully visible and on top at 1440, 1280, 1200, 1024, 768, 390 and 320 px (EN and AR). Hit tests at 1200, 1250 and 1280 px find the list at all five sample points in both languages. |
| Visual review | Every Priority 2 slot at the five widths in both languages (the sheets in `docs/priority-2-integration/`). |

Structure and geometry, in detail:

- All non-image elements are identical: Option 2 has 843 per page, Option 3 873, Option 4 902–903 (as at `1dc5700`).
- Page heights are identical, so there are no duplicate or extra layers.
- Images changed only where a Priority 2 file was placed.
- An image box changed only where an old zoom or plate hack was removed. Each of these images now fills its frame exactly:
  - the Option 2 live still;
  - Option 3: the Electronics tile, the live still and the Dar Al Majd card;
  - Option 4: the live scene and the Khazna Direct and Dar Al Majd row covers.

Image requests, in detail. The stand-ins that are no longer requested:

- the brand photographs `warehouse-riyadh` and `warehouse-floor`;
- `boxes-stack`;
- the tool-backpack and tyre-inflator cut-outs;
- the old seller covers;
- in Option 3, the wall and Ending soon cut-outs and the old hero tile pictures.

Overlay readability, in detail (white-text contrast, median / 90th percentile):

| Overlay | Now | At `1dc5700` |
|---|---|---|
| Option 2 live still (title and host) | median ≥ 11.2 : 1, 90th ≥ 6.3 : 1 | 3.1 : 1 at the 90th percentile |
| Option 4 live scene (title, host, current bid) | median ≥ 6.0 : 1, 90th ≥ 4.25 : 1 | median 5.7 : 1, 90th 2.9 : 1 |
| Option 3 Rawabi banner title | median 4.8–7.6 : 1 | 2.7–4.9 : 1 |
| Option 3 Red Sea banner text | median 8.9–12.3 : 1 | — (the old photograph was almost black) |

Observed but not in scope (unchanged since `1dc5700`, layout rather than imagery):

- At 320 px the Option 2 live-still play button overlaps the two-line event title.
- At 320 px in Arabic, the Option 2 "Join live auction" label is wider than its button.
- Both look identical on the baseline build. They were left as they are, because this task excludes layout changes.

## 10. Option 1 regression

- **Code.** `git diff 1dc5700` is empty for:
  - `components/concept-b/`;
  - the shared UI, providers and presentation components;
  - `lib/`, `data/`, `styles/` and `app/`;
  - Option 1's selector thumbnails (`b-*`).

  The new keys are imported only by the Options 2–4 home data files.
- **Pixels.**
  - Setup: 7 Option 1 routes (Home, Browse, Product, Auction, Live auction, Seller, Components) × EN / AR × 1440 / 1024 / 768 / 390 / 320 = 70 full-page screenshots per build, frozen clock, compared with the `1dc5700` build.
  - First pass: 69 identical. One (Auction, English, 320 px) differed by 8 pixels (0.000 %) at the antialiased corner of a button.
  - Re-check: that shot was re-run three times and was identical each time. A baseline-against-baseline control of it was also identical.
  - Result: **70 of 70 identical.**
- **Presentation bar** on every Option 1 route (7 routes × EN / AR × 1440 / 1280 / 1024 / 768 / 390 / 320): **84 of 84 identical** in markup and pixels.
- **Selector:** the Option 1 card's markup is identical in English and Arabic.
- **Earlier-prototype inner screens of Options 2–4** (Browse, Product, Auction, Live auction, Seller, Components × EN / AR × 1440 / 390, against `1dc5700`): **72 of 72 identical** (24 per option).

## 11. Priority 1 regression

- **Files.** `assets-src/priority-1/`, the Priority 1 files in `public/images/work/` and `components/shared/r3/work-media.js` are unchanged (`git diff` empty). The new derivatives live in their own folder, `public/images/work/priority-2/`.
- **Placements.** In the structure gate (30 home pages), every Priority 1 image has the same file and the same box as at `1dc5700`:
  - A3 / A4 in the Option 2 hero;
  - A5 in the Option 3 mosaic;
  - A6 / A7 in the Option 4 hero;
  - the A2 lot cut-out on all three pages.
- **Asset check** (`.scratch/p1/assets.mjs`, the three homes × EN / AR × 1920 / 1440 / 1280 / 1024 / 768 / 390 / 320): **168 of 168 pass**. Each hero shows only its approved photograph, one composition per device. A2 loads for the live lot. No stand-in or olive-recliner file is requested and no request fails.
- **Option 4 live scene.** B9 now sits behind A2. A2 keeps its approved box (position and size) at every width, and the layer order is unchanged: photograph → A2 → gradient → text.
- **Option 3 hero.** The A5 tile is unchanged. Only its two neighbours (B5, B6) changed, so `docs/work-design-review/option-3-responsive-heroes.jpg` was recaptured. The Option 2 and 4 hero sheets did not need it.

## 12. Remaining dummy-image limitations

These images are previews. They are below the resolution of the original
briefs, and their details are generated approximations. What a reviewer may
notice:

- **Resolution.** Every master is below the brief's target size, for example B9 at 1536 × 1024 against 3600 × 2400.
  - On 1× screens no slot draws an image beyond its own pixels.
  - On 2× screens the full-width live stills at tablet widths are drawn larger than the master: up to about 1.5× for the Option 4 live scene at 1024–1199 px, and up to about 1.26× for the Option 2 still at 770–1023 px. They may look slightly soft there.
  - Every other slot, including all desktop slots at 2×, stays within the master.
- **Product fidelity.** The products resemble the catalogue items but are not pixel-exact:
  - stitching, controls, chain links and reflections differ;
  - the generated washer (B8c, B16) and coffee maker (B6, B7d) differ slightly between images;
  - the stand mixer has no speed numbers;
  - logos were omitted.
- **Seller photographs are illustrative.** They show no seller's real premises, signage or stock (manifest note). B11's racking is bluer than the brief's blue-grey.
- **Arabic overlays on non-mirrored photos.** In the Option 3 Electronics and Home & Kitchen tiles, Arabic puts the white label plate at the right, where the TV and the coffee maker stand. In the wide tablet tiles (1024–1199 px) the plate covers the lower right of the TV and the coffee maker's drip tray. At 1440 px and on phones it sits mostly on the console or counter. The photographs are deliberately not mirrored.
- **"Recommended" badge on phones.** Below 640 px the existing layout puts the coral badge at the bottom start of the image, not the top. In the coffee-maker card it covers the two cups (English) or the machine's base (Arabic). The stand-ins were covered the same way.
- **B9 and A2 perspective.** In Option 4 the recliner is a separate cut-out on the B9 floor. Scale and floor contact are plausible but not photographically matched: there is no contact shadow beyond the existing CSS drop shadow, and lighting differs slightly.
- **Small crops.** In the widest tablet tiles (1100–1199 px, about 3 : 1) the bottom of the TV screen and the coffee maker's drip-tray base fall below the frame; their tops stay in view.
- **Rawabi subtitle.** The Option 3 Rawabi subtitle sits over a light sofa. Its contrast is still higher than with the old stand-in (§9).

## 13. Assets not integrated and why

None. All 25 images passed the technical checks and are in use. No stand-in
was kept for a Priority 2 slot.

Two stand-ins are outside B1–B18 and stay as they are:

- The Option 2 category row's Furniture (swivel chair) and Home & Kitchen (Dutch oven) cut-outs. These are the optional Priority 3 items C2/C3.
- The Option 3 "Recommended" wall tab, which is not in the brief.

## 14. Deployment result

The branch is connected to the Vercel preview project `khaznah-auction-web-app`,
which builds and publishes pushed commits automatically (`*.vercel.app`
addresses). The push of this commit will be published that way; its status
is given in the hand-off message.

No deployment was made by hand and no Vercel or domain setting was changed.
The real Khaznah production application and domain were not touched.
