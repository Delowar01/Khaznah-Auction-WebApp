"use client";

import { useState } from "react";
import { useBrowse } from "@/lib/useBrowse";
import { useBrowseIntent } from "../browse/browseIntent";
import { BrowseHead } from "../browse/BrowseHead";
import { CategoryBand } from "../browse/CategoryBand";
import { FilterRail } from "../browse/FilterRail";
import { ActiveChips } from "../browse/ActiveChips";
import { Results } from "../browse/Results";
import { FilterDrawer } from "../browse/FilterDrawer";

export function BrowsePage() {
  const browse = useBrowse({ pageSize: 12 });
  const [view, setView] = useState("grid");
  const [drawer, setDrawer] = useState(false);

  // Header search, nav and category links land here while the page is open.
  useBrowseIntent((intent) => {
    browse.clearAll();
    browse.setTab(intent.tab || "all");
    browse.setSearch(intent.search || "");
    if (intent.category) browse.setCategory(intent.category);
  });

  return (
    <div className="pb-20 lg:pb-28">
      <BrowseHead browse={browse} />
      <CategoryBand browse={browse} />
      <div className="c-container">
        <FilterRail browse={browse} view={view} onView={setView} onOpenDrawer={() => setDrawer(true)} activeCount={browse.active.filter((f) => f.type !== "search").length} />
        <ActiveChips browse={browse} />
        <div className="pt-2">
          <Results browse={browse} view={view} onReset={browse.clearAll} />
        </div>
      </div>
      <FilterDrawer open={drawer} onClose={() => setDrawer(false)} browse={browse} />
    </div>
  );
}
