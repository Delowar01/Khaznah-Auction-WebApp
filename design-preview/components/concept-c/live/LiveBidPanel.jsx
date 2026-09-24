"use client";

import { CircleCheck, Gavel, ShieldCheck, TriangleAlert, Trophy } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { COPY } from "../copy";
import { Button } from "../ui/Button";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";

const STATES = {
  highest: { icon: CircleCheck, tone: "border-success/35 bg-success/8 text-success", key: "youAreWinning" },
  outbid: { icon: TriangleAlert, tone: "border-warning/40 bg-warning/10 text-warning", key: "youAreOutbid" },
  won: { icon: Trophy, tone: "border-accent/60 bg-accent/12 text-(--c-gold-ink)", copy: COPY.liveWon },
};

/** Live bidding: one-tap primary bid at the minimum, two quick raises, bidder state and deposit. */
export function LiveBidPanel({ live }) {
  const { t, ui, money } = useLang();
  const { minNext, quickBids, placeBid, myState, intermission } = live;
  const state = STATES[myState];
  const paused = intermission > 0;
  const Icon = state?.icon;

  return (
    <section aria-labelledby="live-bid-title" className="rounded-md border border-line bg-surface p-5">
      <h2 id="live-bid-title" className="c-h3 flex items-center gap-2.5 text-lg">
        <Diamond variant="live" size={8} />
        {ui("placeBid")}
      </h2>
      {state ? (
        <p role="status" className={cx("kz-fade-up mt-4 flex items-center gap-2.5 rounded-md border px-3.5 py-2.5 text-sm font-semibold", state.tone)}>
          <Icon aria-hidden="true" className="size-4 shrink-0" />
          {state.copy ? t(state.copy) : ui(state.key)}
        </p>
      ) : null}
      <div className="mt-4 grid gap-2">
        <Button size="lg" block icon={Gavel} data-testid="live-bid" onClick={() => placeBid(minNext)} disabled={paused}>
          {ui("bidAmount", { amount: money(minNext) })}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          {quickBids.slice(1).map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => placeBid(amount)}
              disabled={paused}
              className="flex h-11 items-center justify-center rounded-control border border-line-strong bg-surface text-sm font-semibold text-fg transition-colors hover:border-primary hover:text-primary disabled:opacity-45"
            >
              <Money value={amount} className="c-num" />
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 flex items-start gap-2 text-sm text-fg-2">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
        {t(COPY.liveDeposit, { amount: money(live.event.depositAmount) })}
      </p>
      <p className="mt-2 text-xs text-fg-3">{ui("bindingBid")}</p>
    </section>
  );
}
