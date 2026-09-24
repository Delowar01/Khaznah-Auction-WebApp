"use client";

import Link from "next/link";
import { Heart, ShoppingBag, X } from "lucide-react";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { detailPath, getProduct, isAuction } from "@/lib/catalog";
import { Button } from "../ui/Button";
import { COPY } from "../copy";

function DrawerHead({ icon: Icon, title, onClose }) {
  const { ui } = useLang();
  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
      <h2 className="a-serif flex items-center gap-3 text-2xl text-fg">
        <Icon aria-hidden="true" className="size-5" />
        {title}
      </h2>
      <button type="button" onClick={onClose} aria-label={ui("close")} className="grid size-11 place-items-center rounded-full hover:bg-surface-2">
        <X aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}

function ItemRow({ product, meta, onClose }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <li className="flex gap-4 py-4">
      <Link href={link(detailPath(product))} onClick={onClose} className="relative block size-20 shrink-0 overflow-hidden rounded-card bg-plate">
        <Img image={product.images[0]} alt="" sizes="80px" className="a-plate-img absolute inset-0 size-full object-contain p-2" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={link(detailPath(product))} onClick={onClose} className="a-serif line-clamp-2 text-[17px] leading-snug text-fg hover:underline">
          {t(product.title)}
        </Link>
        <div className="mt-2 text-sm text-fg-2">{meta}</div>
      </div>
    </li>
  );
}

export function BagDrawer({ open, onClose }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { cart, toast } = useStore();
  const rows = cart.map((row) => ({ ...row, product: getProduct(row.slug) })).filter((r) => r.product);
  const subtotal = rows.reduce((sum, r) => sum + r.product.price * r.qty, 0);
  return (
    <Drawer open={open} onClose={onClose} side="end" title={ui("bag")} panelClassName="bg-bg text-fg">
      <DrawerHead icon={ShoppingBag} title={ui("bag")} onClose={onClose} />
      {rows.length ? (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
            {rows.map((r) => (
              <ItemRow key={r.slug} product={r.product} onClose={onClose} meta={<span className="tabular">{r.qty} × <Money value={r.product.price} /></span>} />
            ))}
          </ul>
          <div className="border-t border-line px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-fg-2">{ui("price")}</span>
              <Money value={subtotal} className="a-serif text-2xl text-fg" />
            </div>
            <Button className="mt-4 w-full" size="lg" onClick={() => toast({ tone: "info", title: t(COPY.checkoutTitle), description: t(COPY.checkoutText) })}>
              {ui("checkout")}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <ShoppingBag aria-hidden="true" className="size-10 text-fg-3" strokeWidth={1.2} />
          <p className="a-serif mt-4 text-2xl text-fg">{ui("bag")}</p>
          <p className="mt-2 text-sm text-fg-2">{t(COPY.readyToOwnText)}</p>
          <Button as={Link} href={link("/browse?tab=buy_now")} onClick={onClose} variant="outline" className="mt-6">
            {t(COPY.shopBuyNow)}
          </Button>
        </div>
      )}
    </Drawer>
  );
}

export function WatchlistDrawer({ open, onClose }) {
  const { t, ui } = useLang();
  const { watched } = useStore();
  const products = [...watched].map(getProduct).filter(Boolean);
  return (
    <Drawer open={open} onClose={onClose} side="end" title={ui("watchlist")} panelClassName="bg-bg text-fg">
      <DrawerHead icon={Heart} title={ui("watchlist")} onClose={onClose} />
      {products.length ? (
        <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
          {products.map((p) => (
            <ItemRow
              key={p.slug}
              product={p}
              onClose={onClose}
              meta={
                <span className="flex items-center gap-2">
                  <span className="text-fg-3">{ui(isAuction(p) ? "currentBid" : "price")}</span>
                  <Money value={isAuction(p) ? p.currentBid : p.price} className="text-fg" />
                </span>
              }
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <Heart aria-hidden="true" className="size-10 text-fg-3" strokeWidth={1.2} />
          <p className="mt-4 text-sm text-fg-2">{t(COPY.closingSoonText)}</p>
        </div>
      )}
    </Drawer>
  );
}
