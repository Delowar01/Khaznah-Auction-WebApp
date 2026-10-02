"use client";

// Contemporary Saudi lot information, practical and ordered: three sage
// blocks (condition, seller, delivery and pickup), the description with a
// checklist of highlights, lot facts and specifications as plain tables,
// the bid history as a table with a sage head (rows on phones), the terms
// as a checklist, the manifest table and similar auctions.
import Link from "next/link";
import { BadgeCheck, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, Store, Truck } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { similarAuctions, useAuctionTerms, useBidRow, useFulfilment, useHistoryPages } from "@/components/shared/auction/hooks";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LotCard } from "../browse/Cards";
import { GradePill, SectionHead, TextLink, cx } from "../ui";

function BlockHead({ id, icon: Icon, children }) {
  return (
    <h2 id={id} className="flex items-center gap-2.5 sc-h3 text-[var(--sc-ink)]">
      <span className="grid size-9 shrink-0 place-items-center rounded-[7px] bg-white text-[var(--sc-green)]">
        <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
      </span>
      {children}
    </h2>
  );
}

/** Condition, seller, and delivery and pickup as three sage blocks. */
export function InfoBlocks({ detail, info }) {
  const { t, ui } = useLang();
  const { product } = detail;
  const fulfilment = useFulfilment(product);
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <section aria-labelledby="sc-condition" className="rounded-[9px] bg-[var(--sc-soft)] p-4 dt:p-5">
        <BlockHead id="sc-condition" icon={ClipboardCheck}>
          {ui("conditionReport")}
        </BlockHead>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <GradePill grade={product.grade} />
          <button type="button" onClick={detail.guide.show} className="sc-link sc-md font-medium text-[var(--sc-link)]">
            {ui("whatGradeMeans")}
          </button>
        </div>
        <p className="mt-3 sc-md text-[var(--sc-ink)]">{t(product.conditionNote)}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 sc-sm font-medium text-[var(--sc-green)]">
          <BadgeCheck aria-hidden="true" className="size-4" strokeWidth={2} />
          {ui("inspected")}
        </p>
      </section>
      {info.seller ? (
        <section aria-labelledby="sc-seller" className="flex flex-col rounded-[9px] bg-[var(--sc-soft)] p-4 dt:p-5">
          <BlockHead id="sc-seller" icon={Store}>
            {info.sellerLabel}
          </BlockHead>
          <p className="mt-3 sc-title text-[var(--sc-ink)]">{info.sellerName}</p>
          <p className="mt-0.5 sc-sm text-[var(--sc-muted)]">
            {ui("sellerWarehouse")} · {info.sellerCity}
          </p>
          <p className="sc-sm text-[var(--sc-muted)]">{info.sellerSince}</p>
          <dl className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-[7px] bg-white px-3 py-2">
              <dt className="sc-xs text-[var(--sc-muted)]">{ui("activeAuctions")}</dt>
              <dd className="sc-lg font-semibold text-[var(--sc-ink)] tabular">{info.sellerStats.activeAuctions}</dd>
            </div>
            <div className="rounded-[7px] bg-white px-3 py-2">
              <dt className="sc-xs text-[var(--sc-muted)]">{ui("buyNowItems")}</dt>
              <dd className="sc-lg font-semibold text-[var(--sc-ink)] tabular">{info.sellerStats.buyNowCount}</dd>
            </div>
          </dl>
          <TextLink href={info.sellerHref} className="mt-3 w-fit">
            {ui("visitStore")}
          </TextLink>
        </section>
      ) : null}
      <section aria-labelledby="sc-delivery" className="rounded-[9px] bg-[var(--sc-soft)] p-4 dt:p-5">
        <BlockHead id="sc-delivery" icon={Truck}>
          {t(C.deliveryReturns)}
        </BlockHead>
        <dl className="mt-3 grid gap-2.5">
          {fulfilment.map((row) => (
            <div key={row.key}>
              <dt className="sc-md font-semibold text-[var(--sc-ink)]">{row.title}</dt>
              <dd className="sc-sm text-[var(--sc-muted)]">
                {row.text}
                {row.extra ? <span className="mt-0.5 block font-medium text-[var(--sc-ink)]">{row.extra}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function Table({ rows, className = "" }) {
  return (
    <dl className={cx("overflow-hidden rounded-[9px] border border-[var(--sc-line)]", className)}>
      {rows.map((row) => (
        <div key={row.key} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-[var(--sc-line)] px-4 py-2.5 last:border-b-0 odd:bg-[var(--sc-panel)]">
          <dt className="sc-md text-[var(--sc-muted)]">{row.label}</dt>
          <dd className="sc-md font-medium text-[var(--sc-ink)]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Description with a checklist of highlights; lot facts and specifications as tables. */
export function AboutLot({ detail, info }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { product } = detail;
  const facts = [
    { key: "lot", label: ui("lotNumber"), value: <span dir="ltr" className="tabular">{product.lot}</span> },
    {
      key: "category",
      label: ui("category"),
      value: (
        <Link href={link(info.categoryHref)} className="sc-link text-[var(--sc-link)]">
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
    <section aria-labelledby="sc-about" className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <div className="min-w-0">
        <SectionHead id="sc-about" title={t(C.aboutLot)} />
        <p className="mt-3 sc-body text-[var(--sc-ink)] text-pretty dt:text-[16px] dt:leading-[25px]">{t(product.description)}</p>
        {product.highlights?.length ? (
          <>
            <h3 className="mt-5 sc-micro text-[var(--sc-muted)]">{t(C.highlights)}</h3>
            <ul className="mt-2.5 grid gap-2">
              {product.highlights.map((item) => (
                <li key={item.en} className="flex items-start gap-2.5 sc-md text-[var(--sc-ink)]">
                  <CheckCircle2 aria-hidden="true" className="mt-px size-[18px] shrink-0 text-[var(--sc-green)]" strokeWidth={2} />
                  {t(item)}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
      <div className="grid min-w-0 content-start gap-5">
        <div>
          <h3 className="mb-2.5 sc-micro text-[var(--sc-muted)]">{t(C.lotDetails)}</h3>
          <Table rows={facts} />
        </div>
        {specs.length ? (
          <div>
            <h3 className="mb-2.5 sc-micro text-[var(--sc-muted)]">{ui("specifications")}</h3>
            <Table rows={specs} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Bid history: a table with a sage head from 640 px, plain rows on phones; five a page. */
export function HistoryTable({ auction }) {
  const { t, ui, pl } = useLang();
  const pages = useHistoryPages(auction.history);
  const describe = useBidRow();
  const tags = (row, info) => (
    <>
      {info.auto ? <span className="rounded-[5px] bg-[var(--sc-guide-blue-bg)] px-1.5 py-0.5 sc-xs font-semibold text-[var(--sc-guide-blue)]">{ui("autoBid")}</span> : null}
      {row.isWinning ? <span className="rounded-[5px] bg-[var(--sc-green)] px-1.5 py-0.5 sc-xs font-semibold text-white">{ui("highest")}</span> : null}
    </>
  );
  return (
    <section aria-labelledby="sc-history" className="min-w-0">
      <div className="flex items-end justify-between gap-4">
        <SectionHead id="sc-history" title={ui("bidHistory")} />
        <p className="pb-1 sc-md text-[var(--sc-muted)]">{pl("bids", auction.bidCount)}</p>
      </div>
      {pages.total ? (
        <div className="mt-4 overflow-hidden rounded-[9px] border border-[var(--sc-line)]">
          <table className="hidden w-full border-collapse sm:table">
            <thead className="bg-[var(--sc-soft)] sc-sm text-[var(--sc-ink)]">
              <tr>
                <th scope="col" className="px-4 py-2.5 text-start font-semibold">
                  {ui("bidder")}
                </th>
                <th scope="col" className="px-3 py-2.5 text-end font-semibold">
                  {t(C.amount)}
                </th>
                <th scope="col" className="px-4 py-2.5 text-end font-semibold">
                  {t(C.time)}
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.rows.map((row) => {
                const info = describe(row);
                return (
                  <tr key={row.id} className={cx("border-t border-[var(--sc-line)]", row.isOwn && "bg-[#eef6f1]")}>
                    <td className="px-4 py-3">
                      <span className="flex flex-wrap items-center gap-2 sc-md">
                        <span className={cx("text-[var(--sc-ink)]", row.isOwn && "font-semibold")}>{info.name}</span>
                        {tags(row, info)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-end">
                      <Money value={row.amount} className={cx("sc-md", row.isWinning ? "font-bold text-[var(--sc-ink)]" : "text-[var(--sc-muted)]")} />
                    </td>
                    <td className="px-4 py-3 text-end sc-sm text-[var(--sc-muted)]">{info.ago}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <ul className="sm:hidden">
            {pages.rows.map((row) => {
              const info = describe(row);
              return (
                <li key={row.id} className={cx("flex items-center justify-between gap-3 border-t border-[var(--sc-line)] px-4 py-3 first:border-t-0", row.isOwn && "bg-[#eef6f1]")}>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 sc-md">
                      <span className={cx("text-[var(--sc-ink)]", row.isOwn && "font-semibold")}>{info.name}</span>
                      {tags(row, info)}
                    </span>
                    <span className="block sc-sm text-[var(--sc-muted)]">{info.ago}</span>
                  </span>
                  <Money value={row.amount} className={cx("shrink-0 sc-md", row.isWinning ? "font-bold text-[var(--sc-ink)]" : "text-[var(--sc-muted)]")} />
                </li>
              );
            })}
          </ul>
          {pages.pageCount > 1 ? (
            <div className="flex items-center justify-between gap-3 border-t border-[var(--sc-line)] bg-[var(--sc-panel)] px-4 py-2.5">
              <p className="sc-sm text-[var(--sc-muted)]">{pages.range}</p>
              <span className="flex gap-1.5">
                <button type="button" onClick={pages.prev} disabled={!pages.hasPrev} aria-label={ui("previous")} className="grid size-10 place-items-center rounded-[7px] border border-[var(--sc-line)] bg-white text-[var(--sc-ink)] hover:border-[var(--sc-green)] disabled:opacity-40">
                  <DirIcon icon={ChevronLeft} className="size-4" strokeWidth={2} />
                </button>
                <button type="button" onClick={pages.next} disabled={!pages.hasNext} aria-label={ui("next")} className="grid size-10 place-items-center rounded-[7px] border border-[var(--sc-line)] bg-white text-[var(--sc-ink)] hover:border-[var(--sc-green)] disabled:opacity-40">
                  <DirIcon icon={ChevronRight} className="size-4" strokeWidth={2} />
                </button>
              </span>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 rounded-[9px] bg-[var(--sc-panel)] px-4 py-6 text-center sc-md text-[var(--sc-muted)]">{ui("noBidsYet")}</p>
      )}
    </section>
  );
}

/** Auction terms as a checklist on sage. */
export function TermsList({ product }) {
  const { ui } = useLang();
  const terms = useAuctionTerms(product);
  return (
    <section aria-labelledby="sc-terms" className="min-w-0 rounded-[9px] bg-[var(--sc-soft)] p-4 dt:p-5">
      <h2 id="sc-terms" className="sc-h3 text-[var(--sc-ink)]">
        {ui("auctionTerms")}
      </h2>
      <ul className="mt-3 grid gap-2.5">
        {terms.map((term) => (
          <li key={term.key} className="flex items-start gap-2.5 sc-md text-[var(--sc-ink)]">
            <CheckCircle2 aria-hidden="true" className="mt-px size-[18px] shrink-0 text-[var(--sc-green)]" strokeWidth={2} />
            <span>{term.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Pallet manifest: each line with its grade and quantity, and the unit total. */
export function ManifestTable({ product }) {
  const { t, ui, pl } = useLang();
  const lines = product.palletContents || [];
  const units = lines.reduce((sum, line) => sum + line.qty, 0);
  return (
    <section aria-labelledby="sc-manifest" className="min-w-0">
      <SectionHead id="sc-manifest" title={ui("palletContents")} text={t(C.totalUnits, { units: pl("units", units), lines: `${lines.length} ${ui("lines")}` })} />
      <div className="mt-4 overflow-hidden rounded-[9px] border border-[var(--sc-line)]">
        <table className="w-full border-collapse">
          <thead className="bg-[var(--sc-soft)] sc-sm text-[var(--sc-ink)]">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-start font-semibold">
                {t(C.line)}
              </th>
              <th scope="col" className="px-2 py-2.5 text-start font-semibold">
                {ui("grade")}
              </th>
              <th scope="col" className="px-4 py-2.5 text-end font-semibold">
                {t(C.qty)}
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.key} className="border-t border-[var(--sc-line)]">
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-3">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-[6px] bg-[var(--sc-plate)]">
                      <Img image={line.image} cutout alt="" sizes="44px" className="sc-multiply absolute inset-0 size-full object-contain p-1" />
                    </span>
                    <span className="sc-md text-[var(--sc-ink)]">{t(line.name)}</span>
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <GradePill grade={line.grade} />
                </td>
                <td className="px-4 py-2.5 text-end sc-md font-semibold text-[var(--sc-ink)] tabular">×{line.qty}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-[var(--sc-line)] bg-[var(--sc-panel)]">
              <th scope="row" colSpan={2} className="px-4 py-2.5 text-start sc-md font-semibold text-[var(--sc-ink)]">
                {t(C.lotTotal)}
              </th>
              <td className="px-4 py-2.5 text-end sc-md font-bold text-[var(--sc-ink)] tabular">{pl("units", units)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

/** Four similar auctions in the Browse card. */
export function Similar({ product }) {
  const { ui } = useLang();
  const lots = similarAuctions(product, 4);
  if (!lots.length) return null;
  return (
    <section id="similar-auctions" aria-labelledby="sc-similar" className="sc-container scroll-mt-6 pb-12 pt-12 dt:pb-16 dt:pt-16">
      <SectionHead id="sc-similar" title={ui("similarAuctions")} href="/browse?tab=auction" linkLabel={ui("viewAll")} />
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {lots.map((lot) => (
          <li key={lot.slug}>
            <LotCard product={lot} />
          </li>
        ))}
      </ul>
    </section>
  );
}

