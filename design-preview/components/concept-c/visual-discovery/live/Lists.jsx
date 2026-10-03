"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { useFeedRows, useLotQueue } from "@/components/shared/live/hooks";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { cx } from "../ui";

// Status chips on the lot tiles: written out, never colour alone.
const CHIP = {
  live: "bg-[var(--vd-live)] text-white",
  sold: "bg-[#ddf4e6] text-[var(--vd-grade-a)]",
  passed: "bg-[var(--vd-bluegray)] text-[var(--vd-muted)]",
  next: "bg-[var(--vd-indigo)] text-white",
  upcoming: "bg-white text-[var(--vd-ink)] ring-1 ring-inset ring-[var(--vd-line)]",
};
// Pastel plates, in turn, like the home page's product wall.
const PLATES = ["#ecf1f8", "#faf5eb", "#eef6f1", "#f6eef3", "#f3f1fb"];

function Figure({ lot, current }) {
  const { ui } = useLang();
  if (lot.status === "sold") return <Money value={lot.finalBid} className="vd-md font-extrabold text-[var(--vd-ink)]" />;
  if (lot.status === "passed") return null;
  if (lot.status === "live" && current != null) {
    return (
      <span className="vd-sm text-[var(--vd-muted)]">
        {ui("currentBid")} <Money value={current} className="vd-md font-extrabold text-[var(--vd-ink)]" />
      </span>
    );
  }
  return (
    <span className="vd-sm text-[var(--vd-muted)]">
      {ui("startingBid")} <Money value={lot.startingBid} className="font-bold text-[var(--vd-ink)]" />
    </span>
  );
}

/**
 * The visual lot queue: every lot as a rounded tile on a pastel plate with
 * its number and a status chip — five across on desktop, a compact list on
 * phones. The lot on the block is the current step.
 */
export function LotGrid({ room }) {
  const { ui } = useLang();
  const lots = useLotQueue(room.live);
  const current = room.lot && !room.hammer ? room.lot.currentBid : null;
  return (
    <section aria-labelledby="vd-lots" className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <h2 id="vd-lots" className="vd-h2 text-[var(--vd-ink)]">
          {ui("lotsInSale")}
        </h2>
        <p className="vd-md text-[var(--vd-muted)]">{room.event.progress}</p>
      </div>
      <ol className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:mt-5 lg:grid-cols-5 lg:gap-4">
        {lots.map((lot, i) => (
          <li
            key={lot.key}
            aria-current={lot.current ? "step" : undefined}
            className={cx(
              "grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3 rounded-[16px] border bg-white p-2 lg:flex lg:flex-col lg:items-stretch lg:gap-0 lg:p-0",
              lot.status === "live" ? "border-[var(--vd-live)] ring-1 ring-[var(--vd-live)]" : "border-[var(--vd-line)]",
              "lg:overflow-hidden",
            )}
          >
            <div className="relative aspect-square overflow-hidden rounded-[12px] lg:aspect-[4/3] lg:rounded-none" style={{ background: PLATES[i % PLATES.length] }}>
              <Img image={lot.image} cutout alt="" sizes="(min-width: 1024px) 240px, 64px" className={cx("vd-multiply absolute inset-0 size-full object-contain p-2 lg:p-5", (lot.status === "sold" || lot.status === "passed") && "opacity-70")} />
              <span aria-hidden="true" dir="ltr" className="absolute start-1 top-1 grid h-6 min-w-6 place-items-center rounded-full bg-[var(--vd-navy)] px-1.5 vd-label text-white tabular lg:start-3 lg:top-3 lg:h-7 lg:min-w-7">
                {String(lot.order).padStart(2, "0")}
              </span>
            </div>
            <div className="min-w-0 lg:p-3.5">
              <p className="line-clamp-2 vd-title text-[var(--vd-ink)]">
                <span className="sr-only">{ui("lotOf", { n: lot.order, total: lots.length })}: </span>
                {lot.title}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={cx("inline-flex h-6 items-center rounded-full px-2.5 vd-label", CHIP[lot.status])}>{lot.label}</span>
                <Figure lot={lot} current={current} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * The live chat of bids: rivals on white bubbles at the start, your own
 * bids on indigo at the end, newest first. Scrolls inside its rounded
 * panel; keyboard reachable.
 */
export function ActivityChat({ room }) {
  const { t, ui, pl } = useLang();
  const rows = useFeedRows(room.live);
  const count = room.lot && !room.hammer ? room.lot.bidCount : 0;
  return (
    <div className="min-w-0 rounded-[24px] bg-[var(--vd-bluegray)] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="vd-activity" className="flex items-center gap-2.5 vd-h3 text-[var(--vd-ink)]">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-[var(--vd-live)]" />
          {ui("activity")}
        </h2>
        {count ? <span className="rounded-full bg-white px-3 py-1 vd-sm font-semibold text-[var(--vd-indigo)]">{pl("bids", count)}</span> : null}
      </div>
      <div role="region" aria-labelledby="vd-activity" tabIndex={0} className="mt-3 max-h-[400px] min-h-[140px] overflow-y-auto overscroll-contain rounded-[16px] outline-offset-2">
        {rows.length ? (
          <ol className="grid gap-2">
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.li
                  key={row.id}
                  layout="position"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cx("relative flex items-end gap-2", row.own && "flex-row-reverse")}
                >
                  <span className="sr-only">
                    {row.spoken}, {row.ago}
                  </span>
                  <span aria-hidden="true" className={cx("grid size-8 shrink-0 place-items-center rounded-full vd-label", row.own ? "bg-[var(--vd-gold)] text-[var(--vd-ink)]" : "bg-white text-[var(--vd-indigo)]")}>
                    {row.initials}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cx(
                      "min-w-0 max-w-[80%] rounded-[16px] px-3.5 py-2",
                      row.own ? "rounded-ee-[6px] bg-[var(--vd-indigo)] text-white" : "rounded-es-[6px] bg-white text-[var(--vd-ink)]",
                    )}
                  >
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="vd-sm font-semibold">{row.who}</span>
                      <Money value={row.amount} className="vd-md font-extrabold" />
                    </span>
                    <span className={cx("block vd-xs", row.own ? "text-white/80" : "text-[var(--vd-muted)]")}>{row.ago}</span>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        ) : (
          <p className="rounded-[16px] bg-white px-4 py-6 text-center vd-md text-[var(--vd-muted)]">{t(C.noActivity)}</p>
        )}
      </div>
    </div>
  );
}
