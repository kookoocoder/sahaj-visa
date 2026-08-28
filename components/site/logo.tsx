import { cn } from "@/lib/utils";

export function SahajEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-11 shrink-0", className)}
      aria-hidden
    >
      <circle cx="24" cy="24" r="23" fill="#0B3D73" />
      <circle cx="24" cy="24" r="18" fill="none" stroke="#F4C430" strokeWidth="1.5" />
      <path
        d="M24 10.5v6M24 31.5v6M10.5 24h6M31.5 24h6"
        stroke="#F4C430"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="7" fill="#0B3D73" stroke="#fff" strokeWidth="1.25" />
      <circle cx="24" cy="24" r="2.2" fill="#F4C430" />
    </svg>
  );
}

export function EVisaMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-hidden>
      <span className="relative flex size-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border">
        <span className="absolute inset-x-2 top-2 h-1 rounded-full bg-[#FF9933]" />
        <span className="font-heading text-lg leading-none text-primary">e</span>
        <span className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-[#138808]" />
      </span>
      <span className="hidden text-left leading-tight sm:block">
        <span className="block text-sm font-bold tracking-tight text-primary">e-Visa</span>
        <span className="block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Prototype
        </span>
      </span>
    </div>
  );
}
