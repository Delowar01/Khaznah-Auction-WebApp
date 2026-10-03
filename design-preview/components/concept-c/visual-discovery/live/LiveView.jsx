"use client";

// Option 3 — Visual Discovery: Live Auction as an immersive live
// marketplace. A full-width navy band frames the room: LIVE, the display
// title and the host; a large rounded stage with the coral lot clock and
// the expressive lot card floating over its corner, beside the white bid
// card with the indigo Bid pill. Below on white: every lot as a visual tile,
// the bid chat and the next sales. Phones: the band holds the stage and the
// lot card, then Bid / Activity / Lots tabs and the floating navy bid bar.
import Link from "next/link";
import { Eye } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LiveAnnouncer } from "@/components/shared/live/LiveAnnouncer";
import { useLiveRoom, useLiveTabs } from "@/components/shared/live/hooks";
import { cx } from "../ui";
import { BidCard } from "./BidCard";
import { ActivityChat, LotGrid } from "./Lists";
import { PhoneBar } from "./PhoneBar";
import { Stage } from "./Stage";
import { Upcoming } from "./Upcoming";

function TitleBlock({ room }) {
  const { ui } = useLang();
  const { link } = useConcept();
  const { event } = room;
  return (
    <div>
      <nav aria-label={ui("breadcrumb")}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 vd-sm text-white/75">
          <li>
            <Link href={link("/")} className="vd-link hover:text-white">
              {ui("home")}
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true">·</span>
            <span aria-current="page" className="font-semibold text-white">
              {ui("liveAuctions")}
            </span>
          </li>
        </ol>
      </nav>
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <span className="inline-flex h-10 items-center gap-2.5 rounded-full bg-[var(--vd-live)] px-4 vd-md font-bold text-white ltr:uppercase">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-white/90" />
          {ui("liveNow")}
        </span>
        <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 vd-sm font-semibold text-white">
          <Eye aria-hidden="true" className="size-4" strokeWidth={2} />
          <span className="tabular">{event.viewers}</span>
        </span>
      </div>
      <h1 className="mt-3 vd-live-title text-balance text-white">{event.title}</h1>
      <p className="mt-2 vd-lg text-white/90">
        {event.presenter} ·{" "}
        <span>
          {ui("hostedBy")}{" "}
          <Link href={link(event.hostHref)} className="vd-link font-semibold text-[var(--vd-gold)]">
            {event.hostName}
          </Link>
        </span>
        <span className="text-white/70"> · {event.progress}</span>
      </p>
    </div>
  );
}

/** Bid / Activity / Lots below 1024 px: pill tabs. */
function RoomTabs({ tabs }) {
  return (
    <div role="tablist" aria-label={tabs.label} className="grid grid-cols-3 gap-1 rounded-full bg-[var(--vd-bluegray)] p-1 lg:hidden">
      {tabs.items.map((tab) => {
        const props = tabs.tabProps(tab.key);
        return (
          <button
            key={tab.key}
            {...props}
            className={cx(
              "h-11 min-w-0 truncate rounded-full px-2 vd-md font-bold transition-colors",
              props["aria-selected"] ? "bg-[var(--vd-indigo)] text-white" : "text-[var(--vd-indigo)] hover:bg-white/70",
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
  const room = useLiveRoom();
  const tabs = useLiveTabs("(min-width: 1024px)");
  const panel = (key, className = "") => ({ ...tabs.panelProps(key), className: cx("min-w-0 outline-offset-4", !tabs.shown(key) && "max-lg:hidden", className) });

  return (
    <>
      <div className="bg-[var(--vd-navy)] text-white [--focus:var(--vd-gold)]">
        <div className="vd-wide pb-6 pt-5 md:pb-10 dt:pt-7">
          <TitleBlock room={room} />
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-6 dt:grid-cols-[minmax(0,1fr)_400px]">
            <Stage room={room} />
            {/* Desktop: the bid card beside the stage. Phones and tablets: in the Bid tab below. */}
            <div className="hidden min-w-0 lg:block">
              <BidCard room={room} />
            </div>
          </div>
        </div>
      </div>

      {/* phone / tablet: tabs, one section, the next sales · desktop: the lots, then [activity | next sales] */}
      <div className="vd-container grid gap-6 pb-12 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-8 lg:gap-y-12 lg:pb-16 lg:pt-12 lg:[grid-template-areas:'lots_lots'_'activity_upcoming']">
        <RoomTabs tabs={tabs} />
        <div {...panel("bid", "lg:hidden")}>
          <BidCard room={room} />
        </div>
        <div {...panel("lots", "lg:[grid-area:lots]")}>
          <LotGrid room={room} />
        </div>
        <div {...panel("activity", "lg:[grid-area:activity]")}>
          <ActivityChat room={room} />
        </div>
        <Upcoming className="lg:[grid-area:upcoming]" />
      </div>

      <PhoneBar room={room} />
      <LiveAnnouncer announce={room.announce} />
    </>
  );
}
