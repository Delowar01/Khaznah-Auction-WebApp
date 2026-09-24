export function Skeleton({ className = "", ...props }) {
  return <div aria-hidden="true" className={`kz-skeleton ${className}`} {...props} />;
}
