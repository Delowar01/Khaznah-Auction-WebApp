"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

/** Collapsible filter group (button + region). */
export function FilterSection({ title, meta, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="border-b border-line py-4 last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-9 w-full items-center justify-between gap-3 text-start text-sm font-medium text-fg"
        >
          <span className="flex items-center gap-2">
            {title}
            {meta ? <span className="d-num rounded-md bg-primary/15 px-1.5 text-[11px] d-ink">{meta}</span> : null}
          </span>
          <ChevronDown aria-hidden="true" className={`size-4 text-fg-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      <div id={id} hidden={!open} className="pt-3">
        {children}
      </div>
    </section>
  );
}

/** Checkbox row with a live count. */
export function CheckRow({ checked, onChange, label, count, disabled }) {
  return (
    <label className={`group flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 transition-colors hover:bg-surface-2 ${disabled ? "opacity-45" : ""}`}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)] ${
          checked ? "border-primary bg-primary text-on-primary" : "border-line-strong bg-surface"
        }`}
      >
        {checked ? (
          <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.2 5 8.5l4.5-5" />
          </svg>
        ) : null}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-fg-2 group-hover:text-fg">{label}</span>
      <span className="d-num text-xs text-fg-3">{count ?? 0}</span>
    </label>
  );
}

/** Toggle chip (aria-pressed) with a count. */
export function ToggleChip({ pressed, onClick, children, count, className = "" }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`d-hit inline-flex h-9 items-center gap-1.5 rounded-control border px-2.5 text-[13px] font-medium transition-colors ${
        pressed ? "border-[color:var(--d-ink)] bg-primary/15 text-fg" : "border-line-strong bg-surface-2/60 text-fg-2 hover:text-fg"
      } ${className}`}
    >
      {children}
      {count != null ? <span className="d-num text-[11px] text-fg-3">{count}</span> : null}
    </button>
  );
}
