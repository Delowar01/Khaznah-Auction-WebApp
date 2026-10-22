"use client";

// Option 3 — About (production /about). Production's page as written:
// hero, the four figures, mission with its checklist, values, milestones,
// the trust strip and the closing band. The figures, milestones and
// checklist are production's hard-coded claims; they are kept word for word
// and listed for owner review (the "single-seller" intro among them), not
// corrected or extended. Static: links only, no states.
import { useId } from "react";
import { Award, BadgeCheck, Building, CircleCheck, CreditCard, ShoppingBag, Shield, Users, Warehouse } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { PRIORITY_2 } from "@/components/shared/r3/work-media-p2";
import { Img } from "@/components/shared/ui/Img";
import { CONTENT } from "@/data/contentPages";
import { IconDisk } from "../kit/Blocks";
import { Arrow, cx } from "../ui";
import { ActionLinks, ContentHero, ContentPage, CtaBand, SectionIntro, TrustStrip } from "./ContentKit";

const A = CONTENT.about;
const VALUE_ICONS = [Shield, Award, Users, ShoppingBag];
const MILESTONE_ICONS = [Building, BadgeCheck, Warehouse, CreditCard];

function Stats() {
  const { t } = useLang();
  return (
    <section aria-label={t(A.hero.eyebrow)} className="vd-container mt-4">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {A.stats.map((stat) => (
          <div key={stat.label.en} className="flex flex-col-reverse rounded-[20px] border border-[var(--vd-line)] bg-white px-5 py-4 text-center dt:py-6">
            <dt className="mt-1 vd-md text-[var(--vd-muted)]">{t(stat.label)}</dt>
            <dd dir="ltr" className="vd-h2 tabular text-[var(--vd-indigo)]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Mission() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vd-container mt-12 dt:mt-16">
      <div className="grid items-center gap-8 lg:grid-cols-2 dt:gap-14">
        <div>
          <SectionIntro eyebrow={A.mission.eyebrow} title={A.mission.heading} id={titleId} />
          <p className="mt-4 max-w-[38rem] vd-lg text-[var(--vd-ink)]/85">{t(A.mission.body)}</p>
          <ul className="mt-6 grid gap-3">
            {A.mission.checklist.map((line) => (
              <li key={line.en} className="flex items-start gap-3 vd-lg text-[var(--vd-ink)]">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--vd-grade-a)]" strokeWidth={2.2} />
                {t(line)}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-64 overflow-hidden rounded-[24px] bg-[var(--vd-bluegray)] sm:h-80 lg:h-[420px]">
          <Img image={PRIORITY_2.sellers.majdForklift} alt="" sizes="(min-width: 1024px) 600px, 100vw" className="absolute inset-0 size-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function Values() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vd-container mt-12 dt:mt-16">
      <SectionIntro eyebrow={A.values.eyebrow} title={A.values.heading} id={titleId} />
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {A.values.items.map((item, i) => (
          <li key={item.title.en} className="rounded-[24px] border border-[var(--vd-line)] bg-white p-6">
            <IconDisk icon={VALUE_ICONS[i]} className="size-12" />
            <h3 className="mt-4 vd-h3 text-[var(--vd-ink)]">{t(item.title)}</h3>
            <p className="mt-2 vd-md text-[var(--vd-muted)]">{t(item.description)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Journey() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vd-container mt-12 dt:mt-16">
      <div className="rounded-[24px] bg-[#f6f8fc] px-5 py-8 sm:px-8 dt:px-12 dt:py-12">
        <SectionIntro eyebrow={A.journey.eyebrow} title={A.journey.heading} id={titleId} />
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {A.journey.milestones.map((milestone, i) => {
            const Icon = MILESTONE_ICONS[i];
            return (
              <li key={milestone.text.en} className="flex items-stretch">
                <div className="flex-1 rounded-[20px] bg-white p-5 shadow-[0_1px_2px_rgb(7_27_82/0.05)]">
                  <div className="flex items-center justify-between gap-3">
                    <Icon aria-hidden="true" className="size-6 text-[var(--vd-indigo)]" strokeWidth={1.9} />
                    <span dir="ltr" className="inline-flex h-7 items-center rounded-full bg-[var(--vd-gold)] px-3 vd-sm font-extrabold tabular text-[var(--vd-ink)]">
                      {milestone.year}
                    </span>
                  </div>
                  <p className="mt-4 vd-md text-[var(--vd-ink)]">{t(milestone.text)}</p>
                </div>
                {i < A.journey.milestones.length - 1 ? (
                  <span aria-hidden="true" className="hidden w-8 shrink-0 place-items-center text-[var(--vd-indigo)] lg:grid">
                    <Arrow className="size-5" />
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function VisualDiscoveryAbout() {
  return (
    <ContentPage current="about">
      <ContentHero
        eyebrow={A.hero.eyebrow}
        headline={A.hero.headline}
        intro={A.hero.intro}
        image={PRIORITY_2.sellers.khaznaBuilding}
        imagePosition="60% center"
        actions={<ActionLinks buttons={A.hero.buttons} />}
      />
      <Stats />
      <Mission />
      <Values />
      <Journey />
      <TrustStrip marks={A.trustStrip} />
      <CtaBand cta={A.cta} />
      <div className={cx("pb-12 dt:pb-16")} />
    </ContentPage>
  );
}
