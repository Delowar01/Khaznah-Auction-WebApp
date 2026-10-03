"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { useFeedRows, useLotQueue } from "@/components/shared/live/hooks";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { SectionHead, cx } from "../ui";

/**
 * The bid book: the activity on the lot on the block as fine-ruled lines,
 * newest first — bidder, amount and how long ago. Your own bids carry a
 * brass rule and "You" in bronze. Scrolls inside its frame; keyboard
 * reachable.
 */
export function BidBook({ room }) {
  const { t, ui, pl } = useLang();
  const rows = useFeedRows(room.live);
  const count = room.lot && !room.hammer ? room.lot.bidCount : 0;
  return (
    <div className="min-w-0">
      <div className="flex items-start justify-between gap-4">
        <SectionHead id="pm-activity" title={ui("activity")} />
        {count ? <p className="mt-2 shrink-0 pr-sm text-fg-2">{pl("bids", count)}</p> : null}
      </div>
      <div role="region" aria-labelledby="pm-activity" tabIndex={0} className="mt-4 max-h-[392px] min-h-[120px] overflow-y-auto overscroll-contain border-t border-line outline-offset-2">
        {rows.length ? (
          <ol>
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.li
                  key={row.id}
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cx("relative grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-line py-3 ps-3", row.own && "bg-[#fbf7ee]")}
                >
                  <span aria-hidden="true" className={cx("absolute inset-y-2 start-0 w-0.5", row.own ? "bg-[var(--pr-brass)]" : "bg-transparent")} />
                  <span className="sr-only">
                    {row.spoken}, {row.ago}
                  </span>
                  <span aria-hidden="true" className="min-w-0">
                    <span className={cx("block truncate pr-md", row.own ? "font-semibold text-[var(--pr-bronze)]" : "text-fg")}>{row.who}</span>
                    <span className="block pr-xs text-fg-2">{row.ago}</span>
                  </span>
                  <span aria-hidden="true">
                    <Money value={row.amount} className={cx("pe-1 pr-md", row.own ? "font-semibold text-fg" : "text-fg")} />
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        ) : (
          <p className="py-6 pr-md text-fg-2">{t(C.noActivity)}</p>
        )}
      </div>
    </div>
  );
}

const RESULT_TONE = { live: "text-[var(--pr-live)]", sold: "text-fg", passed: "text-fg-2", next: "text-[var(--pr-bronze)]", upcoming: "text-fg-2" };

/**
 * The sale as a catalogue: every lot in order with a large numeral, the
 * cut-out on stone, the title, its status in words and the result —
 * sold price, not sold, the live bid or the opening bid still to come.
 */
export function SaleList({ room }) {
  const { ui } = useLang();
  const lots = useLotQueue(room.live);
  const current = room.lot && !room.hammer ? room.lot.currentBid : null;
  return (
    <section aria-labelledby="pm-lots" className="min-w-0">
      <SectionHead id="pm-lots" title={ui("lotsInSale")} sub={room.event.progress} />
      <ol className="mt-4 border-t border-line">
        {lots.map((lot) => {
          let figure = (
            <>
              <span className="sr-only">{ui("startingBid")} </span>
              <Money value={lot.startingBid} className="pr-md text-fg-2" />
            </>
          );
          if (lot.status === "sold") figure = <Money value={lot.finalBid} className="pr-md font-semibold text-fg" />;
          else if (lot.status === "passed") figure = <span aria-hidden="true" className="pr-md text-fg-2">—</span>;
          else if (lot.status === "live" && current != null) {
            figure = (
              <>
                <span className="sr-only">{ui("currentBid")} </span>
                <Money value={current} className="pr-md font-semibold text-fg" />
              </>
            );
          }
          return (
            <li key={lot.key} aria-current={lot.current ? "step" : undefined} className={cx("grid grid-cols-[32px_48px_minmax(0,1fr)] items-center gap-x-3 border-b border-line py-3 sm:grid-cols-[44px_56px_minmax(0,1fr)_auto] sm:gap-x-4", lot.status === "live" && "bg-[#fbf7ee]")}>
              <span aria-hidden="true" dir="ltr" className={cx("text-[22px] font-light leading-7 tabular", lot.status === "live" ? "text-[var(--pr-bronze)]" : "text-fg-2")}>
                {String(lot.order).padStart(2, "0")}
              </span>
              <span className="relative aspect-square overflow-hidden rounded-[3px] bg-[var(--pr-stone)]">
                <Img image={lot.image} cutout alt="" sizes="56px" className="pr-multiply absolute inset-0 size-full object-contain p-1" />
              </span>
              <div className="min-w-0">
                <p className={cx("line-clamp-2 pr-title", lot.status === "live" ? "text-fg" : "font-medium text-[#3c3f49]")}>
                  <span className="sr-only">{ui("lotOf", { n: lot.order, total: lots.length })}: </span>
                  {lot.title}
                </p>
                <p className={cx("mt-0.5 flex flex-wrap items-center gap-x-2 pr-sm", RESULT_TONE[lot.status])}>
                  {lot.status === "live" ? <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--pr-live)]" /> : null}
                  <span className={cx(lot.status === "live" || lot.status === "next" ? "font-semibold" : "")}>{lot.label}</span>
                  <span className="sm:hidden">{figure}</span>
                </p>
              </div>
              <span className="hidden text-end sm:block">{figure}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
