"use client";

// Option 3 — Checkout (production /checkout), the approved masthead over a
// compact heading. Production's behaviour, simulated in the browser:
// signed-in buyers only (others go to sign in, returning to the cart); a
// reserved deferred payment takes over the page ("Complete your payment");
// one order per seller; home delivery priced by a quote per address (the
// first at once, later ones 350 ms after a change) or free warehouse pickup
// for Khazna's own lots; a pricing preview 250 ms after any change with
// per-order coupons; the wallet (Moyasar only, Wallet + Moyasar, Wallet
// only) and cash on delivery where a warehouse offers it. Pay stays disabled
// until the latest quote matches the address and quantities and the pricing
// preview is current (inventory B.10, spec Part B). Pay runs production's
// pipeline — processing steps, then the payment page for what remains, the
// orders page when the wallet or cash on delivery covers everything.
import Link from "next/link";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { CHECKOUT_COPY as C, SERVER_ERRORS } from "@/components/shared/commerce/checkoutCopy";
import { arNew } from "@/components/shared/commerce/flags";
import { StateRoute } from "@/components/shared/preview/StateRoute";
import { CHECKOUT_CARTS, SAMPLE_ADDRESSES, SAMPLE_CREATED_ORDER, SAMPLE_PICKUP_LOCATIONS, SAMPLE_SESSION, SAMPLE_WALLET } from "@/data/checkoutSamples";
import { cartLines } from "@/lib/cart";
import { PLATFORM, cartSignature, checkoutSummary, deliveryQuote, groupTotals, isPickupEligible, payLabel, pricingPreview, rememberSession, sellerGroups } from "@/lib/checkout";
import { moneyText } from "@/lib/format";
import { Notice, PageHeader } from "../kit/Blocks";
import { Dialog } from "../kit/Overlay";
import { VDPage } from "../kit/Page";
import { useSession } from "../kit/session";
import { Arrow, btn } from "../ui";
import { AddressDialog, DeliveryPanel, draftFrom } from "./Delivery";
import { OrdersPanel } from "./Orders";
import { ErrorPanel, PaymentMethodCard, PhoneBar, SummaryCard } from "./Payment";
import { CheckoutSkeleton, CreatedOrder, EmptyCheckout, PendingPayment, ProcessingOverlay, SignInStep } from "./Screens";

// Production's platform order label ("Khaznah", an English brand literal).
const KHAZNAH = arNew("Khaznah", "خزنة");
// The probe's failure as production words it (api.js fallback, English only).
const PROBE_ERROR = "We could not complete that request.";
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

/** The sample cart a preview state loads (null: keep the buyer's own). */
function seedFor(state, cart) {
  if (state === "empty") return [];
  if (state === "pickup") return CHECKOUT_CARTS.pickup;
  if (state === "default") return cart.length ? null : CHECKOUT_CARTS.delivery;
  return CHECKOUT_CARTS.delivery;
}

/** A saved address as the API returns it, in the language the buyer typed it. */
const resolveAddress = (address, t) => ({
  ...address,
  label: t(address.label),
  recipient_name: t(address.recipient_name),
  city: t(address.city),
  district: t(address.district),
  region: t(address.region),
  address_line: t(address.address_line),
});

/**
 * The reserved session the payment step reads: lines, wallet share, what
 * Moyasar collects, what is due on delivery, and where the paid result
 * sends the buyer (the order group of a multi-seller checkout, else the order).
 */
function sessionFrom({ lines, groups, summary, t }) {
  return {
    reference: SAMPLE_SESSION.reference,
    payment_record_id: SAMPLE_SESSION.payment_record_id,
    order_group_reference: groups.length > 1 ? SAMPLE_SESSION.group_reference : "",
    order_id: groups.length > 1 ? null : SAMPLE_SESSION.order_id,
    items: lines.map((line) => ({ key: line.slug, title: t(line.product.title), quantity: line.quantity, total: line.unitPrice * line.quantity })),
    wallet_reserved: summary.walletApplied,
    amount_due_now: summary.gatewayDue,
    amount_due_later: summary.dueLater,
    total: summary.total,
  };
}

function CheckoutHeading() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <PageHeader
      crumbs={[{ label: t(C.cartCrumb), href: "/cart" }, { label: t(C.title) }]}
      kicker={t(C.kicker)}
      title={t(C.title)}
      intro={t(C.intro)}
      actions={
        <>
          <Link href={link("/cart")} className={btn("outline", "md", "h-11")}>
            <Arrow className="size-4 rotate-180" />
            {t(C.backToCart)}
          </Link>
          <span role="group" aria-label={t(C.securityLabel)} className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#ddf4e6] px-4 py-1.5 text-[var(--vd-grade-a)]">
            <ShieldCheck aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.2} />
            <span className="leading-tight">
              <span className="block vd-sm font-bold">{t(C.secureTitle)}</span>
              <span className="block vd-xs font-semibold max-lg:hidden">{t(C.secureText)}</span>
            </span>
          </span>
        </>
      }
    />
  );
}

function CheckoutView({ state }) {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const { cart, replaceCart, setCartQty, removeFromCart, toast } = useStore();
  const { ready, signedIn } = useSession();
  const signedOut = state === "signed-out" || (ready && !signedIn);
  const loginHref = link("/login?next=/cart");

  const [loaded, setLoaded] = useState(false);
  const [method, setMethod] = useState(state === "pickup" ? "pickup" : "home");
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [walletMode, setWalletMode] = useState("none");
  const [walletInput, setWalletInput] = useState("");
  const [codes, setCodes] = useState({});
  const [payments, setPayments] = useState({});
  const [quoteState, setQuoteState] = useState({ key: "", quote: null, error: "", loading: false });
  const [quoteRetries, setQuoteRetries] = useState(0);
  const [pricing, setPricing] = useState({ key: "", preview: null, loading: false });
  const [pickup, setPickup] = useState({ loading: false, locations: [], id: null });
  const [processing, setProcessing] = useState(state === "submitting");
  const [failure, setFailure] = useState(state === "error" ? SERVER_ERRORS.checkout : null);
  const [pending, setPending] = useState(null);
  const [pendingError, setPendingError] = useState(state === "session-error" ? PROBE_ERROR : "");
  const [redirecting, setRedirecting] = useState(state === "redirecting");
  const [created, setCreated] = useState(state === "created" ? SAMPLE_CREATED_ORDER : null);
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState("");
  const alive = useRef(true);
  const firstQuote = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const lines = useMemo(() => cartLines(cart), [cart]);
  const groups = useMemo(() => sellerGroups(lines), [lines]);
  const signature = cartSignature(lines);
  const multi = groups.length > 1;
  const pickupEligible = isPickupEligible(groups);
  // Production switches back to home delivery when the cart stops qualifying for pickup.
  const deliveryMethod = method === "pickup" && !pickupEligible ? "home" : method;
  const address = addresses.find((entry) => entry.id === addressId) || null;

  // Loading: the cart, the saved addresses and the wallet arrive; a preview
  // state loads its sample cart (and its session, created order …) here.
  const load = useEffectEvent(() => {
    const seed = seedFor(state, cart);
    if (seed) replaceCart(seed);
    const saved = state === "no-address" ? [] : SAMPLE_ADDRESSES.map((entry) => resolveAddress(entry, t));
    setAddresses(saved);
    setAddressId((saved.find((entry) => entry.is_default) || saved[0])?.id ?? null);
    if (state === "session" || state === "redirecting") {
      const seededLines = cartLines(seed || cart);
      const seededGroups = sellerGroups(seededLines);
      const quote = deliveryQuote(seededGroups, saved[0]?.city);
      const preview = pricingPreview(seededGroups, {});
      const totals = seededGroups.map((group) => groupTotals(group, { method: "home", quote: quote.groups[group.key], pricing: preview.by_group[group.key], payment: "moyasar" }));
      const summary = checkoutSummary({ lines: seededLines, method: "home", totals, preview, wallet: SAMPLE_WALLET, walletMode: "partial", walletInput: SAMPLE_SESSION.wallet_reserved });
      const session = sessionFrom({ lines: seededLines, groups: seededGroups, summary, t });
      rememberSession(session);
      setPending(session);
    }
    if (state === "price-changed") {
      setNotice(t(C.totalRefreshed));
      toast({ tone: "success", title: t(C.totalRefreshed) });
    }
    setLoaded(true);
  });
  useEffect(() => {
    if (state === "loading" || signedOut) return undefined;
    const timer = window.setTimeout(load, 450);
    const walletTimer = window.setTimeout(() => setWallet(SAMPLE_WALLET), 900);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(walletTimer);
    };
  }, [state, signedOut]);

  // Signed out (for real, not the preview state): on to sign in, back to the cart after.
  useEffect(() => {
    if (!ready || signedIn || state === "signed-out") return undefined;
    const timer = window.setTimeout(() => router.replace(loginHref), 1200);
    return () => window.clearTimeout(timer);
  }, [ready, signedIn, state, router, loginHref]);

  // Delivery quote: home + an address + lines. The first request at once,
  // later ones 350 ms after a change; a superseded answer is dropped.
  const quoteKey = loaded && deliveryMethod === "home" && address && lines.length ? `${address.id}:${signature}` : "";
  const answerQuote = useEffectEvent((key) => {
    if (state === "quote-error" && quoteRetries === 0) setQuoteState({ key, quote: null, error: SERVER_ERRORS.quote, loading: false });
    else setQuoteState({ key, quote: deliveryQuote(groups, address?.city), error: "", loading: false });
  });
  useEffect(() => {
    if (!quoteKey) return undefined;
    const delay = firstQuote.current ? 0 : 350;
    firstQuote.current = false;
    let answer;
    const start = window.setTimeout(() => {
      setQuoteState((current) => ({ ...current, loading: true }));
      // "Pricing delivery": the quote never answers.
      if (state !== "quoting") answer = window.setTimeout(() => answerQuote(quoteKey), 800);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(answer);
    };
  }, [quoteKey, quoteRetries, state]);

  // Pricing preview with coupons, 250 ms after the lines, the codes or the city change.
  const pricingKey = loaded && lines.length ? JSON.stringify([signature, groups.map((group) => codes[group.key] || ""), address?.city || ""]) : "";
  const answerPricing = useEffectEvent((key) => {
    const preview = pricingPreview(groups, codes);
    setPricing({ key, preview, loading: false });
    const rejected = groups.filter((group) => preview.by_group[group.key].discount_code_valid === false);
    if (rejected.length) {
      setCodes((current) => ({ ...current, ...Object.fromEntries(rejected.map((group) => [group.key, ""])) }));
      toast({ tone: "danger", title: t(C.couponRemoved) });
    }
  });
  useEffect(() => {
    if (!pricingKey) return undefined;
    let answer;
    const start = window.setTimeout(() => {
      setPricing((current) => ({ ...current, loading: true }));
      answer = window.setTimeout(() => answerPricing(pricingKey), 350);
    }, 250);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(answer);
    };
  }, [pricingKey]);

  // Pickup locations: fetched again on every cart change, which resets the choice (production).
  const pickupKey = loaded && deliveryMethod === "pickup" && lines.length ? signature : "";
  const answerPickup = useEffectEvent(() => {
    const locations = SAMPLE_PICKUP_LOCATIONS.map((entry) => ({ ...entry, name: t(entry.name), city: t(entry.city), address_line1: t(entry.address_line1), contact_name: t(entry.contact_name) }));
    setPickup({ loading: false, locations, id: (locations.find((entry) => entry.is_default) || locations[0])?.id ?? null });
  });
  useEffect(() => {
    if (!pickupKey) return undefined;
    const start = window.setTimeout(() => setPickup((current) => ({ ...current, loading: true })), 0);
    const answer = window.setTimeout(answerPickup, 600);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(answer);
    };
  }, [pickupKey]);

  // Derived figures.
  const quote = quoteKey ? quoteState.quote : null;
  const quoteLoading = Boolean(quoteKey) && quoteState.loading;
  const quoteError = quoteKey ? quoteState.error : "";
  const preview = pricing.preview;
  const pricingPending = Boolean(pricingKey) && (pricing.loading || pricing.key !== pricingKey);
  const labels = Object.fromEntries(groups.map((group) => [group.key, group.key === PLATFORM ? t(KHAZNAH) : quote?.groups[group.key] ? t(quote.groups[group.key].seller_label) : group.seller.code]));
  const caps = quote ? Object.assign({}, ...Object.values(quote.groups).map((entry) => entry.max_quantity)) : {};
  const totals = groups.map((group) => groupTotals(group, { method: deliveryMethod, quote: quote?.groups[group.key], pricing: preview?.by_group[group.key], payment: payments[group.key] }));
  const summary = checkoutSummary({ lines, method: deliveryMethod, totals, preview, wallet, walletMode, walletInput });
  const invalidCoupon = Boolean(preview) && groups.some((group) => preview.by_group[group.key]?.discount_code_valid === false);
  const invalidSellerPayment = deliveryMethod === "home" && totals.some((entry, i) => payments[groups[i].key] === "home_delivery_cod" && !entry.codEligible);
  const quoteCurrent = Boolean(quote) && !quoteError && quoteState.key === `${address?.id}:${signature}`;
  const payDisabled =
    processing ||
    pricingPending ||
    invalidCoupon ||
    invalidSellerPayment ||
    quoteLoading ||
    (deliveryMethod === "home" && !quoteCurrent) ||
    (walletMode === "full" && summary.balance < summary.onlineTotal) ||
    (deliveryMethod === "pickup" && multi);
  const label = payLabel(summary);
  const payText = t(C[label.key], { amount: label.amount == null ? "" : moneyText(label.amount) });
  const homeFee = quoteLoading ? "loading" : quote ? quote.delivery_charge : null;

  // Pay: production's pipeline (refresh the cart, re-validate, create the
  // checkout with defer_until_paid), then the payment page, or the orders
  // page when nothing is left to pay online.
  const pay = async () => {
    if (payDisabled) return;
    setFailure(null);
    setProcessing(true);
    const at = { lines, groups, totals, summary };
    await wait(2000);
    if (!alive.current) return;
    await wait(1600);
    if (!alive.current) return;
    setProcessing(false);
    if (at.summary.gatewayDue > 0) {
      const session = sessionFrom({ lines: at.lines, groups: at.groups, summary: at.summary, t });
      rememberSession(session);
      setPending(session);
      setRedirecting(true);
      await wait(900);
      if (alive.current) router.push(link(`/payment/moyasar/${session.payment_record_id}`));
      return;
    }
    if (at.groups.length > 1) {
      router.replace(link(`/account?tab=orders&group=${SAMPLE_SESSION.group_reference}`));
      return;
    }
    setCreated({ ...SAMPLE_CREATED_ORDER, total_amount: at.summary.total, payment_status: at.totals[0]?.cod ? "pending" : "paid" });
    toast({ tone: "success", title: t(at.totals[0]?.cod ? C.orderCod : C.orderWallet) });
    await wait(1200);
    if (alive.current) router.replace(link("/account?tab=orders"));
  };

  const cancelCheckout = async () => {
    setConfirmCancel(false);
    setCancelling(true);
    await wait(900);
    if (!alive.current) return;
    // The reservation is released and the whole cart emptied, then Browse.
    rememberSession(null);
    replaceCart([]);
    router.replace(link("/browse"));
  };

  const saveAddress = async () => {
    const draft = dialog.draft;
    const required = [draft.recipient_name, draft.recipient_phone, draft.city, draft.street].every((value) => String(value).trim());
    if (!required) {
      setDialog({ ...dialog, error: t(C.addressRequired) });
      return;
    }
    setDialog({ ...dialog, error: "", saving: true });
    await wait(700);
    if (!alive.current) return;
    // The building is stored as the postal code (20 characters at most on the server).
    if (draft.building.trim().length > 20) {
      setDialog((current) => ({ ...current, saving: false, error: "Postal Code: Ensure this field has no more than 20 characters." }));
      return;
    }
    const previous = addresses.find((entry) => entry.id === dialog.editingId);
    const saved = {
      id: dialog.editingId ?? Math.max(300, ...addresses.map((entry) => entry.id)) + 1,
      // Production relabels every address it saves and makes it the default.
      label: "Delivery address",
      recipient_name: draft.recipient_name.trim(),
      recipient_phone: draft.recipient_phone.trim(),
      city: draft.city.trim(),
      district: draft.district.trim(),
      region: previous?.region || "",
      address_line: [draft.street.trim(), draft.building.trim()].filter(Boolean).join(", "),
      postal_code: draft.building.trim(),
      extra_data: { notes: draft.notes, building: draft.building.trim() },
      is_default: true,
    };
    setAddresses((list) => [...list.filter((entry) => entry.id !== saved.id).map((entry) => ({ ...entry, is_default: false })), saved]);
    setAddressId(saved.id);
    setDialog(null);
    toast({ tone: "success", title: t(C.addressSaved) });
  };

  // Production's screens, first match wins.
  if (signedOut) return <SignInStep href={loginHref} redirecting={state !== "signed-out"} />;
  if (!loaded || !ready)
    return (
      <>
        <CheckoutHeading />
        <CheckoutSkeleton />
      </>
    );
  if (pending || pendingError)
    return (
      <PendingPayment
        session={pending}
        error={pendingError}
        busy={processing}
        cancelling={cancelling}
        redirecting={redirecting}
        onResume={() => router.push(link(`/payment/moyasar/${pending.payment_record_id}`))}
        onEdit={() => {
          rememberSession(null);
          setRedirecting(false);
          setPending(null);
        }}
        onCancel={() => setConfirmCancel(true)}
        onRetry={() => router.replace(link("/checkout"))}
      />
    );
  if (!lines.length && !created) return <EmptyCheckout />;
  if (created) return <CreatedOrder order={created} paymentStatus={created.payment_status} />;

  const error = failure ? (
    <ErrorPanel
      message={failure}
      created={false}
      onRetry={() => {
        setFailure(null);
        pay();
      }}
    />
  ) : null;

  return (
    <>
      <CheckoutHeading />
      <div className="vd-container pb-52 pt-6 lg:pb-16 dt:pb-20 dt:pt-8">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start dt:grid-cols-[minmax(0,1fr)_400px] dt:gap-8">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
            <DeliveryPanel
              className="order-2 lg:order-1"
              method={deliveryMethod}
              onMethod={setMethod}
              pickupEligible={pickupEligible}
              disabled={processing}
              homeFee={homeFee}
              address={address}
              addresses={addresses}
              onSelectAddress={(entry) => setAddressId(entry.id)}
              onEditAddress={(entry) => {
                // Production selects the address as the dialog opens.
                setAddressId(entry.id);
                setDialog({ draft: draftFrom(entry), editingId: entry.id, error: "", saving: false });
              }}
              onAddAddress={() => {
                // … and clears the selection for a new one.
                setAddressId(null);
                setDialog({ draft: draftFrom(null), editingId: null, error: "", saving: false });
              }}
              quoteError={quoteError}
              quoteLoading={quoteLoading}
              onRetryQuote={() => setQuoteRetries((value) => value + 1)}
              pickup={{ locations: pickup.locations, loading: pickup.loading, pickupId: pickup.id, onPick: (id) => setPickup((current) => ({ ...current, id })) }}
            />
            <OrdersPanel
              className="order-1 lg:order-2"
              lines={lines}
              groups={groups}
              totals={totals}
              labels={labels}
              method={deliveryMethod}
              quote={quote}
              payments={payments}
              onPayment={(key, value) => setPayments((current) => ({ ...current, [key]: value }))}
              caps={caps}
              busy={processing}
              codes={codes}
              onQty={(line, next) => setCartQty(line.slug, next)}
              onRemove={(line) => removeFromCart(line.slug)}
            />
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
            {deliveryMethod === "home" && !address ? (
              <Notice tone="warning" role="status">
                {t(C.noAddressNotice)}
              </Notice>
            ) : null}
            {invalidCoupon ? (
              <Notice tone="warning" role="alert">
                {t(C.invalidCouponNotice)}
              </Notice>
            ) : null}
            <PaymentMethodCard walletMode={walletMode} wallet={wallet} onMode={setWalletMode} input={walletInput} onInput={setWalletInput} summary={summary} busy={processing} />
            <SummaryCard
              groups={groups}
              labels={labels}
              totals={totals}
              preview={preview}
              codes={codes}
              onCode={(key, code) => setCodes((current) => ({ ...current, [key]: code }))}
              summary={summary}
              method={deliveryMethod}
              quoted={Boolean(quote)}
              busy={processing}
              pricingPending={pricingPending}
              pricingError=""
              invalidSellerPayment={invalidSellerPayment}
              payText={payText}
              payDisabled={payDisabled}
              onPay={pay}
              onCancel={() => setConfirmCancel(true)}
              cancelling={cancelling}
              error={error}
              notice={notice}
            />
          </div>
        </div>
      </div>
      <PhoneBar summary={summary} payText={payText} payDisabled={payDisabled} onPay={pay} onCancel={() => setConfirmCancel(true)} busy={processing} cancelling={cancelling} />
      <AddressDialog
        open={Boolean(dialog)}
        draft={dialog?.draft || draftFrom(null)}
        error={dialog?.error}
        saving={dialog?.saving}
        onChange={(draft) => setDialog((current) => ({ ...current, draft }))}
        onSave={saveAddress}
        onClose={() => setDialog(null)}
      />
      <CancelDialog open={confirmCancel} onClose={() => setConfirmCancel(false)} onConfirm={cancelCheckout} />
      <ProcessingOverlay open={processing} onHide={() => setProcessing(false)} />
    </>
  );
}

/** Production asks with the browser's confirm; here the Option 3 dialog asks the same question. */
function CancelDialog({ open, onClose, onConfirm }) {
  const { t } = useLang();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      title={t(C.cancelConfirm)}
      testId="cancel-dialog"
      footer={
        <>
          <button type="button" onClick={onClose} className={btn("outline", "lg")} data-autofocus>
            {t(C.keepCheckout)}
          </button>
          <button type="button" onClick={onConfirm} className={btn("danger", "lg")} data-testid="confirm-cancel">
            <X aria-hidden="true" className="size-4" strokeWidth={2.4} />
            {t(C.cancelCheckout)}
          </button>
        </>
      }
    />
  );
}

/** Option 3 — Checkout (production /checkout). */
export function VisualDiscoveryCheckout() {
  return (
    <VDPage>
      <StateRoute
        fallback={
          <>
            <CheckoutHeading />
            <CheckoutSkeleton />
          </>
        }
      >
        {(params, state) => <CheckoutView key={state} state={state} />}
      </StateRoute>
    </VDPage>
  );
}
