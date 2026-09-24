"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { CATEGORIES } from "@/data/categories";
import { Reveal } from "@/components/shared/ui/Reveal";
import { CategoryTile } from "../cards/CategoryTile";
import { SectionHead } from "../ui/Type";
import { COPY } from "../copy";

export function Departments() {
  const { t } = useLang();
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1360px] px-5 py-20 sm:px-6 lg:px-10 lg:py-28">
        <SectionHead eyebrow={t(COPY.wholeCatalogue)} title={t(COPY.departments)} text={t(COPY.departmentsText)} />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 4) * 70}>
              <CategoryTile category={c} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
