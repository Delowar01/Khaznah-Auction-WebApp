"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useDismiss } from "@/components/shared/ui/hooks";
import { PRICE_BOUNDS } from "@/lib/useBrowse";
import { cx } from "../ui/cx";
import { SaleTypeTabs, SortMenu, ViewToggle } from "./Controls";
import { AvailabilityOptions, EndingOptions, GradeOptions, ItemTypeOptions, PriceOptions } from "./FilterOptions";

/** A rail button with an anchored dropdown panel. */
function RailPopover({ label, count = 0, wide = false, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cx(
          "flex h-11 items-center gap-2 rounded-control border px-3.5 text-sm font-medium transition-colors",
          count ? "border-primary bg-primary/8 text-primary" : "border-line-strong bg-surface text-fg hover:border-fg",
          open && "border-fg",
        )}
      >
        {label}
        {count ? <span className="c-num grid h-5 min-w-5 place-items-center rounded-xs bg-primary px-1 text-[0.6875rem] font-bold text-on-primary">{count}</span> : null}
        <ChevronDown aria-hidden="true" className={cx("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div role="dialog" aria-label={label} className={cx("kz-fade-up absolute start-0 top-[calc(100%+8px)] z-40 rounded-md border border-line bg-elevated p-3 shadow-overlay", wide ? "w-80" : "w-72")}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** Desktop filter rail (≥1024px) and the compact bar that opens the drawer below it. */
export function FilterRail({ browse, view, onView, onOpenDrawer, activeCount }) {
  const { ui } = useLang();
  const { state } = browse;
  const priceActive = state.price[0] > PRICE_BOUNDS[0] || state.price[1] < PRICE_BOUNDS[1] ? 1 : 0;

  return (
    <>
      <div className="hidden flex-wrap items-center gap-2 py-5 lg:flex">
        <SaleTypeTabs browse={browse} />
        <span aria-hidden="true" className="mx-2 h-7 w-px bg-line-strong" />
        <RailPopover label={ui("condition")} count={state.grades.length}>
          <GradeOptions browse={browse} />
        </RailPopover>
        <RailPopover label={ui("itemType")} count={state.itemTypes.length}>
          <ItemTypeOptions browse={browse} />
        </RailPopover>
        <RailPopover label={ui("price")} count={priceActive} wide>
          <PriceOptions browse={browse} />
        </RailPopover>
        <RailPopover label={ui("endingWithin")} count={state.ending !== "all" ? 1 : 0}>
          <EndingOptions browse={browse} name="rail-ending" />
        </RailPopover>
        <RailPopover label={ui("availability")} count={(state.inStock ? 1 : 0) + (state.discounted ? 1 : 0)}>
          <AvailabilityOptions browse={browse} />
        </RailPopover>
        <div className="ms-auto flex items-center gap-2">
          <SortMenu browse={browse} className="w-64" />
          <ViewToggle view={view} onChange={onView} />
        </div>
      </div>

      <div className="flex flex-col gap-3 py-4 lg:hidden">
        <div className="flex items-center gap-2">
          <button type="button" data-testid="filter-button" onClick={onOpenDrawer} className="c-btn c-btn--outline h-11 shrink-0 px-3.5">
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            {ui("filter")}
            {activeCount ? <span className="c-num grid h-5 min-w-5 place-items-center rounded-xs bg-primary px-1 text-[0.6875rem] font-bold text-on-primary">{activeCount}</span> : null}
          </button>
          <SortMenu browse={browse} compact className="min-w-0 flex-1" />
          <div className="hidden sm:block">
            <ViewToggle view={view} onChange={onView} />
          </div>
        </div>
        <SaleTypeTabs browse={browse} className="w-full" />
      </div>
    </>
  );
}
