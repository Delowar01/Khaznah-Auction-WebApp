"use client";

import { useId, useState } from "react";
import { Check, X } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { useLang } from "@/components/shared/providers/LangProvider";
import { GRADES, GRADE_MATRIX, GRADE_ORDER } from "@/data/grades";
import { UI } from "@/data/ui";
import { COPY } from "../copy";
import { DIALOG_PANEL, DialogHeader } from "./Dialog";
import { Diamond } from "./Diamond";
import { cx } from "./cx";

/** The full condition-grade guide: the ladder plus the electronics matrix. */
export function GradeGuideModal({ open, onClose, current }) {
  const { t, ui } = useLang();
  const titleId = useId();
  const [tab, setTab] = useState(GRADE_MATRIX[0].key);
  const matrix = GRADE_MATRIX.find((m) => m.key === tab) || GRADE_MATRIX[0];

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} variant="sheet" panelClassName={cx(DIALOG_PANEL, "md:max-w-2xl!")}>
      <DialogHeader id={titleId} title={UI.gradeGuide} eyebrow={COPY.gradesEyebrow} onClose={onClose} />
      <div className="space-y-8 px-5 py-6 sm:px-7">
        <p className="c-prose">{ui("gradeGuideText")}</p>

        <ol className="divide-y divide-line border-y border-line">
          {GRADE_ORDER.map((key) => {
            const g = GRADES[key];
            const isCurrent = current === key;
            return (
              <li key={key} className={cx("flex items-start gap-4 px-2 py-3.5", isCurrent && "bg-accent/10")} aria-current={isCurrent ? "true" : undefined}>
                <span className="mt-1.5" style={{ color: `var(--grade-${g.tone})` }}>
                  <Diamond size={10} />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-fg">{t(g.label)}</p>
                  <p className="text-sm text-fg-2">{t(g.text)}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div>
          <div role="group" aria-label={ui("gradeGuide")} className="mb-4 inline-flex rounded-control border border-line bg-surface-2 p-1">
            {GRADE_MATRIX.map((m) => (
              <button
                key={m.key}
                type="button"
                aria-pressed={tab === m.key}
                onClick={() => setTab(m.key)}
                className={cx("h-9 rounded-sm px-4 text-sm font-semibold transition-colors", tab === m.key ? "bg-surface text-fg shadow-card" : "text-fg-2 hover:text-fg")}
              >
                {t(m.label)}
              </button>
            ))}
          </div>
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">{t(matrix.label)}</caption>
            <thead>
              <tr className="border-b border-line-strong text-start text-fg-3">
                <th scope="col" className="w-20 py-2 text-start font-medium">
                  {t(COPY.gradeCol)}
                </th>
                <th scope="col" className="py-2 text-start font-medium">
                  {ui("condition")}
                </th>
                {matrix.key === "electronics" ? (
                  <th scope="col" className="w-24 py-2 text-end font-medium">
                    <span className="sr-only">{t(COPY.worksYes)}</span>
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((row) => {
                const g = GRADES[row.grade];
                return (
                  <tr key={row.grade} className="border-b border-line align-top">
                    <th scope="row" className="py-3 text-start">
                      <span className="inline-flex items-center gap-2 font-semibold text-fg">
                        <span style={{ color: `var(--grade-${g.tone})` }}>
                          <Diamond size={7} />
                        </span>
                        {row.grade}
                      </span>
                    </th>
                    <td className="py-3 pe-3 text-fg-2">{t(row.text)}</td>
                    {matrix.key === "electronics" ? (
                      <td className="py-3 text-end">
                        <span className={cx("inline-flex items-center gap-1.5 text-xs font-semibold", row.works ? "text-success" : "text-danger")}>
                          {row.works ? <Check aria-hidden="true" className="size-3.5" /> : <X aria-hidden="true" className="size-3.5" />}
                          {t(row.works ? COPY.worksYes : COPY.worksNo)}
                        </span>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
