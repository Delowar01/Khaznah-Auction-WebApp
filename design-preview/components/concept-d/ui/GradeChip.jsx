"use client";

import { forwardRef } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getGrade } from "@/data/grades";

const TONE = {
  new: "text-grade-new bg-grade-new/12 ring-grade-new/30",
  a: "text-grade-a bg-grade-a/12 ring-grade-a/30",
  b: "text-grade-b bg-grade-b/12 ring-grade-b/30",
  c: "text-grade-c bg-grade-c/12 ring-grade-c/30",
  d: "text-grade-d bg-grade-d/12 ring-grade-d/30",
  r: "text-grade-r bg-grade-r/12 ring-grade-r/30",
  f: "text-grade-f bg-grade-f/12 ring-grade-f/30",
};

/**
 * Condition grade pill. `label` shows "Grade A" instead of "A".
 * Pass onClick to make it open the grade guide.
 */
export const GradeChip = forwardRef(function GradeChip({ grade, label = false, size = "md", onClick, className = "", ...props }, ref) {
  const { t, ui } = useLang();
  const info = getGrade(grade);
  const text = label ? t(info.label) : t(info.short);
  const sizing = size === "sm" ? "h-5 px-1.5 text-[11px]" : size === "lg" ? "h-8 px-3 text-sm" : "h-6 px-2 text-xs";
  const cls = `inline-flex shrink-0 items-center gap-1 rounded-md font-semibold ring-1 ring-inset ${sizing} ${TONE[info.tone]} ${className}`;
  const inner = (
    <>
      <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-current opacity-80" />
      <span className={grade === "new" || label ? "" : "d-num"}>{text}</span>
    </>
  );
  if (onClick) {
    return (
      <button ref={ref} type="button" onClick={onClick} className={`${cls} transition-[filter] hover:brightness-110`} aria-label={`${t(info.label)} — ${ui("gradeGuide")}`} {...props}>
        {inner}
      </button>
    );
  }
  return (
    <span ref={ref} className={cls} title={t(info.text)} {...props}>
      {!label && grade !== "new" ? <span className="sr-only">{ui("grade")} </span> : null}
      {inner}
    </span>
  );
});
