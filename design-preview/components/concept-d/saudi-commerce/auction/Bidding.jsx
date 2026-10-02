"use client";

// Contemporary Saudi bidding: a practical framed panel with a sage head
// (status tag and the red clock), the price and figures, the bidder's
// status, a square-stepped amount field, quick bids and the green Place bid,
// the maximum bid on sage, notes, and Buy Now under a rule. Phones get a
// short panel, a white bid bar and the bid sheet. Behaviour comes from the
// shared auction hooks.
import { useId } from "react";
import { BellRing, CalendarClock, ChevronDown, CircleAlert, CircleCheck, Clock3, Gavel, Info, Minus, Plus, Repeat, ShieldCheck, Trophy, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useAuctionClock, useBidForm, useBidderStatus, useMaxBid, usePhaseLabel, useToastClearance, useWinner } from "@/components/shared/auction/hooks";
import { countdownText, useSaveToggle } from "@/components/shared/r3/home";
import { Modal } from "@/components/shared/ui/Modal";
import { Money } from "@/components/shared/ui/Money";
import { marketSaving } from "@/lib/catalog";
import { RIYAL, formatNumber } from "@/lib/format";
import { btn, cx } from "../ui";

const STATUS = {
  highest: { box: "border-[#b7dccd] bg-[#e7f5ef] text-[var(--sc-grade-a)]", icon: CircleCheck },
  won: { box: "border-[#b7dccd] bg-[#e7f5ef] text-[var(--sc-grade-a)]", icon: Trophy },
  bought: { box: "border-[#b7dccd] bg-[#e7f5ef] text-[var(--sc-grade-a)]", icon: Trophy },
  outbid: { box: "border-[#f0d3a8] bg-[#fff6e6] text-[var(--sc-grade-b)]", icon: CircleAlert },
  lost: { box: "border-[#f2c4c2] bg-[#fdeeed] text-[var(--sc-grade-c)]", icon: CircleAlert },
  closed: { box: "border-[var(--sc-line)] bg-[var(--sc-panel)] text-[var(--sc-ink)]", icon: Info },
};

/** Red clock with the time left (ink while upcoming); one spoken phrase. */
export function ClockText({ auction, className = "" }) {
  const { ui, lang } = useLang();
  const clock = useAuctionClock(auction);
  if (clock.closed) return <p className={cx("sc-md font-semibold text-[var(--sc-muted)]", className)}>{ui(auction.phase === "sold" ? "sold" : "ended")}</p>;
  const Icon = clock.upcoming ? CalendarClock : Clock3;
  return (
    <p className={cx("flex flex-wrap items-center gap-x-2 font-semibold", clock.upcoming ? "text-[var(--sc-ink)]" : "text-[var(--sc-red)]", className)}>
      <Icon aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={2.2} />
      <span className="sr-only">{clock.spoken}</span>
      <span aria-hidden="true" className="font-medium text-[var(--sc-muted)]">
        {clock.label}
      </span>
      <span aria-hidden="true" className="tabular" dir={lang === "ar" ? "rtl" : "ltr"}>
        {countdownText(clock.seconds ?? 0, lang)}
      </span>
      {clock.extended ? <span className="rounded-[5px] bg-white px-1.5 py-0.5 sc-xs font-semibold text-[var(--sc-ink)]">{ui("timeExtended")}</span> : null}
    </p>
  );
}

function Status({ detail, announce = true }) {
  const status = useBidderStatus(detail);
  const style = status.kind ? STATUS[status.kind] : null;
  return (
    <>
      {announce ? (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {status.spoken}
        </p>
      ) : null}
      {style ? (
        <div aria-hidden={announce ? "true" : undefined} className={cx("kz-fade-up flex items-start gap-2.5 rounded-[7px] border px-3 py-2.5", style.box)}>
          <style.icon aria-hidden="true" className="mt-0.5 size-[18px] shrink-0" strokeWidth={2} />
          <div className="min-w-0 sc-md">
            <p className="font-semibold">{status.title}</p>
            {status.label ? (
              <p className="flex flex-wrap items-baseline gap-x-1.5 text-[var(--sc-ink)]">
                {status.label}
                <Money value={status.amount} className="font-semibold" />
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Amount field with square −/+ (one increment), quick bids and the green Place bid. */
function BidForm({ detail, testId }) {
  const { ui } = useLang();
  const form = useBidForm(detail.auction, detail.requestBid);
  const step = "grid w-12 shrink-0 place-items-center bg-[var(--sc-soft)] text-[var(--sc-green)] transition-colors hover:bg-[#dfece5] disabled:opacity-40";
  return (
    <div className="grid gap-3">
      <div>
        <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3">
          <label htmlFor={form.id} className="sc-md font-semibold text-[var(--sc-ink)]">
            {ui("yourBid")}
          </label>
          <span id={form.hintId} className="sc-sm text-[var(--sc-muted)]">
            {ui("nextMinBid")} <Money value={form.minNext} className="font-semibold text-[var(--sc-ink)]" />
          </span>
        </div>
        <div className={cx("flex h-12 overflow-hidden rounded-[7px] border bg-white focus-within:border-[var(--sc-green)] focus-within:ring-2 focus-within:ring-[var(--sc-green)]/25", form.error ? "border-[var(--sc-red)]" : "border-[#cfdcd7]")}>
          <button type="button" onClick={form.lower} disabled={!form.canLower} aria-label={form.lowerLabel} className={cx(step, "border-e border-[#cfdcd7]")}>
            <Minus aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
          </button>
          <div dir="ltr" className="flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2">
            <span aria-hidden="true" className="text-[18px] font-semibold text-[var(--sc-muted)]">
              {RIYAL}
            </span>
            <input {...form.inputProps} className="sc-no-spin w-full min-w-0 bg-transparent text-center text-[21px] font-bold tabular text-[var(--sc-ink)] outline-none" />
          </div>
          <button type="button" onClick={form.raise} aria-label={form.raiseLabel} className={cx(step, "border-s border-[#cfdcd7]")}>
            <Plus aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
          </button>
        </div>
        {form.error ? (
          <p id={form.errorId} role="alert" className="mt-1.5 flex items-center gap-1.5 sc-sm font-semibold text-[var(--sc-red)]">
            <CircleAlert aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
            {form.error}
          </p>
        ) : null}
      </div>
      <div role="group" aria-label={ui("quickBid")}>
        <p aria-hidden="true" className="mb-1.5 sc-sm text-[var(--sc-muted)]">
          {ui("quickBid")}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {form.quickBids.map((bid) => (
            <button
              key={bid}
              type="button"
              onClick={() => form.quick(bid)}
              aria-label={form.quickLabel(bid)}
              className={cx("h-11 rounded-[7px] border sc-md font-semibold tabular transition-colors", form.value === bid ? "border-[var(--sc-green)] bg-[var(--sc-soft)] text-[var(--sc-green)]" : "border-[#cfdcd7] bg-white text-[var(--sc-ink)] hover:border-[var(--sc-green)]")}
            >
              <span dir="ltr">
                {RIYAL} {formatNumber(bid)}
              </span>
            </button>
          ))}
        </div>
      </div>
      <button type="button" onClick={form.submit} className={btn("green", "lg", "h-[52px] w-full dt:text-[17px]")} data-testid={testId}>
        <Gavel aria-hidden="true" className="size-5" strokeWidth={1.9} />
        {ui("placeBid")}
        {form.valid ? (
          <>
            <span aria-hidden="true">·</span>
            <Money value={form.value} className="opacity-90" />
          </>
        ) : null}
      </button>
    </div>
  );
}

function MaxBid({ auction }) {
  const { ui } = useLang();
  const max = useMaxBid(auction);
  return (
    <div className="overflow-hidden rounded-[7px] border border-[var(--sc-line)]">
      <button type="button" aria-expanded={max.open} aria-controls={max.panelId} onClick={max.toggle} className="flex w-full items-center gap-2.5 bg-[var(--sc-soft)] px-3.5 py-3 text-start sc-md font-semibold text-[var(--sc-ink)] transition-colors hover:bg-[#e3efe8]">
        <Repeat aria-hidden="true" className="size-[18px] shrink-0 text-[var(--sc-green)]" strokeWidth={2} />
        <span className="flex-1">{ui("setMaxBid")}</span>
        {max.myMax ? <Money value={max.myMax} className="sc-sm font-semibold text-[var(--sc-green)]" /> : null}
        <ChevronDown aria-hidden="true" className={cx("size-4 shrink-0 transition-transform", max.open && "rotate-180")} />
      </button>
      <div id={max.panelId} hidden={!max.open} className="border-t border-[var(--sc-line)] p-3.5">
        <p className="sc-sm text-[var(--sc-muted)]">{ui("maxBidExplain")}</p>
        {max.myMax ? (
          <p className="mt-2.5 flex items-center justify-between gap-3 rounded-[6px] bg-[var(--sc-soft)] px-3 py-2 sc-sm text-[var(--sc-ink)]">
            <span>
              {ui("yourMaxBid")} <Money value={max.myMax} className="font-semibold" />
            </span>
            <button type="button" onClick={max.clear} className="sc-link font-semibold text-[var(--sc-link)]">
              {ui("clearMaxBid")}
            </button>
          </p>
        ) : null}
        <label htmlFor={max.inputId} className="sr-only">
          {ui("maxBid")}
        </label>
        <div className="mt-2.5 flex gap-2">
          <div dir="ltr" className={cx("flex h-11 min-w-0 flex-1 items-center gap-1.5 rounded-[7px] border bg-white px-3 focus-within:border-[var(--sc-green)]", max.error ? "border-[var(--sc-red)]" : "border-[#cfdcd7]")}>
            <span aria-hidden="true" className="font-semibold text-[var(--sc-muted)]">
              {RIYAL}
            </span>
            <input {...max.inputProps} className="sc-no-spin min-w-0 flex-1 bg-transparent sc-md font-semibold tabular text-[var(--sc-ink)] outline-none placeholder:font-normal placeholder:text-[#6b7686]" />
          </div>
          <button type="button" onClick={max.save} className={btn("outline", "md")}>
            {ui("saveMaxBid")}
          </button>
        </div>
        {max.error ? (
          <p id={max.errorId} role="alert" className="mt-1.5 sc-sm font-semibold text-[var(--sc-red)]">
            {max.error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Notes({ auction }) {
  const { ui } = useLang();
  return (
    <ul className="grid gap-1.5 sc-sm text-[var(--sc-muted)]">
      <li className="flex items-start gap-2">
        <ShieldCheck aria-hidden="true" className="mt-px size-4 shrink-0 text-[var(--sc-green)]" strokeWidth={2} />
        <span>
          {ui("depositCovered")} · {ui("walletBalance")} <Money value={auction.deposit.walletBalance} className="font-semibold text-[var(--sc-ink)]" />
        </span>
      </li>
      <li className="flex items-start gap-2">
        <Info aria-hidden="true" className="mt-px size-4 shrink-0 text-[var(--sc-link)]" strokeWidth={2} />
        <span>{ui("antiSnipe")}</span>
      </li>
    </ul>
  );
}

function Upcoming({ detail }) {
  const { t, ui } = useLang();
  const { saved, toggle } = useSaveToggle(detail.product);
  return (
    <div className="grid gap-3">
      <p className="rounded-[7px] bg-[var(--sc-soft)] px-3.5 py-3 sc-md text-[var(--sc-ink)]">{t(C.upcomingNote)}</p>
      <button type="button" onClick={toggle} aria-pressed={saved} className={btn(saved ? "outline" : "green", "lg", "h-[52px] w-full")} data-testid="remind-button">
        <BellRing aria-hidden="true" className="size-5" strokeWidth={1.9} />
        {saved ? ui("watching") : ui("remindMe")}
      </button>
    </div>
  );
}

function Closed({ detail }) {
  const { ui } = useLang();
  const winner = useWinner(detail);
  return (
    <div className="grid gap-3">
      {winner ? (
        <p className="flex items-center gap-2 sc-md text-[var(--sc-muted)]">
          <Trophy aria-hidden="true" className="size-[18px] shrink-0 text-[var(--sc-green)]" strokeWidth={2} />
          {winner.label}: <span className="font-semibold text-[var(--sc-ink)]">{winner.name}</span>
        </p>
      ) : null}
      <button type="button" disabled className={btn("green", "lg", "h-[52px] w-full")} data-testid="place-bid">
        <Gavel aria-hidden="true" className="size-5" strokeWidth={1.9} />
        {ui("placeBid")}
      </button>
      <a href="#similar-auctions" className={btn("outline", "md", "w-full")}>
        {ui("similarAuctions")}
      </a>
    </div>
  );
}

/** Price, bids · bidders · watching and the market comparison. */
function PriceBlock({ detail, compact }) {
  const { ui, pl } = useLang();
  const { product, auction, upcoming, priceLabel, price } = detail;
  const saving = marketSaving(product, auction.currentBid);
  return (
    <div>
      <p className="sc-md text-[var(--sc-muted)]">{priceLabel}</p>
      <Money key={auction.flash} value={price} className={cx("-mx-1 rounded-[5px] px-1 font-bold tracking-[-0.01em] text-[var(--sc-ink)]", compact ? "text-[28px] leading-9" : "text-[32px] leading-10 dt:text-[36px] dt:leading-[44px]", auction.flash ? "kz-flash" : "")} symbolClassName="text-[0.66em]" />
      {upcoming ? null : (
        <p className="mt-1 sc-md text-[var(--sc-muted)]">
          {pl("bids", auction.bidCount)} · {pl("bidders", auction.bidderCount)} · {pl("watching", auction.watchers)}
        </p>
      )}
      {product.marketPrice ? (
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2 sc-sm text-[var(--sc-muted)]">
          {ui("marketPrice")} <Money value={product.marketPrice} className="font-semibold text-[var(--sc-ink)]" />
          {saving > 0 ? <span className="font-semibold text-[var(--sc-green)]">{ui("belowMarket", { pct: saving })}</span> : null}
        </p>
      ) : null}
    </div>
  );
}

const TAG = { live: "bg-[var(--sc-green)] text-white", urgent: "bg-[var(--sc-green)] text-white", critical: "bg-[var(--sc-green)] text-white", upcoming: "bg-white text-[var(--sc-ink)] ring-1 ring-inset ring-[var(--sc-line)]", ended: "bg-[var(--sc-ink)] text-white", sold: "bg-[var(--sc-ink)] text-white" };

/** The framed bid panel. `compact` (phones) keeps price, status and one action that opens the sheet. */
export function BidPanel({ detail, compact = false }) {
  const { t, ui } = useLang();
  const { product, auction, upcoming, closed } = detail;
  const label = usePhaseLabel(auction.phase);
  let action;
  if (upcoming) action = <Upcoming detail={detail} />;
  else if (closed) action = <Closed detail={detail} />;
  else if (compact) {
    action = (
      <button type="button" onClick={detail.sheet.show} className={btn("green", "lg", "h-[52px] w-full")} data-testid="open-bid-sheet">
        <Gavel aria-hidden="true" className="size-5" strokeWidth={1.9} />
        {ui("placeBid")}
      </button>
    );
  } else action = <BidForm detail={detail} testId="place-bid" />;

  return (
    <section aria-label={t(C.bidPanel)} className="overflow-hidden rounded-[9px] border border-[var(--sc-line)] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-[var(--sc-soft)] px-4 py-3 dt:px-5">
        <span className={cx("inline-flex h-[26px] items-center gap-1.5 rounded-[6px] px-2.5 sc-sm font-semibold", TAG[auction.phase] || TAG.live)}>
          <Gavel aria-hidden="true" className="size-3.5" strokeWidth={2} />
          {label}
        </span>
        {closed ? null : <ClockText auction={auction} className="rounded-[6px] bg-white px-2.5 py-1 sc-md" />}
      </div>
      <div className={cx("grid p-4 dt:p-5", compact ? "gap-3" : "gap-4")}>
        <PriceBlock detail={detail} compact={compact} />
        <Status detail={detail} />
        {action}
        {detail.open && !compact ? <MaxBid auction={auction} /> : null}
        {!closed && !compact ? <Notes auction={auction} /> : null}
        {detail.dual ? <BuyNowRow detail={detail} product={product} /> : null}
      </div>
    </section>
  );
}

/** Buy Now on dual lots: under a rule at the foot of the panel, an outlined second choice. */
function BuyNowRow({ detail, product }) {
  const { ui } = useLang();
  const { buyNow } = detail;
  return (
    <div className="border-t border-[var(--sc-line)] pt-4">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="min-w-0">
          <span className="block sc-sm text-[var(--sc-muted)]">{ui("orBuyNow")}</span>
          <Money value={product.buyNowPrice} className="text-[20px] font-bold leading-7 text-[var(--sc-ink)]" symbolClassName="text-[0.7em]" />
        </p>
        <button type="button" onClick={buyNow.show} disabled={!buyNow.available} className={btn("outline", "sm", "px-4")} data-testid="buy-now">
          {ui("buyItNow")}
        </button>
      </div>
      <p className="mt-1.5 sc-sm text-[var(--sc-muted)]">{ui("buyNowClosesAuction")}</p>
    </div>
  );
}

/** Phones: a white bar fixed at the foot — price, red clock and the green Bid now (Watch while upcoming). */
export function PhoneBar({ detail }) {
  const { ui, lang } = useLang();
  const { product, auction, upcoming, closed, priceLabel, price } = detail;
  const { saved, toggle } = useSaveToggle(product);
  const clock = useAuctionClock(auction);
  const barRef = useToastClearance();
  return (
    <div ref={barRef} className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--sc-line)] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-20px_rgb(16_33_57/0.45)] backdrop-blur-md md:hidden">
      <div className="sc-container flex h-[74px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate sc-sm text-[var(--sc-muted)]">{priceLabel}</p>
          <Money key={auction.flash} value={price} className={cx("text-[20px] font-bold leading-7 text-[var(--sc-ink)]", auction.flash ? "kz-flash rounded-[5px]" : "")} symbolClassName="text-[0.7em]" />
        </div>
        {clock.closed ? null : (
          <span className={cx("inline-flex shrink-0 items-center gap-1 sc-sm font-semibold tabular", upcoming ? "text-[var(--sc-ink)]" : "text-[var(--sc-red)]")} dir={lang === "ar" ? "rtl" : "ltr"}>
            <Clock3 aria-hidden="true" className="size-4" strokeWidth={2.2} />
            <span className="sr-only">{clock.label} </span>
            {countdownText(clock.seconds ?? 0, lang)}
          </span>
        )}
        {upcoming ? (
          <button type="button" onClick={toggle} aria-pressed={saved} className={btn(saved ? "outline" : "green", "md", "px-4")}>
            <BellRing aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
            {saved ? ui("watching") : ui("remindMe")}
          </button>
        ) : (
          <button type="button" onClick={detail.sheet.show} disabled={closed} className={btn("green", "md", "px-5")} data-testid="mobile-bid">
            <Gavel aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
            {closed ? ui(auction.phase === "sold" ? "sold" : "ended") : ui("bidNow")}
          </button>
        )}
      </div>
    </div>
  );
}

/** Bid sheet (phones; a dialog from 768 px) with the full form, maximum bid and notes. */
export function BidSheet({ detail, info }) {
  const { t, ui } = useLang();
  const titleId = useId();
  const { auction, sheet } = detail;
  return (
    <Modal open={sheet.open} onClose={sheet.close} variant="sheet" labelledBy={titleId} panelClassName="rounded-t-[14px] bg-white text-[var(--sc-ink)] shadow-overlay md:rounded-[12px]">
      <div data-testid="bid-sheet">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--sc-line)] bg-[var(--sc-soft)] px-5 py-3">
          <div className="min-w-0">
            <h2 id={titleId} className="sc-lg font-semibold">
              {t(C.bidSheetTitle)}
            </h2>
            <p className="line-clamp-1 sc-sm text-[var(--sc-muted)]">{info.title}</p>
          </div>
          <button type="button" onClick={sheet.close} aria-label={ui("close")} className="grid size-10 shrink-0 place-items-center rounded-[7px] text-[var(--sc-ink)] hover:bg-white">
            <X aria-hidden="true" className="size-5" strokeWidth={2} />
          </button>
        </div>
        <div className="grid gap-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <PriceBlock detail={detail} compact />
          </div>
          <ClockText auction={auction} className="sc-md" />
          <Status detail={detail} announce={false} />
          {detail.open ? (
            <>
              <BidForm detail={detail} testId="sheet-place-bid" />
              <MaxBid auction={auction} />
              <Notes auction={auction} />
            </>
          ) : (
            <p className="sc-md text-[var(--sc-muted)]">{ui("auctionEnded")}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
