"use client";

// Browse behaviour shared by the four options: lot facts for the cards, the
// page heading, active-filter labels, result grouping and the price-filter
// draft. Nothing here decides how anything looks.
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { cardTitle } from "@/components/shared/r3/home";
import { getCategory } from "@/data/categories";
import { GRADES, ITEM_TYPES, SOURCE_TYPES } from "@/data/grades";
import { LIVE_EVENT } from "@/data/live";
import { PRODUCTS } from "@/data/products";
import { getSeller } from "@/data/sellers";
import { auctionPhase, detailPath, discountPercent, isAuction, isNewListing } from "@/lib/catalog";
import { useRemaining } from "@/lib/clock";
import { PRICE_BOUNDS } from "@/lib/useBrowse";
import { BROWSE_COPY } from "./copy";

/** "Ending within" choices, in the order every option lists them. */
export const ENDING_WINDOWS = [
  { value: "all", key: "anyTime" },
  { value: "1h", key: "within1h" },
  { value: "6h", key: "within6h" },
  { value: "24h", key: "within24h" },
];

const WINDOW_KEY = { "1h": "within1h", "6h": "within6h", "24h": "within24h" };

/**
 * Display-ready facts about one lot: its sale type, auction phase and clock,
 * the price to show and the label that goes with it.
 */
export function useLotFacts(product) {
  const { t, ui, pl } = useLang();
  const auction = isAuction(product);
  const scheduled = product.status === "scheduled";
  const target = !auction || product.status === "sold" ? null : scheduled ? product.startsIn : product.endsIn;
  const remaining = useRemaining(target);
  const phase = auction ? auctionPhase(product, scheduled ? null : remaining) : null;
  const closed = phase === "sold" || phase === "ended";
  const seller = getSeller(product.seller);
  const title = t(product.title);

  let typeLine = t(SOURCE_TYPES[product.source]);
  if (product.itemType === "pallet" && product.quantity) typeLine = t(BROWSE_COPY.fullPallet, { units: pl("units", product.quantity) });
  else if (product.itemType === "bulk" && product.quantity) typeLine = t(BROWSE_COPY.carton, { units: pl("units", product.quantity) });
  else if (product.itemType !== "single") typeLine = t(ITEM_TYPES[product.itemType]);

  let priceLabel = null;
  if (auction) {
    if (phase === "sold") priceLabel = ui("soldFor");
    else if (phase === "ended") priceLabel = ui("winningBid");
    else if (phase === "upcoming" || !product.bidCount) priceLabel = ui("startingBid");
    else priceLabel = ui("currentBid");
  }

  return {
    auction,
    both: product.saleType === "both",
    phase,
    remaining,
    closed,
    upcoming: phase === "upcoming",
    title,
    shortTitle: cardTitle(title),
    sellerName: seller ? t(seller.name) : "",
    href: detailPath(product),
    price: auction ? product.currentBid : product.price,
    priceLabel,
    bidCount: product.bidCount ?? 0,
    buyNowPrice: product.saleType === "both" ? product.buyNowPrice : null,
    was: !auction && product.originalPrice > product.price ? product.originalPrice : null,
    discount: auction ? 0 : discountPercent(product),
    stock: product.stock,
    soldOut: !auction && product.stock <= 0,
    lowStock: !auction && product.stock > 0 && product.stock <= 5,
    isNew: isNewListing(product),
    typeLine,
    image: product.images[0],
  };
}

/** Page heading for the current Browse state: search, category, mode or everything. */
export function useBrowseHeading(state, labels = {}) {
  const { t } = useLang();
  const category = state.categories.length === 1 ? getCategory(state.categories[0]) : null;
  if (state.search) return { kind: "search", title: t(BROWSE_COPY.resultsFor, { q: state.search }), intro: null, category };
  if (category) return { kind: "category", title: t(category.name), intro: t(category.blurb), category };
  if (state.tab === "auction") return { kind: "auction", title: labels.auction ?? t(BROWSE_COPY.timedAuctions), intro: t(BROWSE_COPY.auctionsIntro), category };
  if (state.tab === "buy_now") return { kind: "buy_now", title: labels.buyNow ?? t(BROWSE_COPY.buyNow), intro: t(BROWSE_COPY.buyNowIntro), category };
  return { kind: "all", title: labels.all ?? t(BROWSE_COPY.allLots), intro: t(BROWSE_COPY.intro), category };
}

/** Human label for an active filter from useBrowse().active. */
export function useFilterLabel() {
  const { t, ui, money } = useLang();
  return (filter) => {
    switch (filter.type) {
      case "category":
        return t(getCategory(filter.value)?.name);
      case "grade":
        return t(GRADES[filter.value]?.label);
      case "itemType":
        return t(ITEM_TYPES[filter.value]);
      case "price":
        return `${money(filter.value[0])} – ${money(filter.value[1])}`;
      case "ending":
        return t(BROWSE_COPY.endsWithin, { window: ui(WINDOW_KEY[filter.value]) });
      case "inStock":
        return ui("inStockOnly");
      case "discounted":
        return ui("discounted");
      case "search":
        return t(BROWSE_COPY.quoted, { q: filter.value });
      default:
        return "";
    }
  };
}

const rankOf = (product) => (product.status === "sold" || product.status === "scheduled" ? "other" : isAuction(product) ? "auction" : "buy");

/**
 * Splits a page of results into runs of open auctions, Buy Now and the rest
 * (upcoming or closed auctions), in the order they arrive. Only meaningful
 * for the recommended order on the All tab, where auctions lead.
 */
export function groupRuns(items) {
  const runs = [];
  items.forEach((product) => {
    const kind = rankOf(product);
    const last = runs[runs.length - 1];
    if (last && last.kind === kind) last.items.push(product);
    else runs.push({ kind, items: [product] });
  });
  return runs;
}

/** True when the results are in the auction-first order that groupRuns labels. */
export const isGroupedOrder = (state) => state.tab === "all" && state.sort === "recommended";

// Catalogue-wide auction figures for the page heads (as of page load).
const OPEN_AUCTIONS = PRODUCTS.filter((p) => isAuction(p) && p.status === "live");
export const AUCTION_PULSE = {
  open: OPEN_AUCTIONS.length,
  closingHour: OPEN_AUCTIONS.filter((p) => p.endsIn <= 3600).length,
  closingToday: OPEN_AUCTIONS.filter((p) => p.endsIn <= 24 * 3600).length,
};

/** The live auction shown as a destination above the results. */
export function useLiveDestination() {
  const { t } = useLang();
  const host = getSeller(LIVE_EVENT.host);
  return {
    href: "/live-auction",
    title: t(LIVE_EVENT.title),
    host: host ? t(host.name) : "",
    viewers: LIVE_EVENT.viewers,
    live: LIVE_EVENT.status === "live",
  };
}

const STEP = 50;

/**
 * Draft value for a price slider with min / max fields: the slider settles
 * for 350 ms before filtering, typed values snap to the step and are clamped.
 */
export function usePriceDraft(value, onChange) {
  const [draft, setDraft] = useState(value);
  const [seen, setSeen] = useState(value);
  const timer = useRef(null);
  if (value[0] !== seen[0] || value[1] !== seen[1]) {
    setSeen(value);
    setDraft(value);
  }
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const slide = (next) => {
    setDraft(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onChange(next), 350);
  };
  const commit = (index) => (n) => {
    const clamped = Math.min(PRICE_BOUNDS[1], Math.max(PRICE_BOUNDS[0], Math.round(n / STEP) * STEP));
    const next = index === 0 ? [Math.min(clamped, draft[1] - STEP), draft[1]] : [draft[0], Math.max(clamped, draft[0] + STEP)];
    setDraft(next);
    onChange(next);
  };
  return { draft, slide, commitMin: commit(0), commitMax: commit(1), step: STEP, bounds: PRICE_BOUNDS };
}

/** Text field that keeps its own draft and commits on blur or Enter. */
export function useCommitField(value, onCommit) {
  const [draft, setDraft] = useState(String(value));
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    setDraft(String(value));
  }
  const commit = () => {
    const n = Number(draft);
    if (draft !== "" && Number.isFinite(n)) onCommit(n);
    else setDraft(String(value));
  };
  return {
    value: draft,
    onChange: (event) => setDraft(event.target.value),
    onBlur: commit,
    onKeyDown: (event) => {
      if (event.key === "Enter") commit();
    },
  };
}
