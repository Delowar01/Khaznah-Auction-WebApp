"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { CountdownBlocks } from "../ui/Time";
import { cx } from "../ui/cx";
import { BidForm } from "./BidForm";
import { BidderBanner, BidPolicyNotes, MarketCompare } from "./BidNotices";
import { MaxBidPanel } from "./MaxBidPanel";
import { StatusLine } from "./StatusLine";

/** The live bid panel: status, four-block countdown, current bid, bidder state, form, proxy bid, policy. */
export function BidPanel({ product, auction, onRequestBid }) {
  const { ui, pl } = useLang();
  const urgency = auction.phase === "critical" ? "critical" : auction.phase === "urgent" ? "urgent" : "normal";

  return (
    <section aria-labelledby="bid-title" className={cx("overflow-hidden rounded-md border bg-surface transition-colors duration-500", urgency === "critical" ? "border-live/45" : "border-line")}>
      <div className="p-5 sm:p-6">
        <h2 id="bid-title" className="sr-only">
          {ui("placeBid")}
        </h2>
        <StatusLine phase={auction.phase} watchers={auction.watchers} />
        <p className="c-label mt-5">{ui("endsIn")}</p>
        <CountdownBlocks seconds={auction.remaining} urgency={urgency} label={ui("endsIn")} className="mt-2" />

        <div className="mt-6">
          <p className="c-label">{ui("currentBid")}</p>
          <div key={auction.flash} className={cx("mt-1 inline-block px-1 -mx-1", auction.flash ? "c-flash" : "")}>
            <Money value={auction.currentBid} className="c-num text-[2.75rem] font-semibold leading-none text-fg sm:text-[3rem]" />
          </div>
          <p className="mt-2 flex flex-wrap gap-x-2 text-sm text-fg-2">
            <span>{pl("bids", auction.bidCount)}</span>
            <span aria-hidden="true">·</span>
            <span>{pl("bidders", auction.bidderCount)}</span>
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <BidderBanner auction={auction} />
          <MarketCompare product={product} currentBid={auction.currentBid} />
        </div>
      </div>

      <div className="space-y-4 border-t border-line p-5 sm:p-6">
        <BidForm auction={auction} onRequestBid={onRequestBid} testId="place-bid" />
        <MaxBidPanel auction={auction} />
      </div>

      <div className="border-t border-line bg-surface-2/60 p-5 sm:p-6">
        <BidPolicyNotes auction={auction} />
      </div>
    </section>
  );
}
