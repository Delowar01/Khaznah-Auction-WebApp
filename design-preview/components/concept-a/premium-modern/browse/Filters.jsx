"use client";

// Premium Modern filters: an unboxed rail of hairline-divided groups with
// small-caps legends, square charcoal checkboxes and live counts. The same
// groups fill the phone / tablet filter sheet.
import { useId } from "react";
import { Check } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { ENDING_WINDOWS, useCommitField, usePriceDraft } from "@/components/shared/browse/hooks";
import { PriceRange } from "@/components/shared/ui/PriceRange";
import { CATEGORIES } from "@/data/categories";
import { GRADES, GRADE_ORDER, ITEM_TYPES } from "@/data/grades";
import { RIYAL } from "@/lib/format";
import { cx } from "../ui";

// Grade dots in the pills' text colours (the pill fills are too pale for a dot).
const GRADE_DOT = {
  new: "bg-[var(--pr-guide-blue)]",
  A: "bg-[var(--pr-grade-a)]",
  B: "bg-[var(--pr-grade-b)]",
  C: "bg-[var(--pr-grade-b)]",
  D: "bg-[var(--pr-guide-pink)]",
  R: "bg-[var(--pr-guide-pink)]",
  F: "bg-[var(--pr-guide-pink)]",
};

function Group({ legend, children }) {
  return (
    <fieldset className="border-b border-line py-5 last:border-b-0 last:pb-0">
      <legend className="float-left w-full pr-kicker text-[#4a4d57]">{legend}</legend>
      <div className="clear-both pt-3">{children}</div>
    </fieldset>
  );
}

function Option({ type = "checkbox", name, checked, disabled = false, onChange, count, children }) {
  return (
    <label className={cx("flex min-h-9 items-center gap-3 py-0.5 pr-md text-fg", disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer")}>
      <input type={type} name={name} checked={checked} disabled={disabled} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cx(
          "grid size-[18px] shrink-0 place-items-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]",
          type === "radio" ? "rounded-full" : "rounded-[3px]",
          checked ? "border-[var(--pr-charcoal)] bg-[var(--pr-charcoal)] text-white" : "border-[#b9a98a] bg-white",
        )}
      >
        {checked ? type === "radio" ? <span className="size-1.5 rounded-full bg-white" /> : <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
      {count != null ? <span className="pr-sm tabular text-fg-2">{count}</span> : null}
    </label>
  );
}

function PriceField({ label, value, onCommit }) {
  const id = useId();
  const field = useCommitField(value, onCommit);
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="pr-xs text-fg-2">
        {label}
      </label>
      <div className="mt-1 flex h-10 items-center gap-1.5 rounded-[4px] border border-[#d3cfc6] bg-white px-2.5 focus-within:border-[var(--pr-charcoal)] focus-within:ring-1 focus-within:ring-[var(--pr-charcoal)]">
        <span aria-hidden="true" className="pr-sm text-fg-2">
          {RIYAL}
        </span>
        <input id={id} type="number" inputMode="numeric" dir="ltr" {...field} className="pr-no-spin w-full min-w-0 bg-transparent pr-md tabular text-fg outline-none" />
      </div>
    </div>
  );
}

function Price({ browse }) {
  const { ui } = useLang();
  const price = usePriceDraft(browse.state.price, browse.setPrice);
  return (
    <div className="px-1">
      <PriceRange min={price.bounds[0]} max={price.bounds[1]} step={price.step} value={price.draft} onChange={price.slide} />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <PriceField label={ui("min")} value={price.draft[0]} onCommit={price.commitMin} />
        <PriceField label={ui("max")} value={price.draft[1]} onCommit={price.commitMax} />
      </div>
    </div>
  );
}

/** Every Browse filter, auction timing straight after the categories. */
export function Refine({ browse }) {
  const { t, ui } = useLang();
  const name = useId();
  const { state, facets } = browse;
  return (
    <div>
      <Group legend={ui("category")}>
        {CATEGORIES.map((category) => {
          const count = facets.categories[category.slug] || 0;
          const checked = state.categories.includes(category.slug);
          return (
            <Option key={category.slug} checked={checked} count={count} disabled={!count && !checked} onChange={() => browse.toggleCategory(category.slug)}>
              {t(category.name)}
            </Option>
          );
        })}
      </Group>
      <Group legend={ui("endingWithin")}>
        {ENDING_WINDOWS.map((option) => (
          <Option key={option.value} type="radio" name={`${name}-ending`} checked={state.ending === option.value} onChange={() => browse.setEnding(option.value)}>
            {ui(option.key)}
          </Option>
        ))}
      </Group>
      <Group legend={ui("conditionGrade")}>
        {GRADE_ORDER.map((key) => {
          const count = facets.grades[key] || 0;
          const checked = state.grades.includes(key);
          return (
            <Option key={key} checked={checked} count={count} disabled={!count && !checked} onChange={() => browse.toggleGrade(key)}>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className={cx("size-2 rounded-full", GRADE_DOT[key])} />
                {t(GRADES[key].label)}
              </span>
            </Option>
          );
        })}
      </Group>
      <Group legend={ui("priceRange")}>
        <Price browse={browse} />
      </Group>
      <Group legend={ui("itemType")}>
        {Object.entries(ITEM_TYPES).map(([key, label]) => {
          const count = facets.itemTypes[key] || 0;
          const checked = state.itemTypes.includes(key);
          return (
            <Option key={key} checked={checked} count={count} disabled={!count && !checked} onChange={() => browse.toggleItemType(key)}>
              {t(label)}
            </Option>
          );
        })}
      </Group>
      <Group legend={ui("availability")}>
        <Option checked={state.inStock} onChange={() => browse.setInStock(!state.inStock)}>
          {ui("inStockOnly")}
        </Option>
        <Option checked={state.discounted} onChange={() => browse.setDiscounted(!state.discounted)}>
          {ui("discounted")}
        </Option>
      </Group>
    </div>
  );
}
