import { HomePage } from "@/components/concept-b/pages/HomePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("b", "home", lang);
}

export default function Page() {
  return <HomePage />;
}
