"use client";

import { AnimatePresence, motion } from "motion/react";
import { Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { marketSaving } from "@/lib/catalog";
import { Badge } from "../ui/Badge";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

const PHASE = {
  going_once: { tone: "kb-tag-warn", key: "goingOnce" },
  going_twice: { tone: "kb-tag-live", key: "goingTwice" },
  closing: { tone: "kb-tag-live", key: "closingNow" },
};

/** Strip under the stream: the lot on the block, its bid and the per-lot clock. */
export function CurrentLot({ live }) {
  const { t, ui, pl } = useLang();
  const lot = live.current;
  if (!lot) return null;
  const pct = live.intermission > 0 ? 0 : Math.max(0, Math.min(1, live.remaining / live.duration));
  const banner = PHASE[live.phase];
  const saving = lot.marketPrice ? marketSaving(lot, lot.currentBid) : 0;

  return (
    <section aria-labelledby="kb-current-lot" className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
      <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-4 p-4 sm:grid-cols-[112px_minmax(0,1fr)_auto]">
        <Plate image={lot.image} alt={t(lot.title)} sizes="112px" pad="p-2" className="aspect-square rounded-lg" />
        <div className="min-w-0">
          <p className="kb-eyebrow text-primary">
            {ui("currentLot")} · {ui("lotOf", { n: lot.order, total: live.items.length })}
          </p>
          <h2 id="kb-current-lot" className="mt-1 kb-h3 text-fg">
            {t(lot.title)}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {lot.grade ? <GradeChip grade={lot.grade} /> : null}
            {saving > 0 ? <Badge tone="accent">{ui("belowMarket", { pct: saving })}</Badge> : null}
          </div>
          {lot.note ? <p className="mt-1.5 hidden kb-sm text-fg-2 md:block">{t(lot.note)}</p> : null}
        </div>
        <div className="col-span-2 flex items-end justify-between gap-3 border-t border-line pt-3 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-end">
          <div>
            <p className="kb-2xs font-semibold text-fg-3">{lot.bidCount ? ui("currentBid") : ui("openingBid")}</p>
            <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded-md px-1 kb-price-lg text-fg" symbolClassName="text-[0.7em]" />
          </div>
          <p className="kb-xs text-fg-3">{lot.bidCount ? pl("bids", lot.bidCount) : t(COPY.noBidsLive)}</p>
        </div>
      </div>

      <p className="sr-only" aria-live="assertive">
        {banner ? ui(banner.key) : ""}
      </p>
      <div className="border-t border-line bg-surface-2/60 px-4 py-3">
        <div className="mb-1.5 flex items-center justify-between gap-3 kb-xs">
          <span className="flex items-center gap-1.5 font-semibold text-fg-2">
            <Timer aria-hidden="true" className="size-3.5" />
            {t(COPY.lotClock)}
          </span>
          <AnimatePresence mode="wait" initial={false}>
            {banner ? (
              <motion.span
                key={live.phase}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cx("rounded-full px-2.5 py-0.5 kb-xs font-bold", banner.tone)}
              >
                {ui(banner.key)}
              </motion.span>
            ) : (
              <span key="time" className="font-bold text-fg tabular" dir="ltr">
                {t(COPY.secondsShort, { n: live.remaining })}
              </span>
            )}
          </AnimatePresence>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-line">
          <div
            className={cx("h-full rounded-full transition-[width] duration-1000 ease-linear", live.remaining <= 5 ? "bg-live" : live.remaining <= 10 ? "bg-warning" : "bg-primary")}
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        {live.nextItem ? (
          <p className="mt-2 truncate kb-xs text-fg-3">
            {ui("upNext")}: <span className="font-semibold text-fg-2">{t(live.nextItem.title)}</span>
          </p>
        ) : null}
      </div>
    </section>
  );
}
