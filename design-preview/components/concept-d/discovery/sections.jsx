"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Bell, BellRing, ChevronDown, CreditCard, Eye, Search, ShieldCheck, Truck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { GRADES, GRADE_ORDER } from "@/data/grades";
import { LIVE_EVENT, OTHER_EVENTS } from "@/data/live";
import { CITIES, SELLERS, getSeller } from "@/data/sellers";
import { AUCTION_POLICY, HOW_IT_WORKS, TRUST_POINTS } from "@/data/site";
import { POPULAR_SEARCHES, detailPath, sellerStats } from "@/lib/catalog";
import { useRemaining } from "@/lib/clock";
import { formatDuration, moneyText } from "@/lib/format";
import { useEventReminders } from "@/components/concept-d/live/useEventReminders";
import { DiscoveryCard, WideCard } from "./cards";
import { COPY } from "./copy";
import { CATEGORY_CARDS, COLLECTIONS, ENDING_RAIL, FEED_WIDE, NEW_IN, OPEN_AUCTION_COUNT, PRICE_DROPS, fromPrice, sellerShelf } from "./data";
import { GradeChip, LiveDot, RailButtons, SectionHeader, TONE_BG, btnClass, cx, useRailStep } from "./ui";

const RAIL = "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-3 pt-1 md:-mx-6 md:scroll-px-6 md:px-6 lg:mx-0 lg:scroll-px-0 lg:gap-4 lg:px-0";

// ── Category explorer: tall colour cards with the category's own lots ───
function CategoryCard({ card }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const category = CATEGORY_BY_SLUG[card.slug];
  return (
    <Link href={link(`/browse?category=${card.slug}`)} className={cx("dc-lift group relative flex aspect-[3/4] flex-col overflow-hidden rounded-card p-4", TONE_BG[card.tone])}>
      <span className="dc-h3 text-fg">{t(category.name)}</span>
      <span className="mt-0.5 dc-xs text-fg-2">{pl("lots", category.count)}</span>
      <span aria-hidden="true" className="relative mt-auto flex h-[58%] items-end justify-center">
        {card.cutouts.slice(0, 3).map((art, i) => (
          <span
            key={i}
            className={cx("relative h-full transition-transform duration-300 group-hover:-translate-y-1", i === 0 ? "z-[2] w-[58%]" : "z-[1] -ms-[14%] w-[44%]", i === 2 && "hidden sm:block")}
            style={{ height: i === 0 ? "100%" : "72%" }}
          >
            <Img image={{ sources: art.sources }} alt="" sizes="160px" className="absolute inset-0 size-full object-contain object-bottom drop-shadow-[0_10px_10px_rgb(20_22_28/0.14)]" />
          </span>
        ))}
      </span>
      <span className="mt-3 line-clamp-1 dc-xs text-fg-2">{t(category.blurb)}</span>
    </Link>
  );
}

export function CategoryExplorer() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const railRef = useRef(null);
  const step = useRailStep(railRef);
  return (
    <section aria-labelledby={titleId} className="dc-container mt-12 lg:mt-16">
      <SectionHeader id={titleId} title={t(COPY.categoriesTitle)} sub={t(COPY.categoriesSub)} href="/browse" linkLabel={t(COPY.allCategories)}>
        <RailButtons onStep={step} />
      </SectionHeader>
      <ul ref={railRef} className={cx(RAIL, "mt-5")}>
        {CATEGORY_CARDS.map((card) => (
          <li key={card.slug} className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-[calc((100%-80px)/6)]">
            <CategoryCard card={card} />
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="dc-kicker text-fg-3">{t(COPY.popularSearches)}</span>
        {POPULAR_SEARCHES.map((term) => (
          <Link
            key={term.en}
            href={link(`/browse?search=${encodeURIComponent(t(term))}`)}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface-2 px-3 dc-sm font-semibold text-fg hover:bg-[color-mix(in_oklab,var(--surface-2)_85%,var(--text-primary))]"
          >
            <Search aria-hidden="true" className="size-3.5 text-fg-3" />
            {t(term)}
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Price drops: a Buy Now deals rail ───────────────────────────────────
export function PriceDrops() {
  const { t } = useLang();
  const titleId = useId();
  const railRef = useRef(null);
  const step = useRailStep(railRef);
  return (
    <section aria-labelledby={titleId} className="dc-container mt-12 lg:mt-16">
      <SectionHeader id={titleId} title={t(COPY.dropsTitle)} sub={t(COPY.dropsSub)} href="/browse?tab=buy_now&has_discount=true" linkLabel={t(COPY.seeAllDeals)}>
        <RailButtons onStep={step} />
      </SectionHeader>
      <ul ref={railRef} className={cx(RAIL, "mt-5")}>
        {PRICE_DROPS.map((product) => (
          <li key={product.slug} className="w-[46%] shrink-0 snap-start sm:w-[31%] md:w-[23%] lg:w-[calc((100%-64px)/5)]">
            <DiscoveryCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Auctions inside the marketplace: live now + the ending-soon rail ────
function UpcomingEvent({ event, reminded, onRemind }) {
  const { t, lang } = useLang();
  const host = getSeller(event.host);
  const left = useRemaining(event.startsIn);
  return (
    <li className="flex items-center gap-3 rounded-[14px] bg-surface p-2.5">
      <span className="dc-plate relative size-12 shrink-0 overflow-hidden rounded-[10px]">
        <Img image={event.image} alt="" sizes="48px" className="dc-multiply size-full object-contain p-1" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate dc-sm font-bold text-fg">{t(event.title)}</span>
        <span className="block truncate dc-xs text-fg-3">
          {t(COPY.startsIn, { time: formatDuration(left ?? 0, lang) })} · {t(host.name)}
        </span>
      </span>
      <button
        type="button"
        aria-pressed={reminded}
        onClick={onRemind}
        className={cx("inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2.5 dc-xs font-bold", reminded ? "bg-primary text-on-primary" : "bg-surface-2 text-fg")}
      >
        {reminded ? <BellRing aria-hidden="true" className="size-3.5" /> : <Bell aria-hidden="true" className="size-3.5" />}
        {reminded ? t(COPY.reminderOn) : t(COPY.remindMe)}
        <span className="sr-only">: {t(event.title)}</span>
      </button>
    </li>
  );
}

function LiveCard({ live }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const reminders = useEventReminders();
  const host = getSeller(LIVE_EVENT.host);
  const lot = live.current;
  return (
    <div className="flex h-full flex-col gap-3">
      <article className="relative overflow-hidden rounded-card bg-[#14161c] text-white">
        <div className="relative aspect-[16/10]">
          <Img image={LIVE_EVENT.stream} alt="" sizes="(min-width: 1024px) 360px, 100vw" className="absolute inset-0 size-full object-cover" />
          <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/30" />
          <p className="absolute start-3 top-3 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-[var(--dc-live-badge)] px-2 dc-xs font-bold text-white">
              <LiveDot />
              {t(COPY.liveNow)}
            </span>
            <span className="inline-flex h-6 items-center gap-1 rounded-full bg-black/50 px-2 dc-xs font-semibold text-white">
              <Eye aria-hidden="true" className="size-3.5" />
              <span className="tabular">{pl("viewers", live.viewers)}</span>
            </span>
          </p>
          <p className="absolute inset-x-3 bottom-3">
            <span className="block dc-h3 text-white">{t(LIVE_EVENT.title)}</span>
            <span className="block truncate dc-xs text-white/80">
              {t(LIVE_EVENT.presenter)} · {t(host.name)}
            </span>
          </p>
        </div>
        {lot ? (
          <div className="flex items-center gap-3 p-3">
            <span className="dc-plate relative size-14 shrink-0 overflow-hidden rounded-[12px]">
              <Img image={lot.image} alt="" sizes="56px" className="dc-multiply size-full object-contain p-1" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="dc-xs text-white/70">{t(COPY.onTheBlock)}</p>
              <p className="truncate dc-sm font-semibold">{t(lot.title)}</p>
              <p className="flex items-baseline gap-2">
                <span className="sr-only">{ui("currentBid")}</span>
                <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded px-1 dc-price" />
                <span className="dc-xs text-white/70">
                  {live.intermission > 0 ? t(COPY.betweenLots, { n: live.intermission }) : t(COPY.lotClock, { n: live.remaining })}
                </span>
              </p>
            </div>
          </div>
        ) : null}
        <div className="px-3 pb-3">
          <Link href={link("/live-auction")} className={btnClass("white", "md", "w-full")}>
            {t(COPY.joinLive)}
          </Link>
        </div>
      </article>
      <div>
        <p className="flex items-center gap-2 dc-kicker text-fg-2">
          {t(COPY.upcomingLive)}
          <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-fg-2">{t(COPY.concept)}</span>
        </p>
        <ul className="mt-2 grid grid-cols-[minmax(0,1fr)] gap-2">
          {OTHER_EVENTS.map((event) => (
            <UpcomingEvent key={event.slug} event={event} reminded={reminders.isOn(event)} onRemind={() => reminders.toggle(event)} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AuctionsHub({ live }) {
  const { t } = useLang();
  const titleId = useId();
  const railRef = useRef(null);
  const step = useRailStep(railRef);
  return (
    <section aria-labelledby={titleId} className="mt-12 bg-surface-2 py-10 lg:mt-16 lg:py-14">
      <div className="dc-container">
        <SectionHeader id={titleId} title={t(COPY.auctionsTitle)} sub={t(COPY.auctionsSub)} href="/browse?tab=auction" linkLabel={t(COPY.seeAllAuctions, { n: OPEN_AUCTION_COUNT })} />
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-8">
          <LiveCard live={live} />
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className="dc-h3 text-fg">{t(COPY.endingRail)}</h3>
              <RailButtons onStep={step} />
            </div>
            <ul ref={railRef} className={cx(RAIL, "mt-3")}>
              {ENDING_RAIL.map((product) => (
                <li key={product.slug} className="w-[46%] shrink-0 snap-start sm:w-[31%] md:w-[30%] lg:w-[calc((100%-48px)/4)]">
                  <DiscoveryCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Collections: themed sets of lots ────────────────────────────────────
function CollectionCard({ collection }) {
  const { t, isRTL } = useLang();
  const { link } = useConcept();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  return (
    <article className={cx("dc-lift relative flex h-full flex-col rounded-card p-4 sm:p-5", TONE_BG[collection.tone])}>
      <h3 className="dc-h3 text-fg">{t(collection.title)}</h3>
      <p className="mt-0.5 dc-xs text-fg-2">{t(COPY.collectionCount, { n: collection.lots.length, amount: moneyText(fromPrice(collection.lots)) })}</p>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {collection.lots.map((product) => (
          <li key={product.slug}>
            <Link href={link(detailPath(product))} className="group relative grid aspect-square place-items-center overflow-hidden rounded-[14px] bg-white p-3">
              <Img image={product.images[0]} alt="" sizes="(min-width: 768px) 12vw, 40vw" className="size-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.05]" />
              <span className="sr-only">{t(product.title)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={link(collection.href)} className="mt-4 inline-flex items-center gap-1.5 self-start dc-sm font-bold text-fg hover:underline">
        {t(COPY.shopCollection)}
        <Arrow aria-hidden="true" className="size-4" />
      </Link>
    </article>
  );
}

export function Collections() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="dc-container mt-12 lg:mt-16">
      <SectionHeader id={titleId} title={t(COPY.collectionsTitle)} sub={t(COPY.collectionsSub)} />
      <ul className="mt-5 grid gap-4 md:grid-cols-3">
        {COLLECTIONS.slice(1).map((collection) => (
          <li key={collection.key}>
            <CollectionCard collection={collection} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Shop by seller: seller collection cards ────────────────────────────
function SellerCard({ seller }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const stats = sellerStats(seller.code);
  const shelf = sellerShelf(seller.code);
  const hosting = seller.code === LIVE_EVENT.host;
  return (
    <article className="dc-lift relative flex h-full flex-col rounded-card border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-[14px] dc-sm font-extrabold text-white" style={{ background: `color-mix(in oklab, ${seller.tone} 78%, black)` }}>
          {seller.monogram}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate dc-h3 text-fg">
            <Link href={link(`/seller/${seller.code}`)} className="after:absolute after:inset-0 after:content-[''] hover:underline">
              {t(seller.name)}
            </Link>
          </h3>
          <p className="truncate dc-xs text-fg-3">{t(COPY.sellerLine, { lots: pl("lots", stats.total), city: t(CITIES[seller.city]) })}</p>
        </div>
        {hosting ? (
          <span className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-[var(--dc-live-badge)] px-2 dc-xs font-bold text-white">
            <LiveDot />
            {t(COPY.hosting)}
          </span>
        ) : null}
      </div>
      <ul aria-hidden="true" className="mt-4 grid grid-cols-3 gap-2">
        {shelf.map((product) => (
          <li key={product.slug} className="dc-plate relative aspect-square overflow-hidden rounded-[12px]">
            <Img image={product.images[0]} alt="" sizes="96px" className="dc-multiply absolute inset-0 size-full object-contain p-2" />
          </li>
        ))}
      </ul>
      <p className="mb-4 mt-3 line-clamp-2 dc-xs text-fg-2">{t(seller.tagline)}</p>
      <span aria-hidden="true" className={btnClass("soft", "sm", "mt-auto w-full")}>{t(COPY.visitShop)}</span>
    </article>
  );
}

export function SellerCollections() {
  const { t } = useLang();
  const titleId = useId();
  const railRef = useRef(null);
  const step = useRailStep(railRef);
  return (
    <section aria-labelledby={titleId} className="dc-container mt-12 lg:mt-16">
      <SectionHeader id={titleId} title={t(COPY.sellersTitle)} sub={t(COPY.sellersSub)} href="/seller" linkLabel={t(COPY.allSellers)}>
        <RailButtons onStep={step} />
      </SectionHeader>
      <ul ref={railRef} className={cx(RAIL, "mt-5")}>
        {SELLERS.map((seller) => (
          <li key={seller.code} className="w-[80%] shrink-0 snap-start sm:w-[46%] md:w-[38%] lg:w-[calc((100%-48px)/4)]">
            <SellerCard seller={seller} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── New in: a mixed-size feed ───────────────────────────────────────────
export function NewIn() {
  const { t } = useLang();
  const titleId = useId();
  const [more, setMore] = useState(false);
  const items = more ? NEW_IN : NEW_IN.slice(0, 10);
  return (
    <section aria-labelledby={titleId} className="dc-container mt-12 lg:mt-16">
      <SectionHeader id={titleId} title={t(COPY.newInTitle)} sub={t(COPY.newInSub)} href="/browse?sort=newest" linkLabel={t(COPY.chipNew)} />
      <ul className="dc-feed mt-5">
        {items.map((product, i) => {
          const wide = FEED_WIDE.has(i);
          return (
            <li key={product.slug} data-wide={wide ? "true" : undefined}>
              {wide ? <WideCard product={product} /> : <DiscoveryCard product={product} />}
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-center">
        <button type="button" aria-expanded={more} onClick={() => setMore((v) => !v)} className={btnClass("outline", "md")}>
          {more ? t(COPY.showLess) : t(COPY.showMore)}
          <ChevronDown aria-hidden="true" className={cx("size-4 transition-transform", more && "rotate-180")} />
        </button>
      </p>
    </section>
  );
}

// ── Why Khazna: trust cards, how it works and the grades ────────────────
const TRUST_ICONS = { graded: BadgeCheck, deposit: ShieldCheck, payments: CreditCard, delivery: Truck };
const TRUST_TONES = { graded: "mint", deposit: "lilac", payments: "sky", delivery: "peach" };
const DEPOSIT = TRUST_POINTS.find((point) => point.key === "deposit");

export function WhyKhazna() {
  const { t } = useLang();
  const titleId = useId();
  const [guide, setGuide] = useState(false);
  return (
    <section id="how-it-works" aria-labelledby={titleId} className="dc-container mt-14 scroll-mt-40 lg:mt-20">
      <div className="rounded-[26px] bg-surface-2 p-5 sm:p-8 lg:p-10">
        <h2 id={titleId} className="dc-h2 text-fg">
          {t(COPY.whyTitle)}
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map((point) => {
            const Icon = TRUST_ICONS[point.key] || BadgeCheck;
            return (
              <li key={point.key} className="rounded-card bg-surface p-5">
                <span className={cx("grid size-11 place-items-center rounded-[14px]", TONE_BG[TRUST_TONES[point.key]])}>
                  <Icon aria-hidden="true" className="size-5 text-fg" />
                </span>
                <h3 className="mt-3 dc-h3 text-fg">{t(point.title)}</h3>
                <p className="mt-1 dc-sm text-fg-2">{t(point.text)}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div>
            <h3 className="dc-h3 text-fg">{t(COPY.howTitle)}</h3>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2">
              {HOW_IT_WORKS.map((step) => (
                <li key={step.step} className="flex gap-3 rounded-card bg-surface p-4">
                  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-primary dc-sm font-extrabold text-on-primary tabular">
                    {step.step}
                  </span>
                  <div>
                    <p className="dc-md font-bold text-fg">
                      <span className="sr-only">{t(COPY.step, { n: step.step })}: </span>
                      {t(step.title)}
                    </p>
                    <p className="mt-0.5 dc-sm text-fg-2">{t(step.text)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 dc-sm text-fg-2">
              <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--dc-lilac)] px-3 dc-sm font-bold text-fg">
                {t(COPY.depositLine)} <Money value={AUCTION_POLICY.depositAmount} />
              </span>
              {t(DEPOSIT.text)}
            </p>
          </div>
          <div id="grades" className="scroll-mt-40">
            <h3 className="dc-h3 text-fg">{t(COPY.gradesTitle)}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {GRADE_ORDER.map((key) => (
                <li key={key}>
                  <GradeChip grade={key} className="h-8 bg-surface! px-3 dc-sm" />
                </li>
              ))}
            </ul>
            <button type="button" aria-expanded={guide} onClick={() => setGuide((v) => !v)} className="mt-4 inline-flex items-center gap-1.5 dc-sm font-bold text-fg hover:underline">
              {t(COPY.gradesShow)}
              <ChevronDown aria-hidden="true" className={cx("size-4 transition-transform", guide && "rotate-180")} />
            </button>
            {guide ? (
              <dl className="mt-3 grid gap-2">
                {GRADE_ORDER.map((key) => (
                  <div key={key} className="rounded-[12px] bg-surface p-3">
                    <dt className="dc-sm font-bold text-fg">{t(GRADES[key].label)}</dt>
                    <dd className="dc-xs text-fg-2">{t(GRADES[key].text)}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
