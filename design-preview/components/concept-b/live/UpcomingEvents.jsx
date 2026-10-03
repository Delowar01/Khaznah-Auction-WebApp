"use client";

import { useId } from "react";
import { BellRing, CalendarClock, Check } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useUpcomingEvents } from "@/components/shared/live/hooks";
import { Img } from "@/components/shared/ui/Img";
import { SectionHeader } from "../ui/SectionHeader";
import { SellerAvatar } from "../ui/SellerAvatar";
import { cx } from "../ui/cx";

function EventRow({ event }) {
  const titleId = useId();
  return (
    <article className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-xl bg-surface p-3 ring-1 ring-line sm:grid-cols-[88px_minmax(0,1fr)]">
      <span className="aspect-square overflow-hidden rounded-lg bg-plate">
        <Img image={event.image} alt="" sizes="88px" className="kb-pack size-full object-contain p-2" />
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="flex flex-wrap items-center gap-x-1.5 kb-2xs font-bold text-primary">
          <CalendarClock aria-hidden="true" className="size-3.5 shrink-0" />
          <span>{event.startsLabel}</span>
          <span aria-hidden="true" className="tabular">
            {event.startsIn}
          </span>
          <span className="sr-only">{event.startsSpoken}</span>
        </p>
        <h3 id={titleId} className="line-clamp-2 kb-sm font-bold text-fg">
          {event.title}
        </h3>
        <p className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 kb-xs text-fg-2">
          <SellerAvatar seller={event.host} size="xs" />
          <span className="min-w-0">{event.hostName}</span>
          <span aria-hidden="true">·</span>
          <span>{event.lots}</span>
        </p>
        <button
          type="button"
          onClick={event.toggle}
          aria-pressed={event.reminded}
          aria-describedby={titleId}
          className={cx(
            "mt-1 inline-flex h-9 w-fit max-w-full items-center gap-1.5 rounded-control px-3 kb-xs font-bold transition-colors",
            event.reminded ? "bg-primary text-on-primary hover:bg-primary-hover" : "border border-line-strong bg-surface text-fg hover:border-primary hover:text-primary",
          )}
        >
          {event.reminded ? <Check aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.5} /> : <BellRing aria-hidden="true" className="size-3.5 shrink-0" />}
          <span className="truncate">{event.remindLabel}</span>
        </button>
      </div>
    </article>
  );
}

/** Other live sales: when each starts, the host, the lots and a reminder toggle. */
export function UpcomingEvents({ className = "" }) {
  const { ui } = useLang();
  const events = useUpcomingEvents();
  return (
    <section aria-labelledby="kb-more-live" className={className}>
      <SectionHeader id="kb-more-live" icon={CalendarClock} title={ui("moreLive")} href="/browse?tab=auction" hrefLabel={ui("auctions")} />
      <ul className="grid gap-3 md:grid-cols-2">
        {events.map((event) => (
          <li key={event.key} className="min-w-0">
            <EventRow event={event} />
          </li>
        ))}
      </ul>
    </section>
  );
}
