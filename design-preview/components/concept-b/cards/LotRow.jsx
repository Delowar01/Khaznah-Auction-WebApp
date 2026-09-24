"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { isAuction } from "@/data/products";
import { detailPath } from "@/lib/catalog";
import { Badge } from "../ui/Badge";
import { Button, buttonClass } from "../ui/Button";
import { CountdownPill, useLotClock } from "../ui/Countdown";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { StockMeter } from "../ui/StockMeter";
import { WatchButton } from "../ui/WatchButton";
import { useAddToCart } from "../utils/useAddToCart";
import { COPY } from "../copy";
import { PriceLabel, SellerLine, TitleLink } from "./CardParts";
import { useLotMeta } from "./useLotMeta";

function AuctionSide({ product, watch }) {
  const { ui, t, pl } = useLang();
  const { remaining, phase } = useLotClock(product);
  const closed = phase === "sold" || phase === "ended";
  const upcoming = phase === "upcoming";
  return (
    <>
      <div>
        <PriceLabel>{phase === "sold" ? ui("soldFor") : upcoming || !product.bidCount ? ui("startingBid") : ui("currentBid")}</PriceLabel>
        <Money value={product.currentBid} className="kb-price text-fg" symbolClassName="text-[0.8em]" />
        <div className="mt-1 flex flex-wrap items-center gap-2 sm:justify-end">
          {!upcoming ? <span className="kb-xs text-fg-3">{pl("bids", product.bidCount)}</span> : null}
          <CountdownPill phase={phase} remaining={remaining} prefix={upcoming ? ui("startsIn") : undefined} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {watch}
        <span aria-hidden="true" className={buttonClass({ variant: closed || upcoming ? "outline" : "primary", size: "sm" })}>
          {closed ? t(COPY.viewResult) : upcoming ? ui("remindMe") : ui("bidNow")}
        </span>
      </div>
    </>
  );
}

function BuyNowSide({ product, discount, watch }) {
  const { ui, t } = useLang();
  const add = useAddToCart();
  const soldOut = product.stock <= 0;
  return (
    <>
      <div>
        <div className="flex flex-wrap items-baseline gap-x-2 sm:justify-end">
          <Money value={product.price} className="kb-price text-fg" symbolClassName="text-[0.8em]" />
          {discount > 0 ? <Money value={product.originalPrice} strike className="kb-xs text-fg-3" /> : null}
        </div>
        {product.unitLabel ? <p className="kb-xs text-fg-3">{t(product.unitLabel)}</p> : null}
        <StockMeter stock={product.stock} compact className="mt-0.5" />
      </div>
      <div className="flex items-center gap-2">
        {watch}
        <Button variant="outline-primary" size="sm" icon={soldOut ? undefined : ShoppingCart} disabled={soldOut} onClick={() => add(product, 1)} className="relative z-10">
          {soldOut ? ui("outOfStock") : ui("addToCart")}
        </Button>
      </div>
    </>
  );
}

/** Wide list-view row for browse: photo · facts · price and action. */
export function LotRow({ product }) {
  const { link } = useConcept();
  const { t } = useLang();
  const meta = useLotMeta(product);
  const watch = <WatchButton product={product} className="shadow-none" />;
  return (
    <article className="group/card relative grid grid-cols-[88px_minmax(0,1fr)] gap-3 rounded-card border border-line bg-surface p-3 transition-[box-shadow,border-color] duration-200 hover:border-line-strong hover:shadow-raised sm:grid-cols-[128px_minmax(0,1fr)_auto] sm:gap-4">
      <Plate image={meta.image} alt={meta.title} sizes="128px" className="aspect-square rounded-lg" imgClassName="transition-transform duration-300 group-hover/card:scale-[1.05]" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <SellerLine seller={meta.seller} name={meta.sellerName} />
        <h3 className="kb-md font-semibold">
          <TitleLink href={link(detailPath(product))}>{meta.title}</TitleLink>
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <GradeChip grade={product.grade} />
          <span className="kb-xs text-fg-3">{meta.typeLine}</span>
          {meta.discount > 0 ? (
            <Badge tone="accent">
              <span dir="ltr">−{meta.discount}%</span>
            </Badge>
          ) : null}
        </div>
        <ul className="mt-0.5 hidden flex-wrap gap-x-3 gap-y-1 kb-xs text-fg-2 md:flex">
          {(product.highlights || []).slice(0, 2).map((h) => (
            <li key={h.en} className="flex items-center gap-1">
              <Check aria-hidden="true" className="size-3.5 text-success" />
              {t(h)}
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-2 flex items-end justify-between gap-3 border-t border-line pt-3 sm:col-span-1 sm:w-56 sm:flex-col sm:items-end sm:border-0 sm:pt-0 sm:text-end">
        {isAuction(product) ? <AuctionSide product={product} watch={watch} /> : <BuyNowSide product={product} discount={meta.discount} watch={watch} />}
      </div>
    </article>
  );
}
