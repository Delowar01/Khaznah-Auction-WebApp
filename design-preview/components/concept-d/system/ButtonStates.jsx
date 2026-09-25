"use client";

import { Gavel, ShoppingCart, Zap } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Button } from "../ui/Button";
import { COPY } from "../copy";

const VARIANTS = [
  { variant: "primary", copy: COPY.vPrimary, icon: Gavel, label: "placeBid" },
  { variant: "soft", copy: COPY.vSoft, icon: ShoppingCart, label: "addToCart" },
  { variant: "outline", copy: COPY.vOutline, icon: null, label: "share" },
  { variant: "ghost", copy: COPY.vGhost, icon: null, label: "viewAll" },
  { variant: "accent", copy: COPY.vValue, icon: Zap, label: "buyItNow" },
];

const STATES = [
  { key: "default", copy: COPY.stDefault },
  { key: "hover", copy: COPY.stHover },
  { key: "active", copy: COPY.stActive },
  { key: "focus", copy: COPY.stFocus },
  { key: "disabled", copy: COPY.stDisabled },
  { key: "loading", copy: COPY.stLoading },
];

/** Every button variant across every interaction state. */
export function ButtonStates() {
  const { t, ui } = useLang();
  return (
    <div role="region" aria-label={t(COPY.sysButtons)} tabIndex={0} className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[860px] border-collapse">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="w-28 px-5 py-3 text-start kb-eyebrow text-fg-3">
              <span className="sr-only">{t(COPY.sysButtons)}</span>
            </th>
            {STATES.map((state) => (
              <th key={state.key} scope="col" className="px-3 py-3 text-start kb-eyebrow text-fg-3">
                {t(state.copy)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VARIANTS.map((row) => (
            <tr key={row.variant} className="border-b border-line last:border-b-0">
              <th scope="row" className="px-5 py-4 text-start kb-sm font-bold text-fg">
                {t(row.copy)}
              </th>
              {STATES.map((state) => (
                <td key={state.key} className="px-3 py-4">
                  <Button
                    variant={row.variant}
                    size="sm"
                    icon={row.icon}
                    tabIndex={-1}
                    data-state={["hover", "active", "focus"].includes(state.key) ? state.key : undefined}
                    disabled={state.key === "disabled"}
                    loading={state.key === "loading"}
                  >
                    {ui(row.label)}
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
