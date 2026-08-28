import { cn } from "@/lib/utils";

export function Icon({
  name,
  className,
  label,
}: {
  name: string;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn("ux4g-icon-outlined", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      {name}
    </span>
  );
}
