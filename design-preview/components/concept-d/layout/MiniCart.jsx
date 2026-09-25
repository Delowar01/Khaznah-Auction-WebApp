"use client";

import Link from "next/link";
import { Lock, ShoppingCart, Trash2 } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { getProduct } from "@/data/products";
import { PAYMENT_METHODS, TRUST_POINTS } from "@/data/site";
import { detailPath } from "@/lib/catalog";
import { Button, buttonClass } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { GradeChip } from "../ui/GradeChip";
import { SidePanel } from "../ui/Panels";
import { Plate } from "../ui/Plate";
import { Stepper } from "../ui/Stepper";
import { BrowseLink } from "../utils/navigation";
import { COPY } from "../copy";
import { useChrome } from "./ChromeContext";

function CartLine({ item, onNavigate }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { addToCart, removeFromCart, toast } = useStore();
  const { product, qty } = item;
  const title = t(product.title);
  const setQty = (next) => {
    if (next <= 0) removeFromCart(product.slug);
    else addToCart(product.slug, next - qty);
  };
  const remove = () => {
    removeFromCart(product.slug);
    toast({ tone: "neutral", title: t(COPY.removedFromCart), description: title });
  };
  return (
    <li className="flex gap-3 p-4">
      <Plate image={product.images[0]} alt="" sizes="72px" pad="p-1.5" className="size-[72px] shrink-0 rounded-lg border border-line" />
      <div className="min-w-0 flex-1">
        <Link href={link(detailPath(product))} onClick={onNavigate} className="line-clamp-2 kb-sm font-semibold text-fg hover:text-primary">
          {title}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <GradeChip grade={product.grade} />
          <Money value={product.price} className="kb-xs font-semibold text-fg-3" />
          {product.unitLabel ? <span className="kb-xs text-fg-3">{t(product.unitLabel)}</span> : null}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <Stepper
            size="sm"
            value={qty}
            min={1}
            max={Math.max(1, product.stock)}
            onChange={setQty}
            label={`${ui("quantity")} — ${title}`}
            locked={product.fullStockRequired}
            lockedLabel={t(COPY.quantityLocked)}
          />
          <Money value={product.price * qty} className="kb-md font-extrabold text-fg" />
        </div>
      </div>
      <button
        type="button"
        onClick={remove}
        aria-label={t(COPY.removeItem, { title })}
        className="-me-1 grid size-9 shrink-0 place-items-center self-start rounded-md text-fg-3 transition-colors hover:bg-surface-2 hover:text-danger"
      >
        <Trash2 aria-hidden="true" className="size-4" />
      </button>
    </li>
  );
}

/** Mini-cart drawer opened from the header cart button. */
export function MiniCart() {
  const { t, ui, pl } = useLang();
  const { panel, close } = useChrome();
  const { cart, cartCount, toast } = useStore();
  const items = cart.map((item) => ({ ...item, product: getProduct(item.slug) })).filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const payments = TRUST_POINTS.find((p) => p.key === "payments");

  const footer = items.length ? (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between">
        <span className="kb-md font-semibold text-fg-2">{t(COPY.subtotal)}</span>
        <Money value={subtotal} className="kb-price text-fg" />
      </div>
      <p className="-mt-1 kb-xs text-fg-3">{ui("deliveryText")}</p>
      <Button
        size="lg"
        block
        icon={Lock}
        onClick={() => toast({ tone: "success", title: t(COPY.checkoutTitle), description: t(payments.text) })}
      >
        {ui("checkout")}
      </Button>
      <Button variant="ghost" block onClick={close}>
        {t(COPY.continueShopping)}
      </Button>
      <p className="flex flex-wrap items-center justify-center gap-1.5">
        {PAYMENT_METHODS.map((method) => (
          <span key={method} className="rounded border border-line px-1.5 py-0.5 kb-2xs font-bold text-fg-2">
            {method}
          </span>
        ))}
      </p>
    </div>
  ) : null;

  return (
    <SidePanel open={panel === "cart"} onClose={close} title={ui("cart")} subtitle={pl("items", cartCount)} footer={footer}>
      {items.length ? (
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <CartLine key={item.slug} item={item} onNavigate={close} />
          ))}
        </ul>
      ) : (
        <EmptyState icon={ShoppingCart} title={t(COPY.cartEmptyTitle)} text={t(COPY.cartEmptyText)}>
          <BrowseLink href="/browse?tab=buy_now" onClick={close} className={buttonClass()}>
            {t(COPY.shopBuyNow)}
          </BrowseLink>
        </EmptyState>
      )}
    </SidePanel>
  );
}
