# Work designs — missing asset production brief (Options 2–4 home pages)

Image-production briefs for the photographs and cut-outs that the approved
work designs need but the design preview's asset library does not have. Each
brief is written so ChatGPT Work can generate the asset on its own.

| | |
|---|---|
| Scope | Home pages of Option 2 (Premium Modern Marketplace), Option 3 (Visual Discovery Marketplace) and Option 4 (Contemporary Saudi Commerce) in `design-preview/`. Option 1 and the earlier-prototype inner screens are out of scope. |
| Visual authority | The three approved ChatGPT Work images from the homepage developer handoff: `01_Premium_Modern_Khaznah_Charcoal_Brass.png` (Option 2), `02_Visual_Discovery_Khaznah_Theme.png` (Option 3), `03_Contemporary_Saudi_Commerce.png` (Option 4), with the handoff text (`KHAZNAH_HOMEPAGE_DESIGN_HANDOFF.md`, §2.4–2.10, §3.4–3.10, §4.4–4.10). |
| What was reviewed | Reference vs implementation at 1440 px (`docs/work-design-review/option-{2,3,4}-reference-vs-implementation.jpg`) and the implemented home pages at 1920, 1440, 1024, 768 and 390 px. The slot sizes quoted below were measured in the running preview. |
| Status | **Priority 1 (A1–A7) delivered, approved and integrated** — see `PRIORITY_1_ASSET_INTEGRATION_REPORT.md`; the masters are kept in `design-preview/assets-src/priority-1/`. **Priority 2 (B1–B18): temporary dummy / preview images integrated** — see `PRIORITY_2_ASSET_INTEGRATION_REPORT.md`; the masters are kept in `design-preview/assets-src/priority-2/`. They stand in for final photography, which is still to be produced. The optional Priority 3 items are still open. |

---

## How to use this brief

1. Produce the assets in the order of §2. The recliner comes first (A1, A2),
   because three scenes (A3, A4, A5) must show the same chair.
2. For each asset give ChatGPT Work the **Prompt** from its brief, the
   matching approved design image as a composition and mood reference, and —
   where the brief says so — an earlier deliverable (for example A1) as the
   product reference.
3. **Generate new images.** Never crop, trace, upscale, repaint or paste any
   part of the approved design images or of the preview screenshots. The
   approved images show what the photograph should look like; they are not a
   source of pixels.
4. Check each result against its brief before accepting it: the text-free
   zones, product identity, resolution and (for cut-outs) a clean edge.

---

## 1. Rules for every asset

- **No text of any kind in an image.** No words, numbers, prices, logos
  (including Khazna's), brand names, signage, labels, watermarks, UI, badges
  or buttons. Every piece of text in the designs is live page text. Cartons
  may show simple generic line pictograms only, never letters.
- **No people.** Interiors and warehouses are unoccupied.
- **Catalogue products must stay the same products.** When an asset shows an
  item from the sample catalogue, it must be recognisably that item (shape,
  colour, material). The catalogue file to match is named in the brief.
- **Photographic realism.** Natural materials, believable daylight or
  warehouse light, no heavy HDR or fantasy styling. Reject results with
  generation faults: extra or melted legs, warped straight lines, duplicated
  objects, impossible reflections.
- **Colour:** sRGB, neutral white balance unless the brief says otherwise.
- **Delivery:** photographs as PNG or maximum-quality JPEG at the master size
  stated; cut-outs as 24-bit PNG with a clean alpha edge (no halo, no
  background remnants, no baked-in shadow), trimmed to the subject with about
  2 % transparent margin.
- **Arabic (right to left):** photographs are never mirrored. Where the
  Arabic layout moves text to the other side and the photograph would then
  cover the subject, a separately composed companion is requested.
- **File names:** `kz-o{option}-{slot}-v{n}.png` (for example
  `kz-o2-hero-room-ltr-v1.png`); assets shared by several options use
  `kz-shared-{subject}-v{n}.png`.
- **How the assets will be used (developer, after delivery):** masters are
  converted to WebP at the display sizes and added as **new** image keys used
  only by the Options 2–4 home pages. The shared catalogue photographs (also
  used by Option 1 and by the earlier-prototype screens) are not overwritten,
  so Option 1 cannot change.

---

## 2. Asset list

Production order is top to bottom. "Replaces" names the stand-in the home
page shows today.

### Priority 1

| ID | Asset | Used on | Replaces (current stand-in) |
|---|---|---|---|
| A1 | Tan leather recliner — studio photograph | Product reference for A2–A5; lot photograph | `recliner` photo set (an olive-grey mid-century chair) |
| A2 | Tan leather recliner — transparent cut-out | Live-auction lot in Options 2, 3 and 4 | `recliner-cut` |
| A3 | Option 2 panoramic furnished-room hero (English) | Option 2 hero | `recliner-2` room photograph |
| A4 | Option 2 hero companion for Arabic | Option 2 hero, Arabic | `recliner-2` (Arabic framing) |
| A5 | Option 3 furniture scene tile | Option 3 hero mosaic, centre tile | `task-lamp-3` room photograph |
| A6 | Option 4 limestone architectural hero (wide) | Option 4 hero, desktop and tablet | CSS limestone stage + five product cut-outs |
| A7 | Option 4 limestone hero, phone companion | Option 4 hero, phones | CSS stage + cut-outs (phone arrangement) |

### Priority 2

| ID | Asset | Used on | Replaces (current stand-in) |
|---|---|---|---|
| B1 | Mixed Electronics Returns Pallet — cut-out | Bulk & Pallets in Options 2, 3, 4; Option 2 "Bulk & Pallets" category; Option 4 Khazna Direct thumbnail | `boxes-stack` cut-out (cartons, no pallet) |
| B2 | Kitchen Appliances Pallet — cut-out | Bulk & Pallets in Options 2, 3, 4 | `boxes-stack-1` (cartons, no pallet) |
| B3 | Cordless drill — cut-out | Option 2 category row, Tools & DIY | `tool-backpack` cut-out |
| B4 | Car tyre on alloy wheel — cut-out | Option 2 category row, Automotive | `tyre-inflator` cut-out |
| B5 | Option 3 Electronics tile (TV scene) | Option 3 hero mosaic, upper right | `tv-43` cut-out on a pale plate |
| B6 | Option 3 Home & Kitchen tile (red coffee maker scene) | Option 3 hero mosaic, lower right | `capsule-coffee-1` |
| B7 | Option 3 product-wall photographs (six) | Option 3 "Finds worth a closer look" | catalogue cut-outs on tinted plates |
| B8 | Option 3 Ending soon photographs (three) | Option 3 Ending soon cards | catalogue cut-outs on tinted plates |
| B9 | Live-auction warehouse aisle | Option 2 live video still; Option 4 live scene background | brand photo `warehouse-riyadh` (cropped) |
| B10 | Electronics warehouse live still | Option 3 live banner | brand photo `warehouse-riyadh` |
| B11 | Khazna Direct — warehouse racking | Option 2 seller card | brand photo `warehouse-riyadh` (crop) |
| B12 | Khazna Direct — carton stack | Option 3 seller card | `boxes-stack-1` |
| B13 | Khazna Direct — building exterior | Option 4 seller row | brand photo `warehouse-riyadh` (zoomed crop) |
| B14 | Rawabi Home Outlet — living room | Option 2 card, Option 3 banner, Option 4 row | `swivel-chair-2`, `floor-lamp-1` |
| B15 | Red Sea Trading Co. — electronics warehouse | Option 2 card, Option 3 banner, Option 4 row | brand photo `warehouse-floor` |
| B16 | Dar Al Majd Wholesale — appliance showroom | Option 2 seller card | `washer-front-0` studio shot |
| B17 | Dar Al Majd Wholesale — warehouse with forklift | Option 3 card, Option 4 row | brand photo `warehouse-riyadh` (crops) |
| B18 | Sahel Lifestyle — bright living and dining room | Option 2 card, Option 3 card, Option 4 row | `floor-lamp-1`, `dining-chairs-1` |

### Priority 3 (optional — not needed for approval)

| ID | Asset | Used on | Replaces |
|---|---|---|---|
| C1 | Handwritten phrase "Good things find new homes." as vector (English and Arabic) | Option 3 hero copy tile | Caveat / Aref Ruqaa text with inline SVG marks |
| C2 | Tan leather lounge armchair — cut-out | Option 2 category row, Furniture | `swivel-chair` cut-out (grey leather) |
| C3 | Black cooking pot — cut-out | Option 2 category row, Home & Kitchen | `dutch-oven-blue` cut-out |

---

## 3. Priority 1 briefs

### A1 — Tan leather recliner, studio photograph

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Shared by Options 2, 3 and 4: the live-auction lot shown as "Mid-Century Leather Recliner" (Option 2 hero price pin and live "Featured item"; Option 3 live card and furniture tile; Option 4 live scene). This photograph defines the chair for A2–A5. |
| 2 | Visual subject | One overstuffed recliner in tan / cognac aniline leather with a soft sheen and natural creasing: rolled, padded pillow-top arms; a back of three horizontal padded sections under a rounded head roll; a thick seat cushion with a front roll; the footrest closed; a dark recline lever on the chair's right side; a low black base that is barely visible. This is the chair drawn in all three approved images. |
| 3 | Composition | The chair alone, three-quarter front view with its front turned toward the viewer's left (as in the Option 2 live panel), camera at seat height, whole chair in frame and centred, about 80 % of the frame height. |
| 4 | Aspect ratio | 1:1 |
| 5 | Approximate resolution | 2400 × 2400 px |
| 6 | Background and lighting | Seamless pure white (#FFFFFF) studio background. Soft key light from the upper left, gentle fill from the right, a soft contact shadow under the base. True leather colour (mid-tones around #A8663A–#B87445). |
| 7 | Empty space for UI text | None inside the image; keep at least 8 % clear margin on every side. |
| 8 | Transparent background | No (white). The transparent version is A2. |
| 9 | Replaces | On the Options 2–4 home pages: the `recliner` set (`public/images/catalog/recliner-0-*.webp`, an olive-grey mid-century chair), reached through the live lot in `design-preview/data/live.js` (lot 5). Added as a new key; the shared `recliner` set stays for Option 1 and the earlier prototypes. |

**Prompt.** Studio product photograph of a single overstuffed reclining
armchair upholstered in tan cognac aniline leather with a soft natural sheen
and gentle creases. Rolled padded pillow-top arms, a back made of three
horizontal padded sections under a rounded head roll, a thick seat cushion,
closed footrest, a dark recline lever on the right side, a low black base.
Three-quarter front view, the chair's front turned toward the left, camera at
seat height, the whole chair centred and filling most of the frame. Seamless
pure white background, soft key light from the upper left, soft contact
shadow. Photorealistic e-commerce packshot, square format. No text, no logo,
no people, no other objects.

**Note on naming.** The sample lot is called "Mid-Century Leather Recliner"
and its description (shown only on the earlier-prototype live screen) says
olive leather. The approved designs draw this tan, overstuffed chair, so the
brief follows the designs. Aligning the shared lot text is a separate content
decision, because Option 1 uses the same record.

### A2 — Tan leather recliner, transparent cut-out

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Options 2, 3 and 4 — the current live lot: Option 2 "Live auction" Featured item panel (slot 237 × 293 px at 1440 wide); Option 3 live banner's current-lot card (98 × 140 px); Option 4 live scene, standing on the warehouse floor of B9 (about 366 × 288 px at 1440, 200 × 173 px on phones). |
| 2 | Visual subject | Exactly the chair of A1 — same model, colour and angle — isolated. |
| 3 | Composition | Same angle as A1. The chair fills about 92 % of the canvas height, trimmed to the subject; the bottom of the base is the lowest point (Option 4 stands it on a floor). |
| 4 | Aspect ratio | About 4:5 portrait after trimming (the chair's own proportion). |
| 5 | Approximate resolution | At least 1600 px tall. |
| 6 | Background and lighting | Transparent. Lighting identical to A1 (key light from the upper left) so it sits naturally in the B9 warehouse, which is lit from the same side. No baked shadow; the page adds its own. |
| 7 | Empty space for UI text | None (text sits beside the cut-out). |
| 8 | Transparent background | Yes — 24-bit PNG with a clean alpha edge. |
| 9 | Replaces | `recliner-cut` (`public/images/catalog/recliner-cut-{600,1200}.webp`, the olive chair) where the three home pages draw the live lot: `components/concept-a/premium-modern/sections.jsx` (live panel), `components/concept-c/visual-discovery/sections.jsx` (live card), `components/concept-d/saudi-commerce/sections.jsx` (live scene). |

**Prompt.** The same tan cognac leather recliner as the attached reference
image, identical model, colour and angle, isolated on a fully transparent
background as a clean product cut-out. Soft studio light from the upper left.
No shadow, no floor, no text, no logo.

### A3 — Option 2 panoramic furnished-room hero (English)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2, Premium Modern Marketplace — section 03, the full-bleed hero ("Find your next great find.") directly below the two-row header. |
| 2 | Visual subject | A calm, sunlit contemporary living-and-study room. Left: tall windows with sheer curtains and large tropical plants (palms), soft and low in detail. Centre: a walnut writing desk with drawers, a black-and-brass task lamp, a few books. Behind and right of the desk: tall open walnut shelving with a few ceramics and books. Right: the tan leather recliner of A1 (same model), angled toward the desk. A light woven rug on a pale oak or stone floor; far right, a small wooden side table with a cup and a potted plant. Warm ivory walls. |
| 3 | Composition | Eye level, straight on, wide panorama. Zones as a share of the master width (x) and height (y): **x 0–41 %** calm (windows, curtains, plants, wall) — the ivory copy card covers it; **x 42–62 %** desk and lamp; **x 66–88 %** recliner, whole chair visible, seat at about y 55–80 % (the pin's white dot lands on it); **x 66–85 %, y 8–40 %** a quiet wall or softly lit shelving above the chair for the white price pin; everything important inside **y 12–92 %**, because wide screens crop the top and bottom. |
| 4 | Aspect ratio | 4:1 master. The page crops it to 3.33:1 at 1440 px, 4.44:1 at 1920 px, about 2.4:1 on tablets and 1.7:1 on phones. |
| 5 | Approximate resolution | 4800 × 1200 px (a 1920 px screen at 2× needs 3840 px). |
| 6 | Background and lighting | Warm natural daylight from the left windows, soft shadows falling to the right; warm ivory and cream with walnut and tan-leather accents; gentle contrast (the design does not darken the photograph — the copy card carries the text). |
| 7 | Empty space for UI text | Left 41 % × full height for the copy card (about 510 × 320 px at 1440, placed 48 px from the left and 60 px from the top). A pocket above the recliner for the price pin (about 218 × 123 px at 1440). On phones the photograph is a 1.7:1 strip under the copy, cropped around x 45–95 % (desk and recliner), with the pin docked under it if needed. |
| 8 | Transparent background | No. |
| 9 | Replaces | `photo("recliner", 2)` → `public/images/catalog/recliner-2-{800,1600}.webp` (a room with the olive recliner), set as `HERO_ROOM` in `design-preview/components/concept-a/premium-modern/data.js`; its `focus` and `pin` positions will be re-tuned to the new photograph. |

**Prompt.** Wide panoramic interior photograph, 4:1, of a calm sunlit
contemporary living and study room with warm ivory walls. On the left, tall
windows with sheer curtains and large palm plants, soft and uncluttered. In
the centre, a walnut writing desk with drawers and a black and brass task lamp
with a few books. Behind the desk, tall open walnut shelving with a few
ceramics. On the right, an overstuffed tan cognac leather recliner (exactly
the attached recliner) angled toward the desk, standing on a light woven rug
on a pale oak floor; at the far right a small wooden side table with a cup and
a potted plant. Keep the left 40 % of the image calm and low in detail, keep
the wall above the recliner plain, keep the desk and chair fully inside the
middle of the frame height. Warm natural daylight from the left, soft
shadows, premium editorial photography, photorealistic. No people, no text,
no logos.

### A4 — Option 2 hero companion for Arabic

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2 hero in Arabic, where the copy card moves to the right-hand side and the price pin to the left. Recommended; alternatively the Arabic page keeps A3 with its current right-safe framing. |
| 2 | Visual subject | The same room, objects, materials and light as A3, **recomposed — not mirrored**: windows and palms on the right, the recliner on the left angled toward the desk, desk and lamp in the centre. |
| 3 | Composition | Zones: **x 59–100 %** calm for the copy card; **x 38–58 %** desk and lamp; **x 12–34 %** recliner, seat at about y 55–80 %; **x 15–34 %, y 8–40 %** quiet for the price pin; everything important inside y 12–92 %. |
| 4 | Aspect ratio | 4:1 |
| 5 | Approximate resolution | 4800 × 1200 px |
| 6 | Background and lighting | As A3, with daylight from the right-hand windows. |
| 7 | Empty space for UI text | Right 41 % × full height for the copy card; the pocket above the recliner for the pin. |
| 8 | Transparent background | No. |
| 9 | Replaces | The Arabic framing of `recliner-2` (`HERO_ROOM.focusRtl` and `pinRtl` in the same data file). |

**Prompt.** The same room as the attached hero photograph, recomposed rather
than mirrored: tall windows with sheer curtains and palm plants on the right,
calm and low in detail; the walnut desk and black and brass task lamp in the
centre; the same tan leather recliner on the left, angled toward the desk, on
a light woven rug. Keep the right 40 % calm and the wall above the recliner
plain. 4:1 panorama, warm daylight from the right, photorealistic. No people,
no text, no logos.

### A5 — Option 3 furniture scene tile

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 3, Visual Discovery Marketplace — section 03 hero mosaic, the centre tile ("Furniture — Stylish picks for every space", Explore). The Suede Tote card overlaps its lower right. |
| 2 | Visual subject | A bright modern room. The tan leather recliner of A1 in the left half, turned three-quarters toward the viewer's right, footrest closed. Behind it on the right, a walnut writing desk with slim tapered legs, a brass desk lamp, a small black speaker and a white vase with a green plant; a framed abstract print on the white wall above the desk; a tall plant at the far left edge; a warm wood floor. |
| 3 | Composition | Eye level, slightly above seat height. Recliner about x 5–58 %, y 15–80 %; desk about x 45–98 %, y 25–65 %. Bottom band y 72–100 % is plain floor. |
| 4 | Aspect ratio | 1:1 master (shown at 1.06:1 on desktop, 0.96:1 on phones). |
| 5 | Approximate resolution | 2400 × 2400 px (the tile is 552 × 520 px at 1440). |
| 6 | Background and lighting | Soft daylight from the left, bright but not blown out; warm white walls; accents of tan, walnut, green and brass. |
| 7 | Empty space for UI text | Lower left x 0–45 %, y 72–100 %: the white "Furniture" title, subtitle and Explore pill (the page adds a local dark gradient there, so a mid-to-dark floor tone helps). Lower right x 48–100 %, y 68–100 %: covered by the tote card (about 285 × 150 px) — floor only. In Arabic the title and the card swap sides, so both lower corners must stay plain floor. |
| 8 | Transparent background | No. |
| 9 | Replaces | `photo("task-lamp", 3)` → `public/images/catalog/task-lamp-3-{800,1600}.webp` (a walnut desk with a tan office chair), `HERO.furniture` in `design-preview/components/concept-c/visual-discovery/data.js`. |

**Prompt.** Square interior photograph of a bright modern room. On the left
half, an overstuffed tan cognac leather recliner (exactly the attached
recliner) turned three-quarters toward the right, footrest closed. Behind it
on the right, a walnut writing desk with slim tapered legs, a brass desk lamp,
a small black speaker and a white vase with a green plant, a framed abstract
print on the white wall above. A tall plant at the far left edge, warm wood
floor. Keep the bottom quarter of the image plain floor with no objects. Soft
daylight from the left, fresh and bright, photorealistic. No people, no text,
no logos.

### A6 — Option 4 limestone architectural hero (wide)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 4, Contemporary Saudi Commerce — section 03, the centred bilingual hero with the segmented search (section 04) inside it. |
| 2 | Visual subject | A calm, warm limestone interior set: pale cream limestone walls and floor with softly curved (arched) openings at both sides. Left: a low limestone plinth with the cognac Suede Tote standing on it (catalogue `suede-tote`, match `public/images/catalog/suede-tote-0-1200.webp`), palms and green plants in the corner. Right: a black floor lamp, a tan leather lounge armchair with wooden legs on a light rug, a silver front-load washing machine on a low plinth (catalogue `washer-front`) and a silver hard-shell spinner suitcase (catalogue `hardside-spinner`), with a few plants. |
| 3 | Composition | Straight on, balanced, low horizon. Zones as a share of the master: **x 9–27 %** left group (plinth, tote, plants); **x 28–72 %, full height** empty wall and floor; **x 73–91 %** right group (lamp, armchair, washer, suitcase, plants); x 0–9 % and 91–100 % wall and plants that may be cropped; all products inside **y 6–94 %**. |
| 4 | Aspect ratio | 4:1 master (shown at 3.33:1 at 1440 px and 4.44:1 at 1920 px; tablets crop the sides). |
| 5 | Approximate resolution | 4800 × 1200 px |
| 6 | Background and lighting | Soft diffuse daylight, low contrast, warm cream palette (the quiet area close to #EDE3D5), soft floor shadows, greens from the plants, no strong vignette. |
| 7 | Empty space for UI text | The centre x 28–72 %, full height, completely free of objects, strong texture and shadows: Arabic eyebrow around y 12–22 %, English headline y 25–42 %, subheading y 45–52 %, search bar (about 767 × 69 px at 1440) y 57–73 %, two buttons y 80–95 %. |
| 8 | Transparent background | No. |
| 9 | Replaces | The CSS stage (`.sc-stage` in `design-preview/styles/r3-saudi-commerce.css`) and the five hero cut-outs in `HERO_PROPS` (`design-preview/components/concept-d/saudi-commerce/data.js`: `suede-tote`, `swivel-chair`, `floor-lamp`, `washer-front`, `hardside-spinner`), drawn by `Hero.jsx`. It also brings the plants that the stand-in leaves out. |

**Prompt.** Wide 4:1 architectural interior photograph of a calm warm
limestone space: pale cream limestone walls and floor, softly curved arched
openings at both sides. On the left, a low limestone plinth with a cognac
suede tote bag standing on it, palms and green plants in the corner. On the
right, a black floor lamp, a tan leather lounge armchair with wooden legs on
a light rug, a silver front-load washing machine on a low plinth and a silver
hard-shell spinner suitcase, with a few plants. The central 45 % of the image
is empty, quiet cream wall and floor with no objects, no strong texture and
no shadows. Soft diffuse daylight, low contrast, serene premium retail
photography, photorealistic. No people, no text, no logos, no ornament
beyond the arches.

### A7 — Option 4 limestone hero, phone companion

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 4 hero on phones (and narrow tablets), where the headline wraps to two or three lines and the search stacks (category control above the query and Search). |
| 2 | Visual subject | The same set, materials and products as A6 (same tote, armchair, lamp, washer, suitcase, plants), recomposed for portrait. |
| 3 | Composition | Upper 68 %: plain limestone wall, with arch edges only at the far sides. Lower 32 %: the plinth with the tote at the bottom left; the armchair and lamp at the bottom right, the washer and suitcase partly visible at the right edge; plants at both edges. |
| 4 | Aspect ratio | 5:8 portrait (the phone hero is about 390 × 622 CSS px). |
| 5 | Approximate resolution | 1200 × 1920 px |
| 6 | Background and lighting | As A6. |
| 7 | Empty space for UI text | Upper 68 % × full width for the eyebrow, headline, subheading, stacked search and both buttons. |
| 8 | Transparent background | No. |
| 9 | Replaces | The phone arrangement of the same CSS stage and cut-outs (scaled-down cut-outs along the bottom of the hero). |

**Prompt.** Portrait 5:8 companion to the attached limestone hero: the same
warm limestone space, same products and plants. The upper two thirds are a
plain, quiet cream limestone wall with arch edges only at the far sides. Along
the bottom: a limestone plinth with the cognac suede tote at the bottom left,
the tan leather armchair and black floor lamp at the bottom right, the silver
washing machine and suitcase partly visible at the right edge, plants at both
edges. Soft diffuse daylight, photorealistic. No people, no text, no logos.

---

## 4. Priority 2 briefs

### B1 — Mixed Electronics Returns Pallet, cut-out

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Options 2, 3 and 4 — Bulk & Pallets, lot "Mixed Electronics Returns Pallet" (64 units): Option 2 first pallet row (image slot 240 × 99 px at 1440); Option 3 left ivory panel (344 × 255 px); Option 4 left sage panel (312 × 249 px). Also Option 2's "Bulk & Pallets" category image (167 × 112 px) and Option 4's Khazna Direct thumbnail (76 × 76 px). |
| 2 | Visual subject | Mixed-size plain kraft cardboard cartons — a few flat TV-size boxes and several smaller cubes — neatly stacked and taped on a standard light-timber pallet with visible deck boards and blocks. Cartons may carry small generic printed pictograms (a screen outline, "this way up" arrows); no words, no logos. |
| 3 | Composition | Three-quarter view from about 20–25° above, a pallet corner toward the viewer, the whole stack and the whole pallet in frame; the stack about 1.3–1.6 times as wide as it is tall. |
| 4 | Aspect ratio | About 4:3 before trimming. |
| 5 | Approximate resolution | 2000 × 1500 px |
| 6 | Background and lighting | Transparent. Soft neutral studio light from the upper left; no baked shadow. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | Yes — 24-bit PNG. |
| 9 | Replaces | `boxes-stack` (loose cartons, no pallet) — `boxes-stack-cut-*.webp` as the `electronics-pallet` record's first image and as Option 2's `CATEGORY_ROW` "bulk-pallets" art (`components/concept-a/premium-modern/data.js`). Added as a new key for the home pages; the shared record keeps its image for Option 1. |

**Prompt.** Product cut-out photograph of a standard light timber wooden
pallet stacked with mixed-size plain kraft cardboard shipping cartons (a few
flat TV-size boxes and several smaller cubes), neatly stacked and taped,
three-quarter view from slightly above with a pallet corner toward the
viewer, the whole pallet visible. Small generic line pictograms on some boxes
only, no words, no logos. Soft studio light from the upper left, fully
transparent background, no shadow, photorealistic.

### B2 — Kitchen Appliances Pallet, cut-out

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Options 2, 3 and 4 — Bulk & Pallets, lot "Kitchen Appliances Pallet" (40 units): Option 2 second pallet row (240 × 99 px); Option 3 right blue-grey panel (344 × 255 px); Option 4 right sage panel (312 × 249 px). |
| 2 | Visual subject | Medium, fairly uniform plain kraft cartons for small kitchen appliances, some with simple generic appliance pictograms (a kettle, a pot, a microwave outline — no words), stacked on the same type of light-timber pallet as B1. |
| 3 | Composition | Same camera angle, scale and lighting as B1, so the two rows and panels match. |
| 4 | Aspect ratio | About 4:3 before trimming. |
| 5 | Approximate resolution | 2000 × 1500 px |
| 6 | Background and lighting | Transparent; as B1. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | Yes — 24-bit PNG. |
| 9 | Replaces | `boxes-stack-1` (cartons on white, no pallet) — the `kitchen-pallet` record's first image, drawn by the three home pages. New key; the shared record is unchanged. |

**Prompt.** As B1, attached for consistency: a light timber pallet stacked
with medium, fairly uniform plain kraft cartons for small kitchen appliances,
a few with simple kettle, pot and microwave line pictograms, no words, no
logos. Same camera angle, scale and light as the attached pallet. Fully
transparent background, no shadow, photorealistic.

### B3 — Cordless drill, cut-out

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2 — category row (section 04), "Tools & DIY"; image slot 167 × 112 px at 1440 (97 × 84 px on phones), bottom-aligned with the other seven category images. |
| 2 | Visual subject | A cordless drill/driver with a blue-and-black body, black rubber grip, black battery pack at the base and a keyless chuck with a short bit. Generic, no brand marks. |
| 3 | Composition | Upright on its battery, side view with the chuck pointing to the viewer's left and a slight three-quarter turn (as drawn); fills about 95 % of the trimmed height. |
| 4 | Aspect ratio | About 1:1 before trimming. |
| 5 | Approximate resolution | 1600 × 1600 px |
| 6 | Background and lighting | Transparent; soft studio light from the upper left, natural highlights on the plastic. |
| 7 | Empty space for UI text | None (the label sits below the image). |
| 8 | Transparent background | Yes — 24-bit PNG. |
| 9 | Replaces | `cutout("tool-backpack")` (a black tool backpack) in `CATEGORY_ROW`, `design-preview/components/concept-a/premium-modern/data.js`. |

**Prompt.** Product cut-out of a cordless drill driver with a blue and black
body, black rubber grip, black battery pack at the base and a keyless chuck
with a short bit, standing upright on its battery, side view with the chuck
pointing left and a slight three-quarter turn. Generic, no brand marks, no
text. Soft studio light from the upper left, fully transparent background,
no shadow, photorealistic.

### B4 — Car tyre on alloy wheel, cut-out

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2 — category row, "Automotive"; slot 167 × 112 px at 1440 (97 × 84 px on phones), bottom-aligned. |
| 2 | Visual subject | A single car tyre mounted on a dark graphite multi-spoke alloy wheel; realistic tread; no readable sidewall lettering. |
| 3 | Composition | Standing upright on its tread, three-quarter view showing the wheel face and part of the tread (as drawn); fills about 95 % of the trimmed height. |
| 4 | Aspect ratio | About 1:1 before trimming. |
| 5 | Approximate resolution | 1600 × 1600 px |
| 6 | Background and lighting | Transparent; soft studio light from the upper left. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | Yes — 24-bit PNG. |
| 9 | Replaces | `cutout("tyre-inflator")` (a portable tyre inflator) in `CATEGORY_ROW`, same file as B3. |

**Prompt.** Product cut-out of a single car tyre mounted on a dark graphite
multi-spoke alloy wheel, standing upright on its tread, three-quarter view
showing the wheel face and part of the tread. No readable lettering on the
sidewall, no logos. Soft studio light from the upper left, fully transparent
background, no shadow, photorealistic.

### B5 — Option 3 Electronics tile (TV scene)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 3 — hero mosaic, right column, upper tile ("Electronics — Top brands, great finds", round arrow button). |
| 2 | Visual subject | A large flat-screen TV with a thin bezel on a slim stand (or wall-mounted above a low console) showing a vivid blue ocean-wave image, like the catalogue TV (`public/images/catalog/tv-43-0-1200.webp`); a green plant at the left; a warm neutral wall. The screen shows only the abstract wave. |
| 3 | Composition | TV at about x 38–95 %, y 8–72 %, turned slightly toward the left; plant at x 0–28 %. |
| 4 | Aspect ratio | 16:9 master (the tile shows about 1.64:1 on desktop, 2.57:1 at 1024 px and 1.93:1 on phones). |
| 5 | Approximate resolution | 2400 × 1350 px (tile 398 × 243 px at 1440). |
| 6 | Background and lighting | Soft daylight, warm beige wall, clean and bright. |
| 7 | Empty space for UI text | Lower left x 0–52 %, y 62–95 % for the white rounded label plate; lower right x 85–97 %, y 70–93 % for the white round arrow button. Keep both plain (wall or console). |
| 8 | Transparent background | No. |
| 9 | Replaces | `photo("tv-43", 0)` shown as a cut-out on a pale plate — `HERO.electronics` in `design-preview/components/concept-c/visual-discovery/data.js`. |

**Prompt.** Bright lifestyle photograph, 16:9, of a large thin-bezel
flat-screen TV on a slim stand in front of a warm beige wall, screen showing
a vivid blue ocean wave, the TV in the right half turned slightly left, a
green plant at the left edge. Keep the lower left and lower right corners
plain. Soft daylight, clean and modern, photorealistic. No text, no on-screen
interface, no logos, no people.

### B6 — Option 3 Home & Kitchen tile (red coffee maker scene)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 3 — hero mosaic, right column, lower tile ("Home & Kitchen — Everything for your home.", round arrow button). |
| 2 | Visual subject | The red single-serve coffee maker from the catalogue (`capsule-coffee`; match `public/images/catalog/capsule-coffee-0-1200.webp`) on a light counter against a soft peach-pink wall; a white utensil crock with wooden spoons and a white cup to the left; a small wooden canister at the far right. |
| 3 | Composition | Coffee maker at about x 58–92 %, y 12–82 %; props low, at x 5–45 %. |
| 4 | Aspect ratio | 3:2 master (the tile shows about 1.48:1 on desktop, 2.57:1 at 1024 px and 1.93:1 on phones). |
| 5 | Approximate resolution | 2400 × 1600 px (tile 398 × 269 px at 1440). |
| 6 | Background and lighting | Soft warm daylight; peach wall (around #F3CDB8), light counter, gentle shadows. |
| 7 | Empty space for UI text | Lower left x 0–58 %, y 65–95 % for the label plate; lower right x 85–97 %, y 72–93 % for the arrow button. |
| 8 | Transparent background | No. |
| 9 | Replaces | `photo("capsule-coffee", 1)` (the red coffee maker on white marble) — `HERO.kitchen`, same file as B5. |

**Prompt.** Warm lifestyle photograph, 3:2, of a red single-serve capsule
coffee maker (exactly the attached product) on a light kitchen counter
against a soft peach-pink wall, placed in the right half; a white utensil
crock with wooden spoons and a white cup low on the left, a small wooden
canister at the far right. Keep the lower left and lower right corners plain.
Soft warm daylight, photorealistic. No text, no logos, no people.

### B7 — Option 3 product-wall photographs (six)

Common fields for all six:

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 3 — section "Finds worth a closer look" (the mixed-height product wall, Buy Now tab). |
| 3 | Composition | The product alone, centred, in a clean three-quarter view on a seamless tinted sweep with a soft floor shadow; the product fills about 70 % of the height and sits within the middle 60 % of the width, so both the desktop and the phone crop keep it whole. |
| 4 | Aspect ratio | Tall cards 3:4 (slot 334 × 440 px at 1440, 170 × 213 px on phones); small cards 5:3 (slot 309 × 168 px at 1440, 170 × 128 px on phones). |
| 5 | Approximate resolution | Tall 1500 × 2000 px; small 2000 × 1200 px. |
| 6 | Background and lighting | Soft studio light from the upper left; the backdrop colour per item below. |
| 7 | Empty space for UI text | Top 15 %: the white round favourite button (about 40 px) at the top end and, on some cards, a coral "Recommended" badge at the top start. Text sits below the image. |
| 8 | Transparent background | No. |
| 9 | Replaces | Each product's catalogue cut-out placed on a tinted plate (`WALL_BUY_NOW` and `WALL_TONES` in `design-preview/components/concept-c/visual-discovery/data.js`). |

Per item (field 2, visual subject):

| Item | Card | Catalogue product to match | Backdrop |
|---|---|---|---|
| Suede Tote with Chain Strap | tall | `suede-tote` — cognac suede tote, chain-and-leather strap, standing upright, handles up | warm cream #F6ECDF |
| Hairpin-Leg Writing Desk | small | `hairpin-desk` — walnut top with a low back shelf, black hairpin legs, three-quarter front view | peach-beige #F3EBE3 |
| Hardside Spinner Suitcase | small | `hardside-spinner` — silver ribbed shell, four spinner wheels, telescopic handle retracted (as drawn) | pale blue #E6EBF1 |
| Single-Serve Capsule Coffee Maker | small | `capsule-coffee` — red body, with two small brown cups beside it (as drawn) | peach #F9E0D4 |
| Adjustable Task Lamp | small | `task-lamp` — navy shade, brass arm, round navy base | blue-grey #DFE7F0 |
| Stand Mixer 4.5 L | tall | `stand-mixer` — black body, stainless bowl, a small plant at the left edge (as drawn) | warm beige #EFE7DC |

**Prompt (per item).** Studio product photograph of [the product, exactly
the attached catalogue item] standing on a seamless [backdrop colour] sweep,
clean three-quarter view, centred, soft studio light from the upper left, soft
floor shadow, calm premium e-commerce style, [3:4 or 5:3]. Keep the top
corners plain. No text, no logos, no people.

The Recommended tab (six other products) keeps its cut-outs on plates; it is
not part of this brief.

### B8 — Option 3 Ending soon photographs (three)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 3 — section "Ending soon": three image-first auction cards, each with a coral countdown pill at the top end and a favourite button at the top start. |
| 2 | Visual subject | Faux-Leather Car Seat Cover (catalogue `seat-covers`, black seat) against a pale blue-grey studio wall; 1.5-Ton Split Air Conditioner (`split-ac`) mounted on a light grey wall; 6 kg Front-Load Washing Machine (`washer-front`) against a grey concrete wall on a light floor. |
| 3 | Composition | Product centred, about 60–70 % of the height. |
| 4 | Aspect ratio | 2:1 (slot 427 × 204 px at 1440, 292 × 139 px on phones). |
| 5 | Approximate resolution | 2400 × 1200 px each. |
| 6 | Background and lighting | Soft daylight or studio light; cool neutral tones close to the current plates (#DFE5EC, #E9EBED, #E4E2DF). |
| 7 | Empty space for UI text | Top 22 % band plain: countdown pill (about 120 × 36 px) at the top end, favourite button (about 40 px) at the top start. |
| 8 | Transparent background | No. |
| 9 | Replaces | The `ENDING` cut-outs on tinted plates in `design-preview/components/concept-c/visual-discovery/data.js`. |

**Prompt (per item).** Photograph of [the product, exactly the attached
catalogue item] [on / against] a [wall] in soft even light, product centred
and filling about two thirds of the height, calm modern style, 2:1. Keep the
top band plain. No text, no logos, no people.

### B9 — Live-auction warehouse aisle

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2 — "Live auction" video still (left panel, 752 × 296 px at 1440; play button in the centre, LIVE NOW badge at the top start, event title and host at the bottom start). Option 4 — the integrated live scene (654 × 464 px at 1440, 358 × 480 px on phones), where the current lot's cut-out (A2) stands on the floor. |
| 2 | Visual subject | A deep warehouse aisle: tall pallet racking on both sides loaded with kraft cartons and shrink-wrapped pallets, blue-grey uprights with orange beams, a polished concrete floor with soft reflections, a red hand pallet jack parked at one side, industrial ceiling lights. |
| 3 | Composition | One-point perspective, vanishing point around x 55 %, y 45 %. The floor at x 30–70 %, y 60–95 % stays clear (Option 4 places the chair there). Racking frames both sides. |
| 4 | Aspect ratio | 3:2 master (cropped to about 2.54:1 in Option 2, 1.41:1 in Option 4 on desktop, 0.75:1 on phones). |
| 5 | Approximate resolution | 3600 × 2400 px |
| 6 | Background and lighting | Industrial light, warm highlights and cool shadows, moderately dark overall (white text sits on it); main light from the upper left, matching A2. |
| 7 | Empty space for UI text | Centre calm for the play button (about 72 px circle); the lower third darker and plain for the title (Option 2) and the lot details and Join button (Option 4); a quiet top band for the LIVE badge. |
| 8 | Transparent background | No. |
| 9 | Replaces | Khazna's brand photograph `warehouse-riyadh` (`public/images/brand/warehouse-riyadh-*.webp`, a staff member with a tablet in the Riyadh warehouse) where the Option 2 home uses `LIVE_EVENT.stream` and where Option 4 uses a zoomed crop (`LIVE_SCENE` in `design-preview/components/concept-d/saudi-commerce/data.js`). The brand photograph stays in the library. |

**Prompt.** Photograph of a deep, empty warehouse aisle in one-point
perspective: tall pallet racking on both sides with blue-grey uprights and
orange beams, loaded with kraft cartons and shrink-wrapped pallets; polished
concrete floor with soft reflections; a red hand pallet jack parked at one
side; industrial ceiling lights. Keep the centre of the floor clear.
Moderately dark, warm highlights and cool shadows, main light from the upper
left, cinematic but realistic, 3:2. No people, no signage, no text, no logos.

### B10 — Electronics warehouse live still (Option 3)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 3 — navy live banner, the video frame on the right (504 × 263 px at 1440, 470 × 405 px at 1024, 358 × 186 px on phones); LIVE NOW badge at the top end, play button in the centre. |
| 2 | Visual subject | An electronics wholesale warehouse (the event host is Red Sea Trading Co.): several flat-screen TVs on racks and stands with bright blue abstract screens, boxed electronics and cartons on pallets, a dark blue feature wall without lettering, industrial ceiling lights. Ideally the same space as B15, from another viewpoint. |
| 3 | Composition | Wide, slightly elevated view; interest spread across the frame; the centre (x 40–60 %, y 35–65 %) moderately calm for the play button. |
| 4 | Aspect ratio | 3:2 |
| 5 | Approximate resolution | 2400 × 1600 px |
| 6 | Background and lighting | Cool industrial light, blue screen glow, warm carton tones; medium-dark. |
| 7 | Empty space for UI text | Top-end corner (badge) and centre (play button). |
| 8 | Transparent background | No. |
| 9 | Replaces | `warehouse-riyadh` as the Option 3 live banner still (`LIVE_EVENT.stream`). |

**Prompt.** Wide, slightly elevated photograph of an electronics wholesale
warehouse: flat-screen TVs on racks and stands with bright blue abstract
screens, boxed electronics and cartons on wooden pallets, a dark blue
feature wall with no lettering, industrial ceiling lights. Keep the centre
moderately calm. Cool light with blue glow and warm carton tones, realistic,
3:2. No people, no signage, no text, no logos.

### Seller photographs (B11–B18) — shared notes

Each seller image appears in up to three crops:

| Where | Slot at 1440 px | Ratio | Text over the photo |
|---|---|---|---|
| Option 2 seller card (cover at the start of the card) | 100 × 112 px | 0.9:1 | none |
| Option 3 promoted banner (Rawabi, Red Sea) | 662 × 237 px | 2.8:1 | name, subtitle and Browse shop button at the start side over a dark gradient (the end side in Arabic) |
| Option 3 compact card (Khazna Direct, Dar Al Majd, Sahel) | 198 × 128 px | 1.55:1 | none |
| Option 4 seller row cover | 206 × 86 px | 2.4:1 | none |

For all of them: field 6 is natural light suited to the subject; field 8 is
"no" (not transparent); the photograph must not show the seller's name,
signage or a logo. Current covers are set in
`components/concept-a/premium-modern/data.js` (`SELLER_CARDS`),
`components/concept-c/visual-discovery/data.js` (`PROMOTED_SELLERS`,
`COMPACT_SELLERS`) and `components/concept-d/saudi-commerce/data.js`
(`SELLER_ROWS`).

### B11 — Khazna Direct, warehouse racking (Option 2 card)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2 — Featured Sellers, Khazna Direct card cover. |
| 2 | Visual subject | Tall blue-grey warehouse racking with neatly stacked kraft cartons and a steel mezzanine stair, clean and organised. |
| 3 | Composition | Vertical composition with the racking and stair in the centre. |
| 4 | Aspect ratio | 4:5 portrait master (used at 0.9:1). |
| 5 | Approximate resolution | 1600 × 2000 px |
| 6 | Background and lighting | Cool, even warehouse light. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | No. |
| 9 | Replaces | `BRAND_PHOTOS.warehouseRiyadh` crop (focus 100 % 40 %) in `SELLER_CARDS`. |

**Prompt.** Vertical photograph of tall blue-grey warehouse racking with
neatly stacked kraft cartons and a steel mezzanine staircase, clean and
organised, cool even light, realistic, 4:5. No people, no signage, no text.

### B12 — Khazna Direct, carton stack (Option 3 card)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 3 — Explore their shelves, Khazna Direct compact card. |
| 2 | Visual subject | A neat pyramid of plain kraft shipping cartons on a white-to-light-grey studio background. The approved image prints the Khazna logo on one box; if the owner wants that, it is composited afterwards from the official logo file — never generated. |
| 3 | Composition | Stack centred, filling about 75 % of the height. |
| 4 | Aspect ratio | 3:2 (used at 1.55:1). |
| 5 | Approximate resolution | 2400 × 1600 px |
| 6 | Background and lighting | Bright, soft studio light, very light background. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | No. |
| 9 | Replaces | `photo("boxes-stack", 1)` in `COMPACT_SELLERS`. |

**Prompt.** Studio photograph of a neat pyramid of plain kraft shipping
cartons, taped, on a white to light grey seamless background, soft bright
light, centred, 3:2. No text, no logos, no labels.

### B13 — Khazna Direct, building exterior (Option 4 row)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 4 — Featured Sellers, Khazna Direct row cover. |
| 2 | Visual subject | A modern two-storey warehouse and showroom building with a white and charcoal façade and a large glass entrance, in clear daylight. No signage. |
| 3 | Composition | Three-quarter street view, the building across the middle band of the frame. |
| 4 | Aspect ratio | 3:1 (used at 2.4:1). |
| 5 | Approximate resolution | 3000 × 1000 px |
| 6 | Background and lighting | Bright daylight, clear sky, crisp shadows. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | No. |
| 9 | Replaces | `BRAND_PHOTOS.warehouseRiyadh` (zoom 4) in `SELLER_ROWS`. |

**Prompt.** Three-quarter exterior photograph of a modern two-storey
warehouse and showroom building with a white and charcoal façade and a large
glass entrance, bright daylight, clear sky, realistic architectural
photography, 3:1. No signage, no text, no logos, no people, no vehicles with
markings.

### B14 — Rawabi Home Outlet, living room (Options 2, 3, 4)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2 seller card; Option 3 promoted banner (left); Option 4 seller row — Rawabi Home Outlet. |
| 2 | Visual subject | A bright contemporary living room: a beige sofa with textured cushions, a glass-and-wood coffee table, open metal-and-wood shelving with ceramics and plants, a table lamp, a large window with sheer curtains; in one corner an armchair with a side table and lamp. |
| 3 | Composition | Sofa group at about x 20–65 %; the armchair corner at x 70–98 % (used for the Option 2 portrait crop); key content in the middle band y 25–75 %. |
| 4 | Aspect ratio | 3:1 master (crops 0.9:1, 2.8:1, 2.4:1). |
| 5 | Approximate resolution | 3600 × 1200 px |
| 6 | Background and lighting | Soft warm daylight, neutral beige and white palette. |
| 7 | Empty space for UI text | Option 3 banner: the start 45 % carries the name, subtitle and button over a dark gradient; because Arabic moves them to the other side, keep both outer thirds moderately calm. |
| 8 | Transparent background | No. |
| 9 | Replaces | `photo("swivel-chair", 2)` (Option 2) and `photo("floor-lamp", 1)` (Options 3 and 4). |

**Prompt.** Wide 3:1 interior photograph of a bright contemporary living
room: beige sofa with textured cushions, glass and wood coffee table, open
metal and wood shelving with ceramics and plants, a table lamp, a large
window with sheer curtains, and at the right an armchair with a side table
and lamp. Soft warm daylight, calm and uncluttered at both outer thirds,
realistic. No people, no text, no logos.

### B15 — Red Sea Trading Co., electronics warehouse (Options 2, 3, 4)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2 seller card; Option 3 promoted banner (right); Option 4 seller row — Red Sea Trading Co. |
| 2 | Visual subject | An electronics warehouse: racks of boxed TVs and a row of unboxed TVs with glowing blue abstract screens, cartons on pallets, blue-grey racking with deep perspective on one side. |
| 3 | Composition | TVs concentrated at x 50–95 %; racking perspective at x 5–45 % (a portrait crop there serves Option 2); key content in the middle band y 25–75 %. |
| 4 | Aspect ratio | 3:1 master (crops 0.9:1, 2.8:1, 2.4:1). |
| 5 | Approximate resolution | 3600 × 1200 px |
| 6 | Background and lighting | Cool industrial light with blue screen glow and warm carton tones. |
| 7 | Empty space for UI text | Option 3 banner text at the start side over a dark gradient; keep both outer thirds free of bright clutter. |
| 8 | Transparent background | No. |
| 9 | Replaces | `BRAND_PHOTOS.warehouseFloor` in all three options. |

**Prompt.** Wide 3:1 photograph of an electronics warehouse: on the right,
racks of boxed TVs and a row of unboxed flat-screen TVs with glowing blue
abstract screens; on the left, blue-grey pallet racking with cartons in deep
perspective. Cool industrial light, blue glow, warm carton tones, realistic.
No people, no signage, no text, no logos.

### B16 — Dar Al Majd Wholesale, appliance showroom (Option 2 card)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2 — Featured Sellers, Dar Al Majd Wholesale card cover. |
| 2 | Visual subject | White and stainless home appliances — a front-load washer, a dryer and a refrigerator — lined up in a bright, clean showroom. |
| 3 | Composition | Vertical, the washer centred and fully visible. |
| 4 | Aspect ratio | 4:5 portrait master (used at 0.9:1). |
| 5 | Approximate resolution | 1600 × 2000 px |
| 6 | Background and lighting | Bright, even showroom light, light grey floor. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | No. |
| 9 | Replaces | `photo("washer-front", 0)` (a studio shot on white) in `SELLER_CARDS`. |

**Prompt.** Vertical photograph of white and stainless home appliances — a
front-load washing machine in the centre, a dryer and a refrigerator beside
it — lined up in a bright clean showroom, even light, light grey floor,
realistic, 4:5. No text, no logos, no price tags, no people.

### B17 — Dar Al Majd Wholesale, warehouse with forklift (Options 3, 4)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 3 compact card; Option 4 seller row — Dar Al Majd Wholesale. |
| 2 | Visual subject | A wholesale warehouse aisle with a yellow forklift parked at the side and racking loaded with palletised goods. |
| 3 | Composition | Forklift at about x 40–70 %, racking behind; key content in the middle band y 25–75 %. |
| 4 | Aspect ratio | 5:2 master (crops 1.55:1 and 2.4:1). |
| 5 | Approximate resolution | 3000 × 1200 px |
| 6 | Background and lighting | Even industrial light, warm and clear. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | No. |
| 9 | Replaces | `BRAND_PHOTOS.warehouseRiyadh` crops in `COMPACT_SELLERS` (Option 3) and `SELLER_ROWS` (Option 4). |

**Prompt.** Wide 5:2 photograph of a wholesale warehouse aisle with a
yellow forklift parked at the side and racking loaded with palletised goods,
even warm industrial light, realistic. No people, no signage, no text, no
logos.

### B18 — Sahel Lifestyle, bright living and dining room (Options 2, 3, 4)

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2 seller card; Option 3 compact card; Option 4 seller row — Sahel Lifestyle. |
| 2 | Visual subject | An airy open-plan room with white walls: a cream linen sofa with blue and sand cushions, a light wooden coffee table and a large potted olive tree; behind, a round wooden dining table with chairs under a pendant lamp. |
| 3 | Composition | Sofa and coffee table at about x 10–50 % (Option 2 portrait crop and Option 4 wide crop around the sofa and olive tree); dining area at x 55–95 % (Option 3 crop); key content in the middle band y 25–75 %. |
| 4 | Aspect ratio | 3:1 master (crops 0.9:1, 1.55:1, 2.4:1). |
| 5 | Approximate resolution | 3600 × 1200 px |
| 6 | Background and lighting | Bright natural daylight, white, cream, light wood, soft blue accents. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | No. |
| 9 | Replaces | `photo("floor-lamp", 1)` (Option 2), `photo("dining-chairs", 1)` (Options 3 and 4). |

**Prompt.** Wide 3:1 interior photograph of an airy open-plan room with
white walls: on the left, a cream linen sofa with blue and sand cushions, a
light wooden coffee table and a large potted olive tree; on the right, a
round wooden dining table with chairs under a pendant lamp. Bright natural
daylight, calm and fresh, realistic. No people, no text, no logos.

---

## 5. Priority 3 briefs (optional)

### C1 — Option 3 handwritten phrase, vector

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 3 — hero copy tile, under the two buttons. |
| 2 | Visual subject | The phrase "Good things find new homes." in a relaxed blue handwritten script with three small gold sketch strokes, as drawn; an Arabic counterpart supplied by the owner's copy process (the handoff asks for a localised line, not a word-for-word copy). |
| 3 | Composition | Two lines, slightly rising; gold strokes at the end of the first line. |
| 4 | Aspect ratio | About 2.2:1. |
| 5 | Approximate resolution | Vector (SVG); about 300 × 135 px at display size. |
| 6 | Background and lighting | None (vector). Blue close to the design's indigo, gold close to #E1A932. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | Yes (SVG, transparent). |
| 9 | Replaces | The Caveat (English) / Aref Ruqaa (Arabic) text with inline SVG strokes in `components/concept-c/visual-discovery/Hero.jsx`. The phrase must stay readable by screen readers (the page keeps it as real text or as the SVG's accessible name). |

### C2 — Tan leather lounge armchair, cut-out

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2 — category row, "Furniture" (167 × 112 px, bottom-aligned). |
| 2 | Visual subject | A tan leather lounge armchair with wooden legs — the same chair as in A6 if possible. |
| 3 | Composition | Three-quarter front view, fills about 95 % of the trimmed height. |
| 4 | Aspect ratio | About 1:1 before trimming. |
| 5 | Approximate resolution | 1600 × 1600 px |
| 6 | Background and lighting | Transparent; soft studio light from the upper left. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | Yes. |
| 9 | Replaces | `cutout("swivel-chair")` (grey leather chair) in `CATEGORY_ROW`. |

### C3 — Black cooking pot, cut-out

| # | Field | Specification |
|---|---|---|
| 1 | Concept and section | Option 2 — category row, "Home & Kitchen" (167 × 112 px, bottom-aligned). |
| 2 | Visual subject | A black enamelled cast-iron casserole pot with lid and side handles, as drawn. |
| 3 | Composition | Three-quarter view from slightly above, fills about 90 % of the trimmed width. |
| 4 | Aspect ratio | About 3:2 before trimming. |
| 5 | Approximate resolution | 1600 × 1100 px |
| 6 | Background and lighting | Transparent; soft studio light with gentle highlights on the enamel. |
| 7 | Empty space for UI text | None. |
| 8 | Transparent background | Yes. |
| 9 | Replaces | `cutout("dutch-oven-blue")` (blue Dutch oven) in `CATEGORY_ROW`. |

---

## 6. Acceptance checklist (per asset)

- [ ] Generated fresh; nothing cropped or traced from the approved images or
      screenshots.
- [ ] No text, numbers, logos, signage or watermarks anywhere.
- [ ] No people.
- [ ] Catalogue products recognisably match their catalogue photographs; the
      recliner matches A1 in every scene.
- [ ] Text-free zones and product positions as specified; the subject stays
      whole in every listed crop.
- [ ] Master size at least as specified; sRGB.
- [ ] Cut-outs: clean alpha edge, no halo, no shadow, trimmed with about 2 %
      margin.
- [ ] Arabic companions are recomposed, never mirrored.

## 7. After delivery

1. Add the masters as new image keys (WebP at the display sizes) used only by
   the Options 2–4 home pages; keep every shared catalogue and brand photo
   in place, so Option 1 and the earlier-prototype screens do not change.
2. Re-tune crops and positions (`focus`, the Option 2 price-pin position, the
   Option 4 hero layout, which becomes a photograph instead of the CSS stage).
3. Re-run the 1440 px reference comparisons for Options 2–4, the EN/AR,
   desktop/mobile and accessibility checks, and the Option 1 regression
   gate, then submit for final homepage visual approval.
