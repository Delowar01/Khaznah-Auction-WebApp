"use client";

import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Reveal } from "@/components/shared/ui/Reveal";
import { OTHER_EVENTS } from "@/data/live";
import { Container, SectionHeader, ArrowLink } from "../ui/Layout";
import { useCopy } from "../lib/useCopy";
import { StreamCard } from "./StreamCard";
import { UpcomingEventCard } from "./UpcomingEventCard";

/** Live event (wide stream card) + upcoming presenter-led sales. */
export function LiveEvents() {
  const { link } = useConcept();
  const { ui } = useLang();
  const c = useCopy();
  return (
    <section aria-labelledby="live-events-title" className="border-y border-line bg-surface/40 py-14 md:py-20">
      <Container>
        <SectionHeader
          id="live-events-title"
          live
          eyebrow={ui("liveAuctions")}
          title={c("liveEventsTitle")}
          text={c("liveEventsText")}
          action={<ArrowLink href={link("/live-auction")}>{ui("enterLiveRoom")}</ArrowLink>}
        />
        <Reveal className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-5">
          <StreamCard />
          <div className="flex flex-col gap-4 lg:gap-5">
            <p className="d-label hidden text-fg-3 lg:block">{ui("moreLive")}</p>
            <div className="grid flex-1 gap-4 md:grid-cols-2 lg:grid-cols-1 lg:gap-5">
              {OTHER_EVENTS.map((event) => (
                <UpcomingEventCard key={event.slug} event={event} />
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
