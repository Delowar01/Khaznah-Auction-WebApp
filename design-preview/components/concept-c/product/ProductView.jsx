"use client";

import { useState } from "react";
import { Sparkles, Store } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getCategory } from "@/data/categories";
import { getSeller } from "@/data/sellers";
import { discountPercent, relatedProducts, sellerProducts } from "@/lib/catalog";
import { LotRail } from "../cards/LotRail";
import { useChrome } from "../layout/ChromeContext";
import { Badge } from "../ui/Badge";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { useAddToCart } from "../utils/useAddToCart";
import { BuyBox } from "./BuyBox";
import { DetailLayout } from "./DetailLayout";
import { Gallery } from "./Gallery";
import { GradeGuideModal } from "./GradeGuide";
import { LotDetails } from "./LotDetails";
import { LotHead } from "./LotHead";
import { MobileBuyBar } from "./MobileBuyBar";
import { ProductTabs } from "./ProductTabs";

/** Buy Now product detail. */
export function ProductView({ product }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { open } = useChrome();
  const add = useAddToCart();
  const [qty, setQty] = useState(1);
  const [guide, setGuide] = useState(false);
  const category = getCategory(product.category);
  const seller = getSeller(product.seller);
  const soldOut = product.stock <= 0;
  const discount = discountPercent(product);

  const addToCart = () => add(product, qty);
  const buyNow = () => {
    add(product, qty);
    open("cart");
  };

  const badges = (
    <>
      {soldOut ? <Badge tone="tag-muted">{ui("outOfStock")}</Badge> : null}
      {!soldOut && discount ? (
        <Badge tone="tag-gold" size="md">
          <span dir="ltr">−{discount}%</span>
        </Badge>
      ) : null}
    </>
  );

  const related = relatedProducts(product, 10);
  const fromSeller = sellerProducts(product.seller).filter((p) => p.slug !== product.slug && p.status !== "sold");

  return (
    <div className="kb-container pb-16 pt-4">
      <Breadcrumbs
        items={[
          { label: ui("home"), href: link("/") },
          { label: t(category.name), href: link(`/browse?category=${category.slug}`) },
          { label: t(product.title) },
        ]}
      />

      <DetailLayout
        gallery={<Gallery product={product} badges={badges} />}
        head={<LotHead product={product} watchers={product.watchers} onGradeGuide={() => setGuide(true)} />}
        details={<LotDetails product={product} />}
        box={<BuyBox product={product} qty={qty} setQty={setQty} onAdd={addToCart} onBuyNow={buyNow} />}
      />

      <ProductTabs product={product} onGradeGuide={() => setGuide(true)} className="mt-12" />

      <LotRail className="mt-14" icon={Sparkles} title={ui("relatedItems")} products={related} href={`/browse?category=${category.slug}`} />
      <LotRail className="mt-12" icon={Store} title={ui("moreFromSeller")} subtitle={t(seller.name)} products={fromSeller} href={`/seller/${seller.code}`} />

      <MobileBuyBar product={product} onAdd={addToCart} />
      <GradeGuideModal open={guide} onClose={() => setGuide(false)} highlight={product.grade} />
    </div>
  );
}
