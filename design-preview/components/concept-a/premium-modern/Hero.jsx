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

function PinCard({ pin, className = "" }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <Link
      href={link("/live-auction")}
      aria-label={`${t(COPY.pinLabel, { title: t(pin.lot.title) })} — ${pin.label}`}
      className={cx("group block rounded-[4px] bg-white px-3.5 py-3 outline-offset-4", className)}
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

/** White annotation over the photo with a leader line to the chair (tablet and up). */
function PricePin({ pin }) {
  const { isRTL } = useLang();
  const dot = isRTL ? HERO_ROOM.pinRtl : HERO_ROOM.pin;
  return (
    <div className="hidden md:block">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1={isRTL ? 29 : 71} y1="46" x2={dot.x} y2={dot.y} stroke="white" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      </svg>
      <span aria-hidden="true" className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_5px_rgb(255_255_255/0.3)]" style={{ left: `${dot.x}%`, top: `${dot.y}%` }} />
      <PinCard pin={pin} className="absolute end-[4%] top-[17%] w-[218px] shadow-[0_10px_28px_-14px_rgb(23_27_39/0.45)] dt:end-[14.8%]" />
    </div>
  );
}

function HeroCopy({ titleId }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <div className="bg-[#f8f7f3] px-4 py-7 md:w-[470px] md:rounded-[4px] md:bg-[#f8f7f3]/[0.97] md:px-8 md:py-8 dt:min-h-[320px] dt:w-[510px] dt:px-10 dt:pb-8 dt:pt-[38px]">
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
        <Link href={link("/browse?tab=buy_now")} className={btn("brass", "lg", "flex-1 basis-[140px] px-4 sm:px-6 dt:w-[205px] dt:flex-none")}>
          {t(COPY.shopBuyNow)}
          <Chevron className="size-4" />
        </Link>
        <Link href={link("/browse?tab=auction")} className={btn("outline", "lg", "flex-1 basis-[140px] border-[#7d7a73] bg-transparent px-4 sm:px-6 dt:w-[205px] dt:flex-none")}>
          {t(COPY.exploreAuctions)}
        </Link>
      </div>
    </div>
  );
}

/**
 * Full-bleed room photograph with an ivory copy card inset at the start and
 * a white price pin on the recliner. Phones stack the copy, then a shorter
 * landscape photo, then the pin's details docked under it.
 */
export function Hero({ live }) {
  const { isRTL } = useLang();
  const titleId = useId();
  const pin = usePinLot(live);
  return (
    <section data-ref="03" aria-labelledby={titleId} className="relative isolate flex flex-col bg-bg md:block">
      <div className="order-1 md:absolute md:inset-0 md:z-10 md:pointer-events-none">
        <div className="pr-container max-md:!px-0 md:h-full dt:!px-12">
          <div className="md:pointer-events-auto md:pt-[40px] dt:pt-[60px]">
            <HeroCopy titleId={titleId} />
          </div>
        </div>
      </div>
      <div className="relative order-2 h-[230px] overflow-hidden bg-[#d9d2c6] sm:h-[300px] md:h-[420px] dt:h-[432px]">
        <Img
          image={HERO_ROOM.image}
          alt=""
          priority
          sizes="100vw"
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: isRTL ? HERO_ROOM.focusRtl : HERO_ROOM.focus }}
        />
        {pin ? <PricePin pin={pin} /> : null}
      </div>
      {pin ? (
        <div className="order-3 border-b border-line bg-white px-4 py-1 md:hidden">
          <PinCard pin={pin} className="!px-0" />
        </div>
      ) : null}
    </section>
  );
}
