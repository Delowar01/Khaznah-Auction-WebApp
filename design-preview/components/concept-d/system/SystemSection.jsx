/** A titled block on the components board. */
export function SystemSection({ id, index, title, description, children, className = "" }) {
  return (
    <section aria-labelledby={id} className={`scroll-mt-40 border-t border-line py-10 md:py-14 ${className}`}>
      <div className="mb-6 flex items-baseline gap-3">
        <span className="d-num text-xs text-fg-3">{String(index).padStart(2, "0")}</span>
        <div>
          <h2 id={id} className="d-tight text-xl font-semibold text-fg md:text-2xl">
            {title}
          </h2>
          {description ? <p className="mt-1 text-sm text-fg-2">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

/** Caption under a specimen. */
export function Specimen({ label, children, className = "" }) {
  return (
    <figure className={`flex flex-col gap-2.5 ${className}`}>
      <div className="flex min-h-12 flex-wrap items-center gap-3">{children}</div>
      <figcaption className="text-[11.5px] text-fg-3">{label}</figcaption>
    </figure>
  );
}
