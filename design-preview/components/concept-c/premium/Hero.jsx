"use client";

import Link from "next/link";
import { useId } from "react";
import { Gavel, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { HERO } from "@/data/site";
import { detailPath } from "@/lib/catalog";
import { useRemaining } from "@/lib/clock";
import { COPY } from "./copy";
import { FEATURED_LOT, HERO_PHOTO } from "./data";
import { TimeLeft, btnClass, cx } from "./ui";

const HERO_DEPARTMENTS = ["home-appliances", "furniture", "electronics", "home-kitchen", "fashion"];

/** The featured lot, floating over the photograph. */
function FeaturedLotCard({ className = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const product = FEATURED_LOT;
  const remaining = useRemaining(product.endsIn);
  const urgent = remaining != null && remaining <= 3600;
  return (
    <article className={cx("relative flex items-center gap-4 rounded-card bg-surface p-3.5 pe-4 shadow-overlay", className)}>
      <span className="pm-plate relative size-[72px] shrink-0 overflow-hidden rounded-card">
        <Img image={product.images[0]} alt="" sizes="72px" className="pm-multiply size-full object-contain p-1.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="pm-eyebrow text-accent">{t(COPY.featuredLot)}</p>
        <h2 className="mt-1 line-clamp-1 pm-sm font-semibold text-fg">
          <Link href={link(detailPath(product))} className="after:absolute after:inset-0 after:content-[''] hover:underline">
            {t(product.title)}
          </Link>
        </h2>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="inline-flex items-baseline gap-1.5">
            <span className="sr-only">{ui("currentBid")}</span>
            <Money value={product.currentBid} className="pm-price text-fg" />
          </span>
          <span className={cx("inline-flex items-center gap-1 pm-xs font-semibold", urgent ? "text-live" : "text-fg-2")}>
            <Timer aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{ui("closesIn")} </span>
            <TimeLeft endsIn={product.endsIn} />
          </span>
        </p>
      </div>
      <span aria-hidden="true" className="hidden size-10 shrink-0 place-items-center rounded-full bg-primary text-on-primary sm:grid">
        <Gavel className="size-4" />
      </span>
    </article>
  );
}

/**
 * Split hero: the brand line, the two ways to shop and the departments on
 * one side; a large lifestyle photograph of the featured lot on the other.
 */
export function Hero() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section id="pm-hero" aria-labelledby={titleId}>
      <div className="pm-container grid gap-8 pb-14 pt-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16 lg:pb-24 lg:pt-12">
        <div className="relative order-first lg:order-last">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-[var(--pm-hero-field)] sm:aspect-[5/4] lg:aspect-[6/5]">
            <Img image={HERO_PHOTO} alt={t(COPY.heroPhoto)} priority sizes="(min-width: 1024px) 56vw, 100vw" className="absolute inset-0 size-full object-cover" />
          </div>
          <FeaturedLotCard className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-5 sm:start-5 sm:w-[380px] lg:-start-12 lg:bottom-12" />
        </div>

        <div className="lg:py-8">
          <p className="pm-eyebrow text-accent">{t(HERO.eyebrow)}</p>
          <h1 id={titleId} className="mt-4 pm-display text-fg">
            {HERO.titleLines.map((line) => (
              <span key={line.en} className="block">
                {t(line)}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-md pm-lg text-fg-2">{t(HERO.body)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={link("/browse?tab=buy_now")} className={btnClass("ink", "lg")}>
              {t(HERO.secondaryCta)}
            </Link>
            <Link href={link("/browse?tab=auction")} className={btnClass("outline", "lg")}>
              {t(HERO.primaryCta)}
            </Link>
          </div>
          <div className="mt-10 border-t border-line pt-5">
            <p className="pm-label text-fg-3">{t(COPY.shopDepartments)}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {HERO_DEPARTMENTS.map((slug) => (
                <li key={slug}>
                  <Link href={link(`/browse?category=${slug}`)} className="pm-link pm-sm text-fg">
                    {t(CATEGORY_BY_SLUG[slug].name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
