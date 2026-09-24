"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { PriceRange } from "@/components/shared/ui/PriceRange";
import { GRADE_ORDER, GRADES, ITEM_TYPES } from "@/data/grades";
import { PRICE_BOUNDS } from "@/lib/useBrowse";
import { Checkbox } from "./Checkbox";

function Group({ title, children }) {
  return (
    <fieldset className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <legend className="a-eyebrow float-start mb-4 w-full">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

const ENDING = [
  ["all", "anyTime"],
  ["1h", "within1h"],
  ["6h", "within6h"],
  ["24h", "within24h"],
];

/** Concept A filter set — shared by the desktop sidebar and the mobile sheet. */
export function FilterPanel({ browse }) {
  const { t, ui } = useLang();
  const { state, facets } = browse;

  return (
    <div>
      <Group title={ui("conditionGrade")}>
        {GRADE_ORDER.map((key) => (
          <Checkbox key={key} checked={state.grades.includes(key)} onChange={() => browse.toggleGrade(key)} count={facets.grades[key] || 0}>
            {t(GRADES[key].label)}
          </Checkbox>
        ))}
      </Group>
      <Group title={ui("itemType")}>
        {Object.entries(ITEM_TYPES).map(([key, label]) => (
          <Checkbox key={key} checked={state.itemTypes.includes(key)} onChange={() => browse.toggleItemType(key)} count={facets.itemTypes[key] || 0}>
            {t(label)}
          </Checkbox>
        ))}
      </Group>
      <Group title={ui("priceRange")}>
        <PriceRange min={PRICE_BOUNDS[0]} max={PRICE_BOUNDS[1]} step={50} value={state.price} onChange={browse.setPrice} fillClassName="!bg-fg" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <label key={i} className="block">
              <span className="text-[12px] text-fg-3">{ui(i === 0 ? "min" : "max")}</span>
              <input
                type="number"
                inputMode="numeric"
                min={PRICE_BOUNDS[0]}
                max={PRICE_BOUNDS[1]}
                step={50}
                value={state.price[i]}
                onChange={(e) => {
                  const v = Number(e.target.value) || 0;
                  browse.setPrice(i === 0 ? [Math.min(v, state.price[1]), state.price[1]] : [state.price[0], Math.max(v, state.price[0])]);
                }}
                className="mt-1 h-10 w-full rounded-control border border-line-strong bg-surface px-3 text-sm text-fg tabular outline-none focus:border-fg"
                dir="ltr"
              />
            </label>
          ))}
        </div>
      </Group>
      {state.tab !== "buy_now" ? (
        <Group title={ui("endingWithin")}>
          <div className="flex flex-wrap gap-2">
            {ENDING.map(([value, key]) => (
              <button
                key={value}
                type="button"
                aria-pressed={state.ending === value}
                onClick={() => browse.setEnding(value)}
                className={`h-9 rounded-full border px-3.5 text-[13px] transition-colors ${state.ending === value ? "border-secondary bg-secondary text-on-secondary" : "border-line-strong text-fg hover:border-fg"}`}
              >
                {ui(key)}
              </button>
            ))}
          </div>
        </Group>
      ) : null}
      <Group title={ui("availability")}>
        <Checkbox checked={state.inStock} onChange={() => browse.setInStock(!state.inStock)}>
          {ui("inStockOnly")}
        </Checkbox>
        <Checkbox checked={state.discounted} onChange={() => browse.setDiscounted(!state.discounted)}>
          {ui("discounted")}
        </Checkbox>
      </Group>
    </div>
  );
}
