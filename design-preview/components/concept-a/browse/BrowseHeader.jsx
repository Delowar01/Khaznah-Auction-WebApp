"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CATEGORIES, getCategory } from "@/data/categories";
import { Breadcrumbs } from "../ui/Breadcrumbs";

const TABS = [
  ["all", "allLots"],
  ["auction", "auctions"],
  ["buy_now", "buyNow"],
];

export function BrowseHeader({ browse }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { state } = browse;
  const category = state.categories.length === 1 ? getCategory(state.categories[0]) : null;
  const title = category ? t(category.name) : state.tab === "auction" ? ui("auctions") : state.tab === "buy_now" ? ui("buyNow") : ui("allLots");

  return (
    <div className="border-b border-line">
      <div className="mx-auto max-w-[1360px] px-5 pb-0 pt-8 sm:px-6 lg:px-10 lg:pt-12">
        <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("browse"), href: category ? link("/browse") : undefined }, ...(category ? [{ label: t(category.name) }] : [])]} />
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h1 className="a-display text-[44px] text-fg sm:text-[60px] rtl:sm:text-[52px]">{title}</h1>
          <p className="pb-2 text-[14px] text-fg-2">{browse.loading ? ui("loadingLots") : pl("results", browse.total)}</p>
        </div>
        <div role="tablist" aria-label={ui("filters")} className="no-scrollbar mt-8 flex gap-8 overflow-x-auto">
          {TABS.map(([value, key]) => {
            const selected = state.tab === value;
            return (
              <button
                key={value}
                role="tab"
                aria-selected={selected}
                onClick={() => browse.setTab(value)}
                className={`relative whitespace-nowrap pb-4 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors rtl:text-[15px] rtl:normal-case rtl:tracking-normal ${selected ? "text-fg" : "text-fg-3 hover:text-fg"}`}
              >
                {ui(key)} <span className="ms-1 font-normal text-fg-3 tabular">{browse.facets.tabs[value]}</span>
                <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-0.5 bg-fg transition-transform duration-300 ${selected ? "scale-x-100" : "scale-x-0"}`} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="border-t border-line bg-surface">
        <div className="no-scrollbar mx-auto flex max-w-[1360px] gap-2 overflow-x-auto px-5 py-3 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => browse.setCategory(null)}
            aria-pressed={!state.categories.length}
            className={`h-9 shrink-0 rounded-full px-4 text-[13px] transition-colors ${!state.categories.length ? "bg-secondary text-on-secondary" : "text-fg-2 hover:bg-surface-2 hover:text-fg"}`}
          >
            {ui("allCategories")}
          </button>
          {CATEGORIES.map((c) => {
            const active = state.categories.includes(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => browse.setCategory(active ? null : c.slug)}
                aria-pressed={active}
                className={`h-9 shrink-0 rounded-full px-4 text-[13px] transition-colors ${active ? "bg-secondary text-on-secondary" : "text-fg-2 hover:bg-surface-2 hover:text-fg"}`}
              >
                {t(c.name)} <span className="ms-1 opacity-60 tabular">{browse.facets.categories[c.slug] || 0}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
