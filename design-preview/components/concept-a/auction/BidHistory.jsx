"use client";

import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { useElapsed } from "@/lib/clock";
import { bidAge } from "@/lib/useAuction";
import { formatAgo } from "@/lib/format";
import { COPY } from "../copy";

const VISIBLE = 6;

/** Bid history table: own bids highlighted, proxy bids tagged. */
export function BidHistory({ history }) {
  const { t, ui, lang } = useLang();
  const elapsed = useElapsed();
  const [all, setAll] = useState(false);
  if (!history.length) return <p className="text-sm text-fg-2">{ui("noBidsYet")}</p>;
  const rows = all ? history : history.slice(0, VISIBLE);

  return (
    <div>
      <table className="w-full border-collapse text-[14px] rtl:text-[15px]">
        <caption className="sr-only">{ui("bidHistory")}</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="a-eyebrow py-3 text-start !text-fg-3">{ui("bidder")}</th>
            <th scope="col" className="a-eyebrow py-3 text-end !text-fg-3">{t(COPY.amount)}</th>
            <th scope="col" className="a-eyebrow hidden py-3 text-end !text-fg-3 sm:table-cell">{t(COPY.time)}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-line ${row.isOwn ? "bg-accent/10" : ""}`}>
              <td className="py-3 ps-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={row.isOwn ? "font-semibold text-fg" : "text-fg"}>{t(row.label)}</span>
                  {row.type === "proxy_auto" ? (
                    <span className="rounded-full border border-line-strong px-2 py-0.5 text-[11px] font-semibold text-fg-2">{ui("autoBid")}</span>
                  ) : null}
                  {row.isWinning ? <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-on-secondary">{ui("highest")}</span> : null}
                </div>
                <span className="mt-0.5 block text-[12px] text-fg-3 sm:hidden">{formatAgo(bidAge(row, elapsed), lang)}</span>
              </td>
              <td className="py-3 text-end font-semibold text-fg">
                <Money value={row.amount} />
              </td>
              <td className="hidden py-3 pe-2 text-end text-fg-3 sm:table-cell">{formatAgo(bidAge(row, elapsed), lang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {history.length > VISIBLE ? (
        <button type="button" onClick={() => setAll((v) => !v)} aria-expanded={all} className="mt-4 h-11 text-sm font-semibold text-fg">
          <span className="a-link">{all ? t(COPY.showFewer) : t(COPY.showAllBids, { n: history.length })}</span>
        </button>
      ) : null}
    </div>
  );
}
