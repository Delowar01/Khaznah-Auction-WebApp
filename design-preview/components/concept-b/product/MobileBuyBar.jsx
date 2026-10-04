"use client";

import { ShoppingCart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useToastClearance } from "@/components/shared/auction/hooks";
import { Money } from "@/components/shared/ui/Money";
import { Button } from "../ui/Button";
import { WatchButton } from "../ui/WatchButton";
import { cx } from "../ui/cx";

const COUNT = { healthy: "text-fg-3", low: "font-bold text-warning", veryLow: "font-bold text-danger", out: "font-bold text-danger" };

/**
 * Fixed bar on phones (76 px above the safe area with its top rule; the
 * chrome keeps the same space free under the footer): the price (with the
 * unit), the was price and discount or the stock, Watch, and Add to cart
 * with the chosen quantity — disabled once sold out. Toasts rise above it.
 */
export function MobileBuyBar({ product, info, purchase }) {
  const { ui } = useLang();
  const barRef = useToastClearance();
  const { text, soldOut } = purchase;
  return (
    <div ref={barRef} className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-(--kb-sh-bar) backdrop-blur-md md:hidden" data-testid="buy-bar">
      <div className="kb-container flex h-[75px] items-center gap-3 max-[379px]:gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <Money value={purchase.price} className={cx("kb-price", soldOut ? "text-fg-3" : "text-fg")} symbolClassName="text-[0.8em]" />
            {info.unit ? <span className="truncate kb-2xs text-fg-3">{info.unit}</span> : null}
          </div>
          {purchase.pct && !soldOut ? (
            <p className="flex items-center gap-1.5 kb-xs text-fg-3">
              <span className="sr-only">{text.was} </span>
              <Money value={purchase.original} strike />
              <span dir="ltr" className="font-bold text-success">
                {text.pct}
              </span>
            </p>
          ) : (
            <p className={cx("truncate kb-xs", COUNT[purchase.stock.level])}>{purchase.stock.count}</p>
          )}
        </div>
        <WatchButton product={product} className="ms-auto shrink-0 shadow-none" />
        <Button size="lg" icon={soldOut ? undefined : ShoppingCart} disabled={soldOut} onClick={purchase.add} className="min-w-0 px-5 max-[379px]:px-3.5 sm:px-8" data-testid="buy-bar-add">
          {soldOut ? ui("outOfStock") : text.add}
        </Button>
      </div>
    </div>
  );
}
