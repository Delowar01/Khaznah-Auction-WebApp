"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { GRADES } from "@/data/grades";
import { useRemaining } from "@/lib/clock";
import { formatDuration } from "@/lib/format";
import { COPY } from "./copy";

export const cx = (...parts) => parts.filter(Boolean).join(" ");

const VARIANT = {
  ink: "bg-primary text-on-primary hover:bg-primary-hover",
  outline: "border border-fg text-fg hover:bg-fg hover:text-bg",
  quiet: "border border-line-strong bg-surface text-fg hover:border-fg",
  light: "bg-white text-[#1c1a17] hover:bg-white/90",
};
const SIZE = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-[52px] px-8",
};

/** Slim rectangular buttons with small tracked labels. */
export function btnClass(variant = "ink", size = "md", extra = "") {
  return cx(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-control whitespace-nowrap pm-label transition-colors duration-200 outline-offset-2",
    VARIANT[variant],
    SIZE[size],
    extra,
  );
}

export function SectionHeading({ id, eyebrow, title, sub, action, className = "", center = false }) {
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-x-8 gap-y-4", center && "justify-center text-center", className)}>
      <div className={cx("max-w-2xl", center && "mx-auto")}>
        {eyebrow ? <p className="pm-eyebrow text-accent">{eyebrow}</p> : null}
        <h2 id={id} className="mt-2 pm-h2 text-balance text-fg">
          {title}
        </h2>
        {sub ? <p className="mt-2 pm-md text-fg-2">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function TextLink({ href, children, className = "" }) {
  return (
    <Link href={href} className={cx("pm-link pm-sm font-semibold text-fg", className)}>
      {children}
    </Link>
  );
}

/** "Grade A" with its tone dot, e.g. for card meta lines. */
export function GradeMark({ grade, className = "" }) {
  const { t } = useLang();
  const info = GRADES[grade];
  if (!info) return null;
  return (
    <span className={cx("inline-flex items-center gap-1.5", className)}>
      <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: `var(--grade-${grade === "new" ? "new" : grade.toLowerCase()})` }} />
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
      className={cx("z-10 grid size-10 place-items-center rounded-full bg-surface/90 text-fg shadow-card transition-colors hover:bg-surface", className)}
    >
      <Heart aria-hidden="true" className={cx("size-[17px]", on ? "fill-[var(--live)] text-[var(--live)]" : "")} strokeWidth={1.75} />
    </button>
  );
}

export function useAddToBag() {
  const { t } = useLang();
  const { addToCart, toast } = useStore();
  return (product) => {
    addToCart(product.slug, 1);
    toast({ tone: "success", title: t(COPY.addedToBag), description: t(product.title) });
  };
}

export function AddToBag({ product, className = "", compact = false }) {
  const { t, ui } = useLang();
  const add = useAddToBag();
  const soldOut = product.stock <= 0;
  if (compact) {
    return (
      <button
        type="button"
        disabled={soldOut}
        onClick={() => add(product)}
        aria-label={t(COPY.addNamed, { title: t(product.title) })}
        className={cx("z-10 grid size-10 place-items-center rounded-full bg-primary text-on-primary transition-opacity hover:bg-primary-hover disabled:opacity-40", className)}
      >
        <ShoppingBag aria-hidden="true" className="size-[17px]" strokeWidth={1.75} />
      </button>
    );
  }
  return (
    <button type="button" disabled={soldOut} onClick={() => add(product)} className={btnClass("ink", "sm", cx("disabled:opacity-40", className))}>
      {soldOut ? t(COPY.soldOut) : ui("addToBag")}
      <span className="sr-only">: {t(product.title)}</span>
    </button>
  );
}
