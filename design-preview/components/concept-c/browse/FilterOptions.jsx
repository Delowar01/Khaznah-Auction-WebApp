"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { PriceRange } from "@/components/shared/ui/PriceRange";
import { CATEGORIES } from "@/data/categories";
import { GRADES, GRADE_ORDER, ITEM_TYPES } from "@/data/grades";
import { PRICE_BOUNDS } from "@/lib/useBrowse";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";

export const ENDING_OPTIONS = [
  { value: "all", key: "anyTime" },
  { value: "1h", key: "within1h" },
  { value: "6h", key: "within6h" },
  { value: "24h", key: "within24h" },
];

/** Checkbox (or radio) row with a diamond mark and a facet count. */
export function OptionRow({ type = "checkbox", name, checked, onChange, label, count, swatch }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm px-1 text-[0.9375rem] text-fg hover:bg-surface-2/70">
      <input type={type} name={name} checked={checked} onChange={onChange} className={type === "radio" ? "c-radio" : "c-check"} />
      {swatch ? (
        <span style={{ color: swatch }}>
          <Diamond size={7} />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">{label}</span>
      {count != null ? <span className={cx("c-num text-xs", count ? "text-fg-3" : "text-fg-3/70")}>{count}</span> : null}
    </label>
  );
}

export function CategoryOptions({ browse }) {
  const { t } = useLang();
  return CATEGORIES.map((c) => (
    <OptionRow key={c.slug} checked={browse.state.categories.includes(c.slug)} onChange={() => browse.toggleCategory(c.slug)} label={t(c.name)} count={browse.facets.categories[c.slug] || 0} />
  ));
}

export function GradeOptions({ browse }) {
  const { t } = useLang();
  return GRADE_ORDER.map((key) => (
    <OptionRow
      key={key}
      checked={browse.state.grades.includes(key)}
      onChange={() => browse.toggleGrade(key)}
      label={t(GRADES[key].label)}
      swatch={`var(--grade-${GRADES[key].tone})`}
      count={browse.facets.grades[key] || 0}
    />
  ));
}

export function ItemTypeOptions({ browse }) {
  const { t } = useLang();
  return Object.entries(ITEM_TYPES).map(([key, label]) => (
    <OptionRow key={key} checked={browse.state.itemTypes.includes(key)} onChange={() => browse.toggleItemType(key)} label={t(label)} count={browse.facets.itemTypes[key] || 0} />
  ));
}

export function EndingOptions({ browse, name }) {
  const { ui } = useLang();
  return ENDING_OPTIONS.map((option) => (
    <OptionRow key={option.value} type="radio" name={name} checked={browse.state.ending === option.value} onChange={() => browse.setEnding(option.value)} label={ui(option.key)} />
  ));
}

export function AvailabilityOptions({ browse }) {
  const { ui } = useLang();
  return (
    <>
      <OptionRow checked={browse.state.inStock} onChange={() => browse.setInStock(!browse.state.inStock)} label={ui("inStockOnly")} />
      <OptionRow checked={browse.state.discounted} onChange={() => browse.setDiscounted(!browse.state.discounted)} label={ui("discounted")} />
    </>
  );
}

export function PriceOptions({ browse }) {
  const { ui } = useLang();
  const [low, high] = browse.state.price;
  return (
    <div className="px-1 pb-1 pt-2">
      <PriceRange min={PRICE_BOUNDS[0]} max={PRICE_BOUNDS[1]} step={50} value={browse.state.price} onChange={browse.setPrice} />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-sm border border-line bg-surface px-3 py-2">
          <p className="text-xs text-fg-3">{ui("min")}</p>
          <Money value={low} className="c-num text-sm font-semibold" />
        </div>
        <div className="rounded-sm border border-line bg-surface px-3 py-2 text-end">
          <p className="text-xs text-fg-3">{ui("max")}</p>
          <Money value={high} className="c-num text-sm font-semibold" />
        </div>
      </div>
    </div>
  );
}
