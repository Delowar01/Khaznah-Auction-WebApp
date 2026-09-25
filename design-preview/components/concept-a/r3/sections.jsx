"use client";

import Link from "next/link";
import { useId } from "react";
import { ArrowUpRight, BadgeCheck, Gavel, Truck, UserRound, Wallet } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { CATEGORY_BY_SLUG, CATEGORIES } from "@/data/categories";
import { GRADES, GRADE_ORDER } from "@/data/grades";
import { CITIES, getSeller } from "@/data/sellers";
import { HOW_IT_WORKS } from "@/data/site";
import { sellerStats } from "@/lib/catalog";
import { COPY } from "./copy";
import { CategoryArt } from "./art";
import { BUY_NOW_COUNT, FEATURE_ROW_A, FEATURE_ROW_B, MOSAIC_SELLERS, ON_THE_BLOCK, OPEN_AUCTION_COUNT, READY_TO_BUY } from "./lots";
import { useVisual } from "./state";
import { FeatureTile, LotTile, Showcase } from "./Tile";
import { LiveDot, cx, pillClass } from "./ui";

function SectionHead({ id, title, sub, action, className = "" }) {
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
      <div className="max-w-2xl">
        <h2 id={id} className="vm-h2 text-balance text-fg">
          {title}
        </h2>
        {sub ? <p className="mt-1.5 vm-md text-fg-2">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

function MoreLink({ href, children }) {
  const { link } = useConcept();
  return (
    <Link href={link(href)} className={pillClass("outline", "md")}>
      {children}
      <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
    </Link>
  );
}

// ── Category & seller mosaic (tablet and up) ─────────────────────────────
const MOSAIC = [
  { slug: "home-appliances", area: "big" },
  { slug: "home-kitchen", area: "tall" },
  { slug: "furniture", area: "a" },
  { slug: "fashion", area: "b" },
  { slug: "tools-diy", area: "c" },
  { slug: "automotive", area: "d" },
  { slug: "electronics", area: "e" },
  { slug: "bulk-pallets", area: "f" },
];

function MosaicTile({ slug, area }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const category = CATEGORY_BY_SLUG[slug];
  const big = area === "big";
  return (
    <li data-area={area} className="min-h-0">
      <Link
        href={link(`/browse?category=${slug}`)}
        className="group relative block size-full overflow-hidden rounded-card bg-surface-2 outline-offset-[3px]"
      >
        <CategoryArt slug={slug} sizes={big ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} />
        <span className={cx("vm-band absolute bottom-3 start-3 max-w-[calc(100%-24px)] rounded-[14px]", big ? "px-5 py-3.5" : "px-3.5 py-2.5")}>
          <span className={cx("block font-bold", big ? "vm-h3" : "vm-md")}>{t(category.name)}</span>
          <span className="block vm-xs opacity-80">
            {big ? `${t(category.blurb)} · ` : ""}
            {pl("lots", category.count)}
          </span>
        </span>
      </Link>
    </li>
  );
}

function SellerTile({ code }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const seller = getSeller(code);
  const stats = sellerStats(code);
  return (
    <li className="h-[200px] lg:h-[240px]">
      <Link href={link(`/seller/${code}`)} className="group relative block size-full overflow-hidden rounded-card bg-surface-2 outline-offset-[3px]">
        <Img
          image={seller.cover}
          alt=""
          sizes="50vw"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        {seller.liveNow ? (
          <span className="absolute end-3 top-3 inline-flex h-8 items-center gap-2 rounded-full bg-white px-3 vm-xs font-extrabold text-[#181614] shadow-card">
            <LiveDot />
            {t(COPY.hosting)}
          </span>
        ) : null}
        <span className="vm-band absolute bottom-3 start-3 flex max-w-[calc(100%-24px)] items-center gap-3 rounded-[16px] py-2.5 pe-4 ps-2.5">
          <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full vm-sm font-extrabold text-white" style={{ background: seller.tone }}>
            {seller.monogram}
          </span>
          <span className="min-w-0">
            <span className="block truncate vm-md font-bold">{t(seller.name)}</span>
            <span className="block truncate vm-xs opacity-80">
              {pl("lots", stats.total)} · {t(CITIES[seller.city])}
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}

export function Mosaic() {
  const { t } = useLang();
  const { open } = useVisual();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vm-container mt-20 hidden md:block lg:mt-24">
      <SectionHead
        id={titleId}
        title={t(COPY.mosaicTitle)}
        sub={t(COPY.mosaicSub)}
        action={
          <button type="button" onClick={() => open("categories")} className={pillClass("outline", "md")}>
            {t(COPY.allCategories)}
            <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
          </button>
        }
      />
      <ul className="vm-mosaic mt-7">
        {MOSAIC.map((tile) => (
          <MosaicTile key={tile.slug} {...tile} />
        ))}
      </ul>
      <ul className="mt-3.5 grid grid-cols-2 gap-3.5 lg:mt-4 lg:gap-4" aria-label={t(COPY.sellersRow)}>
        {MOSAIC_SELLERS.map((code) => (
          <SellerTile key={code} code={code} />
        ))}
      </ul>
    </section>
  );
}

/** Phones: category "stories" — round cut-outs, with the live seller first among sellers. */
export function Stories() {
  const { t } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="mt-6 md:hidden">
      <h2 id={titleId} className="sr-only">
        {t(COPY.categories)}
      </h2>
      <ul className="no-scrollbar flex snap-x scroll-px-4 gap-3.5 overflow-x-auto px-4 pb-1 pt-1">
        {CATEGORIES.map((category) => (
          <li key={category.slug} className="snap-start">
            <Link href={link(`/browse?category=${category.slug}`)} className="flex w-[74px] flex-col items-center gap-1.5 text-center">
              <span className="grid size-[70px] place-items-center rounded-full bg-surface p-[3px] ring-1 ring-line-strong">
                <span className="grid size-full place-items-center overflow-hidden rounded-full bg-[var(--vm-field)] p-2.5">
                  <Img image={category.image} cutout alt="" sizes="70px" className="vm-floor max-h-full w-auto object-contain" />
                </span>
              </span>
              <span className="line-clamp-2 vm-xs font-semibold text-fg">{t(category.name)}</span>
            </Link>
          </li>
        ))}
        {MOSAIC_SELLERS.map(getSeller)
          .sort((a, b) => Number(b.liveNow) - Number(a.liveNow))
          .map((seller) => (
            <li key={seller.code} className="snap-start">
              <Link href={link(`/seller/${seller.code}`)} className="flex w-[74px] flex-col items-center gap-1.5 text-center">
                <span className={cx("relative grid size-[70px] place-items-center rounded-full p-[3px]", seller.liveNow ? "bg-live" : "bg-surface ring-1 ring-line-strong")}>
                  <span className="size-full overflow-hidden rounded-full border-2 border-bg">
                    <Img image={seller.cover} alt="" sizes="70px" className="size-full object-cover" />
                  </span>
                  {seller.liveNow ? (
                    <span className="absolute -bottom-1 rounded-[6px] bg-live px-1.5 text-[10px] font-extrabold uppercase leading-4 tracking-wide text-white">{t(COPY.live)}</span>
                  ) : null}
                </span>
                <span className="line-clamp-2 vm-xs font-semibold text-fg">{t(seller.name)}</span>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}

// ── Featured marketplace: 1/2 + 1/4 + 1/4, then mirrored ────────────────
export function FeatureRows() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vm-container mt-16 lg:mt-24">
      <SectionHead id={titleId} title={t(COPY.featuredTitle)} sub={t(COPY.featuredSub)} />
      <ul className="mt-7 grid grid-cols-2 gap-3 lg:auto-rows-[300px] lg:grid-cols-4 lg:gap-4 xl:auto-rows-[310px] min-[1400px]:auto-rows-[320px]">
        <li className="col-span-2">
          <FeatureTile product={FEATURE_ROW_A.feature} manifest className="h-full" sizes="(min-width: 1024px) 50vw, 100vw" />
        </li>
        {FEATURE_ROW_A.tiles.map((product) => (
          <li key={product.slug}>
            <LotTile product={product} className="lg:aspect-auto lg:h-full" />
          </li>
        ))}
        {FEATURE_ROW_B.tiles.map((product) => (
          <li key={product.slug}>
            <LotTile product={product} className="lg:aspect-auto lg:h-full" />
          </li>
        ))}
        <li className="col-span-2">
          <FeatureTile product={FEATURE_ROW_B.feature} className="h-full" sizes="(min-width: 1024px) 50vw, 100vw" />
        </li>
      </ul>
    </section>
  );
}

// ── On the block: four wide auction showcases, soonest first ─────────────
export function OnTheBlock() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="mt-16 bg-surface-2 py-14 lg:mt-24 lg:py-20">
      <div className="vm-container">
        <SectionHead
          id={titleId}
          title={t(COPY.onTheBlock)}
          sub={t(COPY.onTheBlockSub)}
          action={<MoreLink href="/browse?tab=auction">{t(COPY.seeAllAuctions, { n: OPEN_AUCTION_COUNT })}</MoreLink>}
        />
        <ul className="no-scrollbar -mx-4 mt-7 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-2 lg:gap-4">
          {ON_THE_BLOCK.map((product) => (
            <li key={product.slug} className="flex w-[88%] max-w-[380px] shrink-0 snap-start sm:w-auto sm:max-w-none">
              <Showcase product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Ready to buy: four squares around a 2×2 feature ─────────────────────
export function ReadyToBuy() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vm-container mt-16 lg:mt-24">
      <SectionHead
        id={titleId}
        title={t(COPY.readyToBuy)}
        sub={t(COPY.readyToBuySub)}
        action={<MoreLink href="/browse?tab=buy_now">{t(COPY.shopAll, { n: BUY_NOW_COUNT })}</MoreLink>}
      />
      <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
        <li className="col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <FeatureTile product={READY_TO_BUY.feature} shape="square" className="h-full" sizes="(min-width: 1024px) 50vw, 100vw" />
        </li>
        {READY_TO_BUY.tiles.map((product) => (
          <li key={product.slug}>
            <LotTile product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Condition grades band ───────────────────────────────────────────────
export function GradesBand() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section id="grades" aria-labelledby={titleId} className="mt-16 lg:mt-24">
      <div className="vm-container">
        <div className="rounded-[28px] bg-[var(--vm-field)] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <SectionHead id={titleId} title={t(COPY.gradesTitle)} sub={t(COPY.gradesSub)} />
          <ol className="no-scrollbar -mx-5 mt-8 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 xl:grid-cols-7">
            {GRADE_ORDER.map((key) => {
              const grade = GRADES[key];
              return (
                <li key={key} className="w-[168px] shrink-0 snap-start rounded-[20px] bg-surface p-4 sm:w-auto">
                  <span
                    aria-hidden="true"
                    className="grid h-12 min-w-12 place-items-center justify-self-start rounded-full px-3 vm-md font-extrabold text-bg"
                    style={{ background: `var(--grade-${key === "new" ? "new" : key.toLowerCase()})` }}
                  >
                    {t(grade.short)}
                  </span>
                  <p className="mt-3 vm-sm font-bold text-fg">{t(grade.label)}</p>
                  <p className="mt-1 vm-xs text-fg-2">{t(grade.text)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ── How Khazna works: four text steps ───────────────────────────────────
const STEP_ICONS = [UserRound, Wallet, Gavel, Truck];

export function HowItWorks() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section id="how-it-works" aria-labelledby={titleId} className="vm-container scroll-mt-24 py-16 lg:py-24">
      <div className="text-center">
        <h2 id={titleId} className="vm-h2 text-fg">
          {t(COPY.howTitle)}
        </h2>
      </div>
      <ol className="relative mt-10 grid gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
        <span aria-hidden="true" className="absolute inset-x-[12.5%] top-7 hidden h-px bg-line-strong lg:block" />
        {HOW_IT_WORKS.map((step, i) => {
          const Icon = STEP_ICONS[i] || BadgeCheck;
          return (
            <li key={step.step} className="relative flex flex-col items-center text-center">
              <span className="relative grid size-14 place-items-center rounded-full border border-line-strong bg-bg">
                <Icon aria-hidden="true" className="size-6 text-fg" />
                <span className="absolute -end-1 -top-1 grid size-6 place-items-center rounded-full bg-primary text-[12px] font-extrabold text-on-primary tabular">{step.step}</span>
              </span>
              <h3 className="mt-4 vm-h3 text-fg">{t(step.title)}</h3>
              <p className="mt-1.5 max-w-[260px] vm-sm text-fg-2">{t(step.text)}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
