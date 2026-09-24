"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useRemaining } from "@/lib/clock";
import { auctionPhase, detailPath, discountPercent, getCategory, getSeller, isAuction } from "@/lib/catalog";
import { Money } from "@/components/shared/ui/Money";
import { Img } from "@/components/shared/ui/Img";
import { GradeChip } from "../ui/GradeChip";
import { StatusLabel } from "../ui/Status";
import { CountdownText } from "../ui/Countdown";
import { WatchButton } from "../ui/Actions";

/** Horizontal catalogue row used by the list view. */
export function ListRow({ product }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const auction = isAuction(product);
  const upcoming = product.status === "scheduled";
  const remaining = useRemaining(upcoming ? product.startsIn : product.endsIn);
  const phase = auction ? auctionPhase(product, remaining) : null;
  const href = link(detailPath(product));
  const off = discountPercent(product);

  return (
    <article className="group relative grid grid-cols-[96px_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[140px_1fr_auto] sm:gap-6">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-square overflow-hidden rounded-card bg-plate">
        <Img image={product.images[0]} alt="" sizes="140px" className="a-plate-img absolute inset-0 size-full object-contain p-[10%] transition-transform duration-700 group-hover:scale-105" />
      </Link>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          {auction ? <StatusLabel status={phase === "critical" ? "critical" : phase === "urgent" ? "urgent" : phase} /> : <StatusLabel status={product.stock > 0 ? "buyNow" : "unavailable"} />}
          <span className="a-eyebrow !text-fg-3">{product.lot}</span>
        </div>
        <h3 className="a-serif mt-2 text-[20px] leading-snug text-fg">
          <Link href={href} className="a-underline-hover">
            {t(product.title)}
          </Link>
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-fg-2">
          <GradeChip grade={product.grade} size="sm" />
          <span>{t(getCategory(product.category)?.name)}</span>
          <span aria-hidden="true">·</span>
          <span>{t(getSeller(product.seller)?.name)}</span>
        </div>
      </div>
      <div className="col-span-2 flex items-end justify-between gap-6 sm:col-span-1 sm:flex-col sm:items-end sm:justify-start">
        <div className="text-start sm:text-end">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-fg-3 rtl:text-xs rtl:normal-case rtl:tracking-normal">{auction ? ui(upcoming ? "startingBid" : "currentBid") : ui("price")}</p>
          <p className="a-serif text-[26px] leading-tight text-fg">
            <Money value={auction ? product.currentBid : product.price} symbolClassName="text-[0.8em]" />
          </p>
          {!auction && off ? <Money value={product.originalPrice} strike className="text-[13px] text-fg-3" /> : null}
        </div>
        <div className="flex items-center gap-3 text-[13px]">
          {auction ? (
            <span className="text-fg-2">
              {pl("bids", product.bidCount)} · {phase === "sold" ? ui("sold") : <CountdownText seconds={remaining} className="font-semibold" />}
            </span>
          ) : (
            <span className={product.stock > 0 && product.stock <= 3 ? "text-live" : "text-fg-2"}>{product.stock > 0 ? ui("available", { n: product.stock }) : ui("outOfStock")}</span>
          )}
          <WatchButton slug={product.slug} className="!shadow-none !bg-surface-2" />
        </div>
      </div>
    </article>
  );
}
