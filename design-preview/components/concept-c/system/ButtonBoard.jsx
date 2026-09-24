"use client";

import { Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { NEWSLETTER } from "@/data/site";
import { COPY } from "../copy";
import { Button } from "../ui/Button";

const STATES = [
  { key: "stDefault", props: {} },
  { key: "stHover", props: { className: "is-hover" } },
  { key: "stActive", props: { className: "is-active" } },
  { key: "stFocus", props: { className: "is-focus" } },
  { key: "stDisabled", props: { disabled: true } },
  { key: "stLoading", props: { loading: true } },
];

/** Every variant in every state (hover, active and focus are shown as fixed states). */
export function ButtonBoard() {
  const { t, ui } = useLang();
  const variants = [
    { key: "primary", label: ui("placeBid"), icon: Gavel },
    { key: "night", label: ui("buyItNow") },
    { key: "gold", label: t(NEWSLETTER.cta) },
    { key: "outline", label: ui("viewAll") },
    { key: "ghost", label: ui("learnMore") },
  ];
  return (
    <div role="region" aria-label={t(COPY.sysButtons)} tabIndex={0} className="overflow-x-auto rounded-md border border-line bg-surface outline-none focus-visible:ring-2 focus-visible:ring-focus">
      <table className="w-full min-w-[56rem] border-collapse">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="px-5 py-3 text-start">
              <span className="sr-only">{t(COPY.sysButtons)}</span>
            </th>
            {STATES.map((s) => (
              <th key={s.key} scope="col" className="c-caps px-3 py-3 text-start font-semibold text-fg-3">
                {t(COPY[s.key])}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <tr key={v.key} className="border-b border-line last:border-b-0">
              <th scope="row" className="px-5 py-4 text-start text-sm font-semibold text-fg">
                {t(COPY.btnVariants[v.key])}
              </th>
              {STATES.map((s) => (
                <td key={s.key} className="px-3 py-4">
                  <Button variant={v.key} size="sm" icon={v.icon} tabIndex={-1} {...s.props}>
                    {s.key === "stLoading" ? ui("loading") : v.label}
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
