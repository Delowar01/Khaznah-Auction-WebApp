"use client";

import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { isAuction } from "@/data/products";
import { detailPath } from "@/lib/catalog";
import { CountdownPill, useLotClock } from "../ui/Countdown";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { StockMeter } from "../ui/StockMeter";
import { CardShell, PriceLabel, TitleLink } from "./CardParts";
import { useLotMeta } from "./useLotMeta";

function Clock({ product }) {
  const { remaining, phase } = useLotClock(product);
  return <CountdownPill phase={phase} remaining={remaining} />;
}

/** Horizontal compact card for narrow columns (bulk shelf, related lists). */
export function MiniCard({ product, className = "" }) {
  const { ui, t } = useLang();
  const { link } = useConcept();
  const meta = useLotMeta(product);
  const auction = isAuction(product);
  return (
    <CardShell className={className}>
      <div className="flex h-full gap-3 p-3">
        <Plate image={meta.image} alt={meta.title} sizes="104px" pad="p-2" className="size-[104px] shrink-0 rounded-lg" imgClassName="transition-transform duration-300 group-hover/card:scale-[1.05]" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="kb-sm font-semibold">
            <TitleLink href={link(detailPath(product))}>{meta.title}</TitleLink>
          </h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <GradeChip grade={product.grade} />
            <span className="truncate kb-2xs text-fg-3">{meta.typeLine}</span>
          </div>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-2">
            <div>
              <PriceLabel>{auction ? ui("currentBid") : ui("price")}</PriceLabel>
              <div className="flex items-baseline gap-1.5">
                <Money value={auction ? product.currentBid : product.price} className="kb-price-sm text-fg" />
                {!auction && product.unitLabel ? <span className="kb-2xs text-fg-3">{t(product.unitLabel)}</span> : null}
              </div>
            </div>
            {auction ? <Clock product={product} /> : <StockMeter stock={product.stock} compact />}
          </div>
        </div>
      </div>
    </CardShell>
  );
}
