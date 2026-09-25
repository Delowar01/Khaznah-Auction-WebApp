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

export const PHASE_STYLES = {
  live: "bg-surface-2 text-fg-2",
  urgent: "bg-warning/10 text-warning",
  critical: "bg-danger/10 text-danger",
  upcoming: "bg-primary/10 text-primary",
  ended: "bg-muted text-fg-3",
  sold: "bg-muted text-fg-3",
};

const ICONS = { live: Clock, urgent: Timer, upcoming: CalendarClock };

/**
 * Remaining time as text. Short form ("2h 14m" / "2س 14د") follows the
 * reading direction; clock form ("02:14:36") is always left-to-right.
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
 * Countdown pill coloured by urgency: neutral → amber under an hour →
 * red and pulsing under ten minutes.
 */
export function CountdownPill({ phase, remaining, size = "sm", prefix, className = "" }) {
  const { ui } = useLang();
  const Icon = ICONS[phase];
  const done = phase === "ended" || phase === "sold";
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full font-semibold tabular",
        size === "sm" ? "h-6 px-2 kb-xs" : "h-7 px-2.5 kb-sm",
        PHASE_STYLES[phase] || PHASE_STYLES.live,
        className,
      )}
    >
      {phase === "critical" ? (
        <span aria-hidden="true" className="kb-pulse size-1.5 rounded-full bg-current" />
      ) : Icon ? (
        <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
      ) : null}
      {prefix ? <span className="font-medium">{prefix}</span> : null}
      {done ? <span>{ui(phase === "sold" ? "sold" : "ended")}</span> : <Duration seconds={remaining} />}
    </span>
  );
}

/** Large segmented clock (days · hours · minutes · seconds) for detail pages. */
export function ClockDigits({ seconds, tone = "default", className = "" }) {
  const { lang } = useLang();
  const parts = durationParts(seconds ?? 0);
  const units = UNIT_LABELS[lang] || UNIT_LABELS.en;
  const cells = [
    ...(parts.days > 0 ? [{ key: "days", value: parts.days }] : []),
    { key: "hours", value: parts.hours },
    { key: "minutes", value: parts.minutes },
    { key: "seconds", value: parts.seconds },
  ];
  return (
    <div dir="ltr" className={cx("flex items-stretch gap-2", className)}>
      {cells.map((cell) => (
        <div
          key={cell.key}
          className={cx(
            "flex min-w-[3.5rem] flex-1 flex-col items-center rounded-xl px-1.5 py-2.5",
            tone === "critical" ? "bg-danger/10 text-danger" : tone === "urgent" ? "bg-warning/10 text-warning" : "bg-surface-2 text-fg",
          )}
        >
          <span className="text-[22px] leading-none font-bold tabular">{String(cell.value).padStart(2, "0")}</span>
          <span dir={lang === "ar" ? "rtl" : "ltr"} className={cx("mt-1 kb-2xs font-medium", tone === "critical" || tone === "urgent" ? "" : "opacity-70")}>
            {units[cell.key]}
          </span>
        </div>
      ))}
    </div>
  );
}
