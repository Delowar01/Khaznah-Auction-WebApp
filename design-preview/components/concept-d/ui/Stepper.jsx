"use client";

import { useId } from "react";
import { Lock, Minus, Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { cx } from "./cx";

/** − [value] + quantity control. `locked` shows a full-lot lock instead. */
export function Stepper({ value, onChange, min = 1, max = 99, step = 1, label, size = "md", disabled = false, locked = false, lockedLabel, className = "" }) {
  const { ui } = useLang();
  const id = useId();
  const h = size === "sm" ? "h-8" : "h-11";
  const btn = size === "sm" ? "w-8" : "w-11";

  if (locked) {
    return (
      <div className={cx("inline-flex items-center gap-2 rounded-control border border-line bg-surface-2 px-3 font-semibold text-fg-2", h, className)}>
        <Lock aria-hidden="true" className="size-4" />
        <span className="tabular">{value}</span>
        {lockedLabel ? <span className="kb-xs font-medium text-fg-3">{lockedLabel}</span> : null}
      </div>
    );
  }

  const clamp = (n) => Math.min(max, Math.max(min, n));
  return (
    <div
      role="group"
      aria-label={label}
      className={cx(
        "inline-flex items-stretch overflow-hidden rounded-control border border-line-strong bg-surface",
        disabled && "opacity-60",
        h,
        className,
      )}
    >
      <button
        type="button"
        aria-label={ui("decrease")}
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - step))}
        className={cx("grid place-items-center text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg disabled:text-fg-3 disabled:opacity-50", btn)}
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onChange(clamp(Math.round(next)));
        }}
        className="kb-no-spin w-12 border-x border-line bg-transparent text-center font-bold tabular text-fg focus-visible:bg-primary/5 focus-visible:-outline-offset-2"
      />
      <button
        type="button"
        aria-label={ui("increase")}
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + step))}
        className={cx("grid place-items-center text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg disabled:text-fg-3 disabled:opacity-50", btn)}
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
