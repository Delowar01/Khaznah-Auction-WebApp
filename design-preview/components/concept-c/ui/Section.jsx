"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Reveal } from "@/components/shared/ui/Reveal";
import { BiHeading } from "./Bi";
import { Diamond } from "./Diamond";
import { cx } from "./cx";

/** Page section with the standard container and vertical rhythm. */
export function Section({ id, labelledBy, className = "", containerClassName = "", children, reveal = true }) {
  const Body = reveal ? Reveal : "div";
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx("relative py-14 sm:py-16 lg:py-20", className)}>
      <Body className={cx("c-container", containerClassName)}>{children}</Body>
    </section>
  );
}

/** Eyebrow rule: gold diamond, label, then a hairline to the inline end. */
export function EyebrowRule({ content, className = "" }) {
  const { t } = useLang();
  return (
    <div className={cx("flex items-center gap-4", className)}>
      <span className="c-eyebrow">
        <Diamond size={7} className="text-accent" />
        {t(content)}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}

/** Section head: eyebrow rule, bilingual title, optional lead and action. */
export function SectionHead({ eyebrow, title, text, action, id, className = "", titleClassName = "" }) {
  const { t } = useLang();
  return (
    <div className={cx("mb-8 lg:mb-12", className)}>
      {eyebrow ? <EyebrowRule content={eyebrow} className="mb-6" /> : null}
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div className="max-w-3xl">
          <BiHeading content={title} id={id} titleClassName={titleClassName} />
          {text ? <p className="c-prose mt-4 max-w-2xl">{t(text)}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
