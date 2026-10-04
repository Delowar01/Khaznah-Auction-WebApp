"use client";

import { useId } from "react";
import { LayoutGrid, Lock, ShoppingBag, ShoppingCart, Truck, Wallet, Warehouse, Zap } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { PRODUCT_COPY as C } from "@/components/shared/product/copy";
import { Money } from "@/components/shared/ui/Money";
import { PriceLabel } from "../cards/CardParts";
import { Badge } from "../ui/Badge";
import { Button, ButtonLink } from "../ui/Button";
import { Stepper } from "../ui/Stepper";
import { cx } from "../ui/cx";

// Stock level → the dot in the navy head, the count's colour and the meter.
const DOT = { healthy: "bg-[#47cd89]", low: "bg-[#fdb022]", veryLow: "bg-[#ff8a80]", out: "bg-white/55" };
const COUNT = { healthy: "font-medium text-fg-3", low: "font-bold text-warning", veryLow: "font-bold text-danger", out: "font-bold text-danger" };
const METER = { healthy: "bg-success/70", low: "bg-warning", veryLow: "bg-danger", out: "bg-line" };

/** The stock count with a quiet meter. */
export function StockLine({ stock, className = "" }) {
  return (
    <div className={className}>
      <p className={cx("kb-xs", COUNT[stock.level])}>{stock.count}</p>
      {stock.fill == null ? null : (
        <div aria-hidden="true" className="mt-1 h-1 overflow-hidden rounded-full bg-surface-2">
          <div className={cx("h-full rounded-full", METER[stock.level])} style={{ width: `${stock.fill * 100}%` }} />
        </div>
      )}
    </div>
  );
}

/**
 * The purchase panel: a navy head (Buy Now · fixed price and the stock
 * status), the price with the discount, was price and saving, the stock,
 * the quantity (locked for a full lot) and its total, Add to cart and Buy
 * it now — or, sold out, a disabled button and similar items — then secure
 * payment, the wallet and how it reaches you. `compact` is the phone copy
 * under the gallery, without the notes.
 */
export function PurchasePanel({ info, purchase, compact = false, className = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const headingId = useId();
  const { stock, soldOut, locked, text } = purchase;

  return (
    <section aria-labelledby={headingId} className={cx("overflow-hidden rounded-xl border border-line bg-surface shadow-card", className)}>
      <h2 id={headingId} className="sr-only">
        {t(C.purchase)}
      </h2>
      <div className="kb-on-dark flex items-center justify-between gap-3 bg-[var(--kb-indigo-950)] px-4 py-3 text-white sm:px-5">
        <p className="inline-flex min-w-0 items-center gap-2 kb-sm font-bold">
          <ShoppingBag aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">
            {ui("buyNow")} · {t(C.fixedPrice)}
          </span>
        </p>
        <p className="inline-flex shrink-0 items-center gap-2 kb-xs font-semibold text-white/85">
          <span aria-hidden="true" className={cx("size-2 rounded-full", DOT[stock.level])} />
          {stock.status}
        </p>
      </div>

      <div className={cx("grid p-4 sm:p-5", compact ? "gap-3" : "gap-4")}>
        <div className="min-w-0">
          <PriceLabel>{info.priceLabel}</PriceLabel>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <Money value={purchase.price} className={cx("kb-price-lg", soldOut ? "text-fg-3" : "text-fg")} symbolClassName="text-[0.7em]" />
            {purchase.pct ? (
              <Badge tone="accent" size="md">
                <span dir="ltr">{text.pct}</span>
              </Badge>
            ) : null}
          </div>
          {purchase.pct ? (
            <p className="mt-1 flex flex-wrap items-center gap-x-2 kb-sm text-fg-3">
              {text.was} <Money value={purchase.original} strike />
              <span className="font-bold text-success">{text.save}</span>
            </p>
          ) : null}
        </div>

        <StockLine stock={stock} />

        {soldOut ? null : (
          <div className="border-t border-line pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="kb-sm font-semibold text-fg">{text.quantity}</span>
              <Stepper value={purchase.qty} onChange={purchase.setQty} min={1} max={purchase.max} label={text.quantity} locked={locked} lockedLabel={text.locked} />
            </div>
            {locked ? (
              <p className="mt-2 flex items-start gap-1.5 kb-xs text-fg-2">
                <Lock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  {info.quantity ? `${info.quantity}. ` : ""}
                  {text.lockedNote}
                </span>
              </p>
            ) : null}
            {purchase.showTotal ? (
              <p className="mt-2 flex items-center justify-between gap-3 kb-sm" data-testid="purchase-total">
                <span className="text-fg-2">{text.total}</span>
                <Money value={purchase.total} className="font-extrabold text-fg" />
              </p>
            ) : null}
          </div>
        )}

        <div className="grid gap-2">
          {soldOut ? (
            <>
              <Button size="lg" block disabled data-testid="add-to-cart">
                {text.soldOut}
              </Button>
              <ButtonLink href={link(purchase.similarHref)} variant="outline-primary" size="lg" block icon={LayoutGrid}>
                {text.similar}
              </ButtonLink>
            </>
          ) : (
            <>
              <Button size="lg" block icon={ShoppingCart} onClick={purchase.add} data-testid="add-to-cart">
                {text.add}
              </Button>
              <Button variant="outline-primary" size="lg" block icon={Zap} onClick={purchase.buyNow} data-testid="buy-now">
                {text.buy}
              </Button>
            </>
          )}
          {purchase.inCart ? (
            <p className="text-center kb-xs font-semibold text-fg-2" data-testid="in-cart">
              {text.inCart}
            </p>
          ) : null}
        </div>

        {compact ? null : (
          <div className="grid gap-3 border-t border-line pt-4">
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 kb-xs font-bold text-fg">
                <Lock aria-hidden="true" className="size-3.5 text-success" />
                {ui("securePayment")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {info.payment.methods.map((method) => (
                  <span key={method} dir="ltr" className="rounded-md border border-line px-1.5 py-0.5 kb-2xs font-extrabold text-fg-2">
                    {method}
                  </span>
                ))}
              </div>
            </div>
            <p className="flex items-center justify-between gap-3 rounded-lg bg-surface-2 px-3 py-2 kb-sm">
              <span className="flex items-center gap-2 text-fg-2">
                <Wallet aria-hidden="true" className="size-4" />
                {ui("walletBalance")}
              </span>
              <Money value={info.payment.wallet} className="font-bold text-fg" />
            </p>
            <ul className="grid gap-1.5 kb-xs text-fg-2">
              <li className="flex items-start gap-2">
                <Truck aria-hidden="true" className="mt-px size-3.5 shrink-0 text-fg-3" />
                {ui("deliveryText")}
              </li>
              {info.sellerCity ? (
                <li className="flex items-start gap-2">
                  <Warehouse aria-hidden="true" className="mt-px size-3.5 shrink-0 text-fg-3" />
                  {ui("pickupText", { city: info.sellerCity })}
                </li>
              ) : null}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
