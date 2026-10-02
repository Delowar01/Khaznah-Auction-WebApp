"use client";

// Contemporary Saudi Commerce filters: the home page's sage category rail
// (icon, name, count) followed by compact, clearly separated groups for
// auction timing, condition, price, item type and availability.
import { useId } from "react";
import { Check } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { ENDING_WINDOWS, useCommitField, usePriceDraft } from "@/components/shared/browse/hooks";
import { PriceRange } from "@/components/shared/ui/PriceRange";
import { GRADES, GRADE_ORDER, ITEM_TYPES } from "@/data/grades";
import { RIYAL } from "@/lib/format";
import { COPY } from "../copy";
import { CATEGORY_RAIL } from "../data";
import { cx, gradeTone } from "../ui";

function Box({ checked, radio = false }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "grid size-[18px] shrink-0 place-items-center border-[1.5px] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]",
        radio ? "rounded-full" : "rounded-[4px]",
        checked ? "border-[var(--sc-green)] bg-[var(--sc-green)] text-white" : "border-[#b9cbc3] bg-white",
      )}
    >
      {checked ? radio ? <span className="size-1.5 rounded-full bg-white" /> : <Check className="size-3.5" strokeWidth={3} /> : null}
    </span>
  );
}

function Group({ legend, children }) {
  return (
    <fieldset className="border-t border-[#d5e3db] px-1 pb-4 pt-4">
      <legend className="float-left w-full sc-micro text-[var(--sc-muted)]">{legend}</legend>
      <div className="clear-both pt-2.5">{children}</div>
    </fieldset>
  );
}

function Option({ checked, disabled = false, onChange, count, children, type = "checkbox", name }) {
  return (
    <label className={cx("flex min-h-10 items-center gap-3 rounded-[7px] px-1.5 sc-md text-[var(--sc-ink)] transition-colors", disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer hover:bg-[#dfece5]")}>
      <input type={type} name={name} checked={checked} disabled={disabled} onChange={onChange} className="peer sr-only" />
      <Box checked={checked} radio={type === "radio"} />
      <span className="min-w-0 flex-1">{children}</span>
      {count != null ? <span className="sc-sm tabular text-[var(--sc-muted)]">{count}</span> : null}
    </label>
  );
}

function PriceField({ label, value, onCommit }) {
  const id = useId();
  const field = useCommitField(value, onCommit);
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="sc-sm text-[var(--sc-muted)]">
        {label}
      </label>
      <div className="mt-1 flex h-11 items-center gap-1.5 rounded-[7px] border border-[var(--sc-line)] bg-white px-2.5 focus-within:border-[var(--sc-green)] focus-within:ring-1 focus-within:ring-[var(--sc-green)]">
        <span aria-hidden="true" className="sc-sm text-[var(--sc-muted)]">
          {RIYAL}
        </span>
        <input id={id} type="number" inputMode="numeric" dir="ltr" {...field} className="sc-no-spin w-full min-w-0 bg-transparent sc-md tabular text-[var(--sc-ink)] outline-none" />
      </div>
    </div>
  );
}

function Price({ browse }) {
  const { ui } = useLang();
  const price = usePriceDraft(browse.state.price, browse.setPrice);
  return (
    <div className="px-1.5">
      <PriceRange min={price.bounds[0]} max={price.bounds[1]} step={price.step} value={price.draft} onChange={price.slide} trackClassName="!bg-[#cfdcd7]" />
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <PriceField label={ui("min")} value={price.draft[0]} onCommit={price.commitMin} />
        <PriceField label={ui("max")} value={price.draft[1]} onCommit={price.commitMax} />
      </div>
    </div>
  );
}

/** Category rows in the home page's rail style, as multi-select filters. */
function Categories({ browse }) {
  const { t, ui } = useLang();
  const { state, facets } = browse;
  return (
    <fieldset className="pb-3">
      <legend className="float-left w-full px-1 sc-micro text-[var(--sc-muted)]">{ui("category")}</legend>
      <ul className="clear-both grid gap-0.5 pt-2.5">
        {CATEGORY_RAIL.map(({ slug, icon: Icon, category }) => {
          const count = facets.categories[slug] || 0;
          const checked = state.categories.includes(slug);
          const disabled = !count && !checked;
          return (
            <li key={slug}>
              <label
                className={cx(
                  "flex h-11 items-center gap-3 rounded-[7px] px-2 sc-md transition-colors",
                  checked ? "bg-white font-semibold text-[var(--sc-green)]" : "text-[var(--sc-ink)]",
                  disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer hover:bg-[#dfece5] hover:text-[var(--sc-green)]",
                )}
              >
                <input type="checkbox" checked={checked} disabled={disabled} onChange={() => browse.toggleCategory(slug)} className="peer sr-only" />
                <Box checked={checked} />
                <Icon aria-hidden="true" className="size-[22px] shrink-0 text-[var(--sc-green)]" strokeWidth={1.5} />
                <span className="min-w-0 flex-1 truncate">{slug === "bulk-pallets" ? t(COPY.navBulk) : t(category.name)}</span>
                <span className="sc-sm font-normal tabular text-[var(--sc-muted)]">{count}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

/** Every Browse filter; `withCategories` is false where the categories show elsewhere. */
export function FilterGroups({ browse, withCategories = true }) {
  const { t, ui } = useLang();
  const name = useId();
  const { state, facets } = browse;
  return (
    <div>
      {withCategories ? <Categories browse={browse} /> : null}
      <Group legend={ui("endingWithin")}>
        <div className="grid grid-cols-2 gap-1">
          {ENDING_WINDOWS.map((option) => (
            <Option key={option.value} type="radio" name={`${name}-ending`} checked={state.ending === option.value} onChange={() => browse.setEnding(option.value)}>
              {ui(option.key)}
            </Option>
          ))}
        </div>
      </Group>
      <Group legend={ui("conditionGrade")}>
        {GRADE_ORDER.map((key) => {
          const count = facets.grades[key] || 0;
          const checked = state.grades.includes(key);
          return (
            <Option key={key} checked={checked} count={count} disabled={!count && !checked} onChange={() => browse.toggleGrade(key)}>
              <span className={cx("inline-flex h-6 items-center rounded-[6px] px-2 sc-sm font-medium", gradeTone(key))}>{t(GRADES[key].label)}</span>
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
