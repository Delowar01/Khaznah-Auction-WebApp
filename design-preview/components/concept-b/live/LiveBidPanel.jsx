"use client";

import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, Gavel, Hand, RotateCcw, ShieldCheck, Timer, Trophy } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY } from "@/components/shared/auction/copy";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { Money } from "@/components/shared/ui/Money";
import { RIYAL, UNIT_LABELS, formatNumber } from "@/lib/format";
import { Button } from "../ui/Button";
import { Plate } from "../ui/Plate";
import { cx } from "../ui/cx";
import { CALL_DIGITS, CALL_DOT, UNAVAILABLE } from "./tones";

const STATE = {
  highest: { box: "bg-success/10 text-success ring-success/25", icon: CircleCheck },
  outbid: { box: "bg-warning/10 text-warning ring-warning/25", icon: CircleAlert },
  won: { box: "bg-success/10 text-success ring-success/25", icon: Trophy },
};
const pad = (n) => String(n).padStart(2, "0");

/** Navy head of the console: the call, the lot clock as digits, the late-bid notice and the time line. */
function CallHead({ room }) {
  const { lang } = useLang();
  const { lotInfo, clock, callLabel, notice, hammer } = room;
  const units = UNIT_LABELS[lang] || UNIT_LABELS.en;
  const cells = [
    { key: "minutes", value: Math.floor(clock.seconds / 60) },
    { key: "seconds", value: clock.seconds % 60 },
  ];
  return (
    <div className="kb-on-dark bg-[var(--kb-indigo-950)] px-4 pb-4 pt-3 text-white sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex min-w-0 items-center gap-2 kb-sm font-bold">
          <span aria-hidden="true" className={cx("size-2 shrink-0 rounded-full", CALL_DOT[clock.tone])} />
          {callLabel}
        </p>
        {lotInfo ? <p className="shrink-0 kb-xs font-semibold text-white/75">{lotInfo.number}</p> : null}
      </div>
      {hammer ? (
        <div className="mt-3 rounded-lg bg-white/10 px-3 py-2.5">
          <p className="kb-md font-bold">{hammer.label}</p>
          <p className="mt-0.5 flex flex-wrap items-baseline justify-between gap-x-3 kb-xs text-white/80">
            <span className="min-w-0 truncate">{hammer.title}</span>
            {hammer.amount != null ? <Money value={hammer.amount} className="font-bold text-white" /> : null}
          </p>
          <p className="mt-2 kb-xs font-bold text-[var(--kb-gold-soft)]">{hammer.nextLabel}</p>
        </div>
      ) : (
        <>
          <p className="sr-only">{clock.spoken}</p>
          <div aria-hidden="true" dir="ltr" className="mt-3 flex gap-1.5">
            {cells.map((cell) => (
              <div key={cell.key} className="flex min-w-0 flex-1 flex-col items-center rounded-lg bg-white/10 px-1 py-1.5">
                <span className={cx("text-[26px] font-extrabold leading-8 tabular", CALL_DIGITS[clock.tone])}>{pad(cell.value)}</span>
                <span dir={lang === "ar" ? "rtl" : "ltr"} className="kb-2xs text-white/75">
                  {units[cell.key]}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      <AnimatePresence initial={false}>
        {notice.extended ? (
          <motion.p
            key="late"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <span className="mt-2.5 flex items-center gap-1.5 kb-xs font-bold text-[var(--kb-gold-soft)]">
              <RotateCcw aria-hidden="true" className="size-3.5 shrink-0" />
              {notice.text}
            </span>
          </motion.p>
        ) : null}
      </AnimatePresence>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15" role="presentation">
        <div
          className="h-full rounded-full bg-[var(--kb-gold-soft)] transition-[width] duration-1000 ease-linear"
          style={{ width: `${(hammer ? hammer.left : clock.progress) * 100}%` }}
        />
      </div>
    </div>
  );
}

/**
 * The bid console: the call head, the bid and the minimum next bid, the
 * bidder's state, three one-tap amounts and the main Bid (the exact amount
 * on the button), then the live rules. Between lots everything stays in
 * place, unavailable, showing the next lot's opening amounts.
 */
export function LiveBidPanel({ room }) {
  const { t, ui, money } = useLang();
  const { lot, lotInfo, bidder, paused, amounts, minNext, hammer } = room;
  const state = bidder ? STATE[bidder.kind] : null;
  const showLive = lot && !hammer;
  // The lot the console is about: the one on the block, or the next one between lots.
  const focus = hammer ? room.nextItem : lot;

  return (
    <section aria-labelledby="kb-live-bid" className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <h2 id="kb-live-bid" className="sr-only">
        {t(AUCTION_COPY.bidPanel)}
      </h2>
      {/* Below 1024 px the lot strip right above carries the call and the clock. */}
      <div className="max-lg:hidden">
        <CallHead room={room} />
      </div>
      <div className="grid gap-4 p-4 sm:p-5">
        {/* Desktop: what the bid is for, in case the lot strip is below the fold (phones show the strip right above). */}
        {focus ? (
          <div className="hidden min-w-0 items-center gap-3 border-b border-line pb-4 lg:flex">
            <Plate key={focus.order} image={focus.image} alt="" sizes="48px" pad="p-1" className="size-12 shrink-0 rounded-lg border border-line" />
            <div className="min-w-0">
              <p className="kb-2xs font-semibold text-fg-3">{hammer ? ui("upNext") : lotInfo.of}</p>
              <p className="line-clamp-2 kb-sm font-bold text-fg">{t(focus.title)}</p>
            </div>
          </div>
        ) : null}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="kb-2xs font-semibold text-fg-3">{showLive ? lotInfo.priceLabel : ui("openingBid")}</p>
            {showLive ? (
              <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded-md px-1 kb-price-lg text-fg" symbolClassName="text-[0.7em]" />
            ) : minNext != null ? (
              <Money value={minNext} className="kb-price-lg text-fg-2" symbolClassName="text-[0.7em]" />
            ) : (
              <p className="kb-price-lg text-fg-3">—</p>
            )}
          </div>
          {showLive ? (
            <div className="text-end">
              <p className="kb-2xs font-semibold text-fg-3">{ui("nextMinBid")}</p>
              <Money value={minNext} className="kb-md font-extrabold text-primary" />
            </div>
          ) : null}
        </div>

        {state ? (
          <div className={cx("kz-fade-up flex items-center gap-2 rounded-lg px-3 py-2 kb-sm font-bold ring-1 ring-inset", state.box)}>
            <state.icon aria-hidden="true" className="size-4 shrink-0" />
            {bidder.title}
          </div>
        ) : null}

        <div>
          <p id="kb-quick-bids" className="mb-1.5 kb-xs font-semibold text-fg-3">
            {ui("quickBid")}
          </p>
          <div role="group" aria-labelledby="kb-quick-bids" className="grid grid-cols-3 gap-2">
            {amounts.map((amount, i) => (
              <button
                key={i}
                type="button"
                aria-disabled={paused || undefined}
                onClick={() => room.bid(amount)}
                aria-label={amount != null ? room.bidLabel(amount) : undefined}
                className="h-11 min-w-0 rounded-control border border-line-strong bg-surface px-1 kb-sm font-bold text-fg tabular transition-colors hover:border-primary hover:text-primary aria-disabled:cursor-not-allowed aria-disabled:border-line aria-disabled:text-fg-3 aria-disabled:hover:text-fg-3"
              >
                <span dir="ltr" className="block truncate">
                  {amount != null ? `${RIYAL} ${formatNumber(amount)}` : "—"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button
          size="lg"
          block
          icon={Gavel}
          aria-disabled={paused || undefined}
          aria-label={paused ? undefined : room.bidLabel(minNext)}
          onClick={() => room.bid(minNext)}
          data-testid="live-bid"
          className={UNAVAILABLE}
        >
          {paused ? hammer?.nextLabel : ui("bidAmount", { amount: money(minNext) })}
        </Button>

        <ul className="grid gap-1.5 kb-xs text-fg-2">
          <li className="flex items-start gap-2">
            <Hand aria-hidden="true" className="mt-px size-3.5 shrink-0 text-fg-3" />
            {t(C.oneTap)}
          </li>
          <li className="flex items-start gap-2">
            <Timer aria-hidden="true" className="mt-px size-3.5 shrink-0 text-fg-3" />
            {room.notice.rule}
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck aria-hidden="true" className="mt-px size-3.5 shrink-0 text-success" />
            {room.event.deposit}
          </li>
        </ul>
      </div>
    </section>
  );
}
