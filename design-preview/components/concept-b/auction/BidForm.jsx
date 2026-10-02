"use client";

import { Gavel, Minus, Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useBidForm } from "@/components/shared/auction/hooks";
import { Money } from "@/components/shared/ui/Money";
import { RIYAL, formatNumber } from "@/lib/format";
import { Button } from "../ui/Button";
import { FIELD_BOX } from "../ui/Field";
import { cx } from "../ui/cx";

const STEP = "grid h-full w-11 shrink-0 place-items-center text-fg-2 transition-colors hover:bg-surface-2 disabled:opacity-40";

/**
 * Bid input with −/+ steps of one increment, quick bids and the primary
 * "Place bid". Validation runs before the confirm step, which the page
 * owns (`onRequest(amount)`); see useBidForm.
 */
export function BidForm({ auction, onRequest, disabled = false, testId, compact = false }) {
  const { ui } = useLang();
  const form = useBidForm(auction, onRequest, { disabled });

  return (
    <div className={cx("grid", compact ? "gap-2.5" : "gap-3")}>
      <div>
        <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-2">
          <label htmlFor={form.id} className="kb-sm font-semibold text-fg">
            {ui("yourBid")}
          </label>
          <span id={form.hintId} className="kb-xs font-medium text-fg-3">
            {ui("nextMinBid")} <Money value={form.minNext} className="font-bold text-fg-2" />
          </span>
        </div>
        <div
          className={cx(
            FIELD_BOX,
            "h-12 overflow-hidden",
            form.error ? "border-danger focus-within:border-danger focus-within:ring-danger/15" : "border-line-strong",
            disabled && "border-line bg-surface-2",
          )}
        >
          <button type="button" onClick={form.lower} disabled={!form.canLower} aria-label={form.lowerLabel} className={cx(STEP, "border-e border-line")}>
            <Minus aria-hidden="true" className="size-4" />
          </button>
          <div dir="ltr" className="flex min-w-0 flex-1 items-center justify-center gap-1 px-2">
            <span aria-hidden="true" className="kb-lg font-bold text-fg-3">
              {RIYAL}
            </span>
            <input {...form.inputProps} className="kb-no-spin w-full min-w-0 bg-transparent text-center kb-xl font-extrabold tabular text-fg outline-none disabled:text-fg-3" />
          </div>
          <button type="button" onClick={form.raise} disabled={disabled} aria-label={form.raiseLabel} className={cx(STEP, "border-s border-line")}>
            <Plus aria-hidden="true" className="size-4" />
          </button>
        </div>
        {form.error ? (
          <p id={form.errorId} role="alert" className="mt-1.5 kb-xs font-semibold text-danger">
            {form.error}
          </p>
        ) : null}
      </div>

      <div role="group" aria-label={ui("quickBid")}>
        <p aria-hidden="true" className="mb-1.5 kb-xs font-semibold text-fg-3">
          {ui("quickBid")}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {form.quickBids.map((bid) => (
            <button
              key={bid}
              type="button"
              disabled={disabled}
              onClick={() => form.quick(bid)}
              aria-label={form.quickLabel(bid)}
              className={cx(
                "h-10 rounded-control border kb-sm font-bold tabular transition-colors disabled:cursor-not-allowed disabled:opacity-45",
                form.value === bid ? "border-primary bg-primary/10 text-primary" : "border-line-strong bg-surface text-fg hover:border-primary hover:text-primary",
              )}
            >
              <span dir="ltr">
                {RIYAL} {formatNumber(bid)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" block icon={Gavel} disabled={disabled} onClick={form.submit} data-testid={testId}>
        {ui("placeBid")}
        {form.valid ? (
          <>
            <span aria-hidden="true">·</span>
            <Money value={form.value} className="opacity-90" />
          </>
        ) : null}
      </Button>
    </div>
  );
}
