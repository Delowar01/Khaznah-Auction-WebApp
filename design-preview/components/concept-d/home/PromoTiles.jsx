"use client";

import Link from "next/link";
import { Percent, ShoppingCart, Timer } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { detailPath, discountPercent, endingSoon } from "@/lib/catalog";
import { CompactLot } from "../cards/CompactLot";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { ViewAllLink } from "../ui/SectionHeader";
import { StockMeter } from "../ui/StockMeter";
import { topDeal } from "../utils/lots";
import { useAddToCart } from "../utils/useAddToCart";
import { COPY } from "../copy";

function TileHeader({ icon: Icon, tone, title, href, hrefLabel }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 kb-md font-extrabold text-fg">
        <span className={`grid size-7 place-items-center rounded-lg ${tone}`}>
          <Icon aria-hidden="true" className="size-4" strokeWidth={2.25} />
        </span>
        {title}
      </h2>
      <ViewAllLink href={href} label={hrefLabel} className="-me-2 h-8" />
    </div>
  );
}

function EndingTile() {
  const { t } = useLang();
  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-line bg-surface p-3">
      <TileHeader icon={Timer} tone="bg-danger/10 text-danger" title={t(COPY.underAnHour)} href="/browse?ending=1h" />
      <ul className="grid gap-0.5">
        {endingSoon(3).map((product) => (
          <li key={product.slug}>
            <CompactLot product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function DealTile() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const add = useAddToCart();
  const deal = topDeal();
  if (!deal) return null;
  const pct = discountPercent(deal);
  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-line bg-surface p-3">
      <TileHeader icon={Percent} tone="bg-accent/20 text-fg" title={t(COPY.buyNowDeals)} href="/browse?tab=buy_now&has_discount=true" hrefLabel={t(COPY.shopAllDeals)} />
      <div className="group relative flex flex-1 items-center gap-4 rounded-lg p-1.5">
        <Plate image={deal.images[0]} alt="" sizes="140px" pad="p-2.5" className="aspect-square w-[38%] max-w-36 shrink-0 self-stretch rounded-lg">
          <Badge tone="tag-gold" className="absolute start-1.5 top-1.5">
            <span dir="ltr">−{pct}%</span>
          </Badge>
        </Plate>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 self-stretch py-0.5">
          <p className="kb-eyebrow text-primary">{t(COPY.biggestSaving)}</p>
          <Link
            href={link(detailPath(deal))}
            className="line-clamp-2 kb-sm font-semibold text-fg after:absolute after:inset-0 after:content-[''] group-hover:text-primary"
          >
            {t(deal.title)}
          </Link>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <Money value={deal.price} className="kb-price text-fg" symbolClassName="text-[0.8em]" />
            <Money value={deal.originalPrice} strike className="kb-xs text-fg-3" />
            <span className="sr-only">{ui("off", { pct })}</span>
          </div>
          <div className="flex items-center gap-2">
            <GradeChip grade={deal.grade} />
            <StockMeter stock={deal.stock} compact />
          </div>
          <Button variant="soft" size="xs" icon={ShoppingCart} onClick={() => add(deal, 1)} className="relative z-10 mt-auto w-fit">
            {ui("addToCart")}
          </Button>
        </div>
      </div>
    </section>
  );
}

/** The two stacked promo tiles beside the hero carousel. */
export function PromoTiles() {
  return (
    <div className="grid h-full gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
      <EndingTile />
      <DealTile />
    </div>
  );
}
