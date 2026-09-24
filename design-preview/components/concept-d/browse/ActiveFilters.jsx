"use client";

import { X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getCategory } from "@/data/categories";
import { getGrade, ITEM_TYPES } from "@/data/grades";
import { useCopy } from "../lib/useCopy";

const ENDING_KEY = { "1h": "within1h", "6h": "within6h", "24h": "within24h" };

/** Plain-language label for an active filter. */
export function useFilterLabel() {
  const { t, ui, money } = useLang();
  const c = useCopy();
  return (filter) => {
    switch (filter.type) {
      case "category":
        return t(getCategory(filter.value)?.name);
      case "grade":
        return t(getGrade(filter.value).label);
      case "itemType":
        return t(ITEM_TYPES[filter.value]);
      case "price":
        return c("priceFrom", { min: money(filter.value[0]), max: money(filter.value[1]) });
      case "ending":
        return `${ui("endingWithin")} ${ui(ENDING_KEY[filter.value])}`;
      case "inStock":
        return ui("inStockOnly");
      case "discounted":
        return ui("discounted");
      case "search":
        return c("searchFor", { q: filter.value });
      default:
        return "";
    }
  };
}

/** Removable chips for every active filter, plus Clear all. */
export function ActiveFilters({ browse }) {
  const { ui } = useLang();
  const c = useCopy();
  const labelOf = useFilterLabel();
  if (!browse.active.length) return null;
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label={c("activeFilters")}>
      {browse.active.map((filter) => {
        const label = labelOf(filter);
        return (
          <button
            key={`${filter.type}-${String(filter.value)}`}
            type="button"
            onClick={() => browse.removeFilter(filter)}
            aria-label={c("removeFilter", { label })}
            className="d-hit kz-fade-up inline-flex h-8 items-center gap-1.5 rounded-full border border-[color:var(--d-ink)]/35 bg-primary/12 pe-2 ps-3 text-[13px] font-medium text-fg transition-colors hover:bg-primary/20"
          >
            <span className="max-w-[14rem] truncate">{label}</span>
            <X aria-hidden="true" className="size-3.5 text-fg-2" />
          </button>
        );
      })}
      <button type="button" onClick={browse.clearAll} className="d-hit h-8 rounded-full px-3 text-[13px] font-medium d-ink hover:bg-surface-2">
        {ui("clearAll")}
      </button>
    </div>
  );
}
