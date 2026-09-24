"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { getProduct } from "@/lib/catalog";
import { ProductCard } from "../cards/ProductCard";
import { SectionHead } from "../ui/Type";
import { COPY } from "../copy";

const PICKS = ["task-lamp", "suede-tote", "dutch-oven-blue", "stand-mixer"];

export function ReadyToOwn() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <section className="mx-auto max-w-[1360px] px-5 py-20 sm:px-6 lg:px-10 lg:py-28">
      <SectionHead eyebrow={t(COPY.handpicked)} title={t(COPY.readyToOwn)} text={t(COPY.readyToOwnText)} href={link("/browse?tab=buy_now")} linkLabel={t(COPY.shopBuyNow)} />
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
        {PICKS.map((slug) => (
          <ProductCard key={slug} product={getProduct(slug)} />
        ))}
      </div>
    </section>
  );
}
