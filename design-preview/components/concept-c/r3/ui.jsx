"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { GRADES } from "@/data/grades";
import { useRemaining } from "@/lib/clock";
import { formatDuration } from "@/lib/format";

export const cx = (...parts) => parts.filter(Boolean).join(" ");

const VARIANT = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "border border-line-strong bg-surface text-fg hover:border-fg-3",
  soft: "bg-surface-2 text-fg hover:bg-[color-mix(in_oklab,var(--surface-2)_85%,var(--text-primary))]",
  ghost: "text-fg hover:bg-surface-2",
  live: "bg-[var(--hb-live-badge)] text-white hover:brightness-110",
};
const SIZE = {
  xs: "h-7 px-2.5 hb-xs font-semibold gap-1",
  sm: "h-8 px-3 hb-sm font-semibold gap-1.5",
  md: "h-10 px-4 hb-sm font-semibold gap-2",
  lg: "h-11 px-5 hb-md font-semibold gap-2",
};

export function btnClass(variant = "primary", size = "md", extra = "") {
  return cx(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-control transition-colors duration-150 outline-offset-2 disabled:cursor-not-allowed disabled:opacity-45",
    VARIANT[variant],
    SIZE[size],
    extra,
  );
}

/** Product thumbnail: studio shots multiply into a plate; lifestyle photos fill. */
export function Thumb({ image, size = 40, className = "", sizes }) {
  const studio = image?.kind !== "scene";
  return (
    <span
      className={cx("relative inline-grid shrink-0 place-items-center overflow-hidden rounded-md bg-plate", className)}
      style={{ width: size, height: size }}
    >
      <Img
        image={image}
        alt=""
        sizes={sizes || `${size}px`}
        className={cx("size-full", studio ? "object-contain p-[8%] mix-blend-multiply" : "object-cover")}
      />
    </span>
  );
}

const GRADE_VAR = { new: "--grade-new", A: "--grade-a", B: "--grade-b", C: "--grade-c", D: "--grade-d", R: "--grade-r", F: "--grade-f" };

/** Compact grade chip: letter in the grade colour, hairline border. */
export function GradeTag({ grade, long = false, className = "" }) {
  const { t } = useLang();
  const info = GRADES[grade];
  if (!info) return null;
  return (
    <span
      className={cx("inline-flex h-5 items-center rounded-[4px] border px-1.5 hb-2xs font-bold", className)}
      style={{ color: `var(${GRADE_VAR[grade]})`, borderColor: `color-mix(in oklab, var(${GRADE_VAR[grade]}) 45%, transparent)` }}
    >
      {long ? t(info.label) : t(info.short)}
    </span>
  );
}

/** Remaining time for a lot, in the reading direction ("9m 12s", "2h 14m"). */
export function TimeLeft({ endsIn, className = "" }) {
  const { lang } = useLang();
  const remaining = useRemaining(endsIn);
  return (
    <span dir={lang === "ar" ? "rtl" : "ltr"} className={cx("hb-num whitespace-nowrap", className)}>
      {formatDuration(remaining ?? 0, lang)}
    </span>
  );
}

export function LiveDot({ className = "" }) {
  return <span aria-hidden="true" className={cx("kz-live-dot", className)} />;
}

export function Kbd({ children, className = "", ...rest }) {
  return (
    <kbd className={cx("inline-grid h-6 min-w-6 place-items-center rounded-[5px] border border-line-strong bg-surface px-1.5 font-sans hb-xs font-semibold text-fg-3", className)} {...rest}>
      {children}
    </kbd>
  );
}

/** Count bubble on icon buttons. */
export function Count({ n, className = "" }) {
  if (!n) return null;
  return (
    <span
      aria-hidden="true"
      className={cx("absolute -end-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-on-primary hb-num", className)}
    >
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
