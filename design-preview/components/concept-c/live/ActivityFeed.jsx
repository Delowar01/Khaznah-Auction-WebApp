"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { formatAgo } from "@/lib/format";
import { feedAge } from "@/lib/useLiveEvent";
import { COPY } from "../copy";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";

/** Running list of bids in the room; your own bids are tinted. */
export function ActivityFeed({ live }) {
  const { t, ui, lang } = useLang();
  const { feed } = live;
  return (
    <section aria-labelledby="feed-title" className="overflow-hidden rounded-md border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 id="feed-title" className="font-semibold text-fg">
          {ui("activity")}
        </h2>
        <span className="flex items-center gap-2 text-xs font-medium text-success">
          <span className="kz-live-dot bg-success!" />
          {ui("connected")}
        </span>
      </div>
      <ol tabIndex={0} aria-labelledby="feed-title" className="max-h-[16rem] divide-y divide-line overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus">
        {feed.length ? (
          feed.map((row) => (
            <li key={row.id} className={cx("kz-fade-up grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-5 py-2.5 text-sm", row.own && "bg-primary/6")}>
              <span className="flex min-w-0 items-center gap-2.5">
                <Diamond size={5} className={row.own ? "text-primary" : "text-line-strong"} />
                <span className={cx("truncate", row.own ? "font-semibold text-primary" : "text-fg")}>{row.own ? ui("you") : `${ui("bidder")} ${row.who}`}</span>
              </span>
              <Money value={row.amount} className="c-num font-semibold text-fg" />
              <span className="w-16 text-end text-xs text-fg-3">{formatAgo(feedAge(row), lang)}</span>
            </li>
          ))
        ) : (
          <li className="px-5 py-8 text-center text-sm text-fg-3">{t(COPY.feedEmpty)}</li>
        )}
      </ol>
    </section>
  );
}
