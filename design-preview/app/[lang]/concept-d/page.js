import { HomePage } from "@/components/concept-d/pages/HomePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "home", lang);
}

export default function Page() {
  return <HomePage />;
}
