"use client";

import { Heart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { COPY } from "../copy";
import { buttonClass } from "./Button";
import { cx } from "./cx";

/**
 * Watchlist toggle (aria-pressed). `variant="icon"` floats on card media;
 * `variant="full"` is the labelled detail-page button.
 */
export function WatchButton({ product, variant = "icon", size = "md", label, className = "", testId, onToggle }) {
  const { isWatched, toggleWatch, toast } = useStore();
  const { ui, t } = useLang();
  const on = isWatched(product.slug);

  const onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const now = toggleWatch(product.slug);
    toast({
      tone: now ? "success" : "neutral",
      title: ui(now ? "addedToWatchlist" : "removedFromWatchlist"),
      description: t(product.title),
    });
    onToggle?.(now);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        aria-pressed={on}
        aria-label={t(COPY.watchItem, { title: t(product.title) })}
        data-testid={testId}
        onClick={onClick}
        className={cx(
          "relative z-10 grid size-9 place-items-center rounded-full bg-surface/95 shadow-card ring-1 ring-line backdrop-blur transition-[transform,color] duration-150 hover:scale-105 hover:text-live",
          on ? "text-live" : "text-fg-2",
          className,
        )}
      >
        <Heart aria-hidden="true" className={cx("size-[18px] transition-transform", on && "fill-current")} strokeWidth={2} />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={on}
      data-testid={testId}
      onClick={onClick}
      className={buttonClass({ variant: "outline", size, className: cx(on && "border-live/40", className) })}
    >
      <Heart aria-hidden="true" className={cx("size-4 shrink-0", on && "fill-current text-live")} strokeWidth={2} />
      {label || (on ? ui("watching") : ui("watch"))}
    </button>
  );
}
