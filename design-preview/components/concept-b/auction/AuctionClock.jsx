"use client";

import { CalendarClock, CircleCheck, Clock, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useAuctionClock, usePhaseLabel } from "@/components/shared/auction/hooks";
import { useElapsed } from "@/lib/clock";
import { UNIT_LABELS } from "@/lib/format";
import { Badge } from "../ui/Badge";
import { cx } from "../ui/cx";
import { lotProgress } from "../utils/lots";

const PHASES = {
  live: { tone: "success", icon: Clock },
  urgent: { tone: "warning", icon: Timer },
  critical: { tone: "danger", icon: Timer },
  upcoming: { tone: "primary", icon: CalendarClock },
  ended: { tone: "neutral", icon: CircleCheck },
  sold: { tone: "ink", icon: CircleCheck },
};

/** Status chip for an auction phase, on light surfaces. */
export function PhaseBadge({ phase, size = "md" }) {
  const label = usePhaseLabel(phase);
  const item = PHASES[phase] || PHASES.live;
  return (
    <Badge tone={item.tone} size={size} icon={item.icon}>
      {label}
    </Badge>
  );
}

// Status dot and digit colours on the navy header (each clears 4.5:1 there).
const DOT = {
  live: "bg-[#47cd89]",
  urgent: "bg-[#fdb022]",
  critical: "bg-[#ff8a80]",
  upcoming: "bg-[#a4bcfd]",
  ended: "bg-white/55",
  sold: "bg-white/55",
};
const DIGITS = { default: "text-white", urgent: "text-[#fdb022]", critical: "text-[#ff8a80]" };
const pad = (n) => String(n).padStart(2, "0");

/**
 * Navy head of the bid panel: status and lot number, then the countdown as
 * segmented digits (one spoken phrase for screen readers), the "time
 * extended" note and a thin progress line through the auction.
 */
export function ClockHeader({ detail }) {
  const { ui, lang } = useLang();
  const { product, auction } = detail;
  const clock = useAuctionClock(auction);
  const label = usePhaseLabel(auction.phase);
  const elapsed = useElapsed();
  const units = UNIT_LABELS[lang] || UNIT_LABELS.en;
  const { days, hours, minutes, seconds } = clock.parts;
  const cells = [
    ...(days > 0 ? [{ key: "days", value: days }] : []),
    { key: "hours", value: hours },
    { key: "minutes", value: minutes },
    { key: "seconds", value: seconds },
  ];
  const progress = clock.upcoming ? 0 : lotProgress(product, elapsed);

  return (
    <div className="kb-on-dark bg-[var(--kb-indigo-950)] px-4 pb-4 pt-3 text-white sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex min-w-0 items-center gap-2 kb-sm font-bold">
          <span aria-hidden="true" className={cx("size-2 shrink-0 rounded-full", DOT[auction.phase] || DOT.live)} />
          {label}
        </p>
        <p className="shrink-0 kb-xs text-white/75">
          {ui("lotNumber")}{" "}
          <span dir="ltr" className="font-semibold text-white tabular">
            {product.lot}
          </span>
        </p>
      </div>
      {clock.closed ? null : (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p aria-hidden="true" className="kb-xs font-semibold text-white/80">
              {clock.label}
            </p>
            {clock.extended ? <span className="rounded-md bg-white/10 px-1.5 py-0.5 kb-2xs font-bold text-[var(--kb-gold-soft)]">{ui("timeExtended")}</span> : null}
          </div>
          <p className="sr-only">{clock.spoken}</p>
          <div aria-hidden="true" dir="ltr" className="flex gap-1.5">
            {cells.map((cell) => (
              <div key={cell.key} className="flex min-w-0 flex-1 flex-col items-center rounded-lg bg-white/10 px-1 py-1.5">
                <span className={cx("kb-xl font-extrabold tabular", DIGITS[clock.tone])}>{pad(cell.value)}</span>
                <span dir={lang === "ar" ? "rtl" : "ltr"} className="kb-2xs text-white/75">
                  {units[cell.key]}
                </span>
              </div>
            ))}
          </div>
          {clock.upcoming ? null : (
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15" role="presentation">
              <div className="h-full rounded-full bg-[var(--kb-gold-soft)] transition-[width] duration-1000 ease-linear" style={{ width: `${Math.max(2, progress * 100)}%` }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
