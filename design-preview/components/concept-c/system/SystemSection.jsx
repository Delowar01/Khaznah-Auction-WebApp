"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { COPY } from "../copy";
import { BiHeading } from "../ui/Bi";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";

export const SYSTEM_SECTIONS = [
  { id: "colour", title: COPY.sysColour },
  { id: "type", title: COPY.sysType },
  { id: "geometry", title: COPY.sysGeometry },
  { id: "buttons", title: COPY.sysButtons },
  { id: "inputs", title: COPY.sysInputs },
  { id: "badges", title: COPY.sysBadges },
  { id: "cards", title: COPY.sysCards },
  { id: "feedback", title: COPY.sysFeedback },
  { id: "navigation", title: COPY.sysNavigation },
];

/** Numbered board section with a bilingual title. */
export function SystemSection({ id, index, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 border-t border-line py-12 first:border-t-0 first:pt-2 lg:py-16">
      <div className="mb-8 flex items-start gap-4">
        <span className="c-num mt-2 text-sm font-semibold text-fg-3">{String(index + 1).padStart(2, "0")}</span>
        <BiHeading id={`${id}-title`} content={title} titleClassName="text-[1.75rem] lg:text-[2rem]" />
      </div>
      {children}
    </section>
  );
}

/** Small caption above a specimen. */
export function StateLabel({ children, className = "" }) {
  return <p className={cx("c-caps mb-3 text-fg-3", className)}>{children}</p>;
}

/** Sticky in-page index for the board (desktop). */
export function SystemIndex() {
  const { t } = useLang();
  return (
    <nav aria-label={t(COPY.systemTitle)} className="hidden lg:block">
      <ol className="sticky top-[calc(var(--pbar-h)+7rem)] space-y-1 border-s border-line">
        {SYSTEM_SECTIONS.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className="group -ms-px flex items-center gap-3 border-s border-transparent py-1.5 ps-4 text-sm text-fg-2 hover:border-accent hover:text-fg">
              <span className="c-num text-xs text-fg-3">{String(index + 1).padStart(2, "0")}</span>
              {t(section.title)}
              <Diamond size={5} className="text-accent opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
