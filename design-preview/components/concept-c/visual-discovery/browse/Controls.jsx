"use client";

// Visual Discovery Browse controls, all pills: the sale-mode switch on a
// blue-grey track, quick toggle chips, a rounded sort menu, grid / list and
// removable filter pills.
import { useId } from "react";
import { BadgeCheck, LayoutGrid, List, Percent, Timer, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { BROWSE_COPY as C } from "@/components/shared/browse/copy";
import { useFilterLabel } from "@/components/shared/browse/hooks";
import { Listbox } from "@/components/shared/ui/Listbox";
import { GRADES } from "@/data/grades";
import { SORT_OPTIONS } from "@/lib/useBrowse";
import { cx } from "../ui";

/** All → Auctions → Buy Now, indigo pill on a blue-grey track. */
export function ModePills({ browse, className = "" }) {
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
      <div className="grid grid-cols-3 gap-1 rounded-full bg-[var(--vd-bluegray)] p-1 max-[379px]:rounded-[26px] sm:inline-grid sm:grid-cols-[repeat(3,auto)]">
        {options.map((option) => {
          const checked = state.tab === option.value;
          return (
            <label key={option.value} className="min-w-0 cursor-pointer">
              <input type="radio" name={name} value={option.value} checked={checked} onChange={() => browse.setTab(option.value)} className="peer sr-only" />
              <span
                className={cx(
                  "flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 vd-md transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)] max-[379px]:h-12 max-[379px]:flex-col max-[379px]:gap-0 max-[379px]:rounded-[22px] max-[379px]:px-1 sm:px-5",
                  checked ? "bg-[var(--vd-indigo)] font-semibold text-white" : "text-[var(--vd-ink)] hover:bg-white/70",
                )}
              >
                {option.label}
                <span className={cx("vd-sm tabular", checked ? "text-white/80" : "text-[var(--vd-muted)]")}>{option.count}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Toggle({ pressed, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cx(
        "inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 vd-md transition-colors",
        pressed ? "border-[var(--vd-indigo)] bg-[var(--vd-indigo)] font-semibold text-white" : "border-[#dfe7f3] bg-white text-[var(--vd-ink)] hover:border-[#c3d2ea] hover:bg-[#f3f7fc]",
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
      {children}
    </button>
  );
}

/** One-tap toggles for the filters people reach for most. */
export function QuickToggles({ browse }) {
  const { t, ui } = useLang();
  const { state } = browse;
  return (
    <>
      <Toggle icon={Timer} pressed={state.ending === "1h"} onClick={() => browse.setEnding(state.ending === "1h" ? "all" : "1h")}>
        {t(C.endingUnderHour)}
      </Toggle>
      <Toggle icon={BadgeCheck} pressed={state.grades.includes("A")} onClick={() => browse.toggleGrade("A")}>
        {t(GRADES.A.label)}
      </Toggle>
      <Toggle icon={Percent} pressed={state.discounted} onClick={() => browse.setDiscounted(!state.discounted)}>
        {ui("discounted")}
      </Toggle>
    </>
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
      buttonClassName="flex h-10 items-center gap-2 rounded-full bg-[var(--vd-bluegray)] ps-4 pe-3 vd-md text-[var(--vd-ink)] transition-colors hover:bg-[#dfe7f2]"
      renderButton={(current) => (
        <>
          <span className="text-[var(--vd-muted)]">{ui("sortBy")}</span>
          <span className="font-semibold">{current?.label}</span>
        </>
      )}
      menuClassName="w-64 rounded-[16px] border border-[var(--vd-line)] bg-white p-1.5 shadow-overlay"
      optionClassName="rounded-full px-4 py-2.5 vd-md text-[var(--vd-ink)]"
      activeOptionClassName="bg-[var(--vd-bluegray)]"
    />
  );
}

export function SortChoices({ value, onChange }) {
  const { t, ui } = useLang();
  const name = useId();
  return (
    <fieldset>
      <legend className="sr-only">{t(C.sortSheet)}</legend>
      <div className="flex flex-col gap-2">
        {SORT_OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label key={option.value} className="cursor-pointer">
              <input type="radio" name={name} checked={checked} onChange={() => onChange(option.value)} className="peer sr-only" />
              <span className={cx("flex h-12 items-center justify-between rounded-full px-5 vd-lg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]", checked ? "bg-[var(--vd-indigo)] font-semibold text-white" : "bg-[var(--vd-bluegray)] text-[var(--vd-ink)]")}>
                {ui(option.key)}
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
    <div role="group" aria-label={t(C.viewAs)} className={cx("inline-flex shrink-0 rounded-full bg-[var(--vd-bluegray)] p-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => onChange(option.value)}
          className={cx("grid size-9 place-items-center rounded-full transition-colors", view === option.value ? "bg-white text-[var(--vd-indigo)] shadow-[0_1px_3px_rgb(7_27_82/0.15)]" : "text-[var(--vd-muted)] hover:text-[var(--vd-ink)]")}
        >
          <option.icon aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
        </button>
      ))}
    </div>
  );
}

export function ActivePills({ browse, className = "" }) {
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
              className="inline-flex h-9 max-w-[18rem] items-center gap-2 rounded-full bg-[#e8eefb] ps-4 pe-2.5 vd-sm font-semibold text-[var(--vd-indigo)] transition-colors hover:bg-[#dbe4f8]"
            >
              <span className="truncate">{text}</span>
              <X aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.4} />
            </button>
          </li>
        );
      })}
      <li>
        <button type="button" onClick={browse.clearAll} className="vd-link h-9 px-2 vd-sm font-semibold text-[var(--vd-indigo)]">
          {ui("clearAll")}
        </button>
      </li>
    </ul>
  );
}
