"use client";

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Listbox } from "@/components/shared/ui/Listbox";
import { SORT_OPTIONS } from "@/lib/useBrowse";

export function SortMenu({ browse }) {
  const { ui } = useLang();
  return (
    <Listbox
      value={browse.state.sort}
      onChange={browse.setSort}
      label={ui("sortBy")}
      options={SORT_OPTIONS.map((o) => ({ value: o.value, label: ui(o.key) }))}
      buttonClassName="flex h-10 items-center gap-2 rounded-control border border-line-strong bg-surface px-3.5 text-[13px] text-fg transition-colors hover:border-fg"
      renderButton={(current) => (
        <span>
          <span className="text-fg-3">{ui("sort")}: </span>
          {current?.label}
        </span>
      )}
      menuClassName="w-64 rounded-lg border border-line bg-elevated py-1.5 shadow-raised"
      optionClassName="px-4 py-2.5 text-sm text-fg-2"
      activeOptionClassName="bg-surface-2 text-fg"
    />
  );
}

export function ViewToggle({ view, onChange }) {
  const { ui } = useLang();
  const item = (value, Icon, label) => (
    <button
      type="button"
      onClick={() => onChange(value)}
      aria-pressed={view === value}
      aria-label={label}
      title={label}
      className={`grid size-10 place-items-center transition-colors ${view === value ? "bg-secondary text-on-secondary" : "text-fg-2 hover:text-fg"}`}
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  );
  return (
    <div className="hidden overflow-hidden rounded-control border border-line-strong sm:flex">
      {item("grid", LayoutGrid, ui("gridView"))}
      {item("list", List, ui("listView"))}
    </div>
  );
}

export function MobileFilterButton({ browse, onOpen }) {
  const { ui } = useLang();
  const count = browse.active.filter((f) => f.type !== "search").length;
  return (
    <button
      type="button"
      onClick={onOpen}
      data-testid="filter-button"
      className="flex h-10 items-center gap-2 rounded-control border border-line-strong bg-surface px-3.5 text-[13px] font-medium text-fg lg:hidden"
    >
      <SlidersHorizontal aria-hidden="true" className="size-4" />
      {ui("filters")}
      {count ? <span className="grid min-w-5 place-items-center rounded-full bg-secondary px-1 text-[11px] font-bold text-on-secondary tabular">{count}</span> : null}
    </button>
  );
}
