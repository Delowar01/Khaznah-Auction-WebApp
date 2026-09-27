"use client";

import Link from "next/link";
import { useId } from "react";
import { ArrowLeft, ArrowRight, Eye, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_EVENT } from "@/data/live";
import { detailPath, discountPercent, isAuction } from "@/lib/catalog";
import { formatAgo, moneyText } from "@/lib/format";
import { COPY } from "./copy";
import { BOARD, fromPrice } from "./data";
import { AddButton, LiveDot, TONE_BG, TimeLeft, btnClass, cx } from "./ui";

/** Transparent cut-out when the lot has one, else its studio shot. */
function ProductArt({ product, sizes, className = "" }) {
  const main = product.images[0];
  return <Img image={main} cutout alt="" sizes={sizes} className={cx("object-contain drop-shadow-[0_14px_14px_rgb(20_22_28/0.16)]", className)} />;
}

function TileLink({ product, children }) {
  const { link } = useConcept();
  return (
    <Link href={link(detailPath(product))} className="after:absolute after:inset-0 after:z-[1] after:content-[''] hover:underline">
      {children}
    </Link>
  );
}

function CollectionTile({ collection }) {
  const { t, isRTL } = useLang();
  const { link } = useConcept();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  return (
    <article className={cx("relative flex h-full flex-col overflow-hidden rounded-card p-5 lg:p-6", TONE_BG[collection.tone])}>
      <p className="dc-kicker text-fg-2">{t(COPY.collectionOf)}</p>
      <h2 className="mt-0.5 dc-hero text-fg">{t(collection.title)}</h2>
      <p className="mt-1 dc-sm text-fg-2">{t(COPY.collectionCount, { n: collection.lots.length, amount: moneyText(fromPrice(collection.lots)) })}</p>
      <ul className="mt-4 grid min-h-0 flex-1 grid-cols-4 gap-2 lg:grid-cols-2 lg:grid-rows-2 lg:gap-3">
        {collection.lots.map((product) => (
          <li key={product.slug} className="min-h-0">
            <Link href={link(detailPath(product))} className="group relative grid aspect-square w-full place-items-center overflow-hidden rounded-[14px] bg-white/80 p-2 lg:aspect-auto lg:h-full">
              <ProductArt product={product} sizes="(min-width: 1024px) 12vw, 22vw" className="absolute inset-2 size-[calc(100%-16px)] transition-transform duration-300 group-hover:scale-[1.06]" />
              <span className="sr-only">{t(product.title)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={link(collection.href)} className={btnClass("ink", "md", "mt-4 self-start")}>
        {t(COPY.exploreCollection)}
        <Arrow aria-hidden="true" className="size-4" />
      </Link>
    </article>
  );
}

function DealTile({ product }) {
  const { t } = useLang();
  const pct = discountPercent(product);
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-card bg-[var(--dc-rose)] p-4">
      <p className="flex items-center justify-between gap-2">
        <span className="dc-kicker text-fg">{t(COPY.dealOfDay)}</span>
        <span dir="ltr" className="inline-flex h-6 items-center rounded-full bg-[#d13d17] px-2 dc-xs font-bold text-white">
          −{pct}%
        </span>
      </p>
      <div className="relative my-2 min-h-0 flex-1">
        <ProductArt product={product} sizes="200px" className="absolute inset-0 size-full" />
      </div>
      <h3 className="truncate dc-sm font-semibold text-fg">
        <TileLink product={product}>{t(product.title)}</TileLink>
      </h3>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="flex flex-wrap items-baseline gap-x-1.5">
          <Money value={product.price} className="dc-price text-fg" />
          <Money value={product.originalPrice} strike className="dc-xs text-fg-2" />
        </p>
        <AddButton product={product} className="relative" />
      </div>
    </article>
  );
}

function NewTile({ product }) {
  const { t, lang } = useLang();
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-card bg-[var(--dc-mint)] p-4">
      <p className="flex items-center justify-between gap-2">
        <span className="dc-kicker text-fg">{t(COPY.newIn)}</span>
        <span className="dc-xs text-fg-2">{t(COPY.listedAgo, { time: formatAgo((product.listedHoursAgo ?? 0) * 3600, lang) })}</span>
      </p>
      <div className="relative my-2 min-h-0 flex-1">
        <ProductArt product={product} sizes="200px" className="absolute inset-0 size-full" />
      </div>
      <h3 className="truncate dc-sm font-semibold text-fg">
        <TileLink product={product}>{t(product.title)}</TileLink>
      </h3>
      <div className="mt-1 flex items-end justify-between gap-2">
        <Money value={isAuction(product) ? product.currentBid : product.price} className="dc-price text-fg" />
        {isAuction(product) ? null : <AddButton product={product} className="relative" />}
      </div>
    </article>
  );
}

function LiveTile({ live }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const lot = live.current;
  return (
    <article className="relative flex h-full flex-col justify-between overflow-hidden rounded-card bg-[#14161c] p-4 text-white">
      <Img image={LIVE_EVENT.stream} alt="" sizes="(min-width: 1024px) 25vw, 50vw" className="absolute inset-0 size-full object-cover" />
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/30" />
      <p className="relative flex flex-wrap items-center gap-1.5">
        <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-[var(--dc-live-badge)] px-2 dc-xs font-bold text-white">
          <LiveDot />
          {t(COPY.liveNow)}
        </span>
        <span className="inline-flex h-6 items-center gap-1 rounded-full bg-black/50 px-2 dc-xs font-semibold text-white">
          <Eye aria-hidden="true" className="size-3.5" />
          <span className="tabular">{pl("viewers", live.viewers)}</span>
        </span>
      </p>
      <div className="relative">
        {lot ? (
          <>
            <p className="line-clamp-1 dc-sm font-semibold text-white/85">{t(lot.title)}</p>
            <p className="mt-0.5 flex items-baseline gap-2">
              <span className="sr-only">{ui("currentBid")}</span>
              <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded px-1 dc-price-lg text-white" />
            </p>
          </>
        ) : null}
        <Link href={link("/live-auction")} className={btnClass("white", "sm", "mt-2")}>
          {t(COPY.join)}
          <span className="sr-only">: {t(LIVE_EVENT.title)}</span>
        </Link>
      </div>
    </article>
  );
}

function EndingTile({ product }) {
  const { t, ui } = useLang();
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-card bg-[var(--dc-sky)] p-4">
      <p className="flex items-center justify-between gap-2">
        <span className="dc-kicker text-fg">{t(COPY.endingSoon)}</span>
        <span className="inline-flex h-6 items-center gap-1 rounded-full bg-white px-2 dc-xs font-bold text-[#d4163e]">
          <Timer aria-hidden="true" className="size-3.5" />
          <span className="sr-only">{ui("closesIn")} </span>
          <TimeLeft endsIn={product.endsIn} />
        </span>
      </p>
      <div className="relative my-2 min-h-0 flex-1">
        {product.images[0]?.cutout ? (
          <ProductArt product={product} sizes="200px" className="absolute inset-0 size-full" />
        ) : (
          <Img image={product.images[0]} alt="" sizes="200px" className="absolute inset-0 size-full rounded-[12px] object-cover" />
        )}
      </div>
      <h3 className="truncate dc-sm font-semibold text-fg">
        <TileLink product={product}>{t(product.title)}</TileLink>
      </h3>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="dc-xs text-fg-2">{ui("currentBid")}</span>
        <Money value={product.currentBid} className="dc-price text-fg" />
      </p>
    </article>
  );
}

/** The discovery board: a collection flanked by four ways in. */
export function Board({ live }) {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section id="dc-board" aria-labelledby={titleId} className="dc-container pt-5 lg:pt-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-1 lg:mb-5">
        <h1 id={titleId} className="dc-hero text-fg">
          {t(COPY.boardTitle)}
        </h1>
        <p className="max-w-md dc-sm text-fg-2">{t(COPY.boardSub)}</p>
      </div>
      <ul className="dc-board">
        <li data-area="col" className="min-h-[300px] lg:min-h-0">
          <CollectionTile collection={BOARD.collection} />
        </li>
        <li data-area="deal" className="h-[236px] lg:h-auto">
          <DealTile product={BOARD.deal} />
        </li>
        <li data-area="new" className="h-[236px] lg:h-auto">
          <NewTile product={BOARD.fresh} />
        </li>
        <li data-area="live" className="h-[236px] lg:h-auto">
          <LiveTile live={live} />
        </li>
        <li data-area="ending" className="h-[236px] lg:h-auto">
          <EndingTile product={BOARD.ending} />
        </li>
      </ul>
    </section>
  );
}
