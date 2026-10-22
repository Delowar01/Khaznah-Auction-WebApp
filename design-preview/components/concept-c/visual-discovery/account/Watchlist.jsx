"use client";

// Watchlist (spec A §6): lots you bid on (Winning / Outbid) then lots you
// saved (their live status), each with the price, production's ticking
// countdown, "View lot" (the auction activity panel) and, for live
// auctions, "Open auction" and a quick bid. Closed lots are only counted.
// Page 1 only and no remove action, as in production. Production also
// offers the quick bid on live Buy Now listings, which the server refuses;
// here Buy Now items open their product page instead.
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { detailPath, isAuction, sampleBidHistory } from "@/lib/catalog";
import { useElapsed } from "@/lib/clock";
import { moneyText } from "@/lib/format";
import { EmptyState, Notice, Panel, Spinner, Tile } from "../kit/Blocks";
import { SidePanel } from "../kit/Overlay";
import { btn } from "../ui";
import { ACCOUNT_COPY as C } from "./copy";
import { Caption, Ltr, Status, Thumb, TimeRemaining, useAccount, useDates, usePlural } from "./parts";
import { bidType, lotStatus, saleType } from "./status";

function QuickBid({ product }) {
  const { t } = useLang();
  const acc = useAccount();
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Production's minimum: current (or starting) bid plus the increment.
  const nextBid = Number(acc.currentPrice(product) || product.startingBid || 0) + Number(product.increment || 0);
  const submit = async (event) => {
    event.preventDefault();
    const value = Number(amount || nextBid);
    if (!Number.isFinite(value) || value < nextBid || saving) return;
    setSaving(true);
    setError("");
    try {
      await acc.quickBid(product, value);
      setAmount("");
    } catch {
      setError(t(C.bidFailed));
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="grid gap-1.5" data-testid="quick-bid">
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={nextBid}
          step="any"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder={moneyText(nextBid)}
          aria-label={t(C.nextValidBid)}
          dir="ltr"
          className="vd-no-spin h-11 w-32 min-w-0 rounded-full border border-[#cfdaea] bg-white px-4 vd-md text-[var(--vd-ink)] tabular outline-none placeholder:text-[#66769c] focus-visible:border-[var(--vd-indigo)] focus-visible:shadow-[0_0_0_3px_rgb(24_57_151/0.18)] rtl:text-right"
        />
        <button type="submit" disabled={saving} className={btn("gold", "md", "h-11")}>
          {saving ? "…" : t(C.bid)}
        </button>
      </div>
      {error ? (
        <p role="alert" className="vd-xs font-semibold text-[#b3261e]">
          {error}
        </p>
      ) : null}
    </form>
  );
}

function WatchRow({ row }) {
  const { t } = useLang();
  const { link } = useConcept();
  const acc = useAccount();
  const { product } = row;
  const title = t(product.title) || t(C.lotFallback, { id: product.id });
  const live = product.status === "live";
  const auction = isAuction(product);
  const status = row.source === "bid" ? (row.is_winning ? { label: C.winning, tone: "success" } : { label: C.outbid, tone: "danger" }) : product.status ? lotStatus(product.status) : { label: C.saved, tone: "warning" };
  return (
    <li className="py-4 first:pt-0 last:pb-0" data-testid="watch-row" data-slug={product.slug}>
      <div className="flex items-start gap-3 sm:gap-4">
        <Thumb slug={product.slug} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
            <p className="min-w-0 flex-1 basis-48 line-clamp-2 vd-title text-[var(--vd-ink)]">
              <bdi dir="auto">{title}</bdi>
            </p>
            <Status status={status} />
          </div>
          <p className="mt-1 vd-xs text-[var(--vd-muted)]">
            {row.source === "bid" ? (
              <>
                <span className="sm:hidden">{t(C.youBidShort)}</span>
                <span className="max-sm:hidden">{t(C.youBidLong)}</span>
              </>
            ) : (
              t(C.savedAuction)
            )}
          </p>
          <Tile className="mt-3 grid grid-cols-2 gap-3 !py-3">
            <div>
              <Caption>
                <span className="sm:hidden">{t(C.currentBid)}</span>
                <span className="max-sm:hidden">{t(C.priceBid)}</span>
              </Caption>
              <Money value={acc.currentPrice(product)} className="mt-0.5 vd-lg font-extrabold text-[var(--vd-indigo)]" />
            </div>
            <div className="text-end">
              <Caption>{t(C.timeLeft)}</Caption>
              <TimeRemaining endsIn={product.endsIn} className="mt-0.5 block vd-lg font-bold text-[var(--vd-ink)]" />
            </div>
          </Tile>
          <div className="mt-3 flex flex-wrap items-start gap-2">
            <button type="button" onClick={() => acc.openLot(row)} className={btn("soft", "md", "h-11")} data-testid="view-lot">
              {t(C.viewLot)}
            </button>
            {live ? (
              <Link href={link(auction ? `/auction/${product.slug}` : detailPath(product))} className={btn("indigo", "md", "h-11")}>
                {t(C.openAuction)}
              </Link>
            ) : (
              // Production's phone layout says "Auction ended" for every lot that is not live.
              <span className="inline-flex h-11 items-center rounded-full bg-[var(--vd-bluegray)] px-4 vd-sm font-semibold text-[var(--vd-muted)] sm:hidden">{t(C.auctionEnded)}</span>
            )}
            {live && auction ? <QuickBid product={product} /> : null}
          </div>
        </div>
      </div>
    </li>
  );
}

export function Watchlist() {
  const { t } = useLang();
  const { link } = useConcept();
  const acc = useAccount();
  const pc = usePlural();
  const { rows, unavailable } = acc.watchRows;
  if (!rows.length) {
    if (unavailable > 0) {
      return (
        <Panel data-testid="watchlist-inactive">
          <p className="vd-md text-[var(--vd-ink)]">
            {pc("inactiveSaved", unavailable)}
            <span className="max-sm:hidden"> {t(C.browseToSave)}</span>
          </p>
        </Panel>
      );
    }
    return (
      <EmptyState
        icon={Heart}
        title={t(C.noneSaved)}
        headingLevel={3}
        actions={
          <Link href={link("/browse?tab=auction")} className={btn("indigo", "lg")}>
            {t(C.browseAuctions)}
          </Link>
        }
      />
    );
  }
  return (
    <Panel>
      <ul className="divide-y divide-[var(--vd-line)]" data-testid="watchlist">
        {rows.map((row) => (
          <WatchRow key={row.id} row={row} />
        ))}
      </ul>
    </Panel>
  );
}

/** "View lot": the lot, its figures and the public bid log (spec A §6.6). */
export function AuctionDrawer() {
  const { t } = useLang();
  const { link } = useConcept();
  const acc = useAccount();
  const elapsed = useElapsed();
  // The preview's times are relative to page load; fix that moment once.
  const [origin] = useState(() => Date.now() - elapsed * 1000);
  const { dateTime } = useDates();
  const panel = acc.lotPanel;
  const product = panel?.row.product;
  const close = () => acc.setLotPanel(null);
  const bids = product ? sampleBidHistory(product, 8) : [];
  const live = product?.status === "live" && isAuction(product);
  const at = (seconds) => new Date(origin + seconds * 1000).toISOString();
  return (
    <SidePanel
      open={Boolean(panel)}
      onClose={close}
      title={t(C.auctionActivity)}
      width="lg"
      testId="auction-drawer"
      footer={
        product ? (
          <>
            {live ? (
              <Link href={link(`/auction/${product.slug}`)} className={btn("indigo", "lg")}>
                {t(C.viewLiveAuction)}
              </Link>
            ) : (
              <span className="inline-flex h-12 items-center rounded-full bg-[var(--vd-bluegray)] px-5 vd-sm font-semibold text-[var(--vd-muted)]">{t(C.closedAuction)}</span>
            )}
            <button
              type="button"
              onClick={() => {
                close();
                acc.onTab("wallet");
              }}
              className={btn("outline", "lg")}
            >
              {t(C.viewDeposits)}
            </button>
          </>
        ) : null
      }
    >
      {product ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
          {panel.loading ? <Spinner label={t(C.loadingAuction)} showLabel /> : null}
          {panel.error ? (
            <Notice
              tone="danger"
              role="alert"
              title={t(C.auctionFailed)}
              actions={
                <button type="button" onClick={() => acc.openLot(panel.row)} className={btn("outline", "md")}>
                  {t(C.retry)}
                </button>
              }
            />
          ) : null}
          <div className="flex items-start gap-4">
            <Thumb slug={product.slug} size="lg" alt={t(product.title)} />
            <div className="min-w-0">
              <p className="vd-kicker text-[#7a4e0c]">{t(C.lot, { id: product.lot })}</p>
              <p className="mt-1 vd-h3 text-[var(--vd-ink)]">
                <bdi dir="auto">{t(product.title)}</bdi>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Status status={product.status ? lotStatus(product.status) : { label: C.activeStatus, tone: "warning" }} />
                <span className="vd-sm text-[var(--vd-muted)]">{t(saleType(product.saleType).label)}</span>
              </div>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {[
              // From the watchlist production passes no bid amount: always "—" (quirk Q31).
              { label: C.yourBid, value: "—" },
              { label: C.currentBid, value: <Money value={acc.currentPrice(product)} /> },
              { label: C.startingBid, value: product.startingBid != null ? <Money value={product.startingBid} /> : "—" },
              { label: C.bidIncrement, value: product.increment != null ? <Money value={product.increment} /> : "—" },
              { label: C.bidders, value: String(product.bidderCount ?? 0) },
            ].map((item) => (
              <Tile key={item.label.en} className="min-w-0">
                <dt className="vd-xs font-semibold text-[var(--vd-muted)]">{t(item.label)}</dt>
                <dd className="mt-0.5 vd-lg font-extrabold text-[var(--vd-ink)] tabular">{item.value}</dd>
              </Tile>
            ))}
          </dl>
          <section aria-labelledby="bid-log-title" className="rounded-[20px] border border-[var(--vd-line)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 id="bid-log-title" className="vd-h3">
                  {t(C.bidLog)}
                </h3>
                <p className="vd-xs text-[var(--vd-muted)]">{t(C.privateNote)}</p>
              </div>
              {product.endsIn != null ? (
                <p className="vd-xs font-semibold text-[var(--vd-muted)]">
                  {t(C.endsOn, { date: "" })}
                  <Ltr>{dateTime(at(product.endsIn))}</Ltr>
                </p>
              ) : null}
            </div>
            {!panel.loading && !bids.length ? <p className="mt-3 vd-sm text-[var(--vd-muted)]">{t(C.noBids)}</p> : null}
            <ul className="mt-3 grid gap-2">
              {bids.map((bid) => (
                <li key={bid.id} className="flex items-center justify-between gap-3 rounded-[14px] bg-[#f6f8fc] px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate vd-md font-bold text-[var(--vd-ink)]">{t(bid.label) || t(C.bidder)}</p>
                    <p className="vd-xs text-[var(--vd-muted)]">
                      <Ltr>{dateTime(at(-bid.secondsAgo))}</Ltr> · {t(bidType(bid.type).label)}
                    </p>
                  </div>
                  <div className="shrink-0 text-end">
                    <Money value={bid.amount} className="vd-md font-extrabold text-[var(--vd-ink)]" />
                    {bid.isWinning ? <p className="vd-xs font-bold text-[var(--vd-grade-a)]">{t(C.winning)}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </SidePanel>
  );
}

