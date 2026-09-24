"use client";

import { useId } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";

/**
 * Dual-thumb price range built from two native range inputs, so it keeps
 * native keyboard and screen-reader support. Works in RTL (the track
 * direction follows the document direction).
 */
export function PriceRange({ min = 0, max = 10000, step = 50, value, onChange, trackClassName = "", fillClassName = "", thumbClassName = "" }) {
  const { ui } = useLang();
  const id = useId();
  const [low, high] = value;
  const pct = (v) => ((v - min) / (max - min)) * 100;

  return (
    <div className="relative h-6" style={{ "--lo": `${pct(low)}%`, "--hi": `${pct(high)}%` }}>
      <div className={`absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line ${trackClassName}`} />
      <div
        className={`absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary ${fillClassName}`}
        style={{ insetInlineStart: "var(--lo)", insetInlineEnd: "calc(100% - var(--hi))" }}
      />
      <label htmlFor={`${id}-lo`} className="sr-only">
        {ui("min")}
      </label>
      <input
        id={`${id}-lo`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={low}
        onChange={(e) => onChange([Math.min(Number(e.target.value), high - step), high])}
        className={`kz-range ${thumbClassName}`}
      />
      <label htmlFor={`${id}-hi`} className="sr-only">
        {ui("max")}
      </label>
      <input
        id={`${id}-hi`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={high}
        onChange={(e) => onChange([low, Math.max(Number(e.target.value), low + step)])}
        className={`kz-range ${thumbClassName}`}
      />
    </div>
  );
}
