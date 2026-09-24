"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { UNIT_LABELS, durationParts, formatDuration } from "@/lib/format";
import { cx } from "./cx";

const URGENCY_TEXT = { critical: "text-live", urgent: "text-warning", ended: "text-fg-3" };

/**
 * Compact remaining time ("2h 14m" / "2س 14د"), coloured by urgency.
 * Arabic short forms read right to left; only clock style is forced LTR.
 */
export function CountdownText({ seconds, urgency = "normal", style = "short", className = "" }) {
  const { lang } = useLang();
  return (
    <span dir={style === "clock" || lang !== "ar" ? "ltr" : "rtl"} className={cx("tabular whitespace-nowrap transition-colors duration-500", URGENCY_TEXT[urgency], className)}>
      {formatDuration(seconds ?? 0, lang, style)}
    </span>
  );
}

const pad = (n) => String(n).padStart(2, "0");

/** Four labelled blocks — day · hour · minute · second — brick-red under 10 minutes. */
export function CountdownBlocks({ seconds, urgency = "normal", label, className = "" }) {
  const { lang } = useLang();
  const p = durationParts(seconds ?? 0);
  const L = UNIT_LABELS[lang] || UNIT_LABELS.en;
  const blocks = [
    ["days", p.days],
    ["hours", p.hours],
    ["minutes", p.minutes],
    ["seconds", p.seconds],
  ];
  const critical = urgency === "critical";
  return (
    <div role="timer" aria-label={label ? `${label} ${formatDuration(seconds ?? 0, lang, "short")}` : undefined} className={cx("grid grid-cols-4 gap-px overflow-hidden rounded-md border", critical ? "border-live/40 bg-live/30" : "border-line bg-line", className)}>
      {blocks.map(([key, value]) => (
        <div key={key} aria-hidden="true" className={cx("flex flex-col items-center gap-1 px-1 py-3 transition-colors duration-500", critical ? "bg-[color-mix(in_oklab,var(--live)_8%,var(--surface))]" : "bg-surface")}>
          <span className={cx("c-num text-[1.75rem] font-semibold leading-none transition-colors duration-500 sm:text-[2rem]", critical ? "text-live" : urgency === "urgent" ? "text-warning" : "text-fg")}>{pad(value)}</span>
          <span className={cx("text-xs", critical ? "text-fg-2" : "text-fg-3")}>{L[key]}</span>
        </div>
      ))}
    </div>
  );
}

/** Saffron bar proportional to time left, where a full bar is 24 hours. */
export function TimeBar({ seconds, urgency = "normal", className = "", inline = false }) {
  const ratio = seconds == null || seconds <= 0 ? 0 : Math.max(0.025, Math.min(1, seconds / 86400));
  return (
    <div aria-hidden="true" data-urgency={urgency} className={cx("c-timebar", inline && "c-timebar--static", className)}>
      <span style={{ inlineSize: `${(ratio * 100).toFixed(2)}%` }} />
    </div>
  );
}
