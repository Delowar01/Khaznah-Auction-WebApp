"use client";

import { cx } from "./cx";

const TONES = {
  neutral: "bg-surface-2 text-fg-2",
  primary: "bg-primary/10 text-primary",
  solid: "bg-primary text-on-primary",
  live: "bg-live text-white",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  accent: "bg-accent text-on-accent",
  ink: "bg-secondary text-on-secondary",
  glass: "bg-black/60 text-white backdrop-blur-sm",
  outline: "border border-line bg-surface text-fg-2",
  // Fixed fills for badges placed on product plates (light in both themes).
  "tag-indigo": "kb-tag-indigo",
  "tag-ink": "kb-tag-ink",
  "tag-new": "kb-tag-new",
  "tag-warn": "kb-tag-warn",
  "tag-live": "kb-tag-live",
  "tag-gold": "kb-tag-gold",
  "tag-muted": "kb-tag-muted",
};

const SIZES = {
  sm: "h-5 gap-1 px-1.5 kb-2xs",
  md: "h-6 gap-1.5 px-2 kb-xs",
  lg: "h-7 gap-1.5 px-2.5 kb-sm",
};

/**
 * Compact status label. `dot` adds the pulsing live dot; `icon` a leading glyph.
 */
export function Badge({ tone = "neutral", size = "sm", icon: Icon, dot = false, className = "", children, ...props }) {
  return (
    <span
      className={cx("inline-flex shrink-0 items-center whitespace-nowrap rounded-md font-bold", TONES[tone], SIZES[size], className)}
      {...props}
    >
      {dot ? <span aria-hidden="true" className={cx("kz-live-dot", (tone === "live" || tone === "tag-live") && "bg-white!")} /> : null}
      {Icon ? <Icon aria-hidden="true" className={size === "sm" ? "size-3" : "size-3.5"} strokeWidth={2.25} /> : null}
      {children}
    </span>
  );
}

/** Red LIVE marker used on streams, the nav and live lots. */
export function LiveBadge({ size = "sm", children, className = "" }) {
  return (
    <Badge tone="live" size={size} dot className={className}>
      {children}
    </Badge>
  );
}
