"use client";

// Browse results for Option 1: the home page's lot cards and rows, grouped
// auction-first (open auctions, then Buy Now, then upcoming / closed) when
// the order is the recommended one, with skeletons and a full empty state.
import Link from "next/link";
import { Fragment } from "react";
import { CalendarClock, Gavel, SearchX, ShoppingBag, TrendingUp } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { BROWSE_COPY as C } from "@/components/shared/browse/copy";
import { groupRuns, isGroupedOrder } from "@/components/shared/browse/hooks";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { CardSkeleton, RowSkeleton } from "../cards/CardSkeleton";
import { LotCard } from "../cards/LotCard";
import { LotRow } from "../cards/LotRow";
import { Button, buttonClass } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { cx } from "../ui/cx";

const GRID = "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4";
const GROUP = {
  auction: { icon: Gavel, copy: C.groupAuctions, tone: "bg-primary/10 text-primary" },
  buy: { icon: ShoppingBag, copy: C.groupBuyNow, tone: "bg-accent/15 text-fg" },
  other: { icon: CalendarClock, copy: C.groupUpcoming, tone: "bg-surface-2 text-fg-2" },
};

function GroupLabel({ kind, count }) {
  const { t } = useLang();
  const group = GROUP[kind];
  return (
    <div className="flex items-center gap-2.5">
      <span className={cx("grid size-7 place-items-center rounded-md", group.tone)}>
        <group.icon aria-hidden="true" className="size-4" />
      </span>
      <h3 className="kb-md font-extrabold text-fg">{t(group.copy)}</h3>
      <span className="rounded-full bg-surface-2 px-2 kb-2xs font-bold text-fg-3 tabular">{count}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}

function Empty({ browse }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const search = browse.state.search;
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-surface">
      <EmptyState icon={SearchX} title={search ? t(C.emptySearchTitle, { q: search }) : t(C.emptyFilterTitle)} text={search ? t(C.emptySearchText) : t(C.emptyFilterText)}>
        <Button variant="primary" onClick={browse.clearAll}>
          {ui("clearFilters")}
        </Button>
        <Link href={link("/browse")} className={buttonClass({ variant: "outline" })}>
          {t(C.browseAll)}
        </Link>
      </EmptyState>
      <div className="border-t border-line px-6 pb-8 pt-5 text-center">
        <p className="mb-3 kb-eyebrow text-fg-3">{t(C.tryThese)}</p>
        <ul className="flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <li key={term.en}>
              <button
                type="button"
                onClick={() => browse.setSearch(t(term))}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 kb-sm font-semibold text-fg-2 transition-colors hover:border-primary hover:text-primary"
              >
                <TrendingUp aria-hidden="true" className="size-3.5" />
                {t(term)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BrowseResults({ browse, view }) {
  if (browse.loading) {
    return view === "list" ? (
      <div aria-hidden="true" className="grid gap-3">
        {Array.from({ length: 5 }, (_, i) => (
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
            <li className={cx("col-span-full", r > 0 && "pt-3")}>
              <GroupLabel kind={run.kind} count={run.items.length} />
            </li>
          ) : null}
          {run.items.map((product, i) => (
            <li key={product.slug}>
              {view === "list" ? <LotRow product={product} /> : <LotCard product={product} priority={r === 0 && i < 4} sizes="(min-width: 1280px) 19vw, (min-width: 768px) 30vw, 46vw" />}
            </li>
          ))}
        </Fragment>
      ))}
    </ul>
  );
}
