"use client";

// Checkout payment side: the Payment Method card (a status row that mirrors
// the wallet choice, and the wallet: Moyasar only, Wallet + Moyasar or
// Wallet only), and the Order Summary — savings, per-order coupons, the
// lines production adds up, the navy "what you pay now" box, the error panel,
// Pay and Cancel checkout. Phones get production's fixed pay bar instead of
// the summary's buttons.
import Link from "next/link";
import { useId, useState } from "react";
import { Check, ChevronDown, CreditCard, Lock, ShieldCheck, Ticket, TriangleAlert, Wallet, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useToastClearance } from "@/components/shared/auction/hooks";
import { CHECKOUT_COPY as C } from "@/components/shared/commerce/checkoutCopy";
import { Money } from "@/components/shared/ui/Money";
import { moneyText } from "@/lib/format";
import { Notice, Panel, PanelHead, SummaryRow } from "../kit/Blocks";
import { RadioCard } from "../kit/Form";
import { btn, cx } from "../ui";

const METHOD_ROW = {
  none: { title: C.methodNoneTitle, text: C.methodNoneText, icon: CreditCard },
  partial: { title: C.methodPartialTitle, text: C.methodPartialText, icon: Wallet },
  full: { title: C.methodFullTitle, text: C.methodFullText, icon: Wallet },
};

/** CheckoutWallet: the three wallet modes with production's availability rules. */
function WalletBox({ wallet, mode, onMode, input, onInput, summary, busy }) {
  const { t } = useLang();
  const inputId = useId();
  const loading = !wallet;
  const balance = summary.balance;
  const maximum = Math.max(0, Math.min(balance, summary.onlineTotal));
  const options = [
    { value: "none", label: t(C.moyasarOnly), disabled: false },
    { value: "partial", label: t(C.walletPlus), disabled: balance <= 0 },
    { value: "full", label: t(C.walletOnly), disabled: balance <= 0 || balance < summary.onlineTotal },
  ];
  const short = mode === "full" && balance < summary.onlineTotal;
  const helper = mode === "partial" && maximum > 0 && maximum < summary.onlineTotal && (Number(input) || 0) >= maximum;
  return (
    <div className="mt-4 rounded-[20px] bg-[#f6f8fc] p-4" data-testid="wallet-box">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 vd-md font-bold text-[var(--vd-ink)]">
          <Wallet aria-hidden="true" className="size-4 text-[var(--vd-indigo)]" strokeWidth={2.2} />
          {t(C.useWallet)}
        </p>
        <p className="vd-sm text-[var(--vd-muted)]">
          {t(C.available)}: {loading ? "…" : <Money value={balance} className="font-bold text-[var(--vd-ink)]" />}
        </p>
      </div>
      <fieldset disabled={busy || loading} className="mt-3">
        <legend className="sr-only">{t(C.walletLegend)}</legend>
        <div className="grid grid-cols-1 gap-2">
          {options.map((option) => (
            <RadioCard key={option.value} name="wallet-mode" value={option.value} checked={mode === option.value} disabled={option.disabled} onChange={() => onMode(option.value)} className="!p-3">
              <span className="vd-md font-semibold text-[var(--vd-ink)]">{option.label}</span>
            </RadioCard>
          ))}
        </div>
      </fieldset>
      {mode === "partial" ? (
        <div className="mt-3">
          <label htmlFor={inputId} className="vd-sm font-semibold text-[var(--vd-ink)]">
            {t(C.amountFromWallet)}
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              id={inputId}
              type="number"
              min={0}
              max={maximum}
              step="0.01"
              inputMode="decimal"
              dir="ltr"
              value={input}
              disabled={busy}
              onChange={(event) => onInput(event.target.value)}
              onBlur={() => onInput(String(Math.round(Math.max(0, Math.min(maximum, Number(input) || 0)) * 100) / 100))}
              className="vd-no-spin h-11 min-w-0 flex-1 rounded-[14px] border border-[#cfdaea] bg-white px-4 vd-md text-[var(--vd-ink)] tabular outline-none focus-visible:border-[var(--vd-indigo)] focus-visible:shadow-[0_0_0_3px_rgb(24_57_151/0.18)] rtl:text-right"
              data-testid="wallet-amount"
            />
            <button type="button" disabled={busy} onClick={() => onInput(String(maximum))} className={btn("soft", "md", "h-11")} data-testid="wallet-max">
              {t(C.useMaximum)}
            </button>
          </div>
        </div>
      ) : null}
      {short ? (
        <p role="alert" className="mt-3 vd-sm font-semibold text-[#a61b18]" data-testid="wallet-short">
          {t(C.balanceShort)}
        </p>
      ) : helper ? (
        <p className="mt-3 vd-sm text-[var(--vd-muted)]">{t(C.walletCovers, { max: moneyText(maximum), rest: moneyText(summary.onlineTotal - maximum) })}</p>
      ) : null}
      <p className="mt-3 flex items-center gap-2 border-t border-[var(--vd-line)] pt-3 vd-sm text-[var(--vd-muted)]">
        <CreditCard aria-hidden="true" className="size-4 shrink-0 text-[var(--vd-indigo)]" strokeWidth={2.2} />
        {summary.walletApplied >= summary.onlineTotal && summary.onlineTotal > 0 ? (
          <span className="font-semibold text-[var(--vd-grade-a)]">{t(C.fullyCovered)}</span>
        ) : (
          <span>
            {t(C.remainingMoyasar)} <Money value={summary.gatewayDue} className="font-bold text-[var(--vd-ink)]" />
          </span>
        )}
      </p>
    </div>
  );
}

/** Payment Method: never a choice of its own — a status row mirroring the wallet mode, then the wallet. */
export function PaymentMethodCard({ walletMode, ...wallet }) {
  const { t } = useLang();
  const row = METHOD_ROW[walletMode];
  return (
    <Panel aria-labelledby="checkout-payment-title" data-testid="payment-method">
      <PanelHead id="checkout-payment-title" title={t(C.paymentMethod)} />
      <div className="mt-4 flex items-start gap-3 rounded-[18px] border border-[var(--vd-indigo)] bg-white p-3.5 shadow-[0_0_0_1px_var(--vd-indigo)]">
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[var(--vd-indigo)] text-white">
          <row.icon className="size-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="vd-md font-bold text-[var(--vd-ink)]">{t(row.title)}</p>
          <p className="mt-0.5 vd-sm text-[var(--vd-muted)]">{t(row.text)}</p>
        </div>
        <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-[var(--vd-grade-a)]" strokeWidth={2.6} />
      </div>
      <WalletBox mode={walletMode} {...wallet} />
    </Panel>
  );
}

/** One order's coupon (CheckoutControls OrderCoupon): status, suggested coupons, manual entry. */
function OrderCoupon({ prefix, groupPricing, code, onCode, busy }) {
  const { t } = useLang();
  const inputId = useId();
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const coupons = groupPricing?.available_coupons || [];
  const invalid = Boolean(code) && groupPricing?.discount_code_valid === false;
  let status = null;
  if (code) {
    if (busy) status = t(C.checking);
    else if (invalid) status = <span className="text-[#a61b18]">{t(C.couponInvalid)}</span>;
    else if (groupPricing?.free_shipping) status = t(C.freeDeliveryApplied);
    else status = `${t(C.savings)} ${moneyText(groupPricing?.applied_discounts.find((entry) => entry.code === code)?.amount || 0)}`;
  }
  return (
    <div className="rounded-[18px] border border-[var(--vd-line)] bg-white p-3.5" data-testid="order-coupon">
      <div className="flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2 vd-sm font-bold text-[var(--vd-ink)]">
          <Ticket aria-hidden="true" className="size-4 shrink-0 text-[var(--vd-indigo)]" strokeWidth={2.2} />
          <span className="truncate">
            {prefix ? <bdi>{prefix} · </bdi> : null}
            {t(C.orderCoupon)}
          </span>
        </p>
        {code ? (
          <button type="button" disabled={busy} onClick={() => onCode("")} className="h-9 shrink-0 rounded-full px-2 vd-sm font-bold text-[var(--vd-indigo)] underline underline-offset-2 disabled:opacity-45" data-testid="coupon-remove">
            {t(C.remove)}
          </button>
        ) : null}
      </div>
      {code ? (
        <p role="status" className="mt-1.5 vd-sm text-[var(--vd-ink)]" data-testid="coupon-status">
          <bdi dir="ltr" className="font-bold">
            {code}
          </bdi>
          {" · "}
          {status}
        </p>
      ) : null}
      <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)} className="group mt-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-[14px] bg-[#f6f8fc] px-3 vd-sm font-semibold text-[var(--vd-indigo)] [&::-webkit-details-marker]:hidden" data-testid="coupon-toggle">
          <span>
            {code ? t(C.changeCoupon) : t(C.chooseCoupon)} <span dir="ltr">({coupons.length})</span>
          </span>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform group-open:rotate-180" strokeWidth={2.2} />
        </summary>
        <div className="mt-2">
          {coupons.length ? (
            <ul className="grid grid-cols-1 max-h-[220px] gap-2 overflow-y-auto">
              {coupons.map((coupon) => {
                const applied = code === coupon.code;
                return (
                  <li key={coupon.id}>
                    <button
                      type="button"
                      disabled={busy}
                      title={coupon.description || coupon.name || coupon.code}
                      onClick={() => {
                        onCode(coupon.code);
                        setOpen(false);
                      }}
                      aria-pressed={applied}
                      className={cx("flex w-full items-start gap-3 rounded-[14px] border px-3 py-2.5 text-start transition-colors disabled:opacity-45", applied ? "border-[var(--vd-indigo)] bg-[#eef3fd]" : "border-[var(--vd-line)] bg-white hover:border-[#b6c6df]")}
                      data-testid="coupon-option"
                    >
                      <span className="min-w-0 flex-1">
                        <bdi dir="ltr" className="block vd-sm font-extrabold text-[var(--vd-ink)]">
                          {coupon.code}
                        </bdi>
                        <bdi dir="auto" className="block truncate vd-xs text-[var(--vd-muted)]">
                          {coupon.name}
                        </bdi>
                        <span className="mt-0.5 block vd-xs font-bold text-[var(--vd-grade-a)]">
                          {coupon.discount_type === "free_shipping" ? t(C.freeDelivery) : `${t(C.save)} ${moneyText(coupon.savings)}`}
                        </span>
                        {coupon.min_order_amount > 0 ? (
                          <span className="block vd-xs text-[var(--vd-muted)]">
                            {t(C.minimumOrder)} {moneyText(coupon.min_order_amount)}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 pt-0.5 vd-xs font-bold text-[var(--vd-indigo)]">{applied ? <Check aria-label={t(C.applied)} className="size-4" strokeWidth={2.8} /> : t(C.apply)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="vd-sm text-[var(--vd-muted)]">{t(C.noOffers)}</p>
          )}
          <form
            className="mt-2 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.trim()) return;
              onCode(draft.trim());
            }}
          >
            <label htmlFor={inputId} className="sr-only">
              {t(C.couponCode)}
            </label>
            <input
              id={inputId}
              value={draft}
              maxLength={40}
              disabled={busy}
              onChange={(event) => setDraft(event.target.value.toUpperCase())}
              placeholder={t(C.enterCode)}
              dir="ltr"
              autoComplete="off"
              className="h-11 min-w-0 flex-1 rounded-[14px] border border-[#cfdaea] bg-white px-3.5 vd-md uppercase text-[var(--vd-ink)] outline-none placeholder:normal-case placeholder:text-[#66769c] focus-visible:border-[var(--vd-indigo)] focus-visible:shadow-[0_0_0_3px_rgb(24_57_151/0.18)] rtl:text-right"
              data-testid="coupon-input"
            />
            <button type="submit" disabled={busy || !draft.trim()} className={btn("outline", "md", "h-11")} data-testid="coupon-apply">
              {t(C.apply)}
            </button>
          </form>
        </div>
      </details>
    </div>
  );
}

/** "Checkout could not continue": the message, Try again and the right way back. */
function ErrorPanel({ message, created, onRetry }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <div role="alert" className="mt-4 rounded-[18px] border border-[#f3c9c5] bg-[#fdf6f5] p-4" data-testid="checkout-error">
      <p className="flex items-center gap-2 vd-md font-bold text-[#a61b18]">
        <TriangleAlert aria-hidden="true" className="size-5 shrink-0" strokeWidth={2} />
        {t(C.errorTitle)}
      </p>
      <p className="mt-1 vd-sm text-[var(--vd-ink)]" dir="auto">
        {message || t(created ? C.errorCreated : C.errorKept)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={onRetry} className={btn("indigo", "md")} data-testid="checkout-retry">
          {t(C.tryAgain)}
        </button>
        <Link href={link(created ? "/account?tab=orders" : "/cart")} className={btn("outline", "md")}>
          {t(created ? C.viewOrder : C.reviewCart)}
        </Link>
      </div>
    </div>
  );
}

/** The navy box: what the wallet covers and what Moyasar collects now, with the pricing status lines. */
function PayableBox({ summary, pricingPending, pricingError, invalidSellerPayment }) {
  const { t } = useLang();
  return (
    <div aria-live="polite" className="mt-4 rounded-[20px] bg-[var(--vd-navy)] p-4 text-white" data-testid="payable-box">
      <p className="flex items-baseline justify-between gap-3 vd-sm text-white/80">
        <span>{t(C.fromWallet)}</span>
        <Money value={summary.walletApplied} className="font-bold text-white" />
      </p>
      <p className="mt-1.5 flex items-baseline justify-between gap-3">
        <span className="vd-md font-semibold">{t(C.payWithMoyasar)}</span>
        <Money value={summary.gatewayDue} className="vd-price !text-[26px] text-[var(--vd-gold)]" symbolClassName="text-[0.7em]" />
      </p>
      {pricingPending ? <p className="mt-2 vd-xs text-white/80">{t(C.updatingTotal)}</p> : null}
      {pricingError ? (
        <p role="alert" className="mt-2 rounded-[12px] bg-white px-3 py-2 vd-xs font-semibold text-[#a61b18]" dir="auto">
          {pricingError}
        </p>
      ) : null}
      {invalidSellerPayment ? (
        <p role="alert" className="mt-2 rounded-[12px] bg-white px-3 py-2 vd-xs font-semibold text-[#a61b18]">
          {t(C.codNoLonger)}
        </p>
      ) : null}
    </div>
  );
}

/** Order Summary: savings, coupons, per-order totals (several sellers), the totals and the actions. */
export function SummaryCard({ groups, labels, totals, preview, codes, onCode, summary, method, quoted, busy, pricingPending, pricingError, invalidSellerPayment, payText, payDisabled, onPay, onCancel, cancelling, error, notice }) {
  const { t } = useLang();
  const multi = groups.length > 1;
  const applied = groups.flatMap((group) => (preview?.by_group[group.key]?.applied_discounts || []).map((entry) => ({ ...entry, group })));
  const couponGroups = groups.filter((group) => codes[group.key] || preview?.by_group[group.key]?.available_coupons.length);
  const prefix = (group) => (multi ? `${t(C.order)} ${groups.indexOf(group) + 1} · ${labels[group.key]}` : null);
  return (
    <Panel aria-labelledby="checkout-summary-title" data-testid="summary-card">
      <PanelHead id="checkout-summary-title" title={t(C.summary)} />

      {applied.length ? (
        <section aria-label={t(C.appliedDiscounts)} className="mt-4">
          <p className="vd-xs font-bold uppercase tracking-[0.08em] text-[var(--vd-muted)] rtl:normal-case rtl:tracking-normal">{t(C.yourSavings)}</p>
          <ul className="mt-2 grid grid-cols-1 gap-2">
            {applied.map((entry) => (
              <li key={`${entry.group.key}-${entry.id}`} className="flex items-center gap-3 rounded-[16px] bg-[#e8f7ee] px-3 py-2.5">
                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-[12px] bg-white text-[var(--vd-grade-a)]">
                  <Ticket className="size-4" strokeWidth={2.2} />
                </span>
                <span className="min-w-0 flex-1">
                  <bdi dir="auto" className="block truncate vd-sm font-bold text-[var(--vd-ink)]">
                    {entry.name}
                  </bdi>
                  <span className="block vd-xs text-[var(--vd-muted)]">{multi ? <bdi>{labels[entry.group.key]}</bdi> : entry.automatic ? t(C.appliedAutomatically) : <bdi dir="ltr">{entry.code}</bdi>}</span>
                </span>
                <span className="shrink-0 vd-sm font-extrabold text-[var(--vd-grade-a)]">
                  {entry.free_shipping ? (
                    t(C.freeDelivery)
                  ) : (
                    <span dir="ltr">
                      −<Money value={entry.amount} />
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {couponGroups.length ? (
        <section aria-label={t(C.availableCoupons)} className="mt-4">
          <p className="vd-xs font-bold uppercase tracking-[0.08em] text-[var(--vd-muted)] rtl:normal-case rtl:tracking-normal">{t(C.availableCoupons)}</p>
          <div className="mt-2 grid grid-cols-1 gap-2">
            {couponGroups.map((group) => (
              <OrderCoupon key={group.key} prefix={prefix(group)} groupPricing={preview?.by_group[group.key]} code={codes[group.key] || ""} onCode={(code) => onCode(group.key, code)} busy={busy} />
            ))}
          </div>
        </section>
      ) : null}

      {multi ? (
        <ul className="mt-4 grid grid-cols-1 gap-1.5 border-b border-[var(--vd-line)] pb-3" data-testid="order-list">
          {groups.map((group, i) => (
            <li key={group.key} className="flex items-baseline justify-between gap-3 vd-sm">
              <span className="min-w-0 truncate text-[var(--vd-muted)]">
                <span className="font-bold text-[var(--vd-ink)]">
                  {t(C.order)} {i + 1}
                </span>{" "}
                · <bdi>{labels[group.key]}</bdi>
              </span>
              <Money value={totals[i].deliveryCharge != null ? totals[i].orderTotal : totals[i].products - totals[i].discount} className="shrink-0 font-semibold text-[var(--vd-ink)]" />
            </li>
          ))}
        </ul>
      ) : null}

      <dl className="mt-4 grid grid-cols-1 gap-2.5">
        <SummaryRow label={t(C.products)} amount={summary.products} />
        {summary.discount > 0 ? (
          <SummaryRow
            label={t(C.discount)}
            tone="saving"
            value={
              <span dir="ltr">
                −<Money value={summary.discount} />
              </span>
            }
          />
        ) : null}
        <SummaryRow label={t(C.delivery)} value={method === "pickup" ? <span className="font-bold text-[var(--vd-grade-a)]">{t(C.free)}</span> : quoted ? <Money value={summary.carrierFee} /> : t(C.afterAddress)} />
        {summary.codFee > 0 ? <SummaryRow label={<span className="text-[#7a4e0c]">{t(C.codFeeTotal)}</span>} amount={summary.codFee} /> : null}
        <SummaryRow label={t(C.total)} strong className="mt-1 border-t border-[var(--vd-line)] pt-3" value={<Money value={summary.total} className="vd-price text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />} />
      </dl>

      {summary.dueLater > 0 ? (
        <p className="mt-3 flex items-baseline justify-between gap-3 rounded-[16px] bg-[#fdf4e2] px-4 py-2.5 vd-sm font-semibold text-[#7a4e0c]" data-testid="pay-on-delivery">
          <span>{t(C.payOnDelivery)}</span>
          <Money value={summary.dueLater} className="font-extrabold" />
        </p>
      ) : null}

      <PayableBox summary={summary} pricingPending={pricingPending} pricingError={pricingError} invalidSellerPayment={invalidSellerPayment} />

      {notice ? (
        <Notice tone="info" role="status" className="mt-4" icon={ShieldCheck}>
          {notice}
        </Notice>
      ) : null}
      {error}

      <div className="mt-4 grid grid-cols-1 gap-2.5 max-lg:hidden">
        <button type="button" onClick={onPay} disabled={payDisabled} className={btn("indigo", "lg", "h-14 w-full whitespace-normal text-center vd-lg disabled:!bg-[#8b97b5] disabled:!opacity-100")} data-testid="pay-button">
          <Lock aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.4} />
          {busy ? t(C.processingDesktop) : payText}
        </button>
        <button type="button" onClick={onCancel} disabled={busy || cancelling} className={btn("outline", "lg", "w-full !border-[#d6453d] !text-[#b3261e] hover:!bg-[#fdf1f0]")} data-testid="cancel-checkout">
          <X aria-hidden="true" className="size-4" strokeWidth={2.4} />
          {cancelling ? t(C.cancellingCheckout) : t(C.cancelCheckout)}
        </button>
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center vd-xs text-[var(--vd-muted)]">
        <Lock aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.2} />
        {t(C.secureFooter)}
      </p>
    </Panel>
  );
}

export { ErrorPanel };

/** Phones and tablets: production's fixed pay bar — what is due now, Cancel and Pay. */
export function PhoneBar({ summary, payText, payDisabled, onPay, onCancel, busy, cancelling }) {
  const { t } = useLang();
  const barRef = useToastClearance();
  return (
    <div ref={barRef} className="vd-print-hide fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-30 [--focus:var(--vd-gold)] lg:hidden" data-testid="checkout-bar">
      <div className="mx-auto max-w-[640px] rounded-[24px] bg-[var(--vd-navy)] p-2.5 ps-4 text-white shadow-[0_12px_30px_-12px_rgb(6_33_63/0.6)]">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <span className="block vd-xs text-white/75">{t(C.dueNow)}</span>
            {/* Production shows the online total here (before the wallet share). */}
            <Money value={summary.onlineTotal} className="block truncate vd-lg font-extrabold" symbolClassName="text-[0.75em]" />
          </div>
          <button type="button" onClick={onCancel} disabled={busy || cancelling} aria-label={t(C.cancelAria)} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-white/35 px-3.5 vd-sm font-semibold text-white hover:bg-white/10 disabled:opacity-45" data-testid="bar-cancel">
            <X aria-hidden="true" className="size-4" strokeWidth={2.4} />
            <span className="max-[359px]:hidden">{t(C.cancel)}</span>
          </button>
        </div>
        <button type="button" onClick={onPay} disabled={payDisabled || cancelling} className={btn("gold", "lg", "mt-2.5 h-12 w-full whitespace-normal text-center leading-tight disabled:!bg-white/25 disabled:!text-white/75 disabled:!opacity-100")} data-testid="bar-pay">
          {busy ? t(C.processingMobile) : payText}
        </button>
      </div>
    </div>
  );
}
