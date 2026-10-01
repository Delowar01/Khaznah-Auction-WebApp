# Khaznah Priority 2 asset manifest

Temporary dummy imagery for the approved Options 2, 3 and 4 design preview. 25 individual PNG files; no collages.

The latest instruction accepts native dimensions suitable for preview slots. These files are below the original high-resolution master targets. No upscaling or stretching was performed. RGB values are embedded-tagged sRGB; B1-B4 have genuine alpha transparency.

Generation/corrections already completed before the preview-only update were retained. No additional generation occurred after the update. See production notes for the earlier revision log.

| ID | File | Actual pixels | Ratio | Mode / alpha | Bytes |
|---|---|---|---|---|---|
| B1 | B1_kz-shared-pallet-electronics-v1.png | 1418 x 1017 | 1418:1017 | RGBA / true | 1,738,748 |
| B2 | B2_kz-shared-pallet-kitchen-v1.png | 1430 x 1035 | 286:207 | RGBA / true | 1,745,574 |
| B3 | B3_kz-o2-tools-drill-v1.png | 1174 x 1220 | 587:610 | RGBA / true | 1,181,822 |
| B4 | B4_kz-o2-automotive-tyre-v1.png | 1016 x 1225 | 1016:1225 | RGBA / true | 1,677,787 |
| B5 | B5_kz-o3-hero-electronics-tv-v1.png | 1664 x 936 | 16:9 | RGB / false | 2,235,302 |
| B6 | B6_kz-o3-hero-kitchen-coffee-v1.png | 1536 x 1024 | 3:2 | RGB / false | 1,571,368 |
| B7a | B7a_kz-o3-wall-suede-tote-v1.png | 1086 x 1448 | 3:4 | RGB / false | 1,646,099 |
| B7b | B7b_kz-o3-wall-writing-desk-v1.png | 1615 x 969 | 5:3 | RGB / false | 1,388,627 |
| B7c | B7c_kz-o3-wall-spinner-suitcase-v1.png | 1615 x 969 | 5:3 | RGB / false | 1,142,408 |
| B7d | B7d_kz-o3-wall-coffee-maker-v1.png | 1615 x 969 | 5:3 | RGB / false | 1,261,780 |
| B7e | B7e_kz-o3-wall-task-lamp-v1.png | 1615 x 969 | 5:3 | RGB / false | 1,153,435 |
| B7f | B7f_kz-o3-wall-stand-mixer-v1.png | 1086 x 1448 | 3:4 | RGB / false | 1,478,163 |
| B8a | B8a_kz-o3-ending-car-seat-v1.png | 1774 x 887 | 2:1 | RGB / false | 1,295,653 |
| B8b | B8b_kz-o3-ending-split-ac-v1.png | 1774 x 887 | 2:1 | RGB / false | 1,299,773 |
| B8c | B8c_kz-o3-ending-washing-machine-v1.png | 1774 x 887 | 2:1 | RGB / false | 2,001,315 |
| B9 | B9_kz-shared-live-warehouse-aisle-v1.png | 1536 x 1024 | 3:2 | RGB / false | 2,482,324 |
| B10 | B10_kz-o3-live-electronics-warehouse-v1.png | 1536 x 1024 | 3:2 | RGB / false | 2,365,587 |
| B11 | B11_kz-o2-seller-khazna-racking-v1.png | 1120 x 1400 | 4:5 | RGB / false | 2,422,973 |
| B12 | B12_kz-o3-seller-khazna-cartons-v1.png | 1536 x 1024 | 3:2 | RGB / false | 1,845,071 |
| B13 | B13_kz-o4-seller-khazna-building-v1.png | 2172 x 724 | 3:1 | RGB / false | 1,930,694 |
| B14 | B14_kz-shared-seller-rawabi-living-v1.png | 2172 x 724 | 3:1 | RGB / false | 2,468,600 |
| B15 | B15_kz-shared-seller-redsea-electronics-v1.png | 2172 x 724 | 3:1 | RGB / false | 2,236,595 |
| B16 | B16_kz-o2-seller-daralmajd-showroom-v1.png | 1120 x 1400 | 4:5 | RGB / false | 1,593,591 |
| B17 | B17_kz-shared-seller-daralmajd-forklift-v1.png | 1980 x 792 | 5:2 | RGB / false | 2,136,628 |
| B18 | B18_kz-shared-seller-sahel-living-dining-v1.png | 2172 x 724 | 3:1 | RGB / false | 2,332,938 |

## B1 — B1_kz-shared-pallet-electronics-v1.png

- Placement: Options 2/3/4 Bulk & Pallets; Option 2 category; Option 4 seller thumbnail.
- Native generation: 1448 x 1086; original requested target: 2000 x 1500.
- Method: natively generated using built-in image_gen; alpha-cleaned; canvas-adjusted.
- Finishing: Alpha cleanup: removed alpha<=8 residue and disconnected specks outside the main silhouette; retained adjacent antialiasing and transparent internal openings. Normalized opaque interior alpha to255; cleared RGB in fully transparent pixels. Trimmed transparent surround and added approximately2%transparent margin per side; no product resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: No internal text zone; place live text beside the cut-out.
- Crop guidance: Contain the whole transparent pallet; do not use cover.
- Limitation: Below original requested 2000x1500 master target; native resolution accepted for dummy/preview use under latest instruction. Generic preview pallet; carton arrangement and timber construction approximate the design.
- SHA-256: `656579acd2e628debeec43e10bdee736967f580935760abea2661a0f0c9fbfe0`
- Alpha check: corners all 0; outer-edge nonzero pixels 0; 11,275 antialiased pixels; transparent margins approximately 2.045% horizontal / 2.065% vertical per side.

## B2 — B2_kz-shared-pallet-kitchen-v1.png

- Placement: Options 2/3/4 kitchen pallet.
- Native generation: 1448 x 1086; original requested target: 2000 x 1500.
- Method: natively generated using built-in image_gen; reference-guided; alpha-cleaned; canvas-adjusted.
- Finishing: Alpha cleanup: removed alpha<=8 residue and disconnected specks outside the main silhouette; retained adjacent antialiasing and transparent internal openings. Normalized opaque interior alpha to255; cleared RGB in fully transparent pixels. Trimmed transparent surround and added approximately2%transparent margin per side; no product resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: B1 (generated reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: No internal text zone.
- Crop guidance: Contain the whole pallet; same apparent pallet width as B1.
- Limitation: Below original requested 2000x1500 master target; native resolution accepted for dummy/preview use under latest instruction. Matched pallet treatment with simple unlettered appliance pictograms; arrangement is illustrative.
- SHA-256: `39094daeb8155ea08787426b21434b2625ba448428b8a6942d4be7e6db5a988e`
- Alpha check: corners all 0; outer-edge nonzero pixels 0; 10,920 antialiased pixels; transparent margins approximately 2.028% horizontal / 2.029% vertical per side.

## B3 — B3_kz-o2-tools-drill-v1.png

- Placement: Option 2 Tools & DIY category.
- Native generation: 1254 x 1254; original requested target: 1600 x 1600.
- Method: natively generated using built-in image_gen; alpha-cleaned; canvas-adjusted.
- Finishing: Alpha cleanup: removed alpha<=8 residue and disconnected specks outside the main silhouette; retained adjacent antialiasing and transparent internal openings. Normalized opaque interior alpha to255; cleared RGB in fully transparent pixels. Trimmed transparent surround and added approximately2%transparent margin per side; no product resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: None required.
- Crop guidance: Contain; keep chuck facing left in both language layouts.
- Limitation: Below original requested 1600x1600 master target; native resolution accepted for dummy/preview use under latest instruction. Generic drill, not a branded catalogue SKU.
- SHA-256: `bc604b50796ee8b37906932c8b43cbb316170577bc585fab772457761fab0c7f`
- Alpha check: corners all 0; outer-edge nonzero pixels 0; 9,146 antialiased pixels; transparent margins approximately 2.044% horizontal / 2.049% vertical per side.

## B4 — B4_kz-o2-automotive-tyre-v1.png

- Placement: Option 2 Automotive category.
- Native generation: 1254 x 1254; original requested target: 1600 x 1600.
- Method: natively generated using built-in image_gen; alpha-cleaned; canvas-adjusted.
- Finishing: Alpha cleanup: removed alpha<=8 residue and disconnected specks outside the main silhouette; retained adjacent antialiasing and transparent internal openings. Normalized opaque interior alpha to255; cleared RGB in fully transparent pixels. Trimmed transparent surround and added approximately2%transparent margin per side; no product resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: None required.
- Crop guidance: Contain; do not mirror or crop the tyre.
- Limitation: Below original requested 1600x1600 master target; native resolution accepted for dummy/preview use under latest instruction. Generic wheel and tyre; fine tread and rim geometry are illustrative.
- SHA-256: `8c489d2518ec4bfe766317c97d00a940df253b0c203659327eaf9b83dbc24663`
- Alpha check: corners all 0; outer-edge nonzero pixels 0; 10,483 antialiased pixels; transparent margins approximately 2.067% horizontal / 2.041% vertical per side.

## B5 — B5_kz-o3-hero-electronics-tv-v1.png

- Placement: Option 3 hero Electronics tile.
- Native generation: 1672 x 941; original requested target: 2400 x 1350.
- Method: natively generated using built-in image_gen; reference-guided; deterministically cropped.
- Finishing: Exact-ratio integer crop from native canvas: [4, 2, 1668, 938]. No resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: tv-43-0-1200.webp (catalogue identity reference); tv-43-1-1200.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Lower-left for HTML label; lower-right for arrow, using the existing label backing if needed.
- Crop guidance: Start at 60% 48%; inspect the 1.64:1 desktop, 2.57:1 tablet and 1.93:1 phone slots.
- Limitation: Below original requested 2400x1350 master target; native resolution accepted for dummy/preview use under latest instruction. TV position and quiet lower corners approximate the brief; tablet-wide cover crops can crop the stand. Tune focus or use contain if whole-product visibility is needed.
- SHA-256: `028d1f470687a5e36194b035000cb6fcc537e4ec641985e72e7ab68e817b05f6`

## B6 — B6_kz-o3-hero-kitchen-coffee-v1.png

- Placement: Option 3 hero Home & Kitchen tile.
- Native generation: 1536 x 1024; original requested target: 2400 x 1600.
- Method: natively generated using built-in image_gen; reference-guided.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: capsule-coffee-0-1200.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Lower counter and both bottom corners kept relatively clear.
- Crop guidance: Start at 68% 50%; retain full machine and lower counter; avoid aggressive vertical cover crops.
- Limitation: Below original requested 2400x1600 master target; native resolution accepted for dummy/preview use under latest instruction. Catalogue machine is recognisable but generated details are not pixel-exact. Very wide tablet crops require tuning.
- SHA-256: `7ea4bc56b160febc2c1678b5ee6058fd8424bfa71f685d2257c5334845d2f9df`

## B7a — B7a_kz-o3-wall-suede-tote-v1.png

- Placement: Option 3 Buy Now product wall, tall tote card.
- Native generation: 1086 x 1448; original requested target: 1500 x 2000.
- Method: natively generated using built-in image_gen; reference-guided.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: suede-tote-0-1200.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Quiet upper corners for favourite control; approximately 15% upper space.
- Crop guidance: Centre; retain the whole chain, handles and loose shoulder strap in desktop and phone crops.
- Limitation: Below original requested 1500x2000 master target; native resolution accepted for dummy/preview use under latest instruction. Chain, strap and suede texture are generated approximations.
- SHA-256: `0535e399da15335e214046c24d4f9caec7cfa43512821d4b2973a874847da602`

## B7b — B7b_kz-o3-wall-writing-desk-v1.png

- Placement: Option 3 Buy Now product wall, writing desk.
- Native generation: 1619 x 971; original requested target: 2000 x 1200.
- Method: natively generated using built-in image_gen; reference-guided; deterministically cropped.
- Finishing: Exact-ratio integer crop from native canvas: [2, 1, 1617, 970]. No resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: hairpin-desk-0-1200.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Quiet top corners; shelf enters part of the nominal top 15% band.
- Crop guidance: Centre; keep tabletop ends and all four feet visible at 1.84:1 desktop and 1.33:1 phone.
- Limitation: Below original requested 2000x1200 master target; native resolution accepted for dummy/preview use under latest instruction. Desk compartments and hairpin legs are recognisable; small joinery details may differ.
- SHA-256: `a9103dd720f981ae467ac221e08562eb5902e7967c9785ec70394319d6c6b767`

## B7c — B7c_kz-o3-wall-spinner-suitcase-v1.png

- Placement: Option 3 Buy Now product wall, spinner suitcase.
- Native generation: 1620 x 971; original requested target: 2000 x 1200.
- Method: natively generated using built-in image_gen; reference-guided; generatively edited before preview-only update; deterministically cropped.
- Finishing: Exact-ratio integer crop from native canvas: [2, 1, 1617, 970]. No resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: Camera/background reframing was generated inside a replacement native canvas; not pixel-preserving outpainting.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: hardside-spinner-0-1200.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Generous empty upper band after handle retraction.
- Crop guidance: Centre, with body and wheels wholly visible in both landscape product slots.
- Limitation: Below original requested 2000x1200 master target; native resolution accepted for dummy/preview use under latest instruction. Telescopic handle deliberately retracted per brief; rib spacing, wheel details and reflections approximate catalogue.
- SHA-256: `ae4d1d68ff5accbddeaacf11bff52f75b7ec20588e8428600d011159c17a26fb`

## B7d — B7d_kz-o3-wall-coffee-maker-v1.png

- Placement: Option 3 Buy Now product wall, coffee maker.
- Native generation: 1619 x 971; original requested target: 2000 x 1200.
- Method: natively generated using built-in image_gen; reference-guided; generatively edited before preview-only update; deterministically cropped.
- Finishing: Exact-ratio integer crop from native canvas: [2, 1, 1617, 970]. No resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: Camera/background reframing was generated inside a replacement native canvas; not pixel-preserving outpainting.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: capsule-coffee-0-1200.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Approximately top 15% quiet peach sweep.
- Crop guidance: Centre; keep cups and machine together at desktop and phone ratios.
- Limitation: Below original requested 2000x1200 master target; native resolution accepted for dummy/preview use under latest instruction. Two brown ceramic cups accompany the catalogue-inspired machine; small control details approximate source.
- SHA-256: `9079d82cd0e918844eda81d97ecfe6d1e4f9165ab869c3dcb602c1d2b89d20ff`

## B7e — B7e_kz-o3-wall-task-lamp-v1.png

- Placement: Option 3 Buy Now product wall, task lamp.
- Native generation: 1619 x 971; original requested target: 2000 x 1200.
- Method: natively generated using built-in image_gen; reference-guided; generatively edited before preview-only update; deterministically cropped.
- Finishing: Exact-ratio integer crop from native canvas: [2, 1, 1617, 970]. No resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: Camera/background reframing was generated inside a replacement native canvas; not pixel-preserving outpainting.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: task-lamp-0-1200.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Top approximately 20% clear.
- Crop guidance: Centre; preserve top finial and round base.
- Limitation: Below original requested 2000x1200 master target; native resolution accepted for dummy/preview use under latest instruction. Arm joints and shade surface are generated approximations.
- SHA-256: `62e355c391dcba717361c47b78615d2d308486d2d9b002f5c63d2fcd3a9cefd1`

## B7f — B7f_kz-o3-wall-stand-mixer-v1.png

- Placement: Option 3 Buy Now product wall, tall mixer card.
- Native generation: 1086 x 1448; original requested target: 1500 x 2000.
- Method: natively generated using built-in image_gen; reference-guided.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: stand-mixer-0-1200.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Quiet upper band and corners.
- Crop guidance: Centre, preserve head and base in tall desktop and phone cards.
- Limitation: Below original requested 1500x2000 master target; native resolution accepted for dummy/preview use under latest instruction. Mixer controls and bowl reflections approximate the source; tiny plant appears at left.
- SHA-256: `a24b3ce2ee70f4ad1608b9c973a139406311142749fad3bd559eab168002866c`

## B8a — B8a_kz-o3-ending-car-seat-v1.png

- Placement: Option 3 Ending soon car-seat card.
- Native generation: 1774 x 887; original requested target: 2400 x 1200.
- Method: natively generated using built-in image_gen; reference-guided; generatively edited before preview-only update.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: Camera/background reframing was generated inside a replacement native canvas; not pixel-preserving outpainting.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: seat-covers-2-1200.webp (catalogue identity reference); seat-covers-0-800.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Top quarter is plain, exceeding the requested 22% timer/favourite clearance.
- Crop guidance: Centre; preserve complete headrest and low base in roughly 2.1:1 card crops.
- Limitation: Below original requested 2400x1200 master target; native resolution accepted for dummy/preview use under latest instruction. Seat-cover seams approximate the reference; standalone seat is a preview representation.
- SHA-256: `062c76f7e87b6661caac5d3b23c6baee95777edd7794f15d2ad23450b073fa79`

## B8b — B8b_kz-o3-ending-split-ac-v1.png

- Placement: Option 3 Ending soon split-AC card.
- Native generation: 1774 x 887; original requested target: 2400 x 1200.
- Method: natively generated using built-in image_gen; reference-guided.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: split-ac-0-1200.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Top approximately 22% clear.
- Crop guidance: Centre; preserve both ends and open lower vent.
- Limitation: Below original requested 2400x1200 master target; native resolution accepted for dummy/preview use under latest instruction. Natural elongated AC proportion takes less height than other ending-soon products.
- SHA-256: `b00e1330072841ae420117d6c1beeb948da429058bbd25706fd0a2e4cba0b3d0`

## B8c — B8c_kz-o3-ending-washing-machine-v1.png

- Placement: Option 3 Ending soon washer card.
- Native generation: 1774 x 887; original requested target: 2400 x 1200.
- Method: natively generated using built-in image_gen; reference-guided; generatively edited before preview-only update.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: Camera/background reframing was generated inside a replacement native canvas; not pixel-preserving outpainting.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: washer-front-0-1200.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Top approximately 25% calm wall.
- Crop guidance: Centre; preserve entire appliance in roughly 2.1:1 card crops.
- Limitation: Below original requested 2400x1200 master target; native resolution accepted for dummy/preview use under latest instruction. Catalogue washer is recognisable; small dial/door geometry and reflections approximate source. Four blank physical buttons retained.
- SHA-256: `38716384893c9104605d081d9a483f7a278628d94cf817b0025f7d1a04711b87`

## B9 — B9_kz-shared-live-warehouse-aisle-v1.png

- Placement: Options 2/4 Live Auction background.
- Native generation: 1536 x 1024; original requested target: 3600 x 2400.
- Method: natively generated using built-in image_gen.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context); A2 (Priority 1 compatibility).
- Text-safe area: Central floor x30-70%, lower area for A2/live HTML; use existing dark gradient for white text.
- Crop guidance: Focus around 55% 55%; retain central floor for A2 in Option 4; inspect portrait phone crop.
- Limitation: Below original requested 3600x2400 master target; native resolution accepted for dummy/preview use under latest instruction. Native output is sufficient for preview slots but below the original 3600x2400 master target. Floor perspective needs alignment with the separate A2 overlay.
- SHA-256: `d44a7737786dee66ccde8db3c17574a9d84a61fa6517d95b839fdfd08ee40959`

## B10 — B10_kz-o3-live-electronics-warehouse-v1.png

- Placement: Option 3 Live Auction video still.
- Native generation: 1536 x 1024; original requested target: 2400 x 1600.
- Method: natively generated using built-in image_gen.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: WORK_DESIGN_MISSING_ASSETS.md (brief); 02_Visual_Discovery_Khaznah_Theme.png (approved design context).
- Text-safe area: Centre kept reasonably calm for play button; use existing badge backing.
- Crop guidance: Start centre; inspect 1.92:1 wide and 1.16:1 tablet slots.
- Limitation: Below original requested 2400x1600 master target; native resolution accepted for dummy/preview use under latest instruction. Illustrative electronics warehouse; TV/rack details may vary from the reference mockup.
- SHA-256: `569563f48a62d6231e91fd16c0bc6edb3ad0c5edb39879841a7944c951f51fe4`

## B11 — B11_kz-o2-seller-khazna-racking-v1.png

- Placement: Option 2 Khazna Direct seller cover.
- Native generation: 1122 x 1402; original requested target: 1600 x 2000.
- Method: natively generated using built-in image_gen; reference-guided; generatively edited before preview-only update; deterministically cropped.
- Finishing: Exact-ratio integer crop from native canvas: [1, 1, 1121, 1401]. No resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: None required.
- Crop guidance: Centre at 50% 55% for the 0.9:1 seller cover.
- Limitation: Below original requested 1600x2000 master target; native resolution accepted for dummy/preview use under latest instruction. Racking appears more blue than blue-grey; stair/rail detail is illustrative.
- SHA-256: `e26ab0f815b2971fd971e33c490fe6dda4e8ae6d95cf83af5923acad932cf38d`

## B12 — B12_kz-o3-seller-khazna-cartons-v1.png

- Placement: Option 3 Khazna Direct compact seller.
- Native generation: 1536 x 1024; original requested target: 2400 x 1600.
- Method: natively generated using built-in image_gen.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: None required.
- Crop guidance: Centre; slight trim from 3:2 to 1.55:1 retains stack.
- Limitation: Below original requested 2400x1600 master target; native resolution accepted for dummy/preview use under latest instruction. Plain carton stack intentionally has no seller branding.
- SHA-256: `a03f58ffa269962684c5f58800672b1297bd389625e6d800d1a57095c9bf7d10`

## B13 — B13_kz-o4-seller-khazna-building-v1.png

- Placement: Option 4 Khazna Direct seller row.
- Native generation: 2172 x 724; original requested target: 3000 x 1000.
- Method: natively generated using built-in image_gen.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: None required.
- Crop guidance: Keep central glass entrance for 2.4:1 row crop.
- Limitation: Below original requested 3000x1000 master target; native resolution accepted for dummy/preview use under latest instruction. Generic illustrative building, not a photograph of the seller's actual premises. Wide facade ends may trim in 2.4:1.
- SHA-256: `95eccd76e33e83afc466baac61b3928f8195a87ce6b068b44caa8416f390af3f`

## B14 — B14_kz-shared-seller-rawabi-living-v1.png

- Placement: Options 2/3/4 Rawabi Home Outlet seller.
- Native generation: 2172 x 724; original requested target: 3600 x 1200.
- Method: natively generated using built-in image_gen.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: Both outer thirds usable with existing dark HTML gradient; not uniform blank space.
- Crop guidance: Option 2 portrait: right armchair around 85% 55%; Option 3/4 wide: centre. Tune each independently.
- Limitation: Below original requested 3600x1200 master target; native resolution accepted for dummy/preview use under latest instruction. Illustrative seller interior; furniture may not sit precisely within the requested middle band.
- SHA-256: `e65928f81211639e56da3893ec8be664b654bd7044c2ff96c6deea60b0df364c`

## B15 — B15_kz-shared-seller-redsea-electronics-v1.png

- Placement: Options 2/3/4 Red Sea Trading Co seller.
- Native generation: 2172 x 724; original requested target: 3600 x 1200.
- Method: natively generated using built-in image_gen; reference-guided.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: B10 (generated reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: Outer thirds support HTML text with existing gradient; blue screens remain visually bright.
- Crop guidance: Option 2 portrait: left racking around 23% 50%; Option 3/4 wide: centre.
- Limitation: Below original requested 3600x1200 master target; native resolution accepted for dummy/preview use under latest instruction. Same navy electronics-warehouse visual family as B10, not a physically exact reconstructed room.
- SHA-256: `8c8c8c71efd9952e6cd8ce805a06d55fb9c11d3cbf8278c71159db6944c22fce`

## B16 — B16_kz-o2-seller-daralmajd-showroom-v1.png

- Placement: Option 2 Dar Al Majd seller cover.
- Native generation: 1122 x 1402; original requested target: 1600 x 2000.
- Method: natively generated using built-in image_gen; reference-guided; deterministically cropped.
- Finishing: Exact-ratio integer crop from native canvas: [1, 1, 1121, 1401]. No resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: washer-front-0-1200.webp (catalogue identity reference); WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: None required.
- Crop guidance: Centre; retain entire foreground washer for 0.9:1 cover.
- Limitation: Below original requested 1600x2000 master target; native resolution accepted for dummy/preview use under latest instruction. Generic showroom; washer is catalogue-inspired and small controls differ from B8c.
- SHA-256: `58ee061137dc0ebbb23b871223e3ed2952bf1c923abea5fa7207fee5e086c0cf`

## B17 — B17_kz-shared-seller-daralmajd-forklift-v1.png

- Placement: Options 3/4 Dar Al Majd seller.
- Native generation: 1983 x 793; original requested target: 3000 x 1200.
- Method: natively generated using built-in image_gen; reference-guided; generatively edited before preview-only update; deterministically cropped.
- Finishing: Exact-ratio integer crop from native canvas: [1, 0, 1981, 792]. No resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: Camera/background reframing was generated inside a replacement native canvas; not pixel-preserving outpainting.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: None required.
- Crop guidance: Start at 50% 50%; 1.55:1 central crop preserves mast and forks; check 2.4:1 row.
- Limitation: Below original requested 3000x1200 master target; native resolution accepted for dummy/preview use under latest instruction. Forklift occupies more vertical space than the nominal y25-75% band, but whole subject remains available in the master.
- SHA-256: `7f6e004f63455b6668aad1743c3c81edfded0fbc7302518070c7fd74d5975e03`

## B18 — B18_kz-shared-seller-sahel-living-dining-v1.png

- Placement: Options 2/3/4 Sahel Lifestyle seller.
- Native generation: 2172 x 724; original requested target: 3600 x 1200.
- Method: natively generated using built-in image_gen.
- Finishing: Native canvas retained; no crop or resampling. Assigned embedded sRGB ICC profile to originally untagged RGB values; lossless PNG export.
- Generative extension/reframing: None; no separate outpainting step.
- Approved-source pixel compositing: none. All product plates were generated from visual references.
- Sources: WORK_DESIGN_MISSING_ASSETS.md (brief); 01_Premium_Modern_Khaznah_Charcoal_Brass.png, 02_Visual_Discovery_Khaznah_Theme.png, 03_Contemporary_Saudi_Commerce.png (approved design context).
- Text-safe area: None required.
- Crop guidance: Option 2 portrait: left sofa around 27% 55%; Option 3 compact: right dining area around 76% 50%; Option 4 wide: left-centre.
- Limitation: Below original requested 3600x1200 master target; native resolution accepted for dummy/preview use under latest instruction. Illustrative interior; narrow crops show selected furniture groups rather than the whole room.
- SHA-256: `fa72b679cff258a01678f3495858a1a0fe1de7fbef9fc7a3039e8ea0bb0bd465`

Source URLs and reference checksums are recorded in the JSON manifest.
