"use client";

// One simulated auction engine per lot, shared by every surface in the
// concept (hero terminal, closing board, cards, ticker and the detail page).
// Each engine is the foundation's useAuction(); nesting one provider per lot
// keeps hooks static while letting any component read any lot's live state,
// so the same lot never shows two different prices on one screen.
import { createContext, useContext, useMemo } from "react";
import { PRODUCTS, isAuction } from "@/data/products";
import { useAuction } from "@/lib/useAuction";
import { useLiveEvent } from "@/lib/useLiveEvent";

const AUCTION_LOTS = PRODUCTS.filter(isAuction);
const EMPTY = {};

const MarketContext = createContext(EMPTY);
const LiveContext = createContext(null);

function Engine({ product, children }) {
  const parent = useContext(MarketContext);
  const auction = useAuction(product);
  const value = useMemo(() => ({ ...parent, [product.slug]: auction }), [parent, auction, product.slug]);
  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

function LiveEngine({ children }) {
  const live = useLiveEvent();
  return <LiveContext.Provider value={live}>{children}</LiveContext.Provider>;
}

export function MarketProvider({ children }) {
  const tree = AUCTION_LOTS.reduceRight((inner, product) => (
    <Engine key={product.slug} product={product}>
      {inner}
    </Engine>
  ), children);
  return <LiveEngine>{tree}</LiveEngine>;
}

/** Live auction state for a lot (null for Buy Now items). */
export function useLot(slug) {
  return useContext(MarketContext)[slug] || null;
}

/** Every engine, keyed by slug. */
export function useMarket() {
  return useContext(MarketContext);
}

/** The presenter-led live event. */
export function useLive() {
  return useContext(LiveContext);
}
