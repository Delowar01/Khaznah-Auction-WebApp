"use client";

import { CalendarClock, Clock, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useRemaining } from "@/lib/clock";
import { auctionPhase } from "@/lib/catalog";
import { durationParts, formatDuration, UNIT_LABELS } from "@/lib/format";
import { cx } from "./cx";

/** Remaining seconds and phase for a lot's own clock (cards, rows, tiles). */
export function useLotClock(product) {
  const scheduled = product.status === "scheduled";
  const target = product.status === "sold" ? null : scheduled ? product.startsIn : product.endsIn;
  const remaining = useRemaining(target);
  return { remaining, phase: auctionPhase(product, scheduled ? null : remaining) };
}

/**
 * Countdown-pill colourways. Urgency reads through colour AND weight: calm
 * neutral while live → amber under an hour → a solid red "closing now" chip
 * with a pulsing dot in the final ten minutes.
 */
export const PHASE_STYLES = {
  live: "bg-surface-2 text-fg-2 ring-1 ring-inset ring-line",
  urgent: "bg-warning/12 text-warning ring-1 ring-inset ring-warning/25",
  critical: "bg-live text-white shadow-card",
  upcoming: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
  ended: "bg-muted text-fg-3",
  sold: "bg-secondary text-on-secondary",
};

const ICONS = { live: Clock, urgent: Timer, upcoming: CalendarClock };

/**
 * Remaining time as text. Short form ("2h 14m" / "2س 14د") follows the
 * reading direction; clock form ("02:14:36") is always left-to-right. The
 * concept renders every tabular figure in JetBrains Mono.
 */
export function Duration({ seconds, style = "short", className = "" }) {
  const { lang } = useLang();
  const dir = style === "clock" || lang !== "ar" ? "ltr" : "rtl";
  return (
    <span dir={dir} className={cx("tabular", className)}>
      {formatDuration(seconds ?? 0, lang, style)}
    </span>
  );
}

/**
 * Countdown pill coloured by urgency. `prefix` prints a small label ("Starts")
 * before the time for upcoming lots.
 */
export function CountdownPill({ phase, remaining, size = "sm", prefix, className = "" }) {
  const { ui } = useLang();
  const Icon = ICONS[phase];
  const done = phase === "ended" || phase === "sold";
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md font-bold",
        size === "sm" ? "h-6 px-2 kb-xs" : "h-7 px-2.5 kb-sm",
        PHASE_STYLES[phase] || PHASE_STYLES.live,
        className,
      )}
    >
      {phase === "critical" ? (
        <span aria-hidden="true" className="kb-pulse size-1.5 rounded-full bg-current" />
      ) : Icon ? (
        <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
      ) : null}
      {prefix ? <span className="font-semibold opacity-90">{prefix}</span> : null}
      {done ? <span>{ui(phase === "sold" ? "sold" : "ended")}</span> : <Duration seconds={remaining} className="font-bold" />}
    </span>
  );
}

const SEG_TONE = {
  default: "kb-seg text-fg",
  urgent: "kb-seg-urgent text-warning",
  critical: "kb-seg-critical text-danger",
};

/**
 * Large segmented clock (days · hours · minutes · seconds) for detail pages
 * and the auction hero. Big JetBrains Mono digits sit in individual cells with
 * colon separators; urgent time warms to amber, the final minutes glow red and
 * the block breathes a soft ring.
 */
export function ClockDigits({ seconds, tone = "default", size = "md", className = "" }) {
  const { lang } = useLang();
  const parts = durationParts(seconds ?? 0);
  const units = UNIT_LABELS[lang] || UNIT_LABELS.en;
  const cells = [
    ...(parts.days > 0 ? [{ key: "days", value: parts.days }] : []),
    { key: "hours", value: parts.hours },
    { key: "minutes", value: parts.minutes },
    { key: "seconds", value: parts.seconds },
  ];
  const segTone = SEG_TONE[tone] || SEG_TONE.default;
  const big = size === "lg";
  return (
    <div
      dir="ltr"
      className={cx("flex items-stretch", big ? "gap-1.5" : "gap-1", tone === "critical" && "kb-breathe rounded-xl", className)}
    >
      {cells.map((cell, i) => (
        <div key={cell.key} className="flex items-stretch" style={{ gap: big ? "6px" : "4px" }}>
          <div
            className={cx(
              "flex flex-1 flex-col items-center justify-center rounded-lg",
              big ? "min-w-[3.75rem] px-2 py-2" : "min-w-[3.15rem] px-1.5 py-1.5",
              segTone,
            )}
          >
            <span dir="ltr" className={cx("kb-num font-bold leading-none", big ? "text-[30px]" : "text-[22px]")}>
              {String(cell.value).padStart(2, "0")}
            </span>
            <span
              dir={lang === "ar" ? "rtl" : "ltr"}
              className={cx("mt-1 font-semibold uppercase", big ? "kb-2xs tracking-[0.08em]" : "text-[9px] leading-none tracking-[0.06em]", tone === "default" && "text-fg-3")}
            >
              {units[cell.key]}
            </span>
          </div>
          {i < cells.length - 1 ? (
            <span aria-hidden="true" className={cx("kb-colon kb-num self-center font-bold leading-none", big ? "text-2xl" : "text-lg")}>
              :
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
