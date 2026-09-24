"use client";

import { useState } from "react";
import { BadgeCheck, Mail, Percent, Search, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getProduct } from "@/data/products";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { Checkbox, Radio, ToggleChip } from "../ui/Choice";
import { TextField } from "../ui/Field";
import { Segmented } from "../ui/Segmented";
import { Stepper } from "../ui/Stepper";
import { COPY } from "../copy";
import { Panel, Specimen } from "./SystemSection";

const TV = getProduct("tv-43");

/** Text fields in each state plus the selection controls used by browse and checkout. */
export function InputStates() {
  const { t, ui, money } = useLang();
  const [qty, setQty] = useState(2);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("1h");
  const [chip, setChip] = useState(true);
  const [tab, setTab] = useState("auction");

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <Panel className="grid gap-5 sm:grid-cols-2">
        <Specimen label={t(COPY.stDefault)}>
          <TextField label={ui("email")} icon={Mail} placeholder={t(COPY.demoEmail)} hint={t(COPY.helperText)} />
        </Specimen>
        <Specimen label={t(COPY.stFocused)}>
          <TextField label={t(COPY.demoSearch)} icon={Search} defaultValue={t(POPULAR_SEARCHES[2])} forceState="focus" />
        </Specimen>
        <Specimen label={t(COPY.stError)}>
          <TextField label={ui("yourBid")} money defaultValue={String(TV.currentBid)} error={ui("bidTooLow", { amount: money(TV.currentBid + TV.increment) })} />
        </Specimen>
        <Specimen label={t(COPY.stDisabled)}>
          <TextField label={ui("maxBid")} money defaultValue={String(TV.currentBid + TV.increment * 4)} disabled />
        </Specimen>
      </Panel>
      <Panel className="grid gap-5 sm:grid-cols-2">
        <Specimen label={ui("quantity")}>
          <Stepper value={qty} onChange={setQty} min={1} max={6} label={ui("quantity")} />
          <Stepper value={1} onChange={() => {}} locked lockedLabel={t(COPY.quantityLocked)} label={ui("quantity")} />
        </Specimen>
        <Specimen label={ui("filters")}>
          <div>
            <Checkbox checked={checked} onChange={setChecked} count={13}>
              {ui("inStockOnly")}
            </Checkbox>
            <div role="radiogroup" aria-label={ui("endingWithin")}>
              <Radio name="sys-radio" value="1h" checked={radio === "1h"} onChange={setRadio}>
                {ui("within1h")}
              </Radio>
              <Radio name="sys-radio" value="24h" checked={radio === "24h"} onChange={setRadio}>
                {ui("within24h")}
              </Radio>
            </div>
          </div>
        </Specimen>
        <Specimen label={t(COPY.toggles)} className="sm:col-span-2">
          <div className="flex flex-wrap gap-2">
            <ToggleChip icon={Timer} pressed={chip} onClick={() => setChip((v) => !v)}>
              {t(COPY.endingUnderHour)}
            </ToggleChip>
            <ToggleChip icon={Percent} pressed={false} onClick={() => {}}>
              {ui("discounted")}
            </ToggleChip>
            <ToggleChip icon={BadgeCheck} pressed onClick={() => {}}>
              {ui("inStock")}
            </ToggleChip>
          </div>
          <Segmented
            label={t(COPY.saleType)}
            value={tab}
            onChange={setTab}
            options={[
              { value: "all", label: ui("all"), count: 29 },
              { value: "auction", label: ui("auctions"), count: 11 },
              { value: "buy_now", label: ui("buyNow"), count: 18 },
            ]}
          />
        </Specimen>
      </Panel>
    </div>
  );
}
