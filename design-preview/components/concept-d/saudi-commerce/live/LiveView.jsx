"use client";

// Option 4 — Contemporary Saudi: Live Auction as a clean, structured live
// room. A sage event panel (LIVE, the title, who presents and hosts, the
// sale's progress and the deposit), then three columns on desktop: the
// running order of every lot, the stage with the lot on the block standing
// in the warehouse aisle and its facts, and the framed bid panel (sage head,
// red lot clock, green Bid) with the activity under it. Phones: stage and
// facts, then Bid / Activity / Lots tabs and the white live bid bar.
import Link from "next/link";
import { Eye, ListChecks, Mic, ShieldCheck, Store, Wifi } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LiveAnnouncer } from "@/components/shared/live/LiveAnnouncer";
import { useLiveRoom, useLiveTabs } from "@/components/shared/live/hooks";
import { cx } from "../ui";
import { BidPanel } from "./BidPanel";
import { Activity, LotFacts, RunningOrder } from "./Panels";
import { PhoneBar } from "./PhoneBar";
import { Stage } from "./Stage";
import { Upcoming } from "./Upcoming";

function Fact({ icon: Icon, children, className = "" }) {
  return (
    <li className={cx("flex min-w-0 items-start gap-2 sc-md text-[var(--sc-ink)]", className)}>
      <Icon aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-[var(--sc-green)]" strokeWidth={1.9} />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

/** Breadcrumb, then the sage event panel: LIVE, the H1 and the facts of the sale. */
function EventPanel({ room }) {
  const { ui } = useLang();
  const { link } = useConcept();
  const { event } = room;
  return (
    <div className="sc-container pt-5 dt:pt-6">
      <nav aria-label={ui("breadcrumb")}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 sc-sm text-[var(--sc-muted)]">
          <li>
            <Link href={link("/")} className="sc-link">
              {ui("home")}
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-medium text-[var(--sc-ink)]">
              {ui("liveAuctions")}
            </span>
          </li>
        </ol>
      </nav>
      <div className="mt-4 rounded-[12px] bg-[var(--sc-soft)] p-4 sm:p-5 dt:px-7 dt:py-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-[var(--sc-red)]" />
          <span className="sc-lg font-semibold text-[var(--sc-ink)]">{ui("liveAuction")}</span>
          <span className="inline-flex h-[30px] items-center rounded-[5px] bg-[var(--sc-red)] px-3 sc-md font-bold text-white ltr:uppercase">{ui("liveNow")}</span>
          <span className="inline-flex items-center gap-1.5 sc-md text-[var(--sc-muted)]">
            <Eye aria-hidden="true" className="size-4" strokeWidth={1.9} />
            <span className="tabular">{event.viewers}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 sc-md text-[var(--sc-muted)] max-sm:hidden">
            <Wifi aria-hidden="true" className="size-4" strokeWidth={1.9} />
            {ui("connected")}
          </span>
        </div>
        <h1 className="mt-3 sc-page-title text-balance text-[var(--sc-ink)]">{event.title}</h1>
        <ul className="mt-4 grid gap-x-6 gap-y-2 border-t border-[#d5e3dc] pt-4 sm:grid-cols-2 dt:grid-cols-4">
          <Fact icon={Mic}>{event.presenter}</Fact>
          <Fact icon={Store}>
            {ui("hostedBy")}{" "}
            <Link href={link(event.hostHref)} className="sc-link font-semibold text-[var(--sc-link)]">
              {event.hostName}
            </Link>
          </Fact>
          {/* Phones keep the stage high: progress is in the running order, the deposit in the bid panel. */}
          <Fact icon={ListChecks} className="max-sm:hidden">
            {event.progress}
          </Fact>
          <Fact icon={ShieldCheck} className="max-sm:hidden">
            {event.deposit}
          </Fact>
        </ul>
      </div>
    </div>
  );
}

/** Bid / Activity / Lots below 1024 px: three square tabs, the selected one green. */
function RoomTabs({ tabs }) {
  return (
    <div role="tablist" aria-label={tabs.label} className="grid grid-cols-3 gap-1.5 lg:hidden">
      {tabs.items.map((tab) => {
        const props = tabs.tabProps(tab.key);
        return (
          <button
            key={tab.key}
            {...props}
            className={cx(
              "h-11 min-w-0 truncate rounded-[7px] border px-2 sc-md font-semibold transition-colors",
              props["aria-selected"] ? "border-[var(--sc-green)] bg-[var(--sc-green)] text-white" : "border-[var(--sc-line)] bg-white text-[var(--sc-ink)] hover:bg-[var(--sc-soft)]",
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
      <EventPanel room={room} />

      {/* phone / tablet: stage, facts, tabs, one section · 1024: [stage + facts | bid] over [running order | activity] ·
          1200: [running order | stage, facts, activity | bid, kept in view while the column scrolls] */}
      <div className="sc-container mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-5 lg:[grid-template-areas:'stage_bid'_'facts_bid'_'order_activity'] dt:mt-6 dt:grid-cols-[296px_minmax(0,1fr)_372px] dt:gap-6 dt:[grid-template-areas:'order_stage_bid'_'order_facts_bid'_'order_activity_bid']">
        <Stage room={room} className="lg:[grid-area:stage]" />
        <LotFacts room={room} className="lg:self-start lg:[grid-area:facts]" />
        <RoomTabs tabs={tabs} />
        <div {...panel("bid", "lg:[grid-area:bid] dt:sticky dt:top-[calc(var(--pbar-h)+16px)] dt:self-start")}>
          <BidPanel room={room} />
        </div>
        <div {...panel("activity", "lg:[grid-area:activity]")}>
          <Activity room={room} />
        </div>
        <div {...panel("lots", "lg:[grid-area:order] dt:self-start")}>
          <RunningOrder room={room} />
        </div>
      </div>

      <Upcoming />
      <PhoneBar room={room} />
      <LiveAnnouncer announce={room.announce} />
    </>
  );
}
