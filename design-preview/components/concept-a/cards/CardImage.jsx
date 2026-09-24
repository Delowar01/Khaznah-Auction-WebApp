import { Img } from "@/components/shared/ui/Img";

/** Packshot on a warm stone plate (white backgrounds melt into the plate). */
export function CardImage({ image, alt, ratio = "aspect-[4/5]", priority = false, sizes, className = "", children }) {
  const scene = image?.kind === "scene";
  return (
    <div className={`relative overflow-hidden rounded-card bg-plate ${ratio} ${className}`}>
      <Img
        image={image}
        alt={alt}
        priority={priority}
        sizes={sizes || "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"}
        className={`absolute inset-0 size-full transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.035] ${scene ? "object-cover" : "a-plate-img object-contain p-[11%]"}`}
      />
      {children}
    </div>
  );
}
