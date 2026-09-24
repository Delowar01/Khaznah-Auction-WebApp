"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { formatNumber } from "@/lib/format";
import { LotImage } from "../ui/LotImage";
import { GradeChip } from "../ui/GradeChip";
import { useCopy } from "../lib/useCopy";

/** Details of the lot on the block. */
export function CurrentLot({ live }) {
  const { t, ui, pl } = useLang();
  const c = useCopy();
  const lot = live.current;
  if (!lot) return null;
  const saving = lot.marketPrice && lot.currentBid < lot.marketPrice ? Math.round(((lot.marketPrice - lot.currentBid) / lot.marketPrice) * 100) : 0;

  return (
    <section aria-labelledby="current-lot-title" className="d-panel flex gap-4 p-4">
      <LotImage image={lot.image} alt={t(lot.title)} sizes="112px" className="size-24 shrink-0 rounded-xl ring-1 ring-line sm:size-28" inset="p-2" />
      <div className="min-w-0 flex-1">
        <p className="d-label flex items-center gap-2 text-fg-3">
          {ui("currentLot")}
          <span className="d-num">{c("lotProgress", { n: live.currentIndex + 1, total: live.items.length })}</span>
        </p>
        <h2 id="current-lot-title" className="mt-1.5 text-base font-semibold text-fg sm:text-lg">
          {t(lot.title)}
        </h2>
        {lot.note ? <p className="mt-1 line-clamp-2 text-sm text-fg-2">{t(lot.note)}</p> : null}
        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
          {lot.grade ? (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">{ui("grade")}</dt>
              <dd>
                <GradeChip grade={lot.grade} size="sm" />
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-fg-3">{ui("openingBid")}</dt>
            <dd className="d-num mt-0.5 font-medium text-fg">
              <Money value={lot.startingBid} />
            </dd>
          </div>
          <div>
            <dt className="text-fg-3">{ui("minIncrement")}</dt>
            <dd className="d-num mt-0.5 font-medium text-fg">
              <Money value={lot.increment} />
            </dd>
          </div>
          <div>
            <dt className="text-fg-3">{c("bidsBidders")}</dt>
            <dd className="d-num mt-0.5 font-medium text-fg">{formatNumber(lot.bidCount)}</dd>
          </div>
          {lot.marketPrice ? (
            <div>
              <dt className="text-fg-3">{ui("marketPrice")}</dt>
              <dd className="d-num mt-0.5 font-medium text-fg">
                <Money value={lot.marketPrice} />
                {saving > 0 ? <span className="ms-1.5 text-success">−{saving}%</span> : null}
              </dd>
            </div>
          ) : null}
        </dl>
        <span className="sr-only">{pl("bids", lot.bidCount)}</span>
      </div>
    </section>
  );
}
