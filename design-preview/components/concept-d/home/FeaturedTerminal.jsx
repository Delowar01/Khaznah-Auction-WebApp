"use client";

import Link from "next/link";
import { Eye, Gavel, Timer, Users } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { getProduct, FEATURED_AUCTION } from "@/data/products";
import { getSeller } from "@/data/sellers";
import { useElapsed } from "@/lib/clock";
import { bidAge } from "@/lib/useAuction";
import { detailPath } from "@/lib/catalog";
import { formatAgo, formatDuration, formatNumber } from "@/lib/format";
import { useLot } from "../market/MarketProvider";
import { LotImage } from "../ui/LotImage";
import { CountdownRing } from "../ui/CountdownRing";
import { StepChart } from "../ui/StepChart";
import { StatusChip, DeltaChip, LotTag } from "../ui/Chips";
import { GradeChip } from "../ui/GradeChip";
import { Button } from "../ui/Button";
import { usePriceTooltip } from "../ui/PriceTooltip";
import { pricePoints, timeFraction, toneOf } from "../lib/data";
import { useTween } from "../lib/hooks";
import { useCopy } from "../lib/useCopy";
import { auctionChip } from "../cards/useLotView";

const TONE_TEXT = { ink: "text-fg", warning: "text-warning", danger: "text-live", upcoming: "d-ink", muted: "text-fg-3" };

/** Featured-lot terminal in the hero (fridge-690): ring, live price, chart, last bids. */
export function FeaturedTerminal() {
  const product = getProduct(FEATURED_AUCTION);
  const seller = getSeller(product.seller);
  const a = useLot(product.slug);
  const { link } = useConcept();
  const { t, ui, lang, money } = useLang();
  const c = useCopy();
  const elapsed = useElapsed();
  const tooltip = usePriceTooltip();
  const price = useTween(a.currentBid);
  const points = pricePoints(a.history, a.currentBid, product.startingBid);
  const tone = toneOf(a.phase);
  const fraction = timeFraction(product, { phase: a.phase, remaining: a.remaining });
  const href = link(detailPath(product));
  const rise = a.currentBid - product.startingBid;

  return (
    <article aria-labelledby="featured-lot-title" className="d-panel relative min-w-0 overflow-hidden p-4 shadow-raised sm:p-5">
      <div aria-hidden="true" className="d-glow pointer-events-none absolute -end-24 -top-24 size-72" />
      <div className="relative flex flex-wrap items-center gap-2">
        <StatusChip status={auctionChip(a.phase)} />
        {a.buyNowAvailable ? <StatusChip status="buyNow" /> : null}
        <span className="d-label ms-auto hidden text-fg-3 sm:inline">{c("featuredLot")}</span>
        <LotTag lot={product.lot} />
      </div>

      <div className="relative mt-4 grid grid-cols-[112px_minmax(0,1fr)] gap-4 sm:grid-cols-[148px_minmax(0,1fr)] sm:gap-5">
        <LotImage image={product.images[0]} alt={t(product.title)} priority sizes="160px" className="aspect-square rounded-xl ring-1 ring-line" inset="p-3" />
        <div className="flex min-w-0 flex-col">
          <h2 id="featured-lot-title" className="line-clamp-2 text-[15px] font-medium leading-snug text-fg sm:text-base">
            <Link href={href} className="hover:underline">
              {t(product.title)}
            </Link>
          </h2>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-fg-3">
            <GradeChip grade={product.grade} size="sm" />
            <span className="truncate">{t(seller.name)}</span>
          </p>
          <div className="mt-auto flex items-center gap-3 pt-3">
            <CountdownRing fraction={fraction} size={56} stroke={4} tone={tone} head>
              <Timer aria-hidden="true" className="size-4 text-fg-3" />
            </CountdownRing>
            <div className="min-w-0">
              <p className="d-label text-fg-3">{ui("endsIn")}</p>
              <p className={`d-num text-lg font-medium sm:text-xl ${TONE_TEXT[tone]}`}>{formatDuration(a.remaining, lang, "clock")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 border-t border-line pt-4">
        <div className="min-w-0">
          <p className="d-label text-fg-3">{ui("currentBid")}</p>
          <p key={a.flash} className={`d-num -ms-1 mt-1 inline-block px-1 text-[34px] font-medium leading-none text-fg sm:text-[40px] ${a.flash ? "d-flash" : ""}`}>
            <Money value={price} />
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-fg-3">
            <DeltaChip amount={rise} />
            <span>{c("sinceOpening")}</span>
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-3 text-end sm:gap-4">
          {[
            { icon: Gavel, label: c("bidsBidders"), value: a.bidCount },
            { icon: Users, label: c("biddersLabel"), value: a.bidderCount },
            { icon: Eye, label: c("watchingLabel"), value: a.watchers },
          ].map((s) => (
            <div key={s.label}>
              <dt className="flex items-center justify-end gap-1 text-[11px] text-fg-3">
                <s.icon aria-hidden="true" className="size-3" />
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sr-only sm:hidden">{s.label}</span>
              </dt>
              <dd className="d-num mt-0.5 text-sm font-medium text-fg">{formatNumber(s.value)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative mt-4">
        <p className="d-label mb-2 text-fg-3">{c("priceHistory")}</p>
        <StepChart
          points={points}
          height={84}
          tooltip={tooltip}
          label={c("priceChartLabel", { from: money(points[0]?.amount ?? product.startingBid), to: money(a.currentBid), n: points.length })}
        />
      </div>

      <div className="relative mt-4">
        <p className="d-label mb-1.5 text-fg-3">{c("recentBids")}</p>
        <ul className="divide-y divide-line">
          {a.history.slice(0, 3).map((row) => (
            <li key={row.id} className="kz-fade-up flex items-center gap-3 py-2 text-[13px]">
              <span className={`size-1.5 shrink-0 rounded-full ${row.isOwn ? "bg-accent" : row.isWinning ? "bg-[var(--d-ink)]" : "bg-fg-3/50"}`} aria-hidden="true" />
              <span className={`flex-1 truncate ${row.isOwn ? "font-medium text-auction" : "text-fg-2"}`}>{t(row.label)}</span>
              <span className="text-xs text-fg-3">{formatAgo(bidAge(row, elapsed), lang)}</span>
              <Money value={row.amount} className={`d-num w-24 justify-end text-end font-medium ${row.isWinning ? "text-fg" : "text-fg-2"}`} />
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-4 grid gap-2.5 sm:grid-cols-2">
        <Button href={href} variant="gold" size="lg" icon={Gavel}>
          {ui("placeBid")}
        </Button>
        {a.buyNowAvailable ? (
          <Button href={href} variant="secondary" size="lg" className="px-3">
            <span className="truncate">{ui("buyNow")}</span>
            <Money value={product.buyNowPrice} className="d-num" />
          </Button>
        ) : (
          <Button href={href} variant="secondary" size="lg">
            {c("openLot")}
          </Button>
        )}
      </div>
    </article>
  );
}
