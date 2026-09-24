import "../globals.css";
import { notFound } from "next/navigation";
import { fontVariables } from "../fonts";
import { LANGS, dirOf, isLang } from "@/lib/i18n";
import { LangProvider } from "@/components/shared/providers/LangProvider";
import { PreviewStore } from "@/components/shared/providers/PreviewStore";
import { MotionRoot } from "@/components/shared/providers/MotionRoot";

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const ar = lang === "ar";
  return {
    title: {
      default: ar ? "خزنة — مفاهيم إعادة تصميم الموقع" : "Khazna — Customer Website Concepts",
      template: ar ? "%s · خزنة" : "%s · Khazna",
    },
    description: ar
      ? "أربعة اتجاهات تصميمية تفاعلية لموقع خزنة للعملاء."
      : "Four interactive design directions for the Khazna customer website.",
    robots: { index: false, follow: false },
    icons: { icon: "/brand/khazna-mark.svg" },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d12",
};

// Runs before first paint: applies the concept's saved light/dark choice,
// embedded-frame mode and the presentation-bar visibility, so nothing flashes.
const PREPAINT = `(function(){var d=document.documentElement;d.dataset.js="1";try{var l=location,m=l.pathname.match(/\\/concept-([a-d])(\\/|$)/),defs={a:"light",b:"light",c:"light",d:"dark"},c=m?m[1]:null,q=new URLSearchParams(l.search),t="light";if(c){d.dataset.concept=c;t=defs[c];var s=localStorage.getItem("kz-theme-"+c);if(s)t=s;var qt=q.get("theme");if(qt==="dark"||qt==="light"){t=qt;localStorage.setItem("kz-theme-"+c,t)}}d.dataset.theme=t;if(q.get("embed")==="1"||window.self!==window.top)d.dataset.embed="1";if(localStorage.getItem("kz-pbar")==="hidden")d.dataset.pbar="hidden"}catch(e){}})();`;

export default async function LocaleLayout({ children, params }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} dir={dirOf(lang)} className={fontVariables} data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT }} />
        <link rel="preload" href="/fonts/riyal-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <LangProvider lang={lang}>
          <PreviewStore>
            <MotionRoot>{children}</MotionRoot>
          </PreviewStore>
        </LangProvider>
      </body>
    </html>
  );
}
