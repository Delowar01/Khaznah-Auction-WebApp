"use client";

import { useId, useState } from "react";
import { Gavel, Minus, Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { RIYAL, formatNumber } from "@/lib/format";
import { Button } from "../ui/Button";
import { FIELD_BOX } from "../ui/Field";
import { cx } from "../ui/cx";

/**
 * Bid input with −/+ steps of one increment, quick-bid chips and the
 * primary "Place bid" action. Validation runs before the confirm step,
 * which the parent owns (`onRequest(amount)`).
 */
export function BidForm({ auction, onRequest, disabled = false, testId, compact = false }) {
  const { ui, money } = useLang();
  const id = useId();
  const { minNext, increment, quickBids } = auction;
  const [amount, setAmount] = useState(String(minNext));
  const [touched, setTouched] = useState(false);
  const [seenMin, setSeenMin] = useState(minNext);
  const [error, setError] = useState("");

  // Rival bids raise the minimum; keep the field valid unless the bidder typed more.
  if (minNext !== seenMin) {
    setSeenMin(minNext);
    if (!touched || Number(amount) < minNext) setAmount(String(minNext));
  }

  const value = Number(amount) || 0;
  const step = (dir) => {
    const next = Math.max(minNext, value + dir * increment);
    setAmount(String(next));
    setTouched(true);
    setError("");
  };

  const submit = (bid = value) => {
    if (!bid) return setError(ui("bidRequired"));
    if (bid < minNext) return setError(ui("bidTooLow", { amount: money(minNext) }));
    setError("");
    onRequest(bid);
  };

  return (
    <div className={cx("grid", compact ? "gap-2.5" : "gap-3")}>
      <div>
        <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 kb-sm font-semibold text-fg">
          {ui("yourBid")}
          <span className="kb-xs font-medium text-fg-3">
            {ui("nextMinBid")} <Money value={minNext} className="font-bold text-fg-2" />
          </span>
        </label>
        <div
          className={cx(
            FIELD_BOX,
            "h-12 overflow-hidden",
            error ? "border-danger focus-within:border-danger focus-within:ring-danger/15" : "border-line-strong",
            disabled && "border-line bg-surface-2",
          )}
        >
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={disabled || value <= minNext}
            aria-label={ui("decrease")}
            className="grid h-full w-11 shrink-0 place-items-center border-e border-line text-fg-2 transition-colors hover:bg-surface-2 disabled:opacity-40"
          >
            <Minus aria-hidden="true" className="size-4" />
          </button>
          <div dir="ltr" className="flex min-w-0 flex-1 items-center justify-center gap-1 px-2">
            <span aria-hidden="true" className="kb-lg font-bold text-fg-3">
              {RIYAL}
            </span>
            <input
              id={id}
              type="number"
              inputMode="numeric"
              min={minNext}
              step={increment}
              value={amount}
              disabled={disabled}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(event) => {
                setAmount(event.target.value);
                setTouched(true);
                if (error) setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submit();
                }
              }}
              className="kb-no-spin w-full min-w-0 bg-transparent text-center kb-xl font-extrabold tabular text-fg outline-none disabled:text-fg-3"
            />
          </div>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={disabled}
            aria-label={ui("increase")}
            className="grid h-full w-11 shrink-0 place-items-center border-s border-line text-fg-2 transition-colors hover:bg-surface-2 disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="size-4" />
          </button>
        </div>
        {error ? (
          <p id={`${id}-error`} role="alert" className="mt-1.5 kb-xs font-semibold text-danger">
            {error}
          </p>
        ) : null}
      </div>

      <div>
        <p className="mb-1.5 kb-xs font-semibold text-fg-3">{ui("quickBid")}</p>
        <div className="grid grid-cols-3 gap-2">
          {quickBids.map((bid) => (
            <button
              key={bid}
              type="button"
              disabled={disabled}
              onClick={() => {
                setAmount(String(bid));
                setTouched(true);
                submit(bid);
              }}
              aria-label={ui("bidAmount", { amount: money(bid) })}
              className={cx(
                "h-10 rounded-control border kb-sm font-bold tabular transition-colors disabled:cursor-not-allowed disabled:opacity-45",
                value === bid ? "border-primary bg-primary/10 text-primary" : "border-line-strong bg-surface text-fg hover:border-primary hover:text-primary",
              )}
            >
              <span dir="ltr">
                {RIYAL} {formatNumber(bid)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" block icon={Gavel} disabled={disabled} onClick={() => submit()} data-testid={testId}>
        {ui("placeBid")}
        {!disabled && value >= minNext ? (
          <span className="tabular" dir="ltr">
            · {RIYAL} {formatNumber(value)}
          </span>
        ) : null}
      </Button>
    </div>
  );
}
