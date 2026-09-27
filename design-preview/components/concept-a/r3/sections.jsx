"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowUpRight, BadgeCheck, Bell, BellRing, ChevronLeft, ChevronRight, CreditCard, Eye, Gavel, ShieldCheck, Truck, UserRound, Wallet } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { CATEGORY_BY_SLUG, CATEGORIES } from "@/data/categories";
import { GRADES, GRADE_ORDER } from "@/data/grades";
import { LIVE_EVENT, OTHER_EVENTS } from "@/data/live";
import { BRAND_PHOTOS } from "@/data/media";
import { CITIES, getSeller } from "@/data/sellers";
import { AUCTION_POLICY, HERO, HOW_IT_WORKS, STATS, TRUST_POINTS } from "@/data/site";
import { sellerProducts, sellerStats } from "@/lib/catalog";
import { useRemaining } from "@/lib/clock";
import { RIYAL, formatDuration, formatNumber } from "@/lib/format";
import { palletFromPrice } from "@/components/concept-a/utils/lots";
import { useEventReminders } from "@/components/concept-a/live/useEventReminders";
import { COPY } from "./copy";
import { CategoryArt } from "./art";
import { BULK_ROW_A, BULK_ROW_B, BUY_NOW_COUNT, CLOSING_SOON, DEALS_MOSAIC, MOST_BID, OPEN_AUCTION_COUNT, SELLER_ORDER } from "./lots";
import { useVisual } from "./state";
import { FeatureTile, LotTile, RailCard } from "./Tile";
import { LiveDot, cx, pillClass } from "./ui";

function SectionHead({ id, title, sub, action, className = "", light = false }) {
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
      <div className="max-w-2xl">
        <h2 id={id} className={cx("vm-h2 text-balance", light ? "text-white" : "text-fg")}>
          {title}
        </h2>
        {sub ? <p className={cx("mt-1.5 vm-md", light ? "text-white/80" : "text-fg-2")}>{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

function MoreLink({ href, children }) {
  const { link } = useConcept();
  return (
    <Link href={link(href)} className={pillClass("outline", "md")}>
      {children}
      <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
    </Link>
  );
}

// ── Categories: photo mosaic (tablet and up) ────────────────────────────
const MOSAIC = [
  { slug: "home-appliances", area: "big" },
  { slug: "home-kitchen", area: "tall" },
  { slug: "furniture", area: "a" },
  { slug: "fashion", area: "b" },
  { slug: "tools-diy", area: "c" },
  { slug: "automotive", area: "d" },
  { slug: "electronics", area: "e" },
  { slug: "bulk-pallets", area: "f" },
];

function MosaicTile({ slug, area }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const category = CATEGORY_BY_SLUG[slug];
  const big = area === "big";
  return (
    <li data-area={area} className="min-h-0">
      <Link
        href={link(`/browse?category=${slug}`)}
        className="group relative block size-full overflow-hidden rounded-card bg-surface-2 outline-offset-[3px]"
      >
        <CategoryArt slug={slug} sizes={big ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} />
        <span className={cx("vm-band absolute bottom-3 start-3 max-w-[calc(100%-24px)] rounded-[14px]", big ? "px-5 py-3.5" : "px-3.5 py-2.5")}>
          <span className={cx("block font-bold", big ? "vm-h3" : "vm-md")}>{t(category.name)}</span>
          <span className="block vm-xs opacity-80">
            {big ? `${t(category.blurb)} · ` : ""}
            {pl("lots", category.count)}
          </span>
        </span>
      </Link>
    </li>
  );
}

export function Mosaic() {
  const { t } = useLang();
  const { open } = useVisual();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vm-container mt-20 hidden md:block lg:mt-24">
      <SectionHead
        id={titleId}
        title={t(COPY.mosaicTitle)}
        sub={t(COPY.mosaicSub)}
        action={
          <button type="button" onClick={() => open("categories")} className={pillClass("outline", "md")}>
            {t(COPY.allCategories)}
            <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
          </button>
        }
      />
      <ul className="vm-mosaic mt-7">
        {MOSAIC.map((tile) => (
          <MosaicTile key={tile.slug} {...tile} />
        ))}
      </ul>
    </section>
  );
}

/** Phones: category "stories" — round cut-outs you swipe through. */
export function Stories() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="mt-6 md:hidden">
      <h2 id={titleId} className="sr-only">
        {t(COPY.mosaicTitle)}
      </h2>
      <ul className="no-scrollbar flex snap-x scroll-px-4 gap-3.5 overflow-x-auto px-4 pb-1 pt-1">
        {CATEGORIES.map((category) => (
          <li key={category.slug} className="snap-start">
            <Link href={link(`/browse?category=${category.slug}`)} className="flex w-[74px] flex-col items-center gap-1.5 text-center">
              <span className="grid size-[70px] place-items-center rounded-full bg-surface p-[3px] ring-1 ring-line-strong">
                <span className="grid size-full place-items-center overflow-hidden rounded-full bg-[var(--vm-field)] p-2.5">
                  <Img image={category.image} cutout alt="" sizes="70px" className="vm-floor max-h-full w-auto object-contain" />
                </span>
              </span>
              <span className="line-clamp-2 vm-xs font-semibold text-fg">{t(category.name)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Live auction: an immersive photo block ──────────────────────────────
function EventCard({ event, reminded, onRemind }) {
  const { t, lang } = useLang();
  const host = getSeller(event.host);
  const left = useRemaining(event.startsIn);
  return (
    <li className="vm-glass flex items-center gap-3 rounded-[20px] p-2.5 pe-3">
      <span className="vm-plate size-16 shrink-0 overflow-hidden rounded-[14px]">
        <Img image={event.image} alt="" sizes="64px" className="vm-multiply size-full object-contain p-1.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate vm-sm font-bold text-white">{t(event.title)}</span>
        <span className="block truncate vm-xs text-white/75">
          {t(COPY.startsIn, { time: formatDuration(left ?? 0, lang) })} · {t(host.name)}
        </span>
      </span>
      <button
        type="button"
        aria-pressed={reminded}
        onClick={onRemind}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white/12 px-3 vm-xs font-bold text-white ring-1 ring-white/25 transition-colors hover:bg-white/20"
      >
        {reminded ? <BellRing aria-hidden="true" className="size-4" /> : <Bell aria-hidden="true" className="size-4" />}
        {reminded ? t(COPY.reminderOn) : t(COPY.remindMe)}
        <span className="sr-only">: {t(event.title)}</span>
      </button>
    </li>
  );
}

export function LiveBlock({ live }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const reminders = useEventReminders();
  const host = getSeller(LIVE_EVENT.host);
  const lot = live.current;
  const progress = live.intermission > 0 ? 0 : Math.max(0, Math.min(1, live.remaining / live.duration));
  return (
    <section id="vm-live" aria-labelledby={titleId} className="relative mt-20 overflow-hidden bg-[#161412] text-white lg:mt-28">
      <Img image={LIVE_EVENT.stream} alt="" sizes="100vw" className="absolute inset-0 size-full object-cover" />
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/90 via-black/55 to-black/35 lg:bg-linear-to-r lg:from-black/85 lg:via-black/55 lg:to-black/25 rtl:lg:bg-linear-to-l" />
      <div className="vm-container relative py-14 lg:py-24">
        <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-14">
          <div>
            <p className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-8 items-center gap-2 rounded-full bg-[#b3281f] px-3.5 vm-xs font-extrabold uppercase tracking-wide text-white">
                <LiveDot />
                {ui("liveNow")}
              </span>
              <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-black/45 px-3 vm-xs font-semibold text-white backdrop-blur">
                <Eye aria-hidden="true" className="size-3.5" />
                <span className="tabular">{pl("viewers", live.viewers)}</span>
              </span>
            </p>
            <h2 id={titleId} className="mt-5 max-w-2xl vm-hero text-balance text-white">
              {t(LIVE_EVENT.title)}
            </h2>
            <p className="mt-3 vm-md text-white/80">
              {t(LIVE_EVENT.presenter)} · {t(COPY.hostedBy, { name: t(host.name) })}
            </p>
            <p className="mt-1 vm-sm text-white/70">{t(COPY.liveSub)}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={link("/live-auction")} className={pillClass("light", "lg")}>
                {ui("joinLive")}
                <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
              </Link>
              <span className="vm-sm font-semibold text-white/80 tabular">{t(COPY.lotOf, { n: lot?.order ?? "–", total: live.items.length })}</span>
            </div>
          </div>

          {lot ? (
            <div className="vm-glass rounded-[26px] p-4 sm:p-5">
              <p className="vm-eyebrow text-white/75">{t(COPY.onTheBlockNow)}</p>
              <div className="mt-3 flex items-center gap-4">
                <span className="vm-plate size-24 shrink-0 overflow-hidden rounded-[18px] sm:size-28">
                  <Img image={lot.image} alt="" sizes="112px" className="vm-multiply size-full object-contain p-2" />
                </span>
                <div className="min-w-0">
                  <p className="line-clamp-2 vm-lg font-bold text-white">{t(lot.title)}</p>
                  {lot.grade ? <p className="mt-0.5 vm-xs text-white/75">{t(GRADES[lot.grade].label)}</p> : null}
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="vm-xs text-white/70">{ui("currentBid")}</p>
                  <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded px-1 vm-price-lg text-white" />
                </div>
                <p className="vm-xs text-white/75">{pl("bids", lot.bidCount ?? 0)}</p>
              </div>
              <div className="mt-3">
                <div className="mb-1.5 flex justify-between vm-xs text-white/75">
                  <span>{live.intermission > 0 ? t(COPY.betweenLots, { n: live.intermission }) : t(COPY.lotClock)}</span>
                  {live.intermission > 0 ? null : <span className="tabular">{t(COPY.secondsShort, { n: live.remaining })}</span>}
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div className={cx("h-full rounded-full transition-[width] duration-1000 ease-linear", live.remaining <= 10 ? "bg-[#ec6a5d]" : "bg-white")} style={{ width: `${progress * 100}%` }} />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-10 lg:mt-14">
          <p className="flex items-center gap-2 vm-eyebrow text-white/75">
            {t(COPY.comingUp)}
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold normal-case tracking-normal text-white/85">{t(COPY.concept)}</span>
          </p>
          <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2 lg:max-w-4xl">
            {OTHER_EVENTS.map((event) => (
              <EventCard key={event.slug} event={event} reminded={reminders.isOn(event)} onRemind={() => reminders.toggle(event)} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ── Auctions closing soon: a wide visual rail, or the most-bid view ─────
export function ClosingSoon() {
  const { t, isRTL } = useLang();
  const titleId = useId();
  const railRef = useRef(null);
  const [view, setView] = useState("closing");
  const items = view === "closing" ? CLOSING_SOON : MOST_BID;
  const step = (sign) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const distance = (card?.getBoundingClientRect().width || 400) + 16;
    rail.scrollBy({ left: sign * (isRTL ? -1 : 1) * distance, behavior: "smooth" });
  };
  const choose = (next) => {
    setView(next);
    railRef.current?.scrollTo({ left: 0 });
  };
  return (
    <section aria-labelledby={titleId} className="mt-20 lg:mt-28">
      <div className="vm-container">
        <SectionHead
          id={titleId}
          title={t(COPY.closingTitle)}
          sub={t(COPY.closingSub)}
          action={
            <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto">
              <div role="group" aria-label={t(COPY.closingView)} className="inline-flex rounded-full bg-surface-2 p-1">
                {[
                  ["closing", COPY.closingTab],
                  ["most", COPY.mostBidTab],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={view === key}
                    onClick={() => choose(key)}
                    className={cx("h-9 rounded-full px-4 vm-sm font-bold transition-colors", view === key ? "bg-primary text-on-primary" : "text-fg-2 hover:text-fg")}
                  >
                    {t(label)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label={t(COPY.railPrev)} onClick={() => step(-1)} className="hidden size-11 place-items-center rounded-full border border-line-strong bg-surface text-fg hover:border-fg md:grid">
                  <ChevronLeft aria-hidden="true" className="flip-rtl size-5" />
                </button>
                <button type="button" aria-label={t(COPY.railNext)} onClick={() => step(1)} className="hidden size-11 place-items-center rounded-full border border-line-strong bg-surface text-fg hover:border-fg md:grid">
                  <ChevronRight aria-hidden="true" className="flip-rtl size-5" />
                </button>
                <MoreLink href="/browse?tab=auction">{t(COPY.seeAllAuctions, { n: OPEN_AUCTION_COUNT })}</MoreLink>
              </div>
            </div>
          }
        />
      </div>
      <div className="vm-rail-wrap relative mt-7">
        <ul ref={railRef} aria-label={view === "closing" ? t(COPY.closingTab) : t(COPY.mostBidTab)} className="vm-rail no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {items.map((product, i) => (
            <li key={product.slug} className="w-[84%] max-w-[420px] shrink-0 snap-start sm:w-[46%] lg:w-[31%] lg:max-w-[460px]">
              <RailCard product={product} priority={i < 1} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Buy Now deals: four squares around the biggest saving ───────────────
export function DealsMosaic() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const { feature, tiles } = DEALS_MOSAIC;
  return (
    <section aria-labelledby={titleId} className="vm-container mt-20 lg:mt-28">
      <SectionHead
        id={titleId}
        title={t(COPY.dealsTitle)}
        sub={t(COPY.dealsSub)}
        action={<MoreLink href="/browse?tab=buy_now&has_discount=true">{t(COPY.shopAllDeals)}</MoreLink>}
      />
      <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
        <li className="relative col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <p className="pointer-events-none absolute start-4 top-16 z-[4] inline-flex h-7 items-center rounded-full bg-white px-3 vm-xs font-extrabold text-[#181614] shadow-card">{t(COPY.biggestSaving)}</p>
          <FeatureTile product={feature} shape="square" className="h-full" sizes="(min-width: 1024px) 50vw, 100vw" />
        </li>
        {tiles.map((product) => (
          <li key={product.slug}>
            <LotTile product={product} />
          </li>
        ))}
      </ul>
      <p className="mt-5 text-center">
        <Link href={link("/browse?tab=buy_now")} className="vm-sm font-bold text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
          {t(COPY.shopAll, { n: BUY_NOW_COUNT })}
        </Link>
      </p>
    </section>
  );
}

// ── Sellers: large photo tiles, the live host first ─────────────────────
function StatValue({ stat }) {
  const { t } = useLang();
  if (stat.money) {
    return (
      <>
        <span aria-hidden="true" dir="ltr" className="inline-flex items-baseline gap-1">
          <span className="text-[0.75em]">{RIYAL}</span>
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

function SellerPhoto({ code, big = false }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const seller = getSeller(code);
  const stats = sellerStats(code);
  const shelf = sellerProducts(code).filter((p) => p.status === "live").slice(0, 3);
  return (
    <Link href={link(`/seller/${code}`)} className="group relative block size-full overflow-hidden rounded-card bg-surface-2 outline-offset-[3px]">
      <Img
        image={seller.cover}
        alt=""
        sizes={big ? "(min-width: 1024px) 40vw, 90vw" : "(min-width: 1024px) 22vw, 70vw"}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
      {seller.code === LIVE_EVENT.host ? (
        <span className="absolute start-3 top-3 inline-flex h-8 items-center gap-2 rounded-full bg-white px-3 vm-xs font-extrabold text-[#181614] shadow-card">
          <LiveDot />
          {t(COPY.hosting)}
        </span>
      ) : null}
      {big ? (
        <ul aria-hidden="true" className="absolute end-4 top-4 hidden gap-1.5 sm:flex">
          {shelf.map((product) => (
            <li key={product.slug} className="vm-plate size-12 overflow-hidden rounded-full ring-2 ring-white">
              <Img image={product.images[0]} alt="" sizes="48px" className="vm-multiply size-full object-contain p-1" />
            </li>
          ))}
        </ul>
      ) : null}
      <span className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4 sm:p-5">
        <span
          aria-hidden="true"
          className={cx("grid shrink-0 place-items-center rounded-full font-extrabold text-white ring-2 ring-white/70", big ? "size-14 vm-md" : "size-11 vm-sm")}
          style={{ background: `color-mix(in oklab, ${seller.tone} 80%, black)` }}
        >
          {seller.monogram}
        </span>
        <span className="min-w-0 text-white">
          <span className={cx("block font-bold", big ? "vm-h3" : "vm-md")}>{t(seller.name)}</span>
          <span className="block vm-xs text-white/80">
            {pl("lots", stats.total)} · {t(CITIES[seller.city])}
          </span>
          {big ? <span className="mt-1 hidden max-w-md vm-sm text-white/85 sm:block">{t(seller.tagline)}</span> : null}
        </span>
      </span>
    </Link>
  );
}

export function SellersShowcase() {
  const { t } = useLang();
  const titleId = useId();
  const [first, ...rest] = SELLER_ORDER;
  return (
    <section aria-labelledby={titleId} className="vm-container mt-20 lg:mt-28">
      <SectionHead id={titleId} title={t(COPY.sellersTitle)} sub={t(COPY.sellersSub)} action={<MoreLink href="/seller">{t(COPY.allSellers)}</MoreLink>} />
      <div className="mt-7 grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-4">
        <div className="h-[320px] sm:h-[380px] lg:h-auto lg:min-h-[480px]">
          <SellerPhoto code={first} big />
        </div>
        <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:gap-4">
          {rest.map((code) => (
            <li key={code} className="h-[220px] w-[72%] shrink-0 snap-start sm:h-[232px] sm:w-auto">
              <SellerPhoto code={code} />
            </li>
          ))}
        </ul>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
        {STATS.map((stat) => (
          <div key={stat.key} className="flex flex-col-reverse gap-1 rounded-card bg-[var(--vm-field)] px-5 py-4">
            <dt className="vm-sm text-fg-2">{t(stat.label)}</dt>
            <dd className="vm-h2 text-fg tabular">
              <StatValue stat={stat} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ── Bulk & pallets: mirrored rows — pallet + story, then cartons + pallet ─
function PalletStory() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <article className="relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-card bg-[#161412] text-white">
      <Img image={BRAND_PHOTOS.warehouseFloor} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 size-full object-cover" />
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/15" />
      <div className="relative p-5 sm:p-7">
        <h3 className="vm-h3 text-white">{t(COPY.palletsTitle)}</h3>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="vm-md font-semibold text-white/85">{t(COPY.palletsFrom)}</span>
          <Money value={palletFromPrice()} className="vm-price-lg text-white" />
        </p>
        <p className="mt-2 max-w-md vm-sm text-white/80">{t(COPY.palletsBody)}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {COPY.palletsPoints.map((point) => (
            <li key={point.en} className="inline-flex h-8 items-center rounded-full bg-white/15 px-3 vm-xs font-bold text-white ring-1 ring-white/20">
              {t(point)}
            </li>
          ))}
        </ul>
        <Link href={link("/browse?category=bulk-pallets")} className={pillClass("light", "md", "mt-5")}>
          {t(COPY.shopPallets)}
          <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
        </Link>
      </div>
    </article>
  );
}

export function BulkRows() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vm-container mt-20 lg:mt-28">
      <SectionHead id={titleId} title={t(COPY.bulkTitle)} sub={t(COPY.bulkSub)} />
      <ul className="mt-7 grid grid-cols-2 gap-3 lg:auto-rows-[300px] lg:grid-cols-4 lg:gap-4 xl:auto-rows-[320px]">
        <li className="col-span-2">
          <FeatureTile product={BULK_ROW_A.feature} manifest className="h-full" sizes="(min-width: 1024px) 50vw, 100vw" />
        </li>
        <li className="col-span-2">
          <PalletStory />
        </li>
        {BULK_ROW_B.tiles.map((product) => (
          <li key={product.slug}>
            <LotTile product={product} className="lg:aspect-auto lg:h-full" />
          </li>
        ))}
        <li className="col-span-2">
          <FeatureTile product={BULK_ROW_B.feature} manifest className="h-full" sizes="(min-width: 1024px) 50vw, 100vw" />
        </li>
      </ul>
    </section>
  );
}

// ── Why buy on Khazna: the four trust points on photography ─────────────
const TRUST_ICONS = { graded: BadgeCheck, deposit: ShieldCheck, payments: CreditCard, delivery: Truck };

export function Confidence() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vm-container mt-20 lg:mt-28">
      <div className="relative overflow-hidden rounded-[28px] bg-[#161412] text-white">
        <Img image={BRAND_PHOTOS.warehouseRiyadh} alt="" sizes="(min-width: 1400px) 1312px, 100vw" className="absolute inset-0 size-full object-cover" />
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/90 via-black/65 to-black/40" />
        <div className="relative px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
          <SectionHead id={titleId} title={t(COPY.confidenceTitle)} sub={t(COPY.confidenceSub)} light />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {TRUST_POINTS.map((point) => {
              const Icon = TRUST_ICONS[point.key] || BadgeCheck;
              return (
                <li key={point.key} className="vm-glass rounded-[20px] p-5">
                  <span className="grid size-11 place-items-center rounded-full bg-white text-[#181614]">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="mt-4 vm-h3 text-white">{t(point.title)}</h3>
                  <p className="mt-1.5 vm-sm text-white/80">{t(point.text)}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ── Condition grades band ───────────────────────────────────────────────
export function GradesBand() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section id="grades" aria-labelledby={titleId} className="mt-16 lg:mt-20">
      <div className="vm-container">
        <div className="rounded-[28px] bg-[var(--vm-field)] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <SectionHead id={titleId} title={t(COPY.gradesTitle)} sub={t(COPY.gradesSub)} />
          <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
            {GRADE_ORDER.map((key) => {
              const grade = GRADES[key];
              return (
                <li key={key} className="rounded-[20px] bg-surface p-4">
                  <span
                    aria-hidden="true"
                    className="grid h-12 min-w-12 place-items-center justify-self-start rounded-full px-3 vm-md font-extrabold text-bg"
                    style={{ background: `var(--grade-${key === "new" ? "new" : key.toLowerCase()})` }}
                  >
                    {t(grade.short)}
                  </span>
                  <p className="mt-3 vm-sm font-bold text-fg">{t(grade.label)}</p>
                  <p className="mt-1 vm-xs text-fg-2">{t(grade.text)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ── How Khazna works: four steps and the bidding deposit ────────────────
const STEP_ICONS = [UserRound, Wallet, Gavel, Truck];
const DEPOSIT = TRUST_POINTS.find((point) => point.key === "deposit");

export function HowItWorks() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section id="how-it-works" aria-labelledby={titleId} className="vm-container scroll-mt-24 py-16 lg:py-24">
      <div className="text-center">
        <h2 id={titleId} className="vm-h2 text-fg">
          {t(COPY.howTitle)}
        </h2>
      </div>
      <ol className="relative mt-10 grid gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
        <span aria-hidden="true" className="absolute inset-x-[12.5%] top-7 hidden h-px bg-line-strong lg:block" />
        {HOW_IT_WORKS.map((step, i) => {
          const Icon = STEP_ICONS[i] || BadgeCheck;
          return (
            <li key={step.step} className="relative flex flex-col items-center text-center">
              <span className="relative grid size-14 place-items-center rounded-full border border-line-strong bg-bg">
                <Icon aria-hidden="true" className="size-6 text-fg" />
                <span className="absolute -end-1 -top-1 grid size-6 place-items-center rounded-full bg-primary text-[12px] font-extrabold text-on-primary tabular">{step.step}</span>
              </span>
              <h3 className="mt-4 vm-h3 text-fg">{t(step.title)}</h3>
              <p className="mt-1.5 max-w-[260px] vm-sm text-fg-2">{t(step.text)}</p>
            </li>
          );
        })}
      </ol>
      <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-4 rounded-[24px] bg-surface-2 p-5 text-center sm:flex-row sm:p-6 sm:text-start">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
          <ShieldCheck aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline justify-center gap-x-2 vm-md font-bold text-fg sm:justify-start">
            {t(COPY.depositLine)}
            <Money value={AUCTION_POLICY.depositAmount} />
          </p>
          <p className="mt-0.5 vm-sm text-fg-2">{t(DEPOSIT.text)}</p>
        </div>
        <Link href={link("/browse?tab=auction")} className={pillClass("solid", "md")}>
          <Gavel aria-hidden="true" className="size-4" />
          {t(HERO.primaryCta)}
        </Link>
      </div>
    </section>
  );
}
