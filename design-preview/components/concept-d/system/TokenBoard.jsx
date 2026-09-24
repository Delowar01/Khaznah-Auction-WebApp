"use client";

import { useSyncExternalStore } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getGrade } from "@/data/grades";
import { useCopy } from "../lib/useCopy";

const GROUPS = [
  { key: "grpSurfaces", tokens: [["--bg", "tkPage"], ["--surface", "tkSurface"], ["--surface-2", "tkRaised"], ["--surface-elevated", "tkElevated"], ["--plate", "tkPlate"], ["--border-strong", "tkLineStrong"]] },
  { key: "grpText", tokens: [["--text-primary", "tkText"], ["--text-secondary", "tkText2"], ["--text-tertiary", "tkText3"]] },
  { key: "grpBrand", tokens: [["--primary", "tkIndigo"], ["--d-ink", "tkInk"], ["--accent", "tkGold"], ["--auction", "tkGoldInk"]] },
  { key: "grpStatus", tokens: [["--live", "tkLive"], ["--success", "tkSuccess"], ["--warning", "tkWarning"], ["--danger", "tkDanger"]] },
  { key: "grpGrades", grades: true, tokens: [["--grade-new", "new"], ["--grade-a", "A"], ["--grade-b", "B"], ["--grade-c", "C"], ["--grade-d", "D"], ["--grade-r", "R"], ["--grade-f", "F"]] },
];
const ALL = GROUPS.flatMap((g) => g.tokens.map(([name]) => name));

// Reads each scope's resolved token values once the swatches are on screen.
function subscribe(callback) {
  const id = window.setTimeout(callback, 0);
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    window.clearTimeout(id);
    observer.disconnect();
  };
}

function readValues() {
  const out = {};
  for (const scope of ["dark", "light"]) {
    const el = document.querySelector(`[data-token-scope="${scope}"]`);
    if (!el) return "";
    const style = getComputedStyle(el);
    out[scope] = ALL.map((name) => style.getPropertyValue(name).trim());
  }
  return JSON.stringify(out);
}

function Palette({ scope, title, values }) {
  const c = useCopy();
  const { t } = useLang();
  return (
    <div data-token-scope={scope} className={`${scope === "dark" ? "d-scope-dark" : "d-scope-light"} rounded-card border border-line bg-bg p-5 text-fg`}>
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-4 space-y-5">
        {GROUPS.map((group) => (
          <div key={group.key}>
            <p className="d-label mb-2 text-fg-3">{c(group.key)}</p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {group.tokens.map(([name, label]) => (
                <li key={name} className="flex items-center gap-2.5 rounded-lg border border-line bg-surface p-2">
                  <span aria-hidden="true" className="size-8 shrink-0 rounded-md ring-1 ring-inset ring-line-strong" style={{ background: `var(${name})` }} />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-fg">{group.grades ? t(getGrade(label).label) : c(label)}</span>
                    <span className="d-num block truncate text-[10.5px] uppercase text-fg-3" dir="ltr">
                      {values ? values[ALL.indexOf(name)] : "…"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Both palettes side by side, resolved from the live tokens. */
export function TokenBoard() {
  const c = useCopy();
  const snapshot = useSyncExternalStore(subscribe, readValues, () => "");
  const values = snapshot ? JSON.parse(snapshot) : null;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Palette scope="dark" title={c("sysDark")} values={values?.dark} />
      <Palette scope="light" title={c("sysLight")} values={values?.light} />
    </div>
  );
}
