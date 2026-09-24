"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getGrade } from "@/data/grades";
import { GradeChip } from "../ui/GradeChip";
import { Button } from "../ui/Button";
import { GradeGuideModal } from "./GradeGuideModal";

/** Grade, what it means, the lot's own condition note and the guide. */
export function ConditionReport({ product }) {
  const { t, ui } = useLang();
  const [open, setOpen] = useState(false);
  const grade = getGrade(product.grade);
  return (
    <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
      <div className="d-panel-2 flex items-center gap-4 p-4 md:w-56 md:flex-col md:items-start">
        <GradeChip grade={product.grade} size="lg" label onClick={() => setOpen(true)} />
        <p className="text-[13px] text-fg-2">{t(grade.text)}</p>
      </div>
      <div>
        <h3 className="d-label text-fg-3">{ui("conditionReport")}</h3>
        <p className="mt-2 text-[15px] text-fg text-pretty">{t(product.conditionNote)}</p>
        <Button variant="secondary" size="sm" icon={BookOpen} className="mt-4" onClick={() => setOpen(true)}>
          {ui("whatGradeMeans")}
        </Button>
      </div>
      <GradeGuideModal open={open} onClose={() => setOpen(false)} highlight={product.grade} />
    </div>
  );
}
