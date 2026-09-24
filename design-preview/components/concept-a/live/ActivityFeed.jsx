"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { useElapsed } from "@/lib/clock";
import { feedAge } from "@/lib/useLiveEvent";
import { formatAgo } from "@/lib/format";
import { COPY } from "../copy";

/** Live bid feed; your own bids are highlighted. */
export function ActivityFeed({ feed, limit = 9 }) {
  const { t, ui, lang } = useLang();
  useElapsed(); // re-render every second so relative times stay fresh
  const rows = feed.slice(0, limit);
  if (!rows.length) return <p className="py-6 text-sm text-fg-3">{t(COPY.noActivity)}</p>;
  return (
    <ul className="divide-y divide-line border-y border-line" aria-live="polite" aria-relevant="additions">
      <AnimatePresence initial={false}>
        {rows.map((row, i) => (
          <motion.li
            key={row.id}
            layout="position"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center justify-between gap-4 px-2 py-3 text-[14px] rtl:text-[15px] ${row.own ? "bg-accent/10" : ""}`}
          >
            <span className="min-w-0 truncate text-fg">
              <span className={row.own ? "font-semibold" : ""}>{row.own ? ui("you") : `${ui("bidder")} ${row.who}`}</span>
              {i === 0 ? <span className="ms-2 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-on-secondary">{ui("highest")}</span> : null}
            </span>
            <span className="flex shrink-0 items-baseline gap-3">
              <Money value={row.amount} className="font-semibold text-fg" />
              <span className="w-16 text-end text-[12px] text-fg-3">{formatAgo(feedAge(row), lang)}</span>
            </span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
