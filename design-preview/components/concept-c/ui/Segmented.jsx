"use client";

import { cx } from "./cx";

/**
 * Single-choice toggle group (aria-pressed buttons) for filters such as
 * All / Auctions / Buy Now. `variant="underline"` is the storefront style.
 */
export function Segmented({ options, value, onChange, label, variant = "pill", size = "md", className = "" }) {
  if (variant === "underline") {
    return (
      <div role="group" aria-label={label} className={cx("no-scrollbar flex gap-1 overflow-x-auto border-b border-line", className)}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cx(
                "relative flex h-12 shrink-0 items-center gap-2 px-3 kb-md font-semibold transition-colors",
                "after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full",
                active ? "text-fg after:bg-primary" : "text-fg-3 after:bg-transparent hover:text-fg",
              )}
            >
              {option.label}
              {option.count != null ? (
                <span className={cx("rounded-full px-1.5 kb-2xs font-bold tabular", active ? "bg-primary/10 text-primary" : "bg-surface-2 text-fg-3")}>
                  {option.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="group" aria-label={label} className={cx("inline-flex shrink-0 rounded-control border border-line bg-surface-2 p-0.5", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "inline-flex items-center gap-1.5 whitespace-nowrap rounded-[8px] font-semibold transition-[background-color,color,box-shadow] duration-150",
              size === "sm" ? "h-8 px-2.5 kb-xs" : "h-9 px-3.5 kb-sm",
              active ? "bg-surface text-fg shadow-card ring-1 ring-line" : "text-fg-2 hover:text-fg",
            )}
          >
            {option.icon ? <option.icon aria-hidden="true" className="size-4" /> : null}
            {option.label}
            {option.count != null ? <span className={cx("kb-2xs font-bold tabular", active ? "text-primary" : "text-fg-3")}>{option.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
