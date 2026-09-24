"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { UI } from "@/data/ui";
import { useBrowse } from "@/lib/useBrowse";
import { SaleTypeTabs, SortMenu } from "../browse/Controls";
import { ResultCount, SearchField } from "../browse/BrowseHead";
import { Results } from "../browse/Results";
import { SectionHead } from "../ui/Section";

/** In-store tabs, search and sort over the seller's own lots, with progressive loading. */
export function StoreInventory({ seller }) {
  const { ui, pl } = useLang();
  const browse = useBrowse({ sellerCode: seller.code, pageSize: 6, syncUrl: false });

  return (
    <section aria-labelledby="inventory-title" className="border-t border-line bg-surface-2 py-14 lg:py-20">
      <div className="c-container">
        <SectionHead id="inventory-title" title={UI.allListings} action={<ResultCount text={pl("results", browse.total)} />} className="mb-8" />
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
          <SaleTypeTabs browse={browse} className="w-full lg:w-auto" />
          <SearchField value={browse.state.search} onSearch={browse.setSearch} label={ui("searchStore")} placeholder={ui("searchStore")} className="min-w-0 flex-1" inputClassName="h-12!" />
          <SortMenu browse={browse} className="w-full lg:w-64" />
        </div>
        <Results browse={browse} view="grid" onReset={browse.clearAll} />
      </div>
    </section>
  );
}
