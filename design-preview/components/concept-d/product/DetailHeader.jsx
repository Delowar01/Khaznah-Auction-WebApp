"use client";

import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getCategory } from "@/data/categories";
import { isAuction } from "@/data/products";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { WatchButton, ShareButton } from "../ui/Actions";
import { LotTag } from "../ui/Chips";

/** Breadcrumb, h1, status chips and watch/share — shared by both detail pages. */
export function DetailHeader({ product, chips }) {
  const { link } = useConcept();
  const { t, ui } = useLang();
  const category = getCategory(product.category);
  const section = isAuction(product) ? { label: ui("auctions"), href: link("/browse?tab=auction") } : { label: ui("buyNow"), href: link("/browse?tab=buy_now") };

  return (
    <div className="flex flex-col gap-4 pb-6 pt-6 md:pt-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <Breadcrumbs
          items={[
            { label: ui("home"), href: link("/") },
            section,
            { label: t(category?.name), href: link(`/browse?category=${product.category}`) },
            { label: t(product.title) },
          ]}
        />
        <h1 className="d-tight mt-3 max-w-3xl text-2xl font-semibold text-fg text-balance sm:text-3xl lg:text-[34px] lg:leading-[1.15]">{t(product.title)}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <LotTag lot={product.lot} />
          {chips}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <WatchButton product={product} variant="full" testId="watch-button" />
        <ShareButton />
      </div>
    </div>
  );
}
