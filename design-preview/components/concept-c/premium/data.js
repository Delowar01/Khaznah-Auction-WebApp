// Option 3 — which shared lots and photographs each home-page section uses.
// Every lot comes from the shared sample catalogue, chosen by the same rules
// as Option 1 (soonest-closing and most-bid auctions, biggest Buy Now
// savings, bulk lots); only the photography choice is this design's own.
import { PRODUCTS, getProduct, isAuction, isBuyNow } from "@/data/products";
import { BRAND_PHOTOS, photo } from "@/data/media";
import { HERO } from "@/data/site";
import { buyNowProducts, endingSoon, hotAuctions } from "@/lib/catalog";
import { dealProducts } from "@/components/concept-c/utils/lots";

const pick = (...slugs) => slugs.map(getProduct).filter(Boolean);

export const OPEN_AUCTION_COUNT = PRODUCTS.filter((p) => isAuction(p) && p.status === "live").length;
export const BUY_NOW_COUNT = PRODUCTS.filter((p) => isBuyNow(p) && p.status === "live").length;

// Hero: the featured lot, shown in its lifestyle photograph.
export const FEATURED_LOT = getProduct(HERO.featuredLot);
export const HERO_PHOTO = photo("swivel-chair", 2);

// Curated categories: lifestyle photographs where a category has one,
// otherwise a studio shot on the stone plate.
export const CATEGORY_TILES = [
  { slug: "home-appliances", area: "a", image: photo("robot-vacuum", 3), position: "50% 45%" },
  { slug: "furniture", area: "b", image: photo("floor-lamp", 1), position: "50% 55%" },
  { slug: "home-kitchen", area: "c", image: photo("stand-mixer", 1), position: "50% 60%" },
  { slug: "fashion", area: "d", image: photo("suede-tote", 0), studio: true },
  { slug: "electronics", area: "e", image: photo("headphones", 1), position: "40% 40%" },
  { slug: "tools-diy", area: "f", image: photo("wrench-set", 0), position: "50% 50%" },
  { slug: "automotive", area: "g", image: photo("car-cooler", 1), position: "50% 50%" },
  { slug: "bulk-pallets", area: "h", image: photo("boxes-stack", 0), studio: true },
];

// The Buy Now edit: three views of the fixed-price catalogue.
const singles = buyNowProducts().filter((p) => p.itemType === "single");
export const BUY_NOW_TABS = {
  best: dealProducts(8),
  fresh: singles
    .filter((p) => p.stock > 0)
    .slice()
    .sort((a, b) => (a.listedHoursAgo ?? 999) - (b.listedHoursAgo ?? 999))
    .slice(0, 8),
  all: singles.slice(0, 8),
};

// Auctions: one featured lot and four related lots per view.
export const AUCTION_VIEWS = {
  closing: endingSoon(5),
  most: hotAuctions(5),
};

// For trade buyers: both pallets, then the two carton lots.
export const TRADE = {
  pallets: pick("electronics-pallet", "kitchen-pallet"),
  cartons: pick("laptop-bags-24", "monitor-stands-5"),
  photo: BRAND_PHOTOS.warehouseFloor,
};
