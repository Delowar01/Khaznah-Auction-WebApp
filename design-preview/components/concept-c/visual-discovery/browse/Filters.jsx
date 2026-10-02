"use client";

// Visual Discovery filters, inside the rounded filter drawer: every choice is
// a pill, as in the home page's category row and mode pills.
import { useId } from "react";
import { Check } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { ENDING_WINDOWS, useCommitField, usePriceDraft } from "@/components/shared/browse/hooks";
import { PriceRange } from "@/components/shared/ui/PriceRange";
import { CATEGORIES } from "@/data/categories";
import { GRADES, GRADE_ORDER, ITEM_TYPES } from "@/data/grades";
import { RIYAL } from "@/lib/format";
import { cx, gradeTone } from "../ui";

function Section({ legend, children }) {
  return (
    <fieldset className="border-b border-[var(--vd-line)] py-5 last:border-b-0">
      <legend className="float-left w-full vd-h3 !text-[16px] text-[var(--vd-ink)]">{legend}</legend>
      <div className="clear-both flex flex-wrap gap-2 pt-3">{children}</div>
    </fieldset>
  );
}

/** A checkbox or radio drawn as a pill; `tone` colours grade pills when off. */
export function PillOption({ type = "checkbox", name, checked, disabled = false, onChange, count, tone, children }) {
  return (
    <label className={cx("relative", disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer")}>
      <input type={type} name={name} checked={checked} disabled={disabled} onChange={onChange} className="peer sr-only" />
      <span
        className={cx(
          "inline-flex h-10 items-center gap-2 rounded-full border px-4 vd-md transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]",
          checked ? "border-[var(--vd-indigo)] bg-[var(--vd-indigo)] font-semibold text-white" : cx("border-[#dfe7f3]", tone || "bg-white text-[var(--vd-ink)]", !disabled && "hover:border-[#c3d2ea]"),
        )}
      >
        {checked ? <Check aria-hidden="true" className="-ms-1 size-4 shrink-0" strokeWidth={2.6} /> : null}
        {children}
        {count != null ? <span className={cx("vd-sm tabular", checked ? "text-white/80" : "text-[var(--vd-muted)]")}>{count}</span> : null}
      </span>
    </label>
  );
}

function PriceField({ label, value, onCommit }) {
  const id = useId();
  const field = useCommitField(value, onCommit);
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="vd-sm text-[var(--vd-muted)]">
        {label}
      </label>
      <div className="mt-1 flex h-11 items-center gap-1.5 rounded-full bg-[var(--vd-bluegray)] px-4 focus-within:ring-2 focus-within:ring-[var(--vd-indigo)]">
        <span aria-hidden="true" className="vd-sm text-[var(--vd-muted)]">
          {RIYAL}
        </span>
        <input id={id} type="number" inputMode="numeric" dir="ltr" {...field} className="vd-no-spin w-full min-w-0 bg-transparent vd-md font-semibold tabular text-[var(--vd-ink)] outline-none" />
      </div>
    </div>
  );
}

function Price({ browse }) {
  const { ui } = useLang();
  const price = usePriceDraft(browse.state.price, browse.setPrice);
  return (
    <div className="w-full px-1">
      <PriceRange min={price.bounds[0]} max={price.bounds[1]} step={price.step} value={price.draft} onChange={price.slide} trackClassName="!bg-[var(--vd-bluegray)]" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <PriceField label={ui("min")} value={price.draft[0]} onCommit={price.commitMin} />
        <PriceField label={ui("max")} value={price.draft[1]} onCommit={price.commitMax} />
      </div>
    </div>
  );
}

export function FilterSections({ browse }) {
  const { t, ui } = useLang();
  const name = useId();
  const { state, facets } = browse;
  return (
    <div>
      <Section legend={ui("category")}>
        {CATEGORIES.map((category) => {
          const count = facets.categories[category.slug] || 0;
          const checked = state.categories.includes(category.slug);
          return (
            <PillOption key={category.slug} checked={checked} count={count} disabled={!count && !checked} onChange={() => browse.toggleCategory(category.slug)}>
              {t(category.name)}
            </PillOption>
          );
        })}
      </Section>
      <Section legend={ui("endingWithin")}>
        {ENDING_WINDOWS.map((option) => (
          <PillOption key={option.value} type="radio" name={`${name}-ending`} checked={state.ending === option.value} onChange={() => browse.setEnding(option.value)}>
            {ui(option.key)}
          </PillOption>
        ))}
      </Section>
      <Section legend={ui("conditionGrade")}>
        {GRADE_ORDER.map((key) => {
          const count = facets.grades[key] || 0;
          const checked = state.grades.includes(key);
          return (
            <PillOption key={key} checked={checked} count={count} disabled={!count && !checked} tone={gradeTone(key)} onChange={() => browse.toggleGrade(key)}>
              {t(GRADES[key].label)}
            </PillOption>
          );
        })}
      </Section>
      <Section legend={ui("priceRange")}>
        <Price browse={browse} />
      </Section>
      <Section legend={ui("itemType")}>
        {Object.entries(ITEM_TYPES).map(([key, label]) => {
          const count = facets.itemTypes[key] || 0;
          const checked = state.itemTypes.includes(key);
          return (
            <PillOption key={key} checked={checked} count={count} disabled={!count && !checked} onChange={() => browse.toggleItemType(key)}>
              {t(label)}
            </PillOption>
          );
        })}
      </Section>
      <Section legend={ui("availability")}>
        <PillOption checked={state.inStock} onChange={() => browse.setInStock(!state.inStock)}>
          {ui("inStockOnly")}
        </PillOption>
        <PillOption checked={state.discounted} onChange={() => browse.setDiscounted(!state.discounted)}>
          {ui("discounted")}
        </PillOption>
      </Section>
    </div>
  );
}
