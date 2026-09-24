"use client";

import { Check, X, Minus } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { useLang } from "@/components/shared/providers/LangProvider";
import { GRADES, GRADE_MATRIX } from "@/data/grades";
import { GradeChip } from "../ui/GradeChip";

/** Condition grade guide (same matrix as production's grade modal). */
export function GradeGuideModal({ open, onClose, highlight }) {
  const { t, ui } = useLang();
  return (
    <Modal open={open} onClose={onClose} title={ui("gradeGuide")} variant="sheet" panelClassName="md:!max-w-3xl rounded-t-xl md:rounded-xl bg-elevated text-fg shadow-overlay">
      <div className="flex items-start justify-between gap-6 border-b border-line px-6 py-6 md:px-8">
        <div>
          <p className="a-eyebrow">{ui("inspected")}</p>
          <p className="a-display mt-2 text-[32px] text-fg">{ui("gradeGuide")}</p>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-fg-2">{ui("gradeGuideText")}</p>
        </div>
        <button type="button" onClick={onClose} aria-label={ui("close")} className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-surface-2">
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
      <div className="space-y-8 px-6 py-6 md:px-8">
        <div className={`flex items-start gap-4 rounded-card border p-4 ${highlight === "new" ? "border-fg bg-surface-2" : "border-line"}`}>
          <GradeChip grade="new" />
          <p className="text-sm leading-relaxed text-fg-2">{t(GRADES.new.text)}</p>
        </div>
        {GRADE_MATRIX.map((group) => (
          <section key={group.key}>
            <h3 className="a-serif text-xl text-fg">{t(group.label)}</h3>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {group.rows.map((row) => (
                <li key={row.grade} className={`grid grid-cols-[auto_1fr_auto] items-start gap-4 py-3 ${highlight === row.grade ? "bg-surface-2" : ""}`}>
                  <GradeChip grade={row.grade} size="sm" />
                  <p className="text-sm leading-relaxed text-fg-2">{t(row.text)}</p>
                  <span className="pt-0.5 text-fg-3" aria-label={row.works === false ? "Not working" : row.works ? "Working" : "N/A"}>
                    {row.works === false ? <X aria-hidden="true" className="size-4 text-danger" /> : row.works ? <Check aria-hidden="true" className="size-4 text-success" /> : <Minus aria-hidden="true" className="size-4" />}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
}
