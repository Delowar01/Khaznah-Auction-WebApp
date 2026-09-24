"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { detailPath, discountPercent, getCategory, isNewListing } from "@/lib/catalog";
import { Badge, GradeChip } from "../ui/Badges";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";
import { CardMedia } from "./CardMedia";
import { stockState } from "./lotState";

/** Stock line: in stock · only N left · sold as a full lot · out of stock. */
export function StockLine({ product, className = "" }) {
  const { ui, pl } = useLang();
  const state = stockState(product);
  const tone = { in: "text-success", low: "text-warning", out: "text-fg-3", lot: "text-fg-2" }[state];
  const text = {
    in: ui("inStock"),
    low: ui("onlyLeft", { n: product.stock }),
    out: ui("outOfStock"),
    lot: pl("units", product.quantity || 1),
  }[state];
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-[0.8125rem] font-medium", tone, className)}>
      <Diamond size={5} variant={state === "out" ? "outline" : "solid"} />
      {text}
    </span>
  );
}

/** Buy Now card: price, previous price, discount and stock. */
export function BuyNowCard({ product, priority = false, compact = false, className = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const category = getCategory(product.category);
  const off = discountPercent(product);
  const out = product.stock <= 0;

  const badges = out ? (
    <Badge tone="muted">{ui("outOfStock")}</Badge>
  ) : isNewListing(product) ? (
    <Badge tone="gold" dia>
      {ui("newListing")}
    </Badge>
  ) : off && !compact ? (
    <Badge tone="neutral">{ui("off", { pct: off })}</Badge>
  ) : null;

  return (
    <article className={cx("c-card group @container relative flex flex-col overflow-hidden rounded-card border border-line bg-surface", className)}>
      <CardMedia product={product} badges={badges} dim={out} compact={compact} priority={priority} />
      <div className={cx("flex flex-1 flex-col", compact ? "px-3 pb-4 pt-3" : "px-3 pb-4 pt-3 @min-[15rem]:px-4 @min-[15rem]:pb-5 @min-[15rem]:pt-4")}>
        <div className="flex items-center justify-between gap-2">
          <GradeChip grade={product.grade} />
          {!compact ? <span className="c-label hidden truncate @min-[15rem]:block">{t(category?.name)}</span> : null}
        </div>
        <h3 className="c-card-title mt-3 line-clamp-2 min-h-[2lh]">
          <Link href={link(detailPath(product))} className="c-stretch">
            {t(product.title)}
          </Link>
        </h3>
        <div className="mt-auto pt-4">
          <div className={cx("flex flex-wrap items-end justify-between gap-x-3 gap-y-1 border-t border-line", compact ? "pt-3" : "pt-3.5")}>
            <div className="min-w-0">
              <p className="c-label">{product.unitLabel ? `${ui("price")} · ${t(product.unitLabel)}` : ui(product.fullStockRequired ? "fixedPrice" : "buyNow")}</p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                <Money value={product.price} className={cx("c-num font-semibold text-fg", compact ? "text-lg" : "text-lg @min-[15rem]:text-[1.3rem]")} />
                {off ? <Money value={product.originalPrice} strike className="c-num text-sm text-fg-3" /> : null}
              </div>
            </div>
            <StockLine product={product} className="pb-0.5" />
          </div>
        </div>
      </div>
    </article>
  );
}
