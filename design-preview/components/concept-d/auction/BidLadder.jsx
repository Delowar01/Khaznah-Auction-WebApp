"use client";

import { useState } from "react";
import { Gavel, Minus, Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { RIYAL, formatNumber } from "@/lib/format";
import { Button } from "../ui/Button";
import { useCopy } from "../lib/useCopy";

/**
 * Quick-bid ladder + custom amount with steppers. The amount follows the
 * minimum next bid until the bidder edits it; validation mirrors the engine.
 */
export function BidLadder({ auction, onReview, compact = false, testId = "place-bid" }) {
  const { ui, money } = useLang();
  const c = useCopy();
  const [custom, setCustom] = useState({ value: null, flash: auction.flash });
  const [error, setError] = useState(null);
  // A custom amount survives price moves while it is still a valid bid;
  // once the market passes it, the ladder re-bases on the new minimum.
  const stale = custom.value != null && custom.flash !== auction.flash && Number(custom.value) < auction.minNext;
  const amount = custom.value == null || stale ? auction.minNext : custom.value;
  const inc = auction.increment;

  const set = (value) => {
    setCustom({ value, flash: auction.flash });
    setError(null);
  };

  const review = () => {
    const value = Number(amount);
    if (!value) return setError(ui("bidRequired"));
    if (value < auction.minNext) return setError(ui("bidTooLow", { amount: money(auction.minNext) }));
    setError(null);
    onReview(value);
  };

  return (
    <div>
      <p className="d-label mb-2 text-fg-3">{ui("quickBid")}</p>
      <div className="grid grid-cols-3 gap-2">
        {auction.quickBids.map((value, i) => {
          const active = Number(amount) === value;
          return (
            <button
              key={i}
              type="button"
              aria-pressed={active}
              onClick={() => set(value)}
              className={`flex h-12 flex-col items-center justify-center rounded-control border text-center transition-colors ${
                active ? "border-accent/70 bg-accent/12 text-fg" : "border-line-strong bg-surface-2 text-fg-2 hover:border-fg-3/50 hover:text-fg"
              }`}
            >
              <Money value={value} className="d-num text-sm font-medium" />
              {!compact ? (
                <span className="d-num text-[10px] text-fg-3" dir="ltr">
                  +{formatNumber(Math.max(0, value - auction.currentBid))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <label htmlFor={`${testId}-amount`} className="mt-4 block text-[13px] font-medium text-fg-2">
        {c("customAmount")}
      </label>
      <div
        className={`mt-1.5 flex h-12 items-center overflow-hidden rounded-control border bg-surface-2 transition-[border-color,box-shadow] focus-within:border-[color:var(--d-ink)] focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--d-ink)_22%,transparent)] ${
          error ? "border-danger" : "border-line-strong"
        }`}
        dir="ltr"
      >
        <button type="button" onClick={() => set(Math.max(auction.minNext, Number(amount) - inc))} aria-label={c("lowerBid")} className="grid h-full w-11 place-items-center text-fg-2 hover:bg-surface hover:text-fg">
          <Minus aria-hidden="true" className="size-4" />
        </button>
        <span aria-hidden="true" className="ps-2 text-fg-3">
          {RIYAL}
        </span>
        <input
          id={`${testId}-amount`}
          inputMode="numeric"
          autoComplete="off"
          value={amount === "" ? "" : String(amount)}
          onChange={(e) => set(e.target.value.replace(/[^\d]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && review()}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${testId}-error` : undefined}
          className="d-num h-full min-w-0 flex-1 bg-transparent px-2 text-center text-lg font-medium text-fg outline-none"
        />
        <button type="button" onClick={() => set(Number(amount || auction.minNext) + inc)} aria-label={c("raiseBid")} className="grid h-full w-11 place-items-center text-fg-2 hover:bg-surface hover:text-fg">
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>
      {error ? (
        <p id={`${testId}-error`} role="alert" className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-fg-3">
          {ui("nextMinBid")} <Money value={auction.minNext} className="d-num text-fg-2" /> · {ui("minIncrement")} <Money value={inc} className="d-num text-fg-2" />
        </p>
      )}

      <Button variant="gold" size="xl" icon={Gavel} className="mt-4 w-full" onClick={review} data-testid={testId}>
        {ui("placeBid")}
        {Number(amount) >= auction.minNext ? <Money value={Number(amount)} className="d-num ms-1 opacity-80" /> : null}
      </Button>
    </div>
  );
}
