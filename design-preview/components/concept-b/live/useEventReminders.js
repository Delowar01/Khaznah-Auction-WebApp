"use client";

import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { COPY } from "../copy";

/** Local reminder toggles for upcoming live events (with a confirmation toast). */
export function useEventReminders() {
  const { t } = useLang();
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
    if (on) toast({ tone: "success", title: t(COPY.reminderSet), description: t(COPY.reminderText, { title: t(event.title) }) });
  };
  return { isOn: (event) => reminders.has(event.slug), toggle };
}
