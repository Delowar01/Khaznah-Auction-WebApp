"use client";

import { useId } from "react";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useBidRow, useHistoryPages } from "@/components/shared/auction/hooks";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Money } from "@/components/shared/ui/Money";
import { Badge } from "../ui/Badge";
import { cx } from "../ui/cx";

const PAGER = "grid size-9 place-items-center rounded-md border border-line text-fg-2 transition-colors hover:bg-surface-2 disabled:opacity-35";

function Tags({ row, info }) {
  const { ui } = useLang();
  return (
    <>
      {info.auto ? <Badge tone="neutral">{ui("autoBid")}</Badge> : null}
      {row.isWinning ? <Badge tone="success">{ui("highest")}</Badge> : null}
    </>
  );
}

/**
 * Bid history, five rows a page. A compact table from 640 px; phones get a
 * stacked list (bidder and tags, then amount and time) so nothing scrolls
 * sideways. Your bids are tinted, proxy bids tagged "Auto-bid".
 */
export function BidHistory({ auction, className = "" }) {
  const { t, ui, pl } = useLang();
  const headingId = useId();
  const pages = useHistoryPages(auction.history);
  const describe = useBidRow();

  return (
    <section aria-labelledby={headingId} className={cx("rounded-xl border border-line bg-surface", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 id={headingId} className="flex items-center gap-2 kb-md font-bold text-fg">
          <History aria-hidden="true" className="size-4 text-primary" />
          {ui("bidHistory")}
        </h2>
        <span className="kb-xs text-fg-3">{pl("bids", auction.bidCount)}</span>
      </div>
      {pages.total ? (
        <>
          <table className="hidden w-full border-collapse sm:table">
            <thead className="bg-surface-2/60 kb-2xs text-fg-3">
              <tr>
                <th scope="col" className="px-4 py-2 text-start font-bold">
                  {ui("bidder")}
                </th>
                <th scope="col" className="px-2 py-2 text-end font-bold">
                  {t(C.amount)}
                </th>
                <th scope="col" className="px-4 py-2 text-end font-bold">
                  {t(C.time)}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pages.rows.map((row) => {
                const info = describe(row);
                return (
                  <tr key={row.id} className={cx(row.isOwn && "bg-primary/5")}>
                    <td className="px-4 py-2.5">
                      <span className="flex flex-wrap items-center gap-1.5 kb-sm">
                        <span className={cx("font-semibold", row.isOwn ? "text-primary" : "text-fg")}>{info.name}</span>
                        <Tags row={row} info={info} />
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-end">
                      <Money value={row.amount} className={cx("kb-sm", row.isWinning ? "font-extrabold text-fg" : "font-semibold text-fg-2")} />
                    </td>
                    <td className="px-4 py-2.5 text-end kb-xs text-fg-3">{info.ago}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <ul className="divide-y divide-line sm:hidden">
            {pages.rows.map((row) => {
              const info = describe(row);
              return (
                <li key={row.id} className={cx("flex items-center justify-between gap-3 px-4 py-2.5", row.isOwn && "bg-primary/5")}>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-1.5 kb-sm">
                      <span className={cx("font-semibold", row.isOwn ? "text-primary" : "text-fg")}>{info.name}</span>
                      <Tags row={row} info={info} />
                    </span>
                    <span className="block kb-xs text-fg-3">{info.ago}</span>
                  </span>
                  <Money value={row.amount} className={cx("shrink-0 kb-sm", row.isWinning ? "font-extrabold text-fg" : "font-semibold text-fg-2")} />
                </li>
              );
            })}
          </ul>
          {pages.pageCount > 1 ? (
            <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-2.5">
              <span className="kb-xs text-fg-3">{pages.range}</span>
              <span className="flex gap-1.5">
                <button type="button" className={PAGER} disabled={!pages.hasPrev} onClick={pages.prev} aria-label={ui("previous")}>
                  <DirIcon icon={ChevronLeft} className="size-4" />
                </button>
                <button type="button" className={PAGER} disabled={!pages.hasNext} onClick={pages.next} aria-label={ui("next")}>
                  <DirIcon icon={ChevronRight} className="size-4" />
                </button>
              </span>
            </div>
          ) : null}
        </>
      ) : (
        <p className="px-4 py-8 text-center kb-sm text-fg-3">{ui("noBidsYet")}</p>
      )}
    </section>
  );
}
