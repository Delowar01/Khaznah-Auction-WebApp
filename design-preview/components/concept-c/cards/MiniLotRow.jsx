"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { detailPath, getCategory } from "@/lib/catalog";
import { GradeChip } from "../ui/Badges";
import { ChamferFrame, PlateImage } from "../ui/Frame";
import { CountdownText, TimeBar } from "../ui/Time";
import { cx } from "../ui/cx";
import { useLotClock } from "./lotState";

/** Compact auction row for narrow columns: plate, title, bid, bids and clock. */
export function MiniLotRow({ product, className = "" }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const { remaining, urgency, open } = useLotClock(product);
  return (
    <article className={cx("c-card group relative flex items-center gap-4 overflow-hidden rounded-md border border-line bg-surface p-3 pe-4", className)}>
      <ChamferFrame size="sm" className="w-24 shrink-0">
        <PlateImage image={product.images[0]} alt="" sizes="96px" className="aspect-square" />
      </ChamferFrame>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <GradeChip grade={product.grade} />
          <span className="c-label truncate">{t(getCategory(product.category)?.name)}</span>
        </div>
        <h4 className="c-card-title mt-2 line-clamp-2">
          <Link href={link(detailPath(product))} className="c-stretch">
            {t(product.title)}
          </Link>
        </h4>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3">
          <span className="flex items-baseline gap-2">
            <Money value={product.currentBid} className="c-num text-lg font-semibold text-fg" />
            <span className="c-label">{pl("bids", product.bidCount)}</span>
          </span>
          {open ? <CountdownText seconds={remaining} urgency={urgency} className="c-num text-sm font-semibold text-fg-2" /> : null}
        </div>
      </div>
      {open ? <TimeBar seconds={remaining} urgency={urgency} /> : null}
    </article>
  );
}
