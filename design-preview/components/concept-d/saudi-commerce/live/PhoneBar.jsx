"use client";

import { Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useToastClearance } from "@/components/shared/auction/hooks";
import { Money } from "@/components/shared/ui/Money";
import { btn, cx } from "../ui";

/**
 * Below 1024 px: a white bar fixed at the foot (74 px above the safe area;
 * the page keeps the same space free under the footer) — the bid, the red
 * lot clock and the green Bid with the exact next amount; the result and
 * the wait between lots. Toasts rise above it (useToastClearance).
 */
export function PhoneBar({ room }) {
  const { ui, money } = useLang();
  const barRef = useToastClearance();
  const { lot, lotInfo, clock, hammer, paused, minNext } = room;
  return (
    <div ref={barRef} className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--sc-line)] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-20px_rgb(16_33_57/0.45)] backdrop-blur-md lg:hidden">
      <div className="sc-container flex h-[74px] items-center gap-3 max-[379px]:gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate sc-sm text-[var(--sc-muted)]">{hammer ? hammer.label : lotInfo?.priceLabel}</p>
          {hammer && hammer.amount == null ? (
            <p className="sc-lg font-semibold text-[var(--sc-muted)]">{ui("passed")}</p>
          ) : lot ? (
            <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash rounded-[5px] text-[20px] font-bold leading-7 text-[var(--sc-ink)]" symbolClassName="text-[0.7em]" />
          ) : null}
        </div>
        {hammer ? null : (
          <span className="shrink-0 sc-sm font-semibold text-[var(--sc-red)] tabular">
            <span className="sr-only">{clock.spoken}</span>
            <span aria-hidden="true">{clock.text}</span>
          </span>
        )}
        <button
          type="button"
          aria-disabled={paused || undefined}
          aria-label={paused ? undefined : room.bidLabel(minNext)}
          onClick={() => room.bid(minNext)}
          className={btn("green", "md", cx("min-w-0 px-5 max-[379px]:px-3.5", "aria-disabled:cursor-not-allowed aria-disabled:opacity-45"))}
          data-testid="live-bid-bar"
        >
          <Gavel aria-hidden="true" className="size-[18px] shrink-0 max-[379px]:hidden" strokeWidth={1.9} />
          <span className="truncate">{paused ? hammer?.nextLabel : ui("bidAmount", { amount: money(minNext) })}</span>
        </button>
      </div>
    </div>
  );
}
