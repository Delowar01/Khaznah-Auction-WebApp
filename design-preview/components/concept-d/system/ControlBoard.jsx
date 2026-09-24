"use client";

import { Gavel, Mail, Search, ShoppingCart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Button } from "../ui/Button";
import { TextField } from "../ui/Controls";
import { useCopy } from "../lib/useCopy";

const STATES = [
  { key: "stDefault", props: {} },
  { key: "stHover", props: { forceState: "hover" } },
  { key: "stActive", props: { forceState: "active" } },
  { key: "stFocus", props: { forceState: "focus" } },
  { key: "stDisabled", props: { disabled: true } },
  { key: "stLoading", props: { loading: true } },
];

/** Every button variant across its interactive states. */
export function ButtonBoard() {
  const { ui } = useLang();
  const c = useCopy();
  const variants = [
    { variant: "gold", name: c("vGold"), label: ui("placeBid"), icon: Gavel },
    { variant: "primary", name: c("vPrimary"), label: ui("addToCart"), icon: ShoppingCart },
    { variant: "secondary", name: c("vSecondary"), label: ui("buyNow") },
    { variant: "ghost", name: c("vGhost"), label: ui("viewAll") },
  ];
  return (
    <div className="d-panel relative overflow-x-auto" role="region" aria-label={c("sysButtons")} tabIndex={0}>
      <table className="w-full min-w-[860px] text-start">
        <caption className="sr-only">{c("sysButtons")}</caption>
        <thead>
          <tr>
            <th scope="col" className="w-24 p-4">
              <span className="sr-only">{c("sysButtons")}</span>
            </th>
            {STATES.map((state) => (
              <th key={state.key} scope="col" className="d-label p-4 text-start font-medium text-fg-3">
                {c(state.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((row) => (
            <tr key={row.variant} className="border-t border-line">
              <th scope="row" className="p-4 text-start text-xs font-medium text-fg-2">
                {row.name}
              </th>
              {STATES.map((state) => (
                <td key={state.key} className="p-4">
                  <Button variant={row.variant} size="md" icon={row.icon} tabIndex={-1} {...state.props}>
                    {row.label}
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

/** Text inputs: default, focused, error and disabled. */
export function InputBoard() {
  const { ui } = useLang();
  const c = useCopy();
  const prefix = <Search aria-hidden="true" className="size-4 shrink-0 text-fg-3" />;
  const mail = <Mail aria-hidden="true" className="size-4 shrink-0 text-fg-3" />;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <TextField label={c("stDefault")} placeholder={ui("searchPlaceholder")} prefix={prefix} />
      <TextField label={c("stFocused")} defaultValue={ui("popularSearches")} prefix={prefix} forceState="focus" />
      <TextField label={c("stError")} defaultValue="faisal@" prefix={mail} error={ui("invalidEmail")} />
      <TextField label={c("stDisabled")} placeholder={c("emailPlaceholder")} prefix={mail} disabled />
    </div>
  );
}
