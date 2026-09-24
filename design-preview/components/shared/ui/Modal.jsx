"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useOverlay } from "./useOverlay";

/**
 * Accessible dialog. Visual styling comes from the caller via
 * panelClassName / overlayClassName so each concept keeps its identity.
 * `variant="sheet"` becomes a bottom sheet below the md breakpoint.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  panelClassName = "",
  overlayClassName = "",
  variant = "dialog",
  initialFocus,
  labelledBy,
}) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descId = useId();
  const panelRef = useOverlay(open, onClose, { initialFocus });

  useEffect(() => {
    // Portals need the DOM; render nothing on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const sheet = variant === "sheet";
  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:p-6" key="modal">
          <motion.div
            className={`absolute inset-0 bg-overlay backdrop-blur-[2px] ${overlayClassName}`}
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
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            className={`relative w-full max-h-[92dvh] overflow-y-auto outline-none ${sheet ? "md:max-w-lg" : "max-w-lg"} ${panelClassName}`}
            initial={sheet ? { y: 40, opacity: 0 } : { y: 12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={sheet ? { y: 40, opacity: 0 } : { y: 8, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
          >
            {title ? (
              <h2 id={titleId} className="sr-only">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id={descId} className="sr-only">
                {description}
              </p>
            ) : null}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
