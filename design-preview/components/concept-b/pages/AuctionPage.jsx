"use client";

import { resolveAuctionLot } from "@/components/shared/auction/hooks";
import { AuctionView } from "../auction/AuctionView";

export function AuctionPage({ slug }) {
  const product = resolveAuctionLot(slug);
  // Keyed by slug so the simulated auction restarts for each lot.
  return <AuctionView key={product.slug} product={product} />;
}
