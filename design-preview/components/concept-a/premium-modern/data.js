// Option 2 — Premium Modern Marketplace: which shared records and photos
// fill each part of the approved layout. All products, sellers, prices and
// grades come from data/; only the selection and photo framing live here.
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { LIVE_EVENT } from "@/data/live";
import { BRAND_PHOTOS, cutout, photo } from "@/data/media";
import { getProduct } from "@/data/products";
import { SELLER_BY_CODE } from "@/data/sellers";
import { endingSoon } from "@/lib/catalog";

const pick = (...slugs) => slugs.map(getProduct).filter(Boolean);

/**
 * Hero room. The approved panoramic room (desk, lamp and tan recliner) is not
 * in the asset library; the closest existing photograph is the catalogue's
 * own room shot of the live-auction recliner. `focus` keeps the chair clear of
 * the copy card; `pin` places the white dot on the chair (percent of the hero).
 */
export const HERO_ROOM = {
  image: photo("recliner", 2),
  focus: "50% 26%",
  focusRtl: "50% 26%",
  pin: { x: 67, y: 64 },
  pinRtl: { x: 47, y: 62 },
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
