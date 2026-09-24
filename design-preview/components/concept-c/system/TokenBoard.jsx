"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { GRADES, GRADE_ORDER } from "@/data/grades";
import { COPY } from "../copy";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";

const SWATCHES = ["--bg", "--surface", "--surface-2", "--plate", "--border", "--text-primary", "--text-secondary", "--primary", "--secondary", "--accent", "--live", "--success", "--warning", "--danger"];

function Swatch({ token }) {
  const { t } = useLang();
  return (
    <li>
      <span className="block h-16 rounded-sm border border-line" style={{ background: `var(${token})` }} />
      <p className="mt-2 text-sm font-semibold text-fg">{t(COPY.swatchNames[token])}</p>
      {/* Filled from the live stylesheet after mount, so the value shown is always the real token. */}
      <p dir="ltr" data-token={token} className="c-num min-h-4 text-xs text-fg-3 rtl:text-right" />
    </li>
  );
}

function Palette({ scope, title }) {
  const { t } = useLang();
  const panel = useRef(null);

  useEffect(() => {
    const read = () => {
      panel.current?.querySelectorAll("[data-token]").forEach((el) => {
        el.textContent = getComputedStyle(el).getPropertyValue(el.dataset.token).trim().toUpperCase();
      });
    };
    read();
    const frame = requestAnimationFrame(read);
    window.addEventListener("load", read);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", read);
    };
  }, []);

  return (
    <div ref={panel} className={cx(scope, "rounded-md border border-line bg-bg p-5 text-fg sm:p-6")}>
      <p className="flex items-center gap-2 font-semibold">
        <Diamond size={7} className="text-accent" />
        {t(title)}
      </p>
      <ul className="mt-5 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 xl:grid-cols-7">
        {SWATCHES.map((token) => (
          <Swatch key={token} token={token} />
        ))}
      </ul>
      <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
        {GRADE_ORDER.map((key) => (
          <li key={key} className="c-grade" style={{ "--g": `var(--grade-${GRADES[key].tone})` }}>
            <Diamond />
            {t(GRADES[key].short)}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Light ("Limestone") and dark ("Riyadh night") palettes side by side. */
export function TokenBoard() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Palette scope="c-scope-light" title={COPY.sysLight} />
      <Palette scope="c-scope-dark" title={COPY.sysDark} />
    </div>
  );
}
