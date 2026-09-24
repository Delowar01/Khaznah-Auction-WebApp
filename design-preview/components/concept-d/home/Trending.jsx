"use client";

import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Reveal } from "@/components/shared/ui/Reveal";
import { hotAuctions } from "@/lib/catalog";
import { Container, SectionHeader, ArrowLink } from "../ui/Layout";
import { AuctionCard } from "../cards/AuctionCard";
import { useCopy } from "../lib/useCopy";

/** Most-bid auctions with heat and sparklines. */
export function Trending() {
  const { link } = useConcept();
  const { ui } = useLang();
  const c = useCopy();
  const lots = hotAuctions(4);
  return (
    <section aria-labelledby="trending-title" className="py-14 md:py-20">
      <Container>
        <SectionHeader
          id="trending-title"
          eyebrow={ui("hot")}
          title={c("trendingTitle")}
          text={c("trendingText")}
          action={<ArrowLink href={link("/browse?tab=auction&sort=most_bids")}>{ui("viewAll")}</ArrowLink>}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {lots.map((product, index) => (
            <Reveal key={product.slug} delay={index * 60} className="flex">
              <div className="flex w-full">
                <AuctionCard product={product} emphasis="heat" />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
