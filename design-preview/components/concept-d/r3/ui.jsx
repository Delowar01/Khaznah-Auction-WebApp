"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { GRADES } from "@/data/grades";
import { useRemaining } from "@/lib/clock";
import { plural } from "@/lib/i18n";

export const cx = (...parts) => parts.filter(Boolean).join(" ");

const VARIANT = {
  ink: "bg-primary text-on-primary hover:bg-primary-hover",
  outline: "border border-line-strong bg-surface text-fg hover:border-fg",
  ghost: "text-fg hover:bg-surface-2",
  urgent: "bg-accent text-on-accent hover:brightness-110",
  light: "bg-[var(--ac-stage-fg)] text-[var(--ac-stage)] hover:bg-white",
  stageOutline: "border border-[var(--ac-stage-line)] text-[var(--ac-stage-fg)] hover:bg-white/10",
};
const SIZE = {
  xs: "h-7 px-2.5 ac-xs font-semibold gap-1",
  sm: "h-8 px-3 ac-sm font-semibold gap-1.5",
  md: "h-10 px-4 ac-sm font-semibold gap-2",
  lg: "h-12 px-5 ac-md font-semibold gap-2",
};

export function btnClass(variant = "ink", size = "md", extra = "") {
  return cx(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-control transition-colors duration-150 outline-offset-2 disabled:cursor-not-allowed disabled:opacity-45",
    VARIANT[variant],
    SIZE[size],
    extra,
  );
}

export function Thumb({ image, size = 64, className = "", rounded = "rounded-[8px]" }) {
  const studio = image?.kind !== "scene";
  return (
    <span className={cx("relative inline-grid shrink-0 place-items-center overflow-hidden bg-plate", rounded, className)} style={{ width: size, height: size }}>
      <Img image={image} alt="" sizes={`${size}px`} className={cx("size-full", studio ? "object-contain p-[8%] mix-blend-multiply" : "object-cover")} />
    </span>
  );
}

const GRADE_VAR = { new: "--grade-new", A: "--grade-a", B: "--grade-b", C: "--grade-c", D: "--grade-d", R: "--grade-r", F: "--grade-f" };

export function GradeTag({ grade, long = false, className = "" }) {
  const { t } = useLang();
  const info = GRADES[grade];
  if (!info) return null;
  return (
    <span className={cx("inline-flex items-center gap-1 ac-xs font-semibold text-fg-2", className)}>
      <span aria-hidden="true" className="size-2 rounded-full" style={{ background: `var(${GRADE_VAR[grade]})` }} />
      {long ? t(info.label) : t(info.short)}
    </span>
  );
}

const MIN = {
  en: { one: "{n} min", other: "{n} min" },
  ar: { zero: "0 دقيقة", one: "دقيقة واحدة", two: "دقيقتان", few: "{n} دقائق", many: "{n} دقيقة", other: "{n} دقيقة" },
};

/** Plain-language time: "9 min", "2 h 14 min", "1 d 3 h" (Arabic: "9 دقائق", "2 س 14 د"). */
export function plainTime(totalSeconds, lang = "en") {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (lang === "ar") {
    if (s < 60) return "أقل من دقيقة";
    if (d > 0) return `${d} ي ${h} س`;
    if (h > 0) return `${h} س ${String(m).padStart(2, "0")} د`;
    return plural(Math.max(1, m), MIN, "ar");
  }
  if (s < 60) return "under a minute";
  if (d > 0) return `${d} d ${h} h`;
  if (h > 0) return `${h} h ${String(m).padStart(2, "0")} min`;
  return plural(Math.max(1, m), MIN, "en");
}

/** Live time text for a relative deadline, in the urgency colour under an hour. */
export function TimeText({ seconds, target, template, className = "", urgentBelow = 3600, plainClassName = "" }) {
  const { t, lang } = useLang();
  const remaining = useRemaining(target ?? seconds);
  const urgent = remaining != null && remaining <= urgentBelow;
  const text = plainTime(remaining ?? 0, lang);
  return (
    <span dir={lang === "ar" ? "rtl" : "ltr"} className={cx("ac-num", urgent ? "text-accent" : "", className, plainClassName)}>
      {template ? t(template, { time: text }) : text}
    </span>
  );
}

export function LiveDot({ className = "" }) {
  return <span aria-hidden="true" className={cx("kz-live-dot", className)} />;
}

export function Count({ n, className = "" }) {
  if (!n) return null;
  return (
    <span aria-hidden="true" className={cx("absolute -end-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold leading-none text-on-accent ac-num", className)}>
      {n}
    </span>
  );
}

export function IconButton({ label, className = "", children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx("relative grid size-10 shrink-0 place-items-center rounded-control text-fg transition-colors hover:bg-surface-2", className)}
      {...rest}
    >
      {children}
    </button>
  );
}
