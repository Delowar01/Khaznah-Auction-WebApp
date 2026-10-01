"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Gavel, Package, Play, ShoppingCart, Store, Target, Truck } from "lucide-react";
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
import { CATEGORY_PILLS, COMPACT_SELLERS, ENDING, FEATURED, LIVE_STILL, PALLETS, PROMOTED_SELLERS, WALL_BUY_NOW, WALL_RECOMMENDED } from "./data";
import { Arrow, CartCircle, CountdownPill, GradePill, HeartDisk, SectionHead, btn, cx, gradeTone } from "./ui";

const sellerName = (code, t) => t(SELLER_BY_CODE[code]?.name ?? { en: "", ar: "" });
const lotName = (product, t) => t(product.title).replace(/\s+[—–-]\s+\d+\s+\S+$/u, "");

// ── 04 · Eight outlined category pills, four by two ──────────────────────
export function CategoryPills() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <nav data-ref="04" aria-label={t(COPY.categoriesLabel)} className="vd-container pt-3 dt:pt-[26px]">
      <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 dt:gap-x-[13px] dt:gap-y-[15px] dt:px-[16px]">
        {CATEGORY_PILLS.map(({ slug, icon: Icon, category }) => (
          <li key={slug}>
            <Link href={link(`/browse?category=${slug}`)} className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#dfe7f3] bg-white px-3 vd-md text-[var(--vd-ink)] transition-colors hover:border-[#c3d2ea] hover:bg-[#f3f7fc] max-sm:text-[13px] max-sm:leading-4 sm:gap-3 sm:px-4 dt:h-[64px] dt:gap-7 dt:text-[16px]">
              <Icon aria-hidden="true" className="size-5 shrink-0 text-[var(--vd-indigo)] sm:size-6 dt:size-[33px]" strokeWidth={1.7} />
              <span className="min-w-0">{slug === "bulk-pallets" ? t(COPY.navBulk) : t(category.name)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ── 05 · Mixed-height product wall ───────────────────────────────────────
function WallCard({ row }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { product, tall, recommended, tone, area, photo, focus } = row;
  if (!product) return null;
  return (
    <article style={{ gridArea: area }} className="relative flex h-full flex-col overflow-hidden rounded-[16px] border border-[var(--vd-line)] bg-white">
      <div className={cx("relative w-full overflow-hidden", tall ? "aspect-[4/5] md:aspect-square dt:aspect-auto dt:flex-1" : "aspect-[315/170] min-[380px]:max-sm:aspect-[4/3] dt:aspect-auto dt:h-[169px] dt:rtl:h-[158px]")} style={{ background: tone }}>
        <Img
          image={photo ?? product.images[0]}
          cutout={!photo}
          alt=""
          sizes={tall ? "(min-width: 1200px) 335px, 50vw" : "(min-width: 1200px) 315px, 50vw"}
          className={photo ? "absolute inset-0 size-full object-cover" : cx("vd-multiply absolute inset-0 size-full object-contain", tall ? "px-6 pb-5 pt-12 dt:px-8 dt:pb-6 dt:pt-14" : "px-8 pb-3 pt-4 dt:pt-[18px]")}
          style={photo && focus ? { objectPosition: focus } : undefined}
        />
        {recommended ? (
          <span className="absolute bottom-2 start-2 inline-flex h-[26px] items-center gap-1.5 rounded-full bg-[var(--vd-coral)] px-2.5 vd-label text-white sm:bottom-auto sm:start-3 sm:top-3">
            <Target aria-hidden="true" className="size-3.5" strokeWidth={2.4} />
            {t(COPY.recommended)}
          </span>
        ) : null}
        <HeartDisk product={product} className="absolute end-3 top-3" />
      </div>
      <div className={cx("relative flex flex-col px-4 pb-3 pt-3", tall ? "dt:h-[127px] dt:px-[21px] dt:pb-[13px] dt:pt-[13px]" : "dt:h-[108px] dt:pb-[9px] dt:pt-[10px] dt:rtl:h-[119px]")}>
        <h3 className="shrink-0 truncate vd-title text-[var(--vd-ink)]">
          <Link href={link(detailPath(product))} title={t(product.title)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {cardTitle(t(product.title))}
          </Link>
        </h3>
        <p className="shrink-0 truncate vd-sm text-[var(--vd-muted)]">{sellerName(product.seller, t)}</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <GradePill grade={product.grade} />
            <div className="mt-0.5">
              <Money value={product.price} className="vd-price text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />
            </div>
          </div>
          <CartCircle product={product} className="relative mb-0.5" />
        </div>
      </div>
    </article>
  );
}

export function ProductWall() {
  const { t, ui } = useLang();
  const titleId = useId();
  const [view, setView] = useState("buy");
  const rows = view === "buy" ? WALL_BUY_NOW : WALL_RECOMMENDED;
  const tabs = [
    ["buy", t(COPY.tabBuyNow)],
    ["recommended", t(COPY.tabRecommended)],
  ];
  return (
    <section data-ref="05" aria-labelledby={titleId} className="vd-container pt-7 dt:pt-[30px]">
      <SectionHead id={titleId} title={t(COPY.wallTitle)} href="/browse?tab=buy_now" linkLabel={t(COPY.viewAllProducts)}>
        <div role="group" aria-label={t(COPY.wallView)} className="flex items-center gap-1 dt:ms-[88px]">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => setView(key)}
              className={cx(
                "h-9 rounded-full px-5 vd-md transition-colors dt:h-[38px]",
                view === key ? "bg-[var(--vd-indigo)] font-semibold text-white" : "bg-[var(--vd-bluegray)] text-[var(--vd-ink)] hover:bg-[#dfe7f2]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </SectionHead>
      <span className="sr-only" aria-live="polite">
        {view === "buy" ? ui("buyNow") : t(COPY.tabRecommended)}
      </span>
      <div className="vd-wall mt-5 dt:mt-[22px] dt:h-[569px]">
        {rows.map((row) => (
          <WallCard key={`${view}-${row.area}`} row={row} />
        ))}
      </div>
    </section>
  );
}

// ── 06 · Full-width navy live banner (before Ending soon) ────────────────
export function LiveBanner({ live }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const lot = live.current;
  const host = SELLER_BY_CODE[LIVE_EVENT.host];
  return (
    <section data-ref="06" aria-labelledby={titleId} className="mt-7 bg-[var(--vd-navy)] text-white dt:mt-[30px]">
      {/* Areas: phone copy → video → lot → join; tablet copy/lot/join beside the video; desktop one row */}
      <div className="vd-container vd-live py-8 dt:min-h-[313px] dt:py-4">
        <div style={{ gridArea: "copy" }} className="dt:pe-6">
          <p className="inline-flex h-10 items-center gap-2.5 rounded-full bg-[var(--vd-live)] px-5 vd-lg font-bold uppercase text-white dt:h-[42px] dt:gap-3 dt:px-[18px] dt:text-[20px]">
            <span aria-hidden="true" className="size-3 rounded-full bg-white/90 dt:size-[14px]" />
            {t(COPY.liveNow)}
          </p>
          <h2 id={titleId} className="mt-2 vd-live-title text-white">
            {t(LIVE_EVENT.title)}
          </h2>
          <p className="mt-1.5 vd-lg text-white/90 dt:text-[18px]">{t(COPY.hostedBy, { name: t(host?.name) })}</p>
        </div>
        <div style={{ gridArea: "join" }} className="dt:pe-6">
          <Link href={link("/live-auction")} className={btn("gold", "lg", "w-full max-w-[368px] justify-between !rounded-[12px] px-4 max-md:max-w-none dt:mt-4 dt:h-[60px] dt:ps-[18px] dt:pe-[24px] dt:text-[19px] dt:font-semibold")}>
            <span className="flex items-center gap-3">
              <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-[var(--vd-navy)] text-white">
                <Play className="ms-0.5 size-4 fill-white" strokeWidth={1.5} />
              </span>
              {t(COPY.joinLive)}
            </span>
            <Arrow className="size-5" />
          </Link>
        </div>
        {/* Compact current-lot card, subordinate to the event title */}
        {lot ? (
          <article style={{ gridArea: "lot" }} aria-label={t(COPY.currentLot)} className="grid h-[164px] grid-cols-[98px_minmax(0,1fr)] items-center gap-3 self-center rounded-[14px] bg-white py-3 ps-2.5 pe-3 text-[var(--vd-ink)] md:max-w-[340px] dt:w-[251px]">
            <div className="relative h-full">
              <Img image={lotImage(lot)} cutout alt="" sizes="98px" className="absolute inset-0 size-full object-contain" />
            </div>
            <div className="min-w-0">
              <h3 className="line-clamp-2 vd-title !text-[14px] !leading-[18px]">{t(lot.title)}</h3>
              {lot.grade ? <GradePill grade={lot.grade} className="mt-1.5" /> : null}
              <p className="mt-1.5 vd-xs text-[var(--vd-muted)]">{ui("currentBid")}</p>
              <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded px-1 vd-price !text-[23px] text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />
            </div>
          </article>
        ) : null}
        {/* Event video preview */}
        <Link
          href={link("/live-auction")}
          style={{ gridArea: "video" }}
          className="group relative block aspect-[515/268] overflow-hidden rounded-[20px] bg-[#0e2a4d] outline-offset-2 md:aspect-auto md:h-full md:min-h-[260px] dt:ms-4 dt:aspect-[515/268] dt:h-auto dt:min-h-0 dt:self-center"
        >
          <Img image={LIVE_STILL.image} alt="" sizes="(min-width: 1200px) 515px, (min-width: 768px) 50vw, 100vw" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" style={{ objectPosition: LIVE_STILL.focus }} />
          <span aria-hidden="true" className="absolute inset-0 bg-[#06213f]/20" />
          <span className="absolute end-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--vd-live)] px-2.5 vd-label uppercase text-white">
            <span aria-hidden="true" className="size-2 rounded-full border-2 border-white" />
            {t(COPY.liveNow)}
          </span>
          <span aria-hidden="true" className="absolute start-1/2 top-1/2 grid size-[62px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--vd-navy)] shadow-lg rtl:translate-x-1/2">
            <Play className="ms-1 size-6 fill-[var(--vd-navy)]" strokeWidth={1.5} />
          </span>
          <span className="sr-only">{t(COPY.playPreview)}</span>
        </Link>
      </div>
    </section>
  );
}

// ── 07 · Ending soon: three image-first cards ───────────────────────────
function AuctionCard({ product, tone, photo, first }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[14px] border border-[#dfe7f3] bg-white">
      <div className="relative aspect-[427/204] overflow-hidden" style={{ background: tone }}>
        <Img image={photo ?? product.images[0]} cutout={!photo} alt="" sizes="(min-width: 1200px) 430px, 86vw" className={photo ? "absolute inset-0 size-full object-cover" : "vd-multiply absolute inset-0 size-full object-contain px-8 pb-3 pt-5"} />
        <CountdownPill endsIn={product.endsIn} className="absolute end-3.5 top-3.5" />
        {first ? <HeartDisk product={product} className="absolute start-3.5 top-3.5" /> : null}
      </div>
      <div className="flex flex-1 flex-col px-5 pb-4 pt-4 dt:px-[22px] dt:pb-[14px] dt:pt-[16px]">
        <h3 className="truncate vd-title text-[var(--vd-ink)] dt:text-[17px] dt:leading-[22px]">
          <Link href={link(detailPath(product))} title={t(product.title)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {cardTitle(t(product.title))}
          </Link>
        </h3>
        <p className="mt-0.5 truncate vd-sm text-[var(--vd-muted)] dt:text-[14px]">{sellerName(product.seller, t)}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-1.5">
          <div className="min-w-0">
            <GradePill grade={product.grade} />
            <p className="mt-1.5 whitespace-nowrap vd-sm text-[var(--vd-muted)]">{ui("currentBid")}</p>
            <Money value={product.currentBid} className="vd-price text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />
          </div>
          <Link href={link(detailPath(product))} aria-label={t(COPY.bidNamed, { title: t(product.title) })} className="relative z-10 mb-1 inline-flex h-[50px] w-[118px] shrink-0 items-center justify-center rounded-[12px] sm:w-[151px] border-[1.5px] border-[var(--vd-indigo)] bg-white vd-md font-semibold text-[var(--vd-ink)] hover:bg-[var(--vd-bluegray)]">
            {ui("bidNow")}
          </Link>
        </div>
      </div>
    </article>
  );
}

export function EndingSoon() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section data-ref="07" aria-labelledby={titleId} className="vd-container pt-6 dt:pt-[21px]">
      <SectionHead id={titleId} title={t(COPY.endingTitle)} href="/browse?tab=auction" linkLabel={t(COPY.viewAllAuctions)} />
      <ul className="vd-rail -mx-[var(--vd-gutter)] mt-4 flex snap-x gap-4 overflow-x-auto px-[var(--vd-gutter)] lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 dt:mt-[9px] dt:gap-[26px]">
        {ENDING.map(({ product, tone, photo }, i) => (
          <li key={product.slug} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
            <AuctionCard product={product} tone={tone} photo={photo} first={i === 0} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 07b · Featured Items: an auction-led photo mosaic, then Buy Now finds ─
function AuctionChip() {
  const { t } = useLang();
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-[var(--vd-bluegray)] px-2.5 vd-label uppercase tracking-[0.06em] text-[var(--vd-indigo)]">
      <Gavel aria-hidden="true" className="size-3.5" strokeWidth={2.2} />
      {t(COPY.featuredAuction)}
    </span>
  );
}

/** Lead lot: its own scene photograph with the bid on a white card. */
function FeaturedLead({ item }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { product, photo, focus } = item;
  return (
    <article className="relative h-full min-h-[380px] overflow-hidden rounded-[18px] bg-[#e8e1d8] md:min-h-[420px]">
      <Img image={photo} alt="" sizes="(min-width: 1200px) 580px, (min-width: 768px) 40vw, 100vw" className="absolute inset-0 size-full object-cover" style={{ objectPosition: focus }} />
      <HeartDisk product={product} className="absolute start-3.5 top-3.5" />
      <CountdownPill endsIn={product.endsIn} className="absolute end-3.5 top-3.5" />
      <div className="absolute inset-x-3 bottom-3 rounded-[14px] bg-white p-4 shadow-[0_10px_28px_-14px_rgb(7_27_82/0.45)] dt:inset-x-4 dt:bottom-4 dt:px-5">
        <AuctionChip />
        <h3 className="mt-2 line-clamp-2 vd-h3 !text-[18px] !leading-6 text-[var(--vd-ink)]">
          <Link href={link(detailPath(product))} title={t(product.title)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {cardTitle(t(product.title))}
          </Link>
        </h3>
        <div className="mt-2.5 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <p className="vd-sm text-[var(--vd-muted)]">
              {ui("currentBid")} · {pl("bids", product.bidCount)}
            </p>
            <Money value={product.currentBid} className="vd-price text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />
          </div>
          <Link href={link(detailPath(product))} aria-label={t(COPY.bidNamed, { title: t(product.title) })} className={btn("indigo", "lg", "relative z-10 h-[50px] !rounded-[12px] px-8")}>
            {ui("bidNow")}
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Auction lot on a tinted plate; the wide tile sets its plate beside the details. */
function FeaturedAuctionTile({ item }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { product, tone, wide } = item;
  return (
    <article className={cx("@container relative grid h-full overflow-hidden rounded-[16px] border border-[var(--vd-line)] bg-white", wide ? "sm:grid-cols-[minmax(0,44%)_minmax(0,1fr)]" : "grid-rows-[auto_minmax(0,1fr)]")}>
      <div className={cx("relative", wide ? "h-[150px] sm:h-full sm:min-h-[180px]" : "h-[140px] dt:h-[150px]")} style={{ background: tone }}>
        <Img image={product.images[0]} cutout alt="" sizes={wide ? "(min-width: 1200px) 330px, (min-width: 640px) 40vw, 100vw" : "(min-width: 1200px) 365px, (min-width: 768px) 25vw, 50vw"} className="vd-multiply absolute inset-0 size-full object-contain px-6 pb-3 pt-12" />
        <HeartDisk product={product} className="absolute start-2.5 top-2.5" />
        <CountdownPill endsIn={product.endsIn} className="absolute end-2.5 top-2.5" />
      </div>
      <div className="flex min-w-0 flex-col px-4 pb-3.5 pt-3">
        <h3 className={cx("vd-title text-[var(--vd-ink)]", wide ? "line-clamp-2" : "truncate")}>
          <Link href={link(detailPath(product))} title={t(product.title)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {cardTitle(t(product.title))}
          </Link>
        </h3>
        {wide ? (
          <>
            <p className="mt-0.5 truncate vd-sm text-[var(--vd-muted)]">{sellerName(product.seller, t)}</p>
            <GradePill grade={product.grade} className="mt-2" />
          </>
        ) : null}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 pt-2">
          <div className="min-w-0">
            <p className="whitespace-nowrap vd-xs text-[var(--vd-muted)]">
              {ui("currentBid")}
              {wide ? ` · ${pl("bids", product.bidCount)}` : null}
            </p>
            <Money value={product.currentBid} className="vd-price text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />
          </div>
          <Link href={link(detailPath(product))} aria-label={t(COPY.bidNamed, { title: t(product.title) })} className={btn("indigo", "md", "relative z-10 h-11 !rounded-[12px] px-5 @max-[13rem]:w-full")}>
            {ui("bidNow")}
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Buy Now find: a compact photo card with a quieter cart button. */
function FeaturedBuyNowTile({ item }) {
  const { t } = useLang();
  const { link } = useConcept();
  const add = useCartAdd(t(COPY.addedToCart));
  const { product, photo, focus, tone } = item;
  return (
    <article className="relative flex h-full items-center gap-3.5 rounded-[14px] border border-[var(--vd-line)] bg-white p-2.5 pe-3.5">
      <div className="relative size-[84px] shrink-0 overflow-hidden rounded-[10px]" style={{ background: tone }}>
        <Img
          image={photo ?? product.images[0]}
          cutout={!photo}
          alt=""
          sizes="84px"
          className={photo ? "absolute inset-0 size-full object-cover" : "vd-multiply absolute inset-0 size-full object-contain p-2"}
          style={photo && focus ? { objectPosition: focus } : undefined}
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate vd-title text-[var(--vd-ink)]">
          <Link href={link(detailPath(product))} title={t(product.title)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {cardTitle(t(product.title))}
          </Link>
        </h3>
        <p className="truncate vd-sm text-[var(--vd-muted)]">{sellerName(product.seller, t)}</p>
        <Money value={product.price} className="vd-price !text-[19px] !leading-6 text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />
      </div>
      <button
        type="button"
        disabled={product.stock <= 0}
        onClick={() => add(product)}
        aria-label={t(COPY.addNamed, { title: t(product.title) })}
        className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-[1.5px] border-[var(--vd-indigo)] bg-white text-[var(--vd-indigo)] transition-colors hover:bg-[var(--vd-bluegray)] disabled:opacity-40"
      >
        <ShoppingCart aria-hidden="true" className="size-[18px]" strokeWidth={2.1} />
      </button>
    </article>
  );
}

/**
 * Featured Items: the auction lots fill the mosaic (a lead photograph, two
 * plates, one wide tile); the Buy Now finds follow in a slimmer row.
 */
export function FeaturedItems() {
  const { t } = useLang();
  const titleId = useId();
  const buyNowId = useId();
  return (
    <section data-ref="07b" aria-labelledby={titleId} className="vd-container pt-7 dt:pt-[30px]">
      <SectionHead id={titleId} title={t(COPY.featuredTitle)} href="/browse?tab=auction" linkLabel={t(COPY.viewAllAuctions)} />
      <p className="mt-1 vd-lg text-[var(--vd-muted)]">{t(COPY.featuredSub)}</p>
      <ul className="vd-featured mt-4 dt:mt-[18px]">
        <li style={{ gridArea: "lead" }} className="min-w-0">
          <FeaturedLead item={FEATURED.lead} />
        </li>
        {FEATURED.auctions.map((item) => (
          <li key={item.product.slug} style={{ gridArea: item.area }} className="min-w-0">
            <FeaturedAuctionTile item={item} />
          </li>
        ))}
      </ul>
      <p id={buyNowId} className="mt-5 vd-sm font-bold uppercase tracking-[0.08em] text-[var(--vd-muted)] dt:mt-6">
        {t(COPY.featuredBuyNow)}
      </p>
      <ul aria-labelledby={buyNowId} className="mt-2.5 grid gap-3 lg:grid-cols-3 dt:gap-4">
        {FEATURED.buyNow.map((item) => (
          <li key={item.product.slug} className="min-w-0">
            <FeaturedBuyNowTile item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 08 · Seller discovery: two promoted banners over three compact cards ──
export function SellerShelves() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section data-ref="08" aria-labelledby={titleId} className="vd-container pt-7 dt:pt-[25px]">
      <SectionHead id={titleId} title={t(COPY.sellersTitle)} href="/seller" linkLabel={t(COPY.viewAllSellers)} />
      <ul className="mt-4 grid gap-4 md:grid-cols-2 dt:mt-[9px] dt:gap-[17px]">
        {PROMOTED_SELLERS.map(({ code, seller, cover, focus }) => (
          <li key={code}>
            <article className="relative h-[220px] overflow-hidden rounded-[18px] bg-[#1c2a3f] dt:h-[237px]">
              <Img image={cover} alt="" sizes="(min-width: 768px) 660px, 100vw" className="absolute inset-0 size-full object-cover" style={{ objectPosition: focus }} />
              <span aria-hidden="true" className="vd-banner-shade absolute inset-0" />
              <div className="absolute bottom-5 start-6 text-white dt:bottom-[20px] dt:start-[28px]">
                <h3 className="vd-h3 !text-[22px] !leading-7 text-white">{t(seller.name)}</h3>
                <p className="mt-0.5 vd-md text-white/90">{t(COPY.sellerLines[code])}</p>
                <Link href={link(`/seller/${code}`)} aria-label={t(COPY.browseNamed, { name: t(seller.name) })} className={btn("white", "sm", "mt-3 h-[38px] gap-4 px-6 after:absolute after:inset-0 after:content-['']")}>
                  {t(COPY.browseShop)}
                  <Arrow />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <ul className="vd-rail -mx-[var(--vd-gutter)] mt-3 flex snap-x gap-3 overflow-x-auto px-[var(--vd-gutter)] dt:mx-0 dt:mt-[14px] dt:grid dt:grid-cols-3 dt:gap-[22px] dt:overflow-visible dt:px-0">
        {COMPACT_SELLERS.map(({ code, seller, cover, focus, plate, zoom }) => (
          <li key={code} className="w-[86%] shrink-0 snap-start sm:w-[400px] dt:w-auto">
            {/* Below 430 px the photo narrows so "Browse shop" fits beside it. */}
            <article className="relative grid h-[130px] grid-cols-[46%_minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--vd-line)] bg-white max-[429px]:grid-cols-[36%_minmax(0,1fr)]">
              <div className={cx("relative overflow-hidden", plate ? "bg-[#f1ebe3]" : "bg-[#e4e8ee]")}>
                <Img
                  image={cover}
                  alt=""
                  sizes={zoom ? "480px" : "220px"}
                  className={cx("absolute", zoom ? "inset-y-0 right-0 h-full w-[230%] max-w-none object-cover" : "inset-0 size-full", plate ? "vd-multiply object-contain p-2" : "object-cover")}
                  style={focus ? { objectPosition: focus } : undefined}
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center px-4 max-[429px]:px-3 dt:ps-5">
                <h3 className="truncate vd-title text-[var(--vd-ink)]">{t(seller.name)}</h3>
                <p className="mt-0.5 line-clamp-2 vd-sm text-[var(--vd-muted)]">{t(COPY.sellerLines[code])}</p>
                <Link href={link(`/seller/${code}`)} aria-label={t(COPY.browseNamed, { name: t(seller.name) })} className={btn("soft", "sm", "mt-2.5 h-[38px] w-fit gap-3 px-5 max-[429px]:gap-1.5 max-[429px]:px-3 after:absolute after:inset-0 after:content-['']")}>
                  {t(COPY.browseShop)}
                  <Arrow />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 09 · Bulk & Pallets: two differently tinted panels ───────────────────
function PalletPanel({ product, image, tone, action }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const add = useCartAdd(t(COPY.addedToCart));
  const auction = action === "bid";
  return (
    <article className="relative grid h-full overflow-hidden rounded-[16px] sm:grid-cols-[52%_minmax(0,1fr)]" style={{ background: tone }}>
      <div className="relative h-[190px] sm:h-auto sm:min-h-[248px]">
        <Img image={image ?? product.images[0]} cutout alt="" sizes="(min-width: 1200px) 340px, 50vw" className="vd-multiply absolute inset-0 size-full object-contain px-6 py-5" />
      </div>
      <div className="flex min-w-0 flex-col justify-center px-5 pb-5 sm:ps-1 sm:pe-6 sm:pt-5">
        <h3 className="max-w-[270px] vd-h3 !text-[20px] !leading-6 text-[var(--vd-ink)] dt:!text-[22px] dt:!leading-[27px]">
          <Link href={link(detailPath(product))} className="hover:underline">
            {lotName(product, t)}
          </Link>
        </h3>
        {product.quantity ? <p className="vd-h3 !text-[20px] !leading-7 text-[var(--vd-ink)] dt:!text-[22px] dt:!leading-[27px]">{pl("units", product.quantity)}</p> : null}
        <p className="mt-1 vd-body text-[var(--vd-muted)]">{sellerName(product.seller, t)}</p>
        <p className="mt-1 vd-md text-[var(--vd-ink)]">{auction ? ui("currentBid") : ui("buyNow")}</p>
        <Money value={auction ? product.currentBid : product.price} className="self-start vd-price !text-[26px] text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />
        <div className="mt-3 flex flex-wrap gap-2.5">
          <Link href={link(detailPath(product))} aria-label={t(COPY.manifestNamed, { title: t(product.title) })} className={btn("outline", "md", "h-[43px] w-[136px] px-0 !border !border-[var(--vd-indigo)] vd-sm")}>
            {t(COPY.viewManifest)}
          </Link>
          {auction ? (
            <Link href={link(detailPath(product))} aria-label={t(COPY.bidNamed, { title: t(product.title) })} className={btn("navy", "md", "h-[43px] w-[130px] px-0 vd-sm")}>
              {ui("bidNow")}
            </Link>
          ) : (
            <button type="button" onClick={() => add(product)} aria-label={t(COPY.addNamed, { title: t(product.title) })} className={btn("indigo", "md", "h-[43px] w-[130px] px-0 vd-sm")}>
              {ui("addToCart")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function BulkPanels() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section data-ref="09" aria-labelledby={titleId} className="vd-container pt-7 dt:pt-[27px]">
      <SectionHead id={titleId} title={t(COPY.bulkTitle)} href="/browse?category=bulk-pallets" linkLabel={t(COPY.viewAllLots)} />
      <ul className="mt-4 grid gap-4 lg:grid-cols-2 dt:mt-[10px] dt:gap-[18px]">
        {PALLETS.map((row) => (
          <li key={row.product.slug}>
            <PalletPanel {...row} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 10 + 11 · A little clarity (with grade chips) and How it works ───────
export function Clarity() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const [guide, setGuide] = useState(false);
  const guideId = useId();
  const columns = [
    { key: "seller", icon: Store, title: COPY.sellerTitle, text: COPY.sellerText, href: "/seller" },
    { key: "delivery", icon: Truck, title: COPY.deliveryTitle, text: COPY.deliveryText },
  ];
  return (
    <section data-ref="10" aria-labelledby={titleId} className="vd-container pt-8 dt:pt-[33px]">
      <h2 id={titleId} className="vd-h2 text-[var(--vd-ink)]">
        {t(COPY.clarityTitle)}
      </h2>
      <div className="mt-4 grid gap-6 lg:grid-cols-3 lg:gap-0 dt:mt-[16px]">
        <div id="grades" className="flex gap-5 lg:pe-6">
          <span aria-hidden="true" className="grid size-[60px] shrink-0 place-items-center rounded-[14px] border-2 border-[var(--vd-indigo)] text-[var(--vd-indigo)] dt:size-[72px]">
            <Package className="size-8 dt:size-9" strokeWidth={1.6} />
          </span>
          <div className="min-w-0">
            <h3 className="vd-title !text-[17px] !leading-6 text-[var(--vd-ink)]">{t(COPY.gradesTitle)}</h3>
            <p className="mt-0.5 vd-body text-[var(--vd-muted)]">{t(COPY.gradesText)}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {GRADE_ORDER.map((grade) => (
                <li key={grade} className={cx("grid h-[34px] min-w-[34px] place-items-center rounded-[10px] px-2 vd-sm font-bold", grade === "new" ? "border border-[var(--vd-line)] bg-white text-[var(--vd-ink)]" : gradeTone(grade))}>
                  <span aria-hidden="true">{t(GRADES[grade].short)}</span>
                  <span className="sr-only">{t(GRADES[grade].label)}</span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setGuide((v) => !v)} aria-expanded={guide} aria-controls={guideId} className="vd-link mt-2 inline-flex items-center gap-2 vd-md text-[var(--vd-indigo)]">
              {t(COPY.gradeGuide)}
              <Arrow />
            </button>
            <div id={guideId} hidden={!guide} className="mt-3 rounded-[14px] border border-[var(--vd-line)] bg-white p-4">
              <p className="vd-md font-bold text-[var(--vd-ink)]">{t(COPY.gradeGuideTitle)}</p>
              <dl className="mt-2 space-y-2">
                {GRADE_ORDER.map((grade) => (
                  <div key={grade} className="grid grid-cols-[84px_minmax(0,1fr)] gap-3">
                    <dt className="vd-sm font-bold text-[var(--vd-ink)]">{t(GRADES[grade].label)}</dt>
                    <dd className="vd-sm text-[var(--vd-muted)]">{t(GRADES[grade].text)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        {columns.map((column) => (
          <div key={column.key} className="flex gap-5 lg:border-s lg:border-[var(--vd-line)] lg:px-6 dt:ps-[46px]">
            <column.icon aria-hidden="true" className="size-[60px] shrink-0 text-[var(--vd-indigo)] dt:size-[72px]" strokeWidth={1.4} />
            <div className="min-w-0 pt-2">
              <h3 className="vd-title !text-[17px] !leading-6 text-[var(--vd-ink)]">
                {column.href ? (
                  <Link href={link(column.href)} className="vd-link">
                    {t(column.title)}
                  </Link>
                ) : (
                  t(column.title)
                )}
              </h3>
              <p className="mt-0.5 vd-body text-[var(--vd-muted)]">{t(column.text)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section data-ref="11" id="how-it-works" aria-labelledby={titleId} className="vd-container pb-8 dt:pb-[34px]">
      <div className="mt-6 border-t border-[var(--vd-line)] pt-3 dt:mt-[14px] dt:pt-[11px]">
        <h2 id={titleId} className="vd-h3 !text-[20px] !leading-7 text-[var(--vd-ink)]">
          {t(COPY.howTitle)}
        </h2>
        <ol className="mt-3 grid gap-4 lg:grid-cols-3 lg:gap-0 dt:mt-0 dt:grid-cols-[minmax(0,430fr)_minmax(0,477fr)_minmax(0,433fr)]">
          {COPY.steps.map((step, i) => (
            <li key={step.title.en} className={cx("flex items-center gap-4 lg:pe-4 dt:gap-[26px]", i === 0 ? "lg:ps-8" : "lg:border-s lg:border-[var(--vd-line)] lg:ps-10 dt:ps-[50px]")}>
              <span aria-hidden="true" className="grid size-[45px] shrink-0 place-items-center rounded-full bg-[var(--vd-indigo)] text-[19px] font-bold text-white tabular">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="vd-title !text-[16px] text-[var(--vd-ink)]">
                  <span className="sr-only">{i + 1}. </span>
                  {t(step.title)}
                </h3>
                <p className="mt-0.5 vd-md text-[var(--vd-muted)]">{t(step.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
