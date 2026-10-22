"use client";

// Option 3 — How it works (production /how-it-works). Production's hero,
// five steps, four features, trust strip and closing band, word for word,
// with one addition the brief asks for: the three ways to buy (timed
// auctions, Buy Now, live auctions) described only by behaviour the
// marketplace already has. The steps use approved Khaznah photography in
// place of production's hot-linked stock pictures. Static: links only.
import Link from "next/link";
import { useId } from "react";
import { Bell, Clock, CreditCard, FileText, Gavel, Radio, Search, Shield, ShoppingBag, Truck, UserPlus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CONTENT_COPY as C } from "@/components/shared/commerce/contentCopy";
import { WORK_MEDIA } from "@/components/shared/r3/work-media";
import { PRIORITY_2 } from "@/components/shared/r3/work-media-p2";
import { Img } from "@/components/shared/ui/Img";
import { CONTENT } from "@/data/contentPages";
import { COPY } from "../copy";
import { IconDisk } from "../kit/Blocks";
import { Arrow, cx } from "../ui";
import { ActionLinks, ContentHero, ContentPage, CtaBand, SectionIntro, TrustStrip } from "./ContentKit";

const H = CONTENT.howItWorks;
const STEP_ICONS = [UserPlus, Search, Gavel, CreditCard, Truck];
const STEP_IMAGES = [WORK_MEDIA.furnitureScene, PRIORITY_2.heroElectronics, PRIORITY_2.liveAisle, PRIORITY_2.heroKitchen, PRIORITY_2.sellers.majdForklift];
const FEATURE_ICONS = [Clock, Shield, FileText, Bell];

const JOURNEYS = [
  { key: "timed", icon: Gavel, title: COPY.navTimed, text: C.timedText, cta: COPY.exploreAuctions, href: "/browse?tab=auction" },
  { key: "buy", icon: ShoppingBag, title: COPY.navBuyNow, text: C.buyNowText, cta: COPY.shopBuyNow, href: "/browse?tab=buy_now" },
  { key: "live", icon: Radio, title: COPY.navLive, text: C.liveText, cta: COPY.joinLive, href: "/live-auction" },
];

function Journeys() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vd-container mt-12 dt:mt-16">
      <SectionIntro eyebrow={C.journeysKicker} title={C.journeysTitle} id={titleId} />
      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {JOURNEYS.map((journey) => (
          <li key={journey.key} className="flex flex-col rounded-[24px] border border-[var(--vd-line)] bg-white p-6">
            <IconDisk icon={journey.icon} tone={journey.key === "live" ? "navy" : "indigo"} className="size-12" />
            <h3 className="mt-4 vd-h3 text-[var(--vd-ink)]">{t(journey.title)}</h3>
            <p className="mt-2 flex-1 vd-md text-[var(--vd-muted)]">{t(journey.text)}</p>
            <Link href={link(journey.href)} className="vd-link mt-5 inline-flex w-fit items-center gap-2 vd-md font-bold text-[var(--vd-indigo)]">
              {t(journey.cta)}
              <Arrow className="size-4" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Steps() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vd-container mt-12 dt:mt-16">
      <SectionIntro eyebrow={H.steps.eyebrow} title={H.steps.heading} id={titleId} />
      <ol className="mt-6 grid gap-4 dt:gap-5" data-testid="steps">
        {H.steps.items.map((step, i) => {
          const Icon = STEP_ICONS[i];
          return (
            <li key={step.number} className="grid items-center gap-4 rounded-[24px] bg-[#f6f8fc] p-4 sm:p-5 md:grid-cols-2 md:gap-8 dt:p-6">
              <div className={cx("relative h-52 overflow-hidden rounded-[20px] bg-[var(--vd-bluegray)] sm:h-64", i % 2 ? "md:order-last" : null)}>
                <Img image={STEP_IMAGES[i]} alt="" sizes="(min-width: 1200px) 640px, (min-width: 768px) 46vw, 100vw" className="absolute inset-0 size-full object-cover" />
              </div>
              <div className="px-1 pb-2 md:px-4">
                <div className="flex items-center gap-4">
                  <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-[var(--vd-indigo)] text-white">
                    <Icon className="size-[22px]" strokeWidth={2} />
                  </span>
                  <span aria-hidden="true" dir="ltr" className="vd-display text-[44px] font-extrabold leading-none tabular text-[#6b7fbf]">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-4 vd-h3 !text-[22px] !leading-7 text-[var(--vd-ink)] rtl:!leading-9">
                  <span className="sr-only">{t(C.stepNumber, { n: i + 1 })}: </span>
                  {t(step.title)}
                </h3>
                <p className="mt-2 max-w-[34rem] vd-lg text-[var(--vd-muted)]">{t(step.description)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Features() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vd-container mt-12 dt:mt-16">
      <SectionIntro eyebrow={H.features.eyebrow} title={H.features.heading} id={titleId} />
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {H.features.items.map((feature, i) => (
          <li key={feature.title.en} className="rounded-[24px] border border-[var(--vd-line)] bg-white p-6">
            <IconDisk icon={FEATURE_ICONS[i]} tone="gold" className="size-12" />
            <h3 className="mt-4 vd-h3 text-[var(--vd-ink)]">{t(feature.title)}</h3>
            <p className="mt-2 vd-md text-[var(--vd-muted)]">{t(feature.description)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function VisualDiscoveryHowItWorks() {
  return (
    <ContentPage current="howItWorks">
      <ContentHero
        eyebrow={H.hero.eyebrow}
        headline={H.hero.headline}
        intro={H.hero.intro}
        image={PRIORITY_2.liveElectronics}
        actions={<ActionLinks buttons={H.hero.buttons} />}
      />
      <Journeys />
      <Steps />
      <Features />
      <TrustStrip marks={H.trustStrip} />
      <CtaBand cta={H.cta} />
      <div className="pb-12 dt:pb-16" />
    </ContentPage>
  );
}
