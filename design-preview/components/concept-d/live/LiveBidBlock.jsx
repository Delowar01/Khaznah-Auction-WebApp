"use client";

import { Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { TimeBar } from "../ui/TimeBar";
import { useChangeCount } from "../lib/hooks";
import { compactTime } from "../lib/data";
import { useCopy } from "../lib/useCopy";
import { PHASE_TEXT, PHASE_TONE, phaseLabel } from "./livePhase";

const STATE = {
  highest: { cls: "d-winning bg-accent/10 text-auction", key: "youAreWinning" },
  outbid: { cls: "bg-live/10 text-live ring-1 ring-inset ring-live/35", key: "youAreOutbid" },
  won: { cls: "d-winning bg-accent/12 text-auction", key: "youWon" },
};

/**
 * Current bid, lot clock, bidder state and quick bids. On phones the same
 * element docks to the bottom of the screen as the sticky bid bar.
 */
export function LiveBidBlock({ live }) {
  const { ui, lang } = useLang();
  const c = useCopy();
  const lot = live.current;
  const flash = useChangeCount(lot?.currentBid);
  const paused = live.intermission > 0;
  const state = STATE[live.myState];
  const [primary, ...more] = live.quickBids;

  return (
    <div className="d-glass max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-40 max-lg:border-t max-lg:border-line-strong max-lg:px-4 max-lg:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-lg:pt-3 max-lg:shadow-overlay lg:bg-transparent lg:backdrop-blur-none">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="d-label text-fg-3">{ui("currentBid")}</p>
          <Money key={flash} value={lot?.currentBid ?? 0} className={`d-num -ms-1 mt-1 rounded-md px-1 text-[28px] font-medium leading-none text-fg lg:text-[40px] ${flash ? "d-flash" : ""}`} />
        </div>
        <div className="text-end">
          <p className={`d-label ${PHASE_TEXT[live.phase]}`}>{phaseLabel(live.phase, ui, c)}</p>
          <p className={`d-num mt-1 text-lg font-medium lg:text-2xl ${PHASE_TEXT[live.phase]}`}>
            {paused ? ui("nextLotIn", { n: live.intermission }) : compactTime(live.remaining, lang)}
          </p>
        </div>
      </div>
      <TimeBar fraction={paused ? 0 : live.remaining / live.duration} tone={PHASE_TONE[live.phase]} thickness="h-1" className="mt-2.5" />

      {state ? (
        <p role="status" className={`mt-3 rounded-lg px-3 py-2 text-[13px] font-semibold max-lg:hidden ${state.cls}`}>
          {ui(state.key)}
        </p>
      ) : null}

      <p className="mt-3 hidden text-xs text-fg-3 lg:block">
        {ui("nextMinBid")} <Money value={live.minNext} className="d-num text-fg-2" />
      </p>
      <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2 lg:grid-cols-1">
        <button
          type="button"
          data-testid="live-bid"
          disabled={paused || !lot}
          onClick={() => live.placeBid(primary)}
          className="d-btn-gold inline-flex h-12 items-center justify-center gap-2 rounded-control bg-accent px-4 text-[15px] font-semibold text-on-accent transition-[filter,transform] hover:brightness-[1.07] active:translate-y-px disabled:opacity-45 lg:h-14"
        >
          <Gavel aria-hidden="true" className="size-4" />
          {ui("bidAmount", { amount: "" })}
          <Money value={primary ?? 0} className="d-num" />
        </button>
        <div className="contents lg:grid lg:grid-cols-2 lg:gap-2">
          {more.map((amount) => (
            <button
              key={amount}
              type="button"
              disabled={paused || !lot}
              onClick={() => live.placeBid(amount)}
              className="inline-flex h-12 items-center justify-center rounded-control border border-line-strong bg-surface-2 px-3 text-sm font-medium text-fg transition-colors hover:bg-elevated disabled:opacity-45"
            >
              <Money value={amount} className="d-num" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
