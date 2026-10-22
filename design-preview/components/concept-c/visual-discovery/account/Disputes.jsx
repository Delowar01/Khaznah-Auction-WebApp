"use client";

// Disputes (spec B §3): the 8 newest cases (case, related order, status,
// reason, updated date; cancel only while open, after a confirmation), and
// the New dispute form: one loaded order (the first chosen), the issue
// type, a 10–2000 character description with its counter, the chosen
// order's summary and evidence files (images or video, sent one by one,
// then the case). Production kept: "View" only changes the address (no
// case page exists), and a direct visit to this section has no orders to
// choose until Overview, Won or Orders has loaded them (quirk). The native
// confirm box becomes an accessible dialog with the same question.
import Link from "next/link";
import { useId, useState } from "react";
import { MessageSquareWarning, Paperclip, RefreshCw } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { EmptyState, Notice, Panel, PanelHead } from "../kit/Blocks";
import { Field, RadioCard, Select, TextArea } from "../kit/Form";
import { Dialog } from "../kit/Overlay";
import { btn, cx } from "../ui";
import { ACCOUNT_COPY as C } from "./copy";
import { Ltr, Status, Thumb, num, useAccount, useDates, usePlural } from "./parts";
import { disputeStatus, fulfilmentStatus, orderStatus } from "./status";
import { itemTitle } from "./Won";

function CancelButton({ onClick }) {
  const { t } = useLang();
  return (
    <button type="button" onClick={onClick} className="inline-flex h-10 items-center rounded-full border border-[#f3c9c5] bg-white px-4 vd-sm font-semibold text-[#a61b18] hover:bg-[#fdf1f0]" data-testid="cancel-dispute">
      {t(C.cancel)}
    </button>
  );
}

export function Disputes() {
  const { t } = useLang();
  const { link } = useConcept();
  const acc = useAccount();
  const { date } = useDates();
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const rows = acc.has("disputes") ? acc.disputes : [];
  const viewHref = (row) => link(`/account?tab=disputes&case=${row.id}`);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <Panel>
        <PanelHead
          as="h3"
          title={t(C.disputesTitle)}
          note={t(C.disputesText)}
          actions={
            <>
              <button type="button" onClick={acc.refresh} className={btn("soft", "md", "h-11")}>
                <RefreshCw aria-hidden="true" className={cx("size-4", acc.refreshing && "animate-spin motion-reduce:animate-none")} strokeWidth={2.2} />
                {t(C.refresh)}
              </button>
              <button type="button" onClick={() => acc.setDisputeOpen(true)} className={btn("gold", "md", "h-11")} data-testid="new-dispute">
                {t(C.newDispute)}
              </button>
            </>
          }
        />
      </Panel>
      {rows.length ? (
        <Panel>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-2.5 md:hidden">
            {rows.map((row) => (
              <li key={row.id} className="rounded-[18px] border border-[var(--vd-line)] p-3.5" data-testid="dispute-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="vd-kicker text-[#7a4e0c]">
                      {t(C.caseLabel)} <Ltr>{row.id}</Ltr>
                    </p>
                    <p className="mt-1 vd-md font-bold text-[var(--vd-ink)]">{row.order_number ? <Ltr>{row.order_number}</Ltr> : t(C.relatedOrder)}</p>
                    <p className="mt-1 line-clamp-2 vd-sm text-[var(--vd-muted)]">
                      <bdi dir="auto">{row.reason ? t(row.reason) : t(C.reasonNotSpecified)}</bdi>
                    </p>
                  </div>
                  <Status status={row.status ? disputeStatus(row.status) : disputeStatus("open")} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--vd-line)] pt-2.5">
                  <span className="vd-xs text-[var(--vd-muted)]">{row.updated_at ? <Ltr>{date(row.updated_at, true)}</Ltr> : t(C.noUpdateDate)}</span>
                  <div className="flex items-center gap-2">
                    <Link href={viewHref(row)} scroll={false} className="vd-link inline-flex h-10 items-center px-2 vd-sm font-bold text-[var(--vd-indigo)]">
                      {t(C.view)}
                    </Link>
                    {row.status === "open" ? <CancelButton onClick={() => setConfirm(row)} /> : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="overflow-hidden rounded-[18px] border border-[var(--vd-line)] max-md:hidden">
            <table className="w-full vd-sm" data-testid="disputes-table">
              <thead className="bg-[#f6f8fc]">
                <tr>
                  {[C.thCase, C.thOrder, C.thStatus, C.thReason, C.thUpdated, C.thAction].map((header, i) => (
                    <th key={i} scope="col" className="px-4 py-2.5 text-start vd-xs font-bold text-[var(--vd-muted)]">
                      {t(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--vd-line)]">
                {rows.map((row) => (
                  <tr key={row.id} className="align-top" data-testid="dispute-row">
                    <td className="px-4 py-3 font-bold text-[var(--vd-ink)]">
                      <Ltr>{row.id}</Ltr>
                    </td>
                    <td className="px-4 py-3 text-[var(--vd-ink)]">{row.order_number ? <Ltr>{row.order_number}</Ltr> : t(C.orderLabel)}</td>
                    <td className="px-4 py-3">
                      <Status status={row.status ? disputeStatus(row.status) : disputeStatus("open")} />
                    </td>
                    <td className="max-w-[18rem] px-4 py-3 text-[var(--vd-muted)]">
                      <bdi dir="auto">{row.reason ? t(row.reason) : t(C.notSpecified)}</bdi>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--vd-muted)]">{row.updated_at ? <Ltr>{date(row.updated_at, true)}</Ltr> : "-"}</td>
                    <td className="px-4 py-3">
                      <div className="grid justify-items-start gap-1.5">
                        <Link href={viewHref(row)} scroll={false} className="vd-link vd-sm font-bold text-[var(--vd-indigo)]">
                          {t(C.viewCase)}
                        </Link>
                        {row.status === "open" ? <CancelButton onClick={() => setConfirm(row)} /> : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <EmptyState icon={MessageSquareWarning} title={t(C.noDisputes)} headingLevel={3} compact />
      )}
      <Dialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        size="sm"
        title={t(C.cancelConfirm)}
        description={confirm ? `${t(C.caseLabel)} ${confirm.id} · ${confirm.order_number}` : null}
        testId="cancel-dispute-dialog"
        footer={
          <>
            <button type="button" onClick={() => setConfirm(null)} className={btn("outline", "lg")} data-autofocus>
              {t(C.keepDispute)}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await acc.cancelDispute(confirm);
                setBusy(false);
                setConfirm(null);
              }}
              className={btn("danger", "lg")}
              data-testid="confirm-cancel-dispute"
            >
              {t(C.cancelDispute)}
            </button>
          </>
        }
      />
    </div>
  );
}

const TYPES = ["return_request", "damaged_item", "wrong_item", "delivery_issue", "payment_issue", "other"];

function DisputeForm({ onClose }) {
  const { t } = useLang();
  const acc = useAccount();
  const pc = usePlural();
  const fileId = useId();
  const orders = acc.has("orders") ? acc.orders : [];
  const [orderId, setOrderId] = useState(orders[0] ? String(orders[0].id) : "");
  const [type, setType] = useState("return_request");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const order = orders.find((o) => String(o.id) === orderId);
  const length = reason.trim().length;
  const short = length < 10;
  const ready = Boolean(order) && !short && !submitting;
  const submit = async (event) => {
    event.preventDefault();
    if (!ready) return;
    setSubmitting(true);
    setError("");
    try {
      await acc.createDispute({ order, type, reason: reason.trim(), files });
      onClose();
    } catch (failure) {
      setError(failure?.en ? t(failure) : t(C.disputeFailed));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form onSubmit={submit} className="grid grid-cols-[minmax(0,1fr)] gap-5" noValidate>
      {error ? (
        <Notice tone="danger" role="alert">
          {error}
        </Notice>
      ) : null}
      <fieldset className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2">
        <legend className="vd-md font-semibold text-[var(--vd-ink)]">{t(C.orderLabel)}</legend>
        {orders.length ? (
          <div role="radiogroup" aria-label={t(C.selectOrder)} className="grid max-h-56 grid-cols-[minmax(0,1fr)] gap-2 overflow-y-auto p-0.5">
            {orders.map((o) => (
              <RadioCard key={o.id} name="dispute-order" value={String(o.id)} checked={orderId === String(o.id)} onChange={() => setOrderId(String(o.id))} className="!p-3">
                <span className="flex items-center gap-3">
                  <Thumb slug={o.item} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate vd-md font-bold text-[var(--vd-ink)]">
                      <bdi dir="auto">{itemTitle(o, t) || t(C.orderHash, { id: o.id })}</bdi>
                    </span>
                    <span className="block vd-xs text-[var(--vd-muted)]">
                      <Ltr>{o.order_number || `#${o.id}`}</Ltr> · <Money value={num(o.total_amount)} />
                    </span>
                  </span>
                </span>
              </RadioCard>
            ))}
          </div>
        ) : (
          <div data-testid="dispute-no-orders">
            <Notice tone="warning">{t(C.noOrdersNotice)}</Notice>
          </div>
        )}
      </fieldset>
      <Field label={t(C.issueType)}>
        {(ids) => (
          <Select {...ids} value={type} onChange={(event) => setType(event.target.value)}>
            {TYPES.map((key) => (
              <option key={key} value={key}>
                {t(C.issueTypes[key])}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field
        label={
          <span>
            {t(C.description)} <span className="vd-xs font-normal text-[var(--vd-muted)] tabular">({reason.length}/2000)</span>
          </span>
        }
        hint={short ? t(C.descriptionShort, { n: 10 - length }) : t(C.descriptionOk)}
      >
        {(ids) => <TextArea {...ids} rows={4} maxLength={2000} value={reason} onChange={(event) => setReason(event.target.value.slice(0, 2000))} placeholder={t(C.descriptionPlaceholder)} data-testid="dispute-reason" />}
      </Field>
      {order ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[18px] bg-[#f6f8fc] p-3.5" data-testid="dispute-summary">
          <Thumb slug={order.item} size="md" />
          <div className="min-w-0 flex-1 basis-44">
            <p className="vd-xs font-bold text-[#7a4e0c]">
              <Ltr>{order.order_number}</Ltr>
            </p>
            <p className="truncate vd-md font-bold text-[var(--vd-ink)]">
              <bdi dir="auto">{itemTitle(order, t) || t(C.orderItem)}</bdi>
            </p>
            <p className="vd-xs text-[var(--vd-muted)]">
              {t(order.order_type === "auction_win" ? C.auctionOrder : C.buyNowOrder)} · {t(fulfilmentStatus(order.fulfillment_status).label)} · <Money value={num(order.total_amount)} />
            </p>
          </div>
          <Status status={order.payment_status === "paid" ? { label: C.paid, tone: orderStatus(order.status).tone } : orderStatus(order.status)} />
        </div>
      ) : null}
      <div className="grid gap-1.5">
        <label htmlFor={fileId} className="grid cursor-pointer justify-items-center gap-1.5 rounded-[18px] border-[1.5px] border-dashed border-[#b6c6df] bg-white px-4 py-5 text-center hover:border-[var(--vd-indigo)] focus-within:border-[var(--vd-indigo)]">
          <Paperclip aria-hidden="true" className="size-5 text-[var(--vd-indigo)]" strokeWidth={2} />
          <span className="vd-md font-bold text-[var(--vd-ink)]">{t(C.uploadTitle)}</span>
          <span className="vd-xs text-[var(--vd-muted)]">{t(C.uploadHelp)}</span>
          <input id={fileId} type="file" accept="image/*,video/*" multiple onChange={(event) => setFiles([...(event.target.files || [])])} className="sr-only" data-testid="dispute-files" />
        </label>
        {files.length ? <p className="vd-xs text-[var(--vd-ink)]">{files.map((file) => file.name).join(", ")}</p> : null}
      </div>
      {!ready && !submitting ? (
        <p className="text-end vd-xs text-[var(--vd-muted)]" data-testid="dispute-hint">
          {!order ? t(C.hintSelectOrder) : pc("moreChars", 10 - length)}
        </p>
      ) : null}
      <div className="flex flex-wrap justify-end gap-2 max-sm:[&>*]:flex-1">
        <button type="button" onClick={onClose} className={btn("outline", "lg")}>
          {t(C.cancel)}
        </button>
        <button type="submit" disabled={!ready} className={btn("gold", "lg")} data-testid="submit-dispute">
          {submitting ? t(C.submitting) : t(C.submitRequest)}
        </button>
      </div>
    </form>
  );
}

/** New dispute (spec B §3.1 item 4), opened from this section or the alert bar. */
export function DisputeModal() {
  const { t } = useLang();
  const acc = useAccount();
  const close = () => acc.setDisputeOpen(false);
  return (
    <Dialog
      open={acc.disputeOpen}
      onClose={close}
      size="wide"
      title={t(C.disputeModal)}
      testId="dispute-modal"
    >
      {acc.disputeOpen ? <DisputeForm onClose={close} /> : null}
    </Dialog>
  );
}
