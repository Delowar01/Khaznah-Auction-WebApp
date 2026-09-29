// Option 2 — Premium Modern Marketplace: which shared records and photos
// fill each part of the approved layout. All products, sellers, prices and
// grades come from data/; only the selection and photo framing live here.
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { LIVE_EVENT } from "@/data/live";
import { BRAND_PHOTOS, cutout, photo } from "@/data/media";
import { getProduct } from "@/data/products";
import { SELLER_BY_CODE } from "@/data/sellers";
import { endingSoon } from "@/lib/catalog";
import { WORK_MEDIA } from "@/components/shared/r3/work-media";

const pick = (...slugs) => slugs.map(getProduct).filter(Boolean);

/**
 * Hero room: the approved A3 (English) and A4 (Arabic) photographs, composed
 * separately for each reading direction (never mirrored). Positions are in
 * master pixels (2508 × 627): `card` is the price pin's top outer corner
 * (top-left in English, top-right in Arabic), `from` a point inside the card
 * where the leader line starts, `dot` the point on the recliner.
 */
export const HERO_ROOM = {
  ltr: { image: WORK_MEDIA.heroRoomLtr, card: { x: 1760, y: 60 }, from: { x: 1880, y: 150 }, dot: { x: 2105, y: 445 } },
  rtl: { image: WORK_MEDIA.heroRoomRtl, card: { x: 730, y: 60 }, from: { x: 610, y: 150 }, dot: { x: 330, y: 455 } },
};

/** The live lot the hero pin annotates (the recliner in the photo). */
export const PIN_LOT_ORDER = 5;

/** Eight unboxed category photographs, in the approved order. */
export const CATEGORY_ROW = [
  { slug: "electronics", art: cutout("tv-43") },
  { slug: "home-appliances", art: cutout("fridge-690") },
  { slug: "home-kitchen", art: cutout("dutch-oven-blue") },
  { slug: "furniture", art: cutout("swivel-chair") },
  { slug: "fashion", art: cutout("suede-tote") },
  { slug: "tools-diy", art: cutout("tool-backpack") },
  { slug: "automotive", art: cutout("tyre-inflator") },
  { slug: "bulk-pallets", art: cutout("boxes-stack") },
].map((row) => ({ ...row, category: CATEGORY_BY_SLUG[row.slug] }));

/** "Buy Now, ready to discover": four equal cards. */
export const BUY_NOW = pick("suede-tote", "hairpin-desk", "hardside-spinner", "stand-mixer");

/** "Selected for your everyday": two photo + details panels. */
export const SELECTED = [
  { product: getProduct("capsule-coffee"), image: photo("capsule-coffee", 1), scene: true },
  { product: getProduct("task-lamp"), image: photo("task-lamp", 0), scene: false },
];

/** Ending soon: the three auctions closing first (seat, air conditioner, washer). */
export const ENDING = endingSoon(3);

/** Bulk & Pallets rows. */
export const PALLETS = pick("electronics-pallet", "kitchen-pallet");

/** Featured sellers in the approved order, each with a cover picked for this layout. */
export const SELLER_CARDS = [
  { code: "KHAZNA", cover: BRAND_PHOTOS.warehouseRiyadh, focus: "100% 40%" },
  { code: "RAWABI", cover: photo("swivel-chair", 2), focus: "35% 50%" },
  { code: "REDSEA", cover: BRAND_PHOTOS.warehouseFloor, focus: "88% 55%" },
  { code: "MAJD", cover: photo("washer-front", 0), focus: "50% 50%", plate: true },
  { code: "SAHEL", cover: photo("floor-lamp", 1), focus: "55% 62%" },
].map((row) => ({ ...row, seller: SELLER_BY_CODE[row.code] }));

export const LIVE_STREAM = LIVE_EVENT.stream;
