"use client";

import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { GRADES, GRADE_ORDER } from "@/data/grades";
import { Reveal } from "@/components/shared/ui/Reveal";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Type";
import { GradeChip } from "../ui/GradeChip";
import { GradeGuideModal } from "../detail/GradeGuideModal";
import { COPY } from "../copy";

export function GradeFeature() {
  const { t, ui } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <section id="grades" className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-[1360px] gap-14 px-5 py-20 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-28">
        <div className="lg:col-span-5">
          <Eyebrow>{ui("inspected")}</Eyebrow>
          <h2 className="a-display mt-4 text-[38px] text-fg sm:text-[52px] rtl:sm:text-[44px]">{t(COPY.gradeTitle)}</h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-fg-2 rtl:leading-9">{t(COPY.gradeText)}</p>
          <Button variant="outline" className="mt-9" onClick={() => setOpen(true)}>
            {t(COPY.readGuide)}
          </Button>
        </div>
        <ol className="divide-y divide-line border-y border-line lg:col-span-7">
          {GRADE_ORDER.map((key, i) => (
            <Reveal as="li" key={key} delay={i * 50} className="grid grid-cols-[112px_1fr] items-center gap-6 py-4 sm:grid-cols-[140px_1fr]">
              <GradeChip grade={key} />
              <p className="text-[15px] leading-relaxed text-fg-2">{t(GRADES[key].text)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
      <GradeGuideModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
