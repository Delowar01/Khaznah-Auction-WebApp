"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CONCEPT_BY_ID } from "@/data/concepts";
import { COPY } from "../copy";
import { BiHeading } from "../ui/Bi";
import { Diamond } from "../ui/Diamond";
import { Breadcrumbs } from "../ui/Misc";

/** Board head: title, the concept's one-liner and its traits. */
export function SystemHead() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const concept = CONCEPT_BY_ID.c;
  return (
    <section className="relative overflow-hidden border-b border-line">
      <span className="c-gridlines" style={{ "--grid": "4rem", "--grid-mask": "linear-gradient(to bottom, black, transparent 95%)" }} />
      <div className="c-container relative pb-10 pt-6 lg:pb-14 lg:pt-8">
        <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("componentsStates") }]} />
        <p className="c-eyebrow mt-8">
          <Diamond size={7} className="text-accent" />
          {t(concept.name)} · {t(concept.type)}
        </p>
        <BiHeading as="h1" size="display" content={COPY.systemTitle} className="mt-4" titleClassName="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem]" />
        <p className="c-prose mt-5 max-w-2xl text-[1.0625rem]">{t(COPY.systemLead)}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {concept.traits.map((trait) => (
            <li key={trait.en} className="flex items-center gap-2 rounded-xs border border-line bg-surface px-3 py-1.5 text-sm text-fg-2">
              <Diamond size={5} className="text-accent" />
              {t(trait)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
