"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const BASE =
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-[background-color,color,border-color,box-shadow,transform,filter] duration-150 ease-out active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none aria-disabled:cursor-not-allowed aria-disabled:opacity-45";

const VARIANTS = {
  primary: "d-btn-primary bg-primary text-on-primary hover:bg-primary-hover",
  gold: "d-btn-gold bg-accent text-on-accent hover:brightness-[1.07]",
  secondary: "border border-line-strong bg-surface-2 text-fg hover:border-fg-3/50 hover:bg-elevated",
  ghost: "text-fg-2 hover:bg-surface-2 hover:text-fg",
  quiet: "border border-line bg-surface text-fg hover:border-line-strong hover:bg-surface-2",
  danger: "text-danger hover:bg-danger/10",
};

// Static equivalents of the interactive states, for the components board.
const FORCED = {
  hover: {
    primary: "bg-primary-hover",
    gold: "brightness-[1.07]",
    secondary: "border-fg-3/50 bg-elevated",
    ghost: "bg-surface-2 text-fg",
    quiet: "border-line-strong bg-surface-2",
    danger: "bg-danger/10",
  },
  active: "translate-y-px brightness-95",
  focus: "d-force-focus",
};

const SIZES = {
  sm: "h-9 px-3 text-[13px]",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
  xl: "h-14 px-6 text-base",
  icon: "size-11",
  iconSm: "size-9",
};

export const Button = forwardRef(function Button(
  { href, variant = "primary", size = "md", loading = false, icon: Icon, iconEnd: IconEnd, forceState, className = "", children, disabled, type = "button", ...props },
  ref,
) {
  const forced = forceState === "hover" ? FORCED.hover[variant] : forceState ? FORCED[forceState] : "";
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${forced || ""} ${className}`;
  const content = (
    <>
      {loading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : Icon ? <Icon aria-hidden="true" className="size-4 shrink-0" /> : null}
      {children}
      {IconEnd ? <IconEnd aria-hidden="true" className="flip-rtl size-4 shrink-0" /> : null}
    </>
  );

  if (href) {
    return (
      <Link ref={ref} href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button ref={ref} type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {content}
    </button>
  );
});
