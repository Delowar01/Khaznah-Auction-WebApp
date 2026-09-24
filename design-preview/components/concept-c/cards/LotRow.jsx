"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { detailPath, discountPercent, getCategory, getSeller, isAuction } from "@/lib/catalog";
import { Badge, GradeChip } from "../ui/Badges";
import { ChamferFrame, PlateImage } from "../ui/Frame";
import { CountdownText, TimeBar } from "../ui/Time";
import { WatchButton } from "../ui/WatchButton";
import { cx } from "../ui/cx";
import { StockLine } from "./BuyNowCard";
import { PHASE_BADGE, useLotClock } from "./lotState";

/** List-view row: plate, title and facts, price column. */
export function LotRow({ product }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { phase, remaining, urgency, open } = useLotClock(product);
  const auction = isAuction(product);
  const category = getCategory(product.category);
  const seller = getSeller(product.seller);
  const badge = auction ? PHASE_BADGE[phase] : null;
  const off = auction ? 0 : discountPercent(product);

  return (
    <article className="c-card group relative grid grid-cols-[6.5rem_1fr] gap-4 overflow-hidden rounded-card border border-line bg-surface p-3 sm:grid-cols-[9rem_1fr_auto] sm:gap-6 sm:p-4">
      <ChamferFrame size="sm">
        <PlateImage image={product.images[0]} alt="" sizes="144px" className={cx("aspect-square", !auction && product.stock <= 0 && "[&_img]:opacity-50 [&_img]:grayscale")} />
      </ChamferFrame>
      <div className="min-w-0 self-center">
        <div className="flex flex-wrap items-center gap-2">
          <GradeChip grade={product.grade} />
          {badge ? (
            <Badge tone={badge.tone} live={badge.live} dia={badge.dia}>
              {ui(badge.key)}
            </Badge>
          ) : (
            <Badge tone="neutral">{ui("buyNow")}</Badge>
          )}
        </div>
        <h3 className="c-card-title mt-2.5 line-clamp-2">
          <Link href={link(detailPath(product))} className="c-stretch">
            {t(product.title)}
          </Link>
        </h3>
        <p className="c-label mt-1.5 truncate">
          {t(category?.name)} · {t(seller?.name)} · <span dir="ltr">{product.lot}</span>
        </p>
      </div>
      <div className="col-span-2 flex items-end justify-between gap-4 border-t border-line pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:border-s sm:ps-6 sm:pt-0">
        <div className="sm:text-end">
          <p className="c-label">{auction ? ui(phase === "upcoming" ? "startingBid" : phase === "sold" ? "soldFor" : "currentBid") : ui("price")}</p>
          <Money value={auction ? product.currentBid : product.price} className="c-num mt-0.5 text-xl font-semibold text-fg" />
          {auction ? (
            <p className="c-label">{pl("bids", product.bidCount)}</p>
          ) : off ? (
            <Money value={product.originalPrice} strike className="c-num block text-sm text-fg-3" />
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {auction ? (
            open || phase === "upcoming" ? (
              <span className="text-sm text-fg-2">
                {ui(phase === "upcoming" ? "startsIn" : "endsIn")} <CountdownText seconds={remaining} urgency={urgency} className="c-num font-semibold text-fg" />
              </span>
            ) : null
          ) : (
            <StockLine product={product} />
          )}
          <WatchButton product={product} />
        </div>
      </div>
      {open ? <TimeBar seconds={remaining} urgency={urgency} /> : null}
    </article>
  );
}
