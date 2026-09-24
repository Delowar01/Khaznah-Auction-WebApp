"use client";

import { useEffect } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { OTHER_EVENTS } from "@/data/live";
import { Container, SectionHeader } from "../ui/Layout";
import { useLive } from "../market/MarketProvider";
import { LiveHeader } from "../live/LiveHeader";
import { Stage } from "../live/Stage";
import { CurrentLot } from "../live/CurrentLot";
import { LotQueue } from "../live/LotQueue";
import { LiveConsole } from "../live/LiveConsole";
import { LiveMobileTabs } from "../live/LiveMobileTabs";
import { UpNext } from "../live/UpNext";
import { UpcomingEventCard } from "../home/UpcomingEventCard";

export function LivePage() {
  const live = useLive();
  const { ui } = useLang();

  // The docked bid bar is taller than the dock, so lift toasts clear of it.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.dDock = "tall";
    return () => {
      delete root.dataset.dDock;
    };
  }, []);

  return (
    <>
      <Container>
        <LiveHeader live={live} />
      </Container>
      <Container className="max-lg:px-0">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-5 xl:grid-cols-[260px_minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-4 lg:col-start-1 lg:row-start-1 xl:col-start-2">
            <Stage live={live} />
            <div className="space-y-4 max-lg:px-4">
              <CurrentLot live={live} />
              <UpNext live={live} className="hidden sm:block" />
            </div>
          </div>
          <div className="hidden min-h-0 lg:col-start-1 lg:row-start-2 lg:flex xl:col-start-1 xl:row-span-2 xl:row-start-1">
            <LotQueue live={live} className="max-h-[640px] w-full xl:max-h-[720px]" />
          </div>
          <LiveConsole live={live} className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-h-[720px] xl:col-start-3" />
          <LiveMobileTabs live={live} className="px-4 lg:hidden" />
        </div>
      </Container>
      <Container as="section" aria-labelledby="more-live-title" className="py-12 md:py-16">
        <SectionHeader id="more-live-title" eyebrow={ui("upcoming")} title={ui("moreLive")} />
        <div className="grid gap-4 md:grid-cols-2">
          {OTHER_EVENTS.map((event) => (
            <UpcomingEventCard key={event.slug} event={event} />
          ))}
        </div>
      </Container>
      <div aria-hidden="true" className="h-44 lg:hidden" />
    </>
  );
}
