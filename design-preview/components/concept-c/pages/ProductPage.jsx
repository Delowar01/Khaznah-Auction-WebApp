"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { UI } from "@/data/ui";
import { getCategory, getProduct, relatedProducts } from "@/lib/catalog";
import { COPY } from "../copy";
import { Gallery } from "../product/Gallery";
import { ConditionNote, LotHeader } from "../product/LotHeader";
import { PurchasePanel, usePurchase } from "../product/PurchasePanel";
import { Description, SellerMiniCard, SpecTable } from "../product/DetailBlocks";
import { DeliveryBlock } from "../product/DeliveryBlock";
import { Manifest } from "../product/Manifest";
import { DetailLayout, RelatedBand } from "../product/DetailLayout";
import { MobilePurchaseBar } from "../product/MobilePurchaseBar";

export function ProductPage({ slug }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const product = getProduct(slug);
  const purchase = usePurchase(product);
  const category = getCategory(product.category);

  return (
    <div>
      <DetailLayout
        breadcrumbs={[
          { label: ui("home"), href: link("/") },
          { label: ui("buyNow"), href: link("/browse?tab=buy_now") },
          { label: t(category?.name), href: link(`/browse?category=${product.category}`) },
          { label: t(product.title) },
        ]}
        gallery={<Gallery images={product.images} title={t(product.title)} />}
        aside={
          <>
            <LotHeader product={product} />
            <ConditionNote product={product} />
            <div className="c-sticky-aside mt-8 space-y-4">
              <PurchasePanel product={product} purchase={purchase} />
              <SellerMiniCard code={product.seller} />
            </div>
          </>
        }
        details={
          <>
            <Description product={product} />
            <Manifest product={product} />
            <SpecTable product={product} />
            <DeliveryBlock product={product} />
          </>
        }
      />
      <RelatedBand title={UI.relatedItems} eyebrow={COPY.buyNowEyebrow} products={relatedProducts(product, 4)} />
      <MobilePurchaseBar product={product} purchase={purchase} />
    </div>
  );
}
