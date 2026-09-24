"use client";

import Link from "next/link";
import { ArrowRight, CornerDownLeft, LayoutGrid, Search } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { CITIES } from "@/data/sellers";
import { isAuction } from "@/data/products";
import { useLot } from "../market/MarketProvider";
import { LotImage } from "../ui/LotImage";
import { SellerAvatar } from "../ui/SellerAvatar";
import { compactTime, toneOf } from "../lib/data";
import { useCopy } from "../lib/useCopy";

const TIME_TONE = { ink: "text-fg-2", warning: "text-warning", danger: "text-live", upcoming: "d-ink", muted: "text-fg-3" };

function LotMeta({ product }) {
  const { lang, ui } = useLang();
  const auction = useLot(product.slug);
  if (!isAuction(product)) {
    return (
      <span className="flex flex-col items-end gap-0.5">
        <Money value={product.price} className="d-num text-sm font-medium text-fg" />
        <span className="text-[11px] text-fg-3">{ui("buyNow")}</span>
      </span>
    );
  }
  const phase = auction?.phase;
  const seconds = phase === "upcoming" ? auction.startsIn : auction?.remaining;
  return (
    <span className="flex flex-col items-end gap-0.5">
      <Money value={auction?.currentBid ?? product.currentBid} className="d-num text-sm font-medium text-fg" />
      <span className={`d-num text-[11px] ${TIME_TONE[toneOf(phase)]}`}>
        {phase === "sold" ? ui("sold") : phase === "ended" ? ui("ended") : compactTime(seconds, lang)}
      </span>
    </span>
  );
}

/** One row in the command palette (role="option"; focus stays in the input). */
export function PaletteOption({ item, active, onPick, onHover, query }) {
  const { t, pl } = useLang();
  const c = useCopy();
  const base = `flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 text-start outline-none transition-colors ${active ? "bg-surface-2 ring-1 ring-inset ring-line-strong" : ""}`;
  const common = {
    id: item.id,
    role: "option",
    "aria-selected": active,
    tabIndex: -1,
    href: item.href,
    onClick: onPick,
    onMouseMove: onHover,
    className: base,
  };

  if (item.kind === "lot") {
    const p = item.product;
    return (
      <Link {...common}>
        <LotImage image={p.images[0]} alt="" sizes="48px" className="size-11 shrink-0 rounded-lg" inset="p-1" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-fg">{t(p.title)}</span>
          <span className="d-num block text-[11.5px] text-fg-3" dir="ltr">
            {p.lot}
          </span>
        </span>
        <LotMeta product={p} />
      </Link>
    );
  }

  if (item.kind === "category") {
    const cat = item.category;
    return (
      <Link {...common}>
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-surface-2 text-fg-2 ring-1 ring-inset ring-line">
          <LayoutGrid aria-hidden="true" className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-fg">{t(cat.name)}</span>
          <span className="block truncate text-xs text-fg-3">{t(cat.blurb)}</span>
        </span>
        <span className="d-num text-xs text-fg-3">{pl("lots", cat.count)}</span>
      </Link>
    );
  }

  if (item.kind === "seller") {
    const s = item.seller;
    return (
      <Link {...common}>
        <SellerAvatar seller={s} size="md" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-fg">{t(s.name)}</span>
          <span className="block truncate text-xs text-fg-3">{t(CITIES[s.city])}</span>
        </span>
        <DirIcon icon={ArrowRight} className="size-4 text-fg-3" />
      </Link>
    );
  }

  return (
    <Link {...common}>
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/15 d-ink">
        <Search aria-hidden="true" className="size-4" />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg">{c("paletteSeeAll", { q: query.trim() })}</span>
      <CornerDownLeft aria-hidden="true" className="flip-rtl size-4 text-fg-3" />
    </Link>
  );
}
