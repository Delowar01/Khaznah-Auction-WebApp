// Minimal bilingual helpers. Content objects are shaped { en, ar }.
// Routing carries the language (/en/..., /ar/...), so every page is
// statically generated in both languages with the correct <html dir>.

export const LANGS = ["en", "ar"];
export const DEFAULT_LANG = "en";

export function isLang(value) {
  return LANGS.includes(value);
}

export function dirOf(lang) {
  return lang === "ar" ? "rtl" : "ltr";
}

/** Resolve a bilingual value ({en, ar}) or pass a plain string through. */
export function tr(value, lang) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return value[lang] ?? value.en ?? "";
}

/** Replace {name} placeholders. */
export function fill(template, vars = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => (vars[key] ?? `{${key}}`));
}

const pluralRules = {
  en: new Intl.PluralRules("en"),
  ar: new Intl.PluralRules("ar"),
};

/**
 * Plural-aware label. `forms` is { en: {one, other}, ar: {zero, one, two, few, many, other} }
 * where each form may contain {n}. Arabic uses all six CLDR categories.
 */
export function plural(n, forms, lang) {
  const table = forms[lang] || forms.en;
  const category = pluralRules[lang]?.select(n) ?? "other";
  const template = table[category] ?? table.other;
  return fill(template, { n: formatCount(n) });
}

function formatCount(n) {
  return new Intl.NumberFormat("en-US").format(n);
}
