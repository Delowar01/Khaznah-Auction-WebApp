"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ClipboardList, Play, Truck, UserRoundSearch } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { cardTitle, useCartAdd } from "@/components/shared/r3/home";
import { lotImage } from "@/components/shared/r3/work-media";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { GRADES, GRADE_ORDER } from "@/data/grades";
import { LIVE_EVENT } from "@/data/live";
import { SELLER_BY_CODE } from "@/data/sellers";
import { detailPath, isAuction } from "@/lib/catalog";
import { COPY } from "./copy";
import { BUY_NOW, CATEGORY_ROW, ENDING, LIVE_STREAM, PALLETS, SELECTED, SELLER_CARDS } from "./data";
import { AddToCart, Chevron, GradePill, HeartButton, SectionHead, TimeLeft, btn, cx, gradeTone } from "./ui";

const sellerName = (code, t) => t(SELLER_BY_CODE[code]?.name ?? { en: "", ar: "" });
/** Pallet titles without the trailing unit count, which has its own column here. */
const lotName = (product, t) => t(product.title).replace(/\s+[—–-]\s+\d+\s+\S+$/u, "");

// ── 04 · Eight unboxed category photographs ──────────────────────────────
export function CategoryRow() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <nav data-ref="04" aria-label={t(COPY.categoriesLabel)} className="pr-container pt-4 pb-5 dt:pt-5 dt:pb-[27px]">
      <ul className="pr-rail -mx-[var(--pr-gutter)] flex snap-x gap-2 overflow-x-auto px-[var(--pr-gutter)] md:mx-0 md:grid md:grid-cols-4 md:gap-y-4 md:overflow-visible md:px-0 dt:grid-cols-8 dt:gap-0">
        {CATEGORY_ROW.map(({ slug, art, category }) => (
          <li key={slug} className="w-[27%] shrink-0 snap-start md:w-auto">
            <Link href={link(`/browse?category=${slug}`)} className="group flex flex-col items-center gap-2.5 rounded-[4px] outline-offset-2 dt:gap-3.5">
              <span className="relative block h-[84px] w-full md:h-[100px] dt:h-[112px]">
                <Img
                  image={{ sources: art?.sources ?? category.image.sources }}
                  alt=""
                  sizes="180px"
                  className="absolute inset-0 size-full object-contain object-bottom drop-shadow-[0_8px_8px_rgb(23_27_39/0.12)] transition-transform duration-200 group-hover:-translate-y-0.5"
                />
              </span>
              <span className="pr-body text-center text-fg decoration-[var(--pr-brass)] decoration-2 underline-offset-[6px] group-hover:underline">{t(category.name)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ── 05 · Buy Now: four equal vertical cards ──────────────────────────────
function ProductCard({ product }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[5px] border border-[#ebe9e3] bg-white">
      <div className="relative aspect-[322/268] w-full bg-white">
        <Img image={product.images[0]} alt="" sizes="(min-width: 1200px) 322px, (min-width: 768px) 45vw, 48vw" className="absolute inset-0 size-full object-contain px-3 pb-1 pt-4" />
        <HeartButton product={product} className="absolute end-1.5 top-1.5" />
      </div>
      <div className="flex flex-1 flex-col px-3 pb-2 pt-1">
        <p className="truncate pr-xs text-fg-2">{sellerName(product.seller, t)}</p>
        <h3 className="mt-1 truncate pr-title text-fg dt:text-[17px] dt:leading-[23px]">
          <Link href={link(detailPath(product))} title={t(product.title)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {cardTitle(t(product.title))}
          </Link>
        </h3>
        <GradePill grade={product.grade} className="mt-2 w-fit" />
        <Money value={product.price} className="mt-2 self-start pr-price text-fg" symbolClassName="text-[0.78em]" />
        <div className="mt-auto pt-2">
          <AddToCart product={product} className="relative z-10 h-11 w-full" />
        </div>
      </div>
    </article>
  );
}

export function BuyNowShelf() {
  const { t, ui } = useLang();
  const titleId = useId();
  return (
    <section data-ref="05" aria-labelledby={titleId} className="pr-container pb-6 pt-5 dt:pb-6 dt:pt-[21px]">
      <SectionHead id={titleId} title={t(COPY.buyNowTitle)} sub={t(COPY.buyNowSub)} href="/browse?tab=buy_now" linkLabel={ui("viewAll")} />
      <ul className="mt-4 grid grid-cols-2 gap-3 dt:mt-[19px] dt:grid-cols-4 dt:gap-4 max-[359px]:grid-cols-1 md:gap-4">
        {BUY_NOW.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 06 · Ending soon: stone band, intro column + three horizontal cards ───
function AuctionCard({ product }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  return (
    <article className="relative grid h-full grid-cols-[47%_minmax(0,1fr)] overflow-hidden rounded-[5px] bg-white dt:min-h-[251px]">
      <div className="relative min-h-[190px]">
        <Img image={product.images[0]} cutout alt="" sizes="170px" className="absolute inset-3 size-[calc(100%-24px)] object-contain" />
      </div>
      <div className="flex min-w-0 flex-col py-4 pe-3 ps-1 dt:pt-[22px]">
        <h3 className="line-clamp-2 pr-sm font-semibold text-fg">
          <Link href={link(detailPath(product))} title={t(product.title)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {cardTitle(t(product.title))}
          </Link>
        </h3>
        <p className="mt-0.5 truncate pr-xs text-fg-2">{sellerName(product.seller, t)}</p>
        <GradePill grade={product.grade} className="mt-2 w-fit" />
        <p className="mt-1.5 pr-xs text-fg-2">{ui("currentBid")}</p>
        <Money value={product.currentBid} className="self-start pr-price-sm text-fg" symbolClassName="text-[0.78em]" />
        <TimeLeft endsIn={product.endsIn} className="mt-1 pr-body" />
        <Link href={link(detailPath(product))} aria-label={t(COPY.bidNamed, { title: t(product.title) })} className={btn("charcoal", "sm", "relative z-10 mt-auto h-10 w-full")}>
          {ui("bidNow")}
        </Link>
      </div>
    </article>
  );
}

export function EndingSoonBand() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section data-ref="06" aria-labelledby={titleId} className="bg-[var(--pr-stone)]">
      <div className="pr-container grid gap-5 py-7 dt:grid-cols-[240px_minmax(0,1fr)] dt:gap-5 dt:pb-9 dt:pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4 dt:block dt:pt-[15px]">
          <div>
            <span aria-hidden="true" className="pr-dash block" />
            <h2 id={titleId} className="mt-4 pr-h2 text-fg">
              {t(COPY.endingTitle)}
            </h2>
            <p className="mt-2 max-w-[230px] pr-md text-[#5e626c]">{t(COPY.endingSub)}</p>
          </div>
          <Link href={link("/browse?tab=auction")} className={btn("outline", "md", "h-[42px] !bg-transparent hover:!bg-white/60 dt:mt-[26px] dt:w-[212px]")}>
            {t(COPY.viewAllAuctions)}
            <Chevron className="size-4" />
          </Link>
        </div>
        <ul className="pr-rail -mx-[var(--pr-gutter)] flex snap-x gap-3 overflow-x-auto px-[var(--pr-gutter)] dt:mx-0 dt:grid dt:grid-cols-3 dt:gap-[11px] dt:overflow-visible dt:px-0">
          {ENDING.map((product) => (
            <li key={product.slug} className="w-[min(86%,360px)] shrink-0 snap-start dt:w-auto">
              <AuctionCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── 07 · Selected for your everyday: two photo + details panels ──────────
function SelectedPanel({ item }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { product, image, scene } = item;
  return (
    <article className="relative grid h-full overflow-hidden rounded-[5px] bg-[var(--pr-panel)] sm:grid-cols-[55%_minmax(0,1fr)]">
      <div className={cx("relative aspect-[16/10] sm:aspect-auto sm:min-h-[244px]", scene ? "bg-[#ece9e3]" : "bg-[#e9e8e5]")}>
        <Img
          image={image}
          alt=""
          sizes="(min-width: 1200px) 363px, (min-width: 640px) 50vw, 100vw"
          className={cx("absolute inset-0 size-full", scene ? "object-cover" : "pr-multiply object-contain px-6 py-3")}
          style={scene ? { objectPosition: "50% 62%" } : undefined}
        />
      </div>
      <div className="flex min-w-0 flex-col px-5 py-5 dt:px-[34px] dt:pb-4 dt:pt-[34px]">
        <h3 className="line-clamp-2 pr-title text-fg">
          <Link href={link(detailPath(product))} title={t(product.title)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {cardTitle(t(product.title))}
          </Link>
        </h3>
        <p className="mt-2 truncate pr-xs text-fg-2">{sellerName(product.seller, t)}</p>
        <GradePill grade={product.grade} className="mt-3 w-fit" />
        <Money value={product.price} className="mt-3 self-start pr-price text-fg" symbolClassName="text-[0.78em]" />
        <AddToCart product={product} className="relative z-10 mt-3 h-[45px] w-full max-w-[224px]" />
      </div>
    </article>
  );
}

export function Selected() {
  const { t, ui } = useLang();
  const titleId = useId();
  return (
    <section data-ref="07" aria-labelledby={titleId} className="pr-container pb-5 pt-6 dt:pb-6 dt:pt-[19px]">
      <SectionHead id={titleId} title={t(COPY.selectedTitle)} sub={t(COPY.selectedSub)} href="/browse?tab=buy_now" linkLabel={ui("viewAll")} />
      <ul className="mt-4 grid gap-4 lg:grid-cols-2 dt:mt-[19px] dt:gap-5">
        {SELECTED.map((item) => (
          <li key={item.product.slug}>
            <SelectedPanel item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 08 · Live auction: warehouse preview + separate current-lot panel ────
export function LiveSection({ live }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const lot = live.current;
  const host = SELLER_BY_CODE[LIVE_EVENT.host];
  return (
    <section data-ref="08" aria-labelledby={titleId} className="pr-container pb-6 pt-4 dt:pb-[27px] dt:pt-1.5">
      <SectionHead id={titleId} title={t(COPY.liveTitle)} sub={t(COPY.liveSub)} />
      <div className="mt-4 grid gap-4 lg:grid-cols-[56.3%_minmax(0,1fr)] dt:mt-3.5 dt:gap-5">
        {/* Event: warehouse preview with status, play and title. Below ~445 px
            the 16:9 frame is too short for the play button above a two-line
            title, so it never drops under 232 px (256 px for the taller Arabic
            title). w-full keeps the width tied to the column; otherwise the
            min-height would widen it through the ratio. */}
        <Link href={link("/live-auction")} className="group relative block aspect-[16/9] min-h-[232px] w-full overflow-hidden rounded-[4px] bg-[#2a2926] outline-offset-2 rtl:min-h-[256px] lg:aspect-auto lg:h-[293px] dt:h-[296px]">
          <Img image={LIVE_STREAM.image} alt="" sizes="(min-width: 1200px) 752px, (min-width: 1024px) 56vw, 100vw" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" style={{ objectPosition: LIVE_STREAM.focus }} />
          <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/10" />
          <span className="absolute start-5 top-4 inline-flex h-9 items-center gap-2 rounded-[4px] bg-[var(--pr-live)] px-3 pr-md font-bold uppercase tracking-[0.02em] text-white dt:start-[37px] dt:top-[15px]">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-white" />
            {t(COPY.liveNow)}
          </span>
          <span aria-hidden="true" className="absolute start-1/2 top-[40%] grid size-[62px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white/90 bg-black/30 text-white backdrop-blur-[2px] rtl:translate-x-1/2 dt:size-[74px]">
            <Play className="ms-1 size-7 fill-white" strokeWidth={1.5} />
          </span>
          <span className="absolute inset-x-5 bottom-4 dt:inset-x-10 dt:bottom-[20px]">
            <span className="block pr-h3 text-white dt:text-[23px] dt:leading-[30px]">{t(LIVE_EVENT.title)}</span>
            <span className="mt-1 block pr-sm text-white/85">{t(host?.name)}</span>
            <span className="sr-only">{t(COPY.playPreview)}</span>
          </span>
        </Link>

        {/* Current lot: separate warm panel with the recliner cut-out */}
        <article className="relative grid grid-cols-[minmax(0,1fr)_42%] items-center overflow-hidden rounded-[4px] bg-[var(--pr-panel)] lg:h-[293px]">
          <div className="flex min-w-0 flex-col py-6 ps-5 pe-2 dt:ps-[30px] dt:pt-[30px] dt:pb-[28px]">
            <p className="flex items-center gap-3 pr-sm text-fg-2">
              <span aria-hidden="true" className="pr-dash !w-6" />
              {t(COPY.featuredItem)}
            </p>
            {lot ? (
              <>
                <h3 className="mt-3 line-clamp-2 pr-h3 font-medium text-fg dt:text-[19px]">{t(lot.title)}</h3>
                {lot.grade ? <GradePill grade={lot.grade} className="mt-2.5 w-fit" /> : null}
                <p className="mt-2 pr-xs text-fg-2">{ui("currentBid")}</p>
                <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 w-fit rounded px-1 pr-price text-fg" symbolClassName="text-[0.78em]" />
              </>
            ) : null}
            <Link href={link("/live-auction")} className={btn("charcoal", "lg", "mt-4 w-full max-w-[212px] dt:h-[52px] rtl:max-[379px]:h-auto rtl:max-[379px]:min-h-12 rtl:max-[379px]:whitespace-normal rtl:max-[379px]:px-3 rtl:max-[379px]:py-2 rtl:max-[379px]:text-center rtl:max-[379px]:leading-snug")}>
              {t(COPY.joinLive)}
            </Link>
          </div>
          <div className="relative h-full min-h-[190px]">
            {lot ? <Img image={lotImage(lot)} cutout alt="" sizes="260px" className="absolute inset-y-4 end-3 h-[calc(100%-32px)] w-[calc(100%-12px)] object-contain drop-shadow-[0_14px_14px_rgb(23_27_39/0.18)]" /> : null}
          </div>
        </article>
      </div>
    </section>
  );
}

// ── 09 · Bulk & Pallets: two aligned full-width rows ─────────────────────
function PalletRow({ product, image }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const add = useCartAdd(t(COPY.addedToCart));
  const auction = isAuction(product);
  const units = product.quantity;
  // Desktop tracks are fr shares equal to their 1440 px widths, so the row is
  // exact at 1440 and the lot name keeps its share down to 1200 px.
  return (
    <article className="relative grid grid-cols-[92px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 rounded-[5px] border border-[#ebe9e3] bg-white p-3 md:grid-cols-[150px_minmax(0,1fr)_auto] dt:h-[101px] dt:grid-cols-[240px_minmax(0,373fr)_110fr_207fr_224fr_180px] dt:gap-0 dt:p-0">
      <div className="relative row-span-2 h-[76px] md:row-span-1 dt:h-full">
        <Img image={image ?? product.images[0]} cutout alt="" sizes="200px" className="pr-multiply absolute inset-0 size-full object-contain dt:inset-y-0.5 dt:start-6 dt:h-[calc(100%-4px)] dt:w-[196px]" />
      </div>
      <div className="min-w-0 dt:ps-[19px]">
        <h3 className="line-clamp-2 pr-title text-fg">
          <Link href={link(detailPath(product))} className="hover:underline">
            {lotName(product, t)}
          </Link>
        </h3>
        <p className="mt-1 truncate pr-sm text-fg-2">{sellerName(product.seller, t)}</p>
        {units ? <p className="mt-1 pr-sm font-semibold text-fg dt:hidden">{pl("units", units)}</p> : null}
      </div>
      <p className="hidden text-center pr-md font-semibold text-fg dt:block">{units ? pl("units", units) : null}</p>
      <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-2 md:col-start-auto md:justify-end dt:contents">
        <div className="dt:flex dt:h-[50px] dt:items-center dt:justify-center dt:border-x dt:border-line">
          <Link href={link(detailPath(product))} aria-label={t(COPY.manifestNamed, { title: t(product.title) })} className="pr-link pr-md font-medium text-[var(--pr-bronze)]">
            {t(COPY.viewManifest)}
          </Link>
        </div>
        <div className="dt:ps-[50px]">
          <p className="pr-xs text-fg-2">{auction ? ui("currentBid") : ui("buyNow")}</p>
          <Money value={auction ? product.currentBid : product.price} className="pr-price-sm text-fg" symbolClassName="text-[0.78em]" />
        </div>
        <div className="dt:pe-[26px]">
          {auction ? (
            <Link href={link(detailPath(product))} aria-label={t(COPY.bidNamed, { title: t(product.title) })} className={btn("charcoal", "md", "h-12 w-[153px]")}>
              {ui("bidNow")}
            </Link>
          ) : (
            <button type="button" onClick={() => add(product)} aria-label={t(COPY.addNamed, { title: t(product.title) })} className={btn("charcoal", "md", "h-12 w-[153px]")}>
              <CartGlyph />
              {ui("addToCart")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function CartGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

export function BulkRows() {
  const { t, ui } = useLang();
  const titleId = useId();
  return (
    <section data-ref="09" aria-labelledby={titleId} className="pr-container pb-5 pt-3 dt:pb-[21px] dt:pt-[9px]">
      <SectionHead id={titleId} title={t(COPY.bulkTitle)} sub={t(COPY.bulkSub)} href="/browse?category=bulk-pallets" linkLabel={ui("viewAll")} />
      <ul className="mt-4 grid gap-3 dt:mt-3">
        {PALLETS.map(({ product, image }) => (
          <li key={product.slug}>
            <PalletRow product={product} image={image} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 10 · Featured Sellers: five compact landscape cards ──────────────────
export function Sellers() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section data-ref="10" aria-labelledby={titleId} className="pr-container pb-10 pt-2 dt:pb-9 dt:pt-3">
      <SectionHead id={titleId} title={t(COPY.sellersTitle)} sub={t(COPY.sellersSub)} href="/seller" linkLabel={t(COPY.viewAllSellers)} />
      <ul className="pr-rail -mx-[var(--pr-gutter)] mt-4 flex snap-x gap-3 overflow-x-auto px-[var(--pr-gutter)] md:grid md:grid-cols-3 md:overflow-visible dt:mx-0 dt:mt-[18px] dt:grid-cols-5 dt:px-0">
        {SELLER_CARDS.map(({ code, seller, cover, focus, plate }) => (
          <li key={code} className="w-[min(72%,280px)] shrink-0 snap-start md:w-auto">
            <article className="relative flex h-[134px] gap-4 rounded-[5px] border border-[#ebe9e3] bg-white p-2.5 ps-3">
              {/* 100 px cover, narrowing on the slimmest cards (1200 px desktop,
                  320 px phones) so two-line names and "Shop now" still fit. */}
              <span className={cx("relative w-[clamp(76px,43%,100px)] shrink-0 overflow-hidden rounded-[4px]", plate ? "bg-[#eeede9]" : "bg-[#e7e3dc]")}>
                <Img image={cover} alt="" sizes="100px" className={cx("absolute inset-0 size-full", plate ? "pr-multiply object-contain p-2" : "object-cover")} style={plate ? undefined : { objectPosition: focus }} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col pb-2 pt-[18px]">
                <h3 className="line-clamp-2 pr-md font-medium text-fg">{t(seller.name)}</h3>
                <Link href={link(`/seller/${code}`)} aria-label={t(COPY.shopNamed, { name: t(seller.name) })} className="pr-link mt-auto inline-flex items-center gap-1.5 pr-sm font-medium text-[var(--pr-bronze)] after:absolute after:inset-0 after:content-['']">
                  {t(COPY.shopNow)}
                  <Chevron className="size-3.5" />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 11 · Trust strip ─────────────────────────────────────────────────────
export function TrustStrip() {
  const { t } = useLang();
  const items = [
    { key: "graded", icon: ClipboardList, tone: "text-fg", title: COPY.trustGradedTitle, text: COPY.trustGradedText },
    { key: "seller", icon: UserRoundSearch, tone: "text-[var(--pr-bronze)]", title: COPY.trustSellerTitle, text: COPY.trustSellerText },
    { key: "delivery", icon: Truck, tone: "text-[var(--pr-bronze)]", title: COPY.trustDeliveryTitle, text: COPY.trustDeliveryText },
  ];
  return (
    <section data-ref="11" aria-label={t(COPY.trustLabel)} className="bg-[var(--pr-stone)]">
      <ul className="pr-container grid gap-y-5 py-6 md:grid-cols-3 dt:h-[112px] dt:items-center dt:py-0">
        {items.map((item, i) => (
          <li key={item.key} className={cx("flex items-center gap-5 md:px-4 dt:gap-9 dt:ps-[60px]", i > 0 && "md:border-s md:border-[#d6d0c5] dt:ps-[58px]")}>
            <item.icon aria-hidden="true" className={cx("size-10 shrink-0 dt:size-[50px]", item.tone)} strokeWidth={1.4} />
            <div className="min-w-0">
              <h3 className="pr-lg font-medium text-fg">{t(item.title)}</h3>
              <p className="mt-0.5 pr-sm text-[#5e626c]">{t(item.text)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 12 + 13 · Condition grades beside How Khaznah works ──────────────────
function GradeGuide() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const described = ["new", "A", "B", "C"];
  return (
    <div id="grades">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="pr-dash" />
            <h2 className="pr-h2 !text-[26px] !leading-8 text-fg">{t(COPY.gradesTitle)}</h2>
          </div>
          <p className="mt-1 ps-11 pr-sm text-fg-2 dt:mt-0">{t(COPY.gradesSub)}</p>
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls={panelId} className="pr-link mt-1.5 inline-flex shrink-0 items-center gap-1.5 pr-md font-medium text-[var(--pr-bronze)]">
          {t(COPY.gradeGuide)}
          <Chevron className={cx("size-4 transition-transform", open && "rotate-90")} />
        </button>
      </div>
      <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {GRADE_ORDER.map((grade) => (
          <li key={grade} className={cx("grid h-[50px] place-items-center rounded-[6px] pr-md font-semibold", grade === "A" ? "bg-[var(--pr-guide-green-bg)] text-[var(--pr-grade-a)]" : grade === "C" ? "bg-[#fdf0dc] text-[var(--pr-grade-b)]" : grade === "B" || grade === "new" ? "bg-[var(--pr-guide-blue-bg)] text-[var(--pr-guide-blue)]" : "bg-[var(--pr-guide-pink-bg)] text-[var(--pr-guide-pink)]")}>
            <span aria-hidden="true">{t(GRADES[grade].short)}</span>
            <span className="sr-only">{t(GRADES[grade].label)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-3 space-y-[7px] dt:mt-[9px] dt:space-y-1.5">
        {described.map((grade) => (
          <div key={grade} className="flex items-center gap-3">
            <dt className={cx("grid h-[22px] min-w-[38px] place-items-center rounded-full px-2 pr-label", grade === "new" ? "text-fg" : gradeTone(grade))}>
              <span aria-hidden="true">{t(GRADES[grade].short)}</span>
              <span className="sr-only">{t(GRADES[grade].label)}</span>
            </dt>
            <dd className="pr-sm text-fg-2">{t(GRADES[grade].text)}</dd>
          </div>
        ))}
      </dl>
      <div id={panelId} hidden={!open} className="mt-4 rounded-[5px] border border-line bg-white p-4">
        <p className="pr-md font-semibold text-fg">{t(COPY.gradeGuideTitle)}</p>
        <dl className="mt-2 space-y-2">
          {GRADE_ORDER.map((grade) => (
            <div key={grade} className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
              <dt className="pr-sm font-semibold text-fg">{t(GRADES[grade].label)}</dt>
              <dd className="pr-sm text-fg-2">{t(GRADES[grade].text)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function HowItWorks() {
  const { t } = useLang();
  return (
    <div id="how-it-works">
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="pr-dash" />
        <h2 className="pr-h2 !text-[26px] !leading-8 text-fg">{t(COPY.howTitle)}</h2>
      </div>
      <ol className="mt-5 grid gap-6 sm:grid-cols-3 sm:gap-0">
        {COPY.steps.map((step, i) => (
          <li key={step.title.en} className={cx("flex items-start gap-4 sm:flex-col sm:items-center sm:px-3 sm:text-center", i > 0 && "sm:border-s sm:border-line")}>
            <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--pr-bronze)] text-[19px] font-semibold text-white tabular dt:size-[47px]">
              {i + 1}
            </span>
            <div className="min-w-0">
              <h3 className="pr-step text-fg sm:mt-3">
                <span className="sr-only">{i + 1}. </span>
                {t(step.title)}
              </h3>
              <p className="mt-1.5 pr-sm text-fg-2">{t(step.text)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function GuidanceSplit() {
  // Side by side from 1200 px; below that the three steps need the full width.
  return (
    <section data-ref="12" className="pr-container grid gap-10 py-8 dt:grid-cols-[minmax(0,665fr)_minmax(0,634fr)] dt:gap-0 dt:pb-[37px] dt:pt-[23px]">
      <div className="dt:pe-9">
        <GradeGuide />
      </div>
      <div className="dt:border-s dt:border-line dt:ps-9">
        <HowItWorks />
      </div>
    </section>
  );
}
