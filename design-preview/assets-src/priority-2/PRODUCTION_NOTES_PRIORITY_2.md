# Production notes — Khaznah Priority 2

## Delivery status

25 separate PNG assets for temporary design-preview use, plus Markdown/JSON manifests. These are illustrative dummy photographs, not evidence of seller premises, available stock or exact manufacturer specifications.

The user changed the acceptance standard to speed and low usage after all subjects and earlier corrections had been generated. Existing selected files were retained; no additional image-generation calls followed that update. Minor appearance differences and native-resolution shortfalls are accepted and listed rather than regenerated.

## Production and validation

- Built-in image_gen used, one separate output per subject. No CLI/API fallback.
- No screenshot pixels, application code, Priority 1 deliverables or optional C-series assets included.
- No contact sheets, collages, labels or presentation boards created as deliverables.
- No resizing, upscaling, stretching or sharpening of the photographic content.
- Photographs retained native size or received a few-pixel integer crop to the exact brief ratio.
- All PNGs tagged with an embedded sRGB ICC profile; source RGB values were untagged and were not colour-transformed.
- B1-B4 retain genuine alpha. Basic cleanup removes low-alpha residue and disconnected specks, makes material interiors opaque, and keeps adjacent antialiasing/internal openings. Approximately 2% transparent padding added without scaling the subjects.
- Technical checks cover decoding, aspect ratios, dimensions, colour mode, alpha presence, empty outer edges, file count and SHA-256. ZIP CRC and manifest hashes are checked after packaging.
- Visual checks cover broad subject, whole principal product, no obvious people/UI/lettering and usable preview composition. This is preview acceptance, not a claim of pixel-exact product fidelity.

## Product identity

Catalogue files were read from the user-provided repository/branch; the repository was not changed. Referenced products preserve recognisable shape/colour/material. Logo and printed markings were omitted. Generated textures, controls, stitching, reflections and joints can differ. No approved catalogue pixels were composited into the final images.

B1/B2 share light-timber pallet, kraft cartons, three-quarter camera and neutral lighting. B6/B7d use the same red capsule-machine reference. B10/B15 share the electronics-warehouse visual direction. The B9 floor is clear for later placement of approved A2; A2 is not baked in or included.

## Earlier rejected/re-generated items

These iterations happened before the speed/one-pass update. Only one selected image per ID is delivered; no trials or alternatives are packaged.
- B2: Mixed flat TV-style cartons instead of fairly uniform medium appliance cartons.
- B6: Coffee maker framed too large; lower overlay clearance insufficient.
- B7c: Insufficient full-width top15%clear band.
- B7d: Glass cups instead of brown ceramic; product too large for specified safe band.
- B7e: Insufficient full-width top15%clear band.
- B7c: Second framing edit unintentionally extended the telescopic handle.
- B8a: Headrest intruded into the required top 22% overlay band.
- B8c: Top 22% clearance insufficient; physical control buttons below display omitted.
- B17: Vehicle marking and carton/rack paper labels present; mast needed more headroom.
- B17: Residual small manufacturer/pallet stamps removed.
- B11: Residual small manufacturer/pallet stamps removed.

## Text-safe areas and crop notes

Keep all text, prices, badges, play buttons, seller names and branding in HTML. Never mirror photographs for Arabic. Crop coordinates below are starting points, not implementation changes made in this task.
- B1: No internal text zone; place live text beside the cut-out. Contain the whole transparent pallet; do not use cover.
- B2: No internal text zone. Contain the whole pallet; same apparent pallet width as B1.
- B3: None required. Contain; keep chuck facing left in both language layouts.
- B4: None required. Contain; do not mirror or crop the tyre.
- B5: Lower-left for HTML label; lower-right for arrow, using the existing label backing if needed. Start at 60% 48%; inspect the 1.64:1 desktop, 2.57:1 tablet and 1.93:1 phone slots.
- B6: Lower counter and both bottom corners kept relatively clear. Start at 68% 50%; retain full machine and lower counter; avoid aggressive vertical cover crops.
- B7a: Quiet upper corners for favourite control; approximately 15% upper space. Centre; retain the whole chain, handles and loose shoulder strap in desktop and phone crops.
- B7b: Quiet top corners; shelf enters part of the nominal top 15% band. Centre; keep tabletop ends and all four feet visible at 1.84:1 desktop and 1.33:1 phone.
- B7c: Generous empty upper band after handle retraction. Centre, with body and wheels wholly visible in both landscape product slots.
- B7d: Approximately top 15% quiet peach sweep. Centre; keep cups and machine together at desktop and phone ratios.
- B7e: Top approximately 20% clear. Centre; preserve top finial and round base.
- B7f: Quiet upper band and corners. Centre, preserve head and base in tall desktop and phone cards.
- B8a: Top quarter is plain, exceeding the requested 22% timer/favourite clearance. Centre; preserve complete headrest and low base in roughly 2.1:1 card crops.
- B8b: Top approximately 22% clear. Centre; preserve both ends and open lower vent.
- B8c: Top approximately 25% calm wall. Centre; preserve entire appliance in roughly 2.1:1 card crops.
- B9: Central floor x30-70%, lower area for A2/live HTML; use existing dark gradient for white text. Focus around 55% 55%; retain central floor for A2 in Option 4; inspect portrait phone crop.
- B10: Centre kept reasonably calm for play button; use existing badge backing. Start centre; inspect 1.92:1 wide and 1.16:1 tablet slots.
- B11: None required. Centre at 50% 55% for the 0.9:1 seller cover.
- B12: None required. Centre; slight trim from 3:2 to 1.55:1 retains stack.
- B13: None required. Keep central glass entrance for 2.4:1 row crop.
- B14: Both outer thirds usable with existing dark HTML gradient; not uniform blank space. Option 2 portrait: right armchair around 85% 55%; Option 3/4 wide: centre. Tune each independently.
- B15: Outer thirds support HTML text with existing gradient; blue screens remain visually bright. Option 2 portrait: left racking around 23% 50%; Option 3/4 wide: centre.
- B16: None required. Centre; retain entire foreground washer for 0.9:1 cover.
- B17: None required. Start at 50% 50%; 1.55:1 central crop preserves mast and forks; check 2.4:1 row.
- B18: None required. Option 2 portrait: left sofa around 27% 55%; Option 3 compact: right dining area around 76% 50%; Option 4 wide: left-centre.

## Integration handoff

No integration, repository edits, commits or deployment were performed. After independent approval, use new image keys scoped to Options 2-4; retain existing shared catalogue files. Generate smaller WebP derivatives from these masters, avoid enlarging for preview, and check EN/AR at the existing breakpoints. Use contain for cut-outs. Hero and shared seller crops require slot-specific focus; a single global focus value cannot serve every ratio. Preserve the separate files and B identifiers.

## Final prompt set

These are the latest prompts used for the delivered selections. For revised items, the latest prompt is an edit prompt applied to the already generated scene; catalogue sources are listed in the manifests.

### B1

Generate exactly ONE standalone photorealistic ecommerce product cut-out, not a collage or presentation. Real transparent RGBA background, clean anti-aliased silhouette, about 2% transparent margin at subject edges. Whole subject visible, no clipping. No text, numbers, logos, brand marks, labels, watermarks, UI, people, floor, background color, checkerboard or baked shadow. sRGB neutral white balance, soft upper-left studio key. Highest genuine native resolution; do not enlarge or stretch. One standard light-timber wooden shipping pallet stacked with mixed-size plain kraft cardboard shipping cartons. Several small cube cartons and a few large flat TV-size cartons behind, neat clear-taped stacking. Pallet deck boards, blocks and fork openings fully visible. Three-quarter view from20â€“25degrees above, front pallet corner pointing at viewer. Overall subject approximately1.4times wider than tall. No printed pictograms needed, keep boxes plain. Target2000x1500,4:3 landscape before tight transparent trimming.

### B2

Create ONE transparent ecommerce product cutout, real alpha. Reference shows ONLY the pallet wood, camera angle and neutral upper-left lighting to match; REPLACE ITS ENTIRE CARTON ARRANGEMENT. New arrangement: 12 medium nearly equal-size squat cubic kraft appliance cartons in a neat 3-columns by2-deep by2-high stack, some offset slightly but stable. NO tall flat cartons, NO TV-shaped cartons. Whole light-timber shipping pallet visible underneath, same front-corner camera20â€“25degrees from above, broad stack1.4times wider than tall. A few tiny unlettered kettle/pot/microwave outline pictograms only. All carton labels/logos/words absent. Real clean alpha transparent background, no floor, no baked shadow, no checkerboard, no people. 4:3 target2000x1500 native, whole subject with2%margin, photorealistic.

### B3

Generate exactly ONE standalone photorealistic ecommerce product cut-out, not a collage or presentation. Real transparent RGBA background, clean anti-aliased silhouette, about 2% transparent margin at subject edges. Whole subject visible, no clipping. No text, numbers, logos, brand marks, labels, watermarks, UI, people, floor, background color, checkerboard or baked shadow. sRGB neutral white balance, soft upper-left studio key. Highest genuine native resolution; do not enlarge or stretch. One generic cordless drill/driver, blue and black moulded body, black rubber grip, black battery pack, keyless chuck with SHORT steel drill bit. Upright on battery, left-facing side view with slight three-quarter angle. Chuck points LEFT. Mechanically credible grip, trigger, battery and vents. Plain torque collar without numbers or labels. Target1600x1600 square before tight transparent trimming.

### B4

Generate exactly ONE standalone photorealistic ecommerce product cut-out, not a collage or presentation. Real transparent RGBA background, clean anti-aliased silhouette, about 2% transparent margin at subject edges. Whole subject visible, no clipping. No text, numbers, logos, brand marks, labels, watermarks, UI, people, floor, background color, checkerboard or baked shadow. sRGB neutral white balance, soft upper-left studio key. Highest genuine native resolution; do not enlarge or stretch. One single automotive tyre mounted on a dark graphite multi-spoke alloy wheel. Upright on tread, three-quarter view showing full wheel face plus clearly visible side tread. Realistic repeating tyre tread blocks, real rim and lug geometry. Smooth plain sidewall without any lettering, numbers or manufacturer logos. Target1600x1600 square before tight transparent trimming.

### B5

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Bright lifestyle scene of the reference thin-black-bezel TV, on its slim feet above a low simple console, vivid abstract blue ocean-wave screen ONLY. TV approximately x38â€“95%, y8â€“72%, slight turn to left. Green plant at left x0â€“28%, warm beige wall. Quiet lower-left x0â€“52%, y62â€“95% and lower-right x85â€“97%,y70â€“93% for future HTML overlay, no overlay drawn. Soft bright daylight. Match TV design but omit printed logo and remote control. Output 16:9 aspect ratio; target 2400x1350 native pixels.

### B6

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. The EXACT reference red capsule coffee machine, same tall red rectangular rounded housing, protruding brew head, three round top buttons, silver slotted circular drip tray, transparent right water tank, design/colour/proportions preserved, omit all lettering. Machine on a light counter against peach-pink wall near #F3CDB8, right half x58â€“88%,y12â€“78%. Low white utensil crock with wooden spoons and white cup to left x5â€“45%, small wooden canister far right. Keep lower-left x0â€“58%,y65â€“95% and bottom-right x85â€“97%,y80â€“97% calm counter for HTML overlays, no overlay drawn. Warm soft daylight. Output 3:2 aspect ratio; target 2400x1600 native pixels. CRITICAL framing correction: zoom the CAMERA OUT, so the entire coffee maker height is only60â€“65%of the canvas, at x60â€“90% and y12â€“76%, with visibly empty counter below it. Keep all props ABOVE y65% by placing them farther back on the counter. Entire LOWER28% must be clear counter surface, except machine may extend only down to y76%. No oversized foreground props, no plants or foreground additions. Preserve the original coffee maker proportions.

### B7a

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Seamless tinted studio sweep, soft natural floor shadow, upper-left soft studio key. Product alone centred in three-quarter view, wholly visible about70%of frame height, all parts within middle60%width where geometry allows. Top15% and top corners empty for future HTML overlays. Preserve reference product identity; remove only printed marks. Exact reference cognac suede tote, seam down front, handles upright, gold chain-and-leather handles and long loose shoulder strap, warm cream background #F6ECDF. Full strap and bag, not cropped. Output 3:4 aspect ratio; target 1500x2000 native pixels.

### B7b

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Seamless tinted studio sweep, soft natural floor shadow, upper-left soft studio key. Product alone centred in three-quarter view, wholly visible about70%of frame height, all parts within middle60%width where geometry allows. Top15% and top corners empty for future HTML overlays. Preserve reference product identity; remove only printed marks. Exact reference walnut hairpin-leg writing desk, low raised rear shelf with two dividers and curved side ends, central shallow drawer, FOUR black hairpin legs, peach-beige #F3EBE3 background. Whole tabletop and every foot visible. Preserve realistic width/height; frame entire desk within central70%width to permit phone crop. Output 5:3 aspect ratio; target 2000x1200 native pixels.

### B7c

Use case: precise-object-edit. Edit this one photograph ONLY to retract the suitcase telescopic handle fully into its housing: remove the extended twin metal rods and top pull grip above the case. Leave only the small flush handle on top of the silver case. Preserve exactly the shell, ribs, zips, side handle, four wheels, camera angle, body size and body position, pale blue sweep, shadow and lighting. Do NOT enlarge the suitcase to fill the vacated handle space. Keep the empty space above, same 5:3 canvas. No new objects, no lettering, no logos, no UI. Highest genuine native resolution, no artificial upscale.

### B7d

Correct the existing single product plate. Replace the TWO GLASS cups with TWO SMALL OPAQUE BROWN CERAMIC espresso cups, matching the brief; no transparent glass. Keep exact same red coffee machine, but pull camera back so it occupies y20% through88% (68%image height), all products grouped within central60%width. Upper18%completely empty peach seamless sweep, same soft lighting and contact shadow. No letters, brands or logos. 5:3, no frame. First reference is edit target; second reference defines product identity. Standalone photorealistic ecommerce photograph, highest genuine native resolution targeting2000x1200, sRGB, no people, UI, labels, logos, text, watermark or collage.

### B7e

Reframe existing single product plate: pull camera back so entire unchanged navy-and-brass lamp including top finial occupies y20% through88%(68%of canvas height). Keep all details and original proportions, centred x50%, same blue-grey seamless sweep. TOP18%must be completely product-free all across the width. Bottom12%empty floor. No words, marks, logos or extra objects. 5:3. First reference is edit target; second reference defines product identity. Standalone photorealistic ecommerce photograph, highest genuine native resolution targeting2000x1200, sRGB, no people, UI, labels, logos, text, watermark or collage.

### B7f

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Seamless tinted studio sweep, soft natural floor shadow, upper-left soft studio key. Product alone centred in three-quarter view, wholly visible about70%of frame height, all parts within middle60%width where geometry allows. Top15% and top corners empty for future HTML overlays. Preserve reference product identity; remove only printed marks. Exact reference black stand mixer with broad black head, silver horizontal trim, stainless bowl, right-side controls and wide black base. Warm beige #EFE7DC background, tiny soft green plant at far LEFT EDGE only as in approved design. Mixer centred and whole. Omit logo and all speed numbers. Output 3:4 aspect ratio; target 1500x2000 native pixels.

### B8a

Use case: precise-object-edit. Reframe this one car-seat product photograph for ecommerce. Preserve exact black seat design, headrest, seams, leather, proportions, low base, three-quarter angle and pale blue-grey photographic wall/floor. Pull CAMERA BACK so WHOLE SEAT occupies ONLY y27% through y92% of the 2:1 landscape photograph. Top quarter of canvas must be entirely empty wall, across full width. Keep seat centered horizontally. Do NOT crop product, do NOT stretch product. No text, brands, labels, logos, UI, people or extra objects. Soft even light, natural floor shadow. Highest genuine native resolution, target2400x1200.

### B8b

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Exact reference white split-AC indoor unit mounted correctly on light grey wall #E9EBED. Preserve top grille, long curved front panel, thin brass/brown lower trim and open lower vent. No logo, lettering or display numbers. Centred horizontally, entire unit, width about75%, own natural long proportions intact, quiet top22% for HTML timers. Light soft daylight, no other objects, no stretching appliance to fill height. Output 2:1 aspect ratio; target 2400x1200 native pixels.

### B8c

Use case: precise-object-edit. First image is edit target; second image is catalogue product identity. Reframe first scene: WHOLE SILVER WASHER occupies only y27% through y92% of 2:1 canvas, horizontally centered. Top quarter completely empty grey concrete wall. Preserve catalogue washer shape: drawer left, central rotary dial, dark rectangular display right AND FOUR SMALL ROUND PHYSICAL PUSH BUTTONS in a horizontal row BELOW that display. Keep these four silver buttons visibly dimensional, blank with no symbols. Preserve large circular silver-rimmed door and lower plinth, subtle three-quarter view, original proportions and soft neutral daylight. Remove all printed text/logos/numbers from catalogue design; display unlit. Do not remove the physical buttons. No people, props or UI. Target2400x1200, highest genuine native resolution, no upscale.

### B9

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Deep empty warehouse aisle in one-point perspective, vanishing point x55%,y45%. Tall blue-grey pallet racking both sides, orange beams, plain kraft cartons and shrink-wrapped pallets, industrial ceiling lights, polished concrete floor with subtle reflections. Red manual hand pallet jack parked at far side, clear of centre. Keep floor x30â€“70%,y60â€“95% unobstructed for later A2 chair overlay; do NOT include chair. Moderately dark, warm upper-LEFT light highlights, cool shadows, darker plain lower third for HTML white text. Calm centre for play control, quiet top band. Correct rack geometry. Output 3:2 aspect ratio; target 3600x2400 native pixels.

### B10

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Wide slightly elevated interior of an electronics wholesale warehouse. Blue-grey racking with dark navy feature wall; TVs on stands and racks show only bright abstract blue ocean images, plain boxed electronics, kraft cartons on wooden pallets, industrial lights. TV interest across sides; centre x40â€“60%,y35â€“65% reasonably calm for future play button. Medium-dark cool industrial light, warm carton tones, blue screen glow. No packaging lettering or printed branded electronics pictures. Output 3:2 aspect ratio; target 2400x1600 native pixels.

### B11

Precise object cleanup of this exact photograph. Remove all ink stamps, pictograms, paper stickers and logo-like markings from EVERY wooden pallet block and cardboard carton. Especially BLUE STAMP on pallet block in left edge lower middle at x9.5%,y64%, and black stamp bottom left x7%,y91%. Preserve wood grain and all objects, lighting, composition, staircase, racking, materials, geometry, framing exactly. Clean unprinted pallets and plain kraft cartons. No lettering, logos, symbols, labels, UI or people anywhere. Same4:5 photographic image, no redesign.

### B12

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Neat pyramid of plain kraft shipping cartons sealed with tape. Centre stack fills75%height on white-to-light-grey seamless studio background. Soft bright light, soft real contact shadow. No pallet, no warehouse, no printing, no pictograms or labels. Box edges and stacking credible. Output 3:2 aspect ratio; target 2400x1600 native pixels.

### B13

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Three-quarter street-level architectural photograph of modern two-storey warehouse/showroom building, white and charcoal facade with large glass entrance. Building across middle band y25â€“75%, fit whole building with breathing room for2.4:1crop. Bright Saudi daylight, clear blue sky, crisp shadows, realistic straight architecture. No vehicles or people, no signage anywhere. Output 3:1 aspect ratio; target 3000x1000 native pixels.

### B14

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Bright contemporary living room, beige sofa with textured cushions across x20â€“65%, glass-and-wood coffee table, open metal-and-wood shelving with ceramics and plants, large window with sheer curtains. At right x70â€“98% a complete armchair with side table and lamp, useful in portrait crop. Soft warm daylight, neutral beige/white. Key furniture middle vertical band y25â€“75%; both outer thirds moderately calm for future HTML text. No prints with letters, no magazines with text. Output 3:1 aspect ratio; target 3600x1200 native pixels.

### B15

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Wide electronics warehouse, blue-grey pallet racking with plain cartons in deep perspective at left x5â€“45%, row of unboxed thin-bezel TVs with abstract glowing blue screens and flat TV cartons at right x50â€“95%. Key content y25â€“75%. Cool industrial light, warm kraft cartons, medium-dark outer thirds calm for future HTML overlay. No labels, no printed TV box photos, no text on screens. Similar environment to B10 but a different wider viewpoint. Output 3:1 aspect ratio; target 3600x1200 native pixels. The attached image establishes the same business's navy/blue-grey electronics warehouse, blue-screen TVs and carton palette. Photograph it from a DIFFERENT wider horizontal viewpoint matching the new3:1 layout; don't crop the reference.

### B16

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Vertical view of bright clean appliance showroom, light-grey floor. Whole silver front-load washer centred (reference washer design), white dryer beside it, tall silver refrigerator behind/alongside, neat row of appliances. Even bright showroom light, credible floor contact and metal reflections. No labels, logos, price tags, display text or paperwork. Output 4:5 aspect ratio; target 1600x2000 native pixels.

### B17

Precise tiny cleanup ONLY of this exact photograph: remove small WHITE BRAND-LIKE MARK from the dark steering-column panel just below steering wheel, around x57%,y52%. Leave that panel plain dark grey with original texture. Inspect remaining forklift for any printed marks and erase them. Preserve exact forklift, mast, lowered forks, wheels, warm lighting, camera framing, warehouse, racks and plain cartons. No other changes. No text/logos/labels/signage/people/UI anywhere. Same5:2 photographic image.

### B18

Create ONE separate standalone professional commercial photograph. Photorealistic natural materials, plausible proportions/reflections, no people, no readable text/numbers, no brands/logos, no signage, no labels, no watermarks, no UI/buttons/badges. No collage, no contact sheet. sRGB, highest genuine native resolution, no artificial upscale. Airy open-plan living/dining room with white walls. Cream linen sofa with muted blue and sand cushions and light wood coffee table at x10â€“50%, large potted olive tree. Right x55â€“95% round wooden dining table with chairs under pendant lamp. Bright natural daylight, fresh white/cream/light-wood/soft-blue palette. Key furnishings middle vertical band y25â€“75%, whole primary groups in frame. Distinct from Rawabi: light Scandinavian open-plan styling, no glass coffee table, no shelving. Output 3:1 aspect ratio; target 3600x1200 native pixels.
