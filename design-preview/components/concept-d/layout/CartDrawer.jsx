"use client";

import Link from "next/link";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Money } from "@/components/shared/ui/Money";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { getProduct } from "@/data/products";
import { PAYMENT_METHODS } from "@/data/site";
import { detailPath } from "@/lib/catalog";
import { LotImage } from "../ui/LotImage";
import { Button } from "../ui/Button";
import { useCopy } from "../lib/useCopy";
import { useChrome } from "./ChromeContext";

export function CartDrawer() {
  const { cartOpen, closeCart } = useChrome();
  const { cart, removeFromCart, toast } = useStore();
  const { link } = useConcept();
  const { t, ui, pl } = useLang();
  const c = useCopy();
  const lines = cart.map((item) => ({ ...item, product: getProduct(item.slug) })).filter((line) => line.product);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);

  return (
    <Drawer open={cartOpen} onClose={closeCart} title={ui("cart")} side="end" panelClassName="bg-bg pt-[var(--pbar-h)] border-s border-line shadow-overlay">
      <div className="flex h-full flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <p className="flex items-center gap-2 font-semibold text-fg">
            {ui("cart")}
            <span className="d-num rounded-md bg-surface-2 px-1.5 text-xs text-fg-2">{count}</span>
          </p>
          <button type="button" onClick={closeCart} aria-label={ui("close")} className="grid size-11 place-items-center rounded-control text-fg-2 hover:bg-surface-2 hover:text-fg">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        {lines.length ? (
          <ul className="d-scroll flex-1 space-y-2 overflow-y-auto p-4">
            {lines.map(({ product, qty }) => (
              <li key={product.slug} className="d-panel flex gap-3 p-2.5">
                <LotImage image={product.images[0]} alt="" sizes="64px" className="size-16 shrink-0 rounded-lg" inset="p-1.5" />
                <div className="min-w-0 flex-1">
                  <Link href={link(detailPath(product))} onClick={closeCart} className="line-clamp-2 text-sm font-medium text-fg hover:underline">
                    {t(product.title)}
                  </Link>
                  <p className="d-num mt-1 flex items-center gap-1.5 text-xs text-fg-3">
                    <span dir="ltr">{qty} ×</span>
                    <Money value={product.price} />
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Money value={product.price * qty} className="d-num text-sm font-medium text-fg" />
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.slug)}
                    aria-label={`${c("remove")}: ${t(product.title)}`}
                    className="grid size-9 place-items-center rounded-lg text-fg-3 hover:bg-surface-2 hover:text-danger"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-surface-2 text-fg-3 ring-1 ring-inset ring-line">
              <ShoppingCart aria-hidden="true" className="size-7" />
            </span>
            <p className="mt-4 font-semibold text-fg">{c("cartEmpty")}</p>
            <p className="mt-1 text-sm text-fg-2">{c("cartEmptyText")}</p>
            <Button variant="secondary" size="md" className="mt-5" href={link("/browse?tab=buy_now")} onClick={closeCart}>
              {ui("buyNow")}
            </Button>
          </div>
        )}

        {lines.length ? (
          <div className="shrink-0 space-y-3 border-t border-line p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-fg-2">
                {c("subtotal")} · {pl("items", count)}
              </span>
              <Money value={subtotal} className="d-num text-xl font-medium text-fg" />
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                closeCart();
                toast({ tone: "info", title: ui("checkout"), description: c("checkoutToast") });
              }}
            >
              {ui("checkout")}
            </Button>
            <p className="flex flex-wrap items-center justify-center gap-1.5">
              {PAYMENT_METHODS.map((method) => (
                <span key={method} className="rounded-md border border-line px-2 py-0.5 text-[11px] font-medium text-fg-3">
                  {method}
                </span>
              ))}
            </p>
          </div>
        ) : null}
      </div>
    </Drawer>
  );
}
