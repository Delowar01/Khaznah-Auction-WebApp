import { Eyebrow } from "../ui/Type";

/** A board section: numbered label column and a content column. */
export function SystemSection({ index, title, text, wide = false, children }) {
  return (
    <section className="border-t border-line py-16 lg:py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className={`min-w-0 ${wide ? "lg:col-span-12" : "lg:col-span-3"}`}>
          <div className={wide ? "" : "lg:sticky lg:top-[calc(var(--pbar-h)+110px)]"}>
            <Eyebrow>
              <span dir="ltr">{String(index).padStart(2, "0")}</span>
            </Eyebrow>
            <h2 className="a-display mt-3 text-[34px] text-fg rtl:text-[32px]">{title}</h2>
            {text ? <p className="mt-4 text-sm leading-relaxed text-fg-2 rtl:text-[15px] rtl:leading-7">{text}</p> : null}
          </div>
        </div>
        <div className={`min-w-0 ${wide ? "lg:col-span-12" : "lg:col-span-9"}`}>{children}</div>
      </div>
    </section>
  );
}

/** Small caption above a specimen. */
export function Caption({ children, className = "" }) {
  return <p className={`mb-3 text-[12px] font-medium text-fg-3 rtl:text-[13px] ${className}`}>{children}</p>;
}
