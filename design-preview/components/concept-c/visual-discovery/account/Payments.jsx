"use client";

// Payment Methods (spec B §2) — despite its name, production's payment
// history, invoice centre and payment protection notes. Three figures over
// the loaded records (paid; pending or initiated; failed, cancelled or
// expired — refunds count in none), the history (cards on phones, a table
// from 768 px; "Open gateway" whenever a record has a gateway link), the
// invoices with their PDF download, and the two protection notes.
import { CircleAlert, CreditCard, RefreshCw, ShieldCheck, Wallet } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { Tile } from "../kit/Blocks";
import { btn } from "../ui";
import { ACCOUNT_COPY as C } from "./copy";
import { Ltr, Section, Status, num, useAccount, usePlural } from "./parts";
import { invoiceStatus, paymentRecordStatus } from "./status";

function GatewayLink({ row }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <a href={link(row.transaction_url)} target="_blank" rel="noreferrer" className="vd-link vd-sm font-bold text-[var(--vd-indigo)]">
      {t(C.openGateway)}
    </a>
  );
}

export function Payments() {
  const { t } = useLang();
  const acc = useAccount();
  const pc = usePlural();
  const records = acc.has("payments") ? acc.payments : [];
  const invoices = acc.invoices;
  const count = (set) => records.filter((row) => set.includes(row.status)).length;
  const tiles = [
    { icon: CreditCard, label: C.successfulPayments, value: count(["paid"]), tone: "bg-[#ddf4e6] text-[var(--vd-grade-a)]" },
    { icon: RefreshCw, label: C.pendingPayments, value: count(["pending", "initiated"]), tone: "bg-[#fdf1d8] text-[#7a4e0c]" },
    { icon: CircleAlert, label: C.needsAttention, value: count(["failed", "cancelled", "expired"]), tone: "bg-[#fde3e1] text-[#a61b18]" },
  ];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {tiles.map((tile) => (
          <div key={tile.label.en} className="min-w-0 rounded-[20px] border border-[var(--vd-line)] bg-white p-3 sm:p-4" data-testid="payment-tile">
            <span aria-hidden="true" className={`grid size-8 place-items-center rounded-full sm:size-9 ${tile.tone}`}>
              <tile.icon className="size-4" strokeWidth={2.2} />
            </span>
            <p className="mt-2.5 vd-h2 !text-[24px] !leading-8 text-[var(--vd-ink)] tabular sm:!text-[28px]">{tile.value}</p>
            <p className="vd-xs text-[var(--vd-muted)]">{t(tile.label)}</p>
          </div>
        ))}
      </div>

      <Section title={t(C.paymentHistory)} id="payment-history">
        {records.length ? (
          <>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-2.5 md:hidden">
              {records.map((row) => (
                <li key={row.id} className="rounded-[18px] border border-[var(--vd-line)] p-3.5" data-testid="payment-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate vd-md font-bold text-[var(--vd-ink)]">
                        <Ltr>{row.order_number || row.payment_number}</Ltr>
                      </p>
                      <p className="vd-xs text-[var(--vd-muted)]">{row.payment_number ? <Ltr>{row.payment_number}</Ltr> : t(C.noReference)}</p>
                    </div>
                    <Money value={num(row.amount)} className="shrink-0 vd-md font-extrabold text-[var(--vd-indigo)]" />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--vd-line)] pt-2.5">
                    <Status status={paymentRecordStatus(row.status)} />
                    {row.transaction_url ? <GatewayLink row={row} /> : <span className="vd-xs text-[var(--vd-muted)]">{t(C.recordedSecurely)}</span>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="overflow-hidden rounded-[18px] border border-[var(--vd-line)] max-md:hidden">
              <table className="w-full vd-sm" data-testid="payments-table">
                <thead className="bg-[#f6f8fc]">
                  <tr>
                    {[C.colEvent, C.colAmount, C.colStatus, C.colReference].map((header) => (
                      <th key={header.en} scope="col" className="px-4 py-2.5 text-start vd-xs font-bold text-[var(--vd-muted)]">
                        {t(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--vd-line)]">
                  {records.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3 font-semibold text-[var(--vd-ink)]">
                        <Ltr>{row.order_number || row.payment_number}</Ltr>
                      </td>
                      <td className="px-4 py-3">
                        <Money value={num(row.amount)} className="font-bold text-[var(--vd-indigo)]" />
                      </td>
                      <td className="px-4 py-3">
                        <Status status={paymentRecordStatus(row.status)} />
                      </td>
                      <td className="px-4 py-3 text-[var(--vd-muted)]">{row.transaction_url ? <GatewayLink row={row} /> : row.payment_number ? <Ltr>{row.payment_number}</Ltr> : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="rounded-[18px] bg-[#f6f8fc] p-4 vd-md text-[var(--vd-muted)]">{t(C.noPayments)}</p>
        )}
      </Section>

      <Section title={t(C.invoiceCentre)} note={pc("invoices", invoices.length)} id="invoice-centre">
        {invoices.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {invoices.map((invoice) => (
              <li key={invoice.id} className="grid gap-3 rounded-[18px] border border-[var(--vd-line)] p-4" data-testid="invoice-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="vd-kicker text-[#7a4e0c]">
                      <Ltr>{invoice.invoice_number || t(C.invoiceFallback, { id: invoice.id })}</Ltr>
                    </p>
                    <p className="mt-1 vd-md font-bold text-[var(--vd-ink)]">
                      <Ltr>{invoice.order_number || t(C.orderHash, { id: invoice.order })}</Ltr>
                    </p>
                  </div>
                  <Status status={invoiceStatus(invoice.status || "issued")} />
                </div>
                <Money value={num(invoice.total_amount ?? invoice.amount)} className="vd-lg font-extrabold" />
                <button type="button" onClick={() => acc.downloadInvoice(invoice)} disabled={acc.busy[`invoice-${invoice.id}`]} className={btn("soft", "md", "w-full")}>
                  {acc.busy[`invoice-${invoice.id}`] ? t(C.generating) : t(C.downloadInvoicePdf)}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[18px] border border-dashed border-[#cfdaea] p-4 vd-md text-[var(--vd-muted)]">{t(C.noInvoices)}</p>
        )}
      </Section>

      <Section title={t(C.protection)} id="payment-protection">
        <div className="grid gap-3 sm:grid-cols-2">
          <Tile className="flex gap-3 !p-4">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--vd-indigo)]" strokeWidth={2} />
            <div>
              <p className="vd-md font-bold">{t(C.gatewayPrivacy)}</p>
              <p className="mt-0.5 vd-sm text-[var(--vd-muted)]">{t(C.gatewayPrivacyText)}</p>
            </div>
          </Tile>
          <Tile className="flex gap-3 !p-4">
            <Wallet aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--vd-indigo)]" strokeWidth={2} />
            <div>
              <p className="vd-md font-bold">{t(C.manageMethods)}</p>
              <p className="mt-0.5 vd-sm text-[var(--vd-muted)]">{t(C.manageMethodsText)}</p>
            </div>
          </Tile>
        </div>
      </Section>
    </div>
  );
}
