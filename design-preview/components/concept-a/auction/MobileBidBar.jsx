"use client";

import { BellRing } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { Modal } from "@/components/shared/ui/Modal";
import { Button } from "../ui/Button";
import { CountdownText } from "../ui/Countdown";
import { StickyBar } from "../ui/StickyBar";
import { BidForm } from "./BidForm";
import { BidStateBanner } from "./BidStateBanner";
import { BidAssurances } from "./BidExtras";
import { COPY } from "../copy";

/** Sticky bid bar (mobile/tablet) with a bottom-sheet bid panel. */
export function MobileBidBar({ product, a, show, live, sheetOpen, setSheetOpen, onRequestConfirm }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const watching = isWatched(product.slug);
  return (
    <>
      <StickyBar show={show}>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] text-fg-3">
            {live ? ui("currentBid") : t(COPY.opensIn)} · <CountdownText seconds={live ? a.remaining : a.startsIn} className="font-semibold" />
          </p>
          <p key={a.flash} className={`a-serif text-[24px] leading-tight text-fg ${a.flash ? "kz-flash" : ""}`}>
            <Money value={live ? a.currentBid : product.startingBid} symbolClassName="text-[0.8em]" />
          </p>
        </div>
        {live ? (
          <Button onClick={() => setSheetOpen(true)}>{ui("bidNow")}</Button>
        ) : (
          <Button
            aria-pressed={watching}
            onClick={() => {
              const now = toggleWatch(product.slug);
              toast({ tone: now ? "success" : "neutral", title: ui(now ? "addedToWatchlist" : "removedFromWatchlist") });
            }}
          >
            <BellRing aria-hidden="true" className="size-4" />
            {watching ? ui("watching") : ui("remindMe")}
          </Button>
        )}
      </StickyBar>

      <Modal open={sheetOpen} onClose={() => setSheetOpen(false)} title={t(COPY.bidPanelTitle)} variant="sheet" panelClassName="rounded-t-xl bg-elevated text-fg shadow-overlay md:rounded-xl">
        <div className="p-6">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line-strong" aria-hidden="true" />
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="a-eyebrow">{ui("currentBid")}</p>
              <p key={a.flash} className={`a-serif mt-1 text-[40px] leading-none text-fg ${a.flash ? "kz-flash" : ""}`}>
                <Money value={a.currentBid} symbolClassName="text-[0.78em]" />
              </p>
            </div>
            <p className="text-end text-[13px] text-fg-2">
              {ui("closesIn")}
              <br />
              <CountdownText seconds={a.remaining} className="text-base font-semibold text-fg" />
            </p>
          </div>
          <div className="mt-5">
            <BidStateBanner state={a.bidderState} />
          </div>
          <div className="mt-5">
            <BidForm a={a} onRequestConfirm={onRequestConfirm} primaryTestId="place-bid-sheet" />
          </div>
          <div className="mt-6 border-t border-line pt-5">
            <BidAssurances a={a} />
          </div>
        </div>
      </Modal>
    </>
  );
}
