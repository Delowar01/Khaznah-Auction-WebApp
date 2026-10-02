"use client";

import { useId } from "react";
import { Clock3, Gavel, RotateCcw, ScrollText, ShieldCheck, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useAuctionTerms } from "@/components/shared/auction/hooks";
import { cx } from "../ui/cx";

const ICONS = { deposit: ShieldCheck, snipe: Timer, payment: Clock3, increment: Gavel, binding: ScrollText, returns: RotateCcw };

/** Deposit, anti-sniping, payment window, increment, binding bids and returns. */
export function AuctionTerms({ product, className = "" }) {
  const { ui } = useLang();
  const headingId = useId();
  const items = useAuctionTerms(product);
  return (
    <section aria-labelledby={headingId} className={cx("rounded-xl border border-line bg-surface", className)}>
      <h2 id={headingId} className="flex items-center gap-2 border-b border-line px-4 py-3 kb-md font-bold text-fg">
        <ScrollText aria-hidden="true" className="size-4 text-primary" />
        {ui("auctionTerms")}
      </h2>
      <ul className="grid gap-3 p-4">
        {items.map((item) => {
          const Icon = ICONS[item.key];
          return (
            <li key={item.key} className="flex items-start gap-3 kb-sm text-fg-2">
              <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fg-3" />
              <span>{item.text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
