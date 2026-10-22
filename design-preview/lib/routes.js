// Route helpers for the presentation chrome.

export const CONCEPT_IDS = ["a", "b", "c", "d"];

// The five client review pages first, in review order, then the earlier
// prototypes.
export const PAGES = [
  { key: "home", path: "", label: { en: "Home", ar: "الرئيسية" } },
  { key: "browse", path: "/browse", label: { en: "Browse", ar: "التصفّح" } },
  { key: "auction", path: "/auction", label: { en: "Auction", ar: "المزاد" } },
  { key: "live", path: "/live-auction", label: { en: "Live auction", ar: "المزاد المباشر" } },
  { key: "product", path: "/product", label: { en: "Product", ar: "المنتج" } },
  { key: "seller", path: "/seller", label: { en: "Seller", ar: "البائع" } },
  { key: "system", path: "/system", label: { en: "Components & states", ar: "المكونات والحالات" } },
];

/**
 * The client review pages: the new approved design of every option. The
 * other screens are earlier prototypes, not part of the review, and marked as
 * such in the presentation chrome.
 */
export const NEW_DESIGN_PAGES = ["home", "browse", "auction", "live", "product"];

/** Splits /en/concept-a/auction/tv-43 → { lang, concept, rest: "/auction/tv-43" }. */
export function parsePath(pathname = "") {
  const match = pathname.match(/^\/(en|ar)(?:\/concept-([a-d]))?(\/.*)?$/);
  if (!match) return { lang: "en", concept: null, rest: "" };
  return { lang: match[1], concept: match[2] || null, rest: (match[3] || "").replace(/\/$/, "") };
}

/**
 * Option 3 (concept-c) is the selected design and now covers the whole
 * customer website: the five review pages, then every other customer screen
 * of production (inventory A.1), grouped for the presentation bar. `path` is
 * where the bar opens each page.
 */
export const OPTION3_GROUPS = [
  { key: "review", label: { en: "Approved review pages", ar: "صفحات المراجعة المعتمدة" } },
  { key: "shop", label: { en: "Shopping", ar: "التسوّق" } },
  { key: "account", label: { en: "Account", ar: "الحساب" } },
  { key: "auth", label: { en: "Sign in and sign up", ar: "الدخول والتسجيل" } },
  { key: "company", label: { en: "Company and help", ar: "الشركة والمساعدة" } },
  { key: "system", label: { en: "States and system", ar: "الحالات والنظام" } },
];

export const OPTION3_PAGES = [
  { key: "home", path: "", group: "review", label: { en: "Home", ar: "الرئيسية" } },
  { key: "browse", path: "/browse", group: "review", label: { en: "Browse", ar: "التصفّح" } },
  { key: "auction", path: "/auction", group: "review", label: { en: "Auction", ar: "المزاد" } },
  { key: "live", path: "/live-auction", group: "review", label: { en: "Live auction", ar: "المزاد المباشر" } },
  { key: "product", path: "/product", group: "review", label: { en: "Product", ar: "المنتج" } },
  { key: "seller", path: "/seller/REDSEA", group: "shop", label: { en: "Seller storefront", ar: "متجر البائع" } },
  { key: "cart", path: "/cart", group: "shop", label: { en: "Cart", ar: "السلة" } },
  { key: "checkout", path: "/checkout", group: "shop", label: { en: "Checkout", ar: "إتمام الشراء" } },
  { key: "payment", path: "/payment/moyasar/9051", group: "shop", label: { en: "Card payment", ar: "الدفع بالبطاقة" } },
  { key: "paymentResult", path: "/payment/result?payment_record_id=9051", group: "shop", label: { en: "Payment result", ar: "نتيجة الدفع" } },
  { key: "account", path: "/account", group: "account", label: { en: "My account", ar: "حسابي" } },
  { key: "login", path: "/login", group: "auth", label: { en: "Sign in", ar: "تسجيل الدخول" } },
  { key: "register", path: "/register", group: "auth", label: { en: "Create account", ar: "إنشاء حساب" } },
  { key: "sellerRegister", path: "/seller/register", group: "auth", label: { en: "Seller registration", ar: "تسجيل البائعين" } },
  { key: "about", path: "/about", group: "company", label: { en: "About", ar: "من نحن" } },
  { key: "howItWorks", path: "/how-it-works", group: "company", label: { en: "How it works", ar: "كيف تعمل خزنة" } },
  { key: "faq", path: "/faq", group: "company", label: { en: "FAQ", ar: "الأسئلة الشائعة" } },
  { key: "contact", path: "/contact", group: "company", label: { en: "Contact", ar: "تواصل معنا" } },
  { key: "privacy", path: "/privacy", group: "company", label: { en: "Privacy policy", ar: "سياسة الخصوصية" } },
  { key: "terms", path: "/terms", group: "company", label: { en: "Terms and conditions", ar: "الشروط والأحكام" } },
  { key: "system", path: "/system", group: "system", label: { en: "Components & states", ar: "المكونات والحالات" } },
  { key: "notFound", path: "/orders/1", group: "system", label: { en: "Page not found (404)", ar: "الصفحة غير موجودة (404)" } },
];

/** Option 3's page key for a path inside /concept-c (null: not a known page, i.e. the 404). */
export function option3KeyOf(rest) {
  if (!rest) return "home";
  const first = (prefix) => rest === prefix || rest.startsWith(`${prefix}/`) || rest.startsWith(`${prefix}?`);
  if (first("/seller/register")) return "sellerRegister";
  if (first("/payment/result")) return "paymentResult";
  if (first("/payment")) return "payment";
  for (const page of OPTION3_PAGES) {
    if (!page.path || page.key === "seller" || page.key === "notFound") continue;
    if (first(page.path.split("?")[0])) return page.key;
  }
  if (first("/seller")) return "seller";
  if (first("/live")) return "live";
  return null;
}

export function pageKeyOf(rest) {
  if (!rest) return "home";
  if (rest.startsWith("/browse")) return "browse";
  if (rest.startsWith("/product")) return "product";
  if (rest.startsWith("/auction")) return "auction";
  if (rest.startsWith("/live-auction")) return "live";
  if (rest.startsWith("/seller")) return "seller";
  if (rest.startsWith("/system")) return "system";
  return "home";
}

export function withLang(pathname, lang) {
  return pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${lang}`) || `/${lang}`;
}

export function withConcept(pathname, concept) {
  return pathname.replace(/\/concept-[a-d](?=\/|$)/, `/concept-${concept}`);
}
