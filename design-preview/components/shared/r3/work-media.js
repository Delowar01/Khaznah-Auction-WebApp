// Approved Priority 1 photography (A1–A7 in WORK_DESIGN_MISSING_ASSETS.md),
// for the new home pages of Options 2–4 only. The masters are kept in
// assets-src/priority-1/; scripts/process-work-assets.mjs writes the WebP
// files served from /images/work/ (see assets-src/priority-1/DERIVATIVES.md).
// Shared catalogue photographs and records are not changed: Option 1 and the
// earlier-prototype screens keep the catalogue's own recliner.

const sources = (name, width, height, widths) =>
  widths.map((w) => ({ src: `/images/work/${name}-${w}.webp`, w, h: Math.round((w * height) / width) }));

const scene = (name, width, height, widths) => ({ kind: "scene", ratio: width / height, sources: sources(name, width, height, widths) });

/** A1 studio photograph + A2 transparent cut-out of the tan leather recliner. */
const RECLINER = {
  kind: "product",
  ratio: 1,
  sources: sources("a1-recliner-studio", 1254, 1254, [400, 800, 1254]),
  cutout: { ratio: 1108 / 1054, sources: sources("a2-recliner-cutout", 1108, 1054, [300, 600, 1108]) },
};

export const WORK_MEDIA = {
  recliner: RECLINER,
  /** A3 / A4: Option 2 hero room, composed separately for English and Arabic (never mirrored). */
  heroRoomLtr: scene("a3-o2-hero-room-ltr", 2508, 627, [960, 1440, 1920, 2508]),
  heroRoomRtl: scene("a4-o2-hero-room-rtl", 2508, 627, [960, 1440, 1920, 2508]),
  /** A5: Option 3 furniture tile; the lower 28 % is clear floor for the overlays. */
  furnitureScene: scene("a5-o3-hero-furniture", 1200, 1200, [600, 900, 1200]),
  /** A6 / A7: Option 4 limestone hero, wide and phone compositions. */
  limestoneWide: scene("a6-o4-hero-limestone-wide", 2508, 627, [960, 1440, 1920, 2508]),
  limestonePhone: scene("a7-o4-hero-limestone-mobile", 992, 1586, [496, 744, 992]),
};

/** The live-event lot drawn by the approved artwork (the tan leather recliner). */
export const RECLINER_LOT_ORDER = 5;

/**
 * Picture of a live-event lot on the new home pages: the approved recliner
 * photograph (A1, with its A2 cut-out) for the recliner lot, the lot's own
 * catalogue picture for every other lot.
 */
export const lotImage = (lot) => (lot?.order === RECLINER_LOT_ORDER ? RECLINER : lot?.image);
