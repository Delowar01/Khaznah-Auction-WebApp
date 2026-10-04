"use client";

// Contemporary Saudi purchase: the Auction Detail's framed panel with a sage
// head (the Buy Now tag and "Fixed price"), the price with its discount, was
// price and saving, the stock in words over a quiet meter, a square-stepped
// quantity field and its total, the green Add to cart with Buy it now
// outlined beneath it — or, sold out, a disabled button and similar items —
// then payment, the wallet and pickup. Phones: a white bar fixed at the foot
// with the price and Add to cart. Behaviour comes from the shared product
// hooks.
import { useId } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck, CircleSlash, Lock, MapPin, Minus, Plus, ShieldCheck, ShoppingCart, Tag, Wallet, Zap } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useToastClearance } from "@/components/shared/auction/hooks";
import { PRODUCT_COPY as C } from "@/components/shared/product/copy";
import { Money } from "@/components/shared/ui/Money";
import { Arrow, btn, cx } from "../ui";

// Stock level → icon, words colour and meter colour (the words always say it).
const STOCK = {
  healthy: { icon: CircleCheck, text: "text-[var(--sc-green)]", bar: "bg-[var(--sc-green)]" },
  low: { icon: CircleAlert, text: "text-[var(--sc-grade-b)]", bar: "bg-[#c98a2e]" },
  veryLow: { icon: CircleAlert, text: "text-[var(--sc-grade-c)]", bar: "bg-[var(--sc-grade-c)]" },
  out: { icon: CircleSlash, text: "text-[var(--sc-ink)]", bar: "" },
};

/** The stock in words (status · count) over a quiet meter. */
export function StockLine({ stock }) {
  const tone = STOCK[stock.level];
  return (
    <div>
      <p className={cx("flex flex-wrap items-center gap-x-2 gap-y-0.5 sc-md font-semibold", tone.text)}>
        <tone.icon aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={2} />
        {stock.status}
        {stock.soldOut ? null : <span className="font-normal text-[var(--sc-muted)]">· {stock.count}</span>}
      </p>
      {stock.soldOut || stock.fill == null ? null : (
        <span aria-hidden="true" className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[var(--sc-line)]">
          <span className={cx("block h-full rounded-full", tone.bar)} style={{ width: `${Math.round(stock.fill * 100)}%` }} />
        </span>
      )}
    </div>
  );
}

/** Quantity: a framed field with square − and +; a lock and "Full lot" when it cannot change. */
function Quantity({ info, purchase }) {
  const id = useId();
  const { text } = purchase;
  if (purchase.locked) {
    return (
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <span className="sc-md font-semibold text-[var(--sc-ink)]">{text.quantity}</span>
          <span className="inline-flex h-11 items-center gap-2 rounded-[7px] border border-[var(--sc-line)] bg-[var(--sc-panel)] px-3.5 sc-md font-semibold text-[var(--sc-ink)]">
            <Lock aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
            <span className="tabular">{purchase.qty}</span>
            <span className="font-normal text-[var(--sc-muted)]">· {text.locked}</span>
          </span>
        </div>
        <p className="rounded-[7px] bg-[var(--sc-soft)] px-3 py-2 sc-sm text-[var(--sc-ink)]">
          {info.quantity ? `${info.quantity}. ` : ""}
          {text.lockedNote}
        </p>
      </div>
    );
  }
  const step = "grid w-11 shrink-0 place-items-center bg-[var(--sc-soft)] text-[var(--sc-green)] transition-colors hover:bg-[#dfece5] disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <label htmlFor={id} className="sc-md font-semibold text-[var(--sc-ink)]">
        {text.quantity}
      </label>
      <div className="flex h-11 w-[150px] overflow-hidden rounded-[7px] border border-[#cfdcd7] bg-white focus-within:border-[var(--sc-green)] focus-within:ring-2 focus-within:ring-[var(--sc-green)]/30">
        <button type="button" onClick={purchase.dec} disabled={!purchase.canDec} aria-label={text.decrease} className={cx(step, "border-e border-[#cfdcd7]")}>
          <Minus aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={1}
          max={purchase.max}
          value={purchase.qty}
          onChange={(event) => purchase.setQty(event.target.value)}
          className="sc-no-spin w-full min-w-0 bg-transparent text-center sc-lg font-bold tabular text-[var(--sc-ink)] outline-none"
        />
        <button type="button" onClick={purchase.inc} disabled={!purchase.canInc} aria-label={text.increase} className={cx(step, "border-s border-[#cfdcd7]")}>
          <Plus aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

/**
 * The framed purchase panel: price, discount and saving; stock; quantity
 * and total; Add to cart and Buy it now (or, sold out, similar items); the
 * quantity already in the cart; payment, the wallet and pickup.
 */
export function PurchasePanel({ info, purchase }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { soldOut, text } = purchase;
  return (
    <section aria-label={t(C.purchase)} className="overflow-hidden rounded-[9px] border border-[var(--sc-line)] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-[var(--sc-soft)] px-4 py-3 dt:px-5">
        <span className="inline-flex h-[26px] items-center gap-1.5 rounded-[6px] bg-white px-2.5 sc-sm font-semibold text-[var(--sc-green)]">
          <Tag aria-hidden="true" className="size-3.5" strokeWidth={2} />
          {ui("buyNow")}
        </span>
        <span className="sc-md font-medium text-[var(--sc-ink)]">{t(C.fixedPrice)}</span>
      </div>

      <div className="grid gap-4 p-4 dt:p-5">
        <div>
          <p className="sc-md text-[var(--sc-muted)]">{info.priceLabel}</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Money value={purchase.price} className={cx("text-[32px] font-bold leading-10 tracking-[-0.01em] dt:text-[36px] dt:leading-[44px]", soldOut ? "text-[var(--sc-muted)]" : "text-[var(--sc-ink)]")} symbolClassName="text-[0.66em]" />
            {purchase.pct ? (
              <span className="inline-flex h-[26px] items-center rounded-[6px] bg-[var(--sc-soft)] px-2 sc-sm font-semibold text-[var(--sc-green)]">
                <span dir="ltr">{text.pct}</span>
              </span>
            ) : null}
          </p>
          {purchase.pct ? (
            <p className="mt-1 flex flex-wrap items-baseline gap-x-2 sc-sm text-[var(--sc-muted)]">
              <span>
                {text.was} <Money value={purchase.original} strike />
              </span>
              {soldOut ? null : <span className="font-semibold text-[var(--sc-green)]">{text.save}</span>}
            </p>
          ) : null}
        </div>

        <StockLine stock={purchase.stock} />

        {soldOut ? null : (
          <div className="grid gap-3 border-t border-[var(--sc-line)] pt-4">
            <Quantity info={info} purchase={purchase} />
            {purchase.showTotal ? (
              <p className="flex items-baseline justify-between gap-3 sc-md" data-testid="purchase-total">
                <span className="text-[var(--sc-muted)]">{text.total}</span>
                <Money value={purchase.total} className="sc-lg font-bold text-[var(--sc-ink)]" />
              </p>
            ) : null}
          </div>
        )}

        <div className="grid gap-2.5">
          {soldOut ? (
            <>
              <button type="button" disabled className={btn("green", "lg", "h-[52px] w-full")} data-testid="add-to-cart">
                {text.soldOut}
              </button>
              <Link href={link(purchase.similarHref)} className={btn("outline", "md", "w-full")}>
                {text.similar}
                <Arrow className="size-[18px]" />
              </Link>
            </>
          ) : (
            <>
              <button type="button" onClick={purchase.add} className={btn("green", "lg", "h-[52px] w-full dt:text-[17px]")} data-testid="add-to-cart">
                <ShoppingCart aria-hidden="true" className="size-5" strokeWidth={1.9} />
                {text.add}
              </button>
              <button type="button" onClick={purchase.buyNow} className={btn("outline", "md", "w-full")} data-testid="buy-now">
                <Zap aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
                {text.buy}
              </button>
            </>
          )}
          {purchase.inCart ? (
            <p className="flex items-center justify-center gap-1.5 sc-sm font-semibold text-[var(--sc-green)]" data-testid="in-cart">
              <CircleCheck aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
              {text.inCart}
            </p>
          ) : null}
        </div>

        <ul className="grid gap-2 border-t border-[var(--sc-line)] pt-4 sc-sm text-[var(--sc-muted)]">
          <li className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-[var(--sc-green)]" strokeWidth={2} />
            {ui("securePayment")}
            {info.payment.methods.map((method) => (
              <span key={method} dir="ltr" className="rounded-[5px] border border-[var(--sc-line)] px-1.5 sc-xs font-semibold text-[var(--sc-ink)]">
                {method}
              </span>
            ))}
          </li>
          <li className="flex items-center gap-2">
            <Wallet aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
            {ui("walletBalance")} <Money value={info.payment.wallet} className="font-semibold text-[var(--sc-ink)]" />
          </li>
          {info.seller ? (
            <li className="flex items-start gap-2">
              <MapPin aria-hidden="true" className="mt-px size-4 shrink-0" strokeWidth={2} />
              {ui("pickupText", { city: info.sellerCity })}
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}

const COUNT = { healthy: "text-[var(--sc-muted)]", low: "font-semibold text-[var(--sc-grade-b)]", veryLow: "font-semibold text-[var(--sc-grade-c)]", out: "font-semibold text-[var(--sc-ink)]" };

/** Phones: a white bar fixed at the foot — the price (the was price or the stock under it) and the green Add to cart. */
export function PhoneBar({ info, purchase }) {
  const barRef = useToastClearance();
  const { soldOut, text, stock } = purchase;
  return (
    <div ref={barRef} className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--sc-line)] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-20px_rgb(16_33_57/0.45)] backdrop-blur-md md:hidden" data-testid="buy-bar">
      <div className="sc-container flex h-[74px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex min-w-0 items-baseline gap-1.5">
            <Money value={purchase.price} className={cx("text-[20px] font-bold leading-7", soldOut ? "text-[var(--sc-muted)]" : "text-[var(--sc-ink)]")} symbolClassName="text-[0.7em]" />
            {info.unit ? <span className="truncate sc-xs text-[var(--sc-muted)]">{info.unit}</span> : null}
          </p>
          {purchase.pct && !soldOut ? (
            <p className="flex items-center gap-1.5 sc-sm text-[var(--sc-muted)]">
              <span className="sr-only">{text.was} </span>
              <Money value={purchase.original} strike />
              <span dir="ltr" className="font-semibold text-[var(--sc-green)]">
                {text.pct}
              </span>
            </p>
          ) : (
            <p className={cx("truncate sc-sm", COUNT[stock.level])}>{stock.count}</p>
          )}
        </div>
        <button type="button" onClick={purchase.add} disabled={soldOut} className={btn("green", "md", "px-5 max-[359px]:px-4")} data-testid="buy-bar-add">
          <ShoppingCart aria-hidden="true" className="size-[18px] max-[359px]:hidden" strokeWidth={1.9} />
          {soldOut ? text.soldOut : text.add}
        </button>
      </div>
    </div>
  );
}
