"use client";

// Overview (spec A §5): four production figures (active bids, watchlist,
// awaiting payment, invoices — each the loaded first page), then the wallet
// card and the orders card. No new metrics.
import { FileText, Gavel, Heart, Trophy, Wallet } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { IconDisk, Panel } from "../kit/Blocks";
import { btn } from "../ui";
import { ACCOUNT_COPY as C } from "./copy";
import { num, useAccount } from "./parts";

function Mini({ icon: Icon, label, value, testId }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-[20px] border border-[var(--vd-line)] bg-white p-4" data-testid={testId}>
      <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[#fdf1d8] text-[#7a4e0c]">
        <Icon className="size-[18px]" strokeWidth={2} />
      </span>
      <div>
        <p className="vd-h2 !text-[28px] !leading-8 text-[var(--vd-ink)] tabular">{value}</p>
        <p className="mt-1 vd-sm text-[var(--vd-muted)]">{label}</p>
      </div>
    </div>
  );
}

export function Overview() {
  const { t } = useLang();
  const acc = useAccount();
  const pending = acc.counts.pending;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Mini icon={Gavel} label={t(C.activeBids)} value={acc.has("bids") ? acc.bids.length : 0} testId="mini-bids" />
        <Mini icon={Heart} label={t(C.watchlistTile)} value={acc.has("watchlist") ? acc.watchRows.all : 0} testId="mini-watchlist" />
        <Mini icon={Trophy} label={t(C.awaitingPayment)} value={pending} testId="mini-pending" />
        <Mini icon={FileText} label={t(C.invoicesTile)} value={acc.invoices.length} testId="mini-invoices" />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 min-[420px]:grid-cols-2">
        <Panel className="flex flex-col">
          <div className="flex items-center gap-3">
            <IconDisk icon={Wallet} />
            <h3 className="vd-h3">{t(C.walletCard)}</h3>
          </div>
          <p className="mt-4 vd-h2 text-[var(--vd-indigo)]">
            <Money value={num(acc.wallet?.balance)} symbolClassName="text-[0.7em]" />
          </p>
          <p className="mt-1 vd-sm text-[var(--vd-muted)]">{t(C.availableBalance)}</p>
          <button type="button" onClick={() => acc.onTab("wallet")} className={btn("indigo", "lg", "mt-5 w-full")}>
            {t(C.openWallet)}
          </button>
        </Panel>
        <Panel className="flex flex-col">
          <div className="flex items-center gap-3">
            <IconDisk icon={FileText} />
            <h3 className="vd-h3">{t(C.ordersCard)}</h3>
          </div>
          <p className="mt-4 vd-h2 text-[var(--vd-ink)] tabular">{acc.counts.orders}</p>
          <p className="mt-1 vd-sm text-[var(--vd-muted)]">{pending > 0 ? t(C.needPayment, { n: pending }) : t(C.upToDate)}</p>
          <button type="button" onClick={() => acc.onTab("orders")} className={btn("outline", "lg", "mt-5 w-full")}>
            {t(C.viewOrders)}
          </button>
        </Panel>
      </div>
    </div>
  );
}
