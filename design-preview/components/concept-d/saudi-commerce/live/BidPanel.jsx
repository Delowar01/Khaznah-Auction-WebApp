"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, Gavel, Hand, RotateCcw, ShieldCheck, Timer, Trophy } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY } from "@/components/shared/auction/copy";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { Money } from "@/components/shared/ui/Money";
import { RIYAL, formatNumber } from "@/lib/format";
import { btn, cx } from "../ui";
import { ClockChip } from "./Stage";

// The call as a tag: green while open, amber for going once, ink for the
// final calls; always written out.
const CALL = {
  calm: "bg-[var(--sc-green)] text-white",
  warn: "bg-[#fff6e6] text-[var(--sc-grade-b)] ring-1 ring-inset ring-[#f0d3a8]",
  final: "bg-[var(--sc-ink)] text-white",
  paused: "bg-white text-[var(--sc-ink)] ring-1 ring-inset ring-[var(--sc-line)]",
};
const STATE = {
  highest: { box: "border-[#b7dccd] bg-[#e7f5ef] text-[var(--sc-grade-a)]", icon: CircleCheck },
  outbid: { box: "border-[#f0d3a8] bg-[#fff6e6] text-[var(--sc-grade-b)]", icon: CircleAlert },
  won: { box: "border-[#b7dccd] bg-[#e7f5ef] text-[var(--sc-grade-a)]", icon: Trophy },
};
// Stays focusable while the next lot waits (aria-disabled), so focus is never lost.
const WAITING = "aria-disabled:cursor-not-allowed aria-disabled:opacity-45";

/**
 * The framed bid panel: a sage head with the call and the red lot clock,
 * then the bid and the minimum next bid, the bidder's state, three one-tap
 * amounts and the green Bid (the exact amount on the button), with the live
 * rules on sage. Between lots it shows the result and the wait, and the
 * next lot's opening amounts, unavailable.
 */
export function BidPanel({ room }) {
  const { t, ui, money } = useLang();
  const titleId = useId();
  const { lot, lotInfo, callLabel, clock, notice, hammer, bidder, paused, amounts, minNext, nextItem } = room;
  const state = bidder ? STATE[bidder.kind] : null;
  const live = lot && !hammer;

  return (
    <section aria-labelledby={titleId} className="overflow-hidden rounded-[9px] border border-[var(--sc-line)] bg-white">
      <h2 id={titleId} className="sr-only">
        {t(AUCTION_COPY.bidPanel)}
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-[var(--sc-soft)] px-4 py-3 dt:px-5">
        <span className={cx("inline-flex h-[28px] items-center gap-1.5 rounded-[6px] px-2.5 sc-sm font-semibold", CALL[clock.tone])}>
          <Gavel aria-hidden="true" className="size-3.5" strokeWidth={2} />
          {callLabel}
        </span>
        <ClockChip room={room} className="ring-1 ring-inset ring-[var(--sc-line)]" />
      </div>
      <div className="grid gap-4 p-4 dt:p-5">
        <p className="line-clamp-2 sc-md text-[var(--sc-muted)] max-lg:hidden">
          {hammer ? (nextItem ? t(C.nextLotNamed, { title: t(nextItem.title) }) : hammer.nextLabel) : `${lotInfo?.of} · ${lotInfo?.title}`}
        </p>
        <AnimatePresence initial={false}>
          {notice.extended ? (
            <motion.p key="late" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <span className="flex items-center gap-2 rounded-[7px] border border-[#f0d3a8] bg-[#fff6e6] px-3 py-2 sc-md font-semibold text-[var(--sc-grade-b)]">
                <RotateCcw aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
                {notice.text}
              </span>
            </motion.p>
          ) : null}
        </AnimatePresence>
        {hammer ? (
          <div className="rounded-[7px] border border-[var(--sc-line)] bg-[var(--sc-panel)] px-3 py-2.5">
            <p className="sc-lg font-semibold">{hammer.label}</p>
            {hammer.amount != null ? <Money value={hammer.amount} className="sc-price !text-[22px] !leading-7" symbolClassName="text-[0.66em]" /> : null}
            <p className="mt-0.5 sc-md font-semibold text-[var(--sc-green)]">{hammer.nextLabel}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <p className="sc-md text-[var(--sc-muted)]">{live ? lotInfo.priceLabel : ui("openingBid")}</p>
            {live ? (
              <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded-[5px] px-1 text-[32px] font-bold leading-10 tracking-[-0.01em] text-[var(--sc-ink)] dt:text-[36px] dt:leading-[44px]" symbolClassName="text-[0.66em]" />
            ) : (
              <p className="text-[32px] font-bold leading-10 text-[var(--sc-muted)]">{minNext != null ? <Money value={minNext} symbolClassName="text-[0.66em]" /> : "—"}</p>
            )}
            {live ? <p className="sc-md text-[var(--sc-muted)]">{lotInfo.bids}</p> : null}
          </div>
          {live ? (
            <p className="pb-6 text-end sc-sm text-[var(--sc-muted)]">
              {ui("nextMinBid")}
              <span className="block">
                <Money value={minNext} className="sc-lg font-bold text-[var(--sc-green)]" />
              </span>
            </p>
          ) : null}
        </div>

        {state ? (
          <p className={cx("kz-fade-up flex items-center gap-2 rounded-[7px] border px-3 py-2.5 sc-md font-semibold", state.box)}>
            <state.icon aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={2} />
            {bidder.title}
          </p>
        ) : null}

        <div role="group" aria-label={ui("quickBid")} className="grid grid-cols-3 gap-2">
          {amounts.map((amount, i) => (
            <button
              key={i}
              type="button"
              aria-disabled={paused || undefined}
              aria-label={amount != null ? room.bidLabel(amount) : undefined}
              onClick={() => room.bid(amount)}
              className={cx("h-11 min-w-0 rounded-[7px] border-2 border-[var(--sc-green)] bg-white px-1 sc-md font-semibold text-[var(--sc-ink)] tabular transition-colors hover:bg-[var(--sc-soft)]", WAITING)}
            >
              <span dir="ltr" className="block truncate">
                {amount != null ? `${RIYAL} ${formatNumber(amount)}` : "—"}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-disabled={paused || undefined}
          aria-label={paused ? undefined : room.bidLabel(minNext)}
          onClick={() => room.bid(minNext)}
          className={btn("green", "lg", cx("h-[52px] w-full", WAITING))}
          data-testid="live-bid"
        >
          <Gavel aria-hidden="true" className="size-5" strokeWidth={1.9} />
          {paused ? hammer?.nextLabel : ui("bidAmount", { amount: money(minNext) })}
        </button>

        <ul className="grid gap-2 rounded-[7px] bg-[var(--sc-soft)] p-3 sc-sm text-[var(--sc-ink)]">
          <li className="flex items-start gap-2">
            <Hand aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--sc-green)]" strokeWidth={1.9} />
            {t(C.oneTap)}
          </li>
          <li className="flex items-start gap-2">
            <Timer aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--sc-green)]" strokeWidth={1.9} />
            {notice.rule}
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--sc-green)]" strokeWidth={1.9} />
            {room.event.deposit}
          </li>
        </ul>
      </div>
    </section>
  );
}
