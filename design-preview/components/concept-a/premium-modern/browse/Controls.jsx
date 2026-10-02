"use client";

// Premium Modern Browse controls: text tabs on a hairline for the sale mode,
// a quiet "Sort by" menu, grid / list switch, removable filter tags and
// numbered pages.
import { useId } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { BROWSE_COPY as C } from "@/components/shared/browse/copy";
import { useFilterLabel } from "@/components/shared/browse/hooks";
import { Listbox } from "@/components/shared/ui/Listbox";
import { SORT_OPTIONS } from "@/lib/useBrowse";
import { btn, cx } from "../ui";

/** All → Auctions → Buy Now, with live counts. */
export function ModeTabs({ browse, className = "" }) {
  const { t } = useLang();
  const name = useId();
  const { state, facets } = browse;
  const options = [
    { value: "all", label: t(C.all), count: facets.tabs.all },
    { value: "auction", label: t(C.auctions), count: facets.tabs.auction },
    { value: "buy_now", label: t(C.buyNow), count: facets.tabs.buy_now },
  ];
  return (
    <fieldset className={cx("min-w-0", className)}>
      <legend className="sr-only">{t(C.saleType)}</legend>
      <div className="flex gap-5 sm:gap-8 dt:gap-10">
        {options.map((option) => (
          <label key={option.value} className="relative cursor-pointer whitespace-nowrap pb-3 pt-1">
            <input type="radio" name={name} value={option.value} checked={state.tab === option.value} onChange={() => browse.setTab(option.value)} className="peer sr-only" />
            <span className="flex items-baseline gap-1.5 rounded-[3px] pr-lg text-[#3c3f49] transition-colors hover:text-fg peer-checked:font-semibold peer-checked:text-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[var(--focus)]">
              {option.label}
              <span className="pr-sm font-normal tabular text-fg-2">{option.count}</span>
            </span>
            <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-[2px] peer-checked:bg-[var(--pr-charcoal)]" />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** "Sort by: Ending soonest" menu (desktop). */
export function SortMenu({ value, onChange }) {
  const { ui } = useLang();
  const options = SORT_OPTIONS.map((option) => ({ value: option.value, label: ui(option.key) }));
  return (
    <Listbox
      value={value}
      onChange={onChange}
      options={options}
      label={ui("sortBy")}
      buttonClassName="flex h-10 items-center gap-2 rounded-[4px] border border-[#d3cfc6] bg-white ps-3 pe-2.5 pr-md text-fg transition-colors hover:border-[#b9a98a]"
      renderButton={(current) => (
        <>
          <span className="text-fg-2">{ui("sortBy")}</span>
          <span className="font-semibold">{current?.label}</span>
        </>
      )}
      menuClassName="w-64 rounded-[6px] border border-line bg-white p-1 shadow-overlay"
      optionClassName="rounded-[4px] px-3 py-2.5 pr-md text-fg"
      activeOptionClassName="bg-[var(--pr-stone)]"
    />
  );
}

/** Sort choices as radios (phone / tablet sort sheet). */
export function SortChoices({ value, onChange }) {
  const { t, ui } = useLang();
  const name = useId();
  return (
    <fieldset>
      <legend className="sr-only">{t(C.sortSheet)}</legend>
      <div className="divide-y divide-line">
        {SORT_OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label key={option.value} className="flex min-h-[52px] cursor-pointer items-center justify-between gap-4 pr-lg text-fg">
              <input type="radio" name={name} checked={checked} onChange={() => onChange(option.value)} className="peer sr-only" />
              <span className={cx("rounded-[3px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[var(--focus)]", checked && "font-semibold")}>{ui(option.key)}</span>
              <span aria-hidden="true" className={cx("grid size-[18px] place-items-center rounded-full border", checked ? "border-[var(--pr-charcoal)] bg-[var(--pr-charcoal)]" : "border-[#b9a98a]")}>
                {checked ? <span className="size-1.5 rounded-full bg-white" /> : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Grid / list switch. */
export function ViewSwitch({ view, onChange, className = "" }) {
  const { t, ui } = useLang();
  const options = [
    { value: "grid", icon: LayoutGrid, label: ui("gridView") },
    { value: "list", icon: List, label: ui("listView") },
  ];
  return (
    <div role="group" aria-label={t(C.viewAs)} className={cx("flex items-center gap-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => onChange(option.value)}
          className={cx("grid size-10 place-items-center rounded-[4px] border transition-colors", view === option.value ? "border-[var(--pr-charcoal)] bg-white text-fg" : "border-transparent text-fg-2 hover:text-fg")}
        >
          <option.icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        </button>
      ))}
    </div>
  );
}

/** Removable tags for the active filters, then "Clear all". */
export function ActiveTags({ browse, className = "" }) {
  const { t, ui } = useLang();
  const label = useFilterLabel();
  if (!browse.active.length) return null;
  return (
    <ul aria-label={t(C.activeFilters)} className={cx("flex flex-wrap items-center gap-2", className)}>
      {browse.active.map((filter) => {
        const text = label(filter);
        return (
          <li key={`${filter.type}-${String(filter.value)}`}>
            <button
              type="button"
              onClick={() => browse.removeFilter(filter)}
              aria-label={t(C.removeFilter, { label: text })}
              className="inline-flex h-8 max-w-[18rem] items-center gap-2 rounded-[4px] border border-[#d3cfc6] bg-white ps-3 pe-2 pr-sm text-fg transition-colors hover:border-[var(--pr-charcoal)]"
            >
              <span className="truncate">{text}</span>
              <X aria-hidden="true" className="size-3.5 shrink-0 text-fg-2" strokeWidth={2.2} />
            </button>
          </li>
        );
      })}
      <li>
        <button type="button" onClick={browse.clearAll} className="pr-link h-8 px-1 pr-sm font-medium text-[var(--pr-bronze)]">
          {ui("clearAll")}
        </button>
      </li>
    </ul>
  );
}

/** Previous · numbered pages · Next. */
export function Pager({ page, pageCount, onChange }) {
  const { t, ui } = useLang();
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label={ui("pagination")} className="mt-10 border-t border-line pt-6 dt:mt-14">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} className={btn("outline", "sm", "gap-1.5 px-3")}>
          <ChevronLeft aria-hidden="true" className="flip-rtl size-4" strokeWidth={2} />
          <span className="max-sm:sr-only">{ui("previous")}</span>
        </button>
        <ol className="flex items-center gap-1">
          {pages.map((n) => (
            <li key={n}>
              <button
                type="button"
                onClick={() => onChange(n)}
                aria-current={n === page ? "page" : undefined}
                aria-label={t(C.goToPage, { n })}
                className={cx("grid size-10 place-items-center rounded-[4px] pr-md tabular transition-colors", n === page ? "bg-[var(--pr-charcoal)] font-semibold text-white" : "text-fg hover:bg-[var(--pr-stone)]")}
              >
                {n}
              </button>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => onChange(page + 1)} disabled={page === pageCount} className={btn("outline", "sm", "gap-1.5 px-3")}>
          <span className="max-sm:sr-only">{ui("next")}</span>
          <ChevronRight aria-hidden="true" className="flip-rtl size-4" strokeWidth={2} />
        </button>
      </div>
      <p className="mt-3 text-center pr-xs text-fg-2">{t(C.pageOf, { n: page, total: pageCount })}</p>
    </nav>
  );
}
