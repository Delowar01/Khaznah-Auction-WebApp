/** Renders a directional icon that mirrors automatically in RTL. */
export function DirIcon({ icon: Icon, className = "", ...props }) {
  return <Icon aria-hidden="true" className={`flip-rtl ${className}`} {...props} />;
}
