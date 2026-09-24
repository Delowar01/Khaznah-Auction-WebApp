"use client";

import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Reveal } from "@/components/shared/ui/Reveal";
import { bulkLots } from "@/lib/catalog";
import { Container, SectionHeader, ArrowLink } from "../ui/Layout";
import { useCopy } from "../lib/useCopy";
import { BulkLotCard } from "./BulkLotCard";

/** Pallets first (manifest bars), then cartons and cases. */
export function BulkPallets() {
  const { link } = useConcept();
  const { ui } = useLang();
  const c = useCopy();
  const lots = bulkLots().sort((a, b) => (a.itemType === "pallet" ? -1 : 0) - (b.itemType === "pallet" ? -1 : 0));
  return (
    <section aria-labelledby="bulk-title" className="py-14 md:py-20">
      <Container>
        <SectionHeader
          id="bulk-title"
          eyebrow={ui("manifest")}
          title={ui("bulkLots")}
          text={c("bulkText")}
          action={<ArrowLink href={link("/browse?category=bulk-pallets")}>{ui("viewAll")}</ArrowLink>}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
          {lots.map((product, index) => (
            <Reveal key={product.slug} delay={(index % 2) * 70} className="flex">
              <BulkLotCard product={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
