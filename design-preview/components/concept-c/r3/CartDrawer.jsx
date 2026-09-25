"use client";

import Link from "next/link";
import { Lock, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Money } from "@/components/shared/ui/Money";
import { getProduct } from "@/data/products";
import { PAYMENT_METHODS, TRUST_POINTS } from "@/data/site";
import { detailPath } from "@/lib/catalog";
import { COPY } from "./copy";
import { useHub } from "./state";
import { GradeTag, IconButton, Thumb, btnClass } from "./ui";

/** Cart drawer (Buy Now lots). */
export function CartDrawer() {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { layer, close } = useHub();
  const { cart, cartCount, addToCart, removeFromCart, toast } = useStore();
  const items = cart.map((item) => ({ ...item, product: getProduct(item.slug) })).filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const payments = TRUST_POINTS.find((p) => p.key === "payments");

  return (
    <Drawer open={layer === "cart"} onClose={close} title={t(COPY.cart)} side="end" panelClassName="bg-elevated font-sans text-fg shadow-overlay sm:w-[400px]">
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line px-4">
        <p className="hb-h2" aria-hidden="true">
          {t(COPY.cart)} <span className="hb-sm font-normal text-fg-3">· {pl("items", cartCount)}</span>
        </p>
        <IconButton label={t(COPY.close)} onClick={close} className="-me-2">
          <X aria-hidden="true" className="size-5" />
        </IconButton>
      </div>
      {items.length ? (
        <>
          <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto">
            {items.map(({ product, qty }) => {
              const title = t(product.title);
              return (
                <li key={product.slug} className="flex gap-3 p-4">
                  <Thumb image={product.images[0]} size={56} />
                  <div className="min-w-0 flex-1">
                    <Link href={link(detailPath(product))} onClick={close} className="line-clamp-2 hb-sm font-semibold hover:underline">
                      {title}
                    </Link>
                    <p className="mt-1 flex items-center gap-2 hb-xs text-fg-3">
                      <GradeTag grade={product.grade} /> <Money value={product.price} />
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-[8px] border border-line">
                        <button
                          type="button"
                          aria-label={`${ui("decrease")} — ${title}`}
                          disabled={product.fullStockRequired}
                          onClick={() => (qty <= 1 ? removeFromCart(product.slug) : addToCart(product.slug, -1))}
                          className="grid size-8 place-items-center disabled:opacity-40"
                        >
                          <Minus aria-hidden="true" className="size-3.5" />
                        </button>
                        <span className="min-w-7 text-center hb-num hb-sm font-semibold">{qty}</span>
                        <button
                          type="button"
                          aria-label={`${ui("increase")} — ${title}`}
                          disabled={product.fullStockRequired || qty >= product.stock}
                          onClick={() => addToCart(product.slug, 1)}
                          className="grid size-8 place-items-center disabled:opacity-40"
                        >
                          <Plus aria-hidden="true" className="size-3.5" />
                        </button>
                      </div>
                      <Money value={product.price * qty} className="hb-md font-bold" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(product.slug);
                        toast({ tone: "neutral", title: t(COPY.removed), description: title });
                      }}
                      className="mt-1.5 hb-xs font-semibold text-fg-3 hover:text-danger"
                    >
                      {t(COPY.remove)}
                      <span className="sr-only">: {title}</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="grid gap-2.5 border-t border-line p-4">
            <div className="flex items-baseline justify-between">
              <span className="hb-md text-fg-2">{t(COPY.subtotal)}</span>
              <Money value={subtotal} className="hb-figure text-fg" />
            </div>
            <p className="hb-xs text-fg-3">{ui("deliveryText")}</p>
            <button type="button" onClick={() => toast({ tone: "success", title: t(COPY.checkoutTitle), description: t(payments.text) })} className={btnClass("primary", "lg", "w-full")}>
              <Lock aria-hidden="true" className="size-4" />
              {ui("checkout")}
            </button>
            <button type="button" onClick={close} className={btnClass("secondary", "md", "w-full")}>
              {t(COPY.continueShopping)}
            </button>
            <p className="flex justify-center gap-1.5">
              {PAYMENT_METHODS.map((method) => (
                <span key={method} dir="ltr" className="rounded-[4px] border border-line px-1.5 py-0.5 hb-2xs font-bold text-fg-2">
                  {method}
                </span>
              ))}
            </p>
          </div>
        </>
      ) : (
        <div className="grid flex-1 place-content-center justify-items-center gap-2 p-8 text-center">
          <ShoppingCart aria-hidden="true" className="size-8 text-fg-3" />
          <p className="hb-h2">{t(COPY.cartEmpty)}</p>
          <p className="max-w-[240px] hb-sm text-fg-2">{t(COPY.cartEmptyText)}</p>
          <Link href={link("/browse?tab=buy_now")} onClick={close} className={btnClass("primary", "md", "mt-2")}>
            {t(COPY.buyNow)}
          </Link>
        </div>
      )}
    </Drawer>
  );
}
