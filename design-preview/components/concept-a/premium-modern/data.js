// Option 2 — Premium Modern Marketplace: which shared records and photos
// fill each part of the approved layout. All products, sellers, prices and
// grades come from data/; only the selection and photo framing live here.
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { cutout, photo } from "@/data/media";
import { getProduct } from "@/data/products";
import { SELLER_BY_CODE } from "@/data/sellers";
import { endingSoon } from "@/lib/catalog";
import { WORK_MEDIA } from "@/components/shared/r3/work-media";
import { PRIORITY_2 } from "@/components/shared/r3/work-media-p2";

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

/**
 * Eight unboxed category photographs, in the approved order. Tools & DIY,
 * Automotive and Bulk & Pallets use the Priority 2 cut-outs (B3, B4, B1).
 */
export const CATEGORY_ROW = [
  { slug: "electronics", art: cutout("tv-43") },
  { slug: "home-appliances", art: cutout("fridge-690") },
  { slug: "home-kitchen", art: cutout("dutch-oven-blue") },
  { slug: "furniture", art: cutout("swivel-chair") },
  { slug: "fashion", art: cutout("suede-tote") },
  { slug: "tools-diy", art: PRIORITY_2.drill },
  { slug: "automotive", art: PRIORITY_2.tyre },
  { slug: "bulk-pallets", art: PRIORITY_2.palletElectronics },
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

/** Bulk & Pallets rows, each with its Priority 2 pallet cut-out (B1, B2). */
export const PALLETS = [
  { product: getProduct("electronics-pallet"), image: PRIORITY_2.palletElectronics },
  { product: getProduct("kitchen-pallet"), image: PRIORITY_2.palletKitchen },
];

/**
 * Featured sellers in the approved order. Covers are the Priority 2 seller
 * photographs (B11, B14, B15, B16, B18); `focus` picks the part of each
 * master that fills the 0.9:1 cover.
 */
export const SELLER_CARDS = [
  { code: "KHAZNA", cover: PRIORITY_2.sellers.khaznaRacking, focus: "50% 55%" },
  { code: "RAWABI", cover: PRIORITY_2.sellers.rawabi, focus: "85% 55%" },
  { code: "REDSEA", cover: PRIORITY_2.sellers.redSea, focus: "23% 50%" },
  { code: "MAJD", cover: PRIORITY_2.sellers.majdShowroom, focus: "50% 50%" },
  { code: "SAHEL", cover: PRIORITY_2.sellers.sahel, focus: "27% 55%" },
].map((row) => ({ ...row, seller: SELLER_BY_CODE[row.code] }));

/** Live auction still: the Priority 2 warehouse aisle (B9). */
export const LIVE_STREAM = { image: PRIORITY_2.liveAisle, focus: "55% 55%" };
