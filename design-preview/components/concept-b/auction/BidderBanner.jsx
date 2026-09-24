"use client";

import { CircleAlert, CircleCheck, Info, Trophy } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

const STYLES = {
  highest: { box: "bg-success/10 text-success ring-success/25", icon: CircleCheck },
  outbid: { box: "bg-warning/10 text-warning ring-warning/25", icon: CircleAlert },
  won: { box: "bg-success/10 text-success ring-success/25", icon: Trophy },
  lost: { box: "bg-danger/10 text-danger ring-danger/25", icon: CircleAlert },
  closed: { box: "bg-surface-2 text-fg ring-line", icon: Info },
  bought: { box: "bg-success/10 text-success ring-success/25", icon: Trophy },
};

function useBanner(auction, product, bought) {
  const { t, ui } = useLang();
  const { bidderState, phase } = auction;
  if (bought) return { kind: "bought", title: t(COPY.boughtBanner), label: ui("buyNow"), amount: product.buyNowPrice };
  if (phase === "sold") return { kind: "closed", title: ui("auctionEnded"), label: ui("soldFor"), amount: auction.currentBid };
  if (bidderState === "won") return { kind: "won", title: ui("youWon"), label: ui("winningBid"), amount: auction.currentBid };
  if (bidderState === "lost") return { kind: "lost", title: t(COPY.lostBanner), label: ui("winningBid"), amount: auction.currentBid };
  if (phase === "ended") {
    return { kind: "closed", title: ui("auctionEnded"), label: auction.bidCount ? ui("winningBid") : null, amount: auction.currentBid };
  }
  if (bidderState === "highest") {
    return { kind: "highest", title: ui("youAreWinning"), label: auction.myMax ? ui("yourMaxBid") : null, amount: auction.myMax };
  }
  if (bidderState === "outbid") return { kind: "outbid", title: ui("youAreOutbid"), label: ui("nextMinBid"), amount: auction.minNext };
  return null;
}

/**
 * Bidder-state message: highest / outbid while live, won / lost / sold when
 * the auction closes. A polite live region so the change is announced.
 */
export function BidderBanner({ auction, product, bought = false }) {
  const { money } = useLang();
  const banner = useBanner(auction, product, bought);
  const Icon = banner ? STYLES[banner.kind].icon : null;
  // The live region is visually hidden (absolutely positioned, so it never adds
  // grid gaps); the visible banner appears only when there is something to say.
  return (
    <>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {banner ? `${banner.title}${banner.label ? `. ${banner.label} ${money(banner.amount)}` : ""}` : ""}
      </p>
      {banner ? (
        <div aria-hidden="true" className={cx("kz-fade-up flex items-start gap-2.5 rounded-lg px-3 py-2.5 ring-1 ring-inset", STYLES[banner.kind].box)}>
          <Icon className="mt-0.5 size-4 shrink-0" />
          <div className="min-w-0 kb-sm">
            <p className="font-bold">{banner.title}</p>
            {banner.label ? (
              <p className="flex flex-wrap items-baseline gap-1 text-fg-2">
                {banner.label}
                <Money value={banner.amount} className="font-extrabold text-fg" />
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
