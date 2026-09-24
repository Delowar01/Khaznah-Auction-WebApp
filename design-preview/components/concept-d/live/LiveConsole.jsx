"use client";

import { ShieldCheck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_EVENT } from "@/data/live";
import { DEMO_USER } from "@/data/site";
import { useCopy } from "../lib/useCopy";
import { LiveBidBlock } from "./LiveBidBlock";
import { ActivityFeed } from "./ActivityFeed";

/** Bidding console: bid block (docks to the bottom on phones), deposit, activity. */
export function LiveConsole({ live, className = "" }) {
  const { ui } = useLang();
  const c = useCopy();
  return (
    <section aria-labelledby="console-title" className={`flex min-h-0 flex-col lg:rounded-card lg:border lg:border-line lg:bg-surface lg:shadow-card ${className}`}>
      <h2 id="console-title" className="sr-only">
        {c("console")}
      </h2>
      <div className="lg:border-b lg:border-line lg:p-4">
        <LiveBidBlock live={live} />
      </div>
      <div className="hidden border-b border-line px-4 py-3 lg:flex lg:items-start lg:gap-2.5">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
        <p className="text-xs text-fg-2">
          {c("liveDeposit", { amount: "" })}
          <Money value={LIVE_EVENT.depositAmount} className="d-num text-fg" />
          <span className="block text-success">
            {ui("depositCovered")} · <Money value={DEMO_USER.walletBalance} className="d-num" />
          </span>
        </p>
      </div>
      <div className="hidden min-h-0 flex-1 flex-col lg:flex">
        <div className="flex items-center justify-between px-4 pb-1 pt-3">
          <h3 className="d-label flex items-center gap-2 text-fg-3">
            <span aria-hidden="true" className="kz-live-dot" />
            {ui("activity")}
          </h3>
        </div>
        <div role="region" aria-label={ui("activity")} aria-live="off" tabIndex={0} className="d-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">
          <ActivityFeed feed={live.feed} limit={14} />
        </div>
      </div>
    </section>
  );
}
