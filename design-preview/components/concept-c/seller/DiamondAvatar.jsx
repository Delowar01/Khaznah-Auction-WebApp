import { cx } from "../ui/cx";
import { monogramBg } from "./monogram";

const SIZES = {
  sm: { box: "size-12", text: "text-[0.8125rem]" },
  md: { box: "size-16", text: "text-base" },
  lg: { box: "size-24 sm:size-28", text: "text-xl sm:text-2xl" },
};

/** Seller monogram set in a diamond (rotated square in the seller's tone); letters stay upright. */
export function DiamondAvatar({ seller, size = "md", ring = false, className = "" }) {
  const s = SIZES[size] || SIZES.md;
  return (
    <span aria-hidden="true" className={cx("relative grid shrink-0 place-items-center", s.box, className)}>
      <span className={cx("absolute inset-[14.6%] rotate-45 rounded-[2px]", ring && "outline outline-4 outline-bg")} style={{ background: monogramBg(seller.tone) }} />
      <span className={cx("c-monogram relative font-bold", s.text)}>{seller.monogram}</span>
    </span>
  );
}
