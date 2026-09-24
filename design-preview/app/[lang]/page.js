import Link from "next/link";
import { CONCEPTS } from "@/data/concepts";
import { tr } from "@/lib/i18n";

export default async function SelectorPage({ params }) {
  const { lang } = await params;
  return (
    <main className="p-10">
      {CONCEPTS.map((c) => (
        <p key={c.id}>
          <Link href={`/${lang}/concept-${c.id}`}>{tr(c.name, lang)}</Link>
        </p>
      ))}
    </main>
  );
}
