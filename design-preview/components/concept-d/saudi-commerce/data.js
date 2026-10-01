// Option 4 — Contemporary Saudi Commerce: which shared records and photos
// fill each part of the approved layout. Products, sellers, prices and
// grades come from data/; this file only picks them and frames the imagery.
import { Armchair, Boxes, Car, CookingPot, Monitor, ShoppingBag, WashingMachine, Wrench } from "lucide-react";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { getProduct } from "@/data/products";
import { SELLER_BY_CODE } from "@/data/sellers";
import { endingSoon } from "@/lib/catalog";
import { PRIORITY_2 } from "@/components/shared/r3/work-media-p2";

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
 * Live scene: the current lot's cut-out (A2 for the recliner) stands on the
 * floor of the Priority 2 warehouse aisle (B9), a composite as the approved
 * design shows. `focus` keeps the aisle's vanishing point in view.
 */
export const LIVE_SCENE = { image: PRIORITY_2.liveAisle, focus: "55% 55%" };

/**
 * Seller directory: cover photo + three products each seller actually lists
 * (the approved image shows some items under other sellers; the shared
 * inventory decides who sells what). Covers are the Priority 2 seller
 * photographs (B13, B14, B15, B17, B18); `thumbs` swaps a product thumbnail
 * for a Priority 2 cut-out on this page only (B1 for Khazna's pallet).
 */
export const SELLER_ROWS = [
  { code: "KHAZNA", cover: PRIORITY_2.sellers.khaznaBuilding, focus: "50% 50%", products: pick("capsule-coffee", "electronics-pallet", "dutch-oven-blue"), thumbs: { "electronics-pallet": PRIORITY_2.palletElectronics } },
  { code: "RAWABI", cover: PRIORITY_2.sellers.rawabi, focus: "50% 55%", products: pick("suede-tote", "hairpin-desk", "task-lamp") },
  { code: "REDSEA", cover: PRIORITY_2.sellers.redSea, focus: "50% 50%", products: pick("tv-43", "robot-vacuum", "microwave") },
  { code: "MAJD", cover: PRIORITY_2.sellers.majdForklift, focus: "50% 50%", products: pick("seat-covers", "split-ac", "tool-backpack") },
  { code: "SAHEL", cover: PRIORITY_2.sellers.sahel, focus: "35% 50%", products: pick("stand-mixer", "washer-front", "knit-sneakers") },
].map((row) => ({ ...row, seller: SELLER_BY_CODE[row.code] }));

/** Bulk & Pallets: two sage panels, buying action before the manifest; Priority 2 pallet cut-outs (B1, B2). */
export const PALLETS = [
  { product: getProduct("electronics-pallet"), image: PRIORITY_2.palletElectronics, action: "bid" },
  { product: getProduct("kitchen-pallet"), image: PRIORITY_2.palletKitchen, action: "cart" },
];
