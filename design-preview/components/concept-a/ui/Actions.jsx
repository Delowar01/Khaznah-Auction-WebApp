"use client";

import { Heart, Share2 } from "lucide-react";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useLang } from "@/components/shared/providers/LangProvider";

/** Watchlist toggle (aria-pressed) with toast feedback. */
export function WatchButton({ slug, variant = "icon", className = "", testId, forcePressed }) {
  const { isWatched, toggleWatch, toast } = useStore();
  const { ui } = useLang();
  const watched = forcePressed ?? isWatched(slug);
  const onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const now = toggleWatch(slug);
    toast({ tone: now ? "success" : "neutral", title: ui(now ? "addedToWatchlist" : "removedFromWatchlist") });
  };
  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={watched}
        data-testid={testId}
        className={`inline-flex h-11 items-center gap-2 text-sm font-medium text-fg ${className}`}
      >
        <Heart aria-hidden="true" className={`size-[18px] transition-colors ${watched ? "fill-live text-live" : ""}`} />
        <span className="a-underline-hover">{ui(watched ? "watching" : "watch")}</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={watched}
      aria-label={ui(watched ? "removeFromWatchlist" : "addToWatchlist")}
      title={ui(watched ? "removeFromWatchlist" : "addToWatchlist")}
      data-testid={testId}
      className={`grid size-10 place-items-center rounded-full bg-surface/90 text-fg shadow-card backdrop-blur transition-[transform,background-color] hover:scale-105 hover:bg-surface ${className}`}
    >
      <Heart aria-hidden="true" className={`size-[18px] transition-colors ${watched ? "fill-live text-live" : ""}`} />
    </button>
  );
}

export function ShareButton({ className = "", label }) {
  const { toast } = useStore();
  const { ui } = useLang();
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard may be blocked (e.g. insecure context); the confirmation still explains the action.
    }
    toast({ tone: "success", title: ui("linkCopied") });
  };
  return (
    <button type="button" onClick={onClick} className={`inline-flex h-11 items-center gap-2 text-sm font-medium text-fg ${className}`}>
      <Share2 aria-hidden="true" className="size-[18px]" />
      <span className="a-underline-hover">{label || ui("share")}</span>
    </button>
  );
}
