"use client";

import Link from "next/link";
import { ArrowUpRight, Gavel, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { detailPath, discountPercent } from "@/lib/catalog";
import { getSeller } from "@/data/sellers";
import { GRADES } from "@/data/grades";
import { isAuction } from "@/data/products";
import { useRemaining } from "@/lib/clock";
import { formatDuration, moneyLabel } from "@/lib/format";
import { COPY } from "./copy";
import { AddButton, SaleTag, TimeLeft, WatchButton, cx, pillClass } from "./ui";
import { isStudio, mainImage, saleTag, sceneOf } from "./lots";

/** Photo layer: lifestyle photos fill; studio shots multiply into a warm plate. */
function Photo({ image, alt = "", sizes, priority, pad = "p-[13%]", className = "" }) {
  const studio = isStudio(image);
  return (
    <div className={cx("absolute inset-0 overflow-hidden", studio ? "vm-plate" : "bg-surface-2", className)}>
      <Img
        image={image}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={cx(
          "size-full transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.035]",
          studio ? cx("vm-multiply object-contain", pad) : "object-cover",
        )}
      />
    </div>
  );
}

function usePriceLine(product) {
  const { t, lang } = useLang();
  const remaining = useRemaining(product.endsIn);
  if (product.status === "scheduled") {
    const opens = Math.max(0, (product.startsIn ?? 0) - ((product.endsIn ?? 0) - (remaining ?? 0)));
    return { kind: "upcoming", text: t(COPY.opensIn, { time: formatDuration(opens, lang) }) };
  }
  if (isAuction(product)) return { kind: "auction", time: formatDuration(remaining ?? 0, lang) };
  return { kind: "buy" };
}

function ariaFor(product, lang, t) {
  const value = isAuction(product) ? product.currentBid : product.price;
  return `${t(product.title)}, ${moneyLabel(value, lang)}`;
}

/** Square image tile — the information sits on a solid band inside the photo. */
export function LotTile({ product, sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 25vw, 50vw", priority = false, className = "" }) {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const line = usePriceLine(product);
  const buy = line.kind === "buy";
  return (
    <article className={cx("group relative aspect-square overflow-hidden rounded-card bg-surface-2", className)}>
      <Photo image={mainImage(product)} sizes={sizes} priority={priority} />
      <Link href={link(detailPath(product))} aria-label={ariaFor(product, lang, t)} className="absolute inset-0 z-[1] rounded-card outline-offset-[3px]" />
      <div className="pointer-events-none absolute start-3 top-3 z-[2]">
        <SaleTag tag={saleTag(product)} />
      </div>
      <WatchButton product={product} className="absolute end-3 top-3 z-[3]" />
      <div aria-hidden="true" className={cx("vm-band pointer-events-none absolute inset-x-2 bottom-2 z-[2] rounded-[14px] py-2.5 ps-3.5", buy ? "pe-14" : "pe-3.5")}>
        <p className="truncate vm-sm font-semibold opacity-90">{t(product.title)}</p>
        {buy ? (
          <p className="flex items-baseline gap-2">
            <Money value={product.price} className="vm-price" />
            {discountPercent(product) > 0 ? <Money value={product.originalPrice} strike className="vm-xs opacity-60" /> : null}
          </p>
        ) : line.kind === "upcoming" ? (
          <p className="vm-sm font-bold">{line.text}</p>
        ) : (
          <p className="flex flex-wrap items-baseline gap-x-2">
            <Money value={product.currentBid} className="vm-price" />
            <span className="inline-flex items-center gap-1 whitespace-nowrap vm-xs font-semibold opacity-80">
              <Timer aria-hidden="true" className="size-3.5 self-center" />
              <span dir={lang === "ar" ? "rtl" : "ltr"} className="tabular">
                {line.time}
              </span>
            </span>
          </p>
        )}
      </div>
      {buy ? <AddButton product={product} className="absolute bottom-[15px] end-[15px] z-[3]" /> : null}
    </article>
  );
}

/**
 * Feature tile — wide (1/2 of a row) or square (2×2). Uses the lifestyle
 * photo when the lot has one; adds grade, seller and a labelled action.
 * Studio shots are lifted above the band so the product stays visible.
 */
export function FeatureTile({ product, shape = "wide", manifest = false, sizes = "(min-width: 768px) 50vw, 100vw", className = "" }) {
  const { t, ui, lang } = useLang();
  const { link } = useConcept();
  const seller = getSeller(product.seller);
  const grade = GRADES[product.grade];
  const auction = isAuction(product);
  const image = sceneOf(product);
  const thumbs = manifest ? product.images.slice(1, 5) : [];
  return (
    <article
      className={cx(
        "group relative overflow-hidden rounded-card bg-surface-2",
        shape === "wide" ? "aspect-square sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[230px]" : "aspect-square lg:aspect-auto lg:h-full",
        className,
      )}
    >
      <Photo image={image} sizes={sizes} pad={shape === "wide" ? "px-[10%] pt-[5%] pb-[124px] sm:pb-[96px] lg:pb-[132px] min-[1280px]:pb-[96px]" : "px-[12%] pt-[8%] pb-[120px]"} />
      <Link href={link(detailPath(product))} aria-label={ariaFor(product, lang, t)} className="absolute inset-0 z-[1] rounded-card outline-offset-[3px]" />
      <div className="pointer-events-none absolute start-4 top-4 z-[2] flex items-center gap-2">
        <SaleTag tag={saleTag(product)} />
      </div>
      {thumbs.length ? (
        <ul aria-hidden="true" className="pointer-events-none absolute end-16 top-4 z-[2] hidden gap-1.5 sm:flex">
          {thumbs.map((thumb, i) => (
            <li key={i} className="vm-plate size-10 overflow-hidden rounded-full ring-2 ring-white">
              <Img image={thumb} alt="" sizes="40px" className="vm-multiply size-full object-contain p-1" />
            </li>
          ))}
        </ul>
      ) : null}
      <WatchButton product={product} className="absolute end-4 top-4 z-[3]" />
      <div className="vm-band absolute inset-x-3 bottom-3 z-[2] flex flex-wrap items-center justify-between gap-x-5 gap-y-3 rounded-[18px] px-4 py-3.5 sm:ps-5">
        <div aria-hidden="true" className="pointer-events-none min-w-0 flex-1 basis-48">
          <p className="truncate vm-xs font-semibold opacity-75">
            {grade ? t(grade.label) : null}
            {seller ? ` · ${t(seller.name)}` : null}
            {manifest && product.images.length > 1 ? ` · ${t(COPY.manifest, { n: 64 })}` : null}
          </p>
          <p className="mt-0.5 line-clamp-2 vm-md font-bold">{t(product.title)}</p>
        </div>
        <div className="flex items-center gap-4">
          <div aria-hidden="true" className="pointer-events-none text-end">
            <p className="vm-xs font-semibold opacity-75">
              {auction ? (
                <>
                  {t(COPY.currentBid)} · <TimeLeft endsIn={product.endsIn} />
                </>
              ) : discountPercent(product) > 0 ? (
                <Money value={product.originalPrice} strike />
              ) : (
                "\u00a0"
              )}
            </p>
            <Money value={auction ? product.currentBid : product.price} className="vm-price-lg" />
          </div>
          {auction ? (
            <Link href={link(detailPath(product))} className={pillClass("light", "md", "relative z-[3]")}>
              <Gavel aria-hidden="true" className="size-4" />
              {t(COPY.placeBid)}
              <span className="sr-only">: {t(product.title)}</span>
            </Link>
          ) : (
            <AddButton product={product} label size="lg" className="relative z-[3]" />
          )}
        </div>
      </div>
      <span className="sr-only">{ui("inspected")}</span>
    </article>
  );
}

/** Wide auction showcase: photo on the start side, the bid story beside it. */
export function Showcase({ product }) {
  const { t, ui, lang, pl } = useLang();
  const { link } = useConcept();
  const seller = getSeller(product.seller);
  const grade = GRADES[product.grade];
  const remaining = useRemaining(product.endsIn);
  const urgent = remaining != null && remaining <= 3600;
  return (
    <article className="group relative grid w-full grid-cols-[minmax(0,42%)_minmax(0,1fr)] overflow-hidden rounded-card border border-line bg-surface shadow-card lg:grid-cols-[minmax(0,36%)_minmax(0,1fr)] xl:grid-cols-[minmax(0,40%)_minmax(0,1fr)]">
      <div className="relative min-h-[196px] sm:min-h-[232px]">
        <Photo image={mainImage(product)} sizes="(min-width: 1024px) 20vw, 40vw" pad="p-[11%]" />
        <span className="absolute start-3 top-3 z-[2] inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#181614] px-2.5 vm-xs font-extrabold text-white sm:px-3">
          <Gavel aria-hidden="true" className="hidden size-3.5 sm:block" />
          {t(COPY.openForBids)}
        </span>
      </div>
      <div className="flex min-w-0 flex-col p-4 sm:p-6 lg:p-5 xl:p-6">
        <p className={cx("inline-flex items-center gap-1.5 vm-sm font-bold", urgent ? "text-live" : "text-fg-2")}>
          <Timer aria-hidden="true" className="size-4" />
          {t(COPY.closesIn, { time: formatDuration(remaining ?? 0, lang) })}
        </p>
        <h3 className="mt-2 line-clamp-2 vm-h3">
          <Link href={link(detailPath(product))} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {t(product.title)}
          </Link>
        </h3>
        <p className="mt-1 vm-sm text-fg-2">
          {grade ? t(grade.label) : null}
          {seller ? ` · ${t(seller.name)}` : null}
        </p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <div>
            <p className="vm-xs font-semibold text-fg-3">{ui("currentBid")}</p>
            <Money value={product.currentBid} className="vm-price-lg text-fg" />
            <p className="vm-xs text-fg-3">{pl("bids", product.bidCount)}</p>
          </div>
          <span className={pillClass("solid", "md", "relative z-[2] pointer-events-none")}>
            {t(COPY.placeBid)}
            <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
