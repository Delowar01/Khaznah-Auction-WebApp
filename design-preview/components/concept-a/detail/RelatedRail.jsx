"use client";

import { isAuction } from "@/lib/catalog";
import { SectionHead } from "../ui/Type";
import { AuctionCard } from "../cards/AuctionCard";
import { ProductCard } from "../cards/ProductCard";

/** Four related lots under a detail page. */
export function RelatedRail({ title, eyebrow, products, href, linkLabel }) {
  return (
    <section className="mx-auto max-w-[1360px] px-5 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHead eyebrow={eyebrow} title={title} href={href} linkLabel={linkLabel} />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {products.map((product) =>
          isAuction(product) ? <AuctionCard key={product.slug} product={product} /> : <ProductCard key={product.slug} product={product} />,
        )}
      </div>
    </section>
  );
}
