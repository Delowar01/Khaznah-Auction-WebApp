"use client";

import Link from "next/link";
import { Check, Gavel, Lock, ShoppingCart, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Money } from "@/components/shared/ui/Money";
import { getProduct, isAuction } from "@/data/products";
import { PAYMENT_METHODS, TRUST_POINTS } from "@/data/site";
import { detailPath } from "@/lib/catalog";
import { moneyText } from "@/lib/format";
import { COPY } from "./copy";
import { useFloor, useFloorLot } from "./state";
import { IconButton, Thumb, TimeText, btnClass } from "./ui";

const PANEL = "bg-elevated font-sans text-fg shadow-overlay sm:w-[420px]";

function Head({ title, onClose }) {
  const { t } = useLang();
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line px-4">
      <p className="ac-h3" aria-hidden="true">
        {title}
      </p>
      <IconButton label={t(COPY.close)} onClick={onClose} className="-me-2">
        <X aria-hidden="true" className="size-5" />
      </IconButton>
    </div>
  );
}

function BidLine({ product, onNavigate }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { askBid } = useFloor();
  const { currentBid, minNext, winning } = useFloorLot(product);
  const live = isAuction(product) && product.status === "live";
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Thumb image={product.images[0]} size={52} />
      <div className="min-w-0 flex-1">
        {winning ? (
          <p className="inline-flex items-center gap-1 ac-xs font-semibold text-fg">
            <Check aria-hidden="true" className="size-3.5" />
            {t(COPY.youreWinning)}
          </p>
        ) : null}
        <Link href={link(detailPath(product))} onClick={onNavigate} className="block truncate ac-sm font-semibold hover:underline">
          {t(product.title)}
        </Link>
        <p className="flex items-center gap-2 ac-xs">
          <Money value={isAuction(product) ? currentBid : product.price} className="font-semibold" />
          {live ? (
            <>
              <span className="text-fg-3">·</span>
              <TimeText target={product.endsIn} className="font-semibold" />
            </>
          ) : null}
        </p>
      </div>
      {live ? (
        <button type="button" onClick={() => askBid(product.slug, minNext)} className={btnClass("ink", "sm")}>
          <Gavel aria-hidden="true" className="size-3.5" />
          <span className="ac-num">{moneyText(minNext)}</span>
          <span className="sr-only">: {t(product.title)}</span>
        </button>
      ) : null}
    </li>
  );
}

/** My bids: your bids from this page (winning), then the lots you watch. */
export function MyBidsDrawer() {
  const { t } = useLang();
  const { layer, close, bids } = useFloor();
  const { watched } = useStore();
  const mine = Object.keys(bids).map(getProduct).filter(Boolean);
  const watching = [...watched].map(getProduct).filter((p) => p && !bids[p.slug]);
  return (
    <Drawer open={layer === "bids"} onClose={close} title={t(COPY.myBidsTitle)} side="end" panelClassName={PANEL}>
      <Head title={t(COPY.myBidsTitle)} onClose={close} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <p className="px-4 pb-1 pt-4 ac-label text-fg-3">{t(COPY.yourBids)}</p>
        {mine.length ? (
          <ul className="divide-y divide-line">
            {mine.map((p) => (
              <BidLine key={p.slug} product={p} onNavigate={close} />
            ))}
          </ul>
        ) : (
          <p className="px-4 pb-4 ac-sm text-fg-2">{t(COPY.noBids)}</p>
        )}
        {watching.length ? (
          <>
            <p className="border-t border-line px-4 pb-1 pt-4 ac-label text-fg-3">{t(COPY.watchingList)}</p>
            <ul className="divide-y divide-line">
              {watching.map((p) => (
                <BidLine key={p.slug} product={p} onNavigate={close} />
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </Drawer>
  );
}

export function CartDrawer() {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { layer, close } = useFloor();
  const { cart, cartCount, removeFromCart, toast } = useStore();
  const items = cart.map((item) => ({ ...item, product: getProduct(item.slug) })).filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const payments = TRUST_POINTS.find((p) => p.key === "payments");
  return (
    <Drawer open={layer === "cart"} onClose={close} title={t(COPY.cart)} side="end" panelClassName={PANEL}>
      <Head title={`${t(COPY.cart)} · ${pl("items", cartCount)}`} onClose={close} />
      {items.length ? (
        <>
          <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto">
            {items.map(({ product, qty }) => (
              <li key={product.slug} className="flex items-center gap-3 px-4 py-3">
                <Thumb image={product.images[0]} size={52} />
                <div className="min-w-0 flex-1">
                  <Link href={link(detailPath(product))} onClick={close} className="block truncate ac-sm font-semibold hover:underline">
                    {t(product.title)}
                  </Link>
                  <p className="ac-xs text-fg-3">
                    <span className="ac-num">{qty}</span> × <Money value={product.price} />
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    removeFromCart(product.slug);
                    toast({ tone: "neutral", title: t(COPY.removed), description: t(product.title) });
                  }}
                  className="ac-xs font-semibold text-fg-3 hover:text-fg"
                >
                  {t(COPY.remove)}
                  <span className="sr-only">: {t(product.title)}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="grid gap-2.5 border-t border-line p-4">
            <p className="flex items-baseline justify-between">
              <span className="ac-md text-fg-2">{t(COPY.subtotal)}</span>
              <Money value={subtotal} className="ac-figure" />
            </p>
            <p className="ac-xs text-fg-3">{ui("deliveryText")}</p>
            <button type="button" onClick={() => toast({ tone: "success", title: t(COPY.checkoutTitle), description: t(payments.text) })} className={btnClass("ink", "lg", "w-full")}>
              <Lock aria-hidden="true" className="size-4" />
              {ui("checkout")}
            </button>
            <p className="flex justify-center gap-1.5">
              {PAYMENT_METHODS.map((method) => (
                <span key={method} dir="ltr" className="rounded-[4px] border border-line px-1.5 py-0.5 ac-2xs font-bold text-fg-2">
                  {method}
                </span>
              ))}
            </p>
          </div>
        </>
      ) : (
        <div className="grid flex-1 place-content-center justify-items-center gap-2 p-8 text-center">
          <ShoppingCart aria-hidden="true" className="size-8 text-fg-3" />
          <p className="ac-h3">{t(COPY.cartEmpty)}</p>
          <Link href={link("/browse?tab=buy_now")} onClick={close} className={btnClass("ink", "md", "mt-2")}>
            {t(COPY.buyNowTitle)}
          </Link>
        </div>
      )}
    </Drawer>
  );
}
