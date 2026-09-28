"use client";

// Secondary layers for the Round 3 home pages of Options 2–4 (the cart and
// the phone/tablet menu). The approved designs do not show them, so they
// follow each option's tokens (surface, text, primary, radii) rather than a
// design of their own.
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { getProduct } from "@/data/products";
import { detailPath } from "@/lib/catalog";
import { priceOf } from "@/lib/useBrowse";

const TEXT = {
  close: { en: "Close", ar: "إغلاق" },
  yourCart: { en: "Your cart", ar: "سلتك" },
  remove: { en: "Remove", ar: "إزالة" },
  removed: { en: "Removed from cart", ar: "أُزيل من السلة" },
  subtotal: { en: "Subtotal", ar: "المجموع الفرعي" },
  cartEmpty: { en: "Your cart is empty", ar: "سلتك فارغة" },
  cartEmptyText: { en: "Add Buy Now items and they will appear here.", ar: "أضف منتجات الشراء الفوري وستظهر هنا." },
  keepShopping: { en: "Keep shopping", ar: "تابع التسوّق" },
};

const cx = (...parts) => parts.filter(Boolean).join(" ");

export function DrawerHead({ children, onClose }) {
  const { t } = useLang();
  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line px-4">
      {children}
      <button type="button" onClick={onClose} aria-label={t(TEXT.close)} className="grid size-10 place-items-center rounded-control text-fg hover:bg-surface-2">
        <X aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}

export function CartDrawer({ open, onClose, titleClassName = "", priceClassName = "", smallClassName = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { cart, removeFromCart, toast } = useStore();
  const items = cart.map((item) => ({ ...item, product: getProduct(item.slug) })).filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + priceOf(item.product) * item.qty, 0);
  const button = "inline-flex h-11 items-center justify-center gap-2 rounded-control px-5 font-semibold transition-colors";
  return (
    <Drawer open={open} onClose={onClose} title={t(TEXT.yourCart)} panelClassName="bg-elevated text-fg font-sans shadow-overlay">
      <DrawerHead onClose={onClose}>
        <p className={titleClassName}>{t(TEXT.yourCart)}</p>
      </DrawerHead>
      {items.length ? (
        <>
          <ul className="flex-1 space-y-2 overflow-y-auto p-4">
            {items.map(({ product, qty }) => (
              <li key={product.slug} className="flex gap-3 rounded-card border border-line bg-surface p-2.5">
                <span className="relative size-20 shrink-0 overflow-hidden rounded-card bg-white">
                  <Img image={product.images[0]} alt="" sizes="80px" className="size-full object-contain p-2" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={link(detailPath(product))} onClick={onClose} className={cx("line-clamp-2 font-semibold text-fg hover:underline", smallClassName)}>
                    {t(product.title)}
                  </Link>
                  <p className={cx("mt-0.5 text-fg-2", smallClassName)}>
                    {ui("quantity")}: {qty}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                    <Money value={priceOf(product) * qty} className={cx("font-bold text-fg", priceClassName)} />
                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(product.slug);
                        toast({ tone: "neutral", title: t(TEXT.removed), description: t(product.title) });
                      }}
                      className={cx("font-semibold text-fg-2 hover:text-fg hover:underline", smallClassName)}
                    >
                      {t(TEXT.remove)}
                      <span className="sr-only">: {t(product.title)}</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-line p-4">
            <p className="flex items-baseline justify-between font-semibold text-fg">
              <span>{t(TEXT.subtotal)}</span>
              <Money value={subtotal} className={cx("font-bold", priceClassName)} />
            </p>
            <p className={cx("mt-1 text-fg-2", smallClassName)}>{ui("buyNowCheckoutNote")}</p>
            <button
              type="button"
              onClick={() => toast({ tone: "info", title: ui("checkout"), description: ui("buyNowCheckoutNote") })}
              className={cx(button, "mt-3 w-full bg-primary text-on-primary hover:bg-primary-hover")}
            >
              {ui("checkout")}
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-surface-2">
            <ShoppingCart aria-hidden="true" className="size-7 text-fg" />
          </span>
          <p className={cx("mt-2 text-fg", titleClassName)}>{t(TEXT.cartEmpty)}</p>
          <p className={cx("text-fg-2", smallClassName)}>{t(TEXT.cartEmptyText)}</p>
          <button type="button" onClick={onClose} className={cx(button, "mt-3 border border-line-strong bg-surface text-fg hover:bg-surface-2")}>
            {t(TEXT.keepShopping)}
          </button>
        </div>
      )}
    </Drawer>
  );
}

/** Side menu for phones and tablets; each option supplies its own content. */
export function MenuDrawer({ open, onClose, title, head, children }) {
  return (
    <Drawer open={open} onClose={onClose} side="start" title={title} panelClassName="bg-elevated text-fg font-sans shadow-overlay">
      <DrawerHead onClose={onClose}>{head}</DrawerHead>
      <div className="flex-1 overflow-y-auto p-4 pb-10">{children}</div>
    </Drawer>
  );
}
