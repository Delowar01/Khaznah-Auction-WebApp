"use client";

import { forwardRef } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useElapsed } from "@/lib/clock";
import { StepChart } from "../ui/StepChart";
import { usePriceTooltip } from "../ui/PriceTooltip";
import { bidVelocity, pricePoints, timeFraction } from "../lib/data";
import { useCopy } from "../lib/useCopy";
import { TerminalClock } from "./TerminalClock";
import { PriceBlock } from "./PriceBlock";
import { BidderBanner } from "./BidderBanner";
import { BidLadder } from "./BidLadder";
import { MaxBidControl } from "./MaxBidControl";
import { BuyNowOption } from "./BuyNowOption";
import { DepositRow, MarketMeter } from "./TerminalBits";

/** The live bid terminal: clock, price, chart, position, ladder, proxy, deposit. */
export const BidTerminal = forwardRef(function BidTerminal({ product, auction, onReview, onPurchase }, ctaRef) {
  const { money } = useLang();
  const c = useCopy();
  const elapsed = useElapsed();
  const tooltip = usePriceTooltip();
  const points = pricePoints(auction.history, auction.currentBid, product.startingBid);
  const velocity = bidVelocity(auction.history, elapsed);
  const fraction = timeFraction(product, { phase: auction.phase, remaining: auction.remaining });

  return (
    <section aria-labelledby="terminal-title" className="d-panel relative overflow-hidden shadow-raised">
      <div aria-hidden="true" className="d-glow pointer-events-none absolute -end-24 -top-28 size-72" />
      <h2 id="terminal-title" className="sr-only">
        {c("console")}
      </h2>
      <div className="relative space-y-5 p-4 sm:p-5">
        <TerminalClock phase={auction.phase} seconds={auction.remaining} fraction={fraction} elapsed={elapsed} />
        <div className="d-hairline" />
        <PriceBlock product={product} auction={auction} velocity={velocity} />
        <BidderBanner state={auction.bidderState} />
        <div ref={ctaRef}>
          <BidLadder auction={auction} onReview={onReview} />
        </div>
        <div>
          <p className="d-label mb-2 text-fg-3">{c("priceHistory")}</p>
          <StepChart
            points={points}
            height={88}
            tooltip={tooltip}
            label={points.length > 1 ? c("priceChartLabel", { from: money(points[0].amount), to: money(auction.currentBid), n: points.length }) : c("priceChartEmpty")}
          />
        </div>
        <MaxBidControl auction={auction} />
        {auction.buyNowAvailable ? <BuyNowOption product={product} onPurchase={onPurchase} /> : null}
        {product.marketPrice ? <MarketMeter product={product} currentBid={auction.currentBid} /> : null}
        <div className="border-t border-line pt-4">
          <DepositRow deposit={auction.deposit} extended={auction.extended} />
        </div>
      </div>
    </section>
  );
});
