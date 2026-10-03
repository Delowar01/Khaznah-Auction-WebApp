"use client";

import { useId } from "react";
import { BellRing, CalendarClock, Check } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useUpcomingEvents } from "@/components/shared/live/hooks";
import { Img } from "@/components/shared/ui/Img";
import { btn, cx } from "../ui";

const PLATES = ["#faf5eb", "#eef6f1"];

function EventTile({ event, index }) {
  const titleId = useId();
  return (
    <article className="grid h-full grid-cols-[88px_minmax(0,1fr)] gap-3 rounded-[20px] border border-[var(--vd-line)] bg-white p-2.5 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-4">
      <span className="relative aspect-square overflow-hidden rounded-[14px]" style={{ background: PLATES[index % PLATES.length] }}>
        <Img image={event.image} cutout alt="" sizes="(min-width: 640px) 132px, 88px" className="vd-multiply absolute inset-0 size-full object-contain p-3" />
      </span>
      <div className="flex min-w-0 flex-col py-1 pe-1">
        <p className="inline-flex w-fit max-w-full flex-wrap items-center gap-x-1.5 rounded-full bg-[var(--vd-bluegray)] px-2.5 py-0.5 vd-xs font-bold text-[var(--vd-indigo)]">
          <CalendarClock aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.2} />
          {event.startsLabel}{" "}
          <span aria-hidden="true" className="tabular">
            {event.startsIn}
          </span>
          <span className="sr-only">{event.startsSpoken}</span>
        </p>
        <h3 id={titleId} className="mt-1.5 vd-h3 text-[var(--vd-ink)]">
          {event.title}
        </h3>
        <p className="mt-0.5 vd-sm text-[var(--vd-muted)]">
          {event.hostName} · {event.lots}
        </p>
        <div className="mt-auto pt-2.5">
          <button type="button" onClick={event.toggle} aria-pressed={event.reminded} aria-describedby={titleId} className={btn(event.reminded ? "indigo" : "soft", "sm", "max-w-full")}>
            {event.reminded ? <Check aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.4} /> : <BellRing aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.1} />}
            <span className="truncate">{event.remindLabel}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

/** The next live sales: image-led rounded tiles with a reminder pill. */
export function Upcoming({ className = "" }) {
  const { ui } = useLang();
  const events = useUpcomingEvents();
  return (
    <section aria-labelledby="vd-more-live" className={cx("min-w-0", className)}>
      <h2 id="vd-more-live" className="vd-h2 text-[var(--vd-ink)]">
        {ui("moreLive")}
      </h2>
      <ul className="mt-4 grid gap-3 lg:mt-5">
        {events.map((event, index) => (
          <li key={event.key} className="min-w-0">
            <EventTile event={event} index={index} />
          </li>
        ))}
      </ul>
    </section>
  );
}
