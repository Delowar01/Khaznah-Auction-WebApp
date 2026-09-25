"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { cx } from "./cx";

/** Stock signal: "14 available" with a quiet meter, amber "Only 3 left", or sold out. */
export function StockMeter({ stock, className = "", compact = false }) {
  const { ui } = useLang();
  if (stock <= 0) {
    return <p className={cx("kb-xs font-semibold text-danger", className)}>{ui("outOfStock")}</p>;
  }
  const low = stock <= 5;
  const fill = Math.max(8, Math.min(100, (stock / 20) * 100));
  return (
    <div className={className}>
      <p className={cx("kb-xs", low ? "font-bold text-warning" : "font-medium text-fg-3")}>
        {low ? ui("onlyLeft", { n: stock }) : ui("available", { n: stock })}
      </p>
      {compact ? null : (
        <div aria-hidden="true" className="mt-1 h-1 overflow-hidden rounded-full bg-surface-2">
          <div className={cx("h-full rounded-full", low ? "bg-warning" : "bg-success/70")} style={{ width: `${fill}%` }} />
        </div>
      )}
    </div>
  );
}
