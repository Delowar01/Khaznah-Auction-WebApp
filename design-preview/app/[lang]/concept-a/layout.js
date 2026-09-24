import "@/styles/concept-a.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";
import { Chrome } from "@/components/concept-a/Chrome";

export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="a" defaultTheme="light">
      <Chrome>{children}</Chrome>
    </ConceptShell>
  );
}
