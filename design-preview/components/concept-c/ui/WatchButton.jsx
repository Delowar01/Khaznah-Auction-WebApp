"use client";

import { Bookmark } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { btnClass } from "./Button";
import { cx } from "./cx";

/** Watchlist toggle (bookmark). `variant="icon"` for cards, `"full"` for detail pages. */
export function WatchButton({ product, variant = "icon", size, className = "", testId, onToggle }) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const watched = isWatched(product.slug);
  const title = t(product.title);

  const onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const now = toggleWatch(product.slug);
    if (onToggle) onToggle(now);
    else toast({ tone: now ? "success" : "neutral", title: ui(now ? "addedToWatchlist" : "removedFromWatchlist"), description: title });
  };

  const icon = <Bookmark aria-hidden="true" className="size-[18px]" fill={watched ? "currentColor" : "none"} strokeWidth={1.75} />;

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={watched}
        aria-label={`${ui("watch")}: ${title}`}
        data-testid={testId}
        className={cx(
          "relative z-10 grid size-10 place-items-center rounded-control border backdrop-blur-sm transition-colors",
          watched ? "border-primary bg-primary text-on-primary" : "border-line bg-surface/85 text-fg hover:border-line-strong hover:bg-surface",
          className,
        )}
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={watched}
      data-testid={testId}
      className={cx(btnClass({ variant: "outline", size }), watched && "border-primary! text-primary", className)}
    >
      {icon}
      {ui(watched ? "watching" : "watch")}
    </button>
  );
}
