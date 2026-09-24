"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { ITEM_TYPES, SOURCE_TYPES, getGrade } from "@/data/grades";
import { getCategory } from "@/lib/catalog";
import { Echo } from "../ui/Bi";
import { Badge, GradeChip } from "../ui/Badges";
import { Diamond } from "../ui/Diamond";
import { GradeGuideModal } from "../ui/GradeGuideModal";

/** Lot number + bilingual category line, big title with its echo, grade chip and guide link. */
export function LotHeader({ product, status = null, actions = null }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const [guide, setGuide] = useState(false);
  const category = getCategory(product.category);

  return (
    <header>
      {status}
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-3">
        <span>
          {ui("lotNumber")}{" "}
          <span dir="ltr" className="c-num font-semibold text-fg-2">
            {product.lot}
          </span>
        </span>
        <Diamond size={4} className="text-line-strong" />
        <Link href={link(`/browse?category=${product.category}`)} className="c-link font-medium text-fg-2 hover:text-fg">
          {t(category?.name)}
        </Link>
        <Echo content={category?.name} className="inline" />
      </p>
      <h1 className="c-display mt-4 text-[1.75rem] font-bold sm:text-[2.125rem] lg:text-[2rem] xl:text-[2.375rem]">{t(product.title)}</h1>
      <Echo content={product.title} className="mt-2" />
      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <GradeChip grade={product.grade} size="lg" full />
        <Badge tone="neutral">{t(SOURCE_TYPES[product.source])}</Badge>
        {product.itemType !== "single" ? <Badge tone="primary">{t(ITEM_TYPES[product.itemType])}</Badge> : null}
        <button type="button" onClick={() => setGuide(true)} className="c-link ms-1 inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-primary">
          <BookOpen aria-hidden="true" className="size-4" />
          {ui("gradeGuide")}
        </button>
      </div>
      {actions ? <div className="mt-5 flex flex-wrap gap-2">{actions}</div> : null}
      <GradeGuideModal open={guide} onClose={() => setGuide(false)} current={getGrade(product.grade).key} />
    </header>
  );
}

/** The condition note and what the grade means. */
export function ConditionNote({ product }) {
  const { t, ui } = useLang();
  const grade = getGrade(product.grade);
  return (
    <div className="mt-6 border-s-2 border-accent bg-surface-2/60 py-3.5 pe-4 ps-4">
      <p className="c-caps text-fg-3">{ui("conditionReport")}</p>
      <p className="mt-1.5 font-medium text-fg">{t(product.conditionNote)}</p>
      <p className="mt-1 text-sm text-fg-2">
        {ui("whatGradeMeans")}: {t(grade.text)}
      </p>
    </div>
  );
}
