"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ListOrdered } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { useFeedRows, useLotQueue } from "@/components/shared/live/hooks";
import { lotImage } from "@/components/shared/r3/work-media";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { GradePill, cx } from "../ui";

/** White framed panel with a sage head — the room's one panel style. */
function Panel({ id, title, aside, children, className = "" }) {
  return (
    <section aria-labelledby={id} className={cx("overflow-hidden rounded-[9px] border border-[var(--sc-line)] bg-white", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-[var(--sc-soft)] px-4 py-3">
        <h2 id={id} className="flex items-center gap-2 sc-title text-[var(--sc-ink)]">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

/**
 * The lot on the block in plain facts under the stage: number, title,
 * grade, the market saving, the note and the figures, and what comes next.
 * The figures take a third column only when the panel itself is wide enough
 * (container query): the stage column is narrow from 1200 px, and a third
 * column there left the title no room.
 */
export function LotFacts({ room, className = "" }) {
  const { ui } = useLang();
  const { lot, lotInfo, hammer, upNext } = room;
  if (!lot) return null;
  return (
    <article aria-labelledby="sc-current-lot" className={cx("@container rounded-[9px] border border-[var(--sc-line)] bg-white", className)}>
      <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-x-4 gap-y-3 p-3 @min-[26rem]:grid-cols-[96px_minmax(0,1fr)] @min-[40rem]:grid-cols-[96px_minmax(0,1fr)_auto] @min-[40rem]:items-center dt:p-4">
        <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[var(--sc-plate)]">
          <Img key={lot.order} image={lotImage(lot)} cutout alt="" sizes="96px" className="sc-multiply absolute inset-0 size-full object-contain p-2" />
        </div>
        <div className="min-w-0">
          <p className="sc-sm font-semibold text-[var(--sc-green)]">
            {ui("currentLot")} · {lotInfo.of}
          </p>
          <h2 id="sc-current-lot" className="mt-0.5 sc-h3 text-[var(--sc-ink)]">
            {lotInfo.title}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {lotInfo.grade ? <GradePill grade={lotInfo.grade} /> : null}
            {lotInfo.savingLabel && !hammer ? <span className="sc-md font-semibold text-[var(--sc-green)]">{lotInfo.savingLabel}</span> : null}
          </div>
          {lotInfo.note ? <p className="mt-1.5 sc-md text-[var(--sc-muted)] max-sm:hidden">{lotInfo.note}</p> : null}
        </div>
        <dl className="col-span-2 grid grid-cols-2 gap-3 border-t border-[var(--sc-line)] pt-3 @min-[40rem]:col-span-1 @min-[40rem]:grid-cols-1 @min-[40rem]:border-s @min-[40rem]:border-t-0 @min-[40rem]:ps-4 @min-[40rem]:pt-0">
          <div>
            <dt className="sc-sm text-[var(--sc-muted)]">{hammer ? hammer.label : lotInfo.priceLabel}</dt>
            <dd>{hammer && hammer.amount == null ? <span className="sc-lg font-semibold text-[var(--sc-muted)]">{ui("passed")}</span> : <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded-[5px] px-1 sc-price !text-[22px] !leading-7 text-[var(--sc-ink)]" symbolClassName="text-[0.66em]" />}</dd>
          </div>
          <div>
            <dt className="sc-sm text-[var(--sc-muted)]">{ui("upNext")}</dt>
            <dd className="line-clamp-2 sc-md font-medium text-[var(--sc-ink)]">{upNext || "—"}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

const STEP = {
  live: "bg-[var(--sc-red)] text-white",
  sold: "bg-[var(--sc-green)] text-white",
  passed: "bg-[var(--sc-panel)] text-[var(--sc-muted)] ring-1 ring-inset ring-[var(--sc-line)]",
  next: "bg-white text-[var(--sc-green)] ring-2 ring-inset ring-[var(--sc-green)]",
  upcoming: "bg-white text-[var(--sc-muted)] ring-1 ring-inset ring-[var(--sc-line)]",
};
// The status line under each title. The live row sits on pale red, so its
// label takes the option's deeper red (5.2:1 there; --sc-red is 4.4:1).
const STATUS_TEXT = {
  live: "font-semibold text-[var(--sc-grade-c)]",
  next: "font-semibold text-[var(--sc-green)]",
};

/**
 * The running order: a simple numbered sequence of every lot, joined by a
 * line — sold (with the price), not sold, live now, up next, upcoming.
 */
export function RunningOrder({ room, className = "" }) {
  const { ui } = useLang();
  const lots = useLotQueue(room.live);
  return (
    <Panel
      id="sc-lots"
      className={className}
      title={
        <>
          <ListOrdered aria-hidden="true" className="size-[18px] text-[var(--sc-green)]" strokeWidth={2} />
          {ui("lotsInSale")}
        </>
      }
      aside={<span className="sc-sm text-[var(--sc-muted)]">{room.event.progress}</span>}
    >
      <ol className="px-3 py-2">
        {lots.map((lot, i) => (
          <li key={lot.key} aria-current={lot.current ? "step" : undefined} className={cx("relative grid grid-cols-[32px_40px_minmax(0,1fr)] items-start gap-x-3 rounded-[7px] px-1 py-2", lot.status === "live" && "bg-[#fdeeed]")}>
            {i < lots.length - 1 ? <span aria-hidden="true" className="absolute start-[19px] top-[40px] h-[calc(100%-32px)] w-0.5 bg-[var(--sc-line)]" /> : null}
            <span aria-hidden="true" dir="ltr" className={cx("relative z-10 grid size-8 place-items-center rounded-full sc-sm font-bold tabular", STEP[lot.status])}>
              {lot.status === "sold" ? <Check className="size-4" strokeWidth={2.6} /> : lot.order}
            </span>
            <span className="relative aspect-square overflow-hidden rounded-[6px] bg-[var(--sc-plate)]">
              <Img image={lot.image} cutout alt="" sizes="40px" className="sc-multiply absolute inset-0 size-full object-contain p-1" />
            </span>
            <span className="min-w-0">
              <span className={cx("block line-clamp-2 sc-md", lot.status === "live" ? "font-semibold text-[var(--sc-ink)]" : "text-[var(--sc-ink)]")}>
                <span className="sr-only">{ui("lotOf", { n: lot.order, total: lots.length })}: </span>
                {lot.title}
              </span>
              <span className={cx("flex flex-wrap items-baseline gap-x-1.5 sc-sm", STATUS_TEXT[lot.status] || "text-[var(--sc-muted)]")}>
                {lot.label}
                {lot.status === "sold" ? <Money value={lot.finalBid} className="font-semibold text-[var(--sc-ink)]" /> : null}
                {lot.status === "next" || lot.status === "upcoming" ? (
                  <span className="font-normal text-[var(--sc-muted)]">
                    · {ui("startingBid")} <Money value={lot.startingBid} />
                  </span>
                ) : null}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

/**
 * The activity on the lot on the block, newest first: initials, bidder,
 * amount and time on ruled rows; your own bids on sage with "You" in green.
 * Scrolls inside the panel; keyboard reachable.
 */
export function Activity({ room, className = "" }) {
  const { t, ui, pl } = useLang();
  const rows = useFeedRows(room.live);
  const count = room.lot && !room.hammer ? room.lot.bidCount : 0;
  return (
    <Panel
      id="sc-activity"
      className={className}
      title={
        <>
          <span aria-hidden="true" className="size-2.5 rounded-full bg-[var(--sc-red)]" />
          {ui("activity")}
        </>
      }
      aside={count ? <span className="sc-sm text-[var(--sc-muted)]">{pl("bids", count)}</span> : null}
    >
      <div role="region" aria-labelledby="sc-activity" tabIndex={0} className="max-h-[340px] min-h-[120px] overflow-y-auto overscroll-contain outline-offset-[-2px]">
        {rows.length ? (
          <ol className="divide-y divide-[var(--sc-line)]">
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.li
                  key={row.id}
                  layout="position"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cx("relative grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5", row.own && "bg-[var(--sc-soft)]")}
                >
                  <span className="sr-only">
                    {row.spoken}, {row.ago}
                  </span>
                  <span aria-hidden="true" className={cx("grid size-[34px] place-items-center rounded-[6px] sc-xs font-bold", row.own ? "bg-[var(--sc-green)] text-white" : "bg-[var(--sc-panel)] text-[var(--sc-ink)]")}>
                    {row.initials}
                  </span>
                  <span aria-hidden="true" className="min-w-0">
                    <span className={cx("block truncate sc-md", row.own ? "font-semibold text-[var(--sc-green)]" : "text-[var(--sc-ink)]")}>{row.who}</span>
                    <span className="block sc-xs text-[var(--sc-muted)]">{row.ago}</span>
                  </span>
                  <span aria-hidden="true">
                    <Money value={row.amount} className="sc-md font-semibold text-[var(--sc-ink)]" />
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        ) : (
          <p className="px-4 py-6 text-center sc-md text-[var(--sc-muted)]">{t(C.noActivity)}</p>
        )}
      </div>
    </Panel>
  );
}
