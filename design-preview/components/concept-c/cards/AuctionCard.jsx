"use client";

import Link from "next/link";
import { Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { detailPath, getCategory, isNewListing } from "@/lib/catalog";
import { Badge, GradeChip } from "../ui/Badges";
import { CountdownText, TimeBar } from "../ui/Time";
import { cx } from "../ui/cx";
import { CardMedia, SoldBand } from "./CardMedia";
import { PHASE_BADGE, useLotClock } from "./lotState";

/** Auction card: current bid, bids, countdown and a saffron time bar along the bottom edge. */
export function AuctionCard({ product, priority = false, compact = false, className = "" }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { phase, remaining, urgency, open } = useLotClock(product);
  const category = getCategory(product.category);
  const badge = PHASE_BADGE[phase];
  const sold = phase === "sold";
  const upcoming = phase === "upcoming";

  const badges = sold ? null : (
    <>
      <Badge tone={badge.tone} live={badge.live} dia={badge.dia}>
        {ui(badge.key)}
      </Badge>
      {isNewListing(product) && !compact ? (
        <Badge tone="gold" dia>
          {ui("newListing")}
        </Badge>
      ) : null}
    </>
  );

  return (
    <article className={cx("c-card group @container relative flex flex-col overflow-hidden rounded-card border border-line bg-surface", className)}>
      <CardMedia product={product} badges={badges} compact={compact} priority={priority} footer={sold ? <SoldBand /> : null} />
      <div className={cx("flex flex-1 flex-col", compact ? "px-3 pb-4 pt-3" : "px-3 pb-4 pt-3 @min-[15rem]:px-4 @min-[15rem]:pb-5 @min-[15rem]:pt-4")}>
        <div className="flex items-center justify-between gap-2">
          <GradeChip grade={product.grade} />
          {!compact ? <span className="c-label hidden truncate @min-[15rem]:block">{t(category?.name)}</span> : null}
        </div>
        <h3 className="c-card-title mt-3 line-clamp-2 min-h-[2lh]">
          <Link href={link(detailPath(product))} className="c-stretch">
            {t(product.title)}
          </Link>
        </h3>
        <div className="mt-auto pt-4">
          <div className={cx("flex flex-col gap-2 border-t border-line @min-[15rem]:flex-row @min-[15rem]:items-end @min-[15rem]:justify-between @min-[15rem]:gap-3", compact ? "pt-3" : "pt-3.5")}>
            <div className="min-w-0">
              <p className="c-label">{ui(upcoming ? "startingBid" : sold ? "soldFor" : "currentBid")}</p>
              <Money value={product.currentBid} className={cx("c-num mt-1 font-semibold text-fg", compact ? "text-lg" : "text-lg @min-[15rem]:text-[1.3rem]")} />
              {!upcoming ? <p className="c-label mt-0.5">{pl("bids", product.bidCount)}</p> : null}
            </div>
            {open || upcoming ? (
              <div className="flex shrink-0 items-center gap-1.5 @min-[15rem]:block @min-[15rem]:text-end">
                <Timer aria-hidden="true" className="size-3.5 text-fg-3 @min-[15rem]:hidden" />
                <p className="c-label sr-only @min-[15rem]:not-sr-only">{ui(upcoming ? "startsIn" : "endsIn")}</p>
                <CountdownText seconds={remaining} urgency={urgency} className={cx("c-num block font-semibold text-fg @min-[15rem]:mt-1", compact ? "text-sm" : "text-sm @min-[15rem]:text-base")} />
              </div>
            ) : (
              <p className="shrink-0 text-sm font-semibold text-fg-3">{ui("ended")}</p>
            )}
          </div>
        </div>
      </div>
      {open ? <TimeBar seconds={remaining} urgency={urgency} /> : null}
    </article>
  );
}
