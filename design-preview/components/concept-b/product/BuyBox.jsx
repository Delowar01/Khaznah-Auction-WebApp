"use client";

import { BellRing, Lock, Share2, ShoppingCart, Wallet, Zap } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { DEMO_USER, PAYMENT_METHODS } from "@/data/site";
import { discountPercent } from "@/lib/catalog";
import { PriceLabel } from "../cards/CardParts";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Stepper } from "../ui/Stepper";
import { StockMeter } from "../ui/StockMeter";
import { WatchButton } from "../ui/WatchButton";
import { cx } from "../ui/cx";
import { useShareLink } from "../utils/navigation";
import { COPY } from "../copy";

/** Sticky purchase panel for Buy Now lots. */
export function BuyBox({ product, qty, setQty, onAdd, onBuyNow, className = "" }) {
  const { t, ui, money } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const share = useShareLink();
  const soldOut = product.stock <= 0;
  const discount = discountPercent(product);
  const locked = Boolean(product.fullStockRequired);
  const max = locked ? 1 : Math.max(1, product.stock);
  const watched = isWatched(product.slug);

  const notify = () => {
    const now = toggleWatch(product.slug);
    toast({ tone: now ? "success" : "neutral", title: now ? t(COPY.notifyBack) : ui("removedFromWatchlist"), description: t(product.title) });
  };

  return (
    <div className={cx("rounded-xl border border-line bg-surface p-5 shadow-card", className)}>
      <PriceLabel>{product.unitLabel ? `${ui("price")} · ${t(product.unitLabel)}` : ui("price")}</PriceLabel>
      <div className="mt-0.5 flex flex-wrap items-center gap-2">
        <Money value={product.price} className={cx("kb-price-lg", soldOut ? "text-fg-3" : "text-fg")} symbolClassName="text-[0.7em]" />
        {discount ? (
          <Badge tone="accent" size="md">
            <span dir="ltr">−{discount}%</span>
          </Badge>
        ) : null}
      </div>
      {discount ? (
        <p className="mt-1 flex flex-wrap items-center gap-x-2 kb-sm text-fg-3">
          {ui("was")} <Money value={product.originalPrice} strike />
          <span className="font-bold text-success">{ui("save", { amount: money(product.originalPrice - product.price) })}</span>
        </p>
      ) : null}
      <StockMeter stock={product.stock} className="mt-3" />

      <hr className="my-4 border-line" />

      {!soldOut ? (
        <div className="mb-4">
          <div className="flex items-center justify-between gap-3">
            <span className="kb-sm font-semibold text-fg">{ui("quantity")}</span>
            <Stepper value={qty} onChange={setQty} min={1} max={max} label={ui("quantity")} locked={locked} lockedLabel={t(COPY.quantityLocked)} />
          </div>
          {locked ? (
            <p className="mt-2 flex items-start gap-1.5 kb-xs text-fg-2">
              <Lock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              {ui("fullLotOnly")}
            </p>
          ) : null}
          {qty > 1 ? (
            <p className="mt-2 flex items-center justify-between kb-sm">
              <span className="text-fg-2">{t(COPY.lotTotal)}</span>
              <Money value={qty * product.price} className="font-extrabold text-fg" />
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-2">
        <Button size="lg" block icon={soldOut ? undefined : ShoppingCart} disabled={soldOut} onClick={onAdd} data-testid="add-to-cart">
          {soldOut ? ui("outOfStock") : ui("addToCart")}
        </Button>
        {soldOut ? (
          <Button variant="outline-primary" size="lg" block icon={BellRing} onClick={notify} aria-pressed={watched}>
            {watched ? ui("watching") : ui("notifyMe")}
          </Button>
        ) : (
          <Button variant="outline-primary" size="lg" block icon={Zap} onClick={onBuyNow}>
            {ui("buyItNow")}
          </Button>
        )}
        <div className={cx("grid gap-2", soldOut ? "grid-cols-1" : "grid-cols-2")}>
          {soldOut ? null : <WatchButton product={product} variant="full" testId="watch-button" />}
          <Button variant="outline" icon={Share2} onClick={() => share()}>
            {ui("share")}
          </Button>
        </div>
      </div>

      <hr className="my-4 border-line" />

      <div className="grid gap-3">
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 kb-xs font-bold text-fg">
            <Lock aria-hidden="true" className="size-3.5 text-success" />
            {ui("securePayment")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PAYMENT_METHODS.map((method) => (
              <span key={method} dir="ltr" className="rounded-md border border-line px-1.5 py-0.5 kb-2xs font-extrabold text-fg-2">
                {method}
              </span>
            ))}
          </div>
        </div>
        <p className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 kb-sm">
          <span className="flex items-center gap-2 text-fg-2">
            <Wallet aria-hidden="true" className="size-4" />
            {ui("walletBalance")}
          </span>
          <Money value={DEMO_USER.walletBalance} className="font-bold text-fg" />
        </p>
      </div>
    </div>
  );
}
