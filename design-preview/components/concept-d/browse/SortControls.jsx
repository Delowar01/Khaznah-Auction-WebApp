"use client";

import { ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Listbox } from "@/components/shared/ui/Listbox";
import { SORT_OPTIONS } from "@/lib/useBrowse";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

/** Sort dropdown (shared Listbox) styled for B. */
export function SortListbox({ value, onChange, className = "" }) {
  const { ui } = useLang();
  const options = SORT_OPTIONS.map((option) => ({ value: option.value, label: ui(option.key) }));
  return (
    <Listbox
      value={value}
      onChange={onChange}
      options={options}
      label={ui("sortBy")}
      className={className}
      buttonClassName="flex h-10 items-center gap-2 rounded-control border border-line-strong bg-surface ps-3 pe-2.5 kb-sm font-semibold text-fg transition-colors hover:border-fg-3"
      renderButton={(current) => (
        <>
          <ArrowUpDown aria-hidden="true" className="size-4 text-fg-3" />
          <span className="text-fg-3">{ui("sortBy")}:</span>
          <span>{current?.label}</span>
        </>
      )}
      menuClassName="kb-focus-reset w-64 rounded-xl border border-line bg-elevated p-1 shadow-overlay"
      optionClassName="rounded-lg px-3 py-2.5 kb-sm text-fg"
      activeOptionClassName="bg-surface-2"
    />
  );
}

/** Grid / list toggle. */
export function ViewToggle({ view, onChange, className = "" }) {
  const { t, ui } = useLang();
  const options = [
    { value: "grid", icon: LayoutGrid, label: ui("gridView") },
    { value: "list", icon: List, label: ui("listView") },
  ];
  return (
    <div role="group" aria-label={t(COPY.viewAs)} className={cx("inline-flex rounded-control border border-line bg-surface-2 p-0.5", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => onChange(option.value)}
          className={cx(
            "grid size-9 place-items-center rounded-[8px] transition-colors",
            view === option.value ? "bg-surface text-primary shadow-card ring-1 ring-line" : "text-fg-3 hover:text-fg",
          )}
        >
          <option.icon aria-hidden="true" className="size-4" />
        </button>
      ))}
    </div>
  );
}
