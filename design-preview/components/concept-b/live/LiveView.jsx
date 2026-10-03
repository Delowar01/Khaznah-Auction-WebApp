"use client";

// Option 1 — Modern Commerce: Live Auction as a control room. A navy event
// bar (LIVE, the title, presenter and host, read-outs), the stage beside
// the bid console (a navy call head with the lot clock over the bid, the
// one-tap amounts and Bid), the current-lot strip under the stage and the
// activity log under the console; the running order of all ten lots as a
// compact grid; other live events last. Phones keep the stage and the lot
// strip on top, then Bid / Activity / Lots tabs, with the fixed live bid bar.
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LiveAnnouncer } from "@/components/shared/live/LiveAnnouncer";
import { useLiveRoom, useLiveTabs } from "@/components/shared/live/hooks";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { cx } from "../ui/cx";
import { ActivityFeed } from "./ActivityFeed";
import { CurrentLot } from "./CurrentLot";
import { EventBar } from "./EventBar";
import { LiveBidPanel } from "./LiveBidPanel";
import { LiveStage } from "./LiveStage";
import { LotQueue } from "./LotQueue";
import { MobileLiveBar } from "./MobileLiveBar";
import { UpcomingEvents } from "./UpcomingEvents";

/** Bid / Activity / Lots below 1024 px (a segmented tab strip). */
function RoomTabs({ tabs }) {
  return (
    <div role="tablist" aria-label={tabs.label} className="grid grid-cols-3 gap-0.5 rounded-control border border-line bg-surface-2 p-0.5 lg:hidden">
      {tabs.items.map((tab) => {
        const props = tabs.tabProps(tab.key);
        return (
          <button
            key={tab.key}
            {...props}
            className={cx(
              "h-10 min-w-0 truncate rounded-[8px] px-2 kb-sm font-semibold transition-[background-color,color,box-shadow] duration-150",
              props["aria-selected"] ? "bg-surface text-fg shadow-card ring-1 ring-line" : "text-fg-2 hover:text-fg",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function LiveView() {
  const { ui } = useLang();
  const { link } = useConcept();
  const room = useLiveRoom();
  const tabs = useLiveTabs("(min-width: 1024px)");
  const panel = (key, className = "") => ({ ...tabs.panelProps(key), className: cx("min-w-0 outline-offset-2", !tabs.shown(key) && "max-lg:hidden", className) });

  return (
    <div className="kb-container pb-16 pt-4">
      <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("liveAuctions") }]} />
      <EventBar room={room} className="mt-3" />

      {/* phone / tablet: stage, lot strip, tabs, one section · desktop: [stage + strip | console + activity] over the running order */}
      <div className="mt-4 grid gap-4 lg:mt-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-5 lg:[grid-template-areas:'main_side'_'queue_queue'] xl:grid-cols-[minmax(0,1fr)_384px]">
        <div className="grid min-w-0 content-start gap-4 lg:[grid-area:main]">
          <LiveStage room={room} />
          <CurrentLot room={room} />
        </div>
        <RoomTabs tabs={tabs} />
        <div className="max-lg:contents lg:grid lg:min-w-0 lg:content-start lg:gap-5 lg:[grid-area:side]">
          <div {...panel("bid")}>
            <LiveBidPanel room={room} />
          </div>
          <div {...panel("activity")}>
            <ActivityFeed room={room} />
          </div>
        </div>
        <div {...panel("lots", "lg:[grid-area:queue]")}>
          <LotQueue room={room} />
        </div>
      </div>

      <UpcomingEvents className="mt-12" />
      <MobileLiveBar room={room} />
      <LiveAnnouncer announce={room.announce} />
    </div>
  );
}
