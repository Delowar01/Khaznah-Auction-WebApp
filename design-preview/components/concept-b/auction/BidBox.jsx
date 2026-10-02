"use client";

import { useId } from "react";
import { Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { Button } from "../ui/Button";
import { cx } from "../ui/cx";
import { ClockHeader } from "./AuctionClock";
import { BidderBanner } from "./BidderBanner";
import { BidNotes, BuyNowOption, ClosedActions, MarketCompare, PriceBlock, UpcomingActions } from "./BidBoxParts";
import { BidForm } from "./BidForm";
import { MaxBidPanel } from "./MaxBidPanel";

/**
 * The bid panel: a navy clock head, then price and figures, market price,
 * the bidder's status and the bidding itself; Buy Now (dual lots) sits
 * apart at the foot. `compact` is the phone summary above the fold: the
 * form, maximum bid and notes move into the bid sheet, opened from here.
 */
export function BidBox({ detail, compact = false, className = "" }) {
  const { t, ui } = useLang();
  const headingId = useId();
  const { product, auction, upcoming, closed, dual } = detail;

  let action;
  if (upcoming) action = <UpcomingActions product={product} />;
  else if (closed) action = <ClosedActions detail={detail} />;
  else if (compact) {
    action = (
      <Button size="lg" block icon={Gavel} onClick={detail.sheet.show} data-testid="open-bid-sheet">
        {ui("placeBid")}
      </Button>
    );
  } else action = <BidForm auction={auction} onRequest={detail.requestBid} testId="place-bid" />;

  return (
    <section aria-labelledby={headingId} className={cx("overflow-hidden rounded-xl border border-line bg-surface shadow-card", className)}>
      <h2 id={headingId} className="sr-only">
        {t(C.bidPanel)}
      </h2>
      <ClockHeader detail={detail} />
      <div className={cx("grid p-4 sm:p-5", compact ? "gap-3" : "gap-4")}>
        <PriceBlock detail={detail} compact={compact} />
        <MarketCompare product={product} bid={auction.currentBid} />
        <BidderBanner detail={detail} />
        {action}
        {detail.open && !compact ? <MaxBidPanel auction={auction} /> : null}
        {!closed && !compact ? <BidNotes auction={auction} /> : null}
        {dual ? <BuyNowOption detail={detail} /> : null}
      </div>
    </section>
  );
}
