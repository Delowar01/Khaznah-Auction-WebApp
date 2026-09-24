"use client";

import { Reveal } from "@/components/shared/ui/Reveal";
import { isAuction } from "@/data/products";
import { relatedProducts } from "@/lib/catalog";
import { LotCard } from "../cards/LotCard";
import { SectionHeader } from "../ui/Layout";

/** Four related lots; `preferAuctions` fills the rail with live auctions first. */
export function RelatedRail({ product, title, eyebrow, preferAuctions = false }) {
  const pool = relatedProducts(product, 30);
  const items = preferAuctions ? [...pool.filter(isAuction), ...pool.filter((p) => !isAuction(p))].slice(0, 4) : pool.slice(0, 4);
  return (
    <section aria-labelledby="related-title" className="border-t border-line py-12 md:py-16">
      <SectionHeader id="related-title" eyebrow={eyebrow} title={title} />
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {items.map((item, index) => (
          <Reveal as="li" key={item.slug} delay={index * 60} className="flex">
            <LotCard product={item} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
