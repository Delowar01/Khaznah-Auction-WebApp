"use client";

import { useId, useState } from "react";
import { Info, ShieldCheck } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { Money } from "@/components/shared/ui/Money";
import { useLang } from "@/components/shared/providers/LangProvider";
import { UI } from "@/data/ui";
import { Button } from "../ui/Button";
import { DIALOG_PANEL, DialogHeader } from "../ui/Dialog";
import { PlateImage } from "../ui/Frame";

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-fg-2">{label}</dt>
      <dd className="text-end">{children}</dd>
    </div>
  );
}

/** Confirmation step before a bid is placed (bottom sheet on mobile). */
export function ConfirmBidModal({ amount, onClose, product, auction }) {
  const { t, ui } = useLang();
  const titleId = useId();
  const [error, setError] = useState(null);
  // Keep the last amount so the sheet doesn't flash "0" while it animates out.
  const [last, setLast] = useState(amount);
  if (amount != null && amount !== last) setLast(amount);
  const shown = amount ?? last ?? 0;
  // The sheet closes by itself if the clock runs out while it is open.
  const open = amount != null && !auction.ended;

  const close = () => {
    setError(null);
    onClose();
  };

  const confirm = () => {
    const result = auction.placeBid(shown);
    if (result.ok) close();
    else setError(result.error);
  };

  return (
    <Modal open={open} onClose={close} labelledBy={titleId} variant="sheet" panelClassName={DIALOG_PANEL}>
      <DialogHeader id={titleId} title={UI.confirmYourBid} onClose={close} />
      <div className="space-y-5 px-5 py-6 sm:px-7">
        <div className="flex items-center gap-4">
          <PlateImage image={product.images[0]} alt="" sizes="64px" zoom={false} className="size-16 shrink-0 rounded-sm" />
          <div className="min-w-0">
            <p className="text-xs text-fg-3">{ui("youAreBidding")}</p>
            <p className="line-clamp-2 font-semibold text-fg">{t(product.title)}</p>
          </div>
        </div>
        <dl className="divide-y divide-line border-y border-line">
          <Row label={ui("currentBid")}>
            <Money value={auction.currentBid} className="c-num font-medium text-fg-2" />
          </Row>
          <Row label={ui("yourBid")}>
            <Money value={shown} className="c-num text-2xl font-semibold text-fg" />
          </Row>
          <Row label={ui("depositAmount")}>
            <span className="flex items-center gap-2 text-sm">
              <Money value={auction.deposit.required} className="c-num font-medium text-fg" />
              <span className="flex items-center gap-1 text-success">
                <ShieldCheck aria-hidden="true" className="size-4" />
                {ui("depositCovered")}
              </span>
            </span>
          </Row>
        </dl>
        <p className="flex gap-2.5 text-sm text-fg-2">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          {ui("bindingBid")}
        </p>
        {error ? (
          <p role="alert" className="rounded-sm border border-danger/40 bg-danger/8 px-3 py-2 text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}
        <div className="grid grid-cols-2 gap-3 pb-1">
          <Button variant="outline" size="lg" onClick={close}>
            {ui("cancel")}
          </Button>
          <Button size="lg" onClick={confirm} data-testid="confirm-bid">
            {ui("confirmBid")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
