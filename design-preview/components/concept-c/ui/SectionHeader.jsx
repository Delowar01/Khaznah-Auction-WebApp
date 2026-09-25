"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { BrowseLink } from "../utils/navigation";
import { cx } from "./cx";

/** "View all ›" link; browse targets update in place when already browsing. */
export function ViewAllLink({ href, label, className = "" }) {
  const { ui } = useLang();
  const { link } = useConcept();
  const classes = cx(
    "inline-flex h-9 shrink-0 items-center gap-1 rounded-control px-2 kb-sm font-semibold text-primary transition-colors hover:bg-primary/10",
    className,
  );
  const content = (
    <>
      {label || ui("viewAll")}
      <DirIcon icon={ChevronRight} className="size-4" />
    </>
  );
  return href.startsWith("/browse") ? (
    <BrowseLink href={href} className={classes}>
      {content}
    </BrowseLink>
  ) : (
    <Link href={link(href)} className={classes}>
      {content}
    </Link>
  );
}

/**
 * Bilingual section heading: the current language leads at full size and the
 * mirrored language sits beneath as a small muted line — the Arabic-first
 * signature applied to fixed UI headings. Pass `bi` as the raw `{en, ar}`
 * object; `title` remains for headings with no natural counterpart.
 */
export function BilingualHeading({ bi, title, icon: Icon }) {
  const { lang } = useLang();
  const primary = bi ? (lang === "ar" ? bi.ar : bi.en) : title;
  const alt = bi ? (lang === "ar" ? bi.en : bi.ar) : null;
  return (
    <span className="flex min-w-0 items-start gap-2">
      {Icon ? <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={2.25} /> : null}
      <span className="flex min-w-0 flex-col">
        <span className="min-w-0">{primary}</span>
        {alt ? (
          <span dir={lang === "ar" ? "ltr" : "rtl"} className="kb-bi-alt truncate">
            {alt}
          </span>
        ) : null}
      </span>
    </span>
  );
}

/** Section title row: title + subtitle on the start side, actions on the end. */
export function SectionHeader({ title, subtitle, bi, href, hrefLabel, id, icon: Icon, actions, eyebrow, className = "", as: Heading = "h2" }) {
  return (
    <div className={cx("mb-4 flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 flex items-center gap-2 kb-eyebrow text-primary">
            <span aria-hidden="true" className="kb-rule" />
            {eyebrow}
          </p>
        ) : null}
        <Heading id={id} className="kb-h2 text-fg">
          <BilingualHeading bi={bi} title={title} icon={Icon} />
        </Heading>
        {subtitle ? <p className="mt-1.5 kb-sm text-fg-2">{subtitle}</p> : null}
      </div>
      {actions || href ? (
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {href ? <ViewAllLink href={href} label={hrefLabel} /> : null}
        </div>
      ) : null}
    </div>
  );
}
