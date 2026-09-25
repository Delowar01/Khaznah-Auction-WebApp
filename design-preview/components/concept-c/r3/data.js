// Option 3 — the hub's figures and module rows, all derived from the shared
// sample catalogue so every count matches the list it opens.
import { PRODUCTS, isAuction, isBuyNow } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { SELLERS } from "@/data/sellers";
import { LIVE_EVENT, OTHER_EVENTS } from "@/data/live";
import { discountPercent, endingSoon, hotAuctions, isNewListing, sellerStats } from "@/lib/catalog";

const live = PRODUCTS.filter((p) => p.status === "live");

export const COUNTS = {
  all: PRODUCTS.length,
  auctions: PRODUCTS.filter(isAuction).length,
  buyNow: PRODUCTS.filter(isBuyNow).length,
  liveEvents: LIVE_EVENT.status === "live" ? 1 : 0,
  endingHour: live.filter((p) => isAuction(p) && p.endsIn <= 3600).length,
  newToday: PRODUCTS.filter(isNewListing).length,
  bulk: PRODUCTS.filter((p) => p.itemType === "pallet" || p.itemType === "bulk").length,
  deals: PRODUCTS.filter((p) => isBuyNow(p) && p.status === "live" && discountPercent(p) > 0).length,
  maxDeal: Math.max(...PRODUCTS.filter(isBuyNow).map(discountPercent)),
  openAuctions: live.filter(isAuction).length,
};

export const SOONEST = endingSoon(1)[0];

/** Category tree rows: totals and the auction / Buy Now branches. */
export const CATEGORY_TREE = CATEGORIES.map((category) => {
  const items = PRODUCTS.filter((p) => p.category === category.slug);
  return {
    category,
    total: items.length,
    auctions: items.filter(isAuction).length,
    buyNow: items.filter(isBuyNow).length,
  };
});

/** Deals · Buy Now — largest discount first. */
export const DEALS = PRODUCTS.filter((p) => isBuyNow(p) && p.status === "live" && p.stock > 0 && discountPercent(p) > 0)
  .slice()
  .sort((a, b) => discountPercent(b) - discountPercent(a) || a.price - b.price);

/** Ending soon — open auctions by closing time, filtered by window. */
export const ENDING = endingSoon(20);
export const WINDOWS = [
  { key: "15m", seconds: 15 * 60, label: { en: "15m", ar: "15د" } },
  { key: "1h", seconds: 3600, label: { en: "1h", ar: "1س" } },
  { key: "24h", seconds: 24 * 3600, label: { en: "24h", ar: "24س" } },
];

/** Popular now — open auctions by bid count. */
export const POPULAR = hotAuctions(20);

/** Recently added — newest listings first (six across). */
export const RECENT = PRODUCTS.filter((p) => p.status !== "sold")
  .slice()
  .sort((a, b) => (a.listedHoursAgo ?? 999) - (b.listedHoursAgo ?? 999))
  .slice(0, 6);

/** Pallets & bulk rows. */
export const BULK = PRODUCTS.filter((p) => (p.itemType === "pallet" || p.itemType === "bulk") && p.status !== "sold");

/** Sellers: the live seller first, then by open listings. */
export const SELLER_ROWS = SELLERS.map((seller) => ({ seller, stats: sellerStats(seller.code) })).sort(
  (a, b) => Number(b.seller.liveNow) - Number(a.seller.liveNow) || b.stats.total - a.stats.total,
);

export const EVENTS = OTHER_EVENTS.slice().sort((a, b) => a.startsIn - b.startsIn);

/** Units inside a bulk lot: the pallet manifest total, or "Carton of 24" / "Case of 5". */
export function unitsOf(product) {
  const lines = product.palletContents?.reduce((sum, line) => sum + (line.qty || 0), 0);
  if (lines) return lines;
  const match = product.title.en.match(/(?:of|—)\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}
