"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { useLang } from "@/components/shared/providers/LangProvider";

/**
 * Accessible tabs (tablist/tab/tabpanel) with an animated underline.
 * Arrow keys follow the reading direction; Home/End jump to the ends.
 */
export function Tabs({ baseId, tabs, value, onChange, label, className = "", fill = false }) {
  const { isRTL } = useLang();
  const refs = useRef({});

  const focusTab = (key) => {
    onChange(key);
    refs.current[key]?.focus();
  };

  const onKeyDown = (event) => {
    const index = tabs.findIndex((tab) => tab.key === value);
    const forward = isRTL ? "ArrowLeft" : "ArrowRight";
    const backward = isRTL ? "ArrowRight" : "ArrowLeft";
    if (event.key === forward) focusTab(tabs[(index + 1) % tabs.length].key);
    else if (event.key === backward) focusTab(tabs[(index - 1 + tabs.length) % tabs.length].key);
    else if (event.key === "Home") focusTab(tabs[0].key);
    else if (event.key === "End") focusTab(tabs[tabs.length - 1].key);
    else return;
    event.preventDefault();
  };

  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className={`no-scrollbar relative flex overflow-x-auto border-b border-line ${className}`}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <button
            key={tab.key}
            ref={(node) => {
              refs.current[tab.key] = node;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.key}`}
            aria-selected={active}
            aria-controls={`${baseId}-panel-${tab.key}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.key)}
            className={`relative flex h-12 shrink-0 items-center gap-2 px-3 text-sm font-medium transition-colors sm:px-4 ${fill ? "flex-1 justify-center" : ""} ${active ? "text-fg" : "text-fg-2 hover:text-fg"}`}
          >
            {tab.shortLabel ? (
              <>
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="max-sm:hidden">{tab.label}</span>
              </>
            ) : (
              tab.label
            )}
            {tab.count != null ? <span className="d-num rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] text-fg-3">{tab.count}</span> : null}
            {active ? (
              <motion.span
                layoutId={`tab-${baseId}`}
                className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--d-ink)]"
                transition={{ type: "spring", stiffness: 520, damping: 42 }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ baseId, tabKey, active, className = "", children }) {
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${tabKey}`}
      aria-labelledby={`${baseId}-tab-${tabKey}`}
      hidden={!active}
      tabIndex={0}
      className={`outline-none focus-visible:ring-2 focus-visible:ring-focus/40 ${className}`}
    >
      {active ? children : null}
    </div>
  );
}
