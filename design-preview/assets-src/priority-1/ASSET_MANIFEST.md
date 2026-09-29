# Khaznah — Priority 1 final asset manifest

Prepared 29 September 2026. Seven separate photographic assets, corrected for final visual approval before integration.

## Delivered files

| ID | File | Actual pixels | Aspect | File size | Format |
|---|---|---|---|---|---|
| A1 | [A1_kz-shared-recliner-studio-v1.png](A1_kz-shared-recliner-studio-v1.png) | 1254 × 1254 | 1:1 | 1,872,328 bytes | RGB |
| A2 | [A2_kz-shared-recliner-cutout-v2.png](A2_kz-shared-recliner-cutout-v2.png) | 1254 × 1254 | 1:1 | 1,775,584 bytes | RGBA, real alpha |
| A3 | [A3_kz-o2-hero-room-ltr-v2.png](A3_kz-o2-hero-room-ltr-v2.png) | 2508 × 627 | 4:1 | 2,329,415 bytes | RGB |
| A4 | [A4_kz-o2-hero-room-rtl-v2.png](A4_kz-o2-hero-room-rtl-v2.png) | 2508 × 627 | 4:1 | 2,160,251 bytes | RGB |
| A5 | [A5_kz-o3-hero-furniture-v2.png](A5_kz-o3-hero-furniture-v2.png) | 1200 × 1200 | 1:1 | 1,844,661 bytes | RGB |
| A6 | [A6_kz-o4-hero-limestone-wide-v2.png](A6_kz-o4-hero-limestone-wide-v2.png) | 2508 × 627 | 4:1 | 2,187,977 bytes | RGB |
| A7 | [A7_kz-o4-hero-limestone-mobile-v1.png](A7_kz-o4-hero-limestone-mobile-v1.png) | 992 × 1586 | approximately 5:8 | 1,556,793 bytes | RGB |

The PNGs are the final assets. The JSON manifest includes exact byte sizes, SHA-256 hashes, source provenance and pixel-preservation checks. The production notes record the background-edit prompts and finishing methods.

## Resolution and preservation

**A3, A4 and A6 are exactly 2508 × 627 pixels (4:1).** These are extended photographic composites, not single-pass native 4:1 generations. Original approved foreground pixels remain at their native size. Background patches were generated at 1536 × 1024 (A3/A4) and 1254 × 1254 (A6), then uniformly reduced to the required patch size. Nothing was stretched or upscaled.

The original brief’s larger master dimensions were not produced natively. This package reports the available genuine pixel resolution under the subsequent authorization to extend the backgrounds and deliver actual sizes. It does not claim 4800 × 1200 or 4K-native output. A 2508-pixel-wide image has about 1.74 source pixels per displayed pixel at 1440 px and 1.31 at 1920 px; it is not a full 1920 px @2× asset.

A1 and A7 are byte-for-byte copies of the approved originals. A2 and A5 received only deterministic finishing. No generative edits were used on A1, A2, A5 or A7. All files preserve original RGB/RGBA samples without new color grading. They are untagged, intended for sRGB web display; no embedded ICC conversion is claimed.

## Corrections and intended placement

- **A1 — studio recliner:** unchanged. Shared product reference and lot photograph for Options 2–4.
- **A2 — transparent recliner:** cleaned weak/detached alpha residue and zeroed fully transparent RGB. All retained chair RGBA pixels are identical to the approved cut-out. All four canvas edges have alpha 0. The positive-alpha subject box is x 66–1174, y 102–1156 (exclusive end coordinates). Genuine PNG transparency; no matte or baked background. The approved square canvas is retained.
- **A3 — Option 2 English hero:** extended the window/curtain/floor area on the left. Copy stays on the left; the entire recliner and the approved desk, lamp and furniture remain unchanged on the right.
- **A4 — Option 2 Arabic hero:** extended the right window/curtain/floor area of the independently composed Arabic original. Copy stays on the right and the chair on the left. No photograph was mirrored.
- **A5 — Option 3 furniture tile:** lossless crop to 1200 × 1200, with clear floor across the lower 28% (y 864–1200). Both lower corners remain available for the title and tote overlays in English or Arabic. Chair, desk and lighting are unchanged.
- **A6 — Option 4 desktop hero:** added background at both outer sides, with the original limestone centre and approved tote, lounge chair, lamp, washing machine and suitcase preserved. The key products are inset for the specified desktop crops. Keep HTML text/search/buttons in the quiet centre.
- **A7 — Option 4 mobile hero:** unchanged approved portrait companion; use on phones and narrow tablets.

## Text placement and crop guidance

Coordinates below refer to these final masters, measured from the top-left. Right and bottom coordinates are exclusive. Treat overlay boxes as practical placement guides, not baked-in artwork.

| Asset | Suggested content area in final pixels |
|---|---|
| A3 | Left copy card: x 125–1030, y 40–560. Use the existing light HTML card to provide contrast against the curtains. |
| A4 | Right copy card: x 1478–2383, y 40–560. Do not flip A3 for Arabic. |
| A5 | Clear floor: y 864–1200 across full width. Allow at least 24 px edge inset; both lower corners can carry the swapped overlays. Keep the local HTML gradient for white title text. |
| A6 | Approximate clear content core: x 650–1700, y 60–540. Check the actual live search/button width within that visible area after cropping. |
| A7 | Approved upper approximately 68% is intended for live content; retain the lower product arrangement. |

For A3/A4/A6, retain the full 4:1 image where possible. These additional desktop crops were inspected and preserve the whole primary products:

- **3.33:1:** crop x 209–2299, y 0–627 (2090 × 627), centred.
- **About 4.44:1:** crop x 0–2508, y 31–595 (2508 × 564), centred. The one-pixel ratio rounding is confined to the derivative, not the exact 4:1 master.

For Option 2 narrower photo strips, use the following crops; place the copy outside the image and dock the price pin if necessary:

| Asset | About 2.4:1 tablet crop | About 1.7:1 phone crop |
|---|---|---|
| A3 English | x 1003–2508, y 0–627 | x 1360–2426, y 0–627 |
| A4 Arabic | x 0–1505, y 0–627 | x 150–1216, y 0–627 |

These retain the desk and full recliner, while peripheral plants and side-table context may leave the frame. Do not apply an arbitrary centred crop at narrow ratios.

For A5, a desktop crop of x 0–1200, y 34–1166 approximates 1.06:1. A phone crop of x 24–1176, y 0–1200 is 0.96:1. Both preserve the lower floor band; avoid zooming farther into the chair.

**For A6 below approximately 3.33:1, switch to A7 or show A6 uncropped with content outside it.** A 2.4:1 centred cover crop cannot preserve products at both sides. A7 is the approved narrow-layout companion. The actual component crop and overlays still need checking when Claude integrates the images; no application files were changed here.

## Checks completed

- All seven PNGs open correctly; final archive integrity checked.
- Exact 4:1 geometry confirmed for A3, A4 and A6.
- Original furniture/product regions compared pixel-for-pixel after their integer placement into the panoramas; unchanged.
- A1/A7 hashes match the approved originals; A5 equals the specified original-image crop.
- A2 transparency checked on light and dark backgrounds; outer-edge alpha is zero and retained chair pixels match.
- Extension seams, whole-chair framing, desktop crop examples, and A5 floor clearance inspected visually.

The package contains no application code, Priority 2 assets, trial images or flattened homepage screenshots.
