"use client";

import { shade } from "../utils/color";
import { cx } from "./cx";

const SIZES = {
  xs: "size-5 text-[9px]",
  sm: "size-7 text-[11px]",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-20 text-2xl",
};

/** Monogram avatar in the seller's own brand tone. */
export function SellerAvatar({ seller, size = "sm", className = "" }) {
  if (!seller) return null;
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: shade(seller.tone, 0.14) }}
      className={cx("kb-avatar inline-grid shrink-0 place-items-center rounded-full font-extrabold tracking-tight", SIZES[size], className)}
    >
      {seller.monogram}
    </span>
  );
}
