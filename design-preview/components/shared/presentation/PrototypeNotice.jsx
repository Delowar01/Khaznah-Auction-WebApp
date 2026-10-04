"use client";

import { usePathname } from "next/navigation";
import { CONCEPT_BY_ID } from "@/data/concepts";
import { parsePath } from "@/lib/routes";
import { fill, tr } from "@/lib/i18n";

const T = {
  label: { en: "About this screen", ar: "عن هذه الشاشة" },
  tag: { en: "Earlier prototype", ar: "نموذج أولي سابق" },
  text: {
    en: "Not part of the final concept review. Option {id}’s new design covers the Home, Browse, Auction, Live auction and Product pages; this screen is from an earlier round and has not been redesigned.",
    ar: "ليست جزءاً من المراجعة النهائية للمفاهيم. يغطي التصميم الجديد للخيار {id} الصفحة الرئيسية وصفحة التصفّح وصفحة المزاد وصفحة المزاد المباشر وصفحة المنتج، أما هذه الشاشة فمن جولة سابقة ولم يُعَد تصميمها.",
  },
  // Phones: the same point in one short line.
  short: {
    en: "Not part of this review: Option {id}’s new design covers Home, Browse, Auction, Live auction and Product.",
    ar: "خارج هذه المراجعة: يغطي التصميم الجديد للخيار {id} الرئيسية والتصفّح والمزاد والمزاد المباشر والمنتج.",
  },
};

/**
 * Presentation note above the screens that are not part of the client review
 * (Seller, Components & states) in every option, so they are not mistaken for
 * parts of the new approved designs. It belongs to the preview, not to the
 * design, and stays visible when the presentation bar is hidden and inside
 * the device preview.
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
