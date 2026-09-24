"use client";

import { Eye } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { COPY } from "../copy";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";

const STATUS = {
  live: { tone: "text-primary", label: (t) => t(COPY.statusOpen) },
  urgent: { tone: "text-warning", label: (t, ui) => ui("endingSoon") },
  critical: { tone: "text-live", label: (t, ui) => ui("closingNow"), live: true },
  upcoming: { tone: "text-primary", label: (t) => t(COPY.statusUpcoming), outline: true },
  ended: { tone: "text-fg-3", label: (t, ui) => ui("auctionEnded") },
  sold: { tone: "text-fg", label: (t, ui) => ui("sold") },
};

/** Auction status with its diamond (pulsing brick when closing), plus watchers. */
export function StatusLine({ phase, watchers, className = "" }) {
  const { t, ui, pl } = useLang();
  const s = STATUS[phase] || STATUS.live;
  return (
    <div className={cx("flex items-center justify-between gap-3", className)}>
      <p className={cx("flex items-center gap-2.5 text-sm font-semibold transition-colors duration-500", s.tone)}>
        <Diamond size={8} variant={s.live ? "live" : s.outline ? "outline" : "solid"} className={phase === "sold" ? "text-accent" : ""} />
        {s.label(t, ui)}
      </p>
      {watchers != null ? (
        <p className="flex items-center gap-1.5 text-xs text-fg-3">
          <Eye aria-hidden="true" className="size-3.5" />
          {pl("watching", watchers)}
        </p>
      ) : null}
    </div>
  );
}
