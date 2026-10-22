"use client";

// Option 3 — Card payment (production /payment/moyasar/[id]), in the quiet
// shell production gives its payment pages. Production loads the payment
// record by its id (never the amount from the URL), shows its number and
// amount, and mounts Moyasar's hosted card form in one element: this
// preview draws that element as a labelled container and never imitates
// the card fields. States as production: loading the record, the record
// failing to load, the provider script failing; the way back is "Return to
// checkout" ("View payment result" once paid), and the note on card data.
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, LoaderCircle, Lock, ShieldCheck, TriangleAlert } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { PAYMENT_COPY as C, PAYMENT_SERVER_ERRORS } from "@/components/shared/commerce/paymentCopy";
import { StateRoute } from "@/components/shared/preview/StateRoute";
import { SAMPLE_PAYMENT } from "@/data/checkoutSamples";
import { lastSession } from "@/lib/checkout";
import { RIYAL } from "@/lib/format";
import { AuthShell } from "../kit/AuthShell";
import { Tile } from "../kit/Blocks";
import { useSession } from "../kit/session";
import { Arrow, btn, cx } from "../ui";

const NETWORKS = { mada: "mada", visa: "Visa", mastercard: "Mastercard" };
const two = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** formatSAR with two decimals, as production shows the amount here. */
function Amount({ value }) {
  const { lang } = useLang();
  return (
    <span dir="ltr" className="inline-flex items-baseline gap-[0.2em] whitespace-nowrap tabular">
      <span className="sr-only">{lang === "ar" ? `${two.format(value)} ريال سعودي` : `${two.format(value)} Saudi riyals`}</span>
      <span aria-hidden="true" className="text-[0.7em]">
        {RIYAL}
      </span>
      <span aria-hidden="true">{two.format(value)}</span>
    </span>
  );
}

/** Where Moyasar's form mounts (#khaznah-moyasar-form), with the preview's stand-in controls. */
function CardFormMount({ payment, ready }) {
  const { t } = useLang();
  const { link } = useConcept();
  const result = `/payment/result?payment_record_id=${payment?.id ?? SAMPLE_PAYMENT.id}`;
  return (
    <section aria-labelledby="card-form-title" className="mt-5">
      <h2 id="card-form-title" className="vd-md font-bold text-[var(--vd-ink)]">
        {t(C.cardForm)}
      </h2>
      <div id="khaznah-moyasar-form" className="mt-2 rounded-[20px] border-2 border-dashed border-[#c3cfe3] bg-[#f6f8fc] p-4 sm:p-5" data-testid="card-form-mount">
        {ready ? (
          <>
            <p className="flex items-start gap-2.5 vd-sm text-[var(--vd-ink)]">
              <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--vd-indigo)]" strokeWidth={2.2} />
              {t(C.cardFormNote)}
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-2 vd-xs text-[var(--vd-muted)]">
              {t(C.networks)}:
              {SAMPLE_PAYMENT.supported_networks.map((key) => (
                <span key={key} className="inline-flex h-7 items-center rounded-full border border-[var(--vd-line)] bg-white px-3 font-bold text-[var(--vd-ink)]" dir="ltr">
                  {NETWORKS[key]}
                </span>
              ))}
            </p>
            <div className="mt-4 rounded-[16px] border border-[#e3c98a] bg-white p-3.5" data-testid="preview-controls">
              <p className="flex flex-wrap items-center gap-2 vd-xs text-[var(--vd-muted)]">
                <span className="inline-flex h-6 items-center rounded-full bg-[#fdf1d8] px-2.5 font-bold text-[#7a4e0c]">{t(C.previewOnly)}</span>
                {t(C.previewNote)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={link(`${result}&id=pay_preview_paid`)} className={btn("indigo", "md")} data-testid="simulate-paid">
                  {t(C.simulatePaid)}
                </Link>
                <Link href={link(`${result}&id=pay_preview_declined&state=failed`)} className={btn("outline", "md")} data-testid="simulate-declined">
                  {t(C.simulateDeclined)}
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div aria-hidden="true" className="h-24" />
        )}
      </div>
    </section>
  );
}

function MoyasarView({ id, state }) {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const { ready, signedIn } = useSession();
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const signedOut = ready && !signedIn;

  // GET payments/payment-records/{id}/status/ — the record checkout reserved
  // in this tab, else the sample record.
  const loadRecord = useEffectEvent(() => {
    if (signedOut) {
      // Production: the session refresh fails, the error shows for a moment, then sign in.
      setError(t(C.sessionExpired));
      return;
    }
    if (state === "error") {
      setError(PAYMENT_SERVER_ERRORS.notFound);
      return;
    }
    const session = lastSession();
    setPayment({ ...SAMPLE_PAYMENT, id: Number(id), amount: session?.payment_record_id === Number(id) ? session.amount_due_now : SAMPLE_PAYMENT.amount });
    if (state === "provider-error") setError(t(C.scriptFailed));
  });
  useEffect(() => {
    if (state === "loading") return undefined;
    const timer = window.setTimeout(loadRecord, 700);
    return () => window.clearTimeout(timer);
  }, [state, signedOut]);

  useEffect(() => {
    if (!signedOut) return undefined;
    const timer = window.setTimeout(() => router.replace(link(`/login?next=${encodeURIComponent(`/payment/moyasar/${id}`)}&expired=1`)), 1600);
    return () => window.clearTimeout(timer);
  }, [signedOut, router, link, id]);

  const loading = !payment && !error;
  const paid = payment?.status === "paid";
  return (
    <div className="mx-auto max-w-[640px]" data-testid="moyasar-page">
      <div className="overflow-hidden rounded-[28px] border border-[var(--vd-line)] bg-white shadow-[0_1px_2px_rgb(7_27_82/0.04),0_24px_48px_-28px_rgb(7_27_82/0.35)]">
        <div className="flex items-center gap-4 bg-[var(--vd-navy)] px-6 py-6 text-white sm:px-8">
          <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-[var(--vd-gold)] text-[var(--vd-ink)]">
            <CreditCard className="size-6" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="vd-kicker text-[var(--vd-gold)]">{t(C.eyebrow)}</p>
            <h1 className="mt-1 vd-h2 !text-[28px] !leading-9 text-white">{t(C.title)}</h1>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          {payment ? (
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2" data-testid="payment-summary">
              <Tile className="!px-4 !py-3">
                <dt className="vd-xs font-semibold text-[var(--vd-muted)]">{t(C.payment)}</dt>
                <dd className="mt-0.5 break-all vd-md font-bold text-[var(--vd-ink)]" dir="ltr">
                  {payment.payment_number}
                </dd>
              </Tile>
              <Tile className="!px-4 !py-3">
                <dt className="vd-xs font-semibold text-[var(--vd-muted)]">{t(C.amount)}</dt>
                <dd className="mt-0.5 vd-price !text-[24px] text-[var(--vd-ink)]">
                  <Amount value={payment.amount} />
                </dd>
              </Tile>
            </dl>
          ) : null}
          {error ? (
            <p role="alert" className={cx("flex items-start gap-2.5 rounded-[16px] bg-[#fdecea] px-4 py-3 vd-sm font-semibold text-[#a61b18]", payment && "mt-4")} data-testid="payment-error">
              <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2.2} />
              <span dir="auto">{error}</span>
            </p>
          ) : null}
          {loading ? (
            <p role="status" className="flex items-center gap-2.5 vd-md text-[var(--vd-muted)]" data-testid="payment-loading">
              <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-[var(--vd-indigo)] motion-reduce:animate-none" strokeWidth={2.2} />
              {t(C.loading)}
            </p>
          ) : null}
          <CardFormMount payment={payment} ready={Boolean(payment) && !error} />
          <div className="mt-5">
            {paid ? (
              <Link href={link(`/payment/result?payment_record_id=${id}`)} className={btn("outline", "lg")}>
                {t(C.viewResult)}
                <Arrow />
              </Link>
            ) : (
              <Link href={link("/checkout")} className={btn("outline", "lg")} data-testid="return-to-checkout">
                <Arrow className="size-4 rotate-180" />
                {t(C.returnToCheckout)}
              </Link>
            )}
          </div>
          <p className="mt-5 flex items-start gap-2.5 border-t border-[var(--vd-line)] pt-5 vd-sm text-[var(--vd-muted)]">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--vd-grade-a)]" strokeWidth={2.2} />
            {t(C.securityNote)}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Option 3 — Card payment (production /payment/moyasar/[id]). */
export function VisualDiscoveryMoyasar({ id }) {
  return (
    <AuthShell variant="payment">
      <StateRoute fallback={null}>{(params, state) => <MoyasarView key={state} id={id} state={state} />}</StateRoute>
    </AuthShell>
  );
}
