"use client";

import { BellRing, Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useToastClearance } from "@/components/shared/auction/hooks";
import { Money } from "@/components/shared/ui/Money";
import { PriceLabel } from "../cards/CardParts";
import { Button } from "../ui/Button";
import { CountdownPill } from "../ui/Countdown";
import { DialogPanel } from "../ui/Panels";
import { BidderBanner } from "./BidderBanner";
import { BidNotes } from "./BidBoxParts";
import { BidForm } from "./BidForm";
import { MaxBidPanel } from "./MaxBidPanel";

/**
 * Fixed bar on phones (76 px above the safe area; the chrome keeps the same
 * space free under the footer): current bid, clock and Bid now — Watch
 * while upcoming, a disabled Sold / Ended once closed.
 */
export function MobileBidBar({ detail }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const { product, auction, upcoming, closed, priceLabel, price } = detail;
  const watched = isWatched(product.slug);
  const barRef = useToastClearance();
  return (
    <div ref={barRef} className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-(--kb-sh-bar) backdrop-blur-md md:hidden">
      <div className="kb-container flex h-[76px] items-center gap-3">
        <div className="min-w-0">
          <PriceLabel>{priceLabel}</PriceLabel>
          <Money key={auction.flash} value={price} className={auction.flash ? "kz-flash kb-price rounded px-0.5" : "kb-price"} symbolClassName="text-[0.8em]" />
        </div>
        {/* Below 380 px "Starts in" is left to screen readers so the price keeps its room. */}
        <CountdownPill
          phase={auction.phase}
          remaining={upcoming ? auction.startsIn : auction.remaining}
          prefix={upcoming ? <span className="max-[379px]:sr-only">{ui("startsIn")}</span> : undefined}
          className="ms-auto"
        />
        {upcoming ? (
          <Button
            size="lg"
            variant={watched ? "soft" : "primary"}
            icon={BellRing}
            aria-pressed={watched}
            onClick={() => {
              const now = toggleWatch(product.slug);
              toast({ tone: now ? "success" : "neutral", title: ui(now ? "addedToWatchlist" : "removedFromWatchlist"), description: t(product.title) });
            }}
          >
            {watched ? ui("watching") : ui("remindMe")}
          </Button>
        ) : (
          <Button size="lg" icon={Gavel} disabled={closed} onClick={detail.sheet.show} className="px-6" data-testid="mobile-bid">
            {closed ? ui(auction.phase === "sold" ? "sold" : "ended") : ui("bidNow")}
          </Button>
        )}
      </div>
    </div>
  );
}

/** Bottom sheet with the full bid form (opened from the bar or the phone summary). */
export function BidSheet({ detail }) {
  const { t, ui } = useLang();
  const { product, auction, priceLabel, price, sheet } = detail;
  return (
    <DialogPanel open={sheet.open} onClose={sheet.close} title={t(C.bidSheetTitle)} testId="bid-sheet">
      <div className="grid gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-1 kb-sm font-semibold text-fg-2">{t(product.title)}</p>
            <PriceLabel>{priceLabel}</PriceLabel>
            <Money key={auction.flash} value={price} className="kb-price-lg text-fg" symbolClassName="text-[0.7em]" />
          </div>
          <CountdownPill phase={auction.phase} remaining={auction.remaining} size="md" />
        </div>
        <BidderBanner detail={detail} announce={false} />
        {detail.open ? (
          <>
            <BidForm auction={auction} onRequest={detail.requestBid} compact testId="sheet-place-bid" />
            <MaxBidPanel auction={auction} />
            <BidNotes auction={auction} />
          </>
        ) : (
          <p className="kb-sm text-fg-2">{ui("auctionEnded")}</p>
        )}
      </div>
    </DialogPanel>
  );
}
