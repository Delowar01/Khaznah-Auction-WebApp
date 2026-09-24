"use client";

import { AnimatePresence, motion } from "motion/react";
import { Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { getGrade } from "@/data/grades";
import { COPY } from "../copy";

const STATE_COPY = {
  highest: { key: "youLead", tone: "text-[var(--stage-success)] border-[var(--stage-success)]" },
  outbid: { key: "outbidLive", tone: "text-[var(--stage-live)] border-[var(--stage-live)]" },
  won: { key: "wonLive", tone: "text-[var(--stage-accent)] border-[var(--stage-accent)]" },
};

function PhaseLine({ live }) {
  const { t, ui } = useLang();
  const { phase, intermission } = live;
  const text =
    phase === "going_once" ? ui("goingOnce") : phase === "going_twice" || phase === "closing" ? ui("goingTwice") : intermission > 0 ? ui("nextLotIn", { n: intermission }) : t(COPY.bidOpen);
  const urgent = phase === "going_once" || phase === "going_twice" || phase === "closing";
  return (
    <p aria-live="polite" className={`a-eyebrow ${urgent ? "!text-[var(--stage-live)]" : "!text-[var(--stage-muted)]"}`}>
      {text}
    </p>
  );
}

/** Current lot, lot clock, bidder state and one-tap bidding. */
export function LotConsole({ live, deposit }) {
  const { t, ui, money } = useLang();
  const { current, remaining, duration, intermission, lastHammer, myState, quickBids, placeBid } = live;
  const progress = intermission > 0 ? 0 : Math.max(0, Math.min(1, remaining / duration));
  const urgent = remaining <= 10 && intermission === 0;
  const state = STATE_COPY[myState];
  const grade = current?.grade ? getGrade(current.grade) : null;

  return (
    <div className="flex h-full flex-col rounded-card border border-[var(--stage-line)] bg-[var(--stage-surface)] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="a-eyebrow !text-[var(--stage-muted)]">
          {ui("currentLot")} · {ui("lotOf", { n: current?.order ?? 0, total: live.items.length })}
        </p>
        <PhaseLine live={live} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {intermission > 0 && lastHammer ? (
          <motion.div
            key={`hammer-${lastHammer.at}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 rounded-card border border-[var(--stage-accent)]/50 p-5 text-center"
          >
            <Gavel aria-hidden="true" className="mx-auto size-6 text-[var(--stage-accent)]" />
            <p className="a-display mt-3 text-[40px] text-[var(--stage-fg)]">{lastHammer.sold ? ui("soldHammer") : ui("passed")}</p>
            <p className="mt-1 text-sm text-[var(--stage-muted)]">{t(lastHammer.title)}</p>
            {lastHammer.sold ? <Money value={lastHammer.amount} className="a-serif mt-3 block text-[34px] text-[var(--stage-fg)]" /> : null}
          </motion.div>
        ) : (
          <motion.div key={`lot-${current?.order}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-5">
            <div className="flex gap-4">
              <span className="relative size-24 shrink-0 overflow-hidden rounded-card bg-plate">
                {current ? <Img image={current.image} alt="" sizes="96px" className="a-plate-img absolute inset-0 size-full object-contain p-2" /> : null}
              </span>
              <div className="min-w-0">
                <p className="a-serif text-[22px] leading-snug text-[var(--stage-fg)]">{t(current?.title)}</p>
                {grade ? <p className="mt-1 text-[13px] text-[var(--stage-muted)]">{t(grade.label)}</p> : null}
              </div>
            </div>
            <p className="mt-6 text-[12px] text-[var(--stage-muted)]">{ui("currentBid")}</p>
            <p key={current?.currentBid} className="a-serif kz-fade-up text-[52px] leading-none text-[var(--stage-fg)]">
              <Money value={current?.currentBid ?? 0} symbolClassName="text-[0.74em]" />
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <div className="flex items-center justify-between text-[12px] text-[var(--stage-muted)]">
          <span>{t(COPY.lotClock)}</span>
          <span dir="ltr" className={`tabular font-semibold ${urgent ? "text-[var(--stage-live)]" : "text-[var(--stage-fg)]"}`}>
            {intermission > 0 ? "—" : `0:${String(remaining).padStart(2, "0")}`}
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--stage-line)]">
          <div className={`a-progress h-full ${urgent ? "bg-[var(--stage-live)]" : "bg-[var(--stage-accent)]"}`} style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>

      <div className="mt-5 min-h-12" aria-live="polite">
        {state ? <p className={`border-s-2 ps-3 text-sm font-semibold ${state.tone}`}>{t(COPY[state.key])}</p> : null}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        {quickBids.map((amount, i) => (
          <button
            key={amount}
            type="button"
            disabled={intermission > 0}
            onClick={() => placeBid(amount)}
            data-testid={i === 0 ? "live-bid" : undefined}
            className={`h-14 rounded-control text-[15px] font-semibold transition-[background-color,border-color,transform] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 ${
              i === 0
                ? "col-span-2 bg-[var(--stage-fg)] text-[var(--stage)] hover:bg-white sm:text-base"
                : "border border-[var(--stage-line)] text-[var(--stage-fg)] hover:border-[var(--stage-fg)]"
            }`}
            aria-label={ui("bidAmount", { amount: money(amount) })}
          >
            {i === 0 ? (
              <>
                {ui("bidNow")} · <Money value={amount} />
              </>
            ) : (
              <Money value={amount} />
            )}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[12px] leading-relaxed text-[var(--stage-muted)]">{t(COPY.liveDeposit, { amount: money(deposit) })}</p>
    </div>
  );
}
