"use client";

// Option 3 — Payment result (production /payment/result), in the quiet
// payment shell. Production verifies the payment record named in the return
// URL (payment_record_id; the gateway's id or payment_id), treats the record
// as the truth, and: paid → "Payment completed" and straight on to where the
// payment belongs; failed, cancelled or expired → "Payment was not
// completed" with a way back; anything else → "Payment is being verified".
// The button row shows in every state (Wallet for buyers). Destination
// order (spec 2.6): return_to, credited to the wallet, back to checkout
// while unpaid, the order group, the order, the orders tab.
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, CircleX, Clock3, LoaderCircle, Wallet } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { PAYMENT_COPY as C, PAYMENT_SERVER_ERRORS } from "@/components/shared/commerce/paymentCopy";
import { StateRoute } from "@/components/shared/preview/StateRoute";
import { SAMPLE_PAYMENT, SAMPLE_SESSION } from "@/data/checkoutSamples";
import { lastSession, rememberSession } from "@/lib/checkout";
import { AuthShell } from "../kit/AuthShell";
import { useSession } from "../kit/session";
import { btn, cx } from "../ui";

const NOT_COMPLETED = new Set(["failed", "cancelled", "expired"]);
// What each preview state's verification ends with.
const STATE_STATUS = { paid: "paid", pending: "initiated", failed: "failed" };

/** Production's resolvedHref (payment/result/page.js 83-95). */
function destination(payment, buyer) {
  const extra = payment?.extra_data || {};
  const returnTo = typeof extra.return_to === "string" && extra.return_to.startsWith("/") && !/^\/[/\\]/.test(extra.return_to) ? extra.return_to : "";
  if (returnTo) return returnTo;
  if (extra.checkout_credited) return "/account?tab=wallet";
  if (extra.checkout_reference && payment.status !== "paid") return "/checkout";
  if (buyer && extra.order_group_reference) return `/account?tab=orders&group=${encodeURIComponent(extra.order_group_reference)}`;
  const orderId = typeof payment?.order === "object" && payment.order ? payment.order.id : typeof payment?.order === "number" ? payment.order : null;
  if (buyer && orderId) return `/account?tab=orders&order=${orderId}`;
  return buyer ? "/account?tab=orders" : "/dashboard/orders";
}

// First-strong isolation for the record number and status inside the sentence.
const isolate = (text) => `\u2068${text}\u2069`;

/** Production's button label rule (page.js:109). */
function primaryLabel(payment) {
  if (payment?.extra_data?.checkout_reference && payment.status !== "paid") return C.returnToCheckout;
  if (NOT_COMPLETED.has(payment?.status)) return C.backToOrder;
  return C.viewOrders;
}

function ResultView({ params, state }) {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const { replaceCart } = useStore();
  const { ready, signedIn } = useSession();
  const recordId = params.get("payment_record_id");
  const gatewayId = params.get("id") || params.get("payment_id");
  const live = state === "default";
  const signedOut = state === "signed-out" || (ready && !signedIn);
  const buyer = !signedOut;
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Verification: one POST with the gateway id, or up to 8 status checks
  // 1.5 s apart while the record is initiated or pending; the preview
  // settles after a short wait with the state's outcome.
  const settle = useEffectEvent(() => {
    if (state === "error") {
      setError(PAYMENT_SERVER_ERRORS.verification);
      setDone(true);
      return;
    }
    const session = lastSession();
    const status = STATE_STATUS[state] || (live ? "paid" : "initiated");
    const sameRecord = session?.payment_record_id === Number(recordId);
    setPayment({
      ...SAMPLE_PAYMENT,
      id: Number(recordId),
      amount: sameRecord ? session.amount_due_now : SAMPLE_PAYMENT.amount,
      status,
      order: sameRecord ? session.order_id : null,
      extra_data: {
        checkout_reference: SAMPLE_SESSION.reference,
        order_group_reference: status === "paid" ? (sameRecord ? session.order_group_reference : SAMPLE_SESSION.group_reference) : "",
      },
    });
    setDone(true);
  });
  useEffect(() => {
    if (!ready || signedOut || !recordId || state === "verifying") return undefined;
    const timer = window.setTimeout(settle, live ? 2200 : 600);
    return () => window.clearTimeout(timer);
  }, [ready, signedOut, recordId, state, live]);

  // Paid: on to the destination with router.replace (no history entry) — in
  // the live flow; the preview state shows the moment and waits.
  const paid = payment?.status === "paid";
  const href = destination(payment, buyer);
  const finishPaid = useEffectEvent(() => {
    // The checkout's lines are now orders: the cart empties and the reservation ends.
    replaceCart([]);
    rememberSession(null);
    router.replace(link(href));
  });
  useEffect(() => {
    if (!paid || !live) return undefined;
    const timer = window.setTimeout(finishPaid, 2600);
    return () => window.clearTimeout(timer);
  }, [paid, live]);

  const missing = ready && !recordId && !signedOut ? t(C.missingReference) : "";
  const shownError = error || missing || (signedOut ? t(C.signedOut) : "");
  const verifying = !shownError && (!ready || !done);
  const status = payment?.status || "pending";

  let icon = Clock3;
  let tone = "bg-[#fdf1d8] text-[#7a4e0c]";
  let title = t(C.beingVerified);
  if (shownError) {
    icon = CircleX;
    tone = "bg-[#fde3e1] text-[#a61b18]";
    title = t(C.failedVerification);
  } else if (paid) {
    icon = CircleCheck;
    tone = "bg-[#ddf4e6] text-[var(--vd-grade-a)]";
    title = t(C.paid);
  } else if (NOT_COMPLETED.has(status)) {
    icon = CircleX;
    tone = "bg-[#fde3e1] text-[#a61b18]";
    title = t(C.notCompleted);
  }
  const Icon = icon;

  return (
    <div className="mx-auto max-w-[560px]" data-testid="payment-result" data-status={shownError ? "error" : verifying ? "verifying" : status}>
      <div className="rounded-[28px] border border-[var(--vd-line)] bg-white p-6 text-center shadow-[0_1px_2px_rgb(7_27_82/0.04),0_24px_48px_-28px_rgb(7_27_82/0.35)] sm:p-10">
        {verifying ? (
          <div role="status">
            <span aria-hidden="true" className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)]">
              <LoaderCircle className="size-8 animate-spin motion-reduce:animate-none" strokeWidth={2} />
            </span>
            <h1 className="mt-5 vd-h3 !text-[24px] !leading-8 text-[var(--vd-ink)]">{t(C.verifying)}</h1>
          </div>
        ) : (
          <div role={shownError || NOT_COMPLETED.has(status) ? "alert" : "status"}>
            <span aria-hidden="true" className={cx("mx-auto grid size-16 place-items-center rounded-full", tone)}>
              <Icon className="size-8" strokeWidth={2} />
            </span>
            <h1 className="mt-5 vd-h3 !text-[24px] !leading-8 text-[var(--vd-ink)]">{title}</h1>
            {shownError ? (
              <p className="mt-2 vd-md font-semibold text-[#a61b18]" dir="auto">
                {shownError}
              </p>
            ) : (
              <p className="mt-2 vd-md text-[var(--vd-muted)]">
                {t(C.body, { number: isolate(payment?.payment_number || ""), status: isolate(status) })}
              </p>
            )}
            {paid ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#eef3fd] px-4 py-2 vd-sm font-semibold text-[var(--vd-indigo)]" data-testid="result-redirecting">
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" strokeWidth={2.4} />
                {t(C.redirecting)}
              </p>
            ) : null}
          </div>
        )}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href={link(href)} className={btn("indigo", "lg")} data-testid="result-primary">
            {t(primaryLabel(payment))}
          </Link>
          {buyer ? (
            <Link href={link("/account?tab=wallet")} className={btn("outline", "lg")} data-testid="result-wallet">
              <Wallet aria-hidden="true" className="size-4" strokeWidth={2.2} />
              {t(C.wallet)}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Option 3 — Payment result (production /payment/result). */
export function VisualDiscoveryPaymentResult() {
  return (
    <AuthShell variant="payment">
      <StateRoute fallback={<div className="mx-auto min-h-[340px] max-w-[560px]" />}>{(params, state) => <ResultView key={state} params={params} state={state} />}</StateRoute>
    </AuthShell>
  );
}

