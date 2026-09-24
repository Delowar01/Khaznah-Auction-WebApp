"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { CONCEPT_BY_ID } from "@/data/concepts";
import { Container } from "../ui/Layout";
import { useCopy } from "../lib/useCopy";
import { SystemSection } from "../system/SystemSection";
import { TokenBoard } from "../system/TokenBoard";
import { TypeScale } from "../system/TypeScale";
import { ButtonBoard, InputBoard } from "../system/ControlBoard";
import { BadgeBoard } from "../system/BadgeBoard";
import { DataVizBoard } from "../system/DataVizBoard";
import { CardBoard } from "../system/CardBoard";
import { FeedbackBoard } from "../system/FeedbackBoard";

export function SystemPage() {
  const { t } = useLang();
  const c = useCopy();
  const sections = [
    { id: "sys-colour", title: c("sysColour"), body: <TokenBoard /> },
    { id: "sys-type", title: c("sysType"), body: <TypeScale /> },
    { id: "sys-buttons", title: c("sysButtons"), body: <ButtonBoard /> },
    { id: "sys-inputs", title: c("sysInputs"), body: <InputBoard /> },
    { id: "sys-badges", title: c("sysBadges"), body: <BadgeBoard /> },
    { id: "sys-data", title: c("sysData"), body: <DataVizBoard /> },
    { id: "sys-cards", title: c("sysCards"), body: <CardBoard /> },
    { id: "sys-feedback", title: c("sysFeedback"), body: <FeedbackBoard /> },
  ];

  return (
    <>
      <div className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="d-dotgrid pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="d-glow pointer-events-none absolute -top-40 end-0 size-[560px]" />
        <Container className="relative py-10 md:py-14">
          <p className="d-label text-fg-3">{t(CONCEPT_BY_ID.d.name)}</p>
          <h1 className="d-tight mt-3 text-3xl font-semibold text-fg md:text-5xl">{c("systemTitle")}</h1>
          <p className="mt-4 max-w-2xl text-[15px] text-fg-2 md:text-base">{c("systemText")}</p>
          <nav aria-label={c("systemTitle")} className="mt-6 flex flex-wrap gap-1.5">
            {sections.map((section, index) => (
              <a key={section.id} href={`#${section.id}`} className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-surface/70 px-3 text-[13px] text-fg-2 transition-colors hover:text-fg">
                <span className="d-num text-[11px] text-fg-3">{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </a>
            ))}
          </nav>
        </Container>
      </div>
      <Container>
        {sections.map((section, index) => (
          <SystemSection key={section.id} id={section.id} index={index + 1} title={section.title}>
            {section.body}
          </SystemSection>
        ))}
      </Container>
    </>
  );
}
