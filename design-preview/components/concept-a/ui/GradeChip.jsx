"use client";

import { Info } from "lucide-react";
import { getGrade } from "@/data/grades";
import { useLang } from "@/components/shared/providers/LangProvider";

const TONE = {
  new: "text-grade-new",
  a: "text-grade-a",
  b: "text-grade-b",
  c: "text-grade-c",
  d: "text-grade-d",
  r: "text-grade-r",
  f: "text-grade-f",
};

/** Condition grade chip. When `onClick` is provided it opens the grade guide. */
export function GradeChip({ grade, onClick, size = "md", className = "", showLabel = true }) {
  const { t } = useLang();
  const info = getGrade(grade);
  const Tag = onClick ? "button" : "span";
  const sizing = size === "sm" ? "h-6 gap-1.5 px-2 text-[11px]" : "h-8 gap-2 px-3 text-[12px] rtl:text-[13px]";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`inline-flex items-center rounded-full border border-line-strong bg-surface font-semibold text-fg ${sizing} ${onClick ? "transition-colors hover:border-fg" : ""} ${className}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full bg-current ${TONE[info.tone]}`} />
      <span>{showLabel ? t(info.label) : t(info.short)}</span>
      {onClick ? <Info aria-hidden="true" className="size-3.5 text-fg-3" /> : null}
    </Tag>
  );
}
