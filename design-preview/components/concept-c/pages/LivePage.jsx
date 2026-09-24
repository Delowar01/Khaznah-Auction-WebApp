"use client";

import { useLiveEvent } from "@/lib/useLiveEvent";
import { LiveHead } from "../live/LiveHead";
import { LiveStage } from "../live/LiveStage";
import { CurrentLot, HammerCard } from "../live/CurrentLot";
import { LiveBidPanel } from "../live/LiveBidPanel";
import { ActivityFeed } from "../live/ActivityFeed";
import { LotTimeline } from "../live/LotTimeline";
import { OtherEvents } from "../live/OtherEvents";
import { LiveMobileBar } from "../live/LiveMobileBar";

export function LivePage() {
  const live = useLiveEvent();
  return (
    <div>
      <LiveHead live={live} />
      {/* DOM order stage → bidding → sequence keeps small screens in reading order. */}
      <div className="c-container grid gap-6 py-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-10 lg:py-12">
        <div className="min-w-0 space-y-6 lg:col-span-8 lg:col-start-1 lg:row-start-1">
          <LiveStage live={live} />
          {live.intermission > 0 ? <HammerCard live={live} /> : <CurrentLot live={live} />}
        </div>
        <aside className="min-w-0 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1">
          <div className="c-sticky-aside space-y-6">
            <LiveBidPanel live={live} />
            <ActivityFeed live={live} />
          </div>
        </aside>
        <div className="min-w-0 lg:col-span-8 lg:col-start-1 lg:row-start-2">
          <LotTimeline live={live} />
        </div>
      </div>
      <OtherEvents />
      <LiveMobileBar live={live} />
    </div>
  );
}
