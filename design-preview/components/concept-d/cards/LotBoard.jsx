"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Skeleton } from "@/components/shared/ui/Skeleton";
import { useCopy } from "../lib/useCopy";
import { BoardRow } from "./BoardRow";
import { BoardItem } from "./BoardItem";

const TH = "px-3 pb-3 pt-3.5 text-[11px] font-medium text-fg-3";

/**
 * Board view: a live data table on tablet/desktop, stacked rows on phones.
 * `showType` adds a status column for mixed (auction + Buy Now) lists.
 */
export function LotBoard({ products, caption, showType = false, loading = false }) {
  const { ui } = useLang();
  const c = useCopy();
  if (loading) return <BoardSkeleton rows={Math.min(products.length || 6, 8)} />;
  return (
    <>
      <div className="d-panel relative hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-start">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="d-label text-start">
              <th scope="col" className={`${TH} w-24 text-start`}>
                {ui("lotNumber")}
              </th>
              <th scope="col" className={`${TH} text-start`}>
                {c("colItem")}
              </th>
              {showType ? (
                <th scope="col" className={`${TH} text-start`}>
                  {c("colStatus")}
                </th>
              ) : null}
              <th scope="col" className={`${TH} text-end`}>
                {showType ? c("colPrice") : ui("currentBid")}
              </th>
              <th scope="col" className={`${TH} text-end`}>
                {c("colBids")}
              </th>
              <th scope="col" className={`${TH} hidden text-end xl:table-cell`}>
                {c("colWatching")}
              </th>
              <th scope="col" className={`${TH} text-end`}>
                {showType ? `${ui("timeLeft")} / ${c("colStock")}` : ui("timeLeft")}
              </th>
              <th scope="col" className={TH}>
                <span className="sr-only">{c("view")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <BoardRow key={product.slug} product={product} showType={showType} />
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-2 md:hidden" aria-label={caption}>
        {products.map((product) => (
          <BoardItem key={product.slug} product={product} />
        ))}
      </ul>
    </>
  );
}

export function BoardSkeleton({ rows = 6 }) {
  return (
    <div aria-hidden="true" className="d-panel space-y-0 overflow-hidden">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-t border-line px-4 py-3 first:border-t-0">
          <Skeleton className="h-3 w-14 rounded" />
          <Skeleton className="size-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/5 rounded" />
            <Skeleton className="h-3 w-1/4 rounded" />
          </div>
          <Skeleton className="hidden h-4 w-20 rounded sm:block" />
          <Skeleton className="hidden h-2 w-32 rounded md:block" />
        </div>
      ))}
    </div>
  );
}
