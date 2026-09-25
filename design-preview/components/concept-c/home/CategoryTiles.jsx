"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { CATEGORIES } from "@/data/categories";
import { UI } from "@/data/ui";
import { Plate } from "../ui/Plate";
import { SectionHeader } from "../ui/SectionHeader";
import { BrowseLink } from "../utils/navigation";
import { COPY } from "../copy";

/** All eight categories: one row on desktop, a swipeable rail on phones. */
export function CategoryTiles() {
  const { t, ui, pl } = useLang();
  return (
    <section aria-labelledby="kb-categories">
      <SectionHeader id="kb-categories" bi={UI.shopByCategory} subtitle={t(COPY.categoriesSubtitle)} href="/browse" hrefLabel={ui("allLots")} />
      <ul className="kb-rail no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-8 lg:overflow-visible lg:px-0 lg:pb-0">
        {CATEGORIES.map((category) => (
          <li key={category.slug} className="w-[112px] shrink-0 lg:w-auto">
            <BrowseLink
              href={`/browse?category=${category.slug}`}
              className="group flex h-full flex-col items-center gap-2 rounded-xl border border-line bg-surface p-2 pb-3 text-center transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-raised"
            >
              <Plate
                image={category.image}
                alt=""
                sizes="(min-width: 1024px) 12vw, 112px"
                className="aspect-square w-full rounded-lg"
                imgClassName="transition-transform duration-300 group-hover:scale-[1.06]"
              />
              <span className="line-clamp-2 min-h-[2lh] kb-sm font-bold text-balance text-fg group-hover:text-primary xl:line-clamp-1 xl:min-h-0">{t(category.name)}</span>
              <span className="-mt-1 kb-2xs font-medium text-fg-3 tabular">{pl("lots", category.count)}</span>
            </BrowseLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
