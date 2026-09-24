"use client";

import { useId, useState } from "react";
import { Gavel, Minus, Plus, TriangleAlert } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { RIYAL } from "@/lib/format";
import { Button } from "../ui/Button";
import { cx } from "../ui/cx";

const digits = (value) => String(value).replace(/[^\d]/g, "");

/**
 * Bid entry: stepper input (with error state), quick bids and the primary
 * button. It never places a bid directly — it asks for confirmation.
 */
export function BidForm({ auction, onRequestBid, testId, className = "" }) {
  const { ui, money } = useLang();
  const id = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const { minNext, increment, quickBids } = auction;
  const amount = Number(value) || 0;

  const step = (dir) => {
    const base = amount >= minNext ? amount : minNext - (dir > 0 ? increment : 0);
    setValue(String(Math.max(minNext, base + dir * increment)));
    setError(null);
  };

  const submit = (event) => {
    event.preventDefault();
    const bid = amount || minNext;
    if (bid < minNext) {
      setError(ui("bidTooLow", { amount: money(minNext) }));
      return;
    }
    setError(null);
    onRequestBid(bid);
  };

  return (
    <form onSubmit={submit} noValidate className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-fg">
        {ui("yourBid")}
      </label>
      <div dir="ltr" className={cx("mt-2 flex h-13 items-stretch overflow-hidden rounded-control border bg-surface transition-colors", error ? "border-danger" : "border-line-strong focus-within:border-primary")}>
        <button type="button" onClick={() => step(-1)} aria-label={ui("decrease")} className="grid w-12 shrink-0 place-items-center text-fg hover:bg-surface-2">
          <Minus aria-hidden="true" className="size-4" />
        </button>
        <div className="relative flex-1 border-x border-line">
          <span aria-hidden="true" className="c-num pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-3">
            {RIYAL}
          </span>
          <input
            id={id}
            inputMode="numeric"
            autoComplete="off"
            value={value ? Number(value).toLocaleString("en-US") : ""}
            onChange={(e) => {
              setValue(digits(e.target.value));
              if (error) setError(null);
            }}
            placeholder={minNext.toLocaleString("en-US")}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${id}-hint`}
            className="c-num h-full w-full bg-transparent px-8 text-center text-lg font-semibold text-fg outline-none placeholder:text-fg-3"
          />
        </div>
        <button type="button" onClick={() => step(1)} aria-label={ui("increase")} className="grid w-12 shrink-0 place-items-center text-fg hover:bg-surface-2">
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>
      <p id={`${id}-hint`} role={error ? "alert" : undefined} className={cx("mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs", error ? "font-medium text-danger" : "text-fg-3")}>
        {error ? (
          <>
            <TriangleAlert aria-hidden="true" className="size-3.5 shrink-0" />
            {error}
          </>
        ) : (
          <>
            <span className="whitespace-nowrap">
              {ui("nextMinBid")}: <Money value={minNext} className="c-num font-semibold text-fg-2" />
            </span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">
              {ui("minIncrement")}: <Money value={increment} className="c-num text-fg-2" />
            </span>
          </>
        )}
      </p>

      <p className="c-caps mb-2 mt-5 text-fg-3">{ui("quickBid")}</p>
      <div className="grid grid-cols-3 gap-2">
        {quickBids.map((q) => (
          <button key={q} type="button" onClick={() => onRequestBid(q)} className="flex h-11 items-center justify-center rounded-control border border-line-strong bg-surface text-sm font-semibold text-fg transition-colors hover:border-primary hover:text-primary">
            <Money value={q} className="c-num" />
          </button>
        ))}
      </div>

      <Button type="submit" size="lg" block icon={Gavel} className="mt-4" data-testid={testId}>
        {amount >= minNext ? ui("bidAmount", { amount: money(amount) }) : ui("placeBid")}
      </Button>
    </form>
  );
}
