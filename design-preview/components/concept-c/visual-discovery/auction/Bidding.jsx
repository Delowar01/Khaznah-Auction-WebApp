"use client";

// Visual Discovery bidding: a rounded white bid card with chips for the
// figures, a pill amount field with round −/+, pale quick-bid pills and the
// indigo Place bid pill; Buy Now as a soft row beneath. Phones get a short
// card, a floating navy pill bar and the bid sheet. Behaviour comes from the
// shared auction hooks.
import { useId } from "react";
import { BellRing, ChevronDown, CircleAlert, CircleCheck, Clock3, Gavel, Info, Minus, Plus, Repeat, ShieldCheck, TrendingDown, Trophy, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useAuctionClock, useBidForm, useBidderStatus, useMaxBid, useWinner } from "@/components/shared/auction/hooks";
import { countdownText, useSaveToggle } from "@/components/shared/r3/home";
import { Modal } from "@/components/shared/ui/Modal";
import { Money } from "@/components/shared/ui/Money";
import { marketSaving } from "@/lib/catalog";
import { RIYAL, formatNumber } from "@/lib/format";
import { btn, cx } from "../ui";

const STATUS = {
  highest: { box: "bg-[#ddf4e6] text-[var(--vd-grade-a)]", icon: CircleCheck },
  won: { box: "bg-[#ddf4e6] text-[var(--vd-grade-a)]", icon: Trophy },
  bought: { box: "bg-[#ddf4e6] text-[var(--vd-grade-a)]", icon: Trophy },
  outbid: { box: "bg-[#ffe4d6] text-[#a8401a]", icon: CircleAlert },
  lost: { box: "bg-[#fbe0e5] text-[var(--vd-guide-pink)]", icon: CircleAlert },
  closed: { box: "bg-[var(--vd-bluegray)] text-[var(--vd-ink)]", icon: Info },
};

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
        <div aria-hidden={announce ? "true" : undefined} className={cx("kz-fade-up flex items-start gap-2.5 rounded-[16px] px-4 py-3", style.box)}>
          <style.icon aria-hidden="true" className="mt-0.5 size-[18px] shrink-0" strokeWidth={2.2} />
          <div className="min-w-0 vd-md">
            <p className="font-bold">{status.title}</p>
            {status.label ? (
              <p className="flex flex-wrap items-baseline gap-x-1.5 text-[var(--vd-ink)]">
                {status.label}
                <Money value={status.amount} className="font-bold" />
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Amount pill with round −/+ (one increment), quick-bid pills and Place bid; valid amounts go to the confirm step. */
function BidForm({ detail, testId }) {
  const { ui } = useLang();
  const form = useBidForm(detail.auction, detail.requestBid);
  return (
    <div className="grid gap-3">
      <div>
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 px-1">
          <label htmlFor={form.id} className="vd-md font-bold text-[var(--vd-ink)]">
            {ui("yourBid")}
          </label>
          <span id={form.hintId} className="vd-sm text-[var(--vd-muted)]">
            {ui("nextMinBid")} <Money value={form.minNext} className="font-bold text-[var(--vd-ink)]" />
          </span>
        </div>
        <div
          className={cx(
            "flex h-14 items-center gap-2 rounded-full border-[1.5px] bg-white p-1.5 focus-within:border-[var(--vd-indigo)] focus-within:ring-4 focus-within:ring-[var(--vd-indigo)]/15",
            form.error ? "border-[var(--vd-live)]" : "border-[#cfdaea]",
          )}
        >
          <button type="button" onClick={form.lower} disabled={!form.canLower} aria-label={form.lowerLabel} className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)] transition-colors hover:bg-[#dfe7f3] disabled:opacity-40">
            <Minus aria-hidden="true" className="size-[18px]" strokeWidth={2.4} />
          </button>
          <div dir="ltr" className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
            <span aria-hidden="true" className="text-[19px] font-bold text-[var(--vd-muted)]">
              {RIYAL}
            </span>
            <input {...form.inputProps} className="vd-no-spin w-full min-w-0 bg-transparent text-center vd-display text-[22px] font-extrabold tabular text-[var(--vd-ink)] outline-none" />
          </div>
          <button type="button" onClick={form.raise} aria-label={form.raiseLabel} className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)] transition-colors hover:bg-[#dfe7f3]">
            <Plus aria-hidden="true" className="size-[18px]" strokeWidth={2.4} />
          </button>
        </div>
        {form.error ? (
          <p id={form.errorId} role="alert" className="mt-2 px-1 vd-sm font-semibold text-[var(--vd-live)]">
            {form.error}
          </p>
        ) : null}
      </div>
      <div role="group" aria-label={ui("quickBid")} className="flex flex-wrap gap-2">
        {form.quickBids.map((bid) => (
          <button
            key={bid}
            type="button"
            onClick={() => form.quick(bid)}
            aria-label={form.quickLabel(bid)}
            className={cx("h-10 flex-1 rounded-full px-3 vd-sm font-bold tabular transition-colors", form.value === bid ? "bg-[var(--vd-indigo)] text-white" : "bg-[var(--vd-bluegray)] text-[var(--vd-indigo)] hover:bg-[#dfe7f3]")}
          >
            <span dir="ltr">
              {RIYAL} {formatNumber(bid)}
            </span>
          </button>
        ))}
      </div>
      <button type="button" onClick={form.submit} className={btn("indigo", "lg", "h-14 w-full vd-lg")} data-testid={testId}>
        <Gavel aria-hidden="true" className="size-5" strokeWidth={2.1} />
        {ui("placeBid")}
        {form.valid ? (
          <>
            <span aria-hidden="true">·</span>
            <Money value={form.value} className="opacity-85" />
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
    <div className="rounded-[18px] bg-[var(--vd-bluegray)]/60">
      <button type="button" aria-expanded={max.open} aria-controls={max.panelId} onClick={max.toggle} className="flex w-full items-center gap-2.5 rounded-[18px] px-4 py-3 text-start vd-md font-semibold text-[var(--vd-ink)]">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-[var(--vd-indigo)]">
          <Repeat aria-hidden="true" className="size-4" strokeWidth={2.2} />
        </span>
        <span className="flex-1">{ui("setMaxBid")}</span>
        {max.myMax ? <Money value={max.myMax} className="rounded-full bg-white px-2.5 py-0.5 vd-sm font-bold text-[var(--vd-indigo)]" /> : null}
        <ChevronDown aria-hidden="true" className={cx("size-4 shrink-0 text-[var(--vd-muted)] transition-transform", max.open && "rotate-180")} />
      </button>
      <div id={max.panelId} hidden={!max.open} className="px-4 pb-4">
        <p className="vd-sm text-[var(--vd-muted)]">{ui("maxBidExplain")}</p>
        {max.myMax ? (
          <p className="mt-2.5 flex items-center justify-between gap-3 rounded-full bg-white px-4 py-2 vd-sm text-[var(--vd-ink)]">
            <span>
              {ui("yourMaxBid")} <Money value={max.myMax} className="font-bold" />
            </span>
            <button type="button" onClick={max.clear} className="vd-link font-semibold text-[var(--vd-indigo)]">
              {ui("clearMaxBid")}
            </button>
          </p>
        ) : null}
        <label htmlFor={max.inputId} className="sr-only">
          {ui("maxBid")}
        </label>
        <div className="mt-2.5 flex gap-2">
          <div dir="ltr" className={cx("flex h-11 min-w-0 flex-1 items-center gap-1.5 rounded-full border-[1.5px] bg-white px-4 focus-within:border-[var(--vd-indigo)]", max.error ? "border-[var(--vd-live)]" : "border-[#cfdaea]")}>
            <span aria-hidden="true" className="font-bold text-[var(--vd-muted)]">
              {RIYAL}
            </span>
            <input {...max.inputProps} className="vd-no-spin min-w-0 flex-1 bg-transparent vd-md font-bold tabular text-[var(--vd-ink)] outline-none placeholder:font-normal placeholder:text-[#66769c]" />
          </div>
          <button type="button" onClick={max.save} className={btn("navy", "md", "h-11")}>
            {ui("saveMaxBid")}
          </button>
        </div>
        {max.error ? (
          <p id={max.errorId} role="alert" className="mt-2 vd-sm font-semibold text-[var(--vd-live)]">
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
    <ul className="grid gap-1.5 px-1 vd-sm text-[var(--vd-muted)]">
      <li className="flex items-start gap-2">
        <ShieldCheck aria-hidden="true" className="mt-px size-4 shrink-0 text-[var(--vd-grade-a)]" strokeWidth={2} />
        <span>
          {ui("depositCovered")} · {ui("walletBalance")} <Money value={auction.deposit.walletBalance} className="font-semibold text-[var(--vd-ink)]" />
        </span>
      </li>
      <li className="flex items-start gap-2">
        <Info aria-hidden="true" className="mt-px size-4 shrink-0 text-[var(--vd-indigo)]" strokeWidth={2} />
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
      <p className="rounded-[16px] bg-[var(--vd-bluegray)] px-4 py-3 vd-md text-[var(--vd-ink)]">{t(C.upcomingNote)}</p>
      <button type="button" onClick={toggle} aria-pressed={saved} className={btn(saved ? "outline" : "navy", "lg", "h-14 w-full vd-lg")} data-testid="remind-button">
        <BellRing aria-hidden="true" className="size-5" strokeWidth={2.1} />
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
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--vd-bluegray)] px-3.5 py-1.5 vd-sm text-[var(--vd-ink)]">
          <Trophy aria-hidden="true" className="size-4 text-[var(--vd-gold-hover)]" strokeWidth={2.2} />
          {winner.label}: <span className="font-bold">{winner.name}</span>
        </p>
      ) : null}
      <button type="button" disabled className={btn("indigo", "lg", "h-14 w-full vd-lg")} data-testid="place-bid">
        <Gavel aria-hidden="true" className="size-5" strokeWidth={2.1} />
        {ui("placeBid")}
      </button>
      <a href="#similar-auctions" className={btn("outline", "lg", "h-12 w-full")}>
        {ui("similarAuctions")}
      </a>
    </div>
  );
}

/** The time left as a small coral pill (navy while upcoming); nothing once closed. */
function ClockPill({ auction }) {
  const { lang } = useLang();
  const clock = useAuctionClock(auction);
  if (clock.closed) return null;
  return (
    <span className={cx("inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 vd-sm font-bold text-white", clock.upcoming ? "bg-[var(--vd-navy)]" : "bg-[var(--vd-coral)]")}>
      <Clock3 aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.4} />
      <span className="sr-only">{clock.spoken}</span>
      <span aria-hidden="true" className="tabular" dir={lang === "ar" ? "rtl" : "ltr"}>
        {countdownText(clock.seconds ?? 0, lang)}
      </span>
    </span>
  );
}

/** Price with chips for bids, bidders and watchers, and the market saving. */
function PriceHead({ detail, compact }) {
  const { ui, pl } = useLang();
  const { product, auction, upcoming, priceLabel, price } = detail;
  const saving = marketSaving(product, auction.currentBid);
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="vd-sm text-[var(--vd-muted)]">{priceLabel}</p>
        <ClockPill auction={auction} />
      </div>
      <Money key={auction.flash} value={price} className={cx("-mx-1 rounded-[8px] px-1 vd-display font-extrabold tracking-[-0.02em] text-[var(--vd-ink)]", compact ? "text-[30px] leading-9" : "text-[34px] leading-10 dt:text-[40px] dt:leading-[46px]", auction.flash ? "kz-flash" : "")} symbolClassName="text-[0.66em]" />
      {upcoming ? null : (
        <ul className="mt-2.5 flex flex-wrap gap-1.5 vd-sm font-semibold text-[var(--vd-indigo)]">
          <li className="rounded-full bg-[var(--vd-bluegray)] px-3 py-1">{pl("bids", auction.bidCount)}</li>
          <li className="rounded-full bg-[var(--vd-bluegray)] px-3 py-1">{pl("bidders", auction.bidderCount)}</li>
          <li className="rounded-full bg-[var(--vd-bluegray)] px-3 py-1">{pl("watching", auction.watchers)}</li>
        </ul>
      )}
      {product.marketPrice ? (
        <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 vd-sm text-[var(--vd-muted)]">
          {saving > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fdf1d8] px-2.5 py-0.5 font-bold text-[#7a4e0c]">
              <TrendingDown aria-hidden="true" className="size-3.5" strokeWidth={2.4} />
              {ui("belowMarket", { pct: saving })}
            </span>
          ) : null}
          <span>
            {ui("marketPrice")} <Money value={product.marketPrice} className="font-semibold text-[var(--vd-ink)]" />
          </span>
        </p>
      ) : null}
    </div>
  );
}

/** The bid card. `compact` (phones) keeps price, status and one action that opens the sheet. */
export function BidCard({ detail, compact = false }) {
  const { t, ui } = useLang();
  const { upcoming, closed } = detail;
  let action;
  if (upcoming) action = <Upcoming detail={detail} />;
  else if (closed) action = <Closed detail={detail} />;
  else if (compact) {
    action = (
      <button type="button" onClick={detail.sheet.show} className={btn("indigo", "lg", "h-14 w-full vd-lg")} data-testid="open-bid-sheet">
        <Gavel aria-hidden="true" className="size-5" strokeWidth={2.1} />
        {ui("placeBid")}
      </button>
    );
  } else action = <BidForm detail={detail} testId="place-bid" />;

  return (
    <section aria-label={t(C.bidPanel)} className="grid gap-4 rounded-[24px] border border-[var(--vd-line)] bg-white p-5 shadow-[0_1px_2px_rgb(7_27_82/0.04),0_14px_34px_-20px_rgb(7_27_82/0.3)] dt:p-6">
      <PriceHead detail={detail} compact={compact} />
      <Status detail={detail} />
      {action}
      {detail.open && !compact ? <MaxBid auction={detail.auction} /> : null}
      {!closed && !compact ? <Notes auction={detail.auction} /> : null}
    </section>
  );
}

/** Buy Now on dual lots: a soft pill row under the card, clearly second to bidding. */
export function BuyNowRow({ detail }) {
  const { t, ui } = useLang();
  const { product, buyNow } = detail;
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[20px] bg-[var(--vd-ivory)] px-5 py-3.5">
      <div className="min-w-0">
        <p className="vd-sm text-[var(--vd-muted)]">{t(C.auctionAndBuyNow)}</p>
        <p className="flex flex-wrap items-baseline gap-x-1.5 vd-md text-[var(--vd-ink)]">
          {ui("orBuyNow")} <Money value={product.buyNowPrice} className="vd-lg font-extrabold" />
        </p>
        <p className="vd-xs text-[var(--vd-muted)]">{ui("buyNowClosesAuction")}</p>
      </div>
      <button type="button" onClick={buyNow.show} disabled={!buyNow.available} className={btn("outline", "md", "h-11")} data-testid="buy-now">
        {ui("buyItNow")}
      </button>
    </div>
  );
}

/** Phones: a floating navy pill bar — coral clock, price and Bid now (Watch while upcoming). */
export function PhoneBar({ detail }) {
  const { ui, lang } = useLang();
  const { product, auction, upcoming, closed, price } = detail;
  const { saved, toggle } = useSaveToggle(product);
  const clock = useAuctionClock(auction);
  return (
    <div className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-30 md:hidden">
      <div className="flex h-16 items-center gap-2.5 rounded-full bg-[var(--vd-navy)] ps-2 pe-2 text-white shadow-[0_12px_30px_-12px_rgb(6_33_63/0.6)] max-[379px]:gap-2">
        {clock.closed ? (
          <span className="inline-flex h-11 shrink-0 items-center rounded-full bg-white/15 px-3.5 vd-sm font-bold max-[379px]:px-2.5">{ui(auction.phase === "sold" ? "sold" : "ended")}</span>
        ) : (
          <span className={cx("inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 vd-sm font-bold max-[379px]:px-2.5", upcoming ? "bg-white/15" : "bg-[var(--vd-coral)]")}>
            <Clock3 aria-hidden="true" className="size-4 max-[379px]:hidden" strokeWidth={2.4} />
            <span className="sr-only">{clock.label} </span>
            <span className="tabular" dir={lang === "ar" ? "rtl" : "ltr"}>
              {countdownText(clock.seconds ?? 0, lang)}
            </span>
          </span>
        )}
        <Money key={auction.flash} value={price} className={cx("min-w-0 flex-1 truncate vd-lg font-extrabold", auction.flash ? "kz-flash rounded-full" : "")} symbolClassName="text-[0.75em]" />
        {upcoming ? (
          <button type="button" onClick={toggle} aria-pressed={saved} className={btn("gold", "lg", "max-[379px]:px-4")}>
            <BellRing aria-hidden="true" className="size-[18px] max-[379px]:hidden" strokeWidth={2.1} />
            {saved ? ui("watching") : ui("remindMe")}
          </button>
        ) : (
          <button type="button" onClick={detail.sheet.show} disabled={closed} className={btn("gold", "lg", "max-[379px]:px-4")} data-testid="mobile-bid">
            <Gavel aria-hidden="true" className="size-[18px] max-[379px]:hidden" strokeWidth={2.1} />
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
    <Modal open={sheet.open} onClose={sheet.close} variant="sheet" labelledBy={titleId} panelClassName="rounded-t-[24px] bg-white text-[var(--vd-ink)] shadow-overlay md:rounded-[24px]">
      <div data-testid="bid-sheet" className="grid gap-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
        <span aria-hidden="true" className="mx-auto h-1.5 w-10 rounded-full bg-[#cfdaea] md:hidden" />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id={titleId} className="vd-h3">
              {t(C.bidSheetTitle)}
            </h2>
            <p className="mt-0.5 line-clamp-1 vd-sm text-[var(--vd-muted)]">{info.title}</p>
          </div>
          <button type="button" onClick={sheet.close} aria-label={ui("close")} className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)]">
            <X aria-hidden="true" className="size-5" strokeWidth={2.2} />
          </button>
        </div>
        <PriceHead detail={detail} compact />
        <Status detail={detail} announce={false} />
        {detail.open ? (
          <>
            <BidForm detail={detail} testId="sheet-place-bid" />
            <MaxBid auction={auction} />
            <Notes auction={auction} />
          </>
        ) : (
          <p className="vd-md text-[var(--vd-muted)]">{ui("auctionEnded")}</p>
        )}
      </div>
    </Modal>
  );
}
