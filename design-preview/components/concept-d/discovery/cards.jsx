"use client";

import Link from "next/link";
import { Check, Gavel, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { getSeller } from "@/data/sellers";
import { detailPath, discountPercent, isAuction, isNewListing } from "@/lib/catalog";
import { useRemaining } from "@/lib/clock";
import { formatDuration } from "@/lib/format";
import { COPY } from "./copy";
import { AddButton, GradeChip, SaveButton, TimeLeft, btnClass, cx } from "./ui";

const unitsOf = (product) => (product.palletContents || []).reduce((sum, line) => sum + line.qty, 0);

function Badge({ product }) {
  const { t, ui } = useLang();
  const pct = discountPercent(product);
  if (product.status === "scheduled") return <span className="inline-flex h-6 items-center rounded-full bg-white px-2 dc-xs font-bold text-[#14161c]">{ui("upcoming")}</span>;
  if (isAuction(product)) {
    return (
      <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[#14161c] px-2 dc-xs font-bold text-white">
        <Gavel aria-hidden="true" className="size-3" />
        {ui("auction")}
      </span>
    );
  }
  if (product.stock <= 0) return <span className="inline-flex h-6 items-center rounded-full bg-white px-2 dc-xs font-bold text-[#474d5b]">{t(COPY.soldOut)}</span>;
  if (pct > 0) {
    return (
      <span dir="ltr" className="inline-flex h-6 items-center rounded-full bg-[#d13d17] px-2 dc-xs font-bold text-white">
        −{pct}%
      </span>
    );
  }
  if (isNewListing(product)) return <span className="inline-flex h-6 items-center rounded-full bg-white px-2 dc-xs font-bold text-[#14161c]">{ui("newListing")}</span>;
  return null;
}

function Countdown({ product, className = "" }) {
  const { t, ui, lang } = useLang();
  const remaining = useRemaining(product.endsIn);
  if (product.status === "scheduled") {
    const opens = Math.max(0, (product.startsIn ?? 0) - ((product.endsIn ?? 0) - (remaining ?? 0)));
    return <span className={cx("inline-flex h-7 items-center rounded-full bg-white px-2.5 dc-xs font-bold text-[#14161c]", className)}>{t(COPY.opensIn, { time: formatDuration(opens, lang) })}</span>;
  }
  const urgent = remaining != null && remaining <= 3600;
  return (
    <span className={cx("inline-flex h-7 items-center gap-1 rounded-full bg-white px-2.5 dc-xs font-bold", urgent ? "text-[#d4163e]" : "text-[#14161c]", className)}>
      <Timer aria-hidden="true" className="size-3.5" />
      <span className="sr-only">{ui("closesIn")} </span>
      <TimeLeft endsIn={product.endsIn} />
    </span>
  );
}

function PriceBlock({ product, large = false }) {
  const { ui } = useLang();
  const auction = isAuction(product);
  const pct = discountPercent(product);
  return (
    <div className="min-w-0">
      {auction ? <p className="dc-xs text-fg-3">{product.status === "scheduled" ? ui("startingBid") : ui("currentBid")}</p> : null}
      <p className="flex flex-wrap items-baseline gap-x-1.5">
        <Money value={auction ? product.currentBid : product.price} className={cx(large ? "dc-price-lg" : "dc-price", "text-fg")} />
        {!auction && pct > 0 ? <Money value={product.originalPrice} strike className="dc-xs text-fg-3" /> : null}
      </p>
    </div>
  );
}

function Action({ product }) {
  const { t } = useLang();
  const { link } = useConcept();
  if (isAuction(product)) {
    return (
      <Link href={link(detailPath(product))} className={btnClass("soft", "xs", "relative z-10")}>
        {t(COPY.bidNow)}
        <span className="sr-only">: {t(product.title)}</span>
      </Link>
    );
  }
  return <AddButton product={product} className="relative" />;
}

/** Compact discovery card for rails and the feed. */
export function DiscoveryCard({ product, sizes = "(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 46vw", priority = false }) {
  const { t } = useLang();
  const { link } = useConcept();
  const units = unitsOf(product);
  return (
    <article className="dc-lift group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface">
      <div className="dc-plate relative aspect-square overflow-hidden">
        <Img image={product.images[0]} alt="" sizes={sizes} priority={priority} className="dc-multiply absolute inset-0 size-full object-contain p-[13%] transition-transform duration-500 group-hover:scale-[1.04]" />
        <div className="pointer-events-none absolute start-2.5 top-2.5 z-[2]">
          <Badge product={product} />
        </div>
        <SaveButton product={product} className="absolute end-2.5 top-2.5 z-[3]" />
        {isAuction(product) ? <Countdown product={product} className="pointer-events-none absolute bottom-2.5 start-2.5 z-[2]" /> : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 dc-sm font-semibold text-fg">
          <Link href={link(detailPath(product))} className="after:absolute after:inset-0 after:z-[1] after:content-[''] hover:underline">
            {t(product.title)}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <GradeChip grade={product.grade} />
          {units > 0 ? <span className="dc-xs text-fg-3">{t(COPY.palletUnits, { units })}</span> : null}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <PriceBlock product={product} />
          <Action product={product} />
        </div>
      </div>
    </article>
  );
}

/** Wide feed card: the photo beside the full story. */
export function WideCard({ product }) {
  const { t } = useLang();
  const { link } = useConcept();
  const seller = getSeller(product.seller);
  const image = product.images.find((i) => i?.kind === "scene") || product.images[0];
  const scene = image?.kind === "scene";
  return (
    <article className="dc-lift group relative grid h-full overflow-hidden rounded-card border border-line bg-surface sm:grid-cols-2">
      <div className={cx("relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:min-h-[260px]", scene ? "bg-surface-2" : "dc-plate")}>
        <Img
          image={image}
          alt=""
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 92vw"
          className={cx("absolute inset-0 size-full transition-transform duration-500 group-hover:scale-[1.04]", scene ? "object-cover" : "dc-multiply object-contain p-[12%]")}
        />
        <div className="pointer-events-none absolute start-3 top-3 z-[2]">
          <Badge product={product} />
        </div>
        <SaveButton product={product} className="absolute end-3 top-3 z-[3]" />
      </div>
      <div className="flex flex-col gap-2 p-4 sm:p-5">
        {seller ? <p className="dc-xs font-semibold text-fg-3">{t(seller.name)}</p> : null}
        <h3 className="dc-h3 text-fg">
          <Link href={link(detailPath(product))} className="after:absolute after:inset-0 after:z-[1] after:content-[''] hover:underline">
            {t(product.title)}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <GradeChip grade={product.grade} />
          {isAuction(product) ? <Countdown product={product} className="border border-line" /> : null}
        </div>
        {product.highlights?.length ? (
          <ul className="mt-1 hidden space-y-1 sm:block">
            {product.highlights.slice(0, 2).map((line) => (
              <li key={line.en} className="flex gap-1.5 dc-xs text-fg-2">
                <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-success" strokeWidth={2.6} />
                {t(line)}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <PriceBlock product={product} large />
          <Action product={product} />
        </div>
      </div>
    </article>
  );
}
