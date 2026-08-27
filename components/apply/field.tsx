import { createContext, useContext, useState, type ComponentProps, type ReactNode } from "react";
import { Copilot } from "@/components/apply/copilot";
import { cn } from "@/lib/utils";

export const SavePulseContext = createContext<string | null>(null);

export const controlClass =
  "min-h-12 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

function WhyAsk({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1">
      <button
        type="button"
        className="inline-flex min-h-8 items-center text-xs font-medium text-muted-foreground underline decoration-dotted underline-offset-4"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Why we ask this
      </button>
      {open ? <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p> : null}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  copilotField,
  why,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  copilotField?: string;
  why?: string;
  children: ReactNode;
}) {
  const pulsed = useContext(SavePulseContext);
  const justSaved = Boolean(htmlFor && pulsed === htmlFor);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="flex min-h-8 items-center gap-2 text-sm font-medium">
          {label}
          {justSaved ? (
            <span className="saved-pulse text-xs font-normal text-primary" aria-live="polite">
              Saved
            </span>
          ) : null}
        </label>
        {copilotField ? <Copilot field={copilotField} /> : null}
      </div>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
      {why ? <WhyAsk text={why} /> : null}
    </div>
  );
}

export function TextInput({
  id,
  error,
  className,
  ...props
}: ComponentProps<"input"> & { error?: string }) {
  return (
    <input
      id={id}
      className={cn(controlClass, className)}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  );
}

export function SelectInput({
  id,
  error,
  children,
  ...props
}: ComponentProps<"select"> & { error?: string }) {
  return (
    <select
      id={id}
      className={controlClass}
      aria-invalid={error ? true : undefined}
      {...props}
    >
      {children}
    </select>
  );
}

export function TextArea({
  id,
  error,
  ...props
}: ComponentProps<"textarea"> & { error?: string }) {
  return (
    <textarea
      id={id}
      className={cn(controlClass, "min-h-24 py-3")}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  );
}
