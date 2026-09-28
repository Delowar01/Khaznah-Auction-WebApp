// Option 3 — Visual Discovery Marketplace: which shared records and photos
// fill each tile of the approved layout. Products, sellers, prices and grades
// come from data/; this file only picks them and frames the photography.
import { Armchair, Car, CookingPot, Monitor, Package, Refrigerator, ShoppingBag, Wrench } from "lucide-react";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { BRAND_PHOTOS, photo } from "@/data/media";
import { getProduct } from "@/data/products";
import { SELLER_BY_CODE } from "@/data/sellers";
import { endingSoon, featuredBuyNow } from "@/lib/catalog";

/**
 * Hero mosaic. The approved furniture scene (tan recliner and walnut desk)
 * is not in the asset library; the closest existing room photograph (walnut
 * desk with a tan leather chair) stands in. The Electronics tile uses the
 * catalogue TV (blue-wave screen) on a pale plate, and Home & Kitchen the
 * catalogue's red coffee-maker lifestyle shot.
 */
export const HERO = {
  furniture: { image: photo("task-lamp", 3), focus: "34% 60%" },
  electronics: { image: photo("tv-43", 0), slug: "electronics" },
  kitchen: { image: photo("capsule-coffee", 1), focus: "30% 30%", slug: "home-kitchen" },
  tote: getProduct("suede-tote"),
};

/** Eight outlined icon pills, four by two, in the approved order. */
export const CATEGORY_PILLS = [
  { slug: "electronics", icon: Monitor },
  { slug: "home-appliances", icon: Refrigerator },
  { slug: "home-kitchen", icon: CookingPot },
  { slug: "furniture", icon: Armchair },
  { slug: "fashion", icon: ShoppingBag },
  { slug: "tools-diy", icon: Wrench },
  { slug: "automotive", icon: Car },
  { slug: "bulk-pallets", icon: Package },
].map((row) => ({ ...row, category: CATEGORY_BY_SLUG[row.slug] }));

/**
 * Product wall: tall tote and mixer anchors around four compact cards.
 * `tone` is the photo backdrop (studio shots sit on a tinted plate).
 */
const WALL_TONES = {
  tote: "#f6ecdf",
  mixer: "#efe7dc",
  desk: "#f3ebe3",
  case: "#e6ebf1",
  coffee: "#f9e0d4",
  lamp: "#dfe7f0",
};

export const WALL_BUY_NOW = [
  { area: "tote", product: getProduct("suede-tote"), tall: true },
  { area: "desk", product: getProduct("hairpin-desk") },
  { area: "case", product: getProduct("hardside-spinner") },
  { area: "coffee", product: getProduct("capsule-coffee"), recommended: true },
  { area: "lamp", product: getProduct("task-lamp"), recommended: true },
  { area: "mixer", product: getProduct("stand-mixer"), tall: true },
].map((row) => ({ ...row, tone: WALL_TONES[row.area] }));

/** "Recommended" tab: six more Buy Now lots in the same wall composition. */
const shown = new Set(WALL_BUY_NOW.map((row) => row.product.slug));
const more = featuredBuyNow(40).filter((p) => !shown.has(p.slug)).slice(0, 6);
export const WALL_RECOMMENDED = ["tote", "desk", "case", "coffee", "lamp", "mixer"].map((area, i) => ({
  area,
  product: more[i],
  tall: area === "tote" || area === "mixer",
  recommended: true,
  tone: WALL_TONES[area],
}));

/** Ending soon: the three auctions closing first. */
export const ENDING = endingSoon(3).map((product, i) => ({ product, tone: ["#dfe5ec", "#e9ebed", "#e4e2df"][i] }));

/** Seller discovery: two promoted photo banners, then three compact cards. */
export const PROMOTED_SELLERS = [
  { code: "RAWABI", cover: photo("floor-lamp", 1), focus: "50% 58%" },
  { code: "REDSEA", cover: BRAND_PHOTOS.warehouseFloor, focus: "78% 60%" },
].map((row) => ({ ...row, seller: SELLER_BY_CODE[row.code] }));

export const COMPACT_SELLERS = [
  { code: "KHAZNA", cover: photo("boxes-stack", 1), plate: true },
  { code: "MAJD", cover: BRAND_PHOTOS.warehouseRiyadh, focus: "100% 78%", zoom: true },
  { code: "SAHEL", cover: photo("dining-chairs", 1), focus: "45% 55%" },
].map((row) => ({ ...row, seller: SELLER_BY_CODE[row.code] }));

/** Bulk & Pallets: two differently tinted panels. */
export const PALLETS = [
  { product: getProduct("electronics-pallet"), tone: "var(--vd-ivory)", action: "bid" },
  { product: getProduct("kitchen-pallet"), tone: "var(--vd-bluegray)", action: "cart" },
];

