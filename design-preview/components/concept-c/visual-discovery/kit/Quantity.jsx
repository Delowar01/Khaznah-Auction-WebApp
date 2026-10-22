"use client";

// The product page's pill quantity control, for cart and checkout lines:
// round − and + around the number on the blue-grey track, or a lock and the
// reason when the quantity cannot change.
import { useState } from "react";
import { Lock, Minus, Plus } from "lucide-react";
import { cx } from "../ui";

const STEP = "grid size-9 place-items-center rounded-full bg-white text-[var(--vd-indigo)] shadow-[0_1px_3px_rgb(7_27_82/0.12)] transition-colors hover:bg-[#f3f7fc] disabled:opacity-40 disabled:shadow-none";

/**
 * `value` and `max`: the line's quantity and stock; `onChange(next)` gets a
 * number already kept within 1–max. `labels`: { quantity, decrease, increase }
 * (with the item name, so each line's controls are distinct). As in
 * production's cart, typing commits real values only — an empty field is held
 * until it loses focus — so editing the number never removes the line.
 */
export function QuantityStepper({ value, max, onChange, labels, disabled = false, busy = false, className = "" }) {
  const set = (next) => onChange(Math.max(1, Math.min(max, Number.isFinite(next) ? Math.round(next) : 1)));
  const [draft, setDraft] = useState(String(value));
  const [shown, setShown] = useState(value);
  // Follow the quantity when it changes from outside (the buttons, a reload).
  if (value !== shown) {
    setShown(value);
    setDraft(String(value));
  }
  return (
    <div role="group" aria-label={labels.quantity} aria-busy={busy || undefined} className={cx("inline-flex h-11 w-fit items-center gap-1 rounded-full bg-[var(--vd-bluegray)] p-1", className)}>
      <button type="button" onClick={() => set(value - 1)} disabled={disabled || value <= 1} aria-label={labels.decrease} className={STEP}>
        <Minus aria-hidden="true" className="size-4" strokeWidth={2.4} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={draft}
        disabled={disabled}
        onChange={(event) => {
          const raw = event.target.value.replace(/[^\d]/g, "");
          setDraft(raw);
          if (raw !== "" && Number(raw) >= 1) set(Number(raw));
        }}
        onBlur={() => {
          const next = Math.max(1, Math.min(max, Number(draft) || 1));
          setDraft(String(next));
          if (next !== value) set(next);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        aria-label={labels.quantity}
        className="vd-no-spin w-10 min-w-0 rounded-full bg-transparent text-center vd-md font-extrabold text-[var(--vd-ink)] tabular"
      />
      <button type="button" onClick={() => set(value + 1)} disabled={disabled || value >= max} aria-label={labels.increase} className={STEP}>
        <Plus aria-hidden="true" className="size-4" strokeWidth={2.4} />
      </button>
    </div>
  );
}

/** A quantity that cannot change: the lock, the number and why. */
export function LockedQuantity({ value, label, className = "" }) {
  return (
    <span className={cx("inline-flex h-11 w-fit items-center gap-2 rounded-full bg-[var(--vd-bluegray)] px-4 vd-md font-bold text-[var(--vd-ink)]", className)}>
      <Lock aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.2} />
      <span className="tabular">{value}</span>
      <span className="vd-sm font-semibold text-[var(--vd-muted)]">{label}</span>
    </span>
  );
}
