"use client";

import Link from "next/link";
import { BellRing, Check } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { Button } from "../ui/Button";
import { CountdownBlocks } from "../ui/Countdown";
import { BidStateBanner } from "./BidStateBanner";
import { ClosesAt } from "./ClosesAt";
import { COPY } from "../copy";

/** Closed lot: sold, ended, or bought outright at the Buy Now price. */
export function AuctionOutcome({ product, a, purchased }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const sold = a.phase === "sold";
  const title = purchased ? t(COPY.youBoughtThis) : sold ? t(COPY.soldResult) : ui("auctionEnded");
  return (
    <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-7">
      <p className="a-eyebrow">{purchased || sold ? ui("sold") : ui("ended")}</p>
      <p className="a-display mt-3 text-[28px] text-fg rtl:text-[26px]">{title}</p>
      <p className="a-serif mt-5 text-[52px] leading-none text-fg">
        <Money value={purchased ? product.buyNowPrice : a.currentBid} symbolClassName="text-[0.74em]" />
      </p>
      <p className="mt-3 text-sm text-fg-2">
        {pl("bids", a.bidCount)} · {pl("bidders", a.bidderCount)}
      </p>
      {!purchased && a.bidderState === "won" ? (
        <div className="mt-5">
          <BidStateBanner state="won" />
        </div>
      ) : null}
      {purchased ? (
        <p className="mt-5 flex items-start gap-2.5 rounded-card border border-success/40 bg-success/10 px-4 py-3 text-sm font-medium text-success">
          <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {t(COPY.boughtText)}
        </p>
      ) : (
        <p className="mt-5 text-sm text-fg-2">{t(COPY.endedNoSale)}</p>
      )}
      <Button disabled size="lg" className="mt-6 w-full" data-testid="place-bid">
        {ui("placeBid")}
      </Button>
      <Button as={Link} href={link("/browse?tab=auction")} variant="outline" size="lg" className="mt-3 w-full">
        {t(COPY.seeSimilar)}
      </Button>
    </div>
  );
}

/** Scheduled lot: opening countdown, starting bid and a reminder. */
export function UpcomingBox({ product, a, formRef }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const watching = isWatched(product.slug);
  const remind = () => {
    const now = toggleWatch(product.slug);
    toast({ tone: now ? "success" : "neutral", title: ui(now ? "addedToWatchlist" : "removedFromWatchlist"), description: now ? t(COPY.remindText) : undefined });
  };
  return (
    <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="a-eyebrow">{t(COPY.opensIn)}</p>
        <ClosesAt seconds={a.startsIn} label={COPY.opensOn} className="text-[12px] text-fg-3" />
      </div>
      <CountdownBlocks seconds={a.startsIn} className="mt-3" />
      <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-line pt-5">
        <p className="a-eyebrow">{ui("startingBid")}</p>
        <p className="a-serif text-[36px] leading-none text-fg">
          <Money value={product.startingBid} symbolClassName="text-[0.78em]" />
        </p>
      </div>
      <p className="mt-2 text-end text-[13px] text-fg-3">
        {ui("minIncrement")} <Money value={product.increment} />
      </p>
      <div ref={formRef} className="mt-6 grid gap-3">
        <Button size="lg" onClick={remind} aria-pressed={watching}>
          <BellRing aria-hidden="true" className="size-4" />
          {watching ? ui("watching") : ui("remindMe")}
        </Button>
        <Button size="lg" variant="outline" disabled data-testid="place-bid">
          {ui("placeBid")}
        </Button>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-fg-2">{ui("antiSnipe")}</p>
    </div>
  );
}
