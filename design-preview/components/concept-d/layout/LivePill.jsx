"use client";

import Link from "next/link";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { formatNumber } from "@/lib/format";
import { useLive } from "../market/MarketProvider";

/** "● Live · 1,284" — links to the live room; viewers tick in real time. */
export function LivePill({ className = "" }) {
  const { link } = useConcept();
  const { ui, pl } = useLang();
  const live = useLive();
  const viewers = live?.viewers ?? 0;
  return (
    <Link
      href={link("/live-auction")}
      className={`h-9 shrink-0 items-center gap-2 rounded-full border border-live/30 bg-live/10 px-3 text-[13px] font-medium transition-colors hover:border-live/50 hover:bg-live/15 ${className}`}
    >
      <span aria-hidden="true" className="kz-live-dot" />
      <span className="d-label text-live">{ui("live")}</span>
      <span aria-hidden="true" className="text-fg-3">
        ·
      </span>
      <span aria-hidden="true" className="d-num text-fg-2">
        {formatNumber(viewers)}
      </span>
      <span className="sr-only">{pl("viewers", viewers)}</span>
    </Link>
  );
}
