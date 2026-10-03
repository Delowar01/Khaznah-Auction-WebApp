"use client";

import { useId } from "react";
import { BellRing, Check } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useUpcomingEvents } from "@/components/shared/live/hooks";
import { Img } from "@/components/shared/ui/Img";
import { SectionHead, btn } from "../ui";

function EventCard({ event }) {
  const titleId = useId();
  return (
    <article className="grid h-full grid-cols-[96px_minmax(0,1fr)] gap-4 rounded-[5px] border border-[#ebe9e3] bg-white p-3 sm:grid-cols-[148px_minmax(0,1fr)] sm:gap-5">
      <span className="relative aspect-square overflow-hidden rounded-[4px] bg-[var(--pr-stone)]">
        <Img image={event.image} cutout alt="" sizes="(min-width: 640px) 148px, 96px" className="pr-multiply absolute inset-0 size-full object-contain p-3" />
      </span>
      <div className="flex min-w-0 flex-col py-1">
        <p className="pr-sm font-semibold text-[var(--pr-bronze)]">
          {event.startsLabel}{" "}
          <span aria-hidden="true" className="tabular">
            {event.startsIn}
          </span>
          <span className="sr-only">{event.startsSpoken}</span>
        </p>
        <h3 id={titleId} className="mt-1.5 pr-h3 text-fg">
          {event.title}
        </h3>
        <p className="mt-1 pr-sm text-fg-2">
          {event.hostName} · {event.lots}
        </p>
        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={event.toggle}
            aria-pressed={event.reminded}
            aria-describedby={titleId}
            className={btn(event.reminded ? "charcoal" : "outline", "sm", "max-w-full")}
          >
            {event.reminded ? <Check aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} /> : <BellRing aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.8} />}
            <span className="truncate">{event.remindLabel}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

/** The next sales in this room, as refined catalogue cards with a reminder toggle. */
export function Upcoming() {
  const { ui } = useLang();
  const events = useUpcomingEvents();
  return (
    <section aria-labelledby="pm-more-live" className="pr-container py-10 dt:py-14">
      <SectionHead id="pm-more-live" title={ui("moreLive")} href="/browse?tab=auction" linkLabel={ui("auctions")} />
      <ul className="mt-5 grid gap-4 md:grid-cols-2 dt:mt-6 dt:gap-5">
        {events.map((event) => (
          <li key={event.key} className="min-w-0">
            <EventCard event={event} />
          </li>
        ))}
      </ul>
    </section>
  );
}
