"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { useElapsed } from "@/lib/clock";
import { feedAge } from "@/lib/useLiveEvent";
import { formatAgo } from "@/lib/format";
import { useCopy } from "../lib/useCopy";

/** Live bid feed: new rows slide in; your bids in gold. */
export function ActivityFeed({ feed, limit = 12, className = "" }) {
  const { ui, lang } = useLang();
  const c = useCopy();
  useElapsed(); // re-render each second so ages stay current
  const rows = feed.slice(0, limit);

  if (!rows.length) return <p className={`px-4 py-8 text-center text-sm text-fg-3 ${className}`}>{c("noActivity")}</p>;

  return (
    <ol className={`space-y-1 ${className}`}>
      <AnimatePresence initial={false}>
        {rows.map((row, index) => (
          <motion.li
            key={row.id}
            layout="position"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] ${row.own ? "d-own ring-1 ring-inset ring-accent/30" : index === 0 ? "bg-surface-2" : ""}`}
          >
            <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${row.own ? "bg-accent" : index === 0 ? "bg-[var(--d-ink)]" : "bg-fg-3/40"}`} />
            <span className={`min-w-0 flex-1 truncate ${row.own ? "font-medium text-auction" : "text-fg-2"}`}>
              {row.own ? ui("you") : `${ui("bidder")} ${row.who}`}
            </span>
            <span className="shrink-0 text-[11px] text-fg-3">{formatAgo(feedAge(row), lang)}</span>
            <Money value={row.amount} className={`d-num w-20 shrink-0 justify-end text-end font-medium ${index === 0 ? "text-fg" : "text-fg-2"}`} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}
