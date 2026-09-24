"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { cx } from "./cx";

export function btnClass({ variant = "primary", size, block, className } = {}) {
  return cx("c-btn", `c-btn--${variant}`, size && `c-btn--${size}`, block && "c-btn--block", className);
}

function Inner({ icon: Icon, arrow, loading, children }) {
  return (
    <>
      {loading ? <span className="c-loader" aria-hidden="true" /> : Icon ? <Icon aria-hidden="true" className="size-[1.15em] shrink-0" /> : null}
      {children}
      {arrow ? <DirIcon icon={ArrowRight} className="size-[1.1em] shrink-0" /> : null}
    </>
  );
}

/** Button with the concept's variants: primary · night · gold · outline · ghost · danger. */
export function Button({ variant, size, block, loading = false, icon, arrow, className, children, type = "button", disabled, ...props }) {
  return (
    <button
      type={type}
      className={btnClass({ variant, size, block, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <Inner icon={icon} arrow={arrow} loading={loading}>
        {children}
      </Inner>
    </button>
  );
}

export function ButtonLink({ href, variant, size, block, icon, arrow, className, children, ...props }) {
  return (
    <Link href={href} className={btnClass({ variant, size, block, className })} {...props}>
      <Inner icon={icon} arrow={arrow}>
        {children}
      </Inner>
    </Link>
  );
}
