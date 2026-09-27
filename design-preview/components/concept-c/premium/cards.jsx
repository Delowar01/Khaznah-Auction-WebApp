"use client";

import Link from "next/link";
import { Gavel, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { CITIES, getSeller } from "@/data/sellers";
import { detailPath, discountPercent, isNewListing } from "@/lib/catalog";
import { useRemaining } from "@/lib/clock";
import { formatDuration } from "@/lib/format";
import { COPY } from "./copy";
import { AddToBag, GradeMark, SaveButton, TimeLeft, btnClass, cx } from "./ui";

/** Lifestyle photo when the lot has one, else its studio shot. */
export const sceneOf = (product) => product.images.find((image) => image?.kind === "scene") || product.images[0];

function StudioImage({ image, sizes, priority = false, pad = "p-[14%]", className = "" }) {
  const studio = image?.kind !== "scene";
  return (
    <Img
      image={image}
      alt=""
      sizes={sizes}
      priority={priority}
      className={cx("absolute inset-0 size-full", studio ? cx("pm-multiply object-contain", pad) : "object-cover", className)}
    />
  );
}

function Tag({ children, tone = "light" }) {
  return (
    <span
      className={cx(
        "inline-flex h-6 items-center rounded-control px-2 pm-xs font-semibold",
        tone === "accent" ? "bg-surface text-accent" : tone === "ink" ? "bg-primary text-on-primary" : "bg-surface text-fg",
      )}
    >
      {children}
    </span>
  );
}

/** Tall portrait card for Buy Now lots: image first, details beneath. */
export function ProductCard({ product, sizes = "(min-width: 1280px) 24vw, (min-width: 768px) 30vw, 46vw", priority = false }) {
  const { t } = useLang();
  const { link } = useConcept();
  const seller = getSeller(product.seller);
  const pct = discountPercent(product);
  const soldOut = product.stock <= 0;
  return (
    <article className="group relative flex h-full flex-col">
      <div className="pm-plate pm-zoom relative aspect-[4/5] overflow-hidden rounded-card">
        <StudioImage image={product.images[0]} sizes={sizes} priority={priority} />
        <div className="pointer-events-none absolute start-3 top-3 z-[2] flex gap-1.5">
          {soldOut ? <Tag>{t(COPY.soldOut)}</Tag> : pct > 0 ? <Tag tone="accent">{<span dir="ltr">−{pct}%</span>}</Tag> : isNewListing(product) ? <Tag>{t(COPY.newTag)}</Tag> : null}
        </div>
        <SaveButton product={product} className="absolute end-3 top-3 z-[3]" />
        <div className="absolute inset-x-3 bottom-3 z-[3] hidden translate-y-1 opacity-0 transition duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
          <AddToBag product={product} className="w-full" />
        </div>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="truncate pm-xs text-fg-3">{seller ? t(seller.name) : null}</p>
        <h3 className="mt-1 line-clamp-2 pm-md font-medium text-fg">
          <Link href={link(detailPath(product))} className="after:absolute after:inset-0 after:z-[1] after:content-[''] hover:underline">
            {t(product.title)}
          </Link>
        </h3>
        <p className="mt-1 pm-xs text-fg-2">
          <GradeMark grade={product.grade} />
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <Money value={product.price} className="pm-price text-fg" />
            {pct > 0 ? <Money value={product.originalPrice} strike className="pm-xs text-fg-3" /> : null}
          </p>
          <AddToBag product={product} compact className="relative lg:hidden" />
        </div>
      </div>
    </article>
  );
}

/** Small square auction card: countdown on the image, bid story beneath. */
export function AuctionCard({ product, sizes = "(min-width: 1024px) 18vw, 46vw" }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const remaining = useRemaining(product.endsIn);
  const urgent = remaining != null && remaining <= 3600;
  return (
    <article className="group relative flex flex-col">
      <div className="pm-plate pm-zoom relative aspect-square overflow-hidden rounded-card">
        <StudioImage image={product.images[0]} sizes={sizes} pad="p-[16%]" />
        <SaveButton product={product} className="absolute end-2.5 top-2.5 z-[3]" />
        <span className={cx("pointer-events-none absolute bottom-2.5 start-2.5 z-[2] inline-flex h-7 items-center gap-1.5 rounded-control bg-surface px-2 pm-xs font-semibold", urgent ? "text-live" : "text-fg")}>
          <Timer aria-hidden="true" className="size-3.5" />
          <span className="sr-only">{ui("closesIn")} </span>
          <TimeLeft endsIn={product.endsIn} />
        </span>
      </div>
      <h3 className="mt-3 line-clamp-2 pm-sm font-medium text-fg">
        <Link href={link(detailPath(product))} className="after:absolute after:inset-0 after:z-[1] after:content-[''] hover:underline">
          {t(product.title)}
        </Link>
      </h3>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <span className="pm-xs text-fg-3">{ui("currentBid")}</span>
        <Money value={product.currentBid} className="pm-price text-fg" />
      </p>
      <p className="pm-xs text-fg-3">{pl("bids", product.bidCount)}</p>
    </article>
  );
}

/** The featured auction: a large photograph beside the full bid story. */
export function FeaturedAuction({ product, label }) {
  const { t, ui, lang, pl } = useLang();
  const { link } = useConcept();
  const seller = getSeller(product.seller);
  const remaining = useRemaining(product.endsIn);
  const urgent = remaining != null && remaining <= 3600;
  const image = sceneOf(product);
  return (
    <article className="group relative grid h-full overflow-hidden rounded-card bg-surface ring-1 ring-line md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div className="pm-plate pm-zoom relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[360px] lg:aspect-[16/10] lg:min-h-0 xl:aspect-auto xl:min-h-[440px]">
        <StudioImage image={image} sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" pad="p-[12%]" />
        <SaveButton product={product} className="absolute end-3 top-3 z-[3]" />
      </div>
      <div className="flex flex-col p-5 sm:p-7">
        <p className="pm-eyebrow text-accent">{label}</p>
        <p className={cx("mt-3 inline-flex items-center gap-2 pm-sm font-semibold", urgent ? "text-live" : "text-fg-2")}>
          <Timer aria-hidden="true" className="size-4" />
          {t(COPY.closesIn, { time: formatDuration(remaining ?? 0, lang) })}
        </p>
        <h3 className="mt-2 pm-h3 text-balance text-fg lg:text-[26px] lg:leading-[32px]">
          <Link href={link(detailPath(product))} className="after:absolute after:inset-0 after:z-[1] after:content-[''] hover:underline">
            {t(product.title)}
          </Link>
        </h3>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 pm-xs text-fg-2">
          <GradeMark grade={product.grade} />
          {seller ? (
            <span>
              {t(seller.name)} · {t(CITIES[seller.city])}
            </span>
          ) : null}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
          <div>
            <dt className="pm-label text-fg-3">{ui("currentBid")}</dt>
            <dd className="mt-1">
              <Money value={product.currentBid} className="pm-price-lg text-fg" />
            </dd>
          </div>
          <div>
            <dt className="pm-label text-fg-3">{ui("startingBid")}</dt>
            <dd className="mt-1">
              <Money value={product.startingBid} className="pm-price-lg text-fg-2" />
            </dd>
          </div>
        </dl>
        <p className="mt-2 pm-xs text-fg-3">{pl("bids", product.bidCount)}</p>
        <div className="mt-auto pt-6">
          <Link href={link(detailPath(product))} className={btnClass("ink", "md", "relative z-[2] w-full sm:w-auto")}>
            <Gavel aria-hidden="true" className="size-4" />
            {ui("placeBid")}
            <span className="sr-only">: {t(product.title)}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
