import { VisualHome } from "@/components/concept-a/r3/VisualHome";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("a", "home", lang);
}

export default function Page() {
  return <VisualHome />;
}
