"use client";

import { AuctionError } from "@/components/concept-c/visual-discovery/content/Boundaries";

// Production's auction/[slug]/error.js: retry the auction or browse auctions.
export default function Error({ reset }) {
  return <AuctionError reset={reset} />;
}
