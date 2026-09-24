"use client";

import { useId, useState } from "react";
import { Check, Minus, X } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { useLang } from "@/components/shared/providers/LangProvider";
import { GRADES, GRADE_MATRIX, GRADE_ORDER } from "@/data/grades";
import { GradeChip } from "../ui/GradeChip";
import { Tabs, TabPanel } from "../ui/Tabs";

/** Grade guide: the scale New→F plus the electronics / non-electronics matrix. */
export function GradeGuideModal({ open, onClose, highlight }) {
  const { t, ui } = useLang();
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [tab, setTab] = useState(GRADE_MATRIX[0].key);

  return (
    <Modal open={open} onClose={onClose} title={ui("gradeGuide")} variant="sheet" panelClassName="max-w-2xl rounded-t-2xl border border-line-strong bg-elevated shadow-overlay md:max-w-2xl md:rounded-2xl">
      <div className="flex items-start justify-between gap-4 border-b border-line p-5">
        <div>
          <p className="text-lg font-semibold text-fg" aria-hidden="true">
            {ui("gradeGuide")}
          </p>
          <p className="mt-1 text-sm text-fg-2">{ui("gradeGuideText")}</p>
        </div>
        <button type="button" onClick={onClose} aria-label={ui("close")} className="grid size-10 shrink-0 place-items-center rounded-lg text-fg-3 hover:bg-surface-2 hover:text-fg">
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      <ul className="grid gap-1.5 p-5 sm:grid-cols-2">
        {GRADE_ORDER.map((key) => (
          <li
            key={key}
            className={`flex gap-3 rounded-xl p-3 ${highlight === key ? "bg-surface-2 ring-1 ring-inset ring-line-strong" : ""}`}
          >
            <GradeChip grade={key} className="mt-0.5 min-w-10 justify-center" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-fg">{t(GRADES[key].label)}</p>
              <p className="mt-0.5 text-[13px] text-fg-2">{t(GRADES[key].text)}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="px-5 pb-5">
        <Tabs baseId={baseId} tabs={GRADE_MATRIX.map((m) => ({ key: m.key, label: t(m.label) }))} value={tab} onChange={setTab} label={ui("gradeGuide")} />
        {GRADE_MATRIX.map((matrix) => (
          <TabPanel key={matrix.key} baseId={baseId} tabKey={matrix.key} active={tab === matrix.key} className="pt-3">
            <ul className="divide-y divide-line">
              {matrix.rows.map((row) => (
                <li key={row.grade} className="flex items-start gap-3 py-2.5">
                  <GradeChip grade={row.grade} size="sm" className="mt-0.5 min-w-8 justify-center" />
                  <p className="flex-1 text-[13px] text-fg-2">{t(row.text)}</p>
                  {row.works === true ? <Check aria-hidden="true" className="size-4 shrink-0 text-success" /> : row.works === false ? <X aria-hidden="true" className="size-4 shrink-0 text-danger" /> : <Minus aria-hidden="true" className="size-4 shrink-0 text-fg-3" />}
                </li>
              ))}
            </ul>
          </TabPanel>
        ))}
      </div>
    </Modal>
  );
}
