"use client";

import Link from "next/link";
import { Share2 } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Diamond } from "./Diamond";
import { btnClass } from "./Button";
import { cx } from "./cx";

/** Copies the current page link and confirms with a toast. */
export function useCopyLink() {
  const { ui } = useLang();
  const { toast } = useStore();
  return async (description) => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the toast still confirms the intent.
    }
    toast({ tone: "success", title: ui("linkCopied"), description });
  };
}

export function ShareButton({ label, description, variant = "outline", size, iconOnly = false, className = "" }) {
  const { ui } = useLang();
  const copy = useCopyLink();
  const text = label || ui("share");
  return (
    <button
      type="button"
      onClick={() => copy(description)}
      aria-label={iconOnly ? text : undefined}
      className={cx(btnClass({ variant, size }), iconOnly && "c-btn--icon", className)}
    >
      <Share2 aria-hidden="true" className="size-[1.05em]" />
      {iconOnly ? null : text}
    </button>
  );
}

/** Breadcrumb trail with diamond separators. */
export function Breadcrumbs({ items, className = "" }) {
  const { ui } = useLang();
  return (
    <nav aria-label={ui("breadcrumb")} className={className}>
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-3">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-3">
            {index > 0 ? <Diamond size={4} className="text-line-strong" /> : null}
            {item.href ? (
              <Link href={item.href} className="c-link text-fg-2 hover:text-fg">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="line-clamp-1 text-fg-3">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Bulleted list with diamond markers. */
export function DiamondList({ items, className = "", itemClassName = "" }) {
  return (
    <ul className={cx("space-y-3", className)}>
      {items.map((item, index) => (
        <li key={index} className={cx("flex items-start gap-3", itemClassName)}>
          <Diamond size={6} className="mt-[0.6em] text-accent" />
          <span className="min-w-0 flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}
