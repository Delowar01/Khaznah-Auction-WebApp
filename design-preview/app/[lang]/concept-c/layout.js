import "@/styles/concept-c.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";
import { Chrome } from "@/components/concept-c/Chrome";

export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="c" defaultTheme="light">
      <Chrome>{children}</Chrome>
    </ConceptShell>
  );
}
