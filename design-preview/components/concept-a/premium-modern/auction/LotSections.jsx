"use client";

// Premium Modern lot information under the bidding: an editorial stone band
// (description, highlights, condition, lot facts and specifications), then
// bid history beside the seller, delivery and terms, the pallet manifest and
// similar auctions. Hairlines rather than boxes, brass dashes on headings.
import Link from "next/link";
import { BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { similarAuctions, useAuctionTerms, useBidRow, useFulfilment, useHistoryPages } from "@/components/shared/auction/hooks";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LotCard } from "../browse/Cards";
import { Chevron, GradePill, SectionHead, cx } from "../ui";

const RULE = "border-[#d6d0c5]";

function FactList({ rows, className = "" }) {
  return (
    <dl className={cx("divide-y border-y", RULE, className)}>
      {rows.map((row) => (
        <div key={row.key} className={cx("grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-2.5", RULE)}>
          <dt className="pr-sm text-fg-2">{row.label}</dt>
          <dd className="pr-md font-medium text-fg">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Stone band: description, highlights and condition beside lot facts and specifications. */
export function AboutBand({ detail, info }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { product } = detail;
  const facts = [
    { key: "lot", label: ui("lotNumber"), value: <span dir="ltr" className="tabular">{product.lot}</span> },
    {
      key: "category",
      label: ui("category"),
      value: (
        <Link href={link(info.categoryHref)} className="pr-link text-[var(--pr-bronze)]">
          {info.categoryName}
        </Link>
      ),
    },
    { key: "type", label: ui("itemType"), value: info.itemType },
    { key: "source", label: ui("source"), value: info.source },
    ...(info.quantity ? [{ key: "qty", label: ui("quantity"), value: info.quantity }] : []),
    { key: "start", label: ui("startingBid"), value: <Money value={product.startingBid} /> },
    { key: "increment", label: ui("minIncrement"), value: <Money value={product.increment} /> },
  ];
  const specs = (product.specs || []).map((row) => ({ key: row.k.en, label: t(row.k), value: t(row.v) }));

  return (
    <section aria-labelledby="pr-about" className="mt-14 bg-[var(--pr-stone)] dt:mt-20">
      <div className="pr-container grid gap-10 py-10 dt:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] dt:gap-16 dt:py-14">
        <div className="min-w-0">
          <SectionHead id="pr-about" title={t(C.aboutLot)} />
          <p className="mt-5 max-w-[62ch] pr-body text-fg text-pretty">{t(product.description)}</p>
          {product.highlights?.length ? (
            <>
              <h3 className="sr-only">{t(C.highlights)}</h3>
              <ul className="mt-6 grid gap-2.5">
                {product.highlights.map((item) => (
                  <li key={item.en} className="flex items-start gap-3 pr-md text-fg">
                    <span aria-hidden="true" className="mt-[10px] h-[2px] w-4 shrink-0 bg-[var(--pr-brass)]" />
                    {t(item)}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <div className={cx("mt-8 border-t pt-6", RULE)}>
            <h3 className="pr-h3 text-fg">{ui("conditionReport")}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <GradePill grade={product.grade} />
              <button type="button" onClick={detail.guide.show} className="pr-link pr-md font-medium text-[var(--pr-bronze)]">
                {ui("whatGradeMeans")}
              </button>
            </div>
            <p className="mt-3 pr-md text-fg">{t(product.conditionNote)}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 pr-xs font-medium text-[var(--pr-grade-a)]">
              <BadgeCheck aria-hidden="true" className="size-4" strokeWidth={1.8} />
              {ui("inspected")}
            </p>
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="pr-kicker text-[#4a4d57]">{t(C.lotDetails)}</h3>
          <FactList rows={facts} className="mt-3" />
          {specs.length ? (
            <>
              <h3 className="mt-8 pr-kicker text-[#4a4d57]">{ui("specifications")}</h3>
              <FactList rows={specs} className="mt-3" />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Bid history: a hairline table from 640 px, stacked rows on phones; five a page. */
export function HistoryBlock({ auction }) {
  const { t, ui, pl } = useLang();
  const pages = useHistoryPages(auction.history);
  const describe = useBidRow();
  const tag = (row, info) => (
    <>
      {info.auto ? <span className="pr-kicker text-[var(--pr-bronze)]">{ui("autoBid")}</span> : null}
      {row.isWinning ? <span className="rounded-[3px] bg-[var(--pr-stone)] px-1.5 py-0.5 pr-2xs font-semibold text-fg">{ui("highest")}</span> : null}
    </>
  );
  return (
    <section aria-labelledby="pr-history" className="min-w-0">
      <div className="flex items-end justify-between gap-4">
        <SectionHead id="pr-history" title={ui("bidHistory")} />
        <p className="pb-1 pr-md text-fg-2">{pl("bids", auction.bidCount)}</p>
      </div>
      {pages.total ? (
        <>
          <table className="mt-5 hidden w-full border-collapse sm:table">
            <thead>
              <tr className={cx("border-b pr-kicker text-[#4a4d57]", RULE)}>
                <th scope="col" className="py-2.5 text-start font-semibold">
                  {ui("bidder")}
                </th>
                <th scope="col" className="py-2.5 text-end font-semibold">
                  {t(C.amount)}
                </th>
                <th scope="col" className="py-2.5 text-end font-semibold">
                  {t(C.time)}
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.rows.map((row) => {
                const info = describe(row);
                return (
                  <tr key={row.id} className="border-b border-line">
                    <td className="py-3">
                      <span className="flex flex-wrap items-center gap-2 pr-md">
                        <span className={cx(row.isOwn ? "font-semibold text-fg" : "text-fg")}>{info.name}</span>
                        {tag(row, info)}
                      </span>
                    </td>
                    <td className="py-3 text-end">
                      <Money value={row.amount} className={cx("pr-md", row.isWinning ? "font-bold text-fg" : "text-fg-2")} />
                    </td>
                    <td className="py-3 text-end pr-sm text-fg-2">{info.ago}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <ul className="mt-4 sm:hidden">
            {pages.rows.map((row) => {
              const info = describe(row);
              return (
                <li key={row.id} className="flex items-center justify-between gap-3 border-b border-line py-3">
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 pr-md">
                      <span className={cx(row.isOwn ? "font-semibold text-fg" : "text-fg")}>{info.name}</span>
                      {tag(row, info)}
                    </span>
                    <span className="block pr-xs text-fg-2">{info.ago}</span>
                  </span>
                  <Money value={row.amount} className={cx("shrink-0 pr-md", row.isWinning ? "font-bold text-fg" : "text-fg-2")} />
                </li>
              );
            })}
          </ul>
          {pages.pageCount > 1 ? (
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="pr-sm text-fg-2">{pages.range}</p>
              <span className="flex gap-1.5">
                <button type="button" onClick={pages.prev} disabled={!pages.hasPrev} aria-label={ui("previous")} className="grid size-10 place-items-center rounded-[4px] border border-[#d3cfc6] bg-white text-fg transition-colors hover:bg-[var(--pr-stone)] disabled:opacity-40">
                  <DirIcon icon={ChevronLeft} className="size-4" strokeWidth={1.8} />
                </button>
                <button type="button" onClick={pages.next} disabled={!pages.hasNext} aria-label={ui("next")} className="grid size-10 place-items-center rounded-[4px] border border-[#d3cfc6] bg-white text-fg transition-colors hover:bg-[var(--pr-stone)] disabled:opacity-40">
                  <DirIcon icon={ChevronRight} className="size-4" strokeWidth={1.8} />
                </button>
              </span>
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-5 border-y border-line py-6 pr-md text-fg-2">{ui("noBidsYet")}</p>
      )}
    </section>
  );
}

/** Seller, delivery and returns, and the auction terms: a quiet column of hairline lists. */
export function SideNotes({ detail, info }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const fulfilment = useFulfilment(detail.product);
  const terms = useAuctionTerms(detail.product);
  return (
    <div className="grid min-w-0 content-start gap-10">
      {info.seller ? (
        <section aria-labelledby="pr-seller">
          <h2 id="pr-seller" className="pr-kicker text-[#4a4d57]">
            {info.sellerLabel}
          </h2>
          <p className="mt-2 pr-h3 text-fg">
            <Link href={link(info.sellerHref)} className="pr-link">
              {info.sellerName}
            </Link>
          </p>
          <p className="mt-1 pr-sm text-fg-2">
            {ui("sellerWarehouse")} · {info.sellerCity} · {info.sellerSince}
          </p>
          <dl className="mt-4 flex gap-8">
            <div>
              <dt className="pr-xs text-fg-2">{ui("activeAuctions")}</dt>
              <dd className="pr-lg font-semibold text-fg tabular">{info.sellerStats.activeAuctions}</dd>
            </div>
            <div>
              <dt className="pr-xs text-fg-2">{ui("buyNowItems")}</dt>
              <dd className="pr-lg font-semibold text-fg tabular">{info.sellerStats.buyNowCount}</dd>
            </div>
          </dl>
          <Link href={link(info.sellerHref)} className="pr-link mt-3 inline-flex items-center gap-1.5 pr-md font-medium text-[var(--pr-bronze)]">
            {ui("visitStore")}
            <Chevron className="size-4" />
          </Link>
        </section>
      ) : null}
      <section aria-labelledby="pr-delivery">
        <h2 id="pr-delivery" className="pr-kicker text-[#4a4d57]">
          {t(C.deliveryReturns)}
        </h2>
        <dl className={cx("mt-3 divide-y border-y", RULE)}>
          {fulfilment.map((row) => (
            <div key={row.key} className={cx("py-3", RULE)}>
              <dt className="pr-md font-semibold text-fg">{row.title}</dt>
              <dd className="mt-0.5 pr-sm text-fg-2">
                {row.text}
                {row.extra ? <span className="mt-0.5 block">{row.extra}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="pr-terms">
        <h2 id="pr-terms" className="pr-kicker text-[#4a4d57]">
          {ui("auctionTerms")}
        </h2>
        <ol className="mt-3 grid gap-3">
          {terms.map((term, i) => (
            <li key={term.key} className="flex gap-3 pr-sm text-fg-2">
              <span aria-hidden="true" className="w-5 shrink-0 pr-sm font-semibold text-[var(--pr-bronze)] tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{term.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/** Pallet manifest: each line with its grade and quantity, and the unit total. */
export function Manifest({ product }) {
  const { t, ui, pl } = useLang();
  const lines = product.palletContents || [];
  const units = lines.reduce((sum, line) => sum + line.qty, 0);
  return (
    <section aria-labelledby="pr-manifest" className="pr-container pb-12 dt:pb-16">
      <SectionHead id="pr-manifest" title={ui("palletContents")} sub={t(C.totalUnits, { units: pl("units", units), lines: `${lines.length} ${ui("lines")}` })} />
      <table className="mt-5 w-full border-collapse">
        <thead>
          <tr className={cx("border-b pr-kicker text-[#4a4d57]", RULE)}>
            <th scope="col" className="py-2.5 text-start font-semibold">
              {t(C.line)}
            </th>
            <th scope="col" className="py-2.5 text-start font-semibold">
              {ui("grade")}
            </th>
            <th scope="col" className="py-2.5 text-end font-semibold">
              {t(C.qty)}
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.key} className="border-b border-line">
              <td className="py-2.5">
                <span className="flex items-center gap-3">
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-[4px] bg-[var(--pr-stone)]">
                    <Img image={line.image} cutout alt="" sizes="48px" className="pr-multiply absolute inset-0 size-full object-contain p-1" />
                  </span>
                  <span className="pr-md text-fg">{t(line.name)}</span>
                </span>
              </td>
              <td className="py-2.5">
                <GradePill grade={line.grade} short />
              </td>
              <td className="py-2.5 text-end pr-md font-semibold text-fg tabular">×{line.qty}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={2} className="py-3 text-start pr-md font-semibold text-fg">
              {t(C.lotTotal)}
            </th>
            <td className="py-3 text-end pr-md font-bold text-fg tabular">{pl("units", units)}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}

/** Four similar auctions in the Browse card, after the lot itself. */
export function Similar({ product }) {
  const { ui } = useLang();
  const lots = similarAuctions(product, 4);
  if (!lots.length) return null;
  return (
    <section id="similar-auctions" aria-labelledby="pr-similar" className="pr-container scroll-mt-6 pb-14 dt:pb-20">
      <SectionHead id="pr-similar" title={ui("similarAuctions")} href="/browse?tab=auction" linkLabel={ui("viewAll")} />
      <ul className="pr-rail -mx-[var(--pr-gutter)] mt-6 flex snap-x gap-3 overflow-x-auto px-[var(--pr-gutter)] md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4">
        {lots.map((lot) => (
          <li key={lot.slug} className="w-[min(76%,300px)] shrink-0 snap-start md:w-auto">
            <LotCard product={lot} />
          </li>
        ))}
      </ul>
    </section>
  );
}

