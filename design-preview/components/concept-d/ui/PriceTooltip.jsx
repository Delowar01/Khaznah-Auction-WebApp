"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { useElapsed } from "@/lib/clock";
import { formatAgo } from "@/lib/format";
import { bidAge } from "@/lib/useAuction";

/** Tooltip renderer for StepChart points: amount · bidder · age. */
export function usePriceTooltip() {
  const { t, ui, lang } = useLang();
  const elapsed = useElapsed();

  function renderPriceTooltip(point) {
    return (
      <span className="flex items-center gap-2" dir={lang === "ar" ? "rtl" : "ltr"}>
        <Money value={point.amount} className="d-num font-medium text-fg" />
        <span className={point.own ? "font-medium text-auction" : "text-fg-2"}>{point.row ? t(point.row.label) : ui("currentBid")}</span>
        {point.row ? <span className="text-fg-3">{formatAgo(bidAge(point.row, elapsed), lang)}</span> : null}
      </span>
    );
  }

  return renderPriceTooltip;
}
