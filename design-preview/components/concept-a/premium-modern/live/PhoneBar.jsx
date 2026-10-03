"use client";

import { Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useToastClearance } from "@/components/shared/auction/hooks";
import { Money } from "@/components/shared/ui/Money";
import { btn, cx } from "../ui";

const CLOCK = { calm: "text-fg", warn: "text-[var(--warning)]", final: "text-[var(--pr-timer)]", paused: "text-fg-2" };

/**
 * Below 1024 px: an ivory bar fixed at the foot (72 px above the safe area;
 * the page keeps the same space free under the footer) — the bid and the
 * lot clock, and the charcoal Bid with the exact next amount. Between lots:
 * the result and the wait. Toasts rise above it (useToastClearance).
 */
export function PhoneBar({ room }) {
  const { ui, money } = useLang();
  const barRef = useToastClearance();
  const { lot, lotInfo, clock, hammer, paused, minNext } = room;
  return (
    <div ref={barRef} className="fixed inset-x-0 bottom-0 z-30 border-t border-[#d3cfc6] bg-[#f8f7f3]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="pr-container flex h-[72px] items-center gap-3 max-[379px]:gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate pr-xs text-fg-2">{hammer ? hammer.label : lotInfo?.priceLabel}</p>
          <p className="flex flex-wrap items-baseline gap-x-2">
            {hammer && hammer.amount == null ? (
              <span className="pr-md font-semibold text-fg-2">{ui("passed")}</span>
            ) : lot ? (
              <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash rounded-[3px] pr-price-sm text-fg" symbolClassName="text-[0.78em]" />
            ) : null}
            {hammer ? null : (
              <span className={cx("pr-xs font-bold tabular", CLOCK[clock.tone])}>
                <span className="sr-only">{clock.spoken}</span>
                <span aria-hidden="true">{clock.text}</span>
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          aria-disabled={paused || undefined}
          aria-label={paused ? undefined : room.bidLabel(minNext)}
          onClick={() => room.bid(minNext)}
          className={btn("charcoal", "md", "min-w-0 px-5 aria-disabled:cursor-not-allowed aria-disabled:opacity-45 max-[379px]:px-3.5")}
          data-testid="live-bid-bar"
        >
          <Gavel aria-hidden="true" className="size-[18px] shrink-0 max-[379px]:hidden" strokeWidth={1.8} />
          <span className="truncate">{paused ? hammer?.nextLabel : ui("bidAmount", { amount: money(minNext) })}</span>
        </button>
      </div>
    </div>
  );
}
