"use client";

import { ArrowDown, Gavel, Share2 } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { PriceLabel } from "../cards/CardParts";
import { Button } from "../ui/Button";
import { WatchButton } from "../ui/WatchButton";
import { cx } from "../ui/cx";
import { useShareLink } from "../utils/navigation";
import { AuctionClock, PhaseBadge } from "./AuctionClock";
import { BidderBanner } from "./BidderBanner";
import { BidNotes, BidStats, BuyNowOption, MarketCompare, UpcomingActions } from "./BidBoxParts";
import { BidForm } from "./BidForm";
import { MaxBidPanel } from "./MaxBidPanel";

/** The sticky bid panel: status, clock, price, bidder state, bid form and options. */
export function BidBox({ product, auction, bought, onRequestBid, onBuyNow, className = "" }) {
  const { ui } = useLang();
  const share = useShareLink();
  const phase = auction.phase;
  const upcoming = phase === "upcoming";
  const closed = phase === "sold" || phase === "ended";
  const label = bought
    ? ui("buyNow")
    : phase === "sold"
      ? ui("soldFor")
      : closed
        ? ui("winningBid")
        : upcoming || !auction.bidCount
          ? ui("startingBid")
          : ui("currentBid");

  return (
    <div className={cx("overflow-hidden rounded-xl border border-line bg-surface shadow-card", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-line bg-surface-2/50 px-5 py-3">
        <PhaseBadge phase={phase} />
        <span className="kb-xs text-fg-3">
          {ui("lotNumber")}{" "}
          <span dir="ltr" className="font-semibold text-fg-2 tabular">
            {product.lot}
          </span>
        </span>
      </div>

      <div className="grid gap-4 p-5">
        <AuctionClock product={product} auction={auction} />

        <div>
          <PriceLabel>{label}</PriceLabel>
          <Money
            key={auction.flash}
            value={bought ? product.buyNowPrice : auction.currentBid}
            className={cx("-mx-1 rounded-md px-1 kb-price-lg text-fg", auction.flash ? "kz-flash" : "")}
            symbolClassName="text-[0.7em]"
          />
        </div>

        {upcoming ? null : <BidStats auction={auction} />}
        <MarketCompare product={product} bid={auction.currentBid} />
        <BidderBanner auction={auction} product={product} bought={bought} />

        {upcoming ? <UpcomingActions product={product} /> : null}
        {closed ? (
          <div className="grid gap-2">
            <Button size="lg" block icon={Gavel} disabled data-testid="place-bid">
              {ui("placeBid")}
            </Button>
            <a
              href="#similar-auctions"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-control kb-sm font-bold text-primary transition-colors hover:bg-primary/10"
            >
              {ui("similarAuctions")}
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
        ) : (
          <BidForm auction={auction} onRequest={onRequestBid} disabled={upcoming} testId="place-bid" />
        )}
        {!closed && !upcoming ? <MaxBidPanel auction={auction} /> : null}
        {!closed ? <BidNotes auction={auction} /> : null}

        {product.saleType === "both" ? <BuyNowOption product={product} auction={auction} bought={bought} onBuyNow={onBuyNow} /> : null}

        <div className={cx("grid gap-2", upcoming ? "grid-cols-1" : "grid-cols-2")}>
          {upcoming ? null : <WatchButton product={product} variant="full" testId="watch-button" />}
          <Button variant="outline" icon={Share2} onClick={() => share()}>
            {ui("share")}
          </Button>
        </div>
      </div>
    </div>
  );
}
