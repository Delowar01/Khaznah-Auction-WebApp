"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { durationParts, formatDuration, UNIT_LABELS } from "@/lib/format";

const pad = (n) => String(n).padStart(2, "0");

/** Inline countdown text, coloured by urgency. */
export function CountdownText({ seconds, className = "", style = "short" }) {
  const { lang } = useLang();
  const urgent = seconds != null && seconds > 0 && seconds <= 3600;
  return (
    <span dir="ltr" className={`tabular isolate-bidi ${urgent ? "text-live" : ""} ${className}`}>
      {formatDuration(seconds ?? 0, lang, style)}
    </span>
  );
}

/** Large labelled countdown (days / hours / minutes / seconds). */
export function CountdownBlocks({ seconds, className = "", tone = "default" }) {
  const { lang } = useLang();
  const p = durationParts(seconds ?? 0);
  const labels = UNIT_LABELS[lang] || UNIT_LABELS.en;
  const units = p.days > 0
    ? [
        [p.days, labels.days],
        [p.hours, labels.hours],
        [p.minutes, labels.minutes],
        [p.seconds, labels.seconds],
      ]
    : [
        [p.hours, labels.hours],
        [p.minutes, labels.minutes],
        [p.seconds, labels.seconds],
      ];
  const urgent = seconds > 0 && seconds <= 3600;
  return (
    <div dir="ltr" className={`flex items-end gap-1 ${className}`} role="timer" aria-live="off">
      {units.map(([value, label], index) => (
        <div key={label} className="flex items-end gap-1">
          {index > 0 ? <span aria-hidden="true" className="pb-5 text-2xl text-fg-3">:</span> : null}
          <div className="text-center">
            <div className={`a-serif tabular text-[40px] leading-none ${urgent || tone === "live" ? "text-live" : "text-fg"}`}>{pad(value)}</div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-3 rtl:text-[11px] rtl:tracking-normal" lang={lang}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
