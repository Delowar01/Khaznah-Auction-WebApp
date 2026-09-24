"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { detailPath, discountPercent, getCategory, getSeller, isNewListing } from "@/lib/catalog";
import { getGrade } from "@/data/grades";
import { Money } from "@/components/shared/ui/Money";
import { CardImage } from "./CardImage";
import { WatchButton } from "../ui/Actions";

/** Buy Now card with a keyboard-reachable quick "Add to bag" action. */
export function ProductCard({ product, priority = false, ratio, className = "", forceWatched }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { addToCart, toast } = useStore();
  const href = link(detailPath(product));
  const off = discountPercent(product);
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 3;
  const seller = getSeller(product.seller);
  const grade = getGrade(product.grade);

  const add = (event) => {
    event.preventDefault();
    const qty = product.fullStockRequired ? product.stock : 1;
    addToCart(product.slug, qty);
    toast({ tone: "success", title: ui("addedToCart"), description: t(product.title) });
  };

  return (
    <article className={`group relative ${className}`}>
      <div className="relative">
        <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
          <CardImage image={product.images[0]} alt="" priority={priority} ratio={ratio}>
            <div className="absolute start-3 top-3 flex flex-col items-start gap-1.5">
              {isNewListing(product) ? <span className="rounded-full bg-surface/92 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg rtl:text-xs rtl:normal-case rtl:tracking-normal">{ui("newListing")}</span> : null}
              {off ? <span className="rounded-full bg-secondary px-3 py-1.5 text-[11px] font-semibold tracking-wide text-on-secondary tabular" dir="ltr">−{off}%</span> : null}
            </div>
            {soldOut ? (
              <div className="absolute inset-x-0 bottom-0 bg-surface/85 py-2.5 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-2 backdrop-blur rtl:text-sm rtl:normal-case rtl:tracking-normal">
                {ui("soldOut")}
              </div>
            ) : null}
          </CardImage>
        </Link>
        <WatchButton slug={product.slug} className="absolute end-3 top-3" forcePressed={forceWatched} />
        {!soldOut ? (
          <button
            type="button"
            onClick={add}
            className="absolute inset-x-3 bottom-3 hidden h-11 items-center justify-center gap-2 rounded-control bg-secondary text-[12px] font-semibold uppercase tracking-[0.14em] text-on-secondary opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 lg:flex lg:translate-y-2 rtl:text-sm rtl:normal-case rtl:tracking-normal"
          >
            <Plus aria-hidden="true" className="size-4" />
            {ui("addToBag")}
          </button>
        ) : null}
      </div>
      <div className="pt-4">
        <p className="a-eyebrow !text-fg-3">
          {t(getCategory(product.category)?.name)} · {grade.key === "new" ? t(grade.label) : `${ui("grade")} ${t(grade.short)}`}
        </p>
        <h3 className="a-serif mt-2 min-h-[2.36em] text-[21px] leading-[1.18] text-fg rtl:min-h-[2.9em] rtl:leading-[1.45]">
          <Link href={href} className="a-underline-hover line-clamp-2 outline-none focus-visible:underline">
            {t(product.title)}
          </Link>
        </h3>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="a-serif text-[24px] leading-none text-fg">
            <Money value={product.price} symbolClassName="text-[0.8em]" />
          </span>
          {off ? <Money value={product.originalPrice} strike className="text-[13px] text-fg-3" /> : null}
          {product.unitLabel ? <span className="text-[13px] text-fg-3">{t(product.unitLabel)}</span> : null}
        </div>
        <p className={`mt-2 text-[13px] ${lowStock ? "text-live" : "text-fg-3"}`}>
          {soldOut ? ui("outOfStock") : lowStock ? ui("onlyLeft", { n: product.stock }) : product.fullStockRequired ? pl("units", product.quantity) : t(seller?.name)}
        </p>
        {!soldOut ? (
          <button type="button" onClick={add} className="mt-3 inline-flex h-10 items-center gap-1.5 text-[13px] font-semibold text-fg lg:hidden">
            <Plus aria-hidden="true" className="size-4" />
            <span className="a-link">{ui("addToBag")}</span>
          </button>
        ) : null}
      </div>
    </article>
  );
}
