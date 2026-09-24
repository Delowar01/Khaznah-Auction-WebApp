"use client";

import { ShoppingCart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { discountPercent } from "@/lib/catalog";
import { Button } from "../ui/Button";
import { StockMeter } from "../ui/StockMeter";
import { WatchButton } from "../ui/WatchButton";

/** Sticky bottom purchase bar on phones and tablets. */
export function MobileBuyBar({ product, onAdd }) {
  const { ui, t } = useLang();
  const soldOut = product.stock <= 0;
  const discount = discountPercent(product);
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-(--kb-sh-bar) backdrop-blur-md md:hidden">
      <div className="kb-container flex h-[76px] items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <Money value={product.price} className="kb-price text-fg" symbolClassName="text-[0.8em]" />
            {product.unitLabel ? <span className="kb-2xs text-fg-3">{t(product.unitLabel)}</span> : null}
          </div>
          {discount ? <Money value={product.originalPrice} strike className="kb-xs text-fg-3" /> : <StockMeter stock={product.stock} compact />}
        </div>
        <WatchButton product={product} className="ms-auto shrink-0 shadow-none" />
        <Button size="lg" icon={soldOut ? undefined : ShoppingCart} disabled={soldOut} onClick={onAdd} className="min-w-0 flex-1 sm:flex-none sm:px-8">
          {soldOut ? ui("outOfStock") : ui("addToCart")}
        </Button>
      </div>
    </div>
  );
}
