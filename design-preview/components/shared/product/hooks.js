"use client";

// Buy Now Product Detail behaviour shared by the four options: which product
// a route shows, its identity facts, the stock level, the quantity and its
// total, Add to cart and Buy it now (within the stock and what is already in
// the cart), the grade guide's open state and the two discovery lists.
// Nothing here decides how anything looks. Sharing, tabs, fulfilment and the
// phone bar's toast clearance come from the Auction Detail layer
// (components/shared/auction/hooks.js).
import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { AUCTION_COPY } from "@/components/shared/auction/copy";
import { getCategory } from "@/data/categories";
import { ITEM_TYPES, SOURCE_TYPES, getGrade } from "@/data/grades";
import { FEATURED_PRODUCT, getProduct, isAuction, isBuyNow } from "@/data/products";
import { CITIES, getSeller } from "@/data/sellers";
import { DEMO_USER, PAYMENT_METHODS } from "@/data/site";
import { discountPercent, relatedProducts, sellerProducts, sellerStats } from "@/lib/catalog";
import { formatMonthYear } from "@/lib/format";
import { PRODUCT_COPY as C } from "./copy";

// ── Route ──────────────────────────────────────────────────────────────────
/** The product a route shows: the slug's Buy Now product, or the featured one. */
export function resolveProduct(slug) {
  const found = slug ? getProduct(slug) : null;
  return found && isBuyNow(found) ? found : getProduct(FEATURED_PRODUCT);
}

// ── Stock ──────────────────────────────────────────────────────────────────
/** Up to LOW_STOCK left is low stock (the catalogue's "Only n left"); up to VERY_LOW_STOCK, very low. */
export const LOW_STOCK = 5;
export const VERY_LOW_STOCK = 3;

export function stockLevel(stock) {
  if (stock <= 0) return "out";
  if (stock <= VERY_LOW_STOCK) return "veryLow";
  if (stock <= LOW_STOCK) return "low";
  return "healthy";
}

/**
 * The stock in words: a short status ("Low stock") and the count ("Only 4
 * left"), never colour alone; `fill` (0–1) drives an optional quiet meter
 * on which 20 or more reads as full. A full lot is one indivisible unit, so
 * it is simply in stock or not — never "low" — and has no meter (`fill`
 * null).
 */
export function useStock(product) {
  const { t, ui } = useLang();
  const lot = Boolean(product.fullStockRequired);
  const level = lot && product.stock > 0 ? "healthy" : stockLevel(product.stock);
  return {
    level,
    soldOut: level === "out",
    status: { out: ui("outOfStock"), veryLow: t(C.veryLowStock), low: t(C.lowStock), healthy: ui("inStock") }[level],
    count: level === "out" ? ui("outOfStock") : level === "healthy" ? ui("available", { n: product.stock }) : ui("onlyLeft", { n: product.stock }),
    fill: level === "out" ? 0 : lot ? null : Math.max(0.08, Math.min(1, product.stock / 20)),
  };
}

// ── Identity and information ───────────────────────────────────────────────
/** Display-ready facts about the product, its seller and its information sections. */
export function useProductInfo(product) {
  const { t, ui, pl, lang } = useLang();
  const category = getCategory(product.category);
  const seller = getSeller(product.seller);
  const grade = getGrade(product.grade);
  const title = t(product.title);
  const categoryHref = `/browse?category=${category.slug}`;
  const units = product.quantity ? pl("units", product.quantity) : null;
  return {
    title,
    lot: product.lot,
    categoryName: t(category.name),
    categoryHref,
    // Home › Buy Now › category › product, as an auction lot's Home › Auctions › category › lot.
    crumbs: [
      { key: "home", label: ui("home"), href: "/" },
      { key: "buy", label: ui("buyNow"), href: "/browse?tab=buy_now" },
      { key: "category", label: t(category.name), href: categoryHref },
      { key: "product", label: title },
    ],
    seller,
    sellerName: seller ? t(seller.name) : "",
    sellerHref: seller ? `/seller/${seller.code}` : null,
    sellerLabel: seller?.platform ? ui("platformSeller") : ui("soldBy"),
    sellerCity: seller ? t(CITIES[seller.city]) : "",
    sellerSince: seller ? ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) }) : "",
    sellerStats: seller ? sellerStats(seller.code) : null,
    itemType: t(ITEM_TYPES[product.itemType]),
    source: t(SOURCE_TYPES[product.source]),
    // Single items name their source; cartons and pallets their item type.
    typeLine: product.itemType === "single" ? t(SOURCE_TYPES[product.source]) : t(ITEM_TYPES[product.itemType]),
    quantity: units ? t(product.itemType === "pallet" ? AUCTION_COPY.fullPallet : AUCTION_COPY.carton, { units }) : null,
    unit: product.unitLabel ? t(product.unitLabel) : null,
    priceLabel: product.unitLabel ? `${ui("price")} · ${t(product.unitLabel)}` : ui("price"),
    watchers: pl("watching", product.watchers),
    grade: { key: product.grade, label: t(grade.label), text: t(grade.text) },
    condition: t(product.conditionNote),
    description: t(product.description),
    highlights: (product.highlights || []).map((item) => t(item)),
    specs: (product.specs || []).map((row) => ({ key: row.k.en, label: t(row.k), value: t(row.v) })),
    payment: { methods: PAYMENT_METHODS, wallet: DEMO_USER.walletBalance },
  };
}

// ── Purchase ───────────────────────────────────────────────────────────────
/**
 * Quantity, total, Add to cart and Buy it now. The quantity runs from 1 to
 * the stock (one for a full lot, which cannot be split). Adding respects
 * what is already in the cart: past the stock it warns instead of adding.
 * Buy it now adds the same way and then opens the cart, as before (there is
 * no checkout in the preview; the cart's Checkout only explains the next
 * step).
 */
export function usePurchase(product, { openCart } = {}) {
  const { t, ui, money } = useLang();
  const { cart, addToCart, toast } = useStore();
  const stock = useStock(product);
  const locked = Boolean(product.fullStockRequired);
  const max = stock.soldOut ? 0 : locked ? 1 : product.stock;
  const [qty, setQtyState] = useState(1);
  const clamp = (n) => Math.min(Math.max(1, max), Math.max(1, Math.round(Number(n)) || 1));
  const setQty = (n) => setQtyState(clamp(n));
  const inCart = cart.find((item) => item.slug === product.slug)?.qty || 0;
  const pct = discountPercent(product);
  const title = t(product.title);

  const add = useCallback(() => {
    if (max <= 0) return false;
    if (inCart + qty > max) {
      toast({ tone: "warning", title: t(C.maxQty, { n: max }), description: title });
      return false;
    }
    addToCart(product.slug, qty);
    toast({ tone: "success", title: ui("addedToCart"), description: title });
    return true;
  }, [max, inCart, qty, toast, t, title, addToCart, product.slug, ui]);

  const buyNow = useCallback(() => {
    if (max <= 0) return;
    add();
    openCart?.();
  }, [max, add, openCart]);

  return {
    qty,
    setQty,
    dec: () => setQty(qty - 1),
    inc: () => setQty(qty + 1),
    canDec: !locked && qty > 1,
    canInc: !locked && qty < max,
    max,
    locked,
    stock,
    soldOut: stock.soldOut,
    inCart,
    price: product.price,
    total: qty * product.price,
    showTotal: qty > 1,
    pct,
    original: pct ? product.originalPrice : null,
    add,
    buyNow,
    text: {
      quantity: ui("quantity"),
      decrease: ui("decrease"),
      increase: ui("increase"),
      locked: t(C.fullLot),
      lockedNote: ui("fullLotOnly"),
      total: t(C.totalFor, { n: qty }),
      inCart: t(C.inCart, { n: inCart }),
      was: ui("was"),
      save: pct ? ui("save", { amount: money(product.originalPrice - product.price) }) : null,
      pct: pct ? `−${pct}%` : null,
      add: ui("addToCart"),
      buy: ui("buyItNow"),
      soldOut: ui("outOfStock"),
      similar: ui("seeSimilarItems"),
    },
    similarHref: `/browse?category=${product.category}`,
  };
}

// ── Toasts ─────────────────────────────────────────────────────────────────
/**
 * From 768 px the toast stack normally sits at the bottom end — where every
 * option's purchase panel is. On the product page it moves to the start side
 * (--kz-toast-align, as on the live auction), so "Added to your cart" never
 * lands on Buy it now; leaving the page restores the default. Phones keep the
 * centred stack above the purchase bar (useToastClearance).
 */
export function useToastsAwayFromPanel() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--kz-toast-align", "flex-start");
    return () => root.style.removeProperty("--kz-toast-align");
  }, []);
}

/** Open state of the grade guide, in the shape the Auction Detail dialogs read (`detail.guide`). */
export function useGradeGuide(product) {
  const [open, setOpen] = useState(false);
  return { product, guide: { open, show: () => setOpen(true), close: () => setOpen(false) } };
}

// ── Discovery ──────────────────────────────────────────────────────────────
// Khaznah is auction-first: where a list mixes the two, auctions come first
// (the order within each kind is kept) and Buy Now items still follow.
const auctionsFirst = (list) => [...list.filter(isAuction), ...list.filter((p) => !isAuction(p))];

/** "You may also like": the catalogue's related lots (same category first), auctions first. */
export function relatedFor(product, limit = 10) {
  return auctionsFirst(relatedProducts(product, limit));
}

/** The seller's other open lots, auctions first. */
export function moreFromSeller(product, limit) {
  const list = auctionsFirst(sellerProducts(product.seller).filter((p) => p.slug !== product.slug && p.status !== "sold"));
  return limit ? list.slice(0, limit) : list;
}
