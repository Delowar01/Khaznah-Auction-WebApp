// Option 3 — Visual Discovery Marketplace: which shared records and photos
// fill each tile of the approved layout. Products, sellers, prices and grades
// come from data/; this file only picks them and frames the photography.
import { Armchair, Car, CookingPot, Monitor, Package, Refrigerator, ShoppingBag, Wrench } from "lucide-react";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { getProduct } from "@/data/products";
import { SELLER_BY_CODE } from "@/data/sellers";
import { endingSoon, featuredBuyNow } from "@/lib/catalog";
import { WORK_MEDIA } from "@/components/shared/r3/work-media";
import { PRIORITY_2 } from "@/components/shared/r3/work-media-p2";

/**
 * Hero mosaic. The furniture scene is the approved A5 photograph (tan
 * recliner and walnut desk; its lower 28 % is clear floor for the label and
 * the tote card). `focus` keeps the whole chair in view from the widest tile
 * (1.06:1) to the narrowest (0.61:1). The Electronics and Home & Kitchen
 * tiles are the Priority 2 scenes (B5 TV, B6 red coffee maker); their
 * `focus` keeps the top of the TV and of the coffee maker in view in the
 * wide tablet tiles (2.6–3:1 between 1024 and 1199 px).
 */
export const HERO = {
  furniture: { image: WORK_MEDIA.furnitureScene, focus: "20% 30%" },
  electronics: { image: PRIORITY_2.heroElectronics, focus: "60% 18%", slug: "electronics" },
  kitchen: { image: PRIORITY_2.heroKitchen, focus: "68% 20%", slug: "home-kitchen" },
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
 * `tone` is the photo backdrop (studio shots sit on a tinted plate). The
 * Buy Now tab shows the Priority 2 product photographs (B7a–f) instead;
 * `focus` keeps the whole tote in the square tablet crop.
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
  { area: "tote", product: getProduct("suede-tote"), tall: true, focus: "50% 55%" },
  { area: "desk", product: getProduct("hairpin-desk") },
  { area: "case", product: getProduct("hardside-spinner") },
  { area: "coffee", product: getProduct("capsule-coffee"), recommended: true },
  { area: "lamp", product: getProduct("task-lamp"), recommended: true },
  { area: "mixer", product: getProduct("stand-mixer"), tall: true },
].map((row) => ({ ...row, tone: WALL_TONES[row.area], photo: PRIORITY_2.wall[row.product.slug] }));

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

/**
 * Ending soon: the three auctions closing first, each with its Priority 2
 * photograph (B8a–c, matched by product). A lot without one keeps its
 * catalogue cut-out on the tinted plate.
 */
export const ENDING = endingSoon(3).map((product, i) => ({ product, tone: ["#dfe5ec", "#e9ebed", "#e4e2df"][i], photo: PRIORITY_2.ending[product.slug] }));

/** Live banner still: the Priority 2 electronics warehouse (B10). */
export const LIVE_STILL = { image: PRIORITY_2.liveElectronics, focus: "50% 50%" };

/**
 * Seller discovery: two promoted photo banners, then three compact cards,
 * all with the Priority 2 seller photographs (B14, B15; B12, B17, B18).
 */
export const PROMOTED_SELLERS = [
  { code: "RAWABI", cover: PRIORITY_2.sellers.rawabi, focus: "50% 50%" },
  { code: "REDSEA", cover: PRIORITY_2.sellers.redSea, focus: "50% 50%" },
].map((row) => ({ ...row, seller: SELLER_BY_CODE[row.code] }));

export const COMPACT_SELLERS = [
  { code: "KHAZNA", cover: PRIORITY_2.sellers.khaznaCartons, focus: "50% 50%" },
  { code: "MAJD", cover: PRIORITY_2.sellers.majdForklift, focus: "50% 50%" },
  { code: "SAHEL", cover: PRIORITY_2.sellers.sahel, focus: "76% 50%" },
].map((row) => ({ ...row, seller: SELLER_BY_CODE[row.code] }));

/** Bulk & Pallets: two differently tinted panels with the Priority 2 pallet cut-outs (B1, B2). */
export const PALLETS = [
  { product: getProduct("electronics-pallet"), image: PRIORITY_2.palletElectronics, tone: "var(--vd-ivory)", action: "bid" },
  { product: getProduct("kitchen-pallet"), image: PRIORITY_2.palletKitchen, tone: "var(--vd-bluegray)", action: "cart" },
];

