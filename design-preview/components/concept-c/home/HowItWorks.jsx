"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { HOW_IT_WORKS } from "@/data/site";
import { UI } from "@/data/ui";
import { COPY } from "../copy";
import { Section, SectionHead } from "../ui/Section";

/** Diamond step marker with the number set upright inside. */
export function StepDiamond({ n }) {
  return (
    <span className="relative grid size-12 shrink-0 place-items-center">
      <span aria-hidden="true" className="absolute inset-[6px] rotate-45 border border-accent bg-bg" />
      <span className="c-num relative text-sm font-semibold text-fg">{String(n).padStart(2, "0")}</span>
    </span>
  );
}

/** Four steps joined by a hairline, each marked with a diamond. */
export function HowItWorks() {
  const { t } = useLang();
  return (
    <Section id="how-it-works" labelledBy="how-title" className="border-t border-line">
      <SectionHead id="how-title" eyebrow={COPY.howEyebrow} title={UI.howItWorks} />
      <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <span aria-hidden="true" className="absolute end-[calc(25%-3.375rem)] start-6 top-6 hidden h-px bg-line-strong lg:block" />
        {HOW_IT_WORKS.map((step) => (
          <li key={step.step} className="relative">
            <StepDiamond n={step.step} />
            <h3 className="mt-6 text-xl font-bold text-fg">{t(step.title)}</h3>
            <p className="c-prose mt-2 max-w-xs text-[0.9375rem]">{t(step.text)}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
