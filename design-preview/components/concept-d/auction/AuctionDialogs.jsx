"use client";

import { Gavel, ShieldCheck, Timer, Zap } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { AUCTION_POLICY } from "@/data/site";
import { Button } from "../ui/Button";
import { GradeChip } from "../ui/GradeChip";
import { DialogPanel } from "../ui/Panels";
import { Plate } from "../ui/Plate";
import { COPY } from "../copy";

function LotLine({ product }) {
  const { t, ui } = useLang();
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line p-2.5">
      <Plate image={product.images[0]} alt="" sizes="56px" pad="p-1" className="size-14 shrink-0 rounded-md" />
      <div className="min-w-0">
        <p className="kb-2xs font-semibold text-fg-3">{ui("youAreBidding")}</p>
        <p className="line-clamp-2 kb-sm font-bold text-fg">{t(product.title)}</p>
        <p className="mt-0.5 flex items-center gap-2 kb-2xs text-fg-3">
          <GradeChip grade={product.grade} />
          <span dir="ltr" className="tabular">
            {product.lot}
          </span>
        </p>
      </div>
    </div>
  );
}

function Note({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-2.5 kb-sm text-fg-2">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
      <span>{children}</span>
    </li>
  );
}

/** "Confirm your bid" — amount, deposit, binding and anti-snipe notes. */
export function ConfirmBidModal({ open, amount, product, auction, onCancel, onConfirm }) {
  const { ui, money } = useLang();
  const late = auction.remaining > 0 && auction.remaining <= AUCTION_POLICY.antiSnipeWindowSeconds;
  return (
    <DialogPanel
      open={open}
      onClose={onCancel}
      title={ui("confirmYourBid")}
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            {ui("cancel")}
          </Button>
          <Button icon={Gavel} onClick={onConfirm} data-testid="confirm-bid" className="min-w-40">
            {ui("confirmBid")}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <LotLine product={product} />
        <div className="rounded-xl bg-primary/5 p-4 text-center ring-1 ring-primary/15">
          <p className="kb-xs font-semibold text-fg-3">{ui("yourBid")}</p>
          <Money value={amount || 0} className="kb-price-lg text-fg" symbolClassName="text-[0.7em]" />
        </div>
        <ul className="grid gap-2">
          <Note icon={ShieldCheck}>
            {ui("depositCovered")} · {money(auction.deposit.walletBalance)}
          </Note>
          <Note icon={Gavel}>{ui("bindingBid")}</Note>
          {late ? <Note icon={Timer}>{ui("antiSnipe")}</Note> : null}
        </ul>
      </div>
    </DialogPanel>
  );
}

/** Buy Now on an auction lot: closes the auction immediately. */
export function ConfirmBuyNowModal({ open, product, onCancel, onConfirm }) {
  const { ui, t, money } = useLang();
  return (
    <DialogPanel
      open={open}
      onClose={onCancel}
      title={ui("buyNowFor", { amount: money(product.buyNowPrice) })}
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            {ui("cancel")}
          </Button>
          <Button variant="primary" icon={Zap} onClick={onConfirm} className="min-w-40">
            {ui("buyItNow")}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <LotLine product={product} />
        <div className="rounded-xl bg-accent/15 p-4 text-center ring-1 ring-accent/40">
          <p className="kb-xs font-semibold text-fg-2">{ui("buyNow")}</p>
          <Money value={product.buyNowPrice} className="kb-price-lg text-fg" symbolClassName="text-[0.7em]" />
        </div>
        <ul className="grid gap-2">
          <Note icon={Zap}>{ui("buyNowClosesAuction")}</Note>
          <Note icon={ShieldCheck}>{t(COPY.boughtText, { hours: AUCTION_POLICY.paymentWindowHours })}</Note>
        </ul>
      </div>
    </DialogPanel>
  );
}
