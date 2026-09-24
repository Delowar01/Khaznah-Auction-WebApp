"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { getGrade } from "@/data/grades";
import { Diamond } from "./Diamond";
import { cx } from "./cx";

/** Status badge. tone: neutral · live · warning · danger · night · gold · primary · success · muted */
export function Badge({ tone = "neutral", live = false, dia = false, className = "", children }) {
  return (
    <span className={cx("c-badge", `c-badge--${tone}`, className)}>
      {live ? <Diamond variant="live" /> : dia ? <Diamond /> : null}
      {children}
    </span>
  );
}

/** Condition grade chip: a diamond in the grade colour, then the label. */
export function GradeChip({ grade, size = "sm", full = false, className = "" }) {
  const { t, ui } = useLang();
  const g = getGrade(grade);
  return (
    <span className={cx("c-grade", size === "lg" && "c-grade--lg", className)} style={{ "--g": `var(--grade-${g.tone})` }}>
      <Diamond />
      <span className="sr-only">{ui("condition")}: </span>
      {full ? t(g.label) : g.key === "new" ? t(g.short) : t(g.label)}
    </span>
  );
}
