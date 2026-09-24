"use client";

import { FEATURED_AUCTION, getProduct, isAuction } from "@/data/products";
import { AuctionView } from "../auction/AuctionView";

export function AuctionPage({ slug }) {
  const found = getProduct(slug);
  const product = found && isAuction(found) ? found : getProduct(FEATURED_AUCTION);
  // Keyed by slug so the simulated auction restarts for each lot.
  return <AuctionView key={product.slug} product={product} />;
}
