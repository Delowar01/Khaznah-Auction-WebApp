// Checkout model for the Option 3 preview, after production's checkout page
// (frontend/src/app/(main)/checkout/page.js): one order per seller, the
// delivery quote for the chosen address, the pricing preview with coupons and
// automatic discounts, the wallet and cash-on-delivery rules, the Pay label
// and every condition that keeps Pay disabled. Pure functions over the
// preview's cart lines (lib/cart.js) and sample data; no network.
import { CITIES } from "@/data/sellers";
import { AUTO_DISCOUNT_NAME, QUOTE_TERMS, SAMPLE_COUPONS } from "@/data/checkoutSamples";

export const PLATFORM = "__platform__";

export const round2 = (value) => Math.round((Number(value) || 0) * 100) / 100;

/** Lines grouped into orders: one per seller, Khazna's own lots as the platform group, in first-seen order. */
export function sellerGroups(lines) {
  const groups = [];
  for (const line of lines) {
    const key = line.seller.platform ? PLATFORM : line.seller.code;
    let group = groups.find((entry) => entry.key === key);
    if (!group) {
      group = { key, seller: line.seller, lines: [] };
      groups.push(group);
    }
    group.lines.push(line);
  }
  return groups;
}

/** lot:quantity pairs — a change re-quotes delivery and re-prices before Pay is allowed again. */
export const cartSignature = (lines) => lines.map((line) => `${line.slug}:${line.quantity}`).join(",");

/** Production allows pickup for a cart of platform lots only (one group, the platform's). */
export const isPickupEligible = (groups) => groups.length === 1 && groups[0].key === PLATFORM;

const norm = (value) => String(value || "").trim().toLowerCase();

function insideCity(sellerCity, addressCity) {
  const city = CITIES[sellerCity];
  if (!city) return false;
  const typed = norm(addressCity);
  return typed === norm(city.en) || typed === norm(city.ar);
}

/**
 * POST orders/delivery/quote/ for an address: per order the delivery charge
 * (inside or outside the warehouse's city), cash-on-delivery terms, the
 * seller label and each lot's quantity cap; the combined charge.
 */
export function deliveryQuote(groups, addressCity) {
  const byGroup = {};
  let total = 0;
  for (const group of groups) {
    const code = group.seller.code;
    const inside = insideCity(group.seller.city, addressCity);
    const charge = (inside ? QUOTE_TERMS.base.inside : QUOTE_TERMS.base.outside) + (QUOTE_TERMS.surcharge[code] || 0);
    const cod = QUOTE_TERMS.homeDeliveryCodEnabled ? QUOTE_TERMS.cod[code] : null;
    byGroup[group.key] = {
      delivery_charge: charge,
      is_inside_city: inside,
      cod_available: Boolean(cod),
      cod_fee: cod ? cod.fee : 0,
      cod_max_order_value: cod ? cod.max : null,
      seller_label: group.seller.name,
      max_quantity: Object.fromEntries(group.lines.map((line) => [line.slug, line.stock])),
    };
    total += charge;
  }
  return { groups: byGroup, delivery_charge: total, home_delivery_cod_enabled: QUOTE_TERMS.homeDeliveryCodEnabled };
}

/** Coupons a seller's orders can use (SAMPLE_COUPONS is keyed by seller code). */
const couponsFor = (group) => SAMPLE_COUPONS[group.seller.code] || [];

/**
 * POST marketplace/cart/validate/ with include_coupons: per order the
 * original and discounted subtotals, the automatic discount, the coupon in
 * use (valid or not) and the coupons on offer; the totals across orders.
 */
export function pricingPreview(groups, codes) {
  const byGroup = {};
  let original = 0;
  let discount = 0;
  let subtotal = 0;
  for (const group of groups) {
    const groupOriginal = group.lines.reduce((sum, line) => sum + line.originalPrice * line.quantity, 0);
    const auto = group.lines.reduce((sum, line) => sum + line.discountUnit * line.quantity, 0);
    const afterAuto = groupOriginal - auto;
    const code = codes[group.key] || "";
    const coupons = couponsFor(group);
    const coupon = code ? coupons.find((entry) => entry.code === code) : null;
    const valid = code ? Boolean(coupon) && afterAuto >= (coupon.min_order_amount || 0) : null;
    const couponSaving = valid && coupon.discount_type === "fixed" ? Math.min(coupon.value, afterAuto) : 0;
    const applied = [];
    if (auto > 0) applied.push({ id: `auto-${group.key}`, name: AUTO_DISCOUNT_NAME, code: "", amount: auto, free_shipping: false, automatic: true });
    if (valid) applied.push({ id: coupon.id, name: coupon.name, code: coupon.code, amount: couponSaving, free_shipping: coupon.discount_type === "free_shipping", automatic: false });
    const groupDiscount = auto + couponSaving;
    byGroup[group.key] = {
      discount_code: code,
      discount_code_valid: valid,
      free_shipping: Boolean(valid && coupon.discount_type === "free_shipping"),
      original_subtotal: groupOriginal,
      discount_amount: groupDiscount,
      subtotal: groupOriginal - groupDiscount,
      applied_discounts: applied,
      available_coupons: coupons.map((entry) => ({ ...entry, savings: entry.discount_type === "fixed" ? entry.value : 0 })),
    };
    original += groupOriginal;
    discount += groupDiscount;
    subtotal += groupOriginal - groupDiscount;
  }
  return { by_group: byGroup, original_subtotal: original, discount_amount: discount, subtotal };
}

/** Per-order figures (checkout page groupTotals). `quote` is the group's quote entry, `pricing` its preview entry. */
export function groupTotals(group, { method, quote, pricing, payment }) {
  const plain = group.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const products = pricing ? pricing.original_subtotal : plain;
  const discount = pricing ? pricing.discount_amount : 0;
  let deliveryCharge = quote ? quote.delivery_charge : null;
  // Free delivery from a coupon applies even before a quote exists.
  if (pricing?.free_shipping) deliveryCharge = 0;
  const delivery = method === "pickup" ? 0 : deliveryCharge || 0;
  const base = products - discount + delivery;
  const codEligible = method === "home" && Boolean(quote?.cod_available) && (quote.cod_max_order_value == null || base + quote.cod_fee <= quote.cod_max_order_value);
  const cod = codEligible && payment === "home_delivery_cod";
  const codCharge = cod ? quote.cod_fee : 0;
  return { products, discount, delivery, deliveryCharge, codEligible, cod, codCharge, orderTotal: base + codCharge };
}

/**
 * The order summary (checkout page 787-853): Products, Discount, Delivery,
 * the COD fee, Total, Pay on delivery, the online total, the wallet amount
 * and what Moyasar collects.
 */
export function checkoutSummary({ lines, method, totals, preview, wallet, walletMode, walletInput }) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const discountTotal = lines.reduce((sum, line) => sum + Math.max(0, line.originalPrice - line.unitPrice) * line.quantity, 0);
  const carrierFee = method === "home" ? totals.reduce((sum, entry) => sum + entry.delivery, 0) : 0;
  const codFee = totals.reduce((sum, entry) => sum + entry.codCharge, 0);
  const total = round2((preview ? preview.subtotal : subtotal) + carrierFee + codFee);
  const dueLater = totals.reduce((sum, entry) => sum + (entry.cod ? entry.orderTotal : 0), 0);
  const onlineTotal = Math.max(0, round2(total - dueLater));
  const balance = wallet && wallet.status && wallet.status !== "active" ? 0 : Number(wallet?.balance || 0);
  let walletApplied = 0;
  if (walletMode === "full") walletApplied = Math.min(balance, onlineTotal);
  else if (walletMode === "partial") walletApplied = Math.max(0, Math.min(Number(walletInput) || 0, balance, onlineTotal));
  walletApplied = round2(walletApplied);
  return {
    // Before the first preview, Products is already discounted while Discount
    // also shows the automatic saving (production quirk: they don't add up).
    products: preview ? preview.original_subtotal : subtotal,
    discount: preview ? preview.discount_amount : discountTotal,
    carrierFee,
    codFee,
    total,
    dueLater,
    onlineTotal,
    balance,
    walletApplied,
    gatewayDue: Math.max(0, round2(onlineTotal - walletApplied)),
    itemsAmount: subtotal,
  };
}

/** Production's Pay label rule, in order. Returns a copy key and the amount it names. */
export function payLabel(summary) {
  if (summary.onlineTotal <= 0) return { key: "payCod", amount: null };
  if (summary.walletApplied >= summary.onlineTotal) return { key: "payWallet", amount: summary.walletApplied };
  if (summary.walletApplied > 0) return { key: "payWalletPlus", amount: summary.gatewayDue };
  return { key: "paySecure", amount: summary.gatewayDue };
}

/** The backend payment method the checkout request names (checkout page 945-952). */
export function paymentMethodFor({ totals, summary }) {
  if (totals.length === 1 && totals[0].cod) return "home_delivery_cod";
  if (summary.walletApplied >= summary.onlineTotal && summary.onlineTotal > 0) return "wallet";
  if (summary.walletApplied > 0) return "wallet_moyasar";
  return "moyasar";
}

// The checkout session the payment pages read back (the preview has no
// server: the session lives in this browser tab so /payment/moyasar/9051
// shows the amount checkout reserved).
const SESSION_KEY = "kz-checkout-session";

export function rememberSession(session) {
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function lastSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
