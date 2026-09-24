"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Modal } from "@/components/shared/ui/Modal";
import { Money } from "@/components/shared/ui/Money";
import { Img } from "@/components/shared/ui/Img";
import { Button } from "../ui/Button";
import { COPY } from "../copy";

function Sheet({ open, onClose, title, product, eyebrow, amountLabel, amount, notes, error, confirmLabel, onConfirm, confirmTestId }) {
  const { t, ui } = useLang();
  return (
    <Modal open={open} onClose={onClose} title={title} variant="sheet" panelClassName="rounded-t-xl bg-elevated text-fg shadow-overlay md:rounded-xl">
      <div className="p-6 md:p-8">
        <p className="a-eyebrow">{eyebrow}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="relative block size-16 shrink-0 overflow-hidden rounded-card bg-plate">
            <Img image={product.images[0]} alt="" sizes="64px" className="a-plate-img absolute inset-0 size-full object-contain p-1.5" />
          </span>
          <div className="min-w-0">
            <p className="a-serif text-[21px] leading-snug text-fg">{t(product.title)}</p>
            <p className="mt-1 text-[13px] text-fg-3">{product.lot}</p>
          </div>
        </div>
        <div className="mt-6 border-y border-line py-6 text-center">
          <p className="a-eyebrow">{amountLabel}</p>
          <p className="a-serif mt-3 text-[52px] leading-none text-fg">
            <Money value={amount} symbolClassName="text-[0.75em]" />
          </p>
        </div>
        <ul className="mt-5 space-y-2.5 text-[13px] leading-relaxed text-fg-2 rtl:text-sm">
          {notes.map((note, i) => (
            <li key={i} className="flex gap-2.5">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fg-3" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
        {error ? (
          <p role="alert" className="mt-4 text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}
        <div className="mt-7 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onClose}>
            {ui("cancel")}
          </Button>
          <Button onClick={onConfirm} data-testid={confirmTestId}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/** Bid confirmation: amount, binding note, deposit. */
export function ConfirmBidModal({ open, onClose, amount, product, a, onDone }) {
  const { ui, money } = useLang();
  const [error, setError] = useState("");
  const close = () => {
    setError("");
    onClose();
  };
  const confirm = () => {
    const result = a.placeBid(amount);
    if (!result.ok) return setError(result.error);
    onDone?.();
    close();
  };
  return (
    <Sheet
      open={open}
      onClose={close}
      title={ui("confirmYourBid")}
      eyebrow={ui("youAreBidding")}
      product={product}
      amountLabel={ui("yourBid")}
      amount={amount || 0}
      notes={[ui("bindingBid"), `${ui("depositCovered")} · ${money(a.deposit.required)}`]}
      error={error}
      confirmLabel={ui("confirmBid")}
      onConfirm={confirm}
      confirmTestId="confirm-bid"
    />
  );
}

/** Buy Now on a "both" lot: closes the auction immediately. */
export function ConfirmBuyNowModal({ open, onClose, product, onConfirm }) {
  const { t, ui } = useLang();
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={t(COPY.confirmPurchase)}
      eyebrow={ui("orBuyNow")}
      product={product}
      amountLabel={ui("price")}
      amount={product.buyNowPrice}
      notes={[ui("buyNowClosesAuction"), t(COPY.boughtText)]}
      confirmLabel={t(COPY.confirmPurchase)}
      onConfirm={() => {
        onConfirm();
        onClose();
      }}
    />
  );
}
