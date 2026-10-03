"use client";

import { Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useToastClearance } from "@/components/shared/auction/hooks";
import { Money } from "@/components/shared/ui/Money";
import { Button } from "../ui/Button";
import { cx } from "../ui/cx";
import { CALL_CHIP, UNAVAILABLE } from "./tones";

/**
 * Fixed live bid bar below 1024 px (76 px above the safe area; the chrome
 * keeps the same space free under the footer): the bid, the lot clock and
 * Bid with the exact next amount. Between lots: the result and the wait.
 * Toasts rise above it (useToastClearance).
 */
export function MobileLiveBar({ room }) {
  const { ui, money } = useLang();
  const barRef = useToastClearance();
  const { lot, lotInfo, clock, hammer, paused, minNext } = room;
  let label = lotInfo?.priceLabel;
  if (hammer) label = hammer.label;

  return (
    <div ref={barRef} className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-(--kb-sh-bar) backdrop-blur-md lg:hidden">
      <div className="kb-container flex h-[76px] items-center gap-3 max-[379px]:gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate kb-2xs font-semibold text-fg-3">{label}</p>
          {hammer && hammer.amount == null ? (
            <p className="kb-md font-bold text-fg-2">{ui("passed")}</p>
          ) : lot ? (
            <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash kb-price rounded px-0.5 text-fg" symbolClassName="text-[0.8em]" />
          ) : null}
        </div>
        {hammer ? null : (
          <span className={cx("inline-flex h-8 shrink-0 items-center rounded-full px-2.5 kb-sm font-bold tabular max-[379px]:px-2", CALL_CHIP[clock.tone])}>
            <span className="sr-only">{clock.spoken}</span>
            <span aria-hidden="true">{clock.text}</span>
          </span>
        )}
        <Button
          size="lg"
          icon={Gavel}
          aria-disabled={paused || undefined}
          aria-label={paused ? undefined : room.bidLabel(minNext)}
          onClick={() => room.bid(minNext)}
          data-testid="live-bid-bar"
          className={cx("min-w-0 px-5 max-[379px]:px-3.5 max-[379px]:[&>svg]:hidden", UNAVAILABLE)}
        >
          <span className="truncate">{paused ? hammer?.nextLabel : ui("bidAmount", { amount: money(minNext) })}</span>
        </Button>
      </div>
    </div>
  );
}
