"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { LotCard, CardSkeleton } from "../cards/LotCard";
import { LotBoard } from "../cards/LotBoard";
import { EmptyState } from "../ui/EmptyState";
import { Button } from "../ui/Button";
import { useCopy } from "../lib/useCopy";

/** Grid or board of results, with skeleton, empty and load-more states. */
export function Results({ browse, view, dense = false, caption }) {
  const { t, ui } = useLang();
  const c = useCopy();
  const { total, shownItems, hasMore } = browse;
  const [more, setMore] = useState(false);
  if (more && !browse.loading) setMore(false);
  // "Load more" keeps the current results on screen; filter changes show skeletons.
  const appending = more && browse.loading;
  const loading = browse.loading && !appending;
  const cols = dense ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-2 md:grid-cols-3";

  if (!loading && total === 0) {
    return (
      <EmptyState title={ui("emptyTitle")} text={ui("emptyText")}>
        <Button variant="primary" onClick={browse.clearAll}>
          {ui("clearFilters")}
        </Button>
        <div className="mt-4 flex w-full flex-wrap justify-center gap-1.5">
          <span className="sr-only">{c("emptyPopular")}</span>
          {POPULAR_SEARCHES.slice(0, 4).map((term) => (
            <button
              key={term.en}
              type="button"
              onClick={() => browse.setSearch(t(term))}
              className="h-8 rounded-full border border-line-strong bg-surface-2 px-3 text-[13px] text-fg-2 transition-colors hover:text-fg"
            >
              {t(term)}
            </button>
          ))}
        </div>
      </EmptyState>
    );
  }

  return (
    <div aria-busy={loading || undefined}>
      <p className="sr-only" aria-live="polite">
        {loading ? ui("loadingLots") : ui("showingOf", { shown: shownItems.length, total })}
      </p>
      {view === "board" ? (
        <LotBoard products={shownItems} caption={caption} showType loading={loading} />
      ) : loading ? (
        <div className={`grid gap-3 sm:gap-4 lg:gap-5 ${cols}`}>
          {Array.from({ length: Math.min(Math.max(shownItems.length, 6), 12) }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <ul className={`grid gap-3 sm:gap-4 lg:gap-5 ${cols}`}>
          {shownItems.map((product, index) => (
            <li key={product.slug} className="kz-fade-up flex" style={{ animationDelay: `${(index % 12) * 25}ms` }}>
              <LotCard product={product} priority={index < 4} />
            </li>
          ))}
          {appending
            ? Array.from({ length: Math.min(4, total - shownItems.length) }, (_, i) => (
                <li key={`more-${i}`} aria-hidden="true">
                  <CardSkeleton />
                </li>
              ))
            : null}
        </ul>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <p className="d-num text-xs text-fg-3">{ui("showingOf", { shown: shownItems.length, total })}</p>
        <div aria-hidden="true" className="h-1 w-48 overflow-hidden rounded-full bg-[var(--d-track)]">
          <div className="d-bar-fill h-full rounded-full bg-[var(--d-ink)]" style={{ inlineSize: `${total ? (shownItems.length / total) * 100 : 0}%` }} />
        </div>
        {hasMore ? (
          <Button
            variant="secondary"
            size="lg"
            icon={ArrowDown}
            loading={appending}
            onClick={() => {
              setMore(true);
              browse.loadMore();
            }}
            className="mt-1 min-w-52"
          >
            {c("loadMoreCount", { n: Math.min(12, total - shownItems.length) })}
          </Button>
        ) : total > 0 ? (
          <p className="text-sm text-fg-3">{c("allLoaded")}</p>
        ) : null}
      </div>
    </div>
  );
}
