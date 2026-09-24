import "@/styles/concept-d.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";
import { Chrome } from "@/components/concept-d/Chrome";

export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="d" defaultTheme="dark">
      <Chrome>{children}</Chrome>
    </ConceptShell>
  );
}
