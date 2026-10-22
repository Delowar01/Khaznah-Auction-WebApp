"use client";

// Shared pieces of the six Option 3 content pages (About, How it works,
// FAQ, Contact, Privacy, Terms): the page frame with breadcrumbs and the
// help-and-company navigation (production's "About" menu, which the Option 3
// masthead does not carry), the ivory-and-photo hero of the home page,
// section openings, the trust strip and the navy closing band.
import Link from "next/link";
import { Fragment, useEffect, useId, useRef } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CONTENT_COPY as C, HELP_PAGES } from "@/components/shared/commerce/contentCopy";
import { Img } from "@/components/shared/ui/Img";
import { Breadcrumbs } from "../kit/Blocks";
import { VDPage } from "../kit/Page";
import { Arrow, btn, cx } from "../ui";

/** The six destinations as pills; the current page is marked. */
export function HelpNav({ current, className = "" }) {
  const { t } = useLang();
  const { link } = useConcept();
  const rail = useRef(null);
  // Phones: bring the current page's pill into view (Privacy and Terms start off-screen).
  useEffect(() => {
    const list = rail.current;
    const pill = list?.querySelector('[aria-current="page"]');
    if (!pill) return;
    const box = list.getBoundingClientRect();
    const at = pill.getBoundingClientRect();
    if (at.left < box.left + 16) list.scrollLeft -= box.left + 16 - at.left;
    else if (at.right > box.right - 16) list.scrollLeft += at.right - (box.right - 16);
  }, [current]);
  return (
    <nav aria-label={t(C.helpNav)} className={cx("vd-print-hide max-dt:[margin-inline:calc(var(--vd-gutter)*-1)]", className)}>
      <ul ref={rail} className="vd-rail flex items-center gap-2 overflow-x-auto max-dt:[padding-inline:var(--vd-gutter)]">
        {HELP_PAGES.map((page) => {
          const here = page.key === current;
          return (
            <li key={page.key} className="shrink-0">
              <Link
                href={link(page.href)}
                aria-current={here ? "page" : undefined}
                className={cx(
                  "inline-flex h-10 items-center rounded-full px-4 vd-md transition-colors",
                  here ? "bg-[var(--vd-indigo)] font-semibold text-white" : "border border-[var(--vd-line)] bg-white text-[var(--vd-ink)] hover:bg-[var(--vd-bluegray)]",
                )}
              >
                {t(page.label)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * A content page: the Option 3 masthead and footer with the newsletter band,
 * breadcrumbs and the help navigation. `document` marks a page printed as a
 * document (the masthead, footer and navigation drop out when printing).
 */
export function ContentPage({ current, document = false, children }) {
  const { t } = useLang();
  const page = HELP_PAGES.find((entry) => entry.key === current);
  return (
    <VDPage newsletter>
      <div className="vd-print-hide vd-container pt-6 dt:pt-8">
        <Breadcrumbs items={[{ label: t(page.label) }]} />
        <HelpNav current={current} className="mt-4" />
      </div>
      <div data-print-document={document ? "" : undefined}>{children}</div>
    </VDPage>
  );
}

/** Production's two-line headline: line 2 is the accent (gold in production, the newsletter blue here). */
export function Headline({ lines, id, className = "" }) {
  const { t } = useLang();
  return (
    <h1 id={id} className={cx("vd-page-title text-[var(--vd-ink)]", className)}>
      <span className="block">{t(lines[0])}</span> <span className="block text-[var(--vd-blue)]">{t(lines[1])}</span>
    </h1>
  );
}

/**
 * The home page's pairing of an ivory text panel and a warm photograph:
 * eyebrow, the two-line H1, `before` (e.g. production's WhatsApp button,
 * which sits between the H1 and the intro), the intro, then the actions.
 * `photoOnPhones` false leaves the photograph out below 768 px, where the
 * page's own task (a form, a search) should come first.
 */
export function ContentHero({ eyebrow, headline, intro, before, actions, image, imagePosition = "center", photoOnPhones = true }) {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vd-container mt-5 dt:mt-6">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] md:gap-4">
        <div className="flex flex-col justify-center rounded-[24px] bg-[var(--vd-ivory)] px-6 py-8 sm:px-9 md:py-10 dt:px-14 dt:py-14">
          <p className="vd-kicker text-[var(--vd-indigo)]">{t(eyebrow)}</p>
          <Headline lines={headline} id={titleId} className="mt-3" />
          {before}
          <p className="mt-4 max-w-[36rem] vd-lg text-[var(--vd-ink)]/85">{t(intro)}</p>
          {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        <div className={cx("relative h-56 overflow-hidden rounded-[24px] bg-[var(--vd-bluegray)] sm:h-72 md:h-auto md:min-h-[360px]", !photoOnPhones && "max-md:hidden")}>
          <Img image={image} alt="" priority sizes="(min-width: 1200px) 620px, (min-width: 768px) 44vw, 100vw" className="absolute inset-0 size-full object-cover" style={{ objectPosition: imagePosition }} />
        </div>
      </div>
    </section>
  );
}

/** A section's opening: production's eyebrow over the H2, and optional text. */
export function SectionIntro({ eyebrow, title, text, id, align = "start", className = "" }) {
  const { t } = useLang();
  return (
    <div className={cx(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl", className)}>
      {eyebrow ? <p className="vd-kicker text-[var(--vd-indigo)]">{t(eyebrow)}</p> : null}
      <h2 id={id} className={cx("vd-h2 text-[var(--vd-ink)]", eyebrow ? "mt-2" : null)}>
        {t(title)}
      </h2>
      {text ? <p className="mt-3 vd-lg text-[var(--vd-muted)]">{t(text)}</p> : null}
    </div>
  );
}

/**
 * Production's trust strip (the last block on all six pages): the seven
 * marks in English in both languages, as production shows them. Listed for
 * owner review (Apple Pay, STC Pay and Maroof are not evidenced).
 */
export function TrustStrip({ marks }) {
  const { t } = useLang();
  return (
    <section aria-label={t(C.trustMarks)} className="vd-print-hide vd-container mt-12 dt:mt-16">
      <ul className="flex flex-wrap items-center justify-center gap-2 border-t border-[var(--vd-line)] pt-6">
        {marks.map((mark) => (
          <li key={mark.en} lang="en" dir="ltr" className="inline-flex h-9 items-center rounded-full border border-[var(--vd-line)] bg-white px-4 vd-sm font-bold tracking-[0.02em] text-[var(--vd-muted)]">
            {t(mark)}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** A production button pair: the first as the gold primary, the second as outline (white on navy). */
export function ActionLinks({ buttons, onNavy = false }) {
  const { t } = useLang();
  const { link } = useConcept();
  return buttons.map((button, i) => (
    <Link key={button.href + i} href={link(button.href)} className={btn(i === 0 ? "gold" : onNavy ? "white" : "outline", "lg", "gap-2 px-7")}>
      {t(button.label)}
      {/* Production writes " →" after the label; here the arrow follows the reading direction. */}
      {button.suffix ? <Arrow className="size-4" /> : null}
    </Link>
  ));
}

/** The navy closing band: production's CTA heading, text and buttons. */
export function CtaBand({ cta }) {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vd-print-hide vd-container mt-12 dt:mt-16">
      <div className="relative overflow-hidden rounded-[24px] bg-[var(--vd-navy)] px-6 py-10 text-white sm:px-10 dt:px-16 dt:py-14">
        <span aria-hidden="true" className="absolute -end-20 -top-24 size-80 rounded-full bg-[radial-gradient(closest-side,rgb(225_169_50/0.25),transparent)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
          <div className="min-w-0 max-w-2xl">
            <h2 id={titleId} className="vd-h2 text-white">
              {t(cta.heading)}
            </h2>
            <p className="mt-3 vd-lg text-white/80">{t(cta.body)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionLinks buttons={cta.buttons} onNavy />
          </div>
        </div>
      </div>
    </section>
  );
}

const EMAIL = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/;

/** Text with any email address isolated left-to-right (production's legal copy prints it in Arabic sentences). */
export function BidiText({ text }) {
  const parts = String(text).split(EMAIL);
  return parts.map((part, i) =>
    i % 2 ? (
      <bdi key={i} dir="ltr">
        {part}
      </bdi>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
