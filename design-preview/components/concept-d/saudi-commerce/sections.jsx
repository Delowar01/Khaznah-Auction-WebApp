"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Gavel, Package, Play, Search, ShoppingCart, Store, Truck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { cardTitle, useCartAdd } from "@/components/shared/r3/home";
import { lotImage } from "@/components/shared/r3/work-media";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { GRADES, GRADE_ORDER } from "@/data/grades";
import { LIVE_EVENT } from "@/data/live";
import { SELLER_BY_CODE } from "@/data/sellers";
import { detailPath } from "@/lib/catalog";
import { COPY } from "./copy";
import { BUY_NOW, CATEGORY_RAIL, ENDING, LIVE_SCENE, PALLETS, RECOMMENDED, SELLER_ROWS } from "./data";
import { AddToCart, Arrow, GradePill, HeartButton, SectionHead, TextLink, TimeLeft, btn, cx, guideTone } from "./ui";

const sellerName = (code, t) => t(SELLER_BY_CODE[code]?.name ?? { en: "", ar: "" });
const lotName = (product, t) => t(product.title).replace(/\s+[—–-]\s+\d+\s+\S+$/u, "");

// ── 05 · Trust strip, directly under the hero ────────────────────────────
const TRUST_ICONS = { graded: Package, seller: Store, delivery: Truck };

export function TrustStrip() {
  const { t } = useLang();
  return (
    <section data-ref="05" aria-label={t(COPY.trustLabel)} className="mx-auto mt-1.5 max-w-[1440px] bg-[var(--sc-soft)] dt:rounded-[12px]">
      <ul className="sc-container grid gap-4 py-5 lg:grid-cols-3 lg:gap-0 dt:h-[94px] dt:px-[calc(var(--sc-gutter)+40px)] dt:py-0">
        {COPY.trust.map((item, i) => {
          const Icon = TRUST_ICONS[item.key];
          return (
            <li key={item.key} className={cx("flex items-center gap-4 lg:justify-center lg:px-4 dt:gap-7 dt:px-2", i > 0 && "lg:border-s lg:border-[#d5e3db]")}>
              <Icon aria-hidden="true" className="size-9 shrink-0 text-[var(--sc-green)] dt:size-[42px]" strokeWidth={1.4} />
              <div className="min-w-0">
                <h3 className="sc-h3 text-[var(--sc-ink)]">{t(item.title)}</h3>
                <p className="sc-md text-[var(--sc-muted)] dt:text-[15px]">{t(item.text)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ── 06 + 07 · Local category rail beside the 2 × 2 Buy Now floor ─────────
function CategoryRail() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <nav data-ref="06" aria-labelledby={titleId} className="rounded-[9px] bg-[var(--sc-soft)] px-4 pb-3 pt-5 dt:h-[553px] dt:px-[18px] dt:pt-[24px]">
      <h2 id={titleId} className="px-2 sc-h3 !text-[20px] font-bold text-[var(--sc-green)] dt:px-1 dt:!text-[23px] dt:!leading-[30px]">
        {t(COPY.categoriesTitle)}
      </h2>
      <ul className="mt-2 grid grid-cols-2 gap-x-2 lg:grid-cols-4 dt:mt-[13px] dt:grid-cols-1">
        {CATEGORY_RAIL.map(({ slug, icon: Icon, category }) => (
          <li key={slug}>
            <Link href={link(`/browse?category=${slug}`)} className="flex h-12 items-center gap-3 rounded-[7px] px-2 sc-lg text-[var(--sc-ink)] transition-colors hover:bg-[#dfece5] hover:text-[var(--sc-green)] dt:h-[58px] dt:gap-[33px] dt:ps-[8px]">
              <Icon aria-hidden="true" className="size-6 shrink-0 text-[var(--sc-green)] dt:size-[30px]" strokeWidth={1.5} />
              <span className="min-w-0">{slug === "bulk-pallets" ? t(COPY.navBulk) : t(category.name)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Horizontal Buy Now card: contained image left, identity and full CTA right. */
function HorizontalCard({ product, compact = false }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <article className={cx("relative grid overflow-hidden rounded-[9px] border border-[var(--sc-line)] bg-white p-2", compact ? "grid-cols-[38%_minmax(0,1fr)] dt:h-[208px] dt:grid-cols-[255px_minmax(0,1fr)] dt:p-1.5" : "grid-cols-[42%_minmax(0,1fr)] dt:h-[225px] dt:grid-cols-[45%_minmax(0,1fr)]")}>
      <div className="relative min-h-[150px] overflow-hidden rounded-[6px] bg-[var(--sc-plate)]">
        <Img image={product.images[0]} cutout alt="" sizes="(min-width: 1200px) 255px, 40vw" className="sc-multiply absolute inset-0 size-full object-contain p-4 dt:p-5" />
      </div>
      <div className={cx("flex min-w-0 flex-col ps-4 pe-2 pb-1 pt-3", compact ? "dt:ps-[22px] dt:pe-[13px] dt:pb-[10px] dt:pt-[27px]" : "dt:ps-[20px] dt:pe-[8px] dt:pb-[11px] dt:pt-[18px]")}>
        <h3 className="truncate pe-7 sc-title text-[var(--sc-ink)] dt:!text-[16px]">
          <Link href={link(detailPath(product))} title={t(product.title)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {cardTitle(t(product.title))}
          </Link>
        </h3>
        <p className="mt-1 truncate sc-md text-[var(--sc-muted)] dt:mt-2 dt:text-[15px]">{sellerName(product.seller, t)}</p>
        <GradePill grade={product.grade} className="mt-2 dt:mt-[7px]" />
        {compact ? (
          <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 pt-3">
            <Money value={product.price} className="sc-price text-[var(--sc-ink)]" symbolClassName="text-[0.66em]" />
            <AddToCart product={product} className="max-sm:w-full dt:h-[47px] dt:w-[192px]" />
          </div>
        ) : (
          <>
            <Money value={product.price} className="mt-2 self-start sc-price text-[var(--sc-ink)] dt:mt-[8px]" symbolClassName="text-[0.66em]" />
            <AddToCart product={product} className="mt-auto w-full dt:h-[50px]" />
          </>
        )}
      </div>
      <HeartButton product={product} className={cx("absolute end-1.5 top-1.5", compact ? "dt:end-[8px] dt:top-[8px]" : "dt:end-[6px] dt:top-[8px]")} />
    </article>
  );
}

export function RetailFloor() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <div className="sc-container grid gap-8 pt-6 dt:grid-cols-[253px_minmax(0,1fr)] dt:gap-[32px] dt:pt-[22px]">
      <CategoryRail />
      <section data-ref="07" aria-labelledby={titleId} className="min-w-0">
        <SectionHead id={titleId} title={t(COPY.buyNowTitle)} text={t(COPY.buyNowText)} href="/browse?tab=buy_now" linkLabel={t(COPY.viewAll)} className="dt:pt-[8px]" />
        <ul className="mt-4 grid gap-4 lg:grid-cols-2 dt:mt-[19px] dt:gap-x-[19px] dt:gap-y-[15px]">
          {BUY_NOW.map((product) => (
            <li key={product.slug}>
              <HorizontalCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ── 08 · Recommended for you: two wide horizontal cards ─────────────────
export function Recommended() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section data-ref="08" aria-labelledby={titleId} className="sc-container pt-10 dt:pt-[34px]">
      <SectionHead id={titleId} title={t(COPY.recTitle)} text={t(COPY.recText)} href="/browse?tab=buy_now" linkLabel={t(COPY.viewAll)} />
      <ul className="mt-4 grid gap-4 lg:grid-cols-2 dt:mt-[15px] dt:gap-[20px]">
        {RECOMMENDED.map((product) => (
          <li key={product.slug}>
            <HorizontalCard product={product} compact />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 09 + 10 · Ending soon list beside the integrated live panel ─────────
function AuctionRow({ product }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  return (
    <article className="relative grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 rounded-[9px] border border-[var(--sc-line)] bg-white p-2 sm:grid-cols-[132px_minmax(0,1fr)_auto_auto] dt:h-[143px] dt:grid-cols-[146px_minmax(0,1fr)_125px_105px] dt:gap-x-0 dt:p-[7px] dt:pe-[18px]">
      <div className="relative h-24 self-stretch overflow-hidden rounded-[6px] bg-[var(--sc-plate)] sm:h-auto sm:min-h-[112px]">
        <Img image={product.images[0]} cutout alt="" sizes="146px" className="sc-multiply absolute inset-0 size-full object-contain p-2.5" />
      </div>
      <div className="min-w-0 dt:pe-3 dt:ps-[13px]">
        <h3 className="truncate sc-title !text-[16px] text-[var(--sc-ink)]">
          <Link href={link(detailPath(product))} title={t(product.title)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {cardTitle(t(product.title))}
          </Link>
        </h3>
        <p className="mt-1 truncate sc-md text-[var(--sc-muted)] dt:text-[15px]">{sellerName(product.seller, t)}</p>
        <GradePill grade={product.grade} className="mt-2" />
      </div>
      <div className="col-span-2 flex items-end justify-between gap-3 sm:contents">
        <div className="min-w-0">
          <p className="sc-md text-[var(--sc-muted)] dt:text-[15px]">{ui("currentBid")}</p>
          <Money value={product.currentBid} className="sc-price !text-[24px] !leading-7 text-[var(--sc-ink)]" symbolClassName="text-[0.66em]" />
          <TimeLeft endsIn={product.endsIn} className="mt-0.5" />
        </div>
        <Link href={link(detailPath(product))} aria-label={t(COPY.bidNamed, { title: t(product.title) })} className={btn("green", "md", "relative z-10 h-[47px] w-[105px] px-0 dt:mt-[20px] dt:text-[16px]")}>
          {ui("bidNow")}
        </Link>
      </div>
    </article>
  );
}

function LivePanel({ live }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const lot = live.current;
  const host = SELLER_BY_CODE[LIVE_EVENT.host];
  return (
    <section data-ref="10" aria-labelledby={titleId} className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 dt:h-[36px]">
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-[var(--sc-red)]" />
        <h2 id={titleId} className="whitespace-nowrap sc-h2 text-[var(--sc-ink)]">
          {t(COPY.liveTitle)}
        </h2>
        <span className="inline-flex h-[30px] items-center whitespace-nowrap rounded-[5px] bg-[var(--sc-red)] px-3 sc-md font-bold uppercase text-white dt:ms-2 dt:h-[33px] dt:px-[18px] dt:text-[16px]">{t(COPY.liveNow)}</span>
        <TextLink href="/live-auction" label={t(COPY.viewAllNamed, { name: t(COPY.liveTitle) })} className="ms-auto whitespace-nowrap">
          {t(COPY.viewAll)}
        </TextLink>
      </div>
      {/* One integrated scene: warehouse aisle with the lot on the block */}
      <div className="relative mt-4 h-[480px] overflow-hidden rounded-[12px] bg-[#1d2630] sm:h-[430px] lg:h-[470px] dt:mt-[9px] dt:h-[464px]">
        <Img
          image={LIVE_SCENE.image}
          alt=""
          sizes="(min-width: 1200px) 700px, (min-width: 640px) 100vw, 720px"
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: LIVE_SCENE.focus }}
        />
        {lot ? <Img key={lot.lot} image={lotImage(lot)} cutout alt="" sizes="360px" className="absolute bottom-[33%] left-1/2 h-[36%] w-[56%] -translate-x-[38%] object-contain object-bottom drop-shadow-[0_18px_22px_rgb(0_0_0/0.45)] sm:bottom-[9%] sm:h-[62%] rtl:-translate-x-[62%]" /> : null}
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_16_22/0.74)_0%,rgb(10_16_22/0.18)_42%,rgb(10_16_22/0.12)_58%,rgb(10_16_22/0.82)_100%)]" />
        <div className="absolute inset-x-0 top-0 p-5 text-white dt:ps-[27px] dt:pt-[24px]">
          <p className="max-w-[390px] sc-h2 !text-[22px] !leading-7 text-white md:!text-[27px] md:!leading-[33px] dt:!text-[30px] dt:!leading-[36px]">{t(LIVE_EVENT.title)}</p>
          <p className="mt-1.5 sc-lg font-semibold text-white/95 dt:text-[19px]">{host ? t(host.name) : null}</p>
          <Link href={link("/live-auction")} className="mt-5 grid size-[60px] place-items-center rounded-full border-2 border-white bg-black/25 text-white backdrop-blur-[2px] transition-colors hover:bg-black/45 dt:mt-[30px] dt:size-[73px]">
            <Play aria-hidden="true" className="ms-1 size-7 fill-white" strokeWidth={1.5} />
            <span className="sr-only">{t(COPY.playPreview)}</span>
          </Link>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 text-white dt:pb-[22px] dt:pe-[26px] dt:ps-[27px]">
          {lot ? (
            <div>
              <p className="sr-only">{t(COPY.onTheBlock, { title: t(lot.title) })}</p>
              <p className="sc-lg text-white/90 dt:text-[17px]">{ui("currentBid")}</p>
              <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded px-1 sc-price text-white" symbolClassName="text-[0.66em]" />
              {lot.grade ? (
                <div className="mt-1.5">
                  <GradePill grade={lot.grade} />
                </div>
              ) : null}
            </div>
          ) : (
            <span />
          )}
          <Link href={link("/live-auction")} className={btn("green", "lg", "h-[54px] gap-4 border-2 border-white/85 px-6 dt:mb-[13px] dt:h-[61px] dt:w-[248px] dt:text-[18px]")}>
            {t(COPY.joinLive)}
            <Arrow className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function AuctionsAndLive({ live }) {
  const { t } = useLang();
  const titleId = useId();
  return (
    <div className="sc-container grid gap-10 pt-10 dt:grid-cols-[minmax(0,681fr)_minmax(0,654fr)] dt:gap-[30px] dt:pt-[38px]">
      <section data-ref="09" aria-labelledby={titleId} className="min-w-0">
        <SectionHead id={titleId} title={t(COPY.endingTitle)} text={t(COPY.endingText)} href="/browse?tab=auction" linkLabel={t(COPY.viewAllAuctions)} />
        <ul className="mt-4 grid gap-3 dt:mt-[10px] dt:gap-[8px]">
          {ENDING.map((product) => (
            <li key={product.slug}>
              <AuctionRow product={product} />
            </li>
          ))}
        </ul>
      </section>
      <LivePanel live={live} />
    </div>
  );
}

// ── 11 · Featured Sellers: five full-width directory rows ────────────────
export function SellerDirectory() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section data-ref="11" aria-labelledby={titleId} className="sc-container pt-10 dt:pt-[40px]">
      <SectionHead id={titleId} title={t(COPY.sellersTitle)} text={t(COPY.sellersText)} href="/seller" linkLabel={t(COPY.viewAllSellers)} />
      <ul className="mt-4 divide-y divide-[var(--sc-line)] overflow-hidden rounded-[9px] border border-[var(--sc-line)] bg-white dt:mt-[7px]">
        {SELLER_ROWS.map(({ code, seller, cover, focus, zoom, products, thumbs }) => (
          <li key={code} className="relative grid grid-cols-[112px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 p-2 transition-colors hover:bg-[#f7faf8] md:grid-cols-[160px_minmax(0,1fr)_auto] dt:h-[94px] dt:grid-cols-[206px_minmax(0,323px)_519px_minmax(0,1fr)] dt:gap-0 dt:px-[6px] dt:py-[4px]">
            <div className="relative row-span-2 h-[72px] self-stretch overflow-hidden rounded-[3px] bg-[#e6e2dc] md:h-auto md:min-h-[90px] dt:row-span-1 dt:h-[86px] dt:min-h-0">
              <Img
                image={cover}
                alt=""
                sizes={`${Math.round(206 * (zoom || 1))}px`}
                className={cx("absolute object-cover", zoom ? "inset-y-0 right-0 h-full max-w-none" : "inset-0 size-full")}
                style={{ ...(focus ? { objectPosition: focus } : null), ...(zoom ? { width: `${zoom * 100}%` } : null) }}
              />
            </div>
            <h3 className="col-start-2 row-start-1 min-w-0 truncate sc-h3 !text-[18px] font-bold text-[var(--sc-ink)] dt:ps-[34px] dt:!text-[22px] dt:!leading-7">
              <Link href={link(`/seller/${code}`)} className="hover:underline">
                {t(seller.name)}
              </Link>
            </h3>
            <ul aria-label={t(COPY.storeProducts, { name: t(seller.name) })} className="col-span-2 row-start-3 flex items-center gap-3 md:col-span-2 md:col-start-2 md:row-start-2 dt:col-span-1 dt:col-start-3 dt:row-start-1 dt:grid dt:grid-cols-3 dt:gap-0">
              {products.map((product) => (
                <li key={product.slug} className="grid place-items-center">
                  <Link href={link(detailPath(product))} className="relative block size-12 rounded-[6px] outline-offset-2 dt:size-[76px]">
                    <Img image={thumbs?.[product.slug] ?? product.images[0]} cutout alt={t(product.title)} sizes="82px" className="sc-multiply absolute inset-0 size-full object-contain" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 md:justify-self-end dt:col-start-4 dt:row-start-1 dt:pe-[38px]">
              <TextLink href={`/seller/${code}`} label={t(COPY.visitNamed, { name: t(seller.name) })} className="dt:!text-[18px]">
                {t(COPY.visitStore)}
              </TextLink>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 12 · Bulk & Pallets: two sage panels ─────────────────────────────────
function PalletPanel({ product, image, action }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const add = useCartAdd(t(COPY.addedToCart));
  const auction = action === "bid";
  return (
    <article className="relative grid overflow-hidden rounded-[12px] bg-[var(--sc-soft)] sm:grid-cols-[48%_minmax(0,1fr)] dt:h-[249px] dt:grid-cols-[312px_minmax(0,1fr)]">
      <div className="relative h-[180px] sm:h-auto sm:min-h-[220px]">
        <Img image={image ?? product.images[0]} cutout alt="" sizes="(min-width: 1200px) 300px, 50vw" className="sc-multiply absolute inset-0 size-full object-contain px-8 py-4 dt:pb-[14px] dt:ps-[45px] dt:pe-0 dt:pt-[16px]" />
      </div>
      <div className="flex min-w-0 flex-col justify-center px-5 pb-5 sm:pt-5 dt:ps-[33px] dt:pe-4 dt:py-0">
        <h3 className="sc-title text-[var(--sc-ink)] dt:!text-[18px]">
          <Link href={link(detailPath(product))} className="hover:underline">
            {lotName(product, t)}
          </Link>
        </h3>
        {product.quantity ? <p className="sc-h3 !text-[20px] font-bold text-[var(--sc-ink)]">{pl("units", product.quantity)}</p> : null}
        <p className="mt-1.5 sc-lg text-[var(--sc-muted)] dt:mt-[8px]">{sellerName(product.seller, t)}</p>
        <p className="mt-1.5 sc-lg text-[var(--sc-muted)] dt:mt-[9px]">{auction ? ui("currentBid") : ui("buyNow")}</p>
        <Money value={auction ? product.currentBid : product.price} className="self-start sc-price text-[var(--sc-ink)]" symbolClassName="text-[0.66em]" />
        <div className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-2 dt:mt-[10px]">
          {auction ? (
            <Link href={link(detailPath(product))} aria-label={t(COPY.bidNamed, { title: t(product.title) })} className={btn("green", "md", "h-[51px] w-[141px] px-0 dt:text-[17px]")}>
              {ui("bidNow")}
            </Link>
          ) : (
            <button type="button" onClick={() => add(product)} aria-label={t(COPY.addNamed, { title: t(product.title) })} className={btn("green", "md", "h-[51px] gap-2.5 px-5 dt:w-[164px] dt:px-0 dt:text-[17px]")}>
              <ShoppingCart aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
              {t(COPY.addToCart)}
            </button>
          )}
          <Link href={link(detailPath(product))} aria-label={t(COPY.manifestNamed, { title: t(product.title) })} className="sc-link sc-lg font-medium text-[var(--sc-link)] dt:text-[17px]">
            {t(COPY.viewManifest)}
          </Link>
        </div>
      </div>
    </article>
  );
}

export function BulkPanels() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section data-ref="12" aria-labelledby={titleId} className="sc-container pt-10 dt:pt-[36px]">
      <SectionHead id={titleId} title={t(COPY.bulkTitle)} text={t(COPY.bulkText)} href="/browse?category=bulk-pallets" linkLabel={t(COPY.viewAll)} />
      <ul className="mt-4 grid gap-4 lg:grid-cols-2 dt:mt-[10px] dt:gap-[12px]">
        {PALLETS.map((row) => (
          <li key={row.product.slug}>
            <PalletPanel {...row} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 13 · How Khaznah works: oversized 01 / 02 / 03 ───────────────────────
const STEP_ICONS = [Search, Gavel, Truck];

/**
 * Three numbered steps. From 1200 px the columns are the 1440 composition's
 * widths as fr shares of the 1365 px container: exact at 1440, proportional
 * below it, so the third step no longer runs past the page edge at ~1200 px.
 */
export function HowItWorks() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section data-ref="13" id="how-it-works" aria-labelledby={titleId} className="sc-container pt-10 dt:pt-[35px]">
      <SectionHead id={titleId} title={t(COPY.howTitle)} text={t(COPY.howText)} />
      <ol className="mt-5 grid gap-6 dt:mt-[28px] dt:grid-cols-[455fr_459fr_451fr] dt:gap-0">
        {COPY.steps.map((step, i) => {
          const Icon = STEP_ICONS[i];
          return (
            <li key={step.title.en} className={cx("flex items-start gap-5 dt:gap-0 dt:pe-4", i === 0 ? "dt:ps-[5px]" : "dt:border-s dt:border-[var(--sc-line)] dt:ps-[25px]")}>
              <span aria-hidden="true" className="sc-step w-[62px] shrink-0 text-[var(--sc-step)] md:w-[78px] dt:w-[71px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icon aria-hidden="true" className="mt-1 size-10 shrink-0 text-[var(--sc-green)] dt:ms-[30px] dt:mt-[8px] dt:size-[50px]" strokeWidth={1.4} />
              <div className="min-w-0 dt:ps-[20px] dt:pt-[3px]">
                <h3 className="sc-h3 text-[var(--sc-ink)]">
                  <span className="sr-only">{t(COPY.step, { n: i + 1 })}: </span>
                  {t(step.title)}
                </h3>
                <p className="mt-1.5 max-w-[420px] sc-body text-[var(--sc-muted)] dt:mt-[8px] dt:max-w-[260px] dt:text-[16px] dt:leading-[25px]">{t(step.text)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ── 14 · Condition grades: seven white cells on a pale-grey panel ────────
export function GradeStrip() {
  const { t } = useLang();
  const titleId = useId();
  const guideId = useId();
  const [guide, setGuide] = useState(false);
  return (
    <section data-ref="14" id="grades" aria-labelledby={titleId} className="sc-container pt-8 dt:pt-[25px]">
      <div className="rounded-[14px] bg-[var(--sc-panel)] px-4 pb-4 pt-4 dt:px-[14px] dt:pb-[21px] dt:pt-[18px]">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1 dt:px-[3px]">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <h2 id={titleId} className="sc-h2 text-[var(--sc-ink)]">
              {t(COPY.gradesTitle)}
            </h2>
            <p className="sc-md text-[var(--sc-muted)]">{t(COPY.gradesText)}</p>
          </div>
          <button type="button" onClick={() => setGuide((v) => !v)} aria-expanded={guide} aria-controls={guideId} className="sc-link inline-flex items-center gap-2 sc-md font-medium text-[var(--sc-link)] dt:me-[10px] dt:text-[16px]">
            {guide ? t(COPY.hideGuide) : t(COPY.gradeGuide)}
            <Arrow className={cx("size-[18px] transition-transform", guide && "rotate-90")} />
          </button>
        </div>
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7 dt:mt-[13px] dt:gap-[10px]">
          {GRADE_ORDER.map((grade) => (
            <li key={grade} className="grid h-[64px] place-items-center rounded-[8px] bg-white dt:h-[73px]">
              <span className={cx("grid h-11 min-w-12 place-items-center rounded-[6px] px-2 text-[18px] font-bold dt:h-[50px] dt:min-w-[55px] dt:text-[20px]", guideTone(grade))}>
                <span aria-hidden="true">{t(GRADES[grade].short)}</span>
                <span className="sr-only">{t(GRADES[grade].label)}</span>
              </span>
            </li>
          ))}
        </ul>
        <div id={guideId} hidden={!guide} className="mt-3 rounded-[10px] bg-white p-4 dt:p-5">
          <dl className="grid gap-x-8 gap-y-3 md:grid-cols-2">
            {GRADE_ORDER.map((grade) => (
              <div key={grade} className="grid grid-cols-[92px_minmax(0,1fr)] gap-3">
                <dt className="sc-md font-semibold text-[var(--sc-ink)]">{t(GRADES[grade].label)}</dt>
                <dd className="sc-md text-[var(--sc-muted)]">{t(GRADES[grade].text)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
