// Option 4 — which shared lots each home-page section uses. Every lot comes
// from the shared sample catalogue and is chosen by the same rules as
// Option 1 (soonest-closing and most-bid auctions, biggest Buy Now savings,
// newest listings, bulk lots); collections are simple themed groupings of
// those same lots.
import { PRODUCTS, getProduct, isAuction, isBuyNow } from "@/data/products";
import { cutout } from "@/data/media";
import { endingSoon } from "@/lib/catalog";
import { dealProducts, topDeal } from "@/components/concept-d/utils/lots";

const pick = (...slugs) => slugs.map(getProduct).filter(Boolean);

export const OPEN_AUCTION_COUNT = PRODUCTS.filter((p) => isAuction(p) && p.status === "live").length;
export const BUY_NOW_COUNT = PRODUCTS.filter((p) => isBuyNow(p) && p.status === "live").length;

/** Lowest price in a group (current bid for auctions, price for Buy Now). */
export const fromPrice = (lots) => Math.min(...lots.map((p) => (isAuction(p) ? p.currentBid : p.price)));

// Collections: the board features the first; the Collections section shows
// the other three.
export const COLLECTIONS = [
  {
    key: "kitchen",
    title: { en: "Kitchen upgrades", ar: "تجديد المطبخ" },
    tone: "peach",
    href: "/browse?category=home-kitchen,home-appliances",
    lots: pick("stand-mixer", "capsule-coffee", "dutch-oven-blue", "microwave"),
  },
  {
    key: "office",
    title: { en: "Home office set-up", ar: "تجهيز مكتب المنزل" },
    tone: "sky",
    href: "/browse?category=furniture",
    lots: pick("hairpin-desk", "task-lamp", "swivel-chair", "monitor-stands-5"),
  },
  {
    key: "road",
    title: { en: "On the road", ar: "على الطريق" },
    tone: "lilac",
    href: "/browse?category=automotive",
    lots: pick("car-cooler", "seat-covers", "hardside-spinner", "tyre-inflator"),
  },
  {
    key: "under200",
    title: { en: "Under ⃁200", ar: "أقل من ⃁200" },
    tone: "butter",
    href: "/browse?max_price=200",
    lots: pick("knit-sneakers", "multimeter", "field-watch", "tool-backpack"),
  },
];

// Discovery board tiles.
const newest = PRODUCTS.filter((p) => p.status === "live")
  .slice()
  .sort((a, b) => (a.listedHoursAgo ?? 999) - (b.listedHoursAgo ?? 999));
export const BOARD = {
  collection: COLLECTIONS[0],
  deal: topDeal(),
  fresh: newest[0],
  ending: endingSoon(1)[0],
};

// Category explorer: each card shows cut-outs of the category's own lots.
export const CATEGORY_CARDS = [
  { slug: "home-appliances", tone: "mint", art: ["fridge-690", "split-ac", "washer-front"] },
  { slug: "electronics", tone: "sky", art: ["tv-43", "headphones", "bt-speaker"] },
  { slug: "home-kitchen", tone: "peach", art: ["stand-mixer", "dutch-oven-blue", "capsule-coffee"] },
  { slug: "furniture", tone: "sand", art: ["swivel-chair", "floor-lamp", "hairpin-desk"] },
  { slug: "fashion", tone: "rose", art: ["suede-tote", "knit-sneakers", "field-watch"] },
  { slug: "tools-diy", tone: "butter", art: ["multimeter", "tool-backpack", "toolkit"] },
  { slug: "automotive", tone: "lilac", art: ["car-cooler", "tyre-inflator"] },
  { slug: "bulk-pallets", tone: "sage", art: ["boxes-stack", "laptop-bags-24", "monitor-stands-5"] },
].map((card) => ({ ...card, cutouts: card.art.map((key) => cutout(key)).filter(Boolean) }));

// Price drops, the ending-soon rail and the New in feed.
export const PRICE_DROPS = dealProducts(10);
export const ENDING_RAIL = endingSoon(8);
export const NEW_IN = newest.slice(0, 16);
export const FEED_WIDE = new Set([0, 7, 12]);

// Seller collections: three live lots per seller.
export const sellerShelf = (code) => PRODUCTS.filter((p) => p.seller === code && p.status === "live").slice(0, 3);

