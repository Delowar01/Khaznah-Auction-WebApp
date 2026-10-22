// Cart lines and totals, modelled on production's lib/cart.js and cart page
// (inventory B.7): a line's unit price is the Buy Now price (a "both" lot's
// Buy Now price), the original price shows a discount that is informational
// only, full-stock lines (pallets, and "both" lots, whose Buy Now closes the
// auction) take the whole stock and cannot change, and a line out of stock or
// above its stock blocks checkout. Totals are VAT-inclusive. Behaviour only.
import { getProduct } from "@/data/products";
import { getSeller } from "@/data/sellers";

/** One cart line from a preview cart entry ({ slug, qty }). */
export function cartLine({ slug, qty }) {
  const product = getProduct(slug);
  if (!product) return null;
  const both = product.saleType === "both";
  const unitPrice = both ? product.buyNowPrice : product.price;
  const originalPrice = both ? product.buyNowPrice : product.originalPrice || product.price;
  const stock = Math.max(0, both ? 1 : product.stock ?? 1);
  const fullStockRequired = Boolean(product.fullStockRequired) || both || product.itemType === "pallet";
  const quantity = fullStockRequired && stock > 0 ? stock : qty;
  // Lots without a seller, or the platform's own, show as Khazna (production's KHAZNA alias).
  const seller = getSeller(product.seller) || getSeller("KHAZNA");
  return {
    slug,
    product,
    seller,
    quantity,
    stock,
    unitPrice,
    originalPrice,
    discountUnit: Math.max(0, originalPrice - unitPrice),
    lineTotal: unitPrice * quantity,
    locked: fullStockRequired,
    lockReason: !fullStockRequired ? null : product.itemType === "pallet" ? "pallet" : "auction",
    outOfStock: stock <= 0,
    overStock: stock > 0 && quantity > stock,
    lowStock: stock > 0 && stock <= 3,
  };
}

export function cartLines(entries) {
  return entries.map(cartLine).filter(Boolean);
}

/** Lines grouped by seller, in the order sellers first appear (checkout places one order per seller). */
export function groupBySeller(lines) {
  const groups = [];
  for (const line of lines) {
    let group = groups.find((g) => g.seller.code === line.seller.code);
    if (!group) {
      group = { seller: line.seller, lines: [] };
      groups.push(group);
    }
    group.lines.push(line);
  }
  return groups;
}

/** Products, informational discount, VAT-inclusive total, item count and whether checkout is blocked. */
export function cartSummary(lines) {
  const products = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const discount = lines.reduce((sum, line) => sum + line.discountUnit * line.quantity, 0);
  return {
    products,
    discount,
    total: products,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    blocked: lines.some((line) => line.outOfStock || line.overStock),
    sellerCount: new Set(lines.map((line) => line.seller.code)).size,
  };
}
