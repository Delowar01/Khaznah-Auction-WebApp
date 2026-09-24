"use client";

import { forwardRef, useState } from "react";
import { LayoutGrid, ShoppingCart, Zap } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { discountPercent } from "@/lib/catalog";
import { Button } from "../ui/Button";
import { DeltaChip } from "../ui/Chips";
import { StockMeter } from "../ui/Meters";
import { useChrome } from "../layout/ChromeContext";
import { useCopy } from "../lib/useCopy";
import { QuantityControl } from "./QuantityControl";

/** Buy Now purchase panel: price, saving, stock, quantity and actions. */
export const PurchasePanel = forwardRef(function PurchasePanel({ product }, ctaRef) {
  const { t, ui, money, pl } = useLang();
  const { addToCart, toast } = useStore();
  const { link } = useConcept();
  const { openCart } = useChrome();
  const c = useCopy();
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;
  const pct = discountPercent(product);
  const saving = product.originalPrice - product.price;

  const add = (andOpen = false) => {
    addToCart(product.slug, qty);
    toast({ tone: "success", title: ui("addedToCart"), description: `${qty} × ${t(product.title)}` });
    if (andOpen) openCart();
  };

  return (
    <section aria-labelledby="purchase-heading" className="d-panel relative overflow-hidden p-5 shadow-raised">
      <div aria-hidden="true" className="d-glow pointer-events-none absolute -end-20 -top-24 size-64" />
      <div className="relative flex items-center justify-between gap-3">
        <h2 id="purchase-heading" className="d-label text-fg-3">
          {ui("fixedPrice")}
        </h2>
        {product.unitLabel ? <span className="text-xs text-fg-3">{t(product.unitLabel)}</span> : null}
      </div>
      <p className="relative mt-2">
        <Money value={product.price} className={`d-num text-[40px] font-medium leading-none sm:text-[44px] ${soldOut ? "text-fg-2" : "text-fg"}`} />
      </p>
      {pct > 0 ? (
        <p className="relative mt-3 flex flex-wrap items-center gap-2 text-sm text-fg-2">
          <span className="text-fg-3">{ui("was")}</span>
          <Money value={product.originalPrice} strike className="d-num text-fg-3" />
          <DeltaChip percent={pct} tone="down" />
          <span className="text-success">{c("youSave", { amount: money(saving) })}</span>
        </p>
      ) : null}

      {product.fullStockRequired ? null : <StockMeter stock={product.stock} className="relative mt-5" />}

      <div className="relative mt-5 border-t border-line pt-5">
        <QuantityControl product={product} qty={qty} onChange={setQty} />
        {!soldOut && !product.fullStockRequired && qty > 1 ? (
          <p className="d-num mt-3 flex justify-between text-sm text-fg-2">
            <span>{c("totalFor", { n: pl(product.unitLabel ? "items" : "units", qty) })}</span>
            <Money value={product.price * qty} className="font-medium text-fg" />
          </p>
        ) : null}
      </div>

      {soldOut ? (
        <div className="relative mt-5 space-y-3">
          <p className="text-sm text-fg-2">{c("soldOutText")}</p>
          <Button variant="primary" size="lg" className="w-full" disabled data-testid="add-to-cart" icon={ShoppingCart}>
            {ui("outOfStock")}
          </Button>
          <Button variant="secondary" size="lg" className="w-full" icon={LayoutGrid} href={link(`/browse?category=${product.category}`)}>
            {ui("seeSimilarItems")}
          </Button>
        </div>
      ) : (
        <div ref={ctaRef} className="relative mt-5 grid gap-2.5">
          <Button variant="primary" size="lg" icon={ShoppingCart} data-testid="add-to-cart" onClick={() => add(false)}>
            {ui("addToCart")}
          </Button>
          <Button variant="secondary" size="lg" icon={Zap} onClick={() => add(true)}>
            {ui("buyItNow")}
          </Button>
        </div>
      )}
    </section>
  );
});
