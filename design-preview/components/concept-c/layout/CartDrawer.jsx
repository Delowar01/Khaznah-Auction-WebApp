"use client";

import Link from "next/link";
import { useId } from "react";
import { ShoppingBag } from "lucide-react";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Money } from "@/components/shared/ui/Money";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { UI } from "@/data/ui";
import { detailPath, getProduct, isAuction } from "@/lib/catalog";
import { COPY } from "../copy";
import { PlateImage } from "../ui/Frame";
import { Button } from "../ui/Button";
import { DRAWER_PANEL, DrawerPanel } from "./DrawerPanel";

const unitPrice = (product) => (isAuction(product) ? product.buyNowPrice || product.currentBid : product.price);

/** Cart drawer with line items, subtotal and checkout. */
export function CartDrawer({ open, onClose }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { cart, cartCount, removeFromCart, toast } = useStore();
  const titleId = useId();
  const lines = cart.map((item) => ({ ...item, product: getProduct(item.slug) })).filter((line) => line.product);
  const subtotal = lines.reduce((sum, line) => sum + unitPrice(line.product) * line.qty, 0);

  const footer = lines.length ? (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-fg-2">{t(COPY.subtotal)}</span>
        <Money value={subtotal} className="c-num text-xl font-semibold" />
      </div>
      <Button block size="lg" onClick={() => toast({ tone: "info", title: ui("checkout"), description: t(COPY.checkoutNote) })}>
        {ui("checkout")}
      </Button>
    </div>
  ) : null;

  return (
    <Drawer open={open} onClose={onClose} side="end" labelledBy={titleId} panelClassName={DRAWER_PANEL}>
      <DrawerPanel titleId={titleId} title={UI.cart} count={cartCount || null} onClose={onClose} footer={footer}>
        {lines.length ? (
          <ul className="divide-y divide-line">
            {lines.map(({ slug, qty, product }) => (
              <li key={slug} className="flex gap-4 py-4 first:pt-0">
                <PlateImage image={product.images[0]} alt="" sizes="80px" className="size-20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <Link href={link(detailPath(product))} onClick={onClose} className="c-link line-clamp-2 font-medium text-fg">
                    {t(product.title)}
                  </Link>
                  <p className="mt-1 text-sm text-fg-3">
                    {ui("quantity")}: <span className="c-num">{qty}</span>
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Money value={unitPrice(product) * qty} className="c-num font-semibold" />
                    <button type="button" onClick={() => removeFromCart(slug)} className="c-link text-sm text-fg-2 hover:text-danger">
                      {t(COPY.remove)}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="grid size-16 place-items-center rounded-md border border-line bg-surface-2 text-fg-3">
              <ShoppingBag aria-hidden="true" className="size-7" strokeWidth={1.5} />
            </span>
            <p className="mt-5 font-semibold text-fg">{t(COPY.cartEmpty)}</p>
            <p className="mt-1 max-w-64 text-sm text-fg-2">{t(COPY.cartEmptyText)}</p>
          </div>
        )}
      </DrawerPanel>
    </Drawer>
  );
}
