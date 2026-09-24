"use client";

import { ShieldCheck, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { marketSaving } from "@/lib/catalog";
import { useCopy } from "../lib/useCopy";

/** Deposit status + anti-sniping note. */
export function DepositRow({ deposit, extended }) {
  const { ui } = useLang();
  const c = useCopy();
  return (
    <div className="space-y-2.5 text-[13px]">
      <div className="flex items-start gap-2.5">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
        <p className="min-w-0 flex-1 text-fg-2">
          <span className="text-fg">{ui("depositAmount")}</span> <Money value={deposit.required} className="d-num text-fg" />
          <span className="block text-success">{ui("depositCovered")}</span>
        </p>
        <span className="shrink-0 text-xs text-fg-3">
          {ui("wallet")} <Money value={deposit.walletBalance} className="d-num text-fg-2" />
        </span>
      </div>
      <div className="flex items-start gap-2.5">
        <Timer aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fg-3" />
        <p className="text-fg-3">
          {extended ? <span className="me-1.5 inline-flex rounded bg-warning/15 px-1.5 text-warning">{ui("timeExtended")}</span> : null}
          {ui("antiSnipe")}
        </p>
      </div>
    </div>
  );
}

/** Current bid positioned between the opening bid and the typical market price. */
export function MarketMeter({ product, currentBid }) {
  const { ui } = useLang();
  const c = useCopy();
  if (!product.marketPrice) return null;
  const start = product.startingBid;
  const span = product.marketPrice - start;
  const at = (value) => `${Math.min(100, Math.max(0, ((value - start) / span) * 100))}%`;
  const pct = marketSaving(product, currentBid);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="text-fg-3">{c("marketCompare")}</span>
        <span className={pct > 0 ? "font-medium text-success" : "text-fg-2"}>{pct > 0 ? ui("belowMarket", { pct }) : c("atMarket")}</span>
      </div>
      <div className="relative mt-2.5 h-2 rounded-full bg-[var(--d-track)]" aria-hidden="true">
        <div className="d-bar-fill absolute inset-y-0 start-0 rounded-full bg-[var(--d-chart)]" style={{ inlineSize: at(currentBid) }} />
        {product.buyNowPrice ? <span className="absolute -top-1 h-4 w-0.5 -translate-x-1/2 rounded-full bg-accent rtl:translate-x-1/2" style={{ insetInlineStart: at(product.buyNowPrice) }} /> : null}
      </div>
      <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 gap-y-1 text-[11px] text-fg-3">
        <span>
          {ui("startingBid")} <Money value={start} className="d-num text-fg-2" />
        </span>
        {product.buyNowPrice ? (
          <span className="flex items-center gap-1">
            <span aria-hidden="true" className="h-2.5 w-0.5 rounded-full bg-accent" />
            {c("buyNowMarker")}
          </span>
        ) : null}
        <span>
          {ui("marketPrice")} <Money value={product.marketPrice} className="d-num text-fg-2" />
        </span>
      </div>
    </div>
  );
}
