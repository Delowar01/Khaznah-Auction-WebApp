"use client";

import { useState } from "react";
import { BadgeCheck, CreditCard, ShieldCheck, Truck, BookOpen } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { Reveal } from "@/components/shared/ui/Reveal";
import { GRADES, GRADE_ORDER } from "@/data/grades";
import { HOW_IT_WORKS, STATS, TRUST_POINTS } from "@/data/site";
import { formatNumber } from "@/lib/format";
import { Container, SectionHeader } from "../ui/Layout";
import { GradeChip } from "../ui/GradeChip";
import { Button } from "../ui/Button";
import { GradeGuideModal } from "../product/GradeGuideModal";
import { useCopy } from "../lib/useCopy";

const TRUST_ICONS = { "badge-check": BadgeCheck, "shield-check": ShieldCheck, "credit-card": CreditCard, truck: Truck };

function Metric({ stat }) {
  const { t } = useLang();
  return (
    <div className="d-panel relative overflow-hidden p-5">
      <div aria-hidden="true" className="d-glow pointer-events-none absolute -end-16 -top-16 size-40" />
      <p className="d-num relative whitespace-nowrap text-[28px] font-medium leading-none text-fg sm:text-[40px]" dir="ltr">
        {stat.money ? <Money value={stat.value} /> : formatNumber(stat.value)}
        <span className="text-fg-2">{stat.suffixUnit || stat.suffix || ""}</span>
      </p>
      <p className="relative mt-3 text-sm text-fg-2">{t(stat.label)}</p>
    </div>
  );
}

function Timeline() {
  const { t, ui } = useLang();
  const c = useCopy();
  return (
    <div id="how-it-works" className="scroll-mt-40">
      <h3 className="d-tight text-xl font-semibold text-fg">{ui("howItWorks")}</h3>
      <div className="relative mt-6">
        <span aria-hidden="true" className="absolute inset-x-4 top-4 hidden h-px bg-linear-to-r from-[var(--d-ink)] via-line-strong to-transparent md:block rtl:bg-linear-to-l" />
        <ol className="relative grid gap-6 md:grid-cols-4 md:gap-5">
          {HOW_IT_WORKS.map((step) => (
            <li key={step.step} className="relative flex gap-4 md:block">
              <span className="d-num relative z-[1] grid size-8 shrink-0 place-items-center rounded-full border border-line-strong bg-bg text-xs font-medium d-ink shadow-[0_0_0_4px_var(--bg)]">
                <span className="sr-only">{c("step", { n: step.step })}</span>
                <span aria-hidden="true">{String(step.step).padStart(2, "0")}</span>
              </span>
              <div className="md:mt-4">
                <p className="font-medium text-fg">{t(step.title)}</p>
                <p className="mt-1 text-sm text-fg-2 text-pretty">{t(step.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function GradeScale() {
  const { t, ui } = useLang();
  const c = useCopy();
  const [open, setOpen] = useState(false);
  return (
    <div id="grades" className="d-panel scroll-mt-40 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-fg">{c("gradesTitle")}</h3>
        <Button variant="secondary" size="sm" icon={BookOpen} onClick={() => setOpen(true)}>
          {ui("gradeGuide")}
        </Button>
      </div>
      <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {GRADE_ORDER.map((key) => (
          <li key={key} className="d-panel-2 flex flex-col gap-2 p-3">
            <GradeChip grade={key} label className="self-start" />
            <p className="text-xs text-fg-2 text-pretty">{t(GRADES[key].text)}</p>
          </li>
        ))}
      </ol>
      <GradeGuideModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

/** Platform metrics, how-it-works timeline, trust points and the grade scale. */
export function Platform() {
  const { t, ui } = useLang();
  const c = useCopy();
  return (
    <section aria-labelledby="platform-title" className="relative overflow-hidden border-t border-line py-14 md:py-20">
      <div aria-hidden="true" className="d-dotgrid pointer-events-none absolute inset-x-0 top-0 h-96" />
      <Container className="relative space-y-12 md:space-y-16">
        <div>
          <SectionHeader id="platform-title" eyebrow={ui("trustTitle")} title={c("metricsTitle")} text={c("metricsText")} />
          <Reveal className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {STATS.map((stat) => (
              <Metric key={stat.key} stat={stat} />
            ))}
          </Reveal>
        </div>

        <Reveal>
          <Timeline />
        </Reveal>

        <Reveal as="ul" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {TRUST_POINTS.map((point) => {
            const Icon = TRUST_ICONS[point.icon] || BadgeCheck;
            return (
              <li key={point.key} className="flex gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 d-ink ring-1 ring-inset ring-primary/25">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="font-medium text-fg">{t(point.title)}</h3>
                  <p className="mt-1 text-sm text-fg-2 text-pretty">{t(point.text)}</p>
                </div>
              </li>
            );
          })}
        </Reveal>

        <Reveal>
          <GradeScale />
        </Reveal>
      </Container>
    </section>
  );
}
