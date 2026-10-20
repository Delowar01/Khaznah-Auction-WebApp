// Option 3 — Visual Discovery Marketplace: which shared records and photos
// fill each tile of the approved layout. Products, sellers, prices and grades
// come from data/; this file only picks them and frames the photography.
import { Armchair, Car, CookingPot, Monitor, Package, Refrigerator, ShoppingBag, Wrench } from "lucide-react";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { photo } from "@/data/media";
import { getProduct } from "@/data/products";
import { SELLER_BY_CODE } from "@/data/sellers";
import { endingSoon, featuredBuyNow } from "@/lib/catalog";
import { PRIORITY_2 } from "@/components/shared/r3/work-media-p2";

/**
 * Hero cards: the approved artwork for the three ways to shop, one picture
 * per language, used exactly as supplied (assets-src/option3-cards/; the
 * words, button and products are part of each picture). Each opens the
 * existing route for its mode. `safe` is the part of the picture that must
 * always stay in view — the words, the button, the products and the live
 * dot — as [left, top, right, bottom] in the picture's own pixels; the card
 * fits the picture around it (see ModeCard in Hero.jsx).
 */
const cardSources = (name, width, height, widths) =>
  [...widths, width].map((w) => ({ src: `/images/work/option3-cards/${name}-${w}.webp`, w, h: Math.round((w * height) / width) }));

function artwork(name, width, height, widths, safe) {
  const [x0, y0, x1, y1] = safe;
  return {
    image: { kind: "scene", ratio: width / height, sources: cardSources(name, width, height, widths) },
    // Read by .vd-mode (styles/r3-visual-discovery.css); --edge feeds the edge strips.
    fit: {
      "--edge": `url("/images/work/option3-cards/${name}-${widths[0]}.webp")`,
      "--ratio": (width / height).toFixed(5),
      "--fit-x": (width / (x1 - x0)).toFixed(5),
      "--fit-y": (width / (y1 - y0)).toFixed(5),
      "--cx": ((x0 + x1) / 2 / width).toFixed(5),
      "--cy": ((y0 + y1) / 2 / height).toFixed(5),
    },
  };
}

export const HERO_CARDS = {
  auction: {
    href: "/browse?tab=auction",
    label: "modeAuction",
    sizes: "(min-width: 1200px) 560px, (min-width: 1000px) 50vw, (min-width: 640px) 56vw, calc(100vw - 24px)",
    art: {
      en: artwork("option3-auction-en", 1254, 1254, [640, 960], [75, 95, 1190, 1185]),
      ar: artwork("option3-auction-ar", 1254, 1254, [640, 960], [330, 95, 1190, 1185]),
    },
  },
  buyNow: {
    href: "/browse?tab=buy_now",
    label: "modeBuyNow",
    sizes: "(min-width: 1200px) 420px, (min-width: 1000px) 50vw, (min-width: 640px) 44vw, calc(100vw - 24px)",
    art: {
      en: artwork("option3-buy-now-en", 1564, 1006, [640, 960, 1280], [85, 210, 1445, 700]),
      ar: artwork("option3-buy-now-ar", 1565, 1005, [640, 960, 1280], [110, 210, 1495, 729]),
    },
  },
  live: {
    href: "/live-auction",
    label: "modeLive",
    sizes: "(min-width: 1200px) 420px, (min-width: 1000px) 50vw, (min-width: 640px) 44vw, calc(100vw - 24px)",
    art: {
      en: artwork("option3-live-auction-en", 1564, 1006, [640, 960, 1280], [95, 255, 1290, 727]),
      ar: artwork("option3-live-auction-ar", 1565, 1005, [640, 960, 1280], [252, 255, 1478, 732]),
    },
  },
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

/**
 * Featured Items mosaic: four live auction lots first (the dishwasher's
 * kitchen scene leads; the others stand on tinted plates), then three Buy Now
 * finds that appear nowhere else on this page, including the wall's
 * Recommended tab. `focus` keeps the whole dishwasher in the lead tile.
 */
export const FEATURED = {
  lead: { product: getProduct("dishwasher"), photo: photo("dishwasher", 1), focus: "50% 58%" },
  auctions: [
    { area: "a1", product: getProduct("fridge-690"), tone: "#e6ebf1" },
    { area: "a2", product: getProduct("swivel-chair"), tone: "#f3ebe3" },
    { area: "a3", product: getProduct("tv-43"), tone: "#dfe7f0", wide: true },
  ],
  buyNow: [
    { product: getProduct("car-cooler"), photo: photo("car-cooler", 1), focus: "50% 55%" },
    { product: getProduct("floor-lamp"), tone: "#efe7dc" },
    { product: getProduct("microwave"), tone: "#e6ebf1" },
  ],
};

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

