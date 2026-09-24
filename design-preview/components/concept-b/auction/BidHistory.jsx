"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Money } from "@/components/shared/ui/Money";
import { useElapsed } from "@/lib/clock";
import { formatAgo } from "@/lib/format";
import { bidAge } from "@/lib/useAuction";
import { Badge } from "../ui/Badge";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

const PER_PAGE = 5;
const PAGER = "grid size-8 place-items-center rounded-md border border-line text-fg-2 transition-colors hover:bg-surface-2 disabled:opacity-35";

/** Bid history, five rows a page; own bids highlighted, proxy bids tagged. */
export function BidHistory({ auction, className = "" }) {
  const { t, ui, pl, lang } = useLang();
  const elapsed = useElapsed();
  const [page, setPage] = useState(1);
  const rows = auction.history;
  const pageCount = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const visible = rows.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const from = rows.length ? (current - 1) * PER_PAGE + 1 : 0;
  const to = Math.min(rows.length, current * PER_PAGE);

  return (
    <section aria-labelledby="kb-bid-history" className={cx("rounded-xl border border-line bg-surface", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 id="kb-bid-history" className="flex items-center gap-2 kb-md font-bold text-fg">
          <History aria-hidden="true" className="size-4 text-primary" />
          {ui("bidHistory")}
        </h2>
        <span className="kb-xs text-fg-3">{pl("bids", auction.bidCount)}</span>
      </div>
      {rows.length ? (
        <>
          <table className="w-full border-collapse">
            <thead className="bg-surface-2/60 kb-2xs text-fg-3">
              <tr>
                <th scope="col" className="px-4 py-2 text-start font-bold">
                  {ui("bidder")}
                </th>
                <th scope="col" className="px-2 py-2 text-end font-bold">
                  {t(COPY.amount)}
                </th>
                <th scope="col" className="px-4 py-2 text-end font-bold">
                  {t(COPY.time)}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((row) => (
                <tr key={row.id} className={cx(row.isOwn && "bg-primary/5")}>
                  <td className="px-4 py-2.5">
                    <span className="flex flex-wrap items-center gap-1.5 kb-sm">
                      <span className={cx("font-semibold", row.isOwn ? "text-primary" : "text-fg")}>{row.isOwn ? ui("you") : t(row.label)}</span>
                      {row.type === "proxy_auto" ? <Badge tone="neutral">{ui("autoBid")}</Badge> : null}
                      {row.isWinning ? <Badge tone="success">{ui("highest")}</Badge> : null}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-end">
                    <Money value={row.amount} className={cx("kb-sm", row.isWinning ? "font-extrabold text-fg" : "font-semibold text-fg-2")} />
                  </td>
                  <td className="px-4 py-2.5 text-end kb-xs text-fg-3">{formatAgo(bidAge(row, elapsed), lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pageCount > 1 ? (
            <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-2.5">
              <span className="kb-xs text-fg-3">{t(COPY.showingRange, { from, to, total: rows.length })}</span>
              <span className="flex gap-1.5">
                <button type="button" className={PAGER} disabled={current <= 1} onClick={() => setPage(current - 1)} aria-label={ui("previous")}>
                  <DirIcon icon={ChevronLeft} className="size-4" />
                </button>
                <button type="button" className={PAGER} disabled={current >= pageCount} onClick={() => setPage(current + 1)} aria-label={ui("next")}>
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
