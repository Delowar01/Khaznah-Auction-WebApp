"use client";

// Checkout orders: one card per seller ("Order 1 · Sold by …"), each with its
// lines (− / + within the quote's stock cap, Remove without confirmation, as
// production), its delivery charge and — where the warehouse offers it — the
// per-order choice between paying online and cash on delivery, then the
// order's own totals (desktop; production hides them on phones).
import Link from "next/link";
import { Banknote, CreditCard, Truck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CHECKOUT_COPY as C } from "@/components/shared/commerce/checkoutCopy";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { detailPath } from "@/lib/catalog";
import { toneOf } from "../browse/Cards";
import { Panel } from "../kit/Blocks";
import { RadioCard } from "../kit/Form";
import { QuantityStepper } from "../kit/Quantity";
import { GradePill, cx } from "../ui";

function OrderLine({ line, cap, quoted, busy, onQty, onRemove }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { product } = line;
  const title = t(product.title);
  return (
    <li className="grid grid-cols-[52px_minmax(0,1fr)] gap-3 py-3.5 sm:grid-cols-[80px_minmax(0,1fr)] sm:gap-4" data-testid="checkout-line" data-slug={line.slug}>
      <Link href={link(detailPath(product))} tabIndex={-1} aria-hidden="true" className="relative aspect-square overflow-hidden rounded-[14px]" style={{ background: toneOf(product.slug) }}>
        <Img image={product.images[0]} cutout alt="" sizes="80px" className="vd-multiply absolute inset-0 size-full object-contain p-1.5" />
      </Link>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-2 vd-md font-bold text-[var(--vd-ink)] max-sm:line-clamp-1">
              <bdi>{title}</bdi>
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 vd-xs text-[var(--vd-muted)]">
              <GradePill grade={product.grade} />
              <span className="max-lg:hidden">
                <span className="sr-only">{t(C.sku)}: </span>
                <bdi dir="ltr">{product.lot}</bdi>
              </span>
            </p>
          </div>
          <p className="shrink-0 text-end">
            <span className="block vd-xs text-[var(--vd-muted)] max-lg:sr-only">{t(C.lineTotal)}</span>
            <Money value={line.unitPrice * line.quantity} className="vd-md font-extrabold text-[var(--vd-ink)]" />
          </p>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-2">
          <QuantityStepper
            value={line.quantity}
            max={Math.max(1, cap ?? line.quantity)}
            // "+" is disabled only at the quote's cap; before a quote it is a silent no-op (production).
            canIncrease={!busy && !(quoted && line.quantity >= cap)}
            editable={false}
            disabled={busy}
            onChange={(next) => onQty(line, next)}
            labels={{ quantity: t(C.quantityOf, { title }), decrease: t(C.decrease, { title }), increase: t(C.increase, { title }) }}
            className="!h-10 [&_button]:!size-8"
          />
          <button type="button" onClick={() => onRemove(line)} disabled={busy} aria-label={t(C.removeNamed, { title })} className="h-10 rounded-full px-2.5 vd-sm font-bold text-[#b3261e] underline-offset-2 hover:underline disabled:opacity-45" data-testid="checkout-remove">
            {t(C.remove)}
          </button>
        </div>
      </div>
    </li>
  );
}

function OrderTotals({ totals, codeActive }) {
  const { t } = useLang();
  const row = "flex items-baseline justify-between gap-3";
  return (
    <dl className="mt-3 grid grid-cols-1 gap-1.5 rounded-[16px] bg-[#f6f8fc] px-4 py-3 vd-sm max-lg:hidden" data-testid="order-totals">
      <div className={row}>
        <dt className="text-[var(--vd-muted)]">{t(C.products)}</dt>
        <dd className="font-semibold text-[var(--vd-ink)]">
          <Money value={totals.products} />
        </dd>
      </div>
      {totals.codCharge > 0 ? (
        <div className={row}>
          <dt className="text-[var(--vd-muted)]">{t(C.codFee)}</dt>
          <dd className="font-semibold text-[var(--vd-ink)]">
            <Money value={totals.codCharge} />
          </dd>
        </div>
      ) : null}
      {totals.discount > 0 ? (
        <div className={row}>
          <dt className="text-[var(--vd-muted)]">{t(codeActive ? C.couponSavings : C.automaticSavings)}</dt>
          <dd className="font-bold text-[var(--vd-grade-a)]" dir="ltr">
            −<Money value={totals.discount} />
          </dd>
        </div>
      ) : null}
      <div className={row}>
        <dt className="text-[var(--vd-muted)]">{t(C.delivery)}</dt>
        <dd className="font-semibold text-[var(--vd-ink)]">{totals.deliveryCharge == null ? "—" : <Money value={totals.delivery} />}</dd>
      </div>
      <div className={cx(row, "mt-1 border-t border-[var(--vd-line)] pt-2 vd-md")}>
        <dt className="font-bold text-[var(--vd-ink)]">{t(C.orderTotal)}</dt>
        <dd className="font-extrabold text-[var(--vd-ink)]">
          <Money value={totals.deliveryCharge != null ? totals.orderTotal : totals.products - totals.discount} />
        </dd>
      </div>
    </dl>
  );
}

function OrderCard({ index, group, label, totals, method, quote, payment, onPayment, caps, busy, codeActive, onQty, onRemove }) {
  const { t } = useLang();
  const orderName = `${t(C.order)} ${index}`;
  return (
    <section aria-labelledby={`order-${group.key}`} className="rounded-[20px] border border-[var(--vd-line)] bg-white" data-testid="order-card">
      <header className="rounded-t-[20px] bg-[#f6f8fc] px-4 py-3">
        <h3 id={`order-${group.key}`} className="vd-kicker text-[var(--vd-indigo)]">
          {orderName}
        </h3>
        <p className="mt-0.5 vd-sm text-[var(--vd-muted)]">
          {t(C.soldBy)} <bdi className="font-bold text-[var(--vd-ink)]">{label}</bdi>
        </p>
      </header>
      <div className="px-4 pb-4">
        <ul className="divide-y divide-[var(--vd-line)]">
          {group.lines.map((line) => (
            <OrderLine key={line.slug} line={line} cap={caps[line.slug]} quoted={Boolean(quote)} busy={busy} onQty={onQty} onRemove={onRemove} />
          ))}
        </ul>
        {method === "home" ? (
          <div className="mt-1 rounded-[16px] border border-[var(--vd-line)] px-4 py-3" data-testid="order-delivery">
            <p className="flex items-center gap-2 vd-sm">
              <Truck aria-hidden="true" className="size-4 shrink-0 text-[var(--vd-indigo)] rtl:-scale-x-100" strokeWidth={2.2} />
              <span className="min-w-0 flex-1 text-[var(--vd-muted)]">
                {t(C.deliveryBy)} <bdi className="font-semibold text-[var(--vd-ink)]">{label}</bdi>
              </span>
              <span className="shrink-0 font-bold text-[var(--vd-ink)]">{totals.deliveryCharge == null ? t(C.afterAddressShort) : <Money value={totals.delivery} />}</span>
            </p>
            {totals.codEligible ? (
              <fieldset className="mt-3">
                <legend className="sr-only">{t(C.codLegend, { order: orderName })}</legend>
                <div className="grid grid-cols-1 gap-2">
                  <RadioCard name={`payment-${group.key}`} value="moyasar" checked={payment === "moyasar"} onChange={() => onPayment("moyasar")} disabled={busy} className="!p-3">
                    <span className="flex items-center gap-2 vd-sm font-semibold text-[var(--vd-ink)]">
                      <CreditCard aria-hidden="true" className="size-4 shrink-0 text-[var(--vd-indigo)]" strokeWidth={2.2} />
                      {t(C.payOnline)}
                    </span>
                  </RadioCard>
                  <RadioCard
                    name={`payment-${group.key}`}
                    value="home_delivery_cod"
                    checked={payment === "home_delivery_cod"}
                    onChange={() => onPayment("home_delivery_cod")}
                    disabled={busy}
                    className="!p-3"
                    aside={quote?.cod_fee > 0 ? <span className="vd-sm font-bold text-[#7a4e0c]">+<Money value={quote.cod_fee} /></span> : null}
                  >
                    <span className="flex items-center gap-2 vd-sm font-semibold text-[var(--vd-ink)]">
                      <Banknote aria-hidden="true" className="size-4 shrink-0 text-[#7a4e0c]" strokeWidth={2.2} />
                      {t(C.cashOnDelivery)}
                    </span>
                  </RadioCard>
                </div>
              </fieldset>
            ) : (
              <p className="mt-2 inline-flex min-h-7 items-center rounded-full bg-[var(--vd-bluegray)] px-3 py-1 vd-xs font-bold text-[var(--vd-ink)]" data-testid="cod-unavailable">
                {t(C.codUnavailable)}
              </p>
            )}
          </div>
        ) : null}
        <OrderTotals totals={totals} codeActive={codeActive} />
      </div>
    </section>
  );
}

/** Orders panel: "{n} items in your order", the sellers note, Σ unit × quantity, one card per seller. */
export function OrdersPanel({ lines, groups, totals, labels, method, quote, payments, onPayment, caps, busy, codes, onQty, onRemove, className = "" }) {
  const { t } = useLang();
  const multi = groups.length > 1;
  const amount = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  return (
    <Panel aria-labelledby="checkout-orders-title" className={className} data-testid="orders-panel">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <h2 id="checkout-orders-title" className="vd-h3 text-[var(--vd-ink)]">
            {t(C.itemsInOrder, { n: lines.length })}
          </h2>
          <p className="mt-0.5 vd-sm text-[var(--vd-muted)]">{multi ? t(C.fromSellers, { n: groups.length }) : t(C.reviewItems)}</p>
        </div>
        <Money value={amount} className="vd-lg font-extrabold text-[var(--vd-indigo)]" />
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-3 dt:grid-cols-2 dt:items-start">
        {groups.map((group, i) => (
          <OrderCard
            key={group.key}
            index={i + 1}
            group={group}
            label={labels[group.key]}
            totals={totals[i]}
            method={method}
            quote={quote?.groups[group.key]}
            payment={payments[group.key] || "moyasar"}
            onPayment={(value) => onPayment(group.key, value)}
            caps={caps}
            busy={busy}
            codeActive={Boolean(codes[group.key])}
            onQty={onQty}
            onRemove={onRemove}
          />
        ))}
      </div>
    </Panel>
  );
}
