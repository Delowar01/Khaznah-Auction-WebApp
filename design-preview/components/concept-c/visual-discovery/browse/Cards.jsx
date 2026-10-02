"use client";

// Visual Discovery Browse cards: image-led 16 px cards on softly tinted
// plates, the coral countdown pill on the photograph, an indigo "Bid now"
// for auctions and the quieter outlined cart circle for Buy Now.
import Link from "next/link";
import { Clock3, Gavel, ShoppingBag, ShoppingCart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { BROWSE_COPY as C } from "@/components/shared/browse/copy";
import { useLotFacts } from "@/components/shared/browse/hooks";
import { countdownText, useCartAdd } from "@/components/shared/r3/home";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { GradePill, HeartDisk, btn, cx } from "../ui";

// The home page's plate tints, assigned per lot so a card keeps its colour.
const TONES = ["#e6ebf1", "#f3ebe3", "#dfe7f0", "#efe7dc", "#e9ebed", "#f6ecdf", "#e4e2df", "#dfe5ec"];
export const toneOf = (slug) => TONES[[...slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % TONES.length];

export function SaleChip({ facts, className = "" }) {
  const { t, ui } = useLang();
  let label = t(C.buyNow);
  if (facts.phase === "upcoming" || facts.phase === "sold" || facts.phase === "ended") label = ui(facts.phase);
  else if (facts.auction && facts.both) {
    // Narrow cards keep "Auction"; the Buy Now price is printed under the bid.
    label = (
      <>
        {ui("auction")}
        <span className="@max-[15rem]:hidden"> + {t(C.buyNow)}</span>
      </>
    );
  } else if (facts.auction) label = ui("auction");
  const Icon = facts.auction ? Gavel : ShoppingBag;
  return (
    <span className={cx("inline-flex h-6 max-w-full items-center gap-1.5 rounded-full px-2.5 vd-label", facts.auction ? "bg-[var(--vd-bluegray)] text-[var(--vd-indigo)]" : "bg-white text-[var(--vd-ink)] ring-1 ring-inset ring-[var(--vd-line)]", className)}>
      <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.2} />
      <span className="truncate">{label}</span>
    </span>
  );
}

/** Coral pill on the photograph (navy when the auction has not started, grey when closed). */
function TimePill({ facts, className = "" }) {
  const { ui, lang } = useLang();
  if (!facts.auction) return null;
  const tone = facts.closed ? "bg-[var(--vd-ink)]/75" : facts.upcoming ? "bg-[var(--vd-navy)]" : "bg-[var(--vd-coral)]";
  return (
    <span className={cx("inline-flex h-8 items-center gap-1.5 rounded-full px-3 vd-sm font-bold text-white", tone, className)}>
      <Clock3 aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.4} />
      {facts.closed ? (
        ui("ended")
      ) : (
        <>
          <span className={facts.upcoming ? "font-semibold" : "sr-only"}>{ui(facts.upcoming ? "startsIn" : "endsIn")}</span>
          <span className="tabular" dir={lang === "ar" ? "rtl" : "ltr"}>
            {countdownText(facts.remaining ?? 0, lang)}
          </span>
        </>
      )}
    </span>
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

function CartButton({ product, facts, className = "" }) {
  const { t } = useLang();
  const add = useCartAdd(t(C.addedToCart));
  return (
    <button
      type="button"
      disabled={facts.soldOut}
      onClick={() => add(product)}
      aria-label={t(C.addNamed, { title: facts.title })}
      className={cx("relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-[1.5px] border-[var(--vd-indigo)] bg-white text-[var(--vd-indigo)] transition-colors hover:bg-[var(--vd-bluegray)] disabled:opacity-40", className)}
    >
      <ShoppingCart aria-hidden="true" className="size-5" strokeWidth={2} />
    </button>
  );
}

function BidButton({ facts, className = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const open = !facts.closed && !facts.upcoming;
  return (
    <Link
      href={link(facts.href)}
      aria-label={t(open ? C.bidNamed : C.viewNamed, { title: facts.title })}
      className={btn(open ? "indigo" : "outline", "md", cx("relative z-10 h-11 !rounded-[12px] px-5", className))}
    >
      {open ? ui("bidNow") : facts.closed ? t(C.viewResult) : t(C.viewLot)}
    </Link>
  );
}

function Price({ facts }) {
  const { t, ui, pl } = useLang();
  if (facts.auction) {
    return (
      <div className="min-w-0">
        <p className="whitespace-nowrap vd-xs text-[var(--vd-muted)]">
          {facts.priceLabel}
          {facts.upcoming ? null : ` · ${pl("bids", facts.bidCount)}`}
        </p>
        <Money value={facts.price} className="vd-price text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />
      </div>
    );
  }
  return (
    <div className="min-w-0">
      <p className="whitespace-nowrap vd-xs text-[var(--vd-muted)]">
        {facts.soldOut ? ui("soldOut") : facts.lowStock ? ui("onlyLeft", { n: facts.stock }) : ui("price")}
      </p>
      <p className="flex flex-wrap items-baseline gap-x-1.5">
        <Money value={facts.price} className="vd-price text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />
        {facts.was ? (
          <s className="vd-sm text-[var(--vd-muted)]">
            <span className="sr-only">{t(C.wasPrice)} </span>
            <Money value={facts.was} />
          </s>
        ) : null}
      </p>
    </div>
  );
}

/**
 * Image-led grid card. `lead` is the closing-first lot at the top of the
 * results: two columns wide (and two rows tall from 768 px), like the home
 * page's Featured lead.
 */
export function LotCard({ product, priority = false, lead = false }) {
  const { t } = useLang();
  const facts = useLotFacts(product);
  return (
    <article className="@container group relative flex h-full flex-col overflow-hidden rounded-[16px] border border-[var(--vd-line)] bg-white">
      <div className={cx("relative overflow-hidden", lead ? "aspect-[4/3] md:aspect-auto md:min-h-[300px] md:flex-1" : "aspect-square")} style={{ background: toneOf(product.slug) }}>
        <Img
          image={facts.image}
          cutout
          alt=""
          sizes={lead ? "(min-width: 1200px) 670px, (min-width: 768px) 62vw, 94vw" : "(min-width: 1200px) 330px, (min-width: 768px) 31vw, 47vw"}
          priority={priority}
          className={cx("vd-multiply absolute inset-0 size-full object-contain transition-transform duration-300 group-hover:scale-[1.03]", lead ? "px-[14%] pb-[12%] pt-[14%]" : "px-[12%] pb-[13%] pt-[17%]", facts.closed && "opacity-70 grayscale")}
        />
        <HeartDisk product={product} className="absolute end-2.5 top-2.5" />
        <SaleChip facts={facts} className="absolute start-2.5 top-2.5 max-w-[calc(100%-64px)]" />
        {facts.auction ? <TimePill facts={facts} className="absolute bottom-2.5 start-2.5" /> : null}
        {!facts.auction && facts.discount ? (
          <span className="absolute bottom-2.5 start-2.5 inline-flex h-7 items-center rounded-full bg-[var(--vd-gold)] px-2.5 vd-sm font-bold text-[var(--vd-ink)]">
            <span dir="ltr">−{facts.discount}%</span>
          </span>
        ) : null}
      </div>
      <div className={cx("flex flex-col px-3.5 pb-3.5 pt-3 dt:px-4 dt:pb-4", lead ? "md:flex-none dt:px-6 dt:pb-5 dt:pt-4" : "flex-1")}>
        <h3 className={cx("line-clamp-2 text-[var(--vd-ink)]", lead ? "vd-h3 !text-[18px] !leading-6 dt:!text-[21px] dt:!leading-7" : "vd-title")}>
          <TitleLink facts={facts} />
        </h3>
        <p className="mt-0.5 truncate vd-sm text-[var(--vd-muted)]">{facts.sellerName}</p>
        <GradePill grade={product.grade} className="mt-2" />
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2.5 pt-3">
          <Price facts={facts} />
          {facts.auction ? <BidButton facts={facts} className="@max-[13.5rem]:w-full" /> : <CartButton product={product} facts={facts} />}
        </div>
        {facts.buyNowPrice ? (
          <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5 vd-xs text-[var(--vd-muted)]">
            {t(C.buyNowFor)}
            <Money value={facts.buyNowPrice} className="vd-sm font-semibold text-[var(--vd-ink)]" />
          </p>
        ) : null}
      </div>
    </article>
  );
}

/** List row: a wide photo card on its side. */
export function LotRow({ product }) {
  const { t } = useLang();
  const facts = useLotFacts(product);
  return (
    <article className="group relative grid grid-cols-[120px_minmax(0,1fr)] overflow-hidden rounded-[16px] border border-[var(--vd-line)] bg-white sm:grid-cols-[200px_minmax(0,1fr)] dt:grid-cols-[240px_minmax(0,1fr)]">
      <div className="relative min-h-[150px] sm:min-h-[180px]" style={{ background: toneOf(product.slug) }}>
        <Img image={facts.image} cutout alt="" sizes="(min-width: 1200px) 240px, (min-width: 640px) 200px, 120px" className={cx("vd-multiply absolute inset-0 size-full object-contain p-[12%]", facts.closed && "opacity-70 grayscale")} />
        {facts.auction ? <TimePill facts={facts} className="absolute bottom-2 start-2 max-sm:h-7 max-sm:px-2 max-sm:text-[11px]" /> : null}
      </div>
      <div className="flex min-w-0 flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
        <div className="min-w-0 pe-10 sm:pe-0">
          <SaleChip facts={facts} />
          <h3 className="mt-2 line-clamp-2 vd-title text-[var(--vd-ink)] dt:text-[17px] dt:leading-[23px]">
            <TitleLink facts={facts} />
          </h3>
          <p className="mt-0.5 truncate vd-sm text-[var(--vd-muted)]">
            {facts.sellerName}
            <span className="max-sm:hidden"> · {facts.typeLine}</span>
          </p>
          <GradePill grade={product.grade} className="mt-2" />
        </div>
        <div className="flex shrink-0 flex-wrap items-end justify-between gap-x-5 gap-y-2 sm:flex-col sm:items-end sm:text-end">
          <Price facts={facts} />
          {facts.buyNowPrice ? (
            <p className="flex flex-wrap items-baseline gap-x-1.5 vd-xs text-[var(--vd-muted)]">
              {t(C.buyNowFor)}
              <Money value={facts.buyNowPrice} className="vd-sm font-semibold text-[var(--vd-ink)]" />
            </p>
          ) : null}
          {facts.auction ? <BidButton facts={facts} className="sm:min-w-[150px]" /> : <CartButton product={product} facts={facts} />}
        </div>
      </div>
      <HeartDisk product={product} className="absolute end-2.5 top-2.5" />
    </article>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[var(--vd-line)] bg-white motion-safe:animate-pulse">
      <div className="aspect-square bg-[var(--vd-bluegray)]" />
      <div className="space-y-2.5 p-4">
        <div className="h-4 w-4/5 rounded-full bg-[var(--vd-bluegray)]" />
        <div className="h-3 w-1/2 rounded-full bg-[#f2f5fa]" />
        <div className="h-5 w-16 rounded-full bg-[#f2f5fa]" />
        <div className="flex items-end justify-between pt-1">
          <div className="h-6 w-20 rounded-full bg-[var(--vd-bluegray)]" />
          <div className="h-11 w-24 rounded-[12px] bg-[var(--vd-bluegray)]" />
        </div>
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] overflow-hidden rounded-[16px] border border-[var(--vd-line)] bg-white motion-safe:animate-pulse sm:grid-cols-[200px_minmax(0,1fr)] dt:grid-cols-[240px_minmax(0,1fr)]">
      <div className="min-h-[150px] bg-[var(--vd-bluegray)] sm:min-h-[180px]" />
      <div className="space-y-2.5 self-center p-5">
        <div className="h-6 w-24 rounded-full bg-[var(--vd-bluegray)]" />
        <div className="h-4 w-3/4 rounded-full bg-[var(--vd-bluegray)]" />
        <div className="h-3 w-1/3 rounded-full bg-[#f2f5fa]" />
      </div>
    </div>
  );
}
