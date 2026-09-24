"use client";

import { X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getCategory } from "@/data/categories";
import { GRADES, ITEM_TYPES } from "@/data/grades";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

const WINDOWS = { "1h": "within1h", "6h": "within6h", "24h": "within24h" };

/** Human label for an active filter from useBrowse().active. */
export function useFilterLabel() {
  const { t, ui, money } = useLang();
  return (filter) => {
    switch (filter.type) {
      case "category":
        return t(getCategory(filter.value)?.name);
      case "grade":
        return filter.value === "new" ? t(GRADES.new.label) : t(GRADES[filter.value]?.label);
      case "itemType":
        return t(ITEM_TYPES[filter.value]);
      case "price":
        return `${money(filter.value[0])} – ${money(filter.value[1])}`;
      case "ending":
        return t(COPY.endsWithin, { window: ui(WINDOWS[filter.value]) });
      case "inStock":
        return ui("inStockOnly");
      case "discounted":
        return ui("discounted");
      case "search":
        return t(COPY.quoted, { q: filter.value });
      default:
        return "";
    }
  };
}

/** Removable chips for every active filter, with "Clear all". */
export function ActiveChips({ browse, className = "" }) {
  const { t, ui } = useLang();
  const label = useFilterLabel();
  if (!browse.active.length) return null;
  return (
    <ul aria-label={t(COPY.activeFilters)} className={cx("flex flex-wrap items-center gap-1.5", className)}>
      {browse.active.map((filter) => {
        const text = label(filter);
        return (
          <li key={`${filter.type}-${String(filter.value)}`}>
            <button
              type="button"
              onClick={() => browse.removeFilter(filter)}
              aria-label={t(COPY.removeFilter, { label: text })}
              className="group inline-flex h-8 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 ps-3 pe-2 kb-xs font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-primary/15"
            >
              <span className="max-w-[16rem] truncate">{text}</span>
              <X aria-hidden="true" className="size-3.5 opacity-70 group-hover:opacity-100" strokeWidth={2.5} />
            </button>
          </li>
        );
      })}
      <li>
        <button type="button" onClick={browse.clearAll} className="h-8 rounded-full px-2.5 kb-xs font-bold text-fg-2 underline-offset-4 hover:text-fg hover:underline">
          {ui("clearAll")}
        </button>
      </li>
    </ul>
  );
}
