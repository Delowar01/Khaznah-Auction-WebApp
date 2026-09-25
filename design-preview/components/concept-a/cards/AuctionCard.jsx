"use client";

import { Gavel } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { detailPath } from "@/lib/catalog";
import { Badge } from "../ui/Badge";
import { buttonClass } from "../ui/Button";
import { Duration, useLotClock } from "../ui/Countdown";
import { Plate } from "../ui/Plate";
import { WatchButton } from "../ui/WatchButton";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { CardFrame, CardMeta, CardShell, PriceLabel, SoldOverlay, TitleLink } from "./CardParts";
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

// Phase-coloured tones for the countdown: neutral while calm, amber under an
// hour, red at the close, indigo before the lot opens.
const CLOCK_TEXT = { live: "text-fg-2", urgent: "text-warning", critical: "text-danger", upcoming: "text-primary" };
const CLOCK_RULE = { live: "bg-line-strong", urgent: "bg-warning", critical: "bg-danger", upcoming: "bg-primary" };

/**
 * The concept's countdown: a small tracked time figure resting on a thin
 * phase-coloured baseline rule — a refined, gallery-label alternative to a
 * filled pill or a boxed clock strip. The rule warms and pulses as time runs out.
 */
function LotCountdown({ phase, remaining, prefix }) {
  const { ui } = useLang();
  const done = phase === "ended" || phase === "sold";
  const text = done ? "text-fg-3" : CLOCK_TEXT[phase] || CLOCK_TEXT.live;
  const rule = done ? "bg-line-strong" : CLOCK_RULE[phase] || CLOCK_RULE.live;
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline gap-1.5 whitespace-nowrap">
        {prefix ? <span className="kb-eyebrow text-fg-3">{prefix}</span> : null}
        {done ? (
          <span className={cx("kb-sm font-semibold tabular", text)}>{ui(phase === "sold" ? "sold" : "ended")}</span>
        ) : (
          <Duration seconds={remaining} className={cx("kb-sm font-semibold", text)} />
        )}
      </div>
      <div aria-hidden="true" className={cx("mt-1.5 h-px w-full", rule, phase === "critical" && "kb-pulse")} />
    </div>
  );
}

/** Timed-auction card: framed lot, focal serif bid, baseline-rule countdown, one-tap bid. */
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
      <CardFrame>
        <Plate
          image={meta.image}
          alt={meta.title}
          sizes={sizes}
          priority={priority}
          className="aspect-square rounded-sm"
          imgClassName={cx("transition-transform duration-300 ease-out group-hover/card:scale-[1.045]", closed && "opacity-80 grayscale-[55%]")}
        />
        <div className="pointer-events-none absolute inset-x-2 top-2 z-[3] flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            <StatusBadge phase={phase} isNew={meta.isNew} both={product.saleType === "both"} />
          </div>
          <WatchButton product={product} className="pointer-events-auto" />
        </div>
        {phase === "sold" ? <SoldOverlay amount={product.currentBid} /> : null}
      </CardFrame>

      <div className="flex flex-1 flex-col p-4">
        <div>
          <PriceLabel>{priceLabel}</PriceLabel>
          <div className="mt-0.5 flex items-baseline justify-between gap-2">
            <Money value={product.currentBid} className="kb-price text-fg" symbolClassName="text-[0.72em]" />
            {!upcoming ? <span className="shrink-0 kb-xs text-fg-3">{pl("bids", product.bidCount)}</span> : null}
          </div>
        </div>

        <div className="mt-3">
          <h3 className="min-h-[2lh] kb-lg font-medium">
            <TitleLink href={href}>{meta.title}</TitleLink>
          </h3>
          <p className="mt-1 truncate kb-xs text-fg-3">{meta.typeLine}</p>
        </div>

        <CardMeta seller={meta.seller} name={meta.sellerName} grade={product.grade} />

        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-2.5">
          <LotCountdown phase={phase} remaining={remaining} prefix={upcoming ? ui("startsIn") : undefined} />
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
