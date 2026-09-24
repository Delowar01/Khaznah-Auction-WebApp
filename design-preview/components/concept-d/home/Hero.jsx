"use client";

import { ArrowRight } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { HERO, STATS } from "@/data/site";
import { formatNumber } from "@/lib/format";
import { Container } from "../ui/Layout";
import { Button } from "../ui/Button";
import { useMarket } from "../market/MarketProvider";
import { useCopy } from "../lib/useCopy";
import { FeaturedTerminal } from "./FeaturedTerminal";

function HeroStat({ stat }) {
  const { t } = useLang();
  return (
    <div className="flex min-w-0 flex-col">
      <dt className="text-[12.5px] leading-snug text-fg-3">{t(stat.label)}</dt>
      <dd className="d-num mt-auto whitespace-nowrap pt-1 text-xl font-medium text-fg sm:text-2xl" dir="ltr">
        {stat.money ? <Money value={stat.value} /> : formatNumber(stat.value)}
        {stat.suffixUnit || stat.suffix || ""}
      </dd>
    </div>
  );
}

/** Hero "live board": message and market figures beside a live featured lot. */
export function Hero() {
  const { link } = useConcept();
  const { t } = useLang();
  const market = useMarket();
  const c = useCopy();
  const running = Object.values(market).filter((a) => ["live", "urgent", "critical"].includes(a.phase)).length;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="d-dotgrid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="d-glow pointer-events-none absolute -top-48 end-[-12%] size-[820px]" />
      <div aria-hidden="true" className="d-glow-gold pointer-events-none absolute -bottom-72 start-[-18%] size-[640px] opacity-70" />

      <Container className="relative grid items-center gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-12 lg:py-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,560px)] xl:gap-16">
        <div className="min-w-0">
          <p className="inline-flex h-8 items-center gap-2.5 rounded-full border border-line-strong bg-surface/70 pe-3.5 ps-3 text-[12.5px] text-fg-2 shadow-[var(--d-highlight)]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
            {c("marketOpen")}
            <span aria-hidden="true" className="h-3 w-px bg-line-strong" />
            <span className="d-num">{c("auctionsLive", { n: running })}</span>
          </p>

          <p className="d-label mt-7 flex items-center gap-2 text-fg-3">
            <span aria-hidden="true" className="size-1.5 rotate-45 bg-accent" />
            {t(HERO.eyebrow)}
          </p>
          <h1 id="hero-title" className="d-tight mt-3 text-[38px] font-semibold leading-[1.04] text-fg sm:text-5xl lg:text-[56px] xl:text-[62px] rtl:leading-[1.3]">
            {HERO.titleLines.map((line, index) => (
              <span key={line.en} className={`block ${index ? "text-fg-2" : ""}`}>
                {t(line)}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-xl text-base text-fg-2 text-pretty md:text-[17px] md:leading-relaxed">{t(HERO.body)}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={link("/browse?tab=auction")} size="lg" iconEnd={ArrowRight}>
              {t(HERO.primaryCta)}
            </Button>
            <Button href={link("/browse?tab=buy_now")} size="lg" variant="secondary">
              {t(HERO.secondaryCta)}
            </Button>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-6 sm:gap-6">
            {STATS.slice(0, 3).map((stat) => (
              <HeroStat key={stat.key} stat={stat} />
            ))}
          </dl>
        </div>

        <FeaturedTerminal />
      </Container>
    </section>
  );
}
