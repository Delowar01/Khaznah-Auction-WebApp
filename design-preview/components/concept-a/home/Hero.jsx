"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, ShieldCheck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useRemaining } from "@/lib/clock";
import { detailPath, getProduct } from "@/lib/catalog";
import { HERO, TRUST_POINTS } from "@/data/site";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Type";
import { CountdownText } from "../ui/Countdown";
import { StatusLabel } from "../ui/Status";
import { COPY } from "../copy";

const ICONS = { graded: BadgeCheck, deposit: ShieldCheck, payments: CreditCard };

export function Hero() {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const lot = getProduct(HERO.featuredLot);
  const remaining = useRemaining(lot.endsIn);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-5 pb-20 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pb-28 lg:pt-16">
        <div className="flex flex-col justify-center lg:col-span-6">
          <div className="a-rise flex items-center gap-4">
            <Eyebrow>{t(HERO.eyebrow)}</Eyebrow>
            <span aria-hidden="true" className="a-draw h-px w-16 bg-accent" style={{ "--d": "300ms" }} />
          </div>
          <h1 className="a-display mt-6 text-[50px] text-fg sm:text-[72px] xl:text-[92px] rtl:text-[48px] rtl:sm:text-[66px] rtl:xl:text-[80px]">
            <span className="a-rise block" style={{ "--d": "80ms" }}>
              {t(HERO.titleLines[0])}
            </span>
            <span className="a-rise block italic text-fg rtl:not-italic rtl:text-primary" style={{ "--d": "180ms" }}>
              {t(HERO.titleLines[1])}
            </span>
          </h1>
          <p className="a-rise mt-7 max-w-[34rem] text-[17px] leading-relaxed text-fg-2 rtl:text-lg rtl:leading-9" style={{ "--d": "280ms" }}>
            {t(HERO.body)}
          </p>
          <div className="a-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-5" style={{ "--d": "360ms" }}>
            <Button as={Link} href={link("/browse?tab=auction")} size="lg">
              {t(HERO.primaryCta)}
            </Button>
            <Link href={link("/browse?tab=buy_now")} className="group inline-flex items-center gap-2 text-sm font-semibold text-fg">
              <span className="a-link">{t(HERO.secondaryCta)}</span>
              <DirIcon icon={ArrowRight} className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
          <ul className="a-rise mt-14 grid gap-4 border-t border-line pt-6 text-[13px] text-fg-2 sm:grid-cols-3" style={{ "--d": "440ms" }}>
            {TRUST_POINTS.slice(0, 3).map((point) => {
              const Icon = ICONS[point.key];
              return (
                <li key={point.key} className="flex items-center gap-2.5">
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-accent" />
                  {t(point.title)}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative lg:col-span-6">
          <div className="a-grain relative aspect-[4/5] overflow-hidden rounded-card bg-plate sm:aspect-[5/4] lg:aspect-[4/5]">
            <div aria-hidden="true" className="absolute inset-x-[18%] bottom-[18%] h-[7%] rounded-[100%] bg-[radial-gradient(closest-side,rgb(22_25_42/0.28),transparent)] blur-md" />
            <Img
              cutout
              image={lot.images[0]}
              alt={t(lot.title)}
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="a-rise absolute inset-x-[12%] top-[8%] h-[72%] w-[76%] object-contain"
              style={{ "--d": "120ms" }}
            />
            <span className="a-eyebrow absolute end-6 top-6 !text-fg-3 tabular" dir="ltr">
              {lot.lot}
            </span>
          </div>
          <div className="a-rise relative z-10 mx-4 -mt-24 rounded-card bg-surface/95 p-6 shadow-raised backdrop-blur sm:absolute sm:bottom-5 sm:start-5 sm:mx-0 sm:mt-0 sm:w-[380px] lg:-start-8 lg:bottom-10" style={{ "--d": "520ms" }}>
            <div className="flex items-center justify-between gap-4">
              <Eyebrow>{t(COPY.lotPlacard)}</Eyebrow>
              <StatusLabel status="live" />
            </div>
            <p className="a-serif mt-3 text-[24px] leading-tight text-fg">{t(lot.title)}</p>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-fg-3 rtl:text-xs rtl:normal-case rtl:tracking-normal">{ui("currentBid")}</p>
                <Money value={lot.currentBid} className="a-serif mt-1 text-[28px] leading-none text-fg" symbolClassName="text-[0.78em]" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-fg-3 rtl:text-xs rtl:normal-case rtl:tracking-normal">{ui("closesIn")}</p>
                <p className="mt-2 text-[17px] font-semibold text-fg">
                  <CountdownText seconds={remaining} />
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-fg-3">{pl("bids", lot.bidCount)}</span>
              <Link href={link(detailPath(lot))} className="group inline-flex items-center gap-2 font-semibold text-fg">
                <span className="a-link">{t(COPY.viewLot)}</span>
                <DirIcon icon={ArrowRight} className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
