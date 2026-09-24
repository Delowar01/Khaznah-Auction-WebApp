"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { CATEGORIES } from "@/data/categories";
import { GRADES, GRADE_ORDER, ITEM_TYPES } from "@/data/grades";
import { PRICE_BOUNDS } from "@/lib/useBrowse";
import { Checkbox, Radio } from "../ui/Choice";
import { GRADE_DOT } from "../ui/GradeChip";
import { cx } from "../ui/cx";
import { FacetGroup } from "./FacetGroup";
import { PriceFacet } from "./PriceFacet";

const ENDING = [
  { value: "all", key: "anyTime" },
  { value: "1h", key: "within1h" },
  { value: "6h", key: "within6h" },
  { value: "24h", key: "within24h" },
];

/**
 * Every browse facet with live counts. Used in the desktop sidebar and the
 * mobile filter sheet; `categories` narrows the list inside a storefront.
 */
export function FacetPanel({ browse, categories = CATEGORIES, name = "facet", showEnding = true }) {
  const { t, ui } = useLang();
  const { state, facets } = browse;
  const priceActive = state.price[0] > PRICE_BOUNDS[0] || state.price[1] < PRICE_BOUNDS[1];

  return (
    <div>
      <FacetGroup title={ui("category")} active={state.categories.length}>
        {categories.map((category) => {
          const count = facets.categories[category.slug] || 0;
          const checked = state.categories.includes(category.slug);
          return (
            <Checkbox key={category.slug} checked={checked} count={count} disabled={!count && !checked} onChange={() => browse.toggleCategory(category.slug)}>
              {t(category.name)}
            </Checkbox>
          );
        })}
      </FacetGroup>

      <FacetGroup title={ui("conditionGrade")} active={state.grades.length}>
        {GRADE_ORDER.map((key) => {
          const count = facets.grades[key] || 0;
          const checked = state.grades.includes(key);
          return (
            <Checkbox key={key} checked={checked} count={count} disabled={!count && !checked} onChange={() => browse.toggleGrade(key)}>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className={cx("size-2 rounded-full", GRADE_DOT[key])} />
                {key === "new" ? t(GRADES.new.label) : t(GRADES[key].label)}
              </span>
            </Checkbox>
          );
        })}
      </FacetGroup>

      <FacetGroup title={ui("itemType")} active={state.itemTypes.length}>
        {Object.entries(ITEM_TYPES).map(([key, label]) => {
          const count = facets.itemTypes[key] || 0;
          const checked = state.itemTypes.includes(key);
          return (
            <Checkbox key={key} checked={checked} count={count} disabled={!count && !checked} onChange={() => browse.toggleItemType(key)}>
              {t(label)}
            </Checkbox>
          );
        })}
      </FacetGroup>

      <FacetGroup title={ui("priceRange")} active={priceActive ? 1 : 0}>
        <PriceFacet value={state.price} onChange={browse.setPrice} />
      </FacetGroup>

      {showEnding ? (
        <FacetGroup title={ui("endingWithin")} active={state.ending !== "all" ? 1 : 0}>
          <div role="radiogroup" aria-label={ui("endingWithin")}>
            {ENDING.map((option) => (
              <Radio key={option.value} name={`${name}-ending`} value={option.value} checked={state.ending === option.value} onChange={browse.setEnding}>
                {ui(option.key)}
              </Radio>
            ))}
          </div>
        </FacetGroup>
      ) : null}

      <FacetGroup title={ui("availability")} active={(state.inStock ? 1 : 0) + (state.discounted ? 1 : 0)}>
        <Checkbox checked={state.inStock} onChange={browse.setInStock}>
          {ui("inStockOnly")}
        </Checkbox>
        <Checkbox checked={state.discounted} onChange={browse.setDiscounted}>
          {ui("discounted")}
        </Checkbox>
      </FacetGroup>
    </div>
  );
}
