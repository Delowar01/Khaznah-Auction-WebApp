"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { RIYAL } from "@/lib/format";
import { Button } from "../ui/Button";
import { COPY } from "../copy";

/**
 * Quick bids, a custom amount with an increment stepper and validation, and
 * the primary "Place bid" action. Confirmation happens in the page's modal.
 */
export function BidForm({ a, onRequestConfirm, disabled = false, primaryTestId = "place-bid" }) {
  const { t, ui, money } = useLang();
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState("");
  const inputId = useId();
  const hintId = useId();
  const value = draft ?? String(a.minNext);
  const numeric = Number(value);

  const step = (direction) => {
    const base = numeric > 0 ? numeric : a.minNext;
    setDraft(String(Math.max(a.minNext, base + direction * a.increment)));
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();
    if (!numeric) return setError(ui("bidRequired"));
    if (numeric < a.minNext) return setError(ui("bidTooLow", { amount: money(a.minNext) }));
    setError("");
    onRequestConfirm(numeric, () => setDraft(null));
  };

  return (
    <form onSubmit={submit} noValidate>
      <p className="a-eyebrow">{ui("quickBid")}</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {a.quickBids.map((amount) => (
          <button
            key={amount}
            type="button"
            disabled={disabled}
            onClick={() => {
              setError("");
              onRequestConfirm(amount, () => setDraft(null));
            }}
            className="h-12 rounded-control border border-line-strong bg-surface text-[15px] font-semibold text-fg transition-colors hover:border-fg hover:bg-surface-2 disabled:cursor-not-allowed disabled:text-fg-3"
          >
            <Money value={amount} />
          </button>
        ))}
      </div>

      <label htmlFor={inputId} className="mt-5 block text-sm font-medium text-fg">
        {t(COPY.customAmount)}
      </label>
      <div
        className={`mt-2 flex h-[52px] items-stretch rounded-control border bg-surface transition-shadow ${
          error ? "border-danger ring-1 ring-danger" : "border-line-strong focus-within:border-fg focus-within:ring-1 focus-within:ring-fg"
        }`}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={disabled || numeric <= a.minNext}
          aria-label={t(COPY.lowerBid)}
          className="grid w-12 shrink-0 place-items-center text-fg transition-colors hover:bg-surface-2 disabled:text-fg-3 disabled:hover:bg-transparent"
        >
          <Minus aria-hidden="true" className="size-4" />
        </button>
        <div dir="ltr" className="flex min-w-0 flex-1 items-center border-x border-line">
          <span aria-hidden="true" className="ps-4 text-lg text-fg-3">
            {RIYAL}
          </span>
          <input
            id={inputId}
            inputMode="numeric"
            autoComplete="off"
            value={value}
            disabled={disabled}
            onChange={(event) => {
              setDraft(event.target.value.replace(/[^\d]/g, "").slice(0, 7));
              setError("");
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={hintId}
            className="h-full w-full min-w-0 bg-transparent px-2 text-[19px] font-semibold tabular text-fg outline-none disabled:text-fg-3"
          />
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={disabled}
          aria-label={t(COPY.raiseBid)}
          className="grid w-12 shrink-0 place-items-center text-fg transition-colors hover:bg-surface-2 disabled:text-fg-3"
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>
      <p id={hintId} role={error ? "alert" : undefined} className={`mt-2 text-[13px] ${error ? "font-medium text-danger" : "text-fg-3"}`}>
        {error || (
          <>
            {ui("nextMinBid")} <Money value={a.minNext} /> · {ui("minIncrement")} <Money value={a.increment} />
          </>
        )}
      </p>

      <Button type="submit" size="lg" className="mt-5 w-full" disabled={disabled} data-testid={primaryTestId}>
        {ui("placeBid")}
      </Button>
    </form>
  );
}
