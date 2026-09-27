"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { CATEGORIES } from "@/data/categories";
import { getProduct } from "@/data/products";
import { detailPath } from "@/lib/catalog";
import { priceOf } from "@/lib/useBrowse";
import { COPY } from "./copy";
import { AccountSummary, LangLink, SavedList, useAccountItems, useNavItems } from "./Header";
import { usePremium } from "./state";
import { btnClass, cx } from "./ui";

function DrawerHead({ title, onClose }) {
  const { t } = useLang();
  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
      {title}
      <button type="button" onClick={onClose} aria-label={t(COPY.close)} className="grid size-10 place-items-center rounded-full text-fg hover:bg-surface-2">
        <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

export function BagDrawer() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { layer, close } = usePremium();
  const { cart, removeFromCart, toast } = useStore();
  const items = cart.map((item) => ({ ...item, product: getProduct(item.slug) })).filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + priceOf(item.product) * item.qty, 0);
  return (
    <Drawer open={layer === "bag"} onClose={close} title={t(COPY.yourBag)} panelClassName="bg-elevated text-fg font-sans shadow-overlay">
      <DrawerHead title={<p className="pm-h3 text-fg">{t(COPY.yourBag)}</p>} onClose={close} />
      {items.length ? (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {items.map(({ product, qty }) => (
              <li key={product.slug} className="flex gap-4 py-4">
                <span className="pm-plate relative size-20 shrink-0 overflow-hidden rounded-card">
                  <Img image={product.images[0]} alt="" sizes="80px" className="pm-multiply size-full object-contain p-2" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={link(detailPath(product))} onClick={close} className="line-clamp-2 pm-sm font-medium text-fg hover:underline">
                    {t(product.title)}
                  </Link>
                  <p className="mt-1 pm-xs text-fg-3">
                    {ui("quantity")}: {qty}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <Money value={priceOf(product) * qty} className="pm-price text-fg" />
                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(product.slug);
                        toast({ tone: "neutral", title: t(COPY.removed), description: t(product.title) });
                      }}
                      className="pm-link pm-xs text-fg-2"
                    >
                      {t(COPY.remove)}
                      <span className="sr-only">: {t(product.title)}</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-line p-5">
            <p className="flex items-baseline justify-between pm-md text-fg">
              <span>{t(COPY.subtotal)}</span>
              <Money value={subtotal} className="pm-price-lg" />
            </p>
            <p className="mt-1 pm-xs text-fg-3">{ui("buyNowCheckoutNote")}</p>
            <button
              type="button"
              onClick={() => toast({ tone: "info", title: ui("checkout"), description: ui("buyNowCheckoutNote") })}
              className={btnClass("ink", "lg", "mt-4 w-full")}
            >
              {ui("checkout")}
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <ShoppingBag aria-hidden="true" className="size-8 text-fg-3" strokeWidth={1.5} />
          <p className="pm-h3 text-fg">{t(COPY.bagEmpty)}</p>
          <p className="pm-sm text-fg-2">{t(COPY.bagEmptyText)}</p>
          <button type="button" onClick={close} className={btnClass("outline", "md", "mt-2")}>
            {t(COPY.continueShopping)}
          </button>
        </div>
      )}
    </Drawer>
  );
}

/** Phones and tablets: the menu drawer (categories, ways to shop, account). */
export function MenuDrawer() {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const { layer, close } = usePremium();
  const { watched } = useStore();
  const nav = useNavItems();
  const accountItems = useAccountItems();
  return (
    <Drawer open={layer === "menu"} onClose={close} title={t(COPY.menu)} panelClassName="bg-elevated text-fg font-sans shadow-overlay">
      <DrawerHead title={<Logo variant="lockup" decorative className="h-8 w-auto" />} onClose={close} />
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <nav aria-label={t(COPY.mainNav)}>
          <ul className="divide-y divide-line border-b border-line">
            {nav.map((item) => (
              <li key={item.key}>
                <Link href={link(item.href)} onClick={close} className="flex h-14 items-center gap-2 pm-lg font-medium text-fg">
                  {item.live ? <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--live)]" /> : null}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-7 pm-label text-fg-3">{t(COPY.shopByCategory)}</p>
        <ul className="mt-3 grid grid-cols-2 gap-3">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link href={link(`/browse?category=${category.slug}`)} onClick={close} className="flex items-center gap-2.5 rounded-card border border-line p-2">
                <span className="pm-plate relative size-10 shrink-0 overflow-hidden rounded-card">
                  <Img image={category.image} alt="" sizes="40px" className="pm-multiply size-full object-contain p-1" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate pm-xs font-semibold text-fg">{t(category.name)}</span>
                  <span className="block pm-xs text-fg-3">{pl("lots", category.count)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 border-t border-line pt-6">
          <AccountSummary />
          <ul className="mt-4 space-y-1">
            {accountItems.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => {
                    item.run();
                    close();
                  }}
                  className="flex h-11 w-full items-center gap-3 text-start pm-md text-fg"
                >
                  <item.icon aria-hidden="true" className="size-4 text-fg-2" strokeWidth={1.75} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-5 pm-label text-fg-3">{t(COPY.savedCount, { n: watched.size })}</p>
          <div className="mt-2">
            <SavedList onPick={close} />
          </div>
        </div>
        <LangLink onClick={close} className={cx(btnClass("quiet", "md", "mt-8 w-full"))} />
      </div>
    </Drawer>
  );
}
