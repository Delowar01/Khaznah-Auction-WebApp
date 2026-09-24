"use client";

import { useState } from "react";
import { Gavel, ShieldCheck, Timer, X } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { AUCTION_POLICY } from "@/data/site";
import { LotImage } from "../ui/LotImage";
import { Button } from "../ui/Button";

/** The confirmation step: lot, amount, deposit and binding terms. */
export function BidConfirmContent({ product, auction, amount, onCancel, onDone }) {
  const { t, ui } = useLang();
  const [error, setError] = useState(null);
  const lateBid = auction.remaining > 0 && auction.remaining <= AUCTION_POLICY.antiSnipeWindowSeconds;

  const confirm = () => {
    const result = auction.placeBid(amount);
    if (result.ok) onDone?.();
    else setError(result.error);
  };

  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="d-label text-fg-3">{ui("youAreBidding")}</p>
          <p className="mt-1 text-lg font-semibold text-fg" aria-hidden="true">
            {ui("confirmYourBid")}
          </p>
        </div>
        <button type="button" onClick={onCancel} aria-label={ui("close")} className="grid size-10 shrink-0 place-items-center rounded-lg text-fg-3 hover:bg-surface-2 hover:text-fg">
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      <div className="d-panel-2 mt-4 flex items-center gap-3 p-3">
        <LotImage image={product.images[0]} alt="" sizes="64px" className="size-14 shrink-0 rounded-lg" inset="p-1" />
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-medium text-fg">{t(product.title)}</p>
          <p className="d-num mt-0.5 text-xs text-fg-3" dir="ltr">
            {product.lot}
          </p>
        </div>
      </div>

      <div className="d-winning mt-4 rounded-xl bg-accent/8 p-4 text-center">
        <p className="d-label text-fg-3">{ui("yourBid")}</p>
        <Money value={amount} className="d-num mt-1 text-4xl font-medium text-fg" />
        <p className="mt-2 text-xs text-fg-2">
          {ui("currentBid")} <Money value={auction.currentBid} className="d-num text-fg" /> · {ui("minIncrement")} <Money value={auction.increment} className="d-num text-fg" />
        </p>
      </div>

      <ul className="mt-4 space-y-2 text-[13px] text-fg-2">
        <li className="flex gap-2">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
          <span>
            {ui("depositCovered")} · <Money value={auction.deposit.required} className="d-num text-fg" />
          </span>
        </li>
        <li className="flex gap-2">
          <Gavel aria-hidden="true" className="mt-0.5 size-4 shrink-0 d-ink" />
          <span>{ui("bindingBid")}</span>
        </li>
        {lateBid ? (
          <li className="flex gap-2 text-warning">
            <Timer aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{ui("antiSnipe")}</span>
          </li>
        ) : null}
      </ul>

      {error ? (
        <p role="alert" className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-[auto_1fr] gap-2.5">
        <Button variant="secondary" size="lg" onClick={onCancel}>
          {ui("cancel")}
        </Button>
        <Button variant="gold" size="lg" icon={Gavel} onClick={confirm} data-testid="confirm-bid">
          {ui("confirmBid")}
        </Button>
      </div>
    </div>
  );
}

/** Bid confirmation dialog (bottom sheet on phones). */
export function BidConfirmModal({ open, onClose, product, auction, amount }) {
  const { ui } = useLang();
  return (
    <Modal open={open} onClose={onClose} title={ui("confirmYourBid")} variant="sheet" panelClassName="rounded-t-2xl border border-line-strong bg-elevated shadow-overlay md:rounded-2xl">
      <BidConfirmContent product={product} auction={auction} amount={amount} onCancel={onClose} onDone={onClose} />
    </Modal>
  );
}
