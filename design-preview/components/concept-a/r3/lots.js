// Option 2 — which shared lots each home-page section shows, plus small
// helpers. Every lot comes from the shared sample catalogue, and each section
// uses the same selection rule as Option 1 (soonest-closing auctions, most-bid
// auctions, biggest Buy Now savings, bulk lots).
import { PRODUCTS, getProduct, isAuction, isBuyNow } from "@/data/products";
import { photo } from "@/data/media";
import { discountPercent, endingSoon, hotAuctions } from "@/lib/catalog";
import { dealProducts } from "@/components/concept-a/utils/lots";

const pick = (...slugs) => slugs.map(getProduct).filter(Boolean);

export const FEATURED_NOW = pick("capsule-coffee", "swivel-chair", "floor-lamp", "car-cooler");
export const CLOSING_SOON = endingSoon(8);
export const MOST_BID = hotAuctions(8);
// Buy Now deals: the biggest saving is the feature, the next four surround it.
const DEALS = dealProducts(5);
export const DEALS_MOSAIC = { feature: DEALS[0], tiles: DEALS.slice(1, 5) };
// Bulk & pallets: two mirrored rows — a pallet feature with its manifest
// beside the pallet story, then the two carton lots beside the second pallet.
export const BULK_ROW_A = { feature: getProduct("electronics-pallet") };
export const BULK_ROW_B = { feature: getProduct("kitchen-pallet"), tiles: pick("laptop-bags-24", "monitor-stands-5") };

export const OPEN_AUCTION_COUNT = PRODUCTS.filter((p) => isAuction(p) && p.status === "live").length;
export const BUY_NOW_COUNT = PRODUCTS.filter(isBuyNow).length;

// Cut-outs composed around the hero's centred search (same shared images).
// Desktop: two clusters, x measured from the outer edge. Phones/tablets: one
// line-up above the headline (h is a share of the line-up height).
export const HERO_START = [
  { slug: "fridge-690", h: 330, x: 0, z: 1 },
  { slug: "swivel-chair", h: 196, x: 116, z: 3 },
  { slug: "dutch-oven-blue", h: 74, x: 26, z: 4, y: -10 },
];
export const HERO_END = [
  { slug: "floor-lamp", h: 360, x: 0, z: 1 },
  { slug: "hardside-spinner", h: 212, x: 92, z: 2 },
  { slug: "tv-43", h: 168, x: 176, z: 3, y: -8 },
];
export const HERO_LINEUP = [
  { slug: "floor-lamp", h: 1, z: 1 },
  { slug: "hardside-spinner", h: 0.6, z: 2 },
  { slug: "fridge-690", h: 0.94, z: 3 },
  { slug: "swivel-chair", h: 0.62, z: 4 },
  { slug: "dutch-oven-blue", h: 0.22, z: 5, wide: true },
  { slug: "tv-43", h: 0.52, z: 3 },
];

// Category artwork for the mosaic and the Categories overlay. A category uses
// a lifestyle photo of one of its own lots where one exists; Electronics,
// Fashion and Bulk Pallets have none, so they get a cut-out composition on a
// neutral tone (same shared images, no new assets).
export const CATEGORY_ART = {
  "home-appliances": { scene: photo("robot-vacuum", 1), position: "50% 55%" },
  "home-kitchen": { scene: photo("dutch-oven-blue", 2), position: "66% 50%" },
  furniture: { scene: photo("floor-lamp", 1), position: "40% 55%" },
  fashion: { cutouts: ["suede-tote", "knit-sneakers"], tone: 3 },
  "tools-diy": { scene: photo("wrench-set", 0), position: "50% 50%" },
  automotive: { scene: photo("tyre-inflator", 1), position: "45% 50%" },
  electronics: { cutouts: ["tv-43", "headphones"], tone: 4 },
  "bulk-pallets": { cutouts: ["boxes-stack", "laptop-bags-24"], tone: 1 },
};

// Seller showcase order: the live host first, then the rest.
export const SELLER_ORDER = ["REDSEA", "RAWABI", "KHAZNA", "MAJD", "SAHEL"];

/** The lifestyle photo when the lot has one, otherwise its studio shot. */
export function sceneOf(product) {
  return product.images.find((image) => image?.kind === "scene") || product.images[0];
}

export function mainImage(product) {
  return product.images[0];
}

export function isStudio(image) {
  return image?.kind !== "scene";
}

export function saleTag(product) {
  if (product.status === "scheduled") return "upcoming";
  if (isAuction(product)) return "auction";
  if (product.stock <= 0) return "soldout";
  const pct = discountPercent(product);
  return pct > 0 ? `-${pct}%` : null;
}
