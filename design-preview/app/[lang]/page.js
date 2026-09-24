import { ConceptSelector } from "@/components/shared/presentation/ConceptSelector";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: { absolute: lang === "ar" ? "خزنة — مفاهيم إعادة تصميم موقع العملاء" : "Khazna — Customer Website Redesign Concepts" } };
}

export default async function SelectorPage({ params }) {
  const { lang } = await params;
  return <ConceptSelector lang={lang} />;
}
