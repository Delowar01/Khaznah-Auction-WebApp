"use client";

import Link from "next/link";
import { useId } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { COPY } from "./copy";
import { HERO_CARDS } from "./data";
import { Arrow, btn, cx } from "./ui";

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
        {/* Auctions lead; Buy Now is the secondary choice. */}
        <Link href={link("/browse?tab=auction")} className={btn("gold", "lg", "dt:h-[49px] dt:w-[179px] dt:px-0")}>
          {t(COPY.exploreAuctions)}
          <Arrow />
        </Link>
        <Link href={link("/browse?tab=buy_now")} className={btn("outline", "lg", "dt:h-[49px] dt:w-[171px] dt:px-0")}>
          {t(COPY.shopBuyNow)}
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
 * One of the three ways to shop as its approved artwork card (HERO_CARDS):
 * the whole card is one link to that mode's existing page, named in
 * aria-label; the picture is decorative (alt="") because its words would
 * only repeat that name. The picture is never cropped into its safe area —
 * words, button, products, live dot: it is scaled and placed to keep that
 * area in the card with a margin (cover wherever that allows; see .vd-mode
 * in styles/r3-visual-discovery.css). Hover: a 1.5 % zoom and a soft lift;
 * focus: a 3 px indigo ring.
 */
function ModeCard({ card, className = "" }) {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const art = card.art[lang];
  return (
    <Link
      href={link(card.href)}
      aria-label={t(COPY[card.label])}
      className={cx(
        "vd-mode group relative block overflow-hidden rounded-[18px] bg-[#f1e8dc] shadow-[0_1px_2px_rgb(7_27_82/0.06)] ring-1 ring-[var(--vd-ink)]/[0.06] transition-[box-shadow,translate] duration-300 hover:-translate-y-px hover:shadow-[0_16px_34px_-18px_rgb(7_27_82/0.45)] hover:ring-[var(--vd-gold)]/40 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[var(--vd-indigo)]",
        className,
      )}
      style={art.fit}
    >
      <Img image={art.image} alt="" priority sizes={card.sizes} className="vd-mode-art transition-transform duration-500 ease-out group-hover:scale-[1.015]" />
    </Link>
  );
}

/**
 * Copy tile, then the three cards: Auction the largest, Buy Now before
 * Live Auction. From 1200 px the approved three-column mosaic (copy ·
 * Auction · Buy Now over Live Auction, 520 px high). 1000–1199 px: copy
 * beside a square Auction card, Buy Now and Live Auction side by side
 * below. 640–999 px: the copy across the top, then Auction beside Buy Now
 * over Live Auction. Phones stack the copy and the three cards. Below
 * 1200 px every card keeps (about) its picture's own proportions, so each
 * picture shows whole.
 */
export function HeroMosaic() {
  const titleId = useId();
  return (
    <section data-ref="03" aria-labelledby={titleId} className="vd-wide pt-2 dt:pt-[8px]">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1.286fr)_minmax(0,1fr)] min-[62.5rem]:grid-cols-2 dt:min-h-[520px] dt:grid-cols-[minmax(0,436fr)_minmax(0,556fr)_minmax(0,401fr)] dt:grid-rows-[minmax(0,1fr)] dt:gap-[8px]">
        <div className="sm:col-span-2 min-[62.5rem]:col-span-1 dt:col-auto">
          <CopyTile titleId={titleId} />
        </div>
        <ModeCard card={HERO_CARDS.auction} className="aspect-square self-stretch sm:aspect-auto min-[62.5rem]:aspect-square dt:aspect-auto" />
        <div className="grid gap-2 min-[62.5rem]:col-span-2 min-[62.5rem]:grid-cols-2 dt:col-auto dt:grid-cols-1 dt:grid-rows-[243fr_269fr] dt:gap-[8px]">
          <ModeCard card={HERO_CARDS.buyNow} className="aspect-[1564/1006] dt:aspect-auto" />
          <ModeCard card={HERO_CARDS.live} className="aspect-[1564/1006] dt:aspect-auto" />
        </div>
      </div>
    </section>
  );
}
