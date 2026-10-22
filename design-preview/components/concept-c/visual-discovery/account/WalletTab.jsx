"use client";

// Wallets & Deposits (spec B §1): the balance and its status, production's
// quick amounts (50/100/250/500, chosen by exact text) and free top-up
// amount (checked by the server: a number, at least the minimum, two
// decimals — the messages show in the wallet banner), saved cards (make
// default, auto-pay on/off, remove — no confirmation, as in production),
// the last 8 ledger entries and the auction deposits. One gold banner
// reports every wallet action, success or not, and stays across sections.
import Link from "next/link";
import { useState } from "react";
import { CreditCard, RotateCcw } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { Notice, Tile } from "../kit/Blocks";
import { Field, TextInput } from "../kit/Form";
import { btn, cx } from "../ui";
import { ACCOUNT_COPY as C } from "./copy";
import { Ltr, Section, Status, num, useAccount, usePlural } from "./parts";
import { paymentRecordStatus, transactionDirection, transactionStatus, transactionType, walletStatus } from "./status";

const QUICK = [50, 100, 250, 500];

function Balance() {
  const { t } = useLang();
  const acc = useAccount();
  const [amount, setAmount] = useState("50");
  const wallet = acc.wallet;
  return (
    <Section title={t(C.walletBalance)} id="wallet-balance">
      <p className="truncate vd-h2 text-[var(--vd-indigo)]" data-testid="wallet-balance">
        {wallet ? <Money value={num(wallet.balance)} symbolClassName="text-[0.7em]" /> : t(C.walletLoading)}
      </p>
      <p className="mt-1 vd-sm text-[var(--vd-muted)]">
        {t(C.status)}: {wallet?.status ? t(walletStatus(wallet.status).label) : t(C.statusLoading)} · {t(C.saudiRiyal)}
      </p>
      {acc.failing ? (
        <Notice
          tone="warning"
          role="alert"
          className="mt-4"
          actions={
            <button type="button" onClick={acc.retryWallet} className="inline-flex items-center gap-1.5 vd-md font-bold text-[var(--vd-indigo)] hover:underline">
              <RotateCcw aria-hidden="true" className="size-4" strokeWidth={2.2} />
              {t(C.walletRetry)}
            </button>
          }
        >
          {t(C.walletRefreshFailed)}
        </Notice>
      ) : null}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          acc.topUp(amount);
        }}
        className="mt-5 grid gap-3"
      >
        <fieldset>
          <legend className="sr-only">{t(C.quickAmounts)}</legend>
          <div className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-4">
            {QUICK.map((value) => {
              const on = amount === String(value);
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setAmount(String(value))}
                  className={cx("h-11 rounded-full border vd-sm font-bold transition-colors", on ? "border-[var(--vd-gold)] bg-[#fdf4e2] text-[var(--vd-ink)]" : "border-[var(--vd-line)] bg-white text-[var(--vd-ink)] hover:border-[#b6c6df]")}
                >
                  <Money value={value} />
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="flex flex-wrap items-end gap-2">
          <Field label={t(C.topUpAmount)} labelHidden className="min-w-0 flex-1 basis-36">
            {(ids) => <TextInput {...ids} ltr inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder={t(C.topUpAmount)} data-testid="topup-amount" />}
          </Field>
          <button type="submit" disabled={acc.walletAction.loading} className={btn("gold", "lg")} data-testid="topup">
            {t(C.topUp)}
          </button>
        </div>
      </form>
    </Section>
  );
}

function Methods() {
  const { t } = useLang();
  const { link } = useConcept();
  const acc = useAccount();
  return (
    <Section title={t(C.savedMethods)} note={t(C.securelyStored)} id="wallet-methods">
      {acc.methods.length ? (
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
          {acc.methods.map((method) => (
            <li key={method.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[var(--vd-line)] p-3.5" data-testid="saved-method">
              <div className="flex min-w-0 items-center gap-3">
                <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[var(--vd-bluegray)] text-[var(--vd-indigo)]">
                  <CreditCard className="size-5" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="truncate vd-md font-bold text-[var(--vd-ink)]">
                    {method.display_label ? <Ltr>{method.display_label}</Ltr> : t(C.methodEnding, { brand: method.brand || t(C.paymentCard), last4: method.last4 || "----" })}
                  </p>
                  <p className="vd-xs text-[var(--vd-muted)]">
                    {t(method.is_default ? C.defaultMethod : C.savedMethod)}
                    {t(C.autoPay)}
                    {t(method.consent_for_auto_charge ? C.autoOn : C.autoOff)}
                  </p>
                </div>
              </div>
              <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto">
                <button type="button" onClick={() => acc.methodAction("default", method)} className={btn("soft", "sm", "h-10 px-3")}>
                  {t(C.makeDefault)}
                </button>
                <button type="button" onClick={() => acc.methodAction("auto", method)} className={btn("soft", "sm", "h-10 px-3")}>
                  {t(method.consent_for_auto_charge ? C.disableAuto : C.allowAuto)}
                </button>
                <button type="button" onClick={() => acc.methodAction("remove", method)} className="inline-flex h-10 items-center justify-center rounded-full border border-[#f3c9c5] bg-white px-3 vd-sm font-semibold text-[#a61b18] hover:bg-[#fdf1f0]" data-testid="remove-method">
                  {t(C.removeMethod)}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-[18px] bg-[#f6f8fc] p-4 vd-md text-[var(--vd-muted)]">{t(C.noMethods)}</p>
      )}
      <Tile className="mt-4 grid justify-items-start gap-2 !p-4">
        <p className="vd-md font-bold text-[var(--vd-ink)]">{t(C.addMethod)}</p>
        <p className="vd-sm text-[var(--vd-muted)]">{t(C.addMethodText)}</p>
        <Link href={link("/checkout")} className={btn("indigo", "md", "mt-1")}>
          {t(C.payOnline)}
        </Link>
      </Tile>
    </Section>
  );
}

function Ledger() {
  const { t } = useLang();
  const acc = useAccount();
  const rows = acc.has("transactions") ? acc.transactions : [];
  const credit = (row) => String(row.direction).toLowerCase() === "credit";
  if (!rows.length) {
    return (
      <Section title={t(C.ledger)} id="wallet-ledger">
        <p className="rounded-[18px] bg-[#f6f8fc] p-4 vd-md text-[var(--vd-muted)]">{t(C.noTransactions)}</p>
      </Section>
    );
  }
  const headers = [C.colType, C.colDirection, C.colAmount, C.colBalance, C.colStatus, C.colReference];
  return (
    <Section title={t(C.ledger)} id="wallet-ledger">
      {/* Phones: one card per entry. */}
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-2.5 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-[18px] border border-[var(--vd-line)] p-3.5" data-testid="ledger-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="vd-md font-bold text-[var(--vd-ink)]">{row.transaction_type ? t(transactionType(row.transaction_type).label) : t(C.transaction)}</p>
                <p className="mt-0.5 truncate vd-xs text-[var(--vd-muted)]">{row.reference ? <Ltr>{row.reference}</Ltr> : t(C.noReference)}</p>
              </div>
              <div className="grid shrink-0 justify-items-end gap-1">
                <Money value={num(row.amount)} className={cx("vd-md font-extrabold", credit(row) ? "text-[var(--vd-grade-a)]" : "text-[var(--vd-ink)]")} />
                <Status status={transactionStatus(row.status)} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--vd-line)] pt-2.5 vd-xs text-[var(--vd-muted)]">
              <span>{row.direction ? t(transactionDirection(row.direction).label) : "—"}</span>
              <span>
                {t(C.balanceAfter)}
                <Money value={num(row.balance_after)} className="font-semibold text-[var(--vd-ink)]" />
              </span>
            </div>
          </li>
        ))}
      </ul>
      {/* From 768 px: the six production columns. */}
      <div className="overflow-hidden rounded-[18px] border border-[var(--vd-line)] max-md:hidden">
        <table className="w-full text-start vd-sm" data-testid="ledger-table">
          <thead className="bg-[#f6f8fc]">
            <tr>
              {headers.map((header) => (
                <th key={header.en} scope="col" className="px-4 py-2.5 text-start vd-xs font-bold text-[var(--vd-muted)]">
                  {t(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--vd-line)]">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 font-semibold text-[var(--vd-ink)]">{row.transaction_type ? t(transactionType(row.transaction_type).label) : ""}</td>
                <td className="px-4 py-3 text-[var(--vd-muted)]">{row.direction ? t(transactionDirection(row.direction).label) : ""}</td>
                <td className="px-4 py-3">
                  <Money value={num(row.amount)} className={cx("font-bold", credit(row) ? "text-[var(--vd-grade-a)]" : "text-[var(--vd-ink)]")} />
                </td>
                <td className="px-4 py-3">
                  <Money value={num(row.balance_after)} className="text-[var(--vd-ink)]" />
                </td>
                <td className="px-4 py-3">
                  <Status status={transactionStatus(row.status)} />
                </td>
                <td className="px-4 py-3 text-[var(--vd-muted)]">{row.reference ? <Ltr>{row.reference}</Ltr> : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function Deposits() {
  const { t } = useLang();
  const acc = useAccount();
  const pc = usePlural();
  const rows = (acc.has("payments") ? acc.payments : []).filter((row) => row.payment_type === "deposit" || row.payment_type === "high_value_deposit");
  return (
    <Section title={t(C.deposits)} note={pc("records", rows.length)} id="wallet-deposits">
      {rows.length ? (
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 rounded-[18px] bg-[#f6f8fc] p-3.5" data-testid="deposit-row">
              <div className="min-w-0">
                <p className="truncate vd-md font-bold text-[var(--vd-ink)]">{row.description ? t(row.description) : t(C.depositFallback)}</p>
                <p className="vd-xs text-[var(--vd-muted)]">{row.payment_number ? <Ltr>{row.payment_number}</Ltr> : t(C.recordFallback)}</p>
              </div>
              <div className="grid shrink-0 justify-items-end gap-1">
                <Money value={num(row.amount)} className="vd-md font-extrabold" />
                <Status status={paymentRecordStatus(row.status)} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-[18px] bg-[#f6f8fc] p-4 vd-md text-[var(--vd-muted)]">{t(C.noDeposits)}</p>
      )}
    </Section>
  );
}

export function WalletTab() {
  const { t } = useLang();
  const acc = useAccount();
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      {acc.walletAction.message ? (
        <div role="status" className="rounded-[18px] border border-[#ecd49a] bg-[#fdf4e2] px-4 py-3 vd-md font-semibold text-[var(--vd-ink)]" data-testid="wallet-banner">
          {t(acc.walletAction.message)}
        </div>
      ) : null}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 dt:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] dt:items-start">
        <Balance />
        <Methods />
      </div>
      <Ledger />
      <Deposits />
    </div>
  );
}
