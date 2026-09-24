"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { discountPercent } from "@/lib/catalog";
import { Money } from "@/components/shared/ui/Money";
import { Button } from "../ui/Button";
import { QuantityStepper } from "../ui/QuantityStepper";
import { ShareButton, WatchButton } from "../ui/Actions";
import { useChrome } from "../layout/ChromeContext";
import { Services } from "../detail/Services";
import { LotHeading } from "../detail/LotHeading";
import { COPY } from "../copy";

function StockLine({ product }) {
  const { ui, pl } = useLang();
  const soldOut = product.stock <= 0;
  const low = !soldOut && !product.fullStockRequired && product.stock <= 3;
  const tone = soldOut ? "text-fg-3" : low ? "text-live" : "text-success";
  const text = soldOut
    ? ui("outOfStock")
    : product.fullStockRequired
      ? `${ui("inStock")} · ${pl("units", product.quantity)}`
      : low
        ? ui("onlyLeft", { n: product.stock })
        : `${ui("inStock")} · ${ui("available", { n: product.stock })}`;
  return (
    <p className={`inline-flex items-center gap-2 text-sm font-medium ${tone}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full bg-current ${low ? "kz-live-dot !size-1.5" : ""}`} />
      {text}
    </p>
  );
}

/** Buy Now purchase column: identity, price, stock, quantity and actions. */
export function PurchasePanel({ product, seller, onGradeGuide, ctaRef }) {
  const { t, ui, money } = useLang();
  const { addToCart, toast } = useStore();
  const { openBag } = useChrome();
  const fullLot = Boolean(product.fullStockRequired);
  const [qty, setQty] = useState(fullLot ? product.stock : 1);
  const soldOut = product.stock <= 0;
  const off = discountPercent(product);

  const add = () => {
    addToCart(product.slug, qty);
    toast({ tone: "success", title: ui("addedToCart"), description: `${qty} × ${t(product.title)}` });
  };
  const buyNow = () => {
    addToCart(product.slug, qty);
    openBag();
  };

  return (
    <div>
      <LotHeading product={product} onGradeGuide={onGradeGuide} />

      <div className="mt-8 border-t border-line pt-6">
        <p className="a-eyebrow !text-fg-3">{ui("price")}</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="a-serif text-[48px] leading-none text-fg">
            <Money value={product.price} symbolClassName="text-[0.78em]" />
          </span>
          {product.unitLabel ? <span className="text-sm text-fg-2">{t(product.unitLabel)}</span> : null}
        </div>
        {off ? (
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-fg-3">
              {ui("was")} <Money value={product.originalPrice} strike />
            </span>
            <span className="font-semibold text-success">{ui("save", { amount: money(product.originalPrice - product.price) })}</span>
            <span dir="ltr" className="rounded-full bg-secondary px-2.5 py-0.5 text-[12px] font-semibold text-on-secondary tabular">
              −{off}%
            </span>
          </p>
        ) : null}
        <div className="mt-4">
          <StockLine product={product} />
        </div>
      </div>

      {soldOut ? (
        <div className="mt-6 rounded-card border border-line bg-surface-2 p-5">
          <p className="text-sm leading-relaxed text-fg-2 rtl:leading-7">{t(COPY.soldOutText)}</p>
          <Button size="lg" className="mt-4 w-full" disabled data-testid="add-to-cart">
            {ui("outOfStock")}
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="text-sm font-medium text-fg">{product.unitLabel ? t(COPY.cases) : ui("quantity")}</span>
            <QuantityStepper value={qty} onChange={setQty} max={product.stock} locked={fullLot} />
          </div>
          {fullLot ? (
            <p className="flex items-start gap-2 text-[13px] leading-relaxed text-fg-2">
              <Lock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              {ui("fullLotOnly")}
            </p>
          ) : null}
          <div ref={ctaRef} className="grid gap-3 sm:grid-cols-2">
            <Button size="lg" onClick={add} data-testid="add-to-cart">
              {ui("addToBag")}
            </Button>
            <Button size="lg" variant="outline" onClick={buyNow}>
              {ui("buyItNow")}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-6">
        <WatchButton slug={product.slug} variant="text" testId="watch-button" />
        <ShareButton />
      </div>

      <div className="mt-8">
        <Services seller={seller} />
      </div>
    </div>
  );
}
