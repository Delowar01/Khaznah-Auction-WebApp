"use client";

import { ArrowDown, BellRing, Gavel, Info, ShieldCheck, TrendingDown, Trophy, Zap } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useWinner } from "@/components/shared/auction/hooks";
import { Money } from "@/components/shared/ui/Money";
import { marketSaving } from "@/lib/catalog";
import { PriceLabel } from "../cards/CardParts";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { cx } from "../ui/cx";

/** Price label and amount (flashes when it moves), with bids · bidders · watching beside it. */
export function PriceBlock({ detail, compact = false }) {
  const { t } = useLang();
  const { auction, upcoming, priceLabel, price } = detail;
  const cells = [
    { key: "bids", label: t(C.statsBids), value: auction.bidCount },
    { key: "bidders", label: t(C.statsBidders), value: auction.bidderCount },
    { key: "watch", label: t(C.statsWatching), value: auction.watchers },
  ];
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        <PriceLabel>{priceLabel}</PriceLabel>
        <Money
          key={auction.flash}
          value={price}
          className={cx("-mx-1 rounded-md px-1 text-fg", compact ? "kb-price" : "kb-price-lg", auction.flash ? "kz-flash" : "")}
          symbolClassName="text-[0.7em]"
        />
      </div>
      {upcoming ? null : (
        <dl className="flex divide-x divide-line rounded-lg border border-line rtl:divide-x-reverse">
          {cells.map((cell) => (
            <div key={cell.key} className="px-2.5 py-1.5 text-center">
              <dt className="kb-2xs text-fg-3">{cell.label}</dt>
              <dd className="kb-md font-extrabold text-fg tabular">{cell.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/** "Typical market price" with the saving against the current bid. */
export function MarketCompare({ product, bid }) {
  const { ui } = useLang();
  if (!product.marketPrice) return null;
  const pct = marketSaving(product, bid);
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg bg-surface-2 px-3 py-2">
      <p className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 kb-xs text-fg-3">
        {ui("marketPrice")}
        <Money value={product.marketPrice} className="kb-sm font-bold text-fg-2" />
      </p>
      {pct > 0 ? (
        <Badge tone="accent" size="md" icon={TrendingDown}>
          {ui("belowMarket", { pct })}
        </Badge>
      ) : null}
    </div>
  );
}

/** Deposit coverage and the anti-sniping rule. */
export function BidNotes({ auction }) {
  const { ui } = useLang();
  return (
    <ul className="grid gap-2">
      <li className="flex items-start gap-2 kb-xs text-fg-2">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
        <span>
          <span className="font-semibold text-fg">{ui("depositCovered")}</span> · {ui("walletBalance")}{" "}
          <Money value={auction.deposit.walletBalance} className="font-semibold text-fg" />
        </span>
      </li>
      <li className="flex items-start gap-2 kb-xs text-fg-2">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>{ui("antiSnipe")}</span>
      </li>
    </ul>
  );
}

/**
 * Buy Now on an auction lot, set apart under the bidding: a quiet outlined
 * action after a dashed rule, so bidding stays the main path.
 */
export function BuyNowOption({ detail }) {
  const { ui } = useLang();
  const { product, buyNow } = detail;
  return (
    <div className="border-t border-dashed border-line-strong pt-4">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0">
          <span className="block kb-xs font-semibold text-fg-2">{ui("orBuyNow")}</span>
          <Money value={product.buyNowPrice} className="kb-price-sm text-fg" />
        </p>
        <Button variant="outline" size="sm" icon={Zap} disabled={!buyNow.available} onClick={buyNow.show} data-testid="buy-now">
          {ui("buyItNow")}
        </Button>
      </div>
      <p className="mt-1.5 kb-xs text-fg-3">{ui("buyNowClosesAuction")}</p>
    </div>
  );
}

/** Upcoming lots: when bidding opens, and Watch to keep the lot in view. */
export function UpcomingActions({ product }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const on = isWatched(product.slug);
  return (
    <div className="grid gap-3">
      <p className="rounded-lg bg-primary/5 px-3 py-2.5 kb-sm text-fg-2 ring-1 ring-primary/15">{t(C.upcomingNote)}</p>
      <Button
        size="lg"
        block
        variant={on ? "soft" : "primary"}
        icon={BellRing}
        aria-pressed={on}
        data-testid="remind-button"
        onClick={() => {
          const now = toggleWatch(product.slug);
          toast({ tone: now ? "success" : "neutral", title: ui(now ? "addedToWatchlist" : "removedFromWatchlist"), description: t(product.title) });
        }}
      >
        {on ? ui("watching") : ui("remindMe")}
      </Button>
    </div>
  );
}

/** Closed lots: the winning bidder, bidding switched off, and the way on to similar auctions. */
export function ClosedActions({ detail }) {
  const { ui } = useLang();
  const winner = useWinner(detail);
  return (
    <div className="grid gap-2">
      {winner ? (
        <p className="flex items-center gap-2 kb-sm text-fg-2">
          <Trophy aria-hidden="true" className="size-4 shrink-0 text-fg-3" />
          {winner.label}: <span className="font-bold text-fg">{winner.name}</span>
        </p>
      ) : null}
      <Button size="lg" block icon={Gavel} disabled data-testid="place-bid">
        {ui("placeBid")}
      </Button>
      <a
        href="#similar-auctions"
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-control border border-primary/40 kb-sm font-bold text-primary transition-colors hover:bg-primary/5"
      >
        {ui("similarAuctions")}
        <ArrowDown aria-hidden="true" className="size-4" />
      </a>
    </div>
  );
}
