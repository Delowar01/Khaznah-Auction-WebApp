"use client";

import Link from "next/link";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Reveal } from "@/components/shared/ui/Reveal";
import { CATEGORIES } from "@/data/categories";
import { formatNumber } from "@/lib/format";
import { Container, SectionHeader } from "../ui/Layout";
import { LotImage } from "../ui/LotImage";
import { useCopy } from "../lib/useCopy";

/** All eight categories as compact tiles: cut-out on a lit plate + live count. */
export function CategoryTiles() {
  const { link } = useConcept();
  const { t, ui } = useLang();
  const c = useCopy();
  return (
    <section aria-labelledby="categories-title" className="py-14 md:py-20">
      <Container>
        <SectionHeader id="categories-title" eyebrow={ui("categories")} title={ui("shopByCategory")} text={c("categoriesText")} />
        <Reveal as="ul" className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 lg:gap-4">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={link(`/browse?category=${category.slug}`)}
                className="d-card d-panel group flex h-full flex-col overflow-hidden"
              >
                <span className="d-card-media relative block aspect-square">
                  <LotImage image={category.image} cutout gradient fill alt="" sizes="(min-width: 1024px) 12vw, (min-width: 640px) 24vw, 46vw" inset="p-[16%]" />
                </span>
                <span className="flex flex-1 flex-col gap-1 p-3">
                  <span className="text-[13.5px] font-medium leading-snug text-fg">{t(category.name)}</span>
                  <span className="d-num text-xs text-fg-3">{c("lotsCount", { n: formatNumber(category.count) })}</span>
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
