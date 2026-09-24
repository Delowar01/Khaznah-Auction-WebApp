"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { AUCTION_POLICY } from "@/data/site";
import { UI } from "@/data/ui";
import { useElapsed } from "@/lib/clock";
import { formatAgo } from "@/lib/format";
import { bidAge } from "@/lib/useAuction";
import { COPY } from "../copy";
import { Badge } from "../ui/Badges";
import { Diamond } from "../ui/Diamond";
import { DiamondList } from "../ui/Misc";
import { EyebrowRule } from "../ui/Section";
import { cx } from "../ui/cx";

/** Bid history as a clean table; the leading bid carries a gold diamond. */
export function BidHistory({ auction }) {
  const { t, ui, pl, lang } = useLang();
  const elapsed = useElapsed();
  const rows = auction.history;
  return (
    <section aria-labelledby="history-title">
      <EyebrowRule content={UI.bidHistory} className="mb-5" />
      <h2 id="history-title" className="sr-only">
        {ui("bidHistory")}
      </h2>
      {rows.length ? (
        <p className="mb-4 text-sm text-fg-2">
          {pl("bids", auction.bidCount)} · {pl("bidders", auction.bidderCount)}
        </p>
      ) : null}
      {rows.length ? (
        <div role="region" aria-labelledby="history-title" tabIndex={0} className="overflow-x-auto rounded-md border border-line bg-surface outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <table className="w-full min-w-[18rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line-strong text-fg-3">
                <th scope="col" className="px-3 py-3 text-start font-medium sm:px-4">
                  {t(COPY.bidderCol)}
                </th>
                <th scope="col" className="px-3 py-3 text-start font-medium sm:px-4">
                  {t(COPY.amountCol)}
                </th>
                <th scope="col" className="px-3 py-3 text-end font-medium sm:px-4">
                  {t(COPY.timeCol)}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={cx("border-b border-line last:border-b-0", row.isOwn && "bg-primary/6")}>
                  <td className="px-3 py-3 sm:px-4">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Diamond size={6} className={row.isWinning ? "text-accent" : "text-line-strong"} />
                      <span className={cx("font-medium", row.isOwn ? "text-primary" : "text-fg")}>{t(row.label)}</span>
                      {row.isWinning ? <span className="text-xs font-semibold text-success">{ui("highest")}</span> : null}
                      {row.type === "proxy_auto" ? <Badge tone="muted">{ui("autoBid")}</Badge> : null}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <Money value={row.amount} className={cx("c-num", row.isWinning ? "font-semibold text-fg" : "text-fg-2")} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-end text-fg-3 sm:px-4">{formatAgo(bidAge(row, elapsed), lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-md border border-dashed border-line-strong px-4 py-6 text-center text-fg-2">{ui("noBidsYet")}</p>
      )}
    </section>
  );
}

/** Auction terms with diamond bullets. */
export function AuctionTerms() {
  const { t, ui, money } = useLang();
  return (
    <section aria-labelledby="terms-title">
      <EyebrowRule content={UI.auctionTerms} className="mb-5" />
      <h2 id="terms-title" className="sr-only">
        {ui("auctionTerms")}
      </h2>
      <DiamondList
        className="text-[0.9375rem] text-fg-2"
        items={[
          t(COPY.depositTerm, { amount: money(AUCTION_POLICY.depositAmount) }),
          ui("antiSnipe"),
          ui("bindingBid"),
          t(COPY.paymentWindow, { n: AUCTION_POLICY.paymentWindowHours }),
        ]}
      />
    </section>
  );
}
