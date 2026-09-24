"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { cx } from "./cx";

/** The other language of the page, for bilingual compositions. */
export function useOtherLang() {
  const { lang } = useLang();
  const other = lang === "ar" ? "en" : "ar";
  return {
    other,
    otherDir: other === "ar" ? "rtl" : "ltr",
    pick: (content) => (content && typeof content === "object" ? content[other] || "" : ""),
  };
}

/**
 * The echo: the same words in the other language, set small beneath the
 * primary line (Archivo expanded caps under Arabic; Alexandria under English).
 * It repeats visible meaning, so assistive technology skips it.
 */
export function Echo({ content, as: Tag = "span", size, className = "" }) {
  const { other, otherDir, pick } = useOtherLang();
  const text = pick(content);
  if (!text) return null;
  return (
    <Tag lang={other} dir={otherDir} aria-hidden="true" className={cx("c-echo", size === "lg" && "c-echo--lg", className)}>
      {text}
    </Tag>
  );
}

const ROLE = { display: "c-display", h2: "c-h2", h3: "c-h3" };

/** Heading in the page language with its echo underneath. */
export function BiHeading({ as: Tag = "h2", content, size = "h2", id, className = "", titleClassName = "", echoClassName = "", echoSize, children }) {
  const { t } = useLang();
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <Tag id={id} className={cx(ROLE[size], titleClassName)}>
        {children ?? t(content)}
      </Tag>
      <Echo content={content} size={echoSize} className={echoClassName} />
    </div>
  );
}
