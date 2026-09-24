"use client";

import { Lock, Minus, Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";

export function QuantityStepper({ value, onChange, min = 1, max = 99, locked = false, className = "" }) {
  const { ui } = useLang();
  return (
    <div className={`inline-flex h-11 items-stretch rounded-control border border-line-strong bg-surface ${className}`} role="group" aria-label={ui("quantity")}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={locked || value <= min}
        aria-label={ui("decrease")}
        className="grid w-11 place-items-center text-fg transition-colors hover:bg-surface-2 disabled:text-fg-3 disabled:hover:bg-transparent"
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <output aria-live="polite" className="grid min-w-12 place-items-center border-x border-line px-2 text-[15px] font-semibold tabular text-fg">
        {locked ? (
          <span className="inline-flex items-center gap-1.5">
            <Lock aria-hidden="true" className="size-3.5 text-fg-3" />
            {value}
          </span>
        ) : (
          value
        )}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={locked || value >= max}
        aria-label={ui("increase")}
        className="grid w-11 place-items-center text-fg transition-colors hover:bg-surface-2 disabled:text-fg-3 disabled:hover:bg-transparent"
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
