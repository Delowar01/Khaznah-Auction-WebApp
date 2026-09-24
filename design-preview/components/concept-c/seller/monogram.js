/**
 * Background for a seller monogram: the seller's own tone, deepened slightly
 * so white letters keep AA contrast even on the lighter tones.
 */
export function monogramBg(tone) {
  return `color-mix(in oklab, ${tone} 82%, black)`;
}
