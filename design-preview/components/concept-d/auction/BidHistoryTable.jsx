"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bot } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { useElapsed } from "@/lib/clock";
import { bidAge } from "@/lib/useAuction";
import { formatAgo } from "@/lib/format";
import { useCopy } from "../lib/useCopy";

const TH = "d-label px-3 py-2.5 font-medium text-fg-3";

/** Bid history: bidder, amount, time ago, type; own bids in gold, new rows slide in. */
export function BidHistoryTable({ history }) {
  const { t, ui, lang } = useLang();
  const c = useCopy();
  const elapsed = useElapsed();

  if (!history.length) {
    return <p className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-fg-2">{ui("noBidsYet")}</p>;
  }

  return (
    <div role="region" aria-label={ui("bidHistory")} tabIndex={0} className="d-scroll relative overflow-x-auto rounded-xl border border-line outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">
      <table className="w-full text-sm">
        <caption className="sr-only">{ui("bidHistory")}</caption>
        <thead>
          <tr>
            <th scope="col" className={`${TH} text-start`}>
              {ui("bidder")}
            </th>
            <th scope="col" className={`${TH} text-end`}>
              {c("colAmount")}
            </th>
            <th scope="col" className={`${TH} hidden text-end sm:table-cell`}>
              {c("colStatus")}
            </th>
            <th scope="col" className={`${TH} text-end`}>
              {c("colTime")}
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {history.map((row) => (
              <motion.tr
                key={row.id}
                layout="position"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`border-t border-line ${row.isOwn ? "d-own" : ""}`}
              >
                <td className="px-3 py-2.5">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className={`size-1.5 rounded-full ${row.isOwn ? "bg-accent" : row.isWinning ? "bg-[var(--d-ink)]" : "bg-fg-3/40"}`} />
                    <span className={`whitespace-nowrap ${row.isOwn ? "font-medium text-auction" : "text-fg"}`}>{t(row.label)}</span>
                    {row.type === "proxy_auto" ? (
                      <span className="inline-flex h-5 shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-primary/12 px-1.5 text-[11px] d-ink">
                        <Bot aria-hidden="true" className="size-3" />
                        <span className="max-sm:sr-only">{ui("autoBid")}</span>
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-end">
                  <Money value={row.amount} className={`d-num font-medium ${row.isWinning ? "text-fg" : "text-fg-2"}`} />
                </td>
                <td className="hidden px-3 py-2.5 text-end sm:table-cell">
                  {row.isWinning ? <span className="d-label text-success">{ui("highest")}</span> : <span className="text-fg-3">—</span>}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-end text-xs text-fg-3">{formatAgo(bidAge(row, elapsed), lang)}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
