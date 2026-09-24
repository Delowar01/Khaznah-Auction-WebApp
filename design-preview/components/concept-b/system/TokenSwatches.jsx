"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

const GROUPS = [
  { key: "surfaces", copy: COPY.sysSurfaces, tokens: ["--bg", "--surface", "--surface-2", "--plate", "--border", "--border-strong"] },
  { key: "text", copy: COPY.sysText, tokens: ["--text-primary", "--text-secondary", "--text-tertiary"] },
  { key: "brand", copy: COPY.sysBrand, tokens: ["--primary", "--primary-hover", "--secondary", "--accent", "--focus"] },
  { key: "status", copy: COPY.sysStatus, tokens: ["--live", "--success", "--warning", "--danger"] },
  { key: "grades", copy: COPY.sysGrades, tokens: ["--grade-new", "--grade-a", "--grade-b", "--grade-c", "--grade-d", "--grade-r", "--grade-f"] },
];

const ALL = GROUPS.flatMap((group) => group.tokens);

/** Reads the resolved token values from a themed panel after mount. */
function useTokenValues(ref) {
  const [values, setValues] = useState({});
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!ref.current) return;
      const style = window.getComputedStyle(ref.current);
      setValues(Object.fromEntries(ALL.map((token) => [token, style.getPropertyValue(token).trim().toUpperCase()])));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [ref]);
  return values;
}

function Palette({ theme }) {
  const { t } = useLang();
  const ref = useRef(null);
  const values = useTokenValues(ref);
  const dark = theme === "dark";
  return (
    <div ref={ref} className={cx(dark ? "kb-force-dark" : "kb-force-light", "rounded-xl border border-line bg-bg p-4 text-fg sm:p-5")}>
      <p className="mb-4 flex items-center gap-2 kb-md font-bold">
        {dark ? <Moon aria-hidden="true" className="size-4" /> : <Sun aria-hidden="true" className="size-4" />}
        {t(dark ? COPY.darkTheme : COPY.lightTheme)}
      </p>
      <div className="grid gap-5">
        {GROUPS.map((group) => (
          <div key={group.key}>
            <p className="mb-2 kb-eyebrow text-fg-3">{t(group.copy)}</p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {group.tokens.map((token) => (
                <li key={token} className="flex items-center gap-2.5 rounded-lg bg-surface p-2 ring-1 ring-line">
                  <span aria-hidden="true" className="size-8 shrink-0 rounded-md ring-1 ring-black/10" style={{ background: `var(${token})` }} />
                  <span className="min-w-0">
                    <span className="block truncate font-mono kb-2xs font-semibold text-fg" dir="ltr">
                      {token.replace("--", "")}
                    </span>
                    <span className="block font-mono kb-2xs text-fg-3" dir="ltr">
                      {values[token] || " "}
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

/** Light and dark palettes side by side, values read live from the stylesheet. */
export function TokenSwatches() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Palette theme="light" />
      <Palette theme="dark" />
    </div>
  );
}
