"use client";

import { useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getCategory } from "@/data/categories";
import { useBrowse } from "@/lib/useBrowse";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { Pagination } from "../ui/Pagination";
import { COPY } from "../copy";
import { ActiveChips } from "./ActiveChips";
import { FacetPanel } from "./FacetPanel";
import { MobileFilterBar } from "./MobileFilterBar";
import { QuickFilters } from "./QuickFilters";
import { ResultsGrid } from "./ResultsGrid";
import { SortListbox, ViewToggle } from "./SortControls";

const PAGE_SIZE = 8;

function useBrowseTitle(state) {
  const { t, ui } = useLang();
  const category = state.categories.length === 1 ? getCategory(state.categories[0]) : null;
  if (state.search) return { title: t(COPY.resultsFor, { q: state.search }), blurb: null, category };
  if (category) return { title: t(category.name), blurb: t(category.blurb), category };
  if (state.tab === "auction") return { title: ui("auctions"), blurb: null, category };
  if (state.tab === "buy_now") return { title: ui("buyNow"), blurb: null, category };
  return { title: ui("allLots"), blurb: null, category };
}

/** Browse: quick filters, sticky facet sidebar, toolbar, results and pagination. */
export function BrowseView() {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const browse = useBrowse({ pageSize: PAGE_SIZE });
  const [view, setView] = useState("grid");
  const resultsRef = useRef(null);
  const { title, blurb, category } = useBrowseTitle(browse.state);

  const crumbs = [
    { label: ui("home"), href: link("/") },
    { label: ui("browse"), href: category || browse.state.search ? link("/browse") : undefined },
    ...(category ? [{ label: t(category.name) }] : []),
    ...(browse.state.search ? [{ label: t(COPY.quoted, { q: browse.state.search }) }] : []),
  ];

  const goToPage = (n) => {
    browse.setPage(n);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const from = (browse.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(browse.total, browse.page * PAGE_SIZE);

  return (
    <div className="kb-container pb-16 pt-4">
      <Breadcrumbs items={crumbs} />
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <div className="min-w-0">
          <h1 className="kb-h1 text-fg">{title}</h1>
          <p className="mt-1 kb-sm text-fg-2">
            <span className="font-semibold text-fg">{pl("results", browse.total)}</span>
            {blurb ? <span> · {blurb}</span> : null}
          </p>
        </div>
      </div>

      <QuickFilters browse={browse} className="mt-4" />

      <MobileFilterBar browse={browse} view={view} onView={setView} className="mt-3" />
      <ActiveChips browse={browse} className="mt-3 lg:hidden" />

      <div className="mt-5 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[256px_minmax(0,1fr)]">
        <aside aria-labelledby="kb-filters-title" className="hidden lg:block">
          <div className="kb-sticky no-scrollbar max-h-[calc(100dvh-var(--pbar-h)-var(--kb-head)-32px)] overflow-y-auto rounded-xl border border-line bg-surface px-3 py-2">
            <h2 id="kb-filters-title" className="flex items-center gap-2 px-1.5 pb-1 pt-2 kb-md font-extrabold text-fg">
              <SlidersHorizontal aria-hidden="true" className="size-4 text-primary" />
              {ui("filters")}
            </h2>
            <FacetPanel browse={browse} name="side" />
          </div>
        </aside>

        <section ref={resultsRef} aria-labelledby="kb-results-title" className="min-w-0 scroll-mt-40">
          <h2 id="kb-results-title" className="sr-only">
            {t(COPY.resultsLabel)}
          </h2>
          <div className="mb-4 hidden flex-wrap items-center justify-between gap-3 lg:flex">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
              <p className="kb-sm text-fg-2" aria-live="polite">
                {browse.total ? t(COPY.showingRange, { from, to, total: browse.total }) : pl("results", 0)}
              </p>
              <ActiveChips browse={browse} />
            </div>
            <div className="flex items-center gap-2">
              <SortListbox value={browse.state.sort} onChange={browse.setSort} />
              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>

          <ResultsGrid browse={browse} items={browse.pageItems} view={view} />

          {!browse.loading && browse.pageCount > 1 ? (
            <div className="mt-8 flex flex-col items-center gap-3">
              <Pagination page={browse.page} pageCount={browse.pageCount} onChange={goToPage} />
              <p className="kb-xs text-fg-3">{t(COPY.showingRange, { from, to, total: browse.total })}</p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
