"use client";

import { Boxes, Gavel, Lock, ShoppingCart } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { getProduct, isAuction } from "@/data/products";
import { detailPath } from "@/lib/catalog";
import { CardShell, PriceLabel, TitleLink } from "../cards/CardParts";
import { MiniCard } from "../cards/MiniCard";
import { useLotMeta } from "../cards/useLotMeta";
import { Badge } from "../ui/Badge";
import { buttonClass } from "../ui/Button";
import { CountdownPill, useLotClock } from "../ui/Countdown";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { SectionHeader } from "../ui/SectionHeader";
import { manifestUnits } from "../utils/lots";
import { COPY } from "../copy";

function AuctionFacts({ product }) {
  const { ui, pl } = useLang();
  const { remaining, phase } = useLotClock(product);
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <PriceLabel>{ui("currentBid")}</PriceLabel>
        <Money value={product.currentBid} className="kb-price text-fg" symbolClassName="text-[0.8em]" />
        <p className="kb-xs text-fg-3">{pl("bids", product.bidCount)}</p>
      </div>
      <CountdownPill phase={phase} remaining={remaining} />
    </div>
  );
}

function BuyNowFacts({ product }) {
  const { ui, t } = useLang();
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <PriceLabel>{ui("price")}</PriceLabel>
        <div className="flex items-baseline gap-2">
          <Money value={product.price} className="kb-price text-fg" symbolClassName="text-[0.8em]" />
          <Money value={product.originalPrice} strike className="kb-xs text-fg-3" />
        </div>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-1 kb-2xs font-bold text-fg-2">
        <Lock aria-hidden="true" className="size-3" />
        {t(COPY.quantityLocked)}
      </span>
    </div>
  );
}

/** Wide pallet card with a manifest preview (thumbnails + unit counts). */
function PalletFeature({ product }) {
  const { ui, t, pl } = useLang();
  const { link } = useConcept();
  const meta = useLotMeta(product);
  const auction = isAuction(product);
  const lines = product.palletContents || [];
  return (
    <CardShell>
      <div className="grid grid-cols-[minmax(0,38%)_minmax(0,1fr)] gap-4 p-4">
        <Plate image={meta.image} alt={meta.title} sizes="220px" className="aspect-square rounded-lg" imgClassName="transition-transform duration-300 group-hover/card:scale-[1.05]" />
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap gap-1">
            <Badge tone={auction ? "primary" : "neutral"} icon={auction ? Gavel : ShoppingCart}>
              {auction ? ui("auction") : ui("buyNow")}
            </Badge>
            <Badge tone="neutral" icon={Boxes}>
              {meta.typeLine}
            </Badge>
          </div>
          <h3 className="kb-md font-bold">
            <TitleLink href={link(detailPath(product))}>{meta.title}</TitleLink>
          </h3>
          <div className="flex items-center gap-1.5">
            <GradeChip grade={product.grade} />
            <span className="kb-xs text-fg-3">
              {lines.length} {ui("lines")}
            </span>
          </div>
          <div className="mt-auto">{auction ? <AuctionFacts product={product} /> : <BuyNowFacts product={product} />}</div>
        </div>
      </div>
      <div className="mt-auto border-t border-line bg-surface-2/60 px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="kb-eyebrow text-fg-3">{ui("manifest")}</p>
          <span aria-hidden="true" className={buttonClass({ variant: auction ? "primary" : "outline-primary", size: "xs" })}>
            {auction ? ui("bidNow") : ui("buyItNow")}
          </span>
        </div>
        <ul aria-label={t(COPY.totalUnits, { units: pl("units", manifestUnits(product)), lines: `${lines.length} ${ui("lines")}` })} className="flex flex-wrap gap-2">
          {lines.map((line) => (
            <li key={line.key} className="relative shrink-0" title={`${t(line.name)} × ${line.qty}`}>
              <Plate image={line.image} alt={t(line.name)} sizes="48px" pad="p-1" className="size-12 rounded-md border border-line" />
              <span className="absolute -bottom-1 -end-1 rounded-md bg-secondary px-1 kb-2xs font-bold text-on-secondary tabular">×{line.qty}</span>
            </li>
          ))}
        </ul>
      </div>
    </CardShell>
  );
}

/** Pallets and cartons: two wide manifest cards plus the smaller bulk lots. */
export function BulkSection() {
  const { t, ui } = useLang();
  return (
    <section aria-labelledby="kb-bulk">
      <SectionHeader id="kb-bulk" icon={Boxes} title={ui("bulkLots")} subtitle={t(COPY.bulkSubtitle)} href="/browse?category=bulk-pallets" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px]">
        <PalletFeature product={getProduct("electronics-pallet")} />
        <PalletFeature product={getProduct("kitchen-pallet")} />
        <div className="grid gap-4 sm:grid-cols-2 md:col-span-2 xl:col-span-1 xl:grid-cols-1">
          <MiniCard product={getProduct("laptop-bags-24")} />
          <MiniCard product={getProduct("monitor-stands-5")} />
        </div>
      </div>
    </section>
  );
}
