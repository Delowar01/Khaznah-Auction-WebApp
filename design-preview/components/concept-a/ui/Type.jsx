import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DirIcon } from "@/components/shared/ui/DirIcon";

export function Eyebrow({ children, className = "", as: Tag = "p" }) {
  return <Tag className={`a-eyebrow ${className}`}>{children}</Tag>;
}

/** Editorial section header: eyebrow, serif title, supporting text and an optional link. */
export function SectionHead({ eyebrow, title, text, href, linkLabel, as: Tag = "h2", className = "", align = "split" }) {
  return (
    <div className={`flex flex-col gap-5 ${align === "split" ? "md:flex-row md:items-end md:justify-between" : ""} ${className}`}>
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
        <Tag className="a-display text-[34px] text-fg sm:text-[44px] rtl:text-[34px] rtl:sm:text-[42px]">{title}</Tag>
        {text ? <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-fg-2 rtl:text-base rtl:leading-8">{text}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-fg">
          <span className="a-link">{linkLabel}</span>
          <DirIcon icon={ArrowRight} className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}

export function Hairline({ className = "" }) {
  return <hr className={`border-0 border-t border-line ${className}`} />;
}
