"use client";

import { ShoppingCart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { getProduct } from "@/data/products";
import { isNewListing } from "@/lib/catalog";
import { Container } from "../ui/Layout";
import { StatusChip, OverlayChip } from "../ui/Chips";
import { GradeButton } from "../product/GradeButton";
import { Button } from "../ui/Button";
import { useInView } from "../lib/hooks";
import { DetailHeader } from "../product/DetailHeader";
import { Gallery } from "../product/Gallery";
import { PurchasePanel } from "../product/PurchasePanel";
import { SellerCard } from "../product/SellerCard";
import { DeliveryInfo } from "../product/DeliveryInfo";
import { ProductTabs } from "../product/ProductTabs";
import { RelatedRail } from "../product/RelatedRail";
import { StickyBar } from "../product/StickyBar";

export function ProductPage({ slug }) {
  const product = getProduct(slug);
  const { t, ui } = useLang();
  const { addToCart, toast } = useStore();
  const [ctaRef, ctaInView] = useInView({ rootMargin: "0px 0px -40px 0px" });
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && !product.fullStockRequired && product.stock <= 5;

  const chips = (
    <>
      <StatusChip status={soldOut ? "unavailable" : "buyNow"} />
      <GradeButton grade={product.grade} />
      {isNewListing(product) ? <StatusChip status="new" label={ui("justListed")} /> : null}
      {lowStock ? <StatusChip status="critical" label={ui("onlyLeft", { n: product.stock })} /> : null}
    </>
  );

  return (
    <>
      <Container>
        <DetailHeader product={product} chips={chips} />
        <div className="grid gap-8 pb-4 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-12">
          <div className="min-w-0">
            <Gallery images={product.images} title={t(product.title)} overlay={soldOut ? <OverlayChip status="unavailable" /> : null} />
            <ProductTabs product={product} />
          </div>
          <div className="space-y-4">
            <PurchasePanel ref={ctaRef} product={product} />
            <SellerCard code={product.seller} />
            <DeliveryInfo product={product} />
          </div>
        </div>
        <RelatedRail product={product} title={ui("relatedItems")} eyebrow={ui("buyNowPicks")} />
      </Container>

      <StickyBar show={!ctaInView && !soldOut}>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-fg-3">{t(product.title)}</p>
          <Money value={product.price} className="d-num text-lg font-medium text-fg" />
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={ShoppingCart}
          onClick={() => {
            addToCart(product.slug, 1);
            toast({ tone: "success", title: ui("addedToCart"), description: `1 × ${t(product.title)}` });
          }}
        >
          {ui("addToCart")}
        </Button>
      </StickyBar>
      <div aria-hidden="true" className="h-24 lg:hidden" />
    </>
  );
}
