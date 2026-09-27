import "@/styles/concept-a.css";
import "@/styles/r3-visual.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";

// Round 3: the home page renders its own shell (see page.js); the other
// screens keep the Round 2 chrome through the (round2) route group until
// the inner pages are redesigned.
export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="a" defaultTheme="light">
      {children}
    </ConceptShell>
  );
}
