"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/components/shared/providers/LangProvider";
import { withLang } from "@/lib/routes";

/** Switches the site language while keeping the current page and query. */
export function LangLink({ className = "" }) {
  const { lang } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const other = lang === "ar" ? "en" : "ar";
  const href = withLang(pathname, other);
  return (
    <a
      href={href}
      hrefLang={other}
      lang={other}
      onClick={(event) => {
        event.preventDefault();
        router.push(`${href}${window.location.search}`);
      }}
      className={className}
    >
      {other === "ar" ? "العربية" : "English"}
    </a>
  );
}
