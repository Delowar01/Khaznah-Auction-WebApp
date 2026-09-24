"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { CountdownBlocks } from "../ui/Countdown";
import { BidForm } from "./BidForm";
import { BidStateBanner } from "./BidStateBanner";
import { ClosesAt } from "./ClosesAt";
import { BidAssurances, BuyNowBox, MarketMeter, MaxBid } from "./BidExtras";
import { COPY } from "../copy";

/** Open auction: current bid, clock, bidder state, bidding and assurances. */
export function LiveBidBox({ product, a, onRequestConfirm, onBuyNow, formRef }) {
  const { t, ui, pl } = useLang();
  return (
    <div className="space-y-6">
      <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="a-eyebrow">{ui("currentBid")}</p>
            <p key={a.flash} className={`a-serif -mx-1.5 mt-2 inline-block rounded-sm px-1.5 text-[50px] leading-none text-fg sm:text-[56px] ${a.flash ? "kz-flash" : ""}`}>
              <Money value={a.currentBid} symbolClassName="text-[0.74em]" />
            </p>
          </div>
          <ul className="shrink-0 text-end text-[13px] leading-6 text-fg-2">
            <li className="font-semibold text-fg">{pl("bids", a.bidCount)}</li>
            <li>{pl("bidders", a.bidderCount)}</li>
            <li>{pl("watching", a.watchers)}</li>
          </ul>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="a-eyebrow">{ui("closesIn")}</p>
            <ClosesAt seconds={a.remaining} label={COPY.closesOn} className="text-[12px] text-fg-3" />
          </div>
          <CountdownBlocks seconds={a.remaining} className="mt-3" />
          {a.extended ? <p className="a-accent-text mt-3 text-[12px] font-semibold">{t(COPY.timeExtendedNote)}</p> : null}
        </div>

        <div className="mt-5">
          <BidStateBanner state={a.bidderState} />
        </div>

        <div ref={formRef} className="mt-5">
          <BidForm a={a} onRequestConfirm={onRequestConfirm} />
        </div>

        <div className="mt-5">
          <MaxBid a={a} />
        </div>
      </div>

      {product.saleType === "both" && a.buyNowAvailable ? <BuyNowBox product={product} onBuy={onBuyNow} /> : null}
      <MarketMeter product={product} currentBid={a.currentBid} />
      <BidAssurances a={a} />
    </div>
  );
}
