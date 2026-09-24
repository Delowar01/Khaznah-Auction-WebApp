"use client";

import { useRef, useState } from "react";
import { notFound } from "next/navigation";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { getCategory, getProduct, getSeller, isNewListing, relatedProducts } from "@/lib/catalog";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { StatusLabel } from "../ui/Status";
import { Gallery } from "../detail/Gallery";
import { LotStory } from "../detail/LotStory";
import { RelatedRail } from "../detail/RelatedRail";
import { GradeGuideModal } from "../detail/GradeGuideModal";
import { PurchasePanel } from "../product/PurchasePanel";
import { MobileBuyBar } from "../product/MobileBuyBar";
import { useOffscreen } from "../ui/StickyBar";
import { COPY } from "../copy";

export function ProductPage({ slug }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const product = getProduct(slug);
  const [guideOpen, setGuideOpen] = useState(false);
  const ctaRef = useRef(null);
  const ctaOffscreen = useOffscreen(ctaRef);
  if (!product) notFound();

  const seller = getSeller(product.seller);
  const category = getCategory(product.category);
  const soldOut = product.stock <= 0;
  const badge = soldOut ? (
    <span className="rounded-full bg-surface px-3 py-1.5 shadow-card">
      <StatusLabel status="unavailable" />
    </span>
  ) : isNewListing(product) ? (
    <span className="rounded-full bg-surface px-3 py-1.5 shadow-card">
      <StatusLabel status="new" />
    </span>
  ) : null;

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mx-auto max-w-[1360px] px-5 pt-6 sm:px-6 lg:px-10 lg:pt-8">
        <Breadcrumbs
          items={[
            { label: ui("home"), href: link("/") },
            { label: ui("buyNow"), href: link("/browse?tab=buy_now") },
            { label: t(category?.name), href: link(`/browse?category=${product.category}`) },
            { label: t(product.title) },
          ]}
        />
      </div>

      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-10 px-5 pb-16 pt-6 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-10 lg:pb-24">
        <div className="min-w-0 lg:col-span-7">
          <div className="lg:sticky lg:top-[calc(var(--pbar-h)+100px)]">
            <Gallery images={product.images} title={t(product.title)} badge={badge} />
          </div>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <PurchasePanel product={product} seller={seller} onGradeGuide={() => setGuideOpen(true)} ctaRef={ctaRef} />
        </div>
      </div>

      <LotStory product={product} onGradeGuide={() => setGuideOpen(true)} />

      <RelatedRail
        eyebrow={t(COPY.handpicked)}
        title={ui("relatedItems")}
        products={relatedProducts(product, 4)}
        href={link("/browse?tab=buy_now")}
        linkLabel={t(COPY.shopBuyNow)}
      />

      <MobileBuyBar product={product} show={ctaOffscreen && !soldOut} />
      <GradeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} highlight={product.grade} />
    </div>
  );
}
