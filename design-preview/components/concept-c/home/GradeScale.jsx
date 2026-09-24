"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { GRADES, GRADE_ORDER } from "@/data/grades";
import { UI } from "@/data/ui";
import { COPY } from "../copy";
import { Button } from "../ui/Button";
import { Diamond } from "../ui/Diamond";
import { GradeGuideModal } from "../ui/GradeGuideModal";
import { Section, SectionHead } from "../ui/Section";

/** Condition grades as a horizontal scale, New → F, with diamond markers. */
export function GradeScale() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <Section id="grades" labelledBy="grades-title">
      <SectionHead
        id="grades-title"
        eyebrow={COPY.gradesEyebrow}
        title={COPY.gradesTitle}
        text={UI.gradeGuideText}
        action={
          <Button variant="outline" icon={BookOpen} onClick={() => setOpen(true)}>
            {t(COPY.fullGuide)}
          </Button>
        }
      />
      <ol className="relative grid gap-0 rounded-md border border-line bg-surface lg:grid-cols-7">
        <span aria-hidden="true" className="absolute inset-x-[7.15%] top-[3.375rem] hidden h-px bg-line-strong lg:block" />
        <span aria-hidden="true" className="absolute bottom-10 start-[2.625rem] top-10 w-px bg-line-strong lg:hidden" />
        {GRADE_ORDER.map((key) => {
          const g = GRADES[key];
          return (
            <li key={key} className="relative grid grid-cols-[2.75rem_1fr] gap-x-4 px-5 py-5 lg:flex lg:flex-col lg:items-center lg:px-4 lg:py-8 lg:text-center">
              <span className="relative z-10 row-span-3 grid size-11 place-items-center bg-surface lg:mb-4" style={{ color: `var(--grade-${g.tone})` }}>
                <Diamond size={16} />
              </span>
              <span className="c-num text-[1.75rem] font-bold leading-none text-fg lg:text-[2.25rem]">{key === "new" ? t(g.short) : g.key}</span>
              <span className="mt-2 text-sm font-semibold text-fg-2">{t(g.label)}</span>
              <span className="mt-1.5 text-[0.8125rem] leading-relaxed text-fg-3 lg:mt-3">{t(g.text)}</span>
            </li>
          );
        })}
      </ol>
      <GradeGuideModal open={open} onClose={() => setOpen(false)} />
    </Section>
  );
}
