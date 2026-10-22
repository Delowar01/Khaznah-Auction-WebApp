"use client";

// Orders & Invoices (spec A §8): multi-seller payment banners, the group
// filter, one card per loaded order (both statuses, total, invoice slot,
// group chip; Details, Invoice, Pay, Track), "Load 8 more orders" and the
// Delivery support card; plus the order details panel. Production quirks
// kept: Pay here sends no address (an auction win without one is refused,
// Q8), the group chip reads "1-seller checkout" (Q16), the invoice slot
// prints the payment status (Q17), the drawer's "Order status" tile shows
// the fulfilment status (Q19) and any payment status but paid reads
// "Payment pending" (Q21). Production's order list has no empty message
// (Q28); the preview adds one.
import Link from "next/link";
import { useState } from "react";
import { PackageOpen } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { getProduct, getSeller } from "@/lib/catalog";
import { moneyText } from "@/lib/format";
import { EmptyState, Notice, Panel, Spinner, SummaryRow, Tile } from "../kit/Blocks";
import { SidePanel } from "../kit/Overlay";
import { btn, cx } from "../ui";
import { ACCOUNT_COPY as C } from "./copy";
import { Caption, Ltr, Section, Status, Thumb, num, useAccount, useDates, usePlural } from "./parts";
import { GROUP_PAYABLE, fulfilmentStatus, isPendingPayment, orderStatus, orderType, paymentSlot } from "./status";
import { itemTitle } from "./Won";

function OrderCard({ order, onGroup }) {
  const { t } = useLang();
  const acc = useAccount();
  const pc = usePlural();
  const invoice = acc.invoiceFor(order);
  const fulfilment = fulfilmentStatus(order.fulfillment_status);
  const slot = invoice?.invoice_number || (order.payment_status ? t(paymentSlot(order.payment_status).label) : null);
  return (
    <article className="py-5 first:pt-0 last:pb-0" data-testid="order-card" data-order={order.id}>
      <div className="flex items-start gap-3 sm:gap-4">
        <Thumb slug={order.item} size="sm" className="sm:size-16" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="min-w-0 max-w-full truncate vd-title text-[var(--vd-ink)]">
              <bdi dir="auto">{itemTitle(order, t) || t(orderType(order.order_type).label)}</bdi>
            </p>
            <Status status={orderStatus(order.status)} />
          </div>
          <p className="mt-1 vd-xs text-[var(--vd-muted)]">
            <Ltr>{order.order_number}</Ltr> · {order.order_type ? t(orderType(order.order_type).label) : t(C.marketplace)}
          </p>
          <Status status={fulfilment} className="mt-2" />
        </div>
        <div className="shrink-0 text-end">
          <Caption>{t(C.totalLabel)}</Caption>
          <Money value={num(order.total_amount)} className="mt-0.5 vd-lg font-extrabold text-[var(--vd-indigo)]" />
        </div>
      </div>
      <Tile className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 !py-3">
        <div className="flex flex-wrap items-center gap-2 vd-sm text-[var(--vd-muted)]">
          <span>{t(C.invoiceSlot, { value: "" })}<Ltr className="font-semibold text-[var(--vd-ink)]">{slot || t(C.invoicePending)}</Ltr></span>
          {order.group_reference ? (
            <button type="button" onClick={() => onGroup(order)} title={t(C.showAllIn, { ref: order.group_reference })} className="inline-flex h-8 items-center rounded-full border border-[var(--vd-line)] bg-white px-3 vd-xs font-bold text-[var(--vd-indigo)] hover:border-[var(--vd-indigo)]">
              {pc("sellerCheckout", (order.sibling_order_numbers?.length || 0) + 1)}
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => acc.openOrder(order)} className={btn("soft", "sm", "h-10")} data-testid="order-details">
            {t(C.details)}
          </button>
          {invoice ? (
            <button type="button" onClick={() => acc.downloadInvoice(invoice)} disabled={acc.busy[`invoice-${invoice.id}`]} className={btn("soft", "sm", "h-10")} data-testid="order-invoice">
              {acc.busy[`invoice-${invoice.id}`] ? t(C.generating) : t(C.invoice)}
            </button>
          ) : null}
          {isPendingPayment(order) ? (
            <button type="button" onClick={() => acc.payOrder(order)} disabled={acc.busy[`pay-${order.id}`]} className={btn("indigo", "sm", "h-10")} data-testid="order-pay">
              {acc.busy[`pay-${order.id}`] ? t(C.creatingDots) : t(C.pay)}
            </button>
          ) : null}
          <button type="button" onClick={() => acc.trackOrder(order)} disabled={acc.busy[`track-${order.id}`]} className="inline-flex h-10 items-center justify-center rounded-full border-[1.5px] border-[var(--vd-gold)] bg-[#fdf4e2] px-4 vd-sm font-semibold text-[#6b4409] transition-colors hover:bg-[#fbe9c4] disabled:opacity-45" data-testid="order-track">
            {acc.busy[`track-${order.id}`] ? t(C.loadingDots) : t(C.track)}
          </button>
        </div>
      </Tile>
    </article>
  );
}

/** Delivery support (spec A §8.9): the tracked order, else the newest one. */
function DeliverySupport() {
  const { t } = useLang();
  const acc = useAccount();
  const order = acc.tracking?.order || acc.orders[0];
  const fulfillment = acc.tracking?.fulfillments?.[0] || order?.fulfillments?.[0];
  return (
    <Section title={t(C.deliverySupport)} id="delivery-support">
      {!order ? (
        <p className="rounded-[18px] border border-dashed border-[#cfdaea] p-4 vd-md text-[var(--vd-muted)]">{t(C.noOrdersReturned)}</p>
      ) : (
        <Tile className="grid grid-cols-[minmax(0,1fr)] gap-2 !p-4" data-testid="delivery-support">
          <p className="vd-md font-bold text-[var(--vd-ink)]">
            <Ltr>{order.order_number}</Ltr>
          </p>
          <h4 className="vd-h3">{t(fulfilmentStatus(fulfillment?.status || order.fulfillment_status).label)}</h4>
          <p className="vd-sm text-[var(--vd-muted)]">
            {fulfillment?.tracking_number ? (
              <>
                {fulfillment.courier_name || t(C.courierFallback)} · <Ltr>{fulfillment.tracking_number}</Ltr>
              </>
            ) : (
              t(C.trackingLater)
            )}
          </p>
          {fulfillment?.oto_tracking_url ? (
            <a href={fulfillment.oto_tracking_url} target="_blank" rel="noreferrer" className="vd-link inline-flex w-fit items-center gap-1.5 vd-md font-bold text-[var(--vd-indigo)]">
              {t(C.liveMap)}
            </a>
          ) : null}
          {fulfillment ? (
            <p className="mt-1 rounded-[14px] bg-white px-3 py-2 vd-sm text-[var(--vd-ink)]">
              {t(C.deliveryMethodLine)}
              {order.delivery_method ? t(order.delivery_method === "pickup" ? C.methodPickup : C.methodDelivery) : t(C.notSpecified)}
            </p>
          ) : null}
        </Tile>
      )}
    </Section>
  );
}

export function Orders() {
  const { t } = useLang();
  const { link } = useConcept();
  const acc = useAccount();
  const pc = usePlural();
  const [filter, setFilter] = useState(null);
  const orders = acc.has("orders") ? acc.orders : [];

  // Checkouts with two or more unpaid loaded orders can be paid together.
  const groups = {};
  for (const order of orders) {
    const status = String(order.payment_status || order.status || "").toLowerCase();
    if (!order.group_reference || !GROUP_PAYABLE.has(status)) continue;
    const bucket = (groups[order.group_reference] ||= { count: 0, total: 0 });
    bucket.count += 1;
    bucket.total += num(order.amount_due ?? order.total_amount);
  }
  const buckets = Object.entries(groups).filter(([, bucket]) => bucket.count > 1);
  const visible = filter ? orders.filter((order) => filter.has(order.order_number)) : orders;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      {buckets.map(([ref, bucket]) => (
        <Notice
          key={ref}
          tone="warning"
          role="region"
          actions={
            <button type="button" onClick={() => acc.payGroup(ref)} disabled={acc.busy[`group-${ref}`]} className={btn("indigo", "md")} data-testid="pay-group">
              {acc.busy[`group-${ref}`] ? t(C.groupPayStarting) : pc("payGroup", bucket.count, { amount: moneyText(bucket.total) })}
            </button>
          }
        >
          <span data-testid="group-banner">{pc("groupBanner", bucket.count, { ref })}</span>
        </Notice>
      ))}
      {filter ? (
        <Notice
          tone="info"
          actions={
            <button type="button" onClick={() => setFilter(null)} className={btn("outline", "md")}>
              {t(C.showAll)}
            </button>
          }
        >
          {t(C.showingGroup)}
        </Notice>
      ) : null}
      {visible.length ? (
        <Panel>
          <div className="divide-y divide-[var(--vd-line)]" data-testid="orders-list">
            {visible.map((order) => (
              <OrderCard key={order.id} order={order} onGroup={(o) => setFilter(new Set([o.order_number, ...(o.sibling_order_numbers || [])]))} />
            ))}
          </div>
          {acc.ordersMore && !filter ? (
            <div className="mt-5 flex justify-center border-t border-[var(--vd-line)] pt-5">
              <button type="button" onClick={acc.loadMoreOrders} disabled={acc.busy.more} className={btn("soft", "lg")} data-testid="orders-more">
                {acc.busy.more ? t(C.loadingMore) : t(C.loadMoreOrders)}
              </button>
            </div>
          ) : null}
        </Panel>
      ) : (
        <EmptyState
          icon={PackageOpen}
          title={t(C.ordersEmptyTitle)}
          text={t(C.ordersEmptyText)}
          headingLevel={3}
          compact
          actions={
            <Link href={link("/browse")} className={btn("indigo", "lg")}>
              {t(C.browseAuctions)}
            </Link>
          }
        />
      )}
      <DeliverySupport />
    </div>
  );
}

function DeliveryRecord({ record }) {
  const { t } = useLang();
  const pickup = record.fulfillment_type === "pickup";
  const url = record.tracking_url || record.oto_tracking_url;
  return (
    <li className="grid gap-1.5 rounded-[16px] bg-[#f6f8fc] p-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="vd-md font-bold text-[var(--vd-ink)]">
          {t(pickup ? C.pickup : C.delivery)} · {t(fulfilmentStatus(record.status).label)}
        </p>
        <p className="vd-sm text-[var(--vd-muted)]">{record.courier_name ? t(C.courier, { name: record.courier_name }) : t(C.courierNone)}</p>
      </div>
      <p className="vd-sm text-[var(--vd-ink)]/80">
        {record.tracking_number ? (
          <>
            {t(C.trackingNumber)}
            <Ltr className="font-semibold">{record.tracking_number}</Ltr>
          </>
        ) : (
          t(C.trackingAfterDispatch)
        )}
      </p>
      {record.pickup_code ? (
        <p className="vd-sm text-[var(--vd-ink)]">
          {t(C.pickupCode)}
          <Ltr className="font-extrabold tracking-[0.12em]">{record.pickup_code}</Ltr>
        </p>
      ) : null}
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="vd-link inline-flex w-fit items-center gap-1.5 vd-sm font-bold text-[var(--vd-indigo)]">
          {t(C.liveMap)}
        </a>
      ) : !pickup ? (
        <p className="vd-xs text-[var(--vd-muted)]">{t(C.mapLater)}</p>
      ) : null}
    </li>
  );
}

/** Order details (spec A §8.6). */
export function OrderDrawer() {
  const { t } = useLang();
  const { link } = useConcept();
  const acc = useAccount();
  const { dateTime } = useDates();
  const panel = acc.orderPanel;
  const current = panel ? panel.detail || panel.order : null;
  const close = () => acc.setOrderPanel(null);
  const invoice = current ? acc.invoiceFor(current) : null;
  const product = current ? getProduct(current.item) : null;
  const seller = current ? getSeller(current.seller) : null;
  const applied = num(current?.wallet_amount_applied);
  const due = num(current?.amount_due);
  const discount = num(current?.discount_amount);
  const records = current ? (acc.tracking?.order?.id === current.id ? acc.tracking.fulfillments : current.fulfillments) || [] : [];
  // Platform orders show the backend's owner label, as in production (quirk Q20).
  const fulfilledBy = current ? (current.seller === "KHAZNA" ? t(C.adminMain) : seller ? t(seller.name) : t(C.khaznah)) : "";
  return (
    <SidePanel
      open={Boolean(panel)}
      onClose={close}
      title={t(C.orderDetails)}
      width="lg"
      testId="order-drawer"
      footer={
        current ? (
          <>
            <button type="button" onClick={() => acc.trackOrder(current)} disabled={acc.busy[`track-${current.id}`]} className={btn("outline", "md", "h-11")}>
              {acc.busy[`track-${current.id}`] ? t(C.loadingTracking) : t(C.trackDelivery)}
            </button>
            {isPendingPayment(current) ? (
              <button type="button" onClick={() => acc.payOrder(current)} disabled={acc.busy[`pay-${current.id}`]} className={btn("indigo", "md", "h-11")}>
                {acc.busy[`pay-${current.id}`] ? t(C.creatingPayment) : t(C.payOrder)}
              </button>
            ) : null}
            {invoice ? (
              <button type="button" onClick={() => acc.downloadInvoice(invoice)} disabled={acc.busy[`invoice-${invoice.id}`]} className={btn("soft", "md", "h-11")}>
                {acc.busy[`invoice-${invoice.id}`] ? t(C.generatingInvoice) : t(C.downloadInvoicePdf)}
              </button>
            ) : null}
            {/* Only changes the address bar: production reads no ?order= (quirk Q29). */}
            <Link href={link(`/account?tab=orders&order=${current.id}`)} scroll={false} className={btn("soft", "md", "h-11")}>
              {t(C.keepSelected)}
            </Link>
          </>
        ) : null
      }
    >
      {current ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
          {panel.loading ? <Spinner label={t(C.loadingOrder)} showLabel /> : null}
          {panel.error ? (
            <Notice
              tone="danger"
              role="alert"
              title={t(C.orderFailed)}
              actions={
                <button type="button" onClick={() => acc.openOrder(panel.order)} className={btn("outline", "md")}>
                  {t(C.retry)}
                </button>
              }
            />
          ) : null}
          <div className="flex items-start gap-4">
            <Thumb slug={current.item} size="lg" alt={product ? t(product.title) : t(C.orderItem)} />
            <div className="min-w-0">
              <p className="vd-kicker text-[#7a4e0c]">
                <Ltr>{current.order_number || t(C.orderHash, { id: current.id })}</Ltr>
              </p>
              <h3 className="mt-1 vd-h3">
                <bdi dir="auto">{itemTitle(current, t) || t(C.marketplaceOrder)}</bdi>
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <Status status={orderStatus(current.status)} />
                {current.payment_status ? <Status status={current.payment_status === "paid" ? { label: C.paid, tone: "success" } : { label: C.paymentPending, tone: "warning" }} /> : null}
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {[
              { label: C.orderTotal, value: <Money value={num(current.total_amount)} /> },
              applied > 0 ? { label: C.walletAppliedTile, value: <Money value={applied} /> } : null,
              current.order_type === "auction_win" && due > 0 ? { label: C.remainingDue, value: <Money value={due} /> } : null,
              { label: C.orderStatusTile, value: t(fulfilmentStatus(current.fulfillment_status).label) },
              { label: C.deliveryMethod, value: t(current.delivery_method === "pickup" ? C.pickup : C.homeDelivery) },
              { label: C.placedOn, value: current.created_at ? <Ltr>{dateTime(current.created_at)}</Ltr> : "—" },
              current.payment_due_at ? { label: C.paymentDue, value: <Ltr>{dateTime(current.payment_due_at)}</Ltr> } : null,
              { label: C.fulfilledBy, value: fulfilledBy },
            ]
              .filter(Boolean)
              .map((item) => (
                <Tile key={item.label.en} className="min-w-0">
                  <dt className="vd-xs font-semibold text-[var(--vd-muted)]">{t(item.label)}</dt>
                  <dd className="mt-0.5 break-words vd-md font-bold text-[var(--vd-ink)]">{item.value}</dd>
                </Tile>
              ))}
          </dl>

          {panel.detail && product ? (
            <section aria-labelledby="drawer-items" className="grid grid-cols-[minmax(0,1fr)] gap-2">
              <h4 id="drawer-items" className="vd-md font-bold">
                {t(C.items)}
              </h4>
              <div className="flex items-center justify-between gap-3 rounded-[16px] bg-[#f6f8fc] p-3.5">
                <div className="min-w-0">
                  <p className="truncate vd-md font-bold text-[var(--vd-ink)]">
                    <bdi dir="auto">{t(product.title)}</bdi>
                  </p>
                  <p className="vd-xs text-[var(--vd-muted)]">
                    <Ltr>{product.lot}</Ltr>
                    {t(C.qty)}
                    <Ltr>{current.quantity ?? 1}</Ltr>
                  </p>
                </div>
                <Money value={num(current.subtotal ?? current.total_amount)} className="shrink-0 vd-md font-extrabold" />
              </div>
            </section>
          ) : null}

          <section aria-labelledby="drawer-price" className="rounded-[20px] border border-[var(--vd-line)] p-4">
            <h4 id="drawer-price" className="vd-md font-bold">
              {t(C.priceBreakdown)}
            </h4>
            <dl className="mt-3 grid gap-2">
              {/* Production's subtotal is already discounted and the coupon line is listed as well, so the lines do not add up (quirk Q11). */}
              <SummaryRow label={t(C.subtotal)} amount={num(current.subtotal ?? current.total_amount)} />
              {discount > 0 ? <SummaryRow label={`${t(C.couponApplied)}${current.discount_code ? ` (${current.discount_code})` : ""}`} tone="saving" value={<span dir="ltr">−<Money value={discount} /></span>} /> : null}
              {num(current.customer_delivery_charge) > 0 ? <SummaryRow label={t(C.delivery)} amount={num(current.customer_delivery_charge)} /> : null}
              {num(current.cod_surcharge_amount) > 0 ? <SummaryRow label={t(C.codSurcharge)} amount={num(current.cod_surcharge_amount)} /> : null}
              {current.vat_amount != null ? <SummaryRow label={t(C.vatIncluded)} amount={num(current.vat_amount)} /> : null}
              <SummaryRow label={t(C.totalLabel)} amount={num(current.total_amount)} strong className="mt-1 border-t border-[var(--vd-line)] pt-3" />
            </dl>
          </section>

          <section aria-labelledby="drawer-delivery" className="grid grid-cols-[minmax(0,1fr)] gap-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h4 id="drawer-delivery" className="vd-md font-bold">
                  {t(C.deliveryDetails)}
                </h4>
                <p className="vd-xs text-[var(--vd-muted)]">{t(C.whereNow)}</p>
              </div>
              <Status status={fulfilmentStatus(current.fulfillment_status)} />
            </div>
            {records.length && panel.detail ? (
              <ul className="grid grid-cols-[minmax(0,1fr)] gap-2">
                {records.map((record) => (
                  <DeliveryRecord key={record.id} record={record} />
                ))}
              </ul>
            ) : (
              <p className={cx("rounded-[16px] border border-dashed border-[#cfdaea] p-3.5 vd-sm text-[var(--vd-muted)]")}>{t(C.preparing)}</p>
            )}
          </section>
        </div>
      ) : null}
    </SidePanel>
  );
}
