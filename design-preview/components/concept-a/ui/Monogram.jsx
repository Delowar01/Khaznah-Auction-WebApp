/** Seller monogram avatar (seller brand colour, serif initials). */
export function Monogram({ seller, size = 48, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`a-serif inline-grid shrink-0 place-items-center rounded-full text-white ${className}`}
      style={{ width: size, height: size, background: `color-mix(in oklab, ${seller.tone} 84%, black)`, fontSize: size * 0.38 }}
    >
      {seller.monogram}
    </span>
  );
}
