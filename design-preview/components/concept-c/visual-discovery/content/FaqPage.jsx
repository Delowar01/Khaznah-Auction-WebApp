"use client";

// Option 3 — FAQ (production /faq). The FAQ system in full, with only the
// content production has: one question. Search keeps production's matching
// (every keystroke, the question or the answer, in the current language,
// case-insensitive, untrimmed); the accordion keeps one answer open at a
// time and starts closed. Production's hero is the Contact page's (a
// preserved quirk). More questions need the business owner's content.
// Preview state "no-results" opens with a search that matches nothing.
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ChevronDown, CircleHelp, Search } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CONTENT_COPY as C } from "@/components/shared/commerce/contentCopy";
import { StateRoute } from "@/components/shared/preview/StateRoute";
import { PRIORITY_2 } from "@/components/shared/r3/work-media-p2";
import { CONTENT } from "@/data/contentPages";
import { plural } from "@/lib/i18n";
import { EmptyState, Panel } from "../kit/Blocks";
import { btn, cx } from "../ui";
import { ContentHero, ContentPage, TrustStrip } from "./ContentKit";

const F = CONTENT.faq;
// Preview state "no-results": a search no question matches.
const NO_MATCH = { en: "warranty", ar: "الضمان" };

/** Production's filter, as written: substring of the question or answer in the current language. */
function filterFaqs(items, query, t) {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter((item) => t(item.question).toLowerCase().includes(q) || t(item.answer).toLowerCase().includes(q));
}

function Question({ item, open, onToggle, onKey, index }) {
  const { t } = useLang();
  const id = useId();
  return (
    <li className="border-b border-[var(--vd-line)] last:border-b-0">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          onKeyDown={(event) => onKey(event, index)}
          data-faq-question=""
          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-start vd-lg font-bold text-[var(--vd-ink)] transition-colors hover:text-[var(--vd-indigo)] dt:px-7"
        >
          {t(item.question)}
          <span aria-hidden="true" className={cx("grid size-9 shrink-0 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)] transition-transform duration-300 motion-reduce:transition-none", open && "rotate-180")}>
            <ChevronDown className="size-5" strokeWidth={2.2} />
          </span>
        </button>
      </h3>
      <div id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} hidden={!open} className="px-5 pb-6 dt:px-7">
        <p className="max-w-[68ch] vd-lg text-[var(--vd-ink)]/85">{t(item.answer)}</p>
      </div>
    </li>
  );
}

function FaqView({ state }) {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const inputId = useId();
  const listRef = useRef(null);
  const [query, setQuery] = useState(() => (state === "no-results" ? NO_MATCH[lang] : ""));
  // Keyed by the question (production keys the open answer by its place in
  // the filtered list; with one question the two are the same).
  const [open, setOpen] = useState(null);
  const items = filterFaqs(F.items, query, t);

  // Arrow keys, Home and End move between the questions (Enter and Space toggle, as buttons do).
  const onKey = (event, index) => {
    const buttons = [...(listRef.current?.querySelectorAll("[data-faq-question]") ?? [])];
    const to = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: buttons.length - 1 }[event.key];
    if (to === undefined || !buttons.length) return;
    event.preventDefault();
    buttons[(to + buttons.length) % buttons.length].focus();
  };

  // "1 question matches “…”": the search words isolated, whatever their direction.
  const [before, after = ""] = (query ? plural(items.length, C.faqMatches, lang) : plural(items.length, C.faqCount, lang)).split("{q}");

  return (
    <>
      <section aria-labelledby={`${inputId}-title`} className="vd-container mt-8 dt:mt-10">
        <h2 id={`${inputId}-title`} className="sr-only">
          {t(C.faqListTitle)}
        </h2>
        <div className="mx-auto max-w-3xl">
          <div role="search">
            <label htmlFor={inputId} className="vd-md font-semibold text-[var(--vd-ink)]">
              {t(C.faqSearchLabel)}
            </label>
            <div className="mt-2 flex h-14 items-center gap-3 rounded-full bg-[var(--vd-bluegray)] ps-5 pe-4 ring-[var(--vd-indigo)] focus-within:ring-2">
              <Search aria-hidden="true" className="size-5 shrink-0 text-[var(--vd-indigo)]" strokeWidth={2.2} />
              <input
                id={inputId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t(F.search.placeholder)}
                autoComplete="off"
                className="vd-search h-full min-w-0 flex-1 bg-transparent vd-lg text-[var(--vd-ink)] outline-none"
              />
            </div>
          </div>
          <p role="status" className="mt-3 min-h-5 vd-sm text-[var(--vd-muted)]">
            {items.length ? (
              <>
                {before}
                {query ? <bdi>{query}</bdi> : null}
                {after}
              </>
            ) : null}
          </p>
          {items.length ? (
            <Panel as="div" className="mt-2 !p-0">
              <ul ref={listRef}>
                {items.map((item, index) => (
                  <Question key={item.question.en} item={item} index={index} open={open === item.question.en} onToggle={() => setOpen(open === item.question.en ? null : item.question.en)} onKey={onKey} />
                ))}
              </ul>
            </Panel>
          ) : (
            <EmptyState
              icon={CircleHelp}
              title={t(F.emptyState.message)}
              compact
              className="mt-2"
              headingLevel={3}
              actions={
                <button type="button" onClick={() => setQuery("")} className={btn("indigo", "lg")}>
                  {t(F.emptyState.clearButton)}
                </button>
              }
            />
          )}
        </div>
      </section>
      <section aria-labelledby={`${inputId}-more`} className="vd-container mt-12 dt:mt-16">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-[24px] bg-[var(--vd-ivory)] px-6 py-8 sm:px-9">
          <div className="min-w-0 max-w-xl">
            <h2 id={`${inputId}-more`} className="vd-h2 !text-[26px] !leading-8 text-[var(--vd-ink)] rtl:!leading-10">
              {t(F.stillHaveQuestions.heading)}
            </h2>
            <p className="mt-2 vd-lg text-[var(--vd-ink)]/80">{t(F.stillHaveQuestions.body)}</p>
          </div>
          <Link href={link(F.stillHaveQuestions.button.href)} className={btn("indigo", "lg", "px-7")}>
            {t(F.stillHaveQuestions.button.label)}
          </Link>
        </div>
      </section>
    </>
  );
}

export function VisualDiscoveryFaq() {
  return (
    <ContentPage current="faq">
      <ContentHero eyebrow={F.hero.eyebrow} headline={F.hero.headline} intro={F.hero.intro} image={PRIORITY_2.sellers.khaznaCartons} photoOnPhones={false} />
      <StateRoute fallback={<FaqView state="default" />}>{(params, state) => <FaqView key={state} state={state} />}</StateRoute>
      <TrustStrip marks={F.trustStrip} />
      <div className="pb-12 dt:pb-16" />
    </ContentPage>
  );
}
