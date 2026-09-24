"use client";

import { useId } from "react";
import { motion } from "motion/react";

/**
 * Segmented control (toggle buttons with aria-pressed) with a sliding
 * highlight. Used for sale type, grid/board and "ending within".
 */
export function Segmented({ label, value, options, onChange, size = "md", className = "", stretch = false }) {
  const id = useId();
  const h = size === "sm" ? "h-9 px-2.5 text-[13px] sm:h-8" : "h-10 px-3 text-sm sm:h-9";
  return (
    <div role="group" aria-label={label} className={`relative inline-flex items-center gap-0.5 rounded-control border border-line bg-surface-2 p-1 ${stretch ? "flex w-full" : ""} ${className}`}>
      {options.map((option) => {
        const active = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={option.ariaLabel}
            title={option.ariaLabel}
            onClick={() => onChange(option.value)}
            className={`relative isolate inline-flex min-w-0 items-center justify-center gap-1.5 rounded-[8px] font-medium transition-colors ${h} ${stretch ? "flex-1" : ""} ${active ? "text-fg" : "text-fg-2 hover:text-fg"}`}
          >
            {active ? (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 -z-10 rounded-[8px] bg-elevated shadow-card ring-1 ring-line-strong"
                transition={{ type: "spring", stiffness: 520, damping: 42 }}
              />
            ) : null}
            {Icon ? <Icon aria-hidden="true" className="size-4 shrink-0" /> : null}
            {option.label ? <span className="truncate">{option.label}</span> : null}
            {option.count != null ? <span className="d-num text-xs text-fg-3">{option.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
