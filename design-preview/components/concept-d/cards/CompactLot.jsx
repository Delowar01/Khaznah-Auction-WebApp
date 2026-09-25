"use client";

import Link from "next/link";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { isAuction } from "@/data/products";
import { detailPath } from "@/lib/catalog";
import { CountdownPill, useLotClock } from "../ui/Countdown";
import { Plate } from "../ui/Plate";
import { cx } from "../ui/cx";

function AuctionClock({ product }) {
  const { remaining, phase } = useLotClock(product);
  return <CountdownPill phase={phase} remaining={remaining} />;
}

/** Small thumbnail row: promo tiles, watchlist, suggestions. */
export function CompactLot({ product, onNavigate, className = "", end }) {
  const { t } = useLang();
  const { link } = useConcept();
  const auction = isAuction(product);
  return (
    <div className={cx("group relative flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-surface-2", className)}>
      <Plate image={product.images[0]} alt="" sizes="56px" pad="p-1.5" className="size-12 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1">
        <Link
          href={link(detailPath(product))}
          onClick={onNavigate}
          className="line-clamp-1 kb-sm font-semibold text-fg after:absolute after:inset-0 after:content-[''] group-hover:text-primary"
        >
          {t(product.title)}
        </Link>
        <Money value={auction ? product.currentBid : product.price} className="kb-sm font-bold text-fg-2" />
      </div>
      {end ?? (auction ? <AuctionClock product={product} /> : null)}
    </div>
  );
}
