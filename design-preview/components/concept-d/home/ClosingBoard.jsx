"use client";

import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Reveal } from "@/components/shared/ui/Reveal";
import { endingSoon } from "@/lib/catalog";
import { Container, SectionHeader, ArrowLink } from "../ui/Layout";
import { LotBoard } from "../cards/LotBoard";
import { useCopy } from "../lib/useCopy";

/** "Closing soon" board: the six auctions nearest their close, live. */
export function ClosingBoard() {
  const { link } = useConcept();
  const { ui } = useLang();
  const c = useCopy();
  const lots = endingSoon(6);
  return (
    <section aria-labelledby="closing-title" className="py-14 md:py-20">
      <Container>
        <SectionHeader
          id="closing-title"
          eyebrow={ui("endingSoon")}
          title={c("closingBoardTitle")}
          text={c("closingBoardText")}
          action={<ArrowLink href={link("/browse?tab=auction")}>{ui("viewAll")}</ArrowLink>}
        />
        <Reveal>
          <LotBoard products={lots} caption={c("closingBoardTitle")} />
        </Reveal>
      </Container>
    </section>
  );
}
