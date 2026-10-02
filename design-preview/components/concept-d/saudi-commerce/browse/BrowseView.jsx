"use client";

// Option 4 — Contemporary Saudi Commerce Browse. A cream search band carries
// the page title, the live auction and the home page's segmented search
// (category · query · green Search), then the green sale-mode switch. Below,
// the sage filter rail sits beside a framed toolbar and practical cards.
import Link from "next/link";
import { Fragment, useId, useRef, useState } from "react";
import { ArrowDownUp, ChevronDown, Search, SearchX, SlidersHorizontal } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useReportState } from "@/components/shared/browse/BrowseRoute";
import { BROWSE_COPY as C } from "@/components/shared/browse/copy";
import { groupRuns, isGroupedOrder, useBrowseHeading, useLiveDestination } from "@/components/shared/browse/hooks";
import { DrawerHead } from "@/components/shared/r3/drawers";
import { Drawer } from "@/components/shared/ui/Drawer";
import { CATEGORIES } from "@/data/categories";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { SORT_OPTIONS, useBrowse } from "@/lib/useBrowse";
import { COPY } from "../copy";
import { Arrow, btn, cx } from "../ui";
import { CardSkeleton, LotCard, LotRow, RowSkeleton } from "./Cards";
import { ActiveChips, ModeSegments, Pager, SortChoices, SortMenu, ViewSwitch } from "./Controls";
import { FilterGroups } from "./Filters";

const PAGE_SIZE = 12;

const scrollBehavior = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

function Breadcrumbs({ heading, state }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const deeper = heading.kind === "category" || heading.kind === "search";
  return (
    <nav aria-label={ui("breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 sc-sm text-[var(--sc-muted)]">
        <li>
          <Link href={link("/")} className="sc-link text-[var(--sc-link)]">
            {ui("home")}
          </Link>
        </li>
        <li aria-hidden="true">
          <Arrow className="size-3.5" />
        </li>
        <li>
          {deeper ? (
            <Link href={link("/browse")} className="sc-link text-[var(--sc-link)]">
              {t(C.marketplace)}
            </Link>
          ) : (
            <span aria-current="page" className="text-[var(--sc-ink)]">
              {t(C.marketplace)}
            </span>
          )}
        </li>
        {deeper ? (
          <>
            <li aria-hidden="true">
              <Arrow className="size-3.5" />
            </li>
            <li aria-current="page" className="max-w-[16rem] truncate text-[var(--sc-ink)]">
              {heading.kind === "search" ? t(C.quoted, { q: state.search }) : heading.title}
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}

/** The live auction as a destination, ahead of the sale-mode switch. */
function LiveLink() {
  const { t } = useLang();
  const { link } = useConcept();
  const live = useLiveDestination();
  return (
    <Link
      href={link(live.href)}
      aria-label={`${t(C.liveNow)}: ${live.title}. ${t(C.joinLive)}`}
      className="group flex min-w-0 max-w-full items-center gap-3 rounded-[9px] border border-[var(--sc-line)] bg-white py-2 ps-2 pe-3.5 transition-colors hover:border-[var(--sc-green)]"
    >
      <span className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-[5px] bg-[var(--sc-red)] px-2 sc-xs font-bold uppercase text-white rtl:normal-case">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
        {t(C.liveNow)}
      </span>
      <span className="line-clamp-2 min-w-0 flex-1 sc-md font-semibold text-[var(--sc-ink)] sm:truncate">{live.title}</span>
      <span className="hidden shrink-0 items-center gap-1.5 sc-md font-medium text-[var(--sc-link)] group-hover:underline sm:inline-flex">
        {t(C.joinLive)}
        <Arrow className="size-4" />
      </span>
    </Link>
  );
}

/** The home page's segmented search, wired to this page's search and category. */
function SearchBar({ browse }) {
  const { t } = useLang();
  const id = useId();
  const { state } = browse;
  const current = state.categories.length === 1 ? state.categories[0] : "";
  const [query, setQuery] = useState(state.search);
  const [scope, setScope] = useState(current);
  const [seen, setSeen] = useState({ search: state.search, scope: current });
  if (seen.search !== state.search || seen.scope !== current) {
    setSeen({ search: state.search, scope: current });
    setQuery(state.search);
    setScope(current);
  }
  const submit = (event) => {
    event.preventDefault();
    if (query.trim() !== state.search) browse.setSearch(query.trim());
    if (scope !== current) browse.setCategory(scope || null);
  };
  return (
    <form
      role="search"
      onSubmit={submit}
      className="flex flex-col gap-2 rounded-[11px] border border-[#e1e5e3] bg-white p-[7px] shadow-[0_10px_30px_-16px_rgb(16_33_57/0.35)] focus-within:border-[var(--sc-green)] sm:h-[62px] sm:flex-row sm:items-center"
    >
      <label htmlFor={`${id}-scope`} className="sr-only">
        {t(C.searchScope)}
      </label>
      <div className="relative shrink-0">
        <select
          id={`${id}-scope`}
          value={scope}
          onChange={(event) => setScope(event.target.value)}
          className="h-11 w-full cursor-pointer appearance-none rounded-[7px] bg-[#eef1f4] pe-8 ps-3 sc-md text-[var(--sc-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--sc-green)] sm:h-[46px] sm:w-[170px]"
        >
          <option value="">{t(COPY.allCategories)}</option>
          {CATEGORIES.map((category) => (
            <option key={category.slug} value={category.slug}>
              {t(category.name)}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-[var(--sc-ink)]" strokeWidth={2} />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Search aria-hidden="true" className="ms-2 size-[18px] shrink-0 text-[var(--sc-muted)]" strokeWidth={2} />
        <label htmlFor={`${id}-q`} className="sr-only">
          {t(C.searchLabel)}
        </label>
        <input
          id={`${id}-q`}
          type="search"
          autoComplete="off"
          enterKeyHint="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t(C.searchPlaceholder)}
          className="sc-search h-11 min-w-0 flex-1 text-ellipsis rounded-[6px] bg-transparent px-1 sc-md text-[var(--sc-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--sc-green)] dt:text-[15px]"
        />
        <button type="submit" className={btn("green", "md", "h-11 gap-2 px-4 sm:h-[48px] sm:px-6")}>
          <Search aria-hidden="true" className="size-5" strokeWidth={2.2} />
          <span className="max-[359px]:sr-only">{t(C.search)}</span>
        </button>
      </div>
    </form>
  );
}

function SearchBand({ browse, heading }) {
  const { t, pl } = useLang();
  const { state, total } = browse;
  return (
    <section aria-labelledby="sc-browse-title" className="border-b border-[var(--sc-line)] bg-[var(--sc-cream)]/55">
      <div className="sc-container pb-6 pt-5 dt:pb-8 dt:pt-7">
        <Breadcrumbs heading={heading} state={state} />
        <div className="mt-4 grid grid-cols-1 gap-4 dt:mt-5 dt:grid-cols-[minmax(0,1fr)_auto] dt:items-end dt:gap-8">
          <div className="min-w-0">
            <h1 id="sc-browse-title" className="sc-page-title text-[var(--sc-ink)]">
              {heading.title}
            </h1>
            <p className="mt-1.5 sc-md text-[var(--sc-muted)] dt:text-[15px]" aria-live="polite">
              <span className="font-semibold text-[var(--sc-ink)]">{pl("lots", total)}</span>
              {heading.intro ? ` · ${heading.intro}` : null}
              {state.search ? (
                <>
                  {" · "}
                  <button type="button" onClick={() => browse.setSearch("")} className="sc-link font-medium text-[var(--sc-link)]">
                    {t(C.clearSearch)}
                  </button>
                </>
              ) : null}
            </p>
          </div>
          <LiveLink />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 dt:mt-6 dt:grid-cols-[minmax(0,1fr)_auto] dt:items-center dt:gap-6">
          <SearchBar browse={browse} />
          <ModeSegments browse={browse} />
        </div>
      </div>
    </section>
  );
}

function GroupLabel({ kind }) {
  const { t } = useLang();
  const label = kind === "auction" ? t(C.groupAuctions) : kind === "buy" ? t(C.groupBuyNow) : t(C.groupUpcoming);
  return (
    <h3 className="flex items-center gap-3 sc-lg font-semibold text-[var(--sc-ink)]">
      <span aria-hidden="true" className={cx("h-5 w-1 rounded-full", kind === "auction" ? "bg-[var(--sc-green)]" : "bg-[var(--sc-sage)]")} />
      {label}
    </h3>
  );
}

function Empty({ browse }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const search = browse.state.search;
  return (
    <div className="rounded-[9px] border border-[var(--sc-line)] bg-white px-6 py-12 text-center dt:py-16">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--sc-soft)] text-[var(--sc-green)]">
        <SearchX aria-hidden="true" className="size-7" strokeWidth={1.6} />
      </span>
      <h3 className="mt-4 sc-h3 text-[var(--sc-ink)]">{search ? t(C.emptySearchTitle, { q: search }) : t(C.emptyFilterTitle)}</h3>
      <p className="mx-auto mt-2 max-w-md sc-md text-[var(--sc-muted)]">{search ? t(C.emptySearchText) : t(C.emptyFilterText)}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={browse.clearAll} className={btn("green", "md")}>
          {ui("clearFilters")}
        </button>
        <Link href={link("/browse")} className={btn("outline", "md")}>
          {t(C.browseAll)}
        </Link>
      </div>
      <p className="mt-8 sc-micro text-[var(--sc-muted)]">{t(C.tryThese)}</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {POPULAR_SEARCHES.map((term) => (
          <li key={term.en}>
            <button type="button" onClick={() => browse.setSearch(t(term))} className="h-9 rounded-[7px] border border-[var(--sc-line)] bg-white px-3 sc-sm text-[var(--sc-ink)] transition-colors hover:border-[var(--sc-green)]">
              {t(term)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const GRID = "grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3";

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
  const runs = isGroupedOrder(browse.state) ? groupRuns(browse.pageItems) : [{ kind: null, items: browse.pageItems }];
  return (
    <ul className={view === "list" ? "grid gap-3" : GRID}>
      {runs.map((run, r) => (
        <Fragment key={`${run.kind}-${r}`}>
          {run.kind ? (
            <li className={cx("col-span-full", r > 0 && "pt-4")}>
              <GroupLabel kind={run.kind} />
            </li>
          ) : null}
          {run.items.map((product, i) => (
            <li key={product.slug}>{view === "list" ? <LotRow product={product} /> : <LotCard product={product} priority={r === 0 && i < 3} />}</li>
          ))}
        </Fragment>
      ))}
    </ul>
  );
}

function PhoneBar({ browse, onOpen }) {
  const { ui } = useLang();
  const sort = SORT_OPTIONS.find((option) => option.value === browse.state.sort) || SORT_OPTIONS[0];
  const count = browse.active.length;
  return (
    <div className="sticky top-[var(--pbar-h)] z-20 -mx-[var(--sc-gutter)] flex items-center gap-2 border-b border-[var(--sc-line)] bg-white px-[var(--sc-gutter)] py-2.5 dt:hidden">
      <button type="button" data-testid="filter-button" aria-haspopup="dialog" onClick={() => onOpen("filters")} className={btn("outline", "md", "min-w-0 flex-1 gap-1.5 px-2.5")}>
        <SlidersHorizontal aria-hidden="true" className="size-[18px] shrink-0 text-[var(--sc-green)]" strokeWidth={1.8} />
        <span className="truncate max-[359px]:hidden">{ui("filters")}</span>
        <span className="truncate min-[360px]:hidden">{ui("filter")}</span>
        {count ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--sc-green)] px-1 sc-xs font-bold text-white tabular">{count}</span> : null}
      </button>
      <button type="button" aria-haspopup="dialog" onClick={() => onOpen("sort")} className={btn("outline", "md", "min-w-0 flex-1 gap-1.5 px-2.5")}>
        <ArrowDownUp aria-hidden="true" className="size-[18px] shrink-0 text-[var(--sc-green)]" strokeWidth={1.8} />
        <span className="truncate sm:hidden">{ui("sort")}</span>
        <span className="truncate max-sm:hidden">
          <span className="sr-only">{`${ui("sortBy")}: `}</span>
          {ui(sort.key)}
        </span>
      </button>
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
  const resultsRef = useRef(null);

  const open = (name) => setSheet({ name, side: name === "filters" && window.matchMedia("(min-width: 768px)").matches ? "start" : "bottom" });
  const close = () => setSheet(null);
  const goToPage = (n) => {
    browse.setPage(n);
    resultsRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  };
  const from = (browse.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(browse.total, browse.page * PAGE_SIZE);
  const sheetPanel = (side) => cx("bg-white font-sans text-fg shadow-overlay", side === "bottom" && "rounded-t-[12px]");

  return (
    <>
      <SearchBand browse={browse} heading={heading} />

      <div className="sc-container pb-12 dt:pb-16">
        <PhoneBar browse={browse} onOpen={open} />
        <div className="mt-5 dt:mt-8 dt:grid dt:grid-cols-[253px_minmax(0,1fr)] dt:gap-[32px]">
          <aside aria-labelledby="sc-filters-title" className="hidden dt:block">
            <div className="rounded-[9px] bg-[var(--sc-soft)] px-3 pb-2 pt-5">
              <div className="flex items-center justify-between gap-3 px-1 pb-3">
                <h2 id="sc-filters-title" className="sc-h3 !text-[20px] font-bold text-[var(--sc-green)]">
                  {t(C.filters)}
                </h2>
                {browse.active.length ? (
                  <button type="button" onClick={browse.clearAll} className="sc-link sc-sm font-medium text-[var(--sc-link)]">
                    {ui("clearAll")}
                  </button>
                ) : null}
              </div>
              <FilterGroups browse={browse} />
            </div>
          </aside>

          <section ref={resultsRef} aria-labelledby="sc-results-title" aria-busy={browse.loading} className="min-w-0 scroll-mt-[calc(var(--pbar-h)+72px)] dt:scroll-mt-[calc(var(--pbar-h)+24px)]">
            <h2 id="sc-results-title" className="sr-only">
              {t(C.resultsLabel)}
            </h2>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[9px] border border-[var(--sc-line)] bg-white px-4 py-2.5 max-sm:border-0 max-sm:px-0 max-sm:py-0">
              <p className="sc-md text-[var(--sc-muted)]" aria-live="polite">
                {browse.total ? t(C.showingRangeLong, { from, to, total: browse.total }) : pl("results", 0)}
              </p>
              <div className="flex items-center gap-2.5">
                <div className="hidden dt:block">
                  <SortMenu value={browse.state.sort} onChange={browse.setSort} />
                </div>
                <ViewSwitch view={view} onChange={setView} />
              </div>
            </div>
            <ActiveChips browse={browse} className="mt-3" />
            <div className="mt-5">
              <Results browse={browse} view={view} />
            </div>
            {!browse.loading ? <Pager page={browse.page} pageCount={browse.pageCount} onChange={goToPage} /> : null}
          </section>
        </div>
      </div>

      <Drawer open={sheet?.name === "filters"} onClose={close} title={t(C.filters)} side={sheet?.side ?? "bottom"} panelClassName={sheetPanel(sheet?.side)}>
        <DrawerHead onClose={close}>
          <p className="sc-h3 font-bold text-[var(--sc-green)]">
            {t(C.filters)} <span className="sc-sm font-normal text-[var(--sc-muted)]">· {pl("results", browse.total)}</span>
          </p>
        </DrawerHead>
        <div className="flex-1 overflow-y-auto bg-[var(--sc-soft)] px-4 pb-4 pt-4">
          <FilterGroups browse={browse} />
        </div>
        <div className="flex gap-3 border-t border-[var(--sc-line)] bg-white px-4 py-4">
          <button type="button" onClick={browse.clearAll} disabled={!browse.active.length} className={btn("outline", "md", "flex-1")}>
            {ui("clearAll")}
          </button>
          <button type="button" onClick={close} className={btn("green", "md", "flex-[2]")}>
            {ui("showResults", { n: browse.total })}
          </button>
        </div>
      </Drawer>

      <Drawer open={sheet?.name === "sort"} onClose={close} title={t(C.sortSheet)} side="bottom" panelClassName={sheetPanel("bottom")}>
        <DrawerHead onClose={close}>
          <p className="sc-h3 font-bold text-[var(--sc-ink)]">{t(C.sortSheet)}</p>
        </DrawerHead>
        <div className="overflow-y-auto px-4 pb-6 pt-4">
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
    <div aria-hidden="true">
      <div className="border-b border-[var(--sc-line)] bg-[var(--sc-cream)]/55">
        <div className="sc-container pb-8 pt-7">
          <div className="h-3 w-40 rounded-[4px] bg-[#e7ddd0]" />
          <div className="mt-5 h-9 w-64 max-w-full rounded-[6px] bg-[#e7ddd0]" />
          <div className="mt-6 h-[62px] rounded-[11px] bg-white" />
        </div>
      </div>
      <div className="sc-container mt-8 pb-16 dt:grid dt:grid-cols-[253px_minmax(0,1fr)] dt:gap-[32px]">
        <div className="hidden h-[540px] rounded-[9px] bg-[var(--sc-soft)] dt:block" />
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {Array.from({ length: 4 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
