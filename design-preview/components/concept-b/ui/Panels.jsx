"use client";

import { useId } from "react";
import { X } from "lucide-react";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Modal } from "@/components/shared/ui/Modal";
import { useLang } from "@/components/shared/providers/LangProvider";
import { IconButton } from "./Button";
import { cx } from "./cx";

function PanelHeader({ titleId, title, subtitle, onClose, start }) {
  const { ui } = useLang();
  return (
    <div className="flex min-h-14 shrink-0 items-center gap-3 border-b border-line px-4 py-2">
      {start}
      <div className="min-w-0 flex-1">
        <h2 id={titleId} className="truncate kb-lg font-bold text-fg">
          {title}
        </h2>
        {subtitle ? <p className="kb-xs text-fg-3">{subtitle}</p> : null}
      </div>
      <IconButton icon={X} label={ui("close")} onClick={onClose} className="-me-2" />
    </div>
  );
}

/** Side drawer (start or end) with a titled header, scrolling body and footer. */
export function SidePanel({ open, onClose, title, subtitle, side = "end", footer, testId, headerStart, children }) {
  const titleId = useId();
  return (
    <Drawer open={open} onClose={onClose} side={side} labelledBy={titleId} panelClassName="bg-surface shadow-overlay">
      <div data-testid={testId} className="flex h-full min-h-0 flex-col">
        <PanelHeader titleId={titleId} title={title} subtitle={subtitle} onClose={onClose} start={headerStart} />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer ? <div className="shrink-0 border-t border-line bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div> : null}
      </div>
    </Drawer>
  );
}

/** Bottom sheet with a grab handle — mobile filters, sort, account. */
export function SheetPanel({ open, onClose, title, subtitle, footer, testId, children }) {
  const titleId = useId();
  return (
    <Drawer open={open} onClose={onClose} side="bottom" labelledBy={titleId} panelClassName="rounded-t-2xl bg-surface shadow-overlay">
      <div data-testid={testId} className="flex max-h-[88dvh] min-h-0 flex-col">
        <span aria-hidden="true" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line-strong" />
        <PanelHeader titleId={titleId} title={title} subtitle={subtitle} onClose={onClose} />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer ? <div className="shrink-0 border-t border-line bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div> : null}
      </div>
    </Drawer>
  );
}

/** Dialog that becomes a bottom sheet on phones. */
export function DialogPanel({ open, onClose, title, description, footer, size = "md", testId, children, className = "" }) {
  const titleId = useId();
  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="sheet"
      labelledBy={titleId}
      description={description}
      panelClassName={cx(
        "rounded-t-2xl border border-line bg-elevated shadow-overlay md:rounded-2xl",
        size === "lg" && "md:max-w-2xl!",
        size === "xl" && "md:max-w-4xl!",
        className,
      )}
    >
      <div data-testid={testId}>
        <PanelHeader titleId={titleId} title={title} onClose={onClose} />
        <div className="p-5">{children}</div>
        {footer ? <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div> : null}
      </div>
    </Modal>
  );
}
