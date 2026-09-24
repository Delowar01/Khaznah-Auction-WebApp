"use client";

import { CircleCheck, Clock, ShieldCheck, TriangleAlert, Trophy } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { marketSaving } from "@/lib/catalog";
import { COPY } from "../copy";
import { cx } from "../ui/cx";

const BANNERS = {
  highest: { icon: CircleCheck, tone: "border-success/35 bg-success/8 text-success", title: "youAreWinning", text: COPY.bidLeading },
  outbid: { icon: TriangleAlert, tone: "border-warning/40 bg-warning/10 text-warning", title: "youAreOutbid", text: COPY.bidOutbid },
  won: { icon: Trophy, tone: "border-success/35 bg-success/8 text-success", title: "youWon", text: COPY.bidWon },
  lost: { icon: Clock, tone: "border-line bg-surface-2 text-fg-2", title: COPY.bidLostTitle, text: COPY.bidLost },
};

/** Bidder-state message: highest · outbid · won · lost. */
export function BidderBanner({ auction }) {
  const { t, ui, money } = useLang();
  const banner = BANNERS[auction.bidderState];
  if (!banner) return null;
  const Icon = banner.icon;
  const amount = auction.bidderState === "outbid" ? auction.minNext : auction.currentBid;
  return (
    <div role="status" className={cx("kz-fade-up flex gap-3 rounded-md border px-4 py-3", banner.tone)}>
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="font-semibold">{typeof banner.title === "string" ? ui(banner.title) : t(banner.title)}</p>
        <p className="mt-0.5 text-sm text-fg-2">{t(banner.text, { amount: money(amount) })}</p>
      </div>
    </div>
  );
}

/** Typical market price with a bar showing where the current bid sits. */
export function MarketCompare({ product, currentBid }) {
  const { ui } = useLang();
  if (!product.marketPrice) return null;
  const pct = marketSaving(product, currentBid);
  const ratio = Math.min(1, currentBid / product.marketPrice);
  return (
    <div className="rounded-md border border-line bg-surface-2/60 px-4 py-3">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-fg-2">{ui("marketPrice")}</span>
        <Money value={product.marketPrice} className="c-num font-semibold text-fg" />
      </div>
      <div aria-hidden="true" className="mt-2.5 h-1.5 overflow-hidden rounded-xs bg-line">
        <div className="h-full bg-primary transition-[width] duration-700" style={{ width: `${ratio * 100}%` }} />
      </div>
      {pct ? <p className="mt-2 text-sm font-semibold text-success">{ui("belowMarket", { pct })}</p> : null}
    </div>
  );
}

/** Deposit covered by wallet + anti-sniping rule. */
export function BidPolicyNotes({ auction }) {
  const { ui } = useLang();
  return (
    <ul className="space-y-2.5 text-sm">
      <li className="flex gap-2.5">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
        <span>
          <span className="block font-semibold text-fg">{ui("depositCovered")}</span>
          <span className="block text-fg-2">
            {ui("depositAmount")} <Money value={auction.deposit.required} className="c-num" /> · {ui("walletBalance")} <Money value={auction.deposit.walletBalance} className="c-num" />
          </span>
        </span>
      </li>
      <li className="flex gap-2.5">
        <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        <span className="text-fg-2">{ui("antiSnipe")}</span>
      </li>
    </ul>
  );
}
