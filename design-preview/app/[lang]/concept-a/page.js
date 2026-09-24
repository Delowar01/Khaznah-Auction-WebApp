import { HomePage } from "@/components/concept-a/pages/HomePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("a", "home", lang);
}

export default function Page() {
  return <HomePage />;
}
