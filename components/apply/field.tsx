import { createContext, useContext, useState, type ComponentProps, type ReactNode } from "react";
import { FieldHelp } from "@/components/apply/field-help";
import { FORMAT_SPECS, type InputFormatId } from "@/lib/input-format";
import { cn } from "@/lib/utils";

export const SavePulseContext = createContext<string | null>(null);

export const controlClass =
  "min-h-12 w-full rounded-md border border-input bg-card px-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

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
  helpField,
  why,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  helpField?: string;
  why?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const pulsed = useContext(SavePulseContext);
  const justSaved = Boolean(htmlFor && pulsed === htmlFor);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="flex min-h-8 items-center gap-2 text-sm font-medium">
          {label}
          {required ? (
            <span className="text-destructive" aria-hidden>
              *
            </span>
          ) : null}
          {justSaved ? (
            <span className="saved-pulse text-xs font-normal text-primary" aria-live="polite">
              Saved
            </span>
          ) : null}
        </label>
        {helpField ? <FieldHelp field={helpField} /> : null}
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
  format,
  onChange,
  maxLength,
  inputMode,
  autoCapitalize,
  spellCheck,
  placeholder,
  pattern,
  ...props
}: ComponentProps<"input"> & { error?: string; format?: InputFormatId }) {
  const spec = format ? FORMAT_SPECS[format] : undefined;
  return (
    <input
      {...props}
      id={id}
      className={cn(controlClass, className)}
      aria-invalid={error ? true : undefined}
      maxLength={maxLength ?? spec?.inputMaxLength ?? spec?.maxLength}
      inputMode={inputMode ?? spec?.inputMode}
      autoCapitalize={autoCapitalize ?? spec?.autoCapitalize}
      spellCheck={spellCheck ?? spec?.spellCheck}
      placeholder={placeholder ?? spec?.placeholder}
      pattern={pattern ?? spec?.htmlPattern}
      onChange={(e) => {
        if (spec) {
          const sanitized = spec.sanitize(e.target.value);
          if (sanitized !== e.target.value) e.target.value = sanitized;
        }
        onChange?.(e);
      }}
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
  format,
  onChange,
  maxLength,
  ...props
}: ComponentProps<"textarea"> & { error?: string; format?: InputFormatId }) {
  const spec = format ? FORMAT_SPECS[format] : undefined;
  return (
    <textarea
      {...props}
      id={id}
      className={cn(controlClass, "min-h-24 py-3")}
      aria-invalid={error ? true : undefined}
      maxLength={maxLength ?? spec?.maxLength}
      onChange={(e) => {
        if (spec) {
          const sanitized = spec.sanitize(e.target.value);
          if (sanitized !== e.target.value) e.target.value = sanitized;
        }
        onChange?.(e);
      }}
    />
  );
}
