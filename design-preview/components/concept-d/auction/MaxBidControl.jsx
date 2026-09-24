"use client";

import { useId, useState } from "react";
import { Bot, ChevronDown } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { RIYAL } from "@/lib/format";
import { Button } from "../ui/Button";
import { useCopy } from "../lib/useCopy";

/** Proxy (maximum) bid: disclosure with amount, slider feel, save/remove. */
export function MaxBidControl({ auction }) {
  const { ui } = useLang();
  const c = useCopy();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const floor = auction.minNext;
  const ceiling = floor + auction.increment * 30;
  const amount = value ?? auction.myMax ?? floor + auction.increment * 5;

  const save = () => {
    const result = auction.setMaxBid(Number(amount));
    if (!result.ok) setError(result.error);
    else {
      setError(null);
      setOpen(false);
    }
  };

  return (
    <div className="rounded-xl border border-line">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className="flex min-h-12 w-full items-center gap-3 px-3.5 text-start">
        <Bot aria-hidden="true" className="size-4 shrink-0 d-ink" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-fg">{ui("setMaxBid")}</span>
          {auction.myMax ? (
            <span className="block text-xs text-auction">
              {c("maxBidActive", { amount: "" })}
              <Money value={auction.myMax} className="d-num" />
            </span>
          ) : null}
        </span>
        <ChevronDown aria-hidden="true" className={`size-4 text-fg-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={id} hidden={!open} className="border-t border-line p-3.5">
        <p className="text-[13px] text-fg-2">{ui("maxBidExplain")}</p>
        <label htmlFor={`${id}-input`} className="mt-3 block text-[13px] font-medium text-fg-2">
          {ui("yourMaxBid")}
        </label>
        <div className={`mt-1.5 flex h-11 items-center gap-2 rounded-control border bg-surface-2 px-3 ${error ? "border-danger" : "border-line-strong"} focus-within:border-[color:var(--d-ink)]`} dir="ltr">
          <span aria-hidden="true" className="text-fg-3">
            {RIYAL}
          </span>
          <input
            id={`${id}-input`}
            inputMode="numeric"
            autoComplete="off"
            value={String(amount)}
            onChange={(e) => {
              setValue(e.target.value.replace(/[^\d]/g, ""));
              setError(null);
            }}
            aria-invalid={error ? true : undefined}
            className="d-num h-full min-w-0 flex-1 bg-transparent text-base font-medium text-fg outline-none"
          />
        </div>
        <input
          type="range"
          min={floor}
          max={ceiling}
          step={auction.increment}
          value={Math.min(ceiling, Math.max(floor, Number(amount) || floor))}
          onChange={(e) => setValue(e.target.value)}
          aria-label={c("maxBidSlider")}
          className="mt-3 w-full accent-[var(--d-ink)]"
        />
        <div className="d-num flex justify-between text-[11px] text-fg-3" dir="ltr">
          <Money value={floor} />
          <Money value={ceiling} />
        </div>
        {error ? (
          <p role="alert" className="mt-2 text-[13px] text-danger">
            {error}
          </p>
        ) : null}
        <div className="mt-3 flex gap-2">
          <Button variant="primary" size="sm" onClick={save} className="flex-1">
            {ui("saveMaxBid")}
          </Button>
          {auction.myMax ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                auction.clearMaxBid();
                setValue(null);
              }}
            >
              {ui("clearMaxBid")}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
