"use client";

import { Clock3, Gavel, RotateCcw, ScrollText, ShieldCheck, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_POLICY } from "@/data/site";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

/** Deposit, anti-sniping, payment window, increment and returns. */
export function AuctionTerms({ product, className = "" }) {
  const { t, ui, money } = useLang();
  const items = [
    { key: "deposit", icon: ShieldCheck, text: t(COPY.termsDeposit, { amount: money(AUCTION_POLICY.depositAmount) }) },
    { key: "snipe", icon: Timer, text: ui("antiSnipe") },
    { key: "payment", icon: Clock3, text: t(COPY.termsPayment, { hours: AUCTION_POLICY.paymentWindowHours }) },
    { key: "increment", icon: Gavel, text: t(COPY.termsIncrement, { amount: money(product.increment) }) },
    { key: "binding", icon: ScrollText, text: ui("bindingBid") },
    { key: "returns", icon: RotateCcw, text: ui("returnsText") },
  ];
  return (
    <section aria-labelledby="kb-terms" className={cx("rounded-xl border border-line bg-surface", className)}>
      <h2 id="kb-terms" className="flex items-center gap-2 border-b border-line px-4 py-3 kb-md font-bold text-fg">
        <ScrollText aria-hidden="true" className="size-4 text-primary" />
        {ui("auctionTerms")}
      </h2>
      <ul className="grid gap-3 p-4">
        {items.map((item) => (
          <li key={item.key} className="flex items-start gap-3 kb-sm text-fg-2">
            <item.icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fg-3" />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
