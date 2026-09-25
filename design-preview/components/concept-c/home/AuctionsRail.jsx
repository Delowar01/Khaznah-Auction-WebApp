"use client";

import { useState } from "react";
import { Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { endingSoon, hotAuctions } from "@/lib/catalog";
import { AuctionCard } from "../cards/AuctionCard";
import { RailControls, RailTrack, useRail } from "../ui/Rail";
import { BilingualHeading, ViewAllLink } from "../ui/SectionHeader";
import { Segmented } from "../ui/Segmented";
import { COPY } from "../copy";

/** Horizontal auction rail with two views: closing soonest and most bid. */
export function AuctionsRail() {
  const { t, ui } = useLang();
  const { trackRef, ...rail } = useRail();
  const [view, setView] = useState("ending");
  const items = view === "ending" ? endingSoon(9) : hotAuctions(9);

  const switchView = (next) => {
    setView(next);
    trackRef.current?.scrollTo({ left: 0 });
  };

  return (
    <section aria-labelledby="kb-auctions-rail">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h2 id="kb-auctions-rail" className="kb-h2 text-fg">
            <BilingualHeading bi={COPY.auctionsRailTitle} icon={Timer} />
          </h2>
          <p className="mt-1.5 kb-sm text-fg-2">{t(COPY.auctionsRailSubtitle)}</p>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
          <Segmented
            size="sm"
            label={ui("auctions")}
            value={view}
            onChange={switchView}
            options={[
              { value: "ending", label: ui("endingSoonTitle") },
              { value: "hot", label: ui("featuredAuctions") },
            ]}
          />
          <div className="flex items-center gap-2">
            <RailControls rail={rail} />
            <ViewAllLink href="/browse?tab=auction" />
          </div>
        </div>
      </div>
      <RailTrack trackRef={trackRef} label={view === "ending" ? ui("endingSoonTitle") : ui("featuredAuctions")}>
        {items.map((product, i) => (
          <li key={product.slug} className="w-[46%] shrink-0 sm:w-[31%] lg:w-[calc((100%-48px)/5)]">
            <AuctionCard product={product} priority={i < 2} />
          </li>
        ))}
      </RailTrack>
    </section>
  );
}
