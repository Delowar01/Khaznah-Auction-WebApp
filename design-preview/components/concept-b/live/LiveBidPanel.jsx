"use client";

import { CircleAlert, CircleCheck, Gavel, ShieldCheck, Trophy } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_EVENT } from "@/data/live";
import { RIYAL, formatNumber } from "@/lib/format";
import { Button } from "../ui/Button";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

const STATE = {
  highest: { box: "bg-success/10 text-success ring-success/25", icon: CircleCheck, key: "youAreWinning" },
  outbid: { box: "bg-warning/10 text-warning ring-warning/25", icon: CircleAlert, key: "youAreOutbid" },
  won: { box: "bg-success/10 text-success ring-success/25", icon: Trophy, key: "youWon" },
};

/** Live bidding: current bid, next minimum, one-tap quick bids and the main bid button. */
export function LiveBidPanel({ live, className = "" }) {
  const { t, ui, money } = useLang();
  const lot = live.current;
  const paused = live.phase === "intermission" || !lot;
  const state = STATE[live.myState];

  return (
    <section aria-labelledby="kb-live-bid" className={cx("rounded-xl border border-line bg-surface p-5 shadow-card", className)}>
      <div className="flex items-center justify-between gap-2">
        <h2 id="kb-live-bid" className="flex items-center gap-2 kb-md font-bold text-fg">
          <Gavel aria-hidden="true" className="size-4 text-primary" />
          {ui("liveAuction")}
        </h2>
        <span className="kb-xs text-fg-3">{lot ? ui("lotOf", { n: lot.order, total: live.items.length }) : null}</span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="kb-2xs font-semibold text-fg-3">{lot?.bidCount ? ui("currentBid") : ui("openingBid")}</p>
          <Money key={lot?.currentBid} value={lot?.currentBid || 0} className="kz-flash -mx-1 rounded-md px-1 kb-price-lg text-fg" symbolClassName="text-[0.7em]" />
        </div>
        <div className="text-end">
          <p className="kb-2xs font-semibold text-fg-3">{ui("nextMinBid")}</p>
          <Money value={live.minNext} className="kb-md font-extrabold text-primary" />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {state ? ui(state.key) : ""}
      </p>
      {state ? (
        <div aria-hidden="true" className={cx("kz-fade-up mt-3 flex items-center gap-2 rounded-lg px-3 py-2 kb-sm font-bold ring-1 ring-inset", state.box)}>
          <state.icon className="size-4 shrink-0" />
          {ui(state.key)}
        </div>
      ) : null}

      <p className="mb-1.5 mt-4 kb-xs font-semibold text-fg-3">{ui("quickBid")}</p>
      <div className="grid grid-cols-3 gap-2">
        {live.quickBids.map((bid) => (
          <button
            key={bid}
            type="button"
            disabled={paused}
            onClick={() => live.placeBid(bid)}
            aria-label={ui("bidAmount", { amount: money(bid) })}
            className="h-11 rounded-control border border-line-strong bg-surface kb-sm font-bold text-fg tabular transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span dir="ltr">
              {RIYAL} {formatNumber(bid)}
            </span>
          </button>
        ))}
      </div>

      <Button size="lg" block icon={Gavel} disabled={paused} onClick={() => live.placeBid(live.minNext)} data-testid="live-bid" className="mt-3">
        {ui("bidAmount", { amount: money(live.minNext) })}
      </Button>

      <p className="mt-3 flex items-start gap-2 kb-xs text-fg-2">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
        {t(COPY.liveDeposit, { amount: money(LIVE_EVENT.depositAmount) })}
      </p>
    </section>
  );
}
