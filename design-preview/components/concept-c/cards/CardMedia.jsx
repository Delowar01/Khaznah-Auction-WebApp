"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { ChamferFrame, PlateImage } from "../ui/Frame";
import { WatchButton } from "../ui/WatchButton";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";

const CARD_SIZES = "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 50vw";

/** Square image on the warm plate, chamfered, with badges and a watch toggle. */
export function CardMedia({ product, badges = null, footer = null, dim = false, watch = true, sizes = CARD_SIZES, priority = false, compact = false }) {
  return (
    <div className={cx("relative", compact ? "p-1.5 pb-0" : "p-2 pb-0")}>
      <ChamferFrame size={compact ? "sm" : "md"}>
        <PlateImage image={product.images[0]} alt="" sizes={sizes} priority={priority} className={cx("aspect-square", dim && "[&_img]:opacity-50 [&_img]:grayscale")} />
        {footer}
      </ChamferFrame>
      {badges ? <div className={cx("pointer-events-none absolute flex flex-wrap gap-1.5", compact ? "bottom-2.5 start-3" : "bottom-3.5 start-4")}>{badges}</div> : null}
      {watch ? (
        <div className={cx("absolute", compact ? "end-3 top-3" : "end-4 top-4")}>
          <WatchButton product={product} />
        </div>
      ) : null}
    </div>
  );
}

/** Night-indigo band across the plate for sold lots. */
export function SoldBand({ amount }) {
  const { ui } = useLang();
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-secondary px-3.5 py-2.5 text-on-secondary">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Diamond size={6} className="text-accent" />
        {ui("sold")}
      </span>
      {amount != null ? <Money value={amount} className="c-num text-sm font-semibold" /> : null}
    </div>
  );
}
