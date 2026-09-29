// Option 4 — Contemporary Saudi Commerce: which shared records and photos
// fill each part of the approved layout. Products, sellers, prices and
// grades come from data/; this file only picks them and frames the imagery.
import { Armchair, Boxes, Car, CookingPot, Monitor, ShoppingBag, WashingMachine, Wrench } from "lucide-react";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { BRAND_PHOTOS, photo } from "@/data/media";
import { getProduct } from "@/data/products";
import { SELLER_BY_CODE } from "@/data/sellers";
import { endingSoon } from "@/lib/catalog";

const pick = (...slugs) => slugs.map(getProduct).filter(Boolean);

/** Local category rail, in the approved order. */
export const CATEGORY_RAIL = [
  { slug: "electronics", icon: Monitor },
  { slug: "home-appliances", icon: WashingMachine },
  { slug: "home-kitchen", icon: CookingPot },
  { slug: "furniture", icon: Armchair },
  { slug: "fashion", icon: ShoppingBag },
  { slug: "tools-diy", icon: Wrench },
  { slug: "automotive", icon: Car },
  { slug: "bulk-pallets", icon: Boxes },
].map((row) => ({ ...row, category: CATEGORY_BY_SLUG[row.slug] }));

/** Buy Now floor (2 × 2) and the recommended pair below it. */
export const BUY_NOW = pick("suede-tote", "hairpin-desk", "hardside-spinner", "stand-mixer");
export const RECOMMENDED = pick("capsule-coffee", "task-lamp");

/** Ending soon: the three auctions closing first. */
export const ENDING = endingSoon(3);

/**
 * Live scene: the current lot's cut-out stands in the aisle of the brand
 * warehouse photograph (a composite, as the approved design shows). The
 * photograph is widened and anchored to its right-hand aisle.
 */
export const LIVE_SCENE = { image: BRAND_PHOTOS.warehouseRiyadh, focus: "100% 56%", zoom: 1.82 };

/**
 * Seller directory: cover photo + three products each seller actually lists
 * (the approved image shows some items under other sellers; the shared
 * inventory decides who sells what).
 */
export const SELLER_ROWS = [
  { code: "KHAZNA", cover: BRAND_PHOTOS.warehouseRiyadh, zoom: 4, focus: "100% 62%", products: pick("capsule-coffee", "electronics-pallet", "dutch-oven-blue") },
  { code: "RAWABI", cover: photo("floor-lamp", 1), focus: "50% 62%", products: pick("suede-tote", "hairpin-desk", "task-lamp") },
  { code: "REDSEA", cover: BRAND_PHOTOS.warehouseFloor, focus: "70% 55%", products: pick("tv-43", "robot-vacuum", "microwave") },
  { code: "MAJD", cover: BRAND_PHOTOS.warehouseRiyadh, zoom: 2.3, focus: "100% 78%", products: pick("seat-covers", "split-ac", "tool-backpack") },
  { code: "SAHEL", cover: photo("dining-chairs", 1), focus: "40% 60%", products: pick("stand-mixer", "washer-front", "knit-sneakers") },
].map((row) => ({ ...row, seller: SELLER_BY_CODE[row.code] }));

/** Bulk & Pallets: two sage panels, buying action before the manifest. */
export const PALLETS = [
  { product: getProduct("electronics-pallet"), action: "bid" },
  { product: getProduct("kitchen-pallet"), action: "cart" },
];
