"use client";

import { useId, useState } from "react";
import { Zap } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { Money } from "@/components/shared/ui/Money";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { COPY } from "../copy";
import { Button } from "../ui/Button";
import { DIALOG_PANEL, DialogHeader } from "../ui/Dialog";
import { Diamond } from "../ui/Diamond";
import { openChromePanel } from "../layout/chromeEvents";

/** "Or buy it now" for sale type "both" — buying closes the auction. */
export function BuyNowBox({ product }) {
  const { t, ui, money } = useLang();
  const { addToCart, toast } = useStore();
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const confirm = () => {
    addToCart(product.slug, 1);
    setOpen(false);
    toast({ tone: "success", title: t(COPY.addedFromAuction), description: t(product.title) });
    openChromePanel("cart");
  };

  return (
    <div className="rounded-md border border-accent/60 bg-accent/10 p-5">
      <p className="c-eyebrow text-fg">
        <Diamond size={7} className="text-accent" />
        {ui("orBuyNow")}
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Money value={product.buyNowPrice} className="c-num text-[1.875rem] font-semibold leading-none text-fg" />
          <p className="mt-2 text-sm text-fg-2">{t(COPY.buyNowBoxText)}</p>
        </div>
        <Button variant="gold" icon={Zap} onClick={() => setOpen(true)}>
          {ui("buyItNow")}
        </Button>
      </div>
      <p className="mt-3 border-t border-accent/30 pt-3 text-xs text-fg-2">{ui("buyNowClosesAuction")}</p>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId} variant="sheet" panelClassName={DIALOG_PANEL}>
        <DialogHeader id={titleId} title={ui("buyNowFor", { amount: money(product.buyNowPrice) })} onClose={() => setOpen(false)} />
        <div className="space-y-5 px-5 py-6 sm:px-7">
          <p className="font-semibold text-fg">{t(product.title)}</p>
          <p className="text-sm text-fg-2">{ui("buyNowClosesAuction")}</p>
          <div className="grid grid-cols-2 gap-3 pb-1">
            <Button variant="outline" size="lg" onClick={() => setOpen(false)}>
              {ui("cancel")}
            </Button>
            <Button variant="gold" size="lg" onClick={confirm}>
              {ui("buyItNow")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
