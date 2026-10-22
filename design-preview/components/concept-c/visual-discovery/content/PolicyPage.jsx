"use client";

// Option 3 — Privacy policy and Terms & conditions (production /privacy and
// /terms). Presentation only: every heading, paragraph and the "Last
// updated: January 2025" line are production's, character for character
// (data/contentPages.js) — nothing rewritten, re-dated or added. What
// changes is the reading: a calm document column with a section list (a
// sticky list from 1200 px, a collapsible one on smaller screens), clear
// numbered headings, the email kept left-to-right inside Arabic sentences,
// and a print view without the site around it.
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  Ban,
  BellRing,
  CalendarDays,
  ChevronDown,
  CircleAlert,
  CreditCard,
  Database,
  EyeOff,
  FileText,
  Fingerprint,
  Gavel,
  Handshake,
  Lock,
  Printer,
  Scale,
  UserCheck,
} from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CONTENT_COPY as C } from "@/components/shared/commerce/contentCopy";
import { CONTENT } from "@/data/contentPages";
import { btn, cx } from "../ui";
import { BidiText, ContentPage, Headline, TrustStrip } from "./ContentKit";

const BADGE_ICONS = {
  privacy: [Lock, Fingerprint, Database, EyeOff, Ban, BellRing],
  terms: [Gavel, FileText, UserCheck, CreditCard, Scale, Handshake],
};

function DocHeader({ doc }) {
  const { t } = useLang();
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="vd-container mt-5 dt:mt-6">
      <div className="rounded-[24px] bg-[var(--vd-ivory)] px-6 py-8 sm:px-9 dt:px-14 dt:py-12 print:bg-transparent print:p-0">
        <p className="vd-kicker text-[var(--vd-indigo)]">{t(doc.title)}</p>
        <Headline lines={doc.headline} id={titleId} className="mt-3" />
        {doc.intro.map((line) => (
          <p key={line.en} className="mt-4 max-w-[44rem] vd-lg text-[var(--vd-ink)]/85">
            {t(line)}
          </p>
        ))}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 vd-md font-semibold text-[var(--vd-ink)] print:px-0">
            <CalendarDays aria-hidden="true" className="size-4 text-[var(--vd-indigo)]" strokeWidth={2.2} />
            {t(doc.updated)}
          </p>
          <button type="button" onClick={() => window.print()} className={btn("soft", "md", "vd-print-hide gap-2")}>
            <Printer aria-hidden="true" className="size-4" strokeWidth={2.2} />
            {t(C.print)}
          </button>
        </div>
      </div>
    </section>
  );
}

function Commitment({ doc, kind }) {
  const { t } = useLang();
  const titleId = useId();
  const icons = BADGE_ICONS[kind];
  return (
    <section aria-labelledby={titleId} className="vd-print-hide vd-container mt-4">
      <div className="rounded-[24px] border border-[var(--vd-line)] bg-white px-5 py-6 sm:px-8 dt:px-10">
        <p className="vd-kicker text-[var(--vd-indigo)]">{t(doc.commitment.eyebrow)}</p>
        <h2 id={titleId} className="mt-2 vd-h3 !text-[22px] !leading-7 text-[var(--vd-ink)] rtl:!leading-9">
          {t(doc.commitment.heading)}
        </h2>
        <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 dt:grid-cols-6">
          {doc.commitment.badges.map((badge, i) => {
            const Icon = icons[i];
            return (
              <li key={badge.en} className="flex items-center gap-2.5 rounded-[16px] bg-[#f6f8fc] px-3 py-3 vd-sm font-semibold text-[var(--vd-ink)]">
                <Icon aria-hidden="true" className="size-[18px] shrink-0 text-[var(--vd-indigo)]" strokeWidth={2} />
                {t(badge)}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** The section list: links to each numbered section; the one being read is marked. */
function SectionList({ sections, ids, current, className = "" }) {
  const { t } = useLang();
  return (
    <ol className={cx("grid gap-0.5", className)}>
      {sections.map((section, i) => (
        <li key={ids[i]}>
          <a
            href={`#${ids[i]}`}
            aria-current={current === ids[i] ? "location" : undefined}
            className={cx(
              "flex min-h-10 items-center rounded-[12px] px-3 py-2 vd-md transition-colors",
              current === ids[i] ? "bg-[var(--vd-bluegray)] font-semibold text-[var(--vd-indigo)]" : "text-[var(--vd-ink)] hover:bg-[#f6f8fc]",
            )}
          >
            {t(section.heading)}
          </a>
        </li>
      ))}
    </ol>
  );
}

function useCurrentSection(ids) {
  const [current, setCurrent] = useState(ids[0]);
  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!targets.length || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [ids]);
  return current;
}

function Document({ doc, kind }) {
  const { t } = useLang();
  const { link } = useConcept();
  const [ids] = useState(() => doc.sections.map((_, i) => `${kind}-${i + 1}`));
  const current = useCurrentSection(ids);
  const listId = useId();
  return (
    <div className="vd-container mt-10 dt:mt-14">
      <div className="grid gap-8 dt:grid-cols-[280px_minmax(0,1fr)] dt:gap-14">
        <nav aria-labelledby={listId} className="vd-print-hide">
          {/* Phones and tablets: a collapsible list above the text; from 1200 px it stays beside it. */}
          <details className="group rounded-[20px] border border-[var(--vd-line)] bg-white dt:hidden">
            <summary className="flex h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 vd-md font-bold text-[var(--vd-ink)] [&::-webkit-details-marker]:hidden">
              <span id={listId}>{t(C.onThisPage)}</span>
              <ChevronDown aria-hidden="true" className="size-5 text-[var(--vd-indigo)] transition-transform group-open:rotate-180" strokeWidth={2.2} />
            </summary>
            <SectionList sections={doc.sections} ids={ids} current={current} className="px-2 pb-3" />
          </details>
          <div className="sticky top-6 hidden dt:block">
            <p aria-hidden="true" className="px-3 vd-kicker text-[var(--vd-muted)]">
              {t(C.onThisPage)}
            </p>
            <SectionList sections={doc.sections} ids={ids} current={current} className="mt-3" />
          </div>
        </nav>
        <article className="min-w-0">
          {doc.sections.map((section, i) => (
            <section key={ids[i]} id={ids[i]} aria-labelledby={`${ids[i]}-title`} className={cx("scroll-mt-6", i > 0 && "mt-10 border-t border-[var(--vd-line)] pt-10")}>
              <h2 id={`${ids[i]}-title`} className="vd-h3 !text-[22px] !leading-8 text-[var(--vd-ink)] rtl:!leading-9">
                {t(section.heading)}
              </h2>
              <div className="vd-prose">
                {section.blocks.map((block, j) => (
                  <p key={j}>
                    <BidiText text={t(block)} />
                  </p>
                ))}
              </div>
            </section>
          ))}
          <aside aria-labelledby={`${kind}-questions`} className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-[24px] bg-[#f6f8fc] px-6 py-6 sm:px-8">
            <div className="flex min-w-0 items-start gap-3">
              <CircleAlert aria-hidden="true" className="mt-1 size-5 shrink-0 text-[var(--vd-indigo)]" strokeWidth={2.2} />
              <div className="min-w-0">
                <h2 id={`${kind}-questions`} className="vd-h3 text-[var(--vd-ink)]">
                  {t(doc.contactBox.heading)}
                </h2>
                {/* As production: the address is plain text, not a link. */}
                <p className="mt-1 vd-md text-[var(--vd-muted)]">
                  <BidiText text={t(doc.contactBox.text)} />
                </p>
              </div>
            </div>
            <Link href={link(doc.contactBox.button.href)} className={btn("indigo", "lg", "vd-print-hide px-7")}>
              {t(doc.contactBox.button.label)}
            </Link>
          </aside>
        </article>
      </div>
    </div>
  );
}

/** `kind`: "privacy" or "terms". */
export function VisualDiscoveryPolicy({ kind }) {
  const doc = CONTENT[kind];
  return (
    <ContentPage current={kind} document>
      <DocHeader doc={doc} />
      <Commitment doc={doc} kind={kind} />
      <Document doc={doc} kind={kind} />
      <TrustStrip marks={doc.trustStrip} />
      <div className="pb-12 dt:pb-16" />
    </ContentPage>
  );
}
