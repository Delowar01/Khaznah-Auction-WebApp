"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { useDismiss } from "@/components/shared/ui/hooks";
import { useGoSearch, useSearchResults } from "@/components/shared/r3/home";
import { CATEGORIES } from "@/data/categories";
import { POPULAR_SEARCHES, detailPath, isAuction } from "@/lib/catalog";
import { COPY } from "./copy";
import { HERO_PROPS } from "./data";
import { Arrow, btn, cx } from "./ui";

/**
 * Product-framed stage behind the copy. Drawn at the 1440px composition and
 * scaled per breakpoint (the photograph keeps its physical left/right
 * arrangement in Arabic). Decorative only: the products here are scenery,
 * not cards.
 */
function Stage() {
  const scale = "scale-[0.4] sm:scale-[0.5] lg:scale-[0.55] dt:scale-[0.72] wd:scale-100";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Left: arched niche, plinth and the cognac tote */}
      <div className={cx("absolute bottom-0 left-0 h-[433px] w-[333px] origin-bottom-left", scale)}>
        <span className="absolute left-[62px] top-0 h-[300px] w-[64px] bg-[#e9dfd1]" />
        <span className="absolute left-[126px] top-[22px] h-[260px] w-[160px] rounded-t-full bg-[#e3d7c6] shadow-[inset_0_18px_30px_-18px_rgb(120_96_70/0.35)]" />
        <span className="absolute left-0 top-[270px] h-[16px] w-[333px] bg-[#f6efe6] shadow-[0_1px_0_#d9ccb9]" />
        <span className="absolute left-0 top-[286px] h-[115px] w-[333px] bg-gradient-to-b from-[#e2d5c3] to-[#d6c8b4] shadow-[inset_-10px_0_18px_-12px_rgb(110_86_60/0.35)]" />
        <Img image={HERO_PROPS.tote} alt="" sizes="170px" priority className="sc-multiply absolute left-[112px] top-[82px] h-[196px] w-[170px] object-contain object-bottom" />
      </div>
      {/* Right: arch, rug, floor lamp, leather chair, washer and suitcase */}
      <div className={cx("absolute bottom-0 right-0 h-[433px] w-[500px] origin-bottom-right", scale)}>
        <span className="absolute right-[40px] top-[6px] h-[330px] w-[190px] rounded-t-full bg-[#e5d9c8] shadow-[inset_0_18px_30px_-18px_rgb(120_96_70/0.3)]" />
        <span className="absolute bottom-[4px] right-[-20px] h-[64px] w-[500px] rounded-[50%] bg-[#d8cbb9]/80" />
        <Img image={HERO_PROPS.lamp} alt="" sizes="110px" className="absolute right-[196px] top-[92px] h-[318px] w-[103px] object-contain object-bottom" />
        <Img image={HERO_PROPS.chair} alt="" sizes="230px" className="absolute right-[150px] top-[176px] h-[236px] w-[228px] object-contain object-bottom drop-shadow-[0_12px_14px_rgb(70_50_30/0.25)]" />
        <Img image={HERO_PROPS.washer} alt="" sizes="170px" className="absolute right-[-12px] top-[120px] h-[222px] w-[164px] object-contain object-bottom drop-shadow-[0_10px_12px_rgb(70_50_30/0.18)]" />
        <Img image={HERO_PROPS.suitcase} alt="" sizes="110px" className="absolute right-[4px] top-[236px] h-[190px] w-[113px] object-contain object-bottom drop-shadow-[0_10px_12px_rgb(70_50_30/0.22)]" />
      </div>
    </div>
  );
}

/** Category scope · query · green Search, with suggestions under the field. */
function SegmentedSearch() {
  const { t } = useLang();
  const { link } = useConcept();
  const go = useGoSearch();
  const id = useId();
  const ref = useRef(null);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("");
  const [open, setOpen] = useState(false);
  const results = useSearchResults(query);
  useDismiss(open, () => setOpen(false), ref);
  const listId = `${id}-list`;
  const pick = () => setOpen(false);
  const heading = "sc-xs font-semibold uppercase tracking-[0.08em] text-[var(--sc-muted)]";
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[767px] text-start dt:max-w-[660px] wd:max-w-[767px]">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setOpen(false);
          go(query, scope);
        }}
        className="flex flex-col gap-2 rounded-[11px] border border-[#e1e5e3] bg-white p-[7px] shadow-[0_10px_30px_-16px_rgb(16_33_57/0.35)] sm:h-[69px] sm:flex-row sm:items-center"
      >
        <label htmlFor={`${id}-scope`} className="sr-only">
          {t(COPY.searchScope)}
        </label>
        <div className="relative shrink-0">
          <select
            id={`${id}-scope`}
            value={scope}
            onChange={(event) => setScope(event.target.value)}
            className="h-11 w-full cursor-pointer appearance-none rounded-[7px] bg-[#eef1f4] pe-8 ps-3 sc-md text-[var(--sc-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--sc-green)] sm:h-[46px] sm:w-[140px]"
          >
            <option value="">{t(COPY.allCategories)}</option>
            {CATEGORIES.map((category) => (
              <option key={category.slug} value={category.slug}>
                {t(category.name)}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-[var(--sc-ink)]" strokeWidth={2} />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Search aria-hidden="true" className="ms-2 size-[18px] shrink-0 text-[var(--sc-muted)]" strokeWidth={2} />
          <label htmlFor={`${id}-q`} className="sr-only">
            {t(COPY.searchLabel)}
          </label>
          <input
            id={`${id}-q`}
            type="search"
            autoComplete="off"
            enterKeyHint="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={t(COPY.searchPlaceholder)}
            aria-controls={open ? listId : undefined}
            className="sc-search h-11 min-w-0 flex-1 bg-transparent sc-md text-[var(--sc-ink)] outline-none dt:text-[15px]"
          />
          <button type="submit" className={btn("green", "md", "h-11 gap-2 px-4 sm:h-[54px] sm:w-[139px] sm:px-0 sm:text-[17px]")}>
            <Search aria-hidden="true" className="size-5" strokeWidth={2.2} />
            {t(COPY.search)}
          </button>
        </div>
      </form>
      {open ? (
        <div id={listId} className="absolute inset-x-0 top-[calc(100%+8px)] z-50 max-h-[70dvh] overflow-y-auto rounded-[10px] border border-[var(--sc-line)] bg-white p-4 text-start shadow-overlay">
          {!results ? (
            <>
              <p className={heading}>{t(COPY.popularSearches)}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <li key={term.en}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        go(t(term), scope);
                      }}
                      className="h-9 rounded-[6px] border border-[var(--sc-line)] bg-white px-3.5 sc-sm text-[var(--sc-ink)] hover:border-[var(--sc-green)]"
                    >
                      {t(term)}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div>
                <p className={heading}>{t(COPY.resultsLots)}</p>
                {results.lots.length ? null : <p className="mt-2 sc-sm text-[var(--sc-muted)]">{t(COPY.noMatch, { q: query.trim() })}</p>}
                <ul className="mt-1">
                  {results.lots.map((product) => (
                    <li key={product.slug}>
                      <Link href={link(detailPath(product))} onClick={pick} className="flex items-center gap-3 rounded-[6px] px-2 py-2 hover:bg-[var(--sc-soft)]">
                        <span className="relative size-11 shrink-0 overflow-hidden rounded-[6px] bg-[var(--sc-plate)]">
                          <Img image={product.images[0]} alt="" sizes="44px" className="sc-multiply size-full object-contain p-1" />
                        </span>
                        <span className="min-w-0 flex-1 truncate sc-sm font-medium text-[var(--sc-ink)]">{t(product.title)}</span>
                        <Money value={isAuction(product) ? product.currentBid : product.price} className="sc-sm font-bold text-[var(--sc-ink)]" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={link(`/browse?search=${encodeURIComponent(query.trim())}`)} onClick={pick} className="sc-link mt-2 inline-flex sc-sm font-semibold text-[var(--sc-link)]">
                  {t(COPY.seeAllResults, { q: query.trim() })}
                </Link>
              </div>
              {results.categories.length || results.sellers.length ? (
                <div className="space-y-4">
                  {results.categories.length ? (
                    <div>
                      <p className={heading}>{t(COPY.resultsCategories)}</p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {results.categories.map((category) => (
                          <li key={category.slug}>
                            <Link href={link(`/browse?category=${category.slug}`)} onClick={pick} className="inline-flex h-9 items-center rounded-[6px] border border-[var(--sc-line)] px-3.5 sc-sm text-[var(--sc-ink)] hover:border-[var(--sc-green)]">
                              {t(category.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {results.sellers.length ? (
                    <div>
                      <p className={heading}>{t(COPY.resultsSellers)}</p>
                      <ul className="mt-2 space-y-1">
                        {results.sellers.map((seller) => (
                          <li key={seller.code}>
                            <Link href={link(`/seller/${seller.code}`)} onClick={pick} className="sc-link sc-sm text-[var(--sc-link)]">
                              {t(seller.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function Hero() {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const other = lang === "ar" ? "en" : "ar";
  return (
    <section data-ref="03" aria-labelledby={titleId} className="sc-stage relative isolate">
      <Stage />
      {/* Copy and search sit in the calm centre; below tablet the scene
          continues under the buttons so no text crosses the products. */}
      <div className="relative z-10 mx-auto flex max-w-[820px] flex-col items-center px-4 pb-[150px] pt-8 text-center sm:pb-[190px] md:px-8 lg:pb-[150px] dt:h-[433px] dt:pb-0 dt:pt-[47px]">
        <p lang={other} dir={other === "ar" ? "rtl" : "ltr"} className="sc-eyebrow text-[var(--sc-green)]">
          {t(COPY.heroEyebrow)}
        </p>
        <h1 id={titleId} className="mt-1.5 sc-hero text-[var(--sc-green)] dt:mt-[7px]">
          {t(COPY.heroTitle)}
        </h1>
        <p className="mt-2 sc-hero-sub text-[#3f4b5d] dt:mt-[7px]">{t(COPY.heroSub)}</p>
        <div className="mt-6 w-full dt:mt-[25px]">
          <SegmentedSearch />
        </div>
        <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:flex-row dt:mt-[35px] dt:gap-[18px]">
          <Link href={link("/browse?tab=buy_now")} className={btn("green", "lg", "h-[52px] w-full gap-3 sm:w-auto sm:px-7 dt:h-[58px] dt:w-[205px] dt:px-0 dt:text-[17px]")}>
            {t(COPY.shopBuyNow)}
            <Arrow className="size-5" />
          </Link>
          <Link href={link("/browse?tab=auction")} className={btn("outline", "lg", "h-[52px] w-full gap-3 sm:w-auto sm:px-7 dt:h-[58px] dt:w-[214px] dt:px-0 dt:text-[17px]")}>
            {t(COPY.exploreAuctions)}
            <Arrow className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
