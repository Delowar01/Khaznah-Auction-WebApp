"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck, LayoutGrid, Search } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { getProduct } from "@/data/products";
import { HERO } from "@/data/site";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { COPY } from "./copy";
import { Cutout } from "./art";
import { FEATURED_NOW, HERO_END, HERO_LINEUP, HERO_START } from "./lots";
import { useVisual } from "./state";
import { LotTile } from "./Tile";
import { cx } from "./ui";

const HERO_CATEGORIES = ["home-appliances", "home-kitchen", "furniture", "fashion"];

/** One desktop cluster of cut-outs standing on the hero floor. */
function Cluster({ items, side }) {
  const { isRTL } = useLang();
  const physicalLeft = (side === "start") !== isRTL;
  return (
    <div
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute bottom-[152px] hidden h-[380px] w-[344px] scale-[0.5] lg:block xl:scale-[0.78] min-[1400px]:scale-100",
        side === "start" ? "start-[28px] xl:start-[44px] min-[1400px]:start-[24px]" : "end-[28px] xl:end-[44px] min-[1400px]:end-[24px]",
      )}
      style={{ transformOrigin: physicalLeft ? "bottom left" : "bottom right" }}
    >
      {items.map(({ slug, h, x, z, y = 0 }) => (
        <Cutout
          key={slug}
          image={getProduct(slug).images[0]}
          height={h}
          priority
          sizes={`${Math.round(h * 1.2)}px`}
          className="absolute"
          style={{ [side === "start" ? "insetInlineStart" : "insetInlineEnd"]: x, bottom: y, zIndex: z }}
        />
      ))}
    </div>
  );
}

/** Phones and tablets: one line-up of the same cut-outs above the headline. */
function Lineup() {
  return (
    <div aria-hidden="true" className="pointer-events-none mx-auto flex h-[150px] max-w-full items-end justify-center sm:h-[210px] lg:hidden">
      {HERO_LINEUP.map(({ slug, h, z, wide }) => (
        <Cutout
          key={slug}
          image={getProduct(slug).images[0]}
          height={`${h * 100}%`}
          priority
          sizes="160px"
          className={cx("relative -mx-[5px] sm:-mx-2", wide ? "hidden sm:block" : "")}
          style={{ zIndex: z }}
        />
      ))}
    </div>
  );
}

function HeroSearch() {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState("");
  const submit = (event) => {
    event.preventDefault();
    const value = query.trim();
    router.push(link(value ? `/browse?search=${encodeURIComponent(value)}` : "/browse"));
  };
  return (
    <form role="search" onSubmit={submit} className="flex w-full items-center gap-2 rounded-full border border-line-strong bg-surface p-1.5 ps-5 shadow-raised transition-shadow focus-within:border-fg focus-within:shadow-overlay sm:p-2 sm:ps-6">
      <label htmlFor={inputId} className="sr-only">
        {t(COPY.searchLabel)}
      </label>
      <Search aria-hidden="true" className="size-5 shrink-0 text-fg-2" />
      <input
        id={inputId}
        type="search"
        autoComplete="off"
        enterKeyHint="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t(COPY.searchPlaceholder)}
        className="vm-search h-11 min-w-0 flex-1 bg-transparent vm-md text-fg outline-none placeholder:text-fg-3 sm:h-12"
      />
      <button type="submit" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4 vm-sm font-bold text-on-primary transition-colors hover:bg-primary-hover sm:h-12 sm:px-6">
        <span className="sr-only sm:not-sr-only">{t(COPY.searchTitle)}</span>
        <ArrowRight aria-hidden="true" className="flip-rtl size-4 sm:hidden" />
      </button>
    </form>
  );
}

/**
 * Centred discovery hero: product cut-outs frame both sides of a neutral
 * field; the search sits in the middle. Four Featured tiles straddle its
 * lower edge (see FeaturedNow).
 */
export function Hero() {
  const { t } = useLang();
  const { link } = useConcept();
  const { open } = useVisual();
  const titleId = useId();
  return (
    <section id="vm-hero" aria-labelledby={titleId} className="relative overflow-hidden bg-[var(--vm-field)]">
      <div className="vm-container relative">
        <Cluster items={HERO_START} side="start" />
        <Cluster items={HERO_END} side="end" />

        <div className="relative z-[1] flex flex-col items-center pb-10 pt-[calc(var(--vm-header-h)+12px)] text-center md:pb-[172px] lg:pt-[calc(var(--vm-header-h)+44px)]">
          <Lineup />
          <p className="mt-5 vm-eyebrow text-fg-2 lg:mt-0">{t(HERO.eyebrow)}</p>
          <h1 id={titleId} className="mt-3 max-w-[15ch] vm-hero text-balance text-fg lg:max-w-[16ch]">
            {t(HERO.titleLines[0])} <span className="block">{t(HERO.titleLines[1])}</span>
          </h1>

          <div className="mt-6 w-full max-w-[560px] lg:mt-7 xl:max-w-[600px]">
            <HeroSearch />
          </div>

          <div className="mt-3.5 hidden max-w-[560px] flex-wrap items-center justify-center gap-x-1 gap-y-1.5 sm:flex">
            <span className="me-1 vm-sm font-semibold text-fg-3">{t(COPY.popular)}:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term.en}
                href={link(`/browse?search=${encodeURIComponent(t(term))}`)}
                className="rounded-full px-2.5 py-1 vm-sm font-semibold text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:bg-surface hover:decoration-fg"
              >
                {t(term)}
              </Link>
            ))}
          </div>

          <ul className="mt-5 hidden items-center gap-2 lg:flex">
            {HERO_CATEGORIES.map((slug) => {
              const category = CATEGORY_BY_SLUG[slug];
              return (
                <li key={slug} className={slug === "fashion" ? "hidden xl:block" : ""}>
                  <Link
                    href={link(`/browse?category=${slug}`)}
                    className="flex h-11 items-center gap-2 rounded-full border border-line bg-surface/80 pe-4 ps-1 vm-sm font-bold text-fg transition-colors hover:border-fg"
                  >
                    <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-[var(--vm-field)]">
                      <Img image={category.image} cutout alt="" sizes="36px" className="h-7 w-auto object-contain" />
                    </span>
                    {t(category.name)}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={() => open("categories")}
                className="flex h-11 items-center gap-2 rounded-full bg-primary px-4 vm-sm font-bold text-on-primary transition-colors hover:bg-primary-hover"
              >
                <LayoutGrid aria-hidden="true" className="size-4" />
                {t(COPY.allCategories)}
              </button>
            </li>
          </ul>

          <p className="mt-5 flex flex-col items-center gap-x-2 gap-y-0.5 vm-sm text-fg-2 sm:flex-row sm:flex-wrap sm:justify-center">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck aria-hidden="true" className="size-4 text-success" />
              {t(COPY.trustGrade)}
            </span>
            <span aria-hidden="true" className="hidden text-fg-3 sm:inline">
              ·
            </span>
            <span>{t(COPY.trustDelivery)}</span>
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href={link("/browse?tab=buy_now")} className="group inline-flex items-center gap-1.5 vm-md font-bold text-fg underline decoration-2 underline-offset-[6px] hover:decoration-accent">
              {t(HERO.secondaryCta)}
              <ArrowRight aria-hidden="true" className="flip-rtl size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link href={link("/browse?tab=auction")} className="group inline-flex items-center gap-1.5 vm-md font-bold text-fg underline decoration-2 underline-offset-[6px] hover:decoration-accent">
              {t(HERO.primaryCta)}
              <ArrowRight aria-hidden="true" className="flip-rtl size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Featured now: four square tiles that straddle the hero's lower edge. */
export function FeaturedNow() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="relative z-[2] mt-8 md:-mt-[132px]">
      <div className="vm-container">
        <h2 id={titleId} className="mb-3 flex items-center gap-2 vm-eyebrow text-fg-2">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          {t(COPY.featuredNow)}
        </h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
          {FEATURED_NOW.map((product, i) => {
            const full = i === 0 || i === 3;
            return (
              <li key={product.slug} className={full ? "col-span-2 md:col-span-1" : ""}>
                <LotTile
                  product={product}
                  priority={i < 2}
                  sizes={full ? "(min-width: 768px) 25vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                  className="shadow-raised"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
