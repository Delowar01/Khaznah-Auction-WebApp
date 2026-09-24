"use client";

import { useState } from "react";
import { Gavel, X } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { Button } from "../ui/Button";
import { StickyBar } from "../product/StickyBar";
import { compactTime, toneOf } from "../lib/data";
import { BidLadder } from "./BidLadder";
import { BidConfirmContent } from "./BidConfirm";

const TONE_TEXT = { ink: "text-fg-2", warning: "text-warning", danger: "text-live", upcoming: "d-ink", muted: "text-fg-3" };

/** Mobile sticky bid bar → bottom-sheet terminal (ladder, then confirm). */
export function BidSheet({ product, auction, show }) {
  const { t, ui, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState(null);
  const close = () => {
    setOpen(false);
    setReview(null);
  };

  return (
    <>
      <StickyBar show={show}>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-fg-3">{ui("currentBid")}</p>
          <p className="flex items-baseline gap-2">
            <Money key={auction.flash} value={auction.currentBid} className={`d-num rounded px-0.5 text-lg font-medium text-fg ${auction.flash ? "d-flash" : ""}`} />
            <span className={`d-num text-xs ${TONE_TEXT[toneOf(auction.phase)]}`}>{compactTime(auction.remaining, lang)}</span>
          </p>
        </div>
        <Button variant="gold" size="lg" icon={Gavel} onClick={() => setOpen(true)}>
          {ui("placeBid")}
        </Button>
      </StickyBar>

      <Modal open={open} onClose={close} title={ui("placeBid")} variant="sheet" panelClassName="rounded-t-2xl border border-line-strong bg-elevated shadow-overlay md:rounded-2xl">
        {review ? (
          <BidConfirmContent product={product} auction={auction} amount={review} onCancel={() => setReview(null)} onDone={close} />
        ) : (
          <div className="p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-medium text-fg">{t(product.title)}</p>
                <p className="mt-1 flex items-baseline gap-2">
                  <Money value={auction.currentBid} className="d-num text-2xl font-medium text-fg" />
                  <span className={`d-num text-xs ${TONE_TEXT[toneOf(auction.phase)]}`}>{compactTime(auction.remaining, lang)}</span>
                </p>
              </div>
              <button type="button" onClick={close} aria-label={ui("close")} className="grid size-10 shrink-0 place-items-center rounded-lg text-fg-3 hover:bg-surface-2 hover:text-fg">
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <BidLadder auction={auction} onReview={setReview} testId="sheet-place-bid" />
          </div>
        )}
      </Modal>
    </>
  );
}
