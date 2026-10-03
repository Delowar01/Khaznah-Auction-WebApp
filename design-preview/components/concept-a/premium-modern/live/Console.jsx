"use client";

import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, Gavel, Hand, RotateCcw, ShieldCheck, Timer, Trophy } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY } from "@/components/shared/auction/copy";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { Money } from "@/components/shared/ui/Money";
import { RIYAL, formatNumber } from "@/lib/format";
import { btn, cx } from "../ui";

// The call on charcoal: each colour clears 4.5:1 there, and the call is also written out.
const CLOCK = { calm: "text-white", warn: "text-[#e6cd96]", final: "text-[#ff9b8f]", paused: "text-white/70" };
const DOT = { calm: "bg-[#8fd6b4]", warn: "bg-[#e6cd96]", final: "bg-[#ff9b8f]", paused: "bg-white/50" };
const STATE = {
  highest: { icon: CircleCheck, tone: "text-[#8fd6b4]" },
  outbid: { icon: CircleAlert, tone: "text-[#ffb4ab]" },
  won: { icon: Trophy, tone: "text-[#8fd6b4]" },
};
const pad = (n) => String(n).padStart(2, "0");

// Stays focusable while the next lot waits (aria-disabled), so focus is never lost.
const WAITING = "aria-disabled:cursor-not-allowed aria-disabled:opacity-45";

/**
 * The charcoal console: the call and what is on the block, the lot clock
 * with a brass time rule, the bid and the minimum next bid, the bidder's
 * state, three one-tap amounts and the brass Bid (the exact amount on the
 * button), then the live rules. Between lots the result and the wait take
 * the clock's place and the amounts show the next lot's opening bids.
 */
export function Console({ room, className = "" }) {
  const { t, ui, money } = useLang();
  const { lot, lotInfo, clock, callLabel, notice, hammer, bidder, paused, amounts, minNext, nextItem } = room;
  const focusTitle = hammer ? (nextItem ? t(C.nextLotNamed, { title: t(nextItem.title) }) : null) : lotInfo?.title;
  const state = bidder ? STATE[bidder.kind] : null;

  return (
    <section aria-labelledby="pm-bid-title" className={cx("grid content-start gap-4 rounded-[6px] bg-[var(--pr-charcoal)] p-5 text-white [--focus:#e6cd96] dt:p-6", className)}>
      <h2 id="pm-bid-title" className="sr-only">
        {t(AUCTION_COPY.bidPanel)}
      </h2>
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex min-w-0 items-center gap-2 pr-md font-semibold">
          <span aria-hidden="true" className={cx("size-2 shrink-0 rounded-full", DOT[clock.tone])} />
          {callLabel}
        </p>
        {lotInfo ? <p className="shrink-0 pr-xs text-white/70">{lotInfo.of}</p> : null}
      </div>
      {/* Below 1024 px the lot band right above shows the lot, the call and the clock. */}
      {focusTitle ? <p className="line-clamp-2 pr-h3 text-white max-lg:hidden">{focusTitle}</p> : null}

      {hammer ? (
        <div className="border-y border-white/15 py-3 max-lg:hidden">
          <p className="pr-lg font-semibold">{hammer.label}</p>
          {hammer.amount != null ? <Money value={hammer.amount} className="pr-price text-white" symbolClassName="text-[0.78em]" /> : null}
          <p className="mt-1 pr-sm font-semibold text-[#e6cd96]">{hammer.nextLabel}</p>
          <div className="mt-2.5 h-0.5 bg-white/15" role="presentation">
            <div className="h-full bg-[var(--pr-brass)] transition-[width] duration-1000 ease-linear" style={{ width: `${hammer.left * 100}%` }} />
          </div>
        </div>
      ) : (
        <div className="max-lg:hidden">
          <div className="flex items-end justify-between gap-3">
            <p className="min-w-0">
              <span aria-hidden="true" className="block pr-xs text-white/70">
                {t(C.lotClock)}
              </span>
              <span className="sr-only">{clock.spoken}</span>
              <span aria-hidden="true" dir="ltr" className={cx("block text-[40px] font-bold leading-[44px] tracking-[-0.02em] tabular", CLOCK[clock.tone])}>
                {Math.floor(clock.seconds / 60)}:{pad(clock.seconds % 60)}
              </span>
            </p>
            <AnimatePresence initial={false}>
              {notice.extended ? (
                <motion.p
                  key="late"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-1 inline-flex max-w-[60%] items-center gap-1.5 text-end pr-xs font-semibold text-[#e6cd96]"
                >
                  <RotateCcw aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />
                  {notice.text}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="mt-2 h-0.5 bg-white/15" role="presentation">
            <div className="h-full bg-[var(--pr-brass)] transition-[width] duration-1000 ease-linear" style={{ width: `${clock.progress * 100}%` }} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <p className="pr-xs text-white/70">{lot && !hammer ? lotInfo.priceLabel : ui("openingBid")}</p>
          {lot && !hammer ? (
            <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded-[3px] px-1 text-[30px] font-bold leading-9 tracking-[-0.01em] text-white dt:text-[34px] dt:leading-10" symbolClassName="text-[0.7em]" />
          ) : (
            <p className="text-[30px] font-bold leading-9 text-white/70">{minNext != null ? <Money value={minNext} symbolClassName="text-[0.7em]" /> : "—"}</p>
          )}
        </div>
        {lot && !hammer ? (
          <p className="pb-1 text-end pr-xs text-white/70">
            {ui("nextMinBid")}
            <span className="block">
              <Money value={minNext} className="pr-md font-semibold text-[#e6cd96]" />
            </span>
          </p>
        ) : null}
      </div>

      {state ? (
        <p className="kz-fade-up flex items-center gap-2.5 rounded-[4px] bg-white/[0.08] px-3 py-2.5 pr-md font-semibold text-white">
          <state.icon aria-hidden="true" className={cx("size-4 shrink-0", state.tone)} strokeWidth={2} />
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
            className={cx("h-11 min-w-0 rounded-[4px] border border-white/35 px-1 pr-sm font-semibold text-white tabular transition-colors hover:bg-white/10", WAITING)}
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
        className={btn("brass", "lg", cx("h-[52px] w-full font-semibold", WAITING))}
        data-testid="live-bid"
      >
        <Gavel aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        {paused ? hammer?.nextLabel : ui("bidAmount", { amount: money(minNext) })}
      </button>

      <ul className="grid gap-1.5 pr-xs text-white/75">
        <li className="flex items-start gap-2">
          <Hand aria-hidden="true" className="mt-px size-[15px] shrink-0" strokeWidth={1.8} />
          {t(C.oneTap)}
        </li>
        <li className="flex items-start gap-2">
          <Timer aria-hidden="true" className="mt-px size-[15px] shrink-0" strokeWidth={1.8} />
          {notice.rule}
        </li>
        <li className="flex items-start gap-2">
          <ShieldCheck aria-hidden="true" className="mt-px size-[15px] shrink-0" strokeWidth={1.8} />
          {room.event.deposit}
        </li>
      </ul>
    </section>
  );
}
