"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Eyebrow } from "../ui/Type";
import { SystemSection } from "../system/Section";
import { Palette } from "../system/Palette";
import { TypeSpecimen } from "../system/TypeSpecimen";
import { ButtonStates } from "../system/ButtonStates";
import { InputStates } from "../system/InputStates";
import { Badges } from "../system/Badges";
import { CardStates } from "../system/CardStates";
import { Feedback } from "../system/Feedback";
import { Overlays } from "../system/Overlays";
import { COPY } from "../copy";

export function SystemPage() {
  const { t, ui } = useLang();
  return (
    <div className="mx-auto max-w-[1360px] px-5 sm:px-6 lg:px-10">
      <header className="py-14 lg:py-20">
        <Eyebrow>{t({ en: "Concept A · Premium Marketplace", ar: "المفهوم A · السوق الفاخر" })}</Eyebrow>
        <h1 className="a-display mt-4 text-[48px] text-fg sm:text-[76px] rtl:sm:text-[64px]">{ui("componentsStates")}</h1>
        <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-fg-2 rtl:text-[17px] rtl:leading-8">{t(COPY.systemIntro)}</p>
      </header>
      <SystemSection index={1} title={t(COPY.sysPalette)} text={t(COPY.sysPaletteText)}>
        <Palette />
      </SystemSection>
      <SystemSection index={2} title={t(COPY.sysType)} text={t(COPY.sysTypeText)}>
        <TypeSpecimen />
      </SystemSection>
      <SystemSection index={3} title={t(COPY.sysButtons)} wide>
        <ButtonStates />
      </SystemSection>
      <SystemSection index={4} title={t(COPY.sysInputs)}>
        <InputStates />
      </SystemSection>
      <SystemSection index={5} title={t(COPY.sysBadges)}>
        <Badges />
      </SystemSection>
      <SystemSection index={6} title={t(COPY.sysCards)}>
        <CardStates />
      </SystemSection>
      <SystemSection index={7} title={t(COPY.sysFeedback)}>
        <Feedback />
      </SystemSection>
      <SystemSection index={8} title={t(COPY.sysOverlays)}>
        <Overlays />
      </SystemSection>
    </div>
  );
}
