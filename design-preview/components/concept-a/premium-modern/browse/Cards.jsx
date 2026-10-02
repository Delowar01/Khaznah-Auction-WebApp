"use client";

// Premium Modern Browse cards: spacious white cards with a hairline border,
// cut-outs on stone plates for auctions and on white for Buy Now, a bronze
// sale-type kicker, and a charcoal "Bid now" that outranks the outlined
// "Add to cart".
import Link from "next/link";
import { Clock3, Gavel, ShoppingCart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { BROWSE_COPY as C } from "@/components/shared/browse/copy";
import { useLotFacts } from "@/components/shared/browse/hooks";
import { countdownText, useCartAdd } from "@/components/shared/r3/home";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { GradePill, HeartButton, btn, cx } from "../ui";

const SIZES = "(min-width: 1200px) 330px, (min-width: 768px) 31vw, 46vw";

/** Sale type above the title: bronze for auctions, muted for Buy Now. */
function Kicker({ facts }) {
  const { t } = useLang();
  if (!facts.auction) return <p className="pr-kicker text-fg-2">{t(C.buyNow)}</p>;
  return (
    <p className="flex items-center gap-1.5 pr-kicker text-[var(--pr-bronze)]">
      <Gavel aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />
      {t(facts.both ? C.auctionAndBuyNow : C.timedAuction)}
    </p>
  );
}

/** Upcoming / ended / sold / sold out, on the photograph's top-start corner. */
function StatusTag({ facts }) {
  const { ui } = useLang();
  let label = null;
  if (facts.phase === "upcoming") label = ui("upcoming");
  else if (facts.phase === "sold") label = ui("sold");
  else if (facts.phase === "ended") label = ui("ended");
  else if (facts.soldOut) label = ui("soldOut");
  if (label) return <span className="absolute start-2.5 top-2.5 rounded-[3px] bg-[var(--pr-charcoal)] px-2 py-0.5 pr-label text-white">{label}</span>;
  if (facts.discount) {
    return (
      <span className="absolute start-2.5 top-2.5 rounded-[3px] bg-[var(--pr-stone)] px-2 py-0.5 pr-label text-fg">
        <span dir="ltr">−{facts.discount}%</span>
      </span>
    );
  }
  return null;
}

/** Red clock with the remaining time (or the start time / "Ended"). */
export function Clock({ facts, className = "" }) {
  const { ui, lang } = useLang();
  if (facts.closed) return <p className={cx("pr-md font-semibold text-fg-2", className)}>{ui("ended")}</p>;
  return (
    <p className={cx("inline-flex items-center gap-1.5 font-bold", facts.upcoming ? "text-fg" : "text-[var(--pr-timer)]", className)}>
      <Clock3 aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.2} />
      <span className="tabular" dir={lang === "ar" ? "rtl" : "ltr"}>
        {countdownText(facts.remaining ?? 0, lang)}
      </span>
    </p>
  );
}

function TitleLink({ facts, className = "" }) {
  const { link } = useConcept();
  return (
    <Link href={link(facts.href)} title={facts.title} className={cx("after:absolute after:inset-0 after:content-[''] hover:underline", className)}>
      {facts.shortTitle}
    </Link>
  );
}

/** The card's one action: Bid now (open auctions), View lot / View result, or Add to cart. */
export function LotAction({ product, facts, className = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const add = useCartAdd(t(C.addedToCart));
  if (facts.auction) {
    const open = !facts.closed && !facts.upcoming;
    return (
      <Link
        href={link(facts.href)}
        aria-label={t(open ? C.bidNamed : C.viewNamed, { title: facts.title })}
        className={btn(open ? "charcoal" : "outline", "sm", cx("relative z-10 h-10 w-full", className))}
      >
        {open ? ui("bidNow") : facts.closed ? t(C.viewResult) : t(C.viewLot)}
      </Link>
    );
  }
  return (
    <button
      type="button"
      disabled={facts.soldOut}
      onClick={() => add(product)}
      aria-label={t(C.addNamed, { title: facts.title })}
      className={btn("outline", "sm", cx("relative z-10 h-10 w-full gap-1.5 @max-[13rem]:px-2", className))}
    >
      <ShoppingCart aria-hidden="true" className="size-[17px] shrink-0 @max-[12.5rem]:hidden" strokeWidth={1.8} />
      <span className="truncate">{facts.soldOut ? ui("soldOut") : ui("addToCart")}</span>
    </button>
  );
}

/** Price block: label, amount, then bids (auctions) or stock (Buy Now). */
function PriceBlock({ facts }) {
  const { t, ui, pl } = useLang();
  if (facts.auction) {
    return (
      <div>
        <p className="pr-xs text-fg-2">{facts.priceLabel}</p>
        <Money value={facts.price} className="pr-price-sm text-fg" symbolClassName="text-[0.78em]" />
        {facts.upcoming ? null : <p className="pr-xs text-fg-2">{pl("bids", facts.bidCount)}</p>}
      </div>
    );
  }
  return (
    <div>
      <p className="pr-xs text-fg-2">{ui("price")}</p>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <Money value={facts.price} className="pr-price-sm text-fg" symbolClassName="text-[0.78em]" />
        {facts.was ? (
          <s className="pr-sm text-fg-2">
            <span className="sr-only">{t(C.wasPrice)} </span>
            <Money value={facts.was} />
          </s>
        ) : null}
      </p>
      <p className={cx("pr-xs", facts.lowStock ? "font-semibold text-[var(--warning)]" : "text-fg-2")}>
        {facts.soldOut ? ui("soldOut") : facts.lowStock ? ui("onlyLeft", { n: facts.stock }) : ui("inStock")}
      </p>
    </div>
  );
}

function TimeBlock({ facts }) {
  const { t, ui } = useLang();
  return (
    <div>
      <p className="pr-xs text-fg-2">{facts.upcoming ? ui("startsIn") : t(C.timeLeft)}</p>
      <Clock facts={facts} className="pr-md" />
    </div>
  );
}

/** Grid card for one lot. */
export function LotCard({ product, priority = false }) {
  const { t } = useLang();
  const facts = useLotFacts(product);
  return (
    <article className="@container group relative flex h-full flex-col overflow-hidden rounded-[5px] border border-[#ebe9e3] bg-white">
      <div className={cx("relative aspect-[4/3]", facts.auction ? "bg-[var(--pr-stone)]" : "bg-white")}>
        <Img
          image={facts.image}
          cutout={facts.auction}
          alt=""
          sizes={SIZES}
          priority={priority}
          className={cx(
            "absolute inset-0 size-full object-contain transition-transform duration-300 group-hover:scale-[1.02]",
            facts.auction ? "pr-multiply p-[9%]" : "p-[7%]",
            facts.closed && "opacity-75 grayscale",
          )}
        />
        <StatusTag facts={facts} />
        <HeartButton product={product} className="absolute end-1 top-1" />
      </div>
      <div className={cx("flex flex-1 flex-col px-3.5 pb-3.5 pt-3 dt:px-5 dt:pb-5 dt:pt-4", !facts.auction && "border-t border-[#f1efea]")}>
        <Kicker facts={facts} />
        <h3 className="mt-1.5 line-clamp-2 pr-title text-fg">
          <TitleLink facts={facts} />
        </h3>
        <p className="mt-0.5 truncate pr-xs text-fg-2">{facts.sellerName}</p>
        <GradePill grade={product.grade} className="mt-2.5 w-fit" />
        <div className="mt-auto pt-4">
          <div className={cx("grid gap-x-3 gap-y-2 border-t border-[#ebe9e3] pt-3", facts.auction && "grid-cols-2 @max-[15rem]:grid-cols-1")}>
            <PriceBlock facts={facts} />
            {facts.auction ? <TimeBlock facts={facts} /> : null}
          </div>
          {facts.buyNowPrice ? (
            <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5 pr-xs text-fg-2">
              {t(C.buyNowFor)}
              <Money value={facts.buyNowPrice} className="pr-sm font-semibold text-fg" />
            </p>
          ) : null}
          <LotAction product={product} facts={facts} className="mt-3.5" />
        </div>
      </div>
    </article>
  );
}

/** List row for one lot: photograph, details, price and the action. */
export function LotRow({ product }) {
  const { t } = useLang();
  const facts = useLotFacts(product);
  return (
    <article className="group relative grid grid-cols-[104px_minmax(0,1fr)] gap-x-4 gap-y-3 py-5 sm:grid-cols-[150px_minmax(0,1fr)_200px] sm:gap-x-6 dt:grid-cols-[180px_minmax(0,1fr)_230px]">
      <div className={cx("relative aspect-square overflow-hidden rounded-[4px]", facts.auction ? "bg-[var(--pr-stone)]" : "border border-[#ebe9e3] bg-white")}>
        <Img
          image={facts.image}
          cutout={facts.auction}
          alt=""
          sizes="(min-width: 768px) 180px, 104px"
          className={cx("absolute inset-0 size-full object-contain", facts.auction ? "pr-multiply p-[10%]" : "p-[8%]", facts.closed && "opacity-75 grayscale")}
        />
        <HeartButton product={product} className="absolute end-0 top-0" />
      </div>
      <div className="min-w-0 self-center">
        <Kicker facts={facts} />
        <h3 className="mt-1 line-clamp-2 pr-title text-fg dt:text-[17px] dt:leading-[23px]">
          <TitleLink facts={facts} />
        </h3>
        <p className="mt-0.5 truncate pr-xs text-fg-2">{facts.sellerName}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <GradePill grade={product.grade} />
          <span className="pr-xs text-fg-2">{facts.typeLine}</span>
        </div>
      </div>
      <div className="col-span-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t border-[#ebe9e3] pt-3 sm:col-span-1 sm:flex-col sm:flex-nowrap sm:items-stretch sm:justify-center sm:border-s sm:border-t-0 sm:ps-6 sm:pt-0">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
          <PriceBlock facts={facts} />
          {facts.auction ? <TimeBlock facts={facts} /> : null}
        </div>
        {facts.buyNowPrice ? (
          <p className="flex flex-wrap items-baseline gap-x-1.5 pr-xs text-fg-2">
            {t(C.buyNowFor)}
            <Money value={facts.buyNowPrice} className="pr-sm font-semibold text-fg" />
          </p>
        ) : null}
        <LotAction product={product} facts={facts} className="max-sm:w-auto max-sm:min-w-[150px] max-sm:px-5" />
      </div>
    </article>
  );
}

/** Loading placeholders in the card's own proportions. */
export function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[5px] border border-[#ebe9e3] bg-white motion-safe:animate-pulse">
      <div className="aspect-[4/3] bg-[#f1eee8]" />
      <div className="space-y-2.5 px-3.5 py-4 dt:px-5">
        <div className="h-3 w-1/3 rounded-[2px] bg-[#ece8e1]" />
        <div className="h-4 w-4/5 rounded-[2px] bg-[#ece8e1]" />
        <div className="h-3 w-1/2 rounded-[2px] bg-[#f1eee8]" />
        <div className="h-[22px] w-16 rounded-full bg-[#f1eee8]" />
        <div className="h-px bg-[#ebe9e3]" />
        <div className="h-5 w-2/5 rounded-[2px] bg-[#ece8e1]" />
        <div className="h-10 rounded-[4px] bg-[#ece8e1]" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-4 py-5 motion-safe:animate-pulse sm:grid-cols-[150px_minmax(0,1fr)_200px] dt:grid-cols-[180px_minmax(0,1fr)_230px]">
      <div className="aspect-square rounded-[4px] bg-[#f1eee8]" />
      <div className="space-y-2.5 self-center">
        <div className="h-3 w-24 rounded-[2px] bg-[#ece8e1]" />
        <div className="h-4 w-3/4 rounded-[2px] bg-[#ece8e1]" />
        <div className="h-3 w-1/3 rounded-[2px] bg-[#f1eee8]" />
      </div>
      <div className="hidden space-y-2.5 self-center sm:block">
        <div className="h-5 w-1/2 rounded-[2px] bg-[#ece8e1]" />
        <div className="h-10 rounded-[4px] bg-[#ece8e1]" />
      </div>
    </div>
  );
}
