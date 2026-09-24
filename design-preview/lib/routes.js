// Route helpers for the presentation chrome.

export const CONCEPT_IDS = ["a", "b", "c", "d"];

export const PAGES = [
  { key: "home", path: "", label: { en: "Home", ar: "الرئيسية" } },
  { key: "browse", path: "/browse", label: { en: "Browse", ar: "التصفّح" } },
  { key: "product", path: "/product", label: { en: "Product", ar: "المنتج" } },
  { key: "auction", path: "/auction", label: { en: "Auction", ar: "المزاد" } },
  { key: "live", path: "/live-auction", label: { en: "Live auction", ar: "المزاد المباشر" } },
  { key: "seller", path: "/seller", label: { en: "Seller", ar: "البائع" } },
  { key: "system", path: "/system", label: { en: "Components & states", ar: "المكونات والحالات" } },
];

/** Splits /en/concept-a/auction/tv-43 → { lang, concept, rest: "/auction/tv-43" }. */
export function parsePath(pathname = "") {
  const match = pathname.match(/^\/(en|ar)(?:\/concept-([a-d]))?(\/.*)?$/);
  if (!match) return { lang: "en", concept: null, rest: "" };
  return { lang: match[1], concept: match[2] || null, rest: (match[3] || "").replace(/\/$/, "") };
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
