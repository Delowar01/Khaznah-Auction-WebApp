"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useOverlay } from "./useOverlay";

/**
 * Off-canvas panel. `side` is logical: "start" is the left edge in English
 * and the right edge in Arabic; "bottom" renders a sheet.
 */
export function Drawer({ open, onClose, title, side = "end", children, panelClassName = "", overlayClassName = "", labelledBy }) {
  const [mounted, setMounted] = useState(false);
  const { isRTL } = useLang();
  const titleId = useId();
  const panelRef = useOverlay(open, onClose);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const physicalLeft = (side === "start" && !isRTL) || (side === "end" && isRTL);
  const offscreen =
    side === "bottom" ? { y: "100%" } : { x: physicalLeft ? "-100%" : "100%" };
  const placement =
    side === "bottom"
      ? "inset-x-0 bottom-0 max-h-[88dvh] w-full"
      : `inset-y-0 ${physicalLeft ? "left-0" : "right-0"} h-full w-[min(92vw,400px)]`;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[190]" key="drawer">
          <motion.div
            className={`absolute inset-0 bg-overlay ${overlayClassName}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy || (title ? titleId : undefined)}
            tabIndex={-1}
            className={`absolute flex flex-col overflow-hidden outline-none ${placement} ${panelClassName}`}
            initial={offscreen}
            animate={{ x: 0, y: 0 }}
            exit={offscreen}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            {title ? (
              <h2 id={titleId} className="sr-only">
                {title}
              </h2>
            ) : null}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
