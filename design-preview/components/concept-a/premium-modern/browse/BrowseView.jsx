"use client";

// Option 2 — Premium Modern Browse. An editorial page head with the brass
// dash, the live auction on a stone band, text tabs for the sale mode, an
// unboxed filter rail beside three spacious columns, numbered pages. Phones
// and tablets get a Filters / Sort bar with sheets.
import Link from "next/link";
import { Fragment, useRef, useState } from "react";
import { ArrowDownUp, SearchX, SlidersHorizontal } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useReportState } from "@/components/shared/browse/BrowseRoute";
import { BROWSE_COPY as C } from "@/components/shared/browse/copy";
import { groupRuns, isGroupedOrder, useBrowseHeading, useLiveDestination } from "@/components/shared/browse/hooks";
import { DrawerHead } from "@/components/shared/r3/drawers";
import { Drawer } from "@/components/shared/ui/Drawer";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { SORT_OPTIONS, useBrowse } from "@/lib/useBrowse";
import { COPY } from "../copy";
import { Chevron, btn, cx } from "../ui";
import { CardSkeleton, LotCard, LotRow, RowSkeleton } from "./Cards";
import { ActiveTags, ModeTabs, Pager, SortChoices, SortMenu, ViewSwitch } from "./Controls";
import { Refine } from "./Filters";

const PAGE_SIZE = 12;

const scrollBehavior = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

function Breadcrumbs({ heading, state }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const deeper = heading.kind === "category" || heading.kind === "search";
  return (
    <nav aria-label={ui("breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-xs text-fg-2">
        <li>
          <Link href={link("/")} className="pr-link">
            {ui("home")}
          </Link>
        </li>
        <li aria-hidden="true" className="text-[#b9b4aa]">
          /
        </li>
        <li>
          {deeper ? (
            <Link href={link("/browse")} className="pr-link">
              {t(C.marketplace)}
            </Link>
          ) : (
            <span aria-current="page" className="text-fg">
              {t(C.marketplace)}
            </span>
          )}
        </li>
        {deeper ? (
          <>
            <li aria-hidden="true" className="text-[#b9b4aa]">
              /
            </li>
            <li aria-current="page" className="max-w-[16rem] truncate text-fg">
              {heading.kind === "search" ? t(C.quoted, { q: state.search }) : heading.title}
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}

function PageHead({ browse, heading }) {
  const { t, pl } = useLang();
  const { state, total } = browse;
  return (
    <div className="pr-container pt-5 dt:pt-7">
      <Breadcrumbs heading={heading} state={state} />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 dt:mt-8">
        <div className="min-w-0 max-w-3xl">
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="pr-dash" />
            <span className="pr-eyebrow text-[#4a4d57]">{t(C.marketplace)}</span>
          </p>
          <h1 className="mt-3 pr-page-title text-fg">{heading.title}</h1>
          {heading.intro ? <p className="mt-2 pr-body text-fg-2">{heading.intro}</p> : null}
        </div>
        <div className="flex items-center gap-4">
          <p className="pr-lg font-semibold text-fg" aria-live="polite">
            {pl("lots", total)}
          </p>
          {state.search ? (
            <button type="button" onClick={() => browse.setSearch("")} className="pr-link pr-md font-medium text-[var(--pr-bronze)]">
              {t(C.clearSearch)}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** The live auction as a destination, before any Buy Now control. */
function LiveStrip() {
  const { t } = useLang();
  const { link } = useConcept();
  const live = useLiveDestination();
  return (
    <section aria-label={t(C.liveDestination)} className="mt-7 bg-[var(--pr-stone)] dt:mt-9">
      <div className="pr-container flex flex-wrap items-center gap-x-5 gap-y-2 py-3.5">
        <span className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-[3px] bg-[var(--pr-live)] px-2 pr-kicker text-white">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
          {t(C.liveNow)}
        </span>
        <p className="min-w-0 flex-1 basis-60 pr-md text-fg">
          <span className="font-semibold">{live.title}</span>
          <span className="text-[#5e626c]"> · {live.host}</span>
        </p>
        <Link href={link(live.href)} className="pr-link relative inline-flex shrink-0 items-center gap-1.5 pr-md font-semibold text-fg after:absolute after:-inset-x-2 after:-inset-y-3 after:content-['']">
          {t(C.joinLive)}
          <Chevron className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function GroupLabel({ kind }) {
  const { t } = useLang();
  const label = kind === "auction" ? t(C.groupAuctions) : kind === "buy" ? t(C.groupBuyNow) : t(C.groupUpcoming);
  return (
    <div className="flex items-center gap-4">
      <h3 className="pr-kicker shrink-0 text-[#4a4d57]">{label}</h3>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}

function Empty({ browse }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const search = browse.state.search;
  return (
    <div className="rounded-[5px] border border-[#ebe9e3] bg-white px-6 py-14 text-center dt:py-20">
      <SearchX aria-hidden="true" className="mx-auto size-8 text-[var(--pr-bronze)]" strokeWidth={1.5} />
      <h3 className="mt-5 pr-h3 text-fg">{search ? t(C.emptySearchTitle, { q: search }) : t(C.emptyFilterTitle)}</h3>
      <p className="mx-auto mt-2 max-w-md pr-md text-fg-2">{search ? t(C.emptySearchText) : t(C.emptyFilterText)}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={browse.clearAll} className={btn("charcoal", "md")}>
          {ui("clearFilters")}
        </button>
        <Link href={link("/browse")} className={btn("outline", "md")}>
          {t(C.browseAll)}
        </Link>
      </div>
      <p className="mt-10 pr-kicker text-[#4a4d57]">{t(C.tryThese)}</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {POPULAR_SEARCHES.map((term) => (
          <li key={term.en}>
            <button type="button" onClick={() => browse.setSearch(t(term))} className="pr-link pr-md text-[var(--pr-bronze)]">
              {t(term)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Results({ browse, view }) {
  if (browse.loading) {
    return view === "list" ? (
      <div aria-hidden="true" className="divide-y divide-line border-y border-line">
        {Array.from({ length: 4 }, (_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    ) : (
      <div aria-hidden="true" className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 dt:gap-x-5 dt:gap-y-7 max-[359px]:grid-cols-1">
        {Array.from({ length: 6 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (!browse.total) return <Empty browse={browse} />;
  const runs = isGroupedOrder(browse.state) ? groupRuns(browse.pageItems) : [{ kind: null, items: browse.pageItems }];
  if (view === "list") {
    return (
      <ul className="border-b border-line">
        {runs.map((run, r) => (
          <Fragment key={`${run.kind}-${r}`}>
            {run.kind ? (
              <li className={cx("pb-1", r > 0 && "pt-8")}>
                <GroupLabel kind={run.kind} />
              </li>
            ) : null}
            {run.items.map((product) => (
              <li key={product.slug} className="border-t border-line first:border-t-0">
                <LotRow product={product} />
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 dt:gap-x-5 dt:gap-y-7 max-[359px]:grid-cols-1">
      {runs.map((run, r) => (
        <Fragment key={`${run.kind}-${r}`}>
          {run.kind ? (
            <li className={cx("col-span-full", r > 0 && "pt-4 dt:pt-3")}>
              <GroupLabel kind={run.kind} />
            </li>
          ) : null}
          {run.items.map((product, i) => (
            <li key={product.slug}>
              <LotCard product={product} priority={r === 0 && i < 3} />
            </li>
          ))}
        </Fragment>
      ))}
    </ul>
  );
}

/** Filters / Sort / view for phones and tablets, pinned under the presentation bar. */
function PhoneBar({ browse, onOpen }) {
  const { ui } = useLang();
  const sort = SORT_OPTIONS.find((option) => option.value === browse.state.sort) || SORT_OPTIONS[0];
  const count = browse.active.length;
  return (
    <div className="sticky top-[var(--pbar-h)] z-20 -mx-[var(--pr-gutter)] flex items-center gap-2 border-b border-line bg-bg px-[var(--pr-gutter)] py-2.5 dt:hidden">
      <button type="button" data-testid="filter-button" aria-haspopup="dialog" onClick={() => onOpen("filters")} className={btn("outline", "md", "min-w-0 flex-1 gap-1.5 px-2.5")}>
        <SlidersHorizontal aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.8} />
        <span className="truncate max-[359px]:hidden">{ui("filters")}</span>
        <span className="truncate min-[360px]:hidden">{ui("filter")}</span>
        {count ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--pr-charcoal)] px-1 pr-xs font-semibold text-white tabular">{count}</span> : null}
      </button>
      <button type="button" aria-haspopup="dialog" onClick={() => onOpen("sort")} className={btn("outline", "md", "min-w-0 flex-1 gap-1.5 px-2.5")}>
        <ArrowDownUp aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.8} />
        <span className="truncate sm:hidden">{ui("sort")}</span>
        <span className="truncate max-sm:hidden">
          {ui("sortBy")}: {ui(sort.key)}
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
  const sheetPanel = (side) => cx("bg-bg font-sans text-fg shadow-overlay", side === "bottom" && "rounded-t-[8px]");

  return (
    <>
      <PageHead browse={browse} heading={heading} />
      <LiveStrip />

      <div className="pr-container pb-14 dt:pb-20">
        <div className="mt-6 flex items-end justify-between gap-6 border-b border-line dt:mt-8">
          <ModeTabs browse={browse} />
          <div className="hidden items-center gap-3 pb-2.5 dt:flex">
            <SortMenu value={browse.state.sort} onChange={browse.setSort} />
            <ViewSwitch view={view} onChange={setView} />
          </div>
        </div>

        <PhoneBar browse={browse} onOpen={open} />

        <div className="mt-5 dt:mt-8 dt:grid dt:grid-cols-[248px_minmax(0,1fr)] dt:gap-12">
          <aside aria-labelledby="pr-refine-title" className="hidden dt:block">
            <div className="flex items-baseline justify-between gap-3 border-b-2 border-[var(--pr-charcoal)] pb-3">
              <h2 id="pr-refine-title" className="pr-h3 text-fg">
                {t(C.filters)}
              </h2>
              {browse.active.length ? (
                <button type="button" onClick={browse.clearAll} className="pr-link pr-sm font-medium text-[var(--pr-bronze)]">
                  {ui("clearAll")}
                </button>
              ) : null}
            </div>
            <Refine browse={browse} />
          </aside>

          <section ref={resultsRef} aria-labelledby="pr-results-title" aria-busy={browse.loading} className="min-w-0 scroll-mt-[calc(var(--pbar-h)+72px)] dt:scroll-mt-[calc(var(--pbar-h)+24px)]">
            <h2 id="pr-results-title" className="sr-only">
              {t(C.resultsLabel)}
            </h2>
            <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="pr-sm text-fg-2" aria-live="polite">
                {browse.total ? t(C.showingRangeLong, { from, to, total: browse.total }) : pl("results", 0)}
              </p>
              <ActiveTags browse={browse} className="max-dt:order-last max-dt:w-full" />
              <ViewSwitch view={view} onChange={setView} className="ms-auto dt:hidden" />
            </div>
            <Results browse={browse} view={view} />
            {!browse.loading ? <Pager page={browse.page} pageCount={browse.pageCount} onChange={goToPage} /> : null}
          </section>
        </div>
      </div>

      <Drawer open={sheet?.name === "filters"} onClose={close} title={t(C.filters)} side={sheet?.side ?? "bottom"} panelClassName={sheetPanel(sheet?.side)}>
        <DrawerHead onClose={close}>
          <p className="pr-h3 text-fg">
            {t(C.filters)} <span className="pr-sm font-normal text-fg-2">· {pl("results", browse.total)}</span>
          </p>
        </DrawerHead>
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <Refine browse={browse} />
        </div>
        <div className="flex gap-3 border-t border-line bg-white px-5 py-4">
          <button type="button" onClick={browse.clearAll} disabled={!browse.active.length} className={btn("outline", "md", "flex-1")}>
            {ui("clearAll")}
          </button>
          <button type="button" onClick={close} className={btn("charcoal", "md", "flex-[2]")}>
            {ui("showResults", { n: browse.total })}
          </button>
        </div>
      </Drawer>

      <Drawer open={sheet?.name === "sort"} onClose={close} title={t(C.sortSheet)} side="bottom" panelClassName={sheetPanel("bottom")}>
        <DrawerHead onClose={close}>
          <p className="pr-h3 text-fg">{t(C.sortSheet)}</p>
        </DrawerHead>
        <div className="overflow-y-auto px-5 pb-6">
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

/** What the static page shows before the browser reads the URL. */
export function BrowseFallback() {
  return (
    <div className="pr-container pb-14 pt-5 dt:pb-20 dt:pt-7" aria-hidden="true">
      <div className="h-3 w-40 rounded-[2px] bg-[#ece8e1]" />
      <div className="mt-8 h-10 w-72 max-w-full rounded-[3px] bg-[#ece8e1]" />
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 dt:ms-[296px] dt:gap-x-5">
        {Array.from({ length: 6 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
