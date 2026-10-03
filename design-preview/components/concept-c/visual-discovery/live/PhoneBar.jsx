"use client";

import { Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useToastClearance } from "@/components/shared/auction/hooks";
import { Money } from "@/components/shared/ui/Money";
import { btn, cx } from "../ui";
import { ClockPill } from "./Stage";

/**
 * Below 1024 px: a floating navy pill bar — the coral lot clock, the bid
 * and the gold Bid with the exact next amount (the result and the wait
 * between lots). The page keeps 88 px free under the footer; toasts rise
 * above it (useToastClearance).
 */
export function PhoneBar({ room }) {
  const { ui, money } = useLang();
  const barRef = useToastClearance();
  const { lot, hammer, paused, minNext } = room;
  return (
    <div ref={barRef} className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-30 [--focus:var(--vd-gold)] lg:hidden">
      <div className="mx-auto flex h-16 max-w-[640px] items-center gap-2.5 rounded-full bg-[var(--vd-navy)] ps-2 pe-2 text-white shadow-[0_12px_30px_-12px_rgb(6_33_63/0.6)] max-[379px]:gap-2">
        <ClockPill room={room} className="h-11 max-[379px]:px-2.5 max-[379px]:[&>svg]:hidden" />
        <div className="min-w-0 flex-1">
          {hammer ? (
            <p className="truncate vd-sm font-bold">
              {hammer.label}
              {hammer.amount != null ? (
                <>
                  {" "}
                  <Money value={hammer.amount} />
                </>
              ) : null}
            </p>
          ) : lot ? (
            <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash truncate rounded-full vd-lg font-extrabold" symbolClassName="text-[0.75em]" />
          ) : null}
        </div>
        <button
          type="button"
          aria-disabled={paused || undefined}
          aria-label={paused ? undefined : room.bidLabel(minNext)}
          onClick={() => room.bid(minNext)}
          className={btn("gold", "lg", cx("min-w-0 px-5 max-[379px]:px-3.5", "aria-disabled:cursor-not-allowed aria-disabled:opacity-60"))}
          data-testid="live-bid-bar"
        >
          <Gavel aria-hidden="true" className="size-[18px] shrink-0 max-[379px]:hidden" strokeWidth={2.1} />
          <span className="truncate">{paused ? hammer?.nextLabel : ui("bidAmount", { amount: money(minNext) })}</span>
        </button>
      </div>
    </div>
  );
}
