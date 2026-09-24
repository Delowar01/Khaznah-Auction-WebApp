"use client";

import { useState } from "react";
import { BadgeCheck, Gavel, ListOrdered, ShieldCheck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { Reveal } from "@/components/shared/ui/Reveal";
import { AUCTION_POLICY, HERO, HOW_IT_WORKS, TRUST_POINTS } from "@/data/site";
import { GradeGuideModal, GradeTable } from "../product/GradeGuide";
import { Button, buttonClass } from "../ui/Button";
import { SectionHeader } from "../ui/SectionHeader";
import { BrowseLink } from "../utils/navigation";
import { COPY } from "../copy";

const deposit = TRUST_POINTS.find((point) => point.key === "deposit");

/** Four steps to buy, beside the condition-grade key. */
export function HowItWorksGrades() {
  const { t, ui } = useLang();
  const [guide, setGuide] = useState(false);
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <Reveal as="section" id="how-it-works" aria-labelledby="kb-how" className="flex scroll-mt-10 flex-col rounded-xl border border-line bg-surface p-5 sm:p-6">
        <SectionHeader id="kb-how" icon={ListOrdered} title={ui("howItWorks")} subtitle={t(COPY.howSubtitle)} />
        <ol className="relative grid gap-5 sm:grid-cols-2">
          {HOW_IT_WORKS.map((step) => (
            <li key={step.step} className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary kb-md font-extrabold text-on-primary shadow-card">
                {step.step}
              </span>
              <div>
                <p className="kb-2xs font-bold text-fg-3">{t(COPY.step, { n: step.step })}</p>
                <h3 className="kb-md font-bold text-fg">{t(step.title)}</h3>
                <p className="mt-1 kb-sm text-fg-2">{t(step.text)}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-col gap-4 rounded-xl bg-primary/5 p-4 ring-1 ring-primary/15 sm:flex-row sm:items-center lg:mt-auto">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-on-primary">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-baseline gap-x-2 kb-md font-bold text-fg">
              {ui("depositAmount")}
              <Money value={AUCTION_POLICY.depositAmount} className="text-primary" />
            </p>
            <p className="kb-sm text-fg-2">{t(deposit.text)}</p>
          </div>
          <BrowseLink href="/browse?tab=auction" className={buttonClass({ size: "md", className: "shrink-0" })}>
            <Gavel aria-hidden="true" className="size-4" />
            {t(HERO.primaryCta)}
          </BrowseLink>
        </div>
      </Reveal>
      <Reveal as="section" id="grades" aria-labelledby="kb-grades" delay={80} className="scroll-mt-10 rounded-xl border border-line bg-surface p-5 sm:p-6">
        <SectionHeader
          id="kb-grades"
          icon={BadgeCheck}
          title={t(COPY.gradesTitle)}
          subtitle={ui("gradeGuideText")}
          actions={
            <div className="hidden sm:block">
              <Button variant="soft" size="sm" onClick={() => setGuide(true)}>
                {t(COPY.fullGradeGuide)}
              </Button>
            </div>
          }
        />
        <GradeTable />
        <Button variant="soft" block onClick={() => setGuide(true)} className="mt-4 sm:hidden">
          {t(COPY.fullGradeGuide)}
        </Button>
      </Reveal>
      <GradeGuideModal open={guide} onClose={() => setGuide(false)} />
    </div>
  );
}
