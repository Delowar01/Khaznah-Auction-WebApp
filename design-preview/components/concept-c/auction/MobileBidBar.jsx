"use client";

import { useId, useState } from "react";
import { Bookmark, Gavel } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { Money } from "@/components/shared/ui/Money";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { UI } from "@/data/ui";
import { Button } from "../ui/Button";
import { DIALOG_PANEL, DialogHeader } from "../ui/Dialog";
import { CountdownText } from "../ui/Time";
import { BidForm } from "./BidForm";
import { BidderBanner, BidPolicyNotes } from "./BidNotices";

/** Sticky bid bar for small screens; "Bid now" opens a bottom sheet with the bid form. */
export function MobileBidBar({ product, auction, onRequestBid }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const [sheet, setSheet] = useState(false);
  const titleId = useId();
  const { phase } = auction;
  const open = phase === "live" || phase === "urgent" || phase === "critical";
  const urgency = phase === "critical" ? "critical" : phase === "urgent" ? "urgent" : "normal";

  const remind = () => {
    const now = toggleWatch(product.slug);
    toast({ tone: now ? "success" : "neutral", title: ui(now ? "addedToWatchlist" : "removedFromWatchlist"), description: t(product.title) });
  };

  return (
    <div className="sticky bottom-0 z-30 border-t border-line bg-bg/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="c-label">{ui(phase === "upcoming" ? "startingBid" : phase === "sold" ? "soldFor" : phase === "ended" ? "winningBid" : "currentBid")}</p>
          <div className="flex items-baseline gap-3">
            <Money value={phase === "upcoming" ? product.startingBid : auction.currentBid} className="c-num text-xl font-semibold text-fg" />
            {open ? <CountdownText seconds={auction.remaining} urgency={urgency} className="c-num text-sm font-semibold text-fg-2" /> : null}
          </div>
        </div>
        {open ? (
          <Button icon={Gavel} onClick={() => setSheet(true)}>
            {ui("bidNow")}
          </Button>
        ) : phase === "upcoming" ? (
          <Button variant={isWatched(product.slug) ? "outline" : "primary"} icon={Bookmark} aria-pressed={isWatched(product.slug)} onClick={remind}>
            {isWatched(product.slug) ? ui("watching") : ui("remindMe")}
          </Button>
        ) : (
          <a href="#similar" className="c-btn c-btn--outline">
            {ui("similarAuctions")}
          </a>
        )}
      </div>

      <Modal open={sheet && open} onClose={() => setSheet(false)} labelledBy={titleId} variant="sheet" panelClassName={DIALOG_PANEL}>
        <DialogHeader id={titleId} title={UI.placeBid} onClose={() => setSheet(false)} />
        <div className="space-y-5 px-5 py-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="c-label">{ui("currentBid")}</p>
              <Money value={auction.currentBid} className="c-num text-3xl font-semibold text-fg" />
            </div>
            <CountdownText seconds={auction.remaining} urgency={urgency} className="c-num text-base font-semibold" />
          </div>
          <BidderBanner auction={auction} />
          <BidForm
            auction={auction}
            onRequestBid={(amount) => {
              setSheet(false);
              onRequestBid(amount);
            }}
          />
          <BidPolicyNotes auction={auction} />
        </div>
      </Modal>
    </div>
  );
}
