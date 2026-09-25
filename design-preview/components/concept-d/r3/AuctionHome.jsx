"use client";

import { Chrome } from "@/components/concept-d/Chrome";
import { HomePage } from "@/components/concept-d/pages/HomePage";

// Temporary (work in progress): the Round 2 home keeps this slot working
// until the Round 3A Auction Commerce home replaces it.
export function AuctionHome() {
  return (
    <Chrome>
      <HomePage />
    </Chrome>
  );
}
