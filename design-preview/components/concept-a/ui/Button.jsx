import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-secondary text-on-secondary hover:bg-primary hover:text-on-primary active:translate-y-px disabled:bg-surface-2 disabled:text-fg-3",
  outline:
    "border border-fg/80 text-fg hover:bg-fg hover:text-bg active:translate-y-px disabled:border-line disabled:text-fg-3 disabled:bg-transparent",
  quiet: "border border-line bg-surface text-fg hover:border-fg active:translate-y-px disabled:text-fg-3",
  ghost: "text-fg hover:bg-surface-2 disabled:text-fg-3",
  stage: "bg-[var(--stage-fg)] text-[var(--stage)] hover:bg-white active:translate-y-px disabled:opacity-50",
  brass: "bg-accent text-on-accent hover:brightness-105 active:translate-y-px disabled:opacity-50",
};

const FORCED = {
  hover: {
    primary: "!bg-primary !text-on-primary",
    outline: "!bg-fg !text-bg",
    quiet: "!border-fg",
    ghost: "!bg-surface-2",
    stage: "!bg-white",
    brass: "brightness-105",
  },
  active: { primary: "translate-y-px !bg-primary", outline: "translate-y-px !bg-fg !text-bg", quiet: "translate-y-px", ghost: "!bg-surface-2", stage: "translate-y-px", brass: "translate-y-px" },
  focus: { all: "outline-2 outline-offset-2 outline-focus outline" },
};

const SIZES = {
  sm: "h-9 px-4 text-[11px] rtl:text-[13px]",
  md: "h-11 px-6 text-[12px] rtl:text-sm",
  lg: "h-[52px] px-8 text-[13px] rtl:text-[15px]",
};

/** Concept A button: rectangular, small-caps label in English, calm hover. */
export function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  forceState,
  children,
  type,
  ...props
}) {
  const forced = forceState ? FORCED[forceState]?.[variant] || FORCED[forceState]?.all || "" : "";
  return (
    <Tag
      type={Tag === "button" ? type || "button" : type}
      className={`inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-control font-semibold uppercase tracking-[0.14em] transition-[background-color,color,border-color,transform,filter] duration-200 rtl:normal-case rtl:tracking-normal disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${forced} ${className}`}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
      {children}
    </Tag>
  );
}

export function IconButton({ label, className = "", children, pressed, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={`inline-grid size-11 shrink-0 place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
