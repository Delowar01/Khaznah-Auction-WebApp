// Read-only selectors over the shared sample catalogue.
import { PRODUCTS, getProduct, isAuction, isBuyNow } from "@/data/products";
import { SELLERS, getSeller } from "@/data/sellers";
import { CATEGORIES, getCategory } from "@/data/categories";

export { getProduct, getSeller, getCategory, isAuction, isBuyNow };

/** Route (relative to a concept base) for a lot's detail page. */
export function detailPath(product) {
  return isAuction(product) ? `/auction/${product.slug}` : `/product/${product.slug}`;
}

export const allProducts = () => PRODUCTS;
export const openAuctions = () => PRODUCTS.filter((p) => isAuction(p) && p.status === "live");
export const upcomingAuctions = () => PRODUCTS.filter((p) => isAuction(p) && p.status === "scheduled");
export const buyNowProducts = () => PRODUCTS.filter((p) => isBuyNow(p) && p.status === "live");

export function endingSoon(limit = 6) {
  return openAuctions()
    .slice()
    .sort((a, b) => a.endsIn - b.endsIn)
    .slice(0, limit);
}

export function hotAuctions(limit = 6) {
  return openAuctions()
    .slice()
    .sort((a, b) => b.bidCount - a.bidCount)
    .slice(0, limit);
}

export function featuredBuyNow(limit = 8) {
  return buyNowProducts()
    .filter((p) => p.stock > 0)
    .slice(0, limit);
}

export function bulkLots() {
  return PRODUCTS.filter((p) => p.itemType === "pallet" || p.itemType === "bulk");
}

export function isNewListing(product) {
  return (product.listedHoursAgo ?? 999) < 24;
}

export function discountPercent(product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0;
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

export function marketSaving(product, currentBid) {
  if (!product.marketPrice) return 0;
  const bid = currentBid ?? product.currentBid;
  if (bid >= product.marketPrice) return 0;
  return Math.round(((product.marketPrice - bid) / product.marketPrice) * 100);
}

export function minNextBid(currentBid, increment, bidCount) {
  return bidCount > 0 ? currentBid + increment : currentBid;
}

/**
 * Auction phase for a lot given the seconds remaining on its clock.
 * upcoming · live · urgent (<1h) · critical (<10m) · ended · sold
 */
export function auctionPhase(product, remaining) {
  if (product.status === "sold") return "sold";
  if (product.status === "scheduled") return "upcoming";
  if (remaining != null && remaining <= 0) return "ended";
  if (remaining != null && remaining <= 10 * 60) return "critical";
  if (remaining != null && remaining <= 60 * 60) return "urgent";
  return "live";
}

export function relatedProducts(product, limit = 4) {
  const others = PRODUCTS.filter((p) => p.slug !== product.slug && p.status !== "sold");
  const sameCategory = others.filter((p) => p.category === product.category);
  const sameType = others.filter((p) => p.category !== product.category && isAuction(p) === isAuction(product));
  const rest = others.filter((p) => !sameCategory.includes(p) && !sameType.includes(p));
  return [...sameCategory, ...sameType, ...rest].slice(0, limit);
}

export function sellerProducts(code) {
  return PRODUCTS.filter((p) => p.seller === code);
}

export function sellerStats(code) {
  const items = sellerProducts(code).filter((p) => p.status === "live" || p.status === "scheduled");
  return {
    activeAuctions: items.filter(isAuction).length,
    buyNowCount: items.filter(isBuyNow).length,
    total: items.length,
    categories: [...new Set(items.map((p) => p.category))],
  };
}

export function categoryProducts(slug) {
  return PRODUCTS.filter((p) => p.category === slug);
}

// Everyday words buyers type that differ from catalogue titles.
const SYNONYMS = {
  fridge: "refrigerator",
  couch: "sofa",
  settee: "sofa",
  television: "tv",
  aircon: "air conditioner",
  "a/c": "air conditioner",
  hoover: "vacuum",
  trainers: "sneakers",
  suitcase: "spinner",
  luggage: "spinner",
};

/** True when a lot matches a free-text query (title, lot number, category, seller — both languages). */
export function matchesQuery(product, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return true;
  const category = getCategory(product.category);
  const seller = getSeller(product.seller);
  const haystack = [product.title.en, product.title.ar, product.lot, category?.name.en, category?.name.ar, seller?.name.en, seller?.name.ar]
    .join(" ")
    .toLowerCase();
  const alt = SYNONYMS[q];
  return haystack.includes(q) || (alt ? haystack.includes(alt) : false);
}

/** Lots matching a free-text query in either language. */
export function searchProducts(query) {
  const q = String(query || "").trim();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter((p) => matchesQuery(p, q));
}

export const POPULAR_SEARCHES = [
  { en: "Air conditioner", ar: "مكيّف" },
  { en: "Pallet", ar: "طبلية" },
  { en: "Leather chair", ar: "كرسي جلد" },
  { en: "Refrigerator", ar: "ثلاجة" },
  { en: "Coffee maker", ar: "ماكينة قهوة" },
];

// ── Deterministic sample bid history ────────────────────────────────────
// Seeded by lot id so the server render and the client hydrate identically.
function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const BIDDER_CODES = ["4821", "7Q3", "1190", "K27", "5530", "82F", "3314", "A09", "6672", "9D1", "2048", "M55"];

export function sampleBidHistory(product, limit = 10) {
  if (!product || !isAuction(product) || !product.bidCount) return [];
  const rand = seeded(product.id * 7919);
  const rows = [];
  let amount = product.currentBid;
  let secondsAgo = product.status === "sold" ? 7200 + 40 : 30 + Math.floor(rand() * 90);
  const count = Math.min(product.bidCount, limit);
  for (let i = 0; i < count; i += 1) {
    const code = BIDDER_CODES[Math.floor(rand() * BIDDER_CODES.length)];
    rows.push({
      id: `${product.id}-${i}`,
      amount,
      secondsAgo,
      bidder: code,
      label: { en: `Bidder ${code}`, ar: `مزايد ${code}` },
      type: rand() > 0.82 ? "proxy_auto" : "normal",
      isWinning: i === 0,
      isOwn: false,
    });
    const steps = 1 + Math.floor(rand() * 2);
    amount = Math.max(product.startingBid, amount - product.increment * steps);
    secondsAgo += 60 + Math.floor(rand() * 900);
  }
  return rows;
}

export { SELLERS, CATEGORIES, PRODUCTS };
