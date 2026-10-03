"use client";

// Option 2 — Premium Modern: Live Auction as an auction-house live room.
// An editorial title block (brass dash, a small red LIVE, the title, the
// presenter and the host); the cinematic stage and the charcoal console
// meeting edge to edge as one frame, so bidding sits beside the picture;
// the lot on the block as a catalogue entry on the warm panel; then the
// sale as a numbered catalogue beside the fine-ruled bid book, and the next
// sales. Below 1024 px: stage, lot, then Bid / Activity / Lots tabs and the
// ivory live bid bar.
import Link from "next/link";
import { Eye } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LiveAnnouncer } from "@/components/shared/live/LiveAnnouncer";
import { useLiveRoom, useLiveTabs } from "@/components/shared/live/hooks";
import { cx } from "../ui";
import { Console } from "./Console";
import { BidBook, SaleList } from "./Lists";
import { LotBand } from "./LotBand";
import { PhoneBar } from "./PhoneBar";
import { Stage } from "./Stage";
import { Upcoming } from "./Upcoming";

function Breadcrumbs() {
  const { ui } = useLang();
  const { link } = useConcept();
  return (
    <nav aria-label={ui("breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-xs text-fg-2">
        <li className="flex items-center gap-2">
          <Link href={link("/")} className="pr-link">
            {ui("home")}
          </Link>
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="text-[#b9b4aa]">
            /
          </span>
          <span aria-current="page" className="text-fg">
            {ui("liveAuctions")}
          </span>
        </li>
      </ol>
    </nav>
  );
}

/** Brass dash, LIVE, the audience, the H1 and the people behind the sale. */
function TitleBlock({ room }) {
  const { ui } = useLang();
  const { link } = useConcept();
  const { event } = room;
  return (
    <div className="pr-container mt-5 dt:mt-6">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span aria-hidden="true" className="pr-dash" />
        <span className="pr-eyebrow text-[#4a4d57]">{ui("liveAuction")}</span>
        <span className="inline-flex h-6 items-center gap-1.5 rounded-[3px] bg-[var(--pr-live)] px-2 pr-label text-white ltr:uppercase ltr:tracking-[0.08em]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
          {ui("liveNow")}
        </span>
        <span className="inline-flex items-center gap-1.5 pr-sm text-fg-2">
          <Eye aria-hidden="true" className="size-4" strokeWidth={1.7} />
          <span className="tabular">{event.viewers}</span>
        </span>
      </p>
      <h1 className="mt-3 pr-page-title text-balance text-fg">{event.title}</h1>
      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 pr-md text-fg-2">
        <span>{event.presenter}</span>
        <span>
          {ui("hostedBy")}{" "}
          <Link href={link(event.hostHref)} className="pr-link font-medium text-[var(--pr-bronze)]">
            {event.hostName}
          </Link>
        </span>
        <span>{event.progress}</span>
      </p>
    </div>
  );
}

/** Bid / Activity / Lots below 1024 px: underlined tabs with the brass rule. */
function RoomTabs({ tabs }) {
  return (
    <div role="tablist" aria-label={tabs.label} className="grid grid-cols-3 border-b border-line lg:hidden">
      {tabs.items.map((tab) => {
        const props = tabs.tabProps(tab.key);
        const on = props["aria-selected"];
        return (
          <button
            key={tab.key}
            {...props}
            className={cx(
              "relative h-12 min-w-0 truncate px-2 pr-md transition-colors after:absolute after:inset-x-3 after:-bottom-px after:h-0.5",
              on ? "font-semibold text-fg after:bg-[var(--pr-brass)]" : "text-fg-2 hover:text-fg after:bg-transparent",
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
      <div className="pr-container pt-5 dt:pt-7">
        <Breadcrumbs />
      </div>
      <TitleBlock room={room} />

      {/* phone / tablet: stage, lot, tabs, one section · desktop: [stage | console] as one frame, the lot band, then [sale | bid book] */}
      <div className="pr-container mt-6 grid gap-y-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-0 lg:gap-y-10 lg:[grid-template-areas:'stage_console'_'lot_lot'_'sale_book'] dt:mt-7 dt:grid-cols-[minmax(0,1fr)_400px]">
        <Stage room={room} className="lg:rounded-e-none lg:[grid-area:stage]" />
        <LotBand room={room} className="lg:[grid-area:lot]" />
        <RoomTabs tabs={tabs} />
        <div {...panel("bid", "lg:[grid-area:console]")}>
          <Console room={room} className="lg:h-full lg:rounded-s-none" />
        </div>
        <div {...panel("lots", "lg:[grid-area:sale]")}>
          <SaleList room={room} />
        </div>
        <div {...panel("activity", "lg:ps-10 lg:[grid-area:book] dt:ps-12")}>
          <BidBook room={room} />
        </div>
      </div>

      <Upcoming />
      <PhoneBar room={room} />
      <LiveAnnouncer announce={room.announce} />
    </>
  );
}
