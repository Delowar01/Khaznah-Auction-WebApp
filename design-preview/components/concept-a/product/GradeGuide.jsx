"use client";

import { Check, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { GRADES, GRADE_MATRIX, GRADE_ORDER } from "@/data/grades";
import { GradeChip } from "../ui/GradeChip";
import { DialogPanel } from "../ui/Panels";
import { Tabs } from "../ui/Tabs";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

/** Compact table of every grade with its one-line meaning. */
export function GradeTable({ highlight, className = "" }) {
  const { t } = useLang();
  return (
    <ul className={cx("divide-y divide-line overflow-hidden rounded-lg border border-line", className)}>
      {GRADE_ORDER.map((key) => (
        <li key={key} className={cx("flex items-start gap-3 px-3 py-2.5", highlight === key ? "bg-primary/5" : "bg-surface")}>
          <GradeChip grade={key} size="md" letter className="w-12" />
          <div className="min-w-0">
            <p className="kb-sm font-bold text-fg">{t(GRADES[key].label)}</p>
            <p className="kb-xs text-fg-2">{t(GRADES[key].text)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MatrixTable({ group, highlight }) {
  const { t } = useLang();
  const electronics = group.key === "electronics";
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line">
      {group.rows.map((row) => (
        <li key={row.grade} className={cx("flex items-start gap-3 px-3 py-3", highlight === row.grade ? "bg-primary/5" : "bg-surface")}>
          <GradeChip grade={row.grade} size="md" letter className="w-10" />
          <p className="min-w-0 flex-1 kb-sm text-fg">{t(row.text)}</p>
          {electronics ? (
            <span className={cx("inline-flex shrink-0 items-center gap-1 kb-xs font-bold", row.works ? "text-success" : "text-danger")}>
              {row.works ? <Check aria-hidden="true" className="size-3.5" /> : <X aria-hidden="true" className="size-3.5" />}
              {t(row.works ? COPY.gradeMatrixWorks : COPY.gradeMatrixNotWorking)}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** Grade guide modal: the electronics / non-electronics matrix. */
export function GradeGuideModal({ open, onClose, highlight }) {
  const { t, ui } = useLang();
  return (
    <DialogPanel open={open} onClose={onClose} title={ui("gradeGuide")} size="lg">
      <p className="mb-4 kb-md text-fg-2">{ui("gradeGuideText")}</p>
      <Tabs
        label={ui("gradeGuide")}
        tabs={GRADE_MATRIX.map((group) => ({
          id: group.key,
          label: t(group.label),
          content: <MatrixTable group={group} highlight={highlight} />,
        }))}
        panelClassName="pt-4"
      />
      <p className="mt-4 kb-xs text-fg-3">{ui("returnsText")}</p>
    </DialogPanel>
  );
}
