"use client";

import { X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getCategory } from "@/data/categories";
import { GRADES, ITEM_TYPES } from "@/data/grades";
import { formatNumber } from "@/lib/format";

export function filterLabel(filter, t, ui) {
  switch (filter.type) {
    case "category":
      return t(getCategory(filter.value)?.name);
    case "grade":
      return t(GRADES[filter.value]?.label);
    case "itemType":
      return t(ITEM_TYPES[filter.value]);
    case "price":
      return `${formatNumber(filter.value[0])} – ${formatNumber(filter.value[1])}`;
    case "ending":
      return `${ui("endingWithin")} ${ui({ "1h": "within1h", "6h": "within6h", "24h": "within24h" }[filter.value])}`;
    case "inStock":
      return ui("inStockOnly");
    case "discounted":
      return ui("discounted");
    case "search":
      return `“${filter.value}”`;
    default:
      return "";
  }
}

export function ActiveFilters({ browse }) {
  const { t, ui } = useLang();
  if (!browse.active.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {browse.active.map((filter) => {
        const label = filterLabel(filter, t, ui);
        return (
          <button
            key={`${filter.type}-${String(filter.value)}`}
            type="button"
            onClick={() => browse.removeFilter(filter)}
            className="inline-flex h-8 items-center gap-2 rounded-full border border-line-strong bg-surface ps-3 pe-2 text-[13px] text-fg transition-colors hover:border-fg"
            aria-label={`${label} — ${ui("clearFilters")}`}
          >
            <span dir="auto">{label}</span>
            <X aria-hidden="true" className="size-3.5 text-fg-3" />
          </button>
        );
      })}
      <button type="button" onClick={browse.clearAll} className="px-2 text-[13px] font-semibold text-fg underline underline-offset-4">
        {ui("clearAll")}
      </button>
    </div>
  );
}
