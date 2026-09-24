"use client";

import { Bell } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Img } from "@/components/shared/ui/Img";
import { OTHER_EVENTS } from "@/data/live";
import { getSeller } from "@/data/sellers";
import { UI } from "@/data/ui";
import { useRemaining } from "@/lib/clock";
import { COPY } from "../copy";
import { Badge } from "../ui/Badges";
import { Button } from "../ui/Button";
import { ChamferFrame } from "../ui/Frame";
import { SectionHead } from "../ui/Section";
import { CountdownText } from "../ui/Time";

function EventCard({ event }) {
  const { t, ui, pl } = useLang();
  const { toast } = useStore();
  const startsIn = useRemaining(event.startsIn);
  const host = getSeller(event.host);
  return (
    <li className="group flex flex-col gap-5 rounded-md border border-line bg-surface p-4 sm:flex-row">
      <ChamferFrame size="sm" className="sm:w-48 sm:shrink-0">
        <div className="c-plate aspect-[4/3]">
          <Img image={event.image} alt="" sizes="192px" className="c-plate-img c-plate-img--zoom p-4" />
        </div>
      </ChamferFrame>
      <div className="flex min-w-0 flex-1 flex-col">
        <Badge tone="primary" dia className="self-start">
          {ui("upcoming")}
        </Badge>
        <h3 className="c-h3 mt-3 text-lg">{t(event.title)}</h3>
        <p className="mt-1 text-sm text-fg-2">
          {ui("hostedBy")} {t(host?.name)} · {pl("lots", event.lots)}
        </p>
        <p className="mt-3 text-sm text-fg-2">
          {ui("startsIn")} <CountdownText seconds={startsIn} className="c-num font-semibold text-fg" />
        </p>
        <Button variant="outline" size="sm" icon={Bell} className="mt-4 self-start" onClick={() => toast({ tone: "success", title: ui("remindMe"), description: t(COPY.remindSet) })}>
          {ui("remindMe")}
        </Button>
      </div>
    </li>
  );
}

/** More live and upcoming sales. */
export function OtherEvents() {
  return (
    <section aria-labelledby="events-title" className="border-t border-line bg-surface-2 py-14 lg:py-20">
      <div className="c-container">
        <SectionHead id="events-title" eyebrow={COPY.moreEvents} title={UI.moreLive} />
        <ul className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {OTHER_EVENTS.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </ul>
      </div>
    </section>
  );
}
