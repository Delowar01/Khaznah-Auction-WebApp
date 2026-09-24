"use client";

import { useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { Button } from "../ui/Button";
import { useCopy } from "../lib/useCopy";

/** "Or buy it now" row for sale type "both", with its own confirmation. */
export function BuyNowOption({ product, onPurchase }) {
  const { ui, money } = useLang();
  const c = useCopy();
  const [open, setOpen] = useState(false);
  return (
    <div className="d-panel-2 flex items-center gap-3 p-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-fg-3">{ui("orBuyNow")}</p>
        <Money value={product.buyNowPrice} className="d-num mt-0.5 text-lg font-medium text-fg" />
      </div>
      <Button variant="secondary" size="md" icon={ShoppingBag} onClick={() => setOpen(true)}>
        {ui("buyNow")}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={ui("buyNowFor", { amount: money(product.buyNowPrice) })} variant="sheet" panelClassName="rounded-t-2xl border border-line-strong bg-elevated shadow-overlay md:rounded-2xl">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-lg font-semibold text-fg" aria-hidden="true">
              {ui("buyNowFor", { amount: money(product.buyNowPrice) })}
            </p>
            <button type="button" onClick={() => setOpen(false)} aria-label={ui("close")} className="grid size-10 shrink-0 place-items-center rounded-lg text-fg-3 hover:bg-surface-2 hover:text-fg">
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <div className="mt-4 rounded-xl bg-surface-2 p-4 text-center ring-1 ring-inset ring-line">
            <Money value={product.buyNowPrice} className="d-num text-4xl font-medium text-fg" />
            <p className="mt-2 text-sm text-fg-2">{ui("buyNowClosesAuction")}</p>
          </div>
          <p className="mt-4 text-[13px] text-fg-3">{ui("buyNowCheckoutNote")}</p>
          <div className="mt-6 grid grid-cols-[auto_1fr] gap-2.5">
            <Button variant="secondary" size="lg" onClick={() => setOpen(false)}>
              {ui("cancel")}
            </Button>
            <Button
              variant="gold"
              size="lg"
              onClick={() => {
                setOpen(false);
                onPurchase();
              }}
            >
              {c("confirmPurchase")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
