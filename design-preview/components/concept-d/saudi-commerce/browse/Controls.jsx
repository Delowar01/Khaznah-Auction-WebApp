"use client";

// Contemporary Saudi Commerce Browse controls: a green segmented sale-mode
// switch, a framed sort menu, grid / list switch, sage filter chips and
// numbered pages with a green current page.
import { useId } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { BROWSE_COPY as C } from "@/components/shared/browse/copy";
import { useFilterLabel } from "@/components/shared/browse/hooks";
import { Listbox } from "@/components/shared/ui/Listbox";
import { SORT_OPTIONS } from "@/lib/useBrowse";
import { btn, cx } from "../ui";

/** All → Auctions → Buy Now as one segmented control with counts. */
export function ModeSegments({ browse, className = "" }) {
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
      <div className="grid grid-cols-3 gap-1 rounded-[9px] border border-[var(--sc-line)] bg-white p-1 sm:inline-grid sm:grid-cols-[repeat(3,auto)]">
        {options.map((option) => {
          const checked = state.tab === option.value;
          return (
            <label key={option.value} className="relative min-w-0 cursor-pointer">
              <input type="radio" name={name} value={option.value} checked={checked} onChange={() => browse.setTab(option.value)} className="peer sr-only" />
              <span
                className={cx(
                  "flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[7px] px-3 sc-md font-semibold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)] max-[379px]:h-12 max-[379px]:flex-col max-[379px]:gap-0.5 max-[379px]:px-1 sm:px-5 dt:text-[15px]",
                  checked ? "bg-[var(--sc-green)] text-white" : "text-[var(--sc-ink)] hover:bg-[var(--sc-soft)]",
                )}
              >
                {option.label}
                <span className={cx("rounded-[5px] px-1.5 sc-xs tabular", checked ? "bg-white/20 text-white" : "bg-[var(--sc-soft)] text-[var(--sc-muted)]")}>{option.count}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SortMenu({ value, onChange }) {
  const { ui } = useLang();
  const options = SORT_OPTIONS.map((option) => ({ value: option.value, label: ui(option.key) }));
  return (
    <Listbox
      value={value}
      onChange={onChange}
      options={options}
      label={ui("sortBy")}
      buttonClassName="flex h-11 items-center gap-2 rounded-[7px] border border-[var(--sc-line)] bg-white ps-3.5 pe-3 sc-md text-[var(--sc-ink)] transition-colors hover:border-[var(--sc-green)]"
      renderButton={(current) => (
        <>
          <span className="text-[var(--sc-muted)]">{ui("sortBy")}</span>
          <span className="font-semibold">{current?.label}</span>
        </>
      )}
      menuClassName="w-64 rounded-[10px] border border-[var(--sc-line)] bg-white p-1.5 shadow-overlay"
      optionClassName="rounded-[7px] px-3 py-2.5 sc-md text-[var(--sc-ink)]"
      activeOptionClassName="bg-[var(--sc-soft)]"
    />
  );
}

export function SortChoices({ value, onChange }) {
  const { t, ui } = useLang();
  const name = useId();
  return (
    <fieldset>
      <legend className="sr-only">{t(C.sortSheet)}</legend>
      <div className="grid gap-1.5">
        {SORT_OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label key={option.value} className={cx("flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-[7px] border px-4 sc-lg", checked ? "border-[var(--sc-green)] bg-[var(--sc-soft)] font-semibold text-[var(--sc-green)]" : "border-[var(--sc-line)] text-[var(--sc-ink)]")}>
              <input type="radio" name={name} checked={checked} onChange={() => onChange(option.value)} className="peer sr-only" />
              <span className="rounded-[4px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[var(--focus)]">{ui(option.key)}</span>
              <span aria-hidden="true" className={cx("grid size-[18px] place-items-center rounded-full border-[1.5px]", checked ? "border-[var(--sc-green)] bg-[var(--sc-green)]" : "border-[#b9cbc3] bg-white")}>
                {checked ? <span className="size-1.5 rounded-full bg-white" /> : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ViewSwitch({ view, onChange, className = "" }) {
  const { t, ui } = useLang();
  const options = [
    { value: "grid", icon: LayoutGrid, label: ui("gridView") },
    { value: "list", icon: List, label: ui("listView") },
  ];
  return (
    <div role="group" aria-label={t(C.viewAs)} className={cx("inline-flex rounded-[7px] border border-[var(--sc-line)] bg-white p-0.5", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => onChange(option.value)}
          className={cx("grid size-10 place-items-center rounded-[6px] transition-colors", view === option.value ? "bg-[var(--sc-soft)] text-[var(--sc-green)]" : "text-[var(--sc-muted)] hover:text-[var(--sc-ink)]")}
        >
          <option.icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        </button>
      ))}
    </div>
  );
}

export function ActiveChips({ browse, className = "" }) {
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
              className="inline-flex h-9 max-w-[18rem] items-center gap-2 rounded-[6px] bg-[var(--sc-soft)] ps-3 pe-2 sc-sm font-medium text-[var(--sc-ink)] transition-colors hover:bg-[#dfece5]"
            >
              <span className="truncate">{text}</span>
              <X aria-hidden="true" className="size-4 shrink-0 text-[var(--sc-green)]" strokeWidth={2.2} />
            </button>
          </li>
        );
      })}
      <li>
        <button type="button" onClick={browse.clearAll} className="sc-link h-9 px-1 sc-sm font-medium text-[var(--sc-link)]">
          {ui("clearAll")}
        </button>
      </li>
    </ul>
  );
}

export function Pager({ page, pageCount, onChange }) {
  const { t, ui } = useLang();
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label={ui("pagination")} className="mt-8 flex flex-col items-center gap-3 dt:mt-10">
      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-center">
        <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} className={btn("outline", "sm", "gap-1.5 px-3.5")}>
          <ChevronLeft aria-hidden="true" className="flip-rtl size-4" strokeWidth={2.2} />
          <span className="max-sm:sr-only">{ui("previous")}</span>
        </button>
        <ol className="flex items-center gap-1.5">
          {pages.map((n) => (
            <li key={n}>
              <button
                type="button"
                onClick={() => onChange(n)}
                aria-current={n === page ? "page" : undefined}
                aria-label={t(C.goToPage, { n })}
                className={cx("grid size-10 place-items-center rounded-[7px] sc-md font-semibold tabular transition-colors", n === page ? "bg-[var(--sc-green)] text-white" : "border border-[var(--sc-line)] bg-white text-[var(--sc-ink)] hover:border-[var(--sc-green)]")}
              >
                {n}
              </button>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => onChange(page + 1)} disabled={page === pageCount} className={btn("outline", "sm", "gap-1.5 px-3.5")}>
          <span className="max-sm:sr-only">{ui("next")}</span>
          <ChevronRight aria-hidden="true" className="flip-rtl size-4" strokeWidth={2.2} />
        </button>
      </div>
      <p className="sc-sm text-[var(--sc-muted)]">{t(C.pageOf, { n: page, total: pageCount })}</p>
    </nav>
  );
}
