"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { UI } from "@/data/ui";
import { endingSoon } from "@/lib/catalog";
import { COPY } from "../copy";
import { AuctionCard } from "../cards/AuctionCard";
import { ButtonLink } from "../ui/Button";
import { Scroller, ScrollerControls, useScroller } from "../ui/Scroller";
import { Section, SectionHead } from "../ui/Section";

const LOTS = endingSoon(8);

/** Horizontal band of auctions closing soonest, each with its saffron time bar. */
export function EndingSoonBand() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const scroller = useScroller();
  return (
    <Section labelledBy="ending-title" className="bg-surface-2">
      <SectionHead
        id="ending-title"
        eyebrow={COPY.endingEyebrow}
        title={UI.endingSoonTitle}
        action={
          <div className="flex items-center gap-3">
            <ScrollerControls scroller={scroller} className="hidden lg:flex" />
            <ButtonLink href={link("/browse?tab=auction")} variant="outline" arrow>
              {ui("viewAll")}
            </ButtonLink>
          </div>
        }
      />
      <Scroller nodeRef={scroller.setNode} label={t(UI.endingSoonTitle)}>
        {LOTS.map((product) => (
          <AuctionCard key={product.slug} product={product} className="w-[16.5rem] sm:w-[18.5rem] lg:w-[calc((100%-3rem)/4)]" />
        ))}
      </Scroller>
    </Section>
  );
}
