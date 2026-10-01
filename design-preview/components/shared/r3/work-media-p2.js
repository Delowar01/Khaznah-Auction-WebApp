// Priority 2 photography (B1–B18 in WORK_DESIGN_MISSING_ASSETS.md) for the
// new home pages of Options 2–4 only. These are temporary dummy / preview
// images, not final photography. The masters are kept in
// assets-src/priority-2/; scripts/process-priority-2-assets.mjs writes the
// WebP files served from /images/work/priority-2/ (see
// assets-src/priority-2/DERIVATIVES.md). Shared catalogue photographs and
// records are not changed: Option 1, the earlier-prototype screens and every
// other place these products appear keep the catalogue's own pictures.

const sources = (name, width, height, widths) =>
  [...widths, width].map((w) => ({ src: `/images/work/priority-2/${name}-${w}.webp`, w, h: Math.round((w * height) / width) }));

const scene = (name, width, height, widths) => ({ kind: "scene", ratio: width / height, sources: sources(name, width, height, widths) });

/** Transparent cut-out (WebP with alpha), drawn with object-fit: contain. */
const cutout = (name, width, height, widths) => ({ kind: "cutout", ratio: width / height, sources: sources(name, width, height, widths) });

export const PRIORITY_2 = {
  /** B1 / B2: Bulk & Pallets lots (cut-outs). B1 is also Option 2's Bulk & Pallets category picture. */
  palletElectronics: cutout("b1-shared-pallet-electronics", 1418, 1017, [300, 600, 900]),
  palletKitchen: cutout("b2-shared-pallet-kitchen", 1430, 1035, [300, 600, 900]),
  /** B3 / B4: Option 2 category row, Tools & DIY and Automotive (cut-outs). */
  drill: cutout("b3-o2-tools-drill", 1174, 1220, [240, 480]),
  tyre: cutout("b4-o2-automotive-tyre", 1016, 1225, [240, 480]),
  /** B5 / B6: Option 3 hero tiles, Electronics and Home & Kitchen. */
  heroElectronics: scene("b5-o3-hero-electronics-tv", 1664, 936, [832, 1248]),
  heroKitchen: scene("b6-o3-hero-kitchen-coffee", 1536, 1024, [768, 1152]),
  /** B7a–f: Option 3 product wall (Buy Now tab), by catalogue slug. */
  wall: {
    "suede-tote": scene("b7a-o3-wall-suede-tote", 1086, 1448, [400, 700]),
    "hairpin-desk": scene("b7b-o3-wall-writing-desk", 1615, 969, [400, 700, 1000]),
    "hardside-spinner": scene("b7c-o3-wall-spinner-suitcase", 1615, 969, [400, 700, 1000]),
    "capsule-coffee": scene("b7d-o3-wall-coffee-maker", 1615, 969, [400, 700, 1000]),
    "task-lamp": scene("b7e-o3-wall-task-lamp", 1615, 969, [400, 700, 1000]),
    "stand-mixer": scene("b7f-o3-wall-stand-mixer", 1086, 1448, [400, 700]),
  },
  /** B8a–c: Option 3 Ending soon cards, by catalogue slug. */
  ending: {
    "seat-covers": scene("b8a-o3-ending-car-seat", 1774, 887, [480, 880, 1320]),
    "split-ac": scene("b8b-o3-ending-split-ac", 1774, 887, [480, 880, 1320]),
    "washer-front": scene("b8c-o3-ending-washing-machine", 1774, 887, [480, 880, 1320]),
  },
  /** B9: live-auction warehouse aisle (Option 2 video still; Option 4 scene, with the A2 lot in front). */
  liveAisle: scene("b9-shared-live-warehouse-aisle", 1536, 1024, [640, 960, 1280]),
  /** B10: Option 3 live banner still. */
  liveElectronics: scene("b10-o3-live-electronics-warehouse", 1536, 1024, [640, 960, 1280]),
  /** B11–B18: seller covers. */
  sellers: {
    khaznaRacking: scene("b11-o2-seller-khazna-racking", 1120, 1400, [240, 480]),
    khaznaCartons: scene("b12-o3-seller-khazna-cartons", 1536, 1024, [480, 960]),
    khaznaBuilding: scene("b13-o4-seller-khazna-building", 2172, 724, [800, 1440]),
    rawabi: scene("b14-shared-seller-rawabi-living", 2172, 724, [800, 1440]),
    redSea: scene("b15-shared-seller-redsea-electronics", 2172, 724, [800, 1440]),
    majdShowroom: scene("b16-o2-seller-daralmajd-showroom", 1120, 1400, [240, 480]),
    majdForklift: scene("b17-shared-seller-daralmajd-forklift", 1980, 792, [660, 1320]),
    sahel: scene("b18-shared-seller-sahel-living-dining", 2172, 724, [800, 1440]),
  },
};
