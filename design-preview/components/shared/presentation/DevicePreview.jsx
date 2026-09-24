"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ExternalLink, Monitor, RotateCw, Smartphone, Tablet, X } from "lucide-react";
import { tr } from "@/lib/i18n";
import { parsePath, withLang } from "@/lib/routes";
import { CONCEPT_BY_ID } from "@/data/concepts";

const DEVICES = {
  tablet: { w: 820, h: 1180, radius: 34, bezel: 14, label: { en: "Tablet · 820 × 1180", ar: "جهاز لوحي · 820 × 1180" } },
  mobile: { w: 390, h: 844, radius: 52, bezel: 12, label: { en: "Mobile · 390 × 844", ar: "جوال · 390 × 844" } },
};

const T = {
  concepts: { en: "Concepts", ar: "المفاهيم" },
  backToConcepts: { en: "Back to concepts", ar: "العودة إلى المفاهيم" },
  preview: { en: "Concept preview", ar: "معاينة المفاهيم" },
  device: { en: "Device", ar: "الجهاز" },
  desktop: { en: "Desktop", ar: "سطح المكتب" },
  tablet: { en: "Tablet", ar: "جهاز لوحي" },
  mobile: { en: "Mobile", ar: "جوال" },
  language: { en: "Language", ar: "اللغة" },
  back: { en: "Full screen", ar: "ملء الشاشة" },
  open: { en: "Open in new tab", ar: "فتح في علامة تبويب جديدة" },
  reload: { en: "Reload frame", ar: "إعادة تحميل الإطار" },
  close: { en: "Close device preview", ar: "إغلاق معاينة الجهاز" },
};

function safeSrc(value, lang) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return `/${lang}/concept-a`;
  return value;
}

export function DevicePreview({ lang }) {
  const params = useSearchParams();
  const deviceKey = params.get("device") === "tablet" ? "tablet" : "mobile";
  const device = DEVICES[deviceKey];
  const src = safeSrc(params.get("src"), lang);
  const { concept } = parsePath(src.split("?")[0]);
  const conceptInfo = concept ? CONCEPT_BY_ID[concept] : null;
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const availW = stage.clientWidth - 32;
      const availH = stage.clientHeight - 80; // room for the device label below
      const totalW = device.w + device.bezel * 2;
      const totalH = device.h + device.bezel * 2;
      setScale(Math.min(1, availW / totalW, availH / totalH));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [device]);

  const frameSrc = `${src}${src.includes("?") ? "&" : "?"}embed=1`;
  const deviceHref = (key) => `/${lang}/preview?device=${key}&src=${encodeURIComponent(src)}`;

  return (
    <div className="flex h-dvh flex-col bg-[#0b0d12] text-[#e9eaee]" style={{ fontFamily: "var(--font-brand-latin), var(--font-brand-arabic), system-ui, sans-serif" }}>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/15 px-3 text-[13px] sm:gap-3 sm:px-5">
        <Link href={`/${lang}`} className="flex h-9 shrink-0 items-center gap-2 rounded-md px-2.5 font-medium hover:bg-white/10" aria-label={tr(T.backToConcepts, lang)}>
          <ArrowLeft aria-hidden="true" className="flip-rtl size-4" />
          <span className="hidden md:inline">{tr(T.concepts, lang)}</span>
        </Link>
        <Link href={src} className="flex h-9 shrink-0 items-center gap-2 rounded-md px-2.5 font-medium hover:bg-white/10" aria-label={tr(T.close, lang)}>
          <X aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">{tr(T.back, lang)}</span>
        </Link>
        {conceptInfo ? (
          <p className="hidden min-w-0 truncate text-[#8c909c] lg:block">
            <span className="me-2 rounded bg-[#D8A535] px-1.5 py-0.5 text-[11px] font-bold text-[#141006]">{conceptInfo.letter}</span>
            <span className="sr-only">{tr(T.preview, lang)}: </span>
            {tr(conceptInfo.name, lang)}
          </p>
        ) : null}
        <div className="mx-auto flex shrink-0 items-center rounded-lg border border-white/10 p-0.5" role="group" aria-label={tr(T.device, lang)}>
          <Link href={src} className="grid h-8 w-10 place-items-center rounded-md text-[#8c909c] hover:bg-white/10 hover:text-white" aria-label={tr(T.desktop, lang)}>
            <Monitor aria-hidden="true" className="size-4" />
          </Link>
          <Link href={deviceHref("tablet")} aria-current={deviceKey === "tablet" ? "true" : undefined} className={`grid h-8 w-10 place-items-center rounded-md ${deviceKey === "tablet" ? "bg-white/15 text-white" : "text-[#8c909c] hover:bg-white/10 hover:text-white"}`} aria-label={tr(T.tablet, lang)}>
            <Tablet aria-hidden="true" className="size-4" />
          </Link>
          <Link href={deviceHref("mobile")} aria-current={deviceKey === "mobile" ? "true" : undefined} className={`grid h-8 w-10 place-items-center rounded-md ${deviceKey === "mobile" ? "bg-white/15 text-white" : "text-[#8c909c] hover:bg-white/10 hover:text-white"}`} aria-label={tr(T.mobile, lang)}>
            <Smartphone aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="flex shrink-0 items-center rounded-lg border border-white/10 p-0.5" role="group" aria-label={tr(T.language, lang)}>
          {["en", "ar"].map((l) => (
            <Link
              key={l}
              href={`/${l}/preview?device=${deviceKey}&src=${encodeURIComponent(withLang(src, l))}`}
              aria-current={lang === l ? "true" : undefined}
              lang={l}
              className={`grid h-8 min-w-9 place-items-center rounded-md px-2 text-xs font-semibold ${lang === l ? "bg-white/15 text-white" : "text-[#8c909c] hover:text-white"}`}
            >
              {l === "en" ? "EN" : "العربية"}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={() => frameRef.current?.contentWindow?.location.reload()}
          className="hidden size-9 place-items-center rounded-md text-[#8c909c] hover:bg-white/10 hover:text-white sm:grid"
          aria-label={tr(T.reload, lang)}
          title={tr(T.reload, lang)}
        >
          <RotateCw aria-hidden="true" className="size-4" />
        </button>
        <a href={src} target="_blank" rel="noreferrer" className="hidden size-9 place-items-center rounded-md text-[#8c909c] hover:bg-white/10 hover:text-white sm:grid" aria-label={tr(T.open, lang)} title={tr(T.open, lang)}>
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      </header>

      <div ref={stageRef} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#1a1f33_0%,#0b0d12_70%)] pb-10">
        <div
          className="relative shrink-0 bg-[#1b1d23] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
          style={{
            width: device.w + device.bezel * 2,
            height: device.h + device.bezel * 2,
            borderRadius: device.radius + device.bezel,
            padding: device.bezel,
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          <iframe
            ref={frameRef}
            key={frameSrc}
            src={frameSrc}
            title={tr(device.label, lang)}
            className="block size-full bg-white"
            style={{ width: device.w, height: device.h, borderRadius: device.radius, border: 0 }}
          />
        </div>
        <p className="pointer-events-none absolute bottom-3 start-1/2 -translate-x-1/2 text-xs text-[#8c909c] rtl:translate-x-1/2">{tr(device.label, lang)}</p>
      </div>
    </div>
  );
}
