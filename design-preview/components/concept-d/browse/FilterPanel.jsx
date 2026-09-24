"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { PriceRange } from "@/components/shared/ui/PriceRange";
import { CATEGORIES } from "@/data/categories";
import { GRADE_ORDER, ITEM_TYPES } from "@/data/grades";
import { PRICE_BOUNDS } from "@/lib/useBrowse";
import { Segmented } from "../ui/Segmented";
import { Switch } from "../ui/Controls";
import { GradeChip } from "../ui/GradeChip";
import { FilterSection, CheckRow, ToggleChip } from "./FilterSection";

/** Every browse facet: category, grade, item type, price, ending window, availability. */
export function FilterPanel({ browse, sellerMode = false, header = false }) {
  const { t, ui } = useLang();
  const { state, facets } = browse;
  const endingOptions = [
    { value: "all", label: ui("anyTime") },
    { value: "1h", label: ui("within1h") },
    { value: "6h", label: ui("within6h") },
    { value: "24h", label: ui("within24h") },
  ];
  const priceActive = state.price[0] > PRICE_BOUNDS[0] || state.price[1] < PRICE_BOUNDS[1];

  return (
    <div>
      {header ? (
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h2 className="text-sm font-semibold text-fg">{ui("filters")}</h2>
          {browse.active.length ? (
            <button type="button" onClick={browse.clearAll} className="rounded-md px-2 py-1 text-[13px] font-medium d-ink hover:bg-surface-2">
              {ui("clearAll")}
            </button>
          ) : null}
        </div>
      ) : null}
      <FilterSection title={ui("category")} meta={state.categories.length || null}>
        <div className="-mx-2 space-y-0.5">
          {CATEGORIES.map((category) => (
            <CheckRow
              key={category.slug}
              checked={state.categories.includes(category.slug)}
              onChange={() => browse.toggleCategory(category.slug)}
              label={t(category.name)}
              count={facets.categories[category.slug]}
              disabled={sellerMode && !facets.categories[category.slug] && !state.categories.includes(category.slug)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title={ui("conditionGrade")} meta={state.grades.length || null}>
        <div className="flex flex-wrap gap-1.5">
          {GRADE_ORDER.map((grade) => (
            <ToggleChip key={grade} pressed={state.grades.includes(grade)} onClick={() => browse.toggleGrade(grade)} count={facets.grades[grade] || 0}>
              <GradeChip grade={grade} size="sm" className="pointer-events-none" />
            </ToggleChip>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={ui("itemType")} meta={state.itemTypes.length || null}>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(ITEM_TYPES).map(([key, label]) => (
            <ToggleChip key={key} pressed={state.itemTypes.includes(key)} onClick={() => browse.toggleItemType(key)} count={facets.itemTypes[key] || 0}>
              {t(label)}
            </ToggleChip>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={ui("priceRange")} meta={priceActive ? "•" : null}>
        <div className="px-1">
          <PriceRange min={PRICE_BOUNDS[0]} max={PRICE_BOUNDS[1]} step={50} value={state.price} onChange={browse.setPrice} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="d-panel-2 px-3 py-2">
            <p className="text-[11px] text-fg-3">{ui("min")}</p>
            <Money value={state.price[0]} className="d-num text-sm font-medium text-fg" />
          </div>
          <div className="d-panel-2 px-3 py-2 text-end">
            <p className="text-[11px] text-fg-3">{ui("max")}</p>
            <Money value={state.price[1]} className="d-num text-sm font-medium text-fg" />
          </div>
        </div>
      </FilterSection>

      <FilterSection title={ui("endingWithin")} meta={state.ending !== "all" ? "•" : null}>
        <Segmented label={ui("endingWithin")} value={state.ending} onChange={browse.setEnding} options={endingOptions} size="sm" stretch />
      </FilterSection>

      <FilterSection title={ui("availability")} meta={state.inStock || state.discounted ? "•" : null}>
        <Switch checked={state.inStock} onChange={browse.setInStock} label={ui("inStockOnly")} />
        <Switch checked={state.discounted} onChange={browse.setDiscounted} label={ui("discounted")} />
      </FilterSection>
    </div>
  );
}
