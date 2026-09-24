"use client";

import { CalendarClock } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useRemaining } from "@/lib/clock";
import { formatDuration } from "@/lib/format";
import { getSeller } from "@/data/sellers";
import { Img } from "@/components/shared/ui/Img";
import { Button } from "../ui/Button";
import { COPY } from "../copy";

function EventCard({ event }) {
  const { t, ui, pl, lang } = useLang();
  const { toast } = useStore();
  const startsIn = useRemaining(event.startsIn);
  const host = getSeller(event.host);
  return (
    <article className="grid grid-cols-[7rem_minmax(0,1fr)] gap-5 rounded-card border border-line bg-surface p-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <span className="relative block aspect-square overflow-hidden rounded-card bg-plate">
        <Img image={event.image} alt="" sizes="144px" className="a-plate-img absolute inset-0 size-full object-contain p-3" />
      </span>
      <div className="flex min-w-0 flex-col">
        <p className="a-eyebrow inline-flex items-center gap-2 !text-primary">
          <CalendarClock aria-hidden="true" className="size-3.5" />
          {t(COPY.startsOn, { time: formatDuration(startsIn, lang) })}
        </p>
        <h3 className="a-serif mt-2 text-[21px] leading-snug text-fg">{t(event.title)}</h3>
        <p className="mt-1 text-[13px] text-fg-2">
          {ui("hostedBy")} {t(host?.name)} · {pl("lots", event.lots)}
        </p>
        <div className="mt-auto pt-4">
          <Button size="sm" variant="quiet" onClick={() => toast({ tone: "success", title: ui("reminderSet"), description: t(event.title) })}>
            {ui("remindEvent")}
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ComingUp({ events }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.slug} event={event} />
      ))}
    </div>
  );
}
