"use client";

import { useId, useRef, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { cx } from "./cx";

/**
 * Accessible tabs (tablist / tab / tabpanel) with roving focus. Arrow keys
 * follow the reading direction, Home/End jump to the ends.
 */
export function Tabs({ tabs, label, defaultTab, className = "", listClassName = "", panelClassName = "", onChange }) {
  const [selected, setSelected] = useState(defaultTab || tabs[0]?.id);
  const { isRTL } = useLang();
  const id = useId();
  const refs = useRef({});

  const select = (tabId, focus = false) => {
    setSelected(tabId);
    onChange?.(tabId);
    if (focus) refs.current[tabId]?.focus();
  };

  const onKeyDown = (event, index) => {
    const step = { ArrowRight: isRTL ? -1 : 1, ArrowLeft: isRTL ? 1 : -1 }[event.key];
    let next = null;
    if (step) next = (index + step + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next == null) return;
    event.preventDefault();
    select(tabs[next].id, true);
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className={cx("no-scrollbar flex gap-1 overflow-x-auto border-b border-line", listClassName)}>
        {tabs.map((tab, index) => {
          const active = tab.id === selected;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                refs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${tab.id}`}
              aria-selected={active}
              aria-controls={`${id}-panel-${tab.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cx(
                "relative flex h-12 shrink-0 items-center gap-2 whitespace-nowrap px-3 kb-md font-semibold transition-colors",
                "after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:transition-colors",
                active ? "text-fg after:bg-primary" : "text-fg-3 hover:text-fg after:bg-transparent",
              )}
            >
              {tab.label}
              {tab.count != null ? (
                <span className={cx("rounded-full px-1.5 kb-2xs font-bold tabular", active ? "bg-primary/10 text-primary" : "bg-surface-2 text-fg-3")}>
                  {tab.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${id}-panel-${tab.id}`}
          aria-labelledby={`${id}-tab-${tab.id}`}
          hidden={tab.id !== selected}
          tabIndex={0}
          className={cx("outline-offset-4", panelClassName)}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
