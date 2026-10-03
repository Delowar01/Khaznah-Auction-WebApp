"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { useFeedRows } from "@/components/shared/live/hooks";
import { Money } from "@/components/shared/ui/Money";
import { cx } from "../ui/cx";

/**
 * The activity log for the lot on the block: newest first, your own bids
 * marked "You" on an indigo row. The list scrolls inside its frame and can
 * be reached and scrolled with the keyboard.
 */
export function ActivityFeed({ room }) {
  const { t, ui, pl } = useLang();
  const rows = useFeedRows(room.live);
  const count = room.lot && !room.hammer ? room.lot.bidCount : 0;
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 id="kb-activity" className="flex items-center gap-2 kb-md font-bold text-fg">
          <span aria-hidden="true" className="size-2 rounded-full bg-live" />
          {ui("activity")}
        </h2>
        {count ? <span className="kb-xs text-fg-3">{pl("bids", count)}</span> : null}
      </div>
      <div role="region" aria-labelledby="kb-activity" tabIndex={0} className="max-h-[320px] min-h-[120px] overflow-y-auto overscroll-contain outline-offset-[-2px]">
        {rows.length ? (
          <ol className="p-1.5">
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.li
                  key={row.id}
                  layout="position"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cx("relative grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg px-2 py-1.5", row.own && "bg-primary/10")}
                >
                  <span className="sr-only">
                    {row.spoken}, {row.ago}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cx("grid size-7 place-items-center rounded-full kb-2xs font-extrabold", row.own ? "bg-primary text-on-primary" : "bg-surface-2 text-fg-2")}
                  >
                    {row.initials}
                  </span>
                  <span aria-hidden="true" className={cx("min-w-0 truncate kb-sm font-semibold", row.own ? "text-primary" : "text-fg")}>
                    {row.who}
                  </span>
                  <span aria-hidden="true" className="flex shrink-0 items-baseline gap-2">
                    <Money value={row.amount} className="kb-sm font-bold text-fg" />
                    <span className="w-14 text-end kb-2xs text-fg-3">{row.ago}</span>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        ) : (
          <p className="px-4 py-6 text-center kb-sm text-fg-2">{t(C.noActivity)}</p>
        )}
      </div>
    </div>
  );
}
