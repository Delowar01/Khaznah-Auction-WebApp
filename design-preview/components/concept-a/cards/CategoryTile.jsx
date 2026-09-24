"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { DirIcon } from "@/components/shared/ui/DirIcon";

export function CategoryTile({ category, index = 0 }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  return (
    <Link href={link(`/browse?category=${category.slug}`)} className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-plate transition-colors duration-500 group-hover:bg-[var(--plate-hover)]">
        <Img
          image={category.image}
          alt=""
          sizes="(min-width: 1024px) 22vw, 45vw"
          className="a-plate-img absolute inset-x-0 top-[8%] mx-auto h-[70%] w-full object-contain px-[12%] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:-translate-y-2 group-hover:scale-[1.04]"
        />
        <span className="a-eyebrow absolute start-4 top-4 !text-[var(--plate-fg-2)] tabular">{String(index + 1).padStart(2, "0")}</span>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div>
            <h3 className="a-serif text-[22px] leading-tight text-[var(--plate-fg)] rtl:text-[22px]">{t(category.name)}</h3>
            <p className="mt-1 text-[12px] text-[var(--plate-fg-2)]">{pl("lots", category.count)}</p>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[var(--plate-fg)]/25 text-[var(--plate-fg)] transition-colors duration-300 group-hover:border-[var(--plate-fg)] group-hover:bg-[var(--plate-fg)] group-hover:text-[var(--plate)]">
            <DirIcon icon={ArrowUpRight} className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
