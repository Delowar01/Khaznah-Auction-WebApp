"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock, Eye, Gavel } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_EVENT, OTHER_EVENTS } from "@/data/live";
import { getSeller } from "@/data/sellers";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { LiveBadge } from "../ui/Badge";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { Button } from "../ui/Button";
import { Segmented } from "../ui/Segmented";
import { SectionHeader } from "../ui/SectionHeader";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { ActivityFeed } from "./ActivityFeed";
import { CurrentLot } from "./CurrentLot";
import { EventCard } from "./EventCard";
import { LiveBidPanel } from "./LiveBidPanel";
import { LiveStage } from "./LiveStage";
import { LotsTable } from "./LotsTable";
import { useEventReminders } from "./useEventReminders";

function MobileLiveBar({ live }) {
  const { ui, money } = useLang();
  const lot = live.current;
  const paused = live.phase === "intermission" || !lot;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-(--kb-sh-bar) backdrop-blur-md lg:hidden">
      <div className="kb-container flex h-[76px] items-center gap-3">
        <div className="min-w-0">
          <p className="kb-2xs font-semibold text-fg-3">{ui("currentBid")}</p>
          <Money key={lot?.currentBid} value={lot?.currentBid || 0} className="kz-flash kb-price rounded px-0.5 text-fg" symbolClassName="text-[0.8em]" />
        </div>
        <Button size="lg" icon={Gavel} disabled={paused} onClick={() => live.placeBid(live.minNext)} data-testid="live-bid" className="ms-auto min-w-0 px-5">
          <span className="truncate">{ui("bidAmount", { amount: money(live.minNext) })}</span>
        </Button>
      </div>
    </div>
  );
}

/** Live auction room: stream + current lot, bid panel + activity, lots and what's next. */
export function LiveView() {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const live = useLiveEvent();
  const reminders = useEventReminders();
  const [tab, setTab] = useState("bid");
  const host = getSeller(LIVE_EVENT.host);

  return (
    <div className="kb-container pb-16 pt-4">
      <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("liveAuctions") }]} />

      <header className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <LiveBadge size="md">{ui("liveNow")}</LiveBadge>
            <span className="inline-flex items-center gap-1.5 kb-sm font-semibold text-fg-2">
              <Eye aria-hidden="true" className="size-4" />
              <span className="tabular">{pl("viewers", live.viewers)}</span>
            </span>
          </div>
          <h1 className="kb-h1 text-balance text-fg">{t(LIVE_EVENT.title)}</h1>
          <p className="mt-1 kb-sm text-fg-2">
            {t(LIVE_EVENT.presenter)} · {ui("hostedBy")}{" "}
            <Link href={link(`/seller/${host.code}`)} className="font-semibold text-primary hover:underline">
              {t(host.name)}
            </Link>
          </p>
        </div>
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-6">
        <div className="min-w-0">
          <LiveStage live={live} />
          <CurrentLot live={live} />
        </div>

        <Segmented
          label={ui("liveAuction")}
          value={tab}
          onChange={setTab}
          className="w-full lg:hidden [&>button]:flex-1 [&>button]:justify-center"
          options={[
            { value: "bid", label: t(COPY.tabBid) },
            { value: "activity", label: ui("activity") },
            { value: "lots", label: t(COPY.tabLots) },
          ]}
        />

        <aside className="grid content-start gap-4 lg:row-span-2">
          <div className={cx(tab !== "bid" && "max-lg:hidden")}>
            <LiveBidPanel live={live} />
          </div>
          <div className={cx(tab !== "activity" && "max-lg:hidden")}>
            <ActivityFeed live={live} />
          </div>
        </aside>

        <div className={cx("min-w-0", tab !== "lots" && "max-lg:hidden")}>
          <LotsTable live={live} />
        </div>
      </div>

      <section aria-labelledby="kb-more-live" className="mt-12">
        <SectionHeader id="kb-more-live" icon={CalendarClock} title={ui("moreLive")} href="/browse?tab=auction" hrefLabel={ui("auctions")} />
        <div className="grid gap-3 md:grid-cols-2">
          {OTHER_EVENTS.map((event) => (
            <EventCard key={event.slug} event={event} reminded={reminders.isOn(event)} onRemind={() => reminders.toggle(event)} />
          ))}
        </div>
      </section>

      <MobileLiveBar live={live} />
    </div>
  );
}
