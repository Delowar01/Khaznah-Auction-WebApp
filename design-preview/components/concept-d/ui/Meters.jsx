"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { stockLevel } from "../lib/data";
import { useCopy } from "../lib/useCopy";

const SEG_TONE = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-live",
  muted: "bg-fg-3/40",
};

const TEXT_TONE = {
  success: "text-fg-2",
  warning: "text-warning",
  danger: "text-live",
  muted: "text-fg-3",
};

/** Segmented stock meter with a plain-language label. */
export function StockMeter({ stock, segments = 12, className = "", compact = false }) {
  const { ui } = useLang();
  const { fraction, tone } = stockLevel(stock);
  const filled = stock > 0 ? Math.max(1, Math.round(fraction * segments)) : 0;
  const label = stock <= 0 ? ui("outOfStock") : stock <= 5 ? ui("onlyLeft", { n: stock }) : ui("available", { n: stock });
  return (
    <div className={`min-w-0 ${className}`}>
      <div aria-hidden="true" className="flex gap-[3px]">
        {Array.from({ length: segments }, (_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i < filled ? SEG_TONE[tone] : "bg-[var(--d-track)]"}`} />
        ))}
      </div>
      <p className={`mt-1.5 truncate ${compact ? "text-[11.5px]" : "text-xs"} font-medium ${TEXT_TONE[tone]}`}>{label}</p>
    </div>
  );
}

/** Four-bar bidding-activity meter. */
export function HeatMeter({ level = 1, showLabel = true, className = "" }) {
  const { ui } = useLang();
  const c = useCopy();
  const hot = level >= 3;
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span aria-hidden="true" className="flex h-3.5 items-end gap-[2px]">
        {[0.35, 0.55, 0.78, 1].map((h, i) => (
          <span
            key={h}
            className={`w-[3px] rounded-[1px] ${i < level ? (hot ? "bg-warning" : "bg-[var(--d-ink)]") : "bg-[var(--d-track)]"}`}
            style={{ height: `${h * 100}%` }}
          />
        ))}
      </span>
      <span className="sr-only">{c("heatLabel", { level })}</span>
      {showLabel && hot ? <span className="d-label text-warning">{ui("hot")}</span> : null}
    </span>
  );
}
