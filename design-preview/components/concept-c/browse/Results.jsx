"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { CardSkeleton, LotCard } from "../cards/LotCard";
import { LotRow } from "../cards/LotRow";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "@/components/shared/ui/Skeleton";

const GRID = "grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6";

/** "Showing 12 of 30" with a thin progress bar and the Load more button. */
export function LoadMore({ shown, total, hasMore, loading, onMore }) {
  const { ui } = useLang();
  return (
    <div className="mx-auto mt-12 flex max-w-sm flex-col items-center gap-4 text-center">
      <p className="text-sm text-fg-2">{ui("showingOf", { shown, total })}</p>
      <div aria-hidden="true" className="h-0.5 w-full bg-line">
        <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${total ? (shown / total) * 100 : 0}%` }} />
      </div>
      {hasMore ? (
        <Button variant="outline" size="lg" loading={loading} onClick={onMore} className="min-w-52">
          {loading ? ui("loading") : ui("loadMore")}
        </Button>
      ) : null}
    </div>
  );
}

function SkeletonRows({ count }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} aria-hidden="true" className="grid grid-cols-[6.5rem_1fr] gap-4 rounded-card border border-line bg-surface p-3 sm:grid-cols-[9rem_1fr] sm:p-4">
      <Skeleton className="c-chamfer c-chamfer--sm aspect-square" />
      <div className="flex flex-col justify-center gap-3">
        <Skeleton className="h-5 w-24 rounded-xs" />
        <Skeleton className="h-4 w-3/4 rounded-xs" />
        <Skeleton className="h-4 w-1/3 rounded-xs" />
      </div>
    </div>
  ));
}

/** Results area: skeletons while loading, grid or list, empty state, progressive loading. */
export function Results({ browse, view, onReset }) {
  const { t, ui } = useLang();
  // A "load more" is pending while the filters are unchanged and the list hasn't grown yet.
  const [pending, setPending] = useState(null);
  const { loading, shownItems, total, hasMore } = browse;
  const loadingMore = loading && pending?.state === browse.state && pending.count === shownItems.length;
  const refreshing = loading && !loadingMore;

  if (!refreshing && !total) {
    return (
      <EmptyState title={ui("emptyTitle")} text={ui("emptyText")} className="rounded-md border border-dashed border-line-strong bg-surface/60">
        <Button variant="primary" onClick={onReset}>
          {ui("clearFilters")}
        </Button>
        <div className="flex w-full flex-wrap justify-center gap-2 pt-2">
          <span className="sr-only">{ui("popularSearches")}</span>
          {POPULAR_SEARCHES.slice(0, 4).map((term) => (
            <button key={term.en} type="button" onClick={() => browse.setSearch(t(term))} className="c-chip">
              <Search aria-hidden="true" className="size-3.5 text-fg-3" />
              {t(term)}
            </button>
          ))}
        </div>
      </EmptyState>
    );
  }

  const skeletonCount = Math.min(Math.max(shownItems.length, 6), 9);
  const onMore = () => {
    setPending({ state: browse.state, count: shownItems.length });
    browse.loadMore();
  };

  return (
    <div aria-busy={loading || undefined}>
      <h2 className="sr-only">{ui("results")}</h2>
      {refreshing ? (
        view === "list" ? (
          <div className="grid gap-3">
            <SkeletonRows count={4} />
          </div>
        ) : (
          <div className={GRID}>
            {Array.from({ length: skeletonCount }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )
      ) : view === "list" ? (
        <ul className="grid gap-3">
          {shownItems.map((product) => (
            <li key={product.slug}>
              <LotRow product={product} />
            </li>
          ))}
          {loadingMore ? (
            <li className="grid gap-3">
              <SkeletonRows count={3} />
            </li>
          ) : null}
        </ul>
      ) : (
        <ul className={GRID}>
          {shownItems.map((product, index) => (
            <li key={product.slug} className="flex">
              <LotCard product={product} priority={index < 3} className="w-full" />
            </li>
          ))}
          {loadingMore
            ? Array.from({ length: 3 }, (_, i) => (
                <li key={`sk-${i}`}>
                  <CardSkeleton />
                </li>
              ))
            : null}
        </ul>
      )}
      <LoadMore shown={shownItems.length} total={total} hasMore={hasMore} loading={loadingMore} onMore={onMore} />
    </div>
  );
}
