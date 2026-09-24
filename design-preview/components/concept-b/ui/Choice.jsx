"use client";

import { Check } from "lucide-react";
import { cx } from "./cx";

/** Checkbox row with a custom box, native input for keyboard and AT. */
export function Checkbox({ checked, onChange, children, count, disabled = false, className = "" }) {
  return (
    <label
      className={cx(
        "group flex min-h-9 cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors hover:bg-surface-2",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span
        aria-hidden="true"
        className="grid size-[18px] shrink-0 place-items-center rounded-[5px] border border-line-strong bg-surface text-on-primary transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus group-hover:border-fg-3"
      >
        {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0 flex-1 kb-sm text-fg">{children}</span>
      {count != null ? <span className="kb-xs tabular text-fg-3">{count}</span> : null}
    </label>
  );
}

/** Radio row (use inside a role="radiogroup" or fieldset). */
export function Radio({ name, value, checked, onChange, children, className = "" }) {
  return (
    <label className={cx("group flex min-h-9 cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors hover:bg-surface-2", className)}>
      <input type="radio" name={name} value={value} className="peer sr-only" checked={checked} onChange={() => onChange(value)} />
      <span
        aria-hidden="true"
        className="grid size-[18px] shrink-0 place-items-center rounded-full border border-line-strong bg-surface transition-colors peer-checked:border-primary peer-checked:border-[5px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus group-hover:border-fg-3"
      />
      <span className="min-w-0 flex-1 kb-sm text-fg">{children}</span>
    </label>
  );
}

/** Pill toggle chip (aria-pressed) used for quick filters. */
export function ToggleChip({ pressed, onClick, children, icon: Icon, className = "" }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cx(
        "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 kb-sm font-semibold transition-colors duration-150",
        pressed ? "border-primary bg-primary/10 text-primary" : "border-line-strong bg-surface text-fg-2 hover:border-fg-3 hover:text-fg",
        className,
      )}
    >
      {Icon ? <Icon aria-hidden="true" className="size-4" /> : null}
      {children}
      {pressed ? <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> : null}
    </button>
  );
}
