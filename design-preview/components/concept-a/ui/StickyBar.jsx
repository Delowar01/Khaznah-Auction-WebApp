"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Hides while the observed element is on screen; shows otherwise (mobile/tablet only). */
export function useOffscreen(ref) {
  const [off, setOff] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setOff(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return off;
}

export function StickyBar({ show, children }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-raised backdrop-blur lg:hidden"
        >
          <div className="mx-auto flex max-w-2xl items-center gap-4">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
