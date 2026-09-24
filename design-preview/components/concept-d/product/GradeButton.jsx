"use client";

import { useState } from "react";
import { GradeChip } from "../ui/GradeChip";
import { GradeGuideModal } from "./GradeGuideModal";

/** Grade chip that opens the condition grade guide. */
export function GradeButton({ grade }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <GradeChip grade={grade} label onClick={() => setOpen(true)} className="d-hit" />
      <GradeGuideModal open={open} onClose={() => setOpen(false)} highlight={grade} />
    </>
  );
}
