"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { getCategory } from "@/data/categories";
import { isAuction } from "@/data/products";
import { detailPath, discountPercent } from "@/lib/catalog";
import { formatDuration, formatNumber } from "@/lib/format";
import { LotImage } from "../ui/LotImage";
import { GradeChip } from "../ui/GradeChip";
import { StatusChip, DeltaChip } from "../ui/Chips";
import { TimeBar } from "../ui/TimeBar";
import { StockMeter } from "../ui/Meters";
import { useCopy } from "../lib/useCopy";
import { auctionChip, useAuctionView } from "./useLotView";

const TONE_TEXT = { ink: "text-fg", warning: "text-warning", danger: "text-live", upcoming: "d-ink", muted: "text-fg-3" };
const TD = "px-3 py-3 align-middle";

function ItemCell({ product, href }) {
  const { t } = useLang();
  return (
    <td className={`${TD} min-w-0`}>
      <div className="flex min-w-0 items-center gap-3">
        <LotImage image={product.images[0]} alt="" sizes="56px" className="size-12 shrink-0 rounded-lg ring-1 ring-line" inset="p-1" />
        <div className="min-w-0">
          <Link href={href} className="block max-w-[26rem] truncate text-sm font-medium text-fg hover:underline">
            {t(product.title)}
          </Link>
          <p className="mt-1 flex items-center gap-2 text-xs text-fg-3">
            <GradeChip grade={product.grade} size="sm" />
            <span className="truncate">{t(getCategory(product.category)?.name)}</span>
          </p>
        </div>
      </div>
    </td>
  );
}

function ActionCell({ href, label, gold }) {
  return (
    <td className={`${TD} text-end`}>
      <Link
        href={href}
        className={`inline-flex h-9 items-center gap-1.5 rounded-control px-3 text-[13px] font-medium transition-colors ${
          gold ? "bg-accent/12 text-auction ring-1 ring-inset ring-accent/35 hover:bg-accent/20" : "text-fg-2 ring-1 ring-inset ring-line-strong hover:bg-surface-2 hover:text-fg"
        }`}
      >
        {label}
        <DirIcon icon={ArrowRight} className="size-3.5" />
      </Link>
    </td>
  );
}

function AuctionRow({ product, showType }) {
  const { link } = useConcept();
  const { lang, ui } = useLang();
  const c = useCopy();
  const v = useAuctionView(product);
  const href = link(detailPath(product));
  const upcoming = v.phase === "upcoming";
  const closed = v.phase === "ended" || v.phase === "sold";
  const seconds = upcoming ? v.startsIn : v.remaining;
  return (
    <tr className="border-t border-line transition-colors hover:bg-[var(--d-row-hover)]">
      <td className={`${TD} d-num whitespace-nowrap text-xs text-fg-3`} dir="ltr">
        {product.lot}
      </td>
      <ItemCell product={product} href={href} />
      {showType ? (
        <td className={TD}>
          <StatusChip status={auctionChip(v.phase)} />
        </td>
      ) : null}
      <td className={`${TD} whitespace-nowrap text-end`}>
        <span key={v.flash} className={`d-num inline-block rounded px-1 text-[15px] font-medium ${v.own ? "text-auction" : "text-fg"} ${v.flash ? "d-flash" : ""}`}>
          <Money value={v.currentBid} />
        </span>
        {v.step > 0 && !closed ? (
          <span className="mt-1 flex justify-end">
            <DeltaChip amount={v.step} className="h-5" />
          </span>
        ) : null}
      </td>
      <td className={`${TD} d-num text-end text-sm text-fg-2`}>{formatNumber(v.bidCount)}</td>
      <td className={`${TD} d-num hidden text-end text-sm text-fg-2 xl:table-cell`}>{formatNumber(v.watchers)}</td>
      <td className={`${TD} w-44`}>
        <p className={`d-num text-end text-sm font-medium ${TONE_TEXT[v.tone]}`}>
          {closed ? ui(v.phase === "sold" ? "sold" : "ended") : formatDuration(seconds, lang, "clock")}
        </p>
        <TimeBar fraction={v.fraction} tone={v.tone} className="mt-1.5" />
        {upcoming ? <p className="mt-1 text-end text-[11px] d-ink">{ui("startsIn")}</p> : null}
      </td>
      <ActionCell href={href} label={closed || upcoming ? c("view") : c("bid")} gold={!closed && !upcoming && v.phase === "critical"} />
    </tr>
  );
}

function BuyNowRow({ product, showType }) {
  const { link } = useConcept();
  const c = useCopy();
  const href = link(detailPath(product));
  const pct = discountPercent(product);
  return (
    <tr className="border-t border-line transition-colors hover:bg-[var(--d-row-hover)]">
      <td className={`${TD} d-num whitespace-nowrap text-xs text-fg-3`} dir="ltr">
        {product.lot}
      </td>
      <ItemCell product={product} href={href} />
      {showType ? (
        <td className={TD}>
          <StatusChip status={product.stock > 0 ? "buyNow" : "unavailable"} />
        </td>
      ) : null}
      <td className={`${TD} whitespace-nowrap text-end`}>
        <Money value={product.price} className="d-num text-[15px] font-medium text-fg" />
        {pct > 0 ? (
          <span className="mt-1 flex justify-end">
            <DeltaChip percent={pct} tone="down" className="h-5" />
          </span>
        ) : null}
      </td>
      <td className={`${TD} d-num text-end text-sm text-fg-3`}>—</td>
      <td className={`${TD} d-num hidden text-end text-sm text-fg-2 xl:table-cell`}>{formatNumber(product.watchers)}</td>
      <td className={`${TD} w-44`}>
        <StockMeter stock={product.stock} segments={10} compact />
      </td>
      <ActionCell href={href} label={c("view")} />
    </tr>
  );
}

export function BoardRow({ product, showType = false }) {
  return isAuction(product) ? <AuctionRow product={product} showType={showType} /> : <BuyNowRow product={product} showType={showType} />;
}
