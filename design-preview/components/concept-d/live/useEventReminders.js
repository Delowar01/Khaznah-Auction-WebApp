"use client";

import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";

/** Local reminder toggles for upcoming live events (with a confirmation toast).
 * Event reminders are a concept idea — production has no reminder notifications. */
export function useEventReminders() {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const [reminders, setReminders] = useState(() => new Set());
  const toggle = (event) => {
    const on = !reminders.has(event.slug);
    setReminders((current) => {
      const next = new Set(current);
      if (on) next.add(event.slug);
      else next.delete(event.slug);
      return next;
    });
    if (on) toast({ tone: "success", title: ui("reminderSet"), description: t(event.title) });
  };
  return { isOn: (event) => reminders.has(event.slug), toggle };
}
