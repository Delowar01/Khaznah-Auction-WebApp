"use client";

// Contemporary Saudi Commerce Browse cards: the home page's practical card
// (9 px corners, cut-out on a light plate, green "Auction" tag, red clock,
// green "Bid now"). Buy Now cards carry a sage tag and an outlined cart
// button so the auction action stays first. Phones lay the card on its side.
import Link from "next/link";
import { Clock3, Gavel, ShoppingCart, Tag } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { BROWSE_COPY as C } from "@/components/shared/browse/copy";
import { useLotFacts } from "@/components/shared/browse/hooks";
import { countdownText, useCartAdd } from "@/components/shared/r3/home";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { GradePill, HeartButton, btn, cx } from "../ui";

function SaleTag({ facts, className = "" }) {
  const { t, ui } = useLang();
  let label = t(C.buyNow);
  if (facts.phase === "upcoming" || facts.phase === "sold" || facts.phase === "ended") label = ui(facts.phase);
  else if (facts.auction) label = facts.both ? t(C.auctionAndBuyNow) : ui("auction");
  const tone = facts.closed ? "bg-[var(--sc-ink)] text-white" : facts.auction ? "bg-[var(--sc-green)] text-white" : "bg-[var(--sc-soft)] text-[var(--sc-green)]";
  const Icon = facts.auction ? Gavel : Tag;
  return (
    <span className={cx("inline-flex h-[26px] max-w-full items-center gap-1.5 rounded-[6px] px-2.5 sc-sm font-semibold", tone, className)}>
      <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />
      <span className="truncate">{label}</span>
    </span>
  );
}

export function Clock({ facts, className = "" }) {
  const { ui, lang } = useLang();
  if (facts.closed) return <p className={cx("sc-md font-semibold text-[var(--sc-muted)]", className)}>{ui("ended")}</p>;
  return (
    <p className={cx("flex items-center gap-2 sc-md font-semibold dt:text-[15px]", facts.upcoming ? "text-[var(--sc-ink)]" : "text-[var(--sc-red)]", className)}>
      <Clock3 aria-hidden="true" className="size-[17px] shrink-0" strokeWidth={2.2} />
      {facts.upcoming ? <span className="font-medium text-[var(--sc-muted)]">{ui("startsIn")}</span> : <span className="sr-only">{ui("endsIn")}</span>}
      <span className="tabular" dir={lang === "ar" ? "rtl" : "ltr"}>
        {countdownText(facts.remaining ?? 0, lang)}
      </span>
    </p>
  );
}

function TitleLink({ facts }) {
  const { link } = useConcept();
  return (
    <Link href={link(facts.href)} title={facts.title} className="after:absolute after:inset-0 after:content-[''] hover:underline">
      {facts.shortTitle}
    </Link>
  );
}

export function LotAction({ product, facts, className = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const add = useCartAdd(t(C.addedToCart));
  if (facts.auction) {
    const open = !facts.closed && !facts.upcoming;
    return (
      <Link href={link(facts.href)} aria-label={t(open ? C.bidNamed : C.viewNamed, { title: facts.title })} className={btn(open ? "green" : "outline", "md", cx("relative z-10 h-[46px] w-full dt:text-[16px]", className))}>
        {open ? ui("bidNow") : facts.closed ? t(C.viewResult) : t(C.viewLot)}
      </Link>
    );
  }
  return (
    <button type="button" disabled={facts.soldOut} onClick={() => add(product)} aria-label={t(C.addNamed, { title: facts.title })} className={btn("outline", "md", cx("relative z-10 h-[46px] w-full gap-2 px-3 max-[359px]:px-2 dt:text-[16px]", className))}>
      <ShoppingCart aria-hidden="true" className="size-[18px] shrink-0 max-[359px]:hidden" strokeWidth={1.8} />
      <span className="truncate">{facts.soldOut ? ui("soldOut") : ui("addToCart")}</span>
    </button>
  );
}

function PriceLines({ facts }) {
  const { t, ui, pl } = useLang();
  if (facts.auction) {
    return (
      <>
        <p className="sc-md text-[var(--sc-muted)]">
          {facts.priceLabel}
          {facts.upcoming ? null : ` · ${pl("bids", facts.bidCount)}`}
        </p>
        <Money value={facts.price} className="self-start sc-price !text-[22px] !leading-7 text-[var(--sc-ink)] dt:!text-[24px]" symbolClassName="text-[0.66em]" />
        <Clock facts={facts} className="mt-0.5" />
        {facts.buyNowPrice ? (
          <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 sc-sm text-[var(--sc-muted)]">
            {t(C.buyNowFor)}
            <Money value={facts.buyNowPrice} className="font-semibold text-[var(--sc-ink)]" />
          </p>
        ) : null}
      </>
    );
  }
  return (
    <>
      <p className="sc-md text-[var(--sc-muted)]">{ui("price")}</p>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <Money value={facts.price} className="sc-price !text-[22px] !leading-7 text-[var(--sc-ink)] dt:!text-[24px]" symbolClassName="text-[0.66em]" />
        {facts.was ? (
          <s className="sc-sm text-[var(--sc-muted)]">
            <span className="sr-only">{t(C.wasPrice)} </span>
            <Money value={facts.was} />
          </s>
        ) : null}
        {facts.discount ? (
          <span dir="ltr" className="sc-sm font-semibold text-[var(--sc-green)]">
            −{facts.discount}%
          </span>
        ) : null}
      </p>
      <p className={cx("mt-0.5 sc-md", facts.lowStock ? "font-semibold text-[var(--warning)]" : "text-[var(--sc-muted)]")}>
        {facts.soldOut ? ui("soldOut") : facts.lowStock ? ui("onlyLeft", { n: facts.stock }) : ui("inStock")}
      </p>
    </>
  );
}

/**
 * Grid card. From 640 px it stands upright (plate on top); on phones the
 * plate sits at the start beside the details, like the home page's cards.
 */
export function LotCard({ product, priority = false }) {
  const facts = useLotFacts(product);
  return (
    <article className="relative grid h-full grid-cols-[38%_minmax(0,1fr)] overflow-hidden rounded-[9px] border border-[var(--sc-line)] bg-white max-sm:gap-1 max-sm:p-2 sm:flex sm:flex-col">
      <div className="relative min-h-[156px] overflow-hidden rounded-[6px] bg-[var(--sc-plate)] sm:aspect-[4/3] sm:min-h-0 sm:rounded-none">
        <Img
          image={facts.image}
          cutout
          alt=""
          sizes="(min-width: 1200px) 350px, (min-width: 640px) 31vw, 38vw"
          priority={priority}
          className={cx("sc-multiply absolute inset-0 size-full object-contain p-3 sm:px-5 sm:pb-3 sm:pt-10", facts.closed && "opacity-75 grayscale")}
        />
        <SaleTag facts={facts} className="absolute start-2 top-2 max-sm:hidden" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col ps-3 pe-1 pb-1 pt-1 sm:px-3.5 sm:pb-3.5 sm:pt-3 dt:px-4 dt:pb-4">
        {/* Phones: the tag stops short of the heart in the card's top corner, like the title below it. */}
        <div className="mb-2 flex pe-8 sm:hidden">
          <SaleTag facts={facts} />
        </div>
        <h3 className="line-clamp-2 pe-8 sc-title text-[var(--sc-ink)] sm:pe-0 dt:!text-[16px] dt:!leading-[22px]">
          <TitleLink facts={facts} />
        </h3>
        <p className="mt-1 truncate sc-md text-[var(--sc-muted)]">{facts.sellerName}</p>
        <GradePill grade={product.grade} className="mt-2" />
        <div className="mt-2.5 flex flex-col">
          <PriceLines facts={facts} />
        </div>
        <div className="mt-auto pt-3">
          <LotAction product={product} facts={facts} />
        </div>
      </div>
      <HeartButton product={product} className="absolute end-1 top-1" />
    </article>
  );
}

/** List row: plate, identity, price column and the action. */
export function LotRow({ product }) {
  const facts = useLotFacts(product);
  return (
    <article className="relative grid grid-cols-[132px_minmax(0,1fr)] gap-4 overflow-hidden rounded-[9px] border border-[var(--sc-line)] bg-white p-2 md:grid-cols-[176px_minmax(0,1fr)_240px] md:items-center dt:grid-cols-[200px_minmax(0,1fr)_260px]">
      <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[var(--sc-plate)]">
        <Img image={facts.image} cutout alt="" sizes="(min-width: 1200px) 200px, (min-width: 768px) 176px, 132px" className={cx("sc-multiply absolute inset-0 size-full object-contain p-4", facts.closed && "opacity-75 grayscale")} />
      </div>
      <div className="min-w-0 py-1 pe-8 md:pe-0">
        <SaleTag facts={facts} />
        <h3 className="mt-2 line-clamp-2 sc-title text-[var(--sc-ink)] dt:!text-[17px]">
          <TitleLink facts={facts} />
        </h3>
        <p className="mt-1 truncate sc-md text-[var(--sc-muted)]">
          {facts.sellerName}
          <span className="max-md:hidden"> · {facts.typeLine}</span>
        </p>
        <GradePill grade={product.grade} className="mt-2" />
      </div>
      <div className="col-span-2 flex flex-col border-t border-[var(--sc-line)] px-2 pb-2 pt-3 md:col-span-1 md:border-s md:border-t-0 md:px-5 md:py-2">
        <PriceLines facts={facts} />
        <div className="mt-3">
          <LotAction product={product} facts={facts} />
        </div>
      </div>
      <HeartButton product={product} className="absolute end-1 top-1" />
    </article>
  );
}

export function CardSkeleton() {
  return (
    <div className="grid h-full grid-cols-[38%_minmax(0,1fr)] gap-3 overflow-hidden rounded-[9px] border border-[var(--sc-line)] bg-white p-2 motion-safe:animate-pulse sm:flex sm:flex-col sm:gap-0 sm:p-0">
      <div className="min-h-[156px] rounded-[6px] bg-[var(--sc-plate)] sm:aspect-[4/3] sm:min-h-0 sm:rounded-none" />
      <div className="space-y-2.5 py-1 sm:p-4">
        <div className="h-4 w-4/5 rounded-[4px] bg-[#e9eeec]" />
        <div className="h-3 w-1/2 rounded-[4px] bg-[#f0f3f2]" />
        <div className="h-[26px] w-20 rounded-[6px] bg-[#f0f3f2]" />
        <div className="h-6 w-2/5 rounded-[4px] bg-[#e9eeec]" />
        <div className="h-[46px] rounded-[7px] bg-[#e9eeec]" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="grid grid-cols-[132px_minmax(0,1fr)] gap-4 rounded-[9px] border border-[var(--sc-line)] bg-white p-2 motion-safe:animate-pulse md:grid-cols-[176px_minmax(0,1fr)_240px] dt:grid-cols-[200px_minmax(0,1fr)_260px]">
      <div className="aspect-square rounded-[6px] bg-[var(--sc-plate)]" />
      <div className="space-y-2.5 self-center">
        <div className="h-[26px] w-24 rounded-[6px] bg-[#e9eeec]" />
        <div className="h-4 w-3/4 rounded-[4px] bg-[#e9eeec]" />
        <div className="h-3 w-1/3 rounded-[4px] bg-[#f0f3f2]" />
      </div>
      <div className="hidden space-y-2.5 self-center md:block">
        <div className="h-6 w-1/2 rounded-[4px] bg-[#e9eeec]" />
        <div className="h-[46px] rounded-[7px] bg-[#e9eeec]" />
      </div>
    </div>
  );
}
