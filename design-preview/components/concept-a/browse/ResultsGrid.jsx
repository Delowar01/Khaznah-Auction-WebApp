"use client";

import { SearchX, TrendingUp } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { CardSkeleton, RowSkeleton } from "../cards/CardSkeleton";
import { LotCard } from "../cards/LotCard";
import { LotRow } from "../cards/LotRow";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

export const GRID_COLS = "grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4";

/** Grid or list of lots with loading skeletons and a helpful empty state. */
export function ResultsGrid({ browse, items, view = "grid", skeletons = 8, gridClassName = GRID_COLS, suggestions = true }) {
  const { t, ui } = useLang();

  if (browse.loading) {
    return view === "list" ? (
      <div aria-hidden="true" className="grid gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    ) : (
      <div aria-hidden="true" className={gridClassName}>
        {Array.from({ length: skeletons }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!browse.total) {
    return (
      <div className="rounded-xl border border-dashed border-line-strong bg-surface">
        <EmptyState icon={SearchX} title={ui("emptyTitle")} text={ui("emptyText")}>
          <Button variant="primary" onClick={browse.clearAll}>
            {ui("clearFilters")}
          </Button>
        </EmptyState>
        {suggestions ? (
          <div className="border-t border-line px-6 pb-8 pt-5 text-center">
            <p className="mb-3 kb-eyebrow text-fg-3">{t(COPY.tryThese)}</p>
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
        ) : null}
      </div>
    );
  }

  return view === "list" ? (
    <ul className="grid gap-3">
      {items.map((product) => (
        <li key={product.slug}>
          <LotRow product={product} />
        </li>
      ))}
    </ul>
  ) : (
    <ul className={cx(gridClassName)}>
      {items.map((product, i) => (
        <li key={product.slug}>
          <LotCard product={product} priority={i < 4} sizes="(min-width: 1280px) 19vw, (min-width: 1024px) 24vw, 46vw" />
        </li>
      ))}
    </ul>
  );
}
