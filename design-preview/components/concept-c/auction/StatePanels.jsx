"use client";

import { Bell, BellRing } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { COPY } from "../copy";
import { Button } from "../ui/Button";
import { CountdownBlocks } from "../ui/Time";
import { Diamond } from "../ui/Diamond";
import { StatusLine } from "./StatusLine";
import { BidderBanner } from "./BidNotices";

/** Scheduled lot: "starts in" clock, opening bid and Remind me. */
export function UpcomingPanel({ product, auction }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const reminded = isWatched(product.slug);
  const remind = () => {
    const now = toggleWatch(product.slug);
    toast({ tone: now ? "success" : "neutral", title: ui("remindMe"), description: t(now ? COPY.remindSet : COPY.remindOff) });
  };
  return (
    <section aria-labelledby="bid-title" className="rounded-md border border-line bg-surface p-5 sm:p-6">
      <h2 id="bid-title" className="sr-only">
        {ui("startsIn")}
      </h2>
      <StatusLine phase="upcoming" watchers={auction.watchers} />
      <p className="c-label mt-5">{ui("startsIn")}</p>
      <CountdownBlocks seconds={auction.startsIn} label={ui("startsIn")} className="mt-2" />
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="c-label">{ui("startingBid")}</p>
          <Money value={product.startingBid} className="c-num mt-1 text-[2.5rem] font-semibold leading-none text-fg" />
        </div>
        <p className="text-sm font-medium text-primary">{ui("opensTomorrow")}</p>
      </div>
      <Button size="lg" block icon={reminded ? BellRing : Bell} variant={reminded ? "outline" : "primary"} aria-pressed={reminded} onClick={remind} className="mt-6">
        {reminded ? t(COPY.remindSet) : ui("remindMe")}
      </Button>
    </section>
  );
}

/** Sold or ended lot: the result, stated plainly. */
export function ResultPanel({ auction }) {
  const { t, ui, pl } = useLang();
  const sold = auction.phase === "sold";
  return (
    <section aria-labelledby="bid-title" className="overflow-hidden rounded-md border border-line bg-surface">
      <div className={sold ? "bg-secondary p-5 text-on-secondary sm:p-6" : "bg-surface-2 p-5 sm:p-6"}>
        <h2 id="bid-title" className="flex items-center gap-2.5 text-sm font-semibold">
          <Diamond size={8} className={sold ? "text-accent" : "text-fg-3"} />
          {ui(sold ? "sold" : "auctionEnded")}
        </h2>
        <p className="mt-4 text-sm opacity-80">{ui(sold ? "soldFor" : "winningBid")}</p>
        <Money value={auction.currentBid} className="c-num mt-1 text-[2.75rem] font-semibold leading-none" />
        <p className="mt-2 text-sm opacity-80">
          {pl("bids", auction.bidCount)} · {pl("bidders", auction.bidderCount)}
        </p>
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        <BidderBanner auction={auction} />
        {auction.bidderState === "won" || auction.bidderState === "lost" ? null : <p className="text-sm text-fg-2">{t(sold ? COPY.soldText : COPY.endedText)}</p>}
        <a href="#similar" className="c-btn c-btn--outline c-btn--block">
          {ui("similarAuctions")}
        </a>
      </div>
    </section>
  );
}
