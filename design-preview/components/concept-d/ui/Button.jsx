"use client";

import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { cx } from "./cx";

// B's action system: indigo carries every primary action, ink and outline
// support it, gold is reserved for value moments. `data-state` lets the
// components board force hover/active/focus without a pointer.
const BASE =
  "relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-control font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out active:translate-y-px data-[state=active]:translate-y-px data-[state=focus]:outline-2 data-[state=focus]:outline-offset-2 data-[state=focus]:outline-focus disabled:cursor-not-allowed disabled:border-transparent disabled:bg-muted disabled:text-fg-3 disabled:shadow-none disabled:active:translate-y-0";

export const BUTTON_VARIANTS = {
  primary:
    "bg-primary text-on-primary shadow-card hover:bg-primary-hover data-[state=hover]:bg-primary-hover data-[state=active]:bg-primary-hover",
  soft: "bg-primary/10 text-primary hover:bg-primary/15 data-[state=hover]:bg-primary/15 data-[state=active]:bg-primary/15",
  outline:
    "border border-line-strong bg-surface text-fg hover:border-fg-3 hover:bg-surface-2 data-[state=hover]:border-fg-3 data-[state=hover]:bg-surface-2 data-[state=active]:bg-surface-2",
  "outline-primary":
    "border border-primary/40 bg-surface text-primary hover:border-primary hover:bg-primary/5 data-[state=hover]:border-primary data-[state=hover]:bg-primary/5",
  ghost: "text-fg-2 hover:bg-surface-2 hover:text-fg data-[state=hover]:bg-surface-2 data-[state=hover]:text-fg",
  ink: "bg-secondary text-on-secondary hover:opacity-90 data-[state=hover]:opacity-90",
  accent: "bg-accent text-on-accent hover:brightness-95 data-[state=hover]:brightness-95",
  brand: "kb-btn-on-brand shadow-card",
  "on-dark": "border border-white/35 text-white hover:border-white/60 hover:bg-white/10",
};

export const BUTTON_SIZES = {
  xs: "h-7 gap-1 px-2.5 kb-xs",
  sm: "h-9 gap-1.5 px-3 kb-sm",
  md: "h-10 gap-2 px-4 kb-md",
  lg: "h-12 gap-2 px-5 kb-lg",
};

const ICON_SIZES = { xs: "size-3.5", sm: "size-4", md: "size-4", lg: "size-5" };

export function buttonClass({ variant = "primary", size = "md", block = false, className = "" } = {}) {
  return cx(BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], block && "w-full", className);
}

function Content({ icon: Icon, iconEnd: IconEnd, loading, size, children }) {
  const iconClass = cx("shrink-0", ICON_SIZES[size]);
  return (
    <>
      {loading ? (
        <LoaderCircle aria-hidden="true" className={cx(iconClass, "animate-spin")} />
      ) : Icon ? (
        <Icon aria-hidden="true" className={iconClass} />
      ) : null}
      {children}
      {IconEnd ? <IconEnd aria-hidden="true" className={iconClass} /> : null}
    </>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  icon,
  iconEnd,
  className = "",
  type = "button",
  children,
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? undefined : onClick}
      className={buttonClass({ variant, size, block, className: cx(loading && "cursor-progress", className) })}
      {...props}
    >
      <Content icon={icon} iconEnd={iconEnd} loading={loading} size={size}>
        {children}
      </Content>
    </button>
  );
}

export function ButtonLink({ href, variant = "primary", size = "md", block = false, icon, iconEnd, className = "", children, ...props }) {
  return (
    <Link href={href} className={buttonClass({ variant, size, block, className })} {...props}>
      <Content icon={icon} iconEnd={iconEnd} size={size}>
        {children}
      </Content>
    </Link>
  );
}

/** Square icon-only button (always pass an aria-label). */
export function IconButton({ icon: Icon, label, className = "", size = "md", variant = "ghost", badge, ...props }) {
  const dims = { sm: "size-9", md: "size-10", lg: "size-11" }[size];
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        "relative inline-grid shrink-0 place-items-center rounded-control transition-colors duration-150",
        variant === "ghost" && "text-fg-2 hover:bg-surface-2 hover:text-fg",
        variant === "outline" && "border border-line bg-surface text-fg-2 hover:border-line-strong hover:text-fg",
        variant === "glass" && "bg-surface/90 text-fg shadow-card backdrop-blur hover:bg-surface",
        dims,
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
      {badge}
    </button>
  );
}
