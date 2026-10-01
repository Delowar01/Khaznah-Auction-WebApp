"use client";

import { Award, Gavel } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { getProduct } from "@/data/products";
import { detailPath } from "@/lib/catalog";
import { AuctionCard } from "../cards/AuctionCard";
import { CardShell, PriceLabel, SellerLine, TitleLink } from "../cards/CardParts";
import { MiniCard } from "../cards/MiniCard";
import { useLotMeta } from "../cards/useLotMeta";
import { Badge } from "../ui/Badge";
import { buttonClass } from "../ui/Button";
import { CountdownPill, useLotClock } from "../ui/Countdown";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { SectionHeader } from "../ui/SectionHeader";
import { WatchButton } from "../ui/WatchButton";
import { COPY } from "../copy";

// Home page curation: four live auction lots first (the refrigerator, with
// the most bids of the four, leads), then three Buy Now items the Deals grid
// does not show.
const LEAD = getProduct("fridge-690");
const AUCTIONS = ["dishwasher", "swivel-chair", "tv-43"].map(getProduct);
const BUY_NOW = ["dutch-oven-blue", "multimeter", "field-watch"].map(getProduct);

/** Wide lead card: large photo, live bid, bid count, countdown and Bid now. */
function LeadAuction({ product }) {
  const { ui, t, pl } = useLang();
  const { link } = useConcept();
  const meta = useLotMeta(product);
  const { remaining, phase } = useLotClock(product);
  return (
    <CardShell>
      <div className="grid h-full sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="relative">
          {/* From 1024 px the plate is a tall column, so the packshot fills it
              (its white margins are cropped, not the product). */}
          <Plate
            image={meta.image}
            alt={meta.title}
            sizes="(min-width: 1024px) 270px, (min-width: 640px) 40vw, 92vw"
            className="aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-[300px]"
            imgClassName="transition-transform duration-300 ease-out group-hover/card:scale-[1.045] lg:object-cover lg:p-0"
          />
          <div className="pointer-events-none absolute inset-x-2 top-2 z-[3] flex items-start justify-between gap-2">
            <Badge tone="tag-indigo" icon={Gavel}>
              {ui("auction")}
              {product.saleType === "both" ? <span>+ {ui("buyNow")}</span> : null}
            </Badge>
            <WatchButton product={product} className="pointer-events-auto" />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2 p-4">
          <p className="kb-eyebrow text-primary">{t(COPY.featuredLot)}</p>
          <SellerLine seller={meta.seller} name={meta.sellerName} />
          <h3 className="kb-h3">
            <TitleLink href={link(detailPath(product))}>{meta.title}</TitleLink>
          </h3>
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <GradeChip grade={product.grade} />
            <span className="truncate kb-xs text-fg-3">{meta.typeLine}</span>
          </div>
          <div className="mt-auto pt-2">
            <PriceLabel>{ui("currentBid")}</PriceLabel>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <Money value={product.currentBid} className="kb-price-lg text-fg" symbolClassName="text-[0.7em]" />
              <span className="kb-sm text-fg-3">{pl("bids", product.bidCount)}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
            <CountdownPill phase={phase} remaining={remaining} />
            <span aria-hidden="true" className={buttonClass({ variant: "primary", size: "sm", className: "px-5" })}>
              {ui("bidNow")}
            </span>
          </div>
          {product.saleType === "both" && product.buyNowPrice ? (
            <p className="kb-xs text-fg-3">
              {ui("orBuyNow")} · <Money value={product.buyNowPrice} className="font-semibold text-fg-2" />
            </p>
          ) : null}
        </div>
      </div>
    </CardShell>
  );
}

/**
 * Featured Items: the lead auction and three more auction cards come first;
 * three Buy Now items follow as smaller cards, so auctions always read first.
 */
export function FeaturedItems() {
  const { t } = useLang();
  return (
    <section aria-labelledby="kb-featured">
      <SectionHeader
        id="kb-featured"
        icon={Award}
        title={t(COPY.featuredTitle)}
        subtitle={t(COPY.featuredSubtitle)}
        href="/browse?tab=auction"
        hrefLabel={t(COPY.featuredAllAuctions)}
      />
      <div className="grid gap-3 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <LeadAuction product={LEAD} />
        </div>
        <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:col-span-3 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
          {AUCTIONS.map((product) => (
            <li key={product.slug} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-auto">
              <AuctionCard product={product} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw" />
            </li>
          ))}
        </ul>
      </div>
      <p id="kb-featured-buy-now" className="mb-2 mt-5 kb-eyebrow text-fg-3">
        {t(COPY.featuredBuyNow)}
      </p>
      <ul aria-labelledby="kb-featured-buy-now" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BUY_NOW.map((product, i) => (
          <li key={product.slug} className={i === 2 ? "sm:max-lg:col-span-2" : undefined}>
            <MiniCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
