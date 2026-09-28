"use client";

import Link from "next/link";
import { ChevronRight, Clock3, Heart, ShoppingCart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { countdownText, useCartAdd, useSaveToggle } from "@/components/shared/r3/home";
import { GRADES } from "@/data/grades";
import { useRemaining } from "@/lib/clock";
import { COPY } from "./copy";

export const cx = (...parts) => parts.filter(Boolean).join(" ");

const VARIANT = {
  charcoal: "bg-[var(--pr-charcoal)] text-white hover:bg-[#1e1d1b]",
  brass: "bg-[var(--pr-brass)] text-[#171b27] hover:bg-[var(--pr-brass-hover)]",
  outline: "border border-[#b9a98a] bg-[#fbfaf7] text-fg hover:bg-[var(--pr-stone)]",
  ghost: "text-fg hover:bg-[var(--pr-stone)]",
};
const SIZE = {
  sm: "h-9 px-3.5 pr-md font-medium",
  md: "h-11 px-4 pr-md font-medium",
  lg: "h-12 px-6 pr-lg font-medium",
};

/** Rectangular buttons with small corners (never pills in this design). */
export function btn(variant = "charcoal", size = "md", extra = "") {
  return cx(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[4px] transition-colors duration-150 outline-offset-2 disabled:cursor-not-allowed disabled:opacity-45",
    VARIANT[variant],
    SIZE[size],
    extra,
  );
}

/** Direction-aware chevron. */
export function Chevron({ className = "size-4" }) {
  return <ChevronRight aria-hidden="true" className={cx("flip-rtl shrink-0", className)} strokeWidth={2} />;
}

/** Brass dash + heading (+ subtitle) with an optional bronze "View all" link. */
export function SectionHead({ id, title, sub, href, linkLabel, className = "" }) {
  return (
    <div className={cx("flex items-start justify-between gap-6", className)}>
      <div className="min-w-0">
        <div className="flex items-start gap-3.5">
          <span aria-hidden="true" className="pr-dash mt-[14px] dt:mt-[15px]" />
          <h2 id={id} className="pr-h2 text-fg">
            {title}
          </h2>
        </div>
        {sub ? <p className="mt-1 pr-md text-fg-2 dt:mt-0.5 dt:leading-[18px]">{sub}</p> : null}
      </div>
      {href ? <ViewAll href={href} label={linkLabel} className="mt-2" /> : null}
    </div>
  );
}

export function ViewAll({ href, label, className = "" }) {
  const { link } = useConcept();
  return (
    <Link href={link(href)} className={cx("pr-link inline-flex shrink-0 items-center gap-1.5 pr-md font-medium text-[var(--pr-bronze)]", className)}>
      {label}
      <Chevron className="size-4" />
    </Link>
  );
}

const GRADE_TONE = {
  new: "bg-[var(--pr-guide-blue-bg)] text-[var(--pr-guide-blue)]",
  A: "bg-[var(--pr-grade-a-bg)] text-[var(--pr-grade-a)]",
  B: "bg-[var(--pr-grade-b-bg)] text-[var(--pr-grade-b)]",
  C: "bg-[var(--pr-grade-b-bg)] text-[var(--pr-grade-b)]",
  D: "bg-[var(--pr-guide-pink-bg)] text-[var(--pr-guide-pink)]",
  R: "bg-[var(--pr-guide-pink-bg)] text-[var(--pr-guide-pink)]",
  F: "bg-[var(--pr-guide-pink-bg)] text-[var(--pr-guide-pink)]",
};

/** Condition grade pill ("Grade A"). */
export function GradePill({ grade, short = false, className = "" }) {
  const { t } = useLang();
  const info = GRADES[grade];
  if (!info) return null;
  return <span className={cx("inline-flex h-[22px] items-center rounded-full px-2.5 pr-label", GRADE_TONE[grade], className)}>{t(short ? info.short : info.label)}</span>;
}

export const gradeTone = (grade) => GRADE_TONE[grade];

/** Bare outline heart (no disc) that saves the lot to the wishlist. */
export function HeartButton({ product, className = "" }) {
  const { saved, toggle, label } = useSaveToggle(product);
  return (
    <button type="button" onClick={toggle} aria-pressed={saved} aria-label={label} className={cx("z-10 grid size-10 place-items-center rounded-full text-fg transition-colors hover:text-[var(--pr-bronze)]", className)}>
      <Heart aria-hidden="true" className={cx("size-5", saved && "fill-[var(--pr-live)] text-[var(--pr-live)]")} strokeWidth={1.6} />
    </button>
  );
}

/** Full-width charcoal "Add to cart" with the cart icon. */
export function AddToCart({ product, size = "md", className = "" }) {
  const { t, ui } = useLang();
  const add = useCartAdd(t(COPY.addedToCart));
  const soldOut = product.stock <= 0;
  return (
    <button type="button" disabled={soldOut} onClick={() => add(product)} aria-label={t(COPY.addNamed, { title: t(product.title) })} className={btn("charcoal", size, className)}>
      <ShoppingCart aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
      {soldOut ? ui("soldOut") : ui("addToCart")}
    </button>
  );
}

/** Red clock + remaining time; fixed-width digits so the layout never shifts. */
export function TimeLeft({ endsIn, className = "" }) {
  const { t, lang } = useLang();
  const remaining = useRemaining(endsIn);
  return (
    <p className={cx("inline-flex items-center gap-1.5 font-bold text-[var(--pr-timer)]", className)}>
      <Clock3 aria-hidden="true" className="size-[17px] shrink-0" strokeWidth={2.2} />
      <span className="sr-only">{t(COPY.timeLeft)}: </span>
      <span className="tabular" dir={lang === "ar" ? "rtl" : "ltr"}>
        {countdownText(remaining ?? 0, lang)}
      </span>
    </p>
  );
}
