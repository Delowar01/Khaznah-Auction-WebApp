"use client";

import { Bookmark, Share2 } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";

/** Watchlist toggle (aria-pressed). `variant="full"` shows a text label. */
export function WatchButton({ product, variant = "icon", className = "", testId, onToggle }) {
  const { isWatched, toggleWatch, toast } = useStore();
  const { ui, t } = useLang();
  const watched = isWatched(product.slug);

  const onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const now = toggleWatch(product.slug);
    toast({ tone: now ? "success" : "neutral", title: ui(now ? "addedToWatchlist" : "removedFromWatchlist"), description: t(product.title) });
    onToggle?.(now);
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={watched}
        data-testid={testId}
        className={`inline-flex h-10 items-center gap-2 rounded-control border px-3 text-sm font-medium transition-colors ${
          watched ? "border-accent/50 bg-accent/12 text-auction" : "border-line-strong bg-surface-2 text-fg hover:bg-elevated"
        } ${className}`}
      >
        <Bookmark aria-hidden="true" className={`size-4 ${watched ? "fill-current" : ""}`} />
        {watched ? ui("watching") : ui("watch")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={watched}
      aria-label={ui("addToWatchlist")}
      title={ui(watched ? "removeFromWatchlist" : "addToWatchlist")}
      data-testid={testId}
      className={`d-hit grid size-10 place-items-center rounded-full transition-colors ${
        watched ? "bg-accent text-on-accent" : "d-ov-chip hover:bg-black/80"
      } ${className}`}
    >
      <Bookmark aria-hidden="true" className={`size-4 ${watched ? "fill-current" : ""}`} />
    </button>
  );
}

/** Copies the current URL and confirms with a toast. */
export function ShareButton({ label, toastTitle, className = "" }) {
  const { ui } = useLang();
  const { toast } = useStore();
  const onClick = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
    } catch {
      // Clipboard can be blocked (e.g. embedded frames); the toast still confirms the action.
    }
    toast({ tone: "success", title: toastTitle || ui("linkCopied") });
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center gap-2 rounded-control border border-line-strong bg-surface-2 px-3 text-sm font-medium text-fg transition-colors hover:bg-elevated ${className}`}
    >
      <Share2 aria-hidden="true" className="size-4" />
      {label || ui("share")}
    </button>
  );
}
