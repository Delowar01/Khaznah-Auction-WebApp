"use client";

import { AnimatePresence, motion } from "motion/react";

/**
 * Mobile/tablet sticky action bar (< 1024px). Slides in once the page's
 * own primary action has scrolled out of view.
 */
export function StickyBar({ show, children }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="sticky"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 420, damping: 40 }}
          className="d-glass fixed inset-x-0 bottom-0 z-40 border-t border-line-strong pb-[env(safe-area-inset-bottom)] shadow-overlay lg:hidden"
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
