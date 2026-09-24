"use client";

import { Fragment } from "react";
import { X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getCategory } from "@/data/categories";
import { GRADES, ITEM_TYPES } from "@/data/grades";
import { COPY } from "../copy";
import { Diamond } from "../ui/Diamond";
import { ENDING_OPTIONS } from "./FilterOptions";

/** Human label for an active filter chip. */
export function useFilterLabel() {
  const { t, ui, money } = useLang();
  return (filter) => {
    switch (filter.type) {
      case "category":
        return t(getCategory(filter.value)?.name);
      case "grade":
        return t(GRADES[filter.value]?.label);
      case "itemType":
        return t(ITEM_TYPES[filter.value]);
      case "price":
        return `${money(filter.value[0])} – ${money(filter.value[1])}`;
      case "ending":
        return `${ui("endingWithin")} ${ui(ENDING_OPTIONS.find((o) => o.value === filter.value)?.key)}`;
      case "inStock":
        return ui("inStockOnly");
      case "discounted":
        return ui("discounted");
      case "search":
        return `«${filter.value}»`;
      default:
        return "";
    }
  };
}

/** Removable chips for every active filter, separated by diamonds, plus Clear all. */
export function ActiveChips({ browse }) {
  const { t, ui } = useLang();
  const label = useFilterLabel();
  if (!browse.active.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-line py-4">
      {browse.active.map((filter, index) => {
        const text = label(filter);
        return (
          <Fragment key={`${filter.type}-${String(filter.value)}`}>
            {index > 0 ? <Diamond size={4} className="text-line-strong" /> : null}
            <button type="button" onClick={() => browse.removeFilter(filter)} aria-label={`${t(COPY.remove)}: ${text}`} className="c-chip min-h-9 gap-2 ps-3 pe-2">
              <span dir="auto">{text}</span>
              <X aria-hidden="true" className="size-3.5 text-fg-3" />
            </button>
          </Fragment>
        );
      })}
      <button type="button" onClick={browse.clearAll} className="c-link ms-2 min-h-9 text-sm font-semibold text-primary">
        {ui("clearAll")}
      </button>
    </div>
  );
}
