"use client";

import { useId } from "react";
import { Drawer } from "@/components/shared/ui/Drawer";
import { useLang } from "@/components/shared/providers/LangProvider";
import { UI } from "@/data/ui";
import { COPY } from "../copy";
import { DRAWER_PANEL, DrawerPanel } from "../layout/DrawerPanel";
import { Button } from "../ui/Button";
import { Diamond } from "../ui/Diamond";
import { SaleTypeTabs } from "./Controls";
import { AvailabilityOptions, CategoryOptions, EndingOptions, GradeOptions, ItemTypeOptions, PriceOptions } from "./FilterOptions";

function Group({ legend, children }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0 last:border-b-0">
      {/* Floated legend lays out like a normal heading inside the fieldset. */}
      <legend className="c-caps float-start mb-3 flex w-full items-center gap-2 text-fg">
        <Diamond size={5} className="text-accent" />
        {legend}
      </legend>
      <div className="clear-both space-y-0.5">{children}</div>
    </fieldset>
  );
}

/** Mobile/tablet filters: a drawer from the inline end with grouped filters. */
export function FilterDrawer({ open, onClose, browse }) {
  const { t, ui } = useLang();
  const titleId = useId();

  const footer = (
    <div className="flex gap-3">
      <Button variant="outline" onClick={browse.clearAll} className="shrink-0">
        {ui("clearAll")}
      </Button>
      <Button variant="primary" block onClick={onClose}>
        {ui("showResults", { n: browse.total })}
      </Button>
    </div>
  );

  return (
    <Drawer open={open} onClose={onClose} side="end" labelledBy={titleId} panelClassName={DRAWER_PANEL}>
      <DrawerPanel testId="filter-drawer" titleId={titleId} title={UI.filters} onClose={onClose} footer={footer}>
        <Group legend={t(COPY.saleType)}>
          <SaleTypeTabs browse={browse} className="w-full" />
        </Group>
        <Group legend={ui("category")}>
          <CategoryOptions browse={browse} />
        </Group>
        <Group legend={ui("conditionGrade")}>
          <GradeOptions browse={browse} />
        </Group>
        <Group legend={ui("itemType")}>
          <ItemTypeOptions browse={browse} />
        </Group>
        <Group legend={ui("priceRange")}>
          <PriceOptions browse={browse} />
        </Group>
        <Group legend={ui("endingWithin")}>
          <EndingOptions browse={browse} name="drawer-ending" />
        </Group>
        <Group legend={ui("availability")}>
          <AvailabilityOptions browse={browse} />
        </Group>
      </DrawerPanel>
    </Drawer>
  );
}
