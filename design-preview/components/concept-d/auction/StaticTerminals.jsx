"use client";

import { ArrowDown, Bookmark, CheckCircle2, Trophy } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { useElapsed } from "@/lib/clock";
import { formatAgo, formatNumber } from "@/lib/format";
import { Button } from "../ui/Button";
import { StatusChip } from "../ui/Chips";
import { StepChart } from "../ui/StepChart";
import { usePriceTooltip } from "../ui/PriceTooltip";
import { pricePoints, timeFraction } from "../lib/data";
import { useCopy } from "../lib/useCopy";
import { TerminalClock } from "./TerminalClock";
import { DepositRow, MarketMeter } from "./TerminalBits";
import { BidderBanner } from "./BidderBanner";

function Shell({ children }) {
  const c = useCopy();
  return (
    <section aria-labelledby="terminal-title" className="d-panel relative overflow-hidden shadow-raised">
      <div aria-hidden="true" className="d-glow pointer-events-none absolute -end-24 -top-28 size-72" />
      <h2 id="terminal-title" className="sr-only">
        {c("console")}
      </h2>
      <div className="relative space-y-5 p-4 sm:p-5">{children}</div>
    </section>
  );
}

/** Scheduled lot: countdown to opening, opening bid, watch. */
export function UpcomingTerminal({ product, auction }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const c = useCopy();
  const elapsed = useElapsed();
  const watched = isWatched(product.slug);
  return (
    <Shell>
      <TerminalClock phase="upcoming" seconds={auction.startsIn} fraction={timeFraction(product, { phase: "upcoming", startsIn: auction.startsIn })} elapsed={elapsed} upcoming />
      <div className="d-hairline" />
      <div>
        <p className="d-label text-fg-3">{ui("openingBid")}</p>
        <Money value={product.startingBid} className="d-num mt-1.5 text-[42px] font-medium leading-none text-fg" />
        <p className="mt-3 text-sm text-fg-2">{c("upcomingText")}</p>
        <p className="mt-2 text-xs text-fg-3">
          {ui("minIncrement")} <Money value={product.increment} className="d-num text-fg-2" /> · <span className="d-num">{formatNumber(auction.watchers)}</span> {ui("watchers")}
        </p>
      </div>
      <Button
        variant={watched ? "secondary" : "gold"}
        size="xl"
        icon={Bookmark}
        className="w-full"
        aria-pressed={watched}
        onClick={() => {
          const now = toggleWatch(product.slug);
          toast({ tone: now ? "success" : "neutral", title: ui(now ? "addedToWatchlist" : "removedFromWatchlist"), description: t(product.title) });
        }}
      >
        {watched ? ui("watching") : ui("remindMe")}
      </Button>
      <MarketMeter product={product} currentBid={product.startingBid} />
      <div className="border-t border-line pt-4">
        <DepositRow deposit={auction.deposit} extended={false} />
      </div>
    </Shell>
  );
}

/** Sold, ended or bought-now lot: final price and what happens next. */
export function ClosedTerminal({ product, auction, purchased = false }) {
  const { ui, lang, money } = useLang();
  const c = useCopy();
  const elapsed = useElapsed();
  const tooltip = usePriceTooltip();
  const sold = auction.phase === "sold";
  const title = purchased ? c("purchasedTitle") : sold ? ui("soldFor") : ui("auctionEnded");
  const text = purchased ? c("purchasedText") : sold ? c("soldText") : c("endedText");
  const price = purchased ? product.buyNowPrice : auction.currentBid;
  const points = pricePoints(auction.history, auction.currentBid, product.startingBid);
  const closedAgo = product.endsIn < 0 ? -product.endsIn + elapsed : null;
  const stats = [
    { label: c("bidsBidders"), value: auction.bidCount },
    { label: c("biddersLabel"), value: auction.bidderCount },
    { label: c("watchingLabel"), value: auction.watchers },
  ];
  return (
    <Shell>
      <div className="flex items-center justify-between gap-3">
        <StatusChip status={purchased ? "won" : sold ? "sold" : "ended"} label={purchased ? c("purchasedTitle") : undefined} />
        <span className="text-xs text-fg-3">
          {c("endedAt")} {closedAgo != null ? formatAgo(closedAgo, lang) : null}
        </span>
      </div>
      <div className={`rounded-xl p-5 ${purchased ? "d-winning bg-accent/10" : "bg-surface-2 ring-1 ring-inset ring-line"}`}>
        <p className="flex items-center gap-2 text-sm font-medium text-fg">
          {purchased ? <Trophy aria-hidden="true" className="size-4 text-auction" /> : <CheckCircle2 aria-hidden="true" className="size-4 text-success" />}
          {title}
        </p>
        <Money value={price} className="d-num mt-2 text-[42px] font-medium leading-none text-fg" />
        <p className="mt-3 text-sm text-fg-2">{text}</p>
      </div>
      <dl className="grid grid-cols-3 divide-x divide-line rounded-xl border border-line rtl:divide-x-reverse">
        {stats.map((stat) => (
          <div key={stat.label} className="px-3 py-2.5">
            <dt className="truncate text-[11px] text-fg-3">{stat.label}</dt>
            <dd className="d-num mt-1 text-base font-medium text-fg">{formatNumber(stat.value)}</dd>
          </div>
        ))}
      </dl>
      {points.length > 1 ? (
        <div>
          <p className="d-label mb-2 text-fg-3">{c("priceHistory")}</p>
          <StepChart points={points} height={80} tooltip={tooltip} label={c("priceChartLabel", { from: money(points[0].amount), to: money(auction.currentBid), n: points.length })} />
        </div>
      ) : null}
      {!purchased ? <BidderBanner state={auction.bidderState === "won" || auction.bidderState === "lost" ? auction.bidderState : null} /> : null}
      <Button href="#similar" variant="secondary" size="lg" icon={ArrowDown} className="w-full">
        {ui("similarAuctions")}
      </Button>
    </Shell>
  );
}
