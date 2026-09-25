"use client";

import Link from "next/link";
import { Heart, Lock, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { getProduct, isAuction } from "@/data/products";
import { HERO, PAYMENT_METHODS, TRUST_POINTS } from "@/data/site";
import { GRADES } from "@/data/grades";
import { detailPath } from "@/lib/catalog";
import { COPY } from "./copy";
import { mainImage } from "./lots";
import { useVisual } from "./state";
import { IconButton, TimeLeft, WatchButton, cx, pillClass } from "./ui";

const PANEL = "bg-elevated font-sans text-fg shadow-overlay sm:rounded-s-[28px]";

function Thumb({ product }) {
  const image = mainImage(product);
  return (
    <span className="vm-plate relative size-[76px] shrink-0 overflow-hidden rounded-[16px]">
      <Img image={image} alt="" sizes="76px" className={cx("size-full", image?.kind === "scene" ? "object-cover" : "vm-multiply object-contain p-2")} />
    </span>
  );
}

function PanelHead({ title, subtitle, onClose }) {
  const { t } = useLang();
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
      <div>
        <p className="vm-h3" aria-hidden="true">
          {title}
        </p>
        {subtitle ? <p className="vm-xs text-fg-3">{subtitle}</p> : null}
      </div>
      <IconButton label={t(COPY.close)} onClick={onClose} className="-me-2">
        <X aria-hidden="true" className="size-5" />
      </IconButton>
    </div>
  );
}

function BagLine({ item, onNavigate }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { addToCart, removeFromCart, toast } = useStore();
  const { product, qty } = item;
  const title = t(product.title);
  const max = Math.max(1, product.stock);
  const locked = product.fullStockRequired;
  return (
    <li className="flex gap-3.5 px-5 py-4">
      <Thumb product={product} />
      <div className="min-w-0 flex-1">
        <Link href={link(detailPath(product))} onClick={onNavigate} className="line-clamp-2 vm-sm font-bold text-fg hover:underline">
          {title}
        </Link>
        <p className="mt-0.5 vm-xs text-fg-3">
          {GRADES[product.grade] ? t(GRADES[product.grade].label) : null} · <Money value={product.price} />
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="inline-flex items-center rounded-full border border-line">
            <button
              type="button"
              aria-label={`${ui("decrease")} — ${title}`}
              disabled={locked}
              onClick={() => (qty <= 1 ? removeFromCart(product.slug) : addToCart(product.slug, -1))}
              className="grid size-9 place-items-center rounded-full disabled:opacity-40"
            >
              <Minus aria-hidden="true" className="size-4" />
            </button>
            <span className="min-w-7 text-center tabular vm-sm font-bold" aria-label={`${ui("quantity")}: ${qty}`}>
              {qty}
            </span>
            <button
              type="button"
              aria-label={`${ui("increase")} — ${title}`}
              disabled={locked || qty >= max}
              onClick={() => addToCart(product.slug, 1)}
              className="grid size-9 place-items-center rounded-full disabled:opacity-40"
            >
              <Plus aria-hidden="true" className="size-4" />
            </button>
          </div>
          <Money value={product.price * qty} className="vm-price text-fg" />
        </div>
        <button
          type="button"
          onClick={() => {
            removeFromCart(product.slug);
            toast({ tone: "neutral", title: t(COPY.removed), description: title });
          }}
          className="mt-2 vm-xs font-semibold text-fg-3 underline-offset-2 hover:text-fg hover:underline"
        >
          {t(COPY.remove)}
          <span className="sr-only">: {title}</span>
        </button>
      </div>
    </li>
  );
}

/** Bag drawer (Buy Now lots only; auctions are paid after winning). */
export function BagDrawer() {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { layer, close } = useVisual();
  const { cart, cartCount, toast } = useStore();
  const items = cart.map((item) => ({ ...item, product: getProduct(item.slug) })).filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const payments = TRUST_POINTS.find((p) => p.key === "payments");

  return (
    <Drawer open={layer === "bag"} onClose={close} title={t(COPY.yourBag)} side="end" panelClassName={PANEL}>
      <PanelHead title={t(COPY.yourBag)} subtitle={pl("items", cartCount)} onClose={close} />
      {items.length ? (
        <>
          <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto">
            {items.map((item) => (
              <BagLine key={item.slug} item={item} onNavigate={close} />
            ))}
          </ul>
          <div className="grid gap-3 border-t border-line p-5">
            <div className="flex items-baseline justify-between">
              <span className="vm-md font-semibold text-fg-2">{t(COPY.subtotal)}</span>
              <Money value={subtotal} className="vm-price-lg text-fg" />
            </div>
            <p className="-mt-1 vm-xs text-fg-3">{ui("deliveryText")}</p>
            <button
              type="button"
              onClick={() => toast({ tone: "success", title: t(COPY.checkoutTitle), description: t(payments.text) })}
              className={pillClass("solid", "lg", "w-full")}
            >
              <Lock aria-hidden="true" className="size-4" />
              {ui("checkout")}
            </button>
            <button type="button" onClick={close} className={pillClass("soft", "md", "w-full")}>
              {t(COPY.continueShopping)}
            </button>
            <p className="flex flex-wrap items-center justify-center gap-1.5">
              {PAYMENT_METHODS.map((method) => (
                <span key={method} className="rounded-md border border-line px-1.5 py-0.5 text-[11px] font-bold text-fg-2">
                  {method}
                </span>
              ))}
            </p>
          </div>
        </>
      ) : (
        <div className="grid flex-1 place-content-center justify-items-center gap-3 p-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-surface-2">
            <ShoppingBag aria-hidden="true" className="size-7 text-fg-2" />
          </span>
          <p className="vm-h3">{t(COPY.bagEmpty)}</p>
          <p className="max-w-[260px] vm-sm text-fg-2">{t(COPY.bagEmptyText)}</p>
          <Link href={link("/browse?tab=buy_now")} onClick={close} className={pillClass("solid", "md", "mt-2")}>
            {t(HERO.secondaryCta)}
          </Link>
        </div>
      )}
    </Drawer>
  );
}

/** Watchlist drawer: saved lots with their live price and clock. */
export function WatchDrawer() {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const { layer, close } = useVisual();
  const { watched } = useStore();
  const items = [...watched].map(getProduct).filter(Boolean);

  return (
    <Drawer open={layer === "watchlist"} onClose={close} title={t(COPY.watchlist)} side="end" panelClassName={PANEL}>
      <PanelHead title={t(COPY.watchlist)} subtitle={pl("lots", items.length)} onClose={close} />
      {items.length ? (
        <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto">
          {items.map((product) => {
            const auction = isAuction(product);
            return (
              <li key={product.slug} className="flex items-center gap-3.5 px-5 py-4">
                <Thumb product={product} />
                <div className="min-w-0 flex-1">
                  <Link href={link(detailPath(product))} onClick={close} className="line-clamp-2 vm-sm font-bold text-fg hover:underline">
                    {t(product.title)}
                  </Link>
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-2 vm-sm">
                    <Money value={auction ? product.currentBid : product.price} className="font-extrabold text-fg" />
                    {auction && product.status === "live" ? (
                      <span className="vm-xs text-fg-3">
                        · <TimeLeft endsIn={product.endsIn} />
                      </span>
                    ) : null}
                  </p>
                </div>
                <WatchButton product={product} tone="surface" className="shrink-0 border border-line" />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="grid flex-1 place-content-center justify-items-center gap-3 p-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-surface-2">
            <Heart aria-hidden="true" className="size-7 text-fg-2" />
          </span>
          <p className="vm-h3">{t(COPY.watchlistEmpty)}</p>
          <p className="max-w-[260px] vm-sm text-fg-2">{t(COPY.watchlistEmptyText)}</p>
          <Link href={link("/browse")} onClick={close} className={pillClass("solid", "md", "mt-2")}>
            {t(COPY.browseLots)}
          </Link>
        </div>
      )}
    </Drawer>
  );
}
