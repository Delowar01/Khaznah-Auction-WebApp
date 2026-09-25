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

/** Section title row: title + subtitle on the start side, actions on the end. */
export function SectionHeader({ title, subtitle, href, hrefLabel, id, icon: Icon, actions, eyebrow, className = "", as: Heading = "h2" }) {
  return (
    <div className={cx("mb-5 flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="mb-1.5 kb-eyebrow text-fg-3">{eyebrow}</p> : null}
        <Heading id={id} className="flex items-center gap-2.5 kb-h2 text-fg">
          {Icon ? <Icon aria-hidden="true" className="size-5 shrink-0 text-accent" strokeWidth={2} /> : null}
          {title}
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
