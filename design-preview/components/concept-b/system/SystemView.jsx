"use client";

import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { COPY } from "../copy";
import { BadgeStates } from "./BadgeStates";
import { ButtonStates } from "./ButtonStates";
import { CardStates } from "./CardStates";
import { FeedbackDemos } from "./FeedbackDemos";
import { InputStates } from "./InputStates";
import { LoadingEmpty } from "./LoadingEmpty";
import { NavigationDemos } from "./NavigationDemos";
import { SystemSection } from "./SystemSection";
import { TokenSwatches } from "./TokenSwatches";
import { TypeSpecimen } from "./TypeSpecimen";

const SECTIONS = [
  { id: "sys-colour", copy: COPY.sysColour, Body: TokenSwatches },
  { id: "sys-type", copy: COPY.sysType, Body: TypeSpecimen },
  { id: "sys-buttons", copy: COPY.sysButtons, Body: ButtonStates },
  { id: "sys-inputs", copy: COPY.sysInputs, Body: InputStates },
  { id: "sys-badges", copy: COPY.sysBadges, Body: BadgeStates },
  { id: "sys-cards", copy: COPY.sysCards, Body: CardStates },
  { id: "sys-loading", copy: COPY.sysLoading, Body: LoadingEmpty },
  { id: "sys-feedback", copy: COPY.sysFeedback, Body: FeedbackDemos },
  { id: "sys-navigation", copy: COPY.sysNavigation, Body: NavigationDemos },
];

function SectionIndex() {
  const { t, ui } = useLang();
  return (
    <nav aria-label={ui("componentsStates")} className="mt-6">
      <ol className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {SECTIONS.map((section, i) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface pe-3.5 ps-2 kb-sm font-semibold text-fg-2 transition-colors hover:border-line-strong hover:text-fg"
            >
              <span className="grid size-6 place-items-center rounded-full bg-primary/10 kb-2xs font-extrabold text-primary tabular">{i + 1}</span>
              {t(section.copy)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The "Components & states" board: tokens, type and every interactive state. */
export function SystemView() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  return (
    <div className="bg-surface-2/60 pb-20">
      <header className="border-b border-line bg-surface">
        <div className="kb-container pb-6 pt-4 sm:pb-8">
          <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("componentsStates") }]} />
          <p className="mt-5 kb-eyebrow text-primary">{t(COPY.systemEyebrow)}</p>
          <h1 className="mt-2 kb-display text-fg">{ui("componentsStates")}</h1>
          <p className="mt-3 max-w-2xl kb-lg text-fg-2">{t(COPY.systemIntro)}</p>
          <SectionIndex />
        </div>
      </header>
      <div className="kb-container mt-10 grid grid-cols-1 gap-14 sm:mt-12 sm:gap-16">
        {SECTIONS.map(({ id, copy, Body }, i) => (
          <SystemSection key={id} id={id} index={i + 1} title={t(copy)}>
            <Body />
          </SystemSection>
        ))}
      </div>
    </div>
  );
}
