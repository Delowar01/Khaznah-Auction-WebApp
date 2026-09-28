"use client";

// Behaviour shared by the Round 3 home pages of Options 2–4 (search,
// language, city, cart, saving, newsletter, countdown text). Each option
// keeps its own markup and styling; nothing here decides how anything looks.
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { CATEGORIES } from "@/data/categories";
import { SELLERS } from "@/data/sellers";
import { durationParts } from "@/lib/format";
import { searchProducts } from "@/lib/catalog";

// ── Page state: the open layer (menu, cart, …) and the chosen city ─────────
const HomeStateContext = createContext(null);

export function HomeStateProvider({ children }) {
  const [layer, setLayer] = useState(null);
  const [city, setCity] = useState("riyadh");
  const open = useCallback((name) => setLayer(name), []);
  const close = useCallback(() => setLayer(null), []);
  const value = useMemo(() => ({ layer, open, close, city, setCity }), [layer, open, close, city]);
  return <HomeStateContext.Provider value={value}>{children}</HomeStateContext.Provider>;
}

export function useHomeState() {
  const context = useContext(HomeStateContext);
  if (!context) throw new Error("useHomeState must be used inside <HomeStateProvider>");
  return context;
}

// ── Search ─────────────────────────────────────────────────────────────────
/** Suggestions for a query: up to `limit` lots, matching categories and sellers. */
export function useSearchResults(query, limit = 5) {
  const q = query.trim();
  return useMemo(() => {
    if (!q) return null;
    const needle = q.toLowerCase();
    return {
      lots: searchProducts(q).filter((p) => p.status !== "sold").slice(0, limit),
      categories: CATEGORIES.filter((c) => c.name.en.toLowerCase().includes(needle) || c.name.ar.includes(q)).slice(0, 3),
      sellers: SELLERS.filter((s) => s.name.en.toLowerCase().includes(needle) || s.name.ar.includes(q)).slice(0, 2),
    };
  }, [q, limit]);
}

/** Opens Browse with the search term (and an optional category scope). */
export function useGoSearch() {
  const router = useRouter();
  const { link } = useConcept();
  return useCallback(
    (term, category = "") => {
      const params = new URLSearchParams();
      const value = term.trim();
      if (value) params.set("search", value);
      if (category) params.set("category", category);
      const query = params.toString();
      router.push(link(query ? `/browse?${query}` : "/browse"));
    },
    [router, link],
  );
}

// ── Language ───────────────────────────────────────────────────────────────
/** The same page in the other language. */
export function useOtherLanguageHref() {
  const { lang } = useLang();
  const pathname = usePathname();
  const other = lang === "ar" ? "en" : "ar";
  return { other, href: pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`) };
}

/**
 * "EN | العربية": the current language is plain text, the other one a link.
 * `itemClass(current)` styles each label; `separator` sits between them.
 */
export function LanguageSwitch({ className = "", itemClass = () => "", separator = null, label, onNavigate }) {
  const { lang } = useLang();
  const { other, href } = useOtherLanguageHref();
  const item = (code, text) =>
    code === lang ? (
      <span key={code} lang={code} aria-current="true" className={itemClass(true)}>
        {text}
      </span>
    ) : (
      <Link key={code} href={href} hrefLang={other} lang={other} onClick={onNavigate} className={itemClass(false)}>
        {text}
      </Link>
    );
  return (
    <div role="group" aria-label={label} className={className}>
      {item("en", "EN")}
      {separator}
      {item("ar", "العربية")}
    </div>
  );
}

// ── Cart and saved lots ────────────────────────────────────────────────────
/** Adds one of a product to the demo cart and confirms it. */
export function useCartAdd(title) {
  const { t } = useLang();
  const { addToCart, toast } = useStore();
  return useCallback(
    (product) => {
      addToCart(product.slug, 1);
      toast({ tone: "success", title, description: t(product.title) });
    },
    [addToCart, toast, t, title],
  );
}

/** Save / unsave with the shared watchlist; returns the state and a toggle. */
export function useSaveToggle(product) {
  const { t, ui } = useLang();
  const { isWatched, toggleWatch, toast } = useStore();
  const saved = isWatched(product.slug);
  const toggle = useCallback(() => {
    const now = toggleWatch(product.slug);
    toast({ tone: now ? "success" : "neutral", title: now ? ui("addedToWatchlist") : ui("removedFromWatchlist"), description: t(product.title) });
  }, [product, toggleWatch, toast, ui, t]);
  const label = `${saved ? ui("removeFromWatchlist") : ui("addToWatchlist")}: ${t(product.title)}`;
  return { saved, toggle, label };
}

// ── Newsletter ─────────────────────────────────────────────────────────────
/** Email field state, validation and the success message. */
export function useNewsletterForm(successDescription) {
  const { ui } = useLang();
  const { toast } = useStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError(ui("invalidEmail"));
        return;
      }
      setError("");
      setEmail("");
      toast({ tone: "success", title: ui("subscribed"), description: successDescription });
    },
    [email, toast, ui, successDescription],
  );
  return { email, setEmail, error, onSubmit };
}

// ── Card names ─────────────────────────────────────────────────────────────
/**
 * Compact card name: the catalogue title up to its variant, e.g. "Suede Tote
 * with Chain Strap, Cognac" → "Suede Tote with Chain Strap". The product
 * page keeps the full title.
 */
export const cardTitle = (text) => text.split(/\s*[,،]\s*/u)[0];

// ── Footer and utility links ───────────────────────────────────────────────
const SOON = { en: "Available soon", ar: "متاح قريباً" };

/**
 * Routes ("/…") and same-page anchors ("#…") navigate. A bare "#" marks a
 * page that is not part of this preview: like Option 1's footer, it shows
 * "Available soon" instead of a dead link. `label` names the toast (and the
 * control, when the children are only an icon).
 */
export function SiteLink({ href, label, className = "", children, iconOnly = false }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { toast } = useStore();
  const named = iconOnly ? { "aria-label": label } : {};
  if (href === "#") {
    return (
      <button type="button" {...named} onClick={() => toast({ tone: "info", title: label, description: t(SOON) })} className={`${className} text-start`}>
        {children}
      </button>
    );
  }
  return (
    <Link href={href.startsWith("/") ? link(href) : href} {...named} className={className}>
      {children}
    </Link>
  );
}

// ── Countdown text ─────────────────────────────────────────────────────────
const UNITS = {
  en: { d: "d", h: "h", m: "m", s: "s" },
  ar: { d: "ي", h: "س", m: "د", s: "ث" },
};
const pad = (n) => String(n).padStart(2, "0");

/** "08m 58s" / "2h 05m" / "3d 4h": two units, zero-padded minutes and seconds. */
export function countdownText(totalSeconds, lang = "en") {
  const { days, hours, minutes, seconds } = durationParts(totalSeconds ?? 0);
  const u = UNITS[lang] || UNITS.en;
  const sep = lang === "ar" ? " " : "";
  if (days > 0) return `${days}${sep}${u.d} ${hours}${sep}${u.h}`;
  if (hours > 0) return `${hours}${sep}${u.h} ${pad(minutes)}${sep}${u.m}`;
  return `${pad(minutes)}${sep}${u.m} ${pad(seconds)}${sep}${u.s}`;
}
