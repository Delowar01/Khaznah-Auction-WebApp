import "@/styles/concept-d.css";
import "@/styles/r3-discovery.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";

// Round 3: the home page renders its own shell (see page.js); the other
// screens keep the Round 2 chrome through the (round2) route group until
// the inner pages are redesigned.
export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="d" defaultTheme="light">
      {children}
    </ConceptShell>
  );
}
