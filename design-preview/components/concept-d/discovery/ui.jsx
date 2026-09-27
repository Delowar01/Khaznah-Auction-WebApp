"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Heart, Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { GRADES } from "@/data/grades";
import { useRemaining } from "@/lib/clock";
import { formatDuration } from "@/lib/format";
import { COPY } from "./copy";

export const cx = (...parts) => parts.filter(Boolean).join(" ");

const VARIANT = {
  ink: "bg-primary text-on-primary hover:bg-primary-hover",
  accent: "bg-accent text-on-accent hover:brightness-95",
  soft: "bg-surface-2 text-fg hover:bg-[color-mix(in_oklab,var(--surface-2)_85%,var(--text-primary))]",
  outline: "border border-line-strong bg-surface text-fg hover:border-fg",
  white: "bg-white text-[#14161c] hover:bg-white/90",
};
const SIZE = {
  xs: "h-8 px-3 dc-xs font-bold",
  sm: "h-9 px-3.5 dc-sm font-bold",
  md: "h-11 px-5 dc-sm font-bold",
  lg: "h-12 px-6 dc-md font-bold",
};

/** Rounded-rectangle buttons (chips use full pills). */
export function btnClass(variant = "ink", size = "md", extra = "") {
  return cx("inline-flex shrink-0 items-center justify-center gap-2 rounded-control whitespace-nowrap transition-[background-color,border-color,filter] outline-offset-2", VARIANT[variant], SIZE[size], extra);
}

export const TONE_BG = {
  peach: "bg-[var(--dc-peach)]",
  mint: "bg-[var(--dc-mint)]",
  sky: "bg-[var(--dc-sky)]",
  butter: "bg-[var(--dc-butter)]",
  lilac: "bg-[var(--dc-lilac)]",
  rose: "bg-[var(--dc-rose)]",
  sand: "bg-[var(--dc-sand)]",
  sage: "bg-[var(--dc-sage)]",
};

export function SectionHeader({ id, title, sub, href, linkLabel, children, className = "" }) {
  const { isRTL } = useLang();
  const { link } = useConcept();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
      <div className="min-w-0 max-w-2xl">
        <h2 id={id} className="dc-h2 text-balance text-fg">
          {title}
        </h2>
        {sub ? <p className="mt-1 dc-sm text-fg-2">{sub}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {href ? (
          <Link href={link(href)} className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 dc-sm font-bold text-fg hover:bg-surface-2">
            {linkLabel}
            <Arrow aria-hidden="true" className="size-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/** Direction-aware scrolling for a horizontal rail (reads the ref on click). */
export function useRailStep(ref) {
  const { isRTL } = useLang();
  return (sign) => {
    const rail = ref.current;
    if (!rail) return;
    const distance = Math.max(240, rail.clientWidth * 0.8);
    rail.scrollBy({ left: sign * (isRTL ? -1 : 1) * distance, behavior: "smooth" });
  };
}

export function RailButtons({ onStep }) {
  const { t } = useLang();
  return (
    <div className="hidden items-center gap-1.5 md:flex">
      <button type="button" onClick={() => onStep(-1)} aria-label={t(COPY.prev)} className="grid size-10 place-items-center rounded-full bg-surface-2 text-fg hover:bg-[color-mix(in_oklab,var(--surface-2)_85%,var(--text-primary))]">
        <ChevronLeft aria-hidden="true" className="flip-rtl size-5" />
      </button>
      <button type="button" onClick={() => onStep(1)} aria-label={t(COPY.next)} className="grid size-10 place-items-center rounded-full bg-surface-2 text-fg hover:bg-[color-mix(in_oklab,var(--surface-2)_85%,var(--text-primary))]">
        <ChevronRight aria-hidden="true" className="flip-rtl size-5" />
      </button>
    </div>
  );
}

export function GradeChip({ grade, className = "" }) {
  const { t } = useLang();
  const info = GRADES[grade];
  if (!info) return null;
  const tone = grade === "new" ? "new" : grade.toLowerCase();
  return (
    <span
      className={cx("inline-flex h-6 items-center rounded-full px-2 dc-xs font-bold", className)}
      style={{ color: `var(--grade-${tone})`, background: `color-mix(in oklab, var(--grade-${tone}) 12%, transparent)` }}
    >
      {t(info.label)}
    </span>
  );
}

/** Live countdown text that follows the reading direction. */
export function TimeLeft({ endsIn, className = "" }) {
  const { lang } = useLang();
  const remaining = useRemaining(endsIn);
  return (
    <span className={cx("tabular whitespace-nowrap", className)} dir={lang === "ar" ? "rtl" : "ltr"}>
      {formatDuration(remaining ?? 0, lang)}
    </span>
  );
}

export function SaveButton({ product, className = "" }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const on = isWatched(product.slug);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={`${on ? ui("removeFromWatchlist") : ui("addToWatchlist")}: ${t(product.title)}`}
      onClick={() => {
        const now = toggleWatch(product.slug);
        toast({ tone: now ? "success" : "neutral", title: now ? ui("addedToWatchlist") : ui("removedFromWatchlist"), description: t(product.title) });
      }}
      className={cx("z-10 grid size-9 place-items-center rounded-full bg-white text-[#14161c] shadow-card transition-transform hover:scale-105", className)}
    >
      <Heart aria-hidden="true" className={cx("size-4", on ? "fill-[#d4163e] text-[#d4163e]" : "")} strokeWidth={2.2} />
    </button>
  );
}

export function useAddToCart() {
  const { t } = useLang();
  const { addToCart, toast } = useStore();
  return (product) => {
    addToCart(product.slug, 1);
    toast({ tone: "success", title: t(COPY.addedToCart), description: t(product.title) });
  };
}

export function AddButton({ product, className = "" }) {
  const { t } = useLang();
  const add = useAddToCart();
  const soldOut = product.stock <= 0;
  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => add(product)}
      aria-label={t(COPY.addNamed, { title: t(product.title) })}
      className={cx("z-10 grid size-9 shrink-0 place-items-center rounded-full bg-primary text-on-primary transition-transform hover:scale-105 disabled:opacity-35 disabled:hover:scale-100", className)}
    >
      <Plus aria-hidden="true" className="size-[18px]" strokeWidth={2.4} />
    </button>
  );
}

export function LiveDot({ className = "" }) {
  return <span aria-hidden="true" className={cx("kz-live-dot", className)} />;
}
