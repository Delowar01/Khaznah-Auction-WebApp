"use client";

// Visual Discovery purchase: the rounded white price card (display price,
// gold saving, a stock pill, the pill quantity control and its total, the
// indigo Add to cart pill and Buy it now beneath it, payment chips) and the
// floating navy phone bar. Behaviour comes from the shared product hooks.
import Link from "next/link";
import { CircleAlert, CircleCheck, CircleSlash, Lock, Minus, Plus, ShieldCheck, ShoppingCart, Wallet, Zap } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useToastClearance } from "@/components/shared/auction/hooks";
import { PRODUCT_COPY as C } from "@/components/shared/product/copy";
import { Money } from "@/components/shared/ui/Money";
import { Arrow, btn, cx } from "../ui";

// Stock level → pill colour and icon (the words always say it too).
const STOCK = {
  healthy: { pill: "bg-[#ddf4e6] text-[var(--vd-grade-a)]", icon: CircleCheck },
  low: { pill: "bg-[#fdf1d8] text-[#7a4e0c]", icon: CircleAlert },
  veryLow: { pill: "bg-[#ffe4d6] text-[#a8401a]", icon: CircleAlert },
  out: { pill: "bg-[var(--vd-bluegray)] text-[var(--vd-ink)]", icon: CircleSlash },
};

/** The stock as a pill: icon, status and count. */
export function StockPill({ stock, className = "" }) {
  const tone = STOCK[stock.level];
  return (
    <p className={cx("inline-flex min-h-9 w-fit max-w-full flex-wrap items-center gap-x-1.5 rounded-full px-3.5 py-1.5 vd-sm font-bold", tone.pill, className)}>
      <tone.icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.2} />
      {stock.status}
      {stock.soldOut ? null : <span className="font-semibold">· {stock.count}</span>}
    </p>
  );
}

/** Pill quantity control: round − and +, the number between; a lock and "Full lot" when it cannot change. */
function Quantity({ purchase }) {
  const { text } = purchase;
  if (purchase.locked) {
    return (
      <span className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--vd-bluegray)] px-4 vd-md font-bold text-[var(--vd-ink)]">
        <Lock aria-hidden="true" className="size-4" strokeWidth={2.2} />
        <span className="tabular">{purchase.qty}</span>
        <span className="vd-sm font-semibold text-[var(--vd-muted)]">{text.locked}</span>
      </span>
    );
  }
  const step = "grid size-10 place-items-center rounded-full bg-white text-[var(--vd-indigo)] shadow-[0_1px_3px_rgb(7_27_82/0.12)] transition-colors hover:bg-[#f3f7fc] disabled:opacity-40 disabled:shadow-none";
  return (
    <div role="group" aria-label={text.quantity} className="inline-flex h-12 items-center gap-1 rounded-full bg-[var(--vd-bluegray)] p-1">
      <button type="button" onClick={purchase.dec} disabled={!purchase.canDec} aria-label={text.decrease} className={step}>
        <Minus aria-hidden="true" className="size-4" strokeWidth={2.4} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={purchase.max}
        value={purchase.qty}
        onChange={(event) => purchase.setQty(event.target.value)}
        aria-label={text.quantity}
        className="vd-no-spin w-11 min-w-0 rounded-full bg-transparent text-center vd-lg font-extrabold text-[var(--vd-ink)] tabular"
      />
      <button type="button" onClick={purchase.inc} disabled={!purchase.canInc} aria-label={text.increase} className={step}>
        <Plus aria-hidden="true" className="size-4" strokeWidth={2.4} />
      </button>
    </div>
  );
}

/**
 * The price card: the price in large display figures with the discount,
 * was price and saving; the stock; the quantity and its total; the indigo
 * Add to cart pill and Buy it now — or, sold out, a disabled pill and
 * similar items; then payment, the wallet and the item's lot number.
 */
export function PriceCard({ info, purchase }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { soldOut, text } = purchase;
  return (
    <section aria-label={t(C.purchase)} className="grid gap-4 rounded-[24px] border border-[var(--vd-line)] bg-white p-5 text-[var(--vd-ink)] shadow-[0_1px_2px_rgb(7_27_82/0.04),0_14px_34px_-20px_rgb(7_27_82/0.3)] dt:p-6">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className="vd-sm text-[var(--vd-muted)]">{info.priceLabel}</p>
          <Money value={purchase.price} className={cx("vd-display text-[38px] font-extrabold leading-[44px] tracking-[-0.02em] dt:text-[42px] dt:leading-[48px]", soldOut && "text-[var(--vd-muted)]")} symbolClassName="text-[0.66em]" />
        </div>
        {purchase.pct ? (
          <p className="pb-1.5 text-end vd-sm text-[var(--vd-muted)]">
            <span className="inline-flex h-7 items-center rounded-full bg-[var(--vd-gold)] px-3 vd-sm font-extrabold text-[var(--vd-ink)]">
              <span dir="ltr">{text.pct}</span>
            </span>
            <span className="mt-1 block">
              {text.was} <Money value={purchase.original} strike />
            </span>
          </p>
        ) : null}
      </div>
      {purchase.pct && !soldOut ? <p className="-mt-2 vd-sm font-bold text-[var(--vd-grade-a)]">{text.save}</p> : null}

      <StockPill stock={purchase.stock} />

      {soldOut ? null : (
        <div className="grid gap-2.5 rounded-[20px] bg-[#f6f8fc] p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="vd-md font-bold">{text.quantity}</span>
            <Quantity purchase={purchase} />
          </div>
          {purchase.locked ? (
            <p className="flex items-start gap-2 vd-sm text-[var(--vd-muted)]">
              <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
              <span>
                {info.quantity ? `${info.quantity}. ` : ""}
                {text.lockedNote}
              </span>
            </p>
          ) : null}
          {purchase.showTotal ? (
            <p className="flex items-baseline justify-between gap-3 vd-md" data-testid="purchase-total">
              <span className="text-[var(--vd-muted)]">{text.total}</span>
              <Money value={purchase.total} className="vd-lg font-extrabold" />
            </p>
          ) : null}
        </div>
      )}

      <div className="grid gap-2.5">
        {soldOut ? (
          <>
            <button type="button" disabled className={btn("indigo", "lg", "h-14 w-full vd-lg")} data-testid="add-to-cart">
              {text.soldOut}
            </button>
            <Link href={link(purchase.similarHref)} className={btn("soft", "lg", "h-12 w-full")}>
              {text.similar}
              <Arrow />
            </Link>
          </>
        ) : (
          <>
            <button type="button" onClick={purchase.add} className={btn("indigo", "lg", "h-14 w-full vd-lg")} data-testid="add-to-cart">
              <ShoppingCart aria-hidden="true" className="size-5" strokeWidth={2.1} />
              {text.add}
            </button>
            <button type="button" onClick={purchase.buyNow} className={btn("outline", "lg", "h-12 w-full")} data-testid="buy-now">
              <Zap aria-hidden="true" className="size-[18px]" strokeWidth={2.1} />
              {text.buy}
            </button>
          </>
        )}
        {purchase.inCart ? (
          <p className="text-center vd-sm font-semibold text-[var(--vd-indigo)]" data-testid="in-cart">
            {text.inCart}
          </p>
        ) : null}
      </div>

      <ul className="grid gap-1.5 vd-xs text-[var(--vd-muted)]">
        <li className="flex flex-wrap items-center gap-1.5">
          <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0 text-[var(--vd-grade-a)]" strokeWidth={2} />
          {ui("securePayment")}
          {info.payment.methods.map((method) => (
            <span key={method} dir="ltr" className="rounded-full bg-[var(--vd-bluegray)] px-2 py-0.5 font-bold text-[var(--vd-indigo)]">
              {method}
            </span>
          ))}
        </li>
        <li className="flex items-center gap-1.5">
          <Wallet aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />
          {ui("walletBalance")} <Money value={info.payment.wallet} className="font-bold text-[var(--vd-ink)]" />
        </li>
      </ul>
    </section>
  );
}

/** Phones: a floating navy pill — the price (the was price or the stock under it) and the gold Add to cart. */
export function PhoneBar({ purchase }) {
  const barRef = useToastClearance();
  const { soldOut, text, stock } = purchase;
  return (
    <div ref={barRef} className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-30 [--focus:var(--vd-gold)] md:hidden" data-testid="buy-bar">
      <div className="mx-auto flex h-16 max-w-[640px] items-center gap-2.5 rounded-full bg-[var(--vd-navy)] ps-5 pe-2 text-white shadow-[0_12px_30px_-12px_rgb(6_33_63/0.6)] max-[379px]:gap-2 max-[379px]:ps-4">
        <div className="min-w-0 flex-1">
          <Money value={purchase.price} className={cx("block truncate vd-lg font-extrabold", soldOut && "text-white/70")} symbolClassName="text-[0.75em]" />
          {purchase.pct && !soldOut ? (
            <span className="block vd-xs text-white/75">
              <span className="sr-only">{text.was} </span>
              <Money value={purchase.original} strike />
            </span>
          ) : (
            <span className="block truncate vd-xs text-white/75">{stock.count}</span>
          )}
        </div>
        <button type="button" onClick={purchase.add} disabled={soldOut} className={btn("gold", "lg", "max-[379px]:px-4")} data-testid="buy-bar-add">
          <ShoppingCart aria-hidden="true" className="size-[18px] max-[379px]:hidden" strokeWidth={2.1} />
          {soldOut ? text.soldOut : text.add}
        </button>
      </div>
    </div>
  );
}
