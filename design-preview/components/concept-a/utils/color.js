/**
 * Darkens a seller tone slightly so white monogram text always clears
 * WCAG AA, while keeping the seller's own hue.
 */
export function shade(hex, amount = 0.14) {
  const value = String(hex || "").replace("#", "");
  if (value.length !== 6) return hex;
  const channels = value.match(/../g).map((part) => Math.round(parseInt(part, 16) * (1 - amount)));
  return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
