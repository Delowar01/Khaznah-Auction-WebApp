"use client";

import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Reveal } from "@/components/shared/ui/Reveal";
import { featuredBuyNow } from "@/lib/catalog";
import { Container, SectionHeader, ArrowLink } from "../ui/Layout";
import { BuyNowCard } from "../cards/BuyNowCard";
import { useCopy } from "../lib/useCopy";

/** Fixed-price picks with discount deltas and stock meters. */
export function InstantBuy() {
  const { link } = useConcept();
  const { ui } = useLang();
  const c = useCopy();
  const items = featuredBuyNow(8);
  return (
    <section aria-labelledby="instant-title" className="border-y border-line bg-surface/40 py-14 md:py-20">
      <Container>
        <SectionHeader
          id="instant-title"
          eyebrow={ui("buyNow")}
          title={c("instantTitle")}
          text={c("instantText")}
          action={<ArrowLink href={link("/browse?tab=buy_now")}>{ui("viewAll")}</ArrowLink>}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {items.map((product, index) => (
            <Reveal key={product.slug} delay={(index % 4) * 60} className="flex">
              <BuyNowCard product={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
