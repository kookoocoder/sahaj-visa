import { cn } from "@/lib/utils";

/** Jaali-inspired lattice mark — architectural, not heraldic. */
export function SahajEmblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("sahaj-emblem", className)} aria-hidden>
      <rect x="1" y="1" width="46" height="46" rx="8" fill="var(--ux4g-bg-primary, #eef3fa)" />
      <g fill="none" stroke="var(--ux4g-color-primary-600, #123a6e)" strokeWidth="1.1" strokeLinecap="round">
        <path d="M8 10c4 0 4 8 0 8s-4-8 0-8zm8 0c4 0 4 8 0 8s-4-8 0-8zm8 0c4 0 4 8 0 8s-4-8 0-8zm8 0c4 0 4 8 0 8s-4-8 0-8z" />
        <path d="M8 22c4 0 4 8 0 8s-4-8 0-8zm8 0c4 0 4 8 0 8s-4-8 0-8zm8 0c4 0 4 8 0 8s-4-8 0-8zm8 0c4 0 4 8 0 8s-4-8 0-8z" />
        <path d="M8 34c4 0 4 8 0 8s-4-8 0-8zm8 0c4 0 4 8 0 8s-4-8 0-8zm8 0c4 0 4 8 0 8s-4-8 0-8zm8 0c4 0 4 8 0 8s-4-8 0-8z" />
        <path d="M12 6v36M20 6v36M28 6v36M36 6v36" strokeOpacity="0.35" />
      </g>
      <path
        d="M28 14c3 0 3 6 0 6s-3-6 0-6zm0 12c3 0 3 6 0 6s-3-6 0-6z"
        fill="none"
        stroke="var(--ux4g-color-secondary-400, #e07b28)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
