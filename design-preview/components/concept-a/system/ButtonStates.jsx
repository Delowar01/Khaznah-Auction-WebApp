"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Button } from "../ui/Button";
import { COPY } from "../copy";

const VARIANTS = [
  ["primary", COPY.variantPrimary, "placeBid"],
  ["outline", COPY.variantOutline, "buyItNow"],
  ["quiet", COPY.variantQuiet, "remindMe"],
  ["brass", COPY.variantBrass, "bidNow"],
];

const STATES = [
  ["default", COPY.stateDefault],
  ["hover", COPY.stateHover],
  ["active", COPY.stateActive],
  ["focus", COPY.stateFocus],
  ["disabled", COPY.stateDisabled],
  ["loading", COPY.stateLoading],
];

/** Every button variant in every interaction state. */
export function ButtonStates() {
  const { t, ui } = useLang();
  return (
    <div tabIndex={0} role="region" aria-label={t(COPY.sysButtons)} className="overflow-x-auto rounded-card border border-line bg-surface focus-visible:outline-2 focus-visible:outline-focus">
      <table className="w-full min-w-[720px] border-collapse text-start">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="p-4 text-start">
              <span className="sr-only">{t(COPY.sysButtons)}</span>
            </th>
            {STATES.map(([key, label]) => (
              <th key={key} scope="col" className="p-4 text-start text-[12px] font-medium text-fg-3">
                {t(label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VARIANTS.map(([variant, label, sample]) => (
            <tr key={variant} className="border-b border-line last:border-0">
              <th scope="row" className="p-4 text-start text-[13px] font-semibold text-fg">
                {t(label)}
              </th>
              {STATES.map(([state]) => (
                <td key={state} className="p-4">
                  <Button
                    size="sm"
                    variant={variant}
                    forceState={["hover", "active", "focus"].includes(state) ? state : undefined}
                    disabled={state === "disabled" || state === "loading"}
                    loading={state === "loading"}
                    tabIndex={-1}
                  >
                    {ui(sample)}
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
