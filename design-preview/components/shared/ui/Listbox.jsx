"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

/**
 * Accessible single-select dropdown (button + listbox) with keyboard
 * support: ↑/↓/Home/End to move, Enter/Space to pick, Escape to close.
 * Styling is supplied by the caller.
 */
export function Listbox({
  value,
  options,
  onChange,
  label,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  optionClassName = "",
  activeOptionClassName = "",
  renderButton,
  align = "end",
  icon = true,
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();
  const current = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const openMenu = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (index) => {
    onChange?.(options[index].value);
    setOpen(false);
  };

  const onListKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(active);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={label ? `${label}: ${current?.label}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu();
          }
        }}
        className={buttonClassName}
      >
        {renderButton ? renderButton(current, open) : <span>{current?.label}</span>}
        {icon ? <ChevronDown aria-hidden="true" className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} /> : null}
      </button>
      {open ? (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKeyDown}
          className={`absolute top-[calc(100%+6px)] z-50 min-w-full outline-none kz-fade-up ${align === "end" ? "end-0" : "start-0"} ${menuClassName}`}
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between gap-6 whitespace-nowrap ${optionClassName} ${index === active ? activeOptionClassName : ""}`}
              >
                <span>{option.label}</span>
                {selected ? <Check aria-hidden="true" className="size-4 shrink-0" /> : <span className="size-4 shrink-0" />}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
