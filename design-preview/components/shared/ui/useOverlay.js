"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let lockCount = 0;

// A native radio group is one Tab stop: its checked radio, or its first radio
// when none is checked. The other radios are skipped when finding the first
// and last stops, so Tab cannot leave a panel that ends with a radio group.
function inTabOrder(el, panel) {
  if (el.type !== "radio" || !el.name) return true;
  const group = [...panel.querySelectorAll(`input[type="radio"][name="${CSS.escape(el.name)}"]`)];
  return el === (group.find((radio) => radio.checked) || group[0]);
}

/**
 * Behaviour shared by modals, drawers and sheets:
 * focus moves inside on open, Tab is trapped, Escape closes,
 * page scroll is locked and focus returns to the trigger on close.
 */
export function useOverlay(open, onClose, { initialFocus } = {}) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const panel = panelRef.current;

    const focusFirst = () => {
      if (!panel) return;
      const target =
        (initialFocus && panel.querySelector(initialFocus)) ||
        panel.querySelector("[data-autofocus]") ||
        panel.querySelector(FOCUSABLE) ||
        panel;
      target.focus({ preventScroll: true });
    };
    const frame = window.requestAnimationFrame(focusFirst);

    lockCount += 1;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (lockCount === 1) {
      document.body.style.overflow = "hidden";
      if (scrollbar > 0) document.body.style.paddingInlineEnd = `${scrollbar}px`;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => (el.offsetParent !== null || el === document.activeElement) && inTabOrder(el, panel));
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown, true);
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = "";
        document.body.style.paddingInlineEnd = "";
      }
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [open, initialFocus]);

  return panelRef;
}
