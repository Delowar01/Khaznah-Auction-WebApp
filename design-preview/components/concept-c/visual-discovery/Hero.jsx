"use client";

import Link from "next/link";
import { useId } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { detailPath } from "@/lib/catalog";
import { COPY } from "./copy";
import { HERO } from "./data";
import { Arrow, HeartDisk, btn, cx } from "./ui";

/** Three small gold sketch strokes beside the handwritten line. */
function SketchMarks({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 60" className={className} fill="none" stroke="var(--vd-gold)" strokeWidth="3.2" strokeLinecap="round">
      <path d="M14 6 C 17 13, 19 17, 22 22" />
      <path d="M8 30 C 16 30, 22 31, 30 33" />
      <path d="M12 52 C 17 47, 21 44, 26 41" />
    </svg>
  );
}

function CopyTile({ titleId }) {
  const { t, isRTL } = useLang();
  const { link } = useConcept();
  return (
    <div className="relative flex h-full flex-col rounded-[18px] bg-[var(--vd-ivory)] px-6 py-8 md:px-10 dt:pb-[26px] dt:pe-[18px] dt:ps-[47px] dt:pt-[31px]">
      <h1 id={titleId} className="vd-hero text-[var(--vd-ink)]">
        {COPY.heroTitle.map((line, i) => (
          <span key={line.en} className="block">
            {t(line)}
            {i < COPY.heroTitle.length - 1 ? " " : null}
          </span>
        ))}
      </h1>
      <p className="mt-3 max-w-[380px] vd-hero-sub text-[var(--vd-ink)]/90 dt:mt-[14px]">{t(COPY.heroSub)}</p>
      <div className="mt-6 flex flex-wrap gap-3 dt:mt-[21px] dt:gap-[14px]">
        <Link href={link("/browse?tab=buy_now")} className={btn("gold", "lg", "dt:h-[49px] dt:w-[179px] dt:px-0")}>
          {t(COPY.shopBuyNow)}
          <Arrow />
        </Link>
        <Link href={link("/browse?tab=auction")} className={btn("outline", "lg", "dt:h-[49px] dt:w-[171px] dt:px-0")}>
          {t(COPY.exploreAuctions)}
        </Link>
      </div>
      <p className="mt-7 flex items-start gap-3 text-[var(--vd-blue)] dt:mt-auto" style={{ transform: `rotate(${isRTL ? 6 : -6}deg)`, transformOrigin: isRTL ? "right center" : "left center" }}>
        <span className="vd-hand">
          <span className="block">{t(COPY.handwritten[0])} </span>
          <span className="block ps-10">{t(COPY.handwritten[1])}</span>
        </span>
        <SketchMarks className="-mt-2 h-12 w-8 shrink-0" />
      </p>
    </div>
  );
}

/**
 * Centre scene: furniture photograph (A5) with a Furniture label and the
 * overlapping tote card. When the tile is at least 512 px wide (552 px in
 * the 1440 composition) both overlays sit on the photograph's clear floor;
 * on narrower tiles the label moves above the card and gets its own soft
 * scrim, because it then lies over the room rather than the floor.
 */
function FurnitureTile() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const tote = HERO.tote;
  return (
    <div className="@container relative h-full min-h-[380px] overflow-hidden rounded-[18px] bg-[#e8e1d8]">
      <Img image={HERO.furniture.image} alt="" priority sizes="(min-width: 1200px) 556px, (min-width: 768px) 50vw, 100vw" className="absolute inset-0 size-full object-cover" style={{ objectPosition: HERO.furniture.focus }} />
      <span aria-hidden="true" className="absolute inset-y-0 start-0 w-[70%] bg-[radial-gradient(ellipse_at_bottom_left,rgb(6_20_40/0.72),rgb(6_20_40/0.3)_45%,transparent_70%)] rtl:bg-[radial-gradient(ellipse_at_bottom_right,rgb(6_20_40/0.72),rgb(6_20_40/0.3)_45%,transparent_70%)]" />
      <div className="absolute bottom-[178px] start-5 isolate max-w-[70%] text-white before:absolute before:-inset-x-8 before:-inset-y-6 before:-z-10 before:bg-[radial-gradient(closest-side,rgb(6_20_40/0.55),transparent)] before:content-[''] @min-[512px]:bottom-[10px] @min-[512px]:start-[14px] @min-[512px]:max-w-[48%] @min-[512px]:before:hidden">
        <p className="vd-h3 !text-[21px] !leading-7 text-white">{t(COPY.furniture)}</p>
        <p className="vd-md text-white/90">{t(COPY.furnitureText)}</p>
        <Link href={link("/browse?category=furniture")} aria-label={t(COPY.exploreNamed, { name: t(COPY.furniture) })} className={btn("white", "sm", "mt-3 h-[38px] gap-3 px-5 dt:mt-[9px] dt:h-[34px] dt:px-[22px]")}>
          {t(COPY.explore)}
          <Arrow />
        </Link>
      </div>
      {/* Overlapping tote card, anchored in the scene's lower end corner */}
      <article className="absolute bottom-[11px] end-[11px] grid h-[154px] w-[284px] grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-[16px] bg-[var(--vd-ivory)] shadow-[0_10px_28px_-12px_rgb(7_27_82/0.45)] max-sm:w-[250px]">
        <div className="relative">
          <Img image={tote.images[0]} cutout alt="" sizes="112px" className="absolute inset-0 size-full object-contain px-2.5 py-3" />
        </div>
        <div className="relative flex min-w-0 flex-col justify-center pe-3">
          <HeartDisk product={tote} className="absolute end-2 top-2 !size-8 shadow-none" />
          <h3 className="line-clamp-2 pe-7 vd-title !text-[14px] !leading-[18px] text-[var(--vd-ink)]">
            <Link href={link(detailPath(tote))} className="after:absolute after:inset-0 after:content-[''] hover:underline">
              {t(tote.title)}
            </Link>
          </h3>
          <span className="sr-only">{ui("buyNow")}</span>
          <Money value={tote.price} className="mt-2 self-start vd-price !text-[22px] text-[var(--vd-ink)]" symbolClassName="text-[0.72em]" />
        </div>
      </article>
    </div>
  );
}

/** Category photo tile with a white label plate and a circular arrow. */
function CategoryPhotoTile({ slug, image, focus, text, plate = false, className = "" }) {
  const { t } = useLang();
  const { link } = useConcept();
  const category = CATEGORY_BY_SLUG[slug];
  return (
    <Link href={link(`/browse?category=${slug}`)} className={cx("group relative block overflow-hidden rounded-[18px] outline-offset-2", plate ? "bg-[#dfe8f1]" : "bg-[#f3d9cc]", className)}>
      <Img
        image={image}
        alt=""
        sizes="(min-width: 1200px) 401px, 50vw"
        cutout={plate}
        className={cx("absolute transition-transform duration-300 group-hover:scale-[1.02]", plate ? "end-[4%] top-[7%] h-[70%] w-[80%] object-contain object-right" : "inset-0 size-full object-cover")}
        style={focus ? { objectPosition: focus } : undefined}
      />
      <span className="absolute bottom-[14px] start-0 max-w-[calc(100%-84px)] rounded-e-[14px] bg-white/95 py-2 pe-5 ps-4 dt:bottom-[15px] dt:max-w-[62%]">
        <span className="block vd-h3 !text-[18px] !leading-6 text-[var(--vd-ink)]">{t(category.name)}</span>
        <span className="block vd-sm text-[var(--vd-muted)]">{text}</span>
      </span>
      <span aria-hidden="true" className="absolute bottom-[14px] end-3 grid size-[52px] place-items-center rounded-full bg-white text-[var(--vd-ink)] shadow-[0_4px_14px_rgb(7_27_82/0.12)] dt:bottom-[17px]">
        <Arrow className="size-5" />
      </span>
    </Link>
  );
}

export function HeroMosaic() {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section data-ref="03" aria-labelledby={titleId} className="vd-wide pt-2 dt:pt-[8px]">
      <div className="grid gap-2 md:grid-cols-2 dt:h-[520px] dt:grid-cols-[minmax(0,436fr)_minmax(0,556fr)_minmax(0,401fr)] dt:grid-rows-[minmax(0,1fr)] dt:gap-[8px]">
        <div className="md:col-span-1 dt:col-auto">
          <CopyTile titleId={titleId} />
        </div>
        <FurnitureTile />
        <div className="grid gap-2 sm:grid-cols-2 md:col-span-2 dt:col-auto dt:grid-cols-1 dt:grid-rows-[243fr_269fr] dt:gap-[8px]">
          <CategoryPhotoTile slug="electronics" image={HERO.electronics.image} focus={HERO.electronics.focus} text={t(COPY.electronicsText)} className="min-h-[190px]" />
          <CategoryPhotoTile slug="home-kitchen" image={HERO.kitchen.image} focus={HERO.kitchen.focus} text={t(COPY.kitchenText)} className="min-h-[190px]" />
        </div>
      </div>
    </section>
  );
}
