"use client";

// Option 1 — Modern Commerce Browse. A white summary band (title, count and
// three auction figures, the live auction last before any Buy Now control),
// then a results toolbar card (underlined All → Auctions → Buy Now, quick
// filters, sort, view), the sticky facet rail and dense card grid grouped
// auction-first, and numbered pages.
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronRight, Gavel, SlidersHorizontal, Timer } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useReportState } from "@/components/shared/browse/BrowseRoute";
import { BROWSE_COPY as C } from "@/components/shared/browse/copy";
import { AUCTION_PULSE, useLiveDestination } from "@/components/shared/browse/hooks";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { getCategory } from "@/data/categories";
import { GRADES } from "@/data/grades";
import { useBrowse } from "@/lib/useBrowse";
import { formatNumber } from "@/lib/format";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { ToggleChip } from "../ui/Choice";
import { Pagination } from "../ui/Pagination";
import { Segmented } from "../ui/Segmented";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { ActiveChips } from "./ActiveChips";
import { BrowseResults } from "./BrowseResults";
import { FacetPanel } from "./FacetPanel";
import { MobileFilterBar } from "./MobileFilterBar";
import { SortListbox, ViewToggle } from "./SortControls";

const PAGE_SIZE = 12;

function useBrowseTitle(state) {
  const { t, ui } = useLang();
  const category = state.categories.length === 1 ? getCategory(state.categories[0]) : null;
  if (state.search) return { title: t(COPY.resultsFor, { q: state.search }), blurb: null, category };
  if (category) return { title: t(category.name), blurb: t(category.blurb), category };
  if (state.tab === "auction") return { title: ui("auctions"), blurb: t(C.auctionsIntro), category };
  if (state.tab === "buy_now") return { title: ui("buyNow"), blurb: t(C.buyNowIntro), category };
  return { title: ui("allLots"), blurb: t(C.intro), category };
}

/** Three auction figures: open auctions, closing within the hour, the live auction. */
function AuctionPulse({ browse }) {
  const { t } = useLang();
  const { link } = useConcept();
  const live = useLiveDestination();
  const { state } = browse;
  const tile = "flex min-h-14 min-w-0 items-center gap-3 rounded-xl border px-3 py-2 text-start transition-colors";
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-[auto_auto_minmax(0,1fr)] lg:flex lg:max-w-[640px] lg:flex-1 lg:justify-end">
      <li className="min-w-0">
        <button
          type="button"
          aria-pressed={state.tab === "auction"}
          onClick={() => browse.setTab(state.tab === "auction" ? "all" : "auction")}
          className={cx(tile, "w-full", state.tab === "auction" ? "border-primary bg-primary/10" : "border-line bg-surface hover:border-line-strong")}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Gavel aria-hidden="true" className="size-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block kb-lg font-extrabold leading-5 text-fg tabular">{AUCTION_PULSE.open}</span>
            <span className="block kb-xs text-fg-2">{t(C.liveAuctionsCount)}</span>
          </span>
        </button>
      </li>
      <li className="min-w-0">
        <button
          type="button"
          aria-pressed={state.ending === "1h"}
          onClick={() => browse.setEnding(state.ending === "1h" ? "all" : "1h")}
          className={cx(tile, "w-full", state.ending === "1h" ? "border-warning bg-warning/10" : "border-line bg-surface hover:border-line-strong")}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-warning/10 text-warning">
            <Timer aria-hidden="true" className="size-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block kb-lg font-extrabold leading-5 text-fg tabular">{AUCTION_PULSE.closingHour}</span>
            <span className="block kb-xs text-fg-2">{t(C.closingHour)}</span>
          </span>
        </button>
      </li>
      <li className="col-span-2 min-w-0 sm:col-span-1 lg:max-w-[300px] lg:flex-1">
        <Link href={link(live.href)} className={cx(tile, "kb-on-dark border-transparent bg-[var(--kb-indigo-950)] text-white hover:bg-[var(--kb-indigo-900)]")}>
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10">
            <span aria-hidden="true" className="kz-live-dot" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block kb-sm font-bold leading-5">
              {t(C.liveNow)} · <span className="font-medium text-white/75">{t(C.watchingNow, { n: formatNumber(live.viewers) })}</span>
            </span>
            <span className="block truncate kb-xs text-white/75">{live.title}</span>
          </span>
          <DirIcon icon={ChevronRight} className="size-4 shrink-0 text-accent" />
        </Link>
      </li>
    </ul>
  );
}

/** One-tap filters: ending within the hour, Grade A, discounted. */
function QuickChips({ browse, className = "" }) {
  const { t, ui } = useLang();
  const { state } = browse;
  return (
    <div className={cx("no-scrollbar flex items-center gap-2 overflow-x-auto", className)}>
      <span className="flex shrink-0 items-center gap-1.5 pe-1 kb-xs font-bold uppercase tracking-[0.06em] text-fg-3 rtl:normal-case rtl:tracking-normal">
        <SlidersHorizontal aria-hidden="true" className="size-3.5" />
        {t(C.quickFilters)}
      </span>
      <ToggleChip icon={Timer} pressed={state.ending === "1h"} onClick={() => browse.setEnding(state.ending === "1h" ? "all" : "1h")}>
        {t(COPY.endingUnderHour)}
      </ToggleChip>
      <ToggleChip pressed={state.grades.includes("A")} onClick={() => browse.toggleGrade("A")}>
        {t(GRADES.A.label)}
      </ToggleChip>
      <ToggleChip pressed={state.discounted} onClick={() => browse.setDiscounted(!state.discounted)}>
        {ui("discounted")}
      </ToggleChip>
    </div>
  );
}

/** Underlined sale mode, quick filters, sort and view, in one card. */
function Toolbar({ browse, view, onView }) {
  const { t, ui } = useLang();
  const { state, facets } = browse;
  return (
    <div className="rounded-xl border border-line bg-surface shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-x-4 px-2 lg:px-3">
        <Segmented
          variant="underline"
          label={t(COPY.saleType)}
          value={state.tab}
          onChange={browse.setTab}
          className="-mb-px border-b-0"
          options={[
            { value: "all", label: ui("all"), count: facets.tabs.all },
            { value: "auction", label: ui("auctions"), count: facets.tabs.auction },
            { value: "buy_now", label: ui("buyNow"), count: facets.tabs.buy_now },
          ]}
        />
        <div className="hidden items-center gap-2 py-2 lg:flex">
          <SortListbox value={state.sort} onChange={browse.setSort} />
          <ViewToggle view={view} onChange={onView} />
        </div>
      </div>
      <QuickChips browse={browse} className="border-t border-line px-3 py-2.5" />
    </div>
  );
}

export function BrowseView({ initial, onState }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const browse = useBrowse({ pageSize: PAGE_SIZE, initial, syncUrl: false });
  useReportState(browse.state, onState);
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const from = (browse.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(browse.total, browse.page * PAGE_SIZE);

  return (
    <>
      <section aria-labelledby="kb-browse-title" className="border-b border-line bg-surface">
        <div className="kb-container pb-5 pt-4 lg:pb-6">
          <Breadcrumbs items={crumbs} />
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div className="min-w-0">
              <h1 id="kb-browse-title" className="kb-h1 text-fg">
                {title}
              </h1>
              <p className="mt-1 kb-sm text-fg-2" aria-live="polite">
                <span className="font-semibold text-fg">{pl("results", browse.total)}</span>
                {blurb ? <span> · {blurb}</span> : null}
              </p>
            </div>
            <AuctionPulse browse={browse} />
          </div>
        </div>
      </section>

      <div className="kb-container pb-16 pt-5 lg:pt-6">
        <div className="hidden lg:block">
          <Toolbar browse={browse} view={view} onView={setView} />
        </div>
        <div className="lg:hidden">
          <Segmented
            variant="underline"
            label={t(COPY.saleType)}
            value={browse.state.tab}
            onChange={browse.setTab}
            className="-mx-4 px-2 sm:-mx-6 sm:px-4"
            options={[
              { value: "all", label: ui("all"), count: browse.facets.tabs.all },
              { value: "auction", label: ui("auctions"), count: browse.facets.tabs.auction },
              { value: "buy_now", label: ui("buyNow"), count: browse.facets.tabs.buy_now },
            ]}
          />
          <MobileFilterBar browse={browse} view={view} onView={setView} endingFirst />
          <QuickChips browse={browse} className="-mx-4 mt-3 px-4 sm:-mx-6 sm:px-6" />
          <ActiveChips browse={browse} className="mt-3" />
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[256px_minmax(0,1fr)]">
          <aside aria-labelledby="kb-filters-title" className="hidden lg:block">
            <div className="kb-sticky no-scrollbar max-h-[calc(100dvh-var(--pbar-h)-var(--kb-head)-32px)] overflow-y-auto rounded-xl border border-line bg-surface px-3 py-2">
              <h2 id="kb-filters-title" className="flex items-center gap-2 px-1.5 pb-1 pt-2 kb-md font-extrabold text-fg">
                <SlidersHorizontal aria-hidden="true" className="size-4 text-primary" />
                {ui("filters")}
              </h2>
              <FacetPanel browse={browse} name="side" endingFirst />
            </div>
          </aside>

          <section ref={resultsRef} aria-labelledby="kb-results-title" aria-busy={browse.loading} className="min-w-0 scroll-mt-40">
            <h2 id="kb-results-title" className="sr-only">
              {t(COPY.resultsLabel)}
            </h2>
            <div className="mb-4 hidden flex-wrap items-center gap-3 lg:flex">
              <p className="kb-sm text-fg-2" aria-live="polite">
                {browse.total ? t(COPY.showingRange, { from, to, total: browse.total }) : pl("results", 0)}
              </p>
              <ActiveChips browse={browse} />
            </div>

            <BrowseResults browse={browse} view={view} />

            {!browse.loading && browse.pageCount > 1 ? (
              <div className="mt-8 flex flex-col items-center gap-3">
                <Pagination page={browse.page} pageCount={browse.pageCount} onChange={goToPage} />
                <p className="kb-xs text-fg-3">{t(COPY.showingRange, { from, to, total: browse.total })}</p>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </>
  );
}

/** What the static page shows before the browser reads the URL. */
export function BrowseFallback() {
  return (
    <div aria-hidden="true">
      <div className="border-b border-line bg-surface">
        <div className="kb-container pb-6 pt-4">
          <div className="h-3 w-32 rounded bg-surface-2" />
          <div className="mt-4 h-8 w-48 rounded bg-surface-2" />
        </div>
      </div>
      <div className="kb-container pt-6">
        <div className="h-[104px] rounded-xl border border-line bg-surface" />
      </div>
    </div>
  );
}
