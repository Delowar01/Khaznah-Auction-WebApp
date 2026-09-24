"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { endingSoon } from "@/lib/catalog";
import { AuctionCard } from "../cards/AuctionCard";
import { SectionHead } from "../ui/Type";
import { COPY } from "../copy";

export function ClosingSoon() {
  const { t } = useLang();
  const { link } = useConcept();
  const lots = endingSoon(4);
  return (
    <section className="mx-auto max-w-[1360px] px-5 py-20 sm:px-6 lg:px-10 lg:py-28">
      <SectionHead eyebrow={t(COPY.handpicked)} title={t(COPY.closingSoon)} text={t(COPY.closingSoonText)} href={link("/browse?tab=auction&sort=recommended")} linkLabel={t(COPY.viewAllAuctions)} />
      <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {lots.map((p) => (
          <AuctionCard key={p.slug} product={p} className="w-[78%] shrink-0 snap-start sm:w-auto" />
        ))}
      </div>
    </section>
  );
}
