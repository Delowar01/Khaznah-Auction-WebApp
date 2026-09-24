"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { CATEGORIES } from "@/data/categories";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";

function Segment({ active, onClick, children }) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={active}
        onClick={onClick}
        className={cx(
          "relative flex h-[4.5rem] items-center gap-3 whitespace-nowrap border-e border-line px-4 text-start transition-colors lg:px-5",
          active ? "bg-bg text-fg" : "text-fg-2 hover:bg-surface-2 hover:text-fg",
        )}
      >
        <span aria-hidden="true" className={cx("absolute inset-x-0 top-0 h-0.5 transition-colors", active ? "bg-primary" : "bg-transparent")} />
        {children}
      </button>
    </li>
  );
}

/** Segmented, scrollable band of the eight categories with small cut-outs. */
export function CategoryBand({ browse }) {
  const { t, ui } = useLang();
  const selected = browse.state.categories;
  return (
    <nav aria-label={ui("categories")} className="border-b border-line bg-surface">
      <div className="c-container">
        <ul className="c-scroller -mx-4 gap-0 border-s border-line sm:-mx-6 lg:mx-0">
          <Segment active={!selected.length} onClick={() => browse.setCategory(null)}>
            <Diamond size={8} className={selected.length ? "text-line-strong" : "text-accent"} />
            <span className="text-sm font-semibold">{ui("allCategories")}</span>
          </Segment>
          {CATEGORIES.map((category) => {
            const active = selected.includes(category.slug);
            return (
              <Segment key={category.slug} active={active} onClick={() => browse.setCategory(active && selected.length === 1 ? null : category.slug)}>
                <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-plate">
                  <Img image={category.cutout} alt="" sizes="44px" className="size-9 object-contain" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">{t(category.name)}</span>
                  <span className="c-num mt-1 text-xs text-fg-3">{browse.facets.categories[category.slug] || 0}</span>
                </span>
              </Segment>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
