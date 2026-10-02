"use client";

// Premium Modern bidding: the charcoal bid panel (price, figures, bidder
// status, the bid form, maximum bid and notes), Buy Now as a quiet line
// under it, and the phone treatment (a short charcoal summary, the ivory
// bid bar and the bid sheet). Behaviour comes from the shared auction hooks.
import { useId } from "react";
import { BellRing, ChevronDown, CircleAlert, CircleCheck, Clock3, Gavel, Heart, Info, Minus, Plus, Repeat, ShieldCheck, Trophy, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useAuctionClock, useBidForm, useBidderStatus, useMaxBid, useToastClearance, useWinner } from "@/components/shared/auction/hooks";
import { countdownText, useSaveToggle } from "@/components/shared/r3/home";
import { Modal } from "@/components/shared/ui/Modal";
import { Money } from "@/components/shared/ui/Money";
import { marketSaving } from "@/lib/catalog";
import { RIYAL, formatNumber } from "@/lib/format";
import { btn, cx } from "../ui";

const TONES = {
  dark: {
    label: "text-white",
    muted: "text-white/75",
    field: "border-white bg-white",
    step: "text-[#4a4d57] hover:bg-[var(--pr-stone)]",
    quick: "border-white/35 text-white hover:bg-white/10",
    quickOn: "border-white bg-white text-[#171b27]",
    error: "text-[#ffb4ab]",
    primary: "brass",
    rule: "border-white/15",
    soft: "bg-white/[0.08]",
    link: "text-white",
  },
  light: {
    label: "text-fg",
    muted: "text-fg-2",
    field: "border-[#b9a98a] bg-white",
    step: "text-[#4a4d57] hover:bg-[var(--pr-stone)]",
    quick: "border-[#d3cfc6] bg-white text-fg hover:bg-[var(--pr-stone)]",
    quickOn: "border-[var(--pr-charcoal)] bg-[var(--pr-charcoal)] text-white",
    error: "text-[var(--danger)]",
    primary: "charcoal",
    rule: "border-line",
    soft: "bg-[var(--pr-panel)]",
    link: "text-[var(--pr-bronze)]",
  },
};

/** Red clock with the time left (charcoal while upcoming), plus one spoken phrase. */
export function ClockLine({ auction, className = "" }) {
  const { ui, lang } = useLang();
  const clock = useAuctionClock(auction);
  if (clock.closed) return <p className={cx("pr-md font-semibold text-fg-2", className)}>{ui(auction.phase === "sold" ? "sold" : "ended")}</p>;
  return (
    <p className={cx("inline-flex flex-wrap items-center gap-x-1.5 font-bold", clock.upcoming ? "text-fg" : "text-[var(--pr-timer)]", className)}>
      <Clock3 aria-hidden="true" className="size-[17px] shrink-0" strokeWidth={2.2} />
      <span className="sr-only">{clock.spoken}</span>
      <span aria-hidden="true" className={cx("font-medium", clock.upcoming ? "text-fg-2" : "")}>
        {clock.label}
      </span>
      <span aria-hidden="true" className="tabular" dir={lang === "ar" ? "rtl" : "ltr"}>
        {countdownText(clock.seconds ?? 0, lang)}
      </span>
      {clock.extended ? <span className="ms-1 rounded-[3px] bg-[var(--pr-stone)] px-1.5 py-0.5 pr-2xs font-semibold text-fg">{ui("timeExtended")}</span> : null}
    </p>
  );
}

/** Save (heart) as a bordered square, matching the share control beside it. */
export function SaveSquare({ product }) {
  const { ui } = useLang();
  const { saved, toggle, label } = useSaveToggle(product);
  return (
    <button type="button" onClick={toggle} aria-pressed={saved} aria-label={label} title={ui(saved ? "watching" : "watch")} className={btn("outline", "md", "w-11 px-0")} data-testid="watch-button">
      <Heart aria-hidden="true" className={cx("size-5", saved && "fill-[var(--pr-live)] text-[var(--pr-live)]")} strokeWidth={1.6} />
    </button>
  );
}

function Banner({ detail, tone, announce = true }) {
  const status = useBidderStatus(detail);
  const T = TONES[tone];
  const good = status.kind === "highest" || status.kind === "won" || status.kind === "bought";
  const Icon = good ? (status.kind === "highest" ? CircleCheck : Trophy) : status.kind === "closed" ? Info : CircleAlert;
  return (
    <>
      {announce ? (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {status.spoken}
        </p>
      ) : null}
      {status.kind ? (
        <div aria-hidden={announce ? "true" : undefined} className={cx("kz-fade-up flex items-start gap-2.5 rounded-[4px] px-3 py-2.5", T.soft)}>
          <Icon
            aria-hidden="true"
            className={cx("mt-0.5 size-4 shrink-0", good ? (tone === "dark" ? "text-[#8fd6b4]" : "text-[var(--pr-grade-a)]") : status.kind === "closed" ? T.muted : tone === "dark" ? "text-[#ffb4ab]" : "text-[var(--danger)]")}
            strokeWidth={2}
          />
          <div className="min-w-0 pr-md">
            <p className={cx("font-semibold", T.label)}>{status.title}</p>
            {status.label ? (
              <p className={cx("flex flex-wrap items-baseline gap-x-1.5", T.muted)}>
                {status.label}
                <Money value={status.amount} className={cx("font-semibold", T.label)} />
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Amount with −/+ (one increment), quick bids and Place bid; valid amounts go to the confirm step. */
function BidForm({ detail, tone, testId }) {
  const { ui } = useLang();
  const T = TONES[tone];
  const form = useBidForm(detail.auction, detail.requestBid);
  return (
    <div className="grid gap-3">
      <div>
        <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3">
          <label htmlFor={form.id} className={cx("pr-md font-semibold", T.label)}>
            {ui("yourBid")}
          </label>
          <span id={form.hintId} className={cx("pr-xs", T.muted)}>
            {ui("nextMinBid")} <Money value={form.minNext} className={cx("font-semibold", T.label)} />
          </span>
        </div>
        <div className={cx("flex h-12 items-stretch overflow-hidden rounded-[4px] border focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--pr-brass)]", T.field, form.error && "border-[var(--danger)]")}>
          <button type="button" onClick={form.lower} disabled={!form.canLower} aria-label={form.lowerLabel} className={cx("grid w-12 shrink-0 place-items-center border-e border-[#e4e2dc] disabled:opacity-35", T.step)}>
            <Minus aria-hidden="true" className="size-4" strokeWidth={2} />
          </button>
          <div dir="ltr" className="flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2 text-[#171b27]">
            <span aria-hidden="true" className="pr-lg font-semibold text-[#61656f]">
              {RIYAL}
            </span>
            <input {...form.inputProps} className="pr-no-spin w-full min-w-0 bg-transparent text-center text-[20px] font-bold tabular outline-none" />
          </div>
          <button type="button" onClick={form.raise} aria-label={form.raiseLabel} className={cx("grid w-12 shrink-0 place-items-center border-s border-[#e4e2dc]", T.step)}>
            <Plus aria-hidden="true" className="size-4" strokeWidth={2} />
          </button>
        </div>
        {form.error ? (
          <p id={form.errorId} role="alert" className={cx("mt-1.5 pr-sm font-semibold", T.error)}>
            {form.error}
          </p>
        ) : null}
      </div>
      <div role="group" aria-label={ui("quickBid")} className="grid grid-cols-3 gap-2">
        {form.quickBids.map((bid) => (
          <button key={bid} type="button" onClick={() => form.quick(bid)} aria-label={form.quickLabel(bid)} className={cx("h-10 rounded-[4px] border pr-sm font-semibold tabular transition-colors", form.value === bid ? T.quickOn : T.quick)}>
            <span dir="ltr">
              {RIYAL} {formatNumber(bid)}
            </span>
          </button>
        ))}
      </div>
      <button type="button" onClick={form.submit} className={btn(T.primary, "lg", "w-full font-semibold")} data-testid={testId}>
        <Gavel aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        {ui("placeBid")}
        {form.valid ? (
          <>
            <span aria-hidden="true">·</span>
            <Money value={form.value} />
          </>
        ) : null}
      </button>
    </div>
  );
}

function MaxBid({ auction, tone }) {
  const { ui } = useLang();
  const T = TONES[tone];
  const max = useMaxBid(auction);
  return (
    <div className={cx("border-t pt-3", T.rule)}>
      <button type="button" aria-expanded={max.open} aria-controls={max.panelId} onClick={max.toggle} className={cx("flex w-full items-center gap-2 text-start pr-md font-medium", T.label)}>
        <Repeat aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.8} />
        <span className="flex-1 underline-offset-4 hover:underline">{ui("setMaxBid")}</span>
        {max.myMax ? <Money value={max.myMax} className="pr-sm font-semibold" /> : null}
        <ChevronDown aria-hidden="true" className={cx("size-4 shrink-0 transition-transform", max.open && "rotate-180")} />
      </button>
      <div id={max.panelId} hidden={!max.open} className="pt-3">
        <p className={cx("pr-sm", T.muted)}>{ui("maxBidExplain")}</p>
        {max.myMax ? (
          <p className={cx("mt-2.5 flex items-center justify-between gap-3 rounded-[4px] px-3 py-2 pr-sm", T.soft, T.label)}>
            <span>
              {ui("yourMaxBid")} <Money value={max.myMax} className="font-semibold" />
            </span>
            <button type="button" onClick={max.clear} className={cx("pr-sm font-semibold underline underline-offset-4", T.link)}>
              {ui("clearMaxBid")}
            </button>
          </p>
        ) : null}
        <label htmlFor={max.inputId} className="sr-only">
          {ui("maxBid")}
        </label>
        <div className="mt-2.5 flex gap-2">
          <div className={cx("flex h-10 min-w-0 flex-1 items-center gap-1.5 rounded-[4px] border px-3 text-[#171b27] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--pr-brass)]", T.field, max.error && "border-[var(--danger)]")} dir="ltr">
            <span aria-hidden="true" className="font-semibold text-[#61656f]">
              {RIYAL}
            </span>
            <input {...max.inputProps} className="pr-no-spin min-w-0 flex-1 bg-transparent pr-md font-semibold tabular outline-none placeholder:font-normal placeholder:text-[#6c7079]" />
          </div>
          <button type="button" onClick={max.save} className={btn(tone === "dark" ? "outline" : "charcoal", "sm", "h-10")}>
            {ui("saveMaxBid")}
          </button>
        </div>
        {max.error ? (
          <p id={max.errorId} role="alert" className={cx("mt-1.5 pr-sm font-semibold", T.error)}>
            {max.error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Notes({ auction, tone }) {
  const { ui } = useLang();
  const T = TONES[tone];
  return (
    <ul className={cx("grid gap-1.5 pr-xs", T.muted)}>
      <li className="flex items-start gap-2">
        <ShieldCheck aria-hidden="true" className="mt-px size-[15px] shrink-0" strokeWidth={1.8} />
        <span>
          {ui("depositCovered")} · {ui("walletBalance")} <Money value={auction.deposit.walletBalance} className={cx("font-semibold", T.label)} />
        </span>
      </li>
      <li className="flex items-start gap-2">
        <Info aria-hidden="true" className="mt-px size-[15px] shrink-0" strokeWidth={1.8} />
        <span>{ui("antiSnipe")}</span>
      </li>
    </ul>
  );
}

function Upcoming({ detail, tone }) {
  const { t, ui } = useLang();
  const T = TONES[tone];
  const { saved, toggle } = useSaveToggle(detail.product);
  return (
    <div className="grid gap-3">
      <p className={cx("pr-md", T.muted)}>{t(C.upcomingNote)}</p>
      <button type="button" onClick={toggle} aria-pressed={saved} className={btn(saved ? "outline" : T.primary, "lg", "w-full")} data-testid="remind-button">
        <BellRing aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        {saved ? ui("watching") : ui("remindMe")}
      </button>
    </div>
  );
}

function Closed({ detail, tone }) {
  const { ui } = useLang();
  const T = TONES[tone];
  const winner = useWinner(detail);
  return (
    <div className="grid gap-3">
      {winner ? (
        <p className={cx("pr-md", T.muted)}>
          {winner.label}: <span className={cx("font-semibold", T.label)}>{winner.name}</span>
        </p>
      ) : null}
      <button type="button" disabled className={btn(T.primary, "lg", "w-full")} data-testid="place-bid">
        <Gavel aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        {ui("placeBid")}
      </button>
      <a href="#similar-auctions" className={cx("pr-link pr-md inline-flex items-center justify-center gap-1.5 font-semibold", T.link)}>
        {ui("similarAuctions")}
      </a>
    </div>
  );
}

/** Price, bids · bidders · watching and the market comparison, on charcoal. */
function PriceHead({ detail }) {
  const { ui, pl } = useLang();
  const { product, auction, upcoming, priceLabel, price } = detail;
  const saving = marketSaving(product, auction.currentBid);
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <p className="pr-xs text-white/75">{priceLabel}</p>
          <Money key={auction.flash} value={price} className={cx("-mx-1 rounded-[3px] px-1 text-[30px] font-bold leading-9 tracking-[-0.01em] text-white dt:text-[34px] dt:leading-10", auction.flash ? "kz-flash" : "")} symbolClassName="text-[0.7em]" />
        </div>
        {upcoming ? null : (
          <p className="pb-1 pr-xs text-white/75">
            {pl("bids", auction.bidCount)} · {pl("bidders", auction.bidderCount)}
          </p>
        )}
      </div>
      {product.marketPrice ? (
        <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5 pr-xs text-white/75">
          {ui("marketPrice")} <Money value={product.marketPrice} className="font-semibold text-white" />
          {saving > 0 ? <span className="font-semibold text-[#e6cd96]">· {ui("belowMarket", { pct: saving })}</span> : null}
        </p>
      ) : null}
    </div>
  );
}

/** The charcoal bid panel. `compact` (phones) keeps price, status and one action that opens the sheet. */
export function BidPanel({ detail, compact = false }) {
  const { t, ui } = useLang();
  const { upcoming, closed } = detail;
  let action;
  if (upcoming) action = <Upcoming detail={detail} tone="dark" />;
  else if (closed) action = <Closed detail={detail} tone="dark" />;
  else if (compact) {
    action = (
      <button type="button" onClick={detail.sheet.show} className={btn("brass", "lg", "w-full font-semibold")} data-testid="open-bid-sheet">
        <Gavel aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
        {ui("placeBid")}
      </button>
    );
  } else action = <BidForm detail={detail} tone="dark" testId="place-bid" />;

  return (
    <section aria-label={t(C.bidPanel)} className="grid gap-4 rounded-[6px] bg-[var(--pr-charcoal)] p-5 text-white dt:p-6">
      <PriceHead detail={detail} />
      <Banner detail={detail} tone="dark" />
      {action}
      {detail.open && !compact ? <MaxBid auction={detail.auction} tone="dark" /> : null}
      {!closed && !compact ? <Notes auction={detail.auction} tone="dark" /> : null}
    </section>
  );
}

/** Buy Now for dual lots: one quiet line under the panel, never level with bidding. */
export function BuyNowLine({ detail }) {
  const { ui } = useLang();
  const { product, buyNow } = detail;
  return (
    <div className="border-t border-line pt-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="min-w-0">
          <span className="block pr-kicker text-fg-2">{ui("orBuyNow")}</span>
          <Money value={product.buyNowPrice} className="pr-price-sm text-fg" symbolClassName="text-[0.78em]" />
        </p>
        <button type="button" onClick={buyNow.show} disabled={!buyNow.available} className={btn("outline", "md", "px-5")} data-testid="buy-now">
          {ui("buyItNow")}
        </button>
      </div>
      <p className="mt-1.5 pr-xs text-fg-2">{ui("buyNowClosesAuction")}</p>
    </div>
  );
}

/** Phones: ivory bar fixed at the foot — price, red clock and Bid now (Watch while upcoming). */
export function PhoneBar({ detail }) {
  const { ui, lang } = useLang();
  const { product, auction, upcoming, closed, priceLabel, price } = detail;
  const { saved, toggle } = useSaveToggle(product);
  const clock = useAuctionClock(auction);
  const barRef = useToastClearance();
  return (
    <div ref={barRef} className="fixed inset-x-0 bottom-0 z-30 border-t border-[#d3cfc6] bg-[#f8f7f3]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="pr-container flex h-[72px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate pr-xs text-fg-2">{priceLabel}</p>
          <p className="flex flex-wrap items-baseline gap-x-2">
            <Money key={auction.flash} value={price} className={cx("pr-price-sm text-fg", auction.flash ? "kz-flash rounded-[3px]" : "")} symbolClassName="text-[0.78em]" />
            {clock.closed ? null : (
              <span className={cx("pr-xs font-bold tabular", upcoming ? "text-fg" : "text-[var(--pr-timer)]")} dir={lang === "ar" ? "rtl" : "ltr"}>
                <span className="sr-only">{clock.label} </span>
                {countdownText(clock.seconds ?? 0, lang)}
              </span>
            )}
          </p>
        </div>
        {upcoming ? (
          <button type="button" onClick={toggle} aria-pressed={saved} className={btn(saved ? "outline" : "charcoal", "md", "px-5")}>
            <BellRing aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
            {saved ? ui("watching") : ui("remindMe")}
          </button>
        ) : (
          <button type="button" onClick={detail.sheet.show} disabled={closed} className={btn("charcoal", "md", "px-6")} data-testid="mobile-bid">
            <Gavel aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
            {closed ? ui(auction.phase === "sold" ? "sold" : "ended") : ui("bidNow")}
          </button>
        )}
      </div>
    </div>
  );
}

/** Bid sheet (phones; a dialog from 768 px): the full form, maximum bid and notes on ivory. */
export function BidSheet({ detail, info }) {
  const { t, ui } = useLang();
  const titleId = useId();
  const { auction, sheet, priceLabel, price } = detail;
  return (
    <Modal open={sheet.open} onClose={sheet.close} variant="sheet" labelledBy={titleId} panelClassName="rounded-t-[8px] bg-[var(--bg)] text-fg shadow-overlay md:rounded-[6px]">
      <div data-testid="bid-sheet">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <h2 id={titleId} className="pr-lg font-semibold">
            {t(C.bidSheetTitle)}
          </h2>
          <button type="button" onClick={sheet.close} aria-label={ui("close")} className="grid size-10 place-items-center rounded-[4px] hover:bg-[var(--pr-stone)]">
            <X aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </button>
        </div>
        <div className="grid gap-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="line-clamp-1 pr-sm text-fg-2">{info.title}</p>
              <p className="pr-xs text-fg-2">{priceLabel}</p>
              <Money key={auction.flash} value={price} className="pr-price text-fg" symbolClassName="text-[0.78em]" />
            </div>
            <ClockLine auction={auction} className="pr-sm" />
          </div>
          <Banner detail={detail} tone="light" announce={false} />
          {detail.open ? (
            <>
              <BidForm detail={detail} tone="light" testId="sheet-place-bid" />
              <MaxBid auction={auction} tone="light" />
              <Notes auction={auction} tone="light" />
            </>
          ) : (
            <p className="pr-md text-fg-2">{ui("auctionEnded")}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
