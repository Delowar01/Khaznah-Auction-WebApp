"use client";

import { LayoutGrid, ShoppingBag } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { Button, ButtonLink } from "../ui/Button";

/** Sticky purchase bar for small screens; it stops at the end of the page content. */
export function MobilePurchaseBar({ product, purchase }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  return (
    <div className="sticky bottom-0 z-30 border-t border-line bg-bg/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-3xl items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="c-label">
            {ui("price")}
            {product.unitLabel ? ` · ${t(product.unitLabel)}` : ""}
          </p>
          <Money value={product.price} className="c-num text-xl font-semibold text-fg" />
        </div>
        {purchase.out ? (
          <ButtonLink href={link(`/browse?category=${product.category}`)} variant="outline" icon={LayoutGrid}>
            {ui("seeSimilarItems")}
          </ButtonLink>
        ) : (
          <Button icon={ShoppingBag} onClick={() => purchase.add()}>
            {ui("addToCart")}
          </Button>
        )}
      </div>
    </div>
  );
}
