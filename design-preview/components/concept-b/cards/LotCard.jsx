"use client";

import { isAuction } from "@/data/products";
import { AuctionCard } from "./AuctionCard";
import { BuyNowCard } from "./BuyNowCard";

/** Picks the right card for a lot's sale type. */
export function LotCard(props) {
  return isAuction(props.product) ? <AuctionCard {...props} /> : <BuyNowCard {...props} />;
}
