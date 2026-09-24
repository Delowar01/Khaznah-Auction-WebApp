"use client";

import Link from "next/link";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { isAuction } from "@/data/products";
import { detailPath, discountPercent } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { LotImage } from "../ui/LotImage";
import { GradeChip } from "../ui/GradeChip";
import { DeltaChip } from "../ui/Chips";
import { TimeBar } from "../ui/TimeBar";
import { StockMeter } from "../ui/Meters";
import { compactTime } from "../lib/data";
import { useAuctionView } from "./useLotView";

const TONE_TEXT = { ink: "text-fg-2", warning: "text-warning", danger: "text-live", upcoming: "d-ink", muted: "text-fg-3" };

function Frame({ product, children }) {
  const { link } = useConcept();
  const { t } = useLang();
  return (
    <li className="d-panel relative flex gap-3 p-3">
      <LotImage image={product.images[0]} alt="" sizes="72px" className="size-[68px] shrink-0 rounded-lg" inset="p-1.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="d-num text-[11px] text-fg-3" dir="ltr">
            {product.lot}
          </span>
          <GradeChip grade={product.grade} size="sm" />
        </div>
        <Link href={link(detailPath(product))} className="mt-1 line-clamp-1 text-sm font-medium text-fg after:absolute after:inset-0 after:rounded-card">
          {t(product.title)}
        </Link>
        {children}
      </div>
    </li>
  );
}

function AuctionItem({ product }) {
  const { lang, ui, pl } = useLang();
  const v = useAuctionView(product);
  const closed = v.phase === "ended" || v.phase === "sold";
  const seconds = v.phase === "upcoming" ? v.startsIn : v.remaining;
  return (
    <Frame product={product}>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span key={v.flash} className={`d-num rounded px-0.5 text-base font-medium ${v.own ? "text-auction" : "text-fg"} ${v.flash ? "d-flash" : ""}`}>
          <Money value={v.currentBid} />
        </span>
        <span className={`d-num text-xs font-medium ${TONE_TEXT[v.tone]}`}>
          {closed ? ui(v.phase === "sold" ? "sold" : "ended") : compactTime(seconds, lang)}
        </span>
      </div>
      <TimeBar fraction={v.fraction} tone={v.tone} className="mt-1.5" />
      <p className="d-num mt-1.5 text-[11px] text-fg-3">
        {pl("bids", v.bidCount)} · {formatNumber(v.watchers)}
      </p>
    </Frame>
  );
}

function BuyNowItem({ product }) {
  const pct = discountPercent(product);
  return (
    <Frame product={product}>
      <div className="mt-2 flex items-center gap-2">
        <Money value={product.price} className="d-num text-base font-medium text-fg" />
        {pct > 0 ? <DeltaChip percent={pct} tone="down" className="h-5" /> : null}
      </div>
      <StockMeter stock={product.stock} segments={10} compact className="mt-1.5" />
    </Frame>
  );
}

/** Stacked board row for phones. */
export function BoardItem({ product }) {
  return isAuction(product) ? <AuctionItem product={product} /> : <BuyNowItem product={product} />;
}
