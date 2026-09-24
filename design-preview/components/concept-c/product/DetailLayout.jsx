"use client";

import { LotCard } from "../cards/LotCard";
import { Breadcrumbs } from "../ui/Misc";
import { SectionHead } from "../ui/Section";

/**
 * Detail page grid. DOM order is gallery → aside → details so small screens
 * read naturally; on desktop the gallery sits on the inline-start (right in
 * Arabic) and the aside spans both rows on the inline-end.
 */
export function DetailLayout({ breadcrumbs, gallery, aside, details }) {
  return (
    <div className="c-container pb-16 pt-6 lg:pb-20 lg:pt-8">
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-16">
        <div className="min-w-0 lg:col-span-7 lg:col-start-1 lg:row-start-1">{gallery}</div>
        <div className="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">{aside}</div>
        <div className="min-w-0 space-y-14 lg:col-span-7 lg:col-start-1 lg:row-start-2">{details}</div>
      </div>
    </div>
  );
}

/** Related / similar lots under a detail page. */
export function RelatedBand({ title, eyebrow, products }) {
  if (!products.length) return null;
  return (
    <section aria-labelledby="related-title" className="border-t border-line bg-surface-2 py-14 lg:py-20">
      <div className="c-container">
        <SectionHead id="related-title" eyebrow={eyebrow} title={title} />
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <li key={product.slug} className="flex">
              <LotCard product={product} className="w-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
