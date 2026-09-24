"use client";

import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useBrowse } from "@/lib/useBrowse";
import { BrowseHeader } from "../browse/BrowseHeader";
import { FilterPanel } from "../browse/FilterPanel";
import { FilterSheet } from "../browse/FilterSheet";
import { ActiveFilters } from "../browse/ActiveFilters";
import { Results } from "../browse/Results";
import { MobileFilterButton, SortMenu, ViewToggle } from "../browse/Toolbar";
import { SearchField } from "../browse/SearchField";
import { BrowseUrlSync } from "@/components/shared/ui/BrowseUrlSync";

export function BrowsePage() {
  const { ui } = useLang();
  const browse = useBrowse({ pageSize: 12 });
  const [view, setView] = useState("grid");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <BrowseHeader browse={browse} />
      <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:gap-14 lg:px-10 lg:py-14">
        <aside aria-label={ui("filters")} className="hidden lg:block">
          <div className="sticky top-[calc(var(--pbar-h)+100px)] max-h-[calc(100dvh-var(--pbar-h)-120px)] overflow-y-auto pe-2">
            <SearchField value={browse.state.search} onCommit={browse.setSearch} className="mb-8" inputClassName="h-11" />
            <FilterPanel browse={browse} />
          </div>
        </aside>
        <div className="min-w-0">
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <MobileFilterButton browse={browse} onOpen={() => setSheetOpen(true)} />
              <SearchField value={browse.state.search} onCommit={browse.setSearch} className="hidden min-w-0 flex-1 sm:block lg:hidden" inputClassName="h-10" />
              <div className="ms-auto flex items-center gap-3">
                <SortMenu browse={browse} />
                <ViewToggle view={view} onChange={setView} />
              </div>
            </div>
            <ActiveFilters browse={browse} />
          </div>
          <Results browse={browse} view={view} columns="lg:grid-cols-3" />
        </div>
      </div>
      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} browse={browse} />
      <BrowseUrlSync browse={browse} />
    </>
  );
}
