"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Logo } from "@/components/shared/brand/Logo";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { withLang } from "@/lib/routes";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

/** Count bubble that re-plays a small bump whenever the number changes. */
export function CountBubble({ count, tone = "accent", className = "" }) {
  if (!count) return null;
  return (
    <span
      key={count}
      aria-hidden="true"
      className={cx(
        "kb-bump absolute -end-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] leading-none font-extrabold tabular ring-2 ring-surface",
        tone === "accent" ? "bg-accent text-on-accent" : "bg-primary text-on-primary",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

/** Logo lockup linking home. */
export function LogoLink({ className = "", onClick }) {
  const { link } = useConcept();
  const { t } = useLang();
  return (
    <Link href={link("/")} onClick={onClick} className={cx("flex shrink-0 items-center rounded-md", className)}>
      <Logo variant="lockup" title={t(COPY.logoHome)} className="h-9 w-auto lg:h-10" />
    </Link>
  );
}

/** Link to the same page in the other language, keeping filters and hash. */
export function LanguageLink({ className = "", onNavigate, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, ui } = useLang();
  const other = lang === "en" ? "ar" : "en";
  const href = withLang(pathname, other);
  return (
    <Link
      href={href}
      hrefLang={other}
      lang={other}
      onClick={(event) => {
        onNavigate?.();
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        router.push(`${href}${window.location.search}${window.location.hash}`);
      }}
      className={className}
    >
      {children}
      {other === "ar" ? ui("arabic") : ui("english")}
    </Link>
  );
}
