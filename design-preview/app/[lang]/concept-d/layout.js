import "@/styles/concept-d.css";
import "@/styles/r3-saudi-commerce.css";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";

// The home and Browse pages render the approved Contemporary Saudi Commerce
// design with their own shell (see page.js and browse/page.js); the other
// screens keep the Round 2 chrome through the (round2) route group until
// they are redesigned.
export default function ConceptLayout({ children }) {
  return (
    <ConceptShell concept="d" defaultTheme="light">
      {children}
    </ConceptShell>
  );
}
