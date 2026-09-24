"use client";

import { LayoutGrid, PanelLeftClose, PanelLeftOpen, Rows3, SlidersHorizontal } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Listbox } from "@/components/shared/ui/Listbox";
import { SORT_OPTIONS } from "@/lib/useBrowse";
import { Segmented } from "../ui/Segmented";
import { useCopy } from "../lib/useCopy";

export function SortListbox({ browse, className = "" }) {
  const { ui } = useLang();
  return (
    <Listbox
      value={browse.state.sort}
      onChange={browse.setSort}
      label={ui("sortBy")}
      options={SORT_OPTIONS.map((option) => ({ value: option.value, label: ui(option.key) }))}
      className={className}
      buttonClassName="flex h-11 w-full items-center justify-between gap-2 rounded-control border border-line-strong bg-surface-2 px-3 text-sm text-fg transition-colors hover:border-fg-3/50 sm:w-auto"
      renderButton={(current) => (
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-fg-3">{ui("sort")}:</span>
          <span className="truncate font-medium">{current?.label}</span>
        </span>
      )}
      menuClassName="min-w-[240px] rounded-xl border border-line-strong bg-elevated p-1.5 shadow-overlay"
      optionClassName="h-10 rounded-lg px-3 text-sm text-fg-2"
      activeOptionClassName="bg-surface-2 text-fg"
    />
  );
}

export function ViewToggle({ view, onChange }) {
  const { ui } = useLang();
  const c = useCopy();
  return (
    <Segmented
      label={c("viewMode")}
      value={view}
      onChange={onChange}
      options={[
        { value: "grid", icon: LayoutGrid, ariaLabel: ui("gridView") },
        { value: "board", icon: Rows3, ariaLabel: ui("tableView") },
      ]}
    />
  );
}

/** Sale-type segmented control, sort, grid/board toggle and filter triggers. */
export function BrowseToolbar({ browse, view, onView, panelOpen, onTogglePanel, onOpenDrawer, sellerMode = false }) {
  const { ui } = useLang();
  const c = useCopy();
  const tabs = [
    { value: "all", label: ui("all"), count: browse.facets.tabs.all },
    { value: "auction", label: ui("auctions"), count: browse.facets.tabs.auction },
    { value: "buy_now", label: ui("buyNow"), count: browse.facets.tabs.buy_now },
  ];
  const activeCount = browse.active.filter((f) => f.type !== "search").length;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={onOpenDrawer}
        data-testid="filter-button"
        className="inline-flex h-11 items-center gap-2 rounded-control border border-line-strong bg-surface-2 px-3.5 text-sm font-medium text-fg lg:hidden"
      >
        <SlidersHorizontal aria-hidden="true" className="size-4" />
        {ui("filters")}
        {activeCount ? <span className="d-num grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-on-primary">{activeCount}</span> : null}
      </button>
      {onTogglePanel ? (
        <button
          type="button"
          onClick={onTogglePanel}
          aria-expanded={panelOpen}
          className="hidden h-11 items-center gap-2 rounded-control border border-line-strong bg-surface-2 px-3 text-sm font-medium text-fg-2 transition-colors hover:text-fg lg:inline-flex"
        >
          {panelOpen ? <PanelLeftClose aria-hidden="true" className="flip-rtl size-4" /> : <PanelLeftOpen aria-hidden="true" className="flip-rtl size-4" />}
          {panelOpen ? c("hideFilters") : c("showFilters")}
        </button>
      ) : null}
      <div className="relative order-last w-full overflow-x-auto no-scrollbar sm:order-none sm:w-auto">
        <Segmented label={c("saleType")} value={browse.state.tab} onChange={browse.setTab} options={tabs} />
      </div>
      <div className="ms-auto flex items-center gap-2">
        <SortListbox browse={browse} className={sellerMode ? "" : "min-w-0"} />
        <div className="hidden sm:block">
          <ViewToggle view={view} onChange={onView} />
        </div>
      </div>
    </div>
  );
}
