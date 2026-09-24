"use client";

import { useId } from "react";
import { Lock, Minus, Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { cx } from "./cx";

/** Quantity stepper; `locked` shows a full-lot quantity that cannot change. */
export function QuantityStepper({ value, min = 1, max = 99, onChange, disabled = false, locked = false, suffix, className = "" }) {
  const { ui } = useLang();
  const id = useId();
  const set = (next) => onChange?.(Math.min(max, Math.max(min, next)));

  if (locked) {
    return (
      <div className={cx("inline-flex h-12 items-center gap-3 rounded-control border border-line bg-surface-2 px-4 text-fg-2", className)}>
        <Lock aria-hidden="true" className="size-4" />
        <span className="c-num font-semibold text-fg">{value}</span>
        {suffix ? <span className="text-sm">{suffix}</span> : null}
      </div>
    );
  }

  return (
    <div className={cx("inline-flex h-12 items-stretch overflow-hidden rounded-control border border-line-strong bg-surface", disabled && "opacity-50", className)}>
      <button type="button" onClick={() => set(value - 1)} disabled={disabled || value <= min} aria-label={ui("decrease")} className="grid w-12 place-items-center text-fg transition-colors hover:bg-surface-2 disabled:opacity-35">
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <label htmlFor={id} className="sr-only">
        {ui("quantity")}
      </label>
      <input
        id={id}
        inputMode="numeric"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/[^\d]/g, ""), 10);
          set(Number.isFinite(n) ? n : min);
        }}
        className="c-num w-14 border-x border-line bg-transparent text-center text-lg font-semibold text-fg outline-none focus-visible:bg-surface-2"
      />
      <button type="button" onClick={() => set(value + 1)} disabled={disabled || value >= max} aria-label={ui("increase")} className="grid w-12 place-items-center text-fg transition-colors hover:bg-surface-2 disabled:opacity-35">
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
