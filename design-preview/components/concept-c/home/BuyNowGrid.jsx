"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { UI } from "@/data/ui";
import { featuredBuyNow } from "@/lib/catalog";
import { COPY } from "../copy";
import { BuyNowCard } from "../cards/BuyNowCard";
import { ButtonLink } from "../ui/Button";
import { Section, SectionHead } from "../ui/Section";

const PICKS = featuredBuyNow(8);

/** Clean four-column selection of fixed-price lots. */
export function BuyNowGrid() {
  const { ui } = useLang();
  const { link } = useConcept();
  return (
    <Section labelledBy="buynow-title">
      <SectionHead
        id="buynow-title"
        eyebrow={COPY.buyNowEyebrow}
        title={UI.buyNowPicks}
        action={
          <ButtonLink href={link("/browse?tab=buy_now")} variant="outline" arrow>
            {ui("viewAll")}
          </ButtonLink>
        }
      />
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {PICKS.map((product) => (
          <li key={product.slug} className="flex">
            <BuyNowCard product={product} className="w-full" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
