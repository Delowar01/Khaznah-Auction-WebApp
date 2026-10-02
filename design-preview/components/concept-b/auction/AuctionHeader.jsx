"use client";

import Link from "next/link";
import { CircleHelp, Eye, Share2, Store } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useShareLink } from "@/components/shared/auction/hooks";
import { Badge } from "../ui/Badge";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { Button } from "../ui/Button";
import { GradeChip } from "../ui/GradeChip";
import { WatchButton } from "../ui/WatchButton";
import { PhaseBadge } from "./AuctionClock";

/**
 * White lot band, like Browse's summary band: breadcrumb, status chips and
 * lot number, the H1, then grade (with the guide), type, seller and
 * watchers, and Watch / Share at the end.
 */
export function AuctionHeader({ detail, info }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const share = useShareLink();
  const { product, auction, dual } = detail;

  return (
    <section aria-labelledby="kb-lot-title" className="border-b border-line bg-surface">
      <div className="kb-container pb-5 pt-4">
        <Breadcrumbs items={info.crumbs.map((crumb) => ({ label: crumb.label, href: crumb.href ? link(crumb.href) : undefined }))} />
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <PhaseBadge phase={auction.phase} />
              {dual ? (
                <Badge tone="primary" size="md">
                  {t(C.auctionAndBuyNow)}
                </Badge>
              ) : null}
              {info.quantity ? (
                <Badge tone="ink" size="md">
                  {info.quantity}
                </Badge>
              ) : null}
              <span className="kb-xs text-fg-3">
                {ui("lotNumber")}{" "}
                <span dir="ltr" className="font-semibold text-fg-2 tabular">
                  {product.lot}
                </span>
              </span>
            </div>
            <h1 id="kb-lot-title" className="mt-2 kb-h1 text-balance text-fg">
              {info.title}
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 kb-sm">
              <span className="inline-flex items-center gap-2">
                <GradeChip grade={product.grade} size="md" />
                <button type="button" onClick={detail.guide.show} className="inline-flex items-center gap-1 rounded-sm font-semibold text-primary underline-offset-4 hover:underline">
                  <CircleHelp aria-hidden="true" className="size-4" />
                  {ui("whatGradeMeans")}
                </button>
              </span>
              <span className="text-fg-2">{info.typeLine}</span>
              {info.seller ? (
                <span className="inline-flex items-center gap-1 text-fg-2">
                  <Store aria-hidden="true" className="size-4 text-fg-3" />
                  {ui("soldBy")}{" "}
                  <Link href={link(info.sellerHref)} className="font-semibold text-fg underline-offset-4 hover:text-primary hover:underline">
                    {info.sellerName}
                  </Link>
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 text-fg-3">
                <Eye aria-hidden="true" className="size-4" />
                {pl("watching", auction.watchers)}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <WatchButton product={product} variant="full" testId="watch-button" />
            <Button variant="outline" icon={Share2} onClick={share} data-testid="share-button">
              {ui("share")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
