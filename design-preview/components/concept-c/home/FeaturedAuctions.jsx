"use client";

import Link from "next/link";
import { Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { FEATURED_AUCTION } from "@/data/products";
import { UI } from "@/data/ui";
import { detailPath, getProduct, hotAuctions, marketSaving } from "@/lib/catalog";
import { COPY } from "../copy";
import { MiniLotRow } from "../cards/MiniLotRow";
import { useLotClock } from "../cards/lotState";
import { Echo } from "../ui/Bi";
import { Badge, GradeChip } from "../ui/Badges";
import { ButtonLink } from "../ui/Button";
import { ChamferFrame, PlateImage } from "../ui/Frame";
import { Section, SectionHead } from "../ui/Section";
import { CountdownText, TimeBar } from "../ui/Time";

const FEATURED = getProduct(FEATURED_AUCTION);
const MOST_BID = hotAuctions(6)
  .filter((p) => p.slug !== FEATURED_AUCTION)
  .slice(0, 3);

/** The featured lot as an editorial spotlight: plate, bilingual title, bid, Buy Now price and clock. */
function Spotlight({ product }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { remaining, urgency } = useLotClock(product);
  const saving = marketSaving(product);
  return (
    <article className="c-card group relative grid overflow-hidden rounded-md border border-line bg-surface sm:grid-cols-2">
      <div className="p-2 sm:pb-2 sm:pe-0">
        <ChamferFrame size="lg" className="h-full">
          <PlateImage image={product.images[0]} alt="" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="aspect-square h-full" />
        </ChamferFrame>
      </div>
      <div className="flex flex-col p-6 lg:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="gold" dia>
            {ui("featured")}
          </Badge>
          <GradeChip grade={product.grade} />
        </div>
        <h3 className="c-h3 mt-5 text-[1.375rem] lg:text-2xl">
          <Link href={link(detailPath(product))} className="c-link">
            {t(product.title)}
          </Link>
        </h3>
        <Echo content={product.title} className="mt-1.5" />
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line">
          <div className="bg-surface px-4 py-3">
            <dt className="c-label">{ui("currentBid")}</dt>
            <dd className="mt-1">
              <Money value={product.currentBid} className="c-num text-2xl font-semibold text-fg" />
            </dd>
          </div>
          <div className="bg-surface px-4 py-3">
            <dt className="c-label">{ui("orBuyNow")}</dt>
            <dd className="mt-1">
              <Money value={product.buyNowPrice} className="c-num text-2xl font-semibold text-fg" />
            </dd>
          </div>
        </dl>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-2">
          <span>{pl("bids", product.bidCount)}</span>
          {saving ? <span className="font-semibold text-success">{ui("belowMarket", { pct: saving })}</span> : null}
        </p>
        <div className="mt-6 flex items-center justify-between gap-3 text-sm">
          <span className="text-fg-2">{ui("endsIn")}</span>
          <CountdownText seconds={remaining} urgency={urgency} className="c-num text-base font-semibold text-fg" />
        </div>
        <TimeBar seconds={remaining} urgency={urgency} inline className="mt-2" />
        <div className="mt-6 sm:mt-auto sm:pt-8">
          <ButtonLink href={link(detailPath(product))} icon={Gavel}>
            {ui("bidNow")}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

/** Featured auctions: the spotlight lot beside the most-bid lots right now. */
export function FeaturedAuctions() {
  const { ui } = useLang();
  const { link } = useConcept();
  return (
    <Section labelledBy="featured-title">
      <SectionHead
        id="featured-title"
        eyebrow={COPY.featuredEyebrow}
        title={UI.featuredAuctions}
        action={
          <ButtonLink href={link("/browse?tab=auction&sort=most_bids")} variant="outline" arrow>
            {ui("viewAll")}
          </ButtonLink>
        }
      />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Spotlight product={FEATURED} />
        </div>
        <div className="flex flex-col lg:col-span-5">
          <p className="c-caps mb-3 text-fg-3">{ui("sortMostBids")}</p>
          <ul className="grid flex-1 auto-rows-fr gap-3">
            {MOST_BID.map((product) => (
              <li key={product.slug} className="flex">
                <MiniLotRow product={product} className="flex-1" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
