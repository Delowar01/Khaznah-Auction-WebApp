"use client";

import { useId } from "react";
import { BellRing, CalendarClock, Check } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useUpcomingEvents } from "@/components/shared/live/hooks";
import { Img } from "@/components/shared/ui/Img";
import { SectionHead, btn } from "../ui";

function EventRow({ event }) {
  const titleId = useId();
  return (
    <article className="grid h-full grid-cols-[96px_minmax(0,1fr)] gap-x-4 gap-y-3 rounded-[9px] border border-[var(--sc-line)] bg-white p-2 sm:grid-cols-[132px_minmax(0,1fr)_auto] sm:items-center dt:p-[7px] dt:pe-5">
      <span className="relative h-24 self-stretch overflow-hidden rounded-[6px] bg-[var(--sc-plate)] sm:h-auto sm:min-h-[112px]">
        <Img image={event.image} cutout alt="" sizes="132px" className="sc-multiply absolute inset-0 size-full object-contain p-2.5" />
      </span>
      <div className="min-w-0 py-1">
        <h3 id={titleId} className="sc-title text-[var(--sc-ink)]">
          {event.title}
        </h3>
        <p className="mt-1 sc-md text-[var(--sc-muted)]">
          {event.hostName} · {event.lots}
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 sc-md font-semibold text-[var(--sc-ink)]">
          <CalendarClock aria-hidden="true" className="size-[17px] shrink-0 text-[var(--sc-green)]" strokeWidth={2} />
          <span className="font-medium text-[var(--sc-muted)]">{event.startsLabel}</span>
          <span aria-hidden="true" className="tabular">
            {event.startsIn}
          </span>
          <span className="sr-only">{event.startsSpoken}</span>
        </p>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <button type="button" onClick={event.toggle} aria-pressed={event.reminded} aria-describedby={titleId} className={btn(event.reminded ? "green" : "outline", "md", "w-full max-w-full sm:w-auto")}>
          {event.reminded ? <Check aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={2.4} /> : <BellRing aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.9} />}
          <span className="truncate">{event.remindLabel}</span>
        </button>
      </div>
    </article>
  );
}

/** The next live sales as practical rows: what, who, how many lots, when — and a reminder. */
export function Upcoming() {
  const { ui } = useLang();
  const events = useUpcomingEvents();
  return (
    <section aria-labelledby="sc-more-live" className="sc-container py-10 dt:py-12">
      <SectionHead id="sc-more-live" title={ui("moreLive")} href="/browse?tab=auction" linkLabel={ui("auctions")} />
      <ul className="mt-4 grid gap-3 lg:grid-cols-2 dt:mt-5">
        {events.map((event) => (
          <li key={event.key} className="min-w-0">
            <EventRow event={event} />
          </li>
        ))}
      </ul>
    </section>
  );
}
