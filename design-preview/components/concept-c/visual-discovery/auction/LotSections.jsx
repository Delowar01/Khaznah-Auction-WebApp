"use client";

// Visual Discovery lot information: fact chips, the story of the lot with
// highlight tiles, a soft condition card and the specifications, the seller
// on a navy card with delivery tiles, the bid history as a timeline, the
// terms, the manifest as photo tiles and discovery-led similar auctions.
import Link from "next/link";
import { BadgeCheck, Check, ChevronLeft, ChevronRight, Clock3, Gavel, RotateCcw, ScrollText, ShieldCheck, Timer, Truck, Warehouse } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { BROWSE_COPY } from "@/components/shared/browse/copy";
import { similarAuctions, useAuctionTerms, useBidRow, useFulfilment, useHistoryPages } from "@/components/shared/auction/hooks";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LotCard, toneOf } from "../browse/Cards";
import { Arrow, GradePill, SectionHead, btn, cx } from "../ui";

/** Lot facts as pale chips: label and value. */
export function FactChips({ detail, info }) {
  const { ui } = useLang();
  const { link } = useConcept();
  const { product } = detail;
  const chip = "inline-flex h-10 items-center gap-1.5 rounded-full bg-[var(--vd-bluegray)] px-4 vd-sm text-[var(--vd-muted)]";
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      <li>
        <Link href={link(info.categoryHref)} className={cx(chip, "transition-colors hover:bg-[#dfe7f3]")}>
          {ui("category")} <span className="font-bold text-[var(--vd-indigo)]">{info.categoryName}</span>
        </Link>
      </li>
      <li className={chip}>
        {ui("itemType")} <span className="font-bold text-[var(--vd-ink)]">{info.quantity || info.itemType}</span>
      </li>
      <li className={chip}>
        {ui("source")} <span className="font-bold text-[var(--vd-ink)]">{info.source}</span>
      </li>
      <li className={chip}>
        {ui("startingBid")} <Money value={product.startingBid} className="font-bold text-[var(--vd-ink)]" />
      </li>
      <li className={chip}>
        {ui("minIncrement")} <Money value={product.increment} className="font-bold text-[var(--vd-ink)]" />
      </li>
    </ul>
  );
}

/** Description with highlight tiles, beside the condition card and specifications. */
export function AboutLot({ detail, info }) {
  const { t, ui } = useLang();
  const { product } = detail;
  return (
    <section aria-labelledby="vd-about" className="vd-container mt-14 dt:mt-20">
      <div className="grid gap-8 dt:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] dt:gap-12">
        <div className="min-w-0">
          <h2 id="vd-about" className="vd-h2 text-[var(--vd-ink)]">
            {t(C.aboutLot)}
          </h2>
          <FactChips detail={detail} info={info} />
          <p className="mt-5 max-w-[64ch] vd-lg text-[var(--vd-ink)] text-pretty">{t(product.description)}</p>
          {product.highlights?.length ? (
            <>
              <h3 className="sr-only">{t(C.highlights)}</h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {product.highlights.map((item) => (
                  <li key={item.en} className="flex flex-col gap-3 rounded-[20px] p-4" style={{ background: toneOf(item.en) }}>
                    <span className="grid size-9 place-items-center rounded-full bg-white text-[var(--vd-indigo)]">
                      <Check aria-hidden="true" className="size-[18px]" strokeWidth={2.6} />
                    </span>
                    <span className="vd-md font-semibold text-[var(--vd-ink)]">{t(item)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        <div className="grid min-w-0 content-start gap-4">
          <section aria-labelledby="vd-condition" className="rounded-[24px] bg-[var(--vd-ivory)] p-5 dt:p-6">
            <h3 id="vd-condition" className="vd-h3 text-[var(--vd-ink)]">
              {ui("conditionReport")}
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <GradePill grade={product.grade} />
              <button type="button" onClick={detail.guide.show} className="vd-link inline-flex items-center gap-1.5 vd-md font-semibold text-[var(--vd-indigo)]">
                {ui("whatGradeMeans")}
                <Arrow />
              </button>
            </div>
            <p className="mt-3 vd-body text-[var(--vd-ink)]">{t(product.conditionNote)}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 vd-sm font-semibold text-[var(--vd-grade-a)]">
              <BadgeCheck aria-hidden="true" className="size-4" strokeWidth={2.2} />
              {ui("inspected")}
            </p>
          </section>
          {product.specs?.length ? (
            <section aria-labelledby="vd-specs" className="rounded-[24px] bg-[var(--vd-bluegray)]/70 p-5 dt:p-6">
              <h3 id="vd-specs" className="vd-h3 text-[var(--vd-ink)]">
                {ui("specifications")}
              </h3>
              <dl className="mt-3 grid gap-2">
                {product.specs.map((row) => (
                  <div key={row.k.en} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 rounded-[12px] bg-white px-3.5 py-2.5">
                    <dt className="vd-sm text-[var(--vd-muted)]">{t(row.k)}</dt>
                    <dd className="vd-sm font-semibold text-[var(--vd-ink)]">{t(row.v)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}

const FULFIL_ICONS = { delivery: Truck, pickup: Warehouse, returns: RotateCcw };

/** The seller on a navy card, with delivery, pickup and returns as tiles. */
export function SellerDelivery({ detail, info }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const rows = useFulfilment(detail.product);
  return (
    <section aria-labelledby="vd-seller" className="vd-container mt-12 grid gap-4 dt:mt-16 dt:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {info.seller ? (
        <div className="flex flex-col justify-between gap-5 rounded-[24px] bg-[var(--vd-navy)] p-6 text-white">
          <div>
            <p id="vd-seller" className="vd-kicker text-white/75">
              {info.sellerLabel}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full text-[15px] font-bold text-white ring-2 ring-white/20" style={{ background: info.seller.tone }}>
                {info.seller.monogram}
              </span>
              <div className="min-w-0">
                <p className="vd-h3 text-white">{info.sellerName}</p>
                <p className="vd-sm text-white/80">
                  {info.sellerCity} · {info.sellerSince}
                </p>
              </div>
            </div>
            <dl className="mt-5 flex gap-6">
              <div>
                <dt className="vd-xs text-white/75">{ui("activeAuctions")}</dt>
                <dd className="vd-lg font-extrabold tabular">{info.sellerStats.activeAuctions}</dd>
              </div>
              <div>
                <dt className="vd-xs text-white/75">{ui("buyNowItems")}</dt>
                <dd className="vd-lg font-extrabold tabular">{info.sellerStats.buyNowCount}</dd>
              </div>
            </dl>
          </div>
          <Link href={link(info.sellerHref)} className={btn("gold", "md", "w-fit")}>
            {ui("visitStore")}
            <Arrow />
          </Link>
        </div>
      ) : null}
      <div className="min-w-0">
        <h2 className="sr-only">{t(C.deliveryReturns)}</h2>
        <ul className="grid h-full gap-3 sm:grid-cols-3">
          {rows.map((row) => {
            const Icon = FULFIL_ICONS[row.key];
            return (
              <li key={row.key} className="rounded-[24px] border border-[var(--vd-line)] bg-white p-5">
                <span className="grid size-11 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)]">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
                </span>
                <p className="mt-3 vd-title text-[var(--vd-ink)]">{row.title}</p>
                <p className="mt-1 vd-sm text-[var(--vd-muted)]">{row.text}</p>
                {row.extra ? <p className="mt-1.5 vd-sm font-semibold text-[var(--vd-ink)]">{row.extra}</p> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const initials = (name) =>
  name
    .replace(/^(Bidder|مزايد)\s+/u, "")
    .slice(0, 3)
    .toUpperCase();

/** Bid history as a timeline: a disk per bidder, chips for you, the highest bid and auto-bids. */
export function HistoryTimeline({ auction }) {
  const { t, ui, pl } = useLang();
  const pages = useHistoryPages(auction.history);
  const describe = useBidRow();
  return (
    <section aria-labelledby="vd-history" className="min-w-0">
      <SectionHead id="vd-history" title={ui("bidHistory")}>
        <span className="rounded-full bg-[var(--vd-bluegray)] px-3 py-1 vd-sm font-semibold text-[var(--vd-indigo)]">{pl("bids", auction.bidCount)}</span>
      </SectionHead>
      {pages.total ? (
        <>
          <ol className="relative mt-5 grid gap-2 before:absolute before:inset-y-5 before:start-[27px] before:w-0.5 before:rounded-full before:bg-[var(--vd-line)] before:content-['']">
            {pages.rows.map((row) => {
              const info = describe(row);
              return (
                <li key={row.id} className={cx("relative flex items-center gap-3 rounded-[18px] px-2 py-2", row.isOwn ? "bg-[#eef3fd]" : row.isWinning ? "bg-[#fdf6e6]" : "")}>
                  <span aria-hidden="true" className={cx("relative grid size-10 shrink-0 place-items-center rounded-full text-[11px] font-extrabold", row.isOwn ? "bg-[var(--vd-indigo)] text-white" : "bg-white text-[var(--vd-indigo)] ring-2 ring-[var(--vd-line)]")}>
                    {row.isOwn ? ui("you").slice(0, 3) : initials(info.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5 vd-md">
                      <span className="font-semibold text-[var(--vd-ink)]">{info.name}</span>
                      {info.auto ? <span className="rounded-full bg-[var(--vd-bluegray)] px-2 py-0.5 vd-label text-[var(--vd-indigo)]">{ui("autoBid")}</span> : null}
                      {row.isWinning ? <span className="rounded-full bg-[var(--vd-gold)] px-2 py-0.5 vd-label text-[var(--vd-ink)]">{ui("highest")}</span> : null}
                    </span>
                    <span className="block vd-xs text-[var(--vd-muted)]">
                      <span className="sr-only">{t(C.time)}: </span>
                      {info.ago}
                    </span>
                  </span>
                  <span className="shrink-0">
                    <span className="sr-only">{t(C.amount)}: </span>
                    <Money value={row.amount} className={cx("vd-md", row.isWinning ? "font-extrabold text-[var(--vd-ink)]" : "font-semibold text-[var(--vd-muted)]")} />
                  </span>
                </li>
              );
            })}
          </ol>
          {pages.pageCount > 1 ? (
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="vd-sm text-[var(--vd-muted)]">{pages.range}</p>
              <span className="flex gap-2">
                <button type="button" onClick={pages.prev} disabled={!pages.hasPrev} aria-label={ui("previous")} className="grid size-11 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)] transition-colors hover:bg-[#dfe7f3] disabled:opacity-40">
                  <DirIcon icon={ChevronLeft} className="size-5" strokeWidth={2.2} />
                </button>
                <button type="button" onClick={pages.next} disabled={!pages.hasNext} aria-label={ui("next")} className="grid size-11 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)] transition-colors hover:bg-[#dfe7f3] disabled:opacity-40">
                  <DirIcon icon={ChevronRight} className="size-5" strokeWidth={2.2} />
                </button>
              </span>
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-5 rounded-[18px] bg-[var(--vd-bluegray)] px-5 py-6 text-center vd-md text-[var(--vd-muted)]">{ui("noBidsYet")}</p>
      )}
    </section>
  );
}

const TERM_ICONS = { deposit: ShieldCheck, snipe: Timer, payment: Clock3, increment: Gavel, binding: ScrollText, returns: RotateCcw };

/** Auction terms in a soft rounded panel. */
export function TermsPanel({ product }) {
  const { ui } = useLang();
  const terms = useAuctionTerms(product);
  return (
    <section aria-labelledby="vd-terms" className="min-w-0 rounded-[24px] bg-[var(--vd-bluegray)]/70 p-5 dt:p-6">
      <h2 id="vd-terms" className="vd-h3 text-[var(--vd-ink)]">
        {ui("auctionTerms")}
      </h2>
      <ul className="mt-4 grid gap-3">
        {terms.map((term) => {
          const Icon = TERM_ICONS[term.key];
          return (
            <li key={term.key} className="flex items-start gap-3 vd-sm text-[var(--vd-ink)]">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-[var(--vd-indigo)]">
                <Icon aria-hidden="true" className="size-4" strokeWidth={2} />
              </span>
              <span className="pt-1.5">{term.text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Pallet manifest as photo tiles: each line on its tint with grade and quantity. */
export function ManifestTiles({ product }) {
  const { t, ui, pl } = useLang();
  const lines = product.palletContents || [];
  const units = lines.reduce((sum, line) => sum + line.qty, 0);
  return (
    <section aria-labelledby="vd-manifest" className="vd-container mt-12 dt:mt-16">
      <SectionHead id="vd-manifest" title={ui("palletContents")}>
        <span className="rounded-full bg-[var(--vd-bluegray)] px-3 py-1 vd-sm font-semibold text-[var(--vd-indigo)]">{t(C.totalUnits, { units: pl("units", units), lines: `${lines.length} ${ui("lines")}` })}</span>
      </SectionHead>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 dt:grid-cols-6">
        {lines.map((line) => (
          <li key={line.key} className="overflow-hidden rounded-[20px] border border-[var(--vd-line)] bg-white">
            <div className="relative aspect-square" style={{ background: toneOf(line.key) }}>
              <Img image={line.image} cutout alt="" sizes="(min-width: 1200px) 200px, 45vw" className="vd-multiply absolute inset-0 size-full object-contain p-[14%]" />
              <span className="absolute end-2 top-2 rounded-full bg-white px-2.5 py-0.5 vd-sm font-extrabold text-[var(--vd-ink)] tabular">
                <span className="sr-only">{t(C.qty)} </span>×{line.qty}
              </span>
            </div>
            <div className="p-3">
              <p className="line-clamp-2 vd-sm font-semibold text-[var(--vd-ink)]">{t(line.name)}</p>
              <GradePill grade={line.grade} className="mt-2" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Similar auctions, led by discovery chips back into Browse. */
export function SimilarDiscovery({ product, info }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const lots = similarAuctions(product, 4);
  if (!lots.length) return null;
  const chips = [
    { key: "category", href: info.categoryHref, label: info.categoryName },
    { key: "ending", href: "/browse?tab=auction&ending=1h", label: t(BROWSE_COPY.endingUnderHour) },
    { key: "all", href: "/browse?tab=auction", label: t(BROWSE_COPY.timedAuctions) },
  ];
  return (
    <section id="similar-auctions" aria-labelledby="vd-similar" className="vd-container mt-14 scroll-mt-6 pb-14 dt:mt-20 dt:pb-20">
      <SectionHead id="vd-similar" title={ui("similarAuctions")} href="/browse?tab=auction" linkLabel={ui("viewAll")} />
      <ul className="vd-rail -mx-[var(--vd-gutter)] mt-4 flex gap-2 overflow-x-auto px-[var(--vd-gutter)] pb-1 dt:mx-0 dt:px-0">
        {chips.map((chip) => (
          <li key={chip.key} className="shrink-0">
            <Link href={link(chip.href)} className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dfe7f3] bg-white px-4 vd-md text-[var(--vd-ink)] transition-colors hover:border-[#c3d2ea] hover:bg-[#f3f7fc]">
              {chip.label}
              <Arrow className="size-4 text-[var(--vd-indigo)]" />
            </Link>
          </li>
        ))}
      </ul>
      <ul className="vd-rail -mx-[var(--vd-gutter)] mt-5 flex snap-x gap-3 overflow-x-auto px-[var(--vd-gutter)] md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4">
        {lots.map((lot) => (
          <li key={lot.slug} className="w-[min(72%,280px)] shrink-0 snap-start md:w-auto">
            <LotCard product={lot} />
          </li>
        ))}
      </ul>
    </section>
  );
}
