import { CONCEPT_BY_ID } from "@/data/concepts";
import { PAGES } from "@/lib/routes";
import { tr } from "@/lib/i18n";

/** Localised <title> for a concept page, e.g. "Browse — 2 · Premium Commerce". */
export function conceptMetadata(concept, pageKey, lang, detail) {
  const c = CONCEPT_BY_ID[concept];
  const page = PAGES.find((p) => p.key === pageKey);
  const pageLabel = detail || tr(page?.label, lang);
  return { title: `${pageLabel} — ${c.letter} · ${tr(c.name, lang)}` };
}
