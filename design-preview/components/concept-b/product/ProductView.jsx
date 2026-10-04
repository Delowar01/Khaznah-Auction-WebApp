"use client";

// Option 1 — Modern Commerce: Buy Now Product Detail, the Auction Detail's
// sibling. A white product band (breadcrumb, Buy Now and the discount, H1,
// grade, seller, Watch and Share); then the gallery and a dense item sheet
// beside the sticky purchase panel (navy head with the stock status, price
// and saving, quantity and total, Add to cart and Buy it now, payment and
// fulfilment); the description beside the specifications, the grade, the
// seller and delivery, the pallet manifest, then related lots and more from
// the seller. Phones get the purchase panel under the gallery and a fixed
// Add to cart bar.
import { Sparkles, Store } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { moreFromSeller, relatedFor, useGradeGuide, useProductInfo, usePurchase, useToastsAwayFromPanel } from "@/components/shared/product/hooks";
import { LotRail } from "../cards/LotRail";
import { useChrome } from "../layout/ChromeContext";
import { Badge } from "../ui/Badge";
import { Gallery } from "./Gallery";
import { GradeGuideModal } from "./GradeGuide";
import { MobileBuyBar } from "./MobileBuyBar";
import { ProductHeader } from "./ProductHeader";
import { ProductAbout, ProductFacts } from "./ProductSheet";
import { PurchasePanel } from "./PurchasePanel";

const STICKY = "md:sticky md:top-[calc(var(--pbar-h)+var(--kb-head)+16px)] md:transition-[top] md:duration-300";

export function ProductView({ product }) {
  const { ui } = useLang();
  const { open } = useChrome();
  const info = useProductInfo(product);
  const purchase = usePurchase(product, { openCart: () => open("cart") });
  const { guide } = useGradeGuide(product);
  useToastsAwayFromPanel();

  const badges = purchase.soldOut ? (
    <Badge tone="tag-muted">{ui("outOfStock")}</Badge>
  ) : purchase.pct ? (
    <Badge tone="tag-gold" size="md">
      <span dir="ltr">{purchase.text.pct}</span>
    </Badge>
  ) : null;

  return (
    <>
      <ProductHeader product={product} info={info} purchase={purchase} onGradeGuide={guide.show} />

      <div className="kb-container pb-16 pt-5 lg:pt-6">
        {/* phone: gallery → purchase → facts → more · tablet: [gallery, facts, more | panel] ·
            desktop: [gallery | facts | panel] over [more | panel] */}
        <div className="grid gap-6 [grid-template-areas:'gallery'_'summary'_'facts'_'more'] md:grid-cols-[minmax(0,1fr)_320px] md:[grid-template-areas:'gallery_box'_'facts_box'_'more_box'] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-8 xl:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_380px] xl:[grid-template-areas:'gallery_facts_box'_'more_more_box']">
          <div className="min-w-0 [grid-area:gallery]">
            <Gallery product={product} badges={badges} />
          </div>
          <div className="min-w-0 [grid-area:summary] md:hidden">
            <PurchasePanel info={info} purchase={purchase} compact />
          </div>
          <div className="min-w-0 [grid-area:facts]">
            <ProductFacts product={product} info={info} purchase={purchase} />
          </div>
          <aside className="hidden min-w-0 [grid-area:box] md:block">
            <div className={STICKY}>
              <PurchasePanel info={info} purchase={purchase} />
            </div>
          </aside>
          <div className="min-w-0 [grid-area:more]">
            <ProductAbout product={product} info={info} onGradeGuide={guide.show} />
          </div>
        </div>

        <LotRail className="mt-14" icon={Sparkles} title={ui("relatedItems")} products={relatedFor(product)} href={info.categoryHref} />
        <LotRail className="mt-12" icon={Store} title={ui("moreFromSeller")} subtitle={info.sellerName} products={moreFromSeller(product)} href={info.sellerHref} />
      </div>

      <MobileBuyBar product={product} info={info} purchase={purchase} />
      <GradeGuideModal open={guide.open} onClose={guide.close} highlight={product.grade} />
    </>
  );
}
