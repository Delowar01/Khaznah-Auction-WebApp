"use client";

import { Gavel } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { detailPath } from "@/lib/catalog";
import { Badge } from "../ui/Badge";
import { buttonClass } from "../ui/Button";
import { CountdownPill, useLotClock } from "../ui/Countdown";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { WatchButton } from "../ui/WatchButton";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { CardShell, PriceLabel, SellerLine, SoldOverlay, TitleLink } from "./CardParts";
import { useLotMeta } from "./useLotMeta";

function StatusBadge({ phase, isNew, both }) {
  const { ui } = useLang();
  if (phase === "sold") return <Badge tone="tag-ink">{ui("sold")}</Badge>;
  if (phase === "ended") return <Badge tone="tag-muted">{ui("ended")}</Badge>;
  if (phase === "upcoming") return <Badge tone="tag-indigo">{ui("upcoming")}</Badge>;
  if (phase === "critical") return <Badge tone="tag-live" dot>{ui("closingNow")}</Badge>;
  if (phase === "urgent") return <Badge tone="tag-warn">{ui("endingSoon")}</Badge>;
  if (isNew) return <Badge tone="tag-new">{ui("newListing")}</Badge>;
  return (
    <Badge tone="tag-indigo" icon={Gavel}>
      {ui("auction")}
      {both ? <span className="@max-[14rem]:hidden">+ {ui("buyNow")}</span> : null}
    </Badge>
  );
}

/** Timed-auction card: live price, bid count, urgency-coloured countdown, one-tap bid. */
export function AuctionCard({ product, sizes = "(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 46vw", priority = false, className = "" }) {
  const { ui, t, pl } = useLang();
  const { link } = useConcept();
  const { isWatched, toggleWatch, toast } = useStore();
  const meta = useLotMeta(product);
  const { remaining, phase } = useLotClock(product);
  const closed = phase === "sold" || phase === "ended";
  const upcoming = phase === "upcoming";
  const href = link(detailPath(product));

  const priceLabel = phase === "sold" ? ui("soldFor") : closed ? ui("winningBid") : upcoming || !product.bidCount ? ui("startingBid") : ui("currentBid");

  const remind = (event) => {
    event.preventDefault();
    const now = toggleWatch(product.slug);
    toast({ tone: now ? "success" : "neutral", title: ui(now ? "addedToWatchlist" : "removedFromWatchlist"), description: meta.title });
  };

  return (
    <CardShell className={className}>
      <div className="relative">
        <Plate
          image={meta.image}
          alt={meta.title}
          sizes={sizes}
          priority={priority}
          className="aspect-square"
          imgClassName={cx("transition-transform duration-300 ease-out group-hover/card:scale-[1.045]", closed && "opacity-80 grayscale-[55%]")}
        />
        <div className="pointer-events-none absolute inset-x-2 top-2 z-[3] flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            <StatusBadge phase={phase} isNew={meta.isNew} both={product.saleType === "both"} />
          </div>
          <WatchButton product={product} className="pointer-events-auto" />
        </div>
        {phase === "sold" ? <SoldOverlay amount={product.currentBid} /> : null}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <SellerLine seller={meta.seller} name={meta.sellerName} />
        <h3 className="min-h-[2lh] kb-lg font-medium">
          <TitleLink href={href}>{meta.title}</TitleLink>
        </h3>
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <GradeChip grade={product.grade} />
          <span className="truncate kb-xs text-fg-3">{meta.typeLine}</span>
        </div>

        <div className="mt-auto pt-1.5">
          <PriceLabel>{priceLabel}</PriceLabel>
          <div className="mt-0.5 flex items-baseline justify-between gap-2">
            <Money value={product.currentBid} className="kb-price text-fg" symbolClassName="text-[0.72em]" />
            {!upcoming ? <span className="shrink-0 kb-xs text-fg-3">{pl("bids", product.bidCount)}</span> : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
          <CountdownPill phase={phase} remaining={remaining} prefix={upcoming ? ui("startsIn") : undefined} />
          {upcoming ? (
            <button
              type="button"
              onClick={remind}
              aria-pressed={isWatched(product.slug)}
              className={buttonClass({ variant: "soft", size: "xs", className: "relative z-10 @max-[13rem]:w-full" })}
            >
              {isWatched(product.slug) ? ui("watching") : ui("remindMe")}
            </button>
          ) : (
            <span aria-hidden="true" className={buttonClass({ variant: closed ? "outline" : "primary", size: "xs", className: "@max-[13rem]:w-full" })}>
              {closed ? t(COPY.viewResult) : ui("bidNow")}
            </span>
          )}
        </div>
      </div>
    </CardShell>
  );
}
