"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { BadgeCheck, Bell, BellRing, Check, ChevronLeft, ChevronRight, CreditCard, Eye, Plus, ShieldCheck, Truck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { GRADES, GRADE_ORDER } from "@/data/grades";
import { LIVE_EVENT, OTHER_EVENTS } from "@/data/live";
import { CITIES, SELLERS, getSeller } from "@/data/sellers";
import { AUCTION_POLICY, HOW_IT_WORKS, STATS, TRUST_POINTS } from "@/data/site";
import { detailPath, isAuction, sellerProducts, sellerStats } from "@/lib/catalog";
import { useRemaining } from "@/lib/clock";
import { RIYAL, formatDuration, formatMonthYear, formatNumber } from "@/lib/format";
import { manifestUnits, palletFromPrice } from "@/components/concept-c/utils/lots";
import { useEventReminders } from "@/components/concept-c/live/useEventReminders";
import { AuctionCard, FeaturedAuction, ProductCard } from "./cards";
import { COPY } from "./copy";
import { AUCTION_VIEWS, BUY_NOW_COUNT, BUY_NOW_TABS, CATEGORY_TILES, OPEN_AUCTION_COUNT, TRADE } from "./data";
import { GradeMark, SectionHeading, TextLink, btnClass, cx } from "./ui";

/** Underlined text tabs (Best value · New arrivals · All). */
function Tabs({ label, value, onChange, options }) {
  const { t } = useLang();
  return (
    <div role="group" aria-label={label} className="flex items-center gap-5">
      {options.map(([key, text]) => (
        <button
          key={key}
          type="button"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className={cx(
            "h-10 border-b-2 pm-sm font-semibold transition-colors",
            value === key ? "border-fg text-fg" : "border-transparent text-fg-3 hover:text-fg",
          )}
        >
          {t(text)}
        </button>
      ))}
    </div>
  );
}

// ── Curated categories: an asymmetric editorial grid ────────────────────
function CategoryTile({ tile }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const category = CATEGORY_BY_SLUG[tile.slug];
  const tall = tile.area === "a";
  const wide = tile.area === "b";
  return (
    <li data-area={tile.area} className="flex flex-col">
      <Link href={link(`/browse?category=${tile.slug}`)} className="group flex h-full flex-col outline-offset-4">
        <span
          className={cx(
            "pm-zoom relative block overflow-hidden rounded-card",
            tile.studio ? "pm-plate" : "bg-surface-2",
            tall ? "aspect-[4/3] lg:aspect-auto lg:min-h-[420px] lg:flex-1" : wide ? "aspect-[4/3] lg:aspect-[16/9]" : "aspect-square lg:aspect-[4/3]",
          )}
        >
          <Img
            image={tile.image}
            alt=""
            sizes={tall || wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
            className={cx("absolute inset-0 size-full", tile.studio ? "pm-multiply object-contain p-[11%]" : "object-cover")}
            style={tile.position ? { objectPosition: tile.position } : undefined}
          />
        </span>
        <span className="mt-3 flex items-baseline justify-between gap-3">
          <span className="pm-h3 text-fg group-hover:underline">{t(category.name)}</span>
          <span className="shrink-0 pm-xs text-fg-3">{pl("lots", category.count)}</span>
        </span>
        {tall || wide ? <span className="mt-0.5 pm-sm text-fg-2">{t(category.blurb)}</span> : null}
      </Link>
    </li>
  );
}

export function Categories() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="pm-container py-16 lg:py-24">
      <SectionHeading
        id={titleId}
        eyebrow={t(COPY.departments)}
        title={t(COPY.shopByCategory)}
        sub={t(COPY.categoriesSub)}
        action={<TextLink href={link("/browse")}>{t(COPY.allCategories)}</TextLink>}
      />
      <ul className="pm-categories mt-10">
        {CATEGORY_TILES.map((tile) => (
          <CategoryTile key={tile.slug} tile={tile} />
        ))}
      </ul>
    </section>
  );
}

// ── The Buy Now edit: portrait cards with three views ───────────────────
export function BuyNowEdit() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const [tab, setTab] = useState("best");
  const items = BUY_NOW_TABS[tab];
  return (
    <section aria-labelledby={titleId} className="border-y border-line bg-surface py-16 lg:py-24">
      <div className="pm-container">
        <SectionHeading
          id={titleId}
          eyebrow={t(COPY.buyNowEyebrow)}
          title={t(COPY.buyNowTitle)}
          sub={t(COPY.buyNowSub)}
          action={
            <Tabs
              label={t(COPY.buyNowView)}
              value={tab}
              onChange={setTab}
              options={[
                ["best", COPY.tabBestValue],
                ["fresh", COPY.tabNew],
                ["all", COPY.tabAll],
              ]}
            />
          }
        />
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
          {items.map((product, i) => (
            <li key={product.slug} className={cx(i >= 6 && "max-lg:hidden")}>
              <ProductCard product={product} priority={false} />
            </li>
          ))}
        </ul>
        <p className="mt-12 text-center">
          <Link href={link("/browse?tab=buy_now")} className={btnClass("outline", "md")}>
            {t(COPY.shopAllBuyNow, { n: BUY_NOW_COUNT })}
          </Link>
        </p>
      </div>
    </section>
  );
}

// ── Auctions: one featured lot and four related lots ────────────────────
export function Auctions() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const [view, setView] = useState("closing");
  const [lead, ...rest] = AUCTION_VIEWS[view];
  return (
    <section aria-labelledby={titleId} className="pm-container py-16 lg:py-24">
      <SectionHeading
        id={titleId}
        eyebrow={t(COPY.auctionsEyebrow)}
        title={t(COPY.closingTitle)}
        sub={ui("antiSnipe")}
        action={
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <Tabs
              label={t(COPY.auctionsView)}
              value={view}
              onChange={setView}
              options={[
                ["closing", COPY.tabClosing],
                ["most", COPY.tabMostBid],
              ]}
            />
            <TextLink href={link("/browse?tab=auction")}>{t(COPY.allAuctions, { n: OPEN_AUCTION_COUNT })}</TextLink>
          </div>
        }
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <FeaturedAuction key={lead.slug} product={lead} label={view === "closing" ? t(COPY.closingNext) : t(COPY.mostBidLead)} />
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:col-span-5 lg:gap-x-6">
          {rest.map((product) => (
            <li key={product.slug}>
              <AuctionCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Featured sellers: storefront previews ───────────────────────────────
function StatValue({ stat }) {
  const { t } = useLang();
  if (stat.money) {
    return (
      <>
        <span aria-hidden="true" dir="ltr" className="inline-flex items-baseline gap-1">
          <span className="text-[0.7em]">{RIYAL}</span>
          {formatNumber(stat.value)}
          {stat.suffixUnit}
        </span>
        <span className="sr-only">{t(COPY.statMillion, { value: formatNumber(stat.value) })}</span>
      </>
    );
  }
  return (
    <span dir="ltr">
      {formatNumber(stat.value)}
      {stat.suffix || ""}
    </span>
  );
}

function StorefrontCard({ seller }) {
  const { t, ui, lang, pl } = useLang();
  const { link } = useConcept();
  const stats = sellerStats(seller.code);
  const shelf = sellerProducts(seller.code)
    .filter((p) => p.status === "live")
    .slice(0, 3);
  const hosting = seller.code === LIVE_EVENT.host;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-bg">
      <div className="pm-zoom relative aspect-[16/9] overflow-hidden bg-surface-2">
        <Img image={seller.cover} alt="" sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 86vw" className="absolute inset-0 size-full object-cover" />
        {hosting ? (
          <span className="absolute start-3 top-3 inline-flex h-7 items-center gap-2 rounded-control bg-[var(--pm-live-badge)] px-2.5 pm-xs font-semibold text-white">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
            {t(COPY.hosting)}
          </span>
        ) : null}
      </div>
      <div className="relative flex flex-1 flex-col px-5 pb-5">
        <span
          aria-hidden="true"
          className="-mt-7 grid size-14 place-items-center rounded-full pm-sm font-semibold text-white ring-4 ring-bg"
          style={{ background: `color-mix(in oklab, ${seller.tone} 82%, black)` }}
        >
          {seller.monogram}
        </span>
        <h3 className="mt-3 pm-h3 text-fg">
          <Link href={link(`/seller/${seller.code}`)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {t(seller.name)}
          </Link>
        </h3>
        <p className="mt-0.5 pm-xs text-fg-3">
          {t(CITIES[seller.city])} · {ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) })}
        </p>
        <p className="mt-2 line-clamp-2 pm-sm text-fg-2">{t(seller.tagline)}</p>
        <ul aria-hidden="true" className="mt-4 grid grid-cols-3 gap-2">
          {shelf.map((product) => (
            <li key={product.slug} className="pm-plate relative aspect-square overflow-hidden rounded-card">
              <Img image={product.images[0]} alt="" sizes="96px" className="pm-multiply absolute inset-0 size-full object-contain p-2" />
            </li>
          ))}
        </ul>
        <p className="mt-auto flex items-center justify-between gap-3 pt-4 pm-xs text-fg-2">
          <span>
            {pl("lots", stats.total)} · {t(COPY.sellerCounts, { auctions: stats.activeAuctions, buyNow: stats.buyNowCount })}
          </span>
          <span className="pm-link shrink-0 font-semibold text-fg">{t(COPY.visitStorefront)}</span>
        </p>
      </div>
    </article>
  );
}

export function Sellers() {
  const { t, isRTL } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const railRef = useRef(null);
  const step = (sign) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    rail.scrollBy({ left: sign * (isRTL ? -1 : 1) * ((card?.getBoundingClientRect().width || 360) + 20), behavior: "smooth" });
  };
  return (
    <section aria-labelledby={titleId} className="border-y border-line bg-surface py-16 lg:py-24">
      <div className="pm-container">
        <SectionHeading
          id={titleId}
          eyebrow={t(COPY.sellersEyebrow)}
          title={t(COPY.sellersTitle)}
          sub={t(COPY.sellersSub)}
          action={
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 md:flex">
                <button type="button" onClick={() => step(-1)} aria-label={t(COPY.prevSellers)} className="grid size-10 place-items-center rounded-full border border-line-strong text-fg hover:border-fg">
                  <ChevronLeft aria-hidden="true" className="flip-rtl size-5" strokeWidth={1.75} />
                </button>
                <button type="button" onClick={() => step(1)} aria-label={t(COPY.nextSellers)} className="grid size-10 place-items-center rounded-full border border-line-strong text-fg hover:border-fg">
                  <ChevronRight aria-hidden="true" className="flip-rtl size-5" strokeWidth={1.75} />
                </button>
              </div>
              <TextLink href={link("/seller")}>{t(COPY.allSellers)}</TextLink>
            </div>
          }
        />
        <ul ref={railRef} className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:scroll-px-0 lg:px-0">
          {SELLERS.map((seller) => (
            <li key={seller.code} className="w-[84%] shrink-0 snap-start md:w-[44%] lg:w-[calc((100%-40px)/3)]">
              <StorefrontCard seller={seller} />
            </li>
          ))}
        </ul>
        <div className="mt-12 border-t border-line pt-8">
          <p className="pm-label text-fg-3">{t(COPY.inNumbers)}</p>
          <dl className="mt-5 grid grid-cols-2 gap-y-6 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={stat.key} className={cx("flex flex-col-reverse gap-1 px-0 md:px-6", i > 0 && "md:border-s md:border-line", i === 0 && "md:ps-0")}>
                <dt className="pm-sm text-fg-2">{t(stat.label)}</dt>
                <dd className="pm-numeral text-fg">
                  <StatValue stat={stat} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

// ── Live salon: the stream, the lot on the block and the schedule ───────
function UpcomingRow({ event, reminded, onRemind }) {
  const { t, lang, pl } = useLang();
  const host = getSeller(event.host);
  const left = useRemaining(event.startsIn);
  return (
    <li className="flex flex-wrap items-center gap-x-5 gap-y-3 py-4">
      <span className="pm-plate relative size-14 shrink-0 overflow-hidden rounded-card">
        <Img image={event.image} alt="" sizes="56px" className="pm-multiply size-full object-contain p-1.5" />
      </span>
      <div className="min-w-0 flex-1 basis-60">
        <p className="pm-md font-medium text-fg">{t(event.title)}</p>
        <p className="pm-xs text-fg-3">
          {t(COPY.startsIn, { time: formatDuration(left ?? 0, lang) })} · {t(host.name)} · {pl("lots", event.lots)}
        </p>
      </div>
      <button type="button" aria-pressed={reminded} onClick={onRemind} className={btnClass(reminded ? "ink" : "quiet", "sm")}>
        {reminded ? <BellRing aria-hidden="true" className="size-4" /> : <Bell aria-hidden="true" className="size-4" />}
        {reminded ? t(COPY.reminderOn) : t(COPY.remindMe)}
        <span className="sr-only">: {t(event.title)}</span>
      </button>
    </li>
  );
}

export function LiveSalon({ live }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const reminders = useEventReminders();
  const host = getSeller(LIVE_EVENT.host);
  const lot = live.current;
  const progress = live.intermission > 0 ? 0 : Math.max(0, Math.min(1, live.remaining / live.duration));
  return (
    <section id="pm-live" aria-labelledby={titleId} className="pm-container py-16 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
        <Link href={link("/live-auction")} className="group relative block overflow-hidden rounded-card lg:col-span-7">
          <span className="pm-zoom relative block aspect-[16/10] overflow-hidden bg-surface-2">
            <Img image={LIVE_EVENT.stream} alt={t(LIVE_EVENT.title)} sizes="(min-width: 1024px) 56vw, 100vw" className="absolute inset-0 size-full object-cover" />
          </span>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 to-transparent" />
          <span className="absolute start-4 top-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 items-center gap-2 rounded-control bg-[var(--pm-live-badge)] px-2.5 pm-xs font-semibold uppercase tracking-wide text-white">
              <span aria-hidden="true" className="kz-live-dot" />
              {ui("liveNow")}
            </span>
            <span className="inline-flex h-7 items-center gap-1.5 rounded-control bg-black/55 px-2.5 pm-xs font-semibold text-white">
              <Eye aria-hidden="true" className="size-3.5" />
              <span className="tabular">{pl("viewers", live.viewers)}</span>
            </span>
          </span>
          <span className="absolute bottom-4 start-4 pm-sm font-semibold text-white tabular">{ui("lotOf", { n: lot?.order ?? "–", total: live.items.length })}</span>
        </Link>

        <div className="flex flex-col lg:col-span-5">
          <p className="pm-eyebrow text-accent">{t(COPY.liveEyebrow)}</p>
          <h2 id={titleId} className="mt-2 pm-h2 text-balance text-fg">
            {t(LIVE_EVENT.title)}
          </h2>
          <p className="mt-2 pm-sm text-fg-2">
            {t(LIVE_EVENT.presenter)} · {t(COPY.hostedBy, { name: t(host.name) })}
          </p>
          <p className="mt-1 pm-xs text-fg-3">{t(COPY.liveSub)}</p>
          {lot ? (
            <div className="mt-6 border-t border-line pt-5">
              <p className="pm-label text-fg-3">{t(COPY.onTheBlock)}</p>
              <div className="mt-3 flex items-center gap-4">
                <span className="pm-plate relative size-20 shrink-0 overflow-hidden rounded-card">
                  <Img image={lot.image} alt="" sizes="80px" className="pm-multiply size-full object-contain p-2" />
                </span>
                <div className="min-w-0">
                  <p className="line-clamp-2 pm-md font-medium text-fg">{t(lot.title)}</p>
                  {lot.grade ? <GradeMark grade={lot.grade} className="mt-1 pm-xs text-fg-2" /> : null}
                </div>
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="pm-label text-fg-3">{ui("currentBid")}</p>
                  <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 mt-1 rounded px-1 pm-price-lg text-fg" />
                </div>
                <p className="pm-xs text-fg-3">{pl("bids", lot.bidCount ?? 0)}</p>
              </div>
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between pm-xs text-fg-3">
                  <span>{live.intermission > 0 ? t(COPY.betweenLots, { n: live.intermission }) : t(COPY.lotClock)}</span>
                  {live.intermission > 0 ? null : <span className="tabular">{t(COPY.secondsShort, { n: live.remaining })}</span>}
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-surface-2">
                  <div className={cx("h-full rounded-full transition-[width] duration-1000 ease-linear", live.remaining <= 10 ? "bg-[var(--live)]" : "bg-fg")} style={{ width: `${progress * 100}%` }} />
                </div>
              </div>
            </div>
          ) : null}
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href={link("/live-auction")} className={btnClass("ink", "lg")}>
              {ui("joinLive")}
            </Link>
            <p className="pm-xs text-fg-3">{t(COPY.roomNote)}</p>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <p className="flex items-center gap-2 pm-label text-fg-3">
          {t(COPY.upcomingTitle)}
          <span className="rounded-control bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold normal-case tracking-normal text-fg-2">{t(COPY.concept)}</span>
        </p>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {OTHER_EVENTS.map((event) => (
            <UpcomingRow key={event.slug} event={event} reminded={reminders.isOn(event)} onRemind={() => reminders.toggle(event)} />
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── For trade buyers: pallets and cartons ───────────────────────────────
function TradeRow({ product }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const auction = isAuction(product);
  const units = manifestUnits(product);
  const lines = (product.palletContents || []).length;
  return (
    <li className="relative flex items-center gap-4 py-4">
      <span className="pm-plate relative size-16 shrink-0 overflow-hidden rounded-card">
        <Img image={product.images[0]} alt="" sizes="64px" className="pm-multiply size-full object-contain p-1.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 pm-md font-medium text-fg">
          <Link href={link(detailPath(product))} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {t(product.title)}
          </Link>
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 pm-xs text-fg-2">
          <GradeMark grade={product.grade} />
          <span>{units > 0 ? t(COPY.manifestLine, { units: pl("units", units), lines }) : t(COPY.fullLot)}</span>
        </p>
      </div>
      <div className="text-end">
        <p className="pm-xs text-fg-3">{auction ? ui("currentBid") : ui("price")}</p>
        <Money value={auction ? product.currentBid : product.price} className="pm-price text-fg" />
      </div>
    </li>
  );
}

export function Trade() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="bg-surface-2 py-16 lg:py-24">
      <div className="pm-container grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-[#0e0d0b] lg:aspect-[4/5]">
            <Img image={TRADE.photo} alt="" sizes="(min-width: 1024px) 45vw, 100vw" className="absolute inset-0 size-full object-cover" style={{ objectPosition: "88% 62%" }} />
          </div>
        </div>
        <div className="lg:col-span-6">
          <p className="pm-eyebrow text-accent">{t(COPY.tradeEyebrow)}</p>
          <h2 id={titleId} className="mt-2 pm-h2 text-balance text-fg">
            {t(COPY.palletsTitle)}
          </h2>
          <p className="mt-3 flex items-baseline gap-2">
            <span className="pm-md text-fg-2">{t(COPY.palletsFrom)}</span>
            <Money value={palletFromPrice()} className="pm-price-lg text-fg" />
          </p>
          <p className="mt-3 max-w-lg pm-md text-fg-2">{t(COPY.palletsBody)}</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {COPY.palletsPoints.map((point) => (
              <li key={point.en} className="inline-flex items-center gap-2 pm-sm text-fg">
                <Check aria-hidden="true" className="size-4 text-accent" strokeWidth={2} />
                {t(point)}
              </li>
            ))}
          </ul>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {[...TRADE.pallets, ...TRADE.cartons].map((product) => (
              <TradeRow key={product.slug} product={product} />
            ))}
          </ul>
          <Link href={link("/browse?category=bulk-pallets")} className={btnClass("outline", "md", "mt-8")}>
            {t(COPY.shopPallets)}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Buying on Khazna: confidence, how it works and the grade scale ──────
const TRUST_ICONS = { graded: BadgeCheck, deposit: ShieldCheck, payments: CreditCard, delivery: Truck };
const DEPOSIT = TRUST_POINTS.find((point) => point.key === "deposit");

function WhyList() {
  const { t } = useLang();
  return (
    <ul className="space-y-6">
      {TRUST_POINTS.map((point) => {
        const Icon = TRUST_ICONS[point.key] || BadgeCheck;
        return (
          <li key={point.key} className="flex gap-4">
            <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.5} />
            <div>
              <p className="pm-md font-semibold text-fg">{t(point.title)}</p>
              <p className="mt-1 pm-sm text-fg-2">{t(point.text)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function HowList() {
  const { t } = useLang();
  return (
    <>
      <ol className="space-y-6">
        {HOW_IT_WORKS.map((step) => (
          <li key={step.step} className="flex gap-4">
            <span aria-hidden="true" className="w-8 shrink-0 pm-numeral text-[28px] leading-[28px] text-accent">
              {step.step}
            </span>
            <div>
              <p className="pm-md font-semibold text-fg">
                <span className="sr-only">{t(COPY.step, { n: step.step })}: </span>
                {t(step.title)}
              </p>
              <p className="mt-1 pm-sm text-fg-2">{t(step.text)}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8 border-t border-line pt-5">
        <p className="flex flex-wrap items-baseline gap-x-2 pm-md font-semibold text-fg">
          {t(COPY.depositLine)}
          <Money value={AUCTION_POLICY.depositAmount} className="text-accent" />
        </p>
        <p className="mt-1 pm-sm text-fg-2">{t(DEPOSIT.text)}</p>
      </div>
    </>
  );
}

function GradeScale() {
  const { t } = useLang();
  return (
    <>
      <p className="pm-sm text-fg-2">{t(COPY.gradesText)}</p>
      <ol className="mt-5 divide-y divide-line border-y border-line">
        {GRADE_ORDER.map((key) => {
          const grade = GRADES[key];
          return (
            <li key={key} className="flex gap-4 py-3">
              <span
                aria-hidden="true"
                className="grid h-7 min-w-9 shrink-0 place-items-center rounded-control px-2 pm-xs font-semibold text-bg"
                style={{ background: `var(--grade-${key === "new" ? "new" : key.toLowerCase()})` }}
              >
                {t(grade.short)}
              </span>
              <div className="min-w-0">
                <p className="pm-sm font-semibold text-fg">{t(grade.label)}</p>
                <p className="pm-xs text-fg-2">{t(grade.text)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function BuyingOnKhazna() {
  const { t } = useLang();
  const titleId = useId();
  const columns = [
    { key: "why", title: t(COPY.whyTitle), body: <WhyList /> },
    { key: "how", title: t(COPY.howTitle), body: <HowList /> },
    { key: "grades", title: t(COPY.gradesTitle), body: <GradeScale /> },
  ];
  return (
    <section id="how-it-works" aria-labelledby={titleId} className="pm-container scroll-mt-28 py-16 lg:py-24">
      <SectionHeading id={titleId} title={t(COPY.buyingTitle)} sub={t(COPY.buyingSub)} center />
      <div id="grades" className="mt-12 hidden scroll-mt-28 gap-12 lg:grid lg:grid-cols-3">
        {columns.map((column, i) => (
          <div key={column.key} className={cx(i > 0 && "border-s border-line ps-12")}>
            <h3 className="pm-h3 text-fg">{column.title}</h3>
            <div className="mt-6">{column.body}</div>
          </div>
        ))}
      </div>
      <div className="mt-10 divide-y divide-line border-y border-line lg:hidden">
        {columns.map((column, i) => (
          <details key={column.key} className="pm-accordion group" open={i === 0}>
            <summary className="flex items-center justify-between gap-4 py-5">
              <span className="pm-h3 text-fg">{column.title}</span>
              <Plus aria-hidden="true" className="pm-accordion-icon size-5 text-fg transition-transform" strokeWidth={1.5} />
            </summary>
            <div className="pb-6">{column.body}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
