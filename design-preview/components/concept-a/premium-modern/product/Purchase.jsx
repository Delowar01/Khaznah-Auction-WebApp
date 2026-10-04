"use client";

// Premium Modern purchase: the charcoal console (price, saving, quantity,
// total, Add to cart and Buy it now, payment notes), the hairline status
// row above it and the ivory phone bar. Behaviour comes from the shared
// product hooks.
import Link from "next/link";
import { Lock, Minus, Plus, Share2, ShieldCheck, ShoppingCart, Truck, Wallet, Zap } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useShareLink, useToastClearance } from "@/components/shared/auction/hooks";
import { PRODUCT_COPY as C } from "@/components/shared/product/copy";
import { Money } from "@/components/shared/ui/Money";
import { SaveSquare } from "../auction/Bidding";
import { btn, cx } from "../ui";

// Buy it now on charcoal: an outlined button of the same size as Add to cart.
const ON_DARK = "inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-[4px] border border-white/40 px-6 pr-lg font-semibold text-white transition-colors duration-150 outline-offset-2 hover:bg-white/10";

// Stock level → the status dot and the count's colour (on ivory).
const DOT = { healthy: "bg-[var(--pr-grade-a)]", low: "bg-[var(--pr-brass)]", veryLow: "bg-[var(--pr-live)]", out: "bg-[#9b968c]" };
const COUNT = { healthy: "text-fg-2", low: "font-semibold text-[var(--pr-bronze)]", veryLow: "font-semibold text-[var(--pr-live)]", out: "font-semibold text-fg-2" };

/** Hairline row: the stock status and count, watchers, then Save and Share. */
export function StatusRow({ product, info, purchase }) {
  const { ui } = useLang();
  const share = useShareLink();
  const { stock } = purchase;
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-y border-line py-3">
      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
        <p className="inline-flex items-center gap-2 pr-md font-semibold text-fg">
          <span aria-hidden="true" className={cx("size-2 rounded-full", DOT[stock.level])} />
          {stock.status}
        </p>
        {stock.soldOut ? null : <p className={cx("pr-md", COUNT[stock.level])}>{stock.count}</p>}
        <p className="pr-sm text-fg-2">{info.watchers}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <SaveSquare product={product} />
        <button type="button" onClick={share} className={btn("outline", "md", "w-11 px-0")} aria-label={ui("share")} title={ui("share")} data-testid="share-button">
          <Share2 aria-hidden="true" className="size-[18px]" strokeWidth={1.7} />
        </button>
      </div>
    </div>
  );
}

/** − [n] + on white, as the bid form's amount field; a lock and "Full lot" when it cannot change. */
function Quantity({ purchase }) {
  const { text } = purchase;
  if (purchase.locked) {
    return (
      <div className="inline-flex h-11 items-center gap-2 rounded-[4px] border border-white/35 px-3 pr-md font-semibold text-white">
        <Lock aria-hidden="true" className="size-4" strokeWidth={1.8} />
        <span className="tabular">{purchase.qty}</span>
        <span className="pr-sm font-normal text-white/75">{text.locked}</span>
      </div>
    );
  }
  return (
    <div role="group" aria-label={text.quantity} className="flex h-11 items-stretch overflow-hidden rounded-[4px] border border-white bg-white text-[#171b27] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--pr-brass)]">
      <button type="button" onClick={purchase.dec} disabled={!purchase.canDec} aria-label={text.decrease} className="grid w-11 shrink-0 place-items-center border-e border-[#e4e2dc] text-[#4a4d57] hover:bg-[var(--pr-stone)] disabled:opacity-35">
        <Minus aria-hidden="true" className="size-4" strokeWidth={2} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={purchase.max}
        value={purchase.qty}
        onChange={(event) => purchase.setQty(event.target.value)}
        aria-label={text.quantity}
        className="pr-no-spin w-12 min-w-0 bg-transparent text-center text-[17px] font-bold tabular outline-none"
      />
      <button type="button" onClick={purchase.inc} disabled={!purchase.canInc} aria-label={text.increase} className="grid w-11 shrink-0 place-items-center border-s border-[#e4e2dc] text-[#4a4d57] hover:bg-[var(--pr-stone)] disabled:opacity-35">
        <Plus aria-hidden="true" className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}

/**
 * The charcoal console: the price (per unit where the lot has one) with the
 * discount, was price and saving in brass; the quantity and its total; Add
 * to cart in brass and Buy it now beneath it — or, sold out, a disabled
 * button and similar items; then payment and how it reaches you.
 */
export function Console({ info, purchase }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { soldOut, text } = purchase;
  return (
    <section aria-label={t(C.purchase)} className="grid gap-5 rounded-[6px] bg-[var(--pr-charcoal)] p-5 text-white [--focus:#e6cd96] dt:p-6">
      <div>
        <p className="pr-xs text-white/75">{info.priceLabel}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Money value={purchase.price} className={cx("text-[30px] font-bold leading-9 tracking-[-0.01em] dt:text-[34px] dt:leading-10", soldOut ? "text-white/60" : "text-white")} symbolClassName="text-[0.7em]" />
          {purchase.pct ? (
            <span className="inline-flex h-6 items-center rounded-[3px] bg-[var(--pr-brass)] px-2 pr-label text-[#171b27]">
              <span dir="ltr">{text.pct}</span>
            </span>
          ) : null}
        </div>
        {purchase.pct ? (
          <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 pr-sm text-white/75">
            {text.was} <Money value={purchase.original} strike />
            <span className="font-semibold text-[#e6cd96]">{text.save}</span>
          </p>
        ) : null}
      </div>

      {soldOut ? null : (
        <div className="grid gap-2.5 border-t border-white/15 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="pr-md font-semibold">{text.quantity}</span>
            <Quantity purchase={purchase} />
          </div>
          {purchase.locked ? (
            <p className="flex items-start gap-2 pr-sm text-white/75">
              <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} />
              <span>
                {info.quantity ? `${info.quantity}. ` : ""}
                {text.lockedNote}
              </span>
            </p>
          ) : null}
          {purchase.showTotal ? (
            <p className="flex items-baseline justify-between gap-3 pr-md" data-testid="purchase-total">
              <span className="text-white/75">{text.total}</span>
              <Money value={purchase.total} className="text-[19px] font-bold text-white" />
            </p>
          ) : null}
        </div>
      )}

      <div className="grid gap-2.5">
        {soldOut ? (
          <>
            <button type="button" disabled className={btn("brass", "lg", "w-full font-semibold")} data-testid="add-to-cart">
              {text.soldOut}
            </button>
            <Link href={link(purchase.similarHref)} className="pr-link inline-flex items-center justify-center gap-1.5 pr-md font-semibold text-white">
              {text.similar}
            </Link>
          </>
        ) : (
          <>
            <button type="button" onClick={purchase.add} className={btn("brass", "lg", "w-full font-semibold")} data-testid="add-to-cart">
              <ShoppingCart aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
              {text.add}
            </button>
            <button type="button" onClick={purchase.buyNow} className={ON_DARK} data-testid="buy-now">
              <Zap aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
              {text.buy}
            </button>
          </>
        )}
        {purchase.inCart ? (
          <p className="text-center pr-sm text-white/75" data-testid="in-cart">
            {text.inCart}
          </p>
        ) : null}
      </div>

      <ul className="grid gap-1.5 border-t border-white/15 pt-4 pr-xs text-white/75">
        <li className="flex items-start gap-2">
          <ShieldCheck aria-hidden="true" className="mt-px size-[15px] shrink-0" strokeWidth={1.8} />
          <span>
            {ui("securePayment")} ·{" "}
            <span dir="ltr" className="font-semibold text-white">
              {info.payment.methods.join(" · ")}
            </span>
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Wallet aria-hidden="true" className="mt-px size-[15px] shrink-0" strokeWidth={1.8} />
          <span>
            {ui("walletBalance")} <Money value={info.payment.wallet} className="font-semibold text-white" />
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Truck aria-hidden="true" className="mt-px size-[15px] shrink-0" strokeWidth={1.8} />
          <span>{ui("deliveryText")}</span>
        </li>
      </ul>
    </section>
  );
}

/** Phones: ivory bar fixed at the foot — the price with the was price or the stock, and Add to cart. */
export function PhoneBar({ info, purchase }) {
  const barRef = useToastClearance();
  const { soldOut, text, stock } = purchase;
  return (
    <div ref={barRef} className="fixed inset-x-0 bottom-0 z-30 border-t border-[#d3cfc6] bg-[#f8f7f3]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden" data-testid="buy-bar">
      <div className="pr-container flex h-[72px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate pr-xs text-fg-2">{info.priceLabel}</p>
          <p className="flex flex-wrap items-baseline gap-x-2">
            <Money value={purchase.price} className={cx("pr-price-sm", soldOut ? "text-fg-2" : "text-fg")} symbolClassName="text-[0.78em]" />
            {purchase.pct && !soldOut ? (
              <span className="pr-xs text-fg-2">
                <span className="sr-only">{text.was} </span>
                <Money value={purchase.original} strike />
              </span>
            ) : (
              <span className={cx("truncate pr-xs", COUNT[stock.level])}>{stock.count}</span>
            )}
          </p>
        </div>
        <button type="button" onClick={purchase.add} disabled={soldOut} className={btn("charcoal", "md", "px-5 max-[379px]:px-3.5")} data-testid="buy-bar-add">
          <ShoppingCart aria-hidden="true" className="size-[18px] max-[379px]:hidden" strokeWidth={1.8} />
          {soldOut ? text.soldOut : text.add}
        </button>
      </div>
    </div>
  );
}
