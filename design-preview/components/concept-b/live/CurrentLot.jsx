"use client";

import { AnimatePresence, motion } from "motion/react";
import { Clock3, RotateCcw } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { Money } from "@/components/shared/ui/Money";
import { Badge } from "../ui/Badge";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { cx } from "../ui/cx";
import { CALL_BAR, CALL_CHIP } from "./tones";

/**
 * The strip under the stage: the lot on the block (photo, number, title,
 * grade, market saving and note), its bid, then the call with the lot clock,
 * the late-bid notice, the time bar and what comes up next.
 */
export function CurrentLot({ room }) {
  const { t, ui } = useLang();
  const { lot, lotInfo, clock, call, callLabel, notice, hammer, upNext } = room;
  if (!lot) return null;
  const sold = hammer && hammer.amount != null;

  return (
    <section aria-labelledby="kb-current-lot" className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3 p-3 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:gap-4 sm:p-4">
        <Plate key={lot.order} image={lot.image} alt="" sizes="96px" pad="p-1.5" className="aspect-square rounded-lg" />
        <div className="min-w-0">
          <p className="kb-eyebrow text-primary">
            {ui("currentLot")} · {lotInfo.of}
          </p>
          <h2 id="kb-current-lot" className="mt-0.5 line-clamp-2 kb-h3 text-fg">
            {lotInfo.title}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {lotInfo.grade ? <GradeChip grade={lotInfo.grade} /> : null}
            {lotInfo.savingLabel && !hammer ? <Badge tone="accent">{lotInfo.savingLabel}</Badge> : null}
          </div>
          {lotInfo.note ? <p className="mt-1.5 hidden kb-sm text-fg-2 md:block">{lotInfo.note}</p> : null}
        </div>
        <div className="col-span-2 flex items-end justify-between gap-3 border-t border-line pt-3 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-end">
          <div>
            <p className="kb-2xs font-semibold text-fg-3">{hammer ? hammer.label : lotInfo.priceLabel}</p>
            {hammer && !sold ? (
              <p className="kb-md font-bold text-fg-2">{ui("passed")}</p>
            ) : (
              <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded-md px-1 kb-price-lg text-fg" symbolClassName="text-[0.7em]" />
            )}
          </div>
          <p className="kb-xs text-fg-3">{lotInfo.bids}</p>
        </div>
      </div>

      <div className="border-t border-line bg-surface-2/60 px-3 py-2.5 sm:px-4">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 kb-xs">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className={cx("inline-flex h-6 items-center rounded-full px-2.5 font-bold", CALL_CHIP[clock.tone])}>{callLabel}</span>
            <AnimatePresence initial={false}>
              {notice.extended ? (
                <motion.span
                  key="late"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex h-6 items-center gap-1 rounded-full bg-accent/25 px-2.5 font-bold text-fg"
                >
                  <RotateCcw aria-hidden="true" className="size-3.5" />
                  {notice.text}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
          {call === "hammer" ? (
            <span className="font-bold text-primary">{hammer?.nextLabel}</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-semibold text-fg-2">
              <Clock3 aria-hidden="true" className="size-3.5" />
              <span aria-hidden="true">{t(C.lotClock)}</span>
              <span aria-hidden="true" className="font-bold text-fg tabular">
                {clock.text}
              </span>
              <span className="sr-only">{clock.spoken}</span>
            </span>
          )}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-line" role="presentation">
          <div className={cx("h-full rounded-full transition-[width] duration-1000 ease-linear", CALL_BAR[clock.tone])} style={{ width: `${clock.progress * 100}%` }} />
        </div>
        {upNext ? (
          <p className="mt-2 truncate kb-xs text-fg-3">
            {ui("upNext")}: <span className="font-semibold text-fg-2">{upNext}</span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
