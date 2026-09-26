"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowUpRight, BellRing, ChevronRight, Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { CITIES } from "@/data/sellers";
import { GRADES, GRADE_ORDER } from "@/data/grades";
import { AUCTION_POLICY, TRUST_POINTS } from "@/data/site";
import { detailPath } from "@/lib/catalog";
import { useElapsed } from "@/lib/clock";
import { moneyText } from "@/lib/format";
import { plural } from "@/lib/i18n";
import { COPY, PL } from "./copy";
import { ACTIVE, BUY_NOW_COUNT, EVENTS, FLOOR, HOSTS, OPEN, STOCK, TICKS, UPCOMING_LOTS, WINDOWS, axisPosition } from "./data";
import { useFloor, useFloorLot } from "./state";
import { BidTicket, StockTicket, WatchToggle } from "./Tickets";
import { LiveDot, Thumb, TimeText, btnClass, cx, plainTime } from "./ui";

function SectionHead({ id, title, sub, action, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="max-w-2xl">
        <h2 id={id} className="ac-h2 text-fg">
          {title}
        </h2>
        {sub ? <p className="mt-1 ac-md text-fg-2">{sub}</p> : null}
      </div>
      {children}
      {action}
    </div>
  );
}

function MoreLink({ href, children }) {
  const { link } = useConcept();
  return (
    <Link href={link(href)} className={btnClass("outline", "md")}>
      {children}
      <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
    </Link>
  );
}

const GRADE_VAR = { new: "--grade-new", A: "--grade-a", B: "--grade-b", C: "--grade-c", D: "--grade-d", R: "--grade-r", F: "--grade-f" };

// ── Ending soon: timeline with photo pins + window chips + bid tickets ───
function Timeline({ windowSeconds, now }) {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const reach = axisPosition(windowSeconds) ?? 1;
  const pins = OPEN.map((p) => ({ product: p, left: Math.max(0, p.endsIn - now) })).filter((pin) => pin.left > 0 && axisPosition(pin.left) != null);
  const later = OPEN.filter((p) => axisPosition(Math.max(0, p.endsIn - now)) == null).length;
  return (
    <div className="mt-6 rounded-[12px] border border-line bg-surface px-5 pb-3 pt-4 lg:px-8">
      <div className="relative h-[214px]" role="group" aria-label={t(COPY.timelineLabel)}>
        {/* window highlight + axis */}
        <span aria-hidden="true" className="absolute top-[98px] h-[6px] rounded-full bg-[var(--ac-urgent-soft)] transition-[width] duration-300" style={{ insetInlineStart: 0, width: `${reach * 100}%` }} />
        <span aria-hidden="true" className="ac-axis absolute inset-x-0 top-[100px]" />
        {TICKS.map((tick) => (
          <span key={tick.s} aria-hidden="true" className="absolute top-0 flex h-full flex-col items-center" style={{ insetInlineStart: `${tick.p * 100}%`, transform: lang === "ar" ? "translateX(50%)" : "translateX(-50%)" }}>
            <span className="h-[196px] w-px border-s border-dashed border-line" />
            <span className="mt-1 ac-2xs font-semibold text-fg-3">{t(tick.label)}</span>
          </span>
        ))}
        <ol>
          {pins.map(({ product, left }, i) => {
            const pos = axisPosition(left);
            const inWindow = left <= windowSeconds;
            const up = i % 2 === 0;
            return (
              <li
                key={product.slug}
                className="absolute flex w-[64px] flex-col items-center"
                style={{
                  insetInlineStart: `${pos * 100}%`,
                  transform: lang === "ar" ? "translateX(50%)" : "translateX(-50%)",
                  top: up ? 4 : 101,
                  height: 95,
                  flexDirection: up ? "column" : "column-reverse",
                }}
              >
                <span dir={lang === "ar" ? "rtl" : "ltr"} className={cx("whitespace-nowrap ac-2xs font-bold ac-num", inWindow ? (left <= 3600 ? "text-accent" : "text-fg") : "text-fg-3")}>
                  {plainTime(left, lang)}
                </span>
                <Link
                  href={link(detailPath(product))}
                  aria-label={`${t(product.title)} — ${t(COPY.closesIn, { time: plainTime(left, lang) })}, ${t(COPY.current)} ${moneyText(product.currentBid)}`}
                  title={t(product.title)}
                  className={cx(
                    "mt-1 grid size-11 place-items-center overflow-hidden rounded-full bg-plate ring-2 transition-transform hover:scale-110",
                    inWindow ? "ring-accent" : "opacity-60 ring-line-strong",
                    up ? "" : "mb-1 mt-0",
                  )}
                >
                  <Img image={product.images[0]} alt="" sizes="44px" className="size-full object-contain p-1 mix-blend-multiply" />
                </Link>
                <span aria-hidden="true" className={cx("w-px flex-1", inWindow ? "bg-accent" : "bg-line-strong")} />
              </li>
            );
          })}
        </ol>
        {later ? (
          <span className="absolute end-0 top-[112px] rounded-full bg-surface-2 px-2 py-0.5 ac-2xs font-semibold text-fg-3">
            {t(COPY.laterThisWeek, { n: later })} {lang === "ar" ? "←" : "→"}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function BidRow({ product }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { askBid } = useFloor();
  const { currentBid, minNext, winning } = useFloorLot(product);
  return (
    <li className="flex items-center gap-3 py-2.5">
      <Thumb image={product.images[0]} size={48} />
      <div className="min-w-0 flex-1">
        {winning ? <p className="ac-2xs font-bold uppercase tracking-wide text-fg">✓ {t(COPY.youreWinning)}</p> : null}
        <Link href={link(detailPath(product))} className="block truncate ac-sm font-semibold text-fg">
          {t(product.title)}
        </Link>
        <p className="flex items-center gap-2 whitespace-nowrap ac-xs">
          <Money value={currentBid} className="font-semibold text-fg" />
          <span className="text-fg-3">·</span>
          <TimeText target={product.endsIn} className="font-semibold" />
        </p>
      </div>
      <button type="button" onClick={() => askBid(product.slug, minNext)} className={btnClass("ink", "sm")}>
        <Gavel aria-hidden="true" className="size-3.5" />
        <span className="ac-num">{moneyText(minNext)}</span>
        <span className="sr-only">: {t(product.title)}</span>
      </button>
    </li>
  );
}

/** Phones: time buckets — within 15 minutes (tickets), within 1 hour and 24 hours (rows). */
function MobileBuckets({ now }) {
  const { t } = useLang();
  const left = (p) => Math.max(0, p.endsIn - now);
  const b15 = OPEN.filter((p) => left(p) > 0 && left(p) <= 900);
  const b1h = OPEN.filter((p) => left(p) > 900 && left(p) <= 3600);
  const b24 = OPEN.filter((p) => left(p) > 3600 && left(p) <= 86400);
  const buckets = [
    [COPY.w15, b15, "tickets"],
    [COPY.w1h, b1h, "rows"],
    [COPY.w24h, b24, "rows"],
  ];
  return (
    <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-6 md:hidden">
      {buckets.map(([label, items, kind]) =>
        items.length ? (
          <section key={label.en} aria-label={`${t(COPY.windowLabel)} ${t(label)}`}>
            <p className="flex items-center justify-between ac-label text-fg-3">
              <span>
                {t(COPY.windowLabel)} {t(label)}
              </span>
              <span className="ac-num">{items.length}</span>
            </p>
            {kind === "tickets" ? (
              <ul className="no-scrollbar relative -mx-4 mt-2 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1">
                {items.map((p) => (
                  <li key={p.slug} className={cx("shrink-0 snap-start", items.length > 1 ? "w-[86%]" : "w-full")}>
                    <BidTicket product={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-1 divide-y divide-line">
                {items.map((p) => (
                  <BidRow key={p.slug} product={p} />
                ))}
              </ul>
            )}
          </section>
        ) : null,
      )}
    </div>
  );
}

export function EndingSoon() {
  const { t } = useLang();
  const { link } = useConcept();
  const now = useElapsed();
  const titleId = useId();
  const [windowKey, setWindowKey] = useState("1h");
  const current = WINDOWS.find((w) => w.key === windowKey);
  const left = (p) => Math.max(0, p.endsIn - now);
  const countIn = (seconds) => OPEN.filter((p) => left(p) > 0 && left(p) <= seconds).length;
  const inWindow = OPEN.filter((p) => left(p) > 0 && left(p) <= current.seconds);
  const shown = inWindow.slice(0, 3);
  return (
    <section id="floor-ending" tabIndex={-1} aria-labelledby={titleId} className="ac-container scroll-mt-[calc(var(--ac-bar-h)+16px)] pt-8 outline-none max-md:scroll-mt-[112px] lg:pt-12">
      <SectionHead id={titleId} title={t(COPY.endingTitle)} sub={t(COPY.endingSub)}>
        <div role="radiogroup" aria-label={t(COPY.windowLabel)} className="hidden flex-wrap gap-1.5 md:flex">
          {WINDOWS.map((w) => {
            const on = w.key === windowKey;
            return (
              <button
                key={w.key}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setWindowKey(w.key)}
                className={cx(
                  "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 ac-sm font-semibold transition-colors",
                  on ? "border-fg bg-fg text-bg" : "border-line-strong bg-surface text-fg-2 hover:text-fg",
                )}
              >
                {t(COPY[w.label])}
                <span className={cx("grid h-5 min-w-5 place-items-center rounded-full px-1 ac-2xs font-bold ac-num", on ? "bg-bg text-fg" : "bg-surface-2 text-fg-2")}>{countIn(w.seconds)}</span>
              </button>
            );
          })}
        </div>
      </SectionHead>

      <div className="hidden md:block">
        <Timeline windowSeconds={current.seconds} now={now} />
        {shown.length ? (
          <ul className="mt-4 grid gap-3 md:grid-cols-3 lg:gap-4">
            {shown.map((p) => (
              <li key={p.slug} className="flex">
                <BidTicket product={p} className="w-full" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-[12px] border border-dashed border-line-strong p-6 text-center ac-sm text-fg-2">{t(COPY.noneInWindow)}</p>
        )}
        {inWindow.length > shown.length ? (
          <p className="mt-3 text-end">
            <Link href={link(`/browse?tab=auction&ending=${windowKey === "15m" ? "1h" : windowKey === "3h" ? "6h" : windowKey}`)} className="ac-sm font-semibold text-fg underline-offset-4 hover:underline">
              {t(COPY.moreInWindow, { n: inWindow.length - shown.length, w: t(COPY[current.label]) })}
            </Link>
          </p>
        ) : null}
      </div>
      <MobileBuckets now={now} />
    </section>
  );
}

export function ActiveAuctions() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="ac-container hidden pt-10 md:block lg:pt-14">
      <SectionHead id={titleId} title={t(COPY.activeTitle)} sub={t(COPY.activeSub)} action={<MoreLink href="/browse?tab=auction">{t(COPY.viewAllN, { n: OPEN.length })}</MoreLink>} />
      <ul className="mt-5 grid gap-3 md:grid-cols-3 lg:gap-4">
        {ACTIVE.map((p) => (
          <li key={p.slug} className="flex">
            <BidTicket product={p} className="w-full" />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Upcoming: the scheduled timed lot + the next live events ────────────
export function Upcoming() {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const { reminders, toggleReminder } = useFloor();
  const titleId = useId();
  const noteId = useId();
  return (
    <section id="floor-upcoming" tabIndex={-1} aria-labelledby={titleId} className="ac-container scroll-mt-[calc(var(--ac-bar-h)+16px)] pt-10 outline-none max-md:scroll-mt-[112px] lg:pt-14">
      <SectionHead id={titleId} title={t(COPY.upcomingTitle)} sub={t(COPY.upcomingSub)} />
      <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-4">
        {UPCOMING_LOTS.map((p) => (
          <article key={p.slug} className="ac-ticket">
            <div className="px-4 pb-3 pt-3.5">
              <p className="ac-label text-fg-3">{t(COPY.timedAuction)}</p>
              <p className="mt-1.5 ac-time text-fg">
                <TimeText target={p.startsIn} template={COPY.opensIn} urgentBelow={0} />
              </p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="ac-label text-fg-3">{t(COPY.startingAt)}</span>
                <Money value={p.startingBid ?? p.currentBid} className="ac-figure text-fg" />
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Thumb image={p.images[0]} size={60} />
              <Link href={link(detailPath(p))} className="line-clamp-2 min-w-0 flex-1 ac-sm font-semibold text-fg hover:underline">
                {t(p.title)}
              </Link>
            </div>
            <div className="mt-auto flex p-3">
              <WatchToggle product={p} withLabel className="flex-1" />
            </div>
          </article>
        ))}

        <div className="ac-ticket">
          <div className="px-4 pb-2 pt-3.5">
            <p className="ac-label text-fg-3">{t(COPY.liveEvents)}</p>
          </div>
          <ul className="divide-y divide-line">
            {EVENTS.map((event) => {
              const on = reminders.has(event.slug);
              return (
                <li key={event.slug} className="flex items-center gap-3 px-4 py-3">
                  <Thumb image={event.image} size={52} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate ac-sm font-semibold text-fg">{t(event.title)}</p>
                    <p className="ac-xs text-fg-3">
                      <TimeText target={event.startsIn} template={COPY.inTime} urgentBelow={0} /> · {plural(event.lots, { en: { one: "{n} lot", other: "{n} lots" }, ar: { zero: "لا منتجات", one: "منتج واحد", two: "منتجان", few: "{n} منتجات", many: "{n} منتجاً", other: "{n} منتج" } }, lang)}
                    </p>
                  </div>
                  <button type="button" aria-pressed={on} aria-describedby={noteId} onClick={() => toggleReminder(event)} className={btnClass(on ? "ghost" : "outline", "sm")}>
                    <BellRing aria-hidden="true" className="size-3.5" />
                    {on ? t(COPY.reminderOn) : t(COPY.remindMe)}
                  </button>
                </li>
              );
            })}
          </ul>
          <p id={noteId} className="mt-auto flex items-start gap-2 bg-surface-2 px-4 py-2.5 ac-xs text-fg-3">
            <span className="shrink-0 rounded-[4px] border border-line-strong px-1.5 ac-2xs font-bold uppercase text-fg-2">{t(COPY.concept)}</span>
            {t(COPY.conceptNote)}
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Buy Now: after Upcoming, "skip the bidding" ─────────────────────────
export function BuyNowFloor() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section id="floor-buy" tabIndex={-1} aria-labelledby={titleId} className="ac-container scroll-mt-[calc(var(--ac-bar-h)+16px)] pt-10 outline-none max-md:scroll-mt-[112px] lg:pt-14">
      <SectionHead id={titleId} title={t(COPY.buyNowTitle)} sub={t(COPY.buyNowSub)} action={<MoreLink href="/browse?tab=buy_now">{t(COPY.shopBuyNow, { n: BUY_NOW_COUNT })}</MoreLink>} />
      <ul className="no-scrollbar relative -mx-4 mt-5 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4 lg:gap-4">
        {STOCK.map((p) => (
          <li key={p.slug} className="flex w-[80%] shrink-0 snap-start md:w-auto">
            <StockTicket product={p} className="w-full" />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Categories on the floor ─────────────────────────────────────────────
export function FloorCategories() {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="ac-container pt-10 lg:pt-14">
      <SectionHead id={titleId} title={t(COPY.floorTitle)} sub={t(COPY.floorSub)} />
      <ul className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-4 lg:gap-3">
        {FLOOR.map(({ category, open, buy, next }) => (
          <li key={category.slug}>
            <Link href={link(`/browse?category=${category.slug}${open ? "&tab=auction" : ""}`)} className="flex h-full items-center gap-3 rounded-[12px] border border-line bg-surface p-3 transition-colors hover:border-fg-3">
              <Thumb image={category.image} size={44} />
              <span className="min-w-0 flex-1">
                <span className="block truncate ac-sm font-semibold text-fg">{t(category.name)}</span>
                <span className="block truncate ac-xs text-fg-3">
                  {open ? plural(open, PL.open, lang) : t(COPY.buyOnly)}
                  {open && buy ? ` · ${plural(buy, PL.buy, lang)}` : ""}
                </span>
                {next != null ? (
                  <span className="block ac-xs font-semibold">
                    <TimeText target={next} template={COPY.nextClose} />
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Auction hosts on one shared time axis ───────────────────────────────
export function Hosts() {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const now = useElapsed();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="ac-container pt-10 lg:pt-14">
      <SectionHead id={titleId} title={t(COPY.hostsTitle)} sub={t(COPY.hostsSub)} />
      <div className="mt-5 overflow-hidden rounded-[12px] border border-line bg-surface">
        <div aria-hidden="true" className="hidden grid-cols-[220px_minmax(0,1fr)_140px] items-end gap-4 border-b border-line px-4 py-2 lg:grid">
          <span />
          <span className="relative h-4">
            {TICKS.map((tick) => (
              <span key={tick.s} className="absolute ac-2xs font-semibold text-fg-3" style={{ insetInlineStart: `${tick.p * 100}%`, transform: lang === "ar" ? "translateX(50%)" : "translateX(-50%)" }}>
                {t(tick.label)}
              </span>
            ))}
          </span>
          <span />
        </div>
        <ul className="divide-y divide-line">
          {HOSTS.map(({ seller, lots }) => {
            const onAxis = lots.filter((p) => axisPosition(Math.max(0, p.endsIn - now)) != null);
            const later = lots.length - onAxis.length;
            return (
              <li key={seller.code} className="grid items-center gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[220px_minmax(0,1fr)_140px] lg:gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full ac-xs font-bold text-white" style={{ background: `color-mix(in oklab, ${seller.tone} 80%, black)` }}>
                    {seller.monogram}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate ac-sm font-semibold text-fg">{t(seller.name)}</span>
                    <span className="flex items-center gap-1.5 ac-xs text-fg-3">
                      {seller.liveNow ? (
                        <>
                          <LiveDot />
                          <span className="font-semibold text-accent">{t(COPY.liveNow)}</span>
                        </>
                      ) : (
                        <>
                          {t(CITIES[seller.city])} · {plural(lots.length, PL.open, lang)}
                        </>
                      )}
                    </span>
                  </span>
                </div>
                <div className="relative hidden h-10 lg:block">
                  <span aria-hidden="true" className="ac-axis absolute inset-x-0 top-1/2 -translate-y-1/2" />
                  {onAxis.map((p) => {
                    const leftS = Math.max(0, p.endsIn - now);
                    return (
                      <Link
                        key={p.slug}
                        href={link(detailPath(p))}
                        aria-label={`${t(p.title)} — ${t(COPY.closesIn, { time: plainTime(leftS, lang) })}`}
                        title={`${t(p.title)} · ${plainTime(leftS, lang)}`}
                        className="absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center overflow-hidden rounded-full bg-plate ring-2 ring-surface transition-transform hover:scale-110"
                        style={{ insetInlineStart: `${axisPosition(leftS) * 100}%`, marginInlineStart: -16 }}
                      >
                        <Img image={p.images[0]} alt="" sizes="32px" className="size-full object-contain p-0.5 mix-blend-multiply" />
                      </Link>
                    );
                  })}
                  {later ? (
                    <span className="absolute end-0 top-1/2 -translate-y-1/2 rounded-full bg-surface-2 px-2 py-0.5 ac-2xs font-semibold text-fg-3">{t(COPY.laterThisWeek, { n: later })}</span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <span className="ac-xs text-fg-3 lg:hidden">{lots.length ? <TimeText target={lots[0].endsIn} template={COPY.nextClose} /> : null}</span>
                  {seller.liveNow ? (
                    <Link href={link("/live-auction")} className={btnClass("urgent", "sm")}>
                      {t(COPY.enterRoomShort)}
                    </Link>
                  ) : (
                    <Link href={link(`/seller/${seller.code}`)} className={btnClass("outline", "sm")}>
                      {t(COPY.sellerPage)}
                      <ChevronRight aria-hidden="true" className="flip-rtl size-3.5" />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ── How bidding works + grades ──────────────────────────────────────────
export function HowBidding() {
  const { t, ui } = useLang();
  const titleId = useId();
  const deposit = TRUST_POINTS.find((p) => p.key === "deposit");
  const delivery = TRUST_POINTS.find((p) => p.key === "delivery");
  const steps = [
    { title: t(COPY.stepDeposit), text: t(deposit.text) },
    { title: t(COPY.stepBid), text: t(COPY.stepBidText) },
    { title: t(COPY.stepExtend), text: ui("antiSnipe") },
    { title: t(COPY.stepPay), text: t(COPY.stepPayText, { h: AUCTION_POLICY.paymentWindowHours }) },
    { title: t(COPY.stepReceive), text: t(delivery.text) },
  ];
  return (
    <section id="floor-how" tabIndex={-1} aria-labelledby={titleId} className="ac-container scroll-mt-[calc(var(--ac-bar-h)+16px)] py-10 outline-none max-md:scroll-mt-[112px] lg:py-14">
      <div className="rounded-[16px] border border-line bg-surface p-5 lg:p-8">
        <h2 id={titleId} className="ac-h2 text-fg">
          {t(COPY.howTitle)}
        </h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {steps.map((step, i) => (
            <li key={step.title} className="relative lg:pe-4">
              <span className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-primary ac-xs font-bold text-on-primary ac-num">{i + 1}</span>
                <span aria-hidden="true" className={cx("hidden h-px flex-1 bg-line-strong lg:block", i === steps.length - 1 ? "lg:invisible" : "")} />
              </span>
              <p className="mt-3 ac-sm font-semibold text-fg">{step.title}</p>
              <p className="mt-1 ac-xs text-fg-2">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 border-t border-line pt-6">
          <h3 className="ac-h3 text-fg">{t(COPY.gradesTitle)}</h3>
          <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
            {GRADE_ORDER.map((key) => (
              <li key={key} className="rounded-[10px] bg-surface-2 p-3">
                <span className="flex items-center gap-2 ac-sm font-bold text-fg">
                  <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: `var(${GRADE_VAR[key]})` }} />
                  {t(GRADES[key].label)}
                </span>
                <span className="mt-1 block ac-xs text-fg-2">{t(GRADES[key].text)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
