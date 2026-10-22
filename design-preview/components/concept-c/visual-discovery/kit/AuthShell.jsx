"use client";

// The quiet Option 3 shell of the screens production renders without the
// marketplace chrome: sign in, create an account, seller registration
// ((auth) and seller layouts) and the two payment pages (payment layout).
// A white bar with the logo, the language switch and a way back to the
// marketplace; the page; a one-line footer. Sign-in screens add the warm
// furniture photograph beside the form from 1024 px.
import Link from "next/link";
import { Lock } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Logo } from "@/components/shared/brand/Logo";
import { R3Root } from "@/components/shared/r3/R3Root";
import { SiteLink } from "@/components/shared/r3/home";
import { WORK_MEDIA } from "@/components/shared/r3/work-media";
import { Img } from "@/components/shared/ui/Img";
import { COPY } from "../copy";
import { DiscoveryLanguage } from "../Header";
import { Arrow, cx } from "../ui";
import { SkipLink } from "./Page";

const TEXT = {
  back: { en: "Back to the marketplace", ar: "العودة إلى السوق" },
  backShort: { en: "Marketplace", ar: "السوق" },
  secure: { en: "Secure payment", ar: "دفع آمن" },
  photoLine: { en: "Graded stock. Transparent auctions.", ar: "مخزون مصنّف. مزادات شفافة." },
  photoText: { en: "Bid on graded surplus and returned stock from Saudi warehouses — or buy it now at a fixed price.", ar: "زايد على فائض المخزون والمرتجعات المصنّفة من مستودعات سعودية، أو اشترِها فوراً بسعر ثابت." },
};

function TopBar({ secure }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <header className="vd-print-hide border-b border-[var(--vd-line)] bg-white">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-3 px-4 md:px-7 dt:h-[73px] dt:px-16">
        <Link href={link("/")} className="shrink-0 rounded-[8px] outline-offset-4">
          <Logo variant="lockup" title={t(COPY.home)} className="h-9 w-auto md:h-11" />
        </Link>
        {secure ? (
          <span className="ms-2 hidden h-8 items-center gap-1.5 rounded-full bg-[#ddf4e6] px-3 vd-sm font-bold text-[var(--vd-grade-a)] sm:inline-flex">
            <Lock aria-hidden="true" className="size-3.5" strokeWidth={2.4} />
            {t(TEXT.secure)}
          </span>
        ) : null}
        <div className="ms-auto flex items-center gap-2 sm:gap-4">
          <DiscoveryLanguage />
          <span aria-hidden="true" className="hidden h-5 w-px bg-[var(--vd-line)] sm:block" />
          <Link href={link("/")} className="vd-link inline-flex h-10 items-center gap-1.5 vd-md font-semibold text-[var(--vd-indigo)]">
            <Arrow className="size-4 rotate-180" />
            <span className="max-sm:hidden">{t(TEXT.back)}</span>
            <span className="sm:hidden">{t(TEXT.backShort)}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function FooterLine() {
  const { t } = useLang();
  const link = "vd-link vd-sm text-[var(--vd-muted)] hover:text-[var(--vd-indigo)]";
  return (
    <footer className="vd-print-hide border-t border-[var(--vd-line)] bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 md:px-7 dt:px-16">
        <p className="vd-sm text-[var(--vd-muted)]">{t(COPY.copyright)}</p>
        <ul aria-label={t(COPY.legal)} className="flex items-center gap-4">
          <li>
            <SiteLink href="/terms" label={t(COPY.terms)} className={link}>
              {t(COPY.terms)}
            </SiteLink>
          </li>
          <li>
            <SiteLink href="/privacy" label={t(COPY.privacy)} className={link}>
              {t(COPY.privacy)}
            </SiteLink>
          </li>
          <li>
            <SiteLink href="/contact" label={t(COPY.linkContact)} className={link}>
              {t(COPY.linkContact)}
            </SiteLink>
          </li>
        </ul>
      </div>
    </footer>
  );
}

/** The furniture photograph with the brand line, beside sign-in forms from 1024 px. */
function PhotoPanel() {
  const { t } = useLang();
  return (
    <aside aria-hidden="true" className="relative hidden overflow-hidden rounded-[28px] bg-[var(--vd-ivory)] lg:block">
      <Img image={WORK_MEDIA.furnitureScene} alt="" sizes="(min-width: 1200px) 560px, 45vw" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#06213f]/85 via-[#06213f]/45 to-transparent p-8 pt-24 text-white">
        <p className="vd-h2 !text-[30px] !leading-9 text-white">{t(TEXT.photoLine)}</p>
        <p className="mt-2 max-w-md vd-lg text-white/85">{t(TEXT.photoText)}</p>
      </div>
    </aside>
  );
}

/**
 * `variant` "auth": the form card beside the photograph (sign in, sign up);
 * "wide": a single wide column (seller registration); "payment": a narrow
 * centred column with the secure-payment badge.
 */
export function AuthShell({ variant = "auth", children }) {
  const secure = variant === "payment";
  return (
    <R3Root>
      <div className="flex min-h-[calc(100dvh-var(--pbar-h))] flex-col bg-[#f6f8fc] font-sans text-[var(--vd-ink)]">
        <SkipLink />
        <TopBar secure={secure} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {variant === "auth" ? (
            <div className="mx-auto grid w-full max-w-[1240px] gap-8 px-4 py-8 md:px-7 md:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch dt:gap-12 dt:py-14">
              <div className="mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-none">{children}</div>
              <PhotoPanel />
            </div>
          ) : (
            <div className={cx("mx-auto w-full px-4 py-8 md:px-7 md:py-12 dt:py-14", variant === "wide" ? "max-w-[1040px]" : "max-w-[720px]")}>{children}</div>
          )}
        </main>
        <FooterLine />
      </div>
    </R3Root>
  );
}

/** White form card of the auth screens. */
export function AuthCard({ children, className = "" }) {
  return <div className={cx("rounded-[28px] border border-[var(--vd-line)] bg-white p-6 shadow-[0_1px_2px_rgb(7_27_82/0.04),0_24px_48px_-28px_rgb(7_27_82/0.35)] sm:p-8 dt:p-10", className)}>{children}</div>;
}
