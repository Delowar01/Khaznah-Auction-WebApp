"use client";

// Won items (spec A §7): the auction wins among the loaded orders, with
// both statuses, the wallet-applied line and the actions production offers
// (Pay now while payment is pending, View details, Download invoice), and
// the Pay now panel: price breakdown, coupons, wallet, delivery address
// (priced 300 ms after each choice; Pay waits for the price) and the pay
// sequence (wallet first; a full wallet payment closes and refreshes,
// otherwise the card payment opens). Production adds an address in a popup
// over the panel; here the same form opens inside the panel.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MapPin, Trophy } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { COUPONS, DELIVERY_BY_CITY, DELIVERY_DEFAULT } from "@/data/accountSamples";
import { getProduct } from "@/lib/catalog";
import { moneyText } from "@/lib/format";
import { EmptyState, Panel, PanelHead, SummaryRow, Tile } from "../kit/Blocks";
import { Field, Select, TextInput } from "../kit/Form";
import { SidePanel } from "../kit/Overlay";
import { btn, cx } from "../ui";
import { ACCOUNT_COPY as C } from "./copy";
import { Ltr, Status, Thumb, num, useAccount, useDates, usePlural, wait } from "./parts";
import { fulfilmentStatus, isPendingPayment, orderStatus } from "./status";

export const itemTitle = (order, t) => {
  const product = getProduct(order.item);
  return product ? t(product.title) : null;
};

function WinCard({ order }) {
  const { t } = useLang();
  const acc = useAccount();
  const { dateTime } = useDates();
  const invoice = acc.invoiceFor(order);
  const applied = num(order.wallet_amount_applied);
  const due = num(order.amount_due);
  return (
    <article className="grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center" data-testid="won-row" data-order={order.id}>
      <div className="flex min-w-0 items-start gap-4">
        <Thumb slug={order.item} />
        <div className="min-w-0">
          <p className="vd-kicker text-[#7a4e0c]">
            <Ltr>{order.order_number}</Ltr>
          </p>
          <p className="mt-1 line-clamp-2 vd-title text-[var(--vd-ink)]">
            <bdi dir="auto">{itemTitle(order, t) || t(C.auctionWin)}</bdi>
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 vd-sm text-[var(--vd-muted)]">
            <Ltr>{dateTime(order.created_at) || t(C.dateUnavailable)}</Ltr>
            <span aria-hidden="true">·</span>
            <Money value={num(order.total_amount)} className="font-bold text-[var(--vd-ink)]" />
          </p>
          {applied > 0 ? (
            <p className="mt-1 vd-sm font-semibold text-[var(--vd-grade-a)]">
              {t(C.walletApplied)}
              <Money value={applied} />
              {due > 0 ? (
                <>
                  {t(C.remaining)}
                  <Money value={due} />
                </>
              ) : null}
            </p>
          ) : null}
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Status status={orderStatus(order.status)} />
            <Status status={fulfilmentStatus(order.fulfillment_status)} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 max-sm:border-t max-sm:border-[var(--vd-line)] max-sm:pt-4 sm:justify-end">
        {isPendingPayment(order) ? (
          <button type="button" onClick={() => acc.setPayNow(order)} disabled={acc.busy[`pay-${order.id}`]} className={btn("gold", "md", "h-11")} data-testid="pay-now">
            {acc.busy[`pay-${order.id}`] ? t(C.creating) : t(C.payNow)}
          </button>
        ) : null}
        <button type="button" onClick={() => acc.openOrder(order)} className={btn("soft", "md", "h-11")}>
          {t(C.viewDetails)}
        </button>
        {invoice ? (
          <button type="button" onClick={() => acc.downloadInvoice(invoice)} disabled={acc.busy[`invoice-${invoice.id}`]} className={btn("soft", "md", "h-11")}>
            {acc.busy[`invoice-${invoice.id}`] ? t(C.generating) : t(C.downloadInvoice)}
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function Won() {
  const { t } = useLang();
  const { link } = useConcept();
  const acc = useAccount();
  const pc = usePlural();
  const won = acc.has("orders") ? acc.orders.filter((order) => order.order_type === "auction_win") : [];
  if (!won.length) {
    return (
      <EmptyState
        icon={Trophy}
        title={t(C.noWins)}
        headingLevel={3}
        actions={
          <Link href={link("/browse")} className={btn("indigo", "lg")}>
            {t(C.browseAuctions)}
          </Link>
        }
      />
    );
  }
  return (
    <Panel aria-labelledby="won-title">
      <PanelHead as="h3" id="won-title" title={t(C.wonTitle)} note={pc("wins", won.length)} className="mb-4" />
      <div className="divide-y divide-[var(--vd-line)]">
        {won.map((order) => (
          <WinCard key={order.id} order={order} />
        ))}
      </div>
    </Panel>
  );
}

const EMPTY_ADDRESS = { label: "", recipient_name: "", recipient_phone: "", city: "", region: "", district: "", address_line: "", postal_code: "" };

/** Production's quick-add address form (spec A §7.5), here inside the panel. */
function QuickAddAddress({ onDone, onCancel }) {
  const { t } = useLang();
  const acc = useAccount();
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.recipient_name.trim() || !form.recipient_phone.trim() || !form.city.trim() || !form.address_line.trim()) {
      setError(t(C.addressRequired));
      return;
    }
    setSaving(true);
    setError("");
    const created = await acc.createAddress({ ...form, is_default: true });
    setSaving(false);
    if (!created) {
      setError(t(C.addressNotSaved));
      return;
    }
    onDone(created);
  };
  const fields = [
    { key: "label", label: C.fLabel, span: true },
    { key: "recipient_name", label: C.fRecipient, span: true, required: true, autoComplete: "name" },
    { key: "recipient_phone", label: C.fPhone, required: true, type: "tel", autoComplete: "tel" },
    { key: "city", label: C.fCity, required: true, autoComplete: "address-level2" },
    { key: "region", label: C.fRegion, autoComplete: "address-level1" },
    { key: "district", label: C.fDistrict, autoComplete: "address-level3" },
    { key: "address_line", label: C.fStreet, span: true, required: true, autoComplete: "street-address" },
    { key: "postal_code", label: C.fPostal, autoComplete: "postal-code", ltr: true },
  ];
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[20px] border border-[var(--vd-line)] p-4" data-testid="quick-add-address">
      <h4 className="vd-h3">{t(C.addDeliveryAddress)}</h4>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <Field key={field.key} label={t(field.label)} className={field.span ? "sm:col-span-2" : undefined}>
            {(ids) => <TextInput {...ids} type={field.type || "text"} ltr={field.ltr} required={field.required} autoComplete={field.autoComplete} value={form[field.key]} onChange={set(field.key)} />}
          </Field>
        ))}
      </div>
      {error ? (
        <p role="alert" className="vd-sm font-semibold text-[#b3261e]">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onCancel} className={btn("outline", "lg")}>
          {t(C.cancel)}
        </button>
        <button type="submit" disabled={saving} className={btn("gold", "lg")}>
          {saving ? t(C.saving) : t(C.saveAddress)}
        </button>
      </div>
    </form>
  );
}

// The won bid before any coupon (the backend stores the discounted figure
// as the subtotal once a coupon applies).
const bidOf = (order) => order.bid_amount ?? num(order.subtotal) + num(order.discount_amount);

/** Production's order figures after a change: subtotal less coupon, plus delivery, less wallet. */
const priced = (order, fields) => {
  const bid = bidOf(order);
  const next = { ...order, ...fields, bid_amount: bid };
  const subtotal = bid - num(next.discount_amount);
  const total = subtotal + num(next.customer_delivery_charge) + num(next.cod_surcharge_amount);
  return { ...next, subtotal: subtotal.toFixed(2), total_amount: total.toFixed(2), amount_due: Math.max(0, total - num(next.wallet_amount_applied)).toFixed(2) };
};

function PayNowBody({ order }) {
  const { t } = useLang();
  const acc = useAccount();
  // The order lives in the page's list: what changes here is kept there,
  // as the server keeps it (spec A §7.4 "Closing").
  const current = acc.orders.find((o) => o.id === order.id) || order;
  const addresses = acc.addresses;
  const [selected, setSelected] = useState(() => String(order.addressId || (addresses.find((a) => a.is_default) || addresses[0])?.id || ""));
  const [resolvedFor, setResolvedFor] = useState("");
  const [resolving, setResolving] = useState(false);
  const [code, setCode] = useState(order.discount_code || "");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [walletInput, setWalletInput] = useState("");
  const [walletError, setWalletError] = useState("");
  const [applyingWallet, setApplyingWallet] = useState(false);
  const [adding, setAdding] = useState(false);
  const wallet = acc.walletRaw;
  const balance = num(wallet?.balance);
  const remainingDue = num(current.amount_due ?? current.total_amount);
  const timer = useRef(0);

  // Price delivery 300 ms after each address choice; a newer choice wins.
  useEffect(() => {
    if (!selected) return undefined;
    const run = ++timer.current;
    const id = window.setTimeout(async () => {
      setResolving(true);
      await wait(500);
      if (run !== timer.current) return;
      const address = addresses.find((a) => String(a.id) === selected);
      const city = address?.cityKey || t(address?.city);
      const charge = DELIVERY_BY_CITY[city] || DELIVERY_DEFAULT;
      acc.updateOrder(order.id, (o) => priced(o, { customer_delivery_charge: charge, addressId: Number(selected), needsAddress: false }));
      setResolvedFor(selected);
      setResolving(false);
    }, 300);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const applyCode = async (value) => {
    const next = String(value || "").trim().toUpperCase();
    setApplying(true);
    setApplyError("");
    await wait(450);
    setApplying(false);
    if (!next) {
      acc.updateOrder(order.id, (o) => priced(o, { discount_amount: "0.00", discount_code: "" }));
      setCode("");
      return;
    }
    const coupon = COUPONS.find((c) => c.code === next);
    if (!coupon) {
      setApplyError(t(C.couponNotApply));
      return;
    }
    acc.updateOrder(order.id, (o) => {
      const discount = coupon.discount_type === "percentage" ? (bidOf(o) * num(coupon.value)) / 100 : num(coupon.value);
      return priced(o, { discount_amount: discount.toFixed(2), discount_code: coupon.code });
    });
    setCode(coupon.code);
  };

  const pay = async () => {
    const chosen = Math.min(num(walletInput), balance, remainingDue);
    let paying = current;
    if (chosen > 0) {
      setApplyingWallet(true);
      setWalletError("");
      await wait(600);
      setApplyingWallet(false);
      paying = priced(current, { wallet_amount_applied: (num(current.wallet_amount_applied) + chosen).toFixed(2) });
      acc.setWallet((w) => (w ? { ...w, balance: (num(w.balance) - chosen).toFixed(2) } : w));
      setWalletInput("");
      if (num(paying.amount_due) <= 0) {
        // Fully paid from the wallet: close and refresh, no message (production).
        acc.updateOrder(order.id, { ...paying, status: "paid", payment_status: "paid" });
        acc.setPayNow(null);
        acc.refresh();
        return;
      }
      acc.updateOrder(order.id, paying);
    }
    // The panel closes first; the result shows as the page message (quirk Q10).
    acc.setPayNow(null);
    acc.payOrder(paying, selected);
  };

  const discount = num(current.discount_amount);
  const delivery = num(current.customer_delivery_charge);
  const cod = num(current.cod_surcharge_amount);
  const canPay = !applyingWallet && addresses.length > 0 && selected && !resolving && resolvedFor === selected;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <div className="flex items-start gap-4">
        <Thumb slug={order.item} size="lg" />
        <div className="min-w-0">
          <p className="vd-kicker text-[#7a4e0c]">
            <Ltr>{current.order_number}</Ltr>
          </p>
          <h3 className="mt-1 vd-h3">
            <bdi dir="auto">{itemTitle(order, t) || t(C.auctionWin)}</bdi>
          </h3>
        </div>
      </div>

      <section aria-labelledby="pay-breakdown" className="rounded-[20px] bg-[#f6f8fc] p-4">
        <h4 id="pay-breakdown" className="vd-md font-bold">
          {t(C.priceBreakdown)}
        </h4>
        <dl className="mt-3 grid gap-2">
          {/* Production shows the already-discounted subtotal as the winning bid and lists the coupon as well, so the lines do not add up (quirk Q11). */}
          <SummaryRow label={t(C.winningBid)} amount={num(current.subtotal ?? current.total_amount)} />
          {discount > 0 ? <SummaryRow label={`${t(C.couponApplied)}${current.discount_code ? ` (${current.discount_code})` : ""}`} tone="saving" value={<span dir="ltr">−<Money value={discount} /></span>} /> : null}
          {delivery > 0 ? <SummaryRow label={t(C.delivery)} amount={delivery} /> : null}
          {cod > 0 ? <SummaryRow label={t(C.codSurcharge)} amount={cod} /> : null}
          <SummaryRow label={remainingDue < num(current.total_amount) ? t(C.remainingDue) : t(C.totalDue)} amount={remainingDue} strong className="mt-1 border-t border-[var(--vd-line)] pt-3" />
        </dl>
      </section>

      <section aria-labelledby="pay-coupon" className="grid grid-cols-[minmax(0,1fr)] gap-3">
        <h4 id="pay-coupon" className="vd-md font-bold">
          {t(C.haveCoupon)}
        </h4>
        {COUPONS.length ? (
          <div className="flex flex-wrap gap-2">
            {COUPONS.map((coupon) => (
              <button key={coupon.id} type="button" disabled={applying} onClick={() => applyCode(coupon.code)} className="inline-flex h-9 items-center rounded-full border border-[#ecd49a] bg-[#fdf4e2] px-3.5 vd-sm font-bold text-[#7a4e0c] hover:border-[var(--vd-gold)] disabled:opacity-50">
                {/* Production prints the raw value: "10.00% off" (quirk Q12). */}
                {t(C.couponChip, { code: coupon.code, value: coupon.discount_type === "percentage" ? `${coupon.value}%` : moneyText(num(coupon.value)) })}
              </button>
            ))}
          </div>
        ) : null}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            applyCode(code);
          }}
          className="flex flex-wrap items-end gap-2"
        >
          <Field label={t(C.couponLabel)} labelHidden className="min-w-0 flex-1 basis-40" error={applyError || null}>
            {(ids) => <TextInput {...ids} ltr value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder={t(C.couponPlaceholder)} />}
          </Field>
          <button type="submit" disabled={applying || !code.trim()} className={btn("indigo", "lg")}>
            {applying ? t(C.applying) : t(C.apply)}
          </button>
          {current.discount_code ? (
            <button type="button" onClick={() => applyCode("")} disabled={applying} className={btn("outline", "lg")}>
              {t(C.remove)}
            </button>
          ) : null}
        </form>
      </section>

      {balance > 0 ? (
        <Tile className="grid grid-cols-[minmax(0,1fr)] gap-2.5 !p-4">
          <p className="vd-md font-bold">{t(C.payWithWallet)}</p>
          <p className="vd-sm text-[var(--vd-muted)]">
            {t(C.walletBalanceLine)}
            <Money value={balance} className="font-bold text-[var(--vd-ink)]" />
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Field label={t(C.walletAmount)} labelHidden className="w-40" error={walletError || null}>
              {(ids) => <TextInput {...ids} type="number" min={0} step="0.01" max={Math.min(balance, remainingDue)} value={walletInput} onChange={(event) => setWalletInput(event.target.value)} placeholder="0.00" />}
            </Field>
            <button type="button" onClick={() => setWalletInput(Math.min(balance, remainingDue).toFixed(2))} className="vd-link vd-md font-bold text-[var(--vd-indigo)]">
              {t(C.useFull)}
            </button>
          </div>
        </Tile>
      ) : null}

      <section aria-labelledby="pay-address" className="grid grid-cols-[minmax(0,1fr)] gap-3">
        <h4 id="pay-address" className="vd-kicker text-[var(--vd-muted)]">
          {t(C.deliveryAddress)}
        </h4>
        {adding ? (
          <QuickAddAddress
            onCancel={() => setAdding(false)}
            onDone={(created) => {
              setAdding(false);
              setSelected(String(created.id));
            }}
          />
        ) : addresses.length ? (
          <>
            <Field label={t(C.deliveryAddressFor)} labelHidden>
              {(ids) => (
                <Select {...ids} value={selected} onChange={(event) => setSelected(event.target.value)} data-testid="pay-address">
                  <option value="">{t(C.chooseAddress)}</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={String(address.id)}>
                      {t(address.label) || t(address.city) || t(C.addressFallback, { id: address.id })}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button type="button" onClick={() => setAdding(true)} className="vd-link vd-md font-bold text-[var(--vd-indigo)]">
                {t(C.addAnother)}
              </button>
              {resolving ? (
                <span role="status" className="vd-sm text-[var(--vd-muted)]">
                  {t(C.calculating)}
                </span>
              ) : null}
            </div>
          </>
        ) : (
          <div className="grid justify-items-start gap-3 rounded-[18px] border border-dashed border-[#cfdaea] p-4">
            <p className="flex items-center gap-2 vd-md text-[var(--vd-ink)]">
              <MapPin aria-hidden="true" className="size-4 text-[var(--vd-indigo)]" strokeWidth={2.2} />
              {t(C.noAddress)}
            </p>
            <button type="button" onClick={() => setAdding(true)} className={btn("indigo", "md")}>
              {t(C.addDelivery)}
            </button>
          </div>
        )}
      </section>

      <button type="button" onClick={pay} disabled={!canPay} className={cx(btn("gold", "lg", "h-14 w-full vd-lg"))} data-testid="pay-submit">
        {applyingWallet ? t(C.applyingWallet) : (
          <>
            {t(C.payAmount, { amount: "" })}
            <Money value={remainingDue} />
          </>
        )}
      </button>
    </div>
  );
}

/** Pay now (spec A §7.4). Closing it refreshes the page, as in production (quirk Q9). */
export function PayNowPanel() {
  const { t } = useLang();
  const acc = useAccount();
  const order = acc.payNow;
  return (
    <SidePanel
      open={Boolean(order)}
      onClose={() => {
        acc.setPayNow(null);
        acc.refresh();
      }}
      title={order ? t(C.payFor, { ref: order.order_number }) : ""}
      testId="pay-now-panel"
    >
      {order ? <PayNowBody key={order.id} order={order} /> : null}
    </SidePanel>
  );
}
