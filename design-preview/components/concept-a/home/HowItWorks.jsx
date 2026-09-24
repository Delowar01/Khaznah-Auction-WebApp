"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { HOW_IT_WORKS } from "@/data/site";
import { Reveal } from "@/components/shared/ui/Reveal";
import { SectionHead } from "../ui/Type";
import { COPY } from "../copy";

export function HowItWorks() {
  const { t, ui } = useLang();
  return (
    <section id="how-it-works" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1360px] px-5 py-20 sm:px-6 lg:px-10 lg:py-28">
        <SectionHead eyebrow={ui("howItWorks")} title={t(COPY.howTitle)} align="stack" />
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal as="li" key={step.step} delay={i * 90} className="border-t border-fg pt-6">
              <span className="a-display a-accent-text block text-[56px] tabular" dir="ltr">
                {String(step.step).padStart(2, "0")}
              </span>
              <h3 className="a-serif mt-4 text-[24px] text-fg">{t(step.title)}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fg-2 rtl:leading-8">{t(step.text)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
