"use client";

import { isAuction } from "@/data/products";
import { Skeleton } from "@/components/shared/ui/Skeleton";
import { AuctionCard } from "./AuctionCard";
import { BuyNowCard } from "./BuyNowCard";

/** Picks the right card for a lot. */
export function LotCard({ product, ...props }) {
  return isAuction(product) ? <AuctionCard product={product} {...props} /> : <BuyNowCard product={product} {...props} />;
}

/** Loading placeholder with the same footprint as a card. */
export function CardSkeleton() {
  return (
    <div aria-hidden="true" className="d-panel overflow-hidden">
      <Skeleton className="aspect-[5/4] w-full" />
      <div className="space-y-3 p-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-8 rounded-md" />
        </div>
        <Skeleton className="h-4 w-11/12 rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="mt-5 h-6 w-28 rounded" />
        <Skeleton className="h-3 w-full rounded" />
      </div>
    </div>
  );
}
