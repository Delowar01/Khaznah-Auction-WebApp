"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { PriceRange } from "@/components/shared/ui/PriceRange";
import { Money } from "@/components/shared/ui/Money";
import { NEWSLETTER } from "@/data/site";
import { QuantityStepper } from "../ui/QuantityStepper";
import { Checkbox } from "../browse/Checkbox";
import { Caption } from "./Section";
import { COPY } from "../copy";

const FIELD = "h-12 w-full rounded-control border bg-surface px-4 text-[15px] text-fg outline-none placeholder:text-fg-3";

function Field({ id, label, state, value }) {
  const { t, ui } = useLang();
  const styles = {
    default: "border-line-strong",
    focused: "border-fg ring-1 ring-fg",
    error: "border-danger ring-1 ring-danger",
    disabled: "border-line bg-surface-2 text-fg-3 cursor-not-allowed",
  };
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[12px] font-medium text-fg-3">
        {label}
      </label>
      <input
        id={id}
        type="email"
        defaultValue={value}
        placeholder={t(NEWSLETTER.placeholder)}
        disabled={state === "disabled"}
        aria-invalid={state === "error" || undefined}
        aria-describedby={state === "error" ? `${id}-error` : undefined}
        className={`${FIELD} ${styles[state]}`}
      />
      {state === "error" ? (
        <p id={`${id}-error`} className="mt-2 text-[13px] font-medium text-danger">
          {ui("invalidEmail")}
        </p>
      ) : null}
    </div>
  );
}

export function InputStates() {
  const { t, ui } = useLang();
  const [qty, setQty] = useState(2);
  const [price, setPrice] = useState([400, 4800]);
  const [checks, setChecks] = useState({ a: true, b: false });
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="sys-default" label={t(COPY.stateDefault)} state="default" />
        <Field id="sys-focused" label={t(COPY.stateFocus)} state="focused" value="faisal@" />
        <Field id="sys-error" label={t(COPY.stateError)} state="error" value="faisal@khazna" />
        <Field id="sys-disabled" label={t(COPY.stateDisabled)} state="disabled" />
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <Caption>{ui("search")}</Caption>
          <label className="relative block">
            <span className="sr-only">{ui("search")}</span>
            <Search aria-hidden="true" className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-fg-3" />
            <input type="search" placeholder={ui("searchPlaceholder")} className={`${FIELD} border-line-strong ps-11 focus:border-fg`} />
          </label>
        </div>
        <div>
          <Caption>{ui("quantity")}</Caption>
          <div className="flex flex-wrap items-center gap-4">
            <QuantityStepper value={qty} onChange={setQty} max={5} />
            <QuantityStepper value={1} onChange={() => {}} locked />
          </div>
        </div>
        <div>
          <Caption>{ui("conditionGrade")}</Caption>
          <Checkbox checked={checks.a} onChange={() => setChecks((c) => ({ ...c, a: !c.a }))} count={9}>
            {ui("grade")} A
          </Checkbox>
          <Checkbox checked={checks.b} onChange={() => setChecks((c) => ({ ...c, b: !c.b }))} count={6}>
            {ui("grade")} B
          </Checkbox>
          <Checkbox checked={false} onChange={() => {}} disabled count={0}>
            {ui("grade")} F
          </Checkbox>
        </div>
        <div>
          <Caption>{ui("priceRange")}</Caption>
          <PriceRange min={0} max={10000} step={50} value={price} onChange={setPrice} fillClassName="!bg-fg" />
          <p className="mt-3 flex justify-between text-[13px] text-fg-2">
            <Money value={price[0]} />
            <Money value={price[1]} />
          </p>
        </div>
      </div>
    </div>
  );
}
