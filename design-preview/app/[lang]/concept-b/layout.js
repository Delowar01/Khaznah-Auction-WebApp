import "@/styles/concept-b.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";
import { Chrome } from "@/components/concept-b/Chrome";

export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="b" defaultTheme="light">
      <Chrome>{children}</Chrome>
    </ConceptShell>
  );
}
