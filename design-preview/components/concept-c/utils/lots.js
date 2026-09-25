// Derived selectors used by B's layouts. Everything reads the shared catalogue.
import { PRODUCTS, isAuction } from "@/data/products";
import { buyNowProducts, discountPercent } from "@/lib/catalog";
import { priceOf } from "@/lib/useBrowse";

/** Buy Now lots with a real discount, largest saving first. */
export function dealProducts(limit = 10) {
  return buyNowProducts()
    .filter((p) => p.stock > 0 && p.itemType === "single" && discountPercent(p) > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, limit);
}

/** The single biggest Buy Now saving in stock. */
export function topDeal() {
  return dealProducts(1)[0] || null;
}

/** Lowest current price across full pallets ("Bulk pallets from …"). */
export function palletFromPrice() {
  const pallets = PRODUCTS.filter((p) => p.itemType === "pallet" && p.status === "live");
  return Math.min(...pallets.map(priceOf));
}

/** Share of an auction's running time already elapsed (0–1). */
export function lotProgress(product, elapsed = 0) {
  if (!isAuction(product) || product.status !== "live") return product.status === "sold" ? 1 : 0;
  const listed = (product.listedHoursAgo || 0) * 3600;
  const total = listed + product.endsIn;
  if (total <= 0) return 1;
  return Math.min(1, Math.max(0, (listed + elapsed) / total));
}

/** Units in a pallet manifest. */
export function manifestUnits(product) {
  return (product.palletContents || []).reduce((sum, line) => sum + line.qty, 0);
}
