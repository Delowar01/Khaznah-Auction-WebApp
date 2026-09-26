// Option 4 — the floor's lists, all derived from the shared sample catalogue.
import { PRODUCTS, isAuction, isBuyNow } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { SELLERS } from "@/data/sellers";
import { OTHER_EVENTS } from "@/data/live";
import { discountPercent } from "@/lib/catalog";

/** Open timed auctions, soonest close first. */
export const OPEN = PRODUCTS.filter((p) => isAuction(p) && p.status === "live")
  .slice()
  .sort((a, b) => a.endsIn - b.endsIn);

export const BUY_NOW_COUNT = PRODUCTS.filter((p) => isBuyNow(p)).length;

/** Window chips for the ending-soon timeline. */
export const WINDOWS = [
  { key: "15m", seconds: 15 * 60, label: "w15" },
  { key: "1h", seconds: 3600, label: "w1h" },
  { key: "3h", seconds: 3 * 3600, label: "w3h" },
  { key: "24h", seconds: 24 * 3600, label: "w24h" },
];

/** Active auctions: the next closes after the first three. */
export const ACTIVE = OPEN.slice(3, 6);

export const UPCOMING_LOTS = PRODUCTS.filter((p) => isAuction(p) && p.status === "scheduled");

export const EVENTS = OTHER_EVENTS.slice().sort((a, b) => a.startsIn - b.startsIn);

/** Buy Now stock tickets — largest saving first. */
export const STOCK = PRODUCTS.filter((p) => isBuyNow(p) && p.status === "live" && p.stock > 0 && discountPercent(p) > 0)
  .slice()
  .sort((a, b) => discountPercent(b) - discountPercent(a) || a.price - b.price)
  .slice(0, 4);

/** Categories on the floor, ordered by each category's next closing lot. */
export const FLOOR = CATEGORIES.map((category) => {
  const items = PRODUCTS.filter((p) => p.category === category.slug);
  const open = items.filter((p) => isAuction(p) && p.status === "live");
  const next = open.length ? Math.min(...open.map((p) => p.endsIn)) : null;
  return { category, open: open.length, buy: items.filter((p) => isBuyNow(p) && p.status === "live").length, next };
}).sort((a, b) => (a.next ?? Infinity) - (b.next ?? Infinity));

/** Hosts on one time axis: the live host first, then by next close. */
export const HOSTS = SELLERS.map((seller) => {
  const lots = OPEN.filter((p) => p.seller === seller.code);
  return { seller, lots, next: lots.length ? lots[0].endsIn : Infinity };
})
  .filter((row) => row.lots.length || row.seller.liveNow)
  .sort((a, b) => Number(b.seller.liveNow) - Number(a.seller.liveNow) || a.next - b.next);

/** Nonlinear axis: NOW · 15m · 1h · 3h · 12h · 24h. */
export const TICKS = [
  { s: 0, p: 0, label: { en: "Now", ar: "الآن" } },
  { s: 15 * 60, p: 0.15, label: { en: "15m", ar: "15د" } },
  { s: 3600, p: 0.34, label: { en: "1h", ar: "1س" } },
  { s: 3 * 3600, p: 0.56, label: { en: "3h", ar: "3س" } },
  { s: 12 * 3600, p: 0.8, label: { en: "12h", ar: "12س" } },
  { s: 24 * 3600, p: 1, label: { en: "24h", ar: "24س" } },
];

/** Position (0–1) of a closing time on the axis; null beyond 24 hours. */
export function axisPosition(seconds) {
  if (seconds == null || seconds < 0) return 0;
  if (seconds > TICKS[TICKS.length - 1].s) return null;
  for (let i = 1; i < TICKS.length; i += 1) {
    const a = TICKS[i - 1];
    const b = TICKS[i];
    if (seconds <= b.s) return a.p + ((seconds - a.s) / (b.s - a.s)) * (b.p - a.p);
  }
  return 1;
}
