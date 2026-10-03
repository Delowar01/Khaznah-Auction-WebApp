"use client";

import { Clock3 } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { lotImage } from "@/components/shared/r3/work-media";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { GradePill, cx } from "../ui";

const BAR = { calm: "bg-[var(--pr-charcoal)]", warn: "bg-[var(--pr-brass)]", final: "bg-[var(--pr-timer)]", paused: "bg-[#b9b4aa]" };

/**
 * The lot on the block, set like a catalogue entry on the warm panel: the
 * cut-out on stone, the lot number large, the title, grade and note, then
 * the figures (bid, market price, what comes next). Below 1024 px — where
 * the console sits in the Bid tab — it also carries the call and the clock.
 */
export function LotBand({ room, className = "" }) {
  const { t, ui } = useLang();
  const { lot, lotInfo, clock, callLabel, hammer, upNext, live } = room;
  if (!lot) return null;
  const total = live.items.length;

  return (
    <section aria-labelledby="pm-current-lot" className={cx("grid grid-cols-[96px_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-[6px] bg-[var(--pr-panel)] p-4 sm:grid-cols-[168px_minmax(0,1fr)] md:p-6 dt:grid-cols-[248px_minmax(0,1fr)_300px] dt:gap-x-10 dt:p-8", className)}>
      <div className="relative aspect-square overflow-hidden rounded-[4px] bg-[var(--pr-stone)] max-sm:self-start">
        <Img key={lot.order} image={lotImage(lot)} cutout alt="" sizes="(min-width: 1200px) 248px, (min-width: 640px) 168px, 96px" className="pr-multiply absolute inset-0 size-full object-contain p-2 sm:p-4" />
      </div>

      <div className="min-w-0">
        <p className="flex items-center gap-3 pr-eyebrow text-[#4a4d57]">
          <span aria-hidden="true" className="pr-dash !w-6" />
          {ui("currentLot")}
        </p>
        <p className="mt-2 flex items-baseline gap-2 max-sm:hidden" aria-hidden="true">
          <span dir="ltr" className="text-[44px] font-light leading-[44px] tracking-[-0.02em] text-[var(--pr-bronze)] tabular">
            {String(lot.order).padStart(2, "0")}
          </span>
          <span dir="ltr" className="pr-md text-fg-2 tabular">
            / {String(total).padStart(2, "0")}
          </span>
        </p>
        <p className="mt-1 pr-xs text-fg-2 sm:sr-only">{lotInfo.of}</p>
        <h2 id="pm-current-lot" className="mt-1.5 pr-h3 text-fg sm:mt-3 sm:!text-[22px] sm:!leading-[28px]">
          {lotInfo.title}
        </h2>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {lotInfo.grade ? <GradePill grade={lotInfo.grade} /> : null}
          {lotInfo.savingLabel && !hammer ? <span className="pr-sm font-semibold text-[var(--pr-grade-a)]">{lotInfo.savingLabel}</span> : null}
        </div>
        {lotInfo.note ? <p className="mt-3 pr-body text-fg-2 max-sm:hidden">{lotInfo.note}</p> : null}
      </div>

      <dl className="col-span-2 grid content-start gap-3 border-t border-[#ddd6ca] pt-4 sm:grid-cols-2 dt:col-span-1 dt:grid-cols-1 dt:border-s dt:border-t-0 dt:ps-10 dt:pt-0">
        <div>
          <dt className="pr-xs text-fg-2">{hammer ? hammer.label : lotInfo.priceLabel}</dt>
          <dd className="flex flex-wrap items-baseline gap-x-2.5">
            {hammer && hammer.amount == null ? (
              <span className="pr-lg font-semibold text-fg-2">{ui("passed")}</span>
            ) : (
              <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded-[3px] px-1 pr-price text-fg" symbolClassName="text-[0.78em]" />
            )}
            <span className="pr-sm text-fg-2">{lotInfo.bids}</span>
          </dd>
        </div>
        {lot.marketPrice ? (
          <div>
            <dt className="pr-xs text-fg-2">{ui("marketPrice")}</dt>
            <dd>
              <Money value={lot.marketPrice} className="pr-lg font-semibold text-fg" />
            </dd>
          </div>
        ) : null}
        {upNext ? (
          <div className="sm:col-span-2 dt:col-span-1">
            <dt className="pr-xs text-fg-2">{ui("upNext")}</dt>
            <dd className="pr-md font-medium text-fg">{upNext}</dd>
          </div>
        ) : null}
      </dl>

      {/* Below 1024 px the console is a tab away, so the call and the clock stay here. */}
      <div className="col-span-2 lg:hidden">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pr-sm">
          <span className="font-semibold text-fg">{callLabel}</span>
          {hammer ? (
            <span className="font-semibold text-[var(--pr-bronze)]">{hammer.nextLabel}</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--pr-timer)]">
              <Clock3 aria-hidden="true" className="size-4" strokeWidth={2.2} />
              <span aria-hidden="true">{t(C.lotClock)}</span>
              <span aria-hidden="true" className="tabular">
                {clock.text}
              </span>
              <span className="sr-only">{clock.spoken}</span>
            </span>
          )}
        </div>
        <div className="h-0.5 bg-[#ddd6ca]" role="presentation">
          <div className={cx("h-full transition-[width] duration-1000 ease-linear", BAR[clock.tone])} style={{ width: `${clock.progress * 100}%` }} />
        </div>
      </div>
    </section>
  );
}
