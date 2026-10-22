"use client";

// The checkout screens other than the form, in production's order: loading,
// "Complete your payment" (a reserved, deferred payment), the empty
// checkout, the placeholder "Order Created" screen; plus the sign-in step
// and the processing overlay.
import Link from "next/link";
import { useEffect, useState } from "react";
import { CircleCheck, Clock3, Download, LoaderCircle, Lock, ShoppingBag, UserRound } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CHECKOUT_COPY as C } from "@/components/shared/commerce/checkoutCopy";
import { Modal } from "@/components/shared/ui/Modal";
import { Money } from "@/components/shared/ui/Money";
import { EmptyState, IconDisk, Panel, Placeholder, Spinner } from "../kit/Blocks";
import { Arrow, btn, cx } from "../ui";

/** Production's skeleton: one block for an empty cart, the two-column form otherwise. */
export function CheckoutSkeleton({ wide = true }) {
  const { t } = useLang();
  return (
    <section aria-busy="true" aria-label={t(C.loading)} className="vd-container pb-16 pt-6 dt:pt-8" data-testid="checkout-loading">
      <Spinner label={t(C.loading)} />
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_360px] dt:grid-cols-[minmax(0,1fr)_400px]">
        <Panel>
          <Placeholder className="h-6 w-48" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Placeholder className="h-20 !rounded-[20px]" />
            <Placeholder className="h-20 !rounded-[20px]" />
          </div>
          <Placeholder className="mt-6 h-6 w-56" />
          <div className="mt-4 grid grid-cols-1 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid grid-cols-[64px_minmax(0,1fr)] gap-4">
                <Placeholder className="aspect-square !rounded-[14px]" />
                <div className="grid grid-cols-1 content-start gap-2.5">
                  <Placeholder className="h-4 w-3/4" />
                  <Placeholder className="h-9 w-40" />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        {wide ? (
          <Panel>
            <Placeholder className="h-6 w-40" />
            <Placeholder className="mt-5 h-28 w-full !rounded-[20px]" />
            <Placeholder className="mt-5 h-14 w-full" />
          </Panel>
        ) : null}
      </div>
    </section>
  );
}

/** "No items to checkout": back to Browse, or to the orders already placed. */
export function EmptyCheckout() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <div className="vd-container pb-16 pt-6 dt:pb-20 dt:pt-8">
      <EmptyState
        icon={ShoppingBag}
        headingLevel={1}
        title={t(C.emptyTitle)}
        text={t(C.emptyText)}
        actions={
          <>
            <Link href={link("/browse")} className={btn("indigo", "lg")}>
              {t(C.browseNow)}
              <Arrow />
            </Link>
            <Link href={link("/account?tab=orders")} className={btn("outline", "lg")}>
              {t(C.viewOrders)}
            </Link>
          </>
        }
      />
    </div>
  );
}

/** Signed out: checkout is for signed-in buyers (production sends them to /login?next=/cart). */
export function SignInStep({ href, redirecting }) {
  const { t } = useLang();
  return (
    <div className="vd-container pb-16 pt-6 dt:pb-20 dt:pt-8" data-testid="checkout-signin">
      <Panel className="mx-auto max-w-xl text-center">
        <IconDisk icon={UserRound} className="mx-auto !size-14" />
        <h1 className="mt-4 vd-h3 !text-[24px] !leading-8">{t(C.signInTitle)}</h1>
        <p className="mx-auto mt-2 max-w-md vd-md text-[var(--vd-muted)]">{t(C.signInText)}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={href} className={btn("indigo", "lg")} data-testid="checkout-signin-link">
            {t(C.signIn)}
            <Arrow />
          </Link>
        </div>
        {redirecting ? <Spinner label={t(C.loading)} className="mt-4" /> : null}
      </Panel>
    </div>
  );
}

/**
 * "Complete your payment": the reserved lines, the wallet portion, what
 * Moyasar still collects and what is paid on delivery, with Resume payment,
 * Edit checkout and Cancel checkout. With an error and no session, only
 * production's text, the error and Retry.
 */
export function PendingPayment({ session, error, busy, cancelling, redirecting, onResume, onEdit, onCancel, onRetry }) {
  const { t } = useLang();
  return (
    <div className="vd-container pb-16 pt-6 dt:pb-20 dt:pt-8" data-testid="pending-payment">
      <Panel className="mx-auto max-w-xl">
        <IconDisk icon={Clock3} tone="gold" className="!size-12" />
        <h1 className="mt-4 vd-title-page text-[var(--vd-ink)]">{t(C.completeTitle)}</h1>
        <p className="mt-2 vd-md text-[var(--vd-muted)]">{t(C.completeText)}</p>
        {redirecting ? (
          <p role="status" className="mt-4 flex items-center gap-2 rounded-[16px] bg-[#eef3fd] px-4 py-3 vd-md font-semibold text-[var(--vd-indigo)]" data-testid="redirecting">
            <LoaderCircle aria-hidden="true" className="size-5 shrink-0 animate-spin motion-reduce:animate-none" strokeWidth={2.2} />
            {t(C.redirecting)}
          </p>
        ) : null}
        {session ? (
          <>
            <h2 className="sr-only">{t(C.reservedItems)}</h2>
            <ul className="mt-5 divide-y divide-[var(--vd-line)] rounded-[18px] border border-[var(--vd-line)] px-4">
              {session.items.map((item) => (
                <li key={item.key} className="flex items-baseline justify-between gap-3 py-2.5 vd-sm">
                  <span className="min-w-0 text-[var(--vd-ink)]">
                    <bdi>{item.title}</bdi> <span dir="ltr">× {item.quantity}</span>
                  </span>
                  <Money value={item.total} className="shrink-0 font-bold text-[var(--vd-ink)]" />
                </li>
              ))}
            </ul>
            <dl className="mt-4 grid grid-cols-1 gap-2 rounded-[18px] bg-[#eef3fd] p-4">
              {session.wallet_reserved > 0 ? (
                <div className="flex items-baseline justify-between gap-3 vd-md">
                  <dt className="text-[var(--vd-muted)]">{t(C.walletPortion)}</dt>
                  <dd className="font-bold text-[var(--vd-ink)]">
                    <Money value={session.wallet_reserved} />
                  </dd>
                </div>
              ) : null}
              <div className="flex items-baseline justify-between gap-3 vd-lg">
                <dt className="font-bold text-[var(--vd-ink)]">{t(C.remainingMoyasar)}</dt>
                <dd className="font-extrabold text-[var(--vd-indigo)]">
                  <Money value={session.amount_due_now} />
                </dd>
              </div>
              {session.amount_due_later > 0 ? (
                <div className="flex items-baseline justify-between gap-3 vd-md">
                  <dt className="text-[#7a4e0c]">{t(C.payOnDelivery)}</dt>
                  <dd className="font-bold text-[#7a4e0c]">
                    <Money value={session.amount_due_later} />
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button type="button" onClick={onResume} disabled={busy || cancelling} className={btn("indigo", "lg", "sm:col-span-2")} data-testid="resume-payment">
                <Lock aria-hidden="true" className="size-4" strokeWidth={2.4} />
                {t(C.resume)}
              </button>
              <button type="button" onClick={onEdit} disabled={busy || cancelling} className={btn("outline", "lg")} data-testid="edit-checkout">
                {t(C.editCheckout)}
              </button>
              <button type="button" onClick={onCancel} disabled={busy || cancelling} className={btn("outline", "lg", "!border-[#d6453d] !text-[#b3261e] hover:!bg-[#fdf1f0]")} data-testid="pending-cancel">
                {cancelling ? t(C.cancellingShort) : t(C.cancelCheckout)}
              </button>
            </div>
          </>
        ) : null}
        {error ? (
          <div role="alert" className="mt-5 flex flex-wrap items-center gap-3 rounded-[16px] bg-[#fdecea] px-4 py-3" data-testid="pending-error">
            <p className="min-w-0 flex-1 basis-48 vd-sm font-semibold text-[#a61b18]" dir="auto">
              {error}
            </p>
            {session ? null : (
              <button type="button" onClick={onRetry} className={btn("outline", "md")} data-testid="pending-retry">
                {t(C.retry)}
              </button>
            )}
          </div>
        ) : null}
      </Panel>
    </div>
  );
}

/**
 * Production's placeholder "Order Created" screen, kept as it is: raw
 * values, a fixed timeline, a Download Invoice button that does nothing and
 * Track Order to /orders/1 (no such page). Listed for the owner to replace.
 */
export function CreatedOrder({ order, paymentStatus }) {
  const { t } = useLang();
  const { link } = useConcept();
  const facts = [
    { label: t(C.orderNumber), value: <bdi dir="ltr">{order.order_number}</bdi> },
    { label: t(C.backendTotal), value: <Money value={order.total_amount} /> },
    { label: t(C.paymentStatus), value: <bdi dir="ltr">{paymentStatus || order.payment_status}</bdi> },
    { label: t(C.invoice), value: t(C.pending) },
  ];
  return (
    <div data-testid="order-created">
      <section className="bg-[var(--vd-navy)] text-white">
        <div className="vd-container py-10 dt:py-14">
          <p className="flex items-center gap-2 vd-kicker text-[#7fe0a5]">
            <CircleCheck aria-hidden="true" className="size-5" strokeWidth={2.2} />
            {t(C.createdEyebrow)}
          </p>
          <h1 className="mt-3 vd-page-title text-white">{t(C.createdTitle)}</h1>
          <p className="mt-3 max-w-2xl vd-lg text-white/85">{t(C.createdText)}</p>
          <dl className="mt-6 grid grid-cols-1 gap-3 rounded-[20px] border border-white/15 bg-white/[0.07] p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
            {facts.map((fact) => (
              <div key={fact.label} className="min-w-0">
                <dt className="vd-xs text-white/70">{fact.label}</dt>
                <dd className="mt-0.5 truncate vd-lg font-bold text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={link("/account")} className={btn("gold", "lg")}>
              {t(C.viewAccountOrders)} <span aria-hidden="true">→</span>
            </Link>
            <Link href={link("/")} className={btn("white", "lg")}>
              {t(C.continueShopping)}
            </Link>
          </div>
        </div>
      </section>
      <section aria-labelledby="timeline-title" className="vd-container py-10 dt:py-14">
        <h2 id="timeline-title" className="vd-h2 text-[var(--vd-ink)]">
          {t(C.timeline)}
        </h2>
        <ol className="mt-5 grid gap-3 md:grid-cols-4">
          {C.timelineSteps.map(([title, text], i) => (
            <li key={title.en} className={cx("rounded-[20px] border p-4", i === 0 ? "border-[var(--vd-indigo)] bg-[#eef3fd]" : "border-[var(--vd-line)] bg-white")}>
              <span aria-hidden="true" className={cx("grid size-8 place-items-center rounded-full vd-sm font-bold", i === 0 ? "bg-[var(--vd-indigo)] text-white" : "bg-[var(--vd-bluegray)] text-[var(--vd-muted)]")}>
                {i + 1}
              </span>
              <p className={cx("mt-3 vd-md font-bold", i === 0 ? "text-[var(--vd-ink)]" : "text-[var(--vd-muted)]")}>{t(title)}</p>
              <p className="mt-0.5 vd-sm text-[var(--vd-muted)]">{t(text)}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          {/* No handler in production. */}
          <button type="button" className={btn("outline", "lg")} data-testid="download-invoice">
            <Download aria-hidden="true" className="size-4" strokeWidth={2.2} />
            {t(C.downloadInvoice)}
          </button>
          <Link href={link("/orders/1")} className={btn("soft", "lg")} data-testid="track-order">
            {t(C.trackOrder)} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProcessingSteps({ onHide }) {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setStep((value) => Math.min(value + 1, C.steps.length - 1)), 1800);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div data-testid="processing-overlay">
      <IconDisk icon={Clock3} className="!size-12" />
      <h2 id="processing-title" className="mt-4 vd-h3">
        {t(C.processingTitle)}
      </h2>
      <p id="processing-text" className="mt-1 vd-md text-[var(--vd-muted)]">
        {t(C.processingText)}
      </p>
      <ol className="mt-5 grid grid-cols-1 gap-2.5" aria-live="polite">
        {C.steps.map((label, i) => (
          <li key={label.en} aria-current={i === step ? "step" : undefined} className={cx("flex items-center gap-3 vd-md", i <= step ? "font-semibold text-[var(--vd-ink)]" : "text-[var(--vd-muted)]")}>
            <span aria-hidden="true" className={cx("grid size-7 shrink-0 place-items-center rounded-full", i < step ? "bg-[var(--vd-grade-a)] text-white" : i === step ? "bg-[var(--vd-indigo)] text-white" : "bg-[var(--vd-bluegray)]")}>
              {i < step ? <CircleCheck className="size-4" strokeWidth={2.4} /> : i === step ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" strokeWidth={2.4} /> : null}
            </span>
            {t(label)}
          </li>
        ))}
      </ol>
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={onHide} className="h-10 rounded-full px-4 vd-md font-semibold text-[var(--vd-indigo)] hover:bg-[var(--vd-bluegray)]" data-autofocus>
          {t(C.cancel)}
        </button>
      </div>
    </div>
  );
}

/**
 * "Processing Payment": production's four steps advance on a 1.8 s timer
 * (not real progress) and the last one keeps pulsing; Cancel only hides the
 * overlay — the request carries on.
 */
export function ProcessingOverlay({ open, onHide }) {
  return (
    <Modal open={open} onClose={onHide} labelledBy="processing-title" describedBy="processing-text" panelClassName="md:!max-w-md rounded-t-[24px] bg-white p-6 text-[var(--vd-ink)] shadow-overlay md:rounded-[24px]">
      <ProcessingSteps onHide={onHide} />
    </Modal>
  );
}
