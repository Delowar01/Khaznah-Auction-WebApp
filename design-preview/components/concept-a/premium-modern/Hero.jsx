"use client";

import Link from "next/link";
import { useId } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { COPY } from "./copy";
import { HERO_ROOM, PIN_LOT_ORDER } from "./data";
import { Chevron, GradePill, btn, cx } from "./ui";

/** The live lot shown in the room photo, with its current state. */
function usePinLot(live) {
  const { ui } = useLang();
  const lot = live.items.find((item) => item.order === PIN_LOT_ORDER);
  if (!lot) return null;
  const isLive = lot.status === "live";
  return {
    lot,
    amount: isLive ? lot.currentBid : (lot.finalBid ?? lot.currentBid ?? lot.startingBid),
    label: isLive ? ui("currentBid") : lot.status === "sold" ? ui("soldFor") : ui("startingBid"),
  };
}

function PinCard({ pin, className = "", style }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <Link
      href={link("/live-auction")}
      aria-label={`${t(COPY.pinLabel, { title: t(pin.lot.title) })} — ${pin.label}`}
      className={cx("group block rounded-[4px] bg-white px-3.5 py-3 outline-offset-4", className)}
      style={style}
    >
      <span className="block pr-sm font-medium text-fg group-hover:underline">{t(pin.lot.title)}</span>
      <span className="mt-1 block pr-xs text-fg-2">{pin.label}</span>
      <Money value={pin.amount} className="text-[19px] font-bold leading-6 text-fg" symbolClassName="text-[0.8em]" />
      <span className="mt-1.5 block">
        <GradePill grade={pin.lot.grade} />
      </span>
    </Link>
  );
}

// Master size of the hero photographs (A3 / A4).
const W = 2508;
const H = 627;
const pct = (value, total) => `${(value / total) * 100}%`;

/**
 * White annotation with a leader line to the chair (from 1024 px). It lives in
 * the photograph's own coordinates (see Hero), so the dot stays on the
 * recliner at every width.
 */
function PricePin({ pin, room, isRTL }) {
  const { card, from, dot } = room;
  return (
    <div className="hidden lg:block">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <line x1={from.x} y1={from.y} x2={dot.x} y2={dot.y} stroke="white" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      </svg>
      <span aria-hidden="true" className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_5px_rgb(255_255_255/0.3)]" style={{ left: pct(dot.x, W), top: pct(dot.y, H) }} />
      <PinCard
        pin={pin}
        className="absolute w-[218px] shadow-[0_10px_28px_-14px_rgb(23_27_39/0.45)]"
        style={{ top: pct(card.y, H), ...(isRTL ? { right: pct(W - card.x, W) } : { left: pct(card.x, W) }) }}
      />
    </div>
  );
}

function HeroCopy({ titleId }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <div className="bg-[#f8f7f3] px-[var(--pr-gutter)] py-7 lg:w-[470px] lg:rounded-[4px] lg:bg-[#f8f7f3]/[0.97] lg:px-8 lg:py-8 dt:min-h-[320px] dt:w-[510px] dt:px-10 dt:pb-8 dt:pt-[38px]">
      <p className="flex items-center gap-3 pr-eyebrow text-[#4a4d57]">
        <span aria-hidden="true" className="pr-dash" />
        {t(COPY.heroEyebrow)}
      </p>
      <h1 id={titleId} className="mt-4 pr-hero text-fg">
        {COPY.heroTitle.map((line, i) => (
          <span key={line.en} className="block">
            {t(line)}
            {i < COPY.heroTitle.length - 1 ? " " : null}
          </span>
        ))}
      </h1>
      <p className="mt-3 pr-hero-sub text-[#3e414b]">{t(COPY.heroSub)}</p>
      <div className="mt-6 flex flex-wrap gap-3 sm:gap-4 dt:mt-[26px] dt:flex-nowrap">
        {/* Auctions lead; Buy Now is the secondary choice. */}
        <Link href={link("/browse?tab=auction")} className={btn("brass", "lg", "flex-1 basis-[140px] px-4 sm:px-6 dt:w-[205px] dt:flex-none")}>
          {t(COPY.exploreAuctions)}
          <Chevron className="size-4" />
        </Link>
        <Link href={link("/browse?tab=buy_now")} className={btn("outline", "lg", "flex-1 basis-[140px] border-[#7d7a73] bg-transparent px-4 sm:px-6 dt:w-[205px] dt:flex-none")}>
          {t(COPY.shopBuyNow)}
        </Link>
      </div>
    </div>
  );
}

/**
 * Full-bleed room photograph with an ivory copy card inset at the start and
 * a white price pin on the recliner. English uses A3 and Arabic A4 (composed
 * separately, never mirrored). Below 1024 px the copy card would cover the
 * chair, so the copy stacks above a photo strip and the pin's details dock
 * under it.
 *
 * The photograph sits on a 4:1 "canvas" that covers the strip like
 * object-fit: cover, positioned by --px / --py (object-position fractions):
 * right-biased for English and left-biased for Arabic on narrow strips,
 * following the asset manifest's crops. The pin, its leader line and the dot
 * are placed in the canvas's own coordinates, so they stay on the chair
 * whatever the crop.
 */
export function Hero({ live }) {
  const { isRTL } = useLang();
  const titleId = useId();
  const pin = usePinLot(live);
  const room = isRTL ? HERO_ROOM.rtl : HERO_ROOM.ltr;
  return (
    <section data-ref="03" aria-labelledby={titleId} className="relative isolate flex flex-col bg-bg lg:block">
      <div className="order-1 lg:pointer-events-none lg:absolute lg:inset-0 lg:z-10">
        <div className="pr-container max-lg:!px-0 lg:h-full dt:!px-12">
          <div className="lg:pointer-events-auto lg:pt-[40px] dt:pt-[60px]">
            <HeroCopy titleId={titleId} />
          </div>
        </div>
      </div>
      <div
        className={cx(
          "relative order-2 h-[var(--h)] overflow-hidden bg-[#d9d2c6] [--h:230px] [--py:0.25] sm:[--h:300px] md:[--h:320px] lg:[--h:420px] dt:[--h:432px]",
          isRTL ? "[--px:0.1] lg:[--px:0] dt:[--px:0.25] wd:[--px:0.5]" : "[--px:0.94] lg:[--px:1] dt:[--px:0.75] wd:[--px:0.5]",
        )}
      >
        <div className="absolute left-[calc(var(--px)*100%)] top-[calc(var(--py)*100%)] aspect-[4/1] w-[max(100%,calc(var(--h)*4))] translate-x-[calc(var(--px)*-100%)] translate-y-[calc(var(--py)*-100%)]">
          <Img
            image={room.image}
            alt=""
            priority
            sizes="(min-width: 1728px) 100vw, (min-width: 1200px) 1728px, (min-width: 1024px) 1680px, (min-width: 768px) 1280px, (min-width: 640px) 1200px, 920px"
            className="absolute inset-0 size-full object-cover"
          />
          {pin ? <PricePin pin={pin} room={room} isRTL={isRTL} /> : null}
        </div>
      </div>
      {pin ? (
        <div className="order-3 border-b border-line bg-white px-[var(--pr-gutter)] py-1 lg:hidden">
          <PinCard pin={pin} className="!px-0" />
        </div>
      ) : null}
    </section>
  );
}
