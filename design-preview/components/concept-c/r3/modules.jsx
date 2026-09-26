"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, BadgeCheck, BellRing, ChevronRight, CreditCard, Gavel, Plus, ShieldCheck, Truck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { useRemaining } from "@/lib/clock";
import { formatDuration } from "@/lib/format";
import { plural } from "@/lib/i18n";
import { CITIES } from "@/data/sellers";
import { HOW_IT_WORKS, TRUST_POINTS } from "@/data/site";
import { POPULAR_SEARCHES, discountPercent, isAuction } from "@/lib/catalog";
import { COPY, PL } from "./copy";
import { BULK, CATEGORY_TREE, COUNTS, DEALS, ENDING, EVENTS, POPULAR, RECENT, SELLER_ROWS, SOONEST, WINDOWS, unitsOf } from "./data";
import { DECK_INPUT_ID } from "./Rail";
import { ScopeTabs, SearchBox } from "./Search";
import { useHub, useHubLot } from "./state";
import { GradeTag, LiveDot, Thumb, TimeLeft, btnClass, cx } from "./ui";

function ModuleHead({ id, title, action, children }) {
  return (
    <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line px-4 py-2.5">
      <h2 id={id} className="hb-h2 text-fg">
        {title}
      </h2>
      {children}
      {action}
    </div>
  );
}

function ViewAll({ href, children }) {
  const { link } = useConcept();
  return (
    <Link href={link(href)} className="inline-flex items-center gap-1 hb-sm font-semibold text-primary hover:underline">
      {children}
      <ChevronRight aria-hidden="true" className="flip-rtl size-4" />
    </Link>
  );
}

// ── Live announcement line ───────────────────────────────────────────────
export function LiveLine({ live }) {
  const { t } = useLang();
  const { link } = useConcept();
  const item = live.current;
  if (!item) return null;
  return (
    <div className="hb-module mt-4 hidden items-center gap-3 overflow-hidden py-2 pe-2 ps-3 md:flex">
      <span className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-[5px] bg-[var(--hb-live-badge)] px-2 hb-2xs font-bold uppercase tracking-wide text-white">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
        {t(COPY.live)}
      </span>
      <p className="min-w-0 flex-1 truncate hb-sm text-fg-2">
        <span className="font-semibold text-fg">{t(live.event.title)}</span>
        <span className="mx-2 text-fg-3">·</span>
        {t(COPY.lotOf, { n: item.order, total: live.items.length })}
        <span className="mx-2 text-fg-3">·</span>
        {t(item.title)}
        <span className="mx-2 text-fg-3">·</span>
        <Money value={item.currentBid} className="font-semibold text-fg" />
        <span className="mx-2 text-fg-3">·</span>
        <span className="hb-num">{t(COPY.watching, { n: live.viewers.toLocaleString("en-US") })}</span>
      </p>
      <Link href={link("/live-auction")} className={btnClass("live", "sm")}>
        {t(COPY.join)}
        <span className="sr-only">: {t(live.event.title)}</span>
        <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
      </Link>
    </div>
  );
}

// ── Search & discovery deck ──────────────────────────────────────────────
export function SearchDeck() {
  const { t } = useLang();
  const { link } = useConcept();
  const { setDeckVisible } = useHub();
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(([entry]) => setDeckVisible(entry.isIntersecting), { rootMargin: "-56px 0px 0px 0px" });
    io.observe(node);
    return () => io.disconnect();
  }, [setDeckVisible]);

  useEffect(() => {
    // "/" focuses search unless the visitor is already typing somewhere.
    const onKey = (event) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      event.preventDefault();
      const input = document.getElementById(DECK_INPUT_ID);
      if (!input) return;
      const rect = input.getBoundingClientRect();
      if (rect.top < 60 || rect.bottom > window.innerHeight) window.scrollTo({ top: 0, behavior: "smooth" });
      input.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section ref={ref} aria-labelledby={titleId} className="hb-module relative z-20 mt-4 hidden p-5 md:block lg:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="hb-eyebrow text-primary">{t(COPY.deckEyebrow)}</p>
          <h1 id={titleId} className="mt-1 hb-title text-fg">
            {t(COPY.deckTitle)}
          </h1>
        </div>
        <ScopeTabs />
      </div>
      <div className="mt-4">
        <SearchBox variant="deck" inputId={DECK_INPUT_ID} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1 hb-sm">
        <span className="me-1 font-semibold text-fg-3">{t(COPY.popular)}:</span>
        {POPULAR_SEARCHES.map((term) => (
          <Link key={term.en} href={link(`/browse?search=${encodeURIComponent(t(term))}`)} className="rounded-[6px] px-2 py-0.5 text-fg-2 underline decoration-line-strong underline-offset-4 hover:bg-surface-2 hover:text-fg">
            {t(term)}
          </Link>
        ))}
        <span className="ms-auto hidden items-center gap-1.5 hb-xs text-fg-3 lg:inline-flex">{t(COPY.shortcut)}</span>
      </div>
    </section>
  );
}

// ── Hub counters ────────────────────────────────────────────────────────
export function Counters({ live }) {
  const { t, lang, pl } = useLang();
  const { link } = useConcept();
  const soonest = useRemaining(SOONEST?.endsIn);
  const items = [
    { key: "live", href: "/live-auction", label: t(COPY.liveNow), value: COUNTS.liveEvents, sub: t(COPY.liveEvent, { n: live.viewers.toLocaleString("en-US") }), live: true },
    { key: "ending", href: "/browse?tab=auction&ending=1h", label: t(COPY.endingUnderHour), value: COUNTS.endingHour, sub: t(COPY.soonest, { time: formatDuration(soonest ?? 0, lang) }), urgent: true },
    { key: "deals", href: "/browse?tab=buy_now&has_discount=true", label: t(COPY.deals), value: COUNTS.deals, sub: t(COPY.upTo, { pct: COUNTS.maxDeal }) },
    { key: "new", href: "/browse?sort=newest", label: t(COPY.newToday), value: COUNTS.newToday, sub: t(COPY.newestFirst) },
  ];
  return (
    <section aria-label={t(COPY.countersLabel)} className="mt-4">
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {items.map((item) => (
          <li key={item.key}>
            <Link href={link(item.href)} className="hb-module group flex h-full flex-col justify-between gap-2 p-3.5 transition-colors hover:border-line-strong md:p-4">
              <span className="flex items-center justify-between gap-2">
                <span className={cx("inline-flex items-center gap-1.5 hb-eyebrow", item.live ? "text-live" : item.urgent ? "text-warning" : "text-fg-3")}>
                  {item.live ? <LiveDot /> : null}
                  {item.label}
                </span>
                <ArrowUpRight aria-hidden="true" className="flip-rtl size-4 text-fg-3 transition-colors group-hover:text-fg" />
              </span>
              <span className="flex items-end justify-between gap-2">
                <span className="hb-figure text-fg">{item.value}</span>
                <span className="truncate pb-1 text-end hb-xs text-fg-3" dir={item.key === "ending" && lang === "ar" ? "rtl" : undefined}>
                  {item.sub}
                </span>
              </span>
              <span className="sr-only">{pl("lots", item.value)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Category grid 4×2 ───────────────────────────────────────────────────
export function CategoryGrid() {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="hb-module mt-4">
      <ModuleHead id={titleId} title={t(COPY.browseCategories)} action={<ViewAll href="/browse">{t(COPY.all)}</ViewAll>} />
      <ul className="grid grid-cols-4 md:grid-cols-4">
        {CATEGORY_TREE.map(({ category, total, auctions, buyNow }, i) => (
          <li key={category.slug} className={cx("border-line", i % 4 !== 3 ? "border-e" : "", i < 4 ? "border-b" : "")}>
            <Link
              href={link(`/browse?category=${category.slug}`)}
              className="group flex h-full flex-col items-center gap-1.5 p-2.5 text-center transition-colors hover:bg-[var(--hb-row)] md:flex-row md:gap-3 md:p-3.5 md:text-start"
            >
              <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[8px] bg-plate md:size-12">
                <Img image={category.image} alt="" sizes="48px" className="size-full object-contain p-1 mix-blend-multiply" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 block w-full break-words hb-2xs font-semibold text-fg md:truncate md:hb-sm">{t(category.name)}</span>
                <span className="hidden hb-xs text-fg-3 md:block">
                  <span className="hb-num font-semibold text-fg-2">{plural(total, { en: { one: "{n} lot", other: "{n} lots" }, ar: { zero: "لا منتجات", one: "منتج واحد", two: "منتجان", few: "{n} منتجات", many: "{n} منتجاً", other: "{n} منتج" } }, lang)}</span>
                  <span className="hidden xl:inline">
                    {" · "}
                    {plural(auctions, PL.auctions, lang)} · {plural(buyNow, PL.buyNow, lang)}
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Mini-tables ─────────────────────────────────────────────────────────
function Countdown({ endsIn }) {
  const { lang } = useLang();
  const remaining = useRemaining(endsIn);
  const urgent = remaining != null && remaining <= 3600;
  return (
    <span dir={lang === "ar" ? "rtl" : "ltr"} className={cx("hb-num whitespace-nowrap font-semibold", urgent ? "text-live" : "text-fg-2")}>
      {formatDuration(remaining ?? 0, lang)}
    </span>
  );
}

function BidCell({ product }) {
  const { currentBid } = useHubLot(product);
  return <Money value={currentBid} className="font-semibold text-fg" />;
}

function BidsCell({ product }) {
  const { bidCount } = useHubLot(product);
  return <span className="hb-num font-semibold text-fg">{bidCount}</span>;
}

/** A mini-table: key figure | lot | price, four single-line rows; a row opens quick view. */
function MiniTable({ columns, rows, keyCell, valueCell }) {
  const { t } = useLang();
  const { openQuick } = useHub();
  return (
    <>
      <table className="hb-table hidden md:table">
        <thead>
          <tr>
            <th scope="col" className="w-[72px]">
              {columns[0]}
            </th>
            <th scope="col">{columns[1]}</th>
            <th scope="col" className="w-[92px] !text-end">
              {columns[2]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((product) => (
            <tr key={product.slug} onClick={() => openQuick(product.slug)}>
              <td className="hb-sm">{keyCell(product)}</td>
              <td className="max-w-0">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openQuick(product.slug);
                  }}
                  aria-label={t(COPY.openQuickView, { title: t(product.title) })}
                  className="flex w-full min-w-0 items-center gap-2.5 text-start"
                >
                  <Thumb image={product.images[0]} size={30} />
                  <span className="truncate hb-sm text-fg">{t(product.title)}</span>
                </button>
              </td>
              <td className="text-end hb-sm">{valueCell(product)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="divide-y divide-line md:hidden">
        {rows.map((product) => (
          <li key={product.slug}>
            <button
              type="button"
              onClick={() => openQuick(product.slug)}
              aria-label={t(COPY.openQuickView, { title: t(product.title) })}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-start"
            >
              <Thumb image={product.images[0]} size={44} />
              <span className="min-w-0 flex-1">
                <span className="block truncate hb-sm font-medium text-fg">{t(product.title)}</span>
                <span className="mt-0.5 flex items-center gap-2 hb-xs">
                  {keyCell(product)}
                  <span className="text-fg-3">·</span>
                  {valueCell(product)}
                </span>
              </span>
              <span aria-hidden="true" className={btnClass(isAuction(product) ? "secondary" : "soft", "xs")}>
                {isAuction(product) ? <Gavel className="size-3.5" /> : <Plus className="size-3.5" />}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export function MiniTables() {
  const { t, lang } = useLang();
  const [windowKey, setWindowKey] = useState("24h");
  const ids = [useId(), useId(), useId()];
  const limit = WINDOWS.find((w) => w.key === windowKey).seconds;
  const endingRows = ENDING.filter((p) => p.endsIn <= limit);
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <section aria-labelledby={ids[0]} className="hb-module overflow-hidden">
        <ModuleHead id={ids[0]} title={t(COPY.dealsTitle)} action={<ViewAll href="/browse?tab=buy_now&has_discount=true">{t(COPY.viewAllN, { n: DEALS.length })}</ViewAll>} />
        <MiniTable
          columns={[t(COPY.colOff), t(COPY.colLot), t(COPY.colPrice)]}
          rows={DEALS.slice(0, 4)}
          keyCell={(p) => (
            <span dir="ltr" className="hb-num font-bold text-[var(--hb-deal)]">
              −{discountPercent(p)}%
            </span>
          )}
          valueCell={(p) => <Money value={p.price} className="font-semibold text-fg" />}
        />
      </section>

      <section aria-labelledby={ids[1]} className="hb-module overflow-hidden">
        <ModuleHead id={ids[1]} title={t(COPY.endingTitle)} action={<ViewAll href="/browse?tab=auction&sort=recommended">{t(COPY.viewAllN, { n: COUNTS.openAuctions })}</ViewAll>}>
          <div role="radiogroup" aria-label={t(COPY.window)} className="order-last flex w-full rounded-[8px] bg-surface-2 p-0.5 sm:order-none sm:w-auto">
            {WINDOWS.map((w) => (
              <button
                key={w.key}
                type="button"
                role="radio"
                aria-checked={windowKey === w.key}
                onClick={() => setWindowKey(w.key)}
                className={cx("h-7 flex-1 rounded-[6px] px-2.5 hb-xs font-semibold transition-colors sm:flex-none", windowKey === w.key ? "bg-surface text-fg shadow-card" : "text-fg-3 hover:text-fg")}
              >
                <span dir={lang === "ar" ? "rtl" : "ltr"}>{t(w.label)}</span>
              </button>
            ))}
          </div>
        </ModuleHead>
        {endingRows.length ? (
          <MiniTable
            columns={[t(COPY.colLeft), t(COPY.colLot), t(COPY.colBid)]}
            rows={endingRows.slice(0, 4)}
            keyCell={(p) => <Countdown endsIn={p.endsIn} />}
            valueCell={(p) => <BidCell product={p} />}
          />
        ) : (
          <p className="px-4 py-8 text-center hb-sm text-fg-3">{t(COPY.noneInWindow)}</p>
        )}
      </section>

      <section aria-labelledby={ids[2]} className="hb-module overflow-hidden md:col-span-2 xl:col-span-1">
        <ModuleHead id={ids[2]} title={t(COPY.popularTitle)} action={<ViewAll href="/browse?tab=auction&sort=most_bids">{t(COPY.viewAll)}</ViewAll>} />
        <MiniTable
          columns={[t(COPY.colBids), t(COPY.colLot), t(COPY.colBid)]}
          rows={POPULAR.slice(0, 4)}
          keyCell={(p) => <BidsCell product={p} />}
          valueCell={(p) => <BidCell product={p} />}
        />
      </section>
    </div>
  );
}

// ── Sellers + Live & upcoming ───────────────────────────────────────────
export function SellersAndLive({ live }) {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const { reminders, toggleReminder } = useHub();
  const ids = [useId(), useId()];
  const item = live.current;
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <section aria-labelledby={ids[0]} className="hb-module overflow-hidden">
        <ModuleHead id={ids[0]} title={t(COPY.sellersTitle)} action={<ViewAll href="/seller">{t(COPY.allSellers, { n: SELLER_ROWS.length })}</ViewAll>} />
        <ul className="divide-y divide-line">
          {SELLER_ROWS.slice(0, 4).map(({ seller, stats }) => (
            <li key={seller.code}>
              <Link href={link(`/seller/${seller.code}`)} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--hb-row)]">
                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full hb-xs font-bold text-white" style={{ background: `color-mix(in oklab, ${seller.tone} 80%, black)` }}>
                  {seller.monogram}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate hb-sm font-semibold text-fg">{t(seller.name)}</span>
                    {seller.liveNow ? <span className="shrink-0 rounded-[4px] bg-[var(--hb-live-badge)] px-1.5 hb-2xs font-bold uppercase text-white">{t(COPY.live)}</span> : null}
                  </span>
                  <span className="block truncate hb-xs text-fg-3">
                    {t(CITIES[seller.city])} · {plural(stats.activeAuctions, PL.auctions, lang)} · {plural(stats.buyNowCount, PL.buyNow, lang)}
                  </span>
                </span>
                <ChevronRight aria-hidden="true" className="flip-rtl size-4 text-fg-3" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby={ids[1]} className="hb-module overflow-hidden">
        <ModuleHead id={ids[1]} title={t(COPY.liveUpcoming)} action={<ViewAll href="/live-auction">{t(COPY.viewAll)}</ViewAll>} />
        <ul className="divide-y divide-line">
          {item ? (
            <li className="flex items-center gap-3 px-4 py-2.5">
              <span className="relative size-11 shrink-0 overflow-hidden rounded-[8px] bg-surface-2">
                <Img image={live.event.stream} alt="" sizes="44px" className="size-full object-cover" />
                <span aria-hidden="true" className="absolute start-1 top-1 flex">
                  <LiveDot />
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="shrink-0 rounded-[4px] bg-[var(--hb-live-badge)] px-1.5 hb-2xs font-bold uppercase text-white">{t(COPY.live)}</span>
                  <span className="truncate hb-sm font-semibold text-fg">{t(live.event.title)}</span>
                </span>
                <span className="block truncate hb-xs text-fg-3">
                  {t(COPY.lotOf, { n: item.order, total: live.items.length })} · <Money value={item.currentBid} /> · <span className="hb-num">{t(COPY.watching, { n: live.viewers.toLocaleString("en-US") })}</span>
                </span>
              </span>
              <Link href={link("/live-auction")} className={btnClass("live", "sm")}>
                {t(COPY.join)}
                <span className="sr-only">: {t(live.event.title)}</span>
              </Link>
            </li>
          ) : null}
          {EVENTS.map((event) => {
            const on = reminders.has(event.slug);
            return (
              <li key={event.slug} className="flex items-center gap-3 px-4 py-2.5">
                <Thumb image={event.image} size={44} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate hb-sm font-semibold text-fg">{t(event.title)}</span>
                  <span className="block truncate hb-xs text-fg-3">
                    <EventCountdown startsIn={event.startsIn} /> · {plural(event.lots, { en: { one: "{n} lot", other: "{n} lots" }, ar: { zero: "لا منتجات", one: "منتج واحد", two: "منتجان", few: "{n} منتجات", many: "{n} منتجاً", other: "{n} منتج" } }, lang)}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-describedby={`${ids[1]}-concept`}
                    onClick={() => toggleReminder(event)}
                    className={btnClass(on ? "soft" : "secondary", "sm")}
                  >
                    <BellRing aria-hidden="true" className="size-3.5" />
                    {on ? t(COPY.reminderOn) : t(COPY.remindMe)}
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
        <p id={`${ids[1]}-concept`} className="flex items-start gap-2 border-t border-dashed border-line-strong bg-[var(--hb-row)] px-4 py-2 hb-xs text-fg-3">
          <span className="shrink-0 rounded-[4px] border border-line-strong px-1.5 hb-2xs font-bold uppercase text-fg-2">{t(COPY.concept)}</span>
          {t(COPY.conceptNote)}
        </p>
      </section>
    </div>
  );
}

function EventCountdown({ startsIn, prefix = COPY.inTime }) {
  const { t, lang } = useLang();
  const remaining = useRemaining(startsIn);
  return <span dir={lang === "ar" ? "rtl" : "ltr"}>{t(prefix, { time: formatDuration(remaining ?? 0, lang) })}</span>;
}

// ── Recently added: compact tiles, six across ───────────────────────────
export function RecentlyAdded() {
  const { t } = useLang();
  const { openQuick } = useHub();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="hb-module mt-4 overflow-hidden">
      <ModuleHead id={titleId} title={t(COPY.recentlyAdded)} action={<ViewAll href="/browse?sort=newest">{t(COPY.viewAll)}</ViewAll>} />
      <ul className="no-scrollbar relative flex snap-x scroll-px-4 gap-3 overflow-x-auto p-4 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
        {RECENT.map((product) => (
          <li key={product.slug} className="w-[132px] shrink-0 snap-start md:w-auto">
            <button type="button" onClick={() => openQuick(product.slug)} className="group w-full text-start" aria-label={t(COPY.openQuickView, { title: t(product.title) })}>
              <span className="relative block aspect-square overflow-hidden rounded-[10px] border border-line bg-plate">
                <Img image={product.images[0]} alt="" sizes="(min-width: 1024px) 14vw, 132px" className={cx("size-full transition-transform duration-300 group-hover:scale-[1.04]", product.images[0]?.kind === "scene" ? "object-cover" : "object-contain p-[10%] mix-blend-multiply")} />
                <GradeTag grade={product.grade} className="absolute start-1.5 top-1.5 bg-surface" />
              </span>
              <span className="mt-2 line-clamp-2 min-h-9 hb-xs font-medium text-fg">{t(product.title)}</span>
              <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 hb-xs">
                <Money value={isAuction(product) ? product.currentBid : product.price} className="font-bold text-fg" />
                {isAuction(product) && product.status === "live" ? (
                  <span className="text-fg-3">
                    · <TimeLeft endsIn={product.endsIn} />
                  </span>
                ) : product.status === "scheduled" ? (
                  <span className="font-semibold text-primary">
                    · <EventCountdown startsIn={product.startsIn} prefix={COPY.opens} />
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Pallets & bulk rows ─────────────────────────────────────────────────
export function PalletsBulk() {
  const { t, ui } = useLang();
  const { openQuick } = useHub();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="hb-module mt-4 overflow-hidden">
      <ModuleHead id={titleId} title={t(COPY.palletsTitle)} action={<ViewAll href="/browse?category=bulk-pallets">{t(COPY.viewAllN, { n: BULK.length })}</ViewAll>} />
      <div className="relative overflow-x-auto">
        <table className="hb-table min-w-[600px] table-fixed">
          <thead>
            <tr>
              <th scope="col">{t(COPY.colLot)}</th>
              <th scope="col" className="w-[120px]">
                {t(COPY.colType)}
              </th>
              <th scope="col" className="w-[80px] !text-end">
                {t(COPY.colUnits)}
              </th>
              <th scope="col" className="w-[96px]">
                {t(COPY.colGrade)}
              </th>
              <th scope="col" className="w-[150px] !text-end">
                {t(COPY.colPrice)}
              </th>
            </tr>
          </thead>
          <tbody>
            {BULK.map((product) => (
              <tr key={product.slug} onClick={() => openQuick(product.slug)}>
                <td className="max-w-0">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openQuick(product.slug);
                    }}
                    aria-label={t(COPY.openQuickView, { title: t(product.title) })}
                    className="flex w-full min-w-0 items-center gap-2.5 text-start"
                  >
                    <Thumb image={product.images[0]} size={30} />
                    <span className="truncate hb-sm text-fg">{t(product.title)}</span>
                  </button>
                </td>
                <td className="whitespace-nowrap hb-sm text-fg-2">{isAuction(product) ? t(COPY.auctions) : t(COPY.buyNow)}</td>
                <td className="text-end hb-num hb-sm font-semibold text-fg">{unitsOf(product) ?? "—"}</td>
                <td>
                  <GradeTag grade={product.grade} />
                </td>
                <td className="text-end hb-sm">
                  <Money value={isAuction(product) ? product.currentBid : product.price} className="font-semibold text-fg" />
                  {!isAuction(product) && product.unitLabel ? <span className="ms-1 hb-2xs text-fg-3">{t(product.unitLabel)}</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span className="sr-only">{ui("bulkLots")}</span>
    </section>
  );
}

// ── Buying on Khazna: one link row ──────────────────────────────────────
const TRUST_ICONS = { graded: BadgeCheck, deposit: ShieldCheck, payments: CreditCard, delivery: Truck };

export function BuyingOnKhazna() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section id="buying" aria-labelledby={titleId} className="hb-module mt-4 scroll-mt-24 overflow-hidden">
      <ModuleHead id={titleId} title={t(COPY.buyingTitle)} />
      <ol id="how-it-works" aria-label={t(COPY.howItWorks)} className="grid scroll-mt-24 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map((step) => (
          <li key={step.step} className="flex gap-3 bg-surface p-4">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary hb-xs font-bold text-on-primary hb-num">{step.step}</span>
            <span>
              <span className="block hb-sm font-semibold text-fg">{t(step.title)}</span>
              <span className="mt-0.5 block hb-xs text-fg-2">{t(step.text)}</span>
            </span>
          </li>
        ))}
      </ol>
      <ul className="grid gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map((point) => {
          const Icon = TRUST_ICONS[point.key] || BadgeCheck;
          return (
            <li key={point.key} className="flex gap-3 bg-[var(--hb-row)] p-4">
              <Icon aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-primary" />
              <span>
                <span className="block hb-sm font-semibold text-fg">{t(point.title)}</span>
                <span className="mt-0.5 block hb-xs text-fg-2">{t(point.text)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
