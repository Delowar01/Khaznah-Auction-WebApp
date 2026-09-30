"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { useDismiss } from "@/components/shared/ui/hooks";
import { useGoSearch, useSearchResults } from "@/components/shared/r3/home";
import { WORK_MEDIA } from "@/components/shared/r3/work-media";
import { CATEGORIES } from "@/data/categories";
import { POPULAR_SEARCHES, detailPath, isAuction } from "@/lib/catalog";
import { COPY } from "./copy";
import { Arrow, btn, cx } from "./ui";

const srcSet = (image) => image.sources.map((source) => `${source.src} ${source.w}w`).join(", ");

/**
 * The approved limestone photographs (decorative: the products in them are
 * scenery, not cards; photographs are never mirrored). One <picture>, so a
 * device only downloads the composition it shows:
 * - Phones (< 640 px): A7, the portrait companion, full width along the
 *   bottom of the hero; the copy sits on its quiet upper wall. The photograph
 *   is clipped here rather than on the hero, so the search suggestions can
 *   still open below the hero.
 * - 640–1199 px: A6 as a panorama strip under the copy, cropped only to
 *   10:3 (the manifest's product-safe crop) and faded into the wall colour.
 * - From 1200 px: A6 behind the centred copy, bottom-aligned, never taller
 *   than the 433 px hero and never cropped narrower than ~3.15:1, so the
 *   tote and the chair, lamp, washer and suitcase stay in view.
 */
function HeroPhoto() {
  const wide = WORK_MEDIA.limestoneWide;
  const phone = WORK_MEDIA.limestonePhone;
  const fallback = wide.sources[1];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden sm:relative sm:inset-auto sm:aspect-[10/3] sm:w-full dt:absolute dt:inset-x-0 dt:bottom-0 dt:aspect-auto dt:h-[min(433px,31.75vw)]">
      <picture>
        <source media="(max-width: 639.98px)" srcSet={srcSet(phone)} sizes="100vw" />
        <img
          src={fallback.src}
          srcSet={srcSet(wide)}
          sizes="100vw"
          width={fallback.w}
          height={fallback.h}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="absolute bottom-0 left-0 h-auto w-full sm:inset-0 sm:size-full sm:object-cover"
        />
      </picture>
      <span className="absolute inset-x-0 top-0 hidden h-[38%] bg-linear-to-b from-[var(--sc-hero-wall)] to-transparent sm:block dt:h-16 min-[85.25rem]:hidden" />
    </div>
  );
}

/**
 * The longest of `options` that fits the field without being cut off. The
 * first option (the full placeholder) is also what the server renders; the
 * check runs whenever the field is laid out or resized, and again once the
 * web fonts have loaded.
 */
function useFittingPlaceholder(ref, options) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const input = ref.current;
    if (!input) return undefined;
    const context = document.createElement("canvas").getContext("2d");
    let active = true;
    const measure = () => {
      if (!active) return;
      const style = getComputedStyle(input);
      context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const room = input.clientWidth - parseFloat(style.paddingInlineStart) - parseFloat(style.paddingInlineEnd) - 2;
      const fits = options.findIndex((text) => context.measureText(text).width <= room);
      setIndex(fits === -1 ? options.length - 1 : fits);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(input);
    document.fonts?.ready.then(measure);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [ref, options]);
  return options[index] ?? options[0];
}

/**
 * Category scope · query · green Search, with suggestions under the field.
 * From 1200 px the field sits over A6 and stops ~12 px short of the leather
 * chair on the right: 560 px at 1200, growing to 640 px from ~1366 px.
 */
function SegmentedSearch() {
  const { t } = useLang();
  const { link } = useConcept();
  const go = useGoSearch();
  const id = useId();
  const ref = useRef(null);
  const inputRef = useRef(null);
  const placeholders = useMemo(() => [COPY.searchPlaceholder, COPY.searchPlaceholderShort, COPY.searchPlaceholderShortest].map((text) => t(text)), [t]);
  const placeholder = useFittingPlaceholder(inputRef, placeholders);
  const shortened = placeholder !== placeholders[0];
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("");
  const [open, setOpen] = useState(false);
  const results = useSearchResults(query);
  useDismiss(open, () => setOpen(false), ref);
  const listId = `${id}-list`;
  const pick = () => setOpen(false);
  const heading = "sc-xs font-semibold uppercase tracking-[0.08em] text-[var(--sc-muted)]";
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[767px] text-start dt:max-w-[min(640px,calc(48.7vw-24px))]">
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
            ref={inputRef}
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
            placeholder={placeholder}
            aria-describedby={shortened ? `${id}-hint` : undefined}
            aria-controls={open ? listId : undefined}
            className="sc-search h-11 min-w-0 flex-1 bg-transparent sc-md text-[var(--sc-ink)] outline-none dt:text-[15px]"
          />
          {/* The full hint stays available to assistive technology when a shorter placeholder is shown. */}
          {shortened ? (
            <span id={`${id}-hint`} className="sr-only">
              {placeholders[0]}
            </span>
          ) : null}
          <button type="submit" className={btn("green", "md", "h-11 gap-2 px-4 sm:h-[54px] sm:w-[139px] sm:px-0 sm:text-[17px]")}>
            <Search aria-hidden="true" className="size-5" strokeWidth={2.2} />
            {t(COPY.search)}
          </button>
        </div>
      </form>
      {open ? (
        <div id={listId} data-suggestions className="absolute inset-x-0 top-[calc(100%+8px)] z-50 max-h-[70dvh] overflow-y-auto rounded-[10px] border border-[var(--sc-line)] bg-white p-4 text-start shadow-overlay">
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              {/* grid-cols-1 keeps the phone column inside the panel, so long titles truncate and every price stays in view. */}
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
  // While the search suggestions are open (they can run past the hero's
  // bottom edge), z-20 lifts the hero above the sections that follow: their
  // product cards come later in paint order and their save and bid buttons
  // use z-10. Header menus (z-50) and the drawers, dialogs and toasts stay
  // above it; with the panel closed the hero paints exactly as before.
  return (
    <section data-ref="03" aria-labelledby={titleId} className="relative isolate has-[[data-suggestions]]:z-20 bg-[var(--sc-hero-wall)] [--sc-hero-wall:#e4d1c1] sm:[--sc-hero-wall:#dccbba]">
      {/* Copy and search sit on the photographs' quiet wall: above A7's
          products on phones, above the A6 strip on tablets, in A6's clear
          centre on desktop (the search narrows there to stay clear of the
          chair on the right). */}
      <div className="relative z-10 mx-auto flex max-w-[820px] flex-col items-center px-4 pb-[57vw] pt-8 text-center sm:pb-7 md:px-8 dt:h-[433px] dt:pb-0 dt:pt-[47px]">
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
      <HeroPhoto />
    </section>
  );
}
