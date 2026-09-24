"use client";

import { useId, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useBrowse } from "@/lib/useBrowse";
import { Tabs, TabPanel } from "../ui/Tabs";
import { SearchField } from "../browse/SearchField";
import { SortListbox, ViewToggle } from "../browse/BrowseToolbar";
import { ActiveFilters } from "../browse/ActiveFilters";
import { Results } from "../browse/Results";
import { useCopy } from "../lib/useCopy";

const TABS = ["all", "auction", "buy_now"];

/** Store tabs, in-store search + sort, grid/board and load more. */
export function StoreInventory({ seller }) {
  const { t, ui } = useLang();
  const c = useCopy();
  const browse = useBrowse({ sellerCode: seller.code, pageSize: 8, syncUrl: false });
  const [view, setView] = useState("grid");
  const baseId = `store-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const labels = { all: ui("allListings"), auction: ui("auctions"), buy_now: ui("buyNow") };

  return (
    <section aria-labelledby="inventory-title" className="py-10 md:py-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="d-label text-fg-3">{ui("storefront")}</p>
          <h2 id="inventory-title" className="d-tight mt-2 text-2xl font-semibold text-fg md:text-[28px]">
            {c("listingsStat")}
          </h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchField value={browse.state.search} onSearch={browse.setSearch} placeholder={ui("searchStore")} label={ui("searchStore")} className="h-11 w-full sm:w-72" />
          <div className="flex items-center gap-2">
            <SortListbox browse={browse} className="flex-1 sm:flex-none" />
            <div className="hidden sm:block">
              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>
        </div>
      </div>

      <Tabs
        baseId={baseId}
        tabs={TABS.map((key) => ({ key, label: labels[key], shortLabel: key === "all" ? ui("all") : undefined, count: browse.facets.tabs[key] }))}
        value={browse.state.tab}
        onChange={browse.setTab}
        label={c("saleType")}
        className="mt-6"
      />
      {TABS.map((key) => (
        <TabPanel key={key} baseId={baseId} tabKey={key} active={browse.state.tab === key} className="pt-6">
          <ActiveFilters browse={browse} />
          <Results browse={browse} view={view} dense caption={t(seller.name)} />
        </TabPanel>
      ))}
    </section>
  );
}
