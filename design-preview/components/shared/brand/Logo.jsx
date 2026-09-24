import { AR, EN, LOGO_SIZE, MARK } from "./logo-paths";

// Official Khazna 2026 logo, traced to vector from the supplied artwork.
// Colours come from CSS custom properties so each concept and theme can use
// the approved colourways:
//   --logo-mark  (the خ mark with its diamond dot, default brand gold)
//   --logo-word  (the Arabic + Latin wordmark, default brand blue)

const box = (b, pad = 0) => `${b[0] - pad} ${b[1] - pad} ${b[2] - b[0] + pad * 2} ${b[3] - b[1] + pad * 2}`;

const WORD_BOX = [Math.min(AR.bbox[0], EN.bbox[0]), AR.bbox[1], Math.max(AR.bbox[2], EN.bbox[2]), EN.bbox[3]];

export function Logo({ variant = "lockup", className = "", title = "Khazna", decorative = false }) {
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title };
  const mark = <path fill="var(--logo-mark, #D8A535)" fillRule="evenodd" d={MARK.d} />;
  const word = (
    <>
      <path fill="var(--logo-word, #3D4D9B)" fillRule="evenodd" d={AR.d} />
      <path fill="var(--logo-word, #3D4D9B)" fillRule="evenodd" d={EN.d} />
    </>
  );

  if (variant === "mark") {
    return (
      <svg viewBox={box(MARK.bbox, 4)} className={className} {...a11y}>
        {mark}
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <svg viewBox={box(WORD_BOX, 4)} className={className} {...a11y}>
        {word}
      </svg>
    );
  }

  if (variant === "wordmark-ar") {
    return (
      <svg viewBox={box(AR.bbox, 4)} className={className} {...a11y}>
        <path fill="var(--logo-word, #3D4D9B)" fillRule="evenodd" d={AR.d} />
      </svg>
    );
  }

  if (variant === "wordmark-en") {
    return (
      <svg viewBox={box(EN.bbox, 4)} className={className} {...a11y}>
        <path fill="var(--logo-word, #3D4D9B)" fillRule="evenodd" d={EN.d} />
      </svg>
    );
  }

  if (variant === "stacked") {
    // Mark above the wordmark, centred — the stacked lockup in the guideline.
    const w = WORD_BOX[2] - WORD_BOX[0];
    const markW = MARK.bbox[2] - MARK.bbox[0];
    const markH = MARK.bbox[3] - MARK.bbox[1];
    const gap = 60;
    const offsetX = (w - markW) / 2 - MARK.bbox[0];
    const wordOffsetY = markH + gap - WORD_BOX[1];
    return (
      <svg viewBox={`0 0 ${w} ${markH + gap + (WORD_BOX[3] - WORD_BOX[1])}`} className={className} {...a11y}>
        <g transform={`translate(${offsetX} ${-MARK.bbox[1]})`}>{mark}</g>
        <g transform={`translate(${-WORD_BOX[0]} ${wordOffsetY})`}>{word}</g>
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${LOGO_SIZE.w} ${LOGO_SIZE.h}`} className={className} {...a11y}>
      {mark}
      {word}
    </svg>
  );
}
