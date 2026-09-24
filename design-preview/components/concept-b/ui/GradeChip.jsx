"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { getGrade } from "@/data/grades";
import { cx } from "./cx";

// Static class map so Tailwind can see every grade colour.
const TONE = {
  new: "bg-grade-new/10 text-grade-new ring-grade-new/25",
  A: "bg-grade-a/10 text-grade-a ring-grade-a/25",
  B: "bg-grade-b/10 text-grade-b ring-grade-b/25",
  C: "bg-grade-c/10 text-grade-c ring-grade-c/25",
  D: "bg-grade-d/10 text-grade-d ring-grade-d/25",
  R: "bg-grade-r/10 text-grade-r ring-grade-r/25",
  F: "bg-grade-f/10 text-grade-f ring-grade-f/25",
};

export const GRADE_DOT = {
  new: "bg-grade-new",
  A: "bg-grade-a",
  B: "bg-grade-b",
  C: "bg-grade-c",
  D: "bg-grade-d",
  R: "bg-grade-r",
  F: "bg-grade-f",
};

/** "Grade A" / "New" chip in the grade's own colour. `letter` renders just the key. */
export function GradeChip({ grade, size = "sm", letter = false, className = "" }) {
  const { t } = useLang();
  const info = getGrade(grade);
  const label = letter ? t(info.short) : grade === "new" ? t(info.short) : t(info.label);
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md font-bold ring-1 ring-inset",
        TONE[grade] || TONE.A,
        size === "sm" && "h-5 px-1.5 kb-2xs",
        size === "md" && "h-6 px-2 kb-xs",
        size === "lg" && "h-8 min-w-8 px-2 kb-md",
        className,
      )}
    >
      {label}
    </span>
  );
}
