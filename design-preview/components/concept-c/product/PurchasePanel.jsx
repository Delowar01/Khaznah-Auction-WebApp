"use client";

import { useState } from "react";
import { LayoutGrid, ShoppingBag, Zap } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { discountPercent } from "@/lib/catalog";
import { COPY, COPY_PLURALS } from "../copy";
import { plural } from "@/lib/i18n";
import { StockLine } from "../cards/BuyNowCard";
import { Badge } from "../ui/Badges";
import { Button, ButtonLink } from "../ui/Button";
import { ShareButton } from "../ui/Misc";
import { QuantityStepper } from "../ui/QuantityStepper";
import { WatchButton } from "../ui/WatchButton";
import { openChromePanel } from "../layout/chromeEvents";

/** Purchase state shared by the panel and the mobile sticky bar. */
export function usePurchase(product) {
  const { t, ui } = useLang();
  const { addToCart, toast } = useStore();
  const [qty, setQty] = useState(1);
  const out = product.stock <= 0;
  const add = (after) => {
    if (out) return;
    addToCart(product.slug, qty);
    toast({ tone: "success", title: ui("addedToCart"), description: `${qty} × ${t(product.title)}` });
    after?.();
  };
  return { qty, setQty, out, add, buyNow: () => add(() => openChromePanel("cart")) };
}

/** Buy Now purchase panel: price, saving, stock, quantity rules, cart actions, watch and share. */
export function PurchasePanel({ product, purchase }) {
  const { t, ui, pl, money, lang } = useLang();
  const off = discountPercent(product);
  const { qty, setQty, out, add, buyNow } = purchase;
  const { link } = useConcept();
  const perCase = Boolean(product.unitLabel);

  return (
    <section aria-label={ui("price")} className="rounded-md border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="c-label">
            {ui("price")}
            {product.unitLabel ? ` · ${t(product.unitLabel)}` : ""}
          </p>
          <Money value={product.price} className="c-num mt-1 text-[2.5rem] font-semibold leading-none text-fg" />
          {off ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-fg-3">{ui("was")}</span>
              <Money value={product.originalPrice} strike className="c-num text-fg-3" />
              <Badge tone="gold">{ui("off", { pct: off })}</Badge>
              <span className="font-medium text-success">{ui("save", { amount: money(product.originalPrice - product.price) })}</span>
            </div>
          ) : null}
        </div>
        <StockLine product={product} className="mt-1 text-sm" />
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-semibold text-fg">{ui("quantity")}</span>
          {product.fullStockRequired ? (
            <QuantityStepper value={1} locked suffix={t(COPY.fullPallet)} />
          ) : (
            <QuantityStepper value={qty} min={1} max={Math.max(1, product.stock)} onChange={setQty} disabled={out} />
          )}
        </div>
        {product.fullStockRequired ? (
          <p className="mt-3 text-sm text-fg-2">
            {ui("fullLotOnly")} · {pl("units", product.quantity)}
          </p>
        ) : perCase ? (
          <p className="mt-3 text-sm text-fg-2">
            {plural(qty, COPY_PLURALS.cases, lang)} · {ui("available", { n: product.stock })}
          </p>
        ) : null}
        {!out && qty > 1 ? (
          <p className="mt-3 flex items-baseline justify-between text-sm text-fg-2">
            {t(COPY.subtotal)}
            <Money value={product.price * qty} className="c-num text-base font-semibold text-fg" />
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3">
        <Button size="lg" block icon={ShoppingBag} onClick={() => add()} disabled={out} data-testid="add-to-cart">
          {ui("addToCart")}
        </Button>
        {out ? (
          <ButtonLink href={link(`/browse?category=${product.category}`)} size="lg" block variant="outline" icon={LayoutGrid}>
            {ui("seeSimilarItems")}
          </ButtonLink>
        ) : (
          <Button size="lg" block variant="night" icon={Zap} onClick={buyNow}>
            {ui("buyItNow")}
          </Button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <WatchButton product={product} variant="full" testId="watch-button" className="w-full" />
        <ShareButton description={t(product.title)} className="w-full" />
      </div>
    </section>
  );
}
