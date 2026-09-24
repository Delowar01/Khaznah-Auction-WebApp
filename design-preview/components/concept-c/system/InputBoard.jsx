"use client";

import { useId, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { NEWSLETTER } from "@/data/site";
import { GRADES } from "@/data/grades";
import { COPY } from "../copy";
import { OptionRow } from "../browse/FilterOptions";
import { QuantityStepper } from "../ui/QuantityStepper";
import { cx } from "../ui/cx";
import { StateLabel } from "./SystemSection";

function Field({ state, value = "" }) {
  const { t, ui } = useLang();
  const id = useId();
  const error = state === "stError";
  return (
    <div>
      <StateLabel>{t(COPY[state])}</StateLabel>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-fg">
        {ui("email")}
      </label>
      <input
        id={id}
        type="email"
        defaultValue={value}
        placeholder={t(NEWSLETTER.placeholder)}
        disabled={state === "stDisabled"}
        aria-invalid={error || undefined}
        aria-describedby={`${id}-help`}
        className={cx("c-input", state === "stFocused" && "is-focus")}
      />
      <p id={`${id}-help`} className={cx("mt-1.5 flex items-center gap-1.5 text-xs", error ? "font-medium text-danger" : "text-fg-3")}>
        {error ? <TriangleAlert aria-hidden="true" className="size-3.5" /> : null}
        {error ? ui("invalidEmail") : t(COPY.helperText)}
      </p>
    </div>
  );
}

/** Text inputs in each state, plus the diamond checkbox, radio and quantity stepper. */
export function InputBoard() {
  const { t, ui } = useLang();
  const [checks, setChecks] = useState({ a: true, b: false });
  const [radio, setRadio] = useState("6h");
  const [qty, setQty] = useState(2);
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="grid gap-6 rounded-md border border-line bg-surface p-6 sm:grid-cols-2">
        <Field state="stDefault" />
        <Field state="stFocused" value="faisal@company.sa" />
        <Field state="stError" value="faisal@company" />
        <Field state="stDisabled" />
      </div>
      <div className="space-y-5 rounded-md border border-line bg-surface p-6">
        <div>
          <StateLabel>{ui("conditionGrade")}</StateLabel>
          <OptionRow checked={checks.a} onChange={() => setChecks((c) => ({ ...c, a: !c.a }))} label={t(GRADES.A.label)} swatch="var(--grade-a)" count={12} />
          <OptionRow checked={checks.b} onChange={() => setChecks((c) => ({ ...c, b: !c.b }))} label={t(GRADES.B.label)} swatch="var(--grade-b)" count={7} />
        </div>
        <div>
          <StateLabel>{ui("endingWithin")}</StateLabel>
          {["1h", "6h"].map((v) => (
            <OptionRow key={v} type="radio" name="sys-ending" checked={radio === v} onChange={() => setRadio(v)} label={ui(v === "1h" ? "within1h" : "within6h")} />
          ))}
        </div>
        <div>
          <StateLabel>{ui("quantity")}</StateLabel>
          <QuantityStepper value={qty} min={1} max={9} onChange={setQty} />
        </div>
      </div>
    </div>
  );
}
