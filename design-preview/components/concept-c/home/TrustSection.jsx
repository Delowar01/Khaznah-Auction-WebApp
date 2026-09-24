"use client";

import { BadgeCheck, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { STATS, TRUST_POINTS } from "@/data/site";
import { UI } from "@/data/ui";
import { COPY } from "../copy";
import { Section, SectionHead } from "../ui/Section";
import { StatFigure } from "./StatFigure";

const ICONS = { "badge-check": BadgeCheck, "shield-check": ShieldCheck, "credit-card": CreditCard, truck: Truck };

/** Marketplace credibility: large stats, then the four trust points. */
export function TrustSection() {
  const { t } = useLang();
  return (
    <Section labelledBy="trust-title">
      <SectionHead id="trust-title" eyebrow={COPY.trustEyebrow} title={UI.trustTitle} />
      <ul className="grid gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <li key={stat.key} className="flex items-end justify-between gap-4 bg-bg py-5 sm:flex-col sm:items-start sm:justify-between sm:gap-6 sm:px-6 sm:py-7 lg:py-9">
            <StatFigure stat={stat} className="text-[2.5rem] font-semibold leading-none text-fg sm:text-[3.25rem] lg:text-[3.5rem] xl:text-[3.75rem]" />
            <span className="text-end text-[0.9375rem] text-fg-2 sm:text-start">{t(stat.label)}</span>
          </li>
        ))}
      </ul>
      <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8">
        {TRUST_POINTS.map((point) => {
          const Icon = ICONS[point.icon] || BadgeCheck;
          return (
            <li key={point.key}>
              <span className="grid size-12 place-items-center rounded-md border border-line bg-surface-2 text-primary">
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-fg">{t(point.title)}</h3>
              <p className="c-prose mt-2 text-[0.9375rem]">{t(point.text)}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
