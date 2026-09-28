"use client";

import { usePathname } from "next/navigation";
import { CONCEPT_BY_ID } from "@/data/concepts";
import { parsePath } from "@/lib/routes";
import { fill, tr } from "@/lib/i18n";

const T = {
  label: { en: "About this screen", ar: "عن هذه الشاشة" },
  tag: { en: "Earlier prototype", ar: "نموذج أولي سابق" },
  text: {
    en: "Option {id}’s new approved design covers the home page only so far. This screen is from the previous round and has not been redesigned yet.",
    ar: "يقتصر التصميم الجديد المعتمد للخيار {id} حتى الآن على الصفحة الرئيسية. هذه الشاشة من الجولة السابقة ولم يُعَد تصميمها بعد.",
  },
  // Phones: the same point in one short line.
  short: {
    en: "Only the home page has Option {id}’s new design so far.",
    ar: "الصفحة الرئيسية وحدها تحمل التصميم الجديد للخيار {id} حتى الآن.",
  },
};

/**
 * Presentation note above the screens of Options 2–4 that still come from
 * Round 2, so they are not mistaken for parts of the new approved designs.
 * It belongs to the preview, not to the design, and stays visible when the
 * presentation bar is hidden and inside the device preview.
 */
export function PrototypeNotice({ concept }) {
  const { lang } = parsePath(usePathname());
  const info = CONCEPT_BY_ID[concept];
  return (
    <aside
      aria-label={tr(T.label, lang)}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="border-b border-white/15 bg-[#0b0d12] text-[#e9eaee]"
      style={{ fontFamily: "var(--font-brand-latin), var(--font-brand-arabic), system-ui, sans-serif" }}
    >
      <p className="mx-auto flex max-w-[1440px] items-start gap-2.5 px-4 py-2 text-[13px] leading-[1.45] sm:items-center sm:px-6 sm:py-2.5">
        <span className="shrink-0 rounded bg-[#D8A535] px-1.5 py-0.5 text-[11px] font-bold uppercase leading-4 tracking-[0.08em] text-[#141006] rtl:text-[12px] rtl:normal-case rtl:tracking-normal">
          {tr(T.tag, lang)}
        </span>
        <span className="min-w-0">
          <span className="sm:hidden">{fill(tr(T.short, lang), { id: info.letter })}</span>
          <span className="hidden sm:inline">{fill(tr(T.text, lang), { id: info.letter })}</span>
        </span>
      </p>
    </aside>
  );
}
