"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useLang } from "@/components/shared/providers/LangProvider";

const ICONS = { success: CheckCircle2, warning: TriangleAlert, danger: TriangleAlert, neutral: Info, info: Info };
const TONE = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  neutral: "text-primary",
  info: "text-primary",
};

/**
 * Live-region toast stack. Colours, radius and type come from the active
 * concept's tokens; `className` lets a concept restyle the card entirely.
 */
export function Toaster({ className = "" }) {
  const { toasts, dismissToast } = useStore();
  const { ui } = useLang();
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[300] flex flex-col items-center gap-2 p-4 md:items-end md:pe-6 md:pb-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.tone] || Info;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
              role="status"
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-line bg-elevated p-3.5 pe-2 text-sm text-fg shadow-overlay ${className}`}
            >
              <Icon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${TONE[toast.tone] || TONE.neutral}`} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug">{toast.title}</p>
                {toast.description ? <p className="mt-0.5 leading-snug text-fg-2">{toast.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="grid size-8 shrink-0 place-items-center rounded-md text-fg-3 hover:bg-surface-2 hover:text-fg"
                aria-label={ui("close")}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
