import { BadgeCheck } from "lucide-react";

const SIZES = {
  sm: "size-8 rounded-lg text-[11px]",
  md: "size-10 rounded-[11px] text-[13px]",
  lg: "size-14 rounded-2xl text-lg",
  xl: "size-20 rounded-[22px] text-2xl sm:size-24 sm:text-[28px]",
};

/** Monogram avatar in the seller's own brand tone. */
export function SellerAvatar({ seller, size = "md", className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`d-monogram d-num grid shrink-0 place-items-center font-semibold tracking-tight ${SIZES[size]} ${className}`}
      style={{ "--tone": seller.tone }}
    >
      {seller.monogram}
    </span>
  );
}

/** Verified-warehouse tick. */
export function VerifiedMark({ label, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 d-ink ${className}`}>
      <BadgeCheck aria-hidden="true" className="size-4 shrink-0" />
      {label ? <span className="text-xs font-medium">{label}</span> : null}
    </span>
  );
}
