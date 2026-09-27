"use client";

import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { getProduct } from "@/data/products";
import { detailPath } from "@/lib/catalog";
import { priceOf } from "@/lib/useBrowse";
import { COPY } from "./copy";
import { CATEGORY_CARDS } from "./data";
import { AccountSummary, CityPicker, LangLink, SavedList, useAccountItems, useShortcuts } from "./Header";
import { useDiscovery } from "./state";
import { LiveDot, TONE_BG, btnClass, cx } from "./ui";

function DrawerHead({ title, onClose }) {
  const { t } = useLang();
  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
      {title}
      <button type="button" onClick={onClose} aria-label={t(COPY.close)} className="grid size-10 place-items-center rounded-full bg-surface-2 text-fg">
        <X aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { layer, close } = useDiscovery();
  const { cart, removeFromCart, toast } = useStore();
  const items = cart.map((item) => ({ ...item, product: getProduct(item.slug) })).filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + priceOf(item.product) * item.qty, 0);
  return (
    <Drawer open={layer === "cart"} onClose={close} title={t(COPY.yourCart)} panelClassName="bg-elevated text-fg font-sans shadow-overlay">
      <DrawerHead title={<p className="dc-h3 text-fg">{t(COPY.yourCart)}</p>} onClose={close} />
      {items.length ? (
        <>
          <ul className="flex-1 space-y-2 overflow-y-auto p-4">
            {items.map(({ product, qty }) => (
              <li key={product.slug} className="flex gap-3 rounded-card border border-line p-2.5">
                <span className="dc-plate relative size-20 shrink-0 overflow-hidden rounded-[12px]">
                  <Img image={product.images[0]} alt="" sizes="80px" className="dc-multiply size-full object-contain p-2" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={link(detailPath(product))} onClick={close} className="line-clamp-2 dc-sm font-semibold text-fg hover:underline">
                    {t(product.title)}
                  </Link>
                  <p className="mt-0.5 dc-xs text-fg-3">
                    {ui("quantity")}: {qty}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <Money value={priceOf(product) * qty} className="dc-price text-fg" />
                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(product.slug);
                        toast({ tone: "neutral", title: t(COPY.removed), description: t(product.title) });
                      }}
                      className="dc-xs font-bold text-fg-2 hover:text-fg hover:underline"
                    >
                      {t(COPY.remove)}
                      <span className="sr-only">: {t(product.title)}</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-line p-4">
            <p className="flex items-baseline justify-between dc-md font-semibold text-fg">
              <span>{t(COPY.subtotal)}</span>
              <Money value={subtotal} className="dc-price-lg" />
            </p>
            <p className="mt-1 dc-xs text-fg-3">{ui("buyNowCheckoutNote")}</p>
            <button
              type="button"
              onClick={() => toast({ tone: "info", title: ui("checkout"), description: ui("buyNowCheckoutNote") })}
              className={btnClass("ink", "lg", "mt-3 w-full")}
            >
              {ui("checkout")}
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-[var(--dc-peach)]">
            <ShoppingCart aria-hidden="true" className="size-7 text-fg" />
          </span>
          <p className="mt-2 dc-h3 text-fg">{t(COPY.cartEmpty)}</p>
          <p className="dc-sm text-fg-2">{t(COPY.cartEmptyText)}</p>
          <button type="button" onClick={close} className={btnClass("outline", "md", "mt-3")}>
            {t(COPY.keepExploring)}
          </button>
        </div>
      )}
    </Drawer>
  );
}

/** Phones and tablets: the Discover drawer (categories, shortcuts, account, city). */
export function DiscoverDrawer() {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const { layer, close } = useDiscovery();
  const shortcuts = useShortcuts();
  const accountItems = useAccountItems();
  return (
    <Drawer open={layer === "discover"} onClose={close} side="start" title={t(COPY.discoverTitle)} panelClassName="bg-elevated text-fg font-sans shadow-overlay">
      <DrawerHead title={<Logo variant="lockup" decorative className="h-8 w-auto" />} onClose={close} />
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <p className="dc-kicker text-fg-3">{t(COPY.discoverTitle)}</p>
        <ul className="mt-2 grid grid-cols-2 gap-2">
          {CATEGORY_CARDS.map((card) => {
            const category = CATEGORY_BY_SLUG[card.slug];
            return (
              <li key={card.slug}>
                <Link href={link(`/browse?category=${card.slug}`)} onClick={close} className={cx("flex h-16 items-center gap-2 overflow-hidden rounded-[14px] px-3", TONE_BG[card.tone])}>
                  <span className="relative size-10 shrink-0">
                    <Img image={card.cutouts[0] ? { sources: card.cutouts[0].sources } : category.image} alt="" sizes="40px" className="size-full object-contain" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate dc-xs font-bold text-fg">{t(category.name)}</span>
                    <span className="block dc-xs text-fg-2">{pl("lots", category.count)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 dc-kicker text-fg-3">{t(COPY.shortcuts)}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {shortcuts.map((chip) => (
            <li key={chip.key}>
              <Link href={link(chip.href)} onClick={close} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 dc-sm font-semibold text-fg">
                {chip.live ? <LiveDot /> : <chip.icon aria-hidden="true" className="size-4 text-accent" />}
                {chip.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-card bg-surface-2 p-4">
          <AccountSummary />
          <ul className="mt-3 grid gap-1">
            {accountItems.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => {
                    item.run();
                    close();
                  }}
                  className="flex h-10 w-full items-center gap-3 rounded-[12px] px-2 text-start dc-sm font-semibold text-fg"
                >
                  <item.icon aria-hidden="true" className="size-4 text-fg-2" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 rounded-card border border-line p-4">
          <CityPicker />
        </div>
        <div className="mt-4">
          <p className="mb-2 dc-kicker text-fg-3">{t(COPY.saved)}</p>
          <SavedList onPick={close} />
        </div>
        <LangLink onClick={close} className={btnClass("outline", "md", "mt-6 w-full")} />
      </div>
    </Drawer>
  );
}
