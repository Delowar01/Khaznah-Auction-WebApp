"use client";

import { X } from "lucide-react";
import { Drawer } from "@/components/shared/ui/Drawer";
import { useLang } from "@/components/shared/providers/LangProvider";
import { FilterPanel } from "./FilterPanel";
import { Button } from "../ui/Button";

export function FilterSheet({ open, onClose, browse }) {
  const { ui, pl } = useLang();
  return (
    <Drawer open={open} onClose={onClose} side="bottom" title={ui("filters")} panelClassName="rounded-t-2xl bg-bg text-fg">
      <div data-testid="filter-drawer" className="flex max-h-[88dvh] flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <p className="a-serif text-2xl">{ui("filters")}</p>
          <button type="button" onClick={onClose} aria-label={ui("close")} className="grid size-11 place-items-center rounded-full hover:bg-surface-2">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <FilterPanel browse={browse} />
        </div>
        <div className="flex gap-3 border-t border-line px-5 py-4">
          <Button variant="quiet" className="flex-1" onClick={browse.clearAll}>
            {ui("clearAll")}
          </Button>
          <Button className="flex-[2]" onClick={onClose}>
            {ui("showResults", { n: browse.total })}
          </Button>
        </div>
        <p className="sr-only" aria-live="polite">
          {pl("results", browse.total)}
        </p>
      </div>
    </Drawer>
  );
}
