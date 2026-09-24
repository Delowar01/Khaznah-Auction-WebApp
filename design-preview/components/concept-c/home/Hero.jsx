"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { BRAND_PHOTOS } from "@/data/media";
import { HERO, TRUST_POINTS } from "@/data/site";
import { useOtherLang } from "../ui/Bi";
import { ButtonLink } from "../ui/Button";
import { Diamond } from "../ui/Diamond";
import { ChamferFrame } from "../ui/Frame";
import { HeroLiveCard } from "./HeroLiveCard";

/**
 * Thin gold rule parallel to the frame's 62° chamfer (the stroke of the خ),
 * running past the cut on both sides; drawn once on load.
 */
function DiagonalRule() {
  return (
    <svg aria-hidden="true" viewBox="0 0 109.3 205.6" preserveAspectRatio="none" className="c-mirror pointer-events-none absolute -start-[2.5rem] -top-[3.75rem] hidden h-[12.85rem] w-[6.83rem] overflow-visible text-accent lg:block">
      <line x1="0" y1="205.6" x2="109.3" y2="0" pathLength="1" stroke="currentColor" strokeWidth="1.5" className="c-draw" />
    </svg>
  );
}

/** Asymmetric hero: bilingual headline and trust facts, Riyadh warehouse frame with the live card. */
export function Hero({ live }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { other, otherDir } = useOtherLang();
  const facts = TRUST_POINTS.filter((p) => p.key !== "payments");

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <span className="c-gridlines" style={{ "--grid": "4.5rem", "--grid-mask": "linear-gradient(to bottom, black 10%, transparent 92%)" }} />
      <div className="c-container relative grid gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-6 xl:col-span-5">
          <p className="c-eyebrow kz-fade-up">
            <Diamond size={7} className="text-accent" />
            {t(HERO.eyebrow)}
          </p>
          <h1 id="hero-title" className="c-display c-hero-title mt-6">
            {HERO.titleLines.map((line, index) => (
              <span key={line.en} className={index === 1 ? "block text-primary" : "block"}>
                {t(line)}
              </span>
            ))}
          </h1>
          <p lang={other} dir={otherDir} aria-hidden="true" className="c-echo c-echo--lg mt-4">
            {HERO.titleLines.map((line) => line[other]).join(" ")}
          </p>
          <p className="c-prose mt-7 max-w-[34rem] text-[1.0625rem]">{t(HERO.body)}</p>
          <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
            <ButtonLink href={link("/browse?tab=auction")} size="lg" arrow>
              {t(HERO.primaryCta)}
            </ButtonLink>
            <ButtonLink href={link("/browse?tab=buy_now")} size="lg" variant="outline">
              {t(HERO.secondaryCta)}
            </ButtonLink>
          </div>
          <ul className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-3 sm:gap-4">
            {facts.map((fact) => (
              <li key={fact.key} className="flex items-center gap-2.5 text-[0.9375rem] font-medium text-fg">
                <Diamond size={6} className="text-accent" />
                {t(fact.title)}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-6 xl:col-span-7">
          <DiagonalRule />
          <ChamferFrame size="xl" cutline={false} frameClassName="relative aspect-[4/3] bg-secondary lg:aspect-[5/4]">
            <Img
              image={BRAND_PHOTOS.warehouseRiyadh}
              alt=""
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="size-full object-cover object-[32%_50%]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </ChamferFrame>
          <HeroLiveCard live={live} className="relative z-10 mx-3 -mt-20 sm:mx-6 lg:absolute lg:-start-6 lg:bottom-8 lg:mx-0 lg:mt-0 lg:w-[20rem] xl:-start-12 xl:bottom-10 xl:w-[21.5rem]" />
        </div>
      </div>
    </section>
  );
}
