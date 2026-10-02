"use client";

// Option 3 — Visual Discovery Browse. A display heading over a row of
// photo category pills, the navy live banner, then a pinned pill bar (sale
// mode, quick toggles, all filters, sort, view) above an image-led grid
// that grows with "Load more". The filters open in a rounded drawer.
import Link from "next/link";
import { Fragment, useState } from "react";
import { ArrowDownUp, LayoutGrid, SearchX, SlidersHorizontal } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useReportState } from "@/components/shared/browse/BrowseRoute";
import { BROWSE_COPY as C } from "@/components/shared/browse/copy";
import { groupRuns, isGroupedOrder, useBrowseHeading, useLiveDestination } from "@/components/shared/browse/hooks";
import { DrawerHead } from "@/components/shared/r3/drawers";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Img } from "@/components/shared/ui/Img";
import { CATEGORIES } from "@/data/categories";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { SORT_OPTIONS, useBrowse } from "@/lib/useBrowse";
import { COPY } from "../copy";
import { Arrow, btn, cx } from "../ui";
import { CardSkeleton, LotCard, LotRow, RowSkeleton, toneOf } from "./Cards";
import { ActivePills, ModePills, QuickToggles, SortChoices, SortMenu, ViewSwitch } from "./Controls";
import { FilterSections } from "./Filters";

const PAGE_SIZE = 12;

function Breadcrumbs({ heading, state }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const deeper = heading.kind === "category" || heading.kind === "search";
  return (
    <nav aria-label={ui("breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 vd-sm text-[var(--vd-muted)]">
        <li>
          <Link href={link("/")} className="vd-link hover:text-[var(--vd-indigo)]">
            {ui("home")}
          </Link>
        </li>
        <li aria-hidden="true">·</li>
        <li>
          {deeper ? (
            <Link href={link("/browse")} className="vd-link hover:text-[var(--vd-indigo)]">
              {t(C.marketplace)}
            </Link>
          ) : (
            <span aria-current="page" className="font-semibold text-[var(--vd-ink)]">
              {t(C.marketplace)}
            </span>
          )}
        </li>
        {deeper ? (
          <>
            <li aria-hidden="true">·</li>
            <li aria-current="page" className="max-w-[16rem] truncate font-semibold text-[var(--vd-ink)]">
              {heading.kind === "search" ? t(C.quoted, { q: state.search }) : heading.title}
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}

/** Photo pills for the categories; "All" clears them. Multi-select, like the filter drawer. */
function CategoryPills({ browse }) {
  const { t } = useLang();
  const { state, facets } = browse;
  const none = state.categories.length === 0;
  return (
    <nav aria-label={t(C.categoriesLabel)} className="mt-6 dt:mt-7">
      <ul className="vd-rail -mx-[var(--vd-gutter)] flex gap-2 overflow-x-auto px-[var(--vd-gutter)] pb-1 dt:mx-0 dt:flex-wrap dt:gap-y-2.5 dt:overflow-visible dt:px-0 dt:pb-0">
        <li className="shrink-0">
          <button
            type="button"
            aria-pressed={none}
            onClick={() => browse.setCategory(null)}
            className={cx("inline-flex h-11 items-center gap-2 rounded-full border ps-1.5 pe-3.5 vd-md transition-colors", none ? "border-[var(--vd-indigo)] bg-[var(--vd-indigo)] font-semibold text-white" : "border-[#dfe7f3] bg-white text-[var(--vd-ink)] hover:border-[#c3d2ea] hover:bg-[#f3f7fc]")}
          >
            <span className={cx("grid size-8 place-items-center rounded-full", none ? "bg-white/15" : "bg-[var(--vd-bluegray)] text-[var(--vd-indigo)]")}>
              <LayoutGrid aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
            </span>
            {t(C.anyCategory)}
          </button>
        </li>
        {CATEGORIES.map((category) => {
          const on = state.categories.includes(category.slug);
          const count = facets.categories[category.slug] || 0;
          return (
            <li key={category.slug} className="shrink-0">
              <button
                type="button"
                aria-pressed={on}
                disabled={!count && !on}
                onClick={() => browse.toggleCategory(category.slug)}
                className={cx(
                  "inline-flex h-11 items-center gap-2 rounded-full border ps-1.5 pe-3.5 vd-md transition-colors disabled:cursor-not-allowed disabled:opacity-45",
                  on ? "border-[var(--vd-indigo)] bg-[var(--vd-indigo)] font-semibold text-white" : "border-[#dfe7f3] bg-white text-[var(--vd-ink)] enabled:hover:border-[#c3d2ea] enabled:hover:bg-[#f3f7fc]",
                )}
              >
                <span className="relative size-8 overflow-hidden rounded-full" style={{ background: toneOf(category.slug) }}>
                  <Img image={category.cutout ? { sources: category.cutout.sources } : category.image} alt="" sizes="36px" className="vd-multiply absolute inset-0 size-full object-contain p-1" />
                </span>
                {t(category.name)}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function PageHead({ browse, heading }) {
  const { t, pl } = useLang();
  const { state, total } = browse;
  return (
    <div className="vd-container pt-6 dt:pt-8">
      <Breadcrumbs heading={heading} state={state} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-2 dt:mt-5">
        <h1 className="vd-page-title min-w-0 text-[var(--vd-ink)]">{heading.title}</h1>
        <p className="vd-body text-[var(--vd-muted)] dt:pb-1.5" aria-live="polite">
          <span className="font-bold text-[var(--vd-ink)]">{pl("lots", total)}</span>
          {heading.intro ? <span className="max-md:hidden"> · {heading.intro}</span> : null}
          {state.search ? (
            <>
              {" · "}
              <button type="button" onClick={() => browse.setSearch("")} className="vd-link font-semibold text-[var(--vd-indigo)]">
                {t(C.clearSearch)}
              </button>
            </>
          ) : null}
        </p>
      </div>
      <CategoryPills browse={browse} />
    </div>
  );
}

/** The navy live banner, as a destination ahead of the sale-mode pills. */
function LiveBanner() {
  const { t } = useLang();
  const { link } = useConcept();
  const live = useLiveDestination();
  return (
    <section aria-label={t(C.liveDestination)} className="vd-container mt-6 dt:mt-7">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[20px] bg-[var(--vd-navy)] px-5 py-4 text-white sm:px-6 dt:py-[18px]">
        <span className="inline-flex h-8 shrink-0 items-center gap-2 rounded-full bg-[var(--vd-live)] px-3.5 vd-sm font-bold uppercase tracking-[0.04em] rtl:normal-case rtl:tracking-normal">
          <span aria-hidden="true" className="size-2 rounded-full bg-white" />
          {t(C.liveNow)}
        </span>
        <p className="min-w-0 flex-1 basis-56">
          <span className="block vd-h3 !text-[17px] !leading-6 text-white dt:!text-[19px]">{live.title}</span>
          <span className="vd-sm text-white/75">{live.host}</span>
        </p>
        <Link href={link(live.href)} className={btn("gold", "lg", "h-11 gap-2 px-5 max-sm:w-full")}>
          {t(C.joinLive)}
          <Arrow className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function GroupLabel({ kind }) {
  const { t } = useLang();
  const label = kind === "auction" ? t(C.groupAuctions) : kind === "buy" ? t(C.groupBuyNow) : t(C.groupUpcoming);
  return <h3 className="vd-h3 !text-[19px] text-[var(--vd-ink)] dt:!text-[21px]">{label}</h3>;
}

function Empty({ browse }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const search = browse.state.search;
  return (
    <div className="rounded-[20px] bg-[var(--vd-ivory)] px-6 py-12 text-center dt:py-16">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-white text-[var(--vd-indigo)] shadow-[0_2px_8px_rgb(7_27_82/0.12)]">
        <SearchX aria-hidden="true" className="size-7" strokeWidth={1.8} />
      </span>
      <h3 className="mt-5 vd-h3 !text-[22px] !leading-7 text-[var(--vd-ink)]">{search ? t(C.emptySearchTitle, { q: search }) : t(C.emptyFilterTitle)}</h3>
      <p className="mx-auto mt-2 max-w-md vd-md text-[var(--vd-muted)]">{search ? t(C.emptySearchText) : t(C.emptyFilterText)}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={browse.clearAll} className={btn("indigo", "lg")}>
          {ui("clearFilters")}
        </button>
        <Link href={link("/browse")} className={btn("outline", "lg")}>
          {t(C.browseAll)}
        </Link>
      </div>
      <p className="mt-8 vd-kicker text-[var(--vd-muted)]">{t(C.tryThese)}</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {POPULAR_SEARCHES.map((term) => (
          <li key={term.en}>
            <button type="button" onClick={() => browse.setSearch(t(term))} className="h-10 rounded-full border border-[#dfe7f3] bg-white px-4 vd-md text-[var(--vd-ink)] transition-colors hover:border-[var(--vd-indigo)]">
              {t(term)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const GRID = "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 dt:grid-cols-4 dt:gap-x-[18px] dt:gap-y-6 max-[359px]:grid-cols-1";

function Results({ browse, view }) {
  if (browse.loading) {
    return view === "list" ? (
      <div aria-hidden="true" className="grid gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    ) : (
      <div aria-hidden="true" className={GRID}>
        {Array.from({ length: 8 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (!browse.total) return <Empty browse={browse} />;
  const items = browse.shownItems;
  const runs = isGroupedOrder(browse.state) ? groupRuns(items) : [{ kind: null, items }];
  // The closing-first lot leads the grid when the order is by time left.
  const first = items[0];
  const lead = view === "grid" && browse.state.sort === "recommended" && items.length >= 5 && first?.status === "live" && first.saleType !== "buy_now";
  return (
    <ul className={view === "list" ? "grid gap-3" : GRID}>
      {runs.map((run, r) => (
        <Fragment key={`${run.kind}-${r}`}>
          {run.kind ? (
            <li className={cx("col-span-full", r > 0 && "pt-5")}>
              <GroupLabel kind={run.kind} />
            </li>
          ) : null}
          {run.items.map((product, i) => {
            const isLead = lead && r === 0 && i === 0;
            return (
              <li key={product.slug} className={isLead ? "col-span-2 md:row-span-2" : undefined}>
                {view === "list" ? <LotRow product={product} /> : <LotCard product={product} lead={isLead} priority={r === 0 && i < 4} />}
              </li>
            );
          })}
        </Fragment>
      ))}
    </ul>
  );
}

function LoadMore({ browse }) {
  const { ui } = useLang();
  if (browse.loading || !browse.total) return null;
  const shown = browse.shownItems.length;
  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <p className="vd-md text-[var(--vd-muted)]" aria-live="polite">
        {ui("showingOf", { shown, total: browse.total })}
      </p>
      <span aria-hidden="true" className="h-1.5 w-52 overflow-hidden rounded-full bg-[var(--vd-bluegray)]">
        <span className="block h-full rounded-full bg-[var(--vd-indigo)]" style={{ width: `${(shown / browse.total) * 100}%` }} />
      </span>
      {browse.hasMore ? (
        <button type="button" onClick={browse.loadMore} disabled={browse.loadingMore} aria-busy={browse.loadingMore} className={btn("outline", "lg", "mt-2 min-w-[180px]")}>
          {browse.loadingMore ? ui("loading") : ui("loadMore")}
        </button>
      ) : null}
    </div>
  );
}

/** Pinned pill bar: sale mode, quick toggles, all filters, sort and view. */
function PillBar({ browse, view, onView, onOpen }) {
  const { t, ui } = useLang();
  const sort = SORT_OPTIONS.find((option) => option.value === browse.state.sort) || SORT_OPTIONS[0];
  const count = browse.active.length;
  return (
    <div className="sticky top-[var(--pbar-h)] z-20 mt-6 border-y border-[var(--vd-line)] bg-white dt:mt-7">
      <div className="vd-container flex flex-wrap items-center gap-x-3 gap-y-2.5 py-3">
        <ModePills browse={browse} className="w-full sm:w-auto" />
        <div className="vd-rail -mx-[var(--vd-gutter)] flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-[var(--vd-gutter)] sm:mx-0 sm:px-0">
          <button
            type="button"
            data-testid="filter-button"
            aria-haspopup="dialog"
            onClick={() => onOpen("filters")}
            className={cx("inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 vd-md font-semibold transition-colors", count ? "bg-[var(--vd-indigo)] text-white" : "bg-[var(--vd-navy)] text-white hover:bg-[#0b2d55]")}
          >
            <SlidersHorizontal aria-hidden="true" className="size-4" strokeWidth={2.2} />
            {t(C.moreFilters)}
            {count ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 vd-xs font-bold text-[var(--vd-indigo)] tabular">{count}</span> : null}
          </button>
          <button type="button" aria-haspopup="dialog" onClick={() => onOpen("sort")} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[var(--vd-bluegray)] px-4 vd-md font-semibold text-[var(--vd-ink)] dt:hidden">
            <ArrowDownUp aria-hidden="true" className="size-4" strokeWidth={2.2} />
            <span className="sr-only">{`${ui("sortBy")}: `}</span>
            {ui(sort.key)}
          </button>
          <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-[var(--vd-line)]" />
          <QuickToggles browse={browse} />
        </div>
        <div className="flex items-center gap-2 max-dt:hidden">
          <SortMenu value={browse.state.sort} onChange={browse.setSort} />
          <ViewSwitch view={view} onChange={onView} />
        </div>
      </div>
    </div>
  );
}

export function BrowseView({ initial, onState }) {
  const { t, ui, pl } = useLang();
  const browse = useBrowse({ pageSize: PAGE_SIZE, initial, syncUrl: false });
  useReportState(browse.state, onState);
  const heading = useBrowseHeading(browse.state, { auction: t(COPY.navTimed) });
  const [view, setView] = useState("grid");
  const [sheet, setSheet] = useState(null);

  const open = (name) => setSheet({ name, side: name === "filters" && window.matchMedia("(min-width: 768px)").matches ? "end" : "bottom" });
  const close = () => setSheet(null);
  const panel = (side) => cx("bg-white font-sans text-fg shadow-overlay", side === "bottom" ? "rounded-t-[20px]" : "rounded-s-[20px] max-sm:rounded-none");

  return (
    <>
      <PageHead browse={browse} heading={heading} />
      <LiveBanner />
      <PillBar browse={browse} view={view} onView={setView} onOpen={open} />

      <section aria-labelledby="vd-results-title" aria-busy={browse.loading} className="vd-container pb-14 pt-5 dt:pb-20 dt:pt-6">
        <h2 id="vd-results-title" className="sr-only">
          {t(C.resultsLabel)}
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-3 max-dt:mb-5">
          <ActivePills browse={browse} className="dt:mb-5" />
          <ViewSwitch view={view} onChange={setView} className="ms-auto dt:hidden" />
        </div>
        <Results browse={browse} view={view} />
        <LoadMore browse={browse} />
      </section>

      <Drawer open={sheet?.name === "filters"} onClose={close} title={t(C.filters)} side={sheet?.side ?? "bottom"} panelClassName={panel(sheet?.side)}>
        <DrawerHead onClose={close}>
          <p className="vd-h3 text-[var(--vd-ink)]">
            {t(C.filters)} <span className="vd-sm font-normal text-[var(--vd-muted)]">· {pl("results", browse.total)}</span>
          </p>
        </DrawerHead>
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <FilterSections browse={browse} />
        </div>
        <div className="flex gap-3 border-t border-[var(--vd-line)] bg-white px-5 py-4">
          <button type="button" onClick={browse.clearAll} disabled={!browse.active.length} className={btn("soft", "lg", "flex-1")}>
            {ui("clearAll")}
          </button>
          <button type="button" onClick={close} className={btn("indigo", "lg", "flex-[2]")}>
            {ui("showResults", { n: browse.total })}
          </button>
        </div>
      </Drawer>

      <Drawer open={sheet?.name === "sort"} onClose={close} title={t(C.sortSheet)} side="bottom" panelClassName={panel("bottom")}>
        <DrawerHead onClose={close}>
          <p className="vd-h3 text-[var(--vd-ink)]">{t(C.sortSheet)}</p>
        </DrawerHead>
        <div className="overflow-y-auto px-5 pb-6 pt-4">
          <SortChoices
            value={browse.state.sort}
            onChange={(value) => {
              browse.setSort(value);
              close();
            }}
          />
        </div>
      </Drawer>
    </>
  );
}

export function BrowseFallback() {
  return (
    <div aria-hidden="true" className="vd-container pb-14 pt-8">
      <div className="h-3 w-40 rounded-full bg-[var(--vd-bluegray)]" />
      <div className="mt-6 h-12 w-72 max-w-full rounded-full bg-[var(--vd-bluegray)]" />
      <div className="mt-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-12 w-36 shrink-0 rounded-full bg-[#f2f5fa]" />
        ))}
      </div>
      <div className="mt-6 h-[72px] rounded-[20px] bg-[var(--vd-navy)]/90" />
      <div className={cx(GRID, "mt-10")}>
        {Array.from({ length: 4 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
