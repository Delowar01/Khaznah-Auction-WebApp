"use client";

import Link from "next/link";
import { Gavel } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { detailPath, endingSoon, hotAuctions, sampleBidHistory } from "@/lib/catalog";
import { COPY } from "../copy";

/** One copy of the scrolling row (the track holds two for a seamless loop). */
function TickerRow({ events, ariaHidden }) {
  return (
    <ul aria-hidden={ariaHidden || undefined} className="flex shrink-0 items-center">
      {events.map((event) => (
        <li key={`${ariaHidden ? "b" : "a"}-${event.slug}`} className="shrink-0">
          <Link
            href={event.href}
            className="mx-1 inline-flex items-center gap-2 rounded-md px-2.5 py-1 kb-xs text-fg-2 transition-colors hover:bg-surface-2"
          >
            <Gavel aria-hidden="true" className="size-3.5 shrink-0 text-accent" strokeWidth={2.25} />
            <span className="font-semibold text-fg">{event.who}</span>
            <Money value={event.amount} className="font-bold text-fg" symbolClassName="text-[0.85em]" />
            <span className="max-w-[16ch] truncate text-fg-3">· {event.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * A slow, muted recent-bids ticker built entirely from the shared sample
 * catalogue (latest deterministic bid per open lot). Pure auction-floor
 * texture — it pauses on hover and stops entirely under reduced motion.
 */
export function BidTicker({ className = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();

  const seen = new Set();
  const lots = [...hotAuctions(8), ...endingSoon(8)]
    .filter((p) => {
      if (!p.bidCount || seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .slice(0, 9);

  if (lots.length < 3) return null;

  const events = lots.map((p) => {
    const row = sampleBidHistory(p, 1)[0];
    return { slug: p.slug, href: link(detailPath(p)), title: t(p.title), who: row ? t(row.label) : ui("bidder"), amount: p.currentBid };
  });

  return (
    <div className={`flex items-stretch overflow-hidden rounded-lg border border-line bg-surface ${className}`}>
      <p className="flex shrink-0 items-center gap-1.5 border-e border-line bg-surface-2 px-3 kb-2xs font-bold uppercase tracking-[0.08em] text-fg-2">
        <span aria-hidden="true" className="kz-live-dot" />
        <span className="whitespace-nowrap">{t(COPY.recentBids)}</span>
      </p>
      <div className="kb-ticker min-w-0 flex-1 self-center py-1">
        <div className="kb-ticker-track">
          <TickerRow events={events} />
          <TickerRow events={events} ariaHidden />
        </div>
      </div>
    </div>
  );
}
