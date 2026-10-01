"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Heart, ShoppingCart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { countdownText, useCartAdd, useSaveToggle } from "@/components/shared/r3/home";
import { GRADES } from "@/data/grades";
import { useRemaining } from "@/lib/clock";
import { COPY } from "./copy";

export const cx = (...parts) => parts.filter(Boolean).join(" ");

const VARIANT = {
  green: "bg-[var(--sc-green)] text-white hover:bg-[var(--sc-green-hover)]",
  outline: "border-2 border-[var(--sc-green)] bg-white text-[var(--sc-ink)] hover:bg-[var(--sc-soft)]",
  sage: "bg-[var(--sc-sage)] text-[var(--sc-ink)] hover:bg-[var(--sc-sage-hover)]",
};
const SIZE = {
  sm: "h-10 px-4 sc-md font-semibold",
  md: "h-11 px-5 sc-md font-semibold",
  lg: "h-12 px-6 sc-lg font-semibold",
};

/** Rectangular buttons with modest corners. */
export function btn(variant = "green", size = "md", extra = "") {
  return cx(
    "inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-[7px] transition-colors duration-150 outline-offset-2 disabled:cursor-not-allowed disabled:opacity-45",
    VARIANT[variant],
    SIZE[size],
    extra,
  );
}

/** Direction-aware arrow. */
export function Arrow({ className = "size-4" }) {
  return <ArrowRight aria-hidden="true" className={cx("flip-rtl shrink-0", className)} strokeWidth={2} />;
}

/**
 * Blue text link with a forward arrow (View all, Visit store, guide). The
 * ::after widens the touch area to about 44 px without moving anything.
 */
export function TextLink({ href, children, label, className = "" }) {
  const { link } = useConcept();
  return (
    <Link href={link(href)} aria-label={label} className={cx("sc-link inline-flex items-center gap-2 sc-md font-medium text-[var(--sc-link)] dt:text-[16px] relative after:absolute after:-inset-x-2 after:-inset-y-3 after:content-['']", className)}>
      {children}
      <Arrow className="size-[18px]" />
    </Link>
  );
}

/** Heading + one-line subtitle, with an optional View all link at the end. */
export function SectionHead({ id, title, text, href, linkLabel, className = "" }) {
  return (
    <div className={cx("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 id={id} className="sc-h2 text-[var(--sc-ink)]">
          {title}
        </h2>
        {text ? <p className="mt-0.5 sc-md text-[var(--sc-muted)] dt:text-[15px]">{text}</p> : null}
      </div>
      {href ? (
        <TextLink href={href} className="mt-1.5 shrink-0 dt:mt-[9px]">
          {linkLabel}
        </TextLink>
      ) : null}
    </div>
  );
}

const GRADE_TONE = {
  new: "bg-[var(--sc-guide-blue-bg)] text-[var(--sc-guide-blue)]",
  A: "bg-[var(--sc-grade-a-bg)] text-[var(--sc-grade-a)]",
  B: "bg-[var(--sc-grade-b-bg)] text-[var(--sc-grade-b)]",
  C: "bg-[var(--sc-grade-c-bg)] text-[var(--sc-grade-c)]",
  D: "bg-[var(--sc-guide-pink-bg)] text-[var(--sc-guide-pink)]",
  R: "bg-[var(--sc-guide-blue-bg)] text-[var(--sc-guide-blue)]",
  F: "bg-[var(--sc-guide-pink-bg)] text-[var(--sc-guide-pink)]",
};
export const gradeTone = (grade) => GRADE_TONE[grade];

// The approved grade strip colours its chips differently from the card
// pills (New/B blue, A mint, C amber, D/R/F pink); both follow the design.
const GUIDE_TONE = {
  new: "bg-[var(--sc-guide-blue-bg)] text-[var(--sc-guide-blue)]",
  A: "bg-[var(--sc-grade-a-bg)] text-[var(--sc-grade-a)]",
  B: "bg-[var(--sc-guide-blue-bg)] text-[var(--sc-guide-blue)]",
  C: "bg-[var(--sc-grade-b-bg)] text-[var(--sc-grade-b)]",
  D: "bg-[var(--sc-guide-pink-bg)] text-[var(--sc-guide-pink)]",
  R: "bg-[var(--sc-guide-pink-bg)] text-[var(--sc-guide-pink)]",
  F: "bg-[var(--sc-guide-pink-bg)] text-[var(--sc-guide-pink)]",
};
export const guideTone = (grade) => GUIDE_TONE[grade];

export function GradePill({ grade, className = "" }) {
  const { t } = useLang();
  const info = GRADES[grade];
  if (!info) return null;
  return <span className={cx("inline-flex h-[26px] w-fit items-center whitespace-nowrap rounded-[6px] px-2.5 sc-md font-medium", GRADE_TONE[grade], className)}>{t(info.label)}</span>;
}

/** Bare outline heart at the card's top-end corner. */
export function HeartButton({ product, className = "" }) {
  const { saved, toggle, label } = useSaveToggle(product);
  return (
    <button type="button" onClick={toggle} aria-pressed={saved} aria-label={label} className={cx("z-10 grid size-10 place-items-center rounded-full text-[var(--sc-ink)] transition-colors hover:bg-[var(--sc-soft)]", className)}>
      <Heart aria-hidden="true" className={cx("size-[22px]", saved && "fill-[var(--sc-green)] text-[var(--sc-green)]")} strokeWidth={1.6} />
    </button>
  );
}

/** Filled green Add to cart with the cart icon. */
export function AddToCart({ product, className = "" }) {
  const { t } = useLang();
  const add = useCartAdd(t(COPY.addedToCart));
  const soldOut = product.stock <= 0;
  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => add(product)}
      aria-label={t(COPY.addNamed, { title: t(product.title) })}
      className={btn("green", "md", cx("relative z-10 h-12 gap-3 dt:text-[17px]", className))}
    >
      <ShoppingCart aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
      {t(COPY.addToCart)}
    </button>
  );
}

/** Red inline clock and countdown (stable digit widths). */
export function TimeLeft({ endsIn, className = "" }) {
  const { t, lang } = useLang();
  const remaining = useRemaining(endsIn);
  return (
    <p className={cx("flex items-center gap-2 sc-lg font-semibold text-[var(--sc-red)]", className)}>
      <Clock3 aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
      <span className="sr-only">{t(COPY.timeLeft)}: </span>
      <span className="tabular" dir={lang === "ar" ? "rtl" : "ltr"}>
        {countdownText(remaining ?? 0, lang)}
      </span>
    </p>
  );
}
