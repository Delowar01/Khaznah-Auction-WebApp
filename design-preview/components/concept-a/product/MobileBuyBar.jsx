"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { Button } from "../ui/Button";
import { StickyBar } from "../ui/StickyBar";

/** Mobile purchase bar for Buy Now lots. */
export function MobileBuyBar({ product, show }) {
  const { t, ui } = useLang();
  const { addToCart, toast } = useStore();
  const soldOut = product.stock <= 0;
  const qty = product.fullStockRequired ? product.stock : 1;
  return (
    <StickyBar show={show}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-fg-2">{t(product.title)}</p>
        <p className="a-serif text-[24px] leading-tight text-fg">
          <Money value={product.price} symbolClassName="text-[0.8em]" />
        </p>
      </div>
      <Button
        disabled={soldOut}
        onClick={() => {
          addToCart(product.slug, qty);
          toast({ tone: "success", title: ui("addedToCart"), description: t(product.title) });
        }}
      >
        {soldOut ? ui("outOfStock") : ui("addToBag")}
      </Button>
    </StickyBar>
  );
}
