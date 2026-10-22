"use client";

// Option 3 dialogs and side panels, styled like the auction page's dialogs:
// rounded white panels with a blue-grey round close button and pill actions;
// bottom sheets on phones. The shared Modal and Drawer trap focus, close on
// Escape, lock the page and return focus to the control that opened them.
import { useId } from "react";
import { X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Modal } from "@/components/shared/ui/Modal";
import { useMediaQuery } from "@/components/shared/ui/hooks";
import { cx } from "../ui";

function CloseButton({ onClose }) {
  const { ui } = useLang();
  return (
    <button type="button" onClick={onClose} aria-label={ui("close")} className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)] hover:bg-[#dfe7f3]">
      <X aria-hidden="true" className="size-5" strokeWidth={2.2} />
    </button>
  );
}

/**
 * Dialog with a visible title and optional description. `footer` holds the
 * actions (end-aligned, full width on phones). `size` "wide" for forms with
 * two columns.
 */
export function Dialog({ open, onClose, title, description, footer, children, size = "md", testId, initialFocus }) {
  const titleId = useId();
  const descId = useId();
  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="sheet"
      labelledBy={titleId}
      describedBy={description ? descId : undefined}
      initialFocus={initialFocus}
      panelClassName={cx("rounded-t-[24px] bg-white text-[var(--vd-ink)] shadow-overlay md:rounded-[24px]", size === "wide" && "md:max-w-2xl!", size === "sm" && "md:max-w-md!")}
    >
      <div data-testid={testId}>
        <div className="flex items-start justify-between gap-3 px-5 pb-1 pt-5">
          <div className="min-w-0 pt-1.5">
            <h2 id={titleId} className="vd-h3">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-1 vd-sm text-[var(--vd-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          <CloseButton onClose={onClose} />
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? <div className="flex flex-wrap justify-end gap-2 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1 max-sm:[&>*]:flex-1">{footer}</div> : null}
      </div>
    </Modal>
  );
}

/**
 * Side panel (end edge from 768 px, bottom sheet below) for details such as
 * an order: a sticky head with the title and close button, a scrolling body
 * and an optional sticky footer.
 */
export function SidePanel({ open, onClose, title, kicker, footer, children, testId, width = "md" }) {
  const titleId = useId();
  const wide = useMediaQuery("(min-width: 768px)", true);
  const side = wide ? "end" : "bottom";
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side={side}
      labelledBy={titleId}
      panelClassName={cx(
        "bg-white font-sans text-[var(--vd-ink)] shadow-overlay",
        side === "bottom" ? "rounded-t-[24px]" : cx("rounded-s-[24px]", width === "lg" ? "md:w-[min(94vw,640px)]!" : "md:w-[min(94vw,520px)]!"),
      )}
    >
      <div data-testid={testId} className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--vd-line)] px-5 py-4">
          <div className="min-w-0">
            {kicker ? <p className="vd-xs font-semibold text-[var(--vd-muted)]">{kicker}</p> : null}
            <h2 id={titleId} className="vd-h3">
              {title}
            </h2>
          </div>
          <CloseButton onClose={onClose} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="flex shrink-0 flex-wrap gap-2 border-t border-[var(--vd-line)] bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div> : null}
      </div>
    </Drawer>
  );
}
