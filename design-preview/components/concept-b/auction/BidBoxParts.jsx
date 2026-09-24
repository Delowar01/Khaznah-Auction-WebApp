"use client";

import { BellRing, Info, ShieldCheck, TrendingDown, Zap } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { marketSaving } from "@/lib/catalog";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { COPY } from "../copy";

/** Bids · bidders · watching as three compact stat cells. */
export function BidStats({ auction }) {
  const { t } = useLang();
  const cells = [
    { key: "bids", label: t(COPY.statsBids), value: auction.bidCount },
    { key: "bidders", label: t(COPY.statsBidders), value: auction.bidderCount },
    { key: "watch", label: t(COPY.statsWatching), value: auction.watchers },
  ];
  return (
    <dl className="grid grid-cols-3 divide-x divide-line rounded-lg border border-line">
      {cells.map((cell) => (
        <div key={cell.key} className="px-3 py-2">
          <dt className="kb-2xs text-fg-3">{cell.label}</dt>
          <dd className="kb-md font-extrabold text-fg tabular">{cell.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** "Typical market price" with the saving against the current bid. */
export function MarketCompare({ product, bid }) {
  const { ui } = useLang();
  if (!product.marketPrice) return null;
  const pct = marketSaving(product, bid);
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg bg-surface-2 px-3 py-2.5">
      <div className="min-w-0">
        <p className="kb-2xs text-fg-3">{ui("marketPrice")}</p>
        <Money value={product.marketPrice} className="kb-sm font-bold text-fg-2" />
      </div>
      {pct > 0 ? (
        <Badge tone="accent" size="md" icon={TrendingDown}>
          {ui("belowMarket", { pct })}
        </Badge>
      ) : null}
    </div>
  );
}

/** Deposit coverage and anti-sniping notes. */
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

/** Gold "Or buy it now" box for sale type "both". */
export function BuyNowOption({ product, auction, bought, onBuyNow }) {
  const { ui } = useLang();
  const available = auction.buyNowAvailable && !bought;
  return (
    <div className="rounded-xl border border-accent/60 bg-accent/10 p-4">
      <p className="kb-xs font-bold text-fg-2">{ui("orBuyNow")}</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <Money value={product.buyNowPrice} className="kb-price text-fg" symbolClassName="text-[0.8em]" />
        <Button variant="accent" size="sm" icon={Zap} disabled={!available} onClick={onBuyNow}>
          {ui("buyItNow")}
        </Button>
      </div>
      <p className="mt-1.5 kb-xs text-fg-2">{ui("buyNowClosesAuction")}</p>
    </div>
  );
}

/** Upcoming lots: explain when bidding opens and offer a reminder. */
export function UpcomingActions({ product }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const on = isWatched(product.slug);
  return (
    <div className="grid gap-3">
      <p className="rounded-lg bg-primary/5 px-3 py-2.5 kb-sm text-fg-2 ring-1 ring-primary/15">{t(COPY.upcomingNote)}</p>
      <Button
        size="lg"
        block
        variant={on ? "soft" : "primary"}
        icon={BellRing}
        aria-pressed={on}
        data-testid="watch-button"
        onClick={() => {
          const now = toggleWatch(product.slug);
          toast({ tone: now ? "success" : "neutral", title: now ? t(COPY.reminderSet) : ui("removedFromWatchlist"), description: t(product.title) });
        }}
      >
        {on ? t(COPY.reminderOn) : ui("remindMe")}
      </Button>
    </div>
  );
}
