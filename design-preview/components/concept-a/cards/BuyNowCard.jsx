"use client";

import { ShoppingCart } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { detailPath } from "@/lib/catalog";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { StockMeter } from "../ui/StockMeter";
import { WatchButton } from "../ui/WatchButton";
import { cx } from "../ui/cx";
import { useAddToCart } from "../utils/useAddToCart";
import { CardShell, SellerLine, TitleLink } from "./CardParts";
import { useLotMeta } from "./useLotMeta";

/** Fixed-price card: gold saving badge, price vs. was, stock signal, add to cart. */
export function BuyNowCard({ product, sizes = "(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 46vw", priority = false, className = "" }) {
  const { ui, t } = useLang();
  const { link } = useConcept();
  const meta = useLotMeta(product);
  const add = useAddToCart();
  const soldOut = product.stock <= 0;
  const href = link(detailPath(product));

  return (
    <CardShell className={className}>
      <div className="relative">
        <Plate
          image={meta.image}
          alt={meta.title}
          sizes={sizes}
          priority={priority}
          className="aspect-square"
          imgClassName={cx("transition-transform duration-300 ease-out group-hover/card:scale-[1.045]", soldOut && "opacity-70 grayscale")}
        />
        <div className="pointer-events-none absolute inset-x-2 top-2 z-[3] flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {soldOut ? <Badge tone="tag-muted">{ui("outOfStock")}</Badge> : null}
            {!soldOut && meta.discount > 0 ? (
              <Badge tone="tag-gold">
                <span dir="ltr">−{meta.discount}%</span>
              </Badge>
            ) : null}
            {!soldOut && meta.isNew ? <Badge tone="tag-new">{ui("newListing")}</Badge> : null}
          </div>
          <WatchButton product={product} className="pointer-events-auto" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <SellerLine seller={meta.seller} name={meta.sellerName} />
        <h3 className="min-h-[2lh] kb-md font-semibold">
          <TitleLink href={href}>{meta.title}</TitleLink>
        </h3>
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <GradeChip grade={product.grade} />
          <span className="truncate kb-xs text-fg-3">{meta.typeLine}</span>
        </div>

        <div className="mt-auto pt-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <Money value={product.price} className={cx("kb-price", soldOut ? "text-fg-3" : "text-fg")} symbolClassName="text-[0.8em]" />
            {meta.discount > 0 ? <Money value={product.originalPrice} strike className="kb-xs text-fg-3" /> : null}
            {product.unitLabel ? <span className="kb-xs text-fg-3">{t(product.unitLabel)}</span> : null}
          </div>
          <StockMeter stock={product.stock} className="mt-1.5" />
        </div>

        <Button
          variant="outline-primary"
          size="sm"
          block
          icon={soldOut ? undefined : ShoppingCart}
          disabled={soldOut}
          onClick={() => add(product, 1)}
          className="relative z-10 mt-1"
        >
          {soldOut ? ui("outOfStock") : ui("addToCart")}
          {soldOut ? null : <span className="sr-only">: {meta.title}</span>}
        </Button>
      </div>
    </CardShell>
  );
}
