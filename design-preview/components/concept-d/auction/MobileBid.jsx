"use client";

import { BellRing, Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { PriceLabel } from "../cards/CardParts";
import { Button } from "../ui/Button";
import { CountdownPill } from "../ui/Countdown";
import { DialogPanel } from "../ui/Panels";
import { COPY } from "../copy";
import { BidderBanner } from "./BidderBanner";
import { BidNotes } from "./BidBoxParts";
import { BidForm } from "./BidForm";
import { MaxBidPanel } from "./MaxBidPanel";

/** Sticky bottom bar on phones: current bid, clock and a Bid button. */
export function MobileBidBar({ product, auction, onOpen }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const { phase } = auction;
  const upcoming = phase === "upcoming";
  const closed = phase === "sold" || phase === "ended";
  const watched = isWatched(product.slug);
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-(--kb-sh-bar) backdrop-blur-md md:hidden">
      <div className="kb-container flex h-[76px] items-center gap-3">
        <div className="min-w-0">
          <PriceLabel>{upcoming || !auction.bidCount ? ui("startingBid") : closed ? ui("winningBid") : ui("currentBid")}</PriceLabel>
          <Money key={auction.flash} value={auction.currentBid} className={auction.flash ? "kz-flash kb-price rounded px-0.5" : "kb-price"} symbolClassName="text-[0.8em]" />
        </div>
        <CountdownPill phase={phase} remaining={upcoming ? auction.startsIn : auction.remaining} prefix={upcoming ? ui("startsIn") : undefined} className="ms-auto" />
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
          <Button size="lg" icon={Gavel} disabled={closed} onClick={onOpen} className="px-6">
            {closed ? ui(phase === "sold" ? "sold" : "ended") : ui("bidNow")}
          </Button>
        )}
      </div>
    </div>
  );
}

/** Bottom sheet with the full bid form (opened from the mobile bar). */
export function BidSheet({ open, onClose, product, auction, onRequestBid }) {
  const { t, ui } = useLang();
  return (
    <DialogPanel open={open} onClose={onClose} title={t(COPY.bidSheetTitle)}>
      <div className="grid gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-1 kb-sm font-semibold text-fg-2">{t(product.title)}</p>
            <PriceLabel>{auction.bidCount ? ui("currentBid") : ui("startingBid")}</PriceLabel>
            <Money key={auction.flash} value={auction.currentBid} className="kb-price-lg text-fg" symbolClassName="text-[0.7em]" />
          </div>
          <CountdownPill phase={auction.phase} remaining={auction.remaining} size="md" />
        </div>
        <BidderBanner auction={auction} product={product} />
        <BidForm auction={auction} onRequest={onRequestBid} compact />
        <MaxBidPanel auction={auction} />
        <BidNotes auction={auction} />
      </div>
    </DialogPanel>
  );
}
