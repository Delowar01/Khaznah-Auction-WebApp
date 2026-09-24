"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { useBrowse } from "@/lib/useBrowse";
import { SectionHead } from "../ui/Type";
import { Results } from "../browse/Results";
import { SearchField } from "../browse/SearchField";
import { SortMenu } from "../browse/Toolbar";
import { COPY } from "../copy";

const TABS = [
  ["all", "allListings"],
  ["auction", "auctions"],
  ["buy_now", "buyNow"],
];

/** The seller's live inventory: tabs, in-store search, sort and progressive loading. */
export function StoreInventory({ seller }) {
  const { t, ui, pl } = useLang();
  const browse = useBrowse({ sellerCode: seller.code, pageSize: 6, syncUrl: false });
  const { state } = browse;

  return (
    <section id="inventory" aria-labelledby="inventory-title" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-6 lg:px-10 lg:py-24">
        <SectionHead eyebrow={browse.loading ? ui("loadingLots") : pl("results", browse.total)} title={<span id="inventory-title">{t(COPY.inventory)}</span>} />

        <div className="mt-10 flex flex-col gap-5 border-b border-line lg:flex-row lg:items-end lg:justify-between">
          <div role="tablist" aria-label={ui("storefront")} className="no-scrollbar -mb-px flex gap-8 overflow-x-auto">
            {TABS.map(([value, key]) => {
              const selected = state.tab === value;
              return (
                <button
                  key={value}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => browse.setTab(value)}
                  className={`relative whitespace-nowrap pb-4 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors rtl:text-[15px] rtl:normal-case rtl:tracking-normal ${selected ? "text-fg" : "text-fg-3 hover:text-fg"}`}
                >
                  {ui(key)} <span className="ms-1 font-normal text-fg-3 tabular">{browse.facets.tabs[value]}</span>
                  <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-0.5 bg-fg transition-transform duration-300 ${selected ? "scale-x-100" : "scale-x-0"}`} />
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 pb-4">
            <SearchField value={state.search} onCommit={browse.setSearch} className="min-w-0 flex-1 lg:w-72 lg:flex-none" inputClassName="h-10" />
            <SortMenu browse={browse} />
          </div>
        </div>

        <div className="mt-12">
          <Results browse={browse} columns="lg:grid-cols-3" />
        </div>
      </div>
    </section>
  );
}
