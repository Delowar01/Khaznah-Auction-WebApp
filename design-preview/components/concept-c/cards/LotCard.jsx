"use client";

import { isAuction } from "@/lib/catalog";
import { Skeleton } from "@/components/shared/ui/Skeleton";
import { cx } from "../ui/cx";
import { AuctionCard } from "./AuctionCard";
import { BuyNowCard } from "./BuyNowCard";

/** Picks the auction or Buy Now card for a lot. */
export function LotCard(props) {
  return isAuction(props.product) ? <AuctionCard {...props} /> : <BuyNowCard {...props} />;
}

/** Loading placeholder with the same proportions as a lot card. */
export function CardSkeleton({ compact = false, className = "" }) {
  return (
    <div aria-hidden="true" className={cx("flex flex-col overflow-hidden rounded-card border border-line bg-surface", className)}>
      <div className={compact ? "p-1.5 pb-0" : "p-2 pb-0"}>
        <Skeleton className="c-chamfer aspect-square" />
      </div>
      <div className={cx("flex flex-col gap-3", compact ? "p-3" : "px-4 pb-5 pt-4")}>
        <Skeleton className="h-6 w-20 rounded-xs" />
        <Skeleton className="h-4 w-11/12 rounded-xs" />
        <Skeleton className="h-4 w-2/3 rounded-xs" />
        <div className="mt-2 flex items-end justify-between border-t border-line pt-3.5">
          <Skeleton className="h-7 w-24 rounded-xs" />
          <Skeleton className="h-5 w-14 rounded-xs" />
        </div>
      </div>
    </div>
  );
}
