"use client";

import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useRemaining } from "@/lib/clock";
import { formatDuration } from "@/lib/format";
import { COPY } from "./copy";

export const cx = (...parts) => parts.filter(Boolean).join(" ");

const PILL = {
  solid: "bg-primary text-on-primary hover:bg-primary-hover",
  outline: "border border-line-strong bg-surface text-fg hover:border-fg",
  soft: "bg-surface-2 text-fg hover:bg-[color-mix(in_oklab,var(--surface-2)_80%,var(--text-primary))]",
  light: "bg-white text-[#181614] hover:bg-white/90",
};
const SIZE = {
  sm: "h-9 px-4 vm-sm font-bold",
  md: "h-11 px-5 vm-sm font-bold",
  lg: "h-13 px-7 vm-md font-bold",
};

export function pillClass(variant = "solid", size = "md", extra = "") {
  return cx(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-pill whitespace-nowrap transition-colors duration-200 outline-offset-2",
    PILL[variant],
    SIZE[size],
    extra,
  );
}

export function PillLink({ href, variant, size, className, children, ...rest }) {
  return (
    <Link href={href} className={pillClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

export function PillButton({ variant, size, className, children, ...rest }) {
  return (
    <button type="button" className={pillClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function IconButton({ label, className = "", children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx("relative grid size-11 shrink-0 place-items-center rounded-full text-fg transition-colors hover:bg-surface-2", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Small count bubble on header icons. */
export function Count({ n, className = "" }) {
  if (!n) return null;
  return (
    <span
      aria-hidden="true"
      className={cx(
        "absolute -end-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-on-primary tabular",
        className,
      )}
    >
      {n}
    </span>
  );
}

export function WatchButton({ product, className = "", tone = "light" }) {
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
      className={cx(
        "z-10 grid size-10 place-items-center rounded-full backdrop-blur transition-colors",
        tone === "light" ? "bg-white/85 text-[#181614] hover:bg-white" : "bg-surface text-fg hover:bg-surface-2",
        className,
      )}
    >
      <Heart aria-hidden="true" className={cx("size-[18px]", on ? "fill-[#c6372d] text-[#c6372d]" : "")} strokeWidth={2} />
    </button>
  );
}

/** Live countdown text for a timed auction, e.g. "9m 12s" · "2h 14m" (follows the reading direction). */
export function TimeLeft({ endsIn, className = "" }) {
  const { lang } = useLang();
  const remaining = useRemaining(endsIn);
  return (
    <span className={cx("tabular whitespace-nowrap", className)} dir={lang === "ar" ? "rtl" : "ltr"}>
      {formatDuration(remaining ?? 0, lang)}
    </span>
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

export function AddButton({ product, className = "", label = false }) {
  const { t } = useLang();
  const add = useAddToBag();
  const soldOut = product.stock <= 0;
  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => add(product)}
      aria-label={t(COPY.addNamed, { title: t(product.title) })}
      className={cx(
        "z-10 inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-white font-bold text-[#181614] transition-transform hover:scale-[1.04] disabled:opacity-40 disabled:hover:scale-100",
        label ? "h-10 px-4 vm-sm" : "size-10",
        className,
      )}
    >
      <Plus aria-hidden="true" className="size-[18px]" strokeWidth={2.4} />
      {label ? <span>{t(COPY.addToBag)}</span> : null}
    </button>
  );
}

const TAG_STYLES = {
  auction: "bg-[#181614] text-white",
  upcoming: "bg-white text-[#181614]",
  soldout: "bg-white/90 text-[#57524b]",
  sale: "bg-accent text-on-accent",
};

export function SaleTag({ tag, className = "" }) {
  const { t } = useLang();
  if (!tag) return null;
  const kind = tag.startsWith("-") ? "sale" : tag;
  const label = kind === "sale" ? tag : kind === "auction" ? t(COPY.auction) : kind === "upcoming" ? t(COPY.upcoming) : t(COPY.soldOut);
  return (
    <span className={cx("inline-flex h-7 items-center rounded-full px-3 vm-xs font-extrabold tabular", TAG_STYLES[kind], className)} dir={kind === "sale" ? "ltr" : undefined}>
      {label}
    </span>
  );
}

export function LiveDot({ className = "" }) {
  return <span aria-hidden="true" className={cx("kz-live-dot", className)} />;
}
