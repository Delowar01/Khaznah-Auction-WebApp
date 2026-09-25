"use client";

import { CalendarClock, Clock, Flame, Gavel, Timer } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { detailPath } from "@/lib/catalog";
import { formatDuration } from "@/lib/format";
import { Badge } from "../ui/Badge";
import { buttonClass } from "../ui/Button";
import { useLotClock } from "../ui/Countdown";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { WatchButton } from "../ui/WatchButton";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { CardShell, PriceLabel, SellerLine, SoldOverlay, TitleLink } from "./CardParts";
import { useLotMeta } from "./useLotMeta";

/** Escalating status chip: NEW · AUCTION · UPCOMING · ENDING SOON · CLOSING NOW · SOLD. */
function StatusBadge({ phase, isNew, both }) {
  const { ui } = useLang();
  if (phase === "sold") return <Badge tone="tag-ink">{ui("sold")}</Badge>;
  if (phase === "ended") return <Badge tone="tag-muted">{ui("ended")}</Badge>;
  if (phase === "upcoming") return <Badge tone="tag-indigo" icon={CalendarClock}>{ui("upcoming")}</Badge>;
  if (phase === "critical") return <Badge tone="tag-live" dot>{ui("closingNow")}</Badge>;
  if (phase === "urgent") return <Badge tone="tag-warn" icon={Timer}>{ui("endingSoon")}</Badge>;
  if (isNew) return <Badge tone="tag-new">{ui("newListing")}</Badge>;
  return (
    <Badge tone="tag-indigo" icon={Gavel}>
      {ui("auction")}
      {both ? <span className="@max-[14rem]:hidden">+ {ui("buyNow")}</span> : null}
    </Badge>
  );
}

const STRIP_ICON = { critical: Flame, urgent: Timer, upcoming: CalendarClock };

/** Full-width countdown strip: the auction card's signature. Mono clock, warms with urgency. */
function CountdownStrip({ phase, remaining, startsIn }) {
  const { ui, lang } = useLang();
  const upcoming = phase === "upcoming";
  const seconds = upcoming ? startsIn : remaining;
  const Icon = STRIP_ICON[phase] || Clock;
  const toneText = phase === "critical" ? "text-danger" : phase === "urgent" ? "text-warning" : upcoming ? "text-primary" : "text-fg";
  return (
    <div className="kb-clock flex items-center justify-between gap-2 rounded-lg px-2.5 py-2">
      <span className="flex min-w-0 items-center gap-1.5 kb-2xs font-semibold uppercase tracking-[0.06em] text-fg-3">
        {phase === "critical" ? (
          <span aria-hidden="true" className="kb-pulse size-1.5 shrink-0 rounded-full bg-live" />
        ) : (
          <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.25} />
        )}
        <span className="truncate">{upcoming ? ui("startsIn") : ui("endsIn")}</span>
      </span>
      <span dir="ltr" className={cx("kb-num shrink-0 text-[15px] font-bold leading-none", toneText)}>
        {formatDuration(seconds ?? 0, lang, "clock")}
      </span>
    </div>
  );
}

/** Timed-auction card: prominent mono countdown, escalating status, bid activity, one-tap bid. */
export function AuctionCard({ product, sizes = "(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 46vw", priority = false, className = "" }) {
  const { ui, t, pl } = useLang();
  const { link } = useConcept();
  const { isWatched, toggleWatch, toast } = useStore();
  const meta = useLotMeta(product);
  const { remaining, phase } = useLotClock(product);
  const closed = phase === "sold" || phase === "ended";
  const upcoming = phase === "upcoming";
  const hot = !closed && !upcoming && product.bidCount >= 15;
  const href = link(detailPath(product));

  const priceLabel = phase === "sold" ? ui("soldFor") : closed ? ui("winningBid") : upcoming || !product.bidCount ? ui("startingBid") : ui("currentBid");

  const remind = (event) => {
    event.preventDefault();
    const now = toggleWatch(product.slug);
    toast({ tone: now ? "success" : "neutral", title: ui(now ? "addedToWatchlist" : "removedFromWatchlist"), description: meta.title });
  };

  return (
    <CardShell className={cx((phase === "urgent" || phase === "critical") && "kb-auction-rail", className)}>
      <div className="relative">
        <Plate
          image={meta.image}
          alt={meta.title}
          sizes={sizes}
          priority={priority}
          className="aspect-square"
          imgClassName={cx("transition-transform duration-300 ease-out group-hover/card:scale-[1.045]", closed && "opacity-80 grayscale-[55%]")}
        />
        <div className="pointer-events-none absolute inset-x-2 top-2 z-[5] flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            <StatusBadge phase={phase} isNew={meta.isNew} both={product.saleType === "both"} />
          </div>
          <WatchButton product={product} className="pointer-events-auto" />
        </div>
        {phase === "sold" ? <SoldOverlay amount={product.currentBid} /> : null}
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
          <PriceLabel>{priceLabel}</PriceLabel>
          <div className="flex items-baseline justify-between gap-2">
            <Money value={product.currentBid} className="kb-price text-fg" symbolClassName="text-[0.8em]" />
            {!upcoming && product.bidCount ? (
              <span className={cx("flex shrink-0 items-center gap-1 kb-xs font-semibold", hot ? "text-accent" : "text-fg-3")}>
                {hot ? <Flame aria-hidden="true" className="size-3.5" strokeWidth={2.5} /> : null}
                {pl("bids", product.bidCount)}
              </span>
            ) : null}
          </div>
        </div>

        {closed ? null : <CountdownStrip phase={phase} remaining={remaining} startsIn={product.startsIn} />}

        {upcoming ? (
          <button
            type="button"
            onClick={remind}
            aria-pressed={isWatched(product.slug)}
            className={buttonClass({ variant: "soft", size: "sm", block: true, className: "relative z-10" })}
          >
            {isWatched(product.slug) ? ui("watching") : ui("remindMe")}
          </button>
        ) : (
          <span aria-hidden="true" className={buttonClass({ variant: closed ? "outline" : "primary", size: "sm", block: true })}>
            {closed ? t(COPY.viewResult) : ui("bidNow")}
          </span>
        )}
      </div>
    </CardShell>
  );
}
