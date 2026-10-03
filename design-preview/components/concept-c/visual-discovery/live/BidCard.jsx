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
import { ClockPill } from "./Stage";

// The call as a chip: written out, coloured by how close the hammer is.
const CALL = {
  calm: "bg-[var(--vd-bluegray)] text-[var(--vd-indigo)]",
  warn: "bg-[#ffe4d6] text-[#a8401a]",
  final: "bg-[var(--vd-coral)] text-white",
  paused: "bg-[var(--vd-bluegray)] text-[var(--vd-ink)]",
};
const STATE = {
  highest: { box: "bg-[#ddf4e6] text-[var(--vd-grade-a)]", icon: CircleCheck },
  outbid: { box: "bg-[#ffe4d6] text-[#a8401a]", icon: CircleAlert },
  won: { box: "bg-[#ddf4e6] text-[var(--vd-grade-a)]", icon: Trophy },
};
// Stays focusable while the next lot waits (aria-disabled), so focus is never lost.
const WAITING = "aria-disabled:cursor-not-allowed aria-disabled:opacity-45";

/**
 * The bid card: the call and the coral clock, what is on the block, the
 * bid in large display figures with the minimum next bid, the bidder's
 * state, three pale one-tap pills and the indigo Bid pill (the exact amount
 * on it), then the live rules. Between lots it shows the result, the wait
 * and the next lot's opening amounts, unavailable.
 */
export function BidCard({ room }) {
  const { t, ui, money } = useLang();
  const titleId = useId();
  const { lot, lotInfo, clock, callLabel, notice, hammer, bidder, paused, amounts, minNext, nextItem } = room;
  const state = bidder ? STATE[bidder.kind] : null;
  const live = lot && !hammer;
  const about = hammer ? (nextItem ? t(C.nextLotNamed, { title: t(nextItem.title) }) : null) : lotInfo ? `${lotInfo.of} · ${lotInfo.title}` : null;

  return (
    <section aria-labelledby={titleId} className="grid content-start gap-4 rounded-[24px] border border-[var(--vd-line)] bg-white p-5 text-[var(--vd-ink)] [--focus:var(--vd-indigo)] shadow-[0_1px_2px_rgb(7_27_82/0.04),0_14px_34px_-20px_rgb(7_27_82/0.3)] dt:p-6">
      <h2 id={titleId} className="sr-only">
        {t(AUCTION_COPY.bidPanel)}
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={cx("inline-flex h-9 items-center rounded-full px-3.5 vd-sm font-bold", CALL[clock.tone])}>{callLabel}</span>
        <ClockPill room={room} className={hammer ? "!bg-[var(--vd-navy)]" : ""} />
      </div>
      {about ? <p className="line-clamp-2 vd-sm text-[var(--vd-muted)]">{about}</p> : null}
      <AnimatePresence initial={false}>
        {notice.extended ? (
          <motion.p key="late" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <span className="flex items-center gap-2 rounded-full bg-[#fdf1d8] px-3.5 py-2 vd-sm font-bold text-[#7a4e0c]">
              <RotateCcw aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.2} />
              {notice.text}
            </span>
          </motion.p>
        ) : null}
      </AnimatePresence>

      {hammer ? (
        <div className="rounded-[18px] bg-[var(--vd-bluegray)] px-4 py-3">
          <p className="vd-lg font-extrabold">{hammer.label}</p>
          {hammer.amount != null ? <Money value={hammer.amount} className="vd-price" symbolClassName="text-[0.7em]" /> : null}
          <p className="mt-1 vd-sm font-bold text-[var(--vd-indigo)]">{hammer.nextLabel}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <p className="vd-sm text-[var(--vd-muted)]">{live ? lotInfo.priceLabel : ui("openingBid")}</p>
          {live ? (
            <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded-[8px] px-1 vd-display text-[38px] font-extrabold leading-[44px] tracking-[-0.02em] dt:text-[42px] dt:leading-[48px]" symbolClassName="text-[0.66em]" />
          ) : (
            <p className="vd-display text-[38px] font-extrabold leading-[44px] text-[var(--vd-muted)]">{minNext != null ? <Money value={minNext} symbolClassName="text-[0.66em]" /> : "—"}</p>
          )}
        </div>
        {live ? (
          <p className="pb-1.5 text-end vd-sm text-[var(--vd-muted)]">
            {ui("nextMinBid")}
            <span className="block">
              <Money value={minNext} className="vd-md font-bold text-[var(--vd-indigo)]" />
            </span>
          </p>
        ) : null}
      </div>
      {live ? <p className="-mt-2 vd-sm font-semibold text-[var(--vd-indigo)]">{lotInfo.bids}</p> : null}

      {state ? (
        <p className={cx("kz-fade-up flex items-center gap-2 rounded-full px-4 py-2.5 vd-md font-bold", state.box)}>
          <state.icon aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={2.2} />
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
            className={cx("h-11 min-w-0 rounded-full bg-[var(--vd-bluegray)] px-1 vd-sm font-bold text-[var(--vd-indigo)] tabular transition-colors hover:bg-[#dfe7f3]", WAITING)}
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
        className={btn("indigo", "lg", cx("h-14 w-full vd-lg", WAITING))}
        data-testid="live-bid"
      >
        <Gavel aria-hidden="true" className="size-5" strokeWidth={2.1} />
        {paused ? hammer?.nextLabel : ui("bidAmount", { amount: money(minNext) })}
      </button>

      <ul className="grid gap-1.5 vd-xs text-[var(--vd-muted)]">
        <li className="flex items-start gap-2">
          <Hand aria-hidden="true" className="mt-px size-3.5 shrink-0" strokeWidth={2} />
          {t(C.oneTap)}
        </li>
        <li className="flex items-start gap-2">
          <Timer aria-hidden="true" className="mt-px size-3.5 shrink-0" strokeWidth={2} />
          {notice.rule}
        </li>
        <li className="flex items-start gap-2">
          <ShieldCheck aria-hidden="true" className="mt-px size-3.5 shrink-0 text-[var(--vd-grade-a)]" strokeWidth={2} />
          {room.event.deposit}
        </li>
      </ul>
    </section>
  );
}
