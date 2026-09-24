"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Logo } from "@/components/shared/brand/Logo";
import { BRAND } from "@/data/site";
import { COPY } from "../copy";
import { Echo } from "../ui/Bi";
import { Section, SectionHead } from "../ui/Section";

/** The K-H-A-Z-N-A-H values as a vertical acrostic — it reads the same in both directions. */
export function ValuesSection() {
  const { t } = useLang();
  return (
    <Section labelledBy="values-title" className="overflow-hidden bg-surface-2">
      <span className="c-gridlines" style={{ "--grid": "4.5rem", "--grid-mask": "linear-gradient(to bottom, black, transparent 85%)" }} />
      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--pbar-h)+7rem)] lg:self-start">
          <SectionHead id="values-title" eyebrow={COPY.valuesEyebrow} title={COPY.valuesTitle} text={COPY.valuesText} className="mb-0!" />
          <Logo variant="mark" decorative className="c-logo mt-12 hidden h-44 w-auto lg:block" />
        </div>
        <ol className="border-b border-line-strong">
          {BRAND.values.map((value, index) => (
            <li key={`${value.letter}-${index}`} className="group grid grid-cols-[4.25rem_minmax(0,1fr)] items-baseline gap-x-5 gap-y-1 border-t border-line-strong py-5 sm:grid-cols-[6rem_minmax(0,1fr)] lg:grid-cols-[7.5rem_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-x-8 lg:py-6">
              <span aria-hidden="true" lang="en" className="c-num c-outline-letter row-span-2 text-[3.75rem] font-bold leading-none sm:text-[4.75rem] lg:row-span-1 lg:text-[5.5rem]">
                {value.letter}
              </span>
              <div>
                <h3 className="text-xl font-bold text-fg sm:text-2xl">{t(value.title)}</h3>
                <Echo content={value.title} className="mt-1" />
              </div>
              <p className="c-prose text-[0.9375rem] lg:text-base">{t(value.text)}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
