"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronsUp, Monitor, Moon, SlidersHorizontal, Smartphone, Sun, Tablet } from "lucide-react";
import { CONCEPTS } from "@/data/concepts";
import { PAGES, pageKeyOf, parsePath, withConcept, withLang } from "@/lib/routes";
import { tr } from "@/lib/i18n";
import { useDismiss } from "@/components/shared/ui/hooks";

const LABELS = {
  concepts: { en: "Concepts", ar: "المفاهيم" },
  backToConcepts: { en: "Back to concepts", ar: "العودة إلى المفاهيم" },
  switchConcept: { en: "Switch concept", ar: "تبديل المفهوم" },
  page: { en: "Page", ar: "الصفحة" },
  desktop: { en: "Desktop", ar: "سطح المكتب" },
  tablet: { en: "Tablet", ar: "جهاز لوحي" },
  mobile: { en: "Mobile", ar: "جوال" },
  theme: { en: "Toggle light or dark appearance", ar: "تبديل المظهر الفاتح أو الداكن" },
  hide: { en: "Hide presentation controls", ar: "إخفاء أدوات العرض" },
  hideShort: { en: "Hide controls", ar: "إخفاء الأدوات" },
  hideHint: { en: "Bring them back with the side tab or the . key", ar: "أعدها عبر اللسان الجانبي أو بمفتاح النقطة" },
  show: { en: "Show presentation controls", ar: "إظهار أدوات العرض" },
  pages: { en: "Concept pages", ar: "صفحات المفهوم" },
  preview: { en: "Concept preview", ar: "معاينة المفاهيم" },
  device: { en: "Device", ar: "الجهاز" },
  language: { en: "Language", ar: "اللغة" },
};

// Path plus the live query string. Only call from event handlers or UI that
// renders after an interaction (never during the server render).
const liveUrl = (pathname) => `${pathname}${window.location.search}`;

// Language links render the bare path (identical on server and client) and
// carry the live query string (filters, theme) only at click time.
function switchLanguage(event, router, pathname, lang) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
  event.preventDefault();
  router.push(withLang(liveUrl(pathname), lang));
}

export function toggleTheme(concept) {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem(`kz-theme-${concept}`, next);
  } catch {
    // Storage may be unavailable (private mode); the toggle still works for this page.
  }
}

export function PresentationBar({ concept }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, rest } = parsePath(pathname);
  const active = pageKeyOf(rest);
  const current = CONCEPTS.find((c) => c.id === concept);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useDismiss(menuOpen, () => setMenuOpen(false), menuRef);
  const L = (key) => tr(LABELS[key], lang);

  const setHidden = (hidden) => {
    const root = document.documentElement;
    if (hidden) root.dataset.pbar = "hidden";
    else delete root.dataset.pbar;
    try {
      localStorage.setItem("kz-pbar", hidden ? "hidden" : "shown");
    } catch {
      // ignore
    }
  };

  const openDevice = (device) => {
    router.push(`/${lang}/preview?device=${device}&src=${encodeURIComponent(liveUrl(pathname))}`);
  };

  // Keyboard shortcut for presenters: "." toggles the bar.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "." || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || event.target?.isContentEditable) return;
      setHidden(document.documentElement.dataset.pbar !== "hidden");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div
        className="kz-pbar fixed inset-x-0 top-0 z-[400] flex h-[var(--pbar-h)] items-center gap-1 border-b border-[var(--pbar-line)] bg-[var(--pbar-bg)] px-2 text-[13px] text-[var(--pbar-fg)] sm:gap-2 sm:px-3"
        style={{ fontFamily: "var(--font-brand-latin), var(--font-brand-arabic), system-ui, sans-serif" }}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <Link
          href={`/${lang}`}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 font-medium text-[var(--pbar-fg)] hover:bg-white/10"
          aria-label={L("backToConcepts")}
        >
          <ArrowLeft aria-hidden="true" className="flip-rtl size-4" />
          <span className="hidden md:inline">{L("concepts")}</span>
        </Link>

        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-white/12" />

        <div ref={menuRef} className="relative min-w-0 shrink">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label={`${L("switchConcept")}: ${current ? tr(current.name, lang) : ""}`}
            className="flex h-9 min-w-0 items-center gap-2 rounded-md px-2 hover:bg-white/10"
          >
            <span className="grid size-5 shrink-0 place-items-center rounded bg-[#D8A535] text-[11px] font-bold text-[#141006]">{current?.letter}</span>
            <span className="hidden min-w-0 flex-col items-start text-start sm:flex">
              <span className="text-[10px] font-semibold uppercase leading-none tracking-[0.12em] text-[var(--pbar-muted)] rtl:text-[11px] rtl:normal-case rtl:tracking-normal">{L("preview")}</span>
              <span className="mt-0.5 max-w-[16rem] truncate font-medium leading-[1.2]">{current ? tr(current.name, lang) : ""}</span>
            </span>
            <ChevronDown aria-hidden="true" className="size-3.5 shrink-0 opacity-70" />
          </button>
          {menuOpen ? (
            <div role="menu" className="kz-fade-up absolute start-0 top-[calc(100%+8px)] w-72 overflow-hidden rounded-xl border border-white/10 bg-[#12151d] p-1.5 shadow-2xl">
              {CONCEPTS.map((c) => (
                <Link
                  key={c.id}
                  role="menuitem"
                  href={withConcept(liveUrl(pathname), c.id)}
                  onClick={() => setMenuOpen(false)}
                  aria-current={c.id === concept ? "true" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-white/8 ${c.id === concept ? "bg-white/10" : ""}`}
                >
                  <span className={`grid size-7 shrink-0 place-items-center rounded-md text-xs font-bold ${c.id === concept ? "bg-[#D8A535] text-[#141006]" : "bg-white/10 text-white"}`}>{c.letter}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-white">{tr(c.name, lang)}</span>
                    <span className="flex gap-1 pt-1">
                      {c.swatches.map((s) => (
                        <span key={s} className="h-1.5 w-5 rounded-full ring-1 ring-white/15" style={{ background: s }} />
                      ))}
                    </span>
                  </span>
                </Link>
              ))}
              <div aria-hidden="true" className="mx-1 my-1.5 h-px bg-white/10" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setHidden(true);
                }}
                className="flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-start hover:bg-white/8"
              >
                <ChevronsUp aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--pbar-muted)]" />
                <span className="min-w-0">
                  <span className="block font-medium text-white">{L("hide")}</span>
                  <span className="block pt-0.5 text-xs text-[var(--pbar-muted)]">{L("hideHint")}</span>
                </span>
              </button>
            </div>
          ) : null}
        </div>

        <nav aria-label={L("pages")} className="mx-auto hidden items-center gap-0.5 xl:flex">
          {PAGES.map((page) => {
            const isActive = page.key === active;
            return (
              <Link
                key={page.key}
                href={`/${lang}/concept-${concept}${page.path}`}
                aria-current={isActive ? "page" : undefined}
                className={`whitespace-nowrap rounded-md px-2.5 py-1.5 font-medium transition-colors ${isActive ? "bg-white text-[#0b0d12]" : "text-[var(--pbar-muted)] hover:bg-white/10 hover:text-white"}`}
              >
                {tr(page.label, lang)}
              </Link>
            );
          })}
        </nav>

        <label className="relative mx-auto flex min-w-0 shrink items-center xl:hidden">
          <span className="sr-only">{L("page")}</span>
          <select
            value={active}
            onChange={(e) => {
              const page = PAGES.find((p) => p.key === e.target.value);
              router.push(`/${lang}/concept-${concept}${page.path}`);
            }}
            className="h-8 w-full min-w-0 max-w-[15rem] appearance-none truncate rounded-md border border-white/12 bg-white/5 pe-7 ps-2.5 font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-[#D8A535]"
          >
            {PAGES.map((page) => (
              <option key={page.key} value={page.key} className="bg-[#12151d]">
                {tr(page.label, lang)}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute end-2 size-3.5 opacity-70" />
        </label>

        <div className="hidden shrink-0 items-center rounded-md border border-white/10 p-0.5 md:flex" role="group" aria-label={L("device")}>
          <button type="button" aria-pressed="true" title={L("desktop")} aria-label={L("desktop")} className="grid size-7 place-items-center rounded bg-white/15 text-white">
            <Monitor aria-hidden="true" className="size-4" />
          </button>
          <button type="button" aria-pressed="false" title={L("tablet")} aria-label={L("tablet")} onClick={() => openDevice("tablet")} className="grid size-7 place-items-center rounded text-[var(--pbar-muted)] hover:bg-white/10 hover:text-white">
            <Tablet aria-hidden="true" className="size-4" />
          </button>
          <button type="button" aria-pressed="false" title={L("mobile")} aria-label={L("mobile")} onClick={() => openDevice("mobile")} className="grid size-7 place-items-center rounded text-[var(--pbar-muted)] hover:bg-white/10 hover:text-white">
            <Smartphone aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="flex shrink-0 items-center rounded-md border border-white/10 p-0.5" role="group" aria-label={L("language")}>
          <Link
            href={withLang(pathname, "en")}
            onClick={(event) => switchLanguage(event, router, pathname, "en")}
            hrefLang="en"
            aria-current={lang === "en" ? "true" : undefined}
            className={`grid h-7 min-w-8 place-items-center rounded px-1.5 text-xs font-semibold ${lang === "en" ? "bg-white/15 text-white" : "text-[var(--pbar-muted)] hover:text-white"}`}
          >
            EN
          </Link>
          <Link
            href={withLang(pathname, "ar")}
            onClick={(event) => switchLanguage(event, router, pathname, "ar")}
            hrefLang="ar"
            lang="ar"
            aria-current={lang === "ar" ? "true" : undefined}
            className={`grid h-7 min-w-8 place-items-center rounded px-1.5 text-xs font-semibold ${lang === "ar" ? "bg-white/15 text-white" : "text-[var(--pbar-muted)] hover:text-white"}`}
          >
            <span className="hidden sm:inline">العربية</span>
            <span className="sm:hidden">عربي</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => toggleTheme(concept)}
          aria-label={L("theme")}
          title={L("theme")}
          className="grid size-8 shrink-0 place-items-center rounded-md text-[var(--pbar-muted)] hover:bg-white/10 hover:text-white"
        >
          <Sun aria-hidden="true" className="kz-theme-sun size-4" />
          <Moon aria-hidden="true" className="kz-theme-moon size-4" />
        </button>

        <button
          type="button"
          onClick={() => setHidden(true)}
          aria-label={L("hide")}
          title={`${L("hide")} ( . )`}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-[var(--pbar-muted)] hover:bg-white/10 hover:text-white"
        >
          <ChevronsUp aria-hidden="true" className="size-4" />
          <span className="hidden font-medium 2xl:inline">{L("hideShort")}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setHidden(false)}
        aria-label={L("show")}
        title={`${L("show")} ( . )`}
        className="kz-pbar-show fixed end-0 top-1/2 z-[400] hidden h-12 w-7 -translate-y-1/2 place-items-center rounded-s-lg bg-[#0b0d12]/85 text-white shadow-lg ring-1 ring-white/15 backdrop-blur transition-[width,background-color] hover:w-9 hover:bg-[#0b0d12] focus-visible:w-9"
      >
        <SlidersHorizontal aria-hidden="true" className="size-4" />
      </button>
    </>
  );
}
