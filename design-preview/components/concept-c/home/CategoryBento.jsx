"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { CATEGORIES } from "@/data/categories";
import { UI } from "@/data/ui";
import { COPY } from "../copy";
import { Echo } from "../ui/Bi";
import { Section, SectionHead } from "../ui/Section";
import { cx } from "../ui/cx";

// Modular bento: one 2×2 feature tile, one tall tile, six squares.
const SPAN = {
  electronics: "col-span-2 lg:row-span-2",
  "home-appliances": "lg:row-span-2",
  "bulk-pallets": "col-span-2 lg:col-span-1",
};

function Tile({ category }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const big = category.slug === "electronics";
  const scene = category.scene;
  return (
    <li className={cx("relative", SPAN[category.slug])}>
      <Link
        href={link(`/browse?category=${category.slug}`)}
        className={cx(
          "group relative flex h-full flex-col overflow-hidden p-4 transition-colors duration-300 sm:p-5 lg:min-h-0 lg:p-6",
          big || scene ? "min-h-[12rem]" : "min-h-[14rem]",
          scene ? "bg-secondary text-on-secondary" : "bg-surface-2 hover:bg-(--c-sand-deep)",
        )}
      >
        {scene ? (
          <>
            <Img image={scene} alt="" sizes="(min-width: 1024px) 25vw, 100vw" className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          </>
        ) : (
          <>
            <span aria-hidden="true" className={cx("c-tile-glow pointer-events-none absolute bottom-0 end-0", big ? "h-[85%] w-[62%]" : "h-[62%] w-[80%]")} />
            <Img
              image={category.cutout}
              alt=""
              sizes={big ? "(min-width: 1024px) 30vw, 60vw" : "(min-width: 1024px) 14vw, 30vw"}
              className={cx(
                "pointer-events-none absolute bottom-0 end-0 object-contain transition-transform duration-500 group-hover:scale-[1.04] ltr:object-right-bottom rtl:object-left-bottom",
                big ? "h-[64%] w-[52%] p-3 lg:h-[72%] lg:w-[70%] lg:p-8" : "h-[44%] w-[64%] p-2 lg:h-[64%] lg:w-[58%] lg:p-3",
              )}
            />
          </>
        )}
        <div className="relative lg:max-w-[70%]">
          <h3 className={cx("font-display font-bold leading-tight", big ? "text-[1.75rem] lg:text-[2.5rem]" : "text-lg sm:text-xl lg:text-[1.375rem]", scene ? "text-on-secondary" : "text-fg")}>{t(category.name)}</h3>
          <Echo content={category.name} className={cx("mt-1", scene && "text-on-secondary/75")} />
          {big ? <p className="c-prose mt-4 hidden max-w-xs sm:block">{t(category.blurb)}</p> : null}
        </div>
        <span className={cx("relative mt-auto flex items-center gap-2 pt-6 text-sm font-medium", scene ? "text-on-secondary" : "text-fg-2")}>
          {pl("lots", category.count)}
          <DirIcon icon={ArrowRight} className="size-4 transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </Link>
    </li>
  );
}

/** Categories as an architectural bento grid of sand tiles with product cut-outs. */
export function CategoryBento() {
  return (
    <Section labelledBy="categories-title">
      <SectionHead id="categories-title" eyebrow={COPY.categoriesEyebrow} title={UI.shopByCategory} />
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:auto-rows-[13.5rem] lg:grid-cols-4">
        {CATEGORIES.map((category) => (
          <Tile key={category.slug} category={category} />
        ))}
      </ul>
    </Section>
  );
}
