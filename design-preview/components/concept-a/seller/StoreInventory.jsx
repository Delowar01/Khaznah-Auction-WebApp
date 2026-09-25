"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { CATEGORIES } from "@/data/categories";
import { sellerStats } from "@/lib/catalog";
import { useBrowse } from "@/lib/useBrowse";
import { ActiveChips } from "../browse/ActiveChips";
import { FacetPanel } from "../browse/FacetPanel";
import { MobileFilterBar } from "../browse/MobileFilterBar";
import { ResultsGrid } from "../browse/ResultsGrid";
import { SortListbox, ViewToggle } from "../browse/SortControls";
import { TextField } from "../ui/Field";
import { Pagination } from "../ui/Pagination";
import { Segmented } from "../ui/Segmented";
import { COPY } from "../copy";

function StoreSearch({ value, onSearch }) {
  const { ui } = useLang();
  const [draft, setDraft] = useState(value);
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <TextField
      label={ui("searchStore")}
      hideLabel
      icon={Search}
      type="search"
      value={draft}
      placeholder={ui("searchStore")}
      onChange={(event) => {
        const next = event.target.value;
        setDraft(next);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => onSearch(next), 300);
      }}
      className="w-full sm:max-w-sm"
      inputClassName="kb-search"
    />
  );
}

/** In-store listings: sale-type tabs, search, sort, facets and a paged grid. */
export function StoreInventory({ seller }) {
  const { t, ui } = useLang();
  const browse = useBrowse({ sellerCode: seller.code, pageSize: 8, syncUrl: false });
  const [view, setView] = useState("grid");
  const slugs = sellerStats(seller.code).categories;
  const categories = CATEGORIES.filter((c) => slugs.includes(c.slug));
  const { facets } = browse;

  return (
    <section aria-labelledby="kb-store-listings" className="kb-container mt-8">
      <h2 id="kb-store-listings" className="sr-only">
        {ui("allListings")}
      </h2>
      <Segmented
        variant="underline"
        label={ui("storefront")}
        value={browse.state.tab}
        onChange={browse.setTab}
        options={[
          { value: "all", label: ui("allListings"), count: facets.tabs.all },
          { value: "auction", label: ui("auctions"), count: facets.tabs.auction },
          { value: "buy_now", label: ui("buyNow"), count: facets.tabs.buy_now },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StoreSearch value={browse.state.search} onSearch={browse.setSearch} />
        <div className="ms-auto hidden items-center gap-2 lg:flex">
          <SortListbox value={browse.state.sort} onChange={browse.setSort} />
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      <MobileFilterBar browse={browse} categories={categories} view={view} onView={setView} sticky={false} className="mt-3" />
      <ActiveChips browse={browse} className="mt-3" />

      <div className="mt-5 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside aria-label={ui("filters")} className="hidden lg:block">
          <div className="rounded-xl border border-line bg-surface px-3 py-2">
            <FacetPanel browse={browse} categories={categories} name="store" />
          </div>
        </aside>
        <div className="min-w-0">
          <ResultsGrid browse={browse} items={browse.pageItems} view={view} gridClassName="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4" suggestions={false} />
          {!browse.loading && browse.pageCount > 1 ? (
            <Pagination page={browse.page} pageCount={browse.pageCount} onChange={browse.setPage} className="mt-8" />
          ) : null}
          {!browse.loading && browse.total ? (
            <p className="mt-4 text-center kb-xs text-fg-3">
              {t(COPY.showingRange, { from: (browse.page - 1) * 8 + 1, to: Math.min(browse.total, browse.page * 8), total: browse.total })}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
