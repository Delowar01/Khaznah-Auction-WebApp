"use client";

import { LayoutGrid, List } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Listbox } from "@/components/shared/ui/Listbox";
import { SORT_OPTIONS } from "@/lib/useBrowse";
import { COPY } from "../copy";
import { cx } from "../ui/cx";

const TABS = [
  { value: "all", key: "all" },
  { value: "auction", key: "auctions" },
  { value: "buy_now", key: "buyNow" },
];

/** Sale type as a segmented control with live counts. */
export function SaleTypeTabs({ browse, className = "" }) {
  const { t, ui } = useLang();
  return (
    <div role="group" aria-label={t(COPY.saleType)} className={cx("inline-flex rounded-control border border-line-strong bg-surface p-1", className)}>
      {TABS.map((tab) => {
        const active = browse.state.tab === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={active}
            onClick={() => browse.setTab(tab.value)}
            className={cx(
              "flex h-9 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3.5 text-sm font-semibold transition-colors",
              active ? "bg-secondary text-on-secondary" : "text-fg-2 hover:text-fg",
            )}
          >
            {ui(tab.key)}
            <span className={cx("c-num text-xs", active ? "opacity-80" : "text-fg-3")}>{browse.facets.tabs[tab.value]}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Sort dropdown (shared accessible Listbox, concept styling). */
export function SortMenu({ browse, className = "", compact = false }) {
  const { ui } = useLang();
  const options = SORT_OPTIONS.map((o) => ({ value: o.value, label: ui(o.key) }));
  return (
    <Listbox
      value={browse.state.sort}
      options={options}
      onChange={browse.setSort}
      label={ui("sortBy")}
      className={className}
      buttonClassName="flex h-11 w-full items-center justify-between gap-3 rounded-control border border-line-strong bg-surface px-3.5 text-sm font-medium text-fg transition-colors hover:border-fg aria-expanded:border-fg"
      menuClassName="w-64 rounded-md border border-line bg-elevated p-1.5 shadow-overlay"
      optionClassName="min-h-10 rounded-sm px-3 text-sm text-fg"
      activeOptionClassName="bg-surface-2"
      renderButton={(current) => (
        <span className="flex min-w-0 items-center gap-2">
          {!compact ? <span className="text-fg-3">{ui("sort")}:</span> : null}
          <span className="truncate">{current?.label}</span>
        </span>
      )}
    />
  );
}

/** Grid / list view switch. */
export function ViewToggle({ view, onChange, className = "" }) {
  const { t, ui } = useLang();
  const views = [
    { value: "grid", icon: LayoutGrid, label: ui("gridView") },
    { value: "list", icon: List, label: ui("listView") },
  ];
  return (
    <div role="group" aria-label={t(COPY.view)} className={cx("inline-flex rounded-control border border-line-strong bg-surface p-1", className)}>
      {views.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={view === value}
          aria-label={label}
          title={label}
          onClick={() => onChange(value)}
          className={cx("grid size-9 place-items-center rounded-sm transition-colors", view === value ? "bg-secondary text-on-secondary" : "text-fg-2 hover:text-fg")}
        >
          <Icon aria-hidden="true" className="size-4" />
        </button>
      ))}
    </div>
  );
}
