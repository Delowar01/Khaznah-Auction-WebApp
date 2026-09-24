"use client";

import { SearchX } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { LotCard } from "../cards/LotCard";
import { ListRow } from "../cards/ListRow";
import { SkeletonCard } from "../cards/SkeletonCard";
import { Button } from "../ui/Button";

export function EmptyState({ browse, headingAs: Heading = "h2" }) {
  const { t, ui } = useLang();
  return (
    <div className="flex flex-col items-center border-y border-line px-6 py-20 text-center">
      <SearchX aria-hidden="true" className="size-10 text-fg-3" strokeWidth={1.25} />
      <Heading className="a-display mt-6 text-[32px] text-fg">{ui("emptyTitle")}</Heading>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-fg-2">{ui("emptyText")}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {POPULAR_SEARCHES.slice(0, 4).map((s) => (
          <button key={s.en} type="button" onClick={() => browse.setSearch(t(s))} className="h-9 rounded-full border border-line-strong px-4 text-sm text-fg hover:border-fg">
            {t(s)}
          </button>
        ))}
      </div>
      <Button variant="outline" className="mt-8" onClick={browse.clearAll}>
        {ui("clearFilters")}
      </Button>
    </div>
  );
}

export function Results({ browse, view = "grid", columns = "lg:grid-cols-3" }) {
  const { ui } = useLang();
  const { loading, loadingMore, shownItems, total, hasMore } = browse;

  if (!loading && total === 0) return <EmptyState browse={browse} />;

  return (
    <div aria-busy={loading || undefined}>
      <p className="sr-only" aria-live="polite">
        {loading ? ui("loadingLots") : ui("showingOf", { shown: shownItems.length, total })}
      </p>
      {view === "list" ? (
        <div className="border-t border-line">
          {loading
            ? Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="grid grid-cols-[96px_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[140px_1fr]">
                  <SkeletonCard ratio="aspect-square" />
                </div>
              ))
            : shownItems.map((p) => <ListRow key={p.slug} product={p} />)}
        </div>
      ) : (
        <div className={`grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 ${columns}`}>
          {loading ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />) : shownItems.map((p, i) => <LotCard key={p.slug} product={p} priority={i < 3} />)}
          {loadingMore ? Array.from({ length: 3 }, (_, i) => <SkeletonCard key={`more-${i}`} />) : null}
        </div>
      )}
      <div className="mt-16 flex flex-col items-center gap-4">
        <p className="text-[13px] text-fg-2 tabular">{ui("showingOf", { shown: Math.min(shownItems.length, total), total })}</p>
        <div className="h-px w-48 bg-line">
          <div className="a-progress h-px bg-fg" style={{ transform: `scaleX(${total ? Math.min(1, shownItems.length / total) : 0})` }} />
        </div>
        {hasMore ? (
          <Button variant="outline" onClick={browse.loadMore} loading={loadingMore} disabled={loadingMore}>
            {ui("loadMore")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
