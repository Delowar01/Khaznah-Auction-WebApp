import { cx } from "./cx";

/**
 * The diamond from the dot of the خ mark — a rotated square, never a glyph.
 * variant: solid · outline · live (pulsing) · ring
 */
export function Diamond({ size, variant = "solid", className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "c-dia",
        variant === "outline" && "c-dia--outline",
        variant === "live" && "c-dia--live",
        variant === "ring" && "c-dia--ring",
        className,
      )}
      style={size ? { "--d": `${size}px` } : undefined}
    />
  );
}
