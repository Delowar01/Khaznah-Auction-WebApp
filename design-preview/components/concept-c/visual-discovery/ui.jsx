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
  gold: "bg-[var(--vd-gold)] text-[var(--vd-ink)] hover:bg-[var(--vd-gold-hover)]",
  indigo: "bg-[var(--vd-indigo)] text-white hover:bg-[#12307f]",
  navy: "bg-[var(--vd-navy)] text-white hover:bg-[#0b2d55]",
  outline: "border-[1.5px] border-[var(--vd-indigo)] bg-white text-[var(--vd-ink)] hover:bg-[var(--vd-bluegray)]",
  soft: "border border-[var(--vd-line)] bg-white text-[var(--vd-indigo)] hover:bg-[var(--vd-bluegray)]",
  white: "bg-white text-[var(--vd-ink)] hover:bg-white/90",
};
const SIZE = {
  sm: "h-9 px-4 vd-sm font-semibold",
  md: "h-10 px-5 vd-md font-semibold",
  lg: "h-12 px-6 vd-md font-bold",
};

/** Pill buttons (rounded rectangles for the outline auction CTA). */
export function btn(variant = "indigo", size = "md", extra = "") {
  return cx(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full transition-colors duration-150 outline-offset-2 disabled:cursor-not-allowed disabled:opacity-45",
    VARIANT[variant],
    SIZE[size],
    extra,
  );
}

/** Direction-aware arrow. */
export function Arrow({ className = "size-4" }) {
  return <ArrowRight aria-hidden="true" className={cx("flip-rtl shrink-0", className)} strokeWidth={2} />;
}

export function SectionHead({ id, title, href, linkLabel, children, className = "" }) {
  const { link } = useConcept();
  return (
    <div className={cx("flex flex-wrap items-center gap-x-6 gap-y-3", className)}>
      <h2 id={id} className="vd-h2 text-[var(--vd-ink)]">
        {title}
      </h2>
      {children}
      {href ? (
        // The ::after widens the touch area to about 44 px without moving anything.
        <Link href={link(href)} className="vd-link ms-auto inline-flex items-center gap-2 vd-md text-[var(--vd-indigo)] relative after:absolute after:-inset-x-2 after:-inset-y-3 after:content-['']">
          {linkLabel}
          <Arrow />
        </Link>
      ) : null}
    </div>
  );
}

const GRADE_TONE = {
  new: "bg-[var(--vd-guide-blue-bg)] text-[var(--vd-guide-blue)]",
  A: "bg-[var(--vd-grade-a-bg)] text-[var(--vd-grade-a)]",
  B: "bg-[var(--vd-grade-b-bg)] text-[var(--vd-grade-b)]",
  C: "bg-[var(--vd-grade-c-bg)] text-[var(--vd-grade-c)]",
  D: "bg-[var(--vd-guide-pink-bg)] text-[var(--vd-guide-pink)]",
  R: "bg-[var(--vd-guide-blue-bg)] text-[var(--vd-guide-blue)]",
  F: "bg-[var(--vd-guide-pink-bg)] text-[var(--vd-guide-pink)]",
};
export const gradeTone = (grade) => GRADE_TONE[grade];

export function GradePill({ grade, className = "" }) {
  const { t } = useLang();
  const info = GRADES[grade];
  if (!info) return null;
  return <span className={cx("inline-flex h-5 w-fit items-center whitespace-nowrap rounded-full px-2 vd-label dt:h-[22px] dt:px-2.5 dt:text-[12px]", GRADE_TONE[grade], className)}>{t(info.label)}</span>;
}

/** White circular favourite disk with an indigo heart. */
export function HeartDisk({ product, className = "" }) {
  const { saved, toggle, label } = useSaveToggle(product);
  return (
    <button type="button" onClick={toggle} aria-pressed={saved} aria-label={label} className={cx("z-10 grid size-10 place-items-center rounded-full bg-white text-[var(--vd-indigo)] shadow-[0_2px_8px_rgb(7_27_82/0.12)] transition-transform hover:scale-105 dt:size-9", className)}>
      <Heart aria-hidden="true" className={cx("size-[18px]", saved && "fill-[var(--vd-indigo)]")} strokeWidth={2} />
    </button>
  );
}

/** Circular indigo cart button (≥44px target). */
export function CartCircle({ product, className = "" }) {
  const { t } = useLang();
  const add = useCartAdd(t(COPY.addedToCart));
  const soldOut = product.stock <= 0;
  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => add(product)}
      aria-label={t(COPY.addNamed, { title: t(product.title) })}
      className={cx("z-10 grid size-12 shrink-0 place-items-center rounded-full bg-[var(--vd-indigo)] text-white transition-colors hover:bg-[#12307f] disabled:opacity-40", className)}
    >
      <ShoppingCart aria-hidden="true" className="size-5" strokeWidth={2.1} />
    </button>
  );
}

/** Coral countdown pill that sits on the photograph. */
export function CountdownPill({ endsIn, className = "" }) {
  const { t, lang } = useLang();
  const remaining = useRemaining(endsIn);
  return (
    <span className={cx("inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--vd-coral)] px-3 vd-md font-bold text-white", className)}>
      <Clock3 aria-hidden="true" className="size-4" strokeWidth={2.4} />
      <span className="sr-only">{t(COPY.timeLeft)}: </span>
      <span className="tabular" dir={lang === "ar" ? "rtl" : "ltr"}>
        {countdownText(remaining ?? 0, lang)}
      </span>
    </span>
  );
}
