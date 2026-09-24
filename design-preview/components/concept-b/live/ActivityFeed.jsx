"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DEMO_USER } from "@/data/site";
import { formatAgo } from "@/lib/format";
import { feedAge } from "@/lib/useLiveEvent";
import { cx } from "../ui/cx";

/** Chat-style bid feed; your own bids are highlighted. */
export function ActivityFeed({ live, className = "" }) {
  const { t, ui, money, lang } = useLang();
  return (
    <section aria-labelledby="kb-activity" className={cx("overflow-hidden rounded-xl border border-line bg-surface", className)}>
      <h2 id="kb-activity" className="flex items-center gap-2 border-b border-line px-4 py-3 kb-md font-bold text-fg">
        <span aria-hidden="true" className="kz-live-dot" />
        {ui("activity")}
      </h2>
      <div role="region" aria-label={ui("activity")} tabIndex={0} className="max-h-[340px] overflow-y-auto overscroll-contain outline-offset-[-2px]">
        <ol className="p-2">
          <AnimatePresence initial={false}>
            {live.feed.map((row) => {
              const who = row.own ? ui("you") : `${ui("bidder")} ${row.who}`;
              return (
                <motion.li
                  key={row.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cx("flex items-center gap-3 rounded-lg px-2 py-2", row.own && "bg-primary/10")}
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      "grid size-8 shrink-0 place-items-center rounded-full kb-2xs font-extrabold",
                      row.own ? "bg-primary text-on-primary" : "bg-surface-2 text-fg-2",
                    )}
                  >
                    {row.own ? t(DEMO_USER.initials) : row.who.slice(0, 3)}
                  </span>
                  <p className="min-w-0 flex-1 kb-sm text-fg">
                    <span className={cx("font-semibold", row.own && "text-primary")}>{ui("bidFrom", { who, amount: money(row.amount) })}</span>
                  </p>
                  <span className="shrink-0 kb-2xs text-fg-3">{formatAgo(feedAge(row), lang)}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      </div>
    </section>
  );
}
