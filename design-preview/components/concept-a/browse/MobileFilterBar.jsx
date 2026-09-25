"use client";

import { useState } from "react";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { SORT_OPTIONS } from "@/lib/useBrowse";
import { Button } from "../ui/Button";
import { Radio } from "../ui/Choice";
import { SheetPanel } from "../ui/Panels";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { FacetPanel } from "./FacetPanel";
import { ViewToggle } from "./SortControls";

/**
 * Sticky "Filters (n) | Sort" bar for phones and tablets. Filters open in a
 * bottom sheet with a live "Show N results" button; sort has its own sheet.
 */
export function MobileFilterBar({ browse, view, onView, categories, showEnding = true, sticky = true, className = "" }) {
  const { t, ui, pl } = useLang();
  const [sheet, setSheet] = useState(null);
  const current = SORT_OPTIONS.find((o) => o.value === browse.state.sort) || SORT_OPTIONS[0];
  const activeCount = browse.active.length;

  return (
    <>
      <div
        className={cx(
          "z-20 -mx-4 flex items-center gap-2 border-b border-line bg-bg/95 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden",
          sticky && "sticky top-[calc(var(--pbar-h)+var(--kb-head))] transition-[top] duration-300",
          className,
        )}
      >
        <button
          type="button"
          data-testid="filter-button"
          onClick={() => setSheet("filters")}
          aria-expanded={sheet === "filters"}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-control border border-line-strong bg-surface kb-sm font-bold text-fg"
        >
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          {ui("filters")}
          {activeCount ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 kb-2xs font-bold text-on-primary tabular">{activeCount}</span> : null}
        </button>
        <button
          type="button"
          onClick={() => setSheet("sort")}
          aria-expanded={sheet === "sort"}
          className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-control border border-line-strong bg-surface px-2 kb-sm font-bold text-fg"
        >
          <ArrowUpDown aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">{ui(current.key)}</span>
        </button>
        {onView ? <ViewToggle view={view} onChange={onView} className="shrink-0" /> : null}
      </div>

      <SheetPanel
        open={sheet === "filters"}
        onClose={() => setSheet(null)}
        title={ui("filters")}
        subtitle={pl("results", browse.total)}
        testId="filter-drawer"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" size="lg" onClick={browse.clearAll} disabled={!activeCount}>
              {ui("clearAll")}
            </Button>
            <Button size="lg" block onClick={() => setSheet(null)}>
              {ui("showResults", { n: browse.total })}
            </Button>
          </div>
        }
      >
        <div className="px-3">
          <FacetPanel browse={browse} categories={categories} name="sheet" showEnding={showEnding} />
        </div>
      </SheetPanel>

      <SheetPanel open={sheet === "sort"} onClose={() => setSheet(null)} title={t(COPY.sortSheet)}>
        <div role="radiogroup" aria-label={ui("sortBy")} className="grid gap-0.5 p-3 pb-6">
          {SORT_OPTIONS.map((option) => (
            <Radio
              key={option.value}
              name="kb-sort-sheet"
              value={option.value}
              checked={browse.state.sort === option.value}
              onChange={(value) => {
                browse.setSort(value);
                setSheet(null);
              }}
              className="min-h-12"
            >
              {ui(option.key)}
            </Radio>
          ))}
        </div>
      </SheetPanel>
    </>
  );
}
