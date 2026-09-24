"use client";

import { useCallback } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { COPY } from "../copy";

/** Resolves Concept D copy: c("closingBoardTitle"), c("lotsCount", { n }). */
export function useCopy() {
  const { t } = useLang();
  return useCallback((key, vars) => t(COPY[key] ?? key, vars), [t]);
}
